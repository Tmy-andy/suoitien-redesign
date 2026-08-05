> Cập nhật: 2026-08-05 (v9 — D-62: dải chip cuộn ngang được bằng chuột. v8 — D-61: nền
> sáng + thẻ thành MẶC ĐỊNH cho mọi khổ, desktop thành thẻ ngang, nút bản đồ 2D trở lại
> thanh công cụ wall)

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
| **Chọn khu vực** | 3D carousel — xem **tuần tự**, mỗi lúc 3 thẻ | Mosaic **11 ô** — **thấy hết cùng lúc** |
| **Xem điểm** | **Danh sách** — quét nhanh, so sánh được, 2 dòng/điểm | **Slider** — mỗi điểm một **thẻ** (⚫ tới D-60/D-61 là một cảnh gần trọn màn) |
| Nền | Trắng, light/airy | **Trắng y hệt** (D-54) — và từ D-61 **cả slider cũng trắng** |
| Ô tìm kiếm ở đâu | Header, luôn thấy | Trong slider |
| Lọc nhóm | Quay lại carousel chọn thẻ khác | **11 chip** ngay dưới thẻ |
| Bản đồ 2D | ✅ | ✅ — dùng chung `js/map2d.js` (D-51), mở được từ **cả wall lẫn slider** (D-61) |
| Điểm chưa có ảnh | **Dùng được** — ô giữ chỗ có số hiệu | ✅ từ D-59 — thẻ gradient brand + nhãn "chưa có ảnh xem trước" |
| Số click vào VR | 2 | 2 |
| Hợp với | Người **biết mình tìm gì** | Người muốn **được dẫn dắt** |

Không bản nào "tốt hơn" — chúng phục vụ hai kiểu người dùng. Bản 1 cho quét và so
sánh; bản này cho cảm giác quy mô và kể chuyện. Khách chọn cảm giác quy mô.

**Thứ đã mất đi khi gỡ bản 1**, ghi ra để sau này ai hỏi thì có câu trả lời sẵn:

- **Không còn màn "quét nhanh, so sánh"**. Bù lại một phần bằng ô tìm kiếm trong slider
  + 11 chip lọc.

> ⚫ Dòng *"điểm chưa có ảnh không xuất hiện ở đâu cả"* từng đứng ở đây với lý do "slider
> cần ảnh phủ toàn cảnh". **Hết hiệu lực từ D-59**: điểm chưa có ảnh hiện thành thẻ
> gradient brand kèm nhãn — bấm vào vẫn vào đúng panorama thật.

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

### Thanh công cụ — 4 nút, không phải 5

`note.md` §198 liệt kê 5 mục. Đã bỏ 1:

| Mục | Vì sao bỏ |
|---|---|
| ~~Khám phá theo chủ đề~~ | **Chính là cái wall đang hiện** — nút tự trỏ vào mình |

Còn lại, cả 4 đều chạy thật, và thứ tự DOM cũng là thứ tự đọc trên mobile:

| Nút | Làm gì |
|---|---|
| **Tìm địa điểm** | → slider nhóm `all`, focus thẳng vào ô tìm kiếm |
| **Xem trên bản đồ 2D** ⭐ | `data-open-map="all"` → mở `#st-map` với toàn bộ 20 pin. Không cần JS mới: `popup2.js` bắt `[data-open-map]` ở cấp document từ D-51 |
| **Bắt đầu hành trình** | → slider nhóm `noibat` (5 điểm ai cũng ghé) |
| **Bỏ qua, vào VR ngay** | `close('button')` → `st:close` |

> ⚫ Nút bản đồ từng bị **gỡ khỏi wall ở D-57** với lý do "trùng vai với nút trong
> slider". **Đảo lại ở D-61** theo yêu cầu của khách, và lý do cũ hoá ra là sai: nút
> trong slider mở *khu vực đang xem*, nút ở wall mở *toàn bộ* — và bản đồ chính là thứ
> trả lời câu hỏi của màn tổng quan (*"khu vực nào ở đâu"*). Bắt người dùng chọn đại
> một khu vực để xem được bản đồ là bắt họ đi vòng.
>
> Lo ngại "chiếm mất một ô của thanh 2 hàng trên mobile" thì có thật, và cách gỡ là
> **nút vuông chỉ có icon đứng cạnh ô tìm** — đúng chỗ bản 1 từng đặt nó (D-54).

---

## 9.3 Trạng thái 2 — Infinite Slider

