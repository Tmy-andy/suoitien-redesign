> Cập nhật: 2026-07-30

# 01 — Architecture & Structure

## 1.1 Cây thư mục

```
suoitien-vr360redes/
├── CLAUDE.md                  # Rules — đọc trước khi sửa gì
├── index.html                 # Entry point duy nhất
├── docs/                      # ← bạn đang ở đây
│
├── css/
│   ├── tokens.css             # CSS custom properties: màu, font, spacing, z-index, easing
│   ├── base.css               # reset, html/body, typography, .st-sr-only, focus ring
│   ├── navbar.css             # #st-topbar, #st-navbar, #st-drawer
│   ├── viewer.css             # #st-viewer (mock panorama) + hint kéo xem
│   ├── controls.css           # #st-dock, #st-rail, #st-scene-label, #st-cta-ticket
│   ├── welcome.css            # #st-welcome + bản đồ SVG + hotspot + preview card
│   ├── overlays.css           # #st-directions, #st-places, #st-share, #st-help, #st-toast
│   └── responsive.css         # tất cả @media, mobile last (ghi đè)
│
├── js/
│   ├── data.js                # MOCK: DESTINATIONS, HOTSPOTS, NAV_MENU, COPY (text)
│   ├── store.js               # State tập trung + pub/sub (không framework)
│   ├── viewer.js              # Mock 360 viewer: gradient/ảnh + drag để pan + API goTo()
│   ├── navbar.js              # Render navbar, dropdown, drawer mobile, auto-dim
│   ├── welcome.js             # Modal welcome: render hotspot, preview, chọn điểm
│   ├── controls.js            # Dock button, toggle state (nhạc, auto-rotate, fullscreen)
│   ├── overlays.js            # Directions / Places / Share / Help — 1 engine mở-đóng chung
│   ├── a11y.js               # focus trap, Esc, scroll lock, aria-hidden — dùng cho mọi modal
│   └── app.js                 # Bootstrap: đọc query param → init theo thứ tự → mở welcome
│
└── assets/
    ├── logo.svg               # Placeholder logo (chờ file thật — Q21)
    ├── map/
    │   └── park-map.svg       # Bản đồ 2D stylized (inline vào welcome.js để hotspot dùng chung toạ độ)
    └── icons.svg              # SVG sprite <symbol> — 1 file cho toàn bộ icon
```

## 1.2 Nguyên tắc kiến trúc

| Nguyên tắc | Lý do |
|---|---|
| **Không dependency ngoài** | Khách mở file là chạy, không cần mạng. Không CDN, không npm. |
| **Prefix `st-` cho mọi id/class** | Bản thật sẽ nhúng chung window với 3DVista + React DC component. Không được đụng CSS của họ. |
| **1 file CSS = 1 vùng UI** | Sửa navbar không cần mở file khác. Ghép ngược vào repo thật cũng dễ tách. |
| **State tập trung ở `store.js`** | Không truyền biến lung tung giữa module. Modal nào cũng đọc/ghi 1 chỗ. |
| **`a11y.js` dùng chung cho mọi modal** | Focus trap + Esc + scroll lock viết 1 lần. Xem [`04-modals.md`](04-modals.md) §4.2. |
| **Mọi mock đánh dấu `// MOCK:`** | Dev port sang bản thật chỉ cần grep `MOCK:` là ra hết chỗ cần nối API. |
| **Không `!important`** trừ khi ghi đè 3DVista | Trong prototype không có 3DVista nên không cần. Bản thật thì cần (xem [`07-integration.md`](07-integration.md)). |

## 1.3 Thứ tự load trong `index.html`

Thứ tự **quan trọng** — `tokens.css` phải trước mọi CSS khác, `data.js` phải
trước mọi JS khác, `app.js` phải cuối cùng.

```html
<head>
  <!-- 1. Font: @font-face local, không gọi Google Fonts -->
  <!-- 2. CSS theo đúng thứ tự cascade -->
  tokens.css → base.css → navbar.css → viewer.css → controls.css
            → welcome.css → overlays.css → responsive.css
</head>
<body>
  <!-- 3. SVG sprite inline (ẩn) — phải có trước khi component render icon -->
  <svg id="st-icons" hidden>…</svg>

  <!-- 4. Markup shell: các container rỗng, JS sẽ render vào -->
  #st-viewer · #st-topbar · #st-navbar · #st-scene-label
  #st-dock · #st-welcome · #st-directions · #st-places · #st-share · #st-help · #st-toast

  <!-- 5. JS theo thứ tự phụ thuộc -->
  data.js → store.js → a11y.js → viewer.js → navbar.js
         → controls.js → overlays.js → welcome.js → app.js
</body>
```

