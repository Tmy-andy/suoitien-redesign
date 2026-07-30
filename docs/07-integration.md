> Cập nhật: 2026-07-30

# 07 — Integration: ghép prototype vào bản 3DVista thật

File này dành cho dev sẽ port prototype sang `suoitien.trip360.vn` thật.
Mọi thông tin dưới đây đọc trực tiếp từ source site, verify **2026-07-30**.

## 7.1 Hiện trạng repo thật — cái gì đang có

Suy ra từ `index.htm` + các file fetch được:

```
<web root>/
├── index.htm                     ← file phải sửa (thêm markup + link CSS/JS mới)
├── favicon.ico, socialThumbnail.jpg
│
├── vr-360/                       ← 🔴 EXPORT 3DVISTA — READ-ONLY, KHÔNG SỬA
│   ├── lib/tdvplayer.js
│   ├── script.js                 ← chứa định nghĩa toàn bộ scene/panorama
│   ├── fonts.css                 ← 'Be Vietnam Pro'
│   ├── locale/vi-VN.txt, en.txt
│   ├── media/panorama_XXXX_0/{f,b,l,r,u,d}/{level}/{tile}.jpg
│   └── misc/icon16|32|180|192.png
│
├── packages/vr-core/index.js     ← SEAM chuẩn, publish window.VRCore
│
├── js/
│   ├── context-menu.js           ← ES module, ContextMenuController (Việt hoá menu chuột phải)
│   ├── floorplan.js              ← bộ nạp + điều khiển overlay bản đồ (10.7 KB)
│   ├── floorplan.dc.html         ← template + class component React/DC (173 KB)
│   ├── floorplan.css             ← CSS overlay + 2 nút FAB (8.9 KB)
│   ├── geocalib.js               ← window.GeoCalib, GPS↔pixel affine + TPS
│   └── vr360-tracking.js         ← window.VR360Track
│
├── map/
│   ├── lib/{react,react-dom}.production.min.js, dc-runtime.js
│   ├── fonts.css
│   ├── img/map.jpg               (1.19 MB)
│   └── map_{places,places_content,panos,graph,geo,locales}.json
│
├── data/catalog.json             ← 158 destinations
└── backend/analytics/track.php
```

## 7.2 3 cái bẫy phải biết trước khi sửa `index.htm`

### Bẫy 1 — `<base href="vr-360/">`

```html
<head>
  <base href="vr-360/">
```

**Mọi** URL tương đối trong `index.htm` bị resolve từ `vr-360/`, không phải từ
web root. Code hiện tại đã xử lý bằng cách prefix `../`:

```html
<script src="../map/lib/react.production.min.js"></script>
<link rel="stylesheet" href="../js/floorplan.css">
<script src="../js/floorplan.js"></script>
```

→ **Mọi asset mới của prototype cũng phải prefix `../`**, hoặc dùng path
tuyệt-đối-gốc-web (`/css/st-tokens.css`). Comment trong code thật đã cảnh báo:

> `ingestUrl phải tuyệt-đối-gốc-web vì <base href="vr-360/"> sẽ viết lại URL tương đối.`

An toàn nhất cho code mới: **dùng path tuyệt đối `/`**.

### Bẫy 2 — 3DVista ghi đè inline style của `#viewer`

`floorplan.css` đã comment rõ:

> `Dùng !important vì 3DVista ghi đè inline style của #viewer khi resize`

```css
#viewer.fp-vrsplit {
  top: 0 !important;
  bottom: auto !important;
  height: var(--fp-split, 50svh) !important;
  z-index: 10005 !important;
}
```

→ Nếu prototype cần đổi layout `#viewer` (VD chừa chỗ cho navbar) thì **phải
dùng class + `!important`**, không được set inline style — 3DVista sẽ xoá.

### Bẫy 3 — `script.js` load bất đồng bộ, tour chưa sẵn sàng ngay

`vr-core/index.js` có logic chờ khá cầu kỳ: load `tdvplayer.js` → rồi `script.js`
→ rồi poll cho tới khi playlist có item class `PanoramaPlayListItem` hoặc
`Panorama`, timeout 20s.

