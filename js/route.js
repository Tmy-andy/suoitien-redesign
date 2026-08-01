/* ═══════════════════════════════════════════════════════════════════════
   route.js — M2 · OVERLAY CHỈ ĐƯỜNG (clone bản có sẵn trên trip360 · D-43)

   MOCK toàn bộ phần tính toán:
     · quãng đường  = khoảng cách Euclid trên bản đồ × hệ số vòng vèo
     · chỉ dẫn      = sinh từ hàm băm của cặp (điểm đi, điểm đến)
   Sinh từ HÀM BĂM chứ không dùng Math.random: mở đi mở lại cùng một cặp
   điểm phải ra y hệt kết quả, nếu không thì demo trông như bị lỗi.

   Bản thật thay 2 hàm `distance()` + `buildSteps()` bằng lời gọi Dijkstra
   trên map_graph.json — xem docs/07-integration.md §7.6.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;
  var elFrom, elTo, elSum, elSteps, elStepsBtn, elPins, elLine, elLineU, elTools, elLang;
  var from = null, to = null;
  var zoom = 1;

  var TOOLS = [
    { id:'st-rt-split',   icon:'i-split',       i18n:'route.tool.split',   act:'wip' },
    { id:'st-rt-list',    icon:'i-list',        i18n:'route.tool.list',    act:'places' },
    { id:'st-rt-locate',  icon:'i-my-location', i18n:'route.tool.locate',  act:'reset' },
    { id:'st-rt-compass', icon:'i-compass',     i18n:'route.tool.compass', act:'wip' },
    { id:'st-rt-in',      icon:'i-plus',        i18n:'route.tool.zoomIn',  act:'zoom:1' },
    { id:'st-rt-out',     icon:'i-minus',       i18n:'route.tool.zoomOut', act:'zoom:-1' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  /* FNV-1a — chỉ cần ổn định và trải đều, không cần chất lượng mật mã */
  function hash(s) {
    var h = 2166136261, i;
    for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function bits(h, i, n) { return (h >>> ((i * 5) % 27)) % n; }

  /* Nhãn option: "1-CỔNG THIÊN TIÊN MÔN · 1-Fairyland Gate" — song ngữ đồng
     thời, đúng như bản thật (xem ghi chú BI trong i18n.js). */
  function optLabel(d) {
    var no = d.no ? d.no + '-' : '';
    return no + d.name.toUpperCase() + ' · ' + no + (d.nameEn || d.name);
  }

  function options(sel, selected) {
    sel.innerHTML = D.keys().map(function (k) {
      var d = D.get(k);
      return '<option value="' + esc(k) + '"' + (k === selected ? ' selected' : '') + '>' +
             esc(optLabel(d)) + '</option>';
    }).join('');
  }

  /* ══ Tính toán (MOCK) ══════════════════════════════════════════════════ */
  function distance(a, b) {
    var W = D.WAYFIND;
    var dx = (b.x - a.x) * W.mPerX;
    var dy = (b.y - a.y) * W.mPerY;
    var m = Math.sqrt(dx * dx + dy * dy) * W.detour;
    return Math.max(5, Math.round(m / 5) * 5);      /* làm tròn 5 m cho dễ đọc */
  }

  function buildSteps(a, b, total) {
    var h = hash(a.key + '>' + b.key);
    var n = 3 + (h % 4);                             /* 3–6 chặng ở giữa */
    var out = [{ kind:'start',
                 vi: I.t('route.step.startVi', { name: a.name }),
                 en: I.t('route.step.startEn', { name: a.nameEn || a.name }) }];

    /* Chia `total` thành n đoạn theo trọng số từ hàm băm, làm tròn 5 m */
    var w = [], sum = 0, i, x;
    for (i = 0; i < n; i++) { x = 1 + bits(h, i, 8); w.push(x); sum += x; }

    var acc = 0, prev = '';
    for (i = 0; i < n; i++) {
      var d = (i === n - 1) ? total - acc
                            : Math.max(5, Math.round(total * w[i] / sum / 5) * 5);
      if (d > total - acc) d = total - acc;
      if (d < 5) d = 5;
      acc += d;

      var bit  = bits(h, i + 1, 4);
      var kind = bit === 0 ? 'on' : (bit === 1 ? 'left' : 'right');
      /* Hai chặng "đi thẳng" liền nhau đọc như lỗi lặp — chỉ dẫn thật luôn
         cắt đoạn thẳng ở chỗ có rẽ. Gặp thì ép thành một cú rẽ. */
      if (kind === 'on' && prev === 'on') kind = (bit + i) % 2 ? 'left' : 'right';
      prev = kind;
      var j = 'j' + (1 + bits(h, i + 2, 70));

      if (kind === 'on') {
        out.push({ kind:'on',
                   vi: I.t('route.step.onVi', { d: d, j: j }),
                   en: I.t('route.step.onEn', { d: d }) });
      } else {
        out.push({ kind: kind,
                   vi: I.t('route.step.turnVi', { d: d, j: j, dir: I.t('route.dirVi.' + kind) }),
                   en: I.t('route.step.turnEn', { d: d,        dir: I.t('route.dirEn.' + kind) }) });
      }
    }

    out.push({ kind:'end',
               vi: I.t('route.step.endVi', { name: b.name }),
               en: I.t('route.step.endEn', { name: b.nameEn || b.name }) });
    return out;
  }

  /* Đường đi: A → vài điểm gãy → B. Số điểm gãy = số chặng nên hình vẽ và
     danh sách chỉ dẫn luôn kể cùng một câu chuyện. Toạ độ % → viewBox 1000×620. */
  function pathD(a, b) {
    var h = hash(a.key + '>' + b.key);
    var n = 3 + (h % 4);
    var dx = b.x - a.x, dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var px = -dy / len, py = dx / len;              /* pháp tuyến đơn vị */
    var pts = [[a.x, a.y]], i;

    for (i = 1; i < n; i++) {
      var t   = i / n;
      var off = (bits(h, i, 8) - 3.5) * 2.4;        /* lệch ±8,4% cho đỡ thẳng đơ */
      pts.push([a.x + dx * t + px * off, a.y + dy * t + py * off]);
    }
    pts.push([b.x, b.y]);

    return pts.map(function (p, k) {
      return (k ? 'L' : 'M') + (p[0] * 10).toFixed(1) + ' ' + (p[1] * 6.2).toFixed(1);
    }).join(' ');
  }

  /* ══ Render ════════════════════════════════════════════════════════════ */
  function renderSummary(a, b) {
    if (a.key === b.key) {
      elSum.className = 'st-warn';
      elSum.innerHTML = '<div class="st-rt-sum-vi">' + esc(I.t('route.same')) + '</div>';
      return 0;
    }
    elSum.className = '';
    var m = distance(a, b);
    var min = Math.max(1, Math.ceil(m / D.WAYFIND.walkMpm));

    elSum.innerHTML =
      '<div class="st-rt-sum-vi">' +
        esc(I.t('route.sumVi', { d: '§d§', t: '§t§' }))
          .replace('§d§', '<b>' + m + '</b>').replace('§t§', '<b>' + min + '</b>') +
      '</div>' +
      '<div class="st-rt-sum-en">' + esc(I.t('route.sumEn', { d: m, t: min })) + '</div>';
    return m;
  }

  function renderSteps(a, b, m) {
    if (!m) { elSteps.innerHTML = ''; return; }
    elSteps.innerHTML = buildSteps(a, b, m).map(function (s) {
      var ic = { start:'i-flag', left:'i-turn-left', right:'i-turn-right',
                 on:'i-straight', end:'i-goal' }[s.kind];
      return '<li>' +
        '<span class="st-rt-ic st-k-' + s.kind + '">' + icon(ic) + '</span>' +
        '<span><span class="st-rt-vi">' + esc(s.vi) + '</span>' +
        '<span class="st-rt-en">' + esc(s.en) + '</span></span>' +
      '</li>';
    }).join('');
  }

  function renderPins(a, b) {
    elPins.innerHTML = D.keys().map(function (k) {
      var d = D.get(k);
      if (!d.no) return '';
      var isA = k === a.key, isB = k === b.key;
      var cls = 'st-rt-pin' + (isA ? ' st-a' : isB ? ' st-b' : '');
      var txt = isA ? 'A' : isB ? 'B' : d.no;
      var tip = I.destName(d) + (isA || isB ? '' : ' — ' + I.t('places.goHint'));

      return '<button type="button" class="' + cls + '" data-key="' + esc(k) + '"' +
             ' data-role="' + (isA ? 'a' : isB ? 'b' : 'pin') + '"' +
             ' style="left:' + d.x + '%;top:' + d.y + '%"' +
             ' title="' + esc(tip) + '" aria-label="' + esc(tip) + '">' + esc(txt) + '</button>';
    }).join('');
  }

  function renderPath(a, b) {
    var d = (a.key === b.key) ? '' : pathD(a, b);
    elLine.setAttribute('d', d);
    elLineU.setAttribute('d', d);

    /* Khởi động lại hoạt ảnh vẽ đường: gán 'none' rồi trả về ở frame sau —
       cách duy nhất chắc ăn để CSS animation chạy lại trên cùng phần tử. */
    elLine.style.animation = 'none';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { elLine.style.animation = ''; });
    });
  }

  function render() {
    var a = D.get(from), b = D.get(to);
    if (!a || !b) return;
    var m = renderSummary(a, b);
    renderSteps(a, b, m);
    renderPins(a, b);
    renderPath(a, b);
  }

  function renderTools() {
    elTools.innerHTML = TOOLS.map(function (t) {
      var lbl = I.t(t.i18n);
      return '<button id="' + t.id + '" type="button" class="st-rt-tool" data-act="' + t.act + '"' +
             ' title="' + esc(lbl) + '" aria-label="' + esc(lbl) + '">' + icon(t.icon) + '</button>';
    }).join('');
  }

  function setZoom(next) {
    zoom = Math.min(2.5, Math.max(1, next));
    document.getElementById('st-rt-canvas').style.setProperty('--st-rt-z', zoom);
  }

  function syncLang() {
    elLang.querySelector('span').textContent = I.lang === 'vi' ? 'Tiếng Việt' : 'English';
  }

  /* ══ INIT ══════════════════════════════════════════════════════════════ */
  var R = {
    init: function () {
      elFrom     = document.getElementById('st-rt-from');
      elTo       = document.getElementById('st-rt-to');
      elSum      = document.getElementById('st-rt-summary');
      elSteps    = document.getElementById('st-rt-steps');
      elStepsBtn = document.getElementById('st-rt-steps-toggle');
      elPins     = document.getElementById('st-rt-pins');
      elLine     = document.getElementById('st-rt-line');
      elLineU    = document.getElementById('st-rt-line-under');
      elTools    = document.getElementById('st-rt-tools');
      elLang     = document.getElementById('st-rt-lang');
      if (!elFrom) return;

      /* pathLength=100 → dasharray tính theo %, hoạt ảnh vẽ không phụ thuộc
         đường dài hay ngắn (xem css/route.css) */
      elLine.setAttribute('pathLength', '100');

      renderTools();
      syncLang();

      elFrom.addEventListener('change', function () { from = elFrom.value; render(); });
      elTo.addEventListener('change',   function () { to   = elTo.value;   render(); });

      document.getElementById('st-rt-swap').addEventListener('click', function () {
        var t = from; from = to; to = t;
        elFrom.value = from; elTo.value = to;
        render();
      });

      /* MOCK: chưa nối Geolocation API. Bản thật gọi navigator.geolocation rồi
         chiếu toạ độ lên map_geo.json để tìm điểm gần nhất. */
      document.getElementById('st-rt-mine').addEventListener('click', function () {
        ST.toast('toast.wip');
      });

      document.getElementById('st-rt-collapse').addEventListener('click', function () {
        var on = document.getElementById('st-route').classList.toggle('st-rt-off');
        this.setAttribute('aria-expanded', on ? 'false' : 'true');
        this.setAttribute('aria-label', I.t(on ? 'route.expand' : 'route.collapse'));
      });

      elStepsBtn.addEventListener('click', function () {
        var open = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', open ? 'false' : 'true');
        elSteps.hidden = open;
      });

      elLang.addEventListener('click', function () { I.toggle(); });

      elTools.addEventListener('click', function (e) {
        var btn = e.target.closest('.st-rt-tool');
        if (!btn) return;
        var act = btn.getAttribute('data-act');
        if (act === 'reset')       { setZoom(1); }
        else if (act === 'places') { ST.overlays.open('st-places'); }
        else if (act.indexOf('zoom:') === 0) { setZoom(zoom + Number(act.split(':')[1]) * 0.25); }
        else                       { ST.toast('toast.wip'); }
      });

      /* Pin số → đặt làm ĐIỂM ĐẾN. Mốc A/B → nhảy thẳng vào ảnh 360°. */
      elPins.addEventListener('click', function (e) {
        var pin = e.target.closest('.st-rt-pin');
        if (!pin) return;
        var key = pin.getAttribute('data-key');
        if (pin.getAttribute('data-role') === 'pin') {
          to = key; elTo.value = key; render();
        } else {
          ST.overlays.close('st-route');
          ST.viewer.goTo(key);
        }
      });

      ST.store.on('modal:open', function (p) {
        if (p.id !== 'st-route') return;
        /* Mặc định: đi TỪ chỗ đang đứng — thông tin duy nhất ta thật sự biết */
        var here = ST.viewer.info();
        if (!from) from = (here && here.key) || D.DEFAULT_KEY;
        if (!to || to === from) {
          to = D.keys().filter(function (k) { return k !== from; })[0];
        }
        options(elFrom, from);
        options(elTo, to);
        render();
      });

      ST.store.on('lang:change', function () {
        syncLang();
        renderTools();
        options(elFrom, from);
        options(elTo, to);
        I.apply(document.getElementById('st-route'));
        render();
      });
    }
  };

  ST.route = R;
})();
