/* ═══════════════════════════════════════════════════════════════════════
   data.js — dữ liệu của popup.
   • UUID panorama, tên điểm, type, cat  → THẬT (data/catalog.json của site)
   • blurb                               → MOCK (tự viết, cần người Suối Tiên duyệt)
   • ảnh thẻ                             → THẬT (tải từ suoitien.vn, xem docs/06-data.md §6.8)
   Xem docs/06-data.md
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = {};

  /* Tổng số điểm THẬT trong catalog.json — dùng cho câu "hơn 150 điểm" */
  D.TOTAL_REAL = 158;

  /* ── Điểm đến ────────────────────────────────────────────────────────
     12 điểm có ảnh + 8 điểm giữ lại để `key` không trỏ hụt khi
     bổ sung ảnh sau (Q-38). `pano` là UUID THẬT → trang cha chỉ cần chuyền
     thẳng vào VRCore.navigateToPano(), không phải map lại gì. */
  D.DESTINATIONS = {
    cong: { name:'Cổng Thiên Tiên Môn', nameEn:'Fairyland Gate', type:'vào cổng', cat:'culture',
      pano:'panorama_F6136FEA_6328_24DA_41BC_7AF8284BD90E',
      blurb:'Cổng chính biểu tượng của Suối Tiên với hai tượng rồng uy nghi.',
      blurbEn:'The iconic main gate guarded by two majestic dragon statues.' },

    cungvang: { name:'Cung Vàng Điện Ngọc', nameEn:'The Royal Golden Palace', type:'tham quan', cat:'culture',
      pano:'panorama_F6118E80_6328_E743_41D1_E66E2DDB5031',
      blurb:'Cung điện dát vàng lộng lẫy, điểm chụp ảnh nổi tiếng nhất công viên.',
      blurbEn:'A dazzling gilded palace — the park’s most photographed spot.' },

    tuyet: { name:'Lâu Đài Tuyết', nameEn:'Snow Castle', type:'tham quan', cat:'sight',
      pano:'panorama_F6117DC6_6318_24C3_41CC_2E5B5115AA52',
      blurb:'Xứ tuyết âm độ giữa lòng Sài Gòn, có trượt tuyết và cung điện băng.',
      blurbEn:'A sub-zero snow world in Saigon, with sledding and an ice palace.' },

    casau: { name:'Vương Quốc Cá Sấu', nameEn:'Crocodile Kingdom', type:'tham quan', cat:'sight',
      pano:'panorama_F6139664_6318_67FB_41D8_56E29726450B',
      blurb:'Hơn 1.500 con cá sấu, có cầu câu cá sấu ngay trên đầm.',
      blurbEn:'Over 1,500 crocodiles, with a fishing bridge right above the pond.' },

    bien: { name:'Biển Tiên Đồng – Ngọc Nữ', nameEn:'Tien Dong – Ngoc Nu Beach', type:'công viên nước', cat:'game',
      pano:'panorama_467D98D6_55B6_DA79_41D1_FC9D881FCF00',
      blurb:'Biển nhân tạo lớn nhất Việt Nam với sóng và bãi cát nhân tạo.',
      blurbEn:'Vietnam’s largest man-made sea, complete with waves and sand.' },

    kylan: { name:'Kỳ Lân Cung', nameEn:'Unicorn Palace', type:'tham quan', cat:'culture',
      pano:'panorama_F612E651_6319_E7DC_41C7_D03C93019FD2',
      blurb:'Kiến trúc kỳ lân đặc sắc, tái hiện truyền thuyết dân gian Việt.',
      blurbEn:'Striking unicorn architecture retelling Vietnamese folk legends.' },

    phuthuy: { name:'Lâu Đài Pháp Thuật', nameEn:'Magic Castle', type:'tham quan', cat:'sight',
      pano:'panorama_467DBDC5_55B6_BA5B_41B1_4E62C210E533',
      blurb:'Lâu đài phù thuỷ nhiều tầng với ảo thuật và hiệu ứng bất ngờ.',
      blurbEn:'A multi-storey wizard castle full of illusions and surprises.' },

    amcung: { name:'Âm Cung Đệ Nhất Cung Đình Tửu', nameEn:'The Underworld Palace', type:'tham quan', cat:'culture',
      pano:'panorama_F6167827_6328_2B54_41D3_FACFB1359D7C',
      blurb:'Hành trình qua 18 tầng địa ngục theo tín ngưỡng dân gian.',
      blurbEn:'A walk through the 18 levels of hell in Vietnamese folk belief.' },

    tulinh: { name:'Du Thuyền Tứ Linh', nameEn:'Four Sacred Beasts Cruise', type:'trải nghiệm', cat:'sight',
      pano:'panorama_F6111295_6318_3F47_41D4_ED491EB9F8BA',
      blurb:'Du thuyền hình long — lân — quy — phụng dạo quanh hồ.',
      blurbEn:'Cruise on boats shaped as dragon, unicorn, turtle and phoenix.' },

    diabay: { name:'Đĩa Bay Hành Tinh Lạ', nameEn:'Alien UFO', type:'cảm giác mạnh', cat:'game',
      pano:'panorama_F6116F09_6318_654F_41D1_4DC165650AEB',
      blurb:'Đĩa bay xoay và lắc liên tục — không dành cho người yếu tim.',
      blurbEn:'A spinning, tilting UFO ride — not for the faint-hearted.' },

    vongxoay: { name:'Vòng Xoay Vũ Trụ', nameEn:'Rotation Of The Universe', type:'cảm giác mạnh', cat:'game',
      pano:'panorama_F613A3A6_6318_1D46_41B8_CEDF4002E4E6',
      blurb:'Vòng xoay khổng lồ nâng bạn lên cao rồi quay tròn giữa không trung.',
      blurbEn:'A giant swing that lifts you high and spins you mid-air.' },

    farm: { name:'Suối Tiên Farm', nameEn:'Suoi Tien Farm', type:'quà tặng', cat:'food',
      pano:'panorama_F612ECB5_6328_2B4F_41B5_0F2F816B5ABE',
      blurb:'Nông sản và đặc sản Suối Tiên — nho, sung Mỹ, quà mang về.',
      blurbEn:'Farm produce and local specialties — grapes, figs, gifts to take home.' },

    /* ── 8 điểm CHƯA CÓ ẢNH banner dùng được trên suoitien.vn (Q-38) ──────
       Không nằm trong D.CARDS nên không hiện trong popup. Giữ lại để khi
       khách gửi ảnh thì chỉ cần thêm 1 dòng vào CARDS, không phải đi tra
       lại UUID panorama. */
    xelua: { name:'Xe lửa tham quan toàn cảnh', nameEn:'Panoramic Tourist Train', type:'di chuyển', cat:'util',
      pano:'panorama_F613DD4A_6328_25D9_41A1_418FBB799434',
      blurb:'Vòng quanh công viên bằng xe lửa, ngắm toàn cảnh mà không mỏi chân.',
      blurbEn:'Circle the whole park by train and see everything without walking.' },

    massage: { name:'Massage Cá thư giãn', nameEn:'Fish Massage', type:'trải nghiệm', cat:'game',
      pano:'panorama_F610E916_6318_2D40_4184_D43C6272B020',
      blurb:'Ngâm chân cho đàn cá nhỏ mát-xa — cảm giác nhồn nhột rất lạ.',
      blurbEn:'Dip your feet and let tiny fish do the massage — ticklish and unforgettable.' },

    taxi: { name:'Xe Taxi Du Lịch', nameEn:'Tourist Taxi', type:'di chuyển', cat:'util',
      pano:'panorama_F61332DE_6328_1CF8_41D2_E48E647BD378',
      blurb:'Xe điện đưa đón trong khuôn viên, tiện cho gia đình có trẻ nhỏ.',
      blurbEn:'Electric shuttle around the park — handy for families with kids.' },

    coixay: { name:'Quần Thể Núi & Hang Động', nameEn:'Mountain & Cave Complex', type:'khám phá', cat:'sight',
      pano:'panorama_467BCFFF_55B2_B626_4189_80BEBC4CD962',
      blurb:'Hệ thống núi nhân tạo và hang động uốn lượn, mát lạnh quanh năm.',
      blurbEn:'Man-made mountains and winding caves that stay cool year-round.' },

    tauluon: { name:'Tàu Lượn Siêu Tốc', nameEn:'High-speed Roller Coaster', type:'cảm giác mạnh', cat:'game',
      pano:'panorama_F613BB7D_6318_2DCA_41B2_6C3CCC91DBCC',
      blurb:'Trò chơi mạnh nhất công viên — lao dốc và xoắn nhiều vòng.',
      blurbEn:'The park’s wildest ride — steep drops and multiple loops.' },

    vrgame: { name:'Tổ Hợp Trò Chơi Liên Hoàn', nameEn:'Combined Game Complex', type:'trò chơi', cat:'game',
      pano:'panorama_467C610B_55B5_4BEE_41CE_9ECBAC7714BD',
      blurb:'Khu trò chơi công nghệ: VR, phim 9D, game tương tác.',
      blurbEn:'Tech playground: VR, 9D cinema and interactive games.' },

    thuyenbay: { name:'Hồ Lạc Cảnh', nameEn:'Lac Canh Lake', type:'chọn 1 trong 2', cat:'sight',
      pano:'panorama_F6138D27_6318_6546_41B6_BA9BACF36F3E',
      blurb:'Hồ lớn giữa công viên, có đạp vịt và du thuyền thiên nga.',
      blurbEn:'A large central lake with pedal boats and swan cruises.' },

    thuyenrong: { name:'Khu Trò Chơi Hồ Lạc Cảnh', nameEn:'Lac Canh Lake Games', type:'chọn 1 trong 2', cat:'game',
      pano:'panorama_F6128E4B_6328_E7D8_41BD_62AF91EFC67C',
      blurb:'Cụm trò chơi ven hồ: thuyền rồng, thuyền bay, đu dây qua hồ.',
      blurbEn:'Lakeside rides: dragon boat, viking boat and zipline.' },

    /* ── 14 điểm THÊM ở YC-17 (D-59) cho 5 danh mục mới ───────────────────
       Ba danh mục khách vừa yêu cầu (Ẩm Thực · Suối Tiên Farm · Dịch vụ) cùng
       "Bốn Mùa Lễ Hội" và "Giải Trí - Trẻ Em" **không có một điểm nào** trong 20
       điểm cũ — tạo danh mục rỗng thì bấm vào ra slider trắng.

       `name` và `pano` ĐỌC THẬT từ `suoitien.trip360.vn/data/catalog.json`
       (158 điểm) — không bịa một ký tự nào, nên bấm là đi đúng panorama thật.
       `blurb` + `nameEn` vẫn là MOCK tôi viết, cần người Suối Tiên duyệt.
       Cả 14 điều CHƯA CÓ ẢNH — slider hiện thẻ gradient thay ảnh (D-59). */

    /* Ẩm thực — 4 nhà hàng thật trong công viên */
    nhahangbientiendong: { name:'Nhà Hàng Biển Tiên Đồng', nameEn:'Tien Dong Beach Restaurant', type:'ẩm thực', cat:'food',
      pano:'panorama_46049735_55B3_B63B_41CF_6035E46A3CC2',
      blurb:'Nhà hàng ngay cạnh biển nhân tạo, phục vụ hải sản và món Việt.',
      blurbEn:'Right by the man-made sea — seafood and Vietnamese dishes.' },

    nhahanghungvuong: { name:'Nhà Hàng Hùng Vương', nameEn:'Hung Vuong Restaurant', type:'ẩm thực', cat:'food',
      pano:'panorama_F610592D_6328_ED5D_41C6_F53A39099246',
      blurb:'Nhà hàng lớn nhất công viên, nhận đoàn và tiệc.',
      blurbEn:'The park’s largest restaurant — groups and banquets welcome.' },

    nhahangpholau: { name:'Nhà Hàng Phố Lẩu', nameEn:'Hotpot Street Restaurant', type:'ẩm thực', cat:'food',
      pano:'panorama_F611188A_6318_6B4D_41B9_84E7C2345CD6',
      blurb:'Phố lẩu nhiều vị, hợp nhóm đông người.',
      blurbEn:'A whole street of hotpot — made for big groups.' },

    nhahangphudong: { name:'Nhà Hàng Phù Đổng', nameEn:'Phu Dong Restaurant', type:'ẩm thực', cat:'food',
      pano:'panorama_F6111B3E_6318_2D45_41D8_8E52A7F19566',
      blurb:'Không gian mở, gần khu trò chơi trẻ em.',
      blurbEn:'Open-air dining next to the kids’ rides.' },

    /* Suối Tiên Farm */
    toancanhsuoitienfarm: { name:'Toàn Cảnh Suối Tiên Farm', nameEn:'Suoi Tien Farm Overview', type:'tham quan', cat:'sight',
      pano:'panorama_F61221ED_6318_1CCA_4199_66609663E2E5',
      blurb:'Nhìn bao quát cả khu nông trại trước khi vào từng vườn.',
      blurbEn:'The whole farm at a glance before you walk in.' },

    farmnho: { name:'Farm Nho', nameEn:'Grape Farm', type:'trải nghiệm', cat:'food',
      pano:'panorama_F612A56F_6328_65D6_41CA_A89C6D6574EE',
      blurb:'Vườn nho trĩu quả, hái và chụp ảnh tại chỗ.',
      blurbEn:'Heavy vines you can pick from — and photograph.' },

    farmsungmy: { name:'Farm Sung Mỹ', nameEn:'Fig Farm', type:'trải nghiệm', cat:'food',
      pano:'panorama_F6122A2D_6328_2F5A_41D2_60A6209A0DD6',
      blurb:'Vườn sung Mỹ trồng ngay trong công viên.',
      blurbEn:'A fig orchard grown inside the park.' },

    sieuthisuoitienfarm: { name:'Siêu Thị Suối Tiên Farm', nameEn:'Suoi Tien Farm Market', type:'quà tặng', cat:'food',
      pano:'panorama_F617713D_6328_3DB0_417B_B4F8E3B642AE',
      blurb:'Nông sản và đặc sản đóng gói sẵn để mang về.',
      blurbEn:'Packaged produce and specialties to take home.' },

    /* Bốn mùa lễ hội */
    longhoahoi: { name:'Long Hoa Hội', nameEn:'Long Hoa Festival Ground', type:'văn hoá', cat:'culture',
      pano:'panorama_467C76DA_55B5_5669_418C_07295BBC457D',
      blurb:'Sân lễ hội lớn, nơi diễn ra các chương trình theo mùa.',
      blurbEn:'The big festival ground where seasonal shows happen.' },

    tulinhhoitu: { name:'Tứ Linh Hội Tụ', nameEn:'Four Sacred Beasts Plaza', type:'văn hoá', cat:'culture',
      pano:'panorama_F612CC38_6318_2B4C_41D7_EDAEA5102F0C',
      blurb:'Long – lân – quy – phụng tụ về một quảng trường.',
      blurbEn:'Dragon, unicorn, turtle and phoenix in one plaza.' },

    suoitienfarmfestival: { name:'Suối Tiên Farm Festival', nameEn:'Suoi Tien Farm Festival', type:'lễ hội', cat:'culture',
      pano:'panorama_F611D554_6318_65C6_41D4_AE6694754A7D',
      blurb:'Lễ hội nông sản tổ chức ngay trong khu farm.',
      blurbEn:'A harvest festival held inside the farm.' },

    /* Giải trí – trẻ em */
    nguaphicaptreo: { name:'Ngựa Phi & Cáp Treo', nameEn:'Horse Ride & Cable Car', type:'trò chơi', cat:'game',
      pano:'panorama_F613999E_6318_2D47_41BA_A7D6F7941233',
      blurb:'Ngựa phi nước đại và cáp treo ngắm toàn khu — hợp trẻ nhỏ.',
      blurbEn:'A galloping-horse ride and a cable car — great for kids.' },

    /* Dịch vụ */
    tramxelua: { name:'Trạm Xe Lửa', nameEn:'Park Train Station', type:'di chuyển', cat:'util',
      pano:'panorama_F613B771_6328_25C8_41C4_E5CD50360025',
      blurb:'Nơi lên xe lửa tham quan vòng quanh công viên.',
      blurbEn:'Where you board the train that loops the park.' },

    khudichvutienich: { name:'Khu Dịch Vụ & Tiện Ích', nameEn:'Services & Amenities Area', type:'tiện ích', cat:'util',
      pano:'panorama_46042B28_55BD_7E2A_41D3_94B0054302EF',
      blurb:'Quầy vé, gửi đồ, nhà vệ sinh và cửa hàng tiện lợi.',
      blurbEn:'Ticket desk, lockers, restrooms and a convenience store.' }
  };

  /* Gắn key vào chính object cho tiện truyền quanh (bridge cần dest.key) */
  Object.keys(D.DESTINATIONS).forEach(function (k) { D.DESTINATIONS[k].key = k; });

  /* ── Ảnh của từng điểm ────────────────────────────────────────────────
     Thứ tự dưới đây xếp theo nhịp thị giác (cổng → cung điện → tuyết → thú →
     nước → …), không theo bảng chữ cái. Nó KHÔNG còn là thứ tự chạy vòng của
     một carousel nào nữa (bản 1 đã gỡ, D-57) — bây giờ thứ tự hiển thị do
     `keys` của từng nhóm trong D.GROUPS quyết định.

     img = ảnh banner THẬT tải từ suoitien.vn, đã cắt 3:2 (bề ngang 500–1200px
           tuỳ nguồn, KHÔNG phóng to — docs/06-data.md §6.8) và chuyển webp.
           URL gốc từng ảnh: docs/06-data.md §6.8.
           Ảnh nằm TRONG repo, không hotlink (RULE #3: không dependency ngoài).

     Tỉ lệ nguồn 3:2 giờ chỉ còn là mặc định dễ chịu chứ không phải ràng buộc:
     ô wall và panel slider đều `object-fit: cover` với khung tự do. Chỗ nhạy
     nhất là cột dọc hẹp trên mobile — xem `object-position` ở responsive2.css. */
  D.CARDS = [
    { key:'cong',     img:'assets/img/cards/cong.webp' },
    { key:'cungvang', img:'assets/img/cards/cungvang.webp' },
    { key:'tuyet',    img:'assets/img/cards/tuyet.webp' },
    { key:'casau',    img:'assets/img/cards/casau.webp' },
    { key:'bien',     img:'assets/img/cards/bien.webp' },
    { key:'kylan',    img:'assets/img/cards/kylan.webp' },
    { key:'phuthuy',  img:'assets/img/cards/phuthuy.webp' },
    { key:'amcung',   img:'assets/img/cards/amcung.webp' },
    { key:'tulinh',   img:'assets/img/cards/tulinh.webp' },
    { key:'diabay',   img:'assets/img/cards/diabay.webp' },
    { key:'vongxoay', img:'assets/img/cards/vongxoay.webp' },
    { key:'farm',     img:'assets/img/cards/farm.webp' }
  ];

  /* ── 6 nhóm phân loại THẬT — lấy từ chip filter của overlay danh sách (D-28).
     Popup chỉ dùng để in chip trên thẻ; giữ đủ 6 để khi thêm ảnh cho 8 điểm
     còn lại thì nhãn đã sẵn sàng. */
  D.CATEGORIES = [
    { key:'game',    vi:'Trò chơi',  en:'Games' },
    { key:'sight',   vi:'Tham quan', en:'Sightseeing' },
    { key:'culture', vi:'Văn hoá',   en:'Culture' },
    { key:'food',    vi:'Ăn uống',   en:'Food & Drink' },
    { key:'util',    vi:'Tiện ích',  en:'Facilities' }
  ];

  /* ══ D.MAP — bản đồ 2D và pin trên đó (D-51) ══════════════════════════
     Ảnh: bản đồ chính thức của Suối Tiên (thư mục `Ban Do Suoi Tien/`), đã
     cắt viền trong suốt và resize 2400×1208. Bản KHÔNG SỐ được chọn vì pin
     do ta vẽ đè lên — dùng bản có số sẵn thì hai lớp số chồng nhau.

     `w`/`h` phải khớp ảnh: js/map2d.js tính tỉ lệ "cover" từ hai số này để
     bản đồ không bao giờ để lộ mảng trống quanh mép. */
  D.MAP = {
    src: 'assets/map/park-2400.webp',
    w: 2400,
    h: 1208
  };

  /* Số hiệu + toạ độ pin.
     `no` = số in trên bản đồ giấy của công viên, hiện lên pin.
     `x`/`y` = % của ảnh bản đồ → đổi ảnh (giữ khung hình) không phải sửa gì.

     ⚠️ MOCK: chỉ 2 số dưới đây ĐỌC ĐƯỢC từ ảnh khách gửi (overlay "Chỉ đường"
     của trip360): 1 = Cổng Thiên Tiên Môn, 22A = Vương Quốc Cá Sấu.
     18 số còn lại và TOÀN BỘ x/y là tôi đặt bằng cách đối chiếu bằng mắt ảnh
     bản đồ với ảnh khách gửi — ĐỦ ĐỂ TRÌNH BÀY, chưa đủ để chỉ đường thật.
     Bản thật đọc `map/map_places.json` (`code` + toạ độ pixel trên map.jpg) —
     xem docs/06-data.md §6.10. */
  D.MAP_META = {
    cong:      { no:'1',   x:16.9, y:53.4, real:true },
    casau:     { no:'22A', x:87.5, y:34.7, real:true },
    cungvang:  { no:'2',   x:47.5, y:58.3 },
    tuyet:     { no:'17',  x:41.9, y:63.9 },
    bien:      { no:'50',  x:32.5, y:74.4 },
    kylan:     { no:'40',  x:56.3, y:69.5 },
    phuthuy:   { no:'19',  x:62.5, y:64.5 },
    amcung:    { no:'48',  x:52.8, y:84.0 },
    tulinh:    { no:'26',  x:75.0, y:52.1 },
    diabay:    { no:'13',  x:76.9, y:37.2 },
    vongxoay:  { no:'9',   x:71.9, y:32.3 },
    farm:      { no:'35',  x:82.5, y:65.8 },
    /* 8 điểm chưa có ảnh thẻ (Q-38) nhưng vẫn lên bản đồ được */
    xelua:     { no:'63',  x:25.0, y:58.3 },
    taxi:      { no:'64',  x:20.6, y:62.0 },
    massage:   { no:'52',  x:43.8, y:74.4 },
    coixay:    { no:'30',  x:55.0, y:53.4 },
    tauluon:   { no:'11',  x:64.4, y:37.2 },
    vrgame:    { no:'44',  x:66.3, y:58.3 },
    thuyenbay: { no:'101', x:70.6, y:42.2 },
    thuyenrong:{ no:'29',  x:78.1, y:55.8 }
  };

  /* ══ D.GROUPS — 11 ô của VR Wall, cũng là 11 chip lọc của slider ══════
     ⭐ Từ 2026-08-04 (YC-17 · D-59) đây là **danh mục THẬT của Suối Tiên**, đọc
     từ menu `suoitien.vn` và từ overlay "Điểm đến" của `suoitien.trip360.vn`
     (ảnh khách gửi). Trước đó là 9 nhóm TÔI TỰ ĐẶT theo `cat` — xem D-59.

     Thứ tự dưới đây = thứ tự trong ảnh khách gửi, KHÔNG được xếp lại cho đẹp:
     như vậy người dùng đi từ trang VR sang popup vẫn thấy cùng một danh sách,
     cùng một thứ tự. Ba mục cuối (Ẩm Thực · Suối Tiên Farm · Dịch vụ) là khách
     yêu cầu thêm, đều có thật trong menu `suoitien.vn`.

     size  'lg' | 'md' | 'sm' — ô chiếm mấy cell trong mosaic 5×3 (xem wall.css)
     cover key của ảnh làm nền tĩnh. **Có thể bỏ trống** — ô sẽ hiện gradient
           brand thay vì ảnh; đó là cách thành thật nhất để nói "khu vực này chưa
           có ảnh", thêm nữa hai ô dùng chung một tấm ảnh thì nhìn ra ngay là lỗi
     keys  destination của nhóm; ô tự đổi cảnh giữa các ảnh này, bấm ô là mở
           slider với đúng bộ này

     ⚠️ **Bố cục mosaic desktop ăn đúng 15 cell**: lg(2×2=4) + md(2×1=2) + 9×sm(9).
     Thêm/bớt một nhóm là vỡ phép tính đó và hàng cuối hở một ô — phải kèm theo
     sửa `grid-template-*` ở `css/wall.css`. Đã ghi ở đó.

     ⚠️ MOCK: **việc chia điểm nào vào danh mục nào** vẫn là tôi đối chiếu menu
     `suoitien.vn` bằng mắt (mỗi danh mục là một trang con có liệt kê điểm). Tên
     danh mục và `pano` thì THẬT. Cần người Suối Tiên duyệt lại (Q-41).
     Một điểm được phép nằm ở nhiều nhóm (Kỳ Lân Cung vừa là lịch sử vừa là tâm
     linh vừa là tham quan) — đúng như trên site thật. */
  D.GROUPS = [
    { key:'all', size:'lg', cover:'cong',
      vi:'Toàn Cảnh Suối Tiên', en:'All of Suoi Tien',
      subVi:'Hơn 150 điểm trong một hành trình',
      subEn:'150+ spots in one journey',
      keys:['cong','cungvang','tuyet','casau','bien','kylan','phuthuy','amcung','tulinh','diabay','vongxoay','farm'] },

    { key:'lichsu', size:'md', cover:'cungvang',
      vi:'Văn Hóa Lịch Sử Dân Tộc', en:'National History & Culture',
      subVi:'Công trình kể lại truyền thuyết Việt',
      subEn:'Monuments retelling Vietnamese legends',
      keys:['cong','cungvang','kylan','amcung'] },

    { key:'tamlinh', size:'sm', cover:'amcung',
      vi:'Văn Hóa Tâm Linh', en:'Spiritual Culture',
      subVi:'Âm Cung, Kỳ Lân Cung, Long Hoa Hội',
      subEn:'The Underworld, Unicorn Palace, Long Hoa',
      keys:['amcung','kylan','longhoahoi','tulinhhoitu'] },

    { key:'bien', size:'sm', cover:'bien',
      vi:'Biển Tiên Đồng Ngọc Nữ', en:'Tien Dong – Ngoc Nu Beach',
      subVi:'Biển nhân tạo lớn nhất Việt Nam',
      subEn:'Vietnam’s largest man-made sea',
      keys:['bien','nhahangbientiendong'] },

    { key:'lehoi', size:'sm', cover:'tuyet',
      vi:'Bốn Mùa Lễ Hội', en:'Four Seasons of Festivals',
      subVi:'Mùa nào cũng có lễ hội riêng',
      subEn:'Every season has its own festival',
      keys:['tuyet','longhoahoi','suoitienfarmfestival','tulinhhoitu'] },

    { key:'khampha', size:'sm', cover:'phuthuy',
      vi:'Tham Quan & Khám Phá', en:'Sightseeing & Discovery',
      subVi:'Cung điện, lâu đài, hang động, thú hoang',
      subEn:'Palaces, castles, caves and wildlife',
      keys:['cungvang','tuyet','casau','phuthuy','kylan','amcung','tulinh','coixay'] },

    { key:'camgiacmanh', size:'sm', cover:'vongxoay',
      vi:'Trò Chơi Cảm Giác Mạnh', en:'Thrill Rides',
      subVi:'Dành cho người thích tim đập nhanh',
      subEn:'For the fast-heartbeat crowd',
      keys:['vongxoay','diabay','tauluon','thuyenrong'] },

    { key:'treem', size:'sm', cover:'tulinh',
      vi:'Giải Trí - Trẻ Em', en:'Family & Kids',
      subVi:'Nhẹ nhàng, đi cả nhà được',
      subEn:'Gentle enough for everyone',
      keys:['tulinh','bien','massage','nguaphicaptreo','vrgame'] },

    /* Ba nhóm dưới đây khách yêu cầu thêm (YC-17). Hai trong số đó KHÔNG CÓ
       `cover`: kho ảnh hiện có 12 tấm, không tấm nào là nhà hàng hay khu tiện ích.
       Mượn tạm ảnh `farm` cho cả ba thì ba ô cạnh nhau trông y hệt — tệ hơn hẳn
       một ô gradient thành thật. Khách gửi ảnh (Q-38) là điền `cover` vào là xong. */
    { key:'amthuc', size:'sm',
      vi:'Ẩm Thực', en:'Food & Dining',
      subVi:'Bốn nhà hàng lớn trong công viên',
      subEn:'Four large restaurants inside the park',
      keys:['nhahangbientiendong','nhahanghungvuong','nhahangpholau','nhahangphudong'] },

    { key:'farm', size:'sm', cover:'farm',
      vi:'Suối Tiên Farm', en:'Suoi Tien Farm',
      subVi:'Farm nho, sung Mỹ và đặc sản mang về',
      subEn:'Grape and fig farms, produce to take home',
      keys:['farm','toancanhsuoitienfarm','farmnho','farmsungmy','sieuthisuoitienfarm','suoitienfarmfestival'] },

    { key:'dichvu', size:'sm',
      vi:'Dịch vụ', en:'Services & Facilities',
      subVi:'Xe lửa, taxi điện, khu tiện ích',
      subEn:'Park train, shuttle and amenities',
      keys:['xelua','taxi','tramxelua','khudichvutienich'] }
  ];

  D.group = function (key) {
    return D.GROUPS.filter(function (g) { return g.key === key; })[0] || D.GROUPS[0];
  };

  /* Trộn số hiệu + toạ độ vào chính DESTINATIONS để nơi dùng chỉ cần `d.no`
     / `d.x` / `d.y`, không phải tra chéo 2 bảng. Điểm nào chưa có toạ độ thì
     `d.no` là undefined → js/map2d.js tự bỏ qua, không vẽ pin trống. */
  Object.keys(D.MAP_META).forEach(function (k) {
    var d = D.DESTINATIONS[k], m = D.MAP_META[k];
    if (!d) return;
    d.no = m.no; d.x = m.x; d.y = m.y; d.noReal = !!m.real;
  });

  /* ── Helper ──────────────────────────────────────────────────────────── */
  D.get = function (key) { return D.DESTINATIONS[key] || null; };

  /* Ảnh của một destination — tra ngược từ CARDS. Trả '' nếu điểm chưa có ảnh. */
  D.imgOf = function (key) {
    var c = D.CARDS.filter(function (x) { return x.key === key; })[0];
    return c ? c.img : '';
  };

  /* Bỏ dấu tiếng Việt — cho ô tìm kiếm của slider. Gõ "lau dai" phải ra
     "Lâu Đài Tuyết". */
  D.deaccent = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  };

  /* ⚫ `D.mustOf()` + cờ `must:true` trên CARDS đã bị gỡ ngày 2026-08-04 (D-57).
     Chúng phục vụ badge ★ "Nên xem" của bản 1; ở bản này khái niệm đó đã có
     chỗ ở đàng hoàng hơn là nhóm `noibat` trong D.GROUPS. Giữ lại một cờ dữ
     liệu không ai đọc thì lần sau có người sẽ tưởng nó đang có tác dụng. */

  D.catLabel = function (dest, lang) {
    var c = D.CATEGORIES.filter(function (x) { return x.key === ((dest && dest.cat) || ''); })[0];
    return c ? (lang === 'en' ? c.en : c.vi) : '';
  };

  ST.data = D;
})();
