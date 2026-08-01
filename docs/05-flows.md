> Cập nhật: 2026-08-01 (v3 — viết lại §5.3 + §5.4 theo M2/M3 đã dựng thật · D-43)

# 05 — Flows & Logic

## 5.1 Luồng chính — "3 giây đầu" (YC-1)

Đây là luồng quan trọng nhất, mục tiêu là gây ấn tượng + giải thích tour.

```mermaid
sequenceDiagram
    autonumber
    actor U as Người dùng
    participant B as Browser
    participant App as app.js
    participant V as viewer.js
    participant W as welcome.js
    participant S as store.js

    U->>B: Mở suoitien.trip360.vn
    B->>App: DOMContentLoaded
    App->>App: đọc query params (?welcome, ?pano, ?nav, ?debug)
    App->>V: init() — vẽ panorama mock
    App->>S: set('phase', 'loading')
    V-->>App: event 'viewer:ready' (~600ms)
    App->>S: set('phase', 'ready')
    Note over App: chờ thêm 800ms cho panorama vẽ xong frame đầu
    App->>W: open()
    W->>S: set('modal', 'st-welcome')
    W->>V: setDimmed(true) — blur + dừng auto-rotate
    W->>W: render 8 hotspot, stagger 55ms/cái
    Note over U: 0–3s: thấy panorama mờ + tiêu đề + bản đồ sống lên

    U->>W: hover hotspot "Lâu Đài Tuyết"
    W->>W: tooltip + scale(1.18)
    U->>W: click hotspot
    W->>S: set('selectedKey', 'tuyet')
    W->>W: preview panel: idle → selected (cross-fade)
    U->>W: click "Đi đến điểm này →"
    W->>W: nút → spinner, hotspot scale(1.4) + fade
    W->>V: goTo('tuyet')
    W->>W: close() — panel fade, scrim fade
    V->>V: fade trắng 250ms → đổi nền → fade in
    V->>S: emit 'scene:change' { key:'tuyet' }
    S-->>App: #st-scene-label cập nhật "Lâu Đài Tuyết · 4/158"
    W->>V: setDimmed(false)
    Note over App: chờ 600ms → hiện #st-hint "Kéo để xem 360°"
```

### Nhánh rẽ

| Nhánh | Điều kiện | Kết quả |
|---|---|---|
| Bỏ qua | Click `#st-welcome-skip` hoặc Esc | Đóng modal, viewer ở `defaultPano`, hiện hint |
| Deep link | `?pano=tuyet` | Không mở welcome, vào thẳng điểm đó |
| Tắt welcome | `?welcome=0` | Không mở welcome |
| Chưa chọn mà bấm "Đi đến" | Không thể — nút disabled ở state idle | — |
| `prefers-reduced-motion` | Hệ thống user | Bỏ stagger + spring, chỉ fade nhanh |

## 5.2 State machine — `store.js`

### Shape của state

```js
ST.store.state = {
  phase:       'boot' | 'loading' | 'ready',   // vòng đời app
  modal:       null | 'st-welcome' | 'st-directions' | 'st-places'
                    | 'st-share' | 'st-help' | 'st-drawer',
  popover:     null | 'st-more-popover' | 'st-nav-dd-<i>',
  sceneKey:    'cong',           // key trong DESTINATIONS, điểm đang xem
  selectedKey: null,             // điểm đang chọn trong welcome/places (chưa đi)
  navDimmed:   false,            // navbar đang mờ vì user kéo panorama
  navDimLock:  false,            // khoá không cho dim (khi có modal mở)
  autoRotate:  false,
  soundOn:     false,
  fullscreen:  false,
  lang:        'vi',
  filter:      { type: 'all', q: '' },   // của #st-places
  yaw:         0,                // góc xoay mock viewer
  isDragging:  false
};
```

### API

```js
ST.store.get(key)
ST.store.set(key, value)          // chỉ emit nếu giá trị THỰC SỰ đổi
ST.store.patch({ a:1, b:2 })      // set nhiều key, emit 1 lần
ST.store.on(event, fn)            // trả về off()
ST.store.emit(event, payload)
```

### Event bus

