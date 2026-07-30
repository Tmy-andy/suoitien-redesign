> Cập nhật: 2026-07-30

# 04 — Modals & Overlays

Chi tiết **tất cả** modal/overlay: id, trigger, nội dung, z-index, ARIA,
animation, cách đóng. File này phải khớp 1-1 với code — thêm modal mới là phải
thêm 1 section ở đây.

## 4.1 Bảng tổng hợp

| # | ID | Tên | z-index | Trigger | Đóng bằng | Scrim | TT |
|---|---|---|---|---|---|---|---|
| M1 | `#st-welcome` | Modal chào mừng + bản đồ hotspot | 70 | Auto khi load (YC-1) | Skip · Esc · chọn điểm | ✅ + blur | 🟢 |
| M2 | `#st-directions` | Overlay bản đồ chỉ đường | 60 | `#st-btn-route` | × · Esc · click ngoài | ✅ | 🟢 |
| M3 | `#st-places` | Overlay danh sách điểm đến | 60 | `#st-btn-places` | × · Esc · click ngoài | ✅ | 🟢 |
| M4 | `#st-share` | Sheet chia sẻ | 70 | `#st-btn-share` | × · Esc · click scrim | ✅ | 🟢 |
| M5 | `#st-help` | Hướng dẫn dùng tour | 70 | `#st-btn-help` | × · Esc · click scrim | ✅ | 🟢 |
| M6 | `#st-drawer` | Menu mobile | 75 | `#st-btn-menu` | × · Esc · scrim · swipe | ✅ | 🟢 |
| P1 | `#st-more-popover` | Popover "⋯" trong dock | 45 | `#st-btn-more` | Esc · click ngoài · blur | ❌ | 🟢 |
| P2 | `.st-nav-dd` | Dropdown navbar | 45 | hover/click nav item | Esc · click ngoài · blur | ❌ | 🟢 |
| T1 | `#st-toast` | Toast | 85 | `ST.toast()` | tự tắt 2.8s | ❌ | 🟢 |

**Quy tắc chỉ 1 modal:** Modal (M*) là **exclusive** — mở M mới thì M cũ đóng
trước. Ngoại lệ duy nhất: `#st-toast` và `#st-drawer` có thể xếp trên modal khác.
Popover (P*) không phải modal, không lock scroll, không trap focus.

---

## 4.2 Engine chung — `js/a11y.js` + `js/overlays.js`

Mọi modal dùng cùng 1 bộ hành vi. Viết 1 lần, không lặp.

### `ST.a11y` API

```js
ST.a11y.lockScroll()            // html.st-locked { overflow:hidden } + bù scrollbar width
ST.a11y.unlockScroll()
ST.a11y.trap(panelEl)           // trả về release() — Tab/Shift+Tab vòng trong panel
ST.a11y.onEsc(fn)               // trả về off()
ST.a11y.rememberFocus()         // lưu document.activeElement
ST.a11y.restoreFocus()          // trả focus về chỗ cũ khi đóng modal
```

### `ST.overlays` API

```js
ST.overlays.open(id, opts)      // opts: { data, focus, onClose }
ST.overlays.close(id)
ST.overlays.closeAll()
ST.overlays.isOpen(id)
ST.overlays.current()           // id modal đang mở, hoặc null
```

### Vòng đời mở modal (thứ tự bắt buộc)

```
1. store.set('modal', id)                → các module khác biết
2. ST.a11y.rememberFocus()
3. Đóng modal đang mở khác (nếu có)
4. el.removeAttribute('aria-hidden')
5. el.classList.add('st-open')            → CSS transition chạy
6. ST.a11y.lockScroll()
7. ST.viewer.setDimmed(true)              → panorama mờ + blur, dừng auto-rotate
8. navbar: bỏ .st-nav-dim + khoá dim
9. requestAnimationFrame → focus phần tử đầu (hoặc opts.focus)
10. release = ST.a11y.trap(panel)
11. offEsc = ST.a11y.onEsc(() => close(id))
```

