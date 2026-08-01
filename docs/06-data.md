> Cập nhật: 2026-08-01 (v4 — thêm MAP_META + WAYFIND cho M2/M3 · D-43)

# 06 — Data

Toàn bộ dữ liệu prototype nằm trong `js/data.js` dưới namespace `ST.data`.
Không fetch, không JSON ngoài → mở `file://` chạy được (Q2).

## 6.1 Dữ liệu thật trên site (nguồn tham chiếu)

### `data/catalog.json` — đã đọc, verify 2026-07-30

```json
{
  "defaultPano": "panorama_F617713D_6328_3DB0_417B_B4F8E3B642AE",
  "destinations": {
    "cong": {
      "name": "Cổng Thiên Tiên Môn",
      "type": "vào cổng",
      "icon": "gate",
      "pano": "panorama_F6136FEA_6328_24DA_41BC_7AF8284BD90E"
    }
  }
}
```

| Field | Kiểu | Ghi chú |
|---|---|---|
| `defaultPano` | string | UUID panorama mở đầu |
| `destinations` | object | **158 entry**, key là slug tiếng Việt không dấu |
| `destinations[k].name` | string | Tên hiển thị. **Có trùng lặp** giữa các key |
| `destinations[k].type` | string | Chỉ **20/158** có giá trị, 138 là `""` |
| `destinations[k].icon` | string | Chỉ 20/158 có giá trị |
| `destinations[k].pano` | string | UUID panorama 3DVista, format `panorama_XXXXXXXX_XXXX_XXXX_XXXX_XXXXXXXXXXXX` |

### Phân bố `type` (đếm thật)

| type | Số lượng |
|---|---|
| `""` (rỗng) | 138 |
| `tham quan` | 6 |
| `cảm giác mạnh` | 3 |
| `di chuyển` | 2 |
| `trải nghiệm` | 2 |
| `chọn 1 trong 2` | 2 |
| `vào cổng` | 1 |
| `quà tặng` | 1 |
| `khám phá` | 1 |
| `trò chơi` | 1 |
| `công viên nước` | 1 |

> ⚠️ `chọn 1 trong 2` là type lạ — dùng cho `thuyenbay` (Hồ Lạc Cảnh) và
> `thuyenrong` (Khu Trò Chơi Hồ Lạc Cảnh). Có vẻ là ghi chú nghiệp vụ (vé cho chọn
> 1 trong 2 trò), không phải phân loại. Prototype gộp vào chip `khác`.

### Phân bố `icon`

`gate`(1) `ride`(2) `spa`(1) `see`(6) `gift`(1) `adv`(1) `boat`(3) `thrill`(3)
`vr`(1) `wave`(1) · `""`(138)

→ [`02-design-system.md`](02-design-system.md) §2.7 định nghĩa `i-gate` `i-ride`
`i-spa` `i-see` `i-gift` `i-adv` `i-boat` `i-thrill` `i-vr` `i-wave` khớp đúng 10 giá trị này.

### 20 destination có `type` — "highlight" đã được curate

| key | type | icon | name |
|---|---|---|---|
| `cong` | vào cổng | gate | Cổng Thiên Tiên Môn |
| `xelua` | di chuyển | ride | Xe lửa tham quan toàn cảnh |
| `massage` | trải nghiệm | spa | Massage Cá thư giãn |
| `casau` | tham quan | see | Vương Quốc Cá Sấu |
| `cungvang` | tham quan | see | Cung Vàng Điện Ngọc |
| `farm` | quà tặng | gift | Sản phẩm đặc trưng Suối Tiên Farm |
| `taxi` | di chuyển | ride | Xe Taxi Du Lịch |
| `kylan` | tham quan | see | Kỳ Lân Cung |
| `tuyet` | tham quan | see | Lâu Đài Tuyết |
| `amcung` | tham quan | see | Âm Cung Đệ Nhất Cung Đình Tửu |
| `phuthuy` | tham quan | see | Lâu Đài Pháp Thuật |
| `coixay` | khám phá | adv | Quần Thể Núi & Hang Động |
| `tulinh` | trải nghiệm | boat | Du Thuyền Tứ Linh |
| `diabay` | cảm giác mạnh | boat | Đĩa Bay Hành Tinh Lạ |
| `tauluon` | cảm giác mạnh | thrill | Tàu Lượn Siêu Tốc |
| `vongxoay` | cảm giác mạnh | thrill | Vòng Xoay Vũ Trụ |
| `vrgame` | trò chơi | vr | Tổ Hợp Trò Chơi Liên Hoàn |
| `thuyenbay` | chọn 1 trong 2 | boat | Hồ Lạc Cảnh |
| `thuyenrong` | chọn 1 trong 2 | boat | Khu Trò Chơi Hồ Lạc Cảnh |
| `bien` | công viên nước | wave | Biển Tiên Đồng – Ngọc Nữ |

### Các JSON khác của site (không public từ root, chỉ suy ra từ code)