| Selector | Vai trò |
|---|---|
| `.st-sld-top` | Nút "Tất cả khu vực" + ô tìm kiếm |
| `.st-sld-track` `.st-sld-panel` | Sân khấu + các **thẻ** |
| `.st-sld-img` | Ảnh — 60% bề ngang thẻ ở màn ngang, 100% ở màn dọc |
| `.st-sld-info` | Chip nhóm · tên · mô tả · nút **"Khám phá VR 360°"** |
| `.st-sld-nav` | 2 nút ‹ › — **ngoài thẻ**, đứng trong lề `--sld-x` (D-60) |
| `.st-sld-chips` | 11 chip lọc nhóm, cuộn ngang — lăn/kéo bằng chuột do JS lo, fade mép theo trạng thái cuộn (D-62) |
| `.st-sld-map` ⭐ | *"Xem khu vực này trên bản đồ"* — mở `#st-map` **chỉ với pin của nhóm đang xem** (D-51) |
| `.st-sld-counter` | `3 / 12` |
| `.st-sld-live` | `aria-live` — đọc "Tên — 3/12" |
| ~~`.st-sld-bg`~~ | ⚫ **ĐÃ GỠ (D-61)** — ảnh đang xem blur + tối phủ kín viewport. Chính là "nền đen lệch tông" khách nói |
| ~~`.st-sld-shade`~~ | ⚫ **ĐÃ GỠ (D-61)** — gradient tách chữ khỏi ảnh. Không còn chữ nào nằm trên ảnh |

### ⚫ Gỡ mâu thuẫn của note.md §85 — cách cũ, đã bỏ ở D-61

> *"Phía sau là ảnh hoặc video toàn màn hình. Hai bên hé lộ một phần cảnh tiếp theo và
> cảnh trước đó."*

Hai câu nghe ngược nhau. Cách gỡ **cũ**: nền là ảnh hiện tại phủ kín viewport (blur +
tối) → thoả vế 1; các cảnh nằm trên nó dạng cổng rộng `84vw`, hé `8vw` mỗi bên → thoả
vế 2.

Cách gỡ đó **đã bị khách bác ở YC-17 + YC-18**: nền tối làm màn này lệch tông với wall
và bản đồ, còn chữ + nút nằm trên ảnh thì chìm vào mái ngói đỏ/vàng của Suối Tiên. Từ
D-61, **vế "ảnh toàn màn hình" của note.md §85 không còn hiệu lực** — mỗi cảnh là một
THẺ trên nền trắng. Vế "hai bên hé lộ" thì giữ nguyên và vẫn do đúng cơ chế cũ lo:

```
--sld-w: 84vw;   /* bề ngang một thẻ */
--sld-x: 8vw;    /* lề trái → 8vw hé mỗi bên, và là chỗ đứng của ‹ › */
transform: translate(calc(var(--o) * var(--sld-w)), -50%) scale(calc(1 - var(--oa) * .06));
opacity:   calc(1 - var(--oa) * .55);
```

Cơ chế `--o` (bậc so với cảnh giữa, có dấu) / `--oa` (trị tuyệt đối) — JS chỉ ghi hai
số, CSS lo toàn bộ hình học. Chính cơ chế này `carousel.js` của bản 1 cũng dùng.

> **Khác một chỗ quan trọng:** `offset()` của slider **không vòng khi `n < 3`**. Nhóm
> `wild` chỉ có 1 điểm, `water` có 2 — vòng thì panel "trước" và "sau" trỏ vào cùng một
> cái và cảnh nhân đôi trên màn.

### Bố cục một thẻ (D-61)

Chia theo **HƯỚNG MÀN**, không theo bề ngang — iPad dọc 768×1024 rộng hơn iPhone ngang
844×390 nhưng cần đúng bố cục của iPhone dọc. Một mốc `max-width` không nói được điều đó.

```
MÀN NGANG (mặc định, css/slider.css)      MÀN DỌC (@media orientation: portrait)
┌──────────────┬───────────────┐          ┌───────────────────────┐
│              │ VĂN HOÁ       │          │         ẢNH           │
│     ẢNH      │ Cổng Thiên …  │          │        (3:2)          │
│    60% · 3:2 │ mô tả 2 dòng  │          ├───────────────────────┤
│              │ [Khám phá VR] │          │ VĂN HOÁ               │
└──────────────┴───────────────┘          │ Cổng Thiên Tiên Môn   │
   ‹ và › đứng trong lề --sld-x           │ [ Khám phá VR 360° ]  │
   (KHÔNG đè lên thẻ)                     └───────────────────────┘
```