→ **Không được** gọi `navigateToPano()` trước khi `ensureTourLoaded()` resolve.
Modal welcome phải chờ promise này, không phải chờ `DOMContentLoaded`.

## 7.3 API `window.VRCore` — seam chuẩn

Từ `packages/vr-core/index.js` (8 KB, ES module, cũng publish global):

```js
// Comment trong file gốc:
//   vr-core — CANONICAL SEAM to the read-only 3DVista export.
//   • getCurrentPanoId() — read the current scene's UUID.
//   NEVER write to vr-360/ (read-only export).
```

| Hàm | Signature | Ghi chú |
|---|---|---|
| `ensureTourLoaded` | `({ base='vr-360/', version, timeout=20000 }) => Promise<tour>` | Idempotent — gọi nhiều lần trả cùng 1 promise |
| `mountViewer` | `(targetEl) => void` | Gắn player 3DVista vào element |
| `resolvePanoIndex` | `(tour, panoUUID) => number` | UUID → index trong playlist |
| `navigateToPano` | `(tour, panoUUID) => void` | **Đây là hàm prototype cần** |
| `getCurrentPanoInfo` | `(tour) => { id, label }` | Đọc scene hiện tại |
| `getCurrentPanoId` | `(tour) => string` | Chỉ UUID |
| `auditPanoBindings` | `(tour, bindings) => …` | Kiểm tra binding key→UUID có hợp lệ |

`auditPanoBindings` rất hữu ích: chạy 1 lần lúc dev để verify 158 UUID trong
`catalog.json` đều tồn tại trong tour.

### Cách port `ST.viewer` sang bản thật

```js
// prototype — js/viewer.js
ST.viewer.goTo = function (key) {
  // MOCK: đổi background-image
};

// bản thật — thay bằng:
let _tour = null;
ST.viewer.init = async function () {
  _tour = await VRCore.ensureTourLoaded({ base: 'vr-360/' });
  VRCore.mountViewer(document.getElementById('viewer'));
  ST.store.emit('viewer:ready');
};
ST.viewer.goTo = function (key) {
  const dest = ST.data.DESTINATIONS[key];
  if (!dest || !_tour) return;
  ST.store.emit('scene:loading', { key });
  VRCore.navigateToPano(_tour, dest.pano);   // ← UUID đã có sẵn trong data.js
  ST.store.set('sceneKey', key);
  ST.store.emit('scene:change', { key, dest });
};
ST.viewer.getCurrent = function () {
  return VRCore.getCurrentPanoInfo(_tour);
};
```

> `data.js` giữ nguyên UUID thật từ `catalog.json` → port là **đổi 1 hàm**, không
> phải map lại data. Đây là lý do prototype không dùng UUID giả.

## 7.4 Z-index — phải dịch thang lên

Prototype dùng 0–90. Bản thật đã chiếm:

| z-index | Ai chiếm | Nguồn |
|---|---|---|
| `1` | `#viewer` | `index.htm` inline style |
| `10000` | `#fp-fabs` (2 nút) | `floorplan.css` |
| `10001` | `#fp-overlay` | `floorplan.css` |
| `10002` | `#fp-close` | `floorplan.css` |
| `10005` | `#viewer.fp-vrsplit` | `floorplan.css` |
| `10006` | `#fp-split-divider` | `floorplan.css` |
| `10008` | `#viewer.fp-vrsplit.fp-vrfull` | `floorplan.css` |
| `10009` | `#fp-vrfull-exit` | `floorplan.css` |
| `10010+` | "chrome trang combo (buy bar/journey bar)" | comment trong `floorplan.css` |

→ **Chỉ cần đổi giá trị trong `tokens.css`**, không sửa file CSS nào khác
(vì [`01-architecture.md`](01-architecture.md) §1.5 cấm hardcode z-index):

```css
:root {
  --st-z-viewer:      1;
  --st-z-hint:        10020;
  --st-z-scene-label: 10021;
  --st-z-dock:        10030;
  --st-z-rail:        10030;
  --st-z-navbar:      10040;
  --st-z-dropdown:    10045;
  --st-z-overlay:     10060;
  --st-z-modal:       10070;
  --st-z-drawer:      10075;
  --st-z-toast:       10085;
  --st-z-debug:       10090;
}
```

