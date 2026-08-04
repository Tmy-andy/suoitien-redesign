/* ═══════════════════════════════════════════════════════════════════════
   popup.js — bootstrap + vòng đời của BẢN 1 (D-46 · D-52)

   Ba trạng thái:
     A `deck`   — 3D carousel 9 KHU VỰC (D.GROUPS)
     B `list`   — danh sách các điểm của một khu vực, hoặc kết quả tìm kiếm
     M          — bản đồ 2D, phủ LÊN cả hai (js/map2d.js), không phải trạng
                  thái thứ ba: đóng bản đồ là quay lại đúng chỗ đang đứng.

   Trước D-52 mỗi thẻ carousel là MỘT ĐIỂM và bấm là đi VR ngay. Giờ thẻ là
   một KHU VỰC và bấm ra danh sách — thêm một tầng, đổi lại thấy được cả 20
   điểm thay vì 12, và có chỗ để đặt ô tìm kiếm.

   Nạp CUỐI CÙNG.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n, B = ST.bridge;
  var root, panel, deckEl, titleEl, headEl;
  var listEl, listGrid, listTitle, listCount, listEmpty;
  var searchIn, searchBox;
  var cr = null, map = null;
  var state = 'deck';               /* 'deck' | 'list' */
  var groupKey = null;              /* khu vực đang mở, null = kết quả tìm kiếm */
  var query = '';
  var variant = 'a';
  var openedAt = 0;
  var closing = false;
  var releaseTrap = null, offEsc = null;

  var qs = {};
  (function parse() {
    var s = location.search.replace(/^\?/, '');
    if (!s) return;
    s.split('&').forEach(function (p) {
      var kv = p.split('=');
      qs[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  })();

  ST.DEBUG = qs.debug === '1';

  /* MOCK: bản thật nối vào VR360Track.event(), hoặc để trang cha ghi từ
     postMessage `st:navigate` — xem docs/05-flows.md §5.5 */
  ST.track = function (name, payload) {
    if (ST.DEBUG) console.log('[track]', name, payload || {});
  };

  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function gname(g) { return I.lang === 'en' ? g.en : g.vi; }
  function gsub(g)  { return I.lang === 'en' ? g.subEn : g.subVi; }

  /* ══ TRẠNG THÁI A — thẻ KHU VỰC ═══════════════════════════════════════
     Ảnh bìa lấy từ `g.cover`; ảnh nào cũng `object-fit: cover` nên khung thẻ
     3:2 không bao giờ lộ mảng trống dù ảnh gốc tỉ lệ khác. */
  function renderCard(g, i) {
    var img = D.imgOf(g.cover);
    return (
      /* width/height chỉ để khai TỈ LỆ (chống layout shift) — cỡ thật do CSS
         quyết. Ảnh nguồn từ 600×400 tới 1200×800 tuỳ điểm, xem docs/06 §6.8. */
      '<img class="st-cr-img" src="' + esc(img) + '" alt=""' +
        (i === 0 ? '' : ' loading="lazy"') + ' decoding="async" width="1200" height="800">' +
      '<span class="st-cr-veil" aria-hidden="true"></span>' +
      '<span class="st-cr-badge st-cr-count">' + esc(I.t('list.count', { n: g.keys.length })) + '</span>' +
      '<span class="st-cr-body">' +
        '<span class="st-cr-cat">' + esc(gsub(g)) + '</span>' +
        '<span class="st-cr-name">' + esc(gname(g)) + '</span>' +
        '<span class="st-cr-go">' + esc(I.t('list.openArea')) + icon('i-arrow-right') + '</span>' +
      '</span>'
    );
  }

  function labelCards() {
    Array.prototype.forEach.call(deckEl.querySelectorAll('.st-cr-card'), function (b) {
      var g = D.GROUPS[+b.getAttribute('data-i')];
      if (!g) return;
      b.setAttribute('data-name', gname(g));
      b.setAttribute('aria-label',
        gname(g) + ' — ' + gsub(g) + '. ' +
        I.t('list.count', { n: g.keys.length }) + '. ' + I.t('list.openArea') + '.');
    });
  }

  /* ══ TRẠNG THÁI B — danh sách ═════════════════════════════════════════ */
  function currentKeys() {
    if (query) {
      var q = D.deaccent(query);
      return Object.keys(D.DESTINATIONS).filter(function (k) {
        var d = D.DESTINATIONS[k];
        return D.deaccent(d.name).indexOf(q) > -1 ||
               D.deaccent(d.nameEn || '').indexOf(q) > -1;
      });
    }
    return groupKey ? D.group(groupKey).keys.slice() : [];
  }

  function renderList() {
    var keys = currentKeys();

    listTitle.textContent = query ? I.t('list.results') : (groupKey ? gname(D.group(groupKey)) : '');
    listCount.textContent = I.t('list.count', { n: keys.length });
    listEmpty.hidden = keys.length > 0;

    /* THẺ ẢNH, không phải DÒNG (D-56).
       Bản trước là hàng ngang: ảnh 104px bên trái · chữ giữa · cột nút xanh
       bên phải. Ba khối màu khác nhau trên mỗi dòng, 12 dòng chồng lên nhau
       thành một bảng dữ liệu — mà thứ đang chọn là CẢNH để đi xem, không phải
       một hàng trong bảng.

       Giờ mỗi điểm là một thẻ ảnh phủ kín, chữ nằm đè lên đáy — đúng ngôn ngữ
       của thẻ carousel ở trạng thái trước đó và của ô wall bên bản 2. Ba màn
       của cùng một sản phẩm thì phải trông như cùng một sản phẩm. */
    listGrid.innerHTML = keys.map(function (k, i) {
      var d = D.get(k);
      if (!d) return '';
      var img = D.imgOf(k);
      return '<li style="--i:' + i + '">' +
        '<button type="button" class="st-li" data-key="' + k + '">' +
        (img
          ? '<img class="st-li-img" src="' + esc(img) + '" alt="" loading="lazy" ' +
            'decoding="async" width="1200" height="800">'
          /* 8 điểm chưa có ảnh (Q-38) — nền brand + số hiệu bản đồ, KHÔNG để
             trống: một ô xám trơn trông như lỗi tải ảnh. */
          : '<span class="st-li-noimg">' + esc(d.no || '·') + '</span>') +
        '<span class="st-li-veil" aria-hidden="true"></span>' +
        (d.no ? '<span class="st-li-no">' + esc(d.no) + '</span>' : '') +
        (D.mustOf(k) ? '<span class="st-li-must">' + icon('i-star') + '</span>' : '') +
        '<span class="st-li-body">' +
          '<span class="st-li-cat">' + esc(D.catLabel(d, I.lang)) + '</span>' +
          '<span class="st-li-name">' + esc(I.destName(d)) + '</span>' +
          '<span class="st-li-blurb">' + esc(I.destBlurb(d)) + '</span>' +
          '<span class="st-li-cta">' + icon('i-vr') +
            '<span>' + esc(I.t('list.go')) + '</span>' + icon('i-arrow-right') +
          '</span>' +
        '</span>' +
      '</button></li>';
    }).join('');

    /* Cuộn về đầu: đổi khu vực mà giữ nguyên vị trí cuộn cũ thì danh sách mới
       hiện ra ở giữa chừng, trông như đã bị bấm nhầm. */
    listGrid.scrollTop = 0;
  }

  function toList(key, fromSearch) {
    groupKey = key;
    state = 'list';
    if (cr) cr.stop();
    renderList();

    root.classList.add('st-state-list');
    deckEl.setAttribute('aria-hidden', 'true');
    listEl.hidden = false;
    listEl.removeAttribute('aria-hidden');

    if (!fromSearch) listTitle.focus();
    ST.track('area_open', { area: key || 'search', n: currentKeys().length });
  }

  function toDeck() {
    state = 'deck';
    groupKey = null;
    if (query) { query = ''; searchIn.value = ''; searchBox.classList.remove('st-on'); }

    root.classList.remove('st-state-list');
    listEl.hidden = true;
    listEl.setAttribute('aria-hidden', 'true');
    deckEl.removeAttribute('aria-hidden');
    if (cr) cr.start();

    var c = deckEl.querySelector('.st-cr-card.st-active');
    if (c) c.focus();
  }

  /* ══ Đi VR ════════════════════════════════════════════════════════════ */
  function goVR(dest, el) {
    if (closing || !dest) return;
    if (el) el.classList.add('st-going');
    if (cr) cr.stop();
    ST.track('popup_go', { key: dest.key, from: map && map.isOpen() ? 'map' : state,
                           dwellMs: Date.now() - openedAt });
    B.navigate(dest);
    close('navigate');
  }

  /* ══ Bản đồ 2D ════════════════════════════════════════════════════════
     "all" → toàn bộ 20 điểm có toạ độ. "area" → đúng bộ đang hiện trên màn,
     kể cả khi đó là kết quả tìm kiếm. Một hàm, khác mỗi tham số. */
  function openMap(scope) {
    var keys, label;
    if (scope === 'area' && (groupKey || query)) {
      keys = currentKeys();
      label = query ? I.t('list.results') : gname(D.group(groupKey));
    } else {
      keys = Object.keys(D.MAP_META);
      label = '';
    }
    map.open(keys, label);
  }

  /* ══ Đóng ═════════════════════════════════════════════════════════════ */
  function close(reason) {
    if (closing) return;
    closing = true;
    if (map && map.isOpen()) map.close();
    root.classList.remove('st-open');
    root.classList.add('st-closing');
    if (releaseTrap) releaseTrap();
    if (offEsc) offEsc();
    if (cr) cr.stop();
    ST.track('popup_close', { reason: reason, state: state, dwellMs: Date.now() - openedAt });
    setTimeout(function () { B.close(reason); }, reduced() ? 0 : 300);
  }

  /* Esc đi ngược từng tầng một: bản đồ → danh sách → đóng. Đóng thẳng từ
     tầng trong cùng làm người dùng mất hết ngữ cảnh chỉ bằng một phím. */
  function onEscape() {
    if (map && map.isOpen()) { map.close(); return; }
    if (state === 'list') { toDeck(); return; }
    close('esc');
  }

  function arm() {
    if (releaseTrap) releaseTrap();
    if (offEsc) offEsc();
    releaseTrap = ST.a11y.trap(root);
    offEsc = ST.a11y.onEsc(onEscape);
  }

  /* ══ i18n ═════════════════════════════════════════════════════════════ */
  function applyTitle() {
    var titles = I.t('popup.titles') || {};
    titleEl.textContent = titles[variant] || titles.a;
  }
  function applyLang() {
    applyTitle();
    I.apply();
    cr.rerender();
    labelCards();
    if (state === 'list') renderList();
    if (map) map.applyLang();
  }

  /* ══ Mở lại (trang cha gửi st:open) ═══════════════════════════════════ */
  function open() {
    closing = false;
    openedAt = Date.now();
    root.classList.remove('st-closing');
    Array.prototype.forEach.call(root.querySelectorAll('.st-going'), function (n) {
      n.classList.remove('st-going');
    });
    if (state === 'list') toDeck();
    cr.go(0);

    /* Bỏ .st-open một frame rồi gắn lại — CSS animation chỉ khởi động khi
       class được THÊM; giữ nguyên thì popup mở lại lần 2 hiện ra cứng đơ. */
    requestAnimationFrame(function () {
      root.classList.add('st-open');
      cr.start();
      titleEl.focus();
      arm();
    });
    ST.track('popup_shown', {});
  }

  /* ══ BOOT ═════════════════════════════════════════════════════════════ */
  function boot() {
    root      = document.getElementById('st-popup');
    panel     = root.querySelector('.st-popup-inner');
    deckEl    = document.getElementById('st-popup-deck');
    titleEl   = document.getElementById('st-popup-title');
    headEl    = root.querySelector('.st-popup-head');
    listEl    = document.getElementById('st-list');
    listGrid  = listEl.querySelector('.st-list-grid');
    listTitle = listEl.querySelector('.st-list-title');
    listCount = listEl.querySelector('.st-list-count');
    listEmpty = listEl.querySelector('.st-list-empty');
    searchIn  = document.getElementById('st-search-input');
    searchBox = root.querySelector('.st-search');

    I.init(/^(vi|en)$/.test(qs.lang) ? qs.lang : null);
    if (qs.title && /^[abc]$/.test(qs.title)) variant = qs.title;

    cr = ST.carousel.create(deckEl, {
      items: D.GROUPS,
      render: renderCard,
      onPick: function (g) { toList(g.key); },
      /* 2 preview mỗi bên → 5 thẻ (D-55). Đổi được vì D-54 đã làm thẻ giữa to
         hẳn lên: bậc ±2 giờ là lớp nền có chiều sâu, không phải "thêm 2 thứ
         nữa phải chọn". Dưới 1280px css/responsive.css tự ẩn bậc ±2. */
      visible: 2,
      /* 3,0s. Trừ 720ms transition còn ~2,3s đứng yên mỗi thẻ — vẫn đủ đọc
         tên khu vực, mà cả vòng 9 khu vực chỉ mất 27s thay vì 32s.
         Ngắn hơn nữa thì thẻ chưa kịp dừng đã đi tiếp. */
      autoplayMs: 3000,
      onChange: function (i) { ST.track('area_view', { area: D.GROUPS[i].key }); }
    });

    map = ST.map2d.create(document.getElementById('st-map'), {
      onGo: function (d) { goVR(d, null); }
    });

    applyTitle();
    I.apply();
    labelCards();

    /* ── Sự kiện ─────────────────────────────────────────────────────── */
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-st-close]')) { e.preventDefault(); close('button'); return; }
      var m = e.target.closest('[data-open-map]');
      if (m) { openMap(m.getAttribute('data-open-map')); return; }
    });

    listEl.addEventListener('click', function (e) {
      if (e.target.closest('.st-list-back')) { toDeck(); return; }
      var li = e.target.closest('.st-li');
      if (li) goVR(D.get(li.getAttribute('data-key')), li);
    });

    /* Tìm kiếm: gõ là sang thẳng danh sách, xoá hết là quay về carousel. */
    searchIn.addEventListener('input', function () {
      query = searchIn.value.trim();
      searchBox.classList.toggle('st-on', !!query);
      if (query) {
        if (state !== 'list') toList(null, true);
        else renderList();
      } else if (state === 'list' && !groupKey) {
        toDeck();
      }
    });
    searchBox.querySelector('.st-search-clear').addEventListener('click', function () {
      searchIn.value = ''; query = '';
      searchBox.classList.remove('st-on');
      if (state === 'list' && !groupKey) toDeck();
      searchIn.focus();
    });

    B.on('lang', function (d) { if (/^(vi|en)$/.test(d.lang)) I.set(d.lang); });
    B.on('open', open);
    I.onChange(applyLang);

    /* Vào màn. Không chờ panorama như bản cũ (D-13): popup là document riêng,
       không biết tiến độ viewer bên trang cha — cha quyết định lúc nhúng
       iframe thì đã là lúc thích hợp. */
    openedAt = Date.now();
    requestAnimationFrame(function () {
      root.classList.add('st-open');
      cr.start();
      titleEl.focus();
      arm();
    });

    var r = panel.getBoundingClientRect();
    B.ready({ w: Math.round(r.width), h: Math.round(r.height) });
    ST.track('popup_shown', {});

    if (ST.DEBUG) initDebug();
  }

  /* ── Panel debug (?debug=1) ───────────────────────────────────────────── */
  function initDebug() {
    var el = document.getElementById('st-debug');
    el.hidden = false;

    function row(k, v) { return '<div class="st-dbg-row"><span>' + k + '</span><b>' + v + '</b></div>'; }
    function render() {
      el.innerHTML =
        '<h4>ST popup 1</h4>' +
        row('state', state) + row('khu vực', groupKey || '—') +
        row('lang', I.lang) + row('thẻ', (cr.index() + 1) + '/' + cr.count()) +
        row('bản đồ', map.isOpen() ? 'mở' : 'đóng') +
        row('iframe', B.embedded() ? 'có' : 'không') +
        '<div class="st-dbg-grp">Tiêu đề (Q6)<br>' +
          ['a', 'b', 'c'].map(function (v) {
            return '<button data-var="' + v + '" class="' + (variant === v ? 'st-on' : '') + '">' +
                   v.toUpperCase() + '</button>';
          }).join('') +
        '</div>' +
        '<div class="st-dbg-grp">' +
          '<button data-cr="prev">‹</button><button data-cr="next">›</button>' +
          '<button data-act="lang">VI/EN</button><button data-act="map">Bản đồ</button>' +
          '<button data-act="deck">← Khu vực</button>' +
        '</div>';
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.var) { variant = b.dataset.var; applyTitle(); }
      if (b.dataset.cr) { cr[b.dataset.cr](); }
      if (b.dataset.act === 'lang') I.toggle();
      if (b.dataset.act === 'map') openMap('all');
      if (b.dataset.act === 'deck') toDeck();
      render();
    });

    I.onChange(render);
    setInterval(render, 500);          /* index carousel đổi ngầm khi autoplay */
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  ST.popup = {
    open: open,
    close: close,
    toList: toList,
    toDeck: toDeck,
    openMap: openMap,
    state: function () { return state; },
    group: function () { return groupKey; },
    carousel: function () { return cr; },
    map: function () { return map; }
  };
})();
