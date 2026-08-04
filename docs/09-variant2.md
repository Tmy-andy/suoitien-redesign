> Cập nhật: 2026-08-04 (v5 — dựng lại animation vào màn + sửa `--st-n-800` · D-55)

# 09 — Bản 2: VR Wall + Infinite Slider

Spec của `index2.html`. **Bản 1** (`index.html` — màn chào + 3D carousel) có spec riêng
ở [`03-components.md`](03-components.md) và [`04-modals.md`](04-modals.md); file này chỉ
tả phần khác.

Nguồn ý tưởng: `note.md` §137 *"Phương án đề xuất: Kết hợp VR Wall và Infinite Slider"*.
Lý do chọn phương án đó (và loại §339): [`08-decisions.md`](08-decisions.md) D-50.

```
VR WALL tổng quan  →  INFINITE SLIDER khám phá  →  VR 360 chi tiết
   9 khu vực            các điểm trong khu vực       bridge.navigate()
```

---

## 9.1 Hai bản khác nhau ở đâu

> ⚠️ **Từ D-52 hai bản đã HỘI TỤ về cùng một luồng:** `khu vực → điểm → VR`, cùng 2
> tầng, cùng có tìm kiếm và bản đồ 2D. Cái còn khác là **cách trình bày** — và đó
> chính là thứ khách đang chọn giữa.

| | Bản 1 `index.html` | Bản 2 `index2.html` |
|---|---|---|
| **Chọn khu vực** | 3D carousel — xem **tuần tự**, mỗi lúc 3 thẻ | Mosaic 9 ô — **thấy hết cùng lúc** |
| **Xem điểm** | **Danh sách** — quét nhanh, so sánh được, 2 dòng/điểm | **Slider** — mỗi điểm một cảnh gần trọn màn |
| Nền | Trắng, light/airy | **Trắng y hệt** (D-54) — chỉ slider còn tối |
| Ô tìm kiếm ở đâu | Header, luôn thấy | Trong slider |
| Lọc nhóm | Quay lại carousel chọn thẻ khác | 9 chip ngay dưới cảnh |
| Bản đồ 2D | ✅ | ✅ — dùng chung `js/map2d.js` (D-51) |
| Điểm chưa có ảnh (8/20) | **Dùng được** — ô giữ chỗ có số hiệu | Không hiện (slider cần ảnh) |
| Số click vào VR | 2 | 2 |
| Hợp với | Người **biết mình tìm gì** | Người muốn **được dẫn dắt** |

Không bản nào "tốt hơn" — chúng phục vụ hai kiểu người dùng. Bản 1 cho quét và so
sánh; bản 2 cho cảm giác quy mô và kể chuyện.

### Dùng chung những gì

```
CHUNG:  js/data.js · js/i18n.js · js/a11y.js · js/bridge.js · js/map2d.js
        css/tokens.css · css/base.css · css/map2d.css
        assets/img/cards/ · assets/map/
BẢN 1:  js/carousel.js  js/popup.js
        css/carousel.css  css/popup.css  css/responsive.css
BẢN 2:  js/wall.js  js/slider.js  js/popup2.js
        css/wall.css  css/slider.css  css/responsive2.css
```

**Dùng chung `bridge.js` là điểm quan trọng nhất:** trang cha đổi bản chỉ là đổi `src`
của iframe, không sửa một dòng nào. `host-demo.html` có nút **"Bản 1 / Bản 2"** để
chứng minh ngay tại chỗ. Hợp đồng iframe: [`07-integration.md`](07-integration.md).

---

## 9.2 Trạng thái 1 — VR Wall