**Chiều cao thẻ do ẢNH quyết**, không phải một hằng số: `width: 60%` + `aspect-ratio:
3/2` nên ảnh không bị cắt thêm lần nào, khối chữ `stretch` cao theo nó. Đo thật:
1440×900 → thẻ 1210×464 (ảnh 696×464) · 1920×1080 → 1613×645 (ảnh 968×645) ·
844×390 → 675×216 (ảnh 324×216).

Ở màn dọc, chiều cao ảnh lại suy từ **chiều cao màn** chứ không từ `aspect-ratio` — lý
do ở §9.5.

### Bấm cảnh rìa = đưa vào giữa, KHÔNG đi VR

Ngược với bản 1 (bấm thẻ nào đi thẳng thẻ đó). **Cố ý:** mỗi thẻ có mô tả riêng —
người dùng cần đọc trước khi quyết. Nút **"Khám phá VR 360°"** mới là hành động đi.

### Thao tác (note.md §87)

| Cách | Ghi chú |
|---|---|
| Quẹt / kéo | Ngưỡng **56px** — cảnh chiếm gần trọn màn nên phải quẹt dứt khoát hơn một cái thẻ nhỏ. `.st-sld-track` đặt `touch-action: pan-y` để không đụng cử chỉ "lùi trang" của iOS (D-58k) |
| Con lăn chuột | Ngưỡng 12 + khoá **420 ms** — trackpad bắn hàng chục event mỗi lần vuốt, không khoá thì lướt một cái nhảy 8 cảnh |
| Nút ‹ › | |
| `←` `→` `Home` `End` | |
| Tự chuyển | **6000 ms** desktop · **2500 ms** điện thoại (D-60). Dừng khi hover/focus bàn phím/đang kéo/tab ẩn, tắt khi `prefers-reduced-motion` |

> **Nhịp đi theo khổ màn** (`autoMs()` đọc `matchMedia`), và cài bằng **chuỗi
> `setTimeout` chứ không `setInterval`**: `setInterval` chốt cứng nhịp lúc gọi, xoay
> ngang cái máy là nhịp sai cho tới lần `restart()` kế tiếp.
>
> **Dừng khi người dùng đang xem — hai bẫy chỉ lộ trên cảm ứng** (D-60): Chrome Android
> bắn `mouseenter` giả sau mỗi lần chạm và không có `mouseleave` nào cho tới khi chạm
> chỗ khác; chạm vào thẻ cũng làm nút bên trong nhận focus. Cả hai làm `paused` kẹt
> `true` → slideshow chết sau cú chạm đầu tiên. Nên: hover chỉ tính khi
> `matchMedia('(hover: hover)')`, focus chỉ tính khi `:focus-visible` (bàn phím — đúng
> đối tượng WCAG 2.2.2 nói tới).

> Không dùng `setPointerCapture` — Chrome bắn `click` vào phần tử capture chứ không vào
> panel dưới ngón tay. Bẫy đã vấp ở `carousel.js`.

### Lọc và tìm kiếm (note.md §97–107)

- **11 chip nhóm** — bấm là đổi `D.GROUPS[].keys`
- **Ô tìm kiếm bỏ dấu** — gõ `lau dai` ra cả *Lâu Đài Tuyết* và *Lâu Đài Pháp Thuật*
  (`D.deaccent`, khớp cả `name` lẫn `nameEn`)
- Quay về wall thì **xoá ô tìm kiếm** — mở lại mà còn dính query cũ, người dùng tưởng
  nhóm đó chỉ có 1 điểm

### Dải chip cuộn ngang — `overflow-x: auto` là CHƯA ĐỦ (D-62)

11 chip không vừa một dòng ở bất kỳ khổ nào, nên `.st-sld-chips` là một vùng cuộn ngang.
Nhưng `overflow-x: auto` chỉ mở đường cho **ngón tay** và **trackpad vuốt ngang**. Con
chuột thì không có đường nào — đo trên Chromium:

| Thao tác | `scrollLeft` trước D-62 | sau |
|---|---|---|
| Lăn **dọc** (chuột thường) | `0` — không nhúc nhích | **220** |
| Lăn **ngang** (trackpad / shift) | `200` | `200` |
| Bấm giữ + **kéo** | không đổi | **200** |
| Gán bằng script | chạy | chạy |

