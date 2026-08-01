/* ═══════════════════════════════════════════════════════════════════════
   viewer.js — MOCK panorama 360°.
   Cảnh vẽ bằng SVG data-URI, 3 lớp parallax, kéo để xoay, inertia.

   // MOCK: toàn bộ file này thay bằng 3DVista ở bản thật:
   //   init()  → VRCore.ensureTourLoaded() + VRCore.mountViewer(el)
   //   goTo()  → VRCore.navigateToPano(tour, dest.pano)
   // Xem docs/07-integration.md §7.3
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var el, panoEl, layers, fadeEl;
  var yaw = 0, vel = 0, dragging = false, lastX = 0, lastT = 0;
  var rafId = null, navigating = false, autoRotate = false;
  var currentKey = null;

  /* ── Sinh cảnh SVG (data-URI) ─────────────────────────────────────────
     Mỗi cảnh = 3 lớp: trời+mặt trời · núi xa · công trình gần.
     Màu lấy từ CATEGORY_META của điểm → mỗi loại điểm 1 tông trời khác. */

  function svgURI(w, h, inner) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h +
            '" viewBox="0 0 ' + w + ' ' + h + '">' + inner + '</svg>';
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s) + '")';
  }

  /* QUAN TRỌNG — mọi lớp phải LIỀN MẠCH khi lặp ngang:
     • đường bao phải có y(0) === y(W)
     • không vật thể nào chạm mép trái/phải của tile
     Nếu không sẽ thấy vệt nối dọc rất rõ khi kéo. */

  function layerSky(sky) {
    var inner =
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + sky[2] + '"/>' +
        '<stop offset="52%" stop-color="' + sky[1] + '"/>' +
        '<stop offset="100%" stop-color="' + sky[0] + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="sun"><stop offset="0" stop-color="#fff" stop-opacity=".95"/>' +
        '<stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1200" height="700" fill="url(#g)"/>' +
      '<circle cx="820" cy="210" r="150" fill="url(#sun)"/>' +
      '<circle cx="820" cy="210" r="34" fill="#fff" opacity=".85"/>' +
      /* mây — đều nằm gọn trong 140…1060 để không bị cắt ở mép tile */
      '<g fill="#fff" opacity=".38">' +
      '<ellipse cx="255" cy="150" rx="110" ry="32"/><ellipse cx="320" cy="133" rx="74" ry="26"/>' +
      '<ellipse cx="620" cy="112" rx="120" ry="28"/><ellipse cx="690" cy="99"  rx="76" ry="22"/>' +
      '<ellipse cx="980" cy="168" rx="96"  ry="26"/><ellipse cx="1030" cy="156" rx="60" ry="20"/>' +
      '</g>';
    return svgURI(1200, 700, inner);
  }

  function layerHills(c) {
    /* 2 dải đồi, cả hai bắt đầu và kết thúc ở CÙNG y → nối liền mạch */
    var far  = 'M0 470 C 175 400 285 540 470 470 S 815 400 990 470 S 1225 540 1400 470 V700 H0 Z';
    var near = 'M0 560 C 200 500 320 626 560 560 S 900 500 1050 560 S 1250 620 1400 560 V700 H0 Z';
    var inner =
      '<path d="' + far  + '" fill="' + c + '" opacity=".5"/>' +
      '<path d="' + near + '" fill="' + c + '" opacity=".78"/>';
    return svgURI(1400, 700, inner);
  }

  function layerNear(c1, c2) {
    /* Bóng công trình + cây — lớp gần nhất, chạy nhanh nhất.
       Dải nền phẳng ở đáy để mép tile không lộ; vật thể nằm trong 120…1480. */
    var inner =
      '<rect x="0" y="648" width="1600" height="52" fill="' + c2 + '"/>' +
      '<g fill="' + c2 + '">' +
      '<path d="M150 660V566l72-64 72 64v94Z"/>' +
      '<rect x="470" y="592" width="158" height="68" rx="10"/>' +
      '<path d="M462 592 549 528 636 592Z"/>' +
      '<rect x="820" y="612" width="126" height="48" rx="10"/>' +
      '<path d="M1130 660V576q64-50 128 0v84Z"/>' +
      '</g>' +
      '<g fill="' + c1 + '" opacity=".92">' +
      '<rect x="349" y="628" width="14" height="42"/><circle cx="356" cy="612" r="52"/>' +
      '<rect x="734" y="640" width="12" height="34"/><circle cx="740" cy="626" r="42"/>' +
      '<rect x="1039" y="634" width="13" height="38"/><circle cx="1046" cy="618" r="48"/>' +
      '<rect x="1394" y="640" width="12" height="34"/><circle cx="1400" cy="624" r="44"/>' +
      '</g>';
    return svgURI(1600, 700, inner);
  }

  function applyScene(dest) {
    var meta = ST.data.metaOf(dest);
    layers[0].style.backgroundImage = layerSky(meta.sky);
    layers[1].style.backgroundImage = layerHills(meta.grad[0]);
    layers[2].style.backgroundImage = layerNear(meta.grad[1], meta.grad[0]);
  }

  function render() {
    for (var i = 0; i < layers.length; i++) {
      var d = parseFloat(layers[i].getAttribute('data-depth')) || 1;
      layers[i].style.backgroundPositionX = (-yaw * d) + 'px';
    }
  }

  function loop() {
    rafId = null;
    var moved = false;

    if (autoRotate && !dragging) { yaw += 0.35; moved = true; }

    if (!dragging && Math.abs(vel) > 0.02) {
      yaw += vel;
      vel *= 0.94;                       /* damping */
      moved = true;
    } else if (!dragging) {
      vel = 0;
    }

    if (moved) { render(); ST.store.set('yaw', Math.round(yaw)); }
    if (autoRotate || Math.abs(vel) > 0.02 || dragging) rafId = requestAnimationFrame(loop);
  }

  function kick() { if (rafId === null) rafId = requestAnimationFrame(loop); }

  /* ── Kéo để xoay ──────────────────────────────────────────────────────── */
  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    vel = 0;
    lastX = e.clientX;
    lastT = performance.now();
    el.classList.add('st-grabbing');
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    ST.store.set('isDragging', true);
    ST.store.emit('drag:start');
    kick();
  }

  function onMove(e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    var now = performance.now();
    var dt = Math.max(1, now - lastT);
    yaw -= dx;
    vel = -dx / dt * 12;
    lastX = e.clientX;
    lastT = now;
    render();
  }

  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('st-grabbing');
    el.releasePointerCapture && e.pointerId !== undefined &&
      (function () { try { el.releasePointerCapture(e.pointerId); } catch (err) {} })();
    ST.store.set('isDragging', false);
    ST.store.emit('drag:end');
    kick();
  }

  var V = {
    init: function (selector) {
      el = document.querySelector(selector);
      if (!el) return;
      panoEl = el.querySelector('.st-pano');
      layers = el.querySelectorAll('.st-pano-layer');
      fadeEl = el.querySelector('.st-pano-fade');

      /* Bind ở CAPTURE phase — bản thật 3DVista có thể stopPropagation (R1) */
      el.addEventListener('pointerdown', onDown, true);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp, true);
      window.addEventListener('pointercancel', onUp, true);

      var start = ST.data.get(ST.data.DEFAULT_KEY);
      applyScene(start);
      currentKey = ST.data.DEFAULT_KEY;
      render();

      /* Giả lập thời gian panorama load — bản thật là ensureTourLoaded() */
      setTimeout(function () {
        ST.store.emit('viewer:ready');
        ST.store.emit('scene:change', V.info(currentKey));
      }, 600);
    },

    /** MOCK: bản thật → VRCore.navigateToPano(tour, dest.pano) */
    goTo: function (key) {
      var dest = ST.data.get(key);
      if (!dest) { ST.toast && ST.toast('toast.noPano', 'warn'); return; }
      if (navigating || key === currentKey) {
        if (key === currentKey) ST.store.emit('scene:change', V.info(key));
        return;
      }
      navigating = true;
      ST.store.emit('scene:loading', { key: key });

      fadeEl.classList.add('st-on');
      setTimeout(function () {
        applyScene(dest);
        yaw = 0; vel = 0;
        render();
        currentKey = key;
        ST.store.set('sceneKey', key);
        fadeEl.classList.remove('st-on');
        ST.store.emit('scene:change', V.info(key));
        ST.track && ST.track('scene_view', { key: key });
        setTimeout(function () { navigating = false; }, 120);
      }, 260);
    },

    info: function (key) {
      key = key || currentKey;
      var dest = ST.data.get(key);
      return {
        key: key,
        dest: dest,
        index: ST.data.indexOf(key),
        total: ST.data.TOTAL_REAL
      };
    },

    getCurrent: function () { return currentKey; },

    setAutoRotate: function (on) {
      autoRotate = !!on;
      ST.store.set('autoRotate', autoRotate);
      if (autoRotate) kick();
    },

    setDimmed: function (on) {
      if (!el) return;
      el.classList.toggle('st-dimmed', !!on);
      if (on && autoRotate) { autoRotate = false; ST.store.set('autoRotate', false); }
    }
  };

  ST.viewer = V;
})();
