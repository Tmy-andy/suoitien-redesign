> Cập nhật: 2026-08-04 (v9 — D-57 gỡ bản 1: §5.9 thành luồng chính; §5.6 + §5.8
> viết lại cho `popup2.js`; §5.6 thêm phần JS có đọc matchMedia · D-58)

# 05 — Flows & Logic

> ⚫ **Sơ đồ ở §5.1 vẫn vẽ bản 1 đã gỡ (D-57).** Phần **qua ranh giới iframe** —
> `st:ready` → `st:navigate` → `st:close`, và hai nhánh VRCore/postMessage — **không
> đổi một dòng nào**; chỉ khác phần bên trong popup.
> **Luồng đầy đủ của bản đang dùng: §5.9.**
>
> §5.2 · §5.3 · §5.4 · §5.5 · §5.7 · §5.10 vẫn đúng nguyên văn.
> §5.6 và §5.8 đã viết lại cho `popup2.js`.

## 5.1 Luồng chính — từ lúc trang cha nhúng iframe đến lúc đổi cảnh

```mermaid
sequenceDiagram
    autonumber
    actor U as Người dùng
    participant H as TRANG CHA<br/>(3DVista + VRCore)
    participant B as bridge.js
    participant P as popup.js
    participant C as carousel.js

    Note over H: cha quyết định khi nào mở<br/>(lần đầu? mỗi phiên? xem 07 §7.9)
    H->>H: tạo iframe src=index.html?lang=vi
    H->>H: documentElement.overflow = hidden
    H->>H: aria-hidden nội dung nền

    P->>P: đọc query param, i18n.init(lang)
    P->>C: carousel.create(D.CARDS, render, onPick)
    C->>C: layout() — mỗi thẻ nhận --st-o / --st-oa theo offset vòng
    P->>P: rAF → thêm .st-open, focus tiêu đề, gắn focus trap + Esc
    C->>C: autoplay 3600ms/thẻ (tắt nếu prefers-reduced-motion)
    P->>B: bridge.ready({ w, h })
    B->>H: postMessage st:ready
    Note over U: popup hiện dần đè lên panorama, chiếm trọn màn

    U->>C: quẹt / bấm ‹ › / để yên cho tự chạy
    C->>C: đổi index → transform 620ms
    C->>C: .st-cr-live đọc "Tên — 3/12"

    U->>C: click thẻ KHU VỰC "Điểm đến nổi bật"
    C->>P: onPick(group)
    P->>P: toList(group.key) — .st-state-list, carousel.stop()
    Note over U: danh sách 5 điểm của khu vực đó
    U->>P: click 1 điểm (hoặc bấm pin trên bản đồ 2D)
    P->>B: bridge.navigate(dest)

    alt cùng origin và có parent.VRCore
        B->>H: parent.VRCore.navigateToPano(tour, pano)
        Note over B: direct = true
    else khác origin
        Note over B: direct = false — cha phải tự đi
    end
    B->>H: postMessage st:navigate { key, pano, name, direct }
    H->>H: nếu !direct → VRCore.navigateToPano()

    P->>P: close('navigate') — .st-closing, cả màn mờ đi 240ms
    P-->>B: sau 300ms
    B->>H: postMessage st:close { reason:'navigate' }
    H->>H: iframe.hidden = true, mở lại cuộn, trả focus
```

**Ba việc chạy song song ở cuối:** animation đóng của popup · điều hướng tour của
3DVista · gỡ iframe. Đó là lý do `st:close` đến **sau** `st:navigate` 300 ms — nếu bắn
cùng lúc thì cha gỡ iframe ngay và popup biến mất cụp một cái.

## 5.2 Bốn đường đóng popup

| Cách | `reason` | Ghi chú |
|---|---|---|
| Bấm 1 điểm (danh sách hoặc pin bản đồ) | `'navigate'` | Kèm `st:navigate` trước đó |
| Nút `×` hoặc "Để tôi tự khám phá" | `'button'` | |
| `Esc` **khi focus đang trong iframe** | `'esc'` | Chỉ đóng khi đang ở `deck` và bản đồ đã đóng — xem §5.10. Focus ở ngoài iframe thì trang cha phải tự bắt ([`07`](07-integration.md) §7.3) |
| Nút "Mở lại" trong `?debug=1` | `'debug'` | |
| ~~Bấm ra ngoài~~ | — | **Cố ý không có** (D-14): onboarding, click nhầm là mất. Từ D-48 cũng không còn "ngoài" để mà bấm — popup chiếm trọn màn |

Guard: `closing = true` chặn double-click và chặn `close()` chạy 2 lần.

## 5.3 Mở lại mà không reload iframe

