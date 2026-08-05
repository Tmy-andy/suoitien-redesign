# suoitien-vr360redes — Rules cho Claude

Project này **LÀ CÁI POPUP** — không phải bản re-design cả trang VR.

`index.html` là một trang HTML độc lập, được nhúng vào trang VR thật
(https://suoitien.trip360.vn/) bằng một `<iframe>` phủ kín viewport. Popup **chiếm
trọn màn hình** — không phải hộp modal canh giữa, không có lớp nền mờ. Nó nói chuyện
với trang cha qua `js/bridge.js`.

Stack: **HTML + CSS + JS thuần**, không build tool, không framework.
Phạm vi này chốt ngày 2026-08-03 (YC-10 · D-46) — trước đó project từng dựng cả
header, dock nút, 2 overlay chỉ đường/danh sách. **Tất cả đã gỡ.**

## RULE #1 — docs/ luôn phải được cập nhật (BẮT BUỘC)

`docs/` là source of truth của project này. Sau **mỗi** lần thay đổi code
(thêm/xóa/sửa component, flow, token màu, tên file, message của bridge), phải cập
nhật docs **trong cùng lượt làm việc đó** — không để "làm sau".

Các file bắt buộc phải có và phải khớp với code thực tế:

| File | Nội dung |
|---|---|
| `docs/README.md` | Index của docs, cách chạy demo, trạng thái project |
| `docs/00-requirements.md` | Yêu cầu gốc của khách + các câu hỏi/giải đáp đã chốt |
| `docs/01-architecture.md` | Structure thư mục, từng file làm gì, thứ tự load, buộc có Sơ đồ phụ thuộc module (mermaid graph TD) |
| `docs/02-design-system.md` | Token màu, typography, spacing, radius, shadow, icon, nguồn gốc (Figma / site) |
| `docs/03-components.md` | Từng component: selector, state, responsive |
| `docs/04-modals.md` | Chi tiết popup: id, trigger, nội dung, z-index, ARIA, animation, cách đóng |
| `docs/05-flows.md` | Luồng người dùng + sequence diagram (mermaid), logic điều hướng |
| `docs/06-data.md` | Schema các file dữ liệu, field, ví dụ, nguồn gốc ảnh |
| `docs/07-integration.md` | **Hợp đồng iframe** — trang cha phải viết gì, bridge nhận/gửi gì, các giới hạn của iframe |
| `docs/08-decisions.md` | Decision log: quyết định, lý do, ngày, phương án đã loại |
| `docs/09-variant2.md` | Spec của **bản 2** (`index2.html` — VR Wall + Infinite Slider) |
| `docs/TODO.md` | Todo list, cập nhật liên tục: `[ ] / [~] / [x]` + ngày + owner |

## RULE #2 — Quy ước viết docs

- Tiếng Việt. Ngày ghi tuyệt đối (`2026-08-03`), không ghi "hôm qua/tuần sau".
- Mỗi file mở đầu bằng `> Cập nhật: YYYY-MM-DD`.
- Mọi mô tả UI phải kèm **selector thật** (`#st-popup`, `.st-cr-card`) để trace được
  về code.
- Không docs những gì đọc code là biết ngay; docs phần **vì sao** và **luồng đi**.
- `docs/TODO.md`: việc mới thêm vào cuối, việc xong đánh `[x]` + ngày, không xóa
  (để có history).
- Quyết định bị đảo ngược thì **đánh dấu ⚫ tại chỗ**, không xoá — người đọc sau cần
  biết đã từng cân nhắc gì và vì sao đổi ý.

## RULE #3 — Code

- Không thêm dependency ngoài (CDN, npm) trong bản chạy. Icon inline SVG.
  *(Ngoại lệ đang tồn tại: Google Fonts — xem `docs/TODO.md`.)*
- Prefix `st-` cho mọi id/class để không đụng CSS của 3DVista/floorplan khi ghép.
- Popup **không được biết** nó đang nằm trong iframe, trừ `js/bridge.js`. Mọi lời gọi
  ra ngoài đi qua `ST.bridge`.
- `html, body { background: transparent }` là **bắt buộc** dù `#st-popup` có nền đặc:
  lúc vào/ra popup fade `opacity`, đúng những frame đó phải nhìn xuyên qua thấy
  panorama của trang cha.
- Mọi thứ mô phỏng (mock) phải comment rõ `// MOCK:` để dev biết chỗ cần nối API thật.
- `host-demo.html` **không phải deliverable** — nó mô phỏng trang cha để test, và là
  bản mẫu chép được cho bên tích hợp.

## Kiến trúc rút gọn

**MỘT BẢN DUY NHẤT** — khách chốt VR Wall + Infinite Slider ngày 2026-08-04 (D-57);
bản 1 (màn chào + 3D carousel) và `host-demo.html` **đã gỡ hẳn**:

```
index.html    ← VR Wall 11 khu vực → Infinite Slider → VR (2 tầng)

css/tokens · css/base · css/wall · css/slider · css/map2d · css/responsive2
js/data · js/i18n · js/a11y · js/bridge · js/map2d · js/wall · js/slider · js/popup2
assets/img/cards/            ảnh banner .webp
assets/map/park-2400.webp    bản đồ 2D (391 KB)
```

Vài tên còn hậu tố **"2"** (`#st-pop2`, `js/popup2.js`, `css/responsive2.css`) — giữ
nguyên là **cố ý**: tên không hậu tố vừa mới thuộc về bản 1 và decision log nhắc tới
chúng ~40 chỗ. Xem D-57.

Bấm chọn một điểm ra `ST.bridge.navigate(dest)` → trang cha điều hướng tour tới panorama
tương ứng. Trang cha chỉ cần một thẻ `<iframe>` phủ kín viewport.

## Bối cảnh kỹ thuật (đã verify 2026-07-30)

### Trang VR — https://suoitien.trip360.vn/ (đây là TRANG CHA)

- Engine: **3DVista** (`vr-360/lib/tdvplayer.js` + `vr-360/script.js`), `<base href="vr-360/">`.
- Seam điều hướng: `packages/vr-core/index.js` → `window.VRCore`
  (`ensureTourLoaded`, `mountViewer`, `navigateToPano`, `getCurrentPanoInfo`, `getCurrentPanoId`).
  → `js/bridge.js` gọi thẳng vào đây khi cùng origin; khác origin thì `postMessage`.
- Dữ liệu: `data/catalog.json` (158 destinations: `name`, `type`, `icon`, `pano`).
- `floorplan.css` chiếm **z-index 10000–10009** → thẻ `<iframe>` ở trang cha phải đặt
  cao hơn. Bên trong popup thì thang z-index để thấp là đúng (document riêng).
- Font trang VR: `Be Vietnam Pro`.
- Analytics: `js/vr360-tracking.js` → `/backend/analytics/track.php`.

### Site chính — https://suoitien.vn/ (NGUỒN CHUẨN cho màu, font & ẢNH)

CSS: `halink-content/themes/halink-c5/public/theme/css/style.css`

| Hex | Vai trò |
|---|---|
| `#128125` | **Xanh lá thương hiệu** — dùng 54 lần trên site |
| `#DEA800` | **Vàng** — nền topbar; ở popup là badge "Nên xem" |
| `#EB0029` | **Đỏ** — chữ nút "Mua vé"; ở popup là 1/3 dải nhận diện trên đỉnh panel |

- Font: **`Arima Madurai`** (tiêu đề) + **`Be Vietnam Pro`** (body) — hệ 2 font, D-23.
- **12 ảnh banner** của carousel tải từ đây → `docs/06-data.md` §6.8 ghi URL gốc từng ảnh.

## Chốt quan trọng từ khách

- **2026-08-03 (YC-10):** project chỉ còn cái popup, nhúng iframe vào trang khác.
  Iframe phủ full viewport · bridge thử VRCore trực tiếp rồi rơi về postMessage ·
  ngôn ngữ do trang cha truyền vào.
- **2026-08-03 (YC-11):** popup **chiếm trọn màn hình**, bỏ hẳn hộp modal + nền mờ
  (D-48). Carousel còn **3 thẻ**: 1 thẻ giữa to + 1 preview mỗi bên (D-49).
- **2026-08-03 (YC-12):** dựng thêm **bản 2** `index2.html` theo `note.md` §137 —
  VR Wall (9 khu vực) → Infinite Slider → VR 360. **Song song, không thay thế bản 1**
  (D-50 · `docs/09-variant2.md`). Khách sẽ chọn 1 trong 2.
- **2026-08-03 (YC-13):** mọi ảnh phải `object-fit: cover` · bản 1 đổi thẻ carousel từ
  ĐIỂM sang **KHU VỰC** + thêm ô tìm kiếm và danh sách (D-52) · **cả hai bản** thêm
  *"Xem trên bản đồ 2D"* với pin số hiệu, lọc theo khu vực đang xem (D-51).
- **2026-08-04 (YC-14):** cả hai bản dùng **CHUNG một nền trắng phẳng** — bỏ 2 vệt
  radial ở `#st-popup`, và bản 2 **hết nền tối** (đảo ngược D-50 #4; riêng slider vẫn
  tối). Nút *"Xem trên bản đồ 2D"* chuyển từ footer lên cạnh ô tìm kiếm. Cỡ thẻ
  carousel suy từ **chiều cao sân khấu**, không còn hằng số `vh` — thẻ giữa to hơn
  21–46% (D-54).
- **2026-08-04 (YC-15):** carousel bản 1 lên **5 thẻ**, autoplay 3,0s, thẻ giữa có
  parallax khi hover; **dựng lại animation vào màn cho cả hai bản**; danh sách điểm
  đổi từ dòng ngang sang **thẻ ảnh 4:3**; và truy ra *"ảnh vỡ"* là do **9/12 ảnh gốc
  trên suoitien.vn chỉ 600×600** — đã đổi sang ảnh trang chi tiết (D-55 · D-56).
- **2026-08-05 (YC-17):** **màn chi tiết (slider) trên điện thoại** đổi hẳn mô hình —
  nền trắng như wall, mỗi cảnh là một **thẻ** (ảnh trên, chữ + nút dưới trên nền
  trắng), ảnh nhỏ lại, ‹ › ra khỏi ảnh vào lề, autoplay **2,5s** (desktop giữ 6s).
  Điện thoại nằm ngang dùng chung bảng màu nhưng xếp **thẻ ngang** (D-60).
- **2026-08-05 (YC-18):** *"nền đen lệch tông quá"* → **desktop cũng vậy**. Nền sáng +
  cấu trúc thẻ thành **mặc định** ở `css/slider.css` (desktop = thẻ ngang: ảnh trái 60%
  giữ 3:2 · chữ phải); `.st-sld-bg` + `.st-sld-shade` **gỡ hẳn**. `responsive2.css` chỉ
  còn lo **hướng xếp**, và chia theo `orientation` chứ không `max-width`. Nút *"Xem trên
  bản đồ 2D"* **trở lại thanh công cụ wall** (icon vuông trên điện thoại) — đảo ngược
  chỗ D-57 đã gỡ nó (D-61).
- **2026-08-03 (YC-9):** bỏ hẳn bản đồ + hotspot, thay bằng **3D carousel ảnh banner**;
  click ảnh → nhảy tới panorama tương ứng.
- Tone **light/airy**, không dark-glass. Bỏ hẳn màu `#1769ff`.
- Nền popup là **một màu trắng phẳng**, không gradient — dưới 8% alpha trên vùng rộng
  đọc ra là vết bẩn, không phải sắc độ (D-54). Áp dụng cho **cả hai bản**.
- **Ảnh: KHÔNG BAO GIỜ phóng to khi dựng asset.** Bề ngang xuất = bề ngang thật của
  nguồn sau khi cắt (trần 1200). Phóng ở khâu dựng chỉ làm file nặng thêm mà không
  thêm chi tiết nào, và **giấu mất** việc ảnh đó đang thiếu độ phân giải — chính chỗ
  này đẻ ra lỗi "ảnh vỡ" của D-55. Bảng nguồn ảnh phải ghi `W×H`, không ghi KB.
- Animation vào màn dùng `animation-fill-mode: **backwards**`, không phải `both`:
  `forwards` giữ quyền điều khiển thuộc tính sau khi chạy xong và làm chết cứng mọi
  transform của hover (D-55).
- Bấm thẻ **nhảy thẳng**, không có bước xác nhận (Q10 = a).
- **Cần bản EN** → i18n từ đầu (`data-i18n` + `COPY.vi/en`). Popup **không** có nút
  chuyển ngôn ngữ — nếu có, nó sẽ lệch với nút VN/EN của trang cha.