Tất cả > 10010 → prototype UI luôn nằm trên mọi thứ của `floorplan.css`.

> ⚠️ Nhưng khi `#viewer.fp-vrsplit.fp-vrfull` bật (z 10008) thì nó vẫn **dưới**
> dock của ta (10030) → dock sẽ đè lên VR fullscreen. Cần: khi split-view bật,
> thêm class `.st-split-mode` lên `<html>` để ẩn dock/scene-label.

## 7.5 Quyết định kiến trúc: thay hay sống chung với `floorplan`?

Đây là quyết định lớn, cần chốt với khách/dev. 3 phương án:

### PA-A — Thay hoàn toàn `floorplan` (không khuyến nghị)

| | |
|---|---|
| Làm gì | Xoá `#fp-fabs`, `#fp-overlay`, `floorplan.js/css/dc.html` khỏi `index.htm`. Prototype đảm nhiệm cả bản đồ + routing. |
| Ưu | UI thống nhất tuyệt đối, 1 hệ design |
| Nhược | **Mất hết**: pathfinding trên `map_graph.json`, GPS `GeoCalib`, split-view kéo được, 173 KB component React đã hoàn thiện. Phải viết lại từ đầu — công việc rất lớn. |

### PA-B — Chỉ thay lớp vỏ, giữ ruột (✅ khuyến nghị)

| | |
|---|---|
| Làm gì | Giữ nguyên `floorplan.js/dc.html` + toàn bộ logic. Chỉ: <br>① Ẩn `#fp-fabs`, thay bằng `#st-dock` <br>② `#st-btn-route` gọi đúng cái mà `#fp-launch` đang gọi <br>③ Re-skin `#fp-overlay` bằng CSS override dùng token của ta <br>④ Thêm navbar + welcome là lớp mới, độc lập |
| Ưu | Giữ 100% chức năng thật. Rủi ro thấp. Đạt đủ YC-1/2/3. |
| Nhược | Vẫn còn 1 file CSS "cũ" cần override cẩn thận |
| Việc cần làm | Đọc `floorplan.js` xem `#fp-launch` bind handler gì → gọi lại handler đó từ `#st-btn-route` |

### PA-C — Giữ nguyên `floorplan`, chỉ thêm welcome + navbar

| | |
|---|---|
| Làm gì | Không chạm gì tới 2 nút hiện tại. Chỉ thêm modal welcome + navbar. |
| Ưu | Rủi ro gần bằng 0, deploy được trong 1 ngày |
| Nhược | **Không đáp ứng YC-2** (khách yêu cầu re-design 2 nút) |
| Khi nào dùng | Làm 2 phase: phase 1 = PA-C (ra nhanh), phase 2 = PA-B |

→ **Đề xuất: PA-B**, hoặc PA-C rồi PA-B nếu cần ra sớm. Ghi vào
[`08-decisions.md`](08-decisions.md) D-11.

## 7.6 Checklist port từng phần

### Navbar (YC-3)

- [ ] Thêm markup `#st-topbar` + `#st-navbar` + `#st-drawer` vào `index.htm`, **trước** `#viewer`
- [ ] Link CSS bằng path tuyệt đối `/css/st-*.css` (tránh bẫy 1)
- [ ] `#viewer` KHÔNG cần chừa chỗ — navbar là glass overlay (D-06), `#viewer` vẫn full viewport
- [ ] Auto-dim: bind `pointerdown` trên `#viewer`. ⚠️ 3DVista có thể `stopPropagation` →
      nếu vậy phải bind ở `capture` phase: `addEventListener('pointerdown', fn, true)`
- [ ] Verify navbar không che nút của 3DVista ở góc trên-phải
- [ ] Verify `#fp-close` (top 15px, right 16px, z 10002) không đè navbar — cần dời hoặc tăng z navbar

### Modal welcome (YC-1)

