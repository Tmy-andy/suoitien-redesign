/* ═══════════════════════════════════════════════════════════════════════
   controls.js — CỤM C (2 nút) + THẺ VÉ COMBO + popover ⋯ + CTA vé + label + hint
   Xem docs/03-components.md §3.3-3.7, docs/08-decisions.md D-39 → D-42

   ⚠️ Từ 2026-08-01 phạm vi thu về `D.SCOPE === 'minimal'`: chỉ cụm C được
   render. Popover ⋯, CTA vé, scene label, hint là UI đã có / ngoài phạm vi
   → hàm vẫn còn nhưng bị chặn ở đầu. `?full=1` mở lại toàn bộ.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;
  var dock, pop, label, hint;
  var hintShown = false;

  function minimal() { return D.SCOPE === 'minimal'; }

  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function safeLS(fn, fb) { try { return fn(); } catch (e) { return fb; } }

  /* Q22 = (b): URL thật luôn nằm ở data-href để kiểm tra được, nhưng href chỉ
     đi thật khi bật cờ. Tắt cờ → href="#" và handler chung bắn toast "bản demo". */
  function linkAttrs(key) {
    var url = D.LINKS[key] || '#';
    return ' href="' + esc(D.LINKS_LIVE ? url : '#') + '"' +
           (D.LINKS_LIVE ? ' target="_blank" rel="noopener"' : '') +
           ' data-href="' + esc(url) + '"';
  }

  /* ══ CỤM C ═════════════════════════════════════════════════════════════ */
  function renderDock() {
    var list = minimal() ? D.DOCK_BUTTONS : D.DOCK_BUTTONS_FULL;

    dock.innerHTML = list.map(function (b) {
      if (b.sep) return '<span class="st-dock-sep' + (b.group === 'view' ? ' st-sep-view' : '') + '" aria-hidden="true"></span>';

      var lbl = I.t(b.i18n);
      var cls = 'st-dbtn st-v-' + b.variant + (b.group === 'view' ? ' st-dock-group-view' : '');

      /* Nút LINK — là <a> thật, không phải <button>. Hiện chỉ bản v2 dùng
         (nút combo đã tách ra thành thẻ vé riêng, xem renderTicket · D-41). */
      if (b.href) {
        return '<a id="' + b.id + '" class="' + cls + '"' + linkAttrs(b.href) + '>' +
               icon(b.icon) + '<span>' + esc(lbl) + '</span></a>';
      }

      var attrs = ' id="' + b.id + '" type="button" class="' + cls + '"' +
                  ' data-action="' + b.action + '"' +
                  (b.toggle ? ' aria-pressed="false"' : '');

      if (b.iconOnly) {
        attrs += ' aria-label="' + esc(lbl) + '" data-tip="' + esc(lbl) + '"';
        return '<button' + attrs + '>' + icon(b.icon) +
               (b.id === 'st-welcome-reopen' ? '<span class="st-dot" aria-hidden="true"></span>' : '') +
               '</button>';
      }
      return '<button' + attrs + '>' + icon(b.icon) + '<span>' + esc(lbl) + '</span></button>';
    }).join('');
  }

  /* ══ THẺ VÉ COMBO (D-41) ═══════════════════════════════════════════════
     Cả tấm vé là 1 <a>: không có <button> bên trong, không có con dấu.
     Mũi tên chỉ là dấu hiệu bấm được, `aria-hidden` để screen reader không
     đọc thành phần tử riêng — link đã có aria-label đầy đủ. */
  function renderTicket() {
    var wrap = document.getElementById('st-ticket-wrap');
    if (!wrap) return;
    /* `?full=1` là ảnh chụp trung thực bản v2 — hồi đó chưa có thẻ vé, và bản
       v2 đã có CTA vé riêng ở cạnh phải. Dựng cả 2 là thừa. */
    if (!minimal()) { wrap.innerHTML = ''; return; }
    var T = D.TICKET;

    wrap.innerHTML =
      '<a id="' + T.id + '"' + linkAttrs(T.href) +
        ' aria-label="' + esc(I.t(T.i18n.aria)) + '">' +
        '<span class="st-ticket">' +
          '<span class="st-ticket-stub">' +
            '<span class="st-ticket-ic">' + icon(T.icon) + '</span>' +
            '<span class="st-ticket-lab">' + esc(I.t(T.i18n.stub)) + '</span>' +
          '</span>' +
          '<span class="st-ticket-main">' +
            '<span class="st-ticket-body">' +
              '<span class="st-ticket-eyebrow">' + esc(I.t(T.i18n.eyebrow)) + '</span>' +
              '<span class="st-ticket-title">' + esc(I.t(T.i18n.title)) + '</span>' +
            '</span>' +
            '<span class="st-ticket-go" aria-hidden="true">' + icon('i-arrow-right') + '</span>' +
          '</span>' +
        '</span>' +
      '</a>';
  }

  /* ══ POPOVER ⋯ — ngoài phạm vi (D-39) ══════════════════════════════════ */
  function renderPopover() {
    if (minimal()) { pop.innerHTML = ''; return; }
    pop.innerHTML = D.POPOVER_ITEMS.map(function (it) {
      if (it.sep) return '<div class="st-pop-sep" role="separator"></div>';
      return '<button id="' + it.id + '" type="button" class="st-pop-item" role="menuitem"' +
             ' data-action="' + it.action + '"' + (it.toggle ? ' aria-pressed="false"' : '') + '>' +
             '<span class="st-pop-ic">' + icon(it.icon) + '</span>' +
             '<span data-i18n="' + it.i18n + '">' + esc(I.t(it.i18n)) + '</span></button>';
    }).join('');
  }

  function positionPopover() {
    var btn = document.getElementById('st-btn-more');
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var w = pop.offsetWidth || 216;
    var left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
    pop.style.left = left + 'px';
    pop.style.top = 'auto';
    pop.style.bottom = (window.innerHeight - r.top + 10) + 'px';
  }

  function openPopover() {
    /* Trên mobile dock ẩn nhóm "xem" → nhồi các nút đó vào popover */
    pop.removeAttribute('aria-hidden');
    pop.classList.add('st-open');
    positionPopover();
    document.getElementById('st-btn-more').setAttribute('aria-expanded', 'true');
    ST.store.set('popover', 'st-more-popover');
    setTimeout(function () { document.addEventListener('click', outsidePopover, true); }, 0);
  }

  function closePopover() {
    pop.classList.remove('st-open');
    pop.setAttribute('aria-hidden', 'true');
    var b = document.getElementById('st-btn-more');
    if (b) b.setAttribute('aria-expanded', 'false');
    ST.store.set('popover', null);
    document.removeEventListener('click', outsidePopover, true);
  }

  function outsidePopover(e) {
    if (pop.contains(e.target) || e.target.closest('#st-btn-more')) return;
    closePopover();
  }

  /* ══ CTA vé — ngoài phạm vi (D-39) ═════════════════════════════════════ */
  function renderCTA() {
    var wrap = document.getElementById('st-cta-tickets');
    if (minimal()) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = D.CTA.map(function (c) {
      return '<a id="' + c.id + '" class="st-cta" href="' + esc(c.href) + '" target="_blank" rel="noopener">' +
             '<i></i><i></i><i></i><i></i>' +      /* 4 vệt viền chạy — D-25 */
             icon(c.icon) + '<span data-i18n="' + c.i18n + '">' + esc(I.t(c.i18n)) + '</span></a>';
    }).join('');
  }

  /* ══ SCENE LABEL — ngoài phạm vi (D-39) ════════════════════════════════ */
  function renderLabel(info) {
    if (minimal()) return;
    if (!info || !info.dest) return;
    var d = info.dest;
    label.innerHTML =
      '<span class="st-sl-icon">' + icon(D.iconOf(d)) + '</span>' +
      '<span class="st-sl-text">' +
        '<span class="st-sl-name">' + esc(I.destName(d)) + '</span>' +
        '<span class="st-sl-meta">' + esc(D.catLabel(d, I.lang)) + ' · ' +
          esc(I.t('scene.fmt', { index: info.index, total: info.total })) + '</span>' +
      '</span>';
    label.classList.add('st-on');
  }

  /* ══ HINT ══════════════════════════════════════════════════════════════ */
  function showHint() {
    if (minimal()) return;                       /* hint = UI thêm vào → bỏ (D-39) */
    if (hintShown) return;
    if (safeLS(function () { return localStorage.getItem('st.hint.seen'); }, '1')) return;
    hintShown = true;
    hint.hidden = false;
    requestAnimationFrame(function () { hint.classList.add('st-on'); });
    var t = setTimeout(hideHint, 4200);
    ST.store.on('drag:start', function () { clearTimeout(t); hideHint(); });
  }

  function hideHint() {
    if (!hint || hint.hidden) return;
    hint.classList.remove('st-on');
    safeLS(function () { localStorage.setItem('st.hint.seen', '1'); });
    setTimeout(function () { hint.hidden = true; }, 260);
  }

  /* ══ Xử lý action ══════════════════════════════════════════════════════ */
  function handleAction(action, btn) {
    var parts = action.split(':');

    switch (parts[0]) {
      case 'open':
        closePopover();
        ST.overlays.open(parts[1], parts[1] === 'st-welcome' ? { morphFrom: '#st-welcome-reopen' } : null);
        break;

      /* D-09v2: hồi đó 2 nút chỉ bắn modal "phần này đã có sẵn". Từ D-43 chúng
         mở M2/M3 clone thật, nên nhánh này KHÔNG còn được gọi — giữ lại vì
         markup + chuỗi `existing.*` vẫn còn, xoá đi là mất đường lùi. */
      case 'existing':
        ST.overlays.openExisting(parts[1]);
        break;

      case 'toggle':
        toggleThing(parts[1], btn);
        break;

      case 'popover':
        pop.classList.contains('st-open') ? closePopover() : openPopover();
        break;

      case 'lang':
        I.toggle();
        ST.toast(I.lang === 'vi' ? 'toast.langVi' : 'toast.langEn', 'success');
        closePopover();
        break;

      default:
        ST.toast('toast.wip');
        if (btn && btn.hasAttribute('aria-pressed')) {
          /* nút mock vẫn phản hồi trạng thái để demo nhìn "sống" */
          var on = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', on ? 'false' : 'true');
        }
    }
    ST.track && ST.track('dock_click', { id: btn && btn.id });
  }

  function toggleThing(what, btn) {
    var on;
    if (what === 'fullscreen') {
      var doc = document;
      if (!doc.fullscreenElement) {
        var p = doc.documentElement.requestFullscreen && doc.documentElement.requestFullscreen();
        if (p && p.catch) p.catch(function () { ST.toast('toast.fsBlocked', 'warn'); });
        else if (!doc.documentElement.requestFullscreen) ST.toast('toast.fsBlocked', 'warn');
      } else if (doc.exitFullscreen) {
        doc.exitFullscreen();
      }
      return;                                        /* state cập nhật qua fullscreenchange */
    }

    if (what === 'autoRotate') {
      on = !ST.store.get('autoRotate');
      ST.viewer.setAutoRotate(on);
      if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      ST.toast(on ? 'toast.rotateOn' : 'toast.rotateOff', 'success');
      closePopover();
      return;
    }

    if (what === 'sound') {
      on = !ST.store.get('soundOn');
      ST.store.set('soundOn', on);
      if (btn) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.querySelector('use').setAttribute('href', on ? '#i-sound-on' : '#i-sound-off');
      }
      ST.toast('toast.wip');                         /* MOCK: chưa có nhạc thật */
      return;
    }
  }

  function syncFullscreen() {
    var on = !!document.fullscreenElement;
    ST.store.set('fullscreen', on);
    var b = document.getElementById('st-btn-fullscreen');
    if (!b) return;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.querySelector('use').setAttribute('href', on ? '#i-collapse' : '#i-expand');
  }

  /* ══ INIT ══════════════════════════════════════════════════════════════ */
  var C = {
    init: function () {
      dock  = document.getElementById('st-dock');
      pop   = document.getElementById('st-more-popover');
      label = document.getElementById('st-scene-label');
      hint  = document.getElementById('st-hint');

      renderDock();
      renderTicket();
      renderPopover();
      renderCTA();

      dock.addEventListener('click', function (e) {
        var btn = e.target.closest('.st-dbtn');
        if (!btn) return;
        var act = btn.getAttribute('data-action');
        /* Nút combo là <a> không có data-action: để trình duyệt (hoặc handler
           a[href="#"] ở dưới) xử lý, ở đây chỉ ghi nhận tracking. */
        if (!act) { ST.track && ST.track('dock_click', { id: btn.id, href: btn.getAttribute('data-href') }); return; }
        handleAction(act, btn);
      });

      pop.addEventListener('click', function (e) {
        var btn = e.target.closest('.st-pop-item');
        if (btn) handleAction(btn.getAttribute('data-action'), btn);
      });

      /* ↑↓ trong popover */
      pop.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        var items = Array.prototype.slice.call(pop.querySelectorAll('.st-pop-item'));
        var i = items.indexOf(document.activeElement);
        var n = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[n].focus();
      });
      ST.a11y.onEsc(function () { if (pop.classList.contains('st-open')) closePopover(); });

      document.addEventListener('fullscreenchange', syncFullscreen);
      window.addEventListener('resize', function () {
        if (pop.classList.contains('st-open')) positionPopover();
      });

      /* CTA + link mock (Q22 = b) */
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href="#"]');
        if (a) { e.preventDefault(); ST.toast('toast.linkDemo'); }
      });

      ST.store.on('scene:change', renderLabel);
      ST.store.on('lang:change', function () {
        renderDock(); renderTicket(); renderPopover(); renderCTA();
        I.apply(dock); I.apply(pop);
        renderLabel(ST.viewer.info());
      });
    },

    showHint: showHint,
    hideHint: hideHint,
    closePopover: closePopover,

    /** Hiện nút mở lại modal welcome (sau khi modal đóng lần đầu) */
    showReopen: function (pulse) {
      var b = document.getElementById('st-welcome-reopen');
      if (!b) return;
      b.classList.add('st-visible');
      if (pulse) {
        var dot = b.querySelector('.st-dot');
        if (dot) { dot.classList.add('st-pulse'); }
      }
    }
  };

  ST.controls = C;
})();
