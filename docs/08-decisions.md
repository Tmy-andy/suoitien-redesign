> Cập nhật: 2026-07-30

# 08 — Decision Log

Mỗi quyết định: **bối cảnh → chốt gì → vì sao → đã loại phương án nào → trạng thái**.

Trạng thái: 🟢 đã chốt · 🟡 **giả định, chờ khách xác nhận** · 🔴 đang tranh luận · ⚫ đã đảo ngược

---

## D-01 · HTML/CSS/JS thuần, không dependency · 🟢 · 2026-07-30

**Bối cảnh:** Khách yêu cầu rõ "html css js thuần thôi để demo mẫu design prototype".

**Chốt:** Không npm, không build, không CDN. Classic `<script>` (không module) để
mở `file://` chạy được. Mỗi file 1 IIFE, expose vào namespace `ST`.

**Vì sao không dùng ES module:** `type="module"` bị CORS chặn khi mở `file://` →
khách double-click file là trắng trang. Classic script không bị.

**Loại:** Vite + vanilla TS (khách phải cài node), single-file 3000 dòng (không maintain được).

---

## D-02 · Prototype standalone, mock hết · 🟡 (Q1) · 2026-07-30

**Bối cảnh:** Folder `Desktop\suoitien-vr360redes` trống hoàn toàn. Không có repo thật.

**Chốt:** Dựng standalone, panorama + bản đồ + routing đều mock. Nhưng **giữ UUID
panorama thật** từ `catalog.json` trong `data.js` → port sang bản thật chỉ cần đổi
1 hàm `ST.viewer.goTo()`.

**Vì sao giữ UUID thật:** nếu dùng UUID giả thì port sang bản thật phải map lại
toàn bộ 158 điểm. Giữ thật thì `data.js` dùng lại được nguyên.

**Đảo ngược nếu:** khách nói có repo thật → copy vào rồi làm trực tiếp, bỏ mock viewer.

---

## D-03 · Không fetch asset từ site thật · 🟡 (Q2) · 2026-07-30

**Chốt:** Không load `map.jpg`, không fetch `catalog.json` qua network. Data
hardcode trong `data.js`, bản đồ là SVG tự vẽ.

**Vì sao:** demo phải chạy được khi mất mạng / trong phòng họp wifi tệ. Và `fetch()`
trên `file://` bị CORS chặn.

**Có cờ mở:** `ST.data.USE_LIVE_CATALOG = true` → fetch `catalog.json` thật (chỉ
hoạt động khi chạy qua HTTP server).

---

## D-04 · Loại bỏ màu `#1769ff` · 🟢 · 2026-07-30

**Bối cảnh:** Site thật: `#fp-launch` = `#0e6b2e` (xanh lá), `#fp-list-launch` =
`#1769ff` (xanh dương). Đây là **vấn đề cốt lõi** của YC-2.

**Chốt:** Giữ `#0e6b2e` làm `--st-brand-600`. **Bỏ hẳn** `#1769ff`. "Điểm đến"
thành nút secondary glass trắng-mờ.

**Vì sao:**
1. Xanh lá 140° + xanh dương 220° cạnh nhau, cùng độ bão hoà cao → cãi nhau, không
   có màu nào thắng, mắt không biết nhìn đâu.
2. Cả 2 đều là màu "primary" → không có hierarchy. Người dùng không biết nút nào quan trọng.
3. Xanh dương không có trong nhận diện Suối Tiên (site chính là xanh lá/teal) → nhìn
   như widget của bên thứ ba dán vào.
4. Site chính xanh lá → giữ xanh lá là "đồng bộ giao diện" đúng như YC-2 yêu cầu.

**Loại:**
- Đổi `#1769ff` sang teal `#0f766e`: vẫn 2 màu ngang hàng, vẫn không có hierarchy.
- Giữ cả 2 nhưng làm nhạt 1 cái: nửa vời, vẫn 2 hue.

