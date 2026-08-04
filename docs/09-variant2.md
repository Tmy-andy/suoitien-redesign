> Cập nhật: 2026-08-04 (v6 — D-57 khách chốt bản này, gỡ bản 1; D-58 dựng lại mobile)

# 09 — VR Wall + Infinite Slider

> ⭐ **File này giờ là spec CHÍNH của `index.html`.** Tên file còn chữ "variant2" là
> dấu vết của thời có hai bản song song (2026-08-03 → 08-04); giữ nguyên tên vì cả
> `08-decisions.md` lẫn các doc khác đang trỏ tới nó — xem D-57.

Spec của `index.html`. §9.1 dưới đây giữ lại **phép so sánh với bản 1 đã gỡ**: nó ghi
lý do khách chọn bản này, và mỗi dòng trong bảng là một đánh đổi vẫn còn hiệu lực.

Nguồn ý tưởng: `note.md` §137 *"Phương án đề xuất: Kết hợp VR Wall và Infinite Slider"*.
Lý do chọn phương án đó (và loại §339): [`08-decisions.md`](08-decisions.md) D-50.

```
VR WALL tổng quan  →  INFINITE SLIDER khám phá  →  VR 360 chi tiết
   9 khu vực            các điểm trong khu vực       bridge.navigate()
```

---

## 9.1 ⚫ Khách đã chọn gì, và bỏ lại gì (D-57 · 2026-08-04)

Hai bản từng chạy song song để khách so. Từ D-52 chúng **hội tụ về cùng một luồng**
(`khu vực → điểm → VR`, cùng 2 tầng, cùng tìm kiếm và bản đồ 2D) — cái còn khác chỉ là
**cách trình bày**, và đó chính là thứ khách chọn giữa. **Khách chọn cột phải.**

| | Bản 1 — carousel *(đã gỡ)* | ★ Bản đang dùng |
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
sánh; bản này cho cảm giác quy mô và kể chuyện. Khách chọn cảm giác quy mô.

**Hai dòng cuối cùng là thứ đã mất đi khi gỡ bản 1**, ghi ra để sau này ai hỏi thì có
câu trả lời sẵn:

- **8/20 điểm chưa có ảnh** (Q-38) **không xuất hiện ở đâu cả** trong bản này — slider
  cần ảnh phủ toàn cảnh, không có ô giữ chỗ như danh sách của bản 1. Chúng vẫn nằm
  trong `D.DESTINATIONS` với UUID panorama thật; thêm 1 dòng vào `D.CARDS` là chúng
  hiện ra ngay. Xem `docs/TODO.md`.
- **Không còn màn "quét nhanh, so sánh"**. Bù lại một phần bằng ô tìm kiếm trong slider
  + 9 chip lọc.

### Cấu trúc file

```
js/data.js · js/i18n.js · js/a11y.js · js/bridge.js · js/map2d.js
js/wall.js · js/slider.js · js/popup2.js          (nạp cuối)

css/tokens.css · css/base.css
css/wall.css · css/slider.css · css/map2d.css
css/responsive2.css                                (nạp cuối — GIỮ TOÀN BỘ @media)

assets/img/cards/*.webp (12) · assets/map/park-2400.webp
```

Hợp đồng iframe: [`07-integration.md`](07-integration.md).

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

Khách báo *"Animation xuất hiện chưa có"*. Kiểm bằng Playwright thì animation
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
(`--st-green-100 → --st-gold-200`): màu
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
| ~~Xem trên bản đồ 2D~~ | Đã **gỡ hẳn khỏi `index.html`** (D-57): ở wall chưa chọn khu vực nào nên nó chỉ mở được "toàn bộ 20 pin", trùng vai với nút trong slider mà lại chiếm mất một ô của thanh 2 hàng trên mobile. `popup2.js` vẫn xử lý `[data-open-map="all"]` — thêm lại nút là chạy ngay |
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

