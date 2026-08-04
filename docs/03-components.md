> Cập nhật: 2026-08-03 (v14 — thêm §3.6 bẫy max-width của ảnh phủ · D-53)

# 03 — Components

Bản trước file này có 16 mục (topbar, navbar 84 mục, drawer, dock, thẻ vé, hint,
scene label, chip, toast…). Từ D-46 project chỉ còn cái popup, nên chỉ còn **2 nhóm
component**. Spec cũ vẫn tra được ở `git show 9e5d46e:docs/03-components.md`.

Vòng đời popup (mở / đóng / ARIA): [`04-modals.md`](04-modals.md).

> ⚠️ **File này tả BẢN 1** (`index.html` — màn chào + 3D carousel).
> Bản 2 (`index2.html` — VR Wall + Infinite Slider) có spec riêng ở
> [`09-variant2.md`](09-variant2.md). Hai bản chạy song song để khách chọn (D-50).

---

## 3.1 Khung popup toàn màn — `#st-popup` (D-48)

| Selector | Vai trò |
|---|---|
| `#st-popup` | `fixed; inset:0` — **chiếm trọn màn**, flex column, nền trắng đặc |
| `.st-brandline` | Dải 4px xanh–vàng–đỏ hết bề ngang màn, không bo góc |
| `.st-popup-close` | Nút `×` tròn 46px, neo theo mép **màn hình** (ngoài `.st-popup-inner`) |
| `.st-popup-inner` | Khung nội dung — cũng là đích đo cho `bridge.ready()` |
| `.st-eyebrow` | Chip "TOUR 360°" nền `--st-green-50` |
| `#st-popup-title` | `--st-t-display`, `tabindex="-1"` để nhận focus đầu |
| `#st-popup-sub` | Câu mô tả, ẩn ở landscape thấp |
| `.st-popup-foot` | Legend + nút "Để tôi tự khám phá" |
| `.st-legend-dot` | Chip vàng 22px chứa `i-star` — **phải giống hệt** `.st-cr-badge` |

**Không còn** `.st-scrim` và `.st-popup-panel` — popup không nổi lên trên panorama mà
thay thế hẳn nó trong lúc mở.

> `.st-legend-dot` cố ý trông y hệt badge trên thẻ: chú giải mà khác hình thứ nó đang
> chú giải thì người dùng không nối được hai thứ với nhau.

### Nền — vì sao không để trắng trơn

Một mặt phẳng trắng tinh cỡ full HD trông chết cứng, nhất là khi nó vừa thay thế một
tấm panorama đầy màu. `#st-popup` có 2 vệt `radial-gradient` rất nhạt — xanh
(`--st-green-50`) ở đỉnh, vàng (`--st-gold-100`) ở góc dưới-phải — nhạt tới mức không
đọc ra là "gradient", chỉ thấy mặt phẳng bớt phẳng.

### Căn dọc

Cặp `margin-top: auto` ở `.st-popup-head` và `.st-popup-foot` — chi tiết + bẫy đã vấp:
[`04-modals.md`](04-modals.md) §4.1.

### Mobile (≤599px)

Footer đảo thành `column-reverse` với nút skip là pill nền xám cao 48px — ở cỡ đó một
link chữ nhỏ góc phải quá khó bấm. Nút × thu còn 40px và lùi sát mép.

---

## 3.2 3D carousel — `.st-cr-*` (D-44 · D-52)

> **Từ D-52 mỗi thẻ là một KHU VỰC** (`D.GROUPS`), không phải một điểm. Ảnh bìa lấy
> từ `g.cover`, badge góc trên-trái đổi từ `★ Nên xem` thành **số điểm của khu vực**
> (`.st-cr-count`, nền tối thay vì vàng — nó không còn nghĩa "nên xem"). Bấm thẻ ra
> danh sách (§3.4), không đi VR ngay.

Hình học 3D dưới đây không đổi.

Hình học 3D, các biến `--st-card-*` và những bẫy DOM: [`04-modals.md`](04-modals.md)
là chỗ tả vòng đời, còn phần "vì sao" của carousel nằm ngay đây.

