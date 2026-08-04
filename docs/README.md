> Cập nhật: 2026-08-04 (v14 — D-57 chốt MỘT bản, gỡ bản 1 + host-demo; D-58 dựng lại
> bản mobile)

# Suối Tiên VR360 — Popup chọn điểm bắt đầu · Docs

Project này **LÀ CÁI POPUP**. `index.html` là một trang HTML độc lập, được nhúng vào
trang VR thật (`https://suoitien.trip360.vn/`) bằng một `<iframe>` phủ kín viewport.
Popup **chiếm trọn màn hình** — không phải hộp modal canh giữa, không có nền mờ (D-48).

```
VR WALL tổng quan  →  INFINITE SLIDER khám phá  →  VR 360 chi tiết
   9 khu vực            các điểm trong khu vực       bridge.navigate()
```

Spec đầy đủ: [`09-variant2.md`](09-variant2.md).

### ⚫ Từng có hai bản — khách đã chọn (D-57 · 2026-08-04)

Từ 2026-08-03 tới 08-04 có `index.html` (màn chào + 3D carousel) và `index2.html`
(VR Wall + Slider) chạy song song. **Khách chọn Wall + Slider.** Bản 1, 5 file riêng
của nó và `host-demo.html` đã gỡ hẳn; `index2.html` chép về thành `index.html`.

Vì vậy vài tên còn hậu tố **"2"** — `#st-pop2` · `js/popup2.js` ·
`css/responsive2.css` · `docs/09-variant2.md`. **Giữ nguyên là cố ý:** tên
`#st-popup` / `popup.js` / `responsive.css` vừa mới thuộc về bản 1 và
[`08-decisions.md`](08-decisions.md) nhắc tới chúng ở ~40 chỗ; tái sử dụng tên sẽ làm
40 mục lịch sử lặng lẽ nói sai. Xem D-57.

## Trạng thái project

| Hạng mục | Trạng thái |
|---|---|
| Docs | ✅ **v14** (2026-08-04) |
| Design tokens | ✅ 3 màu brand + hệ 2 font lấy thật từ `suoitien.vn/…/style.css` |
| **VR Wall 9 ô → Infinite Slider → VR**, có tìm/lọc | ✅ **xong** — D-50 |
| **Bản mobile** — trang cuộn, thanh dính đáy, bottom sheet | ✅ **xong** — D-58 ⭐ |
| **Bản đồ 2D + pin số hiệu** (lọc theo khu vực đang xem) | ✅ **xong** — D-51 |
| **Bridge popup ↔ trang cha** (`js/bridge.js`) | ✅ **xong** — D-46 |
| i18n VI/EN, ngôn ngữ do trang cha truyền vào | ✅ **xong** |
| A11y: focus trap · aria-live · reduced-motion · thứ tự Tab = thứ tự nhìn | ✅ **xong** |
| ~~Chọn bản 1 hay bản 2~~ | ✅ **khách chốt** — D-57 |
| `host-demo.html` — trang cha mô phỏng | 🔁 **đã gỡ**, dựng lại lúc bàn giao (D-57) |
| Ảnh banner độ phân giải cao từ khách | ⬜ chờ khách (Q-37) |
| Ảnh cho 8 điểm còn thiếu | ⬜ chờ khách (Q-38) |
| Duyệt cách chia 9 khu vực | ⬜ chờ khách (Q-41) |
| **Số hiệu + toạ độ pin trên bản đồ** — mới 2/20 số là thật | ⬜ chờ khách/dev (Q-43) |
| Ảnh bản đồ có dải tối lớn phía trên (máy dọc thấy rõ) | ⬜ cần cắt lại asset — `TODO.md` |
| `@font-face` local thay Google Fonts | ⬜ chưa làm |

**Đã test** (Playwright/Chromium, `0` lỗi console):

- **Luồng** — độc lập · trong iframe · bridge 2 chiều (`st:ready` / `st:navigate` /
  `st:close` / `st:lang` / `st:open`) · Esc hai tầng · wall↔slider · lọc chip · tìm
  kiếm bỏ dấu · ô tự đổi cảnh.
- **Hình học responsive** (D-58) — 7 khổ máy × 4 màn: 320 · 375 · 390 · 390-EN ·
  844 ngang · 820 tablet · 1440 desktop. Bất biến: ô không tràn ngang · ảnh không hụt
  mép ô · chữ header không chạm nút × · nút không vỡ chữ nhiều dòng · ‹ › không đè khối
  chữ · cụm zoom không đè thẻ bản đồ · không ô nào trùng ảnh ô kề. **Sạch cả 7 khổ.**