### Vòng đời đóng (ngược lại)

```
1. el.classList.remove('st-open')
2. release(); offEsc()
3. ST.a11y.unlockScroll()
4. ST.viewer.setDimmed(false)
5. navbar: mở khoá dim
6. transitionend (hoặc timeout --st-dur-slow) → el.setAttribute('aria-hidden','true')
7. ST.a11y.restoreFocus()
8. store.set('modal', null)
9. opts.onClose?.()
```

> ⚠️ `aria-hidden` phải đặt **sau** khi transition xong, không thì screen reader
> mất nội dung trước lúc animation kết thúc. Và phải `removeAttribute` **trước**
> khi add class, không thì focus vào element đang `aria-hidden`.

### Markup chuẩn của mọi modal

```html
<div id="st-xxx" class="st-modal" aria-hidden="true">
  <div class="st-scrim" data-st-close></div>
  <div class="st-modal-panel" role="dialog" aria-modal="true"
       aria-labelledby="st-xxx-title">
    <button class="st-modal-close" data-st-close aria-label="Đóng">
      <svg><use href="#i-close"/></svg>
    </button>
    <h2 id="st-xxx-title">…</h2>
    …
  </div>
</div>
```

- `[data-st-close]` — engine tự bind click → đóng. Không viết handler riêng.
- `.st-scrim` — `position: absolute; inset: 0; background: var(--st-scrim)`,
  `backdrop-filter: var(--st-scrim-blur)`.
- Panel `role="dialog" aria-modal="true"` đặt trên **panel**, không phải wrapper.

---

## 4.3 M1 — `#st-welcome` Modal chào mừng ⭐ 🟢

**Trái tim của YC-1.** Mục tiêu: 3 giây đầu vừa gây ấn tượng, vừa nói cho user
biết đây là tour VR360 gì, vừa cho họ chọn điểm để đi.

### Layout desktop (`≥1024px`)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                       [×] ║
║   ⟨ TOUR 360° ⟩                                                           ║
║   Bạn muốn ghé thăm nơi nào trước?                                        ║
║   Khám phá hơn 150 điểm của Công viên Văn hóa Suối Tiên bằng ảnh 360°     ║
║   — chọn một điểm trên bản đồ để bắt đầu.                                 ║
║                                                                           ║
║   ┌─────────────────────────────────────────┐  ┌──────────────────────┐   ║
║   │                                         │  │ [thumbnail 16:9]     │   ║
║   │      ⬤ Cổng      ⬤ Cá Sấu               │  │                      │   ║
║   │            ⬤ Lâu Đài Tuyết ✦            │  │ ⟨tham quan⟩          │   ║
║   │   ⬤ Farm         ⬤ Pháp Thuật ✦         │  │ Lâu Đài Tuyết        │   ║
║   │        ⬤ Biển Tiên Đồng ✦               │  │ Xứ tuyết -2°C giữa   │   ║
║   │              ⬤ Tàu Lượn   ⬤ Tứ Linh     │  │ lòng Sài Gòn...      │   ║
║   │                                         │  │                      │   ║
║   │   [bản đồ SVG stylized]                 │  │ [Đi đến điểm này →]  │   ║
║   └─────────────────────────────────────────┘  └──────────────────────┘   ║
║                                                                           ║
║   ⓘ 8 điểm nổi bật · ✦ = nên xem       Để tôi tự khám phá →              ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

Tỉ lệ: bản đồ `1fr` (~62%) · preview `340px` (~38%), `gap: var(--st-s-6)`.

### Layout mobile (`≤599px`)

Fullscreen sheet, cuộn dọc:
1. Header (title + subtitle) — sticky
2. Bản đồ SVG (aspect-ratio `4/5` portrait)
3. Preview card — **slide up từ đáy** khi chọn hotspot (không chiếm chỗ khi chưa chọn)
4. Nút "Để tôi tự khám phá" — sticky bottom

