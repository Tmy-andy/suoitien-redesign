> Cập nhật: 2026-07-30

# 00 — Yêu cầu

## 0.1 Brief gốc từ khách (nguyên văn, 2026-07-30)

Nguồn: chat với chủ project. 3 yêu cầu chính.

### YC-1 — Modal welcome + bản đồ 2D hotspot

> Tôi muốn khi vừa click vào domain vẫn mở trang vr360, nhưng ngay lập tức hiện
> popup modal kiểu "Bạn quan tâm địa điểm nào nhất" / "Bạn muốn ghé thăm nơi nào
> trước nè?" / ... rồi bên dưới tiêu đề này nọ là bản đồ 2D (mô phỏng thôi) có
> hotspot (cũng mô phỏng thôi) để click vào là nhảy đến địa điểm vr360 tương ứng
> (mô phỏng)
>
> **Mục tiêu:** Gây ấn tượng mạnh cho người dùng, trước khi trải nghiệm, nó cũng
> là trang nói cho người dùng về tour VR 360 trong 3 giây đầu.
>
> Kế đến là bố trí các Button trên giao diện trang.
>
> **Mục tiêu:** Giao diện site VR 360 chuyên nghiệp nhưng thân thiện.

### YC-2 — Re-design 2 nút "Chỉ Đường" + "Điểm đến"

> 2 nút "Chỉ Đường" và "Điểm đến" (3 hình) tôi muốn design lại cho đẹp và phù hợp
> với trang hơn. Hãy xem qua và đề xuất re-design phù hợp. Có thể thay đổi vị trí.
> Đồng thời xem xét figma để đồng bộ giao diện cho phù hợp, chủ yếu là màu chủ đạo

> ⚠️ "(3 hình)" — khách nhắc có 3 ảnh nhưng **chưa attach**. Đang làm dựa trên
> CSS đọc trực tiếp từ site thật (xem §0.3).

### YC-3 — Navbar header đồng bộ với website chính

> Trên trang vr360 sẽ có luôn phần navbar header giống như trang web (tùy bạn xem
> qua figma hay trang web của họ) để đồng bộ hiển thị. Clone navbar ra và thêm 1
> tab vr360 vào.

### YC-4 — Deliverable

> Tôi cần bạn lên khung html css js thuần thôi để demo mẫu design prototype cho
> khách xem qua.

### YC-5 — Docs

> Tạo docs/, trong đó có các file md ghi chú về pj này. Đồng thời có thêm md todo
> list để cập nhật liên tục công việc. Md nhớ bao gồm file tổng hợp các chức năng,
> structure và chi tiết các modal hiện đang có, luồng đi, logic... càng nhiều và
> chi tiết đầy đủ càng tốt. Và file phải luôn được cập nhật liên tục. Ghi nhớ vào
> rule trong project này.

→ Đã thực thi: [`../CLAUDE.md`](../CLAUDE.md) RULE #1/#2/#3 + toàn bộ `docs/`.

## 0.2 Nguồn tham chiếu

| Nguồn | URL | Truy cập được? |
|---|---|---|
| Tour VR360 hiện tại | https://suoitien.trip360.vn/ | ✅ đọc được source + JSON |
| Website chính thức | https://suoitien.vn/ | ✅ đọc được |
| Figma — Prototype | https://www.figma.com/proto/9tbCUWHRA1AAdcpf4n7U1E/ST-UI?node-id=42-2 | ❌ **cần login** |
| Figma — Design (dev mode) | https://www.figma.com/design/9tbCUWHRA1AAdcpf4n7U1E/ST-UI?node-id=42-2&m=dev | ❌ **cần login** |

**Figma là blocker chính** cho YC-2 ("đồng bộ màu chủ đạo"). Cách unblock, chọn 1:
1. Export PNG/PDF các frame chính rồi gửi vào chat
2. Figma → Share → *Anyone with the link · can view* → gửi lại link
3. Gõ tay bộ token: hex primary / secondary / accent, font family + weight, radius

## 0.3 Hiện trạng site VR360 (đã verify từ source, 2026-07-30)

Tóm tắt — chi tiết ở [`07-integration.md`](07-integration.md).

| Mục | Giá trị |
|---|---|
| Engine | **3DVista** — `vr-360/lib/tdvplayer.js` + `vr-360/script.js` |
| Base URL trick | `<base href="vr-360/">` → mọi path tương đối trong `index.htm` bị viết lại |
| Seam điều hướng | `window.VRCore` từ `packages/vr-core/index.js` |
| Overlay bản đồ đã có | `js/floorplan.js` + `js/floorplan.dc.html` (React/DC, 173 KB) + `js/floorplan.css` |
| Dữ liệu điểm đến | `data/catalog.json` — 158 destinations |
| Ảnh bản đồ | `map/img/map.jpg` (~1.2 MB) |
| Font | `Be Vietnam Pro` |
| Analytics | `js/vr360-tracking.js` → `POST /backend/analytics/track.php` |

### 2 nút hiện tại — CSS thật

