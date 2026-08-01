/* ═══════════════════════════════════════════════════════════════════════
   data.js — dữ liệu prototype.
   • UUID panorama, tên điểm, type, icon  → THẬT (data/catalog.json của site)
   • NAV_MENU, CONTACT, SOCIAL, LINKS     → THẬT (HTML suoitien.vn)
   • blurb, toạ độ hotspot                → MOCK (tự viết / tự đặt)
   Xem docs/06-data.md
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = {};

  /* Q22 = (b): item navbar không đi đâu. URL thật vẫn lưu, bật cờ là dùng được. */
  D.LINKS_LIVE = false;

  /* ── PHẠM VI PROTOTYPE (D-39, chốt 2026-08-01) ────────────────────────
     GIAO:  header (topbar + navbar, YC-3) · cụm C 3 nút (YC-2 + nút combo)
            · modal welcome (YC-1).
     BỎ:    CTA vé, popover ⋯, nhóm nút xem, scene label, hint, share, help.

     Tiêu chí phân loại KHÔNG phải "mới hay cũ" mà là "chỗ đó trên trip360 có
     gì chưa": dải trên cùng TRỐNG nên header được dựng; còn 4 cụm ⓐ ⓑ ⓓ ⓔ đã
     có control thật, dựng đè lên là che mất chúng khi ghép.

     Code bỏ vẫn GIỮ NGUYÊN, chỉ không xuất ra DOM. `?full=1` bật lại bản v2
     đầy đủ để đối chiếu. Xem docs/08-decisions.md D-39 / D-40. */
  D.SCOPE = 'minimal';

  /* Tổng số điểm THẬT trong catalog.json — dùng cho nhãn "4/158", "hơn 150 điểm" */
  D.TOTAL_REAL = 158;

  D.DEFAULT_PANO = 'panorama_F617713D_6328_3DB0_417B_B4F8E3B642AE';
  D.DEFAULT_KEY  = 'cong';

  /* ── Điểm đến ────────────────────────────────────────────────────────
     20 điểm có `type` trong catalog.json (bộ "highlight" đã được curate).
     `pano` là UUID THẬT → port sang bản thật chỉ cần đổi ST.viewer.goTo(). */
  D.DESTINATIONS = {
    cong: { name:'Cổng Thiên Tiên Môn', nameEn:'Fairyland Gate', type:'vào cổng', cat:'culture', icon:'gate',
      pano:'panorama_F6136FEA_6328_24DA_41BC_7AF8284BD90E',
      blurb:'Cổng chính biểu tượng của Suối Tiên với hai tượng rồng uy nghi.',
      blurbEn:'The iconic main gate guarded by two majestic dragon statues.' },

    xelua: { name:'Xe lửa tham quan toàn cảnh', nameEn:'Panoramic Tourist Train', type:'di chuyển', cat:'util', icon:'ride',
      pano:'panorama_F613DD4A_6328_25D9_41A1_418FBB799434',
      blurb:'Vòng quanh công viên bằng xe lửa, ngắm toàn cảnh mà không mỏi chân.',
      blurbEn:'Circle the whole park by train and see everything without walking.' },

    massage: { name:'Massage Cá thư giãn', nameEn:'Fish Massage', type:'trải nghiệm', cat:'game', icon:'spa',
      pano:'panorama_F610E916_6318_2D40_4184_D43C6272B020',
      blurb:'Ngâm chân cho đàn cá nhỏ mát-xa — cảm giác nhồn nhột rất lạ.',
      blurbEn:'Dip your feet and let tiny fish do the massage — ticklish and unforgettable.' },

    casau: { name:'Vương Quốc Cá Sấu', nameEn:'Crocodile Kingdom', type:'tham quan', cat:'sight', icon:'see',
      pano:'panorama_F6139664_6318_67FB_41D8_56E29726450B',
      blurb:'Hơn 1.500 con cá sấu, có cầu câu cá sấu ngay trên đầm.',
      blurbEn:'Over 1,500 crocodiles, with a fishing bridge right above the pond.' },

    cungvang: { name:'Cung Vàng Điện Ngọc', nameEn:'The Royal Golden Palace', type:'tham quan', cat:'culture', icon:'see',
      pano:'panorama_F6118E80_6328_E743_41D1_E66E2DDB5031',
      blurb:'Cung điện dát vàng lộng lẫy, điểm chụp ảnh nổi tiếng nhất công viên.',
      blurbEn:'A dazzling gilded palace — the park’s most photographed spot.' },

    farm: { name:'Suối Tiên Farm', nameEn:'Suoi Tien Farm', type:'quà tặng', cat:'food', icon:'gift',
      pano:'panorama_F612ECB5_6328_2B4F_41B5_0F2F816B5ABE',
      blurb:'Nông sản và đặc sản Suối Tiên — nho, sung Mỹ, quà mang về.',
      blurbEn:'Farm produce and local specialties — grapes, figs, gifts to take home.' },

    taxi: { name:'Xe Taxi Du Lịch', nameEn:'Tourist Taxi', type:'di chuyển', cat:'util', icon:'ride',
      pano:'panorama_F61332DE_6328_1CF8_41D2_E48E647BD378',
      blurb:'Xe điện đưa đón trong khuôn viên, tiện cho gia đình có trẻ nhỏ.',
      blurbEn:'Electric shuttle around the park — handy for families with kids.' },

    kylan: { name:'Kỳ Lân Cung', nameEn:'Unicorn Palace', type:'tham quan', cat:'culture', icon:'see',
      pano:'panorama_F612E651_6319_E7DC_41C7_D03C93019FD2',
      blurb:'Kiến trúc kỳ lân đặc sắc, tái hiện truyền thuyết dân gian Việt.',
      blurbEn:'Striking unicorn architecture retelling Vietnamese folk legends.' },

    tuyet: { name:'Lâu Đài Tuyết', nameEn:'Snow Castle', type:'tham quan', cat:'sight', icon:'see',
      pano:'panorama_F6117DC6_6318_24C3_41CC_2E5B5115AA52',
      blurb:'Xứ tuyết âm độ giữa lòng Sài Gòn, có trượt tuyết và cung điện băng.',
      blurbEn:'A sub-zero snow world in Saigon, with sledding and an ice palace.' },

    amcung: { name:'Âm Cung Đệ Nhất Cung Đình Tửu', nameEn:'The Underworld Palace', type:'tham quan', cat:'culture', icon:'see',
      pano:'panorama_F6167827_6328_2B54_41D3_FACFB1359D7C',
      blurb:'Hành trình qua 18 tầng địa ngục theo tín ngưỡng dân gian.',
      blurbEn:'A walk through the 18 levels of hell in Vietnamese folk belief.' },

    phuthuy: { name:'Lâu Đài Pháp Thuật', nameEn:'Magic Castle', type:'tham quan', cat:'sight', icon:'see',
      pano:'panorama_467DBDC5_55B6_BA5B_41B1_4E62C210E533',
      blurb:'Lâu đài phù thuỷ nhiều tầng với ảo thuật và hiệu ứng bất ngờ.',
      blurbEn:'A multi-storey wizard castle full of illusions and surprises.' },

    coixay: { name:'Quần Thể Núi & Hang Động', nameEn:'Mountain & Cave Complex', type:'khám phá', cat:'sight', icon:'adv',
      pano:'panorama_467BCFFF_55B2_B626_4189_80BEBC4CD962',
      blurb:'Hệ thống núi nhân tạo và hang động uốn lượn, mát lạnh quanh năm.',
      blurbEn:'Man-made mountains and winding caves that stay cool year-round.' },

    tulinh: { name:'Du Thuyền Tứ Linh', nameEn:'Four Sacred Beasts Cruise', type:'trải nghiệm', cat:'sight', icon:'boat',
      pano:'panorama_F6111295_6318_3F47_41D4_ED491EB9F8BA',
      blurb:'Du thuyền hình long — lân — quy — phụng dạo quanh hồ.',
      blurbEn:'Cruise on boats shaped as dragon, unicorn, turtle and phoenix.' },

    diabay: { name:'Đĩa Bay Hành Tinh Lạ', nameEn:'Alien UFO', type:'cảm giác mạnh', cat:'game', icon:'thrill',
      pano:'panorama_F6116F09_6318_654F_41D1_4DC165650AEB',
      blurb:'Đĩa bay xoay và lắc liên tục — không dành cho người yếu tim.',
      blurbEn:'A spinning, tilting UFO ride — not for the faint-hearted.' },

    tauluon: { name:'Tàu Lượn Siêu Tốc', nameEn:'High-speed Roller Coaster', type:'cảm giác mạnh', cat:'game', icon:'thrill',
      pano:'panorama_F613BB7D_6318_2DCA_41B2_6C3CCC91DBCC',
      blurb:'Trò chơi mạnh nhất công viên — lao dốc và xoắn nhiều vòng.',
      blurbEn:'The park’s wildest ride — steep drops and multiple loops.' },

    vongxoay: { name:'Vòng Xoay Vũ Trụ', nameEn:'Rotation Of The Universe', type:'cảm giác mạnh', cat:'game', icon:'thrill',
      pano:'panorama_F613A3A6_6318_1D46_41B8_CEDF4002E4E6',
      blurb:'Vòng xoay khổng lồ nâng bạn lên cao rồi quay tròn giữa không trung.',
      blurbEn:'A giant swing that lifts you high and spins you mid-air.' },

    vrgame: { name:'Tổ Hợp Trò Chơi Liên Hoàn', nameEn:'Combined Game Complex', type:'trò chơi', cat:'game', icon:'vr',
      pano:'panorama_467C610B_55B5_4BEE_41CE_9ECBAC7714BD',
      blurb:'Khu trò chơi công nghệ: VR, phim 9D, game tương tác.',
      blurbEn:'Tech playground: VR, 9D cinema and interactive games.' },

    thuyenbay: { name:'Hồ Lạc Cảnh', nameEn:'Lac Canh Lake', type:'chọn 1 trong 2', cat:'sight', icon:'boat',
      pano:'panorama_F6138D27_6318_6546_41B6_BA9BACF36F3E',
      blurb:'Hồ lớn giữa công viên, có đạp vịt và du thuyền thiên nga.',
      blurbEn:'A large central lake with pedal boats and swan cruises.' },

    thuyenrong: { name:'Khu Trò Chơi Hồ Lạc Cảnh', nameEn:'Lac Canh Lake Games', type:'chọn 1 trong 2', cat:'game', icon:'boat',
      pano:'panorama_F6128E4B_6328_E7D8_41BD_62AF91EFC67C',
      blurb:'Cụm trò chơi ven hồ: thuyền rồng, thuyền bay, đu dây qua hồ.',
      blurbEn:'Lakeside rides: dragon boat, viking boat and zipline.' },

    bien: { name:'Biển Tiên Đồng – Ngọc Nữ', nameEn:'Tien Dong – Ngoc Nu Beach', type:'công viên nước', cat:'game', icon:'wave',
      pano:'panorama_467D98D6_55B6_DA79_41D1_FC9D881FCF00',
      blurb:'Biển nhân tạo lớn nhất Việt Nam với sóng và bãi cát nhân tạo.',
      blurbEn:'Vietnam’s largest man-made sea, complete with waves and sand.' }
  };

  /* Gắn key vào chính object cho tiện truyền quanh */
  Object.keys(D.DESTINATIONS).forEach(function (k) { D.DESTINATIONS[k].key = k; });

  /* ── Số hiệu + toạ độ trên bản đồ chỉ đường (D-43) ────────────────────
     `no` = số in trên pin bản đồ giấy của công viên. Sáu số dưới đây đọc
     được từ chính ảnh khách gửi nên là THẬT:
       1 Cổng · 2 Cung Vàng · 22A Vương Quốc Cá Sấu · 40 Kỳ Lân Cung ·
       48 Âm Cung · 101 Hồ Lạc Cảnh
     Các số còn lại và TOÀN BỘ x/y là MOCK — bản thật đọc từ map_places.json
     (`code` + toạ độ pixel trên map.jpg), xem docs/06-data.md §6.7.

     x/y tính theo % của khung bản đồ 1000×620 → đổi ảnh nền không phải sửa
     logic, y hệt cách D.HOTSPOTS làm cho modal welcome. */
  D.MAP_META = {
    cong:      { no:'1',   x:13, y:80, real:true },
    cungvang:  { no:'2',   x:34, y:34, real:true },
    casau:     { no:'22A', x:41, y:21, real:true },
    kylan:     { no:'40',  x:60, y:22, real:true },
    amcung:    { no:'48',  x:47, y:50, real:true },
    thuyenbay: { no:'101', x:74, y:78, real:true },
    /* MOCK: số hiệu tự đặt, chưa đối chiếu bản đồ giấy */
    xelua:     { no:'63',  x:22, y:66 },
    massage:   { no:'52',  x:30, y:55 },
    farm:      { no:'35',  x:21, y:44 },
    taxi:      { no:'64',  x:16, y:58 },
    tuyet:     { no:'17',  x:53, y:37 },
    phuthuy:   { no:'19',  x:63, y:58 },
    coixay:    { no:'30',  x:71, y:30 },
    tulinh:    { no:'26',  x:85, y:71 },
    diabay:    { no:'13',  x:78, y:62 },
    tauluon:   { no:'11',  x:78, y:45 },
    vongxoay:  { no:'9',   x:88, y:52 },
    vrgame:    { no:'44',  x:68, y:45 },
    thuyenrong:{ no:'29',  x:66, y:70 },
    bien:      { no:'50',  x:41, y:74 }
  };

  /* Trộn thẳng vào DESTINATIONS để nơi dùng chỉ cần `d.no` / `d.x` / `d.y` */
  Object.keys(D.MAP_META).forEach(function (k) {
    var d = D.DESTINATIONS[k], m = D.MAP_META[k];
    if (!d) return;
    d.no = m.no; d.x = m.x; d.y = m.y; d.noReal = !!m.real;
  });

  /* ── Tham số tính quãng đường (MOCK) ─────────────────────────────────
     Khung 1000×620 đại diện cho khu đất ~1400×870 m → 1% ngang ≈ 14 m,
     1% dọc ≈ 8.7 m. `detour` bù việc đi bộ không bao giờ đi đường chim bay.
     Bản thật lấy số từ map_graph.json (Dijkstra trên đồ thị lối đi). */
  D.WAYFIND = {
    mPerX:   14,
    mPerY:   8.7,
    detour:  1.15,
    walkMpm: 70          /* m mỗi phút ≈ 4,2 km/h */
  };

  /* ── Hotspot trên bản đồ welcome ─────────────────────────────────────
     x/y  = % trên bản đồ landscape (viewBox 1000×620)
     xm/ym= % trên bản đồ portrait mobile
     must = true → ring vàng "nên xem" (hint nhẹ, không xếp hạng · Q9)
     MOCK: toạ độ đặt theo bố cục, KHÔNG đúng vị trí địa lý thật. */
  D.HOTSPOTS = [
    { key:'cong',    x:13, y:80, xm:22, ym:88, must:false },
    { key:'farm',    x:21, y:44, xm:17, ym:64, must:false },
    { key:'casau',   x:41, y:21, xm:40, ym:20, must:false },
    { key:'tuyet',   x:53, y:37, xm:57, ym:36, must:true  },
    { key:'phuthuy', x:63, y:58, xm:71, ym:55, must:true  },
    { key:'bien',    x:41, y:74, xm:33, ym:76, must:true  },
    { key:'tauluon', x:78, y:45, xm:79, ym:45, must:false },
    { key:'tulinh',  x:85, y:71, xm:81, ym:67, must:false }
  ];

  /* ── Liên hệ (THẬT) ──────────────────────────────────────────────────── */
  D.CONTACT = {
    address: '120 Xa Lộ Hà Nội, P. Tăng Nhơn Phú, TP.Hồ Chí Minh',
    hotline: '1900 636 787',
    hotlineTel: '1900636787',
    email:   'phongkinhdoanh@suoitien.com'
  };

  /* ── Social (THẬT, lấy từ HTML site chính) ───────────────────────────── */
  /* Thứ tự ĐÚNG như site chính: FB · TikTok · LinkedIn · Instagram · YouTube.
     (Site chính gắn icon `fa-twitter` cho link TikTok — ta dùng icon TikTok cho đúng.) */
  D.SOCIAL = [
    { name:'Facebook',  icon:'i-fa-fb', href:'https://www.facebook.com/SuoiTienThemePark/' },
    /* ⚠️ Site gốc gắn icon `fa-twitter` (chim) cho link TikTok. Giữ ĐÚNG như gốc
       theo yêu cầu "giống hệt"; muốn đúng nghĩa thì đổi sang 'i-tt'. */
    { name:'TikTok',    icon:'i-fa-tw', href:'https://www.tiktok.com/@suoitienthemepark?lang=vi-VN' },
    { name:'LinkedIn',  icon:'i-fa-in', href:'#' },  /* site chính cũng để '#' */
    { name:'Instagram', icon:'i-fa-ig', href:'https://www.instagram.com/suoitienthemeparkofficial/' },
    { name:'YouTube',   icon:'i-fa-yt', href:'https://www.youtube.com/@suoitienthemeparkofficial' }
  ];

  /* ── Link ngoài (THẬT) ───────────────────────────────────────────────── */
  D.LINKS = {
    home:   'https://suoitien.vn/',
    ticket: 'https://suoitien.vn/chon-ve',
    /* THẬT — trùng href mục "Bảng giá › Combo trò chơi" trong NAV_MENU */
    combo:  'https://suoitien.vn/combo-tro-choi',
    map:    'https://suoitien.vn/ban-do',
    farm:   'https://stf.suoitien.vn',
    logo:   'https://suoitien.vn/halink-content/uploads/logosuoitien.png'
  };

  /* ── NAV_MENU — 84 mục THẬT, 3 cấp (docs/06-data.md §6.6) ───────────── */
  var S = 'https://suoitien.vn';
  D.NAV_MENU = [
    { label:'Trang chủ', labelEn:'Home', href:S + '/' },

    { label:'Giới thiệu', labelEn:'About', href:S + '/ladingpage/block/index.php', children:[
      { label:'Về Suối Tiên', labelEn:'About Suoi Tien', href:S + '/ladingpage/block/index.php' },
      { label:'Bản đồ',       labelEn:'Park map',        href:S + '/ban-do' }
    ]},

    { label:'Trải nghiệm đặc biệt', labelEn:'Special experiences', href:S + '/trai-nghiem-dac-biet', children:[
      { label:'Công trình văn hóa lịch sử', labelEn:'Historical works',  href:S + '/cong-trinh-van-hoa-lich-su' },
      { label:'Công trình văn hóa tâm linh',labelEn:'Spiritual works',   href:S + '/cong-trinh-van-hoa-tam-linh-1' },
      { label:'Biển Tiên Đồng - Ngọc Nữ',   labelEn:'Tien Dong Beach',   href:S + '/bien-tien-dong-ngoc-nu-2' },
      { label:'Suối Tiên farm',             labelEn:'Suoi Tien farm',    href:S + '/suoi-tien-farm' },
      { label:'Bốn Mùa Lễ Hội',             labelEn:'Four-season festivals', href:S + '/bon-mua-le-hoi' }
    ]},

    /* ← Tab MỚI, chèn sau "Trải nghiệm đặc biệt" (Q19) */
    { label:'VR360', labelEn:'VR360', href:'#', id:'st-nav-vr360', current:true },

    { label:'TRÒ CHƠI', labelEn:'Attractions', href:S + '/tro-choi', cols:true, children:[
      { label:'THAM QUAN - KHÁM PHÁ', labelEn:'Sightseeing', href:S + '/kham-pha', children:[
        { label:'Cung vàng điện ngọc',    href:S + '/cung-vang-dien-ngoc' },
        { label:'Thủy Cung',              href:S + '/thuy-cung' },
        { label:'Lâu Đài Pháp Thuật',     href:S + '/lau-dai-phap-thuat' },
        { label:'Phong Linh Điểu Cảnh - Vương quốc cá sấu', href:S + '/phong-linh-dieu-canh-vuong-quoc-ca-sau' },
        { label:'Bí mật rừng phù thủy',   href:S + '/bi-mat-rung-phu-thuy' },
        { label:'Du thuyền thiên nga',    href:S + '/du-thuyen-thien-nga' },
        { label:'DU THUYỀN TỨ LINH',      href:S + '/du-thuyen-tu-linh' },
        { label:'Cối Xay Thần Gió',       href:S + '/coi-xay-than-gio' },
        { label:'Đường hầm xuyên lòng đất',href:S + '/duong-ham-xuyen-long-dat' },
        { label:'Kỳ lân cung',            href:S + '/ky-lan-cung' },
        { label:'Đại cung Phụng Hoàng Tiên', href:S + '/dai-cung-phung-hoang-tien' },
        { label:'Lâu Đài Tuyết',          href:S + '/lau-dai-tuyet' },
        { label:'Ngôi nhà ma',            href:S + '/ngoi-nha-ma' },
        { label:'Âm cung đệ nhất cung đình tửu', href:S + '/am-cung-de-nhat-cung-dinh-tuu' }
      ]},
      { label:'CẢM GIÁC MẠNH', labelEn:'Thrill rides', href:S + '/cam-giac-manh', children:[
        { label:'Sky Bounder - Người chinh phục bầu trời', href:S + '/cam-giac-manh' },
        { label:'Khám phá vũ trụ huyền bí', href:S + '/cam-giac-manh' },
        { label:'Đĩa xoáy thiên hà',       href:S + '/dia-xoay-thien-ha' },
        { label:'Đu dây qua hồ',           href:S + '/du-day-qua-ho' },
        { label:'Vũ điệu tagada - phi cơ - ghế bay', href:S + '/vu-dieu-tagada-phi-co-ghe-bay' },
        { label:'Thuyền Rồng',             href:S + '/thuyen-rong' },
        { label:'Thuyền Bay',              href:S + '/thuyen-bay' },
        { label:'Vòng xoay vũ trụ',        href:S + '/vong-xoay-vu-tru' },
        { label:'Đĩa bay hành tinh lạ',    href:S + '/dia-bay-hanh-tinh-la' }
      ]},
      { label:'GIẢI TRÍ - TRẺ EM', labelEn:'Family & kids', href:S + '/giai-tri-tre-em', children:[
        { label:'MegaZone',                href:S + '/giai-tri-tre-em' },
        { label:'Mega Central',            href:S + '/mega-central' },
        { label:'Xe Tăng – Hành Trình Chiến Xa', href:S + '/-xe-tang-hanh-trinh-chien-xa' },
        { label:'Massage Cá',              href:S + '/massage-ca' },
        { label:'Ngựa phi nước đại',       href:S + '/ngua-phi-nuoc-dai' },
        { label:'Công nghệ phim 9D',       href:S + '/cong-nghe-phim-9d' },
        { label:'Xạ thủ thần công',        href:S + '/xa-thu-than-cong' },
        { label:'Đấu trường cung thủ',     href:S + '/dau-truong-cung-thu' }
      ]}
    ]},

    { label:'Dịch vụ', labelEn:'Services', href:S + '/dich-vu', children:[
      { label:'Ẩm thực',           labelEn:'Dining',    href:S + '/am-thuc' },
      { label:'Trạm dừng chân',    labelEn:'Rest stops',href:S + '/tram-dung-chan' },
      { label:'Mua sắm',           labelEn:'Shopping',  href:S + '/mua-sam' },
      { label:'Hội Nghị - Tiệc Cưới', labelEn:'Events & weddings', href:S + '/to-chuc-hoi-nghi' }
    ]},

    { label:'Bảng giá', labelEn:'Pricing', href:S + '/bang-gia', children:[
      { label:'Combo trò chơi',        labelEn:'Ride combos',  href:S + '/combo-tro-choi' },
      { label:'Chính sách Tour đoàn',  labelEn:'Group tours',  href:S + '/chinh-sach-tour-doan' },
      { label:'Bảng Giá Lẻ',           labelEn:'Single tickets',href:S + '/dich-vu-tro-choi' },
      { label:'Trải Ngiệm Mới',        labelEn:'New experiences',href:S + '/trai-ngiem-moi-' }
    ]},

    { label:'Tin tức & Thư viện', labelEn:'News & Library', href:S + '/tin-tuc-thu-vien', children:[
      { label:'Tin tức',  labelEn:'News',    href:S + '/tin-tuc' },
      { label:'Cẩm nang du lịch',        href:S + '/cam-nang-du-lich' },
      { label:'Cẩm nang tổ chức sự kiện',href:S + '/cam-nang-to-chuc-su-kien' },
      { label:'Cẩm nang team building',  href:S + '/cam-nang-team-building' },
      { label:'Ưu đãi và sự kiện',       href:S + '/uu-dai-va-su-kien' },
      { label:'Thư viện', labelEn:'Library', href:S + '/thu-vien' }
    ]},

    { label:'TUYỂN DỤNG & LIÊN HỆ', labelEn:'Careers & Contact', href:S + '/tuyen-dung-lien-he', children:[
      { label:'Liên hệ hợp tác',    labelEn:'Partnership', href:S + '/lien-he' },
      { label:'Tuyển dụng',         labelEn:'Careers',     href:S + '/tuyen-dung' },
      { label:'Hợp tác thương mại', labelEn:'Business',    href:S + '/hop-tac-thuong-mai' }
    ]}
  ];

  /* ══ Nút trong CỤM C — TOÀN BỘ deliverable về nút (D-39) ═══════════════
     Chỉ 3 nút + 1 nút mở lại modal:
       1. Chỉ đường  — redesign, mở M2 `#st-route` (clone overlay thật · D-43)
       2. Điểm đến   — redesign, bỏ #1769ff (D-04), mở M3 `#st-places`
       3. Combo      — MỚI, là <a> đi ra trang bán combo của site chính
       4. (nhỏ) mở lại modal welcome — chỉ hiện sau khi modal đóng lần đầu,
          đây là affordance của chính modal (morph, D-29), không phải nút thứ 4.

     KHÔNG có nút VR / compass / sound / fullscreen / ⋯ ở đây: cụm ⓓ dưới-giữa
     của trip360 đã có sẵn 4 nút đó, dựng lại là đè lên. */
  D.DOCK_BUTTONS = [
    { id:'st-btn-route',      icon:'i-route', i18n:'dock.route',  variant:'primary',   group:'nav', action:'open:st-route' },
    { id:'st-btn-places',     icon:'i-list',  i18n:'dock.places', variant:'secondary', group:'nav', action:'open:st-places' },
    { id:'st-welcome-reopen', icon:'i-map',   i18n:'dock.reopen', variant:'tonal',     group:'nav', action:'open:st-welcome', iconOnly:true }
  ];

  /* ══ THẺ VÉ COMBO — component RIÊNG, không nằm trong cụm C (D-41) ══════
     Khách chốt 2026-08-01: tách khỏi cụm nút, dựng thành hình TẤM VÉ, đặt
     dưới navbar bên phải. Cả tấm vé là 1 <a> — bấm đâu cũng đi, không có nút
     bên trong. Style: css/ticket.css. */
  D.TICKET = {
    id:   'st-ticket',
    icon: 'i-ticket',
    href: 'combo',          /* khoá trong D.LINKS — vẫn theo cờ LINKS_LIVE */
    i18n: { stub:'ticket.stub', eyebrow:'ticket.eyebrow', title:'ticket.title', aria:'ticket.aria' }
  };

  /* Bản v2 đầy đủ — GIỮ để đối chiếu, chỉ render khi `?full=1` (D-39). */
  D.DOCK_BUTTONS_FULL = [
    { id:'st-btn-route',      icon:'i-route', i18n:'dock.route',      variant:'primary',   group:'nav',  action:'open:st-route' },
    { id:'st-btn-places',     icon:'i-list',  i18n:'dock.places',     variant:'secondary', group:'nav',  action:'open:st-places' },
    { id:'st-welcome-reopen', icon:'i-map',   i18n:'dock.reopen',     variant:'tonal',     group:'nav',  action:'open:st-welcome', iconOnly:true },
    { sep:true, group:'view' },
    { id:'st-btn-vr',         icon:'i-vr',       i18n:'dock.vr',         variant:'circle', group:'view', action:'wip', iconOnly:true },
    { id:'st-btn-gyro',       icon:'i-compass',  i18n:'dock.gyro',       variant:'circle', group:'view', action:'wip', toggle:true, iconOnly:true },
    { id:'st-btn-sound',      icon:'i-sound-off',i18n:'dock.sound',      variant:'circle', group:'view', action:'toggle:sound', toggle:true, iconOn:'i-sound-on', iconOnly:true },
    { id:'st-btn-fullscreen', icon:'i-expand',   i18n:'dock.fullscreen', variant:'circle', group:'view', action:'toggle:fullscreen', toggle:true, iconOn:'i-collapse', iconOnly:true },
    { sep:true, group:'end' },
    { id:'st-btn-more',       icon:'i-more',  i18n:'dock.more', variant:'circle', group:'end', action:'popover', iconOnly:true }
  ];

  D.POPOVER_ITEMS = [
    { id:'st-btn-help',   icon:'i-help',   i18n:'popover.help',   action:'open:st-help' },
    { id:'st-btn-share',  icon:'i-share',  i18n:'popover.share',  action:'open:st-share' },
    { id:'st-btn-rotate', icon:'i-rotate', i18n:'popover.rotate', action:'toggle:autoRotate', toggle:true },
    { sep:true },
    { id:'st-btn-lang',   icon:'i-globe',  i18n:'popover.lang',   action:'lang' }
  ];

  /* ── CTA vé (Q16, Q17) — NGOÀI PHẠM VI từ 2026-08-01, không render (D-39) */
  D.CTA = [
    { id:'st-cta-ticket', icon:'i-ticket', i18n:'cta.ticket', href:D.LINKS.ticket },
    { id:'st-cta-combo',  icon:'i-combo',  i18n:'cta.combo',  href:D.LINKS.combo }
  ];

  /* ══ VÙNG CẤM — 4 cụm control CÓ SẴN của trip360 (D-40) ════════════════
     Không phải để vẽ ra: đây là bản ghi hình học để (a) sinh lớp ghost khi
     `?zones=1` và (b) trace được vì sao token --st-rz-* trong tokens.css lại
     mang giá trị đó. Số đo lấy từ ảnh khách gửi (docs/00-requirements.md §0.3),
     quy về viewport 1440×810 rồi làm tròn lên cho an toàn. */
  D.RESERVED_ZONES = [
    /* ⓐ là vùng cấm MỀM: header mới đã có sẵn bộ chuyển ngôn ngữ (#st-lang)
       và 5 icon social, tức nó THAY THẾ chức năng của cụm ⓐ chứ không phải
       che mất. Khi ghép thật phải ẩn cụm ⓐ gốc đi — xem docs/07-integration.md
       và câu hỏi Q-35. Đánh dấu `soft` để lớp ghost vẽ khác màu. */
    { key:'a', soft:true, label:'VN + chia sẻ (header thay thế)',
                                            css:'top:16px;  right:16px;  width:150px; height:44px' },
    { key:'b', label:'Sidebar danh mục',    css:'top:88px;  left:16px;   width:228px; height:330px' },
    { key:'d', label:'VR · la bàn · âm thanh · toàn màn hình',
                                            css:'bottom:20px; left:50%; width:300px; height:56px; transform:translateX(-50%)' },
    { key:'e', label:'2 nút tròn',          css:'top:50%;   right:16px;  width:52px;  height:116px; transform:translateY(-50%)' }
  ];

  /* ── 6 nhóm phân loại THẬT — lấy từ chip filter của overlay hiện có (D-28) */
  D.CATEGORIES = [
    { key:'all',     vi:'Tất cả',    en:'All' },
    { key:'game',    vi:'Trò chơi',  en:'Games' },
    { key:'sight',   vi:'Tham quan', en:'Sightseeing' },
    { key:'culture', vi:'Văn hoá',   en:'Culture' },
    { key:'food',    vi:'Ăn uống',   en:'Food & Drink' },
    { key:'util',    vi:'Tiện ích',  en:'Facilities' }
  ];

  /* Gradient + bầu trời cho panorama mock, chỉ dùng 3 màu brand + xám (D-21v2) */
  D.CATEGORY_META = {
    game:    { icon:'i-thrill', grad:['#d6282e','#ff7b01'], sky:['#ffd9a8','#ff9d5c','#e8623c'] },
    sight:   { icon:'i-see',    grad:['#128125','#65a723'], sky:['#cfeeff','#8fd4f0','#5bb7dc'] },
    culture: { icon:'i-gate',   grad:['#dea800','#fbd255'], sky:['#ffeec2','#ffd06a','#e9a83c'] },
    food:    { icon:'i-food',   grad:['#ff7b01','#fbd255'], sky:['#ffe9c9','#ffc078','#f09248'] },
    util:    { icon:'i-pin',    grad:['#475569','#94a3b8'], sky:['#dfe9f2','#b6c8da','#8fa5bb'] },
    '':      { icon:'i-pin',    grad:['#0e6b2e','#169e2c'], sky:['#d4efff','#9ad8f2','#63b9de'] }
  };

  /* `type` của catalog.json CHỈ dùng để chọn icon, không làm chip filter */
  D.TYPE_ICON = {
    'vào cổng':'i-gate', 'tham quan':'i-see', 'cảm giác mạnh':'i-thrill',
    'trải nghiệm':'i-spa', 'di chuyển':'i-ride', 'công viên nước':'i-wave',
    'trò chơi':'i-vr', 'khám phá':'i-adv', 'quà tặng':'i-gift',
    'chọn 1 trong 2':'i-boat', '':'i-pin'
  };

  /* ── Helper ──────────────────────────────────────────────────────────── */
  D.get = function (key) { return D.DESTINATIONS[key] || null; };

  D.keys = function () { return Object.keys(D.DESTINATIONS); };

  D.indexOf = function (key) { return D.keys().indexOf(key) + 1; };

  D.iconOf = function (dest) {
    if (!dest) return 'i-pin';
    var map = { gate:'i-gate', see:'i-see', thrill:'i-thrill', wave:'i-wave', boat:'i-boat',
                ride:'i-ride', spa:'i-spa', gift:'i-gift', adv:'i-adv', vr:'i-vr' };
    return map[dest.icon] || D.TYPE_ICON[dest.type] || 'i-pin';
  };

  D.metaOf = function (dest) {
    return D.CATEGORY_META[(dest && dest.cat) || ''] || D.CATEGORY_META[''];
  };

  /* Nhãn phân loại hiển thị theo ngôn ngữ */
  D.catLabel = function (dest, lang) {
    var c = D.CATEGORIES.filter(function (x) { return x.key === ((dest && dest.cat) || ''); })[0];
    return c ? (lang === 'en' ? c.en : c.vi) : '';
  };

  /* Bỏ dấu tiếng Việt — dùng cho tìm kiếm (D-18) */
  D.deaccent = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  };

  ST.data = D;
})();