| File | Vị trí | Nội dung suy đoán |
|---|---|---|
| `map_places.json` | `map/` | POI trên bản đồ: id, tên, toạ độ pixel |
| `map_places_content.json` | `map/` | Mô tả dài, ảnh, giờ mở cửa của từng POI |
| `map_panos.json` | `map/` | Map POI id ↔ panorama UUID |
| `map_graph.json` | `map/` | Đồ thị đường đi cho pathfinding (node + edge + độ dài) |
| `map_geo.json` | `map/` | Điểm hiệu chỉnh GPS ↔ pixel cho `GeoCalib` |
| `map_locales.json` | `map/` | Chuỗi i18n VI/EN |

→ Bản thật khi port sang thì `ST.data.DESTINATIONS` nên **thay bằng fetch
`data/catalog.json` + `map/map_places.json`**. Xem [`07-integration.md`](07-integration.md) §7.3.

## 6.2 Schema `js/data.js`

### `ST.data.DESTINATIONS` — object, key = slug

```js
DESTINATIONS = {
  tuyet: {
    key:   'tuyet',                    // trùng với key object, để tiện truyền quanh
    name:  'Lâu Đài Tuyết',
    type:  'tham quan',                // '' nếu không có
    icon:  'see',                      // '' nếu không có → fallback 'i-pin'
    pano:  'panorama_F6117DC6_6318_24C3_41CC_2E5B5115AA52',   // UUID THẬT
    blurb: 'Xứ tuyết -2°C giữa lòng Sài Gòn với cung điện băng và trượt tuyết trong nhà.',
    // MOCK: blurb do tự viết. Bản thật lấy từ map_places_content.json
    hero:  null,                       // URL ảnh; null → gradient placeholder
    views: ['tuyet']                   // các key cùng tên (gộp trùng) — xem §6.4
  }
}
```

| Field | Kiểu | Bắt buộc | Nguồn |
|---|---|---|---|
| `key` | string | ✅ | tự đặt = key object |
| `name` | string | ✅ | **catalog.json thật** |
| `type` | string | ✅ (có thể `''`) | **catalog.json thật** |
| `icon` | string | ✅ (có thể `''`) | **catalog.json thật** |
| `pano` | string | ✅ | **catalog.json thật** — giữ UUID để port sang bản thật là dùng được ngay |
| `blurb` | string | ⬜ | `// MOCK:` tự viết, chỉ có ở 20 điểm highlight |
| `hero` | string\|null | ⬜ | `null` trong prototype (Q27 chưa có ảnh) |
| `views` | string[] | ✅ | tính lúc build data (gộp trùng tên) |

**Prototype chỉ nhồi 20 điểm highlight + ~20 điểm thường** (để demo search và
lazy-load có gì mà chạy), không copy hết 158 entry vào `data.js`. Có cờ:

```js
// MOCK: 40/158 điểm. Bật ST.data.USE_LIVE_CATALOG = true để fetch catalog.json thật.
ST.data.USE_LIVE_CATALOG = false;
ST.data.TOTAL_REAL = 158;   // dùng cho label "4/158", "hơn 150 điểm"
```

### `ST.data.HOTSPOTS` — array, thứ tự = thứ tự stagger animation

```js
HOTSPOTS = [
  { key:'cong',    x:14, y:78, xm:22, ym:86, must:false },
  { key:'farm',    x:22, y:46, xm:18, ym:66, must:false },
  { key:'casau',   x:40, y:22, xm:38, ym:22, must:false },
  { key:'tuyet',   x:52, y:38, xm:56, ym:38, must:true  },
  { key:'phuthuy', x:62, y:58, xm:70, ym:56, must:true  },
  { key:'bien',    x:42, y:72, xm:34, ym:74, must:true  },
  { key:'tauluon', x:76, y:44, xm:78, ym:46, must:false },
  { key:'tulinh',  x:84, y:70, xm:80, ym:66, must:false }
];
```

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `key` | string | Trỏ vào `DESTINATIONS` |
| `x`, `y` | number 0–100 | Toạ độ **%** trên bản đồ landscape (`viewBox 0 0 1000 640`) |
| `xm`, `ym` | number 0–100 | Toạ độ **%** trên bản đồ portrait mobile (`viewBox 0 0 640 800`) |
| `must` | boolean | `true` → có ring pulse vàng "✦ nên xem" |

> Dùng `%` chứ không px → đổi kích thước/viewBox bản đồ không phải sửa toạ độ.
> `// MOCK:` toạ độ đặt theo cảm giác bố cục, **không đúng vị trí địa lý thật**.

### `ST.data.NAV_MENU` — array (✅ **84 mục THẬT**, 3 cấp, href thật)

Lấy trực tiếp từ HTML site chính. Danh sách đầy đủ ở §6.6.

