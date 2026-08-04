> Cập nhật: 2026-08-04 (v10 — §4.4 dựng lại nhịp vào màn · D-55)

# 04 — Popup

Bản trước file này tả **9 modal/overlay** dùng chung một engine (`overlays.js`) và một
ma trận va chạm "mở cái này thì đóng cái kia". Từ D-46 project chỉ còn **đúng một
popup** — engine, ma trận va chạm và stack Esc nhiều tầng đều không còn lý do tồn tại.

Lịch sử của M2–M7 giữ ở [`08-decisions.md`](08-decisions.md) D-09v2 / D-43 / D-46.

> ⚠️ **File này tả BẢN 1** (`index.html`). Bản 2 (`index2.html`) có **hai** trạng thái
> — VR Wall và Infinite Slider — spec riêng ở [`09-variant2.md`](09-variant2.md) §9.4.

---

## 4.1 Nhận diện

| Thuộc tính | Giá trị |
|---|---|
| ID | `#st-popup` · khung nội dung `.st-popup-inner` |
| File | `css/popup.css` · `js/popup.js` |
| Trigger | **Trang cha nhúng iframe** — popup không tự quyết khi nào hiện ([`07-integration.md`](07-integration.md) §7.9) |
| Đóng bằng | nút `×` · nút "Để tôi tự khám phá" · `Esc` (khi focus trong iframe) · **bấm 1 điểm trong danh sách** hoặc trên bản đồ |
| Bố cục | **CHIẾM TRỌN MÀN** (D-48) — không hộp modal canh giữa, không lớp nền mờ |
| z-index | `--st-z-popup: 10` — thấp là đúng, xem [`01-architecture.md`](01-architecture.md) §1.5 |
| Nền | `--st-bg: #fff` **phẳng** — bỏ 2 vệt radial ở D-54 (chúng đọc ra thành mảng ám xanh dưới dải brand) |
| Chi tiết brand | Dải `4px` trên đỉnh màn: `linear-gradient(90deg, #128125, #DEA800, #EB0029)` |

### Cấu trúc

```
#st-popup                       ← fixed inset:0, flex column, role="dialog"
├── .st-brandline               ← dải 3 màu 4px, hết bề ngang màn
├── .st-popup-close             ← nút ×, neo theo mép MÀN HÌNH
└── .st-popup-inner             ← khung đo + đích của focus trap
    ├── .st-popup-head          ← eyebrow · h1 · subtitle · .st-search-row   (flex: none)
    │   └── .st-search-row      ← ô tìm kiếm + nút "Xem trên bản đồ 2D" (D-54)
    ├── #st-popup-deck.st-cr    ← A: 3D carousel KHU VỰC (03-components.md §3.2) (flex: 1 1 auto)
    ├── #st-list                ← B: danh sách điểm      (03-components.md §3.4)
    └── .st-popup-foot          ← legend · skip           (flex: none, padding-top)

#st-map                         ← M: bản đồ 2D, NGOÀI #st-popup (03-components.md §3.5)
```

A và B chiếm **cùng một chỗ** trong flex column — chỉ một cái hiện tại một thời điểm
(`#st-popup.st-state-list #st-popup-deck { display: none }`), nên không cần
`position: absolute`.

### Căn dọc: DECK ăn hết chỗ thừa (D-54) — ⚫ trước là CẶP auto-margin

Head và foot `flex: none`, `#st-popup-deck` `flex: 1 1 auto` + `min-height: 0`. Không
còn gì phải "căn giữa" vì carousel đã chiếm hết phần trống, và thẻ cao đúng bằng sân
khấu (`03-components.md` §3.2).

> ⚫ **Bản trước** đặt `margin-top: auto` ở **cả** head **và** foot để chia đôi khoảng
> trống thừa. Cặp đó chỉ sống được khi `#st-popup-deck` là `flex: 0 1 auto` — tức là
> **deck bị cấm lớn**, đúng thứ tạo ra "khoảng trống" khách phàn nàn. D-54 đảo lại.