Cơ chế `--o` (bậc so với cảnh giữa, có dấu) / `--oa` (trị tuyệt đối) — JS chỉ ghi hai
số, CSS lo toàn bộ hình học. Chính cơ chế này `carousel.js` của bản 1 cũng dùng.

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
| Quẹt / kéo | Ngưỡng **56px** — cảnh chiếm gần trọn màn nên phải quẹt dứt khoát hơn một cái thẻ nhỏ. `.st-sld-track` đặt `touch-action: pan-y` để không đụng cử chỉ "lùi trang" của iOS (D-58k) |
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

## 9.5 Responsive (`css/responsive2.css`) — dựng lại 2026-08-04 · D-58

`responsive2.css` giữ **toàn bộ** @media của project, kể cả của bản đồ 2D. Trước D-58
khối `≤599px` của bản đồ nằm ở cuối `map2d.css` còn vài dòng nữa nằm bên này — sửa một
chỗ thì chỗ kia lặng lẽ đè lên (responsive2 nạp sau). Giờ chỉ có một chỗ để tìm.

### Mô hình: mobile KHÔNG phải desktop bị bóp nhỏ

| | Desktop (`wall.css`) | ≤1023px (`responsive2.css`) |
|---|---|---|
| Ai cuộn | **không ai** — mosaic vừa khít màn | `.st-wall` là scroll container, header trôi đi |
| Grid | `flex: 1 1 auto` — co giãn vừa màn | `flex: 0 0 auto` — cao bao nhiêu thì cao |
| Chiều cao ô | `grid-template-rows: 1.38fr 1fr .84fr` | `aspect-ratio` trên từng ô |
| Ô lớn | 2 cột × 2 hàng trong mosaic 4×3 | thẻ **hero tràn ngang**, `grid-column: 1 / -1` |
| Thanh công cụ | `static`, 1 hàng, giữa | `position: sticky; bottom: 0`, 2 hàng |

Bản cũ cho **chính `.st-wall-grid`** cuộn (`overflow-y: auto`) trong khi `.st-wall`
đứng yên — cuộn lồng, header chiếm chỗ vĩnh viễn, vùng cuộn thật trên iPhone 390 chỉ
còn ~430px. Và ô cao cố định `minmax(104px, 1fr)` cắt ảnh 3:2 thành dải ngang dẹt.
Cộng với thanh công cụ 3 nút xếp dọc ăn ~150px, người dùng thấy khoảng **2,5 ô** trong 9.

### Bảng breakpoint

| Breakpoint | Wall | Slider | Bản đồ |
|---|---|---|---|
| ≥1600 | Grid `max-width: 1560px` | — | — |
| **≤1023** | Trang cuộn · 2 cột · hero `16/8.6` · ô khác `4/3` · thanh dính đáy | `--sld-w: 88vw` | — |
| **≤599** | hero `16/10` · ô khác `1/1` · **header căn TRÁI** · thanh 2 hàng | `--sld-w: 92vw` · back thành nút tròn · `object-position: center 38%` · ‹ › lên `top:30%` · thanh dưới **2 hàng** | **bottom sheet** dính đáy, bo 2 góc trên |
| **≤379** | Thanh công cụ **xếp dọc**, nút bỏ qua dáng link | Tên điểm 20px | — |
| Landscape ≤460 cao | **3 cột** · hero `16/5` · ẩn eyebrow + subtitle | ẩn mô tả · ‹ › lên `top:26%` | — |
| `hover: none` | Tắt "làm tối ô khác" · thêm `:active` cho mọi thứ | Cảnh rìa sáng hơn (`.65`) | `:active` cho pin |

### Vì sao từng con số

**2 cột, không phải slider dọc.** `note.md` §55 đề xuất *"2–4 ô lớn hoặc slider dọc"*.
Slider dọc sẽ trùng vai với chính Infinite Slider ở trạng thái 2 → hai slider chồng
khái niệm.