### Thông số

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-welcome` |
| z-index | `--st-z-modal` (70) |
| Panel | `max-width: min(92vw, 1080px)`, `--st-r-xl`, nền `#fff`, `--st-sh-xl` |
| Mobile panel | `inset: 0`, `border-radius: 0`, `height: 100dvh` |
| Scrim | `--st-scrim` + `backdrop-filter: var(--st-scrim-blur)` → panorama mờ phía sau |
| Trigger | Tự động trong `app.js` — xem §4.3.5 |
| Đóng | `#st-welcome-skip` · `.st-modal-close` · Esc · chọn điểm + "Đi đến" |
| **Không** đóng bằng | Click scrim ← cố ý. Modal này là onboarding, click nhầm ra ngoài là mất luôn. |

### 4.3.1 Nội dung chữ (Q6, Q7 — đổi ở `ST.data.COPY.welcome`)

```js
COPY.welcome = {
  eyebrow:  'TOUR 360°',
  title:    'Bạn muốn ghé thăm nơi nào trước?',
  subtitle: 'Khám phá hơn 150 điểm của Công viên Văn hóa Suối Tiên bằng ảnh ' +
            '360° chân thực — chọn một điểm trên bản đồ để bắt đầu.',
  legend:   '8 điểm nổi bật · ✦ = nên xem trước',
  skip:     'Để tôi tự khám phá',
  goBtn:    'Đi đến điểm này',
  hintIdle: 'Chọn một điểm trên bản đồ →'   // hiện ở panel preview khi chưa chọn
};
```

Biến thể tiêu đề (đã chuẩn bị sẵn để khách chọn — Q6):
- A: `Bạn muốn ghé thăm nơi nào trước?` ← **đang dùng**
- B: `Bạn quan tâm địa điểm nào nhất?`
- C: `Bắt đầu chuyến tham quan từ đâu nhé?`

### 4.3.2 Bản đồ 2D — `#st-welcome-map` (Q8 → chọn SVG stylized)

| Thuộc tính | Giá trị |
|---|---|
| Loại | SVG inline, `viewBox="0 0 1000 640"`, `preserveAspectRatio="xMidYMid meet"` |
| Nguồn | `assets/map/park-map.svg`, inline vào DOM để hotspot dùng chung toạ độ |
| Nội dung layer | (dưới → trên) nền cỏ → hồ nước → đường đi → khối kiến trúc → nhãn khu → hotspot |
| Nền cỏ | Gradient `--st-brand-50` → `--st-brand-100` |
| Hồ | `#bfe3f2`, có path sóng mờ |
| Đường đi | `stroke: #fff`, width `10`, `stroke-linecap: round`, dưới có shadow path `--st-n-200` width `14` |
| Khối kiến trúc | Hình khối đơn giản màu `--st-brand-200`/`--st-brand-300`, không chi tiết |
| Nhãn khu | `--st-t-xs`, `--st-brand-800`, opacity `.7` |
| Ranh giới | Path bo mềm, `stroke: --st-brand-300` dashed |
| **Không** dùng | `map/img/map.jpg` thật (1.2 MB, và khách nói "mô phỏng thôi") |

> `// MOCK:` Bản đồ này là **stylized, không đúng địa hình thật**. Bản production
> nên thay bằng `map/img/map.jpg` + toạ độ pixel thật từ `map_geo.json`. Toạ độ
> hotspot trong `data.js` là `%` nên đổi nền không phải viết lại logic.

### 4.3.3 Hotspot — 8 điểm (Q9)

Style ở [`03-components.md`](03-components.md) §3.8. Data ở
[`06-data.md`](06-data.md) §6.3.

