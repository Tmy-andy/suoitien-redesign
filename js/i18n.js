/* ═══════════════════════════════════════════════════════════════════════
   i18n.js — VI + EN (Q4 = "cần").
   Mọi text UI nằm ở đây. Markup dùng data-i18n / data-i18n-aria.
   Không hardcode chuỗi ở bất kỳ file nào khác.  Xem docs/06-data.md

   Ngôn ngữ do TRANG CHA quyết (D-46): `?lang=` lúc nhúng iframe, hoặc
   postMessage `st:lang` để đổi nóng. Popup KHÔNG có nút chuyển ngôn ngữ —
   nếu có, nó sẽ lệch với nút VN/EN mà trang cha đang hiển thị.
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var COPY = {

    vi: {
      close: 'Đóng',

      popup: {
        eyebrow: 'TOUR 360°',
        /* 3 biến thể tiêu đề (Q6) — đổi bằng ?title=a|b|c hoặc panel ?debug=1 */
        titles: {
          a: 'Bạn muốn ghé thăm nơi nào trước?',
          b: 'Bạn quan tâm địa điểm nào nhất?',
          c: 'Bắt đầu chuyến tham quan từ đâu nhé?'
        },
        subtitle: 'Khám phá hơn 150 điểm của Công viên Văn hóa Suối Tiên bằng ảnh 360° chân thực — bấm vào một tấm ảnh để bắt đầu.',
        legend:   'Điểm nên xem trước',
        mustBadge:'Nên xem',
        skip:     'Để tôi tự khám phá',
        goHint:   'Bấm để đến đây',

        /* 3D carousel */
        deckLabel: 'Ảnh các điểm nổi bật — quẹt trái/phải hoặc dùng phím mũi tên để xem tiếp',
        prev:      'Ảnh trước',
        next:      'Ảnh kế tiếp'
      },

      /* ══ Bản đồ 2D — DÙNG CHUNG cả 2 bản (D-51) ═════════════════════════ */
      map: {
        open:     'Xem trên bản đồ 2D',
        openArea: 'Xem khu vực này trên bản đồ',
        titleAll: 'Toàn bộ điểm đến',
        sub:      'BẢN ĐỒ SUỐI TIÊN',
        count:    '{n} điểm trên bản đồ',
        pinHint:  'bấm để xem chi tiết',
        go:       'Xem ảnh 360°',
        zoomIn:   'Phóng to',
        zoomOut:  'Thu nhỏ',
        fit:      'Về toàn cảnh',
        hint:     'Kéo để di chuyển · cuộn để phóng to · bấm số để xem điểm'
      },

      /* ══ index.html — thẻ là KHU VỰC, bấm ra danh sách (D-52) ══════════ */
      list: {
        back:      'Tất cả khu vực',
        openArea:  'Xem danh sách',
        count:     '{n} điểm',
        go:        'Xem ảnh 360°',
        searchPh:  'Tìm điểm đến…',
        searchLbl: 'Tìm điểm đến',
        clear:     'Xoá ô tìm kiếm',
        results:   'Kết quả tìm kiếm',
        empty:     'Không tìm thấy điểm nào khớp',
        noPhoto:   'Chưa có ảnh'
      },

      /* ══ index2.html — VR Wall + Infinite Slider (D-50) ══════════════════ */
      wall: {
        eyebrow:  'SUỐI TIÊN 360',
        title:    'Khám phá thế giới Suối Tiên',
        subtitle: 'Hàng trăm cảnh quan, trò chơi và công trình văn hoá đang chờ bạn. Chọn một khu vực để bắt đầu.',
        gridLabel:'Các khu vực của Suối Tiên',
        openGroup:'Xem khu vực này',
        count:    '{n} điểm',
        /* thanh công cụ dưới cùng */
        search:   'Tìm địa điểm',
        journey:  'Bắt đầu hành trình',
        skip:     'Bỏ qua, vào VR ngay'
      },

      slider: {
        back:        'Tất cả khu vực',
        go:          'Khám phá VR 360°',
        prev:        'Điểm trước',
        next:        'Điểm kế tiếp',
        trackLabel:  'Các điểm trong khu vực — quẹt trái/phải hoặc dùng phím mũi tên',
        searchLabel: 'Tìm điểm đến',
        searchPh:    'Gõ tên điểm đến…',
        clear:       'Xoá ô tìm kiếm',
        empty:       'Không tìm thấy điểm nào khớp',
        counter:     '{i} / {n}'
      }
    },

    en: {
      close: 'Close',

      popup: {
        eyebrow: '360° TOUR',
        titles: {
          a: 'Where would you like to visit first?',
          b: 'Which spot interests you most?',
          c: 'Where should we start the tour?'
        },
        subtitle: 'Explore 150+ spots of Suoi Tien Cultural Park in true 360° — tap a photo to begin.',
        legend:   'Must-see spots',
        mustBadge:'Must-see',
        skip:     'Let me explore on my own',
        goHint:   'Tap to go here',

        deckLabel: 'Photos of featured spots — swipe left/right or use the arrow keys',
        prev:      'Previous photo',
        next:      'Next photo'
      },

      map: {
        open:     'View on the 2D map',
        openArea: 'See this area on the map',
        titleAll: 'All destinations',
        sub:      'SUOI TIEN PARK MAP',
        count:    '{n} spots on the map',
        pinHint:  'tap for details',
        go:       'View in 360°',
        zoomIn:   'Zoom in',
        zoomOut:  'Zoom out',
        fit:      'Fit to screen',
        hint:     'Drag to move · scroll to zoom · tap a number for details'
      },

      list: {
        back:      'All areas',
        openArea:  'See the list',
        count:     '{n} spots',
        go:        'View in 360°',
        searchPh:  'Find a spot…',
        searchLbl: 'Find a spot',
        clear:     'Clear search',
        results:   'Search results',
        empty:     'No matching spot',
        noPhoto:   'No photo yet'
      },

      wall: {
        eyebrow:  'SUOI TIEN 360',
        title:    'Explore the world of Suoi Tien',
        subtitle: 'Hundreds of landscapes, rides and cultural landmarks are waiting. Pick an area to begin.',
        gridLabel:'Areas of Suoi Tien',
        openGroup:'Open this area',
        count:    '{n} spots',
        search:   'Find a spot',
        journey:  'Start the journey',
        skip:     'Skip, go straight to VR'
      },

      slider: {
        back:        'All areas',
        go:          'Explore in VR 360°',
        prev:        'Previous spot',
        next:        'Next spot',
        trackLabel:  'Spots in this area — swipe left/right or use the arrow keys',
        searchLabel: 'Search spots',
        searchPh:    'Type a spot name…',
        clear:       'Clear search',
        empty:       'No matching spot',
        counter:     '{i} / {n}'
      }
    }
  };

  function read(obj, path) {
    var parts = String(path).split('.'), cur = obj, i;
    for (i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  var listeners = [];

  var I = {
    lang: 'vi',

    /* KHÔNG đọc localStorage như bản cũ: trong iframe, localStorage thuộc
       origin của popup chứ không phải của trang cha → một lựa chọn ngôn ngữ
       lưu ở đây sẽ ghi đè lên cái trang cha vừa truyền vào. Trang cha là
       nguồn sự thật duy nhất. */
    init: function (forced) {
      I.lang = forced || 'vi';
      document.documentElement.setAttribute('lang', I.lang);
    },

    /** t('popup.titles') → chuỗi/object theo ngôn ngữ hiện tại. vars: {name:'x'} */
    t: function (key, vars) {
      var v = read(COPY[I.lang], key);
      if (v === undefined) v = read(COPY.vi, key);
      if (v === undefined) return key;
      if (typeof v === 'string' && vars) {
        v = v.replace(/\{(\w+)\}/g, function (m, k) {
          return vars[k] !== undefined ? vars[k] : m;
        });
      }
      return v;
    },

    set: function (lang) {
      if (lang === I.lang) return;
      I.lang = lang;
      document.documentElement.setAttribute('lang', lang);
      listeners.forEach(function (fn) { fn(lang); });
    },

    toggle: function () { I.set(I.lang === 'vi' ? 'en' : 'vi'); },

    /* Thay cho `store.emit('lang:change')` của bản cũ — chỉ còn 1 module cần
       nghe nên không đáng dựng lại cả pub/sub. */
    onChange: function (fn) { listeners.push(fn); },

    /** Quét [data-i18n] và [data-i18n-aria] rồi thay nội dung */
    apply: function (root) {
      root = root || document;
      var i, el, nodes;

      nodes = root.querySelectorAll('[data-i18n]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        el.textContent = I.t(el.getAttribute('data-i18n'));
      }

      nodes = root.querySelectorAll('[data-i18n-aria]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        el.setAttribute('aria-label', I.t(el.getAttribute('data-i18n-aria')));
      }

      /* placeholder của ô tìm kiếm (index2) */
      nodes = root.querySelectorAll('[data-i18n-ph]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        el.setAttribute('placeholder', I.t(el.getAttribute('data-i18n-ph')));
      }
    },

    destName: function (dest) {
      if (!dest) return '';
      return (I.lang === 'en' && dest.nameEn) ? dest.nameEn : dest.name;
    },

    destBlurb: function (dest) {
      if (!dest) return '';
      return (I.lang === 'en' && dest.blurbEn) ? dest.blurbEn : (dest.blurb || '');
    }
  };

  ST.i18n = I;
})();
