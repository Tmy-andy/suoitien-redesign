/* ═══════════════════════════════════════════════════════════════════════
   overlays.js — engine mở/đóng dùng chung cho MỌI modal + share/help/toast
   Vòng đời + bẫy aria-hidden: xem docs/04-modals.md §4.2
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var I = ST.i18n, D = ST.data;
  var openId = null;
  var active = null;                 /* { id, el, panel, release, offEsc, onClose } */
  var STACKABLE = { 'st-drawer': true };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function safeLS(fn, fb) { try { return fn(); } catch (e) { return fb; } }
  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ══ FLIP morph: panel ↔ nút (Q12 / D-29) ═════════════════════════════ */
  function morphClose(panel, targetSel) {
    var btn = document.querySelector(targetSel);
    if (!btn || reduced() || !panel.animate) return false;

    /* BẪY: nút phải hiện TRƯỚC khi đo, không thì rect = 0 */
    ST.controls.showReopen(false);
    var first = panel.getBoundingClientRect();
    var last  = btn.getBoundingClientRect();
    if (!last.width) return false;

    var dx = (last.left + last.width / 2)  - (first.left + first.width / 2);
    var dy = (last.top  + last.height / 2) - (first.top  + first.height / 2);
    var sx = last.width  / first.width;
    var sy = last.height / first.height;

    panel.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')', opacity: 0 }
    ], { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });

    /* Nội dung mờ nhanh — không muốn thấy chữ bị bóp méo */
    Array.prototype.forEach.call(panel.children, function (c) {
      if (c.classList.contains('st-brandline')) return;
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    });

    btn.animate([
      { opacity: 0, transform: 'scale(.55)' },
      { opacity: 1, transform: 'scale(1)' }
    ], { duration: 260, delay: 200, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });

    return true;
  }

  function morphOpen(panel, sourceSel) {
    var btn = document.querySelector(sourceSel);
    if (!btn || reduced() || !panel.animate) return false;
    var r = btn.getBoundingClientRect();
    if (!r.width) return false;

    var last = panel.getBoundingClientRect();
    var dx = (r.left + r.width / 2)  - (last.left + last.width / 2);
    var dy = (r.top  + r.height / 2) - (last.top  + last.height / 2);
    var sx = r.width  / last.width;
    var sy = r.height / last.height;

    panel.animate([
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')', opacity: 0 },
      { transform: 'translate(0,0) scale(1)', opacity: 1 }
    ], { duration: 440, easing: 'cubic-bezier(.16,1,.3,1)' });
    return true;
  }

  /* ══ open / close ═════════════════════════════════════════════════════ */
  function open(id, opts) {
    opts = opts || {};
    var el = document.getElementById(id);
    if (!el || openId === id) return;

    if (openId && !STACKABLE[id]) close(openId, { silent: true });

    ST.a11y.rememberFocus();
    el.removeAttribute('aria-hidden');            /* TRƯỚC khi add class */
    /* .st-fs-panel = overlay TOÀN MÀN HÌNH (M2 chỉ đường, M3 danh sách) —
       không phải hộp thoại canh giữa nên có lớp panel riêng, nhưng vòng đời
       (focus trap, Esc, khoá cuộn, aria-hidden) dùng chung engine này. */
    var panel = el.querySelector('.st-modal-panel, .st-drawer-panel, .st-fs-panel');

    if (opts.morphFrom && morphOpen(panel, opts.morphFrom)) {
      el.classList.add('st-morphing');
      setTimeout(function () { el.classList.remove('st-morphing'); }, 460);
    }
    el.classList.add('st-open');

    ST.a11y.lockScroll();
    ST.viewer.setDimmed(true);
    ST.store.set('modal', id);
    ST.store.emit('modal:open', { id: id });

    requestAnimationFrame(function () {
      var target = opts.focus ? panel.querySelector(opts.focus)
                              : (panel.querySelector('h1[tabindex], h2[tabindex]') ||
                                 ST.a11y.focusables(panel)[0]);
      if (target) target.focus();
    });

    active = {
      id: id, el: el, panel: panel,
      release: ST.a11y.trap(panel),
      offEsc: ST.a11y.onEsc(function () { close(id); }),
      onClose: opts.onClose
    };
    openId = id;
  }

  function close(id, opts) {
    opts = opts || {};
    id = id || openId;
    if (!id || openId !== id || !active) return;

    var a = active, el = a.el, panel = a.panel;
    var morphed = opts.morphTo ? morphClose(panel, opts.morphTo) : false;

    if (morphed) el.classList.add('st-morphing');
    el.classList.remove('st-open');
    a.release(); a.offEsc();

    ST.a11y.unlockScroll();
    ST.viewer.setDimmed(false);

    var dur = morphed ? 420 : 420;
    setTimeout(function () {
      el.setAttribute('aria-hidden', 'true');      /* SAU khi transition xong */
      el.classList.remove('st-morphing');
      if (morphed) {
        panel.getAnimations && panel.getAnimations().forEach(function (an) { an.cancel(); });
        Array.prototype.forEach.call(panel.children, function (c) {
          c.getAnimations && c.getAnimations().forEach(function (an) { an.cancel(); });
        });
      }
    }, dur);

    active = null;
    openId = null;
    ST.store.set('modal', null);
    ST.store.emit('modal:close', { id: id });
    if (!opts.silent) ST.a11y.restoreFocus();
    if (a.onClose) a.onClose();
  }

  /* ══ Placeholder cho overlay đã có sẵn trên site thật (D-09v2) ════════ */
  function openExisting(which) {
    var el = document.getElementById('st-existing');
    el.querySelector('#st-existing-title').textContent = I.t('existing.' + which + '.title');
    el.querySelector('.st-existing-body').textContent  = I.t('existing.' + which + '.body');
    open('st-existing');
  }

  /* ══ SHARE ════════════════════════════════════════════════════════════ */
  function fillShare() {
    var info = ST.viewer.info();
    var base = location.origin === 'null' || !location.origin
      ? location.href.split('?')[0]
      : location.origin + location.pathname;
    var url = base + '?pano=' + info.key;

    document.getElementById('st-share-url').value = url;
    document.querySelector('.st-share-scene').textContent =
      I.t('share.sceneFmt', { name: I.destName(info.dest) });

    document.querySelector('.st-share-social').innerHTML = D.SOCIAL.slice(0, 4).map(function (s) {
      return '<li><a href="' + esc(s.href) + '" target="_blank" rel="noopener" ' +
             'aria-label="' + esc(s.name) + '">' + icon(s.icon) + '</a></li>';
    }).join('');
  }

  function copyShare() {
    var input = document.getElementById('st-share-url');
    var ok = function () { ST.toast('toast.copied', 'success'); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(ok, fallbackCopy);
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      input.select();
      input.setSelectionRange(0, 99999);
      var done = false;
      try { done = document.execCommand('copy'); } catch (e) { done = false; }
      done ? ok() : ST.toast('toast.manualCopy', 'warn');
    }
  }

  /* ══ HELP ═════════════════════════════════════════════════════════════ */
  function renderHelp() {
    var steps = I.t('help.steps') || [];
    document.querySelector('.st-help-steps').innerHTML = steps.map(function (s) {
      return '<li><span class="st-help-ic">' + icon(s.icon) + '</span>' +
             '<div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></li>';
    }).join('');
  }

  /* ══ TOAST ════════════════════════════════════════════════════════════ */
  var toastIcons = { success: 'i-check', warn: 'i-help' };

  function toast(key, kind) {
    var box = document.getElementById('st-toast');
    if (!box) return;
    var item = document.createElement('div');
    item.className = 'st-toast-item' + (kind ? ' st-t-' + kind : '');
    item.innerHTML = (toastIcons[kind] ? icon(toastIcons[kind]) : '') +
                     '<span>' + esc(I.t(key)) + '</span>';
    box.appendChild(item);
    setTimeout(function () {
      item.classList.add('st-out');
      setTimeout(function () { item.remove(); }, 260);
    }, 2800);
  }

  /* ══ SWIPE đóng drawer ════════════════════════════════════════════════ */
  function bindDrawerSwipe() {
    var drawer = document.getElementById('st-drawer');
    var panel = drawer.querySelector('.st-drawer-panel');
    var x0 = 0, t0 = 0, on = false;

    panel.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a,button,input')) return;
      on = true; x0 = e.clientX; t0 = performance.now();
    });
    panel.addEventListener('pointerup', function (e) {
      if (!on) return;
      on = false;
      var dx = e.clientX - x0;
      var v = dx / Math.max(1, performance.now() - t0);
      if (dx > 60 || v > 0.4) close('st-drawer');
    });
  }

  /* ══ INIT ═════════════════════════════════════════════════════════════ */
  var O = {
    init: function () {
      /* [data-st-close] bind 1 lần cho toàn bộ modal */
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-st-close]');
        if (!t) return;
        var modal = t.closest('.st-modal');
        if (!modal) return;
        e.preventDefault();
        /* Welcome đóng thì morph về nút trong dock (Q12) */
        if (modal.id === 'st-welcome') { ST.welcome.close(); return; }
        close(modal.id);
      });

      document.getElementById('st-share-copy').addEventListener('click', copyShare);

      var hideChk = document.getElementById('st-help-hide');
      hideChk.checked = !!safeLS(function () { return localStorage.getItem('st.help.hide'); }, null);
      hideChk.addEventListener('change', function () {
        safeLS(function () {
          hideChk.checked ? localStorage.setItem('st.help.hide', '1')
                          : localStorage.removeItem('st.help.hide');
        });
      });

      renderHelp();
      bindDrawerSwipe();

      ST.store.on('modal:open', function (p) {
        if (p.id === 'st-share') fillShare();
      });
      ST.store.on('lang:change', function () {
        renderHelp();
        if (openId === 'st-share') fillShare();
        I.apply();
      });
    },

    open: open,
    close: close,
    closeAll: function () { if (openId) close(openId); },
    isOpen: function (id) { return openId === id; },
    current: function () { return openId; },
    openExisting: openExisting
  };

  ST.overlays = O;
  ST.toast = toast;
})();