```js
ST.data.LINKS_LIVE = false;   // Q22 = (b) → click href="#" + toast. Bật true là đi link thật.

NAV_MENU = [
  { label:'Trang chủ', href:'https://suoitien.vn/' },
  { label:'Giới thiệu', href:'https://suoitien.vn/ladingpage/block/index.php', children:[
      { label:'Về Suối Tiên', href:'https://suoitien.vn/ladingpage/block/index.php' },
      { label:'Bản đồ',       href:'https://suoitien.vn/ban-do' }
  ]},
  { label:'Trải nghiệm đặc biệt', href:'https://suoitien.vn/trai-nghiem-dac-biet', children:[ /* 5 mục */ ]},
  { label:'VR360', href:'#', id:'st-nav-vr360', current:true },   // ← MỚI (Q19)
  { label:'TRÒ CHƠI', href:'https://suoitien.vn/tro-choi', children:[
      { label:'THAM QUAN - KHÁM PHÁ', href:'…/kham-pha',      children:[ /* 14 mục */ ]},
      { label:'CẢM GIÁC MẠNH',        href:'…/cam-giac-manh', children:[ /*  9 mục */ ]},
      { label:'GIẢI TRÍ - TRẺ EM',    href:'…/giai-tri-tre-em',children:[ /*  8 mục */ ]}
  ]},
  { label:'Dịch vụ',  href:'https://suoitien.vn/dich-vu',  children:[ /* 4 mục */ ]},
  { label:'Bảng giá', href:'https://suoitien.vn/bang-gia', children:[ /* 4 mục */ ]},
  { label:'Tin tức & Thư viện', href:'https://suoitien.vn/tin-tuc-thu-vien', children:[ /* 2 + 4 mục */ ]},
  { label:'TUYỂN DỤNG & LIÊN HỆ', href:'https://suoitien.vn/tuyen-dung-lien-he', children:[ /* 3 mục */ ]}
];
```

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `label` | string | Chữ hiển thị — **giữ đúng chữ hoa/thường như site thật** (`TRÒ CHƠI` in hoa, `Dịch vụ` thường) |
| `href` | string | URL **thật**. Render ra `#` khi `LINKS_LIVE === false` |
| `id` | string? | Chỉ tab VR360 |
| `current` | boolean? | `true` → `aria-current="page"` |
| `children` | array? | Có → dropdown. Lồng 3 cấp ở "TRÒ CHƠI" và "Tin tức" |
| `i18nKey` | string? | Key trong `COPY.en.nav` để dịch label sang EN (Q4) |

> ✅ Không còn mock. `text-transform: uppercase` của CSS lo phần in hoa hiển thị, nên
> `label` giữ nguyên chữ gốc để bản EN và drawer mobile dùng lại được.

### `ST.data.SCOPE` — string ⭐ MỚI (D-39)

```js
D.SCOPE = 'minimal';   // 'minimal' (mặc định) | 'full'
```

Cờ phạm vi. `'minimal'` → `app.js` gắn `class="st-scope-min"` lên `<html>`, `scope.css`
ẩn phần ngoài phạm vi và các hàm render trong `controls.js` return sớm.
`index.html?full=1` đặt lại thành `'full'` → dựng nguyên bản v2 để đối chiếu.

Không xoá code của phần bị tắt: quyết định phạm vi đã đảo một lần, và docs §3/§4 đang
trace theo selector nên markup phải còn.

---

### `ST.data.DOCK_BUTTONS` — array (CỤM C, 3 mục)

```js
DOCK_BUTTONS = [
  { id:'st-btn-route',      icon:'i-route', i18n:'dock.route',  variant:'primary',   group:'nav', action:'existing:route' },
  { id:'st-btn-places',     icon:'i-list',  i18n:'dock.places', variant:'secondary', group:'nav', action:'existing:places' },
  { id:'st-welcome-reopen', icon:'i-map',   i18n:'dock.reopen', variant:'tonal',     group:'nav', action:'open:st-welcome', iconOnly:true }
];
```

> Nút combo **không còn ở đây** — đã tách thành `ST.data.TICKET` (D-41).

| Field | Ý nghĩa |
|---|---|
| `variant` | `primary` \| `secondary` \| `tonal` — xem [`03-components.md`](03-components.md) §3.3 |
| `i18n` | Khoá trong `COPY.<lang>` — **không** hardcode chuỗi ở `data.js` |
| `action` | `existing:<key>` \| `open:<modalId>` \| `toggle:<stateKey>` \| `popover` \| `lang` |
| `href` | Khoá trong `D.LINKS`. Có field này thì render ra `<a>` chứ không `<button>`, và **không** có `data-action`. Hiện chỉ bản `_FULL` dùng |
| `iconOnly` | `true` → không render `<span>` nhãn, chuyển nhãn sang `aria-label` + `data-tip` |
| `group` | `nav` — hiện chỉ còn duy nhất nhóm này |
| `sep` | Chỉ vạch phân cách, không phải nút (chỉ còn dùng ở bản `_FULL`) |

---

### `ST.data.TICKET` — object ⭐ MỚI (D-41)

```js
TICKET = {
  id:   'st-ticket',
  icon: 'i-ticket',
  href: 'combo',
  i18n: { stub:'ticket.stub', eyebrow:'ticket.eyebrow', title:'ticket.title', aria:'ticket.aria' }
};
```

Thẻ vé combo — component **riêng**, không nằm trong cụm C. Render bởi `renderTicket()`
trong `controls.js`, style ở `css/ticket.css`. Cả tấm vé là **1 `<a>`**: không có
`<button>` bên trong, không có con dấu.

