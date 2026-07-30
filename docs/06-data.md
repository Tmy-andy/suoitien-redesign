> Cập nhật: 2026-07-30

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

### `ST.data.NAV_MENU` — array

```js
NAV_MENU = [
  { label:'Trang chủ',    href:'https://suoitien.vn/' },
  { label:'Giới thiệu',   href:'https://suoitien.vn/gioi-thieu' },
  { label:'Trải nghiệm đặc biệt', href:'#', children:[
      { label:'Lâu Đài Tuyết',  href:'#' },
      { label:'Thủy Cung',      href:'#' },
      { label:'Lâu Đài Phép Thuật', href:'#' },
      { label:'Biển Tiên Đồng – Ngọc Nữ', href:'#' }
  ]},
  { label:'VR360', href:'#', id:'st-nav-vr360', badge:'360°', current:true },
  { label:'TRÒ CHƠI', href:'#', children:[ /* 4 mock item */ ] },
  { label:'Dịch vụ',  href:'#', children:[ /* 4 mock item */ ] },
  { label:'Bảng giá', href:'https://suoitien.vn/bang-gia' },
  { label:'Tin tức & Thư viện', href:'#', children:[ /* 3 mock item */ ] },
  { label:'TUYỂN DỤNG & LIÊN HỆ', href:'https://suoitien.vn/lien-he' }
];
```

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `label` | string | Chữ hiển thị (giữ đúng CHỮ HOA như site thật) |
| `href` | string | Link. `'#'` = mock, click → toast |
| `id` | string? | Chỉ tab VR360 cần id để style riêng |
| `badge` | string? | Badge nhỏ bên cạnh label |
| `current` | boolean? | `true` → `aria-current="page"` + nền brand |
| `children` | array? | Có → render dropdown |

> `// MOCK:` các `href` cụ thể (`/gioi-thieu`, `/bang-gia`) là **đoán theo slug
> thường gặp**, chưa verify. Nội dung `children` là mock hoàn toàn (Q18).

### `ST.data.DOCK_BUTTONS` — array

```js
DOCK_BUTTONS = [
  { id:'st-btn-route',      icon:'i-route',    label:'Chỉ đường', variant:'primary',   action:'open:st-directions' },
  { id:'st-btn-places',     icon:'i-list',     label:'Điểm đến',  variant:'secondary', action:'open:st-places'    },
  { divider:true },
  { id:'st-btn-fullscreen', icon:'i-expand',   label:'Toàn màn hình', variant:'ghost', action:'toggle:fullscreen', iconOff:'i-collapse' },
  { id:'st-btn-sound',      icon:'i-sound-off',label:'Nhạc nền',      variant:'ghost', action:'toggle:sound', iconOn:'i-sound-on', mock:true },
  { id:'st-btn-rotate',     icon:'i-rotate',   label:'Tự động quay',  variant:'ghost', action:'toggle:autoRotate' },
  { id:'st-btn-more',       icon:'i-more',     label:'Thêm',          variant:'ghost', action:'popover:st-more-popover' }
];
```

| Field | Ý nghĩa |
|---|---|
| `variant` | `primary` \| `secondary` \| `ghost` — xem [`03-components.md`](03-components.md) §3.3 |
| `label` | Với `ghost` thì chỉ dùng cho `aria-label` + tooltip, không render chữ |
| `action` | `open:<modalId>` \| `toggle:<stateKey>` \| `popover:<id>` \| `link:<url>` |
| `iconOn` / `iconOff` | Icon khi toggle bật/tắt |
| `mock` | `true` → click ra toast "đang phát triển" thay vì làm gì thật |
| `divider` | Chỉ vạch phân cách, không phải nút |

### `ST.data.COPY` — toàn bộ chữ trên UI

Gom 1 chỗ để (a) khách sửa chữ không cần đọc code, (b) sau này thêm EN chỉ cần
thêm `COPY_EN`.

```js
COPY = {
  welcome:    { eyebrow, title, subtitle, legend, skip, goBtn, hintIdle },
  directions: { title, searchPh, myLocation, split, start, summaryFmt },
  places:     { title, searchPh, countFmt, sectionFeatured, sectionAll, empty, clearSearch },
  share:      { title, copyBtn, copied, qrNote },
  help:       { title, steps: [ {icon,title,text} × 4 ], dontShow },
  dock:       { route, places, fullscreen, sound, rotate, more, vr, share, helpBtn, lang },
  hint:       'Kéo để xem toàn cảnh 360°',
  toast:      { wip:'Chức năng đang phát triển', copied:'Đã copy link', … },
  sceneFmt:   '{name} · {index}/{total}'
};
```