> **Bẫy vẫn còn hiệu lực:** khoảng hở giữa carousel và footer phải là **`padding-top`**,
> không phải `margin-top`. Trước đây vì `margin-top` phá cặp auto-margin (media query
> mobile từng ghi đè thành `16px` → header bị đẩy `margin-top: 222px` trên máy 844px);
> giờ vì `min-height: 0` của deck sẽ nuốt margin khi màn hẹp.

---

## 4.2 Ba trạng thái + vòng đời

Từ D-51/D-52 bản 1 có **ba trạng thái**:

| | Class trên `#st-popup` | Nội dung |
|---|---|---|
| A `deck` | *(không có)* | 3D carousel 9 **khu vực** |
| B `list` | `.st-state-list` | Danh sách điểm của khu vực, hoặc kết quả tìm kiếm |
| M | — | Bản đồ 2D (`#st-map`) phủ **LÊN** cả hai |

> **M không phải trạng thái thứ ba.** Nó là một lớp riêng nằm ngoài `#st-popup`; đóng
> bản đồ là quay lại đúng chỗ đang đứng, không reset gì. Vì vậy `state` trong
> `popup.js` chỉ có 2 giá trị.

**Esc đi ngược từng tầng một:** bản đồ → danh sách → đóng. Nhảy thẳng ra làm người
dùng mất hết ngữ cảnh chỉ bằng một phím.

### Vòng đời — 3 class hiển thị

Không còn engine dùng chung; `js/popup.js` lái trực tiếp bằng class.

| Class | Ai gắn | Ý nghĩa |
|---|---|---|
| *(không có)* | mặc định | `opacity: 0` — nhìn xuyên iframe thấy panorama |
| `.st-open` | `boot()` và `open()` | Hiện dần trong 400 ms, nội dung vào so le, carousel tự chạy |
| `.st-closing` | `close()` | Mờ dần 240 ms + `.st-popup-inner` lùi `scale(.98)`, rồi báo `st:close` |

```
boot()                          open()  ← trang cha gửi st:open
  ├─ i18n.init(?lang)             ├─ closing = false
  ├─ carousel.create()            ├─ bỏ .st-closing, gỡ .st-going còn sót
  ├─ i18n.apply() + labelAll()    ├─ carousel.go(0)
  ├─ rAF → .st-open               └─ rAF → .st-open  ← xem ghi chú dưới
  │        carousel.start()
  │        focus #st-popup-title
  │        a11y.trap + a11y.onEsc
  └─ bridge.ready({w,h})

close(reason)
  ├─ bỏ .st-open, thêm .st-closing
  ├─ release trap + Esc, carousel.stop()
  └─ sau 300ms → bridge.close(reason)   ← chờ animation xong mới báo cha
```

> **Vì sao `open()` phải bỏ `.st-open` một frame rồi gắn lại:** CSS animation chỉ khởi
> động khi class được **thêm**. Giữ nguyên class thì `st-fade-up` của eyebrow/title/sub
> không chạy lại, popup mở lại lần 2 sẽ hiện ra cứng đơ không có hiệu ứng vào màn.

> **Vì sao `close()` chờ 300 ms mới gửi `st:close`:** trang cha gỡ iframe ngay khi
> nhận message. Báo sớm thì popup biến mất cụp một cái, không thấy animation đóng.

---

## 4.3 Đóng bằng cách chọn 1 thẻ (Q10 = a)

```
click .st-cr-card[data-i="2"]
  ├─ guard: đang closing thì bỏ qua (chống double-click)
  ├─ thẻ: .st-going → scale(1.14) + opacity 0, 300ms
  ├─ carousel.stop()
  ├─ ST.track('popup_go', { key, dwellMs })
  ├─ ST.bridge.navigate(dest)      → gọi VRCore nếu cùng origin + postMessage
  └─ close('navigate')             → 300ms sau: postMessage st:close
```