Vùng cuộn không hỏng; **hai đường vào của con chuột mới là thứ không tồn tại**. Chrome
không tự đổi `deltaY` thành cuộn ngang cho container chỉ tràn ngang, và không trình
duyệt nào có cử chỉ kéo-thả bằng chuột. `js/slider.js` viết tay cả hai:

| Cơ chế | Chi tiết |
|---|---|
| `wheel` | Lấy trục lớn hơn giữa `deltaX`/`deltaY` → `scrollLeft`. **Chỉ `preventDefault()` khi dải chip thật sự nuốt được cú lăn** — kịch biên thì thả ra cho trang cuộn tiếp. Chặn ở đây là bắt buộc: popup nằm trong `<iframe>` phủ kín trang cha, không chặn thì cú lăn nổi lên và **trang cha cuộn phía sau popup** |
| Kéo bằng chuột | Bỏ qua `pointerType === 'touch'` — cảm ứng đã có cuộn native **có quán tính**, giành lại chỉ làm tệ đi. Kéo quá **4px** thì cú `click` lúc thả tay bị nuốt, nếu không kéo dải chip một cái là **đổi luôn nhóm đang xem** |
| `centerChip()` | Chip đang chọn tự kéo vào giữa. Vào slider từ ô wall thứ 9/11 thì chip của nhóm đó nằm ngoài màn — dải chip hiện ra **không có cái nào được chọn** |
| `updFade()` | Fade ở mép nào **CÒN** nội dung bị cắt (2 class `st-fade-l` / `st-fade-r`) |

> ⚠️ `centerChip()` đo bằng `getBoundingClientRect`, **không** `offsetLeft`:
> `.st-sld-bot` có `position: relative` nên chính nó là `offsetParent` của chip, và số
> đo sẽ lệch đúng bằng padding của thanh dưới.

> **Fade cứng ở mép phải sai hai lần** (bản trước): cuộn tới cuối rồi mà chip cuối vẫn
> mờ, còn chip đầu bị cắt ở mép trái thì không có dấu hiệu gì. Mờ ở phía **còn nữa** là
> lời mời cuộn tiếp; mờ ở phía đã hết chỉ là một vệt lỗi.

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

**Hai trục độc lập từ D-61:** `orientation` quyết **hướng xếp thẻ** của slider,
`max-width` quyết **các con số** (cỡ chữ, padding, cỡ nút). Gộp hai trục làm một là
đúng cái sai mà D-61 gỡ: iPad dọc 768 rộng hơn iPhone ngang 844.

| Breakpoint | Wall | Slider | Bản đồ |
|---|---|---|---|
| ≥1600 | Grid `max-width: 1560px` | — | — |
| **Mặc định** (`slider.css`) | Mosaic 5×3 | **THẺ NGANG** nền trắng: ảnh trái `60%` `3:2` · chữ phải · `--sld-w: 84vw` · ‹ › 52px trong lề | — |
| **`orientation: portrait`** | — | **THẺ DỌC**: ảnh `100%` `3:2` trên · chữ dưới | — |
| **≤1023** | Trang cuộn · 2 cột · hero `16/8.6` · ô khác `4/3` · thanh dính đáy | `--sld-x` lên `8vw` + ‹ › còn 44px — để nút đứng TRỌN ngoài thẻ | — |
| **≤599 (dọc)** | hero `16/10` · ô khác `1/1` · **header căn TRÁI** · thanh 2 hàng, nút bản đồ thành **icon vuông** cạnh ô tìm | `--sld-w: 78vw` · ảnh `clamp(170px,32vh,300px)` (suy từ chiều CAO màn) · blurb kẹp 2 dòng · CTA tràn ngang · ‹ › 38px · back thành nút tròn · thanh dưới **2 hàng** | **bottom sheet** dính đáy, bo 2 góc trên |
| **≤379** | Hàng 1 giữ 2 cột (tìm + bản đồ), 2 nút còn lại trải ngang | Tên 19px · ‹ › còn 32px · CTA bỏ mũi tên đuôi | — |
| Landscape ≤460 cao | **3 cột** · hero `16/5` · ẩn eyebrow + subtitle | Thẻ ngang bản bỏ túi: `--sld-w: 80vw` · tên 20px · blurb kẹp 2 dòng · ‹ › 36px | — |
| `hover: none` | Tắt "làm tối ô khác" · thêm `:active` cho mọi thứ | — (thẻ rìa lùi bằng `opacity`, không cần hover để gỡ) | `:active` cho pin |

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

