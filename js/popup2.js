/* ═══════════════════════════════════════════════════════════════════════
   popup2.js — bootstrap + máy trạng thái của index2.html (D-50)

   Luồng: VR WALL (tổng quan) → INFINITE SLIDER (khám phá) → VR 360 (chi tiết)
   note.md §223.

   Chỉ có HAI trạng thái, nên không dựng router hay state machine tổng quát —
   một biến `state` và hai hàm chuyển là đủ. Dùng chung `js/bridge.js` với
   index.html, nên trang cha KHÔNG phải viết thêm gì để đổi qua bản này.

   Nạp CUỐI CÙNG.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n, B = ST.bridge;
  var root, wallEl, sldEl, gridEl;
  var wall = null, slider = null, map = null;
  var state = 'wall';                 /* 'wall' | 'slider' */
  var closing = false;
  var openedAt = 0;
  var releaseTrap = null, offEsc = null;

  var qs = {};
  (function parse() {
    var s = location.search.replace(/^\?/, '');
    if (!s) return;
    s.split('&').forEach(function (p) {
      var kv = p.split('=');
      qs[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  })();

  ST.DEBUG = qs.debug === '1';

  /* MOCK: bản thật nối vào VR360Track.event(), hoặc để trang cha ghi từ
     postMessage `st:navigate` — xem docs/05-flows.md §5.5 */
  ST.track = function (name, payload) {
    if (ST.DEBUG) console.log('[track]', name, payload || {});
  };

  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ══ WALL → SLIDER ════════════════════════════════════════════════════
     "Ô được chọn mở rộng toàn màn hình" (note.md §159). Làm bằng FLIP: chụp
     rect của ô, dựng một lớp ma phủ kín màn mang đúng ảnh đó, rồi cho nó chạy
     NGƯỢC từ vị trí ô về toàn màn. Rẻ hơn animate chính cái ô (không phải
     nhấc nó ra khỏi grid) và không đụng tới layout của wall. */
  function gateOpen(group, tile) {
    if (reduced() || !tile || !document.body.animate) return 0;

    var img = tile.querySelector('.st-wt-img.st-on') || tile.querySelector('.st-wt-img');
    if (!img) return 0;

    var r = tile.getBoundingClientRect();
    var ghost = document.createElement('div');
    ghost.className = 'st-p2-gate';
    ghost.style.backgroundImage = 'url("' + img.getAttribute('src') + '")';
    root.appendChild(ghost);

    /* ghost đã ở vị trí cuối (inset:0) → invert về vị trí ô rồi play về identity */
    var sx = r.width / window.innerWidth;
    var sy = r.height / window.innerHeight;
    var dx = r.left + r.width / 2 - window.innerWidth / 2;
    var dy = r.top + r.height / 2 - window.innerHeight / 2;

    var a = ghost.animate([
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')',
        borderRadius: '20px', opacity: 1 },
      { transform: 'none', borderRadius: '0px', opacity: 0 }
    ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });

    a.finished.then(function () { ghost.remove(); }, function () { ghost.remove(); });
    return 620;
  }

  function toSlider(group, tile) {
    if (state === 'slider') return;
    state = 'slider';

    var wait = gateOpen(group, tile);
    ST.track('wall_group_open', { group: group.key, count: group.keys.length });

    wall.stop();
    root.classList.add('st-state-slider');
    wallEl.setAttribute('aria-hidden', 'true');
    sldEl.removeAttribute('aria-hidden');
    sldEl.hidden = false;

    slider.setGroup(group.key);
    slider.start();

    /* Đổi bẫy Tab sang vùng đang hiện — nếu không, Tab vẫn chạy vòng trong 9 ô
       của wall mà mắt thì đang nhìn slider. */
    rearm(sldEl);
    setTimeout(function () { slider.focusGo(); }, Math.max(wait - 120, 60));
  }

  function toWall() {
    if (state === 'wall') return;
    state = 'wall';

    slider.stop();
    slider.resetSearch();
    root.classList.remove('st-state-slider');
    sldEl.setAttribute('aria-hidden', 'true');
    sldEl.hidden = true;
    wallEl.removeAttribute('aria-hidden');
    wall.start();

    rearm(wallEl);
    var t = wallEl.querySelector('.st-wall-tile');
    if (t) t.focus();
    ST.track('wall_back', {});
  }

  /* ══ ĐI VR 360 ════════════════════════════════════════════════════════ */
  function goVR(dest, panelEl) {
    if (closing) return;
    if (panelEl) panelEl.classList.add('st-going');
    ST.track('slider_go', { key: dest.key, dwellMs: Date.now() - openedAt });
    B.navigate(dest);
    close('navigate');
  }

  /* ══ Bản đồ 2D (D-51) ════════════════════════════════════════════════
     "all" → toàn bộ 20 điểm có toạ độ. "area" → đúng bộ đang xem trong
     slider (kể cả khi đang lọc bằng chip). Ở wall thì chưa chọn khu vực nào
     nên "area" tự rơi về "all". */
  function openMap(scope) {
    var keys, label;
    if (scope === 'area' && state === 'slider') {
      var g = D.group(slider.group());
      keys = g.keys;
      label = I.lang === 'en' ? g.en : g.vi;
    } else {
      keys = Object.keys(D.MAP_META);
      label = '';
    }
    map.open(keys, label);
  }

  /* ══ ĐÓNG ═════════════════════════════════════════════════════════════ */
  function close(reason) {
    if (closing) return;
    closing = true;
    if (map && map.isOpen()) map.close();
    root.classList.remove('st-open');
    root.classList.add('st-closing');
    if (releaseTrap) releaseTrap();
    if (offEsc) offEsc();
    wall.stop();
    slider.stop();
    ST.track('popup_close', { reason: reason, state: state, dwellMs: Date.now() - openedAt });
    setTimeout(function () { B.close(reason); }, reduced() ? 0 : 300);
  }

  /* Esc đi ngược từng tầng một: bản đồ → slider → wall → đóng. Nhảy thẳng ra
     sẽ làm người dùng mất hết ngữ cảnh chỉ bằng một phím. */
  function onEscape() {
    if (map && map.isOpen()) { map.close(); return; }
    if (state === 'slider') { toWall(); return; }
    close('esc');
  }

  function rearm(panel) {
    if (releaseTrap) releaseTrap();
    if (offEsc) offEsc();
    releaseTrap = ST.a11y.trap(root);
    offEsc = ST.a11y.onEsc(onEscape);
  }

  /* ══ i18n ═════════════════════════════════════════════════════════════ */
  function applyLang() {
    I.apply();
    wall.applyLang();
    slider.applyLang();
    if (map) map.applyLang();
  }

  /* ══ BOOT ═════════════════════════════════════════════════════════════ */
  function boot() {
    root   = document.getElementById('st-pop2');
    wallEl = document.getElementById('st-wall');
    sldEl  = document.getElementById('st-sld');
    gridEl = document.getElementById('st-wall-grid');

    I.init(/^(vi|en)$/.test(qs.lang) ? qs.lang : null);

    wall = ST.wall.create(gridEl, { onPick: toSlider });
    slider = ST.slider.create(sldEl, { onGo: goVR, onBack: toWall });
    map = ST.map2d.create(document.getElementById('st-map'), {
      onGo: function (d) { goVR(d, null); }
    });

    I.apply();

    /* Thanh công cụ dưới wall (note.md §198). Ba mục — đã bỏ "Xem bản đồ"
       (bản đồ gỡ từ D-44) và "Khám phá theo chủ đề" (chính là cái wall). */
    wallEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'skip') { close('button'); return; }
      if (act === 'journey') { toSlider(D.group('noibat'), null); return; }
      if (act === 'search') {
        toSlider(D.group('all'), null);
        setTimeout(function () {
          var i = sldEl.querySelector('.st-sld-search input');
          if (i) i.focus();
        }, 120);
      }
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-st-close]')) { e.preventDefault(); close('button'); return; }
      var m = e.target.closest('[data-open-map]');
      if (m) openMap(m.getAttribute('data-open-map'));
    });

    B.on('lang', function (d) { if (/^(vi|en)$/.test(d.lang)) I.set(d.lang); });
    B.on('open', reopen);
    I.onChange(applyLang);

    openedAt = Date.now();
    requestAnimationFrame(function () {
      root.classList.add('st-open');
      wall.start();
      var h1 = document.getElementById('st-wall-title');
      if (h1) h1.focus();
      rearm(wallEl);
    });

    B.ready({ w: window.innerWidth, h: window.innerHeight });
    ST.track('popup_shown', { variant: 'wall+slider' });

    if (ST.DEBUG) initDebug();
  }

  /* Trang cha gửi `st:open` — hiện lại mà không tải lại iframe. Luôn quay về
     wall: mở lại mà rơi thẳng vào slider của nhóm lần trước thì người dùng
     mất ngữ cảnh "đây là màn tổng quan". */
  function reopen() {
    closing = false;
    openedAt = Date.now();
    root.classList.remove('st-closing');
    Array.prototype.forEach.call(root.querySelectorAll('.st-going'), function (n) {
      n.classList.remove('st-going');
    });
    if (state === 'slider') toWall();

    requestAnimationFrame(function () {
      root.classList.add('st-open');
      wall.start();
      rearm(wallEl);
    });
    ST.track('popup_shown', { variant: 'wall+slider' });
  }

  /* ── Panel debug (?debug=1) ───────────────────────────────────────────── */
  function initDebug() {
    var el = document.getElementById('st-debug');
    el.hidden = false;
    function row(k, v) { return '<div class="st-dbg-row"><span>' + k + '</span><b>' + v + '</b></div>'; }
    function render() {
      el.innerHTML =
        '<h4>ST popup 2</h4>' +
        row('state', state) + row('lang', I.lang) +
        row('nhóm', slider.group()) +
        row('điểm', (slider.index() + 1) + '/' + slider.count()) +
        row('iframe', B.embedded() ? 'có' : 'không') +
        '<div class="st-dbg-grp">' +
          '<button data-act="wall">← Wall</button><button data-act="lang">VI/EN</button>' +
        '</div>';
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'wall') toWall();
      if (b.dataset.act === 'lang') I.toggle();
      render();
    });
    I.onChange(render);
    setInterval(render, 500);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  ST.popup2 = {
    toWall: toWall,
    toSlider: toSlider,
    close: close,
    state: function () { return state; },
    wall: function () { return wall; },
    slider: function () { return slider; }
  };
})();