| # | key | Tên | icon | ✦ must-see | x% | y% |
|---|---|---|---|---|---|---|
| 1 | `cong` | Cổng Thiên Tiên Môn | `i-gate` | | 14 | 78 |
| 2 | `farm` | Suối Tiên Farm | `i-gift` | | 22 | 46 |
| 3 | `casau` | Vương Quốc Cá Sấu | `i-see` | | 40 | 22 |
| 4 | `tuyet` | Lâu Đài Tuyết | `i-see` | ✦ | 52 | 38 |
| 5 | `phuthuy` | Lâu Đài Phép Thuật | `i-see` | ✦ | 62 | 58 |
| 6 | `bien` | Biển Tiên Đồng – Ngọc Nữ | `i-wave` | ✦ | 42 | 72 |
| 7 | `tauluon` | Tàu Lượn Siêu Tốc | `i-thrill` | | 76 | 44 |
| 8 | `tulinh` | Du Thuyền Tứ Linh | `i-boat` | | 84 | 70 |

Toạ độ là **`%` của viewBox**, không phải px → đổi kích thước bản đồ không lệch.
Tất cả lấy từ 20 destination có `type` trong `catalog.json` thật.

**Animation vào:** 8 hotspot xuất hiện **so le** (`stagger`), `--st-ease-spring`,
delay `i * 55ms` sau khi modal mở xong. Đây là chi tiết tạo "ấn tượng mạnh" —
bản đồ như đang "sống lên".

### 4.3.4 Preview panel — `#st-welcome-preview` (Q10 → chọn có preview)

| State | Nội dung |
|---|---|
| **Idle** (chưa chọn) | Illustration nhạt + `COPY.welcome.hintIdle` + mũi tên chỉ sang bản đồ |
| **Selected** | Thumbnail (gradient theo icon) · chip `type` · tên `--st-t-h2` · mô tả 1–2 câu · nút "Đi đến điểm này →" |
| **Đang chuyển** | Nút → spinner + "Đang mở…", disabled |

Chuyển state: cross-fade `--st-dur-base`, nội dung slide up 8px.

Mô tả từng điểm ở `ST.data.DESTINATIONS[key].blurb` — `// MOCK:` do tự viết,
bản thật lấy từ `map_places_content.json`.

### 4.3.5 Logic hiện modal — `app.js` (Q12, Q13)

```
bootstrap()
  ├─ đọc query params
  ├─ nếu ?pano=<key>       → viewer.goTo(key), KHÔNG mở welcome
  ├─ nếu ?welcome=0        → KHÔNG mở welcome
  ├─ nếu ?welcome=1        → LUÔN mở (bỏ qua localStorage)
  ├─ nếu shouldShow()      → chờ viewer 'ready' → chờ thêm 800ms → mở
  └─ ngược lại             → không mở

shouldShow():
  // MOCK: demo luôn trả true để khách xem lại được nhiều lần.
  // Production đề xuất: chỉ hiện nếu localStorage['st.welcome.ts'] cũ hơn 24h.
  return true;
```

Có nút reset ở panel `?debug=1` để xoá `localStorage` và mở lại modal.

**Vì sao chờ 800ms** (Q13): khách viết "ngay lập tức", nhưng nếu modal hiện lúc
panorama còn đen thì scrim blur không có gì để blur → mất hoàn toàn hiệu ứng
"kính mờ trên ảnh 360°", trông như trang lỗi. 800ms là đủ để panorama vẽ frame
đầu mà user chưa kịp cảm thấy chờ. Vẫn trong ngân sách "3 giây đầu".

### 4.3.6 Animation vào/ra

| Phase | Chi tiết |
|---|---|
| Scrim vào | `opacity 0→1`, `--st-dur-slow`, `--st-ease-out` |
| Panel vào | `opacity 0→1` + `scale(.94)→1` + `translateY(16px)→0`, `--st-dur-slow`, `--st-ease-out` |
| Nội dung vào | Eyebrow → title → subtitle → map → hotspot stagger, mỗi bước lệch `60ms` |
| Panel ra | `opacity 1→0` + `scale(1)→.97`, `--st-dur-base` (ra nhanh hơn vào) |
| Chọn điểm → đóng | Hotspot `scale(1.4)` + fade → panel fade → scrim fade → `viewer.goTo()` |

### 4.3.7 ARIA