| Khoá i18n | VI | EN | Ghi chú |
|---|---|---|---|
| `ticket.stub` | Vé | Pass | nhãn trên cuống vé, ẩn ở `≤599px` |
| `ticket.eyebrow` | Vé combo | Combo pass | uppercase, `letter-spacing .18em` |
| `ticket.title` | Xem combo trò chơi | View ride combos | **phải NGẮN** — vé `white-space: nowrap`, dài là tràn |
| `ticket.aria` | (câu đầy đủ) | (câu đầy đủ) | `aria-label` của cả link |

**`href` và cờ `LINKS_LIVE` (Q22 = b)** — dùng chung hàm `linkAttrs()` với dock:
`LINKS_LIVE=false` → render `href="#"`, handler chung `a[href="#"]` bắn toast *"Bản demo
— link không mở trang thật"*. Bật cờ lên thì `href` thành URL thật + `target="_blank"
rel="noopener"`. URL thật **luôn** nằm ở `data-href` để kiểm tra được mà không cần bật cờ.

`D.LINKS.combo` = `https://suoitien.vn/combo-tro-choi` — **trùng đúng** href của mục
*Bảng giá › Combo trò chơi* trong `NAV_MENU` (§6.6), không phải URL đoán.

---

### `ST.data.DOCK_BUTTONS_FULL` — array (10 mục, bản v2)

Giữ nguyên dock hợp nhất của bản v2 (2 nút nav + nhóm xem VR/la bàn/âm thanh/toàn màn
hình + `⋯`). Chỉ render khi `?full=1`. Xem D-40 để biết vì sao nó bị thay.

---

### `ST.data.RESERVED_ZONES` — array ⭐ MỚI (D-40)

```js
RESERVED_ZONES = [
  { key:'a', soft:true, label:'VN + chia sẻ (header thay thế)',
    css:'top:16px; right:16px; width:150px; height:44px' },
  { key:'b', label:'Sidebar danh mục',
    css:'top:88px; left:16px; width:228px; height:330px' },
  { key:'d', label:'VR · la bàn · âm thanh · toàn màn hình',
    css:'bottom:20px; left:50%; width:300px; height:56px; transform:translateX(-50%)' },
  { key:'e', label:'2 nút tròn',
    css:'top:50%; right:16px; width:52px; height:116px; transform:translateY(-50%)' }
];
```

Hình học 4 cụm control **đã có** của trip360. Số đo lấy từ 6 ảnh khách gửi
([`00-requirements.md`](00-requirements.md) §0.3), quy về viewport 1440×810 rồi làm
tròn lên cho an toàn.

| Field | Ý nghĩa |
|---|---|
| `key` | ⓐ ⓑ ⓓ ⓔ — khớp nhãn cụm ở §0.3 |
| `css` | Inline style đặt ghost — viết thẳng CSS vì đây là dữ liệu hình học một lần |
| `soft` | ⭐ Vùng cấm **mềm**: header mới **thay thế** chức năng của cụm ⓐ (có sẵn `#st-lang` + 5 social) chứ không chỉ che nó. Ghost vẽ màu vàng thay vì xám. Khi ghép thật phải ẩn cụm ⓐ gốc — Q-33 |

Dùng cho **2** việc: (1) sinh lớp ghost khi `?zones=1`, (2) là nguồn để trace vì sao
token `--st-rz-*` trong `tokens.css` mang giá trị đó. Sửa số ở đây thì phải sửa token
tương ứng — chúng **không** tự đồng bộ.

### `ST.data.MAP_META` — số hiệu + toạ độ trên bản đồ ⭐ MỚI (D-43)

```js
MAP_META = {
  cong:     { no:'1',   x:13, y:80, real:true },
  casau:    { no:'22A', x:41, y:21, real:true },
  xelua:    { no:'63',  x:22, y:66 },          // MOCK
  …
};
// trộn thẳng vào DESTINATIONS → nơi dùng chỉ cần d.no / d.x / d.y
```

| Field | Ý nghĩa |
|---|---|
| `no` | Số in trên pin của bản đồ giấy. Hiện lên đầu tên trong M3 và trong pin của M2 |
| `x` `y` | **% của khung 1000×620** — đổi ảnh nền không phải sửa logic, cùng cách với `HOTSPOTS` |
| `real` | `true` = số hiệu đọc được từ ảnh khách gửi. Chỉ **6/20** điểm có: 1, 2, 22A, 40, 48, 101 |

⚠️ **14 số còn lại và TOÀN BỘ `x`/`y` là MOCK.** Bản thật lấy `code` + toạ độ pixel
từ `map_places.json`. Số hiệu bịa mà trùng số thật của điểm khác thì bản đồ giấy và
bản đồ số nói hai chuyện khác nhau — kiểm lại toàn bộ trước khi port.

### `ST.data.WAYFIND` — tham số tính quãng đường ⭐ MỚI (D-43)

```js
WAYFIND = { mPerX: 14, mPerY: 8.7, detour: 1.15, walkMpm: 70 };
```

| Field | Ý nghĩa | Cơ sở |
|---|---|---|
| `mPerX` / `mPerY` | Mét trên mỗi 1% ngang/dọc | Khung 1000×620 đại diện khu đất ~1400×870 m |
| `detour` | Hệ số vòng vèo | Đi bộ không bao giờ đi đường chim bay |
| `walkMpm` | Mét mỗi phút | 70 ≈ 4,2 km/h — tốc độ đi dạo, không phải đi nhanh |

