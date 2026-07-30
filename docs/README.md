> Cập nhật: 2026-07-30

# Suối Tiên VR360 — Re-design Prototype · Docs

Bộ tài liệu cho **prototype re-design UI** của tour VR360 Suối Tiên
(`https://suoitien.trip360.vn/`). Mục tiêu: bản demo HTML/CSS/JS thuần để
trình bày design cho khách, sau đó dev port sang bản 3DVista thật.

## Trạng thái project

| Hạng mục | Trạng thái |
|---|---|
| Docs | ✅ v1 (2026-07-30) |
| Design tokens | 🟡 **TẠM** — chờ màu chính thức từ Figma (xem `00-requirements.md` Q24) |
| Navbar + tab VR360 | ⬜ chưa code |
| Modal Welcome + bản đồ hotspot | ⬜ chưa code |
| Re-design nút Chỉ đường / Điểm đến | ⬜ chưa code |
| Mock VR360 viewer | ⬜ chưa code |

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
# Cách 1 — mở trực tiếp
double-click index.html

# Cách 2 — có local server (khuyến nghị, để fetch JSON không bị CORS)
python -m http.server 8080
# → http://localhost:8080
```

### Query params hỗ trợ (để demo cho khách)

| Param | Tác dụng |
|---|---|
| `?welcome=0` | Tắt modal welcome, vào thẳng viewer |
| `?welcome=1` | Buộc hiện modal welcome (bỏ qua localStorage) |
| `?pano=<key>` | Vào thẳng 1 điểm, VD `?pano=tuyet` (Lâu Đài Tuyết) |
| `?nav=off` | Ẩn navbar (xem giao diện VR thuần) |
| `?debug=1` | Hiện panel debug: state hiện tại, z-index map, grid overlay |

## Quy tắc bắt buộc khi sửa code

Đọc [`../CLAUDE.md`](../CLAUDE.md) — **RULE #1: sửa code là phải cập nhật docs
trong cùng lượt.** Docs lệch code = docs vô giá trị.
