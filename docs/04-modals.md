> Cập nhật: 2026-08-01 (v4 — M2/M3 được CLONE thật, §4.4 + §4.4b · D-43)

# 04 — Modals & Overlays

Chi tiết **tất cả** modal/overlay: id, trigger, nội dung, z-index, ARIA, animation,
cách đóng. Thêm modal mới là phải thêm 1 section ở đây.

## 4.1 Bảng tổng hợp

| # | ID | Tên | z | Trigger | Đóng bằng | Scrim | TT |
|---|---|---|---|---|---|---|---|
| M1 | `#st-welcome` | **Chào mừng + bản đồ hotspot** | modal | Auto khi load · `#st-welcome-reopen` | Skip · × · Esc · **chọn hotspot** | ✅ + blur | 🟢 |
| M2 | `#st-route` | **Chỉ đường** *(clone)* ⭐ | modal | `#st-btn-route` · toolbar M3 | × · Esc · chọn mốc A/B | ❌ toàn màn hình | 🟢 |
| M3 | `#st-places` | **Danh sách điểm đến** *(clone)* ⭐ | modal | `#st-btn-places` · toolbar M2 | × · Esc · chọn 1 thẻ | ❌ toàn màn hình | 🟢 |
| M7 | `#st-existing` | Panel giữ chỗ cũ của M2/M3 | modal | *(không còn trigger)* | × · Esc · scrim | ✅ | 🗄️ |
| M4 | `#st-share` | Chia sẻ | modal | popover → Chia sẻ | × · Esc · scrim | ✅ | ⛔ |
| M5 | `#st-help` | Hướng dẫn tour | modal | popover → Hướng dẫn · `#st-btn-help` | × · Esc · scrim | ✅ | ⛔ |
| M6 | `#st-drawer` | Menu mobile | drawer | `#st-btn-menu` | × · Esc · scrim · swipe | ✅ | 🟢 |
| P1 | `#st-more-popover` | Popover `⋯` trong dock | dropdown | `#st-btn-more` | Esc · click ngoài · blur | ❌ | ⛔ |
| P2 | `.st-nav-dd` ×7 | Dropdown navbar | dropdown | hover/click nav item | Esc · click ngoài · blur | ❌ | 🟢 |
| P3 | `.st-hotspot-card` | Mini-card hover hotspot | — | hover/focus hotspot | mouseleave/blur | ❌ | 🟢 |
| T1 | `#st-toast` | Toast | toast | `ST.toast()` | tự tắt 2.8s | ❌ | 🟢 |

**⭐ M2/M3 ĐÃ ĐƯỢC DỰNG (2026-08-01 · D-43)** — khách yêu cầu clone luôn 2 trang mở
ra bên trong 2 nút. Trước đó D-09v2 để chúng ngoài phạm vi và chỉ có panel giữ chỗ
`#st-existing`; nay panel đó **không còn trigger nào** nhưng vẫn giữ markup + chuỗi
`existing.*` để còn đường lùi. Chi tiết ở §4.4 (M2) và §4.4b (M3).

**M2/M3 KHÔNG dùng `.st-modal-panel`** mà dùng `.st-fs-panel` — chúng là "trang" phủ
kín, không phải hộp thoại canh giữa. Vòng đời (focus trap, Esc, khoá cuộn,
`aria-hidden`) vẫn do `js/overlays.js` lo, chỉ khác lớp CSS.

**⛔ NGOÀI PHẠM VI từ 2026-08-01 (D-39)** — M4 (share), M5 (help) và P1 (popover `⋯`).
Cả 3 đều treo vào nút `⋯` của dock hợp nhất, mà dock hợp nhất đã bị đảo ngược (D-40);
ngoài ra cụm ⓐ của trip360 **đã có sẵn nút chia sẻ**. Markup + CSS + handler vẫn còn,
`css/scope.css` chỉ `display:none` chúng — mở lại bằng `index.html?full=1`.

**M6 (drawer) VẪN TRONG PHẠM VI** — nó là menu mobile của header, mà header thì được
giữ: dải trên cùng của trip360 trống nên navbar không đè lên control nào.

**Quy tắc chỉ 1 modal:** M* là exclusive. Ngoại lệ: `#st-toast`, `#st-drawer` xếp trên
được. P* không lock scroll, không trap focus.

---

## 4.2 Engine chung — `js/a11y.js` + `js/overlays.js`

### `ST.a11y` API

```js
ST.a11y.lockScroll()        // html.st-locked{overflow:hidden} + bù scrollbar width
ST.a11y.unlockScroll()
ST.a11y.trap(panelEl)       // → release(); Tab/Shift+Tab vòng trong panel
ST.a11y.onEsc(fn)           // → off()
ST.a11y.rememberFocus()
ST.a11y.restoreFocus()
```