```html
<div id="st-welcome" class="st-modal" aria-hidden="true">
  <div class="st-modal-panel" role="dialog" aria-modal="true"
       aria-labelledby="st-welcome-title" aria-describedby="st-welcome-sub">
    <h2 id="st-welcome-title">Bạn muốn ghé thăm nơi nào trước?</h2>
    <p  id="st-welcome-sub">Khám phá hơn 150 điểm…</p>
    <div id="st-welcome-map" role="group" aria-label="Bản đồ các điểm nổi bật">
      <button class="st-hotspot" aria-label="Lâu Đài Tuyết — tham quan, nên xem trước">…</button>
    </div>
    <div id="st-welcome-preview" aria-live="polite">…</div>
  </div>
</div>
```

- Focus đầu tiên: `#st-welcome-title` (`tabindex="-1"`) → screen reader đọc tiêu đề trước.
- 8 hotspot là `<button>` thật → Tab đi qua được, Enter/Space chọn được.
- Mũi tên ←→↑↓ trong `#st-welcome-map`: di chuyển giữa hotspot theo thứ tự (roving tabindex).
- `#st-welcome-preview` `aria-live="polite"` → chọn hotspot thì đọc tên điểm.

---

## 4.4 M2 — `#st-directions` Overlay chỉ đường 🟢

Mô phỏng lại tính năng đã có trên site thật (`#fp-overlay`). Xem
[`00-requirements.md`](00-requirements.md) §0.3 để biết bản thật có gì.

### Layout

```
╔═══════════════════════════════════════════════════════════════════════════╗
║ [🔍 Tìm điểm đến...]                                                  [×] ║
║                                                                           ║
║   [bản đồ SVG — cùng file với welcome, thêm layer route]                  ║
║                                                                           ║
║        ⬤ ─ ─ ─ ─ ⬤ ─ ─ ─ ─ ⬤ ▶                                          ║
║        từ        qua        đến                                           ║
║                                                                           ║
║  ┌──────────────────────────────────────────────────────────────────┐     ║
║  │ Cổng Thiên Tiên Môn  →  Lâu Đài Tuyết      ~480 m · ~7 phút đi bộ│     ║
║  │ [◉ Vị trí của tôi]  [⇕ Chia đôi màn hình]  [Bắt đầu dẫn đường →] │     ║
║  └──────────────────────────────────────────────────────────────────┘     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-directions` |
| z-index | `--st-z-overlay` (60) |
| Panel | Fullscreen `inset: var(--st-s-4)`, `--st-r-lg` desktop · `inset: 0` mobile |
| Nền | `#fff` |
| Trigger | `#st-btn-route` |
| Đóng | × · Esc · click ngoài panel |
| Bản đồ | Dùng lại `park-map.svg`, thêm `<g id="st-route-layer">` |

### Phần mô phỏng (`// MOCK:`)

| Phần tử | Mô phỏng thế nào |
|---|---|
| `#st-dir-route-path` | Path SVG dashed `--st-brand-600`, `stroke-dasharray` + `animation: dashmove 1.4s linear infinite` |
| Khoảng cách / thời gian | Tính từ độ dài path SVG (`getTotalLength()`) × hệ số scale hardcode. **Không** pathfinding thật. |
| `#st-dir-my-location` | Toast "Đang lấy vị trí… (demo)" → sau 1s ghim marker `me` ở vị trí hardcode gần cổng |
| `#st-dir-split` | Toggle mock: panel thu về nửa dưới, nửa trên hiện viewer + divider kéo được — **có** làm vì đây là tính năng thật của site (§0.3) |
| Tìm đường A→B | Chọn 2 điểm từ dropdown → vẽ 1 trong 3 path đã hardcode sẵn, không có path thì vẽ đường thẳng bo góc |

### ARIA

`role="dialog" aria-modal="true" aria-labelledby="st-dir-title"`,
`#st-dir-summary` có `aria-live="polite"` để đọc khoảng cách khi đổi tuyến.

---

