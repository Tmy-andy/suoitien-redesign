> Cập nhật: 2026-08-01 (v6 — clone 2 overlay M2/M3 mở ra từ cụm C · D-43)

# Suối Tiên VR360 — Re-design Prototype · Docs

Bộ tài liệu cho **prototype re-design UI** của tour VR360 Suối Tiên
(`https://suoitien.trip360.vn/`). Mục tiêu: bản demo HTML/CSS/JS thuần để
trình bày design cho khách, sau đó dev port sang bản 3DVista thật.

## Trạng thái project

| Hạng mục | Trạng thái |
|---|---|
| Docs | ✅ **v6** (2026-08-01) |
| Design tokens | ✅ 10 màu + font `Arima Madurai` lấy thật từ `suoitien.vn/…/style.css` |
| Header (topbar vàng + navbar xanh + tab VR360 + `#st-nav-peek`) | ✅ **xong** |
| Modal Welcome (3 biến thể + 8 hotspot + morph về nút) | ✅ **xong** |
| **Cụm C: Chỉ đường / Điểm đến** (dưới-trái, 2 pill RỜI, không div nền) | ✅ **xong** — D-40/D-42 |
| **Thẻ vé combo `#st-ticket`** (dưới navbar phải, hình tấm vé, nảy mỗi 8s) | ✅ **xong** — D-41 |
| **M2 `#st-route`** — overlay Chỉ đường (clone: bảng trái, chỉ dẫn từng chặng, pin, zoom) | ✅ **xong** — D-43 |
| **M3 `#st-places`** — overlay Danh sách điểm đến (clone: tìm kiếm, 6 chip, lưới thẻ) | ✅ **xong** — D-43 |
| Dock hợp nhất bản v2 (+ 4 nút xem + `⋯`) | ⛔ ngoài phạm vi — `?full=1` |
| CTA Mua vé / Mua combo (viền chạy như site chính) | ⛔ ngoài phạm vi — đè cụm ⓔ |
| Mock VR360 viewer (3 lớp parallax, kéo xoay) | ✅ **xong** |
| i18n VI/EN | ✅ **xong** |
| Toast / Drawer mobile | ✅ **xong** |
| Share / Help | ⛔ ngoài phạm vi — `?full=1` |
| Bản đồ dọc riêng cho mobile | ⬜ v2 (hiện dùng bản đồ ngang + danh sách 8 điểm) |

**Đã test:** Playwright, Chromium, desktop 1440×900 + mobile 390×844 → **0 lỗi console**,
mọi luồng chính chạy đúng. 7 lỗi tìm được khi chạy thật đã sửa
(xem [`TODO.md`](TODO.md) và [`08-decisions.md`](08-decisions.md) D-31→D-35).

### ⭐ Phạm vi đã thu lại (2026-08-01 · D-39)

Khách chốt: prototype giao **đúng 3 khối** — header · cụm C 3 nút · modal welcome.
Mọi thứ khác **không được thêm vào trang**, vì trip360 đã có control thật ở đó và
prototype sẽ được thả ĐÈ LÊN chứ không thay thế nó.

Tiêu chí không phải "mới hay cũ" mà là *chỗ đó trên trip360 đã có gì chưa*: dải trên
cùng **trống** nên header được dựng; 4 cụm ⓐ ⓑ ⓓ ⓔ đã có control nên cấm đụng vào.

Phần bị tắt vẫn còn nguyên code — `index.html?full=1` dựng lại bản v2 để đối chiếu.
`index.html?zones=1` vẽ ghost 4 vùng cấm để kiểm chứng không đè.

**Còn 4 blocker:** Q-35 🔴 (header đè cụm ⓐ) · Q-36 🔴 (M2/M3 clone dùng làm gì khi
ghép thật) · Q-34 (sidebar trái) · Q-29 (nguồn data chuẩn). Chi tiết [`TODO.md`](TODO.md) §P0.