**3 cột ở landscape.** Máy nằm ngang rộng 844px mà vẫn 2 cột thì mỗi ô cao 297px, cả
lưới dài 1716px = **4,4 màn** phải cuộn cho 9 ô. 3 cột đưa về 1015px = 2,6 màn mà ô vẫn
rộng 260px.

**Thanh công cụ xếp theo đúng thứ tự DOM** (tìm → hành trình → bỏ qua):

```
[        Tìm địa điểm         ]   ← grid-column: 1 / -1
[ Bắt đầu hành trình ][Bỏ qua ]
```

Thứ tự Tab trùng thứ tự nhìn thấy, không phải bẻ bằng `order` (WCAG 1.3.2). Ô tìm mang
**dáng input** — chữ căn trái, màu placeholder, cao 46px — chứ không phải nút thứ ba;
bấm vào vẫn là mở slider rồi focus ô tìm thật, hành vi không đổi.

**≤379px xếp dọc.** Ở 320px hàng 2 chia cho "Bắt đầu hành trình" đúng 128px → chữ vỡ
**ba dòng**, nút cao 84px. Bản EN còn dài hơn.

**Header căn trái ở ≤599.** Tiêu đề căn giữa cần lề đều hai bên; ở 390px lề đó không
có, mà bên phải còn nút × — khối chữ lệch tâm trông như bị đẩy.

**`margin-top: auto` + `sticky bottom: 0` trên thanh công cụ.** Sticky lo trường hợp
nội dung DÀI hơn màn; auto-margin lo trường hợp NGẮN hơn (tablet rộng) — không có nó
thanh dán ngay dưới ô cuối và chừa một mảng trắng to bên dưới. Thêm `::before` gradient
26px để ô cuối trôi vào thanh chứ không bị cắt ngang một nhát.

**`object-position: center 38%` cho panel slider.** Khung dọc hẹp cắt ảnh 3:2 rất sâu;
neo 38% giữ được mái và đường chân trời thay vì chỉ còn khúc giữa.

**‹ › đẩy lên `top: 30%`.** Vùng đó chỉ có ảnh — không đụng tên / mô tả / CTA. Nền đổi
sang `rgba(6,12,20,.52)` chứ không `rgba(255,255,255,.16)` như desktop: ở desktop nút
nằm trên nền blur đã tối sẵn, ở đây nó đè lên ảnh mái đỏ/vàng chói.

**Thanh dưới slider từ 3 hàng xuống 2.** Chip / bản đồ / đếm xếp dọc ăn ~120px:

```
[ chip · chip · chip …        ]   ← grid-column: 1 / -1, cuộn ngang
[ Xem trên bản đồ  ][   3/12  ]
```

**`--st-card-h` — đo chứ không đoán.** Cụm nút zoom phải né bottom sheet. Hằng số
`152px` đúng cho điểm này, hụt 13px cho điểm kia (thẻ cao bao nhiêu là do `blurb` mấy
dòng) và nút − chui xuống dưới thẻ. `js/map2d.js:showCard()` đo `offsetHeight` rồi ghi
lên `#st-map`; `hideCard()` gỡ class. Xem D-58(h).

### Không có hover thì gì thay thế

**Mô tả và CTA của ô** sẽ không bao giờ hiện (chúng mở bằng `max-height` khi `:hover`).
Ô nhỏ: ẩn hẳn. **Thẻ hero: mở sẵn mô tả** (`display: -webkit-box` + clamp 2 dòng) — nó
là ô duy nhất có chỗ để nói thêm.

**Phản hồi khi chạm.** `:active { transform: scale(.97) }` cho ô và mọi nút. Không có
nó, chạm vào ô là màn hình đứng im suốt 620ms animation mở cổng — người dùng tưởng máy
không nhận và chạm thêm lần nữa.

