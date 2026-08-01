/* ═══════════════════════════════════════════════════════════════════════
   places.js — M3 · OVERLAY DANH SÁCH ĐIỂM ĐẾN (clone bản có sẵn · D-43)

   Hai cơ chế thu hẹp KHÁC NHAU, cố ý:
     · Ô tìm kiếm → ẨN HẲN thẻ không khớp (người dùng đang tìm một cái tên)
     · Chip lọc   → chỉ LÀM MỜ thẻ không khớp, lưới đứng yên (đúng bản gốc:
       lọc là để nhìn cho dễ, không phải để cắt bớt danh sách)

   Danh sách hiện có 20/158 điểm — đúng bằng số điểm có `type` trong
   catalog.json. Bản thật nạp cả 158 từ map_places.json, xem docs/06-data.md.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;
  var elGrid, elChips, elSearch, elClear, elEmpty, elCount;
  var cat = 'all', q = '';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function renderChips() {
    elChips.innerHTML = D.CATEGORIES.map(function (c) {
      return '<button type="button" class="st-pl-chip" role="tab" data-cat="' + c.key + '"' +
             ' aria-selected="' + (c.key === cat) + '">' +
             esc(I.lang === 'en' ? c.en : c.vi) + '</button>';
    }).join('');
  }

  function renderGrid() {
    elGrid.innerHTML = D.keys().map(function (k) {
      var d = D.get(k);
      var no = d.no ? d.no + '-' : '';
      return '<button type="button" class="st-pl-card st-pc-' + (d.cat || 'util') + '"' +
             ' data-key="' + esc(k) + '" data-cat="' + esc(d.cat || '') + '"' +
             ' title="' + esc(I.t('places.goHint')) + '">' +
        '<span class="st-pl-vi">' + esc(no + d.name.toUpperCase()) + '</span>' +
        '<span class="st-pl-en">' + esc(no + (d.nameEn || d.name)) + '</span>' +
      '</button>';
    }).join('');
  }

  /* Áp bộ lọc lên DOM có sẵn thay vì dựng lại lưới: giữ nguyên vị trí thẻ nên
     mắt không phải tìm lại, và không mất trạng thái focus khi đang gõ. */
  function apply() {
    var cards = elGrid.querySelectorAll('.st-pl-card');
    var needle = D.deaccent(q.trim());
    var shown = 0, i, card, d;

    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      d = D.get(card.getAttribute('data-key'));
      var hay = D.deaccent(d.name + ' ' + (d.nameEn || '') + ' ' + (d.no || ''));
      var hit = !needle || hay.indexOf(needle) >= 0;

      card.hidden = !hit;
      card.classList.toggle('st-dim', cat !== 'all' && d.cat !== cat);
      if (hit) shown++;
    }

    elEmpty.hidden = shown > 0;
    elCount.textContent = I.t('places.count', { n: shown, total: D.TOTAL_REAL });
    elClear.hidden = !q;
  }

  var P = {
    init: function () {
      elGrid   = document.getElementById('st-pl-grid');
      elChips  = document.getElementById('st-pl-chips');
      elSearch = document.getElementById('st-pl-search');
      elClear  = document.getElementById('st-pl-clear');
      elEmpty  = document.getElementById('st-pl-empty');
      elCount  = document.getElementById('st-pl-count');
      if (!elGrid) return;

      renderChips();
      renderGrid();
      elSearch.placeholder = I.t('places.search');
      apply();

      elChips.addEventListener('click', function (e) {
        var chip = e.target.closest('.st-pl-chip');
        if (!chip) return;
        cat = chip.getAttribute('data-cat');
        Array.prototype.forEach.call(elChips.children, function (c) {
          c.setAttribute('aria-selected', c === chip);
        });
        apply();
      });

      elSearch.addEventListener('input', function () { q = this.value; apply(); });

      elClear.addEventListener('click', function () {
        q = ''; elSearch.value = ''; elSearch.focus(); apply();
      });

      elGrid.addEventListener('click', function (e) {
        var card = e.target.closest('.st-pl-card');
        if (!card) return;
        ST.overlays.close('st-places');
        ST.viewer.goTo(card.getAttribute('data-key'));
      });

      ST.store.on('lang:change', function () {
        renderChips();
        renderGrid();
        elSearch.placeholder = I.t('places.search');
        I.apply(document.getElementById('st-places'));
        apply();
      });
    }
  };

  ST.places = P;
})();