Bấm **thẻ nào đi thẳng thẻ đó**, kể cả thẻ bên rìa — đúng yêu cầu *"click vào ảnh thì
nhảy đến trang hình tương ứng"*, không bắt phải đưa thẻ vào giữa trước.

`.st-going` được **gỡ khi popup mở lại** (`open()`); nếu không, lần sau sẽ thấy một
khoảng trống ngay giữa carousel.

---

## 4.4 Animation

| Phase | Chi tiết |
|---|---|
| Cả màn vào | `opacity 0→1`, `--st-dur-slow` (400ms), `--st-ease-out` |
| Dải 3 màu | `scaleX(0) → 1` từ mép **trái**, `620ms` — nhịp mở đầu, chạy trước mọi thứ |
| Nội dung | eyebrow `100` → title `170` → sub `240` → hàng tìm `310ms`, mỗi bước `22px + scale(.97)` |
| Sân khấu | `.st-cr-stage` bay lên `38px` + `scale(.9)`, `820ms`, trễ `120ms` |
| Thẻ carousel | chỉ `opacity`, `620ms`, so le **từ giữa ra**: `240ms + --st-oa × 130ms` |
| Ảnh thẻ | Ken Burns `scale(1.16) → 1`, `1200ms`, trễ `180ms` |
| Nút ‹ › · chấm · footer | `660` / `720` / `780ms` |
| Chuyển bậc carousel | `transform` + `opacity` `720ms` **`--st-ease-flow`** + delay `--st-oa × 34ms` |
| Cả màn ra | `opacity 1→0`, nội dung lùi `scale(.98)`, `--st-dur-base` (240ms) |

Nhịp này dựng lại ở D-55 — bản trước chỉ có fade nên popup mở ra trông như trang đã
đứng đó từ trước. Dàn nhịp đầy đủ của **cả hai bản** ở
[`02-design-system.md`](02-design-system.md) §2.6.

> ⚠️ Mọi animation vào màn dùng `animation-fill-mode: **backwards**`, không phải `both`.
> `forwards` giữ quyền điều khiển thuộc tính sau khi animation kết thúc, và `.st-cr-img`
> còn phải nhận `transform` parallax khi hover — nó sẽ chết cứng ở giá trị cuối.

`#st-popup-deck` **không** có animation nào: `.st-cr-stage` bên trong đã tự bay lên,
chồng thêm một lớp fade ở đây chỉ làm cả cụm mờ đi đúng lúc nó cần rõ nhất.

Bản trước panel **morph co về một nút trong dock** (Q12 / D-29). Bỏ vì (a) không còn
dock nào để co về, và (b) nút mở lại — nếu trang cha có — nằm ở document khác, popup
không đo được `getBoundingClientRect()` của nó qua ranh giới iframe. Kỹ thuật FLIP đó
còn ghi lại ở D-29.

**Lúc MỞ chỉ animate `opacity`, không animate `transform`.** `#st-popup` và
`.st-popup-inner` đều là tổ tiên của `.st-cr-stage` (phần tử mang `perspective`) —
một `transform` ở đó tạo containing block mới và làm phẳng toàn bộ chiều sâu 3D của
thẻ trong suốt animation. Thẻ sẽ bay vào màn dẹt lét rồi mới bật thành 3D.

`scale(.98)` chỉ dùng lúc **ĐÓNG** (`.st-closing .st-popup-inner`) — lúc đó cả màn
đang mờ đi, mất chiều sâu 3D vài frame cuối không ai thấy.

---

## 4.5 ARIA

