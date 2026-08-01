/* ═══════════════════════════════════════════════════════════════════════
   i18n.js — VI + EN (Q4 = "cần").
   Mọi text UI nằm ở đây. Markup dùng data-i18n / data-i18n-aria.
   Không hardcode chuỗi ở bất kỳ file nào khác.  Xem docs/06-data.md
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  /* ══ Chuỗi SONG NGỮ CỐ ĐỊNH — overlay chỉ đường + danh sách (D-43) ══════
     Hai overlay này trên site thật luôn hiện ĐỒNG THỜI dòng Việt (đậm) và
     dòng Anh (nhạt) bất kể đang chọn ngôn ngữ nào — đó là đặc điểm nhận diện
     của chúng, phải clone y nguyên. Vì vậy chuỗi giống hệt ở cả `vi` và `en`
     → khai báo MỘT lần rồi tham chiếu, không nhân đôi rồi lệch nhau về sau. */
  var BI = {

    /* ── M2 · Overlay CHỈ ĐƯỜNG ─────────────────────────────────────────── */
    route: {
      title:    'Bản đồ Suối Tiên',
      subtitle: 'SUOI TIEN PARK · WAYFINDING MAP',
      from:     'ĐIỂM BẮT ĐẦU · FROM',
      to:       'ĐIỂM ĐẾN · TO',
      swap:     'Đổi chiều',
      myLoc:    'Vị trí của tôi',
      sumVi:    'Quãng đường ≈ {d} m · Đi bộ ~ {t} phút',
      sumEn:    'Distance ≈ {d} m · Walk ~ {t} min',
      steps:    'Chỉ dẫn đường đi · Step-by-step',
      collapse: 'Thu gọn bảng điều khiển',
      expand:   'Mở bảng điều khiển',
      same:     'Điểm đi và điểm đến đang trùng nhau',
      goto:     'Xem ảnh 360° tại đây',

      step: {
        startVi: 'Xuất phát từ {name}.',
        startEn: 'Start at {name}.',
        turnVi:  'Đi ~{d} m rồi rẽ {dir} (gần {j}).',
        turnEn:  'Walk ~{d} m, then turn {dir}.',
        onVi:    'Đi tiếp ~{d} m qua {j}.',
        onEn:    'Continue ~{d} m.',
        endVi:   'Đến nơi: {name}.',
        endEn:   'Arrive at {name}.'
      },
      dirVi: { left:'trái',  right:'phải' },
      dirEn: { left:'left',  right:'right' },

      tool: {
        split:   'Chia đôi màn hình',
        list:    'Danh sách điểm đến',
        locate:  'Về giữa bản đồ',
        compass: 'La bàn',
        zoomIn:  'Phóng to',
        zoomOut: 'Thu nhỏ'
      },
      mock: 'Bản đồ và số liệu quãng đường là mô phỏng — bản thật dùng map.jpg + map_graph.json'
    },

    /* ── M3 · Overlay DANH SÁCH ĐIỂM ĐẾN ───────────────────────────────── */
    places: {
      title:  'Danh sách điểm đến',
      search: 'Tìm điểm đến...',
      clear:  'Xoá ô tìm kiếm',
      empty:  'Không tìm thấy điểm nào khớp · No matching spot',
      count:  '{n}/{total} điểm trong bản demo',
      goHint: 'Bấm để xem ảnh 360° tại đây'
    }
  };

  var COPY = {

    vi: {
      route:  BI.route,
      places: BI.places,

      close: 'Đóng',
      peek:  'Mở menu',
      hint:  'Kéo để xem toàn cảnh 360°',

      a11y: {
        mainNav:   'Điều hướng chính',
        openMenu:  'Mở menu',
        search:    'Tìm kiếm',
        langGroup: 'Ngôn ngữ',
        dock:      'Thanh điều khiển tour'
      },

      welcome: {
        eyebrow: 'TOUR 360°',
        titles: {
          a: 'Bạn muốn ghé thăm nơi nào trước?',
          b: 'Bạn quan tâm địa điểm nào nhất?',
          c: 'Bắt đầu chuyến tham quan từ đâu nhé?'
        },
        subtitle: 'Khám phá hơn 150 điểm của Công viên Văn hóa Suối Tiên bằng ảnh 360° chân thực — bấm một điểm trên bản đồ để bắt đầu.',
        legend:   'Điểm nên xem trước',
        skip:     'Để tôi tự khám phá',
        mapLabel: 'Bản đồ các điểm nổi bật',
        goHint:   'Bấm để đến đây'
      },

      dock: {
        route: 'Chỉ đường', places: 'Điểm đến', reopen: 'Chọn điểm bắt đầu',
        /* dưới đây thuộc bản v2 đầy đủ (?full=1) — cụm ⓓ trip360 đã có sẵn */
        vr: 'Chế độ VR', gyro: 'Cảm biến chuyển động', sound: 'Âm thanh',
        fullscreen: 'Toàn màn hình', more: 'Thêm'
      },

      /* Thẻ vé combo (D-41). `title` phải NGẮN — vé không xuống dòng. */
      ticket: {
        stub:    'Vé',
        eyebrow: 'Vé combo',
        title:   'Xem combo trò chơi',
        aria:    'Xem combo trò chơi — mở trang bảng giá của Suối Tiên'
      },

      popover: { help: 'Hướng dẫn dùng tour', share: 'Chia sẻ', rotate: 'Tự động quay', lang: 'Ngôn ngữ: Tiếng Việt' },

      cta: { ticket: 'Mua vé', combo: 'Mua combo' },

      share: {
        title: 'Chia sẻ điểm này',
        sceneFmt: 'Đang xem: {name}',
        copyBtn: 'Copy',
        qrNote: 'Người nhận mở link sẽ vào thẳng điểm bạn đang xem.'
      },

      help: {
        title: 'Xem tour 360° thế nào?',
        dontShow: 'Không hiện lại lần sau',
        steps: [
          { icon:'i-drag',    title:'Kéo để nhìn quanh',      text:'Giữ chuột và kéo, hoặc quẹt ngón tay để xoay 360°.' },
          { icon:'i-expand',  title:'Cuộn để phóng to',        text:'Lăn chuột hoặc chụm 2 ngón tay để zoom gần hơn.' },
          { icon:'i-arrow-right', title:'Bấm mũi tên để đi tiếp', text:'Các mũi tên trên ảnh dẫn bạn sang điểm kế bên.' },
          { icon:'i-list',    title:'Nhảy tới bất kỳ đâu',     text:'Bấm "Điểm đến" để chọn nhanh trong hơn 150 điểm.' },
          { icon:'i-route',   title:'Xem lối đi giữa 2 điểm',  text:'Bấm "Chỉ đường" để biết đi bộ bao xa, mất mấy phút.' }
        ]
      },

      existing: {
        route:  { title:'Bản đồ chỉ đường', body:'Trên site thật, nút này mở bản đồ chỉ đường đầy đủ: chọn điểm đi — điểm đến, xem quãng đường, thời gian đi bộ và chỉ dẫn từng chặng.' },
        places: { title:'Danh sách điểm đến', body:'Trên site thật, nút này mở danh sách hơn 150 điểm, có ô tìm kiếm và bộ lọc theo nhóm: Trò chơi, Tham quan, Văn hoá, Ăn uống, Tiện ích.' },
        note: 'Phần này đã hoàn thiện trên site thật nên prototype không dựng lại — chỉ demo nút bấm với giao diện mới.'
      },

      scene: { fmt: '{index} / {total} điểm' },

      toast: {
        wip:      'Chức năng đang phát triển',
        linkDemo: 'Bản demo — link không mở trang thật',
        copied:   'Đã copy link',
        manualCopy: 'Nhấn Ctrl+C để copy',
        noPano:   'Không tìm thấy điểm này',
        fsBlocked:'Trình duyệt không cho phép toàn màn hình',
        mapMissing:'Chưa có assets/map/park-map-real.jpg — đang dùng bản đồ SVG',
        langVi:   'Đã chuyển sang Tiếng Việt',
        langEn:   'Đã chuyển sang Tiếng Anh',
        rotateOn: 'Tự động quay: BẬT',
        rotateOff:'Tự động quay: TẮT'
      }
    },

    en: {
      route:  BI.route,
      places: BI.places,

      close: 'Close',
      peek:  'Open menu',
      hint:  'Drag to look around in 360°',

      a11y: {
        mainNav:   'Main navigation',
        openMenu:  'Open menu',
        search:    'Search',
        langGroup: 'Language',
        dock:      'Tour controls'
      },

      welcome: {
        eyebrow: '360° TOUR',
        titles: {
          a: 'Where would you like to visit first?',
          b: 'Which spot interests you most?',
          c: 'Where should we start the tour?'
        },
        subtitle: 'Explore 150+ spots of Suoi Tien Cultural Park in true 360° — tap a pin on the map to begin.',
        legend:   'Must-see spots',
        skip:     'Let me explore on my own',
        mapLabel: 'Map of featured spots',
        goHint:   'Tap to go here'
      },

      dock: {
        route: 'Directions', places: 'Destinations', reopen: 'Pick a starting point',
        vr: 'VR mode', gyro: 'Motion sensor', sound: 'Sound',
        fullscreen: 'Fullscreen', more: 'More'
      },

      ticket: {
        stub:    'Pass',
        eyebrow: 'Combo pass',
        title:   'View ride combos',
        aria:    'View ride combos — opens the Suoi Tien pricing page'
      },

      popover: { help: 'How to use the tour', share: 'Share', rotate: 'Auto-rotate', lang: 'Language: English' },

      cta: { ticket: 'Buy tickets', combo: 'Buy combo' },

      share: {
        title: 'Share this spot',
        sceneFmt: 'Viewing: {name}',
        copyBtn: 'Copy',
        qrNote: 'Opening this link takes them straight to the spot you are viewing.'
      },

      help: {
        title: 'How to use the 360° tour',
        dontShow: 'Don’t show this again',
        steps: [
          { icon:'i-drag',    title:'Drag to look around',   text:'Hold and drag, or swipe, to rotate the full 360° view.' },
          { icon:'i-expand',  title:'Scroll to zoom',        text:'Use the scroll wheel or pinch with two fingers.' },
          { icon:'i-arrow-right', title:'Tap arrows to move on', text:'Arrows on the image take you to neighbouring spots.' },
          { icon:'i-list',    title:'Jump anywhere',         text:'Tap “Destinations” to pick from 150+ spots.' },
          { icon:'i-route',   title:'Find your way',         text:'Tap “Directions” for walking distance and step-by-step guidance.' }
        ]
      },

      existing: {
        route:  { title:'Wayfinding map', body:'On the live site this opens the full wayfinding map: pick a start and destination, see distance, walking time and step-by-step directions.' },
        places: { title:'Destination list', body:'On the live site this opens the full list of 150+ spots, with search and category filters: Games, Sightseeing, Culture, Food & Drink, Facilities.' },
        note: 'This part is already complete on the live site, so the prototype does not rebuild it — only the new button styling is demonstrated.'
      },

      scene: { fmt: 'Spot {index} of {total}' },

      toast: {
        wip:      'Feature in development',
        linkDemo: 'Demo build — links are disabled',
        copied:   'Link copied',
        manualCopy: 'Press Ctrl+C to copy',
        noPano:   'Spot not found',
        fsBlocked:'Your browser blocked fullscreen',
        mapMissing:'assets/map/park-map-real.jpg not found — using the SVG map',
        langVi:   'Switched to Vietnamese',
        langEn:   'Switched to English',
        rotateOn: 'Auto-rotate: ON',
        rotateOff:'Auto-rotate: OFF'
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

  function safeLS(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  var I = {
    lang: 'vi',

    init: function (forced) {
      var saved = safeLS(function () { return localStorage.getItem('st.lang'); }, null);
      I.lang = forced || saved || 'vi';
      document.documentElement.setAttribute('lang', I.lang);
    },

    /** t('welcome.title') → chuỗi theo ngôn ngữ hiện tại. vars: {name:'x'} */
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
      safeLS(function () { localStorage.setItem('st.lang', lang); });
      document.documentElement.setAttribute('lang', lang);
      I.apply();
      if (ST.store) ST.store.emit('lang:change', { lang: lang });
    },

    toggle: function () { I.set(I.lang === 'vi' ? 'en' : 'vi'); },

    /** Quét [data-i18n] và [data-i18n-aria] rồi thay nội dung */
    apply: function (root) {
      root = root || document;
      var i, el, nodes;

      nodes = root.querySelectorAll('[data-i18n]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        var vars = el.getAttribute('data-i18n-vars');
        el.textContent = I.t(el.getAttribute('data-i18n'), vars ? JSON.parse(vars) : null);
      }

      nodes = root.querySelectorAll('[data-i18n-aria]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        el.setAttribute('aria-label', I.t(el.getAttribute('data-i18n-aria')));
      }
    },

    /** Tên điểm theo ngôn ngữ */
    destName: function (dest) {
      if (!dest) return '';
      return (I.lang === 'en' && dest.nameEn) ? dest.nameEn : dest.name;
    },

    destBlurb: function (dest) {
      if (!dest) return '';
      return (I.lang === 'en' && dest.blurbEn) ? dest.blurbEn : (dest.blurb || '');
    },

    /** Label menu theo ngôn ngữ (nhiều mục con chỉ có tiếng Việt → giữ nguyên) */
    navLabel: function (item) {
      return (I.lang === 'en' && item.labelEn) ? item.labelEn : item.label;
    }
  };

  ST.i18n = I;
})();
