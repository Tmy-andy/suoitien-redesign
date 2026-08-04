/* ═══════════════════════════════════════════════════════════════════════
   a11y.js — focus trap + Esc cho popup.

   Bản cũ còn có lockScroll/unlockScroll và rememberFocus/restoreFocus —
   cả hai đều mất nghĩa khi popup là một document riêng trong iframe:
     • khoá cuộn: `body` của popup vốn đã `overflow: hidden`; còn việc khoá
       cuộn của TRANG CHA thì popup không với tới được (khác document).
       → trách nhiệm của trang cha, xem docs/07-integration.md §7.3.
     • trả focus: focus trước khi popup mở nằm ở document của trang cha,
       `document.activeElement` trong đây không nhìn thấy nó.
       → cũng là trách nhiệm của trang cha.

   ⚠️ GIỚI HẠN không sửa được từ trong iframe (docs/07-integration.md §7.3):
     • Esc chỉ bắt được khi focus đang Ở TRONG iframe. Người dùng bấm ra
       ngoài rồi bấm Esc thì trang cha phải tự nghe.
     • `aria-modal` không che được nội dung trang cha khỏi screen reader —
       nó chỉ có tác dụng trong cùng một cây accessibility.
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

  ST.a11y = {
    /** Bẫy Tab trong panel. Trả về hàm release(). */
    trap: function (panel) {
      function onKey(e) {
        if (e.key !== 'Tab') return;
        var list = focusables(panel);
        if (!list.length) { e.preventDefault(); return; }
        var first = list[0], last = list[list.length - 1];
        var active = document.activeElement;

        /* Không có bẫy này thì Tab ở thẻ cuối sẽ nhảy RA KHỎI iframe, sang
           trang cha — người dùng bàn phím mất dấu popup mà không hiểu vì sao. */
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

    focusables: focusables
  };
})();