| Event | Payload | Ai phát | Ai nghe |
|---|---|---|---|
| `viewer:ready` | — | viewer.js | app.js |
| `scene:change` | `{ key, dest, index, total }` | viewer.js | scene-label, share, tracking |
| `scene:loading` | `{ key }` | viewer.js | scene-label (spinner) |
| `modal:open` | `{ id }` | overlays.js | navbar (lock dim), viewer (dim) |
| `modal:close` | `{ id }` | overlays.js | navbar (unlock), viewer (undim) |
| `drag:start` | — | viewer.js | navbar (dim), hint (ẩn) |
| `drag:end` | — | viewer.js | navbar (hẹn undim 2.2s) |
| `filter:change` | `{ type, q }` | overlays.js | places grid |
| `toggle:change` | `{ name, value }` | controls.js | viewer, dock button state |

### Sơ đồ chuyển state của `modal`

```mermaid
stateDiagram-v2
    [*] --> boot
    boot --> loading : app.init()
    loading --> ready : viewer:ready

    ready --> welcome : shouldShow() && +800ms
    ready --> viewing : ?welcome=0 hoặc ?pano=

    welcome --> viewing : skip / Esc
    welcome --> navigating : chọn điểm + "Đi đến"
    navigating --> viewing : scene:change

    viewing --> directions : #st-btn-route
    viewing --> places : #st-btn-places
    viewing --> share : popover → Chia sẻ
    viewing --> help : popover → Hướng dẫn
    viewing --> drawer : #st-btn-menu (mobile)

    directions --> viewing : × / Esc
    directions --> navigating : chọn điểm trên bản đồ
    places --> viewing : × / Esc
    places --> navigating : chọn card
    share --> viewing : × / Esc / scrim
    help --> viewing : × / Esc / scrim
    drawer --> viewing : × / Esc / scrim / swipe

    note right of viewing
        State "nghỉ": không modal nào mở,
        user đang xem panorama.
        navbar có thể dim ở state này.
    end note
```

## 5.3 Luồng "Chỉ đường" (M2 · `#st-route`)

> Viết lại 2026-08-01 (D-43). Bản trước là **kế hoạch** cho một overlay chưa dựng
> (`#st-directions`, split-view kéo được, path hardcode từng cặp). Cái đã dựng thật
> đơn giản hơn và bám sát bản gốc — dưới đây là luồng THẬT trong `js/route.js`.

```mermaid
flowchart TD
    A[Click #st-btn-route] --> B["overlays.open('st-route')"]
    B --> C["store phát 'modal:open'"]
    C --> D{"đã có from/to chưa?"}
    D -->|chưa| E["from = scene đang xem<br/>to = điểm đầu tiên khác from"]
    D -->|rồi| F[giữ nguyên lựa chọn cũ]
    E --> G[render]
    F --> G
    G --> H["distance(a,b) — Euclid × 1.15, tròn 5 m"]
    H --> I{"a.key === b.key?"}
    I -->|có| J["ô vàng 'Điểm đi và điểm đến đang trùng nhau'<br/>KHÔNG vẽ đường, KHÔNG sinh chỉ dẫn"]
    I -->|không| K["buildSteps(a,b,m) từ hash(a>b)<br/>pathD(a,b) cùng số điểm gãy"]
    K --> L["vẽ đường + chạy lại animation dash<br/>rải pin, gắn mốc A/B"]
    J --> M{User làm gì?}
    L --> M
    M -->|đổi select| G
    M -->|Đổi chiều| N["hoán vị from/to"] --> G
    M -->|click pin số| O["to = key của pin"] --> G
    M -->|click mốc A/B| P["overlays.close + viewer.goTo"]
    M -->|nút ☰ toolbar| Q["overlays.open('st-places') → M3"]
    M -->|+ / −| R["--st-rt-z ±0.25, kẹp 1…2.5"] --> M
    M -->|Vị trí của tôi| S["MOCK: toast 'đang phát triển'"] --> M
    M -->|nút cam ‹| T["class .st-rt-off → thu bảng trái"] --> M
    M -->|× hoặc Esc| U[overlays.close]
```

**Vì sao mặc định `from` = scene đang xem:** đó là thông tin duy nhất ta thật sự
biết về người dùng. Bản gốc mặc định "1-Cổng Thiên Tiên Môn" vì nó là bản đồ giấy
độc lập, còn ở đây overlay mở ra từ trong tour.

