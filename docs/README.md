> Cập nhật: 2026-08-04 (v13 — chuyển động + ảnh nguồn + danh sách thẻ ảnh · D-55/D-56)

# Suối Tiên VR360 — Popup chọn điểm bắt đầu · Docs

Project này **LÀ CÁI POPUP**. `index.html` là một trang HTML độc lập, được nhúng vào
trang VR thật (`https://suoitien.trip360.vn/`) bằng một `<iframe>` phủ kín viewport.
Popup **chiếm trọn màn hình** — không phải hộp modal canh giữa, không có nền mờ (D-48).

**Hiện có HAI BẢN song song để khách chọn** (D-50) — không phải hai phiên bản của một
thứ, mà là hai ý tưởng thiết kế khác nhau:

| | Bản 1 — `index.html` | Bản 2 — `index2.html` |
|---|---|---|
| Chọn khu vực | **3D carousel 5 thẻ** — xem tuần tự | **VR Wall** mosaic 9 ô — thấy hết cùng lúc |
| Xem điểm | **Danh sách** — quét nhanh, so sánh được | **Slider** — mỗi điểm một cảnh lớn |
| Nền | Trắng, light/airy | **Trắng y hệt** (D-54) — chỉ slider còn tối |
| Tìm kiếm bỏ dấu | ✅ ở header, cạnh nút bản đồ | ✅ trong slider |
| **Bản đồ 2D có pin** | ✅ | ✅ (dùng chung `js/map2d.js`) |
| Hợp với | Người biết mình tìm gì | Người muốn được dẫn dắt |
| Spec | [`03`](03-components.md) + [`04`](04-modals.md) | [`09-variant2.md`](09-variant2.md) |

Cả hai dùng chung `js/bridge.js` → trang cha đổi bản chỉ là đổi `src` của iframe.

## Trạng thái project

| Hạng mục | Trạng thái |
|---|---|
| Docs | ✅ **v9** (2026-08-03) |
| Design tokens | ✅ 3 màu brand + hệ 2 font lấy thật từ `suoitien.vn/…/style.css` |
| **BẢN 1** — carousel KHU VỰC → danh sách → VR, có tìm kiếm | ✅ **xong** — D-48/D-49/D-52 |
| **BẢN 2** — VR Wall 9 ô → Infinite Slider → VR, có tìm/lọc | ✅ **xong** — D-50 |
| **Bản đồ 2D + pin số hiệu** (dùng chung, lọc theo khu vực) | ✅ **xong** — D-51 ⭐ |
| **Bridge popup ↔ trang cha** (`js/bridge.js`) | ✅ **xong** — D-46 |
| `host-demo.html` — trang cha mô phỏng để test | ✅ **xong** (DEV ONLY) |
| i18n VI/EN, ngôn ngữ do trang cha truyền vào | ✅ **xong** |
| A11y: focus trap · roving tabindex · aria-live · reduced-motion | ✅ **xong** |
| Ảnh banner độ phân giải cao từ khách | ⬜ chờ khách (Q-37) |
| Ảnh cho 8 điểm còn thiếu | ⬜ chờ khách (Q-38) |
| Duyệt cách chia 9 khu vực | ⬜ chờ khách (Q-41) |
| **Số hiệu + toạ độ pin trên bản đồ** — mới 2/20 số là thật | ⬜ chờ khách/dev (Q-43) |
| **Chọn bản 1 hay bản 2** | ⬜ chờ khách (Q-42) |
| `@font-face` local thay Google Fonts | ⬜ chưa làm |

**Đã test:** Playwright/Chromium, **cả hai bản** — độc lập · trong iframe · bridge 2
chiều (`st:ready` / `st:navigate` / `st:close` / `st:lang` / `st:open`) · Esc · mobile
390×844 · landscape thấp. Bản 2 thêm: đổi trạng thái wall↔slider, lọc chip, tìm kiếm
bỏ dấu, ô tự đổi cảnh → **0 lỗi console**, mọi luồng đúng.

### ⭐ Phạm vi (2026-08-03 · YC-10 · D-46)

