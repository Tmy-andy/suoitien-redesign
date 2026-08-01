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

## Bối cảnh kỹ thuật (đã verify 2026-07-30)

### Trang VR — https://suoitien.trip360.vn/

- Engine: **3DVista** (`vr-360/lib/tdvplayer.js` + `vr-360/script.js`), `<base href="vr-360/">`.
- Seam điều hướng: `packages/vr-core/index.js` → `window.VRCore`
  (`ensureTourLoaded`, `mountViewer`, `navigateToPano`, `getCurrentPanoInfo`, `getCurrentPanoId`).
- Overlay bản đồ hiện có: `js/floorplan.js` + `js/floorplan.dc.html` (React/DC, 173 KB) + `js/floorplan.css`.
- Dữ liệu: `data/catalog.json` (158 destinations: `name`, `type`, `icon`, `pano`), `map/img/map.jpg` (~1.2 MB),
  `map/map_{places,places_content,panos,graph,geo,locales}.json`.
- Font trang VR: `Be Vietnam Pro`.
- Analytics: `js/vr360-tracking.js` → `/backend/analytics/track.php`.
- **5 cụm control hiện có** (từ ảnh khách gửi): ⓐ VN+share trên-phải · ⓑ sidebar trái
  (THAM QUAN/ẨM THỰC/FARM/DỊCH VỤ/VỊ TRÍ/LIÊN HỆ) · ⓒ Chỉ đường+Điểm đến dưới-trái ·
  ⓓ **VR/compass/sound/fullscreen dưới-GIỮA** (pill trắng, icon circle viền xanh) ·
  ⓔ 2 nút tròn phải-giữa. → Xem `docs/00-requirements.md` §0.3.

### Site chính — https://suoitien.vn/ (NGUỒN CHUẨN cho màu & font)

CSS: `halink-content/themes/halink-c5/public/theme/css/style.css`

| Hex | Vai trò |
|---|---|
| `#128125` | **Xanh lá thương hiệu** — navbar, submenu, heading (dùng 54 lần) |
| `#DEA800` | **Vàng** — nền topbar |
| `#EB0029` | **Đỏ** — chữ nút "Mua vé" |
| `#E7313B` | Đỏ — `box-shadow: 0 2px 0` dưới navbar |
| `#FBD255` | Vàng nhạt — nền nút "Mua vé" |
| `#D6282E` `#F53D2D` `#FF7B01` `#65A723` `#148225` | phụ |

- Font: **`Arima Madurai`** (Google Fonts, w100–700, **có subset `vietnamese`**).
  → Dùng hệ 2 font, xem `docs/02-design-system.md` §2.2 và D-23.
- Navbar: `border-radius: 50px`, `width: 90%`, logo **ở giữa**, chữ trắng bold UPPERCASE,
  có **đường đỏ 2px + vệt gradient đỏ→trắng→đỏ** dưới đáy (chi tiết nhận diện, phải clone).
- Menu: **84 mục, 3 cấp**, href thật — xem `docs/06-data.md` §6.6.
- Link: mua vé `/chon-ve` · bản đồ `/ban-do` · farm `stf.suoitien.vn` ·
  logo `/halink-content/uploads/logosuoitien.png`.

### Chốt quan trọng từ khách (2026-07-30)

- Prototype **chỉ dựng phần cần thay đổi**: header + modal welcome + dock nút. Overlay
  chỉ đường/danh sách **đã hoàn thiện, không dựng lại**.
- Tone **light/airy**, không dark-glass. Bỏ hẳn màu `#1769ff`.
- Modal welcome: click hotspot **nhảy thẳng**, hiện **1 lần**, đóng thì **morph co về
  1 nút trong dock** (bấm mở lại).
- Header **slide lên** khi tương tác, có tab `#st-nav-peek` mũi tên kép nhấp nhô để mở lại.
- **Cần bản EN** → i18n từ đầu (`data-i18n` + `COPY.vi/en`).
- Link navbar `href="#"` + toast, nhưng **lưu URL thật** kèm cờ `LINKS_LIVE`.
