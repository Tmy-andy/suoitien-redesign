/* ═══════════════════════════════════════════════════════════════════════
   carousel.js — 3D coverflow carousel (D-44)

   Component ĐỘC LẬP, không biết gì về popup: nhận một mảng item, gọi ngược ra
   để lấy HTML từng thẻ, rồi lo phần hình học 3D + vòng chạy + tương tác.
   js/popup.js là nơi ghép nó vào. Style: css/carousel.css.

   VÌ SAO tự viết thay vì dùng Swiper/Glide: RULE #3 cấm dependency ngoài, và
   thứ ta cần chỉ là ~200 dòng transform — thư viện sẽ nặng hơn cả phần còn
   lại của prototype.

   VÌ SAO transform tính bằng JS chứ không phải CSS thuần: mỗi thẻ cần
   translateX + translateZ + rotateY + scale suy ra từ KHOẢNG CÁCH VÒNG tới
   thẻ đang active. Khoảng cách đó đổi mỗi lần chuyển thẻ và phải đi đường
   ngắn nhất trên vòng (thẻ 11 → thẻ 0 là +1 chứ không phải −11), CSS không
   biểu diễn được. JS chỉ ghi 1 biến --st-o, còn transition do CSS lo.

   Từ D-55 JS ghi thêm --px/--py trên thẻ giữa (parallax theo con trỏ). Vẫn
   đúng nguyên tắc trên: JS đưa SỐ ĐO, CSS quyết định số đo đó thành hình gì.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  /* Số thẻ hiện MỖI BÊN thẻ giữa (mặc định; ghi đè bằng opts.visible).
     Xa hơn thì ẩn hẳn (display:none) — giữ trong DOM nhưng bỏ khỏi luồng vẽ
     để 12 thẻ không thành 12 lớp composite chạy transition cùng lúc.

     Popup đang dùng `visible: 2` → 5 thẻ trên màn (1 giữa + 2 preview mỗi
     bên · D-55). Con số đó đặt ở js/popup.js.

     Lưu ý: dưới 1280px css/responsive.css `display: none` bậc ±2, tức trên
     màn hẹp vẫn là 3 thẻ dù JS vẫn dựng 5. Cố ý — ẩn bằng CSS thì đổi
     breakpoint không phải đụng JS. */
  var VISIBLE_DEFAULT = 2;

  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * @param {HTMLElement} root  khung ngoài, đã có sẵn .st-cr-stage bên trong
   * @param {Object} opts
   *    items      {Array}    dữ liệu thô, chỉ truyền lại cho render()
   *    render     {Function} (item, index) → chuỗi HTML BÊN TRONG thẻ
   *    onPick     {Function} (item, index) khi người dùng chọn một thẻ
   *    onChange   {Function} (index) mỗi lần thẻ giữa đổi
   *    autoplayMs {Number}   0 = tắt
   *    visible    {Number}   số thẻ hiện mỗi bên thẻ giữa (mặc định 2)
   *    parallax   {Boolean}  false = tắt lệch ảnh theo con trỏ (mặc định bật)
   */
  function create(root, opts) {
    opts = opts || {};

    var items    = opts.items || [];
    var autoMs   = opts.autoplayMs || 0;
    var VISIBLE  = opts.visible == null ? VISIBLE_DEFAULT : opts.visible;
    var stage    = root.querySelector('.st-cr-stage');
    var dotsEl   = root.querySelector('.st-cr-dots');
    var liveEl   = root.querySelector('.st-cr-live');
    var cards    = [];
    var index    = 0;
    var timer    = null;
    var paused   = false;          /* hover / focus / tab ẩn */
    var destroyed = false;

    /* ── Dựng DOM ─────────────────────────────────────────────────────── */
    function build() {
      /* Thẻ là <button> trần, KHÔNG role="option": listbox ngụ ý "chọn xong
         rồi xác nhận", còn ở đây bấm là đi luôn. Vai trò carousel do
         aria-roledescription trên .st-cr-stage khai báo (xem index.html). */
      stage.innerHTML = items.map(function (it, i) {
        return '<button type="button" class="st-cr-card" data-i="' + i + '" tabindex="-1">' +
               opts.render(it, i) + '</button>';
      }).join('');
      cards = Array.prototype.slice.call(stage.querySelectorAll('.st-cr-card'));

      if (dotsEl) {
        dotsEl.innerHTML = items.map(function (it, i) {
          return '<button type="button" class="st-cr-dot" data-i="' + i + '" tabindex="-1"></button>';
        }).join('');
      }
    }

    /* ── Hình học ─────────────────────────────────────────────────────────
       offset(i) = khoảng cách CÓ DẤU tới thẻ giữa, đi đường ngắn nhất trên
       vòng tròn. Với n=12 và index=0 thì thẻ 11 ra −1 (bên trái) chứ không
       phải +11 — nhờ vậy vòng chạy liên tục, không "tua ngược" khi qua mốc. */
    function offset(i) {
      var n = items.length;
      var d = (i - index) % n;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      return d;
    }

    function layout() {
      cards.forEach(function (c, i) {
        var o = offset(i);
        var far = Math.abs(o) > VISIBLE;
        c.style.display = far ? 'none' : '';
        if (far) { c.removeAttribute('aria-current'); c.tabIndex = -1; return; }

        /* CSS đọc --st-o để tính transform (xem css/carousel.css).
           Truyền cả bản tuyệt đối để khỏi phải abs() trong calc(). */
        c.style.setProperty('--st-o', o);
        c.style.setProperty('--st-oa', Math.abs(o));
        /* Bản attribute của cùng con số: custom property KHÔNG chọn được bằng
           selector, mà responsive.css cần ẩn bậc ±2/±3 trên máy hẹp. */
        c.setAttribute('data-oa', Math.abs(o));
        c.style.zIndex = String(100 - Math.abs(o));
        c.classList.toggle('st-active', o === 0);
        if (o === 0) c.setAttribute('aria-current', 'true');
        else c.removeAttribute('aria-current');
        /* Chỉ thẻ giữa vào được bằng Tab; các thẻ khác đi bằng phím mũi tên
           (roving tabindex) — nếu không, Tab phải bấm 12 lần mới thoát. */
        c.tabIndex = o === 0 ? 0 : -1;
      });

      if (dotsEl) {
        Array.prototype.forEach.call(dotsEl.children, function (d, i) {
          d.classList.toggle('st-on', i === index);
        });
      }
    }

    function announce() {
      if (!liveEl) return;
      var name = cards[index] && cards[index].getAttribute('data-name');
      liveEl.textContent = (name || '') + ' — ' + (index + 1) + '/' + items.length;
    }

    /* ── Parallax trên thẻ GIỮA ───────────────────────────────────────────
       Cùng ý tưởng với ô wall của bản 2 (js/wall.js:bindParallax): ghi --px/--py
       theo vị trí con trỏ, để css/carousel.css gộp vào transform của ảnh.

       Khác wall ở chỗ nghe trên .st-cr-stage chứ không trên từng thẻ: thẻ rìa
       nghiêng tới 33° nên rect của chúng lệch hẳn so với hình người dùng thấy,
       bám theo sẽ ra parallax ngược chiều. Thẻ giữa thì rotateY = 0, rect
       khớp đúng những gì trên màn. */
    function parallax(e) {
      if (reduced() || dragging) return;
      var c = cards[index];
      if (!c || c.style.display === 'none') return;
      var r = c.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5;
      var y = (e.clientY - r.top) / r.height - .5;
      /* Con trỏ đang ở trên thẻ RÌA — đừng lái ảnh thẻ giữa theo nó. */
      if (Math.abs(x) > .5 || Math.abs(y) > .5) { clearParallax(); return; }
      c.style.setProperty('--px', (-x * 5).toFixed(2) + '%');
      c.style.setProperty('--py', (-y * 5).toFixed(2) + '%');
    }
    function clearParallax() {
      cards.forEach(function (c) {
        c.style.removeProperty('--px');
        c.style.removeProperty('--py');
      });
    }

    function go(i, opt) {
      var n = items.length;
      if (!n) return;
      index = ((i % n) + n) % n;
      /* Thẻ vừa rời khỏi giữa phải trả ảnh về đúng tâm, nếu không nó mang
         theo độ lệch parallax của lần hover cuối suốt vòng đời còn lại. */
      clearParallax();
      layout();
      announce();
      if (opts.onChange) opts.onChange(index, items[index]);
      if (opt && opt.user) restart();
    }

    /* ── Autoplay ─────────────────────────────────────────────────────────
       Bỏ hẳn khi người dùng bật "giảm chuyển động": carousel tự chạy là loại
       chuyển động mà WCAG 2.2.2 yêu cầu phải dừng được. Nút ‹ › và phím mũi
       tên vẫn hoạt động, chỉ là không tự trôi. */
    function tick() { if (!paused) go(index + 1); }

    function start() {
      stop();
      if (!autoMs || reduced() || destroyed) return;
      timer = setInterval(tick, autoMs);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { if (timer) { stop(); start(); } }

    /* ── Kéo / quẹt ───────────────────────────────────────────────────────
       Ngưỡng 44px vừa đủ để phân biệt "quẹt" với "bấm": dưới ngưỡng thì
       pointerup không nuốt click, thẻ vẫn mở được bằng 1 chạm.

       KHÔNG dùng setPointerCapture: khi con trỏ đang bị capture, Chrome bắn
       sự kiện `click` kèm theo vào CHÍNH phần tử capture chứ không vào thẻ
       nằm dưới ngón tay — e.target thành .st-cr-stage, closest('.st-cr-card')
       ra null và bấm thẻ không đi đâu cả. Thay vào đó nghe pointermove/up
       trên window: vẫn theo được con trỏ khi nó rời khỏi khung, mà không
       đụng đến đường đi của click. */
    var DRAG_MIN = 44;
    var dragX = 0, dragging = false, moved = false;

    function onDown(e) {
      if (e.button > 0) return;
      dragging = true; moved = false; dragX = e.clientX;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', endDrag);
    }
    function onMove(e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - dragX) > 8) moved = true;
    }
    function onUp(e) {
      if (!dragging) return;
      var dx = e.clientX - dragX;
      endDrag();
      if (Math.abs(dx) >= DRAG_MIN) go(index + (dx < 0 ? 1 : -1), { user: true });
    }
    function endDrag() {
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', endDrag);
    }

    /* ── Sự kiện ──────────────────────────────────────────────────────── */
    function bind() {
      stage.addEventListener('click', function (e) {
        var c = e.target.closest('.st-cr-card');
        if (!c) return;
        /* Vừa quẹt xong thì lần click kèm theo là rác, không tính là chọn. */
        if (moved) { moved = false; return; }
        var i = +c.getAttribute('data-i');
        /* YC: "click vào ảnh thì nhảy đến trang hình tương ứng" — bấm thẻ nào
           đi thẳng thẻ đó, kể cả thẻ bên rìa, không bắt phải đưa vào giữa. */
        if (opts.onPick) opts.onPick(items[i], i);
      });

      stage.addEventListener('pointerdown', onDown);

      if (opts.parallax !== false) {
        stage.addEventListener('pointermove', parallax);
        stage.addEventListener('pointerleave', clearParallax);
      }

      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, { user: true }); focusActive(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, { user: true }); focusActive(); }
        else if (e.key === 'Home') { e.preventDefault(); go(0, { user: true }); focusActive(); }
        else if (e.key === 'End') { e.preventDefault(); go(items.length - 1, { user: true }); focusActive(); }
      });

      /* Dừng khi con trỏ hoặc focus đang ở trong — người dùng đang đọc thẻ
         thì đừng kéo nó đi. */
      root.addEventListener('mouseenter', function () { paused = true; });
      root.addEventListener('mouseleave', function () { paused = false; });
      root.addEventListener('focusin',  function () { paused = true; });
      root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) paused = false;
      });

      if (dotsEl) {
        dotsEl.addEventListener('click', function (e) {
          var d = e.target.closest('.st-cr-dot');
          if (d) go(+d.getAttribute('data-i'), { user: true });
        });
      }

      Array.prototype.forEach.call(root.querySelectorAll('[data-cr-nav]'), function (b) {
        b.addEventListener('click', function () {
          go(index + (b.getAttribute('data-cr-nav') === 'next' ? 1 : -1), { user: true });
        });
      });

      /* Tab ẩn → dừng hẳn, không đốt CPU vẽ transform dưới nền. */
      document.addEventListener('visibilitychange', function () {
        paused = document.hidden;
      });
    }

    function focusActive() {
      var c = cards[index];
      if (c && c.style.display !== 'none') c.focus();
    }

    build();
    bind();
    layout();

    return {
      go: go,
      next: function () { go(index + 1, { user: true }); },
      prev: function () { go(index - 1, { user: true }); },
      index: function () { return index; },
      count: function () { return items.length; },
      start: start,
      stop: stop,
      /* Vẽ lại nội dung thẻ mà GIỮ nguyên vị trí vòng — dùng khi đổi ngôn ngữ. */
      rerender: function () {
        var keep = index;
        build();
        index = Math.min(keep, items.length - 1);
        layout();
      },
      destroy: function () { destroyed = true; stop(); }
    };
  }

  ST.carousel = { create: create, VISIBLE_DEFAULT: VISIBLE_DEFAULT };
})();