Khách chốt: **chỉ design cái popup**, nó sẽ thành page HTML nhúng iframe vào trang
khác. Toàn bộ phần "trang VR" mà project từng dựng — header, dock nút, thẻ vé, 2
overlay chỉ đường/danh sách, viewer mock — **đã gỡ hết**.
Danh sách file bị gỡ: [`01-architecture.md`](01-architecture.md) §1.1.
Khôi phục: `git show 9e5d46e:<đường-dẫn>`.

Ba điểm chốt của hợp đồng iframe:

| | Chốt |
|---|---|
| **Khung** | Iframe **phủ full viewport**; popup chiếm trọn màn, tự lo responsive |
| **Giao tiếp** | Thử `parent.VRCore` trực tiếp (cùng origin) → rơi về `postMessage` |
| **Ngôn ngữ** | Trang cha truyền vào (`?lang=` + `postMessage st:lang`); popup không có nút riêng |

## Đọc theo thứ tự nào

1. [`07-integration.md`](07-integration.md) — ⭐ **đọc trước nếu bạn là người ghép**:
   hợp đồng iframe, code trang cha, 4 thứ iframe không tự làm được
2. [`00-requirements.md`](00-requirements.md) — khách muốn gì, cái gì còn chờ chốt
3. [`08-decisions.md`](08-decisions.md) — **đọc nếu bạn thắc mắc "sao lại làm thế"**
4. [`01-architecture.md`](01-architecture.md) — file nào làm gì, sơ đồ phụ thuộc
5. [`02-design-system.md`](02-design-system.md) — token màu/font
6. [`03-components.md`](03-components.md) + [`04-modals.md`](04-modals.md) — spec chi tiết
7. [`05-flows.md`](05-flows.md) — luồng người dùng qua ranh giới iframe
8. [`06-data.md`](06-data.md) — schema dữ liệu + nguồn 12 ảnh
9. [`09-variant2.md`](09-variant2.md) — ⭐ spec riêng của **bản 2**

> **Bản đồ 2D** dùng chung cả hai bản: spec ở [`03-components.md`](03-components.md) §3.5,
> dữ liệu pin ở [`06-data.md`](06-data.md) §6.10.

## Cách chạy

Không cần build, không cần npm.

```
# Xem từng bản một mình (bridge thành no-op)
double-click index.html      → bản 1: carousel
double-click index2.html     → bản 2: wall + slider

# Xem TRONG IFRAME đúng như khi ghép thật, có nút chuyển qua lại 2 bản
double-click host-demo.html

# Local server
python -m http.server 8080   → http://localhost:8080/host-demo.html
```

> `host-demo.html` **không phải deliverable** — nó mô phỏng trang cha (panorama giả,
> nút mở lại, nút đổi ngôn ngữ, log postMessage). Phần `<script>` cuối file chính là
> bản mẫu chép được cho bên tích hợp.

> Sprite icon **inline trong `index.html`** đúng để `file://` chạy được (D-33).
> Font `Arima Madurai` lấy từ Google Fonts — mất mạng thì rơi về font hệ thống,
> layout không vỡ.

### Query params

| Param | Tác dụng |
|---|---|
| `?lang=vi\|en` | Ngôn ngữ (Q4). Trang cha truyền vào lúc nhúng |
| `?title=a\|b\|c` | Đổi biến thể tiêu đề (Q6) |
| `?debug=1` | Panel debug: ngôn ngữ · thẻ đang chọn · **có đang trong iframe không** · **có cùng origin không** · nút đổi tiêu đề / lùi-tiến thẻ / đổi VI-EN / mở lại |

> Panel `?debug=1` là công cụ để bạn **tự bấm chọn tại chỗ** khi trình bày cho khách
> (Q6 — 3 biến thể tiêu đề), và để kiểm nhanh bridge đang chạy nhánh nào.

## Quy tắc bắt buộc khi sửa code

Đọc [`../CLAUDE.md`](../CLAUDE.md) — **RULE #1: sửa code là phải cập nhật docs trong
cùng lượt.** Docs lệch code = docs vô giá trị.