**⭐ Cập nhật 2026-08-01 (YC-8 · D-43):** 2 overlay "Chỉ đường" và "Danh sách điểm đến"
**đã được clone** thành M2 `#st-route` + M3 `#st-places`. Trước đó chúng ngoài phạm vi
(D-09v2) và 2 nút chỉ mở panel giữ chỗ. Bấm nút giờ mở đúng trang như trên trip360.

Chúng nằm trong phạm vi `minimal` vì là **nội dung của chính 2 nút** được giao
redesign, không phải UI thêm vào màn hình VR.

Quãng đường và chỉ dẫn từng chặng là **MOCK nhưng ổn định** (sinh từ hàm băm của cặp
điểm, không random) — mở đi mở lại cùng tuyến luôn ra cùng kết quả.

Chi tiết việc: [`TODO.md`](TODO.md)

## Đọc theo thứ tự nào

1. [`00-requirements.md`](00-requirements.md) — khách muốn gì, cái gì còn đang chờ chốt
2. [`08-decisions.md`](08-decisions.md) — **đọc cái này nếu bạn thắc mắc "sao lại làm thế"**
3. [`02-design-system.md`](02-design-system.md) — token màu/font, mọi thứ visual bắt nguồn từ đây
4. [`01-architecture.md`](01-architecture.md) — file nào làm gì
5. [`03-components.md`](03-components.md) + [`04-modals.md`](04-modals.md) — spec chi tiết từng thứ trên màn hình
6. [`05-flows.md`](05-flows.md) — luồng người dùng, state machine
7. [`06-data.md`](06-data.md) — schema dữ liệu
8. [`07-integration.md`](07-integration.md) — cách ghép vào site thật

## Cách chạy demo

Không cần build, không cần npm.

```
# Cách 1 — mở trực tiếp (chạy đủ chức năng)
double-click index.html

# Cách 2 — local server
python -m http.server 8080
# → http://localhost:8080
```

> Sprite icon và bản đồ SVG được **inline trong `index.html`** đúng để `file://` chạy
> được (xem [`08-decisions.md`](08-decisions.md) D-33). Font `Arima Madurai` lấy từ
> Google Fonts — mất mạng thì tự rơi về font hệ thống, layout không vỡ.

### Query params hỗ trợ (để demo cho khách)

| Param | Tác dụng |
|---|---|
| `?welcome=0` | Tắt modal welcome, vào thẳng viewer |
| `?welcome=1` | Buộc hiện modal welcome (bỏ qua localStorage) |
| `?pano=<key>` | Vào thẳng 1 điểm, VD `?pano=tuyet` (Lâu Đài Tuyết) |
| `?title=a\|b\|c` | **Đổi biến thể tiêu đề modal welcome** (Q6) |
| `?map=svg\|real` | **Đổi bản đồ: SVG tự vẽ hay bản đồ 3D thật** (Q-30) |
| `?lang=vi\|en` | Đổi ngôn ngữ (Q4) |
| `?nav=off` | Ẩn header (xem giao diện VR thuần) |
| `?full=1` | ⭐ Dựng lại **bản v2 đầy đủ**: dock hợp nhất dưới-giữa + CTA vé + popover `⋯` + share + help. Để đối chiếu với phạm vi mới (D-39) |
| `?zones=1` | ⭐ Vẽ **ghost 4 cụm control có sẵn** của trip360 để kiểm chứng cụm C không đè lên. Xám = cấm cứng, vàng = cấm mềm (cụm ⓐ) |
| `?debug=1` | Panel debug: state · modal đang mở · **3 nút đổi tiêu đề** · **nút đổi bản đồ** · reset localStorage · grid 8px |

> Panel `?debug=1` là công cụ để bạn **tự bấm chọn tại chỗ** khi xem demo — dùng cho
> Q6 (3 biến thể tiêu đề) và Q-30 (SVG vs bản đồ thật).

## Quy tắc bắt buộc khi sửa code

Đọc [`../CLAUDE.md`](../CLAUDE.md) — **RULE #1: sửa code là phải cập nhật docs
trong cùng lượt.** Docs lệch code = docs vô giá trị.