### `ST.overlays` API

```js
ST.overlays.open(id, opts)  // opts: { data, focus, onClose, morphFrom }
ST.overlays.close(id, opts) // opts: { morphTo }
ST.overlays.closeAll()
ST.overlays.isOpen(id)
ST.overlays.current()
```

### Vòng đời mở (thứ tự bắt buộc)

```
1.  store.set('modal', id)
2.  ST.a11y.rememberFocus()
3.  Đóng modal khác đang mở
4.  el.removeAttribute('aria-hidden')       ← TRƯỚC khi add class
5.  el.classList.add('st-open')
6.  ST.a11y.lockScroll()
7.  ST.viewer.setDimmed(true)               ← blur panorama + dừng auto-rotate
8.  header: bỏ .st-nav-hidden + navHideLock = true
9.  rAF → focus phần tử đầu (hoặc opts.focus)
10. release = ST.a11y.trap(panel)
11. offEsc = ST.a11y.onEsc(() => close(id))
```

### Vòng đời đóng (ngược)

```
1. el.classList.remove('st-open')
2. release(); offEsc()
3. ST.a11y.unlockScroll()
4. ST.viewer.setDimmed(false)
5. navHideLock = false
6. transitionend (fallback timeout) → el.setAttribute('aria-hidden','true')
7. ST.a11y.restoreFocus()
8. store.set('modal', null)
9. opts.onClose?.()
```

> ⚠️ 2 bẫy: `aria-hidden` phải đặt **sau** transition (không thì screen reader mất
> nội dung sớm), và phải `removeAttribute` **trước** khi add class (không thì focus
> vào element đang `aria-hidden`).

### Markup chuẩn

```html
<div id="st-xxx" class="st-modal" aria-hidden="true">
  <div class="st-scrim" data-st-close></div>
  <div class="st-modal-panel" role="dialog" aria-modal="true" aria-labelledby="st-xxx-title">
    <button class="st-modal-close" data-st-close data-i18n-aria="close">
      <svg><use href="#i-close"/></svg>
    </button>
    <h2 id="st-xxx-title" data-i18n="xxx.title">…</h2>
  </div>
</div>
```

- `[data-st-close]` → engine tự bind click. Không viết handler riêng.
- `.st-scrim` → `position: absolute; inset: 0; background: var(--st-scrim);
  backdrop-filter: var(--st-scrim-blur)`.
- `role="dialog" aria-modal="true"` đặt trên **panel**, không phải wrapper.
- `data-i18n` / `data-i18n-aria` → `ST.i18n.apply()` thay text theo VI/EN (Q4).

---

## 4.3 M1 — `#st-welcome` ⭐ Trái tim của YC-1 🟢

Mục tiêu: 3 giây đầu vừa gây ấn tượng, vừa nói cho user biết đây là tour VR360 gì,
vừa cho họ chọn điểm để đi.

### Layout desktop (`≥1024px`)

Q10 = **(a) nhảy thẳng** → **bỏ panel preview bên phải**. Bản đồ chiếm toàn bộ chiều
rộng → to hơn, ấn tượng hơn.

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                      [×] ║
║              ⟨ TOUR 360° ⟩                                               ║
║           Bạn muốn ghé thăm nơi nào trước?                               ║
║   Khám phá hơn 150 điểm của Công viên Văn hóa Suối Tiên bằng ảnh 360°     ║
║              — bấm một điểm trên bản đồ để bắt đầu.                      ║
║                                                                          ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │                        ┌──────────────────┐                        │  ║
║  │      ⬤ Cổng           │ ⟨tham quan⟩      │ ⬤ Cá Sấu              │  ║
║  │                        │ Lâu Đài Tuyết    │                        │  ║
║  │              ✦⬤ ──────│ Xứ tuyết -2°C…   │                        │  ║
║  │   ⬤ Farm              │ Bấm để đến đây → │  ✦⬤ Pháp Thuật        │  ║
║  │                        └──────────────────┘                        │  ║
║  │        ✦⬤ Biển Tiên Đồng          ⬤ Tàu Lượn    ⬤ Tứ Linh        │  ║
║  │                     [bản đồ SVG stylized]                          │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                          ║
║  ✦ điểm nên xem                            Để tôi tự khám phá →         ║
╚══════════════════════════════════════════════════════════════════════════╝
```

Mini-card chỉ hiện khi hover/focus, `pointer-events: none`, không chiếm layout.

### Layout mobile (`≤599px`)

Fullscreen sheet:
1. Header sticky (eyebrow + title + subtitle rút gọn)
2. Bản đồ portrait `aspect-ratio: 4/5`, pinch-zoom được
3. Không có mini-card → **tooltip tên điểm** hiện khi tap-and-hold; tap = nhảy
4. Nút "Để tôi tự khám phá" sticky bottom

### Thông số

| Thuộc tính | Giá trị |
|---|---|
| z-index | `--st-z-modal` |
| Panel | `max-width: min(94vw, 1120px)`, `--st-r-xl`, nền `#fff`, `--st-sh-xl` |
| Panel mobile | `inset: 0`, `border-radius: 0`, `height: 100dvh` |
| Scrim | `--st-scrim` + `backdrop-filter: var(--st-scrim-blur)` |
| Viền panel | `1px solid var(--st-surface-border)` |
| Chi tiết brand | Dải `4px` trên đỉnh panel: `linear-gradient(90deg, #128125, #DEA800, #EB0029)` — nhắc nhận diện 3 màu |
| Đóng | `#st-welcome-skip` · `.st-modal-close` · Esc · **bấm hotspot** |
| **Không** đóng bằng scrim | Cố ý (D-14) — onboarding, click nhầm là mất |