**Parallax tắt trên cảm ứng.** `wall.js` bỏ qua mọi `pointermove` có
`pointerType !== 'mouse'`: ngón tay cũng bắn sự kiện đó, mà trên cảm ứng không có
`pointerleave` đáng tin để trả ảnh về → ảnh kẹt lệch vài % sau mỗi lần chạm hụt.

**`touch-action: pan-y` trên `.st-sld-track`.** Thiếu nó, quẹt ngang gần mép màn trên
iOS kích hoạt cử chỉ "lùi trang" của Safari: **trang cha bị back, popup biến mất**.

**2 ảnh/ô thay vì 3** (`wall.js:imgsPerTile()`). 9 ô × 3 ảnh = 27 file ~2 MB, và vòng
đổi cảnh lôi bằng hết đám `loading="lazy"` xuống trong 12 giây đầu, giữa lúc người dùng
đang cuộn.

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

### Luồng (Playwright/Chromium) — 9 nhóm, **0 lỗi console**

| # | Kiểm |
|---|---|
| A | Wall: 9 ô đúng tỉ lệ 1/2/6, ảnh tải hết, ô lớn 690×453, focus vào tiêu đề |
| A2 | 7/9 ô tự đổi cảnh sau 6,2 s |
| B | Wall → slider: state · nhóm `thrill` · 3 cảnh · cảnh giữa 1210px · wall mờ về 0 |
| B2 | Bấm cảnh rìa → đưa vào giữa, **không** đóng popup |
| B3 | Chip `culture` → đúng 3 điểm |
| B4 | Tìm `lau dai` → 2 kết quả (Tuyết + Pháp Thuật) |
| B5 | Esc ở slider → về wall, ô tìm kiếm được xoá |
| C | Trong iframe: `st:ready`, `st:lang` đổi cả tiêu đề lẫn nhãn ô |
| C3–C4 | Wall → slider → VR: `st:navigate` đúng pano + `st:close`; `st:open` quay về wall |

### Hình học responsive (D-58) — 7 khổ × 4 màn, **sạch**

320 · 375 · 390 · 390-EN · 844 ngang · 820 tablet · 1440 desktop.
Bất biến kiểm tự động, và lỗi mà từng cái bắt được trong lượt này:

| Bất biến | Bắt được gì |
|---|---|
| Ô không tràn ngang viewport | — |
| Ảnh không hụt mép ô | (bẫy D-53, vẫn sạch) |
| Chữ header không chạm nút × — xét **từng dòng** | Phép đo đầu tiên so mép phải cả KHỐI nên báo nhầm: dòng phụ đề nằm thấp hơn nút 60px vẫn bị tính là đụng |
| Nút trong thanh công cụ không vỡ chữ nhiều dòng | **320px: "Bắt đầu hành trình" vỡ 3 dòng** → thêm mốc ≤379 |
| ‹ › không đè khối chữ | **Landscape 844×390: nav ở `top:50%` rơi đúng vào tên điểm** |
| Cụm zoom không đè thẻ bản đồ | **Hằng số 152px hụt 13px** → đổi sang `--st-card-h` đo thật |
| Không ô nào mở đầu trùng ảnh với ô kề | **`g.cover` chưa bao giờ được đọc** → ô hero và ô ngay dưới cùng ảnh 'cong' |
| Mobile không nạp quá 2 ảnh/ô | — |
| `.st-map-card h3` không còn cỡ chữ body | **`--st-t-h3` không tồn tại** |

| Khổ | Chiều dài cuộn của wall | Ghi chú |
|---|---|---|
| 390×844 | 1312px = 1,55 màn | hero 366×229, thanh dính đáy 132px |
| 375×812 | 1302px | thanh 163px (đã xếp dọc) |
| 320×690 | 1153px | mọi nút 1 dòng |
| 844×390 ngang | 1015px = 2,6 màn | 3 cột |
| 820×1180 | 1839px | 2 cột |
| 1440×900 | **không cuộn** | mosaic 4×3, thanh `static` — desktop không đổi |