**Rủi ro:** nếu Figma quy định xanh dương là secondary chính thức thì phải xem lại (Q24).

---

## D-05 · Dock dưới-giữa thay 2 FAB dưới-trái · 🟡 (Q15) · 2026-07-30

**Chốt:** `#st-dock` — 1 thanh glass ở giữa-dưới, chứa tất cả nút chính. Ẩn `#fp-fabs`.

**Vì sao:**
1. Góc dưới-trái là nơi 3DVista đặt control của nó → chồng chéo.
2. Giữa-dưới là **thumb zone** dễ với nhất trên mobile 1 tay.
3. Gộp thành 1 bề mặt → 1 bóng, 1 viền, thay vì 2 pill rời rạc cãi màu.
4. Panorama đẹp nhất ở giữa-trên → nút giữa-dưới không che chủ thể.
5. Mental model quen: Google Maps, Apple Photos, Matterport, Google Arts & Culture
   đều dùng dock dưới cho tour/media viewer.

**Loại:**
- **Rail phải dọc:** đẹp, ít chiếm chỗ, nhưng hover-để-bung-label không hoạt động
  trên mobile, và mobile phải luôn hiện label → cột dài che nhiều. Giữ làm phương
  án dự phòng nếu khách tick nhiều nút ở Q16 ([`03-components.md`](03-components.md) §3.4).
- **Giữ dưới-trái nhưng làm lại:** ít rủi ro nhất nhưng không giải quyết được vấn đề
  chồng chéo với 3DVista, và không tạo được cảm giác "làm lại" cho khách xem.
- **Top bar chứa nút:** đã có navbar ở trên, thêm nữa thì nặng đầu.

---

## D-06 · Navbar là glass overlay, không đẩy `#viewer` xuống · 🟡 (Q20) · 2026-07-30

**Chốt:** `#st-topbar` + `#st-navbar` `position: fixed`, nền glass + `backdrop-filter`.
`#viewer` vẫn full viewport, không chừa chỗ.

**Vì sao:**
1. Nếu đẩy `#viewer` xuống thì mất ~96px chiều cao → trên laptop 1366×768 chỉ còn
   672px cho panorama. VR360 cần càng nhiều pixel càng tốt.
2. `#viewer` full-viewport là **cấu hình gốc của 3DVista** (`html,body{height:100vh}`,
   `.fill-viewport{position:fixed;inset:0}`). Đổi nó = đấu với engine (bẫy 2,
   [`07-integration.md`](07-integration.md) §7.2).
3. Glass overlay cho cảm giác "app" thay vì "trang web có nav" — đúng tinh thần
   "site VR 360 chuyên nghiệp".

**Loại:**
- Navbar đặc, `#viewer` co lại: mất pixel + đấu với 3DVista.
- Chỉ hamburger: không đạt yêu cầu "clone navbar giống trang web" (YC-3).

---

## D-07 · Navbar auto-dim khi kéo panorama · 🟡 (Q20) · 2026-07-30

**Chốt:** `drag:start` → `opacity: .16` + `pointer-events: none`. Hiện lại sau 2.2s
không tương tác, hoặc khi chuột vào vùng top 100px, hoặc khi Tab focus vào.

**Vì sao:** navbar glass vẫn che ~96px của panorama. Khi user đang kéo xem thì họ
không cần navbar → cho nó biến đi. Nhưng phải quay lại **cực dễ** nếu không thì
user tưởng navbar mất luôn.

**Vì sao có case "Tab focus":** nếu chỉ dựa vào chuột thì user dùng bàn phím không
bao giờ thấy navbar → fail accessibility.

**Rủi ro:** 3DVista có thể `stopPropagation` pointer event → phải bind capture phase
(R1 ở [`07-integration.md`](07-integration.md) §7.8).

---

## D-08 · Bản đồ welcome là SVG stylized, không dùng `map.jpg` · 🟡 (Q8) · 2026-07-30