| Selector | Vai trò |
|---|---|
| `#st-pop2` | Khung ngoài, `fixed; inset:0`, nền `--st-bg` trắng phẳng (D-54) |
| `.st-p2-close` | Nút `×` neo mép màn. **Sáng** (`--st-n-100`) ở wall, **kính mờ** khi `.st-state-slider` — slider vẫn nền tối |
| `.st-p2-gate` | Lớp "mở cổng" khi bấm ô — `js/popup2.js` dựng rồi tự xoá (§9.4) |
| `.st-wall` | Trạng thái 1, nền `--st-bg`; `.st-state-slider` trên `#st-pop2` làm nó mờ + `scale(1.04)` |
| `.st-wall-grid` | Grid **4 cột × 3 hàng** |
| `.st-wall-tile` | Một ô = một **khu vực** (`D.GROUPS`). Trên nền trắng **bắt buộc** có `inset 0 0 0 1px var(--st-n-200)` — xem §9.2.2 |
| `.st-wt-media` `.st-wt-img` | 2–3 ảnh xếp chồng, chỉ ảnh có `.st-on` hiện. Ảnh rộng **112%** + `max-width: none` — xem cảnh báo dưới |
| `.st-wt-body` | Số điểm · tên · mô tả · CTA |
| `.st-wall-bar` | Thanh công cụ 3 nút |

### 9.2.0 Animation vào màn — "chưa có" mà thật ra là "không thấy" (D-55)

Khách báo bản 2 *"Animation xuất hiện chưa có"*. Kiểm bằng Playwright thì animation
**vẫn chạy đúng** (9 ô, delay `260 + gi×55ms`) — nó chỉ không nhìn ra được:

| Nguyên nhân | Sửa |
|---|---|
| Ô dịch `14px` + `scale(.97)` **trên nền trắng** — quá ngắn để đọc ra là chuyển động | `46px` + `scale(.86)`, `680ms`, cách nhau `76ms` |
| `#st-pop2` fade `opacity` **400ms đè lên đúng lúc** 9 ô đang so le → nuốt trọn nhịp | lớp fade khung xuống **320ms**, xong sớm |
| Ảnh trong ô đứng im | Ken Burns `scale(1.18) → 1`, `1300ms` — thứ làm nó "sống" |
| Nút × và thanh công cụ hiện sẵn từ frame đầu | pop `620ms` · fade-up `940ms` |
| Dải 3 màu hiện sẵn | `scaleX(0) → 1` từ mép trái, `620ms` (`transform-origin` khai ở `base.css` để **cả hai bản** dùng chung) |

⚠️ Đổi hết `both` → **`backwards`**: `forwards` giữ quyền điều khiển `transform` sau
khi chạy xong, mà ô còn phải nhận `scale(1.028)` khi hover.

**Cách kiểm** (chỉ đợi rồi chụp thì không chứng minh được gì — `page.goto()` đợi tới
`load` nên lúc chụp animation đã gần xong): ghim `animation-play-state: paused` **từ
trước khi trang chạy**, rồi tự tua `currentTime` tới từng mốc. Animation vẫn được tạo,
vẫn nằm trong `getAnimations()`, nhưng đứng yên cho tới khi ta bảo nó chạy.
*(Tua `currentTime` sau khi animation kết thúc thì vô dụng — trình duyệt đã vứt nó ra
khỏi `getAnimations()`.)*

### 9.2.1 `--st-n-800` KHÔNG TỒN TẠI — ô chưa tải ảnh thành vệt xám (D-55)

`.st-wall-tile { background: var(--st-n-800) }`. Thang neutral trong `tokens.css` nhảy
thẳng **700 → 900**; không có 800. Khai báo hỏng → nền thành `transparent`, nên ô chưa
tải xong ảnh chỉ còn `.st-wt-veil` phủ lên nền trắng: **một vệt xám dọc trông y như ảnh
lỗi**. Đổi sang `--st-n-200`, cũng là lựa chọn đúng hơn cho nền trắng — chỗ giữ ảnh
phải *sáng hơn* ảnh, không tối hơn.

Chỉ lộ ra khi chụp ở mốc 500ms của animation vào: ở trạng thái cuối ảnh đã tải xong nên
lỗi này **không bao giờ hiện ra** trong ảnh chụp thường.

