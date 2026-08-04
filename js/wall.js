/* ═══════════════════════════════════════════════════════════════════════
   wall.js — VR Wall: mosaic 9 ô cảnh động (D-50, note.md §141)

   Trạng thái ĐẦU của popup. Mỗi ô là một KHU VỰC (D.GROUPS), không phải một
   điểm — bấm ô là mở Infinite Slider với đúng bộ điểm của khu vực đó.

   Component ĐỘC LẬP: không biết gì về slider, chỉ gọi ngược `onPick(group, tile)`.
   Style: css/wall.css
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;

  /* Ô tự đổi cảnh sau 4s (note.md §31 "3–5 giây"). Mỗi ô lệch pha một chút,
     nếu không cả 9 ô chớp cùng lúc trông như trang bị lỗi. */
  var SWAP_MS = 4000;
  var SWAP_STAGGER = 520;

  /* Số ảnh xếp chồng trong MỘT ô. Desktop 3, điện thoại 2 (D-58).
     9 ô × 3 ảnh = 27 file ~2 MB, và trên mobile chúng KHÔNG nằm chờ vô hại:
     vòng đổi cảnh sẽ lôi bằng hết đám `loading="lazy"` xuống trong 12 giây
     đầu, giữa lúc người dùng đang cuộn. Ô ở mobile lại nhỏ hơn hẳn nên "khu
     vực này có nhiều cảnh" đọc được với 2 ảnh cũng đủ. */
  function imgsPerTile() {
    return (window.matchMedia && window.matchMedia('(max-width: 599px)').matches) ? 2 : 3;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  /**
   * @param {HTMLElement} grid  .st-wall-grid rỗng
   * @param {Object} opts  { onPick(group, tileEl) }
   */
  function create(grid, opts) {
    opts = opts || {};
    var tiles = [];
    var timers = [];
    var running = false;

    /* Ảnh của một ô: `g.cover` ĐỨNG ĐẦU, rồi mới tới các key còn lại.
       Trước D-58 hàm build() lấy thẳng `g.keys.slice(0,3)` và bỏ quên hẳn
       trường `cover` — mà `cover` sinh ra chính là để tránh chuyện hai ô cạnh
       nhau mở đầu bằng cùng một tấm: nhóm `all` và nhóm `noibat` đều có
       'cong' ở đầu `keys`, nên ô hero và ô ngay dưới nó hiện y hệt nhau. Trên
       mobile hai ô đó nằm sát nhau theo chiều dọc nên nhìn ra ngay. */
    function coverFirst(g, n) {
      var out = g.cover ? [g.cover] : [];
      g.keys.forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); });
      return out.slice(0, n);
    }

    /* ── Dựng DOM ─────────────────────────────────────────────────────────
       Ảnh xếp chồng trong .st-wt-media, chỉ ảnh có .st-on là hiện. Tối đa 2–3
       ảnh/ô (xem imgsPerTile): đủ để thấy khu vực có nhiều cảnh, mà không biến
       9 ô thành 27 lớp. */
    function build() {
      var per = imgsPerTile();
      grid.innerHTML = D.GROUPS.map(function (g, gi) {
        var imgs = coverFirst(g, per).map(function (k, i) {
          var src = D.imgOf(k);
          if (!src) return '';
          /* `loading="lazy"` CHỈ cho ảnh thứ 2–3 (ảnh để đổi cảnh sau vài giây).
             Ảnh đầu của MỌI ô phải tải ngay: mosaic phủ trọn màn nên cả 9 ô đều
             nằm trong viewport từ frame đầu — lazy ở đây không tiết kiệm được gì
             mà lại làm ô hiện ra rỗng đúng lúc animation vào màn đang chạy, đọc
             thành một vệt xám như ảnh lỗi (D-55(g)). Trước đây điều kiện là
             `gi < 3`, tức 6 ô cuối đều dính. */
          return '<img class="st-wt-img' + (i === 0 ? ' st-on' : '') + '" src="' + esc(src) +
                 '" alt="" ' + (i === 0 ? '' : 'loading="lazy" ') + 'decoding="async">';
        }).join('');

        /* Nhóm chưa có tấm ảnh nào (D-59) — đánh dấu để css/wall.css đổi sang
           gradient TỐI. Gradient sáng mặc định của ô là chỗ giữ ảnh trong lúc
           tải, nó nằm DƯỚI `.st-wt-veil` nên vẫn đọc được chữ; nhưng khi nó là
           trạng thái CUỐI CÙNG thì nửa trên ô sáng nhợt, trông như ảnh tải
           hỏng chứ không ra "khu vực này chưa có ảnh". */
        return '<button type="button" class="st-wall-tile st-s-' + g.size +
               (imgs ? '' : ' st-noimg') + '"' +
               ' data-g="' + g.key + '" style="--gi:' + gi + '">' +
                 '<span class="st-wt-media">' + imgs + '</span>' +
                 '<span class="st-wt-veil" aria-hidden="true"></span>' +
                 '<span class="st-wt-body">' +
                   '<span class="st-wt-count"></span>' +
                   '<span class="st-wt-name"></span>' +
                   '<span class="st-wt-sub"></span>' +
                   '<span class="st-wt-cta">' + icon('i-vr') +
                     '<span class="st-wt-cta-t"></span>' + icon('i-arrow-right') +
                   '</span>' +
                 '</span>' +
               '</button>';
      }).join('');

      tiles = Array.prototype.slice.call(grid.querySelectorAll('.st-wall-tile'));
      applyLang();
    }

    /* Chữ tách khỏi build() để đổi ngôn ngữ không phải dựng lại ảnh (dựng lại
       sẽ làm ảnh nháy trắng một nhịp vì trình duyệt coi là <img> mới). */
    function applyLang() {
      tiles.forEach(function (t) {
        var g = D.group(t.getAttribute('data-g'));
        var name = I.lang === 'en' ? g.en : g.vi;
        var sub  = I.lang === 'en' ? g.subEn : g.subVi;
        t.querySelector('.st-wt-name').textContent  = name;
        t.querySelector('.st-wt-sub').textContent   = sub;
        t.querySelector('.st-wt-count').textContent = I.tn('wall.count', g.keys.length);
        t.querySelector('.st-wt-cta-t').textContent = I.t('wall.openGroup');
        t.setAttribute('aria-label', name + ' — ' + sub + '. ' +
                       I.tn('wall.count', g.keys.length) + '. ' + I.t('wall.openGroup') + '.');
      });
    }

    /* ── Đổi cảnh trong ô ─────────────────────────────────────────────── */
    function swap(tile) {
      var imgs = tile.querySelectorAll('.st-wt-img');
      if (imgs.length < 2) return;
      var cur = tile.querySelector('.st-wt-img.st-on') || imgs[0];
      var i = Array.prototype.indexOf.call(imgs, cur);
      cur.classList.remove('st-on');
      imgs[(i + 1) % imgs.length].classList.add('st-on');
    }

    function start() {
      stop();
      if (reduced()) return;          /* WCAG 2.2.2 — chuyển động tự động phải tắt được */
      running = true;
      tiles.forEach(function (t, i) {
        /* setTimeout lồng setInterval để mỗi ô lệch pha; dùng 1 interval chung
           rồi chia modulo sẽ ra nhịp máy móc, thấy rõ là "9 ô cùng một đồng hồ". */
        timers.push(setTimeout(function () {
          swap(t);
          timers.push(setInterval(function () {
            if (!document.hidden && !tile_paused(t)) swap(t);
          }, SWAP_MS));
        }, SWAP_STAGGER * i + SWAP_MS));
      });
    }

    function stop() {
      running = false;
      timers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
      timers = [];
    }

    /* Ô đang được rê chuột thì đừng đổi cảnh — người dùng đang nhìn đúng nó. */
    function tile_paused(t) { return t.matches(':hover') || t.matches(':focus-within'); }

    /* ── Parallax khi rê chuột ────────────────────────────────────────────
       MOCK: note.md §41 muốn "xoay thử panorama 10–20 độ". Prototype chỉ có
       ảnh phẳng nên dịch ảnh vài % ngược chiều con trỏ — đủ gợi cảm giác nhìn
       quanh. Bản thật: nhúng panorama nhẹ hoặc video quay từ 360.
       Ghi vào biến CSS chứ không set transform trực tiếp, để css/wall.css còn
       gộp được với scale khi hover. */
    function bindParallax(t) {
      t.addEventListener('pointermove', function (e) {
        if (reduced()) return;
        /* CHỈ chuột. Ngón tay cũng bắn `pointermove` khi chạm/quẹt, mà trên
           cảm ứng không có `pointerleave` đáng tin để trả ảnh về — ảnh sẽ
           kẹt lệch vài % sau mỗi lần chạm hụt. Mà "nhìn quanh panorama" vốn
           là cử chỉ của con trỏ, chạm không đọc ra nghĩa đó. */
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = t.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        t.style.setProperty('--px', (-x * 5).toFixed(2) + '%');
        t.style.setProperty('--py', (-y * 5).toFixed(2) + '%');
      });
      t.addEventListener('pointerleave', function () {
        t.style.setProperty('--px', '0%');
        t.style.setProperty('--py', '0%');
      });
    }

    function bind() {
      grid.addEventListener('click', function (e) {
        var t = e.target.closest('.st-wall-tile');
        if (!t || !opts.onPick) return;
        opts.onPick(D.group(t.getAttribute('data-g')), t);
      });
      tiles.forEach(bindParallax);
      document.addEventListener('visibilitychange', function () {
        /* interval vẫn chạy nhưng swap() bị chặn bởi document.hidden ở trên —
           không clear timer để khi quay lại tab nhịp không bị dồn. */
      });
    }

    build();
    bind();

    return {
      start: start,
      stop: stop,
      applyLang: applyLang,
      tiles: function () { return tiles; },
      isRunning: function () { return running; }
    };
  }

  ST.wall = { create: create, SWAP_MS: SWAP_MS };
})();