**Chốt:** Tự vẽ `assets/map/park-map.svg`, layer: cỏ → hồ → đường → khối kiến trúc
→ nhãn → hotspot.

**Vì sao:**
1. Khách viết rõ **"bản đồ 2D (mô phỏng thôi)"** → không cần đúng địa hình.
2. `map.jpg` 1.19 MB → chậm, và nó là ảnh chụp/vẽ chi tiết, hotspot đè lên sẽ bị
   lẫn vào nền, giảm độ nổi bật.
3. SVG stylized nhìn "designed", đúng mục tiêu "gây ấn tượng mạnh". Màu bản đồ có
   thể lấy từ palette brand → đồng bộ tuyệt đối.
4. SVG scale vô hạn, đổi màu theo token, nhẹ ~15 KB.

**Loại:**
- `map.jpg` + hotspot: nặng, hotspot lẫn nền, và không kiểm soát được màu.
- Ảnh mờ/placeholder: nhanh nhưng không gây ấn tượng — trái mục tiêu chính.

**Ghi chú port:** toạ độ hotspot lưu bằng `%` → đổi nền sang `map.jpg` ở bản thật
chỉ cần đổi bộ số, không sửa logic ([`06-data.md`](06-data.md) §6.5).

---

## D-09 · Mô phỏng UI split-view, KHÔNG làm pathfinding · 🟡 (Q14) · 2026-07-30

**Bối cảnh:** Site thật có routing thật (`map_graph.json`), GPS (`GeoCalib`),
split-view kéo được. Đây là app bản đồ đầy đủ, không phải nút trang trí.

**Chốt trong prototype:**
- ✅ **Có** mô phỏng split-view + divider kéo được (đây là tính năng "wow", khách nên thấy)
- ✅ **Có** vẽ đường đi (path SVG dashed animate)
- ❌ **Không** pathfinding — dùng 3 path hardcode + fallback đường thẳng bo góc
- ❌ **Không** GPS thật — toast + marker ở toạ độ hardcode
- Khoảng cách: `path.getTotalLength()` × hệ số scale hardcode

**Vì sao:** prototype để **xem design**, không phải để dùng thật. Pathfinding
không đổi gì về mặt thị giác nhưng tốn nhiều công. Còn split-view thì thay đổi
layout rất mạnh → phải demo được.

---

## D-10 · Preview panel trước khi nhảy điểm · 🟡 (Q10) · 2026-07-30

**Chốt:** Click hotspot → preview panel (thumbnail + tên + type + mô tả + nút "Đi đến"),
rồi mới nhảy. Không nhảy thẳng.

**Vì sao:**
1. Mục tiêu YC-1 có 2 phần: *chọn điểm* **và** *"nói cho người dùng về tour VR360
   trong 3 giây đầu"*. Preview panel chính là chỗ để "nói" — không có nó thì modal
   chỉ là cái menu.
2. Chống click nhầm: nhảy thẳng thì bấm sai hotspot là mất modal, phải reload.
3. Cho user "nhìn quanh" nhiều điểm trước khi quyết → tăng thời gian trong modal,
   tăng cảm giác "công viên này nhiều thứ hay".

**Chi phí:** thêm 1 click. Giảm bằng cách hover cũng hiện preview (desktop) → user
xem được nhiều điểm mà không cần click.

**Loại:** nhảy thẳng — nhanh hơn nhưng bỏ mất mục tiêu "nói về tour".

---

## D-11 · Bản thật: giữ `floorplan`, chỉ thay vỏ (PA-B) · 🟡 · 2026-07-30

**Chốt:** Khi port, không xoá `floorplan.js/dc.html`. Ẩn `#fp-fabs`, dock mới gọi
lại handler cũ, re-skin `#fp-overlay` bằng CSS override.

**Vì sao:** `floorplan.dc.html` là 173 KB React component đã hoàn thiện với
pathfinding + GPS. Viết lại là hàng tuần công việc và rủi ro rất cao. Re-skin đạt
được 90% mục tiêu thị giác với 10% công.