**`from`/`to` được nhớ giữa các lần mở** (biến module, không phải localStorage): mở
lại để xem tiếp tuyến vừa rồi là hành vi tự nhiên, và nó cũng cho thấy kết quả ổn
định — xem §4.4.3 của [`04-modals.md`](04-modals.md).

---

## 5.4 Luồng "Điểm đến" (M3 · `#st-places`)

> Cũng viết lại 2026-08-01. Bản trước mô tả gộp tên trùng + lazy-load 24 thẻ cho
> 158 điểm; prototype chỉ có 20 điểm nên **không cần cả hai**. Logic gộp tên trùng
> vẫn còn giá trị khi port — giữ ở §5.4.1 dưới đây.

```mermaid
flowchart TD
    A[Click #st-btn-places] --> B["overlays.open('st-places')"]
    B --> C["lưới 20 thẻ đã render sẵn từ lúc init<br/>(không dựng lại mỗi lần mở)"]
    C --> D{User làm gì?}
    D -->|gõ ô tìm kiếm| E["deaccent(q) so với<br/>tên VI + tên EN + số hiệu"]
    E --> F["thẻ không khớp → hidden (ẩn HẲN)"]
    F --> G{còn thẻ nào?}
    G -->|không| H["hiện #st-pl-empty"]
    G -->|có| I["cập nhật '#/158 điểm'"]
    D -->|bấm chip lọc| J["thẻ khác nhóm → .st-dim (chỉ LÀM MỜ)<br/>lưới đứng yên"]
    D -->|bấm ×| K["xoá ô tìm kiếm, focus lại input"]
    D -->|bấm 1 thẻ| L["overlays.close + viewer.goTo(key)"]
    D -->|Esc| M[overlays.close]
    H --> D
    I --> D
    J --> D
    K --> D
```

**Tìm kiếm ẩn hẳn, lọc chỉ làm mờ** — hai cơ chế khác nhau có chủ đích, lý do ở
§4.4b.1 của [`04-modals.md`](04-modals.md).

**Không debounce.** Bản kế hoạch cũ đặt 180 ms vì tính cho 158 entry; với 20 thẻ
thì mỗi lần gõ chỉ duyệt 20 vòng lặp trên DOM có sẵn — thêm debounce chỉ làm ô
tìm kiếm có cảm giác trễ. Khi port lên 158 điểm thì cân nhắc lại.

### 5.4.1 Logic gộp tên trùng — CHƯA dùng, để dành khi port

`catalog.json` có `caubachtuong`, `caubachtuong2`, `caubachtuong3`, `caubachtuong4`
→ cả 4 cùng `name = "Cầu Bạch Tượng"`. Khi nạp đủ 158 điểm phải gộp lại, nếu không
danh sách sẽ có 4 thẻ trùng tên không phân biệt được:

```js
{
  key: 'caubachtuong',           // key của entry đầu tiên
  name: 'Cầu Bạch Tượng',
  views: ['caubachtuong', 'caubachtuong2', 'caubachtuong3', 'caubachtuong4'],
  viewCount: 4                   // → badge "4 góc nhìn"
}
```

Click thẻ → mở `views[0]`. Trong panorama, nút "Góc nhìn khác →" chuyển vòng qua
`views` (v2). Xem D-19 ở [`08-decisions.md`](08-decisions.md).


## 5.5 Luồng navbar auto-dim

```mermaid
stateDiagram-v2
    [*] --> Visible

    Visible --> Dimmed : drag:start trên #st-viewer
    Dimmed --> PendingShow : drag:end
    PendingShow --> Visible : hết 2.2s
    PendingShow --> Dimmed : drag:start lại (reset timer)

    Dimmed --> Visible : chuột vào vùng top 100px
    Dimmed --> Visible : Tab focus vào navbar
    Dimmed --> Locked : modal:open
    PendingShow --> Locked : modal:open
    Visible --> Locked : modal:open
    Locked --> Visible : modal:close

    note right of Locked
        navDimLock = true
        Bỏ .st-nav-dim và
        chặn mọi drag:start
    end note

    note right of Dimmed
        opacity .16
        pointer-events none
        translateY(-6px)
    end note
```

**Vì sao có `Locked`:** nếu modal mở mà navbar vẫn dim được thì user kéo bản đồ
trong modal → drag event bubble → navbar dim → nhìn như bug.