Đối chiếu: ảnh khách gửi hiện *"625 m · 8 phút"* cho tuyến 1 → 22A; công thức này
cho **745 m · 11 phút** cho cùng tuyến. Lệch vì `x`/`y` là MOCK, không phải vì công
thức sai. Thay bằng Dijkstra trên `map_graph.json` là hết lệch.

### `js/i18n.js` — `COPY.vi` + `COPY.en` (Q4 = cần bản EN)

Tách sang file riêng vì Q4 yêu cầu bản EN → mọi chuỗi phải có 2 phiên bản. Không
hardcode chuỗi trong bất kỳ file JS/HTML nào khác.

```js
ST.i18n = {
  lang: localStorage['st.lang'] || 'vi',
  set(l)   { … re-render },          // đổi ngôn ngữ + lưu localStorage
  t(key)   { … },                    // 'welcome.title' → chuỗi
  apply(root = document) { … }       // quét [data-i18n] / [data-i18n-aria] và thay
};

COPY = {
  vi: {
    nav:      { /* label EN cho 84 mục — chỉ những mục cần dịch */ },
    topbar:   { addr, hotline, email, lang },
    welcome:  { eyebrow, titles:{a,b,c}, subtitle, legend, skip, mapLabel },
    dock:     { route, places, reopen, vr, gyro, sound, fullscreen, more },
    popover:  { help, share, rotate, lang },
    share:    { title, copyBtn, copied, manualCopy, qrNote },
    help:     { title, steps:[{icon,title,text} × 5], dontShow },
    cta:      { ticket, combo },
    hint:     'Kéo để xem toàn cảnh 360°',
    peek:     'Mở menu',
    scene:    '{name} · {index}/{total}',
    toast:    { wip, copied, linkDemo, overlayExists, noPano, fsBlocked, … },
    close:    'Đóng'
  },
  en: { /* cùng cấu trúc */ }
};
```

**Quy ước markup:**
```html
<h2 data-i18n="welcome.title">Bạn muốn ghé thăm nơi nào trước?</h2>
<button data-i18n-aria="close" aria-label="Đóng">…</button>
<span data-i18n="scene" data-i18n-vars='{"name":"Lâu Đài Tuyết","index":4,"total":158}'>…</span>
```

`ST.toast()` nhận **key**, không nhận chuỗi: `ST.toast('toast.wip')`.

### `ST.data.CONTACT` / `SOCIAL` (✅ URL THẬT)

```js
CONTACT = {
  hotline: ['1900 636 787', '028.38960260', '0914347787'],
  email:   'phongkinhdoanh@suoitien.com',
  address: '120 Xa Lộ Hà Nội, P. Tăng Nhơn Phú, TP.Hồ Chí Minh'
};
SOCIAL = [   // ✅ lấy từ HTML site chính
  { name:'Facebook',  icon:'i-fb', href:'https://www.facebook.com/SuoiTienThemePark/' },
  { name:'TikTok',    icon:'i-tt', href:'https://www.tiktok.com/@suoitienthemepark?lang=vi-VN' },
  { name:'LinkedIn',  icon:'i-in', href:'#' },   // site chính cũng để '#'
  { name:'Instagram', icon:'i-ig', href:'https://www.instagram.com/suoitienthemeparkofficial/' },
  { name:'YouTube',   icon:'i-yt', href:'https://www.youtube.com/@suoitienthemeparkofficial' }
];
LINKS = {
  ticket: 'https://suoitien.vn/chon-ve',           // ✅ THẬT (Q17)
  combo:  'https://suoitien.vn/combo-tro-choi',    // 🟡 candidate (Q-32)
  map:    'https://suoitien.vn/ban-do',
  farm:   'https://stf.suoitien.vn',
  logo:   'https://suoitien.vn/halink-content/uploads/logosuoitien.png'   // ✅ 200 OK, 131 KB
};
```

### `ST.data.CATEGORIES` — 6 nhóm THẬT (D-28, Q-29)

Lấy từ chip filter thật của overlay danh sách (ảnh 4). **Không** dùng 10 `type` của
`catalog.json`.

```js
CATEGORIES = [
  { key:'all',   vi:'Tất cả',   en:'All' },
  { key:'game',  vi:'Trò chơi', en:'Games' },
  { key:'sight', vi:'Tham quan',en:'Sightseeing' },
  { key:'culture',vi:'Văn hoá', en:'Culture' },
  { key:'food',  vi:'Ăn uống',  en:'Food & Drink' },
  { key:'util',  vi:'Tiện ích', en:'Facilities' }
];
```

### `ST.data.CATEGORY_META` — gradient/icon theo nhóm (D-21v2)

Chỉ dùng 3 màu brand + xám. **Không** ra khỏi palette như v1.