| Selector | Vai trò |
|---|---|
| `.st-cr` | Khung ngoài — nơi khai báo toàn bộ biến `--st-card-*` |
| `.st-cr-viewport` | Chỉ để neo 2 nút ‹ › đúng tầm cao thẻ (bẫy #3 dưới) |
| `.st-cr-stage` | Sân khấu `perspective: 1500px` + `preserve-3d`. **Không** `overflow`/`mask` |
| `.st-cr-card` | Một thẻ = một `<button>` |
| `.st-cr-img` `.st-cr-veil` | Ảnh phủ kín + gradient tối dần xuống đáy để chữ trắng đọc được |
| `.st-cr-body` | Chip nhóm · tên · dòng "Bấm để đến đây →" (dòng cuối chỉ ở thẻ giữa) |
| `.st-cr-badge` | Badge vàng `★ Nên xem` — chỉ thẻ `must` (Q9, hint nhẹ) |
| `.st-cr-nav` | 2 nút tròn ‹ › `46px` (mobile `40px`) |
| `.st-cr-dots` `.st-cr-dot` | 12 chấm; chấm đang chọn giãn thành gạch `22px` |
| `.st-cr-live` | `.st-sr-only` + `aria-live` — đọc "Tên — 3/12" cho screen reader |

### Phân công JS ↔ CSS — chỗ dễ sửa nhầm nhất

```
js/carousel.js   → chỉ ghi 2 biến trên mỗi thẻ
                     --st-o   offset CÓ DẤU tới thẻ giữa (−1…1 với visible:1)
                     --st-oa  trị tuyệt đối của nó
                   + z-index, class .st-active, attribute data-oa
css/carousel.css → suy TOÀN BỘ transform / opacity / filter từ 2 biến đó
```

Muốn chỉnh cảm giác 3D thì sửa biến trong `.st-cr`, **không đụng vào JS**:

| Biến | Mặc định | Mobile | Ý nghĩa |
|---|---|---|---|
| `--st-card-maxw` | `min(46vw, 820px)` | `78vw` | chặn theo **bề ngang màn** |
| `--st-shadow-room` | `30px` | — | chỗ chừa dưới thẻ cho bóng đổ |
| `--st-card-step` | `70%` | `82%` | dịch ngang mỗi bậc, **% bề ngang của chính thẻ** |
| `--st-card-z` | `210px` | `140px` | lùi sâu mỗi bậc |
| `--st-card-rot` | `34deg` | `28deg` | nghiêng `rotateY` mỗi bậc |

### Cỡ thẻ suy từ CHIỀU CAO SÂN KHẤU (D-54) — không còn `--st-card-w`

`.st-cr-viewport` → `.st-cr-stage` là phần tử co giãn (`flex: 1 1 auto`); thẻ cao đúng
bằng sân khấu và `aspect-ratio` suy bề ngang:

```css
height: min(calc(100% - var(--st-shadow-room)), calc(var(--st-card-maxw) / 1.5));
aspect-ratio: 3 / 2;
width: auto;
```

Bản trước dùng `--st-card-w: min(clamp(340px,38vw,560px), 66vh)`. Hằng số `66vh` phải
chọn đủ nhỏ để an toàn ở màn **thấp nhất**, nên ở màn cao bỏ phí cả trăm pixel — và
`vh` là chiều cao *viewport*, không phải chiều cao *còn lại sau header + footer*. Cách
mới không có hằng số chiều cao nào: thẻ luôn to hết mức khung cho phép.

> **KHÔNG được thêm `max-width` vào `.st-cr-card`.** Ràng buộc cả hai chiều thì trình
> duyệt **bỏ `aspect-ratio`** chứ không bỏ giới hạn — đo được `720×729` (tỉ lệ 0.99)
> ở màn 1920. Cả hai giới hạn phải diễn đạt qua *chiều cao* rồi `min()`. Chi tiết:
> [`08-decisions.md`](08-decisions.md) D-54(c).

`--st-card-step` là **%**, không phải px: `translateX(%)` ăn theo bề ngang của chính
phần tử nên bậc dịch tự đúng tỉ lệ với thẻ — cần thiết vì giờ không ai biết trước thẻ
rộng bao nhiêu px.

**Tại sao `transform` tính bằng JS chứ không phải CSS thuần:** offset phải đi **đường
ngắn nhất trên vòng** — với 12 thẻ, từ thẻ 11 sang thẻ 0 là `+1` chứ không phải `−11`.
CSS không biểu diễn được phép toán đó.

### Ba bẫy DOM — KHÔNG được đổi

1. `.st-cr-stage` **không** được có `overflow` hay `mask` — cả hai đều ép trình duyệt
   *flatten* cây 3D, thẻ mất sạch chiều sâu. Việc cắt rìa để `body { overflow: hidden }`
   ở `base.css` lo — và việc thẻ preview bị cắt ở mép màn là **cố ý**, nó báo "còn
   nữa, quẹt tiếp đi".
2. `#st-popup-deck` **không** được animate bằng `transform` — nó là cha của phần tử
   mang `perspective`; một transform ở đây tạo containing block mới và cũng làm phẳng
   3D. Vì vậy hiệu ứng vào màn của nó chỉ là `opacity`. Cùng lý do với `#st-popup` và
   `.st-popup-inner` — [`04-modals.md`](04-modals.md) §4.4.
3. 2 nút ‹ › nằm trong `.st-cr-viewport` — không phải trong `.st-cr` (sẽ trôi lên đỉnh
   màn) và cũng không phải trong `.st-cr-stage` (sẽ thành một mặt phẳng trong không
   gian 3D, tranh chấp thứ tự vẽ với thẻ).

### State của thẻ

| State | Style |
|---|---|
| Thẻ giữa (`.st-active`) | Phẳng, `opacity 1`, viền xanh `3px --st-green-500`, `--st-sh-xl`, ảnh `scale(1.04)` |
| Thẻ preview ±1 | `rotateY(∓34°)`, lùi `210px`, `scale .90`, `opacity .70`, `brightness(.86)` |
| Thẻ xa hơn ±1 | `display: none` — chỉ 3 thẻ trên màn (D-49) |
| Hover thẻ rìa | Bỏ `brightness`, `opacity: 1` — cách "xem trước" mà không cần bấm |
| Focus | Ring vàng `--st-gold-400` `4px` (ring xanh mặc định chìm vào viền thẻ giữa) |
| Đang chọn (`.st-going`) | `scale(1.14)` + `opacity 0`, `300ms`, rồi popup đóng |

### Nội dung một thẻ

```html
<button class="st-cr-card st-active" data-i="2" data-oa="0" tabindex="0"
        aria-current="true" data-name="Lâu Đài Tuyết"
        aria-label="Lâu Đài Tuyết — Tham quan, Điểm nên xem trước. Bấm để đến đây."
        style="--st-o:0; --st-oa:0">
  <img class="st-cr-img" src="assets/img/cards/tuyet.webp" alt="" …>
  <span class="st-cr-veil"></span>            <!-- gradient để chữ trắng đọc được -->
  <span class="st-cr-badge">★ Nên xem</span>  <!-- chỉ thẻ must -->
  <span class="st-cr-body">
    <span class="st-cr-cat">THAM QUAN</span>
    <span class="st-cr-name">Lâu Đài Tuyết</span>
    <span class="st-cr-go">BẤM ĐỂ ĐẾN ĐÂY →</span>   <!-- chỉ hiện ở thẻ giữa -->
  </span>
</button>
```

`.st-cr-go` **chỉ** hiện ở thẻ giữa (`max-height` 0 → 20px): thẻ preview nghiêng 34°,
chữ ở đó không đọc ra mà chỉ làm rối.

### "Điểm nên xem" (Q9 — *"kiểu hint cho khách thôi"*)

- ✅ Badge vàng `★ Nên xem` góc trên-trái thẻ
- ✅ 1 dòng legend dưới carousel, dùng **đúng** chip vàng đó (`.st-legend-dot`)
- ❌ **Không** số thứ tự 1-2-3, không huy chương — khách nói *hint*, không phải xếp hạng
- 3 thẻ `must`: `tuyet` · `bien` · `phuthuy`

### Tương tác

| Cách | Ghi chú |
|---|---|
| Bấm thẻ | Đi thẳng điểm đó, kể cả 2 thẻ preview hai bên |
| Quẹt / kéo | Ngưỡng **44px**: dưới ngưỡng tính là bấm, từ ngưỡng trở lên là quẹt và lần `click` kèm theo bị bỏ qua (cờ `moved`) |
| Nút ‹ › | Lùi/tiến 1 thẻ |
| Chấm | Nhảy tới thẻ thứ n |
| `←` `→` `Home` `End` | Roving tabindex; focus **đi theo** thẻ giữa |
| Autoplay | 3600 ms/thẻ. Dừng khi hover / focus / tab ẩn. **Tắt hẳn** khi `prefers-reduced-motion` (WCAG 2.2.2) |

> **Bẫy đã vấp:** không được dùng `setPointerCapture` để theo con trỏ khi kéo. Khi con
> trỏ đang bị capture, Chrome bắn `click` vào chính phần tử capture chứ không vào thẻ
> nằm dưới ngón tay → `e.target.closest('.st-cr-card')` ra `null` và **bấm thẻ không đi
> đâu cả**. Thay bằng nghe `pointermove`/`pointerup` trên `window`.

### Số thẻ hiện — `visible` (D-49)

`js/popup.js` truyền `visible: 1` vào `ST.carousel.create()` → **3 thẻ trên màn**
(1 giữa + 1 preview mỗi bên). Muốn 5 thẻ như bản trước thì đổi đúng con số đó thành
`2` — không phải sửa CSS.

Thẻ ngoài tầm `visible` bị `display: none` chứ không chỉ ẩn bằng `opacity`: 12 thẻ
cùng chạy transition là 12 lớp composite, máy yếu không chịu nổi.

> `js/carousel.js` vẫn ghi attribute `data-oa` song song với biến `--st-oa` (biến cho
> `calc()`, attribute cho selector — custom property **không** dùng làm selector được).
> Hiện CSS không còn dùng `[data-oa]` nữa, nhưng giữ lại vì nó là cách duy nhất để
> nhắm một bậc cụ thể từ CSS nếu sau này cần.

### Mobile (≤599px)

Thẻ giữa chiếm gần trọn bề ngang (`min(78vw, 340px)`), 2 thẻ preview chỉ hé ra ở rìa
— vừa đủ báo "còn nữa, quẹt tiếp đi". Thao tác chính trên mobile là **quẹt**.

---

## 3.3 Bảng tra selector tương tác được

| Selector | Loại | Hành động |
|---|---|---|
| `.st-popup-close` | button | đóng popup, `reason: 'button'` |
| `#st-popup-skip` | button | đóng popup, `reason: 'button'` |
| `.st-cr-card` ×12 | button | `bridge.navigate()` rồi đóng, `reason: 'navigate'` |
| `.st-cr-nav` ×2 | button | lùi/tiến 1 thẻ |
| `.st-cr-dot` ×12 | button | nhảy tới thẻ thứ n |
| `#st-debug button` | button | chỉ có với `?debug=1` |

`[data-st-close]` là hook chung cho 2 nút đóng — `js/popup.js` bind một listener duy
nhất trên `document`.

---

## 3.4 Ô tìm kiếm + danh sách — `.st-search` · `.st-list-*` ⭐ MỚI (D-52)

Chỉ bản 1. Bản 2 có ô tìm kiếm riêng trong slider — [`09-variant2.md`](09-variant2.md) §9.3.

| Selector | Vai trò |
|---|---|
| `.st-search-row` | Hàng ngang bọc ô tìm + nút bản đồ, ngay dưới phụ đề (D-54) |
| `.st-search` | Ô tìm kiếm; `.st-on` khi có chữ → hiện nút xoá |
| `.st-head-map` | *"Xem trên bản đồ 2D"* — mở §3.5 với **cả 20 điểm**. Ẩn ở trạng thái `list` |
| `#st-search-input` | `type="search"`; đã tắt nút xoá mặc định của trình duyệt (nó chồng lên nút của ta) |
| `.st-list` | Trạng thái B. Chiếm **cùng chỗ** với carousel trong flex column — `#st-popup.st-state-list #st-popup-deck { display: none }` |
| `.st-list-back` | Về carousel |
| `.st-list-title` `.st-list-count` | Tên khu vực (hoặc "Kết quả tìm kiếm") + số điểm |
| `.st-list-map` | *"Xem khu vực này trên bản đồ"* — mở §3.5 với đúng bộ đang hiện |
| `.st-list-grid` | `repeat(auto-fill, minmax(300px, 1fr))`, cuộn dọc, fade đáy |
| `.st-li` | Một điểm: ảnh · nhóm + số hiệu · tên · blurb · cột "Xem ảnh 360°" |
| `.st-li-noimg` | Ô giữ chỗ cho 8 điểm chưa có ảnh (Q-38) |

### Hai chi tiết có chủ ý

1. **`.st-li-noimg` hiện SỐ HIỆU bản đồ, không phải mảng xám trơn.** Mảng xám trơn trông
   như ảnh lỗi tải — người dùng sẽ ngồi chờ nó hiện ra.
2. **Nút bản đồ ở header bị ẩn khi đang xem danh sách**
   (`#st-popup.st-state-list .st-head-map { display: none }`). Đã có `.st-list-map`
   ngay trên đầu danh sách; hai nút bản đồ cùng lúc là thừa và dễ bấm nhầm cái sai
   phạm vi. *(D-54 chuyển nút này từ `.st-foot-map` ở footer lên hàng tìm kiếm — tìm
   kiếm và bản đồ là hai cách TÌM một điểm, cùng một nhóm hành động; footer chỉ còn
   các cách THOÁT.)*

### Tìm kiếm

Bỏ dấu qua `D.deaccent`, khớp cả `name` lẫn `nameEn`, tìm trên **toàn bộ 20 điểm** chứ
không giới hạn trong khu vực đang xem. Gõ là nhảy thẳng sang `list`; xoá hết thì tự về
`deck` (chỉ khi đang ở danh sách kết quả tìm kiếm, không phải khi đang xem một khu vực).

### Mobile (≤599px)

`.st-search-row` chuyển `column` (390px không đủ cho ô tìm + nút nằm ngang).
`.st-list-top` xuống 2 hàng (tên khu vực chiếm cả hàng trên), 2 nút chỉ còn icon, lưới
1 cột, ẩn blurb, cột "Xem ảnh 360°" thu còn mũi tên.

---

## 3.5 Bản đồ 2D — `.st-map-*` ⭐ MỚI (D-51)

**DÙNG CHUNG cả hai bản.** Markup giống hệt nhau ở `index.html` và `index2.html` — sửa
một bên phải sửa cả bên kia.

| Selector | Vai trò |
|---|---|
| `#st-map` | Phủ lên popup, `--st-z-map: 15` |
| `.st-map-top` | Tên phạm vi đang lọc · số điểm · nút đóng |
| `.st-map-view` | Khung xem. Nền **phải trùng** màu đã flatten ảnh |
| `.st-map-canvas` | Đặt đúng bằng `D.MAP.w × h`; JS lái `translate + scale`, ghi `--k` và `--pin` |
| `.st-map-img` | `object-fit: contain` — **ngoại lệ có chủ ý**, xem dưới |
| `.st-map-pin` | Viên tròn màu + số hiệu, viền trắng. Màu theo `d.cat` |
| `.st-map-card` | Thẻ chi tiết khi bấm pin: ảnh · số · nhóm · tên · blurb · "Xem ảnh 360°" |
| `.st-map-tools` | `+` · `−` · **"Toàn cảnh"** (luôn hiện) |

### Ba điều KHÔNG được đổi

1. **`.st-map-img` là `contain`, không phải `cover`** — ngoại lệ duy nhất của rule trong
   `base.css`. `.st-map-canvas` đã được đặt đúng bằng kích thước thật của ảnh nên không
   có gì để cắt; việc "phủ kín" xảy ra ở tầng trên (tỉ lệ zoom). Đổi thành `cover` ở đây
   không sai nhưng vô nghĩa.
2. **Nền `.st-map-view` phải trùng màu đã flatten ảnh** (`--st-n-900`). Đây mới là thứ
   khiến bản đồ không lộ mảng trống — [`06-data.md`](06-data.md) §6.10.
3. **KHÔNG đổi `background` của pin khi hover/chọn.** Pin nhóm `culture` nền vàng + chữ
   tối; đổi nền sang tối là số hiệu biến mất. Nhấn mạnh bằng viền + phóng to.

### Cỡ pin — hai biến

```
--k    tỉ lệ zoom hiện tại        → chia, để pin không bị bản đồ phóng theo
--pin  clamp(bềNgangBảnĐồ/1300, .45, 1)  → nhân, để pin nhỏ lại khi thu nhỏ
transform: scale(calc(var(--pin) / var(--k)))
```

Chỉ `1/k` thôi thì pin giữ đúng 38px trên màn ở mọi mức zoom — nghe đúng, nhưng khi bản
đồ thu còn 390px (máy dọc, "Toàn cảnh") mỗi pin chiếm 10% bề ngang và 20 pin chồng thành
một đống. Đo được: có `--pin` thì pin còn 17px ở mức đó.

### Zoom

| Mốc | Giá trị |
|---|---|
| Mở ra | `cover` — phủ kín khung |
| Tối thiểu | `contain` — nút "Toàn cảnh" |
| Tối đa | `cover × 4.5` |

Nút **"Toàn cảnh" LUÔN hiện**: trên máy dọc `cover` phóng gấp ~4 lần nên chỉ thấy 23%
bề ngang; giấu nút đi thì người dùng kẹt. Bấm lần 2 quay về `cover`.

Kéo: `pointermove`/`pointerup` trên `window`, **không** `setPointerCapture` (bẫy đã vấp
ở `carousel.js`). Cuộn chuột để zoom, giữ điểm dưới con trỏ đứng yên.

---

## 3.6 Ảnh phủ — bẫy `max-width` ⚠️ (D-53)

`css/base.css` đặt mặc định cho ảnh nội dung:

```css
img { max-width: 100%; display: block; object-fit: cover; }
```

**Ảnh nào cố ý rộng hơn khung chứa PHẢI khai lại `max-width: none`.**

| Ảnh | `width` | Cần `max-width: none`? |
|---|---|---|
| `.st-cr-img` | `100%` | không |
| `.st-sld-img` | `100%` | không |
| `.st-li-media img` | `100%` | không |
| `.st-map-img` | `100%` | không |
| **`.st-wt-img`** | **`112%`** | **CÓ** — nếu quên: hụt 34px mép phải |

`.st-wt-img` rộng 112% và neo `inset: -6%` để parallax dịch ±2.5% mà không lòi mép nền.
Bị kẹp về 100% thì ảnh vẫn bắt đầu ở `-6%` nên **toàn bộ phần thiếu dồn sang một phía** —
một dải trống dọc chạy suốt chiều cao ô.

> `height` **không** bị ảnh hưởng vì `base.css` không đặt `max-height`. Vì vậy lỗi trông
> như "ảnh lệch sang trái" chứ không như "ảnh sai tỉ lệ" — dễ đoán nhầm là lỗi `transform`.

### Kiểm bằng gì

`object-fit: cover` **không** đảm bảo ảnh phủ kín khung cha — nó chỉ nói ảnh lấp khung
**của chính nó** thế nào. Phải đo hình học đã render:

```
npm i -D playwright
node tools/check-image-cover.js
```

Tool so 4 mép của mỗi ảnh phủ với khung cha, ở cả 2 bản × {mặc định, parallax ±2.5%,
hover, mobile}. Exit 1 nếu có mép âm quá 1px. **Chạy sau mỗi lần sửa CSS ảnh.**