- [ ] Chờ `VRCore.ensureTourLoaded()` resolve, KHÔNG chờ `DOMContentLoaded` (bẫy 3)
- [ ] Đổi bản đồ SVG → `map/img/map.jpg` + toạ độ pixel từ `map_places.json`
- [ ] Đổi 8 hotspot toạ độ `%` → toạ độ thật
- [ ] Lấy `blurb` từ `map_places_content.json`
- [ ] Bật `localStorage` 24h (Q12) thay vì luôn hiện
- [ ] Nối `ST.track()` → `VR360Track.event()` cho các event ở [`05-flows.md`](05-flows.md) §5.9
- [ ] ⚠️ Test: modal có scrim blur — trên mobile cũ `backdrop-filter` trên toàn màn hình
      rất tốn GPU khi 3DVista đang render. Cân nhắc pause render 3DVista khi modal mở.

### Dock thay 2 nút FAB (YC-2)

- [ ] Đọc `js/floorplan.js` tìm chỗ bind `#fp-launch` và `#fp-list-launch`
- [ ] Expose 2 handler đó thành `window.fpOpenMap()` / `window.fpOpenList()`
      (hoặc dùng lại API đã có — `floorplan.css` nhắc tới `window.fpVrFull`, khả năng
      đã có sẵn API global tương tự)
- [ ] `#fp-fabs { display: none !important }` — **ẩn**, không xoá khỏi DOM
      (`floorplan.js` có thể còn tham chiếu tới `#fp-launch`)
- [ ] `#st-btn-route.onclick = window.fpOpenMap`
- [ ] `#st-btn-places.onclick = window.fpOpenList`
- [ ] Re-skin `#fp-overlay` bằng file CSS override mới, load **sau** `floorplan.css`
- [ ] Thêm class `.st-split-mode` lên `<html>` khi `#viewer.fp-vrsplit` bật → ẩn dock (§7.4)
- [ ] Dùng `MutationObserver` trên `#viewer` để phát hiện class `fp-vrsplit` thay đổi
      (giống cách `context-menu.js` dùng MutationObserver)

## 7.7 Thứ tự load ở `index.htm` bản thật

Chèn của ta vào đâu:

```html
<head>
  <base href="vr-360/">
  …
  <link rel="stylesheet" href="fonts.css">              <!-- Be Vietnam Pro -->
  <link rel="stylesheet" href="/js/floorplan.css">      <!-- CŨ -->
  <link rel="stylesheet" href="/css/st-tokens.css">     <!-- MỚI: sau floorplan để override -->
  <link rel="stylesheet" href="/css/st-base.css">
  <link rel="stylesheet" href="/css/st-navbar.css">
  <link rel="stylesheet" href="/css/st-controls.css">
  <link rel="stylesheet" href="/css/st-welcome.css">
  <link rel="stylesheet" href="/css/st-overlays.css">
  <link rel="stylesheet" href="/css/st-fp-override.css"><!-- MỚI: re-skin #fp-overlay -->
  <link rel="stylesheet" href="/css/st-responsive.css">
</head>
<body>
  <svg id="st-icons" hidden>…</svg>          <!-- MỚI, trước mọi thứ dùng <use> -->
  <div id="st-topbar">…</div>                <!-- MỚI -->
  <nav id="st-navbar">…</nav>                <!-- MỚI -->
  <div id="viewer" class="fill-viewport"></div>   <!-- CŨ, không đổi -->
  <div id="fp-fabs" hidden>…</div>           <!-- CŨ, ẩn -->
  <div id="fp-overlay">…</div>               <!-- CŨ, giữ, re-skin -->
  <div id="st-dock">…</div>                  <!-- MỚI -->
  <div id="st-scene-label">…</div>           <!-- MỚI -->
  <div id="st-welcome">…</div>               <!-- MỚI -->
  <div id="st-share">…</div>                 <!-- MỚI -->
  <div id="st-help">…</div>                  <!-- MỚI -->
  <div id="st-drawer">…</div>                <!-- MỚI -->
  <div id="st-toast"></div>                  <!-- MỚI -->

  <script src="../map/lib/react…"></script>      <!-- CŨ -->
  <script src="../js/geocalib.js"></script>      <!-- CŨ -->
  <script type="module" src="../packages/vr-core/index.js"></script>  <!-- CŨ -->
  <script src="../js/vr360-tracking.js"></script><!-- CŨ -->
  <script src="../js/floorplan.js"></script>     <!-- CŨ -->

  <script src="/js/st-data.js"></script>         <!-- MỚI, từ đây xuống -->
  <script src="/js/st-store.js"></script>
  <script src="/js/st-a11y.js"></script>
  <script src="/js/st-viewer.js"></script>       <!-- bản thật: wrap VRCore -->
  <script src="/js/st-navbar.js"></script>
  <script src="/js/st-controls.js"></script>
  <script src="/js/st-overlays.js"></script>
  <script src="/js/st-welcome.js"></script>
  <script src="/js/st-app.js"></script>          <!-- CUỐI CÙNG -->
</body>
```

