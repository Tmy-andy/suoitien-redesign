/* ═══════════════════════════════════════════════════════════════════════
   store.js — state tập trung + event bus. Không framework.
   Xem docs/05-flows.md §5.2
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var state = {
    phase:       'boot',      /* boot | loading | ready */
    modal:       null,        /* id modal đang mở */
    popover:     null,
    sceneKey:    ST.data.DEFAULT_KEY,
    navHidden:   false,
    navHideLock: false,       /* true khi modal mở → cấm ẩn header */
    autoRotate:  false,
    soundOn:     false,
    fullscreen:  false,
    isDragging:  false,
    welcomeSeen: false,
    debug:       false,
    yaw:         0
  };

  var handlers = {};

  function emit(evt, payload) {
    var list = handlers[evt];
    if (!list) return;
    for (var i = list.length - 1; i >= 0; i--) {
      try { list[i](payload); }
      catch (e) { if (state.debug) console.error('[store] handler lỗi @' + evt, e); }
    }
  }

  var S = {
    state: state,

    get: function (k) { return state[k]; },

    set: function (k, v) {
      if (state[k] === v) return;              /* chỉ emit khi THỰC SỰ đổi */
      var old = state[k];
      state[k] = v;
      emit('change:' + k, { value: v, prev: old });
      emit('change', { key: k, value: v, prev: old });
    },

    patch: function (obj) {
      var changed = [];
      Object.keys(obj).forEach(function (k) {
        if (state[k] !== obj[k]) { changed.push([k, state[k]]); state[k] = obj[k]; }
      });
      changed.forEach(function (p) {
        emit('change:' + p[0], { value: state[p[0]], prev: p[1] });
      });
      if (changed.length) emit('change', { keys: changed.map(function (p) { return p[0]; }) });
    },

    on: function (evt, fn) {
      (handlers[evt] = handlers[evt] || []).push(fn);
      return function off() {
        var l = handlers[evt];
        if (!l) return;
        var i = l.indexOf(fn);
        if (i > -1) l.splice(i, 1);
      };
    },

    emit: emit
  };

  ST.store = S;
})();