**Thanh dưới slider từ 3 hàng xuống 2.** Chip / bản đồ / đếm xếp dọc ăn ~120px:

```
[ chip · chip · chip …        ]   ← grid-column: 1 / -1, cuộn ngang
[ Xem trên bản đồ  ][   3/12  ]
```

### Slider trên điện thoại — THẺ, không phải cổng (D-60 · 2026-08-05)

⚫ Bản trước bóp nguyên bố cục desktop xuống: cổng `92vw` cao trọn sân khấu, chữ trắng
đè lên ảnh, ‹ › đẩy lên `top: 30%` để né khối chữ, `object-position: center 38%` để cứu
lấy phần mái. Ba mẹo đó cùng chống một cái sai gốc: **ảnh chiếm chỗ của mọi thứ khác**.
Khách gọi tên đúng triệu chứng — *"nút đang bị ảnh nằm đè lên nhìn không rõ"*.

Giờ mỗi cảnh là một **thẻ**: ảnh ở trên, chữ và nút ở dưới trên nền trắng. Không còn thứ
gì đè lên thứ gì, nên cũng không còn mẹo nào để cân bằng.

> **Một lượt sau (D-61) chính desktop cũng đi theo mô hình này** và bảng màu sáng + cấu
> trúc thẻ chuyển thành MẶC ĐỊNH ở `css/slider.css`. Mục này giữ lại vì nó ghi *vì sao*
> từng con số của khổ điện thoại là con số đó — phần "nền trắng kéo theo cả bảng màu"
> bên dưới giờ áp dụng cho mọi khổ, không riêng điện thoại.

```
┌─ .st-sld-panel ────────────┐      thẻ 78vw, CĂN GIỮA sân khấu,
│         .st-sld-img        │      cao theo nội dung (max-height: 100%)
│   clamp(170px,32vh,300px)  │
├────────────────────────────┤  ‹  ›  ← ngoài mép thẻ, trong lề 11vw
│ VĂN HOÁ                    │
│ Cổng Thiên Tiên Môn        │
│ mô tả 2 dòng               │
│ [ Khám phá VR 360°    → ]  │
└────────────────────────────┘
```

| Con số | Vì sao |
|---|---|
| `--sld-w: 78vw` (từ `92vw`) | **Không phải để "cho nhỏ lại"** mà là điều kiện của việc gỡ nút ra khỏi ảnh: lề `11vw ≈ 43px` ở khổ 390 vừa đủ đặt trọn nút ‹ › 38px **bên ngoài** thẻ |
| Ảnh `clamp(170px, 32vh, 300px)` | Suy từ **chiều cao màn**, không từ `aspect-ratio`. Bản đầu để `3/2` — đo ra thẻ 397px giữa sân khấu 676px (iPhone 14): **140px trắng trên và dưới**, và máy càng cao chỗ trống càng nhiều. `clamp` đưa thẻ lên 465px. Cắt sâu hơn 3:2 là chấp nhận được — ô wall mobile còn đang là `1/1` |
| `top: 50%` + `translate(x, -50%)` | Gộp bước căn giữa vào đúng cái transform mà `--o` đang lái. Tách ra `top: calc(50% - …)` thì phải biết trước chiều cao thẻ |
| Cảnh rìa `opacity: .5` | `brightness()` trên thẻ **trắng** ra một mảng xám bẩn, không phải "lùi ra sau" — cùng bài học với D-54 và D-55 |
| Transition `620 → 460ms` | 620ms ăn 1/4 quãng nghỉ 2,5s; cảnh chưa kịp đứng yên đã đi tiếp |
| `≤379`: ‹ › còn 32px | Lề `11vw` ở khổ 320 chỉ còn 35px |
| `≤379`: CTA bỏ mũi tên đuôi | "Khám phá VR 360°" + 2 icon trong 218px vỡ **hai dòng**, nút cao 54px. Icon VR ở đầu đã nói đủ "đi đâu" |

**Nền trắng kéo theo cả bảng màu.** `.st-sld-bg` tắt đi mới là một dòng; phần việc thật
là mọi control quanh nó đang mang dáng "trắng mờ trên nền tối" — nút quay lại, ô tìm,
chip, nút bản đồ, bộ đếm, và cả `#st-pop2.st-state-slider .st-p2-close` (`wall.css` cố ý
đảo nút × sang kính mờ khi vào slider). Để nguyên thì chúng **tàng hình**.