⚠️ `st-app.js` phải sau `floorplan.js` vì nó cần `window.fpOpenMap` tồn tại.
Nếu `floorplan.js` bind async thì `st-app.js` phải poll/chờ.

## 7.8 Rủi ro & cách giảm

| # | Rủi ro | Mức | Giảm thế nào |
|---|---|---|---|
| R1 | 3DVista `stopPropagation` pointer event → auto-dim navbar không chạy | Cao | Bind ở capture phase, hoặc dùng `MutationObserver`/rAF poll trên transform của viewer |
| R2 | `backdrop-filter` toàn màn hình + 3DVista render → tụt FPS trên mobile tầm trung | Cao | Pause 3DVista khi modal mở; hoặc dùng ảnh screenshot làm nền thay vì blur live |
| R3 | `floorplan.dc.html` (React) có CSS reset toàn cục làm bẩn UI mới | Trung | CSS của ta scope hết vào `#st-*`, không dùng selector trần; test kỹ |
| R4 | `#fp-close` (z 10002, top-right) đè navbar | Trung | Tăng z navbar > 10002 (đã làm ở §7.4) + dời `#fp-close` xuống dưới navbar |
| R5 | Đổi `index.htm` bị ghi đè khi re-export tour từ 3DVista | Cao | ⚠️ **Quan trọng**: `index.htm` ở web root chứ không trong `vr-360/` nên khả năng an toàn. Nhưng phải verify quy trình publish của khách. |
| R6 | Font `Be Vietnam Pro` load từ `vr-360/fonts.css` — path bị `<base>` chi phối | Thấp | Đã hoạt động trên site hiện tại, không đổi |
| R7 | UUID trong `catalog.json` lệch với tour sau khi re-export | Trung | Chạy `VRCore.auditPanoBindings()` trong CI hoặc 1 trang `/audit.html` |
| R8 | Thêm ~8 file CSS + 9 file JS → tăng số request | Thấp | Minify + gộp khi build production; prototype không cần |

## 7.9 Kiểm thử trước khi lên production

- [ ] Chrome, Safari (iOS), Firefox, Samsung Internet
- [ ] iPhone có notch — check `env(safe-area-inset-*)` ở dock, topbar, scene-label
- [ ] Android tầm trung — đo FPS khi modal welcome mở (R2)
- [ ] Landscape mobile height 400px — dock có che hết màn hình không
- [ ] Chỉ dùng bàn phím: Tab qua được navbar → dock → mở modal → Esc đóng → focus quay về nút
- [ ] Screen reader (NVDA/VoiceOver): modal welcome đọc được tiêu đề + tên hotspot
- [ ] `prefers-reduced-motion: reduce` — không còn animation nào
- [ ] Chậm mạng (throttle 3G) — welcome không hiện trước khi panorama load
- [ ] Split-view của `floorplan` bật → dock/scene-label ẩn đúng (§7.4)
- [ ] Deep link `?pano=tuyet` mở đúng điểm, không mở welcome
- [ ] Chuột phải vẫn ra menu Việt hoá của `context-menu.js`
- [ ] Analytics vẫn gửi được sau khi thêm UI mới
