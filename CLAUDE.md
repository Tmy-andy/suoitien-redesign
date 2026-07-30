# suoitien-vr360redes — Rules cho Claude

Prototype re-design UI cho tour VR360 Suối Tiên (https://suoitien.trip360.vn/).
Stack demo: **HTML + CSS + JS thuần**, không build tool, không framework.

## RULE #1 — docs/ luôn phải được cập nhật (BẮT BUỘC)

`docs/` là source of truth của project này. Sau **mỗi** lần thay đổi code
(thêm/xóa/sửa component, modal, flow, token màu, tên file), phải cập nhật docs
**trong cùng lượt làm việc đó** — không để "làm sau".

Các file bắt buộc phải có và phải khớp với code thực tế:

| File | Nội dung |
|---|---|
| `docs/README.md` | Index của docs, cách chạy demo, trạng thái project |
| `docs/00-requirements.md` | Yêu cầu gốc của khách + các câu hỏi/giải đáp đã chốt |
| `docs/01-architecture.md` | Structure thư mục, từng file làm gì, thứ tự load, buộc có Sơ đồ phụ thuộc module (mermaid graph TD) |
| `docs/02-design-system.md` | Token màu, typography, spacing, radius, shadow, icon, nguồn gốc (Figma / site) |
| `docs/03-components.md` | Từng component/button: id, class, vị trí, state, responsive |
| `docs/04-modals.md` | Chi tiết **tất cả** modal/overlay: id, trigger, nội dung, z-index, ARIA, animation, cách đóng |
| `docs/05-flows.md` | Luồng người dùng + sequence diagram (mermaid), logic điều hướng, state machine |
| `docs/06-data.md` | Schema các file dữ liệu (catalog/destinations/hotspots), field, ví dụ |
| `docs/07-integration.md` | Cách ghép prototype vào bản 3DVista thật (VRCore, floorplan, base href) |
| `docs/08-decisions.md` | Decision log: quyết định, lý do, ngày, phương án đã loại |
| `docs/TODO.md` | Todo list, cập nhật liên tục: `[ ] / [~] / [x]` + ngày + owner |

## RULE #2 — Quy ước viết docs

- Tiếng Việt. Ngày ghi tuyệt đối (`2026-07-30`), không ghi "hôm qua/tuần sau".
- Mỗi file mở đầu bằng `> Cập nhật: YYYY-MM-DD`.
- Mọi mô tả UI phải kèm **selector thật** (`#st-welcome`, `.st-hotspot`) để trace được về code.
- Không docs những gì đọc code là biết ngay; docs phần **vì sao** và **luồng đi**.
- `docs/TODO.md`: việc mới thêm vào cuối, việc xong đánh `[x]` + ngày, không xóa (để có history).

## RULE #3 — Code

- Không thêm dependency ngoài (CDN, npm). Font/icon inline hoặc SVG.
- Không sửa gì trong `vr-360/` (bản export 3DVista là read-only trên site thật).
- Prefix `st-` cho mọi id/class mới để không đụng CSS của 3DVista.
- Giữ nguyên các seam đã có trên site thật: `window.VRCore`, `#fp-overlay`, `#fp-fabs`.
- Mọi thứ mô phỏng (mock) phải comment rõ `// MOCK:` để dev biết chỗ cần nối API thật.

## Bối cảnh kỹ thuật site thật (đã verify 2026-07-30)

- Engine: **3DVista** (`vr-360/lib/tdvplayer.js` + `vr-360/script.js`), `<base href="vr-360/">`.
- Seam điều hướng: `packages/vr-core/index.js` → `window.VRCore`
  (`ensureTourLoaded`, `mountViewer`, `navigateToPano`, `getCurrentPanoInfo`, `getCurrentPanoId`).
- Overlay bản đồ hiện có: `js/floorplan.js` + `js/floorplan.dc.html` (React/DC) + `js/floorplan.css`.
- Dữ liệu: `data/catalog.json` (158 destinations: `name`, `type`, `icon`, `pano`), map `map/img/map.jpg` (~1.2 MB).
- 2 nút hiện tại: `#fp-launch` "Chỉ đường" (`#0e6b2e`), `#fp-list-launch` "Điểm đến" (`#1769ff`), trong `#fp-fabs` (fixed left/bottom).
- Font site VR: `Be Vietnam Pro`.
- Analytics: `js/vr360-tracking.js` → `/backend/analytics/track.php`.