**Loại:** thay hoàn toàn (mất chức năng), không chạm gì (không đạt YC-2).

Chi tiết 3 phương án: [`07-integration.md`](07-integration.md) §7.5.

---

## D-12 · Accent vàng kim cho CTA · 🟡 (Q24) · 2026-07-30

**Chốt:** `--st-accent-500 = #f5a623` — dùng cho nút "Mua vé" và ring hotspot must-see.
Đây là **màu accent duy nhất** trên toàn UI.

**Vì sao:**
1. Vàng bổ trợ xanh lá (không cãi nhau như xanh dương).
2. Nổi nhất khi đè lên panorama công viên (nền chủ yếu xanh lá + xanh trời).
3. Khớp theme văn hoá–tâm linh của Suối Tiên: "Cung Vàng Điện Ngọc", "Phụng Hoàng
   Tiên", "Kỳ Lân Cung" — vàng kim là màu của cung đình.
4. Chỉ 1 accent → nó luôn có nghĩa "cái này quan trọng nhất". Thêm accent thứ 2 là
   mất tác dụng.

**Ràng buộc bắt buộc:** chữ trên nền accent **luôn** là `--st-accent-ink #3d2600`,
không bao giờ trắng (trắng/vàng = 2.1:1, fail WCAG AA).

---

## D-13 · Chờ 800ms rồi mới mở welcome · 🟡 (Q13) · 2026-07-30

**Chốt:** `viewer:ready` → chờ 800ms → mở modal.

**Vì sao:** khách viết "ngay lập tức", nhưng nếu modal mở lúc panorama còn đen thì
`backdrop-filter: blur()` không có gì để blur → mất hoàn toàn hiệu ứng "kính mờ
trên ảnh 360°", trông như trang lỗi tải. 800ms đủ để panorama vẽ frame đầu, và
user chưa cảm thấy phải chờ. Vẫn nằm gọn trong ngân sách "3 giây đầu" của khách.

**Cần xác nhận với khách** — đây là chỗ tôi cố ý làm khác brief, có lý do.

---

## D-14 · Không đóng welcome bằng click scrim · 🟢 · 2026-07-30

**Chốt:** `#st-welcome` chỉ đóng bằng nút skip, nút ×, hoặc Esc. Click ra scrim
**không** đóng. (Các modal khác thì đóng bằng scrim bình thường.)

**Vì sao:** đây là onboarding, chỉ hiện 1 lần. Click nhầm ra ngoài là mất luôn
cơ hội gây ấn tượng — mà đó là mục tiêu số 1 của YC-1.

---

## D-15 · Thêm `#st-scene-label` (site thật không có) · 🟢 · 2026-07-30

**Chốt:** Thêm chip hiện tên điểm hiện tại + `4/158` ở góc dưới-trái.

**Vì sao:** đây là lỗ UX lớn của site hiện tại — 158 panorama mà không chỗ nào cho
biết đang ở đâu. User nhảy 3–4 điểm là mất phương hướng hoàn toàn. Khách không yêu
cầu nhưng nó thuộc mục tiêu "giao diện chuyên nghiệp".

**Ngoài scope brief** — nếu khách không muốn thì xoá 1 file, không ảnh hưởng gì.

---

## D-16 · Icon 1 hệ stroke 1.75 duy nhất · 🟢 · 2026-07-30

**Chốt:** Toàn bộ icon: `stroke`, `stroke-width: 1.75`, `linecap/linejoin: round`,
viewBox `0 0 24 24`, không `fill`.

**Vì sao:** site thật đang lỗi chỗ này — `#fp-launch` dùng `fill`, `#fp-list-launch`
dùng `stroke` width 2 → 2 icon cạnh nhau nhìn khác hệ, một cái "đặc" một cái "nét".
Đây là loại chi tiết mà khách không chỉ ra được nhưng cảm nhận được là "chưa
chuyên nghiệp".