### 4.3.1 Nội dung chữ — 3 biến thể (Q6)

Khách: *"Làm các biến thể đi"*. Cả 3 nằm trong `data.js`, đổi bằng `?title=a|b|c`
hoặc bấm nút trong panel `?debug=1`.

```js
COPY.vi.welcome = {
  eyebrow: 'TOUR 360°',
  titles: {
    a: 'Bạn muốn ghé thăm nơi nào trước?',
    b: 'Bạn quan tâm địa điểm nào nhất?',
    c: 'Bắt đầu chuyến tham quan từ đâu nhé?'
  },
  subtitle: 'Khám phá hơn 150 điểm của Công viên Văn hóa Suối Tiên bằng ảnh 360° ' +
            'chân thực — bấm một điểm trên bản đồ để bắt đầu.',
  legend: '✦ điểm nên xem',
  skip:   'Để tôi tự khám phá'
};
COPY.en.welcome = {
  eyebrow: '360° TOUR',
  titles: {
    a: 'Where would you like to visit first?',
    b: 'Which spot interests you most?',
    c: 'Where should we start the tour?'
  },
  subtitle: 'Explore 150+ spots of Suoi Tien Cultural Park in true 360° — ' +
            'tap a pin on the map to begin.',
  legend: '✦ must-see',
  skip:   'Let me explore on my own'
};
```

Mặc định: **biến thể a** (câu hỏi trực tiếp, ngắn nhất, đúng brief nhất).

### 4.3.2 Bản đồ — `#st-welcome-map` (Q8 = b, + Q-30)

| Thuộc tính | Giá trị |
|---|---|
| Loại | SVG inline, `viewBox="0 0 1000 620"`, `preserveAspectRatio="xMidYMid meet"` |
| File | `assets/map/park-map.svg`, inline vào DOM để hotspot dùng chung toạ độ |
| Layer (dưới→trên) | nền cỏ → hồ → đường đi → khối kiến trúc → nhãn khu → hotspot |
| Nền cỏ | `linear-gradient(--st-green-50 → --st-green-100)` |
| Hồ | `#bfe3f2` + path sóng mờ |
| Đường đi | `stroke: #fff` width `10`, `linecap: round`; dưới có shadow path `--st-n-200` width `14` |
| Kiến trúc | Khối đơn giản `--st-green-200` / `--st-green-300`, không chi tiết |
| Nhãn khu | `--st-t-xs`, `--st-green-800`, `opacity: .7` |
| Ranh giới | Path bo mềm, `stroke: --st-green-300` dashed |

**Biến thể `?map=real` (Q-30):** bản đồ 3D thật của khách (ảnh 2–3) làm nền +
hotspot đè lên. Làm **cả 2** để khách so sánh tại chỗ rồi chọn.

```js
// MOCK: bản đồ stylized, KHÔNG đúng địa hình thật.
// Toạ độ hotspot lưu bằng % → đổi nền không phải sửa logic.
```

### 4.3.3 Hotspot — 8 điểm (Q9)

Style ở [`03-components.md`](03-components.md) §3.8. Data ở [`06-data.md`](06-data.md) §6.3.