```js
CATEGORY_META = {
  game:    { icon:'i-thrill', grad:['#D6282E','#FF7B01'] },   // đỏ → cam
  sight:   { icon:'i-see',    grad:['#128125','#65A723'] },   // xanh lá
  culture: { icon:'i-gate',   grad:['#DEA800','#FBD255'] },   // vàng
  food:    { icon:'i-food',   grad:['#FF7B01','#FBD255'] },   // cam → vàng
  util:    { icon:'i-pin',    grad:['#475569','#94A3B8'] },   // xám
  '':      { icon:'i-pin',    grad:['#0e6b2e','#169e2c'] }    // xanh đậm (mặc định)
};
```

### `ST.data.TYPE_ICON` — map `type` của catalog → icon

`type` của `catalog.json` **chỉ** dùng để chọn icon, không dùng làm chip filter.

```js
TYPE_ICON = {
  'vào cổng':'i-gate', 'tham quan':'i-see', 'cảm giác mạnh':'i-thrill',
  'trải nghiệm':'i-spa', 'di chuyển':'i-ride', 'công viên nước':'i-wave',
  'trò chơi':'i-vr', 'khám phá':'i-adv', 'quà tặng':'i-gift',
  'chọn 1 trong 2':'i-boat', '':'i-pin'
};
```

## 6.3 Deep link format

```
https://suoitien.trip360.vn/?pano=tuyet
```

- Param dùng **key slug** (`tuyet`), không dùng UUID → link ngắn, đọc được, chia sẻ đẹp.
- `overlays.js` sinh link này cho `#st-share`.
- Bản thật: `app.js` map `key → dest.pano` rồi gọi `VRCore.navigateToPano()`.
- Nếu key không tồn tại → xem [`05-flows.md`](05-flows.md) §5.10.

## 6.4 Xử lý tên trùng lặp

`catalog.json` có nhiều key khác nhau nhưng **cùng `name`**:

| name | Số key | Các key |
|---|---|---|
| Cầu Bạch Tượng | 4 | `caubachtuong`, `caubachtuong2`, `caubachtuong3`, `caubachtuong4` |
| Biển Ngọc Nữ | 2 | `bienngocnu`, `bienngocnu2` |
| Âm Cung Đệ Nhất Cung Đình Tửu | 2 | `amcung`, `amcungdenhatcungdinhtuu` |

Đây là **nhiều góc nhìn 360° của cùng 1 địa điểm**, không phải data lỗi.

Hàm `ST.data.buildGroups()` chạy 1 lần lúc init:

```js
// Gộp theo name đã normalize (bỏ dấu, lowercase, trim)
// → group.key = key đầu tiên
// → group.views = [tất cả key cùng name]
// → group.viewCount = views.length
// Ưu tiên key có `type` khác '' làm key chính (để giữ icon/type).
```

Kết quả: **158 entry → ~132 group**. `#st-places` render theo group, badge
"N góc nhìn" khi `viewCount > 1`.

> ⚠️ Số 132 là **ước lượng** — chỉ đếm được chính xác khi chạy `buildGroups()`
> trên toàn bộ 158 entry thật. Prototype chỉ có 40 entry nên hiển thị
> `ST.data.TOTAL_REAL = 158` cho label, không dùng `Object.keys().length`.

## 6.5 Chỗ nào là MOCK — checklist cho dev port

Grep `// MOCK:` trong `js/` sẽ ra hết. Danh sách đầy đủ:

| Mock | File | Thay bằng gì ở bản thật |
|---|---|---|
| Panorama là ảnh/gradient tĩnh | `viewer.js` | 3DVista player qua `VRCore.mountViewer()` |
| `viewer.goTo()` | `viewer.js` | `VRCore.navigateToPano(tour, dest.pano)` |
| Bản đồ SVG stylized (welcome) | `index.html` `#st-welcome-map` | `map/img/map.jpg` + toạ độ từ `map_geo.json` |
| Bản đồ SVG stylized (M2) | `index.html` `.st-rt-map` | Đổi `<svg>` → `<img src="map/img/map.jpg">`, **không phải sửa JS** (pin tính theo %) |
| Toạ độ hotspot `%` | `data.js` HOTSPOTS | Toạ độ pixel từ `map_places.json` |
| Số hiệu + toạ độ pin `%` | `data.js` MAP_META | `code` + toạ độ pixel từ `map_places.json` — 14/20 số hiện là bịa |
| `blurb` mô tả điểm | `data.js` | `map_places_content.json` |
| `hero` ảnh = null | `data.js` | Ảnh thumbnail thật |
| 20/158 destination | `data.js` | `fetch('data/catalog.json')` |
| Quãng đường = Euclid × 1.15 | `route.js` `distance()` | Dijkstra trên `map_graph.json` |
| Chỉ dẫn từng chặng sinh từ hàm băm | `route.js` `buildSteps()` | Danh sách edge của đường đi thật |
| Đường vẽ trên bản đồ | `route.js` `pathD()` | Polyline nối các node của đường đi thật |
| "Vị trí của tôi" | `route.js` `#st-rt-mine` | `navigator.geolocation` + `window.GeoCalib` |
| Nút chia đôi màn hình / la bàn (M2) | `route.js` TOOLS | Handler thật của overlay gốc |
| 20/158 điểm trong M3 | `places.js` | `fetch` 158 điểm + gộp tên trùng (§5.4.1) |
| Nhạc nền | `controls.js` | `<audio>` + file nhạc thật |
| VR mode | `controls.js` | 3DVista stereo mode |
| QR code | `overlays.js` | Thư viện QR hoặc ảnh sinh từ server |
| `ST.track()` chỉ log | `app.js` | `VR360Track.event()` → `/backend/analytics/track.php` |