Tất cả `<script>` là **classic script** (không `type="module"`) → biến global,
không cần server, mở `file://` chạy được. Mỗi file bọc trong IIFE, chỉ expose 1
namespace: `ST.data`, `ST.store`, `ST.a11y`, `ST.viewer`, `ST.navbar`,
`ST.controls`, `ST.overlays`, `ST.welcome`.

## 1.4 Mock VR360 viewer — `js/viewer.js`

Prototype không có panorama thật. `#st-viewer` mô phỏng bằng:

1. **Nền**: `background-image` là ảnh rộng (hoặc CSS gradient nếu chưa có ảnh),
   `background-size: cover`, đặt `background-position-x` theo yaw.
2. **Drag để pan**: pointerdown/move/up → cộng dồn vào `yaw`, ghi vào
   `--st-yaw` → nền dịch ngang. Có inertia nhẹ (`requestAnimationFrame`, damping 0.92).
3. **Auto-rotate**: `rAF` tăng yaw 0.02°/frame, tự tắt khi user drag.
4. **Chuyển scene**: `goTo(key)` → fade trắng 250ms → đổi nền + label → fade in.
   Đây là chỗ bản thật gọi `VRCore.navigateToPano()`.
5. **API expose**: `ST.viewer.goTo(key)`, `.getCurrent()`, `.setAutoRotate(bool)`,
   `.setDimmed(bool)` (làm mờ khi modal mở).

```js
// MOCK: bản thật thay bằng VRCore.navigateToPano(tour, dest.pano)
ST.viewer.goTo = function (key) { … }
```

## 1.5 Bảng z-index (nguồn duy nhất: `tokens.css`)

Prototype dùng thang **thấp** (0–90). Bản thật phải dịch lên >10000 vì 3DVista
và `floorplan.css` đã chiếm 10000–10009 — xem [`07-integration.md`](07-integration.md) §7.4.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-z-viewer` | `0` | `#st-viewer` |
| `--st-z-hint` | `5` | Hint "kéo để xem 360°" |
| `--st-z-scene-label` | `10` | `#st-scene-label` tên điểm hiện tại |
| `--st-z-dock` | `20` | `#st-dock` thanh nút chính |
| `--st-z-rail` | `20` | `#st-rail` nút phụ bên phải |
| `--st-z-navbar` | `40` | `#st-topbar` + `#st-navbar` |
| `--st-z-dropdown` | `45` | Dropdown của navbar |
| `--st-z-overlay` | `60` | `#st-directions`, `#st-places` (overlay toàn màn) |
| `--st-z-modal` | `70` | `#st-welcome`, `#st-share`, `#st-help` |
| `--st-z-drawer` | `75` | `#st-drawer` menu mobile |
| `--st-z-toast` | `85` | `#st-toast` |
| `--st-z-debug` | `90` | Panel `?debug=1` |

> Quy tắc: **không hardcode z-index ở bất kỳ file CSS nào khác.** Thêm layer mới
> thì thêm token vào `tokens.css` và thêm 1 dòng vào bảng này.

## 1.6 Sơ đồ phụ thuộc module

```mermaid
graph TD
    app[app.js<br/>bootstrap] --> store
    app --> viewer
    app --> navbar
    app --> controls
    app --> overlays
    app --> welcome

    data[data.js<br/>MOCK data + copy] --> store
    data --> welcome
    data --> navbar
    data --> overlays

    store[store.js<br/>state + pub/sub] --> viewer
    store --> navbar
    store --> controls
    store --> overlays
    store --> welcome

    a11y[a11y.js<br/>focus trap / Esc / lock] --> welcome
    a11y --> overlays

    welcome -->|goTo| viewer
    overlays -->|goTo| viewer
    controls -->|setAutoRotate<br/>setDimmed| viewer
    controls -->|open| overlays
```

Quy tắc phụ thuộc: **mũi tên không được tạo vòng.** `viewer.js` không bao giờ
gọi lên `welcome.js`/`overlays.js`; nó chỉ phát event qua `store`.

## 1.7 File nào sửa khi muốn đổi gì

| Muốn đổi | Sửa file |
|---|---|
| Màu / font / spacing / radius / shadow | `css/tokens.css` — **chỉ** file này |
| Tên điểm, danh sách hotspot, toạ độ hotspot | `js/data.js` |
| Chữ trên UI (tiêu đề modal, label nút, toast) | `js/data.js` → object `COPY` |
| Menu navbar, dropdown | `js/data.js` → `NAV_MENU` |
| Thêm nút vào dock | `js/data.js` → `DOCK_BUTTONS` + `js/controls.js` handler |
| Thêm modal mới | `js/overlays.js` (dùng engine chung) + `css/overlays.css` + docs `04-modals.md` |
| Layout mobile | `css/responsive.css` |
| Thứ tự / điều kiện hiện modal welcome | `js/app.js` |