| # | key | Tên | icon | ✦ | x% | y% |
|---|---|---|---|---|---|---|
| 1 | `cong` | Cổng Thiên Tiên Môn | `i-gate` | | 14 | 78 |
| 2 | `farm` | Suối Tiên Farm | `i-gift` | | 22 | 46 |
| 3 | `casau` | Vương Quốc Cá Sấu | `i-see` | | 40 | 22 |
| 4 | `tuyet` | Lâu Đài Tuyết | `i-see` | ✦ | 52 | 38 |
| 5 | `phuthuy` | Lâu Đài Pháp Thuật | `i-see` | ✦ | 62 | 58 |
| 6 | `bien` | Biển Tiên Đồng – Ngọc Nữ | `i-wave` | ✦ | 42 | 72 |
| 7 | `tauluon` | Tàu Lượn Siêu Tốc | `i-thrill` | | 76 | 44 |
| 8 | `tulinh` | Du Thuyền Tứ Linh | `i-boat` | | 84 | 70 |

Tất cả lấy từ 20 destination có `type` trong `catalog.json` thật.

**Cách thể hiện "top" (Q9 — *"kiểu hint cho khách thôi"*):**
- ✅ Ring vàng `--st-gold-400` pulse nhẹ + nhãn "nên xem" khi hover
- ✅ 1 dòng legend `✦ điểm nên xem` dưới bản đồ
- ❌ **Không** số thứ tự 1-2-3, không huy chương, không "TOP 1" — khách nói *hint*,
  không phải xếp hạng

**Animation vào:** 8 hotspot xuất hiện **so le** `delay = i * 55ms`,
`--st-ease-spring`, sau khi panel mở xong. Đây là chi tiết tạo "ấn tượng mạnh" —
bản đồ như đang sống lên.

### 4.3.4 Click hotspot → nhảy thẳng (Q10 = a)

```
click .st-hotspot[data-key="tuyet"]
  ├─ hotspot: scale(1.28) + ring vàng bung ra, 180ms
  ├─ ST.track('welcome_hotspot_click', { key, dwellMs })
  ├─ ST.overlays.close('st-welcome', { morphTo: '#st-welcome-reopen' })
  └─ ST.viewer.goTo('tuyet')        ← chạy song song với animation đóng
```

Không có nút xác nhận, không có bước trung gian. Guard `_navigating` chống double-click
([`05-flows.md`](05-flows.md) §5.6).

### 4.3.5 Logic hiện modal (Q12 = b, Q13)

```
shouldShow():
  if (qs.welcome === '0') return false;
  if (qs.welcome === '1') return true;      // buộc hiện, bỏ qua localStorage
  if (qs.pano)            return false;     // deep link → vào thẳng điểm đó
  return !localStorage['st.welcome.seen'];  // Q12 = (b) CHỈ 1 LẦN

Khi đóng lần đầu:
  localStorage['st.welcome.seen'] = '1'
  → hiện #st-welcome-reopen trong dock (morph)
```

Chờ `viewer:ready` + **800ms** rồi mới mở (D-13): nếu mở lúc panorama còn đen thì
`backdrop-filter: blur()` không có gì để blur → mất hoàn toàn hiệu ứng, trông như
trang lỗi. 800ms vẫn nằm trong ngân sách "3 giây đầu".

### 4.3.6 Animation vào/ra

| Phase | Chi tiết |
|---|---|
| Scrim vào | `opacity 0→1`, `--st-dur-slow`, `--st-ease-out` |
| Panel vào | `opacity 0→1` + `scale(.94)→1` + `translateY(16px)→0`, `--st-dur-slow`, `--st-ease-out` |
| Nội dung | eyebrow → title → subtitle → map, mỗi bước lệch `60ms` |
| Hotspot | stagger `55ms`, `--st-ease-spring` |
| Panel ra | morph về nút (§4.3.8) hoặc `opacity 1→0` + `scale(.97)`, `--st-dur-base` |

### 4.3.7 ARIA

```html
<div id="st-welcome" class="st-modal" aria-hidden="true">
  <div class="st-modal-panel" role="dialog" aria-modal="true"
       aria-labelledby="st-welcome-title" aria-describedby="st-welcome-sub">
    <h2 id="st-welcome-title" tabindex="-1" data-i18n="welcome.title">…</h2>
    <p  id="st-welcome-sub" data-i18n="welcome.subtitle">…</p>
    <div id="st-welcome-map" role="group" data-i18n-aria="welcome.mapLabel">
      <button class="st-hotspot" data-key="tuyet"
              aria-label="Lâu Đài Tuyết — tham quan, điểm nên xem. Bấm để đến đây.">…</button>
    </div>
  </div>
</div>
```

- Focus đầu: `#st-welcome-title` (`tabindex="-1"`) → screen reader đọc tiêu đề trước.
- 8 hotspot là `<button>` thật → Tab đi qua, Enter/Space nhảy scene.
- `aria-label` của hotspot **nói rõ hành động** ("Bấm để đến đây") vì click = nhảy
  ngay, không có bước xác nhận.
- ←→↑↓ trong `#st-welcome-map`: di chuyển giữa hotspot (roving tabindex, `tabindex="-1"`
  cho tất cả trừ 1).