### ⭐ Phạm vi (2026-08-03 · YC-10 · D-46)

Khách chốt: **chỉ design cái popup**, nó sẽ thành page HTML nhúng iframe vào trang
khác. Toàn bộ phần "trang VR" mà project từng dựng — header, dock nút, thẻ vé, 2
overlay chỉ đường/danh sách, viewer mock — **đã gỡ hết**.
Danh sách file bị gỡ: [`01-architecture.md`](01-architecture.md) §1.1.
Khôi phục: `git show 9e5d46e:<đường-dẫn>` (bản 1: `git show 3be9e22:<đường-dẫn>`).

Ba điểm chốt của hợp đồng iframe:

| | Chốt |
|---|---|
| **Khung** | Iframe **phủ full viewport**; popup chiếm trọn màn, tự lo responsive |
| **Giao tiếp** | Thử `parent.VRCore` trực tiếp (cùng origin) → rơi về `postMessage` |
| **Ngôn ngữ** | Trang cha truyền vào (`?lang=` + `postMessage st:lang`); popup không có nút riêng |

## Đọc theo thứ tự nào

1. [`07-integration.md`](07-integration.md) — ⭐ **đọc trước nếu bạn là người ghép**:
   hợp đồng iframe, code trang cha, 4 thứ iframe không tự làm được
2. [`09-variant2.md`](09-variant2.md) — ⭐ **spec chính của `index.html`**: wall,
   slider, chuyển trạng thái, và §9.5 toàn bộ responsive
3. [`00-requirements.md`](00-requirements.md) — khách muốn gì, cái gì còn chờ chốt
4. [`08-decisions.md`](08-decisions.md) — **đọc nếu bạn thắc mắc "sao lại làm thế"**
5. [`01-architecture.md`](01-architecture.md) — file nào làm gì, sơ đồ phụ thuộc
6. [`02-design-system.md`](02-design-system.md) — token màu/font
7. [`05-flows.md`](05-flows.md) — luồng người dùng qua ranh giới iframe
8. [`06-data.md`](06-data.md) — schema dữ liệu + nguồn 12 ảnh

> [`03-components.md`](03-components.md) và [`04-modals.md`](04-modals.md) phần lớn tả
> **bản 1 đã gỡ**. Hai mục còn hiệu lực và vẫn phải đọc: §3.5 (bản đồ 2D) và §3.6
> (bẫy `max-width` với ảnh phủ — D-53). Phần đầu mỗi file có ghi rõ.

## Cách chạy

Không cần build, không cần npm.

```
double-click index.html      → chạy ngay, bridge thành no-op
python -m http.server 8080   → http://localhost:8080/index.html
```

Muốn thử **trong iframe đúng như khi ghép thật** thì chép đoạn `<script>` ở
[`07-integration.md`](07-integration.md) §7.2 vào một file HTML rỗng — đó chính là toàn
bộ code trang cha cần viết (~40 dòng). `host-demo.html` từng làm sẵn việc này và sẽ
được dựng lại lúc bàn giao (D-57).

> Sprite icon **inline trong `index.html`** đúng để `file://` chạy được (D-33).
> Font `Arima Madurai` lấy từ Google Fonts — mất mạng thì rơi về font hệ thống,
> layout không vỡ.

### Query params

| Param | Tác dụng |
|---|---|
| `?lang=vi\|en` | Ngôn ngữ (Q4). Trang cha truyền vào lúc nhúng |
| `?debug=1` | Panel debug: trạng thái (wall/slider) · ngôn ngữ · nhóm + điểm đang xem · **có đang trong iframe không** · nút về wall / đổi VI-EN |

> `?title=a|b|c` (3 biến thể tiêu đề · Q6) **đã hết tác dụng** — nó thuộc màn chào của
> bản 1. Tiêu đề wall giờ là một câu duy nhất, `COPY.*.wall.title`.

## Kiểm tra tự động

```
npm i -D playwright         # công cụ DEV, bản chạy vẫn không có npm (RULE #3)
node tools/check-image-cover.js     # ⭐ chạy sau MỖI lần sửa CSS ảnh (D-53)
node tools/check-icon-rendered.js
```

## Quy tắc bắt buộc khi sửa code

Đọc [`../CLAUDE.md`](../CLAUDE.md) — **RULE #1: sửa code là phải cập nhật docs trong
cùng lượt.** Docs lệch code = docs vô giá trị.