Trang cha có 2 lựa chọn khi muốn hiện popup lần nữa:

| Cách | Khi nào dùng |
|---|---|
| `frame.hidden = false` + `postMessage st:open` | **Nên dùng.** Iframe đã tải sẵn, ảnh đã cache → hiện tức thì |
| Tạo iframe mới | Khi muốn đổi `?lang=` bằng URL thay vì postMessage, hoặc muốn reset sạch |

`st:open` làm: bỏ `.st-closing` → gỡ `.st-going` còn sót → `carousel.go(0)` →
một frame sau thêm lại `.st-open` để animation vào màn chạy lại.

> Nhịp "bỏ class một frame rồi gắn lại" là bắt buộc: CSS animation chỉ khởi động khi
> class được **thêm**. Giữ nguyên `.st-open` thì `st-fade-up` không chạy lại.

## 5.4 Ngôn ngữ

```
Nhúng:   index.html?lang=en          → i18n.init('en')
Đổi nóng: postMessage st:lang        → i18n.set(lang) → listeners → applyLang()
                                         ├─ applyTitle()      (biến thể a/b/c)
                                         ├─ i18n.apply()      (quét [data-i18n])
                                         ├─ carousel.rerender() (12 thẻ, GIỮ index)
                                         └─ labelAll()        (aria-label từng thẻ)
```

Popup **không** có nút chuyển ngôn ngữ và **không** đọc `localStorage`. Trong iframe,
`localStorage` thuộc origin của popup chứ không phải của trang cha → nếu popup tự nhớ,
nó sẽ ghi đè lên cái cha vừa truyền vào, và user thấy hai chỗ trên màn hình nói hai
thứ tiếng.

`rerender()` giữ nguyên `index` đang xem — đổi ngôn ngữ mà carousel nhảy về thẻ 1 thì
người dùng mất chỗ đang đọc.

## 5.5 Tracking

`ST.track()` chỉ `console.log` khi `?debug=1`. Có **hai** đường nối vào bản thật, chọn
một:

| Đường | Cách | Khi nào chọn |
|---|---|---|
| **Trang cha ghi** | Cha đã nhận `st:navigate` / `st:close` rồi — ghi luôn ở đó | Đơn giản nhất, không phải sửa popup |
| **Popup tự ghi** | Sửa `ST.track` trong `popup.js` gọi `VR360Track.event()` | Khi muốn cả những event cha không thấy (`popup_card_view`) |

| Event | Payload | Trả lời câu hỏi gì |
|---|---|---|
| `popup_shown` | — | Bao nhiêu % user thấy popup |
| `popup_card_view` | `{ key }` | Thẻ nào thực sự trôi qua trước mắt user |
| `popup_go` | `{ key, dwellMs }` | Tỉ lệ convert, và mất bao lâu để chọn |
| `popup_close` | `{ reason, dwellMs }` | `reason: 'button'` vs `'navigate'` = **thước đo popup có hiệu quả không** |

→ Tỉ lệ `reason:'button'` / `reason:'navigate'` chính là con số đáng bàn với khách.

## 5.6 Responsive — JS lo gì, CSS lo gì

**Nguyên tắc: CSS lo bố cục, JS chỉ lo thứ CSS không biết.** Toàn bộ @media nằm ở
`css/responsive2.css` — một file, kể cả @media của bản đồ (D-58).

| Thứ | Ai lo | Cách |
|---|---|---|
| Wall từ mosaic 4×3 → trang cuộn 2 cột → 3 cột (landscape) | `responsive2.css` | đổi `grid-template-columns` + `aspect-ratio` |
| Thanh công cụ từ 1 hàng `static` → 2 hàng `sticky` → xếp dọc (≤379) | `responsive2.css` | `display: grid` + `position: sticky` |
| Cảnh slider rộng ra, chữ nhỏ lại, ‹ › đổi chỗ | `responsive2.css` | `--sld-w` / `--sld-x` + `top` của `.st-sld-nav` |
| Thẻ bản đồ thành bottom sheet | `responsive2.css` | `left/right/bottom: 0` + bo 2 góc trên |
| **Số ảnh nạp mỗi ô wall** (2 trên mobile, 3 trên desktop) | **`js/wall.js`** | `imgsPerTile()` — `matchMedia('(max-width: 599px)')` |
| **Chiều cao thực của bottom sheet** để cụm zoom né | **`js/map2d.js`** | đo `offsetHeight` → ghi `--st-card-h` |
| **Tắt parallax trên cảm ứng** | **`js/wall.js`** | lọc `e.pointerType !== 'mouse'` |

Ba dòng cuối là **ba trường hợp CSS không làm được**, không phải ba chỗ tuỳ tiện:

- CSS không quyết định được **có tải một `<img>` hay không** — `display: none` vẫn tải.
- CSS không đọc được **chiều cao của một phần tử khác**.
- CSS không phân biệt được **nguồn của một sự kiện con trỏ**. `@media (hover: none)` nói
  về THIẾT BỊ, không nói về từng sự kiện — máy lai (laptop cảm ứng) có cả hai.

> Media query đo **kích thước iframe**, không phải trang cha. Iframe được nhúng phủ
> kín viewport nên hai con số thường bằng nhau — nhưng nếu bên tích hợp cho iframe
> kích thước khác thì breakpoint đi theo iframe.

---

## 5.7 Xử lý lỗi & trường hợp biên

| Tình huống | Popup làm gì |
|---|---|
| Mở thẳng `index.html` (không iframe) | `bridge.embedded()` = false → mọi lời gọi ra ngoài thành no-op, popup vẫn chạy đủ để xem thiết kế |
| Khác origin với trang cha | `sameOrigin()` = false → bỏ qua đường VRCore, chỉ `postMessage`. `direct: false` báo cho cha biết |
| `parent.VRCore` không tồn tại | Như trên |
| `postMessage` ném lỗi | `try/catch`, log khi `?debug=1`, popup vẫn đóng bình thường |
| Ảnh thẻ 404 | Thẻ hiện nền xám `--st-n-200` + chữ vẫn đọc được (veil + body nằm trên nền, không phụ thuộc ảnh) |
| `prefers-reduced-motion` | Autoplay **tắt hẳn**; transition/animation về `.01ms` (`base.css`); nút ‹ › và phím vẫn chạy |
| Tab bị ẩn | `document.hidden` → autoplay tạm dừng, không đốt CPU vẽ transform dưới nền |
| Bấm thẻ 2 lần thật nhanh | Guard `closing` → lần thứ 2 return ngay |

## 5.8 Bootstrap `popup2.js` — thứ tự đầy đủ

```
DOMContentLoaded (hoặc chạy ngay nếu document đã sẵn sàng)
  1. lấy tham chiếu DOM: #st-pop2 · #st-wall · #st-sld · #st-wall-grid
  2. i18n.init(?lang)             ← trước mọi thứ sinh chữ
  3. wall.create(grid, {onPick})      ← sinh 9 ô + ảnh vào DOM
  4. slider.create(sldEl, {onGo,onBack})
  5. map2d.create(#st-map, {onGo})
  6. i18n.apply()                 ← quét [data-i18n|-aria|-ph] toàn trang
  7. bind [data-act] trên #st-wall (tìm / hành trình / bỏ qua)
  8. bind [data-st-close] + [data-open-map] (1 listener trên document)
  9. bridge.on('lang') · bridge.on('open') · i18n.onChange(applyLang)
 10. rAF → .st-open · wall.start() · focus #st-wall-title · trap + Esc
 11. bridge.ready({ w, h })
 12. ?debug=1 → initDebug()
```

**Bước 3–5 phải trước bước 6.** `i18n.apply()` quét `[data-i18n]` có sẵn trong DOM;
chữ của ô wall và của panel slider thì **không** đi đường đó — chúng do
`wall.applyLang()` / `slider.applyPanelText()` đặt trực tiếp lúc `.create()`, vì chúng
cần cả `I.t()` lẫn dữ liệu nhóm.

**Bước 10 dùng `requestAnimationFrame`** chứ không gắn `.st-open` ngay: gắn trong cùng
frame với lúc chèn DOM thì trình duyệt gộp hai trạng thái làm một và transition không
chạy — popup hiện ra cứng đơ.

**Đổi ngôn ngữ không dựng lại `<img>`.** `applyLang()` gọi `wall.applyLang()` +
`slider.applyLang()` — cả hai chỉ ghi `textContent`, không đụng `innerHTML`. Dựng lại
thì trình duyệt coi là `<img>` mới và 9 ô nháy trắng một nhịp.

---

## 5.9 ⭐ LUỒNG CHÍNH — `index.html` (D-50 · chốt ở D-57)

Có **một tầng** giữa "mở popup" và "đi VR": chọn khu vực trước, chọn điểm sau.