Sửa xong thì lộ tiếp nguyên nhân **thật sự** làm ô rỗng: `js/wall.js` đặt
`loading="lazy"` theo chỉ số ô (`gi < 3`), tức **6 ô cuối** đều tải trễ. Mosaic phủ
trọn màn nên cả 9 ô đều nằm trong viewport từ frame đầu — lazy ở đây không tiết kiệm
được gì mà lại làm ô hiện ra rỗng đúng lúc animation vào màn đang chạy. Đổi điều kiện
sang `i === 0`: **ảnh đầu của mọi ô tải ngay**, chỉ 2 ảnh dùng để đổi cảnh sau vài giây
mới lazy.

Và chỗ giữ ảnh đổi từ màu trơn sang **gradient brand**
(`--st-green-100 → --st-gold-200`, cùng công thức với `.st-li-noimg` của bản 1): màu
trơn nằm dưới `.st-wt-veil` vẫn ra một mảng xám chết.

### 9.2.2 Hai chỗ phải kê lại khi bỏ nền tối (D-54)

Nền tối làm hai việc **miễn phí** mà nền trắng phải trả tiền:

| Việc | Nền tối lo | Nền trắng phải làm |
|---|---|---|
| Tách cạnh ô khỏi nền | Ảnh sáng tự cắt ra khỏi nền | `.st-wall-tile` cần `inset 0 0 0 1px var(--st-n-200)` — ảnh có trời/tường trắng sẽ **chảy tràn** vào nền nếu thiếu |
| Ô "lùi ra sau" khi ô khác hover | `brightness(.42)` = chìm vào nền | `brightness(.62) saturate(.72)` — `.42` trên trắng thành **8 vệt đen**, trông như lỗi tải ảnh |