```css
#fp-fabs   { position:fixed; left:16px; bottom:calc(16px + safe-area); z-index:10000;
             display:flex; gap:10px }
#fp-launch      { background:#0e6b2e; color:#fff; border-radius:30px; padding:10px 14px;
                  min-height:44px; font:600 14px 'Be Vietnam Pro'; box-shadow:0 3px 10px rgba(0,0,0,.35) }
#fp-list-launch { background:#1769ff; /* ...còn lại giống trên... */ }
```

**Vấn đề đã xác định:**
- `#0e6b2e` (xanh lá đậm) đứng cạnh `#1769ff` (xanh dương bão hoà) → 2 màu cãi nhau,
  nhìn như 2 hệ thống UI khác nhau ghép vào. Không có hierarchy (cả 2 đều "primary").
- Cả 2 nút dồn góc dưới-trái → mất cân bằng thị giác, và trên mobile dễ đè nút của 3DVista.
- Icon 2 nút khác hệ (một cái `fill`, một cái `stroke` width 2) → không đồng bộ.
- `box-shadow` đen 35% trên panorama sáng thì bẩn, không có backdrop-blur nên chữ dễ bị nhoè
  khi panorama phía sau nhiều chi tiết.

### Tính năng ẩn phát hiện trong `floorplan.css` (khách chưa nhắc)

- **Split-view**: `#viewer.fp-vrsplit` — VR chiếm nửa trên, bản đồ nửa dưới, có
  `#fp-split-divider` **kéo được** (`row-resize`).
- **Fullscreen tạm**: `#viewer.fp-vrsplit.fp-vrfull` + nút `#fp-vrfull-exit` "Mở rộng 360°".
- **Định vị GPS**: `js/geocalib.js` → `window.GeoCalib`, hiệu chỉnh GPS↔pixel bằng affine + TPS,
  có POI ảo `{id:'me'}` = "Vị trí của tôi".
- **Tìm đường**: `map_graph.json` + thuật toán path (thấy `{dir:'start'}`, `{dir:'arrive', dist}`)
  → có routing thật với khoảng cách.
- Các JSON khác: `map_geo.json`, `map_panos.json`, `map_places.json`, `map_places_content.json`,
  `map_locales.json` (đều nằm trong `map/`, không public từ root).

→ Nghĩa là "Chỉ đường" **không phải** nút trang trí, nó là 1 app bản đồ đầy đủ.
Prototype sẽ mô phỏng ở mức UI, không làm lại routing (xem [`08-decisions.md`](08-decisions.md) D-09).

## 0.4 Website chính thức — navbar cần clone

Menu (thứ tự thật, 2026-07-30):

1. Trang chủ
2. Giới thiệu
3. Trải nghiệm đặc biệt
4. TRÒ CHƠI
5. Dịch vụ
6. Bảng giá
7. Tin tức & Thư viện
8. TUYỂN DỤNG & LIÊN HỆ

**Thông tin liên hệ** (dùng cho top bar):
- Hotline: `1900 636 787` · `028.38960260` · `0914347787`
- Địa chỉ: 120 Xa Lộ Hà Nội, P. Tăng Nhơn Phú, TP.HCM
- Email: `phongkinhdoanh@suoitien.com`
- Social: Facebook, TikTok, Instagram, YouTube

**Khu / attraction xuất hiện trên site chính:** Suối Tiên Farm, Thủy Cung,
Lâu Đài Phép Thuật, Lâu Đài Tuyết, Phụng Hoàng Tiên, Biển Tiên Đồng – Ngọc Nữ,
Sky Bounder, Thuyền Rồng, MegaZone.

> ⚠️ Site chính có `Lâu Đài Phép Thuật`, `catalog.json` ghi `Lâu Đài Pháp Thuật`.
> Chưa biết bên nào đúng — xem Q-28.

## 0.5 Câu hỏi mở — CHỜ KHÁCH TRẢ LỜI

Trạng thái: 🔴 blocker · 🟡 đang dùng giả định · ⚪ nice-to-have
Giả định đang dùng ghi ở [`08-decisions.md`](08-decisions.md).

### Phạm vi & giao hàng

| # | Câu hỏi | TT | Giả định đang dùng |
|---|---|---|---|
| Q1 | Prototype standalone hay ghép vào repo thật? Folder đang trống hoàn toàn. | 🟡 | Standalone, mock hết |
| Q2 | Được load asset từ site thật qua URL không (map.jpg, catalog.json)? | 🟡 | Không — tự vẽ SVG + hardcode data, để demo chạy offline |
| Q3 | Khách xem demo trên gì (laptop / mobile / máy chiếu)? | 🟡 | Laptop 1440px là chính, có responsive mobile |
| Q4 | Cần bản tiếng Anh? | ⚪ | Chỉ tiếng Việt, nhưng có nút VI/EN mock |
| Q5 | 1 file HTML gộp hay tách css/ js/? | 🟡 | Tách + script gộp thành 1 file để gửi |

### Modal welcome (YC-1)