```mermaid
sequenceDiagram
    autonumber
    actor U as Người dùng
    participant H as TRANG CHA
    participant P as popup2.js
    participant W as wall.js
    participant S as slider.js
    participant B as bridge.js

    H->>H: iframe src=index.html?lang=vi
    P->>W: wall.create(D.GROUPS) — 9 ô
    P->>S: slider.create() — dựng sẵn, còn ẩn
    P->>P: rAF → .st-open, focus tiêu đề, trap + Esc
    W->>W: mỗi ô cross-fade 2–3 ảnh, 4s/lần, lệch pha 520ms
    P->>B: bridge.ready()
    B->>H: st:ready

    U->>W: bấm ô "Cảm giác mạnh"
    W->>P: onPick(group, tile)
    P->>P: gateOpen() — FLIP từ rect ô ra toàn màn, 620ms
    P->>P: .st-state-slider · wall.stop() · rearm(sldEl)
    P->>S: setGroup('thrill') → 3 cảnh
    S->>S: tự chuyển 6s/cảnh

    U->>S: quẹt / chip / gõ tìm kiếm
    U->>S: bấm "Khám phá VR 360°"
    S->>P: onGo(dest, panel)
    P->>B: bridge.navigate(dest)
    B->>H: st:navigate { key, pano, name, direct }
    P->>P: close('navigate')
    P-->>B: sau 300ms
    B->>H: st:close { reason:'navigate' }
```

### ⚫ Khác bản 1 (đã gỡ) ở đâu — giữ lại để hiểu vì sao chọn bản này

| | Bản 1 | Bản 2 |
|---|---|---|
| Bấm ô/thẻ | `bridge.navigate()` **ngay** | Mở slider của khu vực |
| Bấm ô rìa | Đi VR | **Đưa vào giữa** |
| Đi VR | Bấm thẻ | Nút **"Khám phá VR 360°"** |
| Esc | Đóng popup | Ở slider → **về wall**; ở wall → đóng |
| `st:open` | Về thẻ 1 | **Luôn về wall** |

### Ba đường vào slider

| Từ | Nhóm mở ra |
|---|---|
| Bấm 1 trong 9 ô | nhóm của ô đó |
| Nút "Bắt đầu hành trình" | `noibat` (5 điểm ai cũng ghé) |
| Nút "Tìm địa điểm" | `all`, focus thẳng vào ô tìm kiếm |

Hai nút sau gọi `toSlider(group, null)` — `tile` là `null` nên bỏ qua FLIP "mở cổng"
(không có ô nào để phóng ra từ đó), chỉ cross-fade.

### Bẫy Tab phải đổi theo trạng thái

`rearm()` gỡ trap cũ rồi gắn lại mỗi lần đổi trạng thái. Không làm thì Tab vẫn chạy
vòng trong 9 ô của wall trong khi mắt đang nhìn slider.

---

## 5.10 Bản đồ 2D — mở được từ cả hai trạng thái (D-51)

```
Bản 1                                  Bản 2
─────────────────────────────────      ─────────────────────────────────
footer "Xem trên bản đồ 2D"            thanh wall "Xem trên bản đồ 2D"
  → openMap('all')                       → openMap('all')
  → 20 pin                               → 20 pin

danh sách → "Xem khu vực này…"         slider → "Xem khu vực này…"
  → openMap('area')                      → openMap('area')
  → currentKeys()                        → D.group(slider.group()).keys
    (khu vực HOẶC kết quả tìm kiếm)
```

Cả hai gọi cùng `ST.map2d.open(keys, label)`. Component không biết mình đang được gọi
từ bản nào.

### Trong bản đồ

```
bấm pin        → thẻ chi tiết (ảnh · số hiệu · tên · blurb · "Xem ảnh 360°")
                 nếu pin nằm khuất sau thẻ → kéo bản đồ lên cho lộ ra
bấm "Xem 360°" → opts.onGo(dest) → goVR() → bridge.navigate() → đóng cả popup
bấm nền        → đóng thẻ chi tiết
kéo / cuộn     → pan / zoom, giới hạn [contain, cover × 4.5]
"Toàn cảnh"    → contain; bấm lần 2 → về cover
Esc            → chỉ đóng bản đồ, KHÔNG đóng popup
```

### Esc ba tầng

| Đang ở | Esc làm gì |
|---|---|
| Bản đồ mở | Đóng bản đồ |
| Slider | Về wall |
| Carousel / wall | `close('esc')` → `st:close` |

Cùng nguyên tắc ở cả hai bản: **đi ngược đúng đường đã vào**.

### Cỡ pin đổi theo zoom

`apply()` ghi 2 biến lên `.st-map-canvas` mỗi khung hình:

| Biến | Công thức | Để làm gì |
|---|---|---|
| `--k` | tỉ lệ zoom | Pin chia cho nó → không bị bản đồ phóng theo |
| `--pin` | `clamp(2400·k / 1300, .45, 1)` | Pin nhân với nó → nhỏ lại khi bản đồ thu nhỏ |

Không có `--pin` thì ở mức "Toàn cảnh" trên máy dọc, 20 pin cỡ 38px chồng thành một
đống. Đo được: có `--pin` thì pin còn 17px ở mức đó.