### 4.3.8 ⭐ Morph modal ↔ nút (Q12) — chi tiết kỹ thuật

Khách: *"lúc tắt thì nó sẽ thu nhỏ thành 1 nút cạnh 2 nút điểm đến kia. Bấm vào thì
mở lên lại"*.

Dùng kỹ thuật **FLIP** (First-Last-Invert-Play), không dùng thư viện:

```js
function morphClose(panel, targetSel) {
  const first  = panel.getBoundingClientRect();
  const btn    = document.querySelector(targetSel);
  btn.classList.add('st-visible');              // nút phải tồn tại để đo được
  const last   = btn.getBoundingClientRect();

  const dx = (last.left + last.width/2)  - (first.left + first.width/2);
  const dy = (last.top  + last.height/2) - (first.top  + first.height/2);
  const sx = last.width  / first.width;
  const sy = last.height / first.height;

  panel.style.transformOrigin = 'center center';
  panel.animate(
    [ { transform: 'translate(0,0) scale(1)',                    opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, opacity: 0 } ],
    { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
  );
  btn.animate([{opacity:0, transform:'scale(.6)'}, {opacity:1, transform:'scale(1)'}],
              { duration: 260, delay: 200, easing: 'cubic-bezier(.34,1.56,.64,1)',
                fill: 'backwards' });
}
```

`morphOpen()` là đảo ngược: đo rect nút → rect panel đích → animate ngược.

| Chi tiết | Giá trị |
|---|---|
| Duration | `400ms` đóng · `440ms` mở |
| Easing | `--st-ease-out` cho panel · `--st-ease-spring` cho nút |
| Scrim | Fade riêng, `--st-dur-base`, không morph |
| Nội dung panel | `opacity → 0` trong `160ms` đầu (không muốn thấy chữ bị bóp méo) |
| Fallback | `prefers-reduced-motion` → chỉ cross-fade 200ms, không morph |
| Fallback 2 | Không có `Element.animate` → chỉ `classList` toggle + CSS transition |
| Bẫy | Phải `btn.classList.add('st-visible')` **trước** khi `getBoundingClientRect()`, không thì rect = 0 |

---

## 4.4 M2 — `#st-route` · Overlay CHỈ ĐƯỜNG 🟢 ⭐ MỚI (D-43)

**Clone của overlay đang chạy trên trip360** (ảnh 2–3 ở [`00-requirements.md`](00-requirements.md)
§0.3). Trước 2026-08-01 đây chỉ là chỗ giữ chỗ `#st-existing` — xem D-09v2 và §4.4.3
để biết vì sao đảo ngược.

| Thuộc tính | Giá trị |
|---|---|
| ID | `#st-route` · panel `.st-fs-panel` |
| Trigger | `#st-btn-route` (`action:'open:st-route'`) · nút `☰` trong toolbar của chính M3 |
| Đóng | `.st-fs-close` · `Esc` · chọn mốc A/B (nhảy vào ảnh 360°) |
| z-index | `--st-z-modal` (dùng chung engine) |
| Scrim | ❌ — overlay phủ kín toàn màn hình, không cần |
| File | `css/route.css` · `js/route.js` |

### 4.4.1 Bố cục

```
┌──────────────────────────┬───────────────────────────────────┐
│ ST  Bản đồ Suối Tiên     │                            ✕      │← .st-fs-close
│     SUOI TIEN PARK ·     │                                   │
│     WAYFINDING MAP       │        ┌─────────────────┐        │
│            [Tiếng Việt▾] │        │   ⓐ             │  ┌─┐   │
│                    [‹]   │        │      ╲          │  │▤│   │
├──────────────────────────┤        │       ╲──╮      │  ├─┤   │
│ ╭──────────────────────╮ │        │    ⑫     ╰─Ⓑ   │  │☰│   │
│ │ ● ĐIỂM BẮT ĐẦU·FROM  │ │        │                 │  ├─┤   │
│ │ ┆ [1-CỔNG THIÊN…  ▾] │ │        └─────────────────┘  │◎│   │
│ │ ■ ĐIỂM ĐẾN · TO      │ │                             ├─┤   │
│ │   [22A-VƯƠNG QUỐC▾]  │ │           #st-rt-canvas     │◈│   │
│ │ [⇅ Đổi chiều][◎ Vị…] │ │                             ├─┤   │
│ ╰──────────────────────╯ │                             │+│   │
│ ╭──────────────────────╮ │                             ├─┤   │
│ │ Quãng đường ≈ 745 m  │ │                             │−│   │
│ │ Distance ≈ 745 m …   │ │                             └─┘   │
│ ╰──────────────────────╯ │                          #st-rt-tools
│ › Chỉ dẫn đường đi …     │                                   │
│ ⚑ Xuất phát từ …         │                                   │
│ ↰ Đi ~60 m rồi rẽ trái…  │                                   │
└──────────────────────────┴───────────────────────────────────┘
   #st-rt-side (clamp 316–468px)        .st-rt-stage
```