```html
<div id="st-popup" role="dialog" aria-modal="true"
     aria-labelledby="st-popup-title" aria-describedby="st-popup-sub">
  <span class="st-brandline" aria-hidden="true"></span>
  <button class="st-popup-close" data-st-close data-i18n-aria="close">…</button>
  <div class="st-popup-inner">
    <h1 id="st-popup-title" tabindex="-1">…</h1>
    <p  id="st-popup-sub" data-i18n="popup.subtitle">…</p>

    <div id="st-popup-deck" class="st-cr">
      <div class="st-cr-viewport">
        <div class="st-cr-stage" role="group" aria-roledescription="carousel"
             data-i18n-aria="popup.deckLabel">
          <button class="st-cr-card" aria-current="true" aria-label="…">…</button>
        </div>
        <button class="st-cr-nav st-cr-prev" data-cr-nav="prev" data-i18n-aria="popup.prev">…
      </div>
      <div class="st-cr-dots">…</div>
      <p class="st-cr-live st-sr-only" aria-live="polite"></p>
    </div>
  </div>
</div>
```

- Focus đầu: `#st-popup-title` (`tabindex="-1"`) → screen reader đọc tiêu đề trước.
- **Focus trap đặt trên `#st-popup`, không phải `.st-popup-inner`** — nút × nằm ngoài
  `.st-popup-inner` (nó neo theo mép màn hình), bẫy trên inner sẽ bỏ sót nó khỏi
  vòng Tab.
- `role="dialog" aria-modal="true"` giữ nguyên dù popup chiếm trọn màn: xét hành vi
  nó vẫn là modal — chặn thao tác với trang cha, đóng thì trả lại.
- Thẻ là `<button>` **trần, không `role="option"`**: `listbox` ngụ ý "chọn xong rồi xác
  nhận", còn ở đây bấm là đi luôn. Vai trò carousel khai bằng `aria-roledescription`
  trên `.st-cr-stage`.
- **Roving tabindex:** chỉ thẻ giữa có `tabindex="0"` — nếu không, Tab phải bấm 12 lần
  mới thoát khỏi carousel.
- `aria-label` từng thẻ **nói rõ hành động** ("Bấm để đến đây") vì click = nhảy ngay.
  Gán tường minh vì ruột thẻ toàn `<span>`, để tự đọc sẽ ra một chuỗi dính liền.
- `.st-cr-live` (`aria-live="polite"`) đọc "Tên — 3/12" mỗi lần đổi thẻ.
- Ảnh `alt=""` (trang trí) vì tên đã nằm trong `aria-label` của nút.
- **WCAG 2.2.2:** carousel tự chạy → dừng khi hover/focus, tắt hẳn khi
  `prefers-reduced-motion: reduce`.

### ⚠️ Hai giới hạn của iframe không sửa được từ trong này

| Vấn đề | Trang cha phải làm |
|---|---|
| `aria-modal="true"` **không** che nội dung trang cha khỏi screen reader — nó chỉ có tác dụng trong cùng một cây accessibility | `aria-hidden="true"` / `inert` lên nội dung trang cha khi popup mở |
| `Esc` chỉ bắt được khi focus đang **ở trong** iframe | Tự nghe `keydown` ở document cha |

Chi tiết + code mẫu: [`07-integration.md`](07-integration.md) §7.3.

---

## 4.6 Query param (để demo cho khách)

| Param | Tác dụng |
|---|---|
| `?lang=vi\|en` | Ngôn ngữ. Trang cha truyền vào lúc nhúng; đổi nóng bằng `postMessage st:lang` |
| `?title=a\|b\|c` | Đổi biến thể tiêu đề (Q6) |
| `?debug=1` | Hiện `#st-debug`: ngôn ngữ, thẻ đang chọn, có đang trong iframe không, có cùng origin không, + nút đổi tiêu đề / lùi-tiến thẻ / đổi VI-EN / mở lại |

`?welcome=0|1`, `?pano=`, `?nav=off`, `?full=1`, `?zones=1`, `?map=` của bản trước
**không còn** — chúng điều khiển những phần đã bị gỡ.
