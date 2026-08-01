/* ═══════════════════════════════════════════════════════════════════════
   welcome.js — M1 modal chào mừng (YC-1)
   • 8 hotspot, xuất hiện so le
   • Click hotspot → NHẢY THẲNG (Q10 = a), không có bước xác nhận
   • Hover → mini-card (bù cho việc bỏ preview panel)
   • Đóng → morph co về #st-welcome-reopen (Q12 / D-29)
   Xem docs/04-modals.md §4.3
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;
  var modal, mapEl, titleEl, listEl, card, tip;
  var variant = 'a';
  var mobileMQ, hoverMQ;
  var openedAt = 0;

  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function safeLS(fn, fb) { try { return fn(); } catch (e) { return fb; } }

  /* ── Kích thước bản đồ ────────────────────────────────────────────────
     Hotspot định vị bằng % của #st-welcome-map, nên khung này PHẢI khít
     đúng tỉ lệ của SVG. Chỉ dùng aspect-ratio trong CSS thì khi chiều cao
     bị max-height cắt, SVG sẽ letterbox bên trong khung → hotspot lệch.
     Vì vậy tính bằng JS cho chắc. */
  var MAP_AR = 1000 / 620;

  function fitMap() {
    if (!mapEl) return;
    var wrap = mapEl.parentElement;
    var r = wrap.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var w = r.width, h = w / MAP_AR;
    if (h > r.height) { h = r.height; w = h * MAP_AR; }
    mapEl.style.width = Math.round(w) + 'px';
    mapEl.style.height = Math.round(h) + 'px';
  }

  /* ── Hotspot ──────────────────────────────────────────────────────────── */
  /* Bản đồ SVG là landscape ở mọi breakpoint → luôn dùng x/y.
     (xm/ym giữ trong data.js cho bản bản-đồ-dọc sau này — xem TODO.) */
  function coords(h) { return { x: h.x, y: h.y }; }

  function renderHotspots() {
    /* Xoá hotspot cũ, giữ lại <svg> bản đồ */
    Array.prototype.forEach.call(mapEl.querySelectorAll('.st-hotspot, .st-hotspot-card, .st-hotspot-tip'),
      function (n) { n.remove(); });

    var html = D.HOTSPOTS.map(function (h, i) {
      var dest = D.get(h.key);
      if (!dest) return '';
      var c = coords(h);
      var aria = I.destName(dest) + ' — ' + D.catLabel(dest, I.lang) +
                 (h.must ? ', ' + I.t('welcome.legend') : '') + '. ' + I.t('welcome.goHint') + '.';
      return '<button type="button" class="st-hotspot' + (h.must ? ' st-must' : '') + '"' +
             ' data-key="' + h.key + '" data-i="' + i + '"' +
             ' style="--x:' + c.x + '%;--y:' + c.y + '%;--i:' + i + '"' +
             ' aria-label="' + esc(aria) + '">' + icon(D.iconOf(dest)) + '</button>';
    }).join('');

    mapEl.insertAdjacentHTML('beforeend', html);

    card = document.createElement('div');
    card.className = 'st-hotspot-card';
    mapEl.appendChild(card);

    tip = document.createElement('div');
    tip.className = 'st-hotspot-tip';
    mapEl.appendChild(tip);

    ST.a11y.roving(mapEl, '.st-hotspot');
    renderList();
  }

  /* Danh sách 8 điểm — chỉ hiện ở mobile (CSS lo phần hiện/ẩn) */
  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = D.HOTSPOTS.map(function (h) {
      var dest = D.get(h.key);
      if (!dest) return '';
      return '<li><button type="button" class="st-wl-item' + (h.must ? ' st-must' : '') + '"' +
        ' data-key="' + h.key + '">' +
        '<span class="st-wl-ic">' + icon(D.iconOf(dest)) + '</span>' +
        '<span class="st-wl-text">' +
          '<span class="st-wl-name">' + esc(I.destName(dest)) + '</span>' +
          '<span class="st-wl-cat">' + esc(D.catLabel(dest, I.lang)) +
            (h.must ? ' · ' + esc(I.t('welcome.legend')) : '') + '</span>' +
        '</span>' +
        '<svg class="st-wl-go" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg>' +
        '</button></li>';
    }).join('');
  }

  var cardTimer = null;

  function showCard(btn) {
    if (hoverMQ && hoverMQ.matches) { showTip(btn); return; }   /* touch → tooltip */
    clearTimeout(cardTimer);
    cardTimer = setTimeout(function () {
      var dest = D.get(btn.getAttribute('data-key'));
      if (!dest) return;
      var h = D.HOTSPOTS[+btn.getAttribute('data-i')];
      var c = coords(h);
      card.style.setProperty('--x', c.x + '%');
      card.style.setProperty('--y', c.y + '%');
      card.classList.toggle('st-flip', c.y < 26);
      card.innerHTML =
        '<span class="st-chip">' + esc(D.catLabel(dest, I.lang)) + '</span>' +
        '<h3 class="st-hc-name">' + esc(I.destName(dest)) + '</h3>' +
        '<p class="st-hc-blurb">' + esc(I.destBlurb(dest)) + '</p>' +
        '<span class="st-hc-go">' + esc(I.t('welcome.goHint')) + icon('i-arrow-right') + '</span>';
      card.classList.add('st-on');
      ST.track && ST.track('welcome_hotspot_hover', { key: dest.key });
    }, 140);
  }

  function hideCard() {
    clearTimeout(cardTimer);
    if (card) card.classList.remove('st-on');
    if (tip) tip.classList.remove('st-on');
  }

  function showTip(btn) {
    var dest = D.get(btn.getAttribute('data-key'));
    if (!dest) return;
    var h = D.HOTSPOTS[+btn.getAttribute('data-i')];
    var c = coords(h);
    tip.style.setProperty('--x', c.x + '%');
    tip.style.setProperty('--y', c.y + '%');
    tip.textContent = I.destName(dest);
    tip.classList.add('st-on');
  }

  /* ── Click hotspot → nhảy thẳng (Q10 = a) ─────────────────────────────── */
  function pick(btn) {
    var key = btn.getAttribute('data-key');
    btn.classList.add('st-going');
    hideCard();
    ST.track && ST.track('welcome_go', { key: key, dwellMs: Date.now() - openedAt });
    W.close();
    ST.viewer.goTo(key);
  }

  /* ── Tiêu đề: 3 biến thể (Q6) ─────────────────────────────────────────── */
  function applyTitle() {
    var titles = I.t('welcome.titles') || {};
    titleEl.textContent = titles[variant] || titles.a;
  }

  /* ── Bản đồ: SVG (mặc định) hoặc ảnh thật (?map=real · Q-30) ─────────── */
  var REAL_MAP = 'assets/map/park-map-real.jpg';

  function applyMapMode(mode) {
    if (mode !== 'real') {
      mapEl.classList.remove('st-map-real');
      mapEl.style.backgroundImage = '';
      return;
    }
    /* Ảnh bản đồ thật chưa chắc đã có trong repo → thử tải, lỗi thì quay về SVG */
    var probe = new Image();
    probe.onload = function () {
      mapEl.classList.add('st-map-real');
      mapEl.style.backgroundImage = 'url("' + REAL_MAP + '")';
      /* Ảnh thật tỉ lệ khác SVG → cập nhật để hotspot không lệch */
      MAP_AR = probe.naturalWidth / probe.naturalHeight;
      fitMap();
    };
    probe.onerror = function () {
      ST.toast('toast.mapMissing', 'warn');
      applyMapMode('svg');
    };
    probe.src = REAL_MAP;
  }

  var W = {
    init: function (opts) {
      opts = opts || {};
      modal   = document.getElementById('st-welcome');
      mapEl   = document.getElementById('st-welcome-map');
      titleEl = document.getElementById('st-welcome-title');
      listEl  = document.getElementById('st-welcome-list');

      mobileMQ = window.matchMedia('(max-width: 599px)');
      hoverMQ  = window.matchMedia('(hover: none)');

      if (opts.variant && /^[abc]$/.test(opts.variant)) variant = opts.variant;
      applyTitle();
      applyMapMode(opts.map);
      renderHotspots();

      mapEl.addEventListener('click', function (e) {
        var b = e.target.closest('.st-hotspot');
        if (b) pick(b);
      });
      listEl.addEventListener('click', function (e) {
        var b = e.target.closest('.st-wl-item');
        if (b) pick(b);
      });
      mapEl.addEventListener('mouseover', function (e) {
        var b = e.target.closest('.st-hotspot');
        if (b) showCard(b);
      });
      mapEl.addEventListener('mouseout', function (e) {
        if (e.target.closest('.st-hotspot')) hideCard();
      });
      mapEl.addEventListener('focusin', function (e) {
        var b = e.target.closest('.st-hotspot');
        if (b) showCard(b);
      });
      mapEl.addEventListener('focusout', hideCard);

      window.addEventListener('resize', fitMap, { passive: true });
      ST.store.on('modal:open', function (p) { if (p.id === 'st-welcome') fitMap(); });

      ST.store.on('lang:change', function () {
        applyTitle();
        renderHotspots();
      });
    },

    open: function (opts) {
      opts = opts || {};
      openedAt = Date.now();
      ST.overlays.open('st-welcome', {
        morphFrom: opts.morphFrom,
        focus: '#st-welcome-title'
      });
      /* Đo sau khi panel đã hiện — rect lúc aria-hidden bằng 0 */
      requestAnimationFrame(fitMap);
      ST.track && ST.track('welcome_shown', {});
    },

    /** Đóng → morph co về nút trong dock, và đánh dấu đã xem (Q12 = b) */
    close: function () {
      if (!ST.overlays.isOpen('st-welcome')) return;
      var first = !safeLS(function () { return localStorage.getItem('st.welcome.seen'); }, '1');
      safeLS(function () { localStorage.setItem('st.welcome.seen', '1'); });

      ST.overlays.close('st-welcome', { morphTo: '#st-welcome-reopen' });
      ST.controls.showReopen(first);
      setTimeout(function () { ST.controls.showHint(); }, 620);
    },

    setVariant: function (v) { variant = v; applyTitle(); },
    getVariant: function () { return variant; },
    setMapMode: applyMapMode
  };

  ST.welcome = W;
})();