### 4.4.2 Từng phần

| Selector | Ghi chú |
|---|---|
| `.st-rt-logo` | Ô vuông cam 40px chữ "ST" — logo thu nhỏ của bản đồ giấy |
| `#st-rt-lang` | Pill "Tiếng Việt ▾" → gọi thẳng `ST.i18n.toggle()`, KHÔNG phải bộ chọn riêng |
| `#st-rt-collapse` | Nút cam thu bảng. Thu rồi thì nút **thoát ra ngoài** bằng `position:absolute; left: side-w + 16px` — để trong bảng thì nó bị kéo đi mất |
| `.st-rt-rail` | Chấm xanh · nét đứt · ô vuông đỏ. `padding: 35px 0 16px` tính để tâm chấm khớp GIỮA ô select, không phải số làm đẹp |
| `#st-rt-from` / `#st-rt-to` | Nhãn song ngữ `"1-CỔNG THIÊN TIÊN MÔN · 1-Fairyland Gate"` |
| `#st-rt-swap` | Đổi chỗ 2 giá trị rồi render lại |
| `#st-rt-mine` | **MOCK** — bắn toast. Bản thật gọi `navigator.geolocation` rồi chiếu lên `map_geo.json` |
| `#st-rt-summary` | 2 dòng VI/EN. Trùng điểm → đổi sang `.st-warn` (nền vàng) thay vì hiện "0 m" |
| `#st-rt-steps-toggle` | Chevron đỏ xoay 90° khi mở |
| `#st-rt-steps li` | Icon tròn màu theo `kind`: start 🟢 · rẽ 🔴 nhạt · thẳng ⚪ · đích 🔴 |
| `.st-rt-pin` | Pill cam số hiệu. Bấm → **đặt làm điểm đến** |
| `.st-rt-pin.st-a/.st-b` | Mốc tròn 34px có mũi nhọn. Bấm → đóng overlay + `ST.viewer.goTo()` |
| `#st-rt-tools` | 6 nút: chia đôi · danh sách (mở M3) · về giữa · la bàn · phóng to · thu nhỏ |

### 4.4.3 Quãng đường & chỉ dẫn đều là MOCK — nhưng ỔN ĐỊNH

Sinh bằng **hàm băm FNV-1a của cặp `(key đi, key đến)`**, không dùng `Math.random`.
Lý do rất thực tế: khách sẽ mở đi mở lại cùng một tuyến trong lúc xem demo — mỗi lần
ra một con số khác nhau thì trông như phần mềm bị lỗi.

```
quãng đường = √((Δx·14)² + (Δy·8.7)²) × 1.15   → làm tròn 5 m
thời gian   = ceil(quãng đường / 70 m mỗi phút)
số chặng    = 3 + (hash % 4)
```

Ràng buộc đã kiểm bằng script trên **cả 380 cặp điểm**: không đoạn nào ≤ 0 m, không
chuỗi nào lọt `NaN`/`undefined`, gọi 2 lần cho kết quả y hệt. Không có 2 chặng
"đi thẳng" liền nhau — chỉ dẫn thật luôn cắt đoạn thẳng ở chỗ có rẽ.

Đường vẽ trên bản đồ dùng **đúng `n`** đó làm số điểm gãy, nên hình vẽ và danh sách
chỉ dẫn luôn kể cùng một câu chuyện.

### 4.4.4 Toạ độ pin khớp bản đồ thế nào

`#st-rt-canvas` bị ép `aspect-ratio: 1000/620` và SVG dùng `preserveAspectRatio="none"`
→ hệ toạ độ viewBox trùng khít khung, nên pin đặt bằng `left:{x}%; top:{y}%` rơi đúng
chỗ. `max-width` suy từ `100dvh` chứ không nhờ trình duyệt kẹp `aspect-ratio` bằng
`max-height` — chỗ đó mỗi engine một kiểu.

Đường đi dùng `pathLength="100"` → `stroke-dasharray: 100` là 100% chiều dài, hoạt ảnh
vẽ chạy đủ dù tuyến dài hay ngắn.

---

## 4.4b M3 — `#st-places` · Overlay DANH SÁCH ĐIỂM ĐẾN 🟢 ⭐ MỚI (D-43)

**Clone** của overlay ở ảnh 4.