## 5.6 Luồng chuyển scene — `viewer.goTo()`

```mermaid
sequenceDiagram
    participant C as Caller<br/>(welcome/places/directions)
    participant V as viewer.js
    participant S as store
    participant L as #st-scene-label

    C->>V: goTo('tuyet')
    V->>V: nếu đang goTo → bỏ qua (guard chống double-click)
    V->>S: emit 'scene:loading' { key:'tuyet' }
    L->>L: fade out 120ms + spinner
    V->>V: overlay trắng opacity 0→.85, 250ms
    V->>V: đổi background-image + reset yaw = 0
    Note over V: MOCK — bản thật:<br/>VRCore.navigateToPano(tour, dest.pano)
    V->>V: overlay trắng .85→0, 250ms
    V->>S: set('sceneKey','tuyet')
    V->>S: emit 'scene:change' { key, dest, index, total }
    L->>L: đổi text + slide up 6px + fade in 240ms
    V->>V: nếu autoRotate → khởi động lại rAF
```

**Guard chống double-click:** biến `_navigating` — nếu đang true thì `goTo()`
return ngay. Bắt buộc, không thì user click nhanh 2 hotspot → 2 fade chồng nhau.

## 5.7 Luồng bootstrap `app.js` — thứ tự đầy đủ

```
1.  Parse query: welcome, pano, nav, debug, full, zones, lang, title, map
2.  store.set('phase', 'loading')
3.  ⭐ Phạm vi (D-39):
      ?full=1 → ST.data.SCOPE = 'full'
      minimal = (SCOPE === 'minimal')
      <html>.classList.toggle('st-scope-min', minimal)   ← scope.css ăn theo class này
4.  ST.i18n.init(lang)
5.  ST.a11y.init()          — bind Esc global, chuẩn bị scroll lock
6.  ST.viewer.init('#st-viewer')
7.  ST.overlays.init()      — bind [data-st-close], engine chung cho MỌI modal
8.  ST.navbar.init()        — render topbar + navbar + drawer từ NAV_MENU
9.  ST.controls.init()      — render cụm C từ DOCK_BUTTONS (hoặc _FULL nếu ?full=1)
10. ST.route.init()         — ⭐ M2: toolbar + bind, lưới select điền lúc MỞ
11. ST.places.init()        — ⭐ M3: chip + lưới 20 thẻ render sẵn luôn
12. ST.welcome.init()       — chỉ render markup, CHƯA mở
13. ST.i18n.apply()
14. Nếu ?nav=off   → <html>.classList.add('st-no-nav')
15. Nếu ?zones=1   → initZones()   ← ghost 4 vùng cấm, mặc định TẮT
16. Nếu ?debug=1   → initDebug()
17. Nếu đã xem welcome trước đó → ST.controls.showReopen(false)
18. Đợi event 'viewer:ready'
19. store.set('phase', 'ready')
20. Quyết định mở welcome:
      ?pano=<key>   → viewer.goTo(key); KHÔNG mở welcome
      ?welcome=0    → KHÔNG mở
      ?welcome=1    → setTimeout(800) → welcome.open()
      shouldShow()  → setTimeout(800) → welcome.open()
      else          → không mở
21. Nếu welcome KHÔNG mở → setTimeout(600) → controls.showHint()
      ⚠️ showHint() tự return ngay khi SCOPE='minimal' — hint ngoài phạm vi (D-39)
```

**Bước 3 phải chạy TRƯỚC mọi `init`.** `controls.init()` đọc `SCOPE` để chọn giữa
`DOCK_BUTTONS` và `DOCK_BUTTONS_FULL`; đặt cờ sau đó thì cụm C render nhầm bản.

**`navbar.init()` chạy ở MỌI phạm vi.** Header không bị tắt — dải trên cùng của
trip360 trống nên navbar không đè lên control có sẵn nào (D-39).

**M2/M3 nằm TRONG phạm vi `minimal`** — chúng là nội dung của chính 2 nút được giao
redesign, không phải UI thêm vào màn hình VR (D-43). `route.init()` / `places.init()`
vì thế chạy vô điều kiện, giống `navbar.init()`.