### ✅ Đã KHÔNG còn mock (nhờ giải đáp 2026-07-30)

| Trước là mock | Giờ là gì |
|---|---|
| ~~Màu suy đoán từ `#0e6b2e`~~ | 10 màu thật từ `style.css` site chính |
| ~~Font đoán `Be Vietnam Pro`~~ | `Arima Madurai` thật + `Be Vietnam Pro` cho body (D-23) |
| ~~`href` navbar đoán theo slug~~ | 84 URL thật từ HTML site chính (§6.6) |
| ~~URL social `#`~~ | 4/5 URL thật (LinkedIn site chính cũng để `#`) |
| ~~Link "Mua vé"~~ | `https://suoitien.vn/chon-ve` |
| ~~Logo placeholder SVG~~ | PNG thật, verify 200 OK |
| ~~Nội dung dropdown mock~~ | 75 mục con thật, 3 cấp |
| ~~10 `type` làm chip filter~~ | 6 nhóm thật từ UI (D-28) |
| ~~Bản đồ chỉ có SVG~~ | Thêm biến thể `?map=real` dùng bản đồ 3D thật của khách |
| ~~Chỉ tiếng Việt~~ | `COPY.vi` + `COPY.en` (Q4) |

---

## 6.6 NAV_MENU — 84 mục THẬT, 3 cấp

Lấy từ HTML `suoitien.vn` (`li.menu-item` + class `sub-menu1`/`sub-menu2`), 2026-07-30.
Prefix `https://suoitien.vn` bỏ cho gọn.

```
# Trang chủ                         /
# Giới thiệu                        /ladingpage/block/index.php
  - Về Suối Tiên                    /ladingpage/block/index.php
  - Bản đồ                          /ban-do
# Trải nghiệm đặc biệt              /trai-nghiem-dac-biet
  - Công trình văn hóa lịch sử      /cong-trinh-van-hoa-lich-su
  - Công trình văn hóa tâm linh     /cong-trinh-van-hoa-tam-linh-1
  - Biển Tiên Đồng - Ngọc Nữ        /bien-tien-dong-ngoc-nu-2
  - Suối Tiên farm                  /suoi-tien-farm
  - Bốn Mùa Lễ Hội                  /bon-mua-le-hoi
# VR360                             #          ← MỚI, chèn ở đây (Q19)
# TRÒ CHƠI                          /tro-choi
  - THAM QUAN - KHÁM PHÁ            /kham-pha
    - Cung vàng điện ngọc           /cung-vang-dien-ngoc
    - Thủy Cung                     /thuy-cung
    - Lâu Đài Pháp Thuật            /lau-dai-phap-thuat
    - Phong Linh Điểu Cảnh - Vương quốc cá sấu  /phong-linh-dieu-canh-vuong-quoc-ca-sau
    - Bí mật rừng phù thủy          /bi-mat-rung-phu-thuy
    - Du thuyền thiên nga           /du-thuyen-thien-nga
    - DU THUYỀN TỨ LINH             /du-thuyen-tu-linh
    - Cối Xay Thần Gió              /coi-xay-than-gio
    - Đường hầm xuyên lòng đất      /duong-ham-xuyen-long-dat
    - Kỳ lân cung                   /ky-lan-cung
    - Đại cung Phụng Hoàng Tiên     /dai-cung-phung-hoang-tien
    - Lâu Đài Tuyết                 /lau-dai-tuyet
    - Ngôi nhà ma                   /ngoi-nha-ma
    - Âm cung đệ nhất cung đình tửu /am-cung-de-nhat-cung-dinh-tuu
  - CẢM GIÁC MẠNH                   /cam-giac-manh
    - Sky Bounder - Người chinh phục bầu trời   /visky-bounder-…   ⚠️ slug lỗi ở site
    - Khám phá vũ trụ huyền bí      /vikham-pha-vu-tru-huyen-bi…  ⚠️ slug lỗi ở site
    - Đĩa xoáy thiên hà             /dia-xoay-thien-ha
    - Đu dây qua hồ                 /du-day-qua-ho
    - Vũ điệu tagada - phi cơ - ghế bay  /vu-dieu-tagada-phi-co-ghe-bay
    - Thuyền Rồng                   /thuyen-rong
    - Thuyền Bay                    /thuyen-bay
    - Vòng xoay vũ trụ              /vong-xoay-vu-tru
    - Đĩa bay hành tinh lạ          /dia-bay-hanh-tinh-la
  - GIẢI TRÍ - TRẺ EM               /giai-tri-tre-em
    - MegaZone                      /vimega-zone-end-…            ⚠️ slug lỗi ở site
    - Mega Central                  /mega-central
    - Xe Tăng – Hành Trình Chiến Xa /-xe-tang-hanh-trinh-chien-xa ⚠️ slug có dấu '-' đầu
    - Massage Cá                    /massage-ca
    - Ngựa phi nước đại             /ngua-phi-nuoc-dai
    - Công nghệ phim 9D             /cong-nghe-phim-9d
    - Xạ thủ thần công              /xa-thu-than-cong
    - Đấu trường cung thủ           /dau-truong-cung-thu
# Dịch vụ                           /dich-vu
  - Ẩm thực                         /am-thuc
  - Trạm dừng chân                  /tram-dung-chan
  - Mua sắm                         /mua-sam
  - Hội Nghị - Tiệc Cưới            /to-chuc-hoi-nghi
# Bảng giá                          /bang-gia
  - Combo trò chơi                  /combo-tro-choi        ← candidate cho CTA "Mua combo" (Q-32)
  - Chính sách Tour đoàn            /chinh-sach-tour-doan
    - Tour đoàn                     /tour-doan-1
  - Bảng Giá Lẻ                     /dich-vu-tro-choi
  - Trải Ngiệm Mới                  /trai-ngiem-moi-       ⚠️ typo "Ngiệm" ở site
# Tin tức & Thư viện                /tin-tuc-thu-vien
  - Tin tức                         /tin-tuc
    - Cẩm nang du lịch              /cam-nang-du-lich
    - Cẩm nang tổ chức sự kiện      /cam-nang-to-chuc-su-kien
    - Cẩm nang team building        /cam-nang-team-building
    - Ưu đãi và sự kiện             /uu-dai-va-su-kien
  - Thư viện                        /thu-vien
# TUYỂN DỤNG & LIÊN HỆ              /tuyen-dung-lien-he
  - Liên hệ hợp tác                 (rỗng)                 ⚠️ href trống ở site
  - Tuyển dụng                      /tuyen-dung
  - Hợp tác thương mại              /hop-tac-thuong-mai
```