## 4.5 M3 — `#st-places` Overlay danh sách điểm đến 🟢

Thay `#fp-list-launch` overlay hiện tại. Đây là chỗ user tìm trong 158 điểm.

### Layout

```
╔═══════════════════════════════════════════════════════════════════════════╗
║ Điểm đến                                                              [×] ║
║ [🔍 Tìm theo tên...                                    ] 158 điểm         ║
║ ⟨Tất cả⟩⟨vào cổng⟩⟨tham quan⟩⟨cảm giác mạnh⟩⟨trải nghiệm⟩⟨di chuyển⟩...  ║
║ ─────────────────────────────────────────────────────────────────────────  ║
║  ★ NỔI BẬT                                                                ║
║  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                              ║
║  │ card   │ │ card   │ │ card   │ │ card   │                              ║
║  └────────┘ └────────┘ └────────┘ └────────┘                              ║
║  TẤT CẢ ĐIỂM (A–Z)                                                        ║
║  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                              ║
║  │ card   │ │ card   │ │ card   │ │ card   │  ← cuộn                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-places` |
| z-index | `--st-z-overlay` (60) |
| Panel | `max-width: min(94vw, 1180px)`, `max-height: 88dvh`, `--st-r-lg` |
| Header | Sticky: title + search + chip filter |
| Grid | `repeat(auto-fill, minmax(220px, 1fr))`, `gap: var(--st-s-4)` · mobile: 2 cột `minmax(150px,1fr)` |
| Section | "NỔI BẬT" (20 điểm có `type`) + "TẤT CẢ ĐIỂM" (138 còn lại, A–Z) |
| Search | Debounce 180ms, khớp không phân biệt dấu (normalize `NFD` bỏ diacritic) |
| Empty state | Icon + "Không tìm thấy điểm nào khớp «xxx»" + nút "Xoá tìm kiếm" |
| Trigger | `#st-btn-places` |
| Đóng | × · Esc · click ngoài · **chọn 1 card** → `goTo()` + đóng |

### Ghi chú kỹ thuật

- 158 card render hết một lượt là chậm → **render 24 card đầu**, còn lại lazy qua
  `IntersectionObserver` sentinel ở đáy grid.
- Search chuẩn hoá tiếng Việt: `s.normalize('NFD').replace(/[̀-ͯ]/g,'')`
  → gõ "lau dai tuyet" vẫn ra "Lâu Đài Tuyết". Quan trọng vì user gõ không dấu.
- Trong `catalog.json` có tên **trùng lặp** (Cầu Bạch Tượng ×4, Biển Ngọc Nữ ×2) →
  gộp thành 1 card, hiện badge "4 góc nhìn", click thì mở góc đầu tiên.
  Xem [`06-data.md`](06-data.md) §6.4.

---

## 4.6 M4 — `#st-share` Sheet chia sẻ 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-share` |
| z-index | `--st-z-modal` (70) |
| Panel | `max-width: 420px`, `--st-r-lg` · mobile: bottom sheet slide-up, `--st-r-lg` chỉ 2 góc trên |
| Nội dung | Tên điểm hiện tại · input readonly chứa link `?pano=<key>` + nút "Copy" · 4 nút social · QR code (SVG vẽ tay, mock) |
| Copy | `navigator.clipboard.writeText()` → toast "Đã copy link" |
| Trigger | `#st-btn-share` trong `#st-more-popover` |
| Đóng | × · Esc · click scrim |

`// MOCK:` QR là SVG pattern tĩnh, không encode link thật.

---

## 4.7 M5 — `#st-help` Hướng dẫn 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-help` |
| z-index | `--st-z-modal` (70) |
| Panel | `max-width: 560px` |
| Nội dung | 4 mục, mỗi mục icon + tiêu đề + 1 câu: <br>① Kéo chuột / quẹt để xem quanh <br>② Cuộn / chụm 2 ngón để zoom <br>③ Bấm mũi tên trên ảnh để sang điểm kế <br>④ Bấm "Điểm đến" để nhảy tới bất kỳ điểm nào |
| Checkbox | "Không hiện lại" → `localStorage['st.help.hide']` |
| Trigger | `#st-btn-help` trong popover |
| Đóng | × · Esc · click scrim |