Lý do đổi nền (và vì sao nó **đảo ngược D-50 #4**):
[`08-decisions.md`](08-decisions.md) D-54(a) · bảng vai màu: [`02-design-system.md`](02-design-system.md) §2.11.

### Mosaic: 1 lớn · 2 trung · 6 nhỏ (note.md §192)

```
grid-template-columns: repeat(4, 1fr);
grid-template-rows:    1.38fr 1fr .84fr;

┌───────────────┬────────┬────────┐
│               │ nổi bật│ cảm    │  ← hàng 1.38fr → 2 ô này là "TRUNG"
│  KHÁM PHÁ     │        │ giác   │
│  TOÀN         ├────────┼────────┤
│  SUỐI TIÊN    │ văn hoá│ kiến   │  ← hàng 1fr
│  (2×2)        │        │ trúc   │
├───────┬───────┼────────┼────────┤
│gia đình│ nước │ hoang dã│ ẩm thực│  ← hàng .84fr → 4 ô "NHỎ"
└───────┴───────┴────────┴────────┘
```

Chỉ `.st-s-lg` được đặt tay (`grid-column: 1/span 2; grid-row: 1/span 2`); 8 ô còn lại
tự chảy theo thứ tự trong `D.GROUPS`. Đổi thứ tự nhóm trong `data.js` là đổi được bố cục
mà không đụng CSS.

> Chênh lệch chiều cao hàng phải **đủ rõ**. Đã thử `1.22 / 1 / .92`: nhìn ra 3 hàng đều
> nhau, mosaic mất hẳn phân cấp và "ô trung" vô nghĩa.

### Ô tự đổi cảnh (note.md §31)

Mỗi ô mang 2–3 ảnh của nhóm, cross-fade 900 ms, đổi mỗi **4 s**, lệch pha **520 ms**
giữa các ô.

> Dùng một `setInterval` chung rồi chia modulo sẽ ra nhịp máy móc — nhìn thấy rõ là
> "9 ô cùng một đồng hồ". Mỗi ô một timer riêng, khởi động lệch nhau.

Dừng khi: `prefers-reduced-motion` (tắt hẳn) · tab ẩn · con trỏ đang ở trên chính ô đó
(người dùng đang nhìn nó).

### Hover (note.md §34–41)

| Hiệu ứng | Cách làm |
|---|---|
| Ô nở nhẹ | `scale(1.028)` + viền xanh + quầng vàng |
| Các ô khác tối xuống | `.st-wall-grid:hover .st-wall-tile:not(:hover) { filter: brightness(.42) }` |
| Hiện mô tả + CTA | `max-height` 0 → 40px / 22px |
| "Xoay thử panorama" | **MOCK** — parallax: ảnh dịch ±2.5% ngược chiều con trỏ qua `--px/--py`. Ảnh `width/height: 112%` + `inset: -6%` để dịch mà không lòi mép |

> ⚠️ **`.st-wt-img` PHẢI có `max-width: none`.** `css/base.css` đặt
> `img { max-width: 100% }` cho ảnh nội dung — nó kẹp `width: 112%` xuống 100%, ảnh
> vẫn neo `left: -6%` nên toàn bộ phần thiếu dồn sang **mép phải**: một dải trống dọc
> 34px chạy suốt chiều cao ô (51px khi parallax đẩy sang trái). Đã xảy ra thật — D-53.
> Kiểm bằng `node tools/check-image-cover.js`, **không** bằng cách nhìn `object-fit`.

Ảnh thật nên là video loop 4–6 s hoặc panorama nhẹ (note.md §59–64) — xem TODO.

### Thanh công cụ — 3 nút, không phải 5

`note.md` §198 liệt kê 5 mục. Đã bỏ 2:

| Mục | Vì sao bỏ |
|---|---|
| ~~Xem bản đồ~~ | Bản đồ gỡ từ D-44. Nút mở ra chỗ trống tệ hơn không có nút |
| ~~Khám phá theo chủ đề~~ | **Chính là cái wall đang hiện** — nút tự trỏ vào mình |

Còn lại, cả 3 đều chạy thật:

| Nút | Làm gì |
|---|---|
| **Tìm địa điểm** | → slider nhóm `all`, focus thẳng vào ô tìm kiếm |
| ~~Xem trên bản đồ 2D~~ | Mở `#st-map` với cả 20 pin (D-51). **Hiện đang comment out trong `index2.html`** — bật lại bằng cách bỏ dấu comment quanh `[data-open-map="all"]` |
| **Bắt đầu hành trình** | → slider nhóm `noibat` (5 điểm ai cũng ghé) |
| **Bỏ qua, vào VR ngay** | `close('button')` → `st:close` |

---

## 9.3 Trạng thái 2 — Infinite Slider

| Selector | Vai trò |
|---|---|
| `.st-sld-bg` | Ảnh đang xem, `blur(34px) brightness(.42)`, phủ kín viewport |
| `.st-sld-top` | Nút "Tất cả khu vực" + ô tìm kiếm |
| `.st-sld-track` `.st-sld-panel` | Sân khấu + các cảnh |
| `.st-sld-info` | Chip nhóm · tên · mô tả · nút **"Khám phá VR 360°"** |
| `.st-sld-nav` | 2 nút ‹ › |
| `.st-sld-chips` | 9 chip lọc nhóm, cuộn ngang có fade mép |
| `.st-sld-map` ⭐ | *"Xem khu vực này trên bản đồ"* — mở `#st-map` **chỉ với pin của nhóm đang xem** (D-51) |
| `.st-sld-counter` | `3 / 12` |
| `.st-sld-live` | `aria-live` — đọc "Tên — 3/12" |

### Gỡ mâu thuẫn của note.md §85

> *"Phía sau là ảnh hoặc video toàn màn hình. Hai bên hé lộ một phần cảnh tiếp theo và
> cảnh trước đó."*

Hai câu nghe ngược nhau. Cách gỡ: **nền** là ảnh hiện tại phủ kín viewport (blur + tối)
→ thoả vế 1; **các cảnh** nằm trên nó dạng cổng rộng `84vw`, hé `8vw` mỗi bên → thoả
vế 2.

```
--sld-w: 84vw;   /* bề ngang một cảnh */
--sld-x: 8vw;    /* lề trái → 8vw hé mỗi bên */
transform: translateX(calc(var(--o) * var(--sld-w))) scale(calc(1 - var(--oa) * .07));
opacity:   calc(1 - var(--oa) * .35);
```

Cùng cơ chế `--o` / `--oa` với `carousel.js` (bản 1) — [`03-components.md`](03-components.md) §3.2.

> **Khác một chỗ quan trọng:** `offset()` của slider **không vòng khi `n < 3`**. Nhóm
> `wild` chỉ có 1 điểm, `water` có 2 — vòng thì panel "trước" và "sau" trỏ vào cùng một
> cái và cảnh nhân đôi trên màn.

### Bấm cảnh rìa = đưa vào giữa, KHÔNG đi VR

Ngược với bản 1 (bấm thẻ nào đi thẳng thẻ đó). **Cố ý:** ở đây mỗi cảnh chiếm gần trọn
màn và có mô tả riêng — người dùng cần đọc trước khi quyết. Nút
**"Khám phá VR 360°"** mới là hành động đi.

### Thao tác (note.md §87)

| Cách | Ghi chú |
|---|---|
| Quẹt / kéo | Ngưỡng **56px** (cảnh to hơn thẻ bản 1 → ngưỡng lớn hơn) |
| Con lăn chuột | Ngưỡng 12 + khoá **420 ms** — trackpad bắn hàng chục event mỗi lần vuốt, không khoá thì lướt một cái nhảy 8 cảnh |
| Nút ‹ › | |
| `←` `→` `Home` `End` | |
| Tự chuyển | **6000 ms**, dừng khi hover/focus/tab ẩn, tắt khi `prefers-reduced-motion` |

> Không dùng `setPointerCapture` — Chrome bắn `click` vào phần tử capture chứ không vào
> panel dưới ngón tay. Bẫy đã vấp ở `carousel.js`.

### Lọc và tìm kiếm (note.md §97–107)

- **9 chip nhóm** — bấm là đổi `D.GROUPS[].keys`
- **Ô tìm kiếm bỏ dấu** — gõ `lau dai` ra cả *Lâu Đài Tuyết* và *Lâu Đài Pháp Thuật*
  (`D.deaccent`, khớp cả `name` lẫn `nameEn`)
- Quay về wall thì **xoá ô tìm kiếm** — mở lại mà còn dính query cũ, người dùng tưởng
  nhóm đó chỉ có 1 điểm

---

## 9.4 Chuyển trạng thái

```
toSlider(group, tile)                    toWall()
  ├─ gateOpen(group, tile)   ← FLIP        ├─ slider.stop() + resetSearch()
  ├─ wall.stop()                           ├─ bỏ .st-state-slider
  ├─ thêm .st-state-slider                 ├─ #st-sld hidden + aria-hidden
  ├─ #st-sld bỏ hidden                     ├─ wall.start()
  ├─ slider.setGroup(group.key)            ├─ rearm(wallEl)
  ├─ rearm(sldEl)  ← đổi bẫy Tab           └─ focus ô đầu
  └─ focus nút "Khám phá VR 360°"
```

### "Mở cổng" — FLIP (note.md §113, §159)

`gateOpen()` dựng một lớp `.st-p2-gate` phủ kín màn mang đúng ảnh của ô, đặt sẵn ở
`inset: 0`, rồi cho chạy **ngược** từ rect của ô về toàn màn (620 ms) và mờ dần.

Rẻ hơn animate chính cái ô (không phải nhấc nó ra khỏi grid) và không đụng gì tới layout
của wall. Bỏ qua khi `prefers-reduced-motion`.

### Esc hai tầng

| Đang ở | Esc làm gì |
|---|---|
| **Bản đồ mở** | Đóng bản đồ, giữ nguyên tầng dưới |
| Slider | **Lùi về wall** |
| Wall | `close('esc')` → `st:close` |

Đóng thẳng từ slider sẽ làm người dùng mất cả hai tầng chỉ bằng một phím.

### `st:open` luôn về wall

Trang cha gửi `st:open` để hiện lại mà không reload iframe → `reopen()` **luôn** đưa về
wall. Rơi thẳng vào slider của nhóm lần trước thì người dùng mất ngữ cảnh "đây là màn
tổng quan".

---

## 9.5 Responsive (`css/responsive2.css`)

| Breakpoint | Wall | Slider |
|---|---|---|
| ≥1600 | Grid `max-width: 1560px` | — |
| ≤1023 | **2 cột**, ô lớn `2 cột × 2 hàng`, grid cuộn dọc | `--sld-w: 88vw` |
| ≤599 | 2 cột nhỏ hơn · ẩn mô tả + CTA · thanh công cụ **xếp dọc** | `--sld-w: 90vw` · nút back còn mũi tên · nút VR full width · chip + counter xếp dọc |
| Landscape thấp | Ẩn eyebrow + subtitle | Ẩn mô tả |
| `hover: none` | Tắt hiệu ứng "làm tối ô khác" | Cảnh rìa sáng hơn (`.65`) |

**note.md §55** đề xuất *"2–4 ô lớn hoặc slider dọc"* trên điện thoại → chọn **2 cột**.
Slider dọc sẽ trùng vai với chính Infinite Slider ở trạng thái 2, thành ra hai slider
chồng khái niệm.

**Không có hover trên mobile** → mô tả và CTA của ô sẽ **không bao giờ hiện**. Vì vậy ẩn
hẳn (`display: none !important`) và cho số điểm hiện sẵn, thay vì để hai dòng chết.

---

## 9.6 Dữ liệu — `D.GROUPS`

9 nhóm, schema ở [`06-data.md`](06-data.md). Tóm tắt:

| key | size | Số điểm | Ảnh bìa |
|---|---|---|---|
| `all` | lg | 12 | `cong` |
| `noibat` | md | 5 | `cungvang` |
| `thrill` | md | 3 | `vongxoay` |
| `culture` | sm | 3 | `amcung` |
| `kientruc` | sm | 4 | `tuyet` |
| `family` | sm | 3 | `tulinh` |
| `water` | sm | 2 | `bien` |
| `wild` | sm | **1** | `casau` |
| `food` | sm | **1** | `farm` |

⚠️ **MOCK:** cách chia nhóm là tự đặt, Suối Tiên chưa có phân loại chính thức (Q-41).
Hai nhóm 1 điểm là vì mới có 12 ảnh — Q-38 giải quyết. Một điểm được phép nằm ở nhiều
nhóm (Cung Vàng vừa văn hoá vừa kiến trúc); đó là chủ ý, không phải lỗi dữ liệu.

---

## 9.7 Đã test

Playwright/Chromium — 9 nhóm kiểm, **0 lỗi console**:

| # | Kiểm |
|---|---|
| A | Wall: 9 ô đúng tỉ lệ 1/2/6, 22 ảnh tải hết, ô lớn 690×453, focus vào tiêu đề |
| A2 | 7/9 ô tự đổi cảnh sau 6,2 s |
| B | Wall → slider: state · nhóm `thrill` · 3 cảnh · cảnh giữa 1210px · wall mờ về 0 |
| B2 | Bấm cảnh rìa → đưa vào giữa, **không** đóng popup |
| B3 | Chip `culture` → đúng 3 điểm |
| B4 | Tìm `lau dai` → 2 kết quả (Tuyết + Pháp Thuật) |
| B5 | Esc ở slider → về wall, ô tìm kiếm được xoá |
| C | Trong iframe: đổi `src` sang index2, `st:ready`, `st:lang` đổi cả tiêu đề lẫn nhãn ô |
| C3–C4 | Wall → slider → VR: `st:navigate` đúng pano + `st:close`; `st:open` quay về wall |
| D | Mobile 390: grid 2 cột, thanh công cụ xếp dọc, cảnh giữa 351px |

Đồng thời chạy **hồi quy bản 1** sau khi sửa `data.js` + `i18n.js` → PASS.