### `ST.data.CONTACT` / `SOCIAL`

```js
CONTACT = {
  hotline: ['1900 636 787', '028.38960260', '0914347787'],   // THẬT
  email:   'phongkinhdoanh@suoitien.com',                    // THẬT
  address: '120 Xa Lộ Hà Nội, P. Tăng Nhơn Phú, TP.HCM'      // THẬT
};
SOCIAL = [
  { name:'Facebook',  icon:'i-fb', href:'#' },   // MOCK: chưa có URL cụ thể
  { name:'TikTok',    icon:'i-tt', href:'#' },
  { name:'Instagram', icon:'i-ig', href:'#' },
  { name:'YouTube',   icon:'i-yt', href:'#' }
];
```

### `ST.data.TYPE_META` — màu/gradient/icon fallback theo type

```js
TYPE_META = {
  'vào cổng':       { icon:'i-gate',   grad:['#0e6b2e','#158a4a'] },
  'tham quan':      { icon:'i-see',    grad:['#158a4a','#33a56d'] },
  'cảm giác mạnh':  { icon:'i-thrill', grad:['#d4860c','#f5a623'] },
  'trải nghiệm':    { icon:'i-spa',    grad:['#0f766e','#14b8a6'] },
  'di chuyển':      { icon:'i-ride',   grad:['#475569','#64748b'] },
  'công viên nước': { icon:'i-wave',   grad:['#0369a1','#0ea5e9'] },
  'trò chơi':       { icon:'i-vr',     grad:['#7c3aed','#a78bfa'] },
  'khám phá':       { icon:'i-adv',    grad:['#57534e','#a8a29e'] },
  'quà tặng':       { icon:'i-gift',   grad:['#be123c','#f43f5e'] },
  '':               { icon:'i-pin',    grad:['#334155','#64748b'] }
};
```

Dùng cho: thumbnail gradient của `.st-place-card` (Q27 chưa có ảnh), chip màu,
icon fallback khi `dest.icon === ''`.

> ⚠️ Các gradient này **ngoài palette brand** (tím, đỏ, xanh dương). Cố ý — đây
> là màu *phân loại dữ liệu*, không phải màu UI, và chúng chỉ xuất hiện dưới dạng
> thumbnail nhỏ. Nếu khách thấy loạn thì đổi hết về thang brand + accent.

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
| Bản đồ SVG stylized | `assets/map/park-map.svg` | `map/img/map.jpg` + toạ độ từ `map_geo.json` |
| Toạ độ hotspot `%` | `data.js` HOTSPOTS | Toạ độ pixel từ `map_places.json` |
| `blurb` mô tả điểm | `data.js` | `map_places_content.json` |
| `hero` ảnh = null | `data.js` | Ảnh thumbnail thật |
| 40/158 destination | `data.js` | `fetch('data/catalog.json')` |
| Route path hardcode | `overlays.js` | Pathfinding trên `map_graph.json` |
| Khoảng cách = `getTotalLength()` × SCALE | `overlays.js` | Độ dài edge thật từ `map_graph.json` |
| "Vị trí của tôi" | `overlays.js` | `navigator.geolocation` + `window.GeoCalib` |
| Nhạc nền | `controls.js` | `<audio>` + file nhạc thật |
| VR mode | `controls.js` | 3DVista stereo mode |
| QR code | `overlays.js` | Thư viện QR hoặc ảnh sinh từ server |
| Đổi ngôn ngữ | `navbar.js` | `map_locales.json` + `vr-360/locale/*.txt` |
| `ST.track()` chỉ log | `app.js` | `VR360Track.event()` → `/backend/analytics/track.php` |
| Link "Mua vé" | `data.js` | URL đặt vé online thật (Q17) |
| Logo placeholder | `assets/logo.svg` | File logo thật (Q21) |
| `href` các mục navbar | `data.js` NAV_MENU | URL thật từ `suoitien.vn` (Q18) |
| URL social | `data.js` SOCIAL | URL thật (Q18) |