### Footer menu (site chính có, prototype không dùng)

`Giới thiệu` `Trải nghiệm` `Bảng giá` `Tin tức` `Nhà hàng` `Dich vụ` (⚠️ typo "Dich")
`Ưu đãi và sự kiện` `Liên hệ` + 8 trang chính sách (`/dieu-khoan-quy-dinh-chung`,
`/quy-dinh-dat-ve`, `/huong-dan-thanh-toan-vnpay-qr`, `/chinh-sach-su-dung-hinh-anh-du-khach`,
`/chinh-sach-quyen-rieng-tu`, `/chinh-sach-xu-ly-khieu-nai`, `/chinh-sach-bao-mat-thong-tin-1`,
`/chinh-sach-kiem-hang`, `/chinh-sach-van-chuyen-va-giao-nhan`).

### ⚠️ Lỗi phát hiện trên site chính (báo cho khách, không sửa trong prototype)

| Vấn đề | Chỗ |
|---|---|
| Slug lỗi (dính chữ `vi…end-vien…end-en`) | `Sky Bounder`, `Khám phá vũ trụ huyền bí`, `MegaZone` |
| Slug bắt đầu bằng `-` | `Xe Tăng – Hành Trình Chiến Xa` → `/-xe-tang-…` |
| Typo | "Trải **Ngiệm** Mới" (thiếu `h`) · footer "**Dich** vụ" (thiếu dấu) |
| `href` trống | "Liên hệ hợp tác" |
| Icon TikTok dùng class `fa-twitter` | `<i class="fa fa-twitter">` với `title="Twitter"` nhưng link TikTok |
| `Bản đồ` mở `target="_blank"` còn `Về Suối Tiên` cũng `_blank` | Không nhất quán trong cùng dropdown |

→ Không thuộc phạm vi prototype, nhưng đáng nói vì ảnh hưởng SEO và trải nghiệm.

---

## 6.7 Dữ liệu M2/M3 cần khi port lên bản thật (D-43)

Hai overlay clone đang chạy bằng dữ liệu tự chế. Bảng dưới là những gì phải nối
để chúng chạy bằng dữ liệu thật:

| Cần gì | Lấy ở đâu | Dùng cho |
|---|---|---|
| 158 điểm + `code` + toạ độ pixel | `map/map_places.json` | Lưới M3, pin M2, `MAP_META` |
| Ảnh bản đồ | `map/img/map.jpg` (~1,2 MB) | Nền `.st-rt-map` |
| Đồ thị lối đi | `map/map_graph.json` | `distance()` + `buildSteps()` + `pathD()` |
| Hiệu chỉnh GPS ↔ pixel | `map/map_geo.json` | Nút "Vị trí của tôi" |
| POI ↔ panorama UUID | `map/map_panos.json` | Bấm thẻ/mốc → `viewer.goTo()` |
| Chuỗi VI/EN | `map/map_locales.json` | Đối chiếu với `BI` trong `i18n.js` |

**Thứ tự làm ít rủi ro nhất:** ảnh bản đồ → `map_places.json` (pin và lưới có dữ
liệu thật ngay, giao diện không đổi) → cuối cùng mới thay phần tính đường đi. Ba
hàm `distance` / `buildSteps` / `pathD` cố tình gom một chỗ trong `route.js` để
bước cuối chỉ đụng đúng 3 hàm đó.
