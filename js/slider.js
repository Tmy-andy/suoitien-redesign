/* ═══════════════════════════════════════════════════════════════════════
   slider.js — Infinite Attraction Slider (D-50, note.md §70)

   Trạng thái THỨ HAI của popup. Một điểm chiếm gần trọn màn, hai bên hé
   lộ điểm trước và điểm sau (note.md §85). Nền là chính ảnh đang xem, blur +
   tối lại, phủ kín viewport — thoả cả hai câu "ảnh toàn màn hình" và "hai bên
   hé lộ".

   Bấm cảnh RÌA là ĐƯA NÓ VÀO GIỮA, không phải đi luôn; muốn đi phải bấm
   "Khám phá VR 360°". Cố ý: mỗi cảnh là một "cánh cổng trải nghiệm" có mô tả
   riêng, người dùng cần đọc trước khi quyết định — không phải lướt chọn nhanh.

   Style: css/slider.css
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;

  var VISIBLE = 1;           /* hé lộ 1 cảnh mỗi bên */
  var DRAG_MIN = 56;         /* ngưỡng phân biệt quẹt với bấm (cảnh to hơn thẻ → ngưỡng lớn hơn) */
  var AUTO_MS    = 6000;     /* note.md §93 "tự động chuyển cảnh chậm nếu khách chưa thao tác" */
  var AUTO_MS_SM = 2500;     /* điện thoại — khách chốt 2,5s (YC-17 · D-60) */

  /* Đúng điều kiện @media của bố cục thẻ trong `css/responsive2.css` (D-60).
     Hai chỗ này PHẢI khớp nhau: nhịp 2,5s là nhịp của cái thẻ nhỏ đọc lướt,
     không phải của cảnh gần trọn màn trên desktop. */
  var SMALL_MQ = '(max-width: 599px), (max-height: 460px) and (orientation: landscape)';
  function autoMs() {
    return (window.matchMedia && window.matchMedia(SMALL_MQ).matches) ? AUTO_MS_SM : AUTO_MS;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * @param {HTMLElement} root  #st-sld
   * @param {Object} opts  { onGo(dest), onBack() }
   */
  function create(root, opts) {
    opts = opts || {};

    var track   = root.querySelector('.st-sld-track');
    var chipsEl = root.querySelector('.st-sld-chips');
    var searchI = root.querySelector('.st-sld-search input');
    var emptyEl = root.querySelector('.st-sld-empty');
    var countEl = root.querySelector('.st-sld-counter');
    var liveEl  = root.querySelector('.st-sld-live');

    var groupKey = 'all';
    var query    = '';
    var keys     = [];          /* danh sách key SAU khi lọc nhóm + tìm kiếm */
    var index    = 0;
    var panels   = [];
    var timer    = null;
    var paused   = false;

    /* ── Lọc ──────────────────────────────────────────────────────────── */
    function computeKeys() {
      var base = D.group(groupKey).keys.slice();
      if (!query) return base;
      var q = D.deaccent(query);
      return base.filter(function (k) {
        var d = D.get(k);
        if (!d) return false;
        return D.deaccent(d.name).indexOf(q) > -1 ||
               D.deaccent(d.nameEn || '').indexOf(q) > -1;
      });
    }

    /* ── Dựng panel ───────────────────────────────────────────────────── */
    function build() {
      keys = computeKeys();
      emptyEl.hidden = keys.length > 0;
      track.hidden = keys.length === 0;

      track.innerHTML = keys.map(function (k, i) {
        var d = D.get(k);
        var img = D.imgOf(k);
        /* Điểm CHƯA CÓ ẢNH vẫn phải hiện được (D-59). Trước đây mọi nhóm đều
           gồm toàn điểm có ảnh nên chuyện này không xảy ra; từ khi danh mục
           bám theo site thật thì có nhóm ("Ẩm Thực", "Dịch vụ") chưa có tấm
           nào. `<img src="">` không phải là "không có ảnh" — trình duyệt coi
           đó là URL rỗng, tải lại chính trang hiện tại rồi vẽ icon ảnh hỏng.
           Phải KHÔNG dựng thẻ <img> nào cả và thay bằng một lớp gradient. */
        return '<article class="st-sld-panel' + (img ? '' : ' st-noimg') +
               '" data-i="' + i + '" data-key="' + k + '">' +
          (img
            ? '<img class="st-sld-img" src="' + esc(img) + '" alt="" ' +
                   (i === 0 ? '' : 'loading="lazy" ') + 'decoding="async">'
            : '<span class="st-sld-img st-sld-noimg" aria-hidden="true"></span>' +
              '<span class="st-sld-nophoto"></span>') +
          '<div class="st-sld-info">' +
            '<span class="st-sld-cat"></span>' +
            '<h2 class="st-sld-name"></h2>' +
            '<p class="st-sld-blurb"></p>' +
            '<button type="button" class="st-sld-go" data-go>' +
              icon('i-vr') + '<span class="st-sld-go-t"></span>' + icon('i-arrow-right') +
            '</button>' +
          '</div>' +
        '</article>';
      }).join('');

      panels = Array.prototype.slice.call(track.querySelectorAll('.st-sld-panel'));
      index = Math.min(index, Math.max(0, keys.length - 1));
      applyPanelText();
      layout();
    }

    /* Chữ tách khỏi build() vì đổi ngôn ngữ không cần dựng lại <img>. */
    function applyPanelText() {
      panels.forEach(function (p) {
        var d = D.get(p.getAttribute('data-key'));
        if (!d) return;
        p.querySelector('.st-sld-cat').textContent   = D.catLabel(d, I.lang);
        p.querySelector('.st-sld-name').textContent  = I.destName(d);
        p.querySelector('.st-sld-blurb').textContent = I.destBlurb(d);
        p.querySelector('.st-sld-go-t').textContent  = I.t('slider.go');
        var np = p.querySelector('.st-sld-nophoto');
        if (np) np.textContent = I.t('slider.noPhoto');
        p.querySelector('.st-sld-go').setAttribute('aria-label',
          I.t('slider.go') + ' — ' + I.destName(d));
      });
    }

    function buildChips() {
      chipsEl.innerHTML = D.GROUPS.map(function (g) {
        return '<button type="button" class="st-sld-chip" data-g="' + g.key + '">' +
               esc(I.lang === 'en' ? g.en : g.vi) + '</button>';
      }).join('');
      markChip();
    }
    function markChip() {
      Array.prototype.forEach.call(chipsEl.children, function (c) {
        var on = c.getAttribute('data-g') === groupKey;
        c.classList.toggle('st-on', on);
        if (on) c.setAttribute('aria-current', 'true');
        else c.removeAttribute('aria-current');
      });
      centerChip();
    }

    /* ── Dải chip: cuộn ngang ─────────────────────────────────────────────
       11 nhóm không vừa một dòng, nên `.st-sld-chips` là một vùng cuộn ngang.
       `overflow-x: auto` chỉ đủ cho NGÓN TAY quẹt và trackpad vuốt ngang.
       Chuột thường thì KHÔNG — đã đo trên Chromium:

           lăn dọc  deltaY 200  →  scrollLeft 0     (không nhúc nhích)
           lăn ngang deltaX 200 →  scrollLeft 200   ✓
           bấm giữ + kéo        →  không đổi
           gán bằng script      →  chạy ✓

       Tức là vùng cuộn không hỏng; hai đường vào của con chuột mới là thứ
       không tồn tại. Chrome không tự đổi `deltaY` thành cuộn ngang cho một
       container chỉ tràn ngang, và không trình duyệt nào có cử chỉ kéo-thả
       bằng chuột. Cả hai phải viết tay. */
    function chipsMax() { return chipsEl.scrollWidth - chipsEl.clientWidth; }

    /* Fade ở mép nào CÒN nội dung bị cắt — mép đầu dải mà cũng mờ thì nó đọc
       ra là lỗi tràn, không phải "còn nữa, cuộn tiếp đi". */
    function updFade() {
      var max = chipsMax();
      chipsEl.classList.toggle('st-fade-l', max > 0 && chipsEl.scrollLeft > 4);
      chipsEl.classList.toggle('st-fade-r', max > 0 && chipsEl.scrollLeft < max - 4);
    }

    /* Vào slider từ một ô wall thì nhóm đang xem có thể là chip thứ 9/11 —
       nằm ngoài màn. Không kéo nó vào giữa thì người dùng thấy một dải chip
       không có cái nào được chọn. `getBoundingClientRect` chứ không
       `offsetLeft`: `.st-sld-bot` có `position: relative` nên nó mới là
       offsetParent, và số đo sẽ lệch đúng bằng padding của thanh dưới. */
    function centerChip() {
      var c = chipsEl.querySelector('.st-sld-chip.st-on');
      if (!c || chipsMax() <= 0) { updFade(); return; }
      var cr = c.getBoundingClientRect(), wr = chipsEl.getBoundingClientRect();
      chipsEl.scrollLeft += (cr.left - wr.left) - (wr.width - cr.width) / 2;
      updFade();
    }

    /* ── Hình học ─────────────────────────────────────────────────────────
       Offset đi ĐƯỜNG NGẮN NHẤT trên vòng. Nhưng ở đây
       danh sách ngắn (có nhóm chỉ 1–3 điểm) nên phải chặn: n < 3 thì không
       vòng được, panel prev và next sẽ trỏ vào cùng một cái. */
    function offset(i) {
      var n = keys.length;
      if (n < 3) return i - index;          /* ít quá thì xếp thẳng, không vòng */
      var dd = (i - index) % n;
      if (dd > n / 2) dd -= n;
      if (dd < -n / 2) dd += n;
      return dd;
    }

    function layout() {
      panels.forEach(function (p, i) {
        var o = offset(i);
        var far = Math.abs(o) > VISIBLE;
        p.style.display = far ? 'none' : '';
        if (far) { p.removeAttribute('aria-current'); return; }
        p.style.setProperty('--o', o);
        p.style.setProperty('--oa', Math.abs(o));
        p.style.zIndex = String(50 - Math.abs(o));
        p.classList.toggle('st-active', o === 0);
        if (o === 0) p.setAttribute('aria-current', 'true');
        else p.removeAttribute('aria-current');
        /* Chỉ nút "Khám phá" của cảnh giữa vào được bằng Tab */
        var go = p.querySelector('.st-sld-go');
        if (go) go.tabIndex = o === 0 ? 0 : -1;
      });

      /* ⚫ Ở đây từng có đoạn ghi `background-image` cho `.st-sld-bg` (ảnh đang
         xem, blur + tối, phủ kín viewport). Gỡ cùng phần tử đó ở D-61 — nền
         của slider giờ là nền trắng chung của popup. */
      var d = keys.length ? D.get(keys[index]) : null;
      if (countEl) countEl.textContent = keys.length
        ? I.t('slider.counter', { i: index + 1, n: keys.length }) : '';
      if (liveEl && d) liveEl.textContent = I.destName(d) + ' — ' + (index + 1) + '/' + keys.length;
    }

    function go(i, user) {
      var n = keys.length;
      if (!n) return;
      index = ((i % n) + n) % n;
      layout();
      if (user) restart();
    }

    /* ── Tự chạy ──────────────────────────────────────────────────────────
       Chuỗi `setTimeout` chứ không `setInterval`: nhịp phụ thuộc khổ màn
       (2,5s / 6s) mà `setInterval` thì chốt cứng nhịp lúc gọi — xoay ngang
       cái máy là nhịp sai cho tới lần `restart()` kế tiếp. */
    function tick() {
      /* `dragging` cũng là một kiểu "đang thao tác": ngón tay đặt trên cảnh mà
         nó tự trượt đi là lỗi thấy ngay ở nhịp 2,5s. Trên desktop `:hover` đã
         lo, cảm ứng thì không có hover để lo. */
      if (!paused && !dragging && !document.hidden) go(index + 1);
      timer = setTimeout(tick, autoMs());
    }
    function start() {
      stop();
      if (reduced() || keys.length < 2) return;
      timer = setTimeout(tick, autoMs());
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function restart() { if (timer) { stop(); start(); } }

    /* ── Kéo / quẹt ───────────────────────────────────────────────────────
       KHÔNG dùng setPointerCapture — Chrome sẽ bắn `click` vào phần tử capture
       chứ không vào panel dưới ngón tay — đã vấp đúng bẫy này. */
    var dragX = 0, dragging = false, moved = false;
    function onDown(e) {
      if (e.button > 0) return;
      dragging = true; moved = false; dragX = e.clientX;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', endDrag);
    }
    function onMove(e) {
      if (dragging && Math.abs(e.clientX - dragX) > 10) moved = true;
    }
    function onUp(e) {
      if (!dragging) return;
      var dx = e.clientX - dragX;
      endDrag();
      if (Math.abs(dx) >= DRAG_MIN) go(index + (dx < 0 ? 1 : -1), true);
    }
    function endDrag() {
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', endDrag);
    }

    /* Con lăn chuột (note.md §91). Ngưỡng + khoá 420ms vì trackpad bắn hàng
       chục event mỗi lần vuốt — không khoá thì lướt một cái nhảy 8 cảnh. */
    var wheelLock = 0;
    function onWheel(e) {
      var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 12) return;
      var now = Date.now();
      if (now < wheelLock) return;
      wheelLock = now + 420;
      go(index + (d > 0 ? 1 : -1), true);
    }

    function bind() {
      track.addEventListener('click', function (e) {
        var p = e.target.closest('.st-sld-panel');
        if (!p) return;
        if (moved) { moved = false; return; }

        var i = +p.getAttribute('data-i');
        /* Bấm cảnh RÌA → đưa vào giữa. Bấm cảnh giữa (hoặc nút của nó) → đi VR.
           Khác index.html cố ý — xem chú thích đầu file. */
        if (i !== index) { go(i, true); return; }
        if (e.target.closest('[data-go]') || p.classList.contains('st-active')) {
          var d = D.get(p.getAttribute('data-key'));
          if (d && opts.onGo) { stop(); opts.onGo(d, p); }
        }
      });

      track.addEventListener('pointerdown', onDown);
      track.addEventListener('wheel', onWheel, { passive: true });

      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
        else if (e.key === 'Home') { e.preventDefault(); go(0, true); }
        else if (e.key === 'End') { e.preventDefault(); go(keys.length - 1, true); }
      });

      /* ── Dừng khi người dùng đang xem/thao tác (WCAG 2.2.2) ──────────────
         Hai cái bẫy dưới đây chỉ lộ ra trên CẢM ỨNG, và ở nhịp 6s thì gần như
         không ai để ý; ở nhịp 2,5s (D-60) thì nó là "slideshow chết sau cú
         chạm đầu tiên":

           · Chrome Android bắn `mouseenter` giả sau mỗi lần chạm, và không có
             `mouseleave` nào cho tới khi chạm ra chỗ khác → `paused` kẹt true.
           · Chạm vào thẻ làm nút bên trong nhận focus → `focusin`, cũng kẹt.

         Nên: hover chỉ tính trên máy CÓ hover thật, còn focus chỉ tính khi nó
         đến từ BÀN PHÍM (`:focus-visible`) — đúng đối tượng mà WCAG 2.2.2 nói
         tới, người đang tab qua từng nút. */
      var canHover = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
      function kbdFocus(el) {
        try { return el.matches(':focus-visible'); }
        catch (e) { return true; }        /* trình duyệt cũ: giữ nguyên nết cũ */
      }

      root.addEventListener('mouseenter', function () { if (canHover) paused = true; });
      root.addEventListener('mouseleave', function () { paused = false; });
      root.addEventListener('focusin', function (e) {
        if (kbdFocus(e.target)) paused = true;
      });
      root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) paused = false;
      });

      Array.prototype.forEach.call(root.querySelectorAll('[data-sld-nav]'), function (b) {
        b.addEventListener('click', function () {
          go(index + (b.getAttribute('data-sld-nav') === 'next' ? 1 : -1), true);
        });
      });

      /* ── Dải chip ─────────────────────────────────────────────────────── */
      chipsEl.addEventListener('click', function (e) {
        var c = e.target.closest('.st-sld-chip');
        if (!c) return;
        /* Vừa KÉO dải chip chứ không bấm — trình duyệt vẫn bắn `click` vào cái
           chip dưới con trỏ lúc thả tay. Nuốt nó đi, nếu không kéo dải chip
           một cái là đổi luôn nhóm đang xem. */
        if (chipMoved) { chipMoved = false; return; }
        setGroup(c.getAttribute('data-g'));
      });

      chipsEl.addEventListener('wheel', function (e) {
        var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (!d || chipsMax() <= 0) return;
        var next = Math.max(0, Math.min(chipsMax(), chipsEl.scrollLeft + d));
        if (next === chipsEl.scrollLeft) return;   /* kịch biên → để cú lăn đi tiếp */
        chipsEl.scrollLeft = next;
        /* Chặn vì popup nằm trong <iframe> phủ kín trang cha: không chặn thì
           cú lăn nổi lên trang cha và NÓ cuộn phía sau popup. */
        e.preventDefault();
      }, { passive: false });

      var chipX = 0, chipSL = 0, chipDrag = false, chipMoved = false;
      chipsEl.addEventListener('pointerdown', function (e) {
        /* Cảm ứng đã có cuộn native mượt hơn hẳn (có quán tính) — đừng giành. */
        if (e.pointerType === 'touch' || e.button > 0 || chipsMax() <= 0) return;
        chipDrag = true; chipMoved = false;
        chipX = e.clientX; chipSL = chipsEl.scrollLeft;
        chipsEl.classList.add('st-dragging');
        window.addEventListener('pointermove', onChipMove);
        window.addEventListener('pointerup', endChipDrag);
        window.addEventListener('pointercancel', endChipDrag);
      });
      function onChipMove(e) {
        if (!chipDrag) return;
        var d = e.clientX - chipX;
        if (Math.abs(d) > 4) chipMoved = true;
        chipsEl.scrollLeft = chipSL - d;
      }
      function endChipDrag() {
        chipDrag = false;
        chipsEl.classList.remove('st-dragging');
        window.removeEventListener('pointermove', onChipMove);
        window.removeEventListener('pointerup', endChipDrag);
        window.removeEventListener('pointercancel', endChipDrag);
      }

      chipsEl.addEventListener('scroll', updFade, { passive: true });
      window.addEventListener('resize', updFade);

      if (searchI) {
        searchI.addEventListener('input', function () {
          query = searchI.value.trim();
          index = 0;
          build();
          root.classList.toggle('st-searching', !!query);
          restart();
        });
      }
      var clearBtn = root.querySelector('.st-sld-clear');
      if (clearBtn) clearBtn.addEventListener('click', function () {
        searchI.value = ''; query = ''; index = 0; build();
        root.classList.remove('st-searching');
        searchI.focus();
      });

      var backBtn = root.querySelector('.st-sld-back');
      if (backBtn) backBtn.addEventListener('click', function () {
        if (opts.onBack) opts.onBack();
      });
    }

    function setGroup(key, startAt) {
      groupKey = key;
      index = startAt || 0;
      build();
      markChip();
      restart();
    }

    buildChips();
    build();
    bind();

    return {
      setGroup: setGroup,
      go: go,
      index: function () { return index; },
      count: function () { return keys.length; },
      group: function () { return groupKey; },
      focusGo: function () {
        var g = track.querySelector('.st-sld-panel.st-active .st-sld-go');
        if (g) g.focus();
      },
      start: start,
      stop: stop,
      applyLang: function () { buildChips(); applyPanelText(); layout(); },
      /* Xoá ô tìm kiếm khi quay về wall — mở lại slider mà còn dính query cũ
         thì người dùng tưởng nhóm đó chỉ có 1 điểm. */
      resetSearch: function () {
        if (searchI) searchI.value = '';
        query = '';
        root.classList.remove('st-searching');
      }
    };
  }

  ST.slider = { create: create, AUTO_MS: AUTO_MS, AUTO_MS_SM: AUTO_MS_SM, autoMs: autoMs };
})();