---

## 4.8 M6 — `#st-drawer` Menu mobile 🟢

Spec ở [`03-components.md`](03-components.md) §3.12. Điểm khác biệt so với modal khác:

- Có thể xếp **trên** modal khác (z 75 > 70).
- Slide ngang từ phải: `transform: translateX(100%) → 0`, `--st-dur-base`.
- Hỗ trợ swipe đóng: pointer drag phải > 60px hoặc velocity > 0.4px/ms.
- Mục có dropdown → accordion trong drawer (không phải dropdown nổi).

---

## 4.9 P1 — `#st-more-popover` 🟢

**Không phải modal**: không scrim, không lock scroll, không trap focus (chỉ đóng
khi blur ra ngoài).

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-more-popover` |
| z-index | `--st-z-dropdown` (45) |
| Vị trí | Neo trên `#st-btn-more`, mở **lên trên** (dock ở đáy), `bottom: 100% + 10px`, canh phải |
| Nền | `--st-glass-dark` + blur (giữ hệ glass của dock), `--st-r-lg` |
| Mục | `i-vr` VR mode 🟡 · `i-share` Chia sẻ 🟢 · `i-help` Hướng dẫn 🟢 · `i-globe` Ngôn ngữ 🟡 |
| Đóng | Esc · click ngoài · chọn 1 mục · scroll |
| ARIA | Trigger `aria-expanded` + `aria-controls`; panel `role="menu"`, mục `role="menuitem"`; ↑↓ di chuyển |

---

## 4.10 P2 — `.st-nav-dd` Dropdown navbar 🟢

Spec ở [`03-components.md`](03-components.md) §3.2.

---

## 4.11 T1 — `#st-toast` 🟢

Spec ở [`03-components.md`](03-components.md) §3.11.

---

## 4.12 Ma trận va chạm — modal nào đè modal nào

| Đang mở ↓ / Mở thêm → | welcome | directions | places | share | help | drawer | toast |
|---|---|---|---|---|---|---|---|
| **welcome** | — | đóng welcome | đóng welcome | đóng welcome | đóng welcome | xếp trên | xếp trên |
| **directions** | không xảy ra | — | đóng dir | đóng dir | đóng dir | xếp trên | xếp trên |
| **places** | không xảy ra | đóng places | — | đóng places | đóng places | xếp trên | xếp trên |
| **share** | không xảy ra | đóng share | đóng share | — | đóng share | xếp trên | xếp trên |
| **help** | không xảy ra | đóng help | đóng help | đóng help | — | xếp trên | xếp trên |
| **drawer** | không xảy ra | đóng drawer | đóng drawer | đóng drawer | đóng drawer | — | xếp trên |

"không xảy ra" = welcome chỉ mở lúc bootstrap, không có đường nào mở lại giữa session
(trừ `?debug=1`).

---

## 4.13 Checklist khi thêm modal mới

1. Markup theo mẫu §4.2, id prefix `st-`, `aria-hidden="true"` ban đầu
2. Thêm token z-index vào `tokens.css` nếu cần layer mới, cập nhật
   [`01-architecture.md`](01-architecture.md) §1.5
3. Style trong `css/overlays.css`, dùng `.st-modal` / `.st-modal-panel` có sẵn
4. Đăng ký với `ST.overlays` — **không** viết open/close riêng
5. Thêm 1 dòng vào bảng §4.1 + 1 section chi tiết + 1 hàng vào ma trận §4.12
6. Thêm vào bảng tổng hợp [`03-components.md`](03-components.md) §3.14
7. Cập nhật [`05-flows.md`](05-flows.md) nếu nó thay đổi luồng
8. Test: Esc đóng · Tab không thoát panel · focus quay về nút trigger · mobile ok
