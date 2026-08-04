/* ═══════════════════════════════════════════════════════════════════════
   map2d.js — Bản đồ 2D + pin điểm đến (D-51)

   Mở được từ cả hai trạng thái của popup. Nhận một danh sách key, chỉ
   vẽ pin của những điểm đó — nên "Xem khu vực này trên bản đồ" và "Xem tất
   cả" là cùng một hàm, khác mỗi tham số.

   Ảnh: bản đồ chính thức của công viên (D.MAP). Kiểu pin bám theo overlay
   "Chỉ đường" đang chạy trên trip360 (ảnh khách gửi): viên tròn màu, số hiệu
   ở giữa, viền trắng.

   ⚠️ RÀNG BUỘC "KHÔNG LỘ MẢNG TRỐNG": tỉ lệ zoom nhỏ nhất = tỉ lệ COVER
   (không phải `contain`). Bản đồ luôn phủ kín khung, người dùng kéo/zoom để
   xem phần khuất chứ không bao giờ thấy nền trơ ra hai bên. Xem `fit()`.

   Style: css/map2d.css
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;

  var MAX_ZOOM = 4.5;        /* so với tỉ lệ cover */
  var WHEEL_K  = 0.0016;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /**
   * @param {HTMLElement} root  #st-map
   * @param {Object} opts  { onGo(dest), onClose() }
   */
  function create(root, opts) {
    opts = opts || {};

    var view    = root.querySelector('.st-map-view');
    var canvas  = root.querySelector('.st-map-canvas');
    var img     = root.querySelector('.st-map-img');
    var pinsEl  = root.querySelector('.st-map-pins');
    var titleEl = root.querySelector('.st-map-title');
    var countEl = root.querySelector('.st-map-count');
    var cardEl  = root.querySelector('.st-map-card');

    var keys = [];
    var k = 1, minK = 1, x = 0, y = 0;   /* transform hiện tại */
    var opened = false;
    var selected = null;

    /* ── Hai tỉ lệ mốc ────────────────────────────────────────────────────
       cover   = max(vw/iw, vh/ih) — ảnh phủ kín khung, mép ảnh nằm ngoài.
       contain = min(vw/iw, vh/ih) — thấy trọn bản đồ, có viền quanh.

       MẶC ĐỊNH mở ở `cover` (không lộ mảng trống), nhưng ZOOM TỐI THIỂU là
       `contain` để người dùng vẫn xem được toàn công viên khi cần — quan
       trọng trên máy dọc, nơi bản đồ 2:1 nằm trong khung 0.46 và `cover`
       làm nó phóng gấp 4 lần.

       Zoom dưới `cover` KHÔNG lộ mảng trống vì ảnh đã được flatten lên đúng
       nền `#0f172a` của khung xem — phần "ngoài công viên" của ảnh và nền
       của khung là cùng một màu, không có đường nối. */
    function coverScale() {
      var r = view.getBoundingClientRect();
      if (!r.width || !r.height) return 1;
      return Math.max(r.width / D.MAP.w, r.height / D.MAP.h);
    }
    function containScale() {
      var r = view.getBoundingClientRect();
      if (!r.width || !r.height) return 1;
      return Math.min(r.width / D.MAP.w, r.height / D.MAP.h);
    }

    /* Kéo tới đâu thì dừng: mép ảnh phải luôn nằm ngoài (hoặc trùng) mép khung. */
    function clampPan() {
      var r = view.getBoundingClientRect();
      var w = D.MAP.w * k, h = D.MAP.h * k;
      var maxX = Math.max(0, (w - r.width) / 2);
      var maxY = Math.max(0, (h - r.height) / 2);
      x = clamp(x, -maxX, maxX);
      y = clamp(y, -maxY, maxY);
    }

    function apply() {
      clampPan();
      canvas.style.transform = 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + k + ')';
      /* Pin nằm TRONG lớp bị scale (để bám đúng toạ độ) nhưng phải giữ nguyên
         cỡ chữ → tự thu ngược lại bằng --k. */
      canvas.style.setProperty('--k', k);

      /* Cỡ pin.
         `scale(1/k)` một mình giữ pin đúng 38px trên màn ở MỌI mức zoom — nghe
         thì đúng, nhưng khi bản đồ thu còn 390px (máy dọc, xem toàn cảnh) thì
         mỗi pin chiếm 10% bề ngang và 20 pin chồng lên nhau thành một đống.
         Nên cho pin co theo BỀ NGANG BẢN ĐỒ ĐANG HIỂN THỊ: đủ rộng thì pin cỡ
         thiết kế, hẹp thì nhỏ lại, chặn dưới 0.45 để số hiệu còn đọc được. */
      var shown = D.MAP.w * k;
      canvas.style.setProperty('--pin', clamp(shown / 1300, 0.45, 1).toFixed(3));
      /* "Đã rời khung nhìn mặc định" — dùng để hiện nút "Toàn cảnh" và giấu
         dòng gợi ý. So với mốc MỞ RA, không phải minK. */
      var s = startScale();
      root.classList.toggle('st-zoomed', Math.abs(k - s) > s * 0.02);
    }

    /* Mức zoom MỞ RA = `cover`: bản đồ phủ kín khung, không viền, không mảng
       trống. Đó là yêu cầu.

       Nhưng ZOOM TỐI THIỂU vẫn là `contain` — trên máy dọc, bản đồ 2:1 trong
       khung 0.46 khiến cover phóng gấp ~4 lần và người dùng chỉ thấy 23% bề
       ngang. Nút "Toàn cảnh" (luôn hiện) đưa về contain để xem trọn công viên,
       và ở mức đó cũng KHÔNG lộ mảng trống: ảnh đã flatten lên đúng nền
       `#0f172a` của khung xem, phần ngoài công viên trùng màu nền khung. */
    function startScale() { return coverScale(); }

    /** Về khung nhìn mặc định, canh giữa. */
    function fit() {
      minK = containScale();
      k = startScale();
      x = 0; y = 0;
      apply();
    }

    /** Thu về đúng mức thấy trọn bản đồ. */
    function fitAll() {
      minK = containScale();
      k = minK;
      x = 0; y = 0;
      apply();
    }

    function zoomBy(f, cx, cy) {
      var r = view.getBoundingClientRect();
      var nk = clamp(k * f, minK, coverScale() * MAX_ZOOM);
      if (nk === k) return;
      /* Giữ điểm dưới con trỏ đứng yên: dịch tâm theo tỉ lệ zoom đổi. */
      if (cx != null) {
        var ox = cx - r.left - r.width / 2;
        var oy = cy - r.top - r.height / 2;
        x = ox - (ox - x) * (nk / k);
        y = oy - (oy - y) * (nk / k);
      }
      k = nk;
      apply();
    }

    /* ── Pin ──────────────────────────────────────────────────────────── */
    function renderPins() {
      pinsEl.innerHTML = keys.map(function (key) {
        var d = D.get(key);
        if (!d || d.no == null) return '';       /* điểm chưa có toạ độ → bỏ qua */
        return '<button type="button" class="st-map-pin st-c-' + (d.cat || 'util') + '"' +
               ' data-key="' + key + '" style="--px:' + d.x + '%;--py:' + d.y + '%"' +
               ' aria-label="' + esc(I.destName(d) + ' — ' + I.t('map.pinHint')) + '">' +
               '<span class="st-map-no">' + esc(d.no) + '</span></button>';
      }).join('');

      var n = pinsEl.querySelectorAll('.st-map-pin').length;
      if (countEl) countEl.textContent = I.tn('map.count', n);
    }

    /* Thẻ nhỏ khi bấm 1 pin. Không dùng tooltip hover: trên cảm ứng không có
       hover, mà bản đồ là thứ người ta chạm nhiều nhất. */
    function showCard(key, pinEl) {
      var d = D.get(key);
      if (!d) return;
      selected = key;
      Array.prototype.forEach.call(pinsEl.children, function (p) {
        p.classList.toggle('st-on', p.getAttribute('data-key') === key);
      });

      cardEl.innerHTML =
        (D.imgOf(key) ? '<img class="st-map-card-img" src="' + esc(D.imgOf(key)) + '" alt="">' : '') +
        '<div class="st-map-card-body">' +
          '<span class="st-map-card-no">' + esc(d.no) + '</span>' +
          '<span class="st-map-card-cat">' + esc(D.catLabel(d, I.lang)) + '</span>' +
          '<h3>' + esc(I.destName(d)) + '</h3>' +
          '<p>' + esc(I.destBlurb(d)) + '</p>' +
          '<button type="button" class="st-map-go" data-go>' +
            icon('i-vr') + '<span>' + esc(I.t('map.go')) + '</span>' + icon('i-arrow-right') +
          '</button>' +
        '</div>' +
        '<button type="button" class="st-map-card-x" data-card-close aria-label="' +
          esc(I.t('close')) + '">' + icon('i-close') + '</button>';
      cardEl.hidden = false;
      /* Trên mobile thẻ là bottom sheet dính đáy, đè đúng chỗ cụm nút zoom.
         CSS không hỏi được "thẻ có đang mở không" nên đánh dấu ở đây.

         Và phải đo CHIỀU CAO THẬT chứ không hằng số: thẻ cao bao nhiêu là do
         `blurb` dài mấy dòng và tên có xuống dòng hay không — đặt đại 152px
         thì đúng cho điểm này, hụt 13px cho điểm kia và nút − chui xuống dưới
         thẻ. css/responsive2.css đọc `--st-card-h`. */
      root.classList.add('st-card');
      root.style.setProperty('--st-card-h', cardEl.offsetHeight + 'px');

      /* Kéo pin vào giữa khung nếu nó đang nằm khuất sau thẻ */
      var r = view.getBoundingClientRect();
      var pr = pinEl.getBoundingClientRect();
      var cy = pr.top + pr.height / 2 - (r.top + r.height / 2);
      if (Math.abs(cy) > r.height * 0.28) { y -= cy * 0.6; apply(); }
    }

    function hideCard() {
      cardEl.hidden = true;
      root.classList.remove('st-card');
      selected = null;
      Array.prototype.forEach.call(pinsEl.children, function (p) { p.classList.remove('st-on'); });
    }

    /* ── Kéo bản đồ ───────────────────────────────────────────────────── */
    var dragging = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0;

    function onDown(e) {
      if (e.button > 0) return;
      dragging = true; moved = false;
      sx = e.clientX; sy = e.clientY; ox = x; oy = y;
      view.classList.add('st-grabbing');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', endDrag);
    }
    function onMove(e) {
      if (!dragging) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      x = ox + dx; y = oy + dy;
      apply();
    }
    function onUp() { endDrag(); }
    function endDrag() {
      dragging = false;
      view.classList.remove('st-grabbing');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', endDrag);
    }

    function bind() {
      view.addEventListener('pointerdown', onDown);
      view.addEventListener('wheel', function (e) {
        e.preventDefault();
        zoomBy(Math.exp(-e.deltaY * WHEEL_K), e.clientX, e.clientY);
      }, { passive: false });

      view.addEventListener('click', function (e) {
        var pin = e.target.closest('.st-map-pin');
        if (moved) { moved = false; return; }        /* vừa kéo xong, không tính là bấm */
        if (pin) { showCard(pin.getAttribute('data-key'), pin); return; }
        hideCard();
      });

      cardEl.addEventListener('click', function (e) {
        if (e.target.closest('[data-card-close]')) { hideCard(); return; }
        if (e.target.closest('[data-go]') && selected) {
          var d = D.get(selected);
          if (d && opts.onGo) opts.onGo(d);
        }
      });

      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-map-act]');
        if (!b) return;
        var act = b.getAttribute('data-map-act');
        if (act === 'in')    zoomBy(1.4);
        else if (act === 'out')  zoomBy(1 / 1.4);
        /* Bấm lần 1 → thấy trọn bản đồ. Đang ở đó rồi thì bấm lần 2 quay về
           khung nhìn phủ kín, để nút không thành ngõ cụt. */
        else if (act === 'fit') {
          hideCard();
          if (Math.abs(k - containScale()) < containScale() * 0.02) fit();
          else fitAll();
        }
        else if (act === 'close') close();
      });

      window.addEventListener('resize', function () {
        if (!opened) return;
        /* Đổi cỡ khung thì tỉ lệ cover đổi theo — giữ nguyên mức zoom tương
           đối của người dùng thay vì giật về toàn cảnh. */
        var rel = k / minK;
        minK = coverScale();
        k = clamp(minK * rel, minK, minK * MAX_ZOOM);
        apply();
      }, { passive: true });
    }

    /* ── Vòng đời ─────────────────────────────────────────────────────── */
    var offEsc = null, releaseTrap = null;

    /**
     * @param {string[]} list  key các điểm cần hiện pin
     * @param {string}   label tên khu vực đang lọc ('' = tất cả)
     */
    function open(list, label) {
      keys = (list && list.length) ? list.slice() : Object.keys(D.MAP_META);
      titleEl.textContent = label || I.t('map.titleAll');
      renderPins();
      hideCard();

      root.hidden = false;
      root.removeAttribute('aria-hidden');
      opened = true;
      requestAnimationFrame(function () {
        root.classList.add('st-open');
        fit();
        releaseTrap = ST.a11y.trap(root);
        offEsc = ST.a11y.onEsc(close);
        var b = root.querySelector('[data-map-act="close"]');
        if (b) b.focus();
      });
      ST.track && ST.track('map_open', { n: keys.length, area: label || 'all' });
    }

    function close() {
      if (!opened) return;
      opened = false;
      root.classList.remove('st-open');
      if (releaseTrap) { releaseTrap(); releaseTrap = null; }
      if (offEsc) { offEsc(); offEsc = null; }
      setTimeout(function () {
        root.hidden = true;
        root.setAttribute('aria-hidden', 'true');
      }, 260);
      if (opts.onClose) opts.onClose();
    }

    img.src = D.MAP.src;
    img.setAttribute('width', D.MAP.w);
    img.setAttribute('height', D.MAP.h);
    canvas.style.width = D.MAP.w + 'px';
    canvas.style.height = D.MAP.h + 'px';
    bind();

    return {
      open: open,
      close: close,
      isOpen: function () { return opened; },
      applyLang: function () {
        if (!opened) return;
        renderPins();
        if (selected) hideCard();
      }
    };
  }

  ST.map2d = { create: create };
})();