**Điện thoại NẰM NGANG cũng là điện thoại.** 844×390 không lọt `≤599px`; để nguyên thì
xoay máy một cái là thấy hai thiết kế khác nhau. Nhưng thẻ DỌC ở đó cũng không sống
được (ảnh rộng 675px sẽ cao 450px trên màn cao 390px) → thẻ NGANG. Chính chỗ này đẻ ra
cách chia của D-61: **hướng xếp theo `orientation`, con số theo `max-width`**. Bản ngang
nhờ đó **lấy lại được dòng mô tả** mà bố cục cũ phải `display: none`.

> ⚫ D-60 giải bài này bằng một `@media` list dùng chung bảng màu cho hai khổ điện
> thoại, kèm một luật `filter: brightness(.65)` phải thu phạm vi về `min-width: 600px`
> cho khỏi đè ngược. **D-61 xoá cả cụm đó**: bảng màu sáng thành mặc định thì không còn
> hai bảng màu để đồng bộ, và không còn `brightness` nào để thu phạm vi.

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

### Dải chip cuộn ngang (D-62) — 3 khổ, **0 lỗi console**

1440×900 · 844×390 · 390×844 (cảm ứng). Mỗi khổ 6 kiểm:

| Kiểm | Kết quả |
|---|---|
| Lăn **dọc** trên dải chip | `scrollLeft` 0 → **220** |
| Lăn **ngang** | 180 |
| Bấm giữ + kéo | 200 |
| **Kéo xong nhóm KHÔNG được đổi** | vẫn `all` — nếu không, kéo một cái là mất nhóm đang xem |
| Bấm một chip vẫn đổi nhóm | ✓ (ngưỡng 4px không nuốt nhầm cú bấm thật) |
| Chip đang chọn nằm trong khung nhìn | ✓ kể cả chip **cuối** (`scrollLeft` chạy tới 583 / 1163 / 1298) |

### Nền sáng cho mọi khổ + nút bản đồ ở wall (D-61) — 7 khổ, **0 lỗi console**

320×568 · 390×844 · 768×1024 · 844×390 · 1280×720 · 1440×900 · 1920×1080.

| Bất biến | Ghi chú |
|---|---|
| `.st-sld-bg` · `.st-sld-shade` không còn trong DOM | không chỉ `display: none` — gỡ khỏi HTML/JS |
| Thẻ trắng · nút × dáng sáng | trên **mọi** khổ, kể cả desktop |
| CTA không giao với ảnh · ‹ › không giao với thẻ | ở cả thẻ ngang lẫn thẻ dọc |
| Thẻ nằm trọn sân khấu · CTA không bị cắt | |
| Nút bản đồ không đè dải chip / bộ đếm | chính là chỗ khách thấy "nút bị mất" |
| **Nút bản đồ ở wall nằm trong màn và bấm mở được `#st-map` có pin** | 7/7 khổ |

> Bẫy của phép ĐO chứ không phải của code: đo lúc `t = 500ms` thì thanh công cụ wall còn
> ở `translateY(22px)` của animation vào màn (delay 860ms), nên nút bản đồ báo "tràn đáy
> màn" 2px ở 5/7 khổ. Bất biến hình học phải đo **sau khi animation xong**.

### Slider trên điện thoại (D-60) — 7 khổ, **0 lỗi console**

320×568 · 375×812 · 390×844 · 412×915 · 844×390 ngang · 768×1024 · 1440×900.

| Bất biến | Ghi chú |
|---|---|
| Thẻ nằm trọn trong sân khấu | không tràn lên thanh trên / thanh dưới |
| **CTA không giao với ảnh** | chính là lỗi khách báo |
| **‹ › không giao với thẻ đang xem** | ở khổ 320 lần đầu còn thò 6px → thu nút về 32px |
| `.st-sld-bg` tắt · nền thẻ đúng `#fff` | trên mọi khổ điện thoại |
| Nhịp tự chạy | đo được **2466 / 2495 ms** ở điện thoại, **6000 ms** ở desktop |
| Chạm rồi vẫn tự chạy tiếp | bẫy `mouseenter` / `focusin` giả — xem D-60 |

Một lỗi chỉ ảnh chụp mới bắt được, số đo thì không: ở 320px chữ trong CTA vỡ **hai
dòng** ("Khám phá VR / 360°") và nút cao 54px. Bất biến "nút không vỡ nhiều dòng" của
D-58 chỉ chạy trên thanh công cụ của wall, không chạy trên CTA của slider.

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