**`route.js` chỉ điền select lúc MỞ, không lúc init:** điểm bắt đầu mặc định là scene
đang xem, mà lúc bootstrap thì `viewer` chưa chắc sẵn sàng.

**Vì sao init trước rồi mới mở:** nếu welcome mở trước khi `overlays.init()` chạy
thì `[data-st-close]` chưa bind → nút × không hoạt động. Đây là lỗi rất dễ mắc.

## 5.8 Logic responsive — quyết định ở đâu

| Quyết định | Nơi xử lý | Cơ chế |
|---|---|---|
| Ẩn topbar | `responsive.css` | `@media (max-width: 599px) { display: none }` |
| Navbar → hamburger | `responsive.css` + `navbar.js` | CSS ẩn list, JS chỉ render drawer khi cần |
| Dock cuộn ngang | `responsive.css` | `overflow-x: auto` |
| Welcome fullscreen | `responsive.css` | `inset: 0; border-radius: 0` |
| Preview slide-up mobile | `welcome.css` + `welcome.js` | class `.st-preview-sheet`, JS thêm khi `matchMedia('(max-width:599px)')` |
| Grid places 2 cột | `responsive.css` | `minmax(150px, 1fr)` |
| Bản đồ portrait | `welcome.js` | Đổi `viewBox` sang `0 0 640 800` + dùng bộ toạ độ `xyMobile` |

Nguyên tắc: **CSS lo layout, JS chỉ lo cái CSS không làm được** (đổi viewBox,
đổi bộ toạ độ hotspot). JS dùng `matchMedia` + listener `change`, không dùng
`resize` + đo `innerWidth`.

## 5.9 Luồng tracking (mock, giữ chỗ)

Site thật có `js/vr360-tracking.js` → `POST /backend/analytics/track.php`.
Prototype **không gửi request** nhưng vẫn gọi qua 1 hàm giữ chỗ để bản thật chỉ
cần nối vào:

```js
// MOCK: chỉ console.log. Bản thật: VR360Track.event(name, payload)
ST.track = function (name, payload) {
  if (ST.store.get('debug')) console.log('[track]', name, payload);
};
```

Event nên gửi (đề xuất cho khách — có giá trị kinh doanh):

| Event | Payload | Trả lời câu hỏi gì |
|---|---|---|
| `welcome_shown` | `{ ts }` | Bao nhiêu % user thấy modal |
| `welcome_hotspot_hover` | `{ key }` | Điểm nào hút mắt nhất |
| `welcome_hotspot_click` | `{ key }` | Điểm nào được chọn |
| `welcome_go` | `{ key, dwellMs }` | Tỉ lệ convert của modal, và mất bao lâu để chọn |
| `welcome_skip` | `{ dwellMs }` | Tỉ lệ bỏ qua |
| `scene_view` | `{ key, fromKey }` | Đường đi phổ biến trong tour |
| `places_search` | `{ q, resultCount }` | User tìm gì không có |
| `dock_click` | `{ id }` | Nút nào thực sự được dùng |
| `ticket_cta_click` | `{ fromScene }` | Điểm nào dẫn tới ý định mua vé |

→ `welcome_skip` vs `welcome_go` chính là **thước đo modal welcome có hiệu quả
hay không**. Nên bàn với khách để bật tracking này ở bản thật.

## 5.10 Xử lý lỗi

| Tình huống | Xử lý |
|---|---|
| `?pano=<key>` không tồn tại | Toast "Không tìm thấy điểm «xxx»" → về `defaultPano`, vẫn mở welcome |
| Ảnh nền viewer lỗi 404 | Fallback CSS gradient theo `icon` của điểm, không để trắng trơn |
| `backdrop-filter` không hỗ trợ | `@supports not` → tăng alpha nền lên `.88` |
| `navigator.clipboard` không có | Fallback `document.execCommand('copy')` → nếu vẫn fail thì select text + toast "Nhấn Ctrl+C" |
| Fullscreen API bị chặn | Toast "Trình duyệt không cho phép toàn màn hình" |
| `localStorage` bị chặn (private mode) | try/catch, fallback biến in-memory |
| `prefers-reduced-motion` | Tắt stagger, spring, pulse, dash animation |
| JS lỗi khi bootstrap | try/catch quanh mỗi `init()` → 1 module lỗi không làm chết cả app; log ra console |
