/* ═══════════════════════════════════════════════════════════════════════
   app.js — bootstrap. Thứ tự init QUAN TRỌNG (docs/05-flows.md §5.7).
   Nạp cuối cùng.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var qs = {};
  (function parse() {
    var s = location.search.replace(/^\?/, '');
    if (!s) return;
    s.split('&').forEach(function (p) {
      var kv = p.split('=');
      qs[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  })();

  function safeLS(fn, fb) { try { return fn(); } catch (e) { return fb; } }

  /* MOCK: bản thật → VR360Track.event(name, payload) → /backend/analytics/track.php */
  ST.track = function (name, payload) {
    if (ST.store && ST.store.get('debug')) console.log('[track]', name, payload || {});
  };

  /* Bọc từng init — 1 module lỗi không làm chết cả app */
  function safeInit(name, fn) {
    try { fn(); }
    catch (e) { console.error('[app] init lỗi: ' + name, e); }
  }

  function shouldShowWelcome() {
    if (qs.welcome === '0') return false;
    if (qs.welcome === '1') return true;
    if (qs.pano) return false;
    return !safeLS(function () { return localStorage.getItem('st.welcome.seen'); }, '1');
  }

  /* ══ DEBUG PANEL ══════════════════════════════════════════════════════ */
  function initDebug() {
    var el = document.getElementById('st-debug');
    el.hidden = false;
    ST.store.set('debug', true);

    function row(k, v) { return '<div class="st-dbg-row"><span>' + k + '</span><b>' + v + '</b></div>'; }

    function render() {
      var s = ST.store.state;
      el.innerHTML =
        '<h4>ST debug</h4>' +
        row('phase', s.phase) + row('modal', s.modal || '—') +
        row('scene', s.sceneKey) + row('lang', ST.i18n.lang) +
        row('navHidden', s.navHidden) + row('yaw', s.yaw) +
        '<div class="st-dbg-grp">Tiêu đề welcome (Q6)<br>' +
          ['a', 'b', 'c'].map(function (v) {
            return '<button data-var="' + v + '" class="' + (ST.welcome.getVariant() === v ? 'st-on' : '') + '">' + v.toUpperCase() + '</button>';
          }).join('') +
        '</div>' +
        '<div class="st-dbg-grp">Bản đồ (Q-30)<br>' +
          '<button data-map="svg">SVG</button><button data-map="real">Ảnh thật</button>' +
        '</div>' +
        '<div class="st-dbg-grp">' +
          '<button data-act="welcome">Mở welcome</button>' +
          '<button data-act="reset">Reset localStorage</button>' +
        '</div>';
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.var)  { ST.welcome.setVariant(b.dataset.var); render(); }
      if (b.dataset.map)  { ST.welcome.setMapMode(b.dataset.map); }
      if (b.dataset.act === 'welcome') ST.welcome.open({ morphFrom: '#st-welcome-reopen' });
      if (b.dataset.act === 'reset') {
        safeLS(function () {
          ['st.welcome.seen', 'st.hint.seen', 'st.help.hide', 'st.lang'].forEach(function (k) {
            localStorage.removeItem(k);
          });
        });
        location.reload();
      }
    });

    ST.store.on('change', render);
    ST.store.on('lang:change', render);
    render();
  }

  /* ══ GHOST 4 CỤM CONTROL CÓ SẴN (?zones=1) ════════════════════════════
     Mặc định TẮT — khách yêu cầu "còn lại đừng thêm vào trang". Bật lên chỉ
     để kiểm chứng bằng mắt rằng cụm C mới không đè lên UI sẵn có (D-40).
     Đây là lớp kiểm tra, KHÔNG phải design. */
  function initZones() {
    var wrap = document.createElement('div');
    wrap.id = 'st-zones';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = ST.data.RESERVED_ZONES.map(function (z) {
      return '<div class="st-zone' + (z.soft ? ' st-zone-soft' : '') + '"' +
             ' data-zone="' + z.key + '" style="' + z.css + '">' +
             '<span>' + z.key.toUpperCase() + ' · ' + z.label + '</span></div>';
    }).join('');
    document.body.appendChild(wrap);
  }

  /* ══ BOOTSTRAP ════════════════════════════════════════════════════════ */
  function boot() {
    ST.store.set('phase', 'loading');

    /* Phạm vi: mặc định 'minimal' (D-39). ?full=1 dựng lại bản v2 đầy đủ. */
    if (qs.full === '1') ST.data.SCOPE = 'full';
    var minimal = ST.data.SCOPE === 'minimal';
    document.documentElement.classList.toggle('st-scope-min', minimal);

    safeInit('i18n',     function () { ST.i18n.init(/^(vi|en)$/.test(qs.lang) ? qs.lang : null); });
    safeInit('a11y',     function () { ST.a11y.init(); });
    safeInit('viewer',   function () { ST.viewer.init('#st-viewer'); });
    safeInit('overlays', function () { ST.overlays.init(); });
    /* navbar GIỮ ở mọi phạm vi: dải trên cùng của trip360 trống, header là
       phần thêm vào chỗ trống chứ không đè lên control có sẵn nào (D-39). */
    safeInit('navbar',   function () { ST.navbar.init(); });
    safeInit('controls', function () { ST.controls.init(); });
    /* M2 + M3 — clone 2 overlay mở ra từ cụm C (D-43). Chúng nằm TRONG phạm vi
       dù `minimal`: là nội dung của chính 2 nút được giao redesign. */
    safeInit('route',    function () { ST.route.init(); });
    safeInit('places',   function () { ST.places.init(); });
    safeInit('welcome',  function () { ST.welcome.init({ variant: qs.title, map: qs.map }); });

    ST.i18n.apply();

    if (qs.nav === 'off') document.documentElement.classList.add('st-no-nav');
    if (qs.zones === '1') safeInit('zones', initZones);
    if (qs.debug === '1') safeInit('debug', initDebug);

    /* Nút mở lại welcome — hiện luôn nếu người dùng đã xem modal trước đó */
    if (safeLS(function () { return localStorage.getItem('st.welcome.seen'); }, null)) {
      ST.controls.showReopen(false);
    }

    var off = ST.store.on('viewer:ready', function () {
      off();
      ST.store.set('phase', 'ready');

      if (qs.pano) {
        if (ST.data.get(qs.pano)) ST.viewer.goTo(qs.pano);
        else ST.toast('toast.noPano', 'warn');
      }

      if (shouldShowWelcome()) {
        /* Chờ 800ms cho panorama vẽ xong frame đầu — nếu không, scrim blur
           không có gì để blur, trông như trang lỗi (D-13). */
        setTimeout(function () { ST.welcome.open(); }, 800);
      } else {
        setTimeout(function () { ST.controls.showHint(); }, 600);
        if (!safeLS(function () { return localStorage.getItem('st.help.hide'); }, '1') &&
            qs.welcome === '0') {
          /* không tự mở help — chỉ để dành cho nút ⋯ */
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