---

## D-17 · Chỉ 1 modal mở tại 1 thời điểm · 🟢 · 2026-07-30

**Chốt:** Mở modal mới thì tự đóng modal đang mở. Ngoại lệ: `#st-drawer` và
`#st-toast` xếp trên được.

**Vì sao:** modal lồng modal → focus trap lồng nhau, Esc không biết đóng cái nào,
scrim đè scrim tối đen. Bug rất khó sửa. Cấm từ đầu ở tầng engine.

Ma trận đầy đủ: [`04-modals.md`](04-modals.md) §4.12.

---

## D-18 · Search bỏ dấu tiếng Việt · 🟢 · 2026-07-30

**Chốt:** `#st-places-search` normalize `NFD` + xoá diacritic ở cả query và tên điểm.

**Vì sao:** người Việt gõ tìm kiếm phần lớn **không dấu** ("lau dai tuyet"). Nếu
so khớp có dấu thì đa số lần tìm ra 0 kết quả → user tưởng site lỗi. Với 158 điểm
thì search là đường chính để tìm, không phải phụ.

---

## D-19 · Gộp destination trùng tên thành "N góc nhìn" · 🟢 · 2026-07-30

**Bối cảnh:** `catalog.json` có `caubachtuong` ×4, `bienngocnu` ×2, `amcung` ×2 —
cùng `name`, khác `pano`.

**Chốt:** Gộp theo tên, badge "4 góc nhìn", click mở góc đầu tiên.

**Vì sao:** list hiện 4 card "Cầu Bạch Tượng" giống hệt nhau → user tưởng data lỗi,
không biết chọn cái nào. Đây là **nhiều góc nhìn của cùng 1 chỗ**, thông tin đó
phải nói ra thay vì để user tự đoán.

---

## D-20 · Prototype chỉ nhồi 40/158 điểm vào `data.js` · 🟡 · 2026-07-30

**Chốt:** 20 điểm highlight (có `type`) + ~20 điểm thường. Label vẫn hiện "158"
qua `ST.data.TOTAL_REAL`.

**Vì sao:** copy 158 entry vào `data.js` → file ~700 dòng data thuần, khó đọc, và
không thêm giá trị demo nào (40 điểm đã đủ để demo search, filter, lazy-load, gộp
trùng tên).

**Rủi ro:** khách đếm card thấy không đủ 158 → cần nói trước, hoặc bật
`USE_LIVE_CATALOG` khi demo qua HTTP.

---

## D-21 · `TYPE_META` dùng màu ngoài palette brand · 🟡 · 2026-07-30

**Chốt:** Gradient thumbnail theo `type` dùng tím / đỏ / xanh dương — ngoài palette.

**Vì sao:** đây là màu **phân loại dữ liệu**, không phải màu UI. 10 loại mà chỉ
dùng thang xanh lá thì không phân biệt được. Và chúng chỉ xuất hiện dưới dạng
thumbnail nhỏ trong card, không bao giờ là bề mặt lớn.

**Đảo ngược nếu:** khách thấy loạn màu → đổi hết về `--st-brand-*` + `--st-accent-*`
với độ đậm khác nhau, chấp nhận khó phân biệt hơn.

---

## D-22 · `#st-rail` hoãn sang v2 · 🟢 · 2026-07-30

**Chốt:** Không code rail phải trong v1. Chỉ có dock.

**Vì sao:** 2 vùng control (dock dưới + rail phải) cạnh tranh sự chú ý, user không
biết nhìn đâu. Dock đủ chỗ cho 6–7 nút. Chỉ mở rail nếu khách tick > 8 nút ở Q16.

---

## Nhật ký sửa đổi

| Ngày | Thay đổi |
|---|---|
| 2026-07-30 | Tạo file. D-01 → D-22 từ phân tích site thật + brief khách. Chưa có xác nhận nào từ khách → mọi D liên quan tới Q đều 🟡. |