| Thuộc tính | Giá trị |
|---|---|
| ID | `#st-places` · panel `.st-fs-panel` |
| Trigger | `#st-btn-places` (`action:'open:st-places'`) · nút `☰` trong toolbar của M2 |
| Đóng | `.st-fs-close` · `Esc` · chọn 1 thẻ (nhảy vào ảnh 360°) |
| File | `css/places.css` · `js/places.js` |

### 4.4b.1 Hai cơ chế thu hẹp KHÁC NHAU — cố ý

| | Cách làm | Vì sao |
|---|---|---|
| Ô tìm kiếm `#st-pl-search` | **Ẩn hẳn** thẻ không khớp (`hidden`) | Người dùng đang tìm MỘT cái tên, giữ lại thẻ thừa là cản trở |
| Chip lọc `.st-pl-chip` | Chỉ **làm mờ** (`.st-dim`), lưới đứng yên | Đúng hành vi bản gốc — ảnh 4 cho thấy mục ngoài nhóm "Văn hoá" vẫn nằm nguyên chỗ, chỉ xám đi |

Thẻ mờ **vẫn bấm được**: lọc ở đây là để nhìn cho dễ, không phải khoá chức năng.
Bỏ dấu tiếng Việt khi tìm (`D.deaccent`, D-18) nên gõ "cung vang" vẫn ra "CUNG VÀNG".

Bộ lọc áp lên DOM có sẵn thay vì dựng lại lưới → thẻ không nhảy chỗ và ô tìm kiếm
không mất focus khi đang gõ.

### 4.4b.2 Màu tên theo nhóm

Bản gốc mỗi nhóm một màu để nhìn lướt là phân biệt được. Giữ nguyên ý đó nhưng thay
bằng thang brand, khai báo trong CSS (`--c`) chứ không nhét hex vào JS:

| Nhóm | Class | Token |
|---|---|---|
| Trò chơi | `.st-pc-game` | `--st-red-600` |
| Tham quan | `.st-pc-sight` | `--st-green-600` |
| Văn hoá | `.st-pc-culture` | `--st-gold-600` |
| Ăn uống | `.st-pc-food` | `--st-orange-500` |
| Tiện ích | `.st-pc-util` | `--st-n-500` |

`--st-gold-600` (`#b88800`) chứ không phải `--st-gold-500`: vàng nền topbar đặt trên
thẻ trắng thì tương phản không đạt AA.

### 4.4b.3 Chỉ có 20/158 điểm

Lưới nạp từ `ST.data.DESTINATIONS` = 20 điểm có `type` trong `catalog.json`. Dòng
`#st-pl-count` nói thẳng "20/158 điểm trong bản demo" thay vì giả vờ đủ. Bản thật
nạp cả 158 từ `map_places.json` — xem [`06-data.md`](06-data.md) §6.7.

---

## 4.5 M4 — `#st-share` 🟢

| Thuộc tính | Giá trị |
|---|---|
| z-index | `--st-z-modal` |
| Panel | `max-width: 420px`, `--st-r-lg` · mobile: bottom sheet, bo 2 góc trên |
| Nội dung | Tên điểm hiện tại · input readonly `?pano=<key>` + nút "Copy" · 5 nút social · QR (SVG mock) |
| Copy | `navigator.clipboard.writeText()` → toast `share.copied`. Fallback `execCommand('copy')` → fallback select text + toast `share.manualCopy` |
| Trigger | `#st-btn-share` trong `#st-more-popover` |
| Đóng | × · Esc · click scrim |

`// MOCK:` QR là SVG pattern tĩnh, không encode link thật.

---

## 4.6 M5 — `#st-help` 🟢 (Q16 — "nút help (tour help)")

| Thuộc tính | Giá trị |
|---|---|
| z-index | `--st-z-modal` |
| Panel | `max-width: 580px` |
| Header | Dải gradient 3 màu brand `4px` trên đỉnh |
| Nội dung | 5 mục, mỗi mục icon trong circle viền xanh + tiêu đề + 1 câu |
| Mục | ① Kéo chuột / quẹt để xem quanh <br>② Cuộn / chụm 2 ngón để zoom <br>③ Bấm mũi tên trên ảnh để sang điểm kế <br>④ Bấm **Điểm đến** để nhảy tới bất kỳ điểm nào trong hơn 150 điểm <br>⑤ Bấm **Chỉ đường** để xem lối đi giữa 2 điểm |
| Checkbox | "Không hiện lại" → `localStorage['st.help.hide']` |
| Trigger | `#st-btn-help` (popover `⋯`) |
| Đóng | × · Esc · click scrim |
| i18n | Toàn bộ có `data-i18n` (Q4) |

---

## 4.7 M6 — `#st-drawer` 🟢

Spec ở [`03-components.md`](03-components.md) §3.12. Khác modal khác:

- Xếp **trên** modal khác (`--st-z-drawer` > `--st-z-modal`)
- Slide ngang: `transform: translateX(100%) → 0`, `--st-dur-base`
- Swipe đóng: drag phải > 60px hoặc velocity > 0.4px/ms
- Menu 84 mục → accordion 2–3 cấp, không dropdown nổi

---

## 4.8 P1 — `#st-more-popover` 🟢

Không phải modal: không scrim, không lock scroll, không trap focus.

| Thuộc tính | Giá trị |
|---|---|
| z-index | `--st-z-dropdown` |
| Vị trí | Neo trên `#st-btn-more`, mở **lên trên** (`bottom: 100% + 10px`), canh phải |
| Nền | `#fff` + viền `--st-surface-border`, `--st-r-lg`, `--st-sh-md` |
| Mục | `i-help` Hướng dẫn 🟢 · `i-share` Chia sẻ 🟢 · `i-rotate` Tự động quay 🟢 · `i-globe` Ngôn ngữ 🟢 |
| Trên `≤899px` | Thêm các nút của nhóm "xem" (VR, gyro, sound) khi dock rút gọn |
| Đóng | Esc · click ngoài · chọn 1 mục · scroll |
| ARIA | Trigger `aria-expanded` + `aria-controls`; panel `role="menu"`, mục `role="menuitem"`; ↑↓ di chuyển, Home/End |

---

## 4.9 P2 — `.st-nav-dd` 🟢

Spec ở [`03-components.md`](03-components.md) §3.2. Đặc biệt: **nền xanh
`#128125` giống navbar** (đúng site chính), không phải nền trắng. "TRÒ CHƠI" có 3
cấp → dropdown 3 cột có heading nhóm.

---

## 4.10 P3 — `.st-hotspot-card` 🟢

Spec ở [`03-components.md`](03-components.md) §3.9. Bù cho việc bỏ preview panel.

---

## 4.11 T1 — `#st-toast` 🟢

Spec ở [`03-components.md`](03-components.md) §3.11.

---

## 4.12 Ma trận va chạm

| Đang mở ↓ / Mở thêm → | welcome | route | places | share | help | drawer | popover | toast |
|---|---|---|---|---|---|---|---|---|
| **welcome** | — | đóng welcome | đóng welcome | đóng welcome | đóng welcome | xếp trên | đóng popover trước | xếp trên |
| **route (M2)** | không xảy ra | — | **đóng route** ← nút ☰ trong toolbar | đóng route | đóng route | xếp trên | — | xếp trên |
| **places (M3)** | không xảy ra | **đóng places** ← nút ☰ trong toolbar | — | đóng places | đóng places | xếp trên | — | xếp trên |
| **share** | không xảy ra | đóng share | đóng share | — | đóng share | xếp trên | — | xếp trên |
| **help** | không xảy ra | đóng help | đóng help | đóng help | — | xếp trên | — | xếp trên |
| **drawer** | không xảy ra | đóng drawer | đóng drawer | đóng drawer | đóng drawer | — | — | xếp trên |
| **popover** | đóng popover | đóng popover | đóng popover | đóng popover | đóng popover | đóng popover | — | xếp trên |

"không xảy ra" = welcome chỉ mở từ bootstrap hoặc `#st-welcome-reopen`, và nút đó
nằm trong dock nên không bấm được khi modal khác đang mở.

**M2 ↔ M3 đi lại được với nhau** — toolbar của M2 có nút `☰` mở M3, và bấm 1 thẻ
trong M3 thì đóng M3 rồi nhảy vào ảnh 360°. Engine tự đóng cái đang mở trước
(`open()` gọi `close(openId, {silent:true})`), không cần xử lý riêng.

---

## 4.13 Checklist khi thêm modal mới

1. Markup theo mẫu §4.2, id prefix `st-`, `aria-hidden="true"` ban đầu
2. Text dùng `data-i18n` + thêm key vào `COPY.vi` **và** `COPY.en` (Q4)
3. Thêm token z-index vào `tokens.css` nếu cần layer mới → cập nhật
   [`01-architecture.md`](01-architecture.md) §1.5
4. Style trong `css/overlays.css`, dùng `.st-modal` / `.st-modal-panel` có sẵn
5. Đăng ký với `ST.overlays` — **không** viết open/close riêng
6. Thêm 1 dòng vào §4.1 + 1 section chi tiết + 1 hàng vào §4.12
7. Thêm vào [`03-components.md`](03-components.md) §3.16
8. Cập nhật [`05-flows.md`](05-flows.md) nếu đổi luồng
9. Test: Esc đóng · Tab không thoát panel · focus quay về trigger · mobile · VI+EN
