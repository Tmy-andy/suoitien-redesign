/* ═══════════════════════════════════════════════════════════════════════
   a11y.js — focus trap, Esc, scroll lock, nhớ/trả focus.
   Viết 1 lần, mọi modal dùng chung.  Xem docs/04-modals.md §4.2
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  var escStack = [];      /* Esc chỉ kích hoạt handler TRÊN CÙNG */
  var focusStack = [];
  var lockCount = 0;

  function visible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function focusables(root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), visible);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    var top = escStack[escStack.length - 1];
    if (top) { e.preventDefault(); top(); }
  });

  var A = {
    init: function () { /* listener Esc đã gắn ở trên */ },

    lockScroll: function () {
      lockCount++;
      if (lockCount > 1) return;
      var sw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.classList.add('st-locked');
      if (sw > 0) document.documentElement.style.setProperty('padding-right', sw + 'px');
    },

    unlockScroll: function () {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount > 0) return;
      document.documentElement.classList.remove('st-locked');
      document.documentElement.style.removeProperty('padding-right');
    },

    /** Bẫy Tab trong panel. Trả về hàm release(). */
    trap: function (panel) {
      function onKey(e) {
        if (e.key !== 'Tab') return;
        var list = focusables(panel);
        if (!list.length) { e.preventDefault(); return; }
        var first = list[0], last = list[list.length - 1];
        var active = document.activeElement;

        if (e.shiftKey && (active === first || !panel.contains(active))) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
          e.preventDefault(); first.focus();
        }
      }
      panel.addEventListener('keydown', onKey);
      return function release() { panel.removeEventListener('keydown', onKey); };
    },

    onEsc: function (fn) {
      escStack.push(fn);
      return function off() {
        var i = escStack.indexOf(fn);
        if (i > -1) escStack.splice(i, 1);
      };
    },

    rememberFocus: function () {
      focusStack.push(document.activeElement);
    },

    restoreFocus: function () {
      var el = focusStack.pop();
      if (el && typeof el.focus === 'function' && document.contains(el) && visible(el)) {
        el.focus();
      }
    },

    focusables: focusables,

    /** Roving tabindex cho nhóm nút (mũi tên di chuyển) — dùng cho hotspot */
    roving: function (container, selector) {
      function items() {
        return Array.prototype.slice.call(container.querySelectorAll(selector));
      }
      function setIndex(list, i) {
        list.forEach(function (el, j) { el.tabIndex = j === i ? 0 : -1; });
      }
      var list = items();
      if (!list.length) return function () {};
      setIndex(list, 0);

      function onKey(e) {
        var keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
        if (keys.indexOf(e.key) === -1) return;
        var l = items();
        var cur = l.indexOf(document.activeElement);
        if (cur === -1) return;
        e.preventDefault();
        var next = cur;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % l.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (cur - 1 + l.length) % l.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = l.length - 1;
        setIndex(l, next);
        l[next].focus();
      }
      container.addEventListener('keydown', onKey);
      return function release() { container.removeEventListener('keydown', onKey); };
    }
  };

  ST.a11y = A;
})();