| # | Câu hỏi | TT | Giả định đang dùng |
|---|---|---|---|
| Q6 | Chốt tiêu đề nào? | 🟡 | "Bạn muốn ghé thăm nơi nào trước?" + 2 biến thể đổi được ở `js/data.js` |
| Q7 | Có subtitle mô tả tour? Được nói số "158 điểm" công khai? | 🟡 | Có subtitle, ghi "hơn 150 điểm" (an toàn hơn số chính xác) |
| Q8 | Bản đồ 2D dùng: (a) map.jpg thật (b) SVG stylized (c) placeholder | 🟡 | **(b) SVG stylized** — khách nói "mô phỏng thôi", và SVG nhìn designed hơn |
| Q9 | Bao nhiêu hotspot? Có list "top phải có"? | 🟡 | 8 hotspot, chọn từ 20 destination có `type` trong catalog |
| Q10 | Click hotspot: (a) nhảy thẳng (b) preview rồi mới nhảy | 🟡 | **(b)** — ấn tượng hơn, và là chỗ để nói về tour |
| Q11 | Có nút "bỏ qua" không? | 🟡 | Có — "Để tôi tự khám phá →", text mờ, dưới cùng |
| Q12 | Modal hiện lại lần sau? (a) luôn (b) 1 lần (c) sau 24h | 🟡 | Demo: luôn hiện + có nút reset. Production đề xuất (c) |
| Q13 | Hiện ngay hay chờ panorama load? | 🟡 | Chờ ~800ms (mock) rồi fade+scale-in 400ms |

### Button layer (YC-1 phần 2 + YC-2)

| # | Câu hỏi | TT | Giả định đang dùng |
|---|---|---|---|
| Q14 | "Chỉ đường" demo có cần mô phỏng cả split-view + routing? | 🟡 | Mô phỏng UI split-view + đường đi vẽ sẵn, **không** làm pathfinding |
| Q15 | Vị trí nút: (a) dock dưới giữa (b) rail phải dọc (c) giữ dưới-trái | 🔴 | **(a) dock dưới giữa** — xem D-05 |
| Q16 | Thêm nút nào nữa? (12 lựa chọn đã gửi khách tick) | 🔴 | Set mặc định ở [`03-components.md`](03-components.md) §3.3 |
| Q17 | "Mua vé" có là ưu tiên kinh doanh? Có link đặt vé online? | 🟡 | Có, làm CTA nổi nhất; link mock → `suoitien.vn` |

### Navbar (YC-3)

| # | Câu hỏi | TT | Giả định đang dùng |
|---|---|---|---|
| Q18 | Chốt 8 mục menu? Mục nào có dropdown, nội dung gì? | 🟡 | 8 mục như §0.4; mock dropdown cho "TRÒ CHƠI", "Dịch vụ", "Tin tức & Thư viện" |
| Q19 | Tab VR360 đặt đâu, style thế nào? | 🟡 | Sau "Trải nghiệm đặc biệt", có badge `360°`, state active |
| Q20 | Navbar trên trang VR: (a) luôn hiện (b) glass overlay (c) auto-ẩn (d) hamburger | 🔴 | **(b)+(c)** — glass overlay, tự mờ khi kéo panorama |
| Q21 | File logo (PNG/SVG nền trong)? | 🟡 | Placeholder SVG chữ "SUỐI TIÊN" + icon |
| Q22 | Item navbar click đi đâu? | 🟡 | Link thật ra `suoitien.vn`, tab VR360 = active |
| Q23 | Có top bar (hotline / social / ngôn ngữ / mua vé)? | 🟡 | Có, ẩn trên mobile |

### Design direction

| # | Câu hỏi | TT | Giả định đang dùng |
|---|---|---|---|
| Q24 | **Hex code màu chủ đạo từ Figma** | 🔴🔴 | Suy ra từ `#0e6b2e` — xem [`02-design-system.md`](02-design-system.md) §2.1 |
| Q25 | Tone: (a) light/airy (b) dark glass | 🟡 | **Hybrid**: dark glass cho control đè panorama, light cho modal/navbar |
| Q26 | Font: giữ `Be Vietnam Pro`? | 🟡 | Giữ, fallback system-ui |
| Q27 | Có brand guideline / logo variants / ảnh các khu? | 🟡 | Không có → dùng gradient placeholder cho thumbnail |
| Q28 | "Lâu Đài **Phép** Thuật" (site chính) vs "Lâu Đài **Pháp** Thuật" (catalog.json)? | ⚪ | Dùng "Phép Thuật" theo site chính |

## 0.6 Ngoài phạm vi (không làm trong prototype)

- Panorama 360° thật, tương tác kéo/zoom cube-map → dùng mock (xem [`01-architecture.md`](01-architecture.md) §1.4)
- Pathfinding thật trên `map_graph.json`
- GPS / `GeoCalib` thật
- Backend, analytics, đặt vé thật
- SEO, i18n đầy đủ, accessibility audit hoàn chỉnh (chỉ làm ARIA cơ bản)
