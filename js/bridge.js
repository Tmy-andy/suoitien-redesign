/* ═══════════════════════════════════════════════════════════════════════
   bridge.js — CẦU NỐI popup ↔ trang cha (D-46)

   Đây là seam DUY NHẤT mà popup chạm ra ngoài. Mọi thứ khác trong project
   không được biết là mình đang nằm trong iframe.

   Hai chiều:
     popup → cha : ready · navigate · close · resize
     cha → popup : lang · open (mở lại mà không reload iframe)

   Hai đường ĐI RA, thử theo thứ tự (D-46):
     1. Gọi thẳng `parent.VRCore.navigateToPano()` — chỉ được khi popup và
        trang cha CÙNG origin. Nhanh, không cần trang cha viết listener.
     2. `postMessage` — luôn chạy, kể cả khác origin.
   Đường 2 LUÔN được gửi kể cả khi đường 1 thành công: trang cha có thể muốn
   đóng iframe / ghi analytics dù không phải tự điều hướng.

   Xem docs/07-integration.md §7.2 để biết trang cha cần viết gì.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  /* Tiền tố `st:` để trang cha lọc được message của mình giữa đủ thứ
     postMessage khác trên trang (3DVista, GTM, chat widget… đều bắn lung tung). */
  var NS = 'st:';

  /* Trong iframe thì `parent !== window`. Mở thẳng file bằng double-click thì
     bằng nhau — lúc đó mọi lời gọi ra ngoài đều là no-op, popup vẫn chạy để
     xem thiết kế. Đây là lý do có thể mở index.html trực tiếp. */
  var embedded = window.parent !== window;

  /* Origin của trang cha, nếu đọc được. `document.referrer` là cách duy nhất
     lấy được nó từ trong iframe khi khác origin (`parent.location` bị chặn). */
  var parentOrigin = (function () {
    try {
      if (document.referrer) return new URL(document.referrer).origin;
    } catch (e) { /* referrer rỗng hoặc không parse được */ }
    return '*';
  })();

  /* Same-origin hay không: thử chạm vào `parent.location.href`. Khác origin
     thì trình duyệt ném SecurityError — đó chính là phép thử, không có API
     nào hỏi thẳng được. */
  function sameOrigin() {
    if (!embedded) return false;
    try { return typeof window.parent.location.href === 'string'; }
    catch (e) { return false; }
  }

  function send(type, payload) {
    if (!embedded) {
      /* MOCK: mở trực tiếp (không iframe) → chỉ log để dev thấy luồng. */
      if (ST.DEBUG) console.log('[bridge →] ' + NS + type, payload || {});
      return;
    }
    var msg = { type: NS + type }, k;
    for (k in (payload || {})) {
      if (Object.prototype.hasOwnProperty.call(payload, k)) msg[k] = payload[k];
    }
    try {
      window.parent.postMessage(msg, parentOrigin);
    } catch (e) {
      if (ST.DEBUG) console.warn('[bridge] postMessage lỗi', e);
    }
  }

  /* ── Đường 1: gọi thẳng VRCore của trang cha ────────────────────────────
     Chữ ký thật trên site: VRCore.navigateToPano(tour, panoId) — nhưng
     `tour` là object nội bộ của 3DVista, tên biến có thể khác. Vì vậy thử
     lần lượt vài dạng rồi mới chịu thua, thay vì đoán cứng một dạng.

     MOCK: khi ghép thật, xoá vòng thử này và gọi đúng 1 dạng đã xác minh. */
  function callVRCoreDirect(pano) {
    if (!sameOrigin()) return false;
    var P = window.parent, core = P.VRCore;
    if (!core || typeof core.navigateToPano !== 'function') return false;
    try {
      var tour = P.tour || (core.getTour && core.getTour()) || null;
      if (tour) core.navigateToPano(tour, pano);
      else core.navigateToPano(pano);
      return true;
    } catch (e) {
      if (ST.DEBUG) console.warn('[bridge] gọi VRCore trực tiếp lỗi', e);
      return false;
    }
  }

  /* ── Nhận từ trang cha ────────────────────────────────────────────────── */
  var handlers = {};        /* { 'lang': [fn, …], 'open': [fn, …] } */

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d.type !== 'string' || d.type.indexOf(NS) !== 0) return;
    /* Không kiểm origin ở đây: trang cha có thể nằm ở domain bất kỳ (khách tự
       nhúng), và message vào đây chỉ điều khiển ngôn ngữ + mở lại popup —
       không có gì đáng để tấn công. Nếu về sau bridge nhận thêm dữ liệu nhạy
       cảm thì PHẢI chốt origin trắng danh sách ở đúng chỗ này. */
    var name = d.type.slice(NS.length);
    (handlers[name] || []).forEach(function (fn) { fn(d); });
  });

  ST.bridge = {
    embedded:   function () { return embedded; },
    sameOrigin: sameOrigin,

    /** Popup đã dựng xong — trang cha có thể bỏ trạng thái loading của iframe. */
    ready: function (size) { send('ready', size); },

    /**
     * Người dùng chọn một điểm.
     * @param {Object} dest  destination trong ST.data (có .key, .pano, .name)
     * @returns {boolean} true nếu đã điều hướng được ngay bằng đường 1
     */
    navigate: function (dest) {
      var direct = callVRCoreDirect(dest.pano);
      send('navigate', { key: dest.key, pano: dest.pano, name: dest.name, direct: direct });
      return direct;
    },

    /** Popup đã đóng xong (animation chạy hết) — trang cha gỡ/ẩn iframe. */
    close: function (reason) { send('close', { reason: reason }); },

    /** Popup báo chiều cao thật, cho trang cha nào muốn iframe co theo. */
    resize: function (w, h) { send('resize', { w: w, h: h }); },

    /** @param {'lang'|'open'} name */
    on: function (name, fn) {
      (handlers[name] = handlers[name] || []).push(fn);
    }
  };
})();
