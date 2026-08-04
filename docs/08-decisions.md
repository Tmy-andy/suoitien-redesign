> Cập nhật: 2026-08-04 (v16 — thêm D-55 chuyển động + 5 thẻ + ảnh nguồn, D-56 danh
> sách thành thẻ ảnh. v15 — D-54: nền trắng phẳng 2 bản, nút bản đồ lên hàng
> tìm kiếm, thẻ carousel suy từ chiều cao)

# 08 — Decision Log

Mỗi quyết định: **bối cảnh → chốt gì → vì sao → đã loại phương án nào → trạng thái**.

Trạng thái: 🟢 khách đã xác nhận · 🔵 tôi chốt, khách nói "tùy bạn" · 🟡 giả định chờ
xác nhận · 🔴 đang tranh luận · ⚫ **đã đảo ngược**

---

## D-01 · HTML/CSS/JS thuần, không build tool · 🟢

**Chốt:** Không npm, không bundler. Classic `<script>` (không `type="module"`), mỗi
file 1 IIFE, expose vào namespace `ST`.

**Vì sao không ES module:** `type="module"` bị CORS chặn khi mở `file://` → khách
double-click là trắng trang.

**Ngoại lệ duy nhất:** Google Fonts CDN cho `Arima Madurai` — vì Q26 yêu cầu font của
site chính, và site chính cũng nạp từ CDN đó. Có `@font-face` local fallback + font
stack hệ thống nếu offline.

**Loại:** Vite + vanilla TS · single-file 3000 dòng.

---

## D-02 · Prototype chỉ dựng phần thay đổi · 🟢 (Q1)

**Khách:** *"Chạy độc lập riêng những phần cần điều chỉnh thôi"*

**Chốt — prototype v1 gồm đúng 3 thứ:**
1. Header (topbar vàng + navbar xanh + tab VR360 + `#st-nav-peek`)
2. Modal welcome (3 biến thể + bản đồ + 8 hotspot + morph về nút)
3. Dock nút dưới-giữa (hợp nhất)

trên nền panorama mock. **Không** dựng lại overlay chỉ đường / danh sách điểm đến /
sidebar trái — chúng đã hoàn thiện (ảnh 2–5).

**Tiết kiệm:** bỏ 2 overlay lớn khỏi phạm vi ≈ giảm hơn nửa khối lượng code.

**Giữ UUID panorama thật** từ `catalog.json` trong `data.js` → port sang bản thật chỉ
đổi 1 hàm `ST.viewer.goTo()`.

---

## D-03 · Được dùng asset thật · 🟢 (Q2)

**Khách:** *"được, nếu bạn lấy được thì được"*

**Chốt:** Dùng logo PNG thật (`suoitien.vn/…/logosuoitien.png`), Google Fonts thật,
URL social thật, link mua vé thật. Vẫn có fallback offline cho mọi thứ (logo →
wordmark SVG, font → system stack, catalog → data hardcode).

**Cờ:** `ST.data.USE_LIVE_CATALOG = false` — bật thì fetch `catalog.json` thật (chỉ
chạy qua HTTP server).

---

## D-04 · Loại bỏ `#1769ff` · 🟢

**Bối cảnh:** Trang VR: `#fp-launch` = `#0e6b2e` xanh lá, `#fp-list-launch` =
`#1769ff` **xanh dương**. Đây là vấn đề cốt lõi của YC-2.

**Chốt:** Bỏ hẳn `#1769ff`. "Điểm đến" thành nút **secondary outline xanh brand**.

**Vì sao:**
1. Xanh lá 130° + xanh dương 220°, cùng độ bão hoà cao, cạnh nhau → cãi nhau, không
   màu nào thắng.
2. Cả 2 đều "primary" → không có hierarchy, user không biết nút nào quan trọng.
3. **Xanh dương không tồn tại trong nhận diện Suối Tiên** — `style.css` của site
   chính có 0 lần dùng xanh dương làm màu UI. Nhận diện là xanh lá + vàng + đỏ.
4. Cụm 4 nút dưới-giữa (ảnh 5) **đã** dùng xanh lá + trắng → 2 nút này mới là cái lệch.

**Loại:** đổi sang teal (vẫn 2 hue ngang hàng) · làm nhạt 1 cái (nửa vời).

---

## D-05v2 · ⚫ ĐẢO NGƯỢC — Hợp nhất vào dock dưới-giữa CÓ SẴN · 🔵 (Q15)

**D-05 (v1) đã sai:** tôi đề xuất "dời 2 nút sang dưới-giữa" khi tưởng chỗ đó trống.
Ảnh 5 cho thấy **dưới-giữa đã có cụm 4 nút** (VR · compass · sound · fullscreen).

**Chốt v2:** Không "dời" mà **hợp nhất**: gộp 2 nút Chỉ đường/Điểm đến **vào cùng 1
pill** với 4 nút có sẵn, chia nhóm bằng divider.

```
╭─────────────────────────────────────────────────────────╮
│ ⛊Chỉ đường │ ☰Điểm đến │ ⊕ │┊│ (VR)(◎)(🔇)(⛶) │┊│ ⋯ │
╰─────────────────────────────────────────────────────────╯
   ── ĐIỀU HƯỚNG (mới) ──      ── XEM (đã có) ──     thêm
```

**Vì sao đây là "sự đồng bộ" khách yêu cầu:**
1. Cụm 4 nút có sẵn **đã dùng đúng ngôn ngữ của site chính**: trắng + xanh `#128125`
   + bo tròn. Ta lấy ngôn ngữ đó áp cho 2 nút đang lệch, chứ không phát minh mới.
2. Từ **5 cụm control rời rạc → 3 vùng**. Đây là thay đổi lớn nhất về cảm nhận
   "chuyên nghiệp".
3. 2 nút quan trọng nhất chuyển từ góc (dễ bỏ qua, dễ đè nút 3DVista) vào **trung
   tâm thumb zone**.
4. 1 bề mặt = 1 bóng, 1 viền. Thay vì 2 pill rời + 1 pill khác cách 200px.
5. Divider giữ được phân nhóm ngữ nghĩa: điều hướng ≠ điều khiển xem.

**Loại:**
- Giữ dưới-trái, chỉ đổi màu: giải quyết màu nhưng **không** giải quyết "5 cụm rời rạc",
  mà đó mới là gốc của cảm giác thiếu đồng bộ.
- Rail phải dọc: cụm E đã ở đó (ảnh 5) → sẽ thành cụm thứ 6.
- Đưa lên navbar: navbar đã là clone site chính, nhồi nút VR vào là phá tính "đồng bộ".

---

## D-06 · Navbar là overlay, không đẩy `#viewer` · 🟢 (Q20)

**Chốt:** `#st-header` `position: fixed`, `#viewer` vẫn full viewport.

**Vì sao:**
1. Header 104px → trên laptop 1366×768 chỉ còn 664px cho panorama.
2. `#viewer` full-viewport là **cấu hình gốc 3DVista** (`.fill-viewport{position:fixed;inset:0}`).
   Đổi nó = đấu với engine (bẫy 2, [`07-integration.md`](07-integration.md) §7.2).
3. Q20 chọn (c)+(d) = tự ẩn + có nút mở lại → hàm ý header **không** chiếm chỗ cố định.

**Khác v1:** topbar **nền vàng đặc** (không glass) vì đó là màu thật của site chính
(`#DEA800`) và nó chỉ 46px.

---

## D-07v2 · ⚫ ĐẢO NGƯỢC — Header slide lên + `#st-nav-peek` · 🟢 (Q20)

**Khách:** *"kết hợp c+d. Khi tương tác thì ẩn đi bằng animation thu lên trên. Có nút
mũi tên kép animation di chuyển xuống để người dùng biết chỗ click mở navbar lại"*

**Chốt v2:**
- Ẩn = `transform: translateY(-100%)` toàn bộ `#st-header` (**không** phải fade opacity như v1)
- Component mới `#st-nav-peek`: tab `56×26px` ở đỉnh giữa, icon `⌄⌄`, animation
  **nhấp nhô xuống** `1.6s infinite`
- **Bỏ timer auto-hiện 2.2s** của v1

**Vì sao cách của khách tốt hơn v1:**
1. `translateY` cho cảm giác "cái thanh trượt đi" — có logic không gian. Fade opacity
   thì header "biến mất bí ẩn", user không biết nó đi đâu.
2. Auto-hiện sau 2.2s = **thứ tự nhảy ra trước mắt user** khi họ đang xem panorama.
   Có nút chủ động thì user kiểm soát hoàn toàn.
3. Mũi tên nhấp nhô là affordance rõ ràng — không cần hướng dẫn.

**Vẫn giữ từ v1:** hiện lại khi chuột vào vùng top 56px, khi `Tab` focus (bắt buộc
cho a11y), khi modal mở (lock).

**Rủi ro:** 3DVista có thể `stopPropagation` pointer event → bind capture phase
(R1 ở [`07-integration.md`](07-integration.md) §7.8).

---

## D-08 · ⚫ ĐÃ ĐẢO NGƯỢC (D-44) · Bản đồ welcome SVG stylized, làm thêm bản dùng map thật

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03.** M1 không còn bản đồ; cả SVG stylized lẫn biến thể
> `?map=real` đều đã gỡ. Xem **D-44**. Giữ nguyên mục này làm lịch sử.

**Khách chọn (b) SVG stylized.** Nhưng ảnh 2–3 cho thấy khách **đã có bản đồ 3D minh
hoạ rất đẹp** với pin số.

**Chốt:** Làm SVG như khách chọn, **và** làm biến thể `?map=real` dùng bản đồ thật →
khách so sánh trực tiếp trong demo rồi quyết.

**Vì sao vẫn làm SVG:** khách viết rõ "mô phỏng thôi", SVG nhẹ (~15 KB vs 1.2 MB),
màu lấy từ token brand nên đồng bộ tuyệt đối, hotspot nổi rõ trên nền đơn giản.

**Vì sao nên cân nhắc bản thật:** bản đồ 3D của khách đẹp hơn bất cứ gì tôi vẽ được,
và nó **đã là tài sản của thương hiệu** — dùng nó thì modal welcome vừa ấn tượng vừa
liên thông với overlay chỉ đường (cùng bản đồ → user không phải học lại).

Toạ độ hotspot lưu bằng `%` → đổi nền không phải sửa logic.

---

## D-09v2 · ⚫ ĐÃ ĐẢO NGƯỢC bởi D-43 — Overlay chỉ đường & danh sách ra khỏi phạm vi · (Q1 + Q14)

**v1 định mô phỏng** split-view + routing + list. **v2 bỏ hẳn** — ảnh 2–4 cho thấy
chúng đã hoàn thiện hơn tôi tưởng nhiều (bilingual, step-by-step có icon rẽ, summary
khoảng cách/thời gian, 6 chip filter, thu gọn sidebar, rail 5 nút).

**Prototype chỉ có:** nút mở (đúng style mới) + panel giữ chỗ + toast giải thích.

**Vì sao:** Q1 nói rõ "riêng những phần cần điều chỉnh thôi". Dựng lại cái đã tốt là
lãng phí và còn có nguy cơ demo **kém hơn** bản thật → phản tác dụng khi trình khách.

> ⚫ **2026-08-01 — khách yêu cầu clone luôn.** Xem D-43. Lập luận trên không sai,
> nhưng nó trả lời câu hỏi *"có nên dựng lại để dùng không"*; câu hỏi thật của khách
> là *"demo bấm vào nút thì thấy gì"*. Panel giữ chỗ làm đứt mạch trình bày.

---

## D-10 · ⚫ ĐẢO NGƯỢC — Click hotspot nhảy thẳng, không preview panel · 🟢 (Q10)

**v1 chốt (b) có preview panel.** Khách chọn **(a) nhảy thẳng**.

**Chốt v2:** Click hotspot → đóng modal (morph) → nhảy scene. Không nút xác nhận.

**Bù lại phần "nói về tour":** thêm `.st-hotspot-card` hiện khi **hover/focus** (tên
+ phân loại + 1 câu blurb + "Bấm để đến đây →"). Vẫn truyền tải thông tin mà **không
thêm click nào**.

**Lợi ích ngoài dự kiến:** bỏ panel bên phải → bản đồ chiếm **toàn bộ** chiều rộng
modal → to hơn ~38%, ấn tượng hơn. Quyết định của khách tốt hơn của tôi.

**Bù rủi ro click nhầm:** nút `#st-welcome-reopen` (Q12) cho phép mở lại bản đồ bất
cứ lúc nào → click nhầm không còn là mất mát.

---

## D-11 · Bản thật: giữ `floorplan`, chỉ thay vỏ (PA-B) · 🔵

**Chốt:** Khi port, không xoá `floorplan.js/dc.html`. Ẩn `#fp-fabs`, dock mới gọi lại
handler cũ, re-skin `#fp-overlay` bằng CSS override.

**Vì sao:** `floorplan.dc.html` là 173 KB React component với pathfinding + GPS +
split-view + bilingual. Viết lại là hàng tuần công việc, rủi ro cao. Re-skin đạt 90%
mục tiêu thị giác với 10% công.

3 phương án đầy đủ: [`07-integration.md`](07-integration.md) §7.5.

---

## D-12v2 · Vàng `#DEA800` là màu brand thật, không phải accent tôi chọn · 🟢 (Q24)

**v1 tôi tự chọn `#f5a623`** vì "bổ trợ xanh lá + gợi cung điện". **Hoá ra site chính
dùng `#DEA800` cho toàn bộ topbar** — gần y hệt, nhưng giờ là màu **thật**.

**Chốt:** `--st-gold-500 = #DEA800` (topbar) · `--st-gold-300 = #FBD255` (nền nút vé)
· `--st-red-500 = #EB0029` (chữ trên nút vé).

**Quy tắc 3-1:** trên 1 màn hình tối đa **1 vùng vàng** (cụm CTA vé) + **1 vùng đỏ**
(chữ trong nút đó). Còn lại xanh lá + trắng.

**Ràng buộc cứng:** chữ trên nền vàng dùng `#EB0029` (4.6:1 — đúng site) hoặc
`--st-n-900` (9.1:1). **Không bao giờ trắng** (2.3:1 — fail WCAG).

---

## D-13 · Chờ 800ms rồi mới mở welcome · 🟢 (Q13 — "theo bạn đề xuất đi")

**Chốt:** `viewer:ready` → chờ 800ms → mở modal.

**Vì sao:** khách viết "ngay lập tức", nhưng modal mở lúc panorama còn đen thì
`backdrop-filter: blur()` không có gì để blur → mất hoàn toàn hiệu ứng kính mờ trên
ảnh 360°, trông như trang lỗi tải. 800ms đủ để panorama vẽ frame đầu, user chưa cảm
thấy phải chờ. Vẫn trong ngân sách "3 giây đầu".

Khách đã đồng ý.

---

## D-14 · Không đóng welcome bằng click scrim · 🔵

**Chốt:** `#st-welcome` chỉ đóng bằng skip / × / Esc / chọn hotspot. Click scrim
**không** đóng. Các modal khác thì đóng bằng scrim bình thường.

**Vì sao:** onboarding, và với Q12 = "chỉ hiện 1 lần" thì click nhầm ra ngoài là mất
luôn cơ hội gây ấn tượng — mục tiêu số 1 của YC-1.

**Giảm nhẹ:** `#st-welcome-reopen` cho mở lại → không còn là mất vĩnh viễn.

---

## D-15 · Thêm `#st-scene-label` (site thật không có) · 🔵

**Chốt:** Chip hiện tên điểm hiện tại + `4/158` ở góc dưới-trái.

**Vì sao:** lỗ UX lớn của trang VR hiện tại — hơn 150 panorama mà không chỗ nào cho
biết đang ở đâu. User nhảy 3–4 điểm là mất phương hướng.

**Ngoài brief** — nếu khách không muốn thì xoá 1 file, không ảnh hưởng gì.

---

## D-16 · Icon 1 hệ stroke 1.75, đặt trong circle viền xanh · 🟢

**Chốt:** Mọi icon `stroke`, `stroke-width: 1.75`, `linecap/linejoin: round`, viewBox
`0 0 24 24`, không `fill`. Trong dock thì bọc trong circle `40px` viền
`1.75px --st-green-600`.

**Vì sao:**
1. Trang VR hiện lỗi chỗ này: `#fp-launch` dùng `fill`, `#fp-list-launch` dùng `stroke`
   width 2 → 2 icon cạnh nhau nhìn khác hệ.
2. Circle viền xanh là **copy ngôn ngữ của cụm 4 nút có sẵn** (ảnh 5) → đồng bộ.

---

## D-17 · Chỉ 1 modal mở tại 1 thời điểm · 🔵

**Chốt:** Mở modal mới thì tự đóng modal đang mở. Ngoại lệ: `#st-drawer`, `#st-toast`.

**Vì sao:** modal lồng modal → focus trap lồng nhau, Esc không biết đóng cái nào,
scrim đè scrim tối đen. Cấm từ tầng engine.

---

## D-18 · Search bỏ dấu tiếng Việt · 🔵

**Chốt:** Normalize `NFD` + xoá diacritic ở cả query và tên điểm.

**Vì sao:** người Việt gõ tìm kiếm phần lớn không dấu ("lau dai tuyet"). Với hơn 150
điểm thì search là đường chính để tìm.

**Lưu ý:** overlay danh sách thật đã ngoài phạm vi (D-09v2) → quy tắc này chỉ áp cho
search trong prototype nếu có, và là **khuyến nghị cho bản thật**.

---

## D-19 · Gộp destination trùng tên thành "N góc nhìn" · 🔵

**Bối cảnh:** `catalog.json` có `caubachtuong` ×4, `bienngocnu` ×2, `amcung` ×2 —
cùng `name`, khác `pano`.

**Chốt:** Gộp theo tên, badge "4 góc nhìn", click mở góc đầu tiên.

**Vì sao:** hiện 4 card giống hệt nhau → user tưởng data lỗi. Đây là nhiều góc nhìn
của cùng 1 chỗ, thông tin đó phải nói ra.

---

## D-20 · Prototype nhồi 40/158 điểm · 🟡

**Chốt:** 20 điểm highlight (có `type`) + ~20 điểm thường. Label vẫn hiện "hơn 150"
qua `ST.data.TOTAL_REAL = 158` (Q7).

**Vì sao:** 158 entry = ~700 dòng data thuần trong `data.js`, không thêm giá trị demo
nào — nhất là khi overlay danh sách đã ngoài phạm vi (D-09v2). Modal welcome chỉ cần 8.

---

## D-21v2 · Gradient placeholder theo phân loại, dùng thang brand · 🟢 (Q27 = không có ảnh)

**v1 dùng tím/đỏ/xanh dương cho gradient thumbnail.** Bỏ — vì giờ đã biết nhận diện
thật chỉ có 3 màu.

**Chốt:** Gradient dẫn từ 3 màu brand + độ đậm khác nhau:

```
tham quan      → #128125 → #65A723   (xanh lá)
cảm giác mạnh  → #D6282E → #FF7B01   (đỏ → cam)
văn hoá        → #DEA800 → #FBD255   (vàng)
ăn uống        → #FF7B01 → #FBD255   (cam → vàng)
tiện ích       → #475569 → #94A3B8   (xám)
trò chơi       → #0e6b2e → #169e2c   (xanh đậm)
```

**Vì sao:** phân biệt được 6 nhóm mà **không** ra khỏi palette. Ảnh 4 cho thấy site
thật cũng color-code tên điểm theo nhóm → cùng ý tưởng, nhưng ta giới hạn trong brand.

---

## D-22 · ❌ Bỏ `#st-rail` · 🟢

**Chốt:** Không làm rail nút phụ bên phải, cả v1 và v2.

**Vì sao:** ảnh 5 cho thấy **cụm E đã ở đó** (2 nút tròn phải-giữa) và ảnh 2–3 cho
thấy overlay chỉ đường **cũng có rail 5 nút bên phải**. Thêm rail của ta = cụm thứ 6.
Dock đủ chỗ.

---

## D-23 · Hệ 2 font: Arima Madurai + Be Vietnam Pro · 🔵 (Q26) ⭐

**Bối cảnh:** Q26 = "lấy font của suoitien.vn" → `Arima Madurai` (đã verify có
subset `vietnamese`). Nhưng đây là font **display/decorative** (Google phân loại
`cursive`).

**Chốt:**
```css
--st-font-display: 'Arima Madurai', 'Be Vietnam Pro', system-ui, cursive;
--st-font-ui:      'Be Vietnam Pro', -apple-system, 'Segoe UI', Roboto, sans-serif;
```

| Arima Madurai | Be Vietnam Pro |
|---|---|
| Logo, item navbar, tiêu đề modal, label nút chính, tên điểm | Body, danh sách, chỉ dẫn từng chặng, input, chip, toast |

**Vì sao không dùng Arima cho tất cả:** ở 13–15px cho danh sách hơn 150 điểm hoặc
chỉ dẫn ("Đi ~40 m rồi rẽ phải (gần j9)"), font display khó đọc — chữ Việt nhiều dấu
càng khó. **Trang VR hiện tại đã dùng `Be Vietnam Pro`** (`vr-360/fonts.css`) đúng vì
lý do này.

**Kết quả:** nav + heading giống hệt site chính (đồng bộ như yêu cầu), phần dày chữ
vẫn đọc được.

**Cần khách xác nhận** — nếu khách muốn Arima cho 100% thì đổi 1 token, nhưng tôi
khuyến nghị không.

---

## D-24 · Copy y hệt 3 chi tiết nhận diện của navbar · 🟢 (YC-3)

**Chốt:** Clone chính xác từ `style.css`, không "cải tiến":
1. `border-radius: 50px` (pill hoàn toàn) + `width: 90%`
2. `box-shadow: 0 2px 0 #E7313B` — đường đỏ 2px dưới navbar
3. `::after` vệt gradient `#D9242C → trắng → #D9242C`, `height: 5px; bottom: -3px;
   width: 49%; border-radius: 1000%`
4. Chữ nav **trắng + bold + UPPERCASE**, gạch chân hover gradient trắng mờ dần, `.3s`
5. Submenu **cùng màu xanh** navbar (không phải trắng), `min-width: 240px`, chữ `14px`
   thường
6. Logo **ở giữa** navbar, tràn lên trên

**Vì sao không "làm đẹp hơn":** YC-3 nói "clone navbar ra". Đường đỏ + vệt gradient
là chi tiết mà nếu bỏ thì navbar mất "chất Suối Tiên" ngay — nó là thứ phân biệt với
mọi navbar xanh lá khác. Tối giản hoá ở đây là **phá** yêu cầu đồng bộ.

---

## D-25 · Copy animation viền chạy của nút "Mua vé" · 🔵 (Q16, Q17)

**Chốt:** Nút `#st-cta-ticket` + `#st-cta-combo` dùng lại `animate1..4` của site:
4 `<span>` gradient `#D6282E → #128125`, `2s linear infinite`, lệch pha `0s/1s`.

**Vì sao:** đây là micro-interaction đặc trưng nhất của site chính. Tái dùng → user
nhận ra ngay "cùng một thương hiệu", đúng mục tiêu YC-2/YC-3. Và nó thu hút mắt tới
CTA quan trọng nhất mà không cần nhấp nháy thô.

---

## D-26 · Bỏ cụm A (VN + share) của trang VR · 🟡 (Q-35)

**Chốt:** Bỏ 2 nút góc trên-phải. VI/EN dời lên `#st-topbar` (đồng bộ site chính),
share dời vào popover `⋯` của dock.

**Vì sao:** header mới cao 104px sẽ **che hoàn toàn** cụm A. Và có 2 chỗ đổi ngôn ngữ
(cụm A + topbar) là dư thừa gây nhầm lẫn.

**Cần khách xác nhận** — chạm vào code hiện có.

---

## D-27 · i18n từ đầu, không bolt-on · 🟢 (Q4 = "cần")

**Chốt:** Mọi text trong DOM dùng `data-i18n="key"` / `data-i18n-aria="key"`.
`ST.i18n.apply()` quét và thay. Data ở `COPY.vi` + `COPY.en`. Lưu
`localStorage['st.lang']`. Không thư viện.

**Vì sao làm ngay từ v1:** thêm i18n sau khi đã hardcode 200 chuỗi tiếng Việt là
việc rất tốn công và dễ sót. Và ảnh 2–4 cho thấy overlay thật **đã bilingual** → nếu
prototype chỉ có tiếng Việt thì nhìn kém hoàn thiện hơn bản thật.

---

## D-28 · Dùng 6 chip phân loại THẬT, không dùng 10 `type` của catalog · 🟡 (Q-29)

**Bối cảnh:** ảnh 4 cho thấy overlay thật dùng 6 chip: `Tất cả · Trò chơi · Tham
quan · Văn hoá · Ăn uống · Tiện ích`. Còn `catalog.json` có 10 `type` khác hẳn
(`vào cổng`, `cảm giác mạnh`, `chọn 1 trong 2`…).

**Chốt:** Dùng **bộ 6 thật**. `type` của `catalog.json` chỉ dùng nội bộ để chọn icon.

**Vì sao:** đó là cái user đang thấy và hiểu. Prototype dùng bộ khác sẽ tạo mâu thuẫn
khi so với bản thật.

**Suy luận:** overlay thật đọc từ `map/map_places.json` (có số thứ tự + tên EN +
category), không phải từ `catalog.json`. → `catalog.json` có thể là data cũ/phụ.
**Cần khách xác nhận nguồn nào là chuẩn.**

---

## D-29 · ⚫ ĐÃ ĐẢO NGƯỢC (D-46) · Modal welcome hiện 1 lần + morph về nút · 🟢 (Q12)

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03 (D-46).** Không còn dock để morph co về, và nút mở lại (nếu trang cha có) nằm ở document khác — không đo `getBoundingClientRect()` qua ranh giới iframe được.
> Giữ nguyên mục này làm lịch sử.

**Khách:** *"(b) nhưng… lúc tắt thì nó sẽ thu nhỏ thành 1 nút cạnh 2 nút điểm đến
kia. Bấm vào thì mở lên lại"*

**Chốt:** `localStorage['st.welcome.seen']` → chỉ hiện lần đầu. Đóng → animate FLIP
morph panel co về `#st-welcome-reopen` trong dock. Click nút → morph ngược.

**Vì sao ý này của khách rất tốt:** nó giải quyết **cùng lúc** 3 vấn đề mà tôi đang
lo riêng lẻ:
1. "Modal chỉ 1 lần thì user quay lại không xem được nữa" → có nút mở lại
2. "Click nhầm hotspot là mất modal" (D-10) → mở lại được
3. "Nút mới trong dock thì user không biết nó là gì" → animation morph **dạy** user
   nút đó chính là modal vừa rồi, không cần tooltip

Kỹ thuật FLIP, chi tiết ở [`04-modals.md`](04-modals.md) §4.3.8.

---

## D-30 · Link `href="#"` nhưng lưu URL thật · 🟢 (Q22 = b)

**Chốt:** Mọi item navbar `href="#"` + `preventDefault()` + toast. **Nhưng** URL thật
(84 mục, lấy từ site) vẫn lưu trong `data.js` kèm cờ `ST.data.LINKS_LIVE = false`.

**Vì sao:** khách chọn (b) để demo không bị "trôi" ra site khác khi trình bày. Nhưng
gõ lại 84 URL sau này là việc vô nghĩa → lưu sẵn, đổi 1 cờ là bật.

---

## D-31 · Bỏ "hover sát đỉnh màn hình để hiện header" · 🟢 · phát hiện khi test

**Bối cảnh:** v2 của D-07 có 3 cách hiện lại header: bấm `#st-nav-peek` · **hover vùng
`top: 0–56px`** · Tab focus. Test tự động Playwright **timeout 30 giây** ở bước click
nút peek.

**Nguyên nhân:** để bấm nút peek (ở `top: 0`, cao 26px) thì con trỏ **bắt buộc** đi qua
vùng 0–56px → header bung ra trước → nút peek biến mất → không bao giờ click được.
Nút mà người dùng không thể bấm bằng chuột.

**Chốt:** Bỏ hẳn hover-để-hiện. Còn lại: **bấm nút peek** · Tab focus · modal mở.

**Vì sao đúng hơn:** khách nói rõ *"Có nút mũi tên kép ... để người dùng biết chỗ click
mở navbar lại"* — một cái nút. Hover-reveal là thứ tôi tự thêm và nó **triệt tiêu** đúng
cái khách yêu cầu. Bỏ đi thì hành vi cũng dễ đoán hơn: header chỉ đổi trạng thái khi
người dùng chủ động, không bao giờ tự nhảy.

---

## D-32 · ⚫ ĐÃ ĐẢO NGƯỢC (D-44) · Mobile: thêm danh sách 8 điểm dưới bản đồ

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03.** Vấn đề gốc (hotspot 32px quá nhỏ trên máy dọc)
> biến mất cùng hotspot. `#st-welcome-list` và `.st-wl-*` đã xoá. Xem **D-44**.

**Bối cảnh:** Q3 = *"trên tất cả thiết bị"*. Test 390×844 cho thấy bản đồ landscape
(tỉ lệ 1.61) chỉ được **358 × 222px**, 8 hotspot 32px chen chúc gần như không bấm trúng,
và dưới bản đồ còn một mảng trống lớn.

**Đã cân nhắc & loại:**
- *Vẽ bản đồ dọc riêng cho mobile:* đúng nhất, nhưng bounding box của 8 hotspot có tỉ lệ
  **1.97** (rộng hơn cả bản landscape) → không crop được, phải vẽ lại toàn bộ hình học.
  Đưa vào v2 (toạ độ `xm/ym` đã có sẵn trong `data.js`).
- *Cho phóng to / kéo bản đồ:* thêm một tầng tương tác nữa trong modal onboarding 3 giây.
- *Bỏ bản đồ trên mobile:* mất luôn phần "gây ấn tượng" — mục tiêu số 1 của YC-1.

**Chốt:** Giữ bản đồ (để gây ấn tượng) + thêm `#st-welcome-list` bên dưới (để bấm thật).
Danh sách lấp đúng chỗ trống, item cao 56px, cùng `pick()` với hotspot.

**Nguyên tắc rút ra:** trên mobile, bản đồ đóng vai trò **hình ảnh**, danh sách đóng vai
trò **thao tác**. Ép một thứ làm cả hai là chỗ hỏng.

---

## D-33 · Sprite icon + bản đồ SVG inline trong `index.html` · 🟢

**Chốt:** Không tách `assets/icons.svg` và `assets/map/park-map.svg` ra file riêng.

**Vì sao:** `<use href="file.svg#id">` và `fetch()` đều **bị CORS chặn trên `file://`** →
khách double-click `index.html` sẽ thấy trang mất hết icon và mất bản đồ. Q5 yêu cầu
"tách ra hết cho dễ điều chỉnh" — đã tách CSS/JS thành 8+10 file; riêng 2 thứ này tách
ra là **hỏng bản demo**. Ngoài ra hotspot định vị bằng `%` của khung bản đồ nên bản đồ
phải cùng cây DOM.

---

## D-34 · ⚫ ĐÃ ĐẢO NGƯỢC (D-44) · Kích thước bản đồ tính bằng JS (`fitMap`)

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03.** `fitMap()` và `MAP_AR` đã xoá cùng bản đồ.
> Đáng đọc lại vì chính `fitMap()` là chỗ phát sinh lỗi "mở modal lần 2 không thấy
> nội dung" — nó đo `getBoundingClientRect()` giữa lúc panel đang bị morph thu nhỏ.
> Xem **D-45**.

**Bối cảnh:** `#st-welcome-map` ban đầu dùng `width:100%; aspect-ratio:1000/620;
max-height:100%`. Khi `max-height` cắt chiều cao, CSS **không** tính lại chiều rộng theo
aspect-ratio → SVG bị letterbox bên trong khung, trong khi hotspot định vị theo `%` của
**khung** → hotspot lệch khỏi bản đồ.

**Chốt:** `fitMap()` trong `welcome.js` đo khung cha rồi gán `width`/`height` px chính
xác theo tỉ lệ. Gọi khi mở modal, khi resize, và khi đổi ảnh bản đồ.

**Lợi thêm:** `?map=real` có thể đặt lại `MAP_AR` theo `naturalWidth/naturalHeight` của
ảnh thật → đổi nền không làm lệch hotspot.

---

## D-35 · Panorama mock phải LIỀN MẠCH khi lặp ngang · 🟢 · phát hiện khi test

**Bối cảnh:** Ảnh chụp test lộ **vệt nối dọc rất rõ** khi kéo — các lớp parallax lặp
`repeat-x` nhưng đường bao đồi có `y(0) ≠ y(W)`, và vài công trình bị cắt ngang mép tile.

**Chốt:** Mọi lớp cảnh phải: đường bao có `y(0) === y(W)` · không vật thể nào chạm mép
trái/phải · lớp gần có dải nền phẳng ở đáy. Ghi thành comment cảnh báo ngay trong
`viewer.js` để người sửa sau không phá.

---

## D-36 · Icon topbar: TRÍCH từ font gốc, không vẽ tay nữa · 🟢 · 2026-07-31

**Bối cảnh:** Khách so ảnh topbar phải (cờ + 5 social) lần thứ tư: *"clone ra nhưng icon
không đúng, cờ không giống nhau, cờ Việt Nam bị khuất, vị trí cũng không giống nhau nốt"*.

**Đây là lần thứ 4 sửa cùng một cụm.** Ba lần trước đều là chỉnh **cách vẽ tay** (căn tâm
bbox → tâm khối → đo pixel đã render). Cách đó không bao giờ hội tụ được, vì bản thân
outline là do tôi nhìn rồi vẽ lại.

**Phương án đã loại:**

- *Nhúng `font-awesome.min.css` + webfont của site.* Vi phạm RULE #3 (không dependency
  ngoài), lại thêm 1 request font chỉ để có 8 glyph.
- *Vẽ lại lần thứ tư cho khéo hơn.* Đã thử 3 lần, mỗi lần khách vẫn thấy khác.

**Chốt — 4 sửa, tất cả đều lấy số từ site gốc chứ không ước lượng:**

| # | Sai | Đúng (đo được) |
|---|---|---|
| 1 | 8 icon `i-fa-*` vẽ tay | **outline trích từ `fontawesome-webfont.svg` 4.6.3** của chính site, quy về viewBox 24 theo tỉ lệ em `24/1792` |
| 2 | glyph phóng `1.5×` = `22.5px` | **`15px`** — đúng `font-size` của `.list-top-nav i` |
| 3 | cờ viewBox `26×20`, sao VN bán kính ~7 (cao 75% lá cờ → **bị viền 1px cắt mất 2 cánh dưới**) | ảnh gốc là **`24×18`**; sao tâm `(12, 9.4)` bán kính `4.6` — **đo bbox sao ngay trên `vi.png`: 9×8 px** |
| 4 | hở cờ ↔ social `10px` | **`20px`** — `.list-top-nav ul{padding:10px}` của gốc cũng áp lên `ul.flag-language`, cộng với `gap:10px` của hàng |

Union Jack vẽ ở hệ chuẩn `60×30` (fimbriation + counterchange đúng) rồi `scale(0.4 0.6)`
về `24×18` — **scale không đều là cố ý**, vì `en.png` của gốc cũng chính là lá cờ 2:1 bị
bóp vào khung 4:3.

**Kiểm chứng:** chụp headless site gốc và prototype ở cùng `1440×900`, `dsf=4`, rồi so
pixel. Sau sửa: vòng tròn social **trùng khít từng pixel** (`x = 1116.5 … 1306.5` ở cả
hai), cờ trùng `1039.5–1065.5` và `1070.5–1096.5`; sai khác còn lại chỉ là viền khử răng
cưa. Quy trình ghi ở [`02-design-system.md`](02-design-system.md) §2.7.1.

**Bài học chung:** khi clone một thứ mà **asset gốc tải về được** (font, ảnh, CSS), luôn
hỏi *"lấy thẳng số/outline gốc được không?"* trước khi bỏ công dựng lại bằng mắt.

---

## D-37 · Cờ: fit RMS ở CỠ THẬT, không ngưỡng pixel · 🟢 · 2026-07-31

**Bối cảnh:** Sau D-36 khách vẫn báo *"khoảng cách giữa các phần tử trên topbar vẫn khác
bản gốc và cờ Việt Nam vẫn nằm chưa chuẩn"*. Đo lại thì đúng cả hai — nhưng nguyên nhân
không nằm ở chỗ tôi tưởng.

### 37.1 Khoảng cách — lỗi ở luật responsive, không phải ở topbar

Ở **1440px mọi thứ đã trùng khít từng pixel** (3 icon liên hệ, 5 vòng social, 2 lá cờ đều
cùng toạ độ). Lệch nằm ở dải **900–1200px**:

| | Site gốc | Bản cũ của tôi |
|---|---|---|
| Địa chỉ | **giữ** | ẩn |
| Bề ngang | **`85%`** | `100%` |
| Cỡ chữ | **`11px`** | `14px` |
| Chữ dài | **tự xuống dòng** | `white-space:nowrap` → **chồng lên mục kế** |

Gốc chỉ có đúng một luật: `@media(max-width:1200px){.list-top-nav li span{font-size:11px}}`.
Tôi đã tự ẩn địa chỉ và dàn hết bề ngang → cả hàng bố trí khác hẳn. Đã sửa về đúng gốc,
và **tách riêng** ngưỡng tự quyết `≤999px` (từ `≤900px` gốc bỏ hẳn header desktop, phần đó
ngoài phạm vi prototype nên phải tự thiết kế).

Riêng `white-space`: gốc **không đặt** nên ~1000–1100px địa chỉ và hotline **xuống 2
dòng**. Ta để `nowrap` thì thay vì xuống dòng nó **chồng đè** lên mục kế — sai hẳn. Đã bỏ
`nowrap` ở dải này. ⚠️ Hai dòng tràn khỏi row `40px` là **khuyết điểm của chính site gốc**;
clone theo yêu cầu "giống hệt", muốn gọn thì nâng ngưỡng bỏ địa chỉ (`≤999px` → `≤1199px`),
sửa đúng 1 con số.

**Bài học:** khi clone, breakpoint và **giá trị tại breakpoint** cũng là thứ phải đọc từ
CSS gốc, không được tự nghĩ — kể cả những thuộc tính gốc **không khai báo** (`white-space`)
cũng là một quyết định. Trước đó tôi mới chỉ đối chiếu ở 1 khung (1440).

### 37.2 Cờ — mọi phép đo bằng "ngưỡng pixel" đều sai

`vi.png`/`en.png` là ảnh **24×18 có ringing**: quanh ngôi sao, kênh green tụt xuống `0`
— **thấp hơn cả nền đỏ (`37`)**. Nên mọi cách đo kiểu "lấy pixel đủ vàng rồi tính bbox"
đều ăn mất rìa và cho bán kính quá nhỏ. Tôi đã sai **3 lần liên tiếp** theo đúng kiểu đó:
`R = 4.6 → 4.35 → 4.95`.

**Chốt — cách đo đúng: fit ở ĐÚNG CỠ HIỂN THỊ.** Render hàng loạt ứng viên ở đúng `24×18`
rồi lấy cái có **RMS thấp nhất so với file PNG gốc**:

| | Kết quả |
|---|---|
| Sao VN | tâm `(12, 9)`, **`R = 5.6`** (đáy RMS phẳng ở `5.5–5.7`) — cao 56% lá cờ |
| Cờ UK | thập đỏ `4` / trắng `6` / chéo trắng `3.6`, **KHÔNG có chéo đỏ** |

Cờ UK: bản trước tôi dựng chuẩn `60×30` rồi `scale(0.4 0.6)`. **Sai** — bóp không đều làm
nét DỌC mỏng còn 2/3 (thập đỏ `2.4`, trắng `4`), trong khi `en.png` đo ra nét **đẳng
hướng** `4`/`6` ở cả hai chiều. Và duyệt từng pixel đường chéo của `en.png` thì **không có
pixel đỏ nào** — ở cỡ này chi tiết St Patrick mất hẳn, vẽ thêm là sai bản gốc.

**Phương án đã loại:** so bbox sau khi phóng ảnh lên 4–8× (blur làm ảnh gốc luôn "to hơn",
lệch có hệ thống) · so tổng "khối lượng vàng" (blur cũng thổi phồng) · dựa vào tỉ lệ chuẩn
quốc kỳ (icon 24×18 không theo chuẩn).

**Lưu ý khi lặp lại:** phải xếp ứng viên thành **1 cột** với bước cố định. Bản đầu tôi xếp
lưới nhiều cột rồi dò ô bằng màu → thứ tự ô lệch khỏi thứ tự ứng viên, cho kết quả sai
hoàn toàn (RMS chọn ra một cái nhìn bằng mắt là rõ ràng nhỏ hơn).

---

## D-38 · Bỏ badge vàng `360°` trên tab VR360 · 🟢 · 2026-08-01

**Quyết định:** Xoá badge `360°` khỏi tab `#st-nav-vr360` — tab chỉ còn chữ `VR360`.
Xoá luôn class `.st-badge360`, keyframes `st-badge-pulse`, field `badge` trong
`NAV_MENU` và nhánh render badge ở `navbar.js` (cả navbar desktop lẫn drawer mobile).

**Lý do:** khách yêu cầu trực tiếp. Về mặt thiết kế cũng hợp lý: chữ "VR360" đã tự nói
lên nội dung, badge `360°` là thông tin **lặp lại**; thêm nữa nền vàng `--st-gold-500`
là điểm nhấn duy nhất trong navbar xanh nên nó hút mắt quá mức so với giá trị nó mang.

**Phương án đã loại:** giữ badge nhưng bỏ pulse, hoặc đổi badge sang nền trắng mờ —
vẫn là thông tin thừa, bỏ hẳn gọn hơn.

**Hệ quả:** dấu hiệu "đang ở trang này" giờ **chỉ còn** gạch chân đứng sẵn dày `2.5px`.
Bỏ luôn `padding-right: 8px` (chỉ tồn tại để chừa chỗ cho badge) → tab cân đối lại.
Field `badge` không còn chỗ dùng nào khác nên đã gỡ khỏi schema `NAV_MENU`
([`06-data.md`](06-data.md) §6.6).

---

## D-39 · ⚫ ĐÃ ĐẢO NGƯỢC (D-46) · Thu phạm vi: chỉ header + 3 nút cụm C + modal welcome · 🟢 · 2026-08-01

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03 (D-46).** Phạm vi không còn là "3 khối trên trang VR" mà là "một cái popup".
> Giữ nguyên mục này làm lịch sử.

**Bối cảnh.** Khách xem bản v2 và chốt lại phạm vi bằng lời:

> "Đừng động vào những design nào ngoài Nút Chỉ Đường và Điểm đến, thêm nút dẫn đến
> trang xem combo. Còn lại ẩn hết và đừng đụng vào […] Còn lại hãy để nguyên đó không
> thêm vào trang, nó sẽ cố định trên giao diện vr đang có sẵn luôn."

**Chốt.** Prototype giao đúng 3 khối:

| Giao | Vì sao |
|---|---|
| Header (topbar + navbar) | YC-3 vẫn còn hiệu lực — xem phần "hiểu nhầm" bên dưới |
| Cụm C: Chỉ đường · Điểm đến · **Xem combo** (mới) | YC-2 + yêu cầu 2026-08-01 |
| Modal welcome | YC-1 |

Bỏ khỏi trang: `#st-cta-tickets`, `#st-more-popover`, nhóm nút xem trong dock
(VR/la bàn/âm thanh/toàn màn hình), `#st-scene-label`, `#st-hint`, `#st-share` (M4),
`#st-help` (M5).

**Tiêu chí phân loại — không phải "mới/cũ" mà là "chỗ đó đã có gì chưa".**
Đây là chỗ tôi hiểu sai lần đầu: tôi ẩn luôn cả header. Khách phản hồi ngay —
trang trip360 **không hề có header**, dải trên cùng đang trống, nên navbar là phần
*thêm vào chỗ trống*, không đè lên cái gì. Ngược lại, `#st-cta-tickets` nằm đúng chỗ
cụm ⓔ và popover ⋯ nằm đúng chỗ cụm ⓓ — đó mới là thứ phải bỏ. Luật rút ra:

> Được dựng ở vùng TRỐNG của trip360. Cấm dựng đè lên 4 cụm control ĐÃ CÓ (ⓐ ⓑ ⓓ ⓔ).

**Cách hiện thực — tắt đầu ra, không xoá code.** Cờ `ST.data.SCOPE = 'minimal'` →
class `html.st-scope-min` → `css/scope.css` (nạp cuối) ẩn phần ngoài phạm vi; các hàm
render trong `controls.js` return sớm. `?full=1` dựng lại nguyên vẹn bản v2.

**Phương án đã loại:**
- *Xoá hẳn code thừa.* Mất luôn khả năng cho khách xem lại bản v2 để so sánh, mà quyết
  định phạm vi thì đã đảo một lần rồi.
- *Comment out markup trong `index.html`.* Docs §3 §4 đang trace theo selector; markup
  biến mất là docs sai hàng loạt.

**Hệ quả:** `D.DOCK_BUTTONS` giờ chỉ còn 4 mục; bản cũ đổi tên thành
`D.DOCK_BUTTONS_FULL`. Thêm khoá i18n `dock.combo`. `LINKS.combo` bỏ ghi chú
"candidate" — href trùng đúng mục *Bảng giá › Combo trò chơi* trong `NAV_MENU`.

---

## D-40 · ⚫ ĐẢO NGƯỢC D-05v2 — cụm C về DƯỚI-TRÁI, xếp DỌC · 🟢 · 2026-08-01

> ⚫ **CẢ MỤC NÀY HẾT HIỆU LỰC từ 2026-08-03 (D-46)** — cụm C đã gỡ cùng toàn bộ
> phần "trang VR". Giữ nguyên làm lịch sử.

**D-05v2 đã sai ở chỗ nào.** D-05v2 chốt "hợp nhất cụm C vào cụm ⓓ dưới-giữa thành
một pill duy nhất". Lập luận về *thẩm mỹ* vẫn đúng (5 cụm rời → 3 vùng), nhưng nó bỏ
qua một ràng buộc *kỹ thuật*: prototype này **không thay thế** UI của trip360, nó sẽ
được **thả đè lên** bản 3DVista đang chạy. Cụm ⓓ vẫn còn đó. "Hợp nhất" trên bản mô
phỏng, khi ghép thật, biến thành **hai pill chồng lên nhau**.

**Chốt v3:** cụm C ở lại **góc dưới-trái** — đúng chỗ 2 nút gốc đang đứng, tức không
chiếm thêm một milimét nào của màn hình so với hiện trạng.

**Xếp DỌC chứ không phải hàng ngang** — đây là phần tính toán, không phải khẩu vị:

| | Bề rộng cần | Chỗ trống bên trái cụm ⓓ |
|---|---|---|
| Hàng ngang, nhãn VI | ≈ 450px | 1280px → **454px** |
| Hàng ngang, nhãn EN | ≈ 500px | 1440px → 534px |

Nhãn EN (`Directions` / `Destinations` / `View combos`) dài hơn VI ~50px, nên hàng
ngang **tràn qua giữa màn hình và đè cụm ⓓ ngay ở 1280px** — độ phân giải phổ biến
nhất. Cột dọc rộng cố định 212px, an toàn ở mọi bề ngang, và nhãn không bao giờ phải
cắt bớt — với 3 nút là toàn bộ deliverable thì mất chữ là mất nghĩa.

**Ràng buộc được mã hoá thành token**, không gõ số tay (`tokens.css`):

```
--st-rz-d-w: 340px;                                   /* bề ngang cụm ⓓ + lề */
--st-c-max-w: calc(50vw - var(--st-rz-d-w)/2 - 16px); /* trần của cụm C */
```

**Xử lý theo khổ màn:**

| Khổ | Xử lý | Vì sao |
|---|---|---|
| ≥900px | cột 212px, `bottom: 20px` | đứng cạnh cụm ⓓ, còn dư ≥260px |
| ≤899px | cột 204px, đẩy lên `+ --st-rz-d-h` | máy nhỏ: cụm ⓓ chiếm gần hết bề ngang → phải leo lên trên nó |
| ≤380px | cột 196px, **giữ nhãn chữ** | bản v2 bỏ chữ để vừa hàng ngang; cột thì không cần |
| cao ≤640px | hàng 38px, `gap 5px` | cột 4 hàng cao ~215px, dưới 640px sẽ chạm đáy sidebar ⓑ (đáy ≈418px) |

**3 bậc màu cho 3 nút** — cả 3 đều là màu THẬT của `suoitien.vn`, không phát minh:

| Nút | Nền / chữ | Đọc ra là gì |
|---|---|---|
| Chỉ đường | `#128125` / trắng | hành động chính |
| Điểm đến | trắng / `#0e6b2e`, viền xanh | hành động phụ, cùng họ |
| **Xem combo** | `#FBD255` / `#EB0029` | mượn nguyên cặp màu nút "Mua vé" của site chính → nhận ra ngay là link thương mại, không phải điều khiển tour |

**Phương án đã loại:**
- *Giữ hàng ngang, cắt chữ khi hẹp.* Nút bị cắt trông như lỗi render, không như thiết kế.
- *Hàng ngang trên desktop, cột trên mobile.* Hai bố cục phải giải thích, mà bố cục
  desktop lại chính là cái hỏng ở 1280px.
- *Rail dọc bên phải.* Cụm ⓔ đã ở đó.

**Còn hở — cụm ⓐ (VN + chia sẻ, trên-phải).** Header trải hết bề ngang nên **có** đè
lên ⓐ. Đây là vùng cấm *mềm*: header đã mang sẵn bộ chuyển ngôn ngữ (`#st-lang`) và 5
icon social, tức nó **thay thế** chức năng của ⓐ chứ không chỉ che. Khi ghép thật phải
ẩn cụm ⓐ gốc — đã ghi thành **Q-35** trong [`00-requirements.md`](00-requirements.md)
và checklist ở [`07-integration.md`](07-integration.md) §7.6.

**Kiểm chứng:** `?zones=1` vẽ ghost 4 cụm theo số đo ảnh khách gửi để soi bằng mắt.
Mặc định TẮT — khách yêu cầu không thêm gì vào trang.

---

## D-41 · ⚫ ĐÃ ĐẢO NGƯỢC (D-46) · Nút combo tách ra thành THẺ VÉ riêng, dưới navbar bên phải · 🟢 · 2026-08-01

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03 (D-46).** Thẻ vé combo gỡ cùng cụm C.
> Giữ nguyên mục này làm lịch sử.

**Khách:**

> Nút xem combo nằm riêng, thiết kế theo dạng hình ticket. Đọc qua design-seanote.txt
> để hiểu kiểu thiết kế tôi muốn, nhưng không cần stamp, chỉ cần thẻ, nhỏ gọn chút,
> click vào vé là chuyển luôn chứ không cần nút bấm trong ticket. Ticket sẽ nằm dưới
> navbar, phía bên phải. Lâu lâu nhảy một cái gây sự chú ý.

**Chốt.** `#st-ticket` là component **riêng**, không còn là nút thứ 3 trong cụm C.
File riêng `css/ticket.css`, dữ liệu riêng `ST.data.TICKET`, render riêng
`renderTicket()`.

**Lấy gì từ `.j-seanote` (design-seanote.txt), bỏ gì:**

| Chi tiết bản gốc | Ở đây |
|---|---|
| Thân vé trắng + cuống (stub) trái + răng cưa đục lỗ + 2 khuyết tròn | ✅ giữ — đây là cái làm nó "ra hình tấm vé" |
| Kỹ thuật răng cưa: 3 lớp CSS mask composite `intersect` | ✅ giữ nguyên, kèm bản `-webkit-` cho Safari |
| Con dấu đỏ "CHƯA BAO GỒM" + `stampPress` | ❌ **bỏ** — khách yêu cầu |
| `button.j-seanote-btn` "Thêm vé" bên trong | ❌ **bỏ** — cả tấm vé là 1 `<a>`, bấm đâu cũng đi |
| Câu phụ `.j-seanote-sub` | ❌ bỏ — "nhỏ gọn chút" |
| `seanoteTear` (xé vé bay đi) | ❌ bỏ — thẻ này không có state "đã xong" |
| Tông teal `#10A6AE` + cam `#F2671C` | ❌ đổi sang vàng-đỏ brand (xem dưới) |
| Font `DM Mono` cho eyebrow/nhãn cuống | ❌ thay bằng `--st-t-xs` + `letter-spacing` — RULE #3 cấm thêm dependency |

Kết quả: cao **62px** thay vì ~92px của bản gốc.

**Màu.** Không dùng teal/cam. Dùng đúng cặp của nút "Mua vé" trên `suoitien.vn`:
cuống vé nền `--st-gold-100`, nhãn `--st-gold-600`, icon `--st-red-500`, eyebrow
`--st-red-500`. Vàng + đỏ trên nền trắng = người Việt nhìn ra "vé" ngay, mà vẫn là màu
brand thật chứ không phải màu tôi tự chọn.

**Vị trí: dưới navbar, bên phải** — không đụng vùng cấm nào. Cụm ⓐ (trên-phải) đã bị
header phủ sẵn (Q-35); cụm ⓔ ở giữa chiều cao (`top:50%`), thẻ nằm ở ~130–195px nên
cách rất xa. Khi header trượt lên, thẻ đi theo nhưng **dừng dưới cụm ⓐ**
(`top: var(--st-rz-a-h) + 12px`) chứ không leo lên tận đỉnh.

**"Lâu lâu nhảy một cái".** `@keyframes st-ticket-nudge`, chu kỳ **8s** nhưng chỉ
**0.9s cuối** là có chuyển động — phần lớn thời gian thẻ đứng yên nên không thành thứ
nhấp nháy gây khó chịu. Nảy 2 nhịp giảm dần (−7px → 0 → −3px → 0) cho giống vật thể có
quán tính. Dừng animation khi hover (đang định bấm thì đừng nhảy) và khi
`prefers-reduced-motion`.

**Bóng phải đổ ở lớp NGOÀI.** `mask` cắt luôn `box-shadow`, nên nếu đổ bóng trên chính
phần tử có mask thì mất bóng. Tách 2 lớp: `<a id="st-ticket">` giữ
`filter: drop-shadow(...)` + hoạt ảnh, `<span class="st-ticket">` bên trong giữ mask.
`drop-shadow` bám theo đúng hình vé đã bị đục lỗ — đẹp hơn `box-shadow` hình chữ nhật.

**Ràng buộc khi sửa:** `--seam` PHẢI luôn bằng `width` của `.st-ticket-stub` (desktop
52px, ≤599px 44px). Lệch là hàng lỗ đục không nằm đúng ranh giới cuống/thân. Và **không**
thêm `border-right` cho stub / `border-left` cho main — mép giáp phải trống thì răng cưa
mới liền, có viền là thấy vạch đôi.

**Phương án đã loại:** giữ nút combo trong cụm C (khách bảo tách); đặt thẻ ở dưới-phải
(sát cụm ⓔ hơn, và xa navbar nên mất liên hệ "vé ↔ header").

---

## D-42 · ⚫ ĐẢO NGƯỢC — cụm C bỏ div nền, 2 pill RỜI, xếp NGANG · 🟢 · 2026-08-01

> ⚫ **CẢ MỤC NÀY HẾT HIỆU LỰC từ 2026-08-03 (D-46)** — cụm C đã gỡ cùng toàn bộ
> phần "trang VR". Giữ nguyên làm lịch sử.

**Khách:** *"Các nút không nằm trong cùng 1 div có nền, nhìn ngu lắm"*

**Chốt.** `#st-dock` không còn `background` / `border` / `box-shadow` / `padding` —
chỉ là một flex container trong suốt. Mỗi nút tự mang bóng của nó.

**Vì sao khách đúng.** Bản v2 có nền bọc là hợp lý *khi dock có 10 phần tử* — cần một
bề mặt để gom chúng lại. Nhưng sau D-39 + D-41 thì cụm C chỉ còn **2 nút + 1 nút tròn
nhỏ**. Bọc 3 thứ đó trong một tấm kính mờ tạo ra một khối chữ nhật vô nghĩa quanh chúng,
và quan trọng hơn: **trip360 gốc vốn là 2 pill rời, không có nền** — thêm nền vào là tự
chế thêm một bề mặt mà bản gốc không có, đúng thứ khách bảo "đừng đụng vào bố cục".

**Hệ quả kèm theo — quay lại xếp NGANG.** D-40 chọn xếp dọc vì hàng ngang 3 nhãn cần
~450px (VI) / ~500px (EN), vượt trần `--st-c-max-w` ở 1280px. Nay nút combo đã rời đi:

| | Bề ngang cần | Trần ở 1280px |
|---|---|---|
| VI (`Chỉ đường` + `Điểm đến` + nút tròn) | ≈ 304px | 454px ✓ |
| EN (`Directions` + `Destinations` + nút tròn) | ≈ 342px | 454px ✓ |

Vừa thoải mái. Hàng ngang cũng chính là bố cục gốc của trip360.

Điểm gãy chuyển xuống **1099px** (trần còn 364px, EN cần 342px — sát trần). Dưới mức đó
cụm C leo lên trên cụm ⓓ, chỗ đó full bề ngang nên không còn ràng buộc.

**Nút mở lại modal đổi màu.** Trước là nền `--st-green-50` (xanh rất nhạt) — hợp lý khi
nằm trong tấm kính mờ. Đứng rời trên panorama thì nền nhạt trông như vết bẩn, nên đổi
sang **trắng + viền xanh**, đúng ngôn ngữ của cụm ⓓ có sẵn.

**Bản v2 giữ nguyên nền** (`html:not(.st-scope-min) #st-dock`) — 10 phần tử vẫn cần nó.

---

## D-43 · ⚫ ĐÃ ĐẢO NGƯỢC (D-46) · Clone 2 overlay mở ra từ cụm C · 🟢 · 2026-08-01 ⭐

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03 (D-46).** M2/M3 đã gỡ. Code còn ở `git show 9e5d46e:js/route.js` nếu khách muốn dựng lại thành popup riêng.
> Giữ nguyên mục này làm lịch sử.

**Bối cảnh.** Khách gửi 2 ảnh chụp overlay "Chỉ đường" và "Danh sách điểm đến" đang
chạy trên trip360, kèm yêu cầu: *"clone cái trang mở ra bên trong nút như ảnh ấy"*.

**Chốt.** Dựng `#st-route` (M2) và `#st-places` (M3) bám sát bản gốc. Hai nút của cụm
C đổi `action` từ `existing:*` sang `open:st-route` / `open:st-places`.

**Vì sao đảo ngược D-09v2.** D-09v2 hỏi *"có đáng dựng lại không"* và trả lời đúng là
"không". Nhưng khách đang cần một bản demo **bấm vào là đi được hết**: nút mới đẹp mà
bấm vào ra hộp thoại "phần này đã có sẵn" thì mạch trình bày đứt ngay chỗ quan trọng
nhất. Thêm nữa, có bản clone thì mới bàn được chuyện re-skin 2 overlay đó về sau.

**Không chạm vào bản thật.** M2/M3 là bản dựng lại **song song**, không đụng
`js/floorplan.js` của site. Khi ghép, phần vỏ mới có thể để nguyên overlay cũ chạy
(PA-B) hoặc thay bằng bản này — cần khách chốt, xem Q-36.

### Hai chỗ CỐ Ý lệch bản gốc

| Bản gốc | Prototype | Vì sao |
|---|---|---|
| Nút "Vị trí của tôi" nền xanh dương `#eff6ff`, chữ `#2563eb`; đường đi vẽ xanh dương | Xanh lá brand (`--st-green-50` / `--st-green-700` / `--st-green-600`) | D-04 đã bỏ hẳn hệ xanh dương khỏi prototype. Hình dạng/kích thước/vị trí giữ nguyên |
| Cam của pin và chip lọc | `--st-orange-500` (`#ff7b01`) | Đây là màu **thật** của `suoitien.vn`, gần trùng cam bản gốc — không phải bịa token mới |

### Đã loại

- **Chụp ảnh màn hình rồi ghép vào** — không bấm được, không đổi ngôn ngữ được, và
  không dùng lại được khi khách muốn re-skin.
- **Dựng bằng `<iframe>` trỏ vào trip360** — vi phạm RULE #3 (phụ thuộc ngoài), lại
  không sửa được gì bên trong.
- **Dùng dữ liệu thật 158 điểm** — repo prototype không có `map_places.json` và
  `map.jpg`. Dùng 20 điểm có sẵn, nói rõ "20/158 trong bản demo" thay vì giả vờ đủ.

### Số hiệu modal

Hai overlay này **lấy lại số M2/M3** vốn đã được đặt cho chúng từ đầu (§4.1 của
[`04-modals.md`](04-modals.md) — hồi đó ghi *"bản thật ♻️"*). Không đánh số mới:
`#st-existing` đang giữ M7, đổi số là mọi tham chiếu cũ trong docs sai hết.

---

## D-44 · ⚫ ĐẢO NGƯỢC D-08 — M1 bỏ bản đồ hotspot, thay bằng 3D carousel ảnh · 🟢 · 2026-08-03 ⭐

**Bối cảnh.** Khách xem bản dựng và yêu cầu: *"Bỏ hoàn toàn bản đồ với hotspot đi, bây
giờ sẽ sử dụng kiểu slide ảnh tự động được cuộn ngang dạng các thẻ 3D xoay tròn. Khi
click vào ảnh thì nhảy đến trang hình tương ứng. Ừ, là 3D Carousel các ảnh banner. Lấy
ảnh từ nguồn này https://suoitien.vn/"*

**Chốt.** Nội dung chính của M1 là **3D coverflow carousel 12 ảnh banner**, tự chạy
3,6 s/thẻ, bấm thẻ nào đi thẳng điểm đó. Bản đồ SVG, 8 hotspot, mini-card hover,
tooltip touch và danh sách mobile — **gỡ hết**.

**Vì sao đây là quyết định tốt hơn, không chỉ là "khách bảo thế".**

| | Bản đồ hotspot (cũ) | 3D carousel (mới) |
|---|---|---|
| Cái người dùng thấy | Khối hình học xanh + 8 chấm tròn 38px | Ảnh thật của chính công viên |
| Biết điểm đó ra sao? | Phải hover từng chấm mới hiện mini-card | Nhìn là biết ngay |
| Trên mobile | Khung 358×222, 8 chấm 32px chen nhau → phải dựng thêm danh sách (D-32) | Thẻ ~300px, tự nó đã là mục tiêu bấm to |
| Sự thật của bản đồ | MOCK, **không đúng địa hình thật** — mà lại trông như bản đồ thật | Không hứa hẹn gì về vị trí, nên không nói dối |

Điểm cuối là điểm đáng kể nhất: bản đồ cũ **trông như** thông tin định vị trong khi
toạ độ đều bịa. Chỉ đường thật đã có overlay M2 làm đúng việc đó rồi (D-43); M1 chỉ cần
làm một việc — *gây ấn tượng và mời người ta bấm vào đâu đó*. Ảnh làm việc đó tốt hơn
hình vẽ.

**Giữ nguyên, không đổi:**
- Q10 = a — bấm là **nhảy thẳng**, không có bước xác nhận.
- Q9 — "điểm nên xem" vẫn là *hint nhẹ*, chỉ đổi ring vàng pulse → badge vàng `★ Nên
  xem`; vẫn đúng 3 điểm `tuyet` · `bien` · `phuthuy`; vẫn không có 1-2-3 hay huy chương.
- Q12/D-29 — đóng vẫn morph co về `#st-welcome-reopen`.
- D-14 — vẫn không đóng bằng scrim.

**Đã loại:**
- *Ring 3D thật (thẻ xếp trên mặt trụ, xoay 360°)* — thẻ nửa sau quay lưng lại, phải
  đổ bóng hoặc lật ngược để che, mà 12 ảnh banner nằm ngửa ra thì rối. Coverflow cho
  đúng cảm giác "thẻ 3D xoay tròn" khách mô tả mà vẫn đọc được mọi thẻ.
- *Bấm thẻ rìa thì đưa vào giữa trước, bấm lần 2 mới đi* — an toàn hơn nhưng khách nói
  rõ "click vào ảnh thì nhảy đến trang hình tương ứng". Đã chọn theo đúng câu đó.
- *Dùng Swiper/Glide* — RULE #3 cấm dependency ngoài; phần cần viết chỉ ~200 dòng
  transform, thư viện sẽ nặng hơn cả phần còn lại của prototype.
- *Hotlink ảnh thẳng từ suoitien.vn* — prototype phải xem được khi không có mạng, và
  ảnh gốc có tấm 17 MB. Tải về, resize 760×507, webp → 930 KB cho cả 12 tấm.

**Kéo theo bị đảo ngược:**
- **Nhánh 🟡 Q-30 của D-08** (biến thể `?map=real` — bản đồ 3D thật của khách làm nền)
  — không còn bản đồ thì không còn gì để so sánh. Gỡ `applyMapMode()`, `REAL_MAP`,
  chuỗi `toast.mapMissing` và 2 nút trong panel `?debug=1`.
- **D-32** (danh sách 8 điểm chỉ hiện trên mobile) — sinh ra vì hotspot quá nhỏ để bấm
  trên máy dọc. Thẻ carousel không có vấn đề đó nên cả nhánh giải pháp biến mất.

**Trạng thái:** 🟢 — khách yêu cầu trực tiếp.
Chi tiết kỹ thuật: [`04-modals.md`](04-modals.md) §4.3.2–4.3.4 ·
[`03-components.md`](03-components.md) §3.8 · nguồn ảnh: [`06-data.md`](06-data.md) §6.8.

---

## D-45 · ⚫ ĐÃ ĐẢO NGƯỢC (D-46) · Sửa lỗi "mở modal lần 2 không thấy nội dung" — tách event `modal:shown` · 🔵 · 2026-08-03

> ⚫ **HẾT HIỆU LỰC từ 2026-08-03 (D-46).** Không còn engine `overlays.js`. Bài học vẫn được áp dụng trong `popup.js` — đo panel SAU khi DOM dựng xong, không đo giữa lúc có transform đang chạy.
> Giữ nguyên mục này làm lịch sử.

**Bối cảnh.** Khách báo: *"Phần modal hiển thị mới đầu khi vừa vào trang bị lỗi khi mở
lại lần thứ 2, không mở được hình ảnh phía dưới."*

**Nguyên nhân.** `overlays.open()` bắn `modal:open` **ngay sau** khi tạo animation FLIP
morph-mở. Tại nhịp đó animation đang ở keyframe 0, tức panel bị thu nhỏ bằng đúng cái
nút trong dock (~46px). `welcome.js` nghe `modal:open` rồi gọi `getBoundingClientRect()`
để tính khung bản đồ — mà `getBoundingClientRect()` trả về hộp **sau transform**. Nó đo
ra ~46px, gán thẳng vào `width`/`height` của khung bản đồ, và không bao giờ đo lại.

Lần mở **đầu** không có morph (`app.js` gọi `welcome.open()` không tham số) nên đo đúng.
Chỉ khi mở từ nút dock (có `morphFrom`) mới hỏng — khớp chính xác với "lần thứ 2".

**Chốt — 3 thay đổi trong `js/overlays.js`:**

1. **Thêm event `modal:shown`**, bắn *sau* khi morph xong (460 ms) hoặc ngay lập tức
   nếu không morph. Ai cần **đo kích thước** thì nghe event này; `modal:open` chỉ để
   biết "modal vừa mở". Ranh giới này ghi rõ trong comment tại chỗ bắn event.
2. **Token `gen`** tăng mỗi lần open/close. Hàm dọn dẹp chạy trễ 420 ms sau khi đóng
   nay so token trước khi chạy — mở lại trong vòng 420 ms (bấm nhanh 2 lần là đủ) sẽ
   không còn bị lần đóng cũ `cancel()` mất animation morph-mở vừa tạo.
3. **`clearAnimations(panel)` ngay đầu `open()`.** `morphClose()` để lại `opacity: 0`
   với `fill: 'forwards'` trên các con của panel; nếu lần đóng trước chưa kịp dọn thì
   panel mở ra **rỗng trơn**. Dọn trước khi đo.

**Vì sao không chỉ đơn giản đổi sang `offsetWidth`.** Đổi cách đo sửa được đúng một chỗ
gọi. Lỗi thật nằm ở **hợp đồng của event**: `modal:open` bắn ra trong một nhịp mà hình
học chưa đúng, nên bất kỳ module nào về sau nghe nó rồi đo cũng sẽ dính lại đúng lỗi
này. `modal:shown` sửa ở tầng hợp đồng.

**Ghi chú.** D-44 gỡ luôn đoạn code đo bản đồ, nên riêng M1 thì hai sửa này thừa. Vẫn
giữ: M2/M3 cũng chạy trên engine đó, và `#st-existing` vẫn còn đường lùi.

**Trạng thái:** 🔵 — sửa lỗi kỹ thuật, không cần khách quyết.
Kiểm chứng bằng Playwright: mở lần 1 → đóng morph → mở lần 2 → đóng rồi mở lại trong
120 ms; cả 3 lần thẻ giữa đều `340×227`, `opacity 1`, ảnh tải xong.

---

## D-46 · ⭐ PIVOT — project chỉ còn CÁI POPUP, nhúng iframe vào trang khác · 🟢 · 2026-08-03

**Bối cảnh.** Khách: *"Giờ thế này, bạn bỏ hết tất cả đi, và cho pj hiện tại là trang
của popup, hiểu không? Là giờ chúng ta chỉ design cái popup thôi, nó sẽ thành page
html được nhúng thành popup trong iframe trang khác."*

**Chốt.** `index.html` **là** cái popup. Toàn bộ phần "trang VR" mà project từng dựng
— header (topbar + navbar 84 mục + drawer), viewer mock, cụm C 2 nút, thẻ vé combo,
M2 chỉ đường, M3 danh sách điểm đến, engine modal dùng chung, store pub/sub — **gỡ
hết**. Danh sách file: [`01-architecture.md`](01-architecture.md) §1.1.

### Ba điểm của hợp đồng iframe (khách chọn 2026-08-03)

| Câu hỏi | Chốt | Đã loại |
|---|---|---|
| Iframe nhúng thế nào? | **Phủ full viewport**, popup tự vẽ scrim + tự canh giữa | *Iframe vừa khít hộp popup, cha lo scrim* — bên tích hợp phải tự viết CSS overlay và tự tính kích thước theo breakpoint |
| Báo cho trang cha bằng gì? | **Cả hai**: thử `parent.VRCore` (cùng origin) → rơi về `postMessage` | *Chỉ postMessage* (thêm một vòng không cần thiết khi cùng origin) · *chỉ gọi thẳng* (vỡ ngay nếu khác origin) |
| Ngôn ngữ lấy từ đâu? | **Trang cha truyền vào** — `?lang=` + `postMessage st:lang` | *Nút VI/EN trong popup* — sẽ lệch với nút VN/EN của trang cha, user thấy 2 chỗ nói 2 thứ tiếng |

### Vì sao kiến trúc này TỐT HƠN, không chỉ là "khách bảo thế"

| | Nhúng inline (bản trước) | iframe (D-46) |
|---|---|---|
| Xung đột CSS với 3DVista + floorplan | Phải prefix `st-`, phải dò `!important`, vẫn có rủi ro | **Không thể xảy ra** — document riêng |
| z-index | Phải dịch cả thang lên >10010 vì floorplan chiếm 10000–10009 | Thang bên trong để thấp; đúng **một** con số ở trang cha |
| Bên tích hợp phải làm gì | Chèn ~20 file CSS/JS đúng thứ tự, tránh trùng tên biến | Một thẻ `<iframe>` + một listener `message` |
| Đổi popup sau này | Phải deploy lại cả trang VR | Deploy lại mỗi thư mục popup |

Cái mất là 4 việc iframe không tự làm được (khoá cuộn, Esc ngoài iframe, `aria-hidden`
nền, trả focus) — nay là trách nhiệm trang cha, đã ghi rõ + code mẫu ở
[`07-integration.md`](07-integration.md) §7.3. Đổi lại được sự cách ly tuyệt đối; với
một prototype sẽ thả lên codebase 3DVista mà mình không kiểm soát, đó là món hời.

### Gộp 4 file thành 1

`overlays.js` + `store.js` + `app.js` + `welcome.js` → **`js/popup.js`**.
Khi chỉ còn MỘT popup thì engine mở-đóng dùng chung, ma trận va chạm "mở cái này đóng
cái kia", stack Esc nhiều tầng và pub/sub đều mất lý do tồn tại. Ba class trên
`#st-popup` (`.st-open` / `.st-closing` / không có) thay được cả bộ máy đó.

### Kéo theo — những quyết định cũ bị thu hẹp hoặc mất hiệu lực

| Quyết định | Số phận |
|---|---|
| **D-29** (morph modal ↔ nút dock, kỹ thuật FLIP) | ⚫ Bỏ. Không còn dock để co về, và nút mở lại (nếu trang cha có) nằm ở document khác — không đo `getBoundingClientRect()` qua ranh giới iframe được. Thay bằng `scale(.96)` + mờ. |
| **D-39 / D-40 / D-42** (phạm vi 3 khối, vùng cấm, bố cục cụm C) | ⚫ Hết hiệu lực. Không còn gì đè lên trip360 nữa — popup nổi lên trên, hết mở là hết. |
| **D-41** (thẻ vé combo) | ⚫ Gỡ cùng cụm C. |
| **D-43** (clone M2/M3) | ⚫ Gỡ. Code còn ở `git show 9e5d46e:js/route.js` nếu khách muốn dựng lại thành popup riêng. |
| **D-45** (event `modal:shown`, token `gen`) | ⚫ Không còn engine `overlays.js` để mà sửa. **Bài học vẫn đúng và vẫn được áp dụng**: `popup.js` đo `panel.getBoundingClientRect()` cho `bridge.ready()` **sau** khi DOM đã dựng xong, không đo giữa lúc có transform đang chạy. |
| **Q12 / "hiện 1 lần" bằng localStorage** | ⚫ Chuyển sang trang cha — `localStorage` trong iframe thuộc origin của popup, và cha mới là nơi biết ngữ cảnh. [`07`](07-integration.md) §7.9. |

**Vẫn giữ nguyên:** D-14 (không đóng bằng scrim) · D-16 (hệ icon nét mảnh) · D-21v2 ·
D-23 (hệ 2 font) · D-28 (6 nhóm) · D-33 (inline sprite cho `file://`) · D-44 (3D
carousel) · Q6 (3 biến thể tiêu đề) · Q9 (hint nhẹ) · Q10=a (bấm là đi thẳng).

**Trạng thái:** 🟢 — khách yêu cầu trực tiếp, 3 điểm hợp đồng đã hỏi và đã chốt.

---

## D-47 · ⚫ HẾT ĐỐI TƯỢNG (D-48) · `backdrop-filter` phải đặt ở TRANG CHA

> ⚫ **D-48 bỏ hẳn lớp nền mờ**, nên không còn gì để blur — bên tích hợp KHÔNG cần
> thêm `backdrop-filter` vào iframe nữa. Giữ nguyên mục này vì cái **bẫy** nó ghi lại
> vẫn đúng và vẫn im lặng: ai sau này dựng lại lớp nền mờ trong iframe sẽ vấp đúng nó.

**Bối cảnh.** Bản trước scrim dùng `--st-scrim: rgba(6,12,20,.52)` **+**
`backdrop-filter: blur(8px)`. Chuyển sang iframe thì blur biến mất không dấu vết.

**Nguyên nhân.** `backdrop-filter` chỉ làm mờ được thứ nằm sau nó **trong cùng một
document**. Bên trong iframe, phía sau lớp scrim là chỗ trống trong suốt — không có gì
để làm mờ. Nó không báo lỗi, không cảnh báo; chỉ lặng lẽ tốn thêm một lớp composite.

**Chốt — hai việc:**

1. Gỡ `backdrop-filter` khỏi `.st-scrim`, và **tăng độ đục** `.52 → .62`. Không còn
   blur đỡ thì nền phải tự đủ tối để chữ trắng trên panel và mép panel còn tách khỏi
   panorama.
2. Blur thật chuyển sang **thẻ `<iframe>` ở trang cha**:
   `#st-popup-frame { backdrop-filter: blur(8px) }`. Ở đó nó là element của trang cha,
   phía sau là panorama thật → ăn ngay.

**Vì sao không bỏ luôn blur cho gọn.** Blur là thứ làm modal trông "nổi lên trên" thay
vì "dán đè lên"; bỏ hẳn thì popup trông rẻ đi thấy rõ. Đưa sang trang cha giữ được
hiệu ứng mà vẫn đúng cơ chế.

**Hệ quả có thể chấp nhận:** bên tích hợp quên 1 dòng CSS đó thì popup vẫn dùng được
bình thường, chỉ là nền đục thay vì mờ. Đã ghi vào checklist
[`07-integration.md`](07-integration.md) §7.8.

**Trạng thái:** 🔵 — ràng buộc kỹ thuật, không cần khách quyết.

---

## D-48 · ⭐ Popup CHIẾM TRỌN MÀN, bỏ hộp modal + nền mờ · 🟢 · 2026-08-03

**Bối cảnh.** Ngay sau D-46, khách xem bản dựng: *"không, full màn luôn chứ không lồng
trong modal nữa. Hiểu không?"*

**Chốt.** `#st-popup` là `fixed; inset: 0` với nền **trắng đặc**. Gỡ `.st-scrim` và
`.st-popup-panel`. Cấu trúc còn: brandline · nút × · `.st-popup-inner` (head + deck +
foot).

**Vì sao hợp lý, không chỉ là "khách bảo thế".** Bản D-46 vẫn còn dấu vết của kiến trúc
cũ: popup là hộp modal canh giữa **bên trong** một iframe vốn đã phủ kín viewport. Tức
là hai lớp "modal" chồng nhau — iframe chặn tương tác với trang cha, rồi bên trong nó
lại vẽ thêm một lớp nền mờ + một cái hộp. Thừa một tầng.

Bỏ tầng đó được ba thứ:

| | Trước (hộp modal trong iframe) | Sau (toàn màn) |
|---|---|---|
| Thẻ carousel | `340px`, bị `overflow:hidden` của panel cắt | `560px` — rộng gấp rưỡi |
| Lớp DOM | scrim + panel + nội dung | nội dung |
| `backdrop-filter` | Phải đẩy sang trang cha (D-47), bên tích hợp dễ quên | Không cần nữa |

**Vẫn giữ `role="dialog" aria-modal="true"`:** xét về *hành vi* nó vẫn là modal — chiếm
hết màn, chặn thao tác với trang cha, đóng thì trả lại. Đổi sang `role="document"` chỉ
làm screen reader mất manh mối rằng đây là thứ tạm thời cần đóng.

**Ba chi tiết kỹ thuật đáng nhớ:**

1. **`html, body` vẫn phải trong suốt** dù nền popup đặc. Lúc vào/ra `#st-popup` fade
   `opacity`, và đúng những frame đó phải nhìn xuyên qua thấy panorama. Bỏ đi thì popup
   "bật" ra từ một tấm màn trắng.
2. **Chỉ animate `opacity`, không animate `transform`** trên `#st-popup` /
   `.st-popup-inner` lúc mở — cả hai đều là tổ tiên của `.st-cr-stage` (mang
   `perspective`); một transform ở đó làm phẳng chiều sâu 3D và thẻ sẽ bay vào màn dẹt
   lét. `scale(.98)` chỉ dùng lúc đóng.
3. **Căn dọc bằng CẶP `margin-top: auto`** (ở `.st-popup-head` và `.st-popup-foot`) chứ
   không phải `justify-content: center` — auto-margin của footer sẽ nuốt hết free space
   và đẩy cả khối lên đỉnh. Đã vấp một lần: media query mobile ghi đè `margin-top: auto`
   của footer thành `16px`, còn lại một auto-margin duy nhất, header bị đẩy xuống
   `margin-top: 222px` trên máy 844px. Khoảng hở với carousel phải là `padding-top`.

**Nền không để trắng trơn:** 2 vệt `radial-gradient` cực nhạt (xanh đỉnh, vàng
dưới-phải). Một mặt phẳng trắng tinh cỡ full HD trông chết cứng, nhất là khi nó vừa
thay thế một tấm panorama đầy màu.

**Kéo theo:** D-47 hết đối tượng · `--st-scrim` bỏ, thay bằng `--st-bg` ·
`css/popup.css` viết lại · media query mobile không còn nhánh "cho popup fullscreen"
(nó fullscreen ở mọi breakpoint rồi).

---

## D-49 · Carousel còn 3 thẻ: 1 giữa TO + 1 preview mỗi bên · 🟢 · 2026-08-03

**Bối cảnh.** Khách: *"Hình ở giữa to hơn, hai bên chỉ cần preview 2 ảnh thôi"*.

**Chốt.** `visible: 1` → 3 thẻ trên màn. Thẻ giữa `min(clamp(340px, 38vw, 560px), 66vh)`
— trước là `340px` cố định.

| | Trước (7 thẻ) | Sau (3 thẻ) |
|---|---|---|
| `visible` | 3 mỗi bên | **1** mỗi bên |
| Thẻ giữa | `340px` | `560px` ở màn 1440 (đo được 547px) |
| `--st-card-step` | `w * .56` | `w * .70` |
| `--st-card-z` | `170px` | `210px` |
| `--st-card-rot` | `30deg` | `34deg` |
| Chênh lệch giữa ↔ preview | `scale −.04`, `opacity −.24` mỗi bậc | `scale −.10`, `opacity −.30` |

**Vì sao chênh lệch phải tăng.** Với 3 bậc, mắt tự đọc ra thứ hạng từ dãy giảm dần. Với
1 bậc, chênh lệch nhỏ làm thẻ preview trông ngang hàng với thẻ giữa và người dùng không
biết bấm cái nào. `.10 / .30` là mức mà thẻ preview vẫn nhìn ra ảnh gì nhưng rõ ràng là
"phụ".

**`visible` thành tham số, không còn là hằng số module.** `ST.carousel.create()` nhận
`opts.visible`; muốn quay lại bố cục 5 thẻ chỉ đổi **một con số** trong `js/popup.js`,
không đụng CSS. Hằng số cũ đổi tên thành `VISIBLE_DEFAULT` để rõ nó chỉ là mặc định.

**`--st-card-w` chặn theo HAI chiều:** `clamp(…38vw…)` theo bề ngang và `66vh` theo
chiều cao. Thẻ 3:2 nên `66vh` bề ngang nghĩa là không cao quá `44vh` — còn chỗ cho
header + footer trên laptop 13" và trên điện thoại xoay ngang. Không có vế `66vh` thì
ở màn 740×380 thẻ tràn qua cả footer.

**Đã loại:** *giữ 5 thẻ nhưng phóng to thẻ giữa* — ở 1440px, 5 thẻ với thẻ giữa 560px
thì 2 thẻ ngoài cùng chỉ còn vài chục pixel, thành vệt màu vô nghĩa chứ không phải
"preview".

---

## D-50 · ⭐ Dựng BẢN 2 song song — VR Wall + Infinite Slider · 🟢 · 2026-08-03

**Bối cảnh.** Khách: *"làm index 2. Đọc file note.md và làm cái chỗ mà mix 2 cái lại
với nhau đi"*.

`note.md` có **hai** chỗ đề xuất kết hợp:

| Chỗ | Nội dung | Chọn? |
|---|---|---|
| §137 "Phương án đề xuất: Kết hợp VR Wall và Infinite Slider" | Ý tưởng 2 + 5, có bố cục popup chi tiết (§181), bảng chấm điểm (§208), khuyến nghị cuối (§219) | ✅ **làm cái này** |
| §339 "Đề xuất tối ưu nhất: Ý tưởng 3 + Ý tưởng 1" | Cinematic Gateway + Living Map, 4 dòng, không có spec | ❌ |

Chọn §137 vì: (a) toàn bộ nửa đầu `note.md` là phần đào sâu cho đúng 2 ý tưởng đó, (b)
nó là chỗ duy nhất có bố cục cụ thể để dựng, (c) §339 cần **bản đồ động** mà bản đồ đã
gỡ từ D-44.

**Chốt.** `index2.html` — **bản THỨ HAI, song song, không thay thế `index.html`.**
Luồng: `VR WALL tổng quan → INFINITE SLIDER khám phá → VR 360 chi tiết` (note.md §223).

### Vì sao dựng song song thay vì sửa đè lên bản 1

Đây là hai **ý tưởng thiết kế khác nhau** để khách chọn, không phải hai phiên bản của
một ý tưởng. Sửa đè thì mất bản 1, khách không còn gì để so.

Giá phải trả rất thấp vì hai bản **dùng chung 4/6 file JS**:

```
CHUNG:  data.js · i18n.js · a11y.js · bridge.js · tokens.css · base.css
BẢN 1:  carousel.js  popup.js        carousel.css  popup.css  responsive.css
BẢN 2:  wall.js  slider.js  popup2.js  wall.css  slider.css  responsive2.css
```

Quan trọng nhất: **dùng chung `bridge.js`** → trang cha đổi bản chỉ là đổi `src` của
iframe, không sửa một dòng nào. `host-demo.html` có nút "Bản 1 / Bản 2" để chứng minh
đúng điều đó ngay tại chỗ.

### Khác biệt cốt lõi so với bản 1

| | Bản 1 (`index.html`) | Bản 2 (`index2.html`) |
|---|---|---|
| Số tầng | 1 — chào + carousel | **2** — wall → slider |
| Một ô/thẻ là gì | 1 **điểm đến** | 1 **khu vực** (nhóm điểm) |
| Bấm vào | Đi VR ngay | Mở slider của khu vực đó |
| Thấy gì đầu tiên | 3 ảnh | **9 khu vực cùng lúc** → cảm giác quy mô |
| Nền | Trắng, light/airy | ⚫ ~~Tối, "phòng chiếu" để ảnh phát sáng~~ → **trắng như bản 1** (D-54) |
| Tìm kiếm | Không | Có, bỏ dấu được |
| Lọc nhóm | Không | 9 chip |
| Vào VR | 1 click | 2 click (ô → nút "Khám phá VR 360°") |

**Đánh đổi rõ ràng, và đó là điểm để khách quyết:** bản 1 nhanh hơn 1 click; bản 2 cho
thấy quy mô dự án và cho tìm/lọc. `note.md` §212 tự chấm: VR Wall 10/10 "thể hiện quy
mô", Slider 10/10 "trải nghiệm mobile" — kết hợp lấy được cả hai.

### Bảy quyết định nhỏ bên trong

1. **Bấm ô rìa trong slider thì ĐƯA VÀO GIỮA, không đi VR** — ngược với bản 1 (bấm thẻ
   nào đi thẳng thẻ đó). Cố ý: ở đây mỗi cảnh chiếm gần trọn màn và có mô tả riêng,
   người dùng cần đọc trước khi quyết; nút **"Khám phá VR 360°"** mới là hành động đi.
2. **Esc ở slider lùi về wall, không đóng popup.** Đóng thẳng làm mất cả hai tầng chỉ
   bằng một phím. Ở wall thì Esc mới đóng hẳn.
3. **`st:open` luôn quay về wall.** Mở lại mà rơi thẳng vào slider của nhóm lần trước
   thì người dùng mất ngữ cảnh "đây là màn tổng quan".
4. ⚫ **ĐÃ ĐẢO NGƯỢC (D-54).** ~~**Nền tối** (`--st-n-900` + 2 vệt brand) thay vì trắng
   như bản 1. 9 ô ảnh cạnh nhau trên nền trắng thành một mảng màu hỗn loạn; nền tối
   biến chúng thành thứ duy nhất phát sáng.~~
   → 2026-08-04 khách chốt **hai bản cùng nền trắng**. Lý do và cách bù tương phản:
   D-54(a). Riêng **slider vẫn nền tối** — mỗi cảnh chiếm gần trọn màn nên ở đó lập
   luận "phòng chiếu" vẫn đúng.
5. **Mô tả + CTA của ô chỉ hiện khi hover** (note.md §53 cảnh báo "quá nhiều ô dễ rối").
   Trên mobile không có hover → ẩn hẳn, chỉ giữ tên + số điểm.
6. **Ô đổi cảnh lệch pha 520 ms.** Dùng một interval chung rồi chia modulo sẽ ra nhịp
   máy móc, nhìn thấy rõ là "9 ô cùng một đồng hồ".
7. **Bỏ 2 mục khỏi thanh công cụ của note.md §198:** *"Xem bản đồ"* (bản đồ đã gỡ ở
   D-44 — nút mở ra chỗ trống là tệ hơn không có nút) và *"Khám phá theo chủ đề"*
   (chính là cái wall đang hiện, nút tự trỏ vào mình). Còn 3 mục, cả 3 đều chạy thật.

### MOCK còn lại

- **Cách chia 9 nhóm là tôi tự đặt** theo `cat` + cảm nhận — Suối Tiên chưa có phân
  loại chính thức. Cần khách duyệt (Q-41).
- **Hai nhóm `wild` và `food` chỉ có 1 điểm** vì mới có 12 ảnh. Có ảnh cho 8 điểm còn
  lại (Q-38) là đầy ngay.
- **Parallax khi rê chuột thay cho "xoay panorama 10–20°"** (note.md §41): prototype chỉ
  có ảnh phẳng nên dịch ảnh 5% ngược chiều con trỏ. Bản thật nhúng panorama nhẹ hoặc
  video quay từ 360 (note.md §59–64).
- **Chưa có video loop / ảnh parallax cho ô** — note.md §61 gợi ý video 4–6s mỗi ô.
  Hiện dùng cross-fade giữa 2–3 ảnh tĩnh, rẻ hơn nhiều và đủ để trình bày ý tưởng.

**Trạng thái:** 🟢 — khách yêu cầu trực tiếp. Cần khách chọn giữa 2 bản (Q-42).

---

## D-51 · ⭐ Bản đồ 2D + pin số hiệu — dùng chung cả 2 bản · 🟢 · 2026-08-03

**Bối cảnh.** Khách gửi ảnh chụp overlay *"Chỉ đường"* đang chạy trên trip360 (bản đồ
isometric, pin tròn có số) kèm yêu cầu: *"Đều thêm tính năng «Xem trên bản đồ 2D», sử
dụng ảnh trong Ban Do Suoi Tien để mở. Pin địa điểm trên đó tương ứng với trang trong
ảnh. Nếu chọn khu vực rồi thì vẫn có nút xem danh sách đó trên bản đồ 2D và trên bản đồ
chỉ có các điểm đã được lọc."*

**Chốt.** `js/map2d.js` + `css/map2d.css` — component **dùng chung**, nhận một mảng key
và chỉ vẽ pin của những điểm đó. Nhờ vậy *"xem tất cả"* và *"xem khu vực này"* là **cùng
một hàm, khác mỗi tham số**.

| Bản | Nút mở | Phạm vi |
|---|---|---|
| 1 | Footer *"Xem trên bản đồ 2D"* | tất cả 20 điểm |
| 1 | Đầu danh sách *"Xem khu vực này trên bản đồ"* | đúng bộ đang hiện (kể cả kết quả tìm kiếm) |
| 2 | Thanh công cụ wall | tất cả |
| 2 | Thanh dưới slider | nhóm đang xem |

### Ảnh: dùng bản KHÔNG SỐ, và phải FLATTEN

Thư mục khách gửi có 3 file. Chọn `ban-do-suoi-tien-new_KO SO.png` (5954×4654) vì pin do
ta vẽ đè — dùng bản *CÓ SỐ* thì hai lớp số chồng nhau.

Xử lý: `trim` viền trong suốt → 5523×2781 → resize 2400×1208 → **flatten lên `#0f172a`**
→ webp q82 = **391 KB** (gốc 14 MB).

> **Bước `flatten` mới là thứ thật sự giải quyết "không lộ mảng trống".** Công viên là
> hình bất quy tắc nên ảnh có vùng trong suốt ở các góc — `object-fit: cover` chỉ phủ kín
> *bounding box*, phần trong suốt bên trong vẫn để lộ nền khung và tạo một đường nối rõ
> rệt. Flatten lên **đúng màu nền của khung xem** (`--st-n-900`) rồi đặt
> `.st-map-view { background: var(--st-n-900) }` thì không còn đường nối nào.
>
> Đây là chỗ dễ hiểu nhầm: `cover` xử lý *tỉ lệ*, flatten xử lý *độ trong suốt*. Cần cả hai.

### Zoom: mở ở `cover`, tối thiểu `contain`

```
mở ra   k = coverScale()    → phủ kín khung, không viền
tối thiểu = containScale()  → nút "Toàn cảnh" đưa về đây, thấy trọn công viên
tối đa    = cover × 4.5
```

Trên máy dọc, bản đồ 2:1 trong khung 0.46 khiến `cover` phóng gấp ~4 lần: chỉ thấy 23%
bề ngang. Vì vậy nút **"Toàn cảnh" LUÔN hiện** (không ẩn khi chưa zoom) — nó là đường
thoát duy nhất, giấu đi thì người dùng kẹt. Bấm lần 2 quay lại `cover` để nút không
thành ngõ cụt.

### Ba chi tiết kỹ thuật đáng nhớ

1. **Pin nằm TRONG lớp bị scale** (để bám đúng toạ độ `%`) nhưng tự thu ngược
   `scale(--pin / --k)`. `--k` giữ pin không bị bản đồ phóng theo; `--pin` (JS tính từ
   bề ngang bản đồ đang hiển thị, chặn dưới `.45`) làm pin nhỏ lại khi thu nhỏ — nếu chỉ
   có `1/k` thì ở mức "toàn cảnh" trên mobile, 20 pin cỡ 38px chồng thành một đống.
2. **KHÔNG đổi `background` của pin khi hover/chọn.** Pin nhóm `culture` có nền vàng +
   **chữ tối**; đổi nền sang tối thành chữ tối trên nền tối và số hiệu biến mất. Đã vấp
   đúng lỗi này khi chụp màn kiểm tra. Nhấn mạnh bằng viền + phóng to.
3. **Bấm pin ra thẻ chi tiết, không phải tooltip hover.** Bản đồ là thứ người ta chạm
   nhiều nhất, mà cảm ứng không có hover.

### MOCK — phần yếu nhất của tính năng này

Chỉ **2/20 số hiệu** đọc được từ ảnh khách gửi: `1` = Cổng Thiên Tiên Môn, `22A` = Vương
Quốc Cá Sấu (hai đầu tuyến đường trong ảnh). 18 số còn lại và **toàn bộ toạ độ x/y** là
tôi đặt bằng cách đối chiếu bằng mắt ảnh bản đồ với ảnh khách gửi.

**Đủ để trình bày ý tưởng, chưa đủ để chỉ đường thật.** Bản thật đọc `map/map_places.json`
(`code` + toạ độ pixel trên `map.jpg`) — [`06-data.md`](06-data.md) §6.10. Cần khách/dev
xác nhận trước khi lên production (Q-43).

**Đã loại:** *nhúng luôn overlay "Chỉ đường" của trip360 qua iframe lồng iframe* — hai
tầng iframe, không kiểm soát được style, và chính overlay đó đã bị gỡ khỏi phạm vi từ
D-46.

---

## D-52 · Thẻ carousel của bản 1 là KHU VỰC, không phải điểm · 🟢 · 2026-08-03

**Bối cảnh.** Khách: *"index.html: Bổ sung tính năng tìm kiếm và thay đổi lại: thay vì
mỗi ảnh 1 địa điểm thì cho thành 1 khu vực. Khi click vào thì hiển thị danh sách của khu
vực đó."*

**Chốt.** Bản 1 thành **ba trạng thái**:

```
A `deck`  carousel 9 KHU VỰC (D.GROUPS)  →  bấm thẻ
B `list`  danh sách điểm của khu vực đó  →  bấm 1 điểm đi VR
M         bản đồ 2D, phủ LÊN cả hai      →  không phải trạng thái thứ ba
```

Cộng **ô tìm kiếm** ở header: gõ là nhảy thẳng sang `list`, tìm trên **toàn bộ 20 điểm**
chứ không giới hạn trong khu vực đang xem; xoá hết thì tự về `deck`.

### Được gì, mất gì

| | Trước (thẻ = 1 điểm) | Sau (thẻ = 1 khu vực) |
|---|---|---|
| Số điểm với tới được | 12 (chỉ những điểm có ảnh) | **20** — danh sách không cần ảnh |
| Click vào VR | 1 | 2 |
| Chỗ đặt ô tìm kiếm | không có | header |
| Cảm giác quy mô | 12 tấm ảnh | 9 khu vực × số điểm |

Mất một click, đổi lại **8 điểm chưa có ảnh (Q-38) vẫn dùng được ngay** — trong danh
sách chúng hiện ô giữ chỗ mang số hiệu bản đồ thay vì bị loại khỏi UI.

> Ô giữ chỗ có số hiệu, **không phải một mảng xám trơn** — mảng xám trơn trông như ảnh
> lỗi tải, người dùng sẽ chờ nó hiện ra.

### Hội tụ với bản 2 — và vì sao vẫn là hai bản khác nhau

Sau D-52, cả hai bản đều là *"khu vực → điểm → VR"*. Nhưng cách **trình bày** vẫn khác
hẳn, và đó chính là thứ khách đang chọn giữa:

| | Bản 1 | Bản 2 |
|---|---|---|
| Chọn khu vực | 3D carousel, xem tuần tự | Mosaic 9 ô, **thấy hết cùng lúc** |
| Xem điểm | **Danh sách** — quét nhanh, so sánh được | **Slider** — mỗi điểm một cảnh lớn |
| Nền | Trắng, light/airy | Tối, "phòng chiếu" |
| Hợp với | Người biết mình tìm gì | Người muốn được dẫn dắt |

**Esc đi ngược từng tầng một** ở cả hai bản: bản đồ → danh sách/slider → carousel/wall →
đóng. Nhảy thẳng ra làm người dùng mất hết ngữ cảnh chỉ bằng một phím.

**Trạng thái:** 🟢 — khách yêu cầu trực tiếp.

---

## D-53 · `max-width: 100%` kẹp ảnh phủ của wall — dải trống mép phải · 🔵 · 2026-08-03

**Bối cảnh.** Khách gửi ảnh chụp một ô của VR Wall: dải trống dọc chạy suốt chiều cao ở
**mép phải** thẻ. *"Không khớp khung ảnh."*

**Nguyên nhân.** `css/base.css` có rule chung cho ảnh nội dung:

```css
img { max-width: 100%; display: block; object-fit: cover; }
```

`.st-wt-img` (ảnh trong ô wall) cố ý khai **rộng hơn khung** để parallax dịch được mà
không lòi mép nền:

```css
.st-wt-img { position: absolute; inset: -6%; width: 112%; height: 112%; }
```

`max-width: 100%` **kẹp `width: 112%` xuống còn 100%**. Ảnh vẫn neo `left: -6%` nên toàn
bộ phần thiếu dồn hết sang **một phía** — mép phải. Đo được: khung 690px, ảnh 690px
(đáng lẽ 772.8px), hụt **34px** bên phải; khi parallax đẩy sang trái thì hụt tới **51px**.

`height: 112%` **không** bị kẹp vì `base.css` không đặt `max-height` — nên chỉ hỏng theo
chiều ngang. Đó là lý do lỗi trông như "ảnh bị lệch" chứ không như "ảnh sai tỉ lệ".

**Chốt.** Thêm `max-width: none` vào `.st-wt-img` kèm chú thích tại chỗ. Chỗ nào cho ảnh
rộng hơn khung chứa cũng phải khai lại.

### Vì sao lọt qua vòng kiểm trước

Test cũ (D-51) chỉ kiểm `getComputedStyle(img).objectFit === 'cover'` — và nó **đúng**.
`cover` chỉ nói ảnh lấp khung **của chính nó** thế nào, **không** nói ảnh có đủ to để
trùm khung **cha** hay không. Hai chuyện khác nhau; kiểm cái đầu không suy ra cái sau.

**Thêm `tools/check-image-cover.js`** — đo rect thật: với mỗi ảnh phủ, so 4 mép với khung
cha, âm quá 1px là fail. Chạy ở cả 2 bản × {mặc định, parallax ±2.5%, hover, mobile}.
Đã kiểm ngược: bỏ `max-width: none` ra thì tool báo FAIL đúng 22 ảnh với `hut right:-34`.

**Bài học chung:** một rule `img {}` toàn cục là tiện cho ảnh nội dung nhưng **im lặng
phá** mọi ảnh dùng làm lớp phủ. Không có lỗi, không có cảnh báo — chỉ là một dải trống.
Kiểm bằng *thuộc tính CSS* không bắt được; phải kiểm bằng *hình học đã render*.

---

## D-54 · Nền TRẮNG PHẲNG cho cả 2 bản · nút bản đồ lên hàng tìm kiếm · thẻ suy từ CHIỀU CAO · 🟢 · 2026-08-04

**Bối cảnh.** Khách phản hồi 3 ý (YC-14):

> 1. Ở index.html: Nút xem trên bản đồ 2D nằm cạnh thanh tìm kiếm
> 2. Ở index.html: Giảm khoảng trống, ưu tiên cho carouser to nhất có thể mà không làm gãy layout.
> 3. Tôi nhìn không nhầm thì nó có cái màu xanh xanh nằm dưới thanh 3 màu trên top của
>    trang đúng không? Xóa nó đi, ở 2 chỗ luôn. Và 2 nơi đều nền trắng như nhau

---

### (a) Bỏ vệt radial — hai bản cùng MỘT nền trắng phẳng · ĐẢO NGƯỢC D-50 #4

Khách nhìn đúng: `#st-popup` có `radial-gradient(… rgba(18,129,37,.05) …)` neo ở đỉnh
màn, tức **ngay dưới** dải brand 4px. Trên một vùng rộng và phẳng, 5% xanh trên trắng
không đọc ra là "ấm nhẹ" mà đọc ra là **một mảng ám xanh có mép** — càng rõ vì dải 3 màu
ngay trên nó cho mắt một mốc so sánh.

| Chỗ | Trước | Sau |
|---|---|---|
| `#st-popup` (`css/popup.css`) | `--st-bg` + 2 vệt radial (xanh trên, vàng dưới-phải) | `background: var(--st-bg)` |
| `#st-pop2` · `.st-wall` (`css/wall.css`) | `--st-n-900` + 2 vệt radial đậm hơn | `background: var(--st-bg)` |

**Bản 2 đổi từ nền TỐI sang TRẮNG là đảo ngược D-50 điểm #4.** Lập luận cũ ("9 ô ảnh
trên nền trắng thành một mảng màu hỗn loạn") không sai về thị giác, nhưng nó thua một
ràng buộc mạnh hơn mà khách vừa nêu: **hai bản là hai phương án của CÙNG một sản phẩm.**
Khách đang so *cách trình bày* (carousel tuần tự ↔ mosaic toàn cảnh), không so tông màu.
Nền khác nhau làm phép so bị nhiễu — người xem sẽ chọn "cái tối nhìn sang hơn" thay vì
chọn đúng thứ đang được hỏi.

Phần tương phản mất đi được kê lại bằng chrome, chứ không chỉ đổi mỗi màu nền:

| Phần tử của wall | Nền tối (cũ) | Nền trắng (mới) |
|---|---|---|
| Eyebrow | `--st-gold-300` trên nền tối | `--st-green-700` trên `--st-green-50` |
| `#st-wall-title` / `#st-wall-sub` | `#fff` / `rgba(255,255,255,.66)` | `--st-n-900` / `--st-n-600` |
| `.st-wall-tile` nghỉ | bóng đổ tối; ảnh tự tách khỏi nền | `inset 0 0 0 1px var(--st-n-200), 0 2px 10px rgba(18,19,18,.10)` |
| `.st-wall-tile` hover | viền sáng | `inset 0 0 0 2px var(--st-green-500)` + vòng vàng |
| Ô **không** hover khi có ô khác đang hover | `brightness(.42)` | `brightness(.62) saturate(.72)` |
| `.st-wall-bar button` | `rgba(255,255,255,.10)` + `backdrop-filter` | `--st-n-100` / `--st-n-700` |
| `.st-p2-close` | kính mờ | sáng, `--st-n-100` |

Hai chỗ phải chỉnh **mạnh tay hơn dự đoán**:

1. **Viền ô là bắt buộc, không phải trang trí.** Trên nền tối, ảnh sáng tự cắt ra khỏi
   nền. Trên nền trắng, ảnh có vùng sáng (trời, tường trắng) chảy tràn vào nền — mất
   hẳn cạnh ô. `inset 1px --st-n-200` khôi phục đường bao mà không thêm nặng.
2. **Độ mờ khi hover ô khác phải nhẹ đi.** `brightness(.42)` trên nền tối chỉ là "chìm
   vào nền"; trên nền trắng nó thành **8 vệt đen** trông như lỗi tải ảnh. `.62` +
   `saturate(.72)` giữ được ý "lùi ra sau" mà không tạo mảng tối.

**Ngoại lệ có chủ ý:** `.st-p2-close` quay lại kiểu kính mờ khi `#st-pop2.st-state-slider`
— slider vẫn nền tối, nút sáng đè lên ảnh tối sẽ chói.

---

### (b) Nút "Xem trên bản đồ 2D" lên hàng tìm kiếm

Trước: nút nằm trong `.st-popup-foot`, cạnh legend + skip. Sau: `.st-search-row` (mới)
bọc `.st-search` + `.st-head-map`, đặt ngay dưới phụ đề.

Ngoài việc khách yêu cầu, chỗ mới **đúng ngữ nghĩa hơn**: tìm kiếm và bản đồ là hai cách
*tìm một điểm* — cùng một nhóm hành động. Footer còn lại legend + "Để tôi tự khám phá",
tức là hai cách *thoát*. Ở footer, nút bản đồ nằm kẹp giữa hai thứ không liên quan gì
tới nó.

Giữ nguyên luật của D-52 — **ẩn nút này khi đang xem danh sách**, vì đã có `.st-list-map`
đúng phạm vi khu vực đang xem. Chỉ đổi selector:
`#st-popup.st-state-list .st-foot-map` → `#st-popup.st-state-list .st-head-map`.
`.st-foot-actions` và `.st-foot-map` **đã xoá hẳn** khỏi cả HTML lẫn CSS.

Mobile ≤599px: `.st-search-row` chuyển `column` — 390px không đủ cho ô tìm + nút nằm ngang.

---

### (c) Cỡ thẻ carousel suy từ CHIỀU CAO SÂN KHẤU, bỏ hằng số `vh`

Đây là phần tốn công nhất, và là nguyên nhân gốc của "khoảng trống" khách thấy.

**Vì sao bản cũ phí chỗ.** `--st-card-w: min(clamp(340px,38vw,560px), 66vh)`. Hằng số
`66vh` phải chọn đủ nhỏ để an toàn ở **màn thấp nhất** (điện thoại xoay ngang, ~380px),
nên ở màn cao nó bỏ phí cả trăm pixel. Tệ hơn: `vh` là chiều cao **viewport**, không
phải chiều cao **còn lại sau header + footer** — hai con số đó lệch nhau, và lệch khác
nhau ở mỗi breakpoint, nên không có hằng số nào đúng được cho tất cả.

**Cách mới — đảo chiều phụ thuộc.** Sân khấu là phần tử co giãn duy nhất; thẻ cao đúng
bằng nó (trừ chỗ chừa cho bóng đổ), `aspect-ratio` lo bề ngang:

```css
.st-cr-card {
  height: min(calc(100% - var(--st-shadow-room)),      /* chặn theo sân khấu */
              calc(var(--st-card-maxw) / 1.5));        /* chặn theo bề ngang màn */
  aspect-ratio: 3 / 2;
  width: auto;
}
```

Không còn hằng số chiều cao nào. Thẻ **luôn to hết mức khung cho phép**, ở mọi kích
thước — kể cả kích thước chưa nghĩ tới.

> **Bẫy đã vấp: `aspect-ratio` bị BỎ QUA khi cả hai chiều đều bị ràng buộc.** Bản thử
> đầu viết `height: calc(100% - 30px)` **+** `max-width: var(--st-card-maxw)`. Cả hai
> chiều có giới hạn → trình duyệt không còn bậc tự do nào để áp tỉ lệ, và nó **bỏ tỉ lệ**
> chứ không bỏ giới hạn. Đo được **720×729** ở màn 1920 (tỉ lệ 0.99 thay vì 1.5) — thẻ
> gần vuông, ảnh `cover` cắt mất hai đầu. Sửa: diễn đạt **cả hai** giới hạn qua *chiều
> cao* rồi `min()`, để bề ngang hoàn toàn tự do.

`--st-card-step` cũng đổi đơn vị: từ `px` (suy từ `--st-card-w`) sang **`%`**.
`translateX(%)` ăn theo bề ngang **của chính phần tử**, nên bậc dịch tự đúng tỉ lệ với
thẻ mà không cần biết thẻ rộng bao nhiêu px — đúng thứ cần, vì giờ không ai biết trước
con số đó nữa.

**Bỏ luôn cặp auto-margin** (mô tả cũ ở `04-modals.md` §4.1). Cặp `margin-top: auto` ở
`.st-popup-head` + `.st-popup-foot` sinh ra để căn giữa khối nội dung **khi carousel còn
nhỏ hơn chỗ trống**. Giờ carousel ăn hết chỗ thừa nên không còn gì để căn — mà cặp
auto-margin lại **cạnh tranh trực tiếp** với nó: muốn cặp đó sống thì `#st-popup-deck`
phải là `flex: 0 1 auto`, tức là deck bị cấm lớn. Đảo lại:

```
.st-popup-head  flex: none          (margin-bottom cố định)
#st-popup-deck  flex: 1 1 auto      ← ăn hết chỗ còn lại
.st-popup-foot  flex: none          (padding-top, KHÔNG margin-top)
```

Luật cũ "khoảng hở với carousel phải là `padding-top`, không phải `margin-top`" vẫn
đúng, nhưng giờ vì lý do khác: không còn auto-margin để phá, mà `margin-top` sẽ bị
`min-height: 0` của deck nuốt mất khi màn hẹp.

---

### Kết quả đo (Playwright, 7 viewport)

| Viewport | Thẻ giữa | Tỉ lệ | Tràn | Nút bản đồ cùng hàng ô tìm |
|---|---|---|---|---|
| 1920×1080 | 560×373 → **820×547** *(+46%)* | 1.500 | −16 | ✅ |
| 1440×900 | 547×365 → **662×442** *(+21%)* | 1.500 | −16 | ✅ |
| 1440×810 | **662×442** | 1.500 | −16 | ✅ |
| 1280×720 | **554×369** | 1.500 | −16 | ✅ |
| 1024×768 | **573×382** | 1.500 | −16 | ✅ |
| 390×844 | **304×203** | 1.500 | −12 | xuống hàng — đúng thiết kế |
| 740×380 (xoay ngang) | **218×146** | 1.500 | −16 | ✅ |

`Tràn` = `footer.bottom − inner.bottom`; **âm là còn dư chỗ**. Hai cột "trước" chỉ có ở
1920 và 1440×900 vì đó là hai chỗ tính lại được chính xác từ công thức cũ.

Nền: cả `index.html` và `index2.html` đo được `background-color: rgb(255,255,255)` +
`background-image: none` ở gốc, và `.st-wall` cũng vậy. 0 lỗi console ở mọi viewport.

**Trạng thái:** 🟢 — khách yêu cầu trực tiếp cả 3 ý.

---

## D-55 · ⭐ Chuyển động: 5 thẻ · autoplay 3,0s · parallax · vào màn dựng lại · ẢNH NGUỒN · 🟢 · 2026-08-04

**Yêu cầu (YC-15):** *"animation tự động chuyển slide mượt mà hơn, thời gian ngắn lại
một chút, nếu ảnh đã to thì preview 2 bên mỗi bên 2 tấm ok · hover vào ảnh chính có
chuyển động giống bên index2 · animation xuất hiện khi mở modal chưa đẹp, tôi muốn
sống động và kích thích mắt nhìn hơn · Xem lại xem vì sao ảnh vỡ như thế"* và, cho
bản 2, *"Animation xuất hiện chưa có"*.

---

### (a) 5 thẻ — và vì sao KHÔNG nhân tuyến tính được

`visible: 1 → 2` trong `js/popup.js`. Đổi được là nhờ D-54: thẻ giữa đã to hẳn nên
bậc ±2 đọc ra là **lớp nền có chiều sâu**, không phải "thêm 2 thứ nữa phải chọn"
(⚫ lo ngại đó chính là lý do D-49 hạ xuống 3 thẻ — nay đã hết hiệu lực).

Nhưng công thức cũ nhân thẳng `--st-o` vào mọi đại lượng thì bậc ±2 ra:

| Đại lượng | Nhân tuyến tính | Thực tế trên màn |
|---|---|---|
| dịch ngang | `2 × 66%` = 132% bề ngang thẻ | thẻ nằm **ngoài** mép màn |
| nghiêng | `2 × 33°` = 66° | gần như nhìn nghiêng cạnh tờ giấy — chỉ còn một vệt |
| mờ | `1 − 2 × .30` = `.40` | trong suốt tới mức nhìn xuyên qua thấy thẻ sau |

Nên tách thành **4 biến bậc riêng** (`--st-spread` `--st-depth` `--st-turn` `--st-hs`),
mặc định bằng bậc tuyến tính, rồi ghi đè cho bậc ±2 bằng `[data-oa="2"]`:

```css
.st-cr-card[data-oa="2"] {
  --st-spread: calc(var(--st-o) * .92);   /* 1,84 bậc thay vì 2 */
  --st-depth:  1.62;
  --st-turn:   calc(var(--st-o) * .5);    /* = ±1 → NGHIÊNG BẰNG bậc ±1 */
}
```

`--st-turn` cho bậc ±2 **bằng đúng bậc ±1** là chủ ý: các thẻ rìa thành một chồng mặt
phẳng **song song** lùi dần — đó là dáng coverflow thật. Nghiêng tăng dần thì thẻ ngoài
cùng biến thành một vệt màu.

> Đây là lần đầu `[data-oa]` được dùng thật. Attribute đó do `js/carousel.js` ghi song
> song với biến `--st-oa` từ D-44, giữ lại vì *"custom property không dùng làm selector
> được"* — đúng một năng lực mà bố cục 5 thẻ cần đến.

**Đo lại (Playwright, sau khi sửa):**

| Viewport | Số thẻ | Thẻ giữa | Bậc ±2 hé ra trong màn |
|---|---|---|---|
| 1920×1080 | 5 | 820×547 | 440px |
| 1440×900 | 5 | 662×442 | 292px |
| 1280×720 | 5 | 548×365 | 281px |
| 1024×768 | 3 | 573×382 | — (ẩn) |
| 390×844 | 3 | 359×239 | — (ẩn) |

**Dưới 1280px quay về 3 thẻ.** Ở 1024–1279 `--st-card-maxw` đã nới lên `56vw` (D-54),
đẩy bậc ±2 ra chỉ còn hở ~110px — đọc ra là một vệt màu chứ không phải "còn ảnh nữa".
Thà 3 thẻ rõ còn hơn 5 thẻ trong đó 2 cái là rác. Ẩn bằng **CSS**
(`.st-cr-card[data-oa="2"] { display: none }`) chứ không hạ `visible` trong JS: JS vẫn
dựng đủ 5 thẻ nên xoay ngang máy là bậc ±2 hiện lại ngay, không phải dựng lại carousel.

### (b) Độ mờ KHÔNG còn là cách diễn tả chiều sâu

`opacity` bậc ±1 từ `.70` → `.925` (hệ số `.30 → .075`). Với 3 thẻ, `.70` không sao vì
thẻ rìa nằm trên nền trắng trơn. Với 5 thẻ thì **bậc ±1 và ±2 chồng lên nhau**: thẻ mờ
70% thành cửa kính, nhìn xuyên qua thấy thẻ sau — ảnh chụp ở 1920 đọc ra thành *ảnh bị
nhoè*, đúng cái mà khách đang phàn nàn ở việc khác. Việc "lùi ra sau" dồn hết cho
`brightness` (`.80` / `.66`) + `scale` + `translateZ`, ba thứ không tạo hiệu ứng X-quang.

### (c) Autoplay 3600 → 3000ms · transition 620 → 720ms · easing mới

Khách muốn **mượt hơn** và **ngắn lại**. Hai vế đó không mâu thuẫn vì chúng nói về hai
đại lượng khác nhau: *ngắn* là quãng ĐỨNG YÊN, *mượt* là quãng ĐANG CHẠY.

- Autoplay `3600 → 3000ms`. Trừ transition còn ~2,3s đứng yên mỗi thẻ — vẫn đủ đọc tên
  khu vực, mà cả vòng 9 khu vực chỉ mất 27s thay vì 32s.
- Transition `620 → 720ms` và đổi easing sang **`--st-ease-flow`** (token mới,
  `cubic-bezier(.32,.04,.12,1)`). `--st-ease-out` là expo-out: 80% quãng đường xong
  trong 25% thời gian. Ở quãng ngắn đọc ra là "nhanh nhẹn", nhưng quãng đi của thẻ dài
  bằng cả bề ngang của chính nó — ở quãng đó expo-out đọc ra là **giật rồi trôi**.
- Thêm `transition-delay: calc(var(--st-oa) * 34ms)`: thẻ ngoài chạy sau thẻ trong một
  nhịp, cả dải trôi thành **một làn sóng** thay vì 5 mảnh nhảy cùng lúc.

### (d) Parallax trên thẻ giữa — mượn của bản 2

Khách: *"hover vào ảnh chính có chuyển động giống bên index2"*. Bên đó là
`js/wall.js:bindParallax` — ghi `--px/--py` theo vị trí con trỏ, CSS gộp vào transform
của ảnh. Chép **ý tưởng**, không chép được code: thẻ 3D và ô grid không dùng chung
markup.

Một chỗ phải làm khác: nghe `pointermove` trên `.st-cr-stage` chứ không trên từng thẻ.
Thẻ rìa nghiêng tới 33° nên `getBoundingClientRect()` của chúng lệch hẳn so với hình
người dùng thấy — bám theo sẽ ra parallax **ngược chiều**. Thẻ giữa thì `rotateY = 0`,
rect khớp đúng những gì trên màn.

`go()` gọi `clearParallax()`: thẻ vừa rời khỏi giữa phải trả ảnh về đúng tâm, nếu
không nó mang theo độ lệch của lần hover cuối suốt vòng đời còn lại.

### (e) Vào màn — dựng lại cả hai bản

Bản 1 trước đây chỉ có `opacity` trên thẻ; bản 2 có dịch 14px + `scale(.97)`. Khách
nói bản 1 *"chưa đẹp"* và bản 2 *"chưa có"* — vế thứ hai đáng chú ý vì animation ở đó
**có chạy**, chỉ là không nhìn thấy được:

| Vì sao không thấy | Sửa |
|---|---|
| 14px + `.97` trên nền TRẮNG gần như không đọc ra là chuyển động | quãng đường → 46px + `scale(.86)` |
| `#st-pop2` fade `opacity` 400ms **đè lên đúng lúc** 9 ô đang so le | lớp fade khung xuống 320ms, xong sớm để nhịp bên trong còn đất diễn |
| Ảnh trong ô đứng im | Ken Burns `scale(1.18) → 1`, 1300ms — đây mới là thứ làm nó "sống" |

Ràng buộc cũ vẫn nguyên: **không animate `transform` của `.st-cr-card`** (transform của
nó do `--st-o` lái, chồng animation vào sẽ giật ngay bậc chuyển đầu tiên). Cách đi
vòng là animate 3 thứ *quanh* nó:

| Lớp | Animation | Delay |
|---|---|---|
| `.st-brandline` | `scaleX(0) → 1` từ mép trái | 0 |
| eyebrow · title · sub · hàng tìm | `st-fade-up` 22px + `scale(.97)` | 100/170/240/310ms |
| `.st-cr-stage` | bay lên 38px + `scale(.9)` | 120ms |
| `.st-cr-card` | chỉ `opacity`, so le **TỪ GIỮA RA** (`--st-oa`) | 240 + oa×130ms |
| `.st-cr-img` | Ken Burns `scale(1.16) → 1`, 1200ms | 180ms |
| `.st-cr-nav` · `.st-cr-dots` · footer | pop / fade-up | 660/720/780ms |

Thẻ giữa vào **trước**, rồi lan dần ra rìa — mắt bắt đúng thứ cần chọn trước tiên.

> ⚠️ **`backwards`, không phải `both`.** `forwards` giữ quyền điều khiển thuộc tính sau
> khi animation kết thúc — `.st-cr-img` còn phải nhận transform parallax khi hover và
> `.st-wall-tile` còn phải nhận `scale(1.028)` khi hover. Cả hai sẽ chết cứng.

### (f) "Vì sao ảnh vỡ" — ảnh nguồn trên site chỉ 600×600

Không phải lỗi CSS. Truy ngược 12 URL gốc ở [`06-data.md`](06-data.md) §6.8:

**9 trong 12 ảnh gốc là thumbnail 600×600** (`tulinh` còn 500×499). Cắt 600×600 về 3:2
được `600×400`, rồi bản trước **phóng lên** `760×507` ngay từ khâu dựng asset — tức
ảnh đã bị nội suy 1,27× trước khi trình duyệt chạm vào. D-54 nâng thẻ giữa lên 820 CSS
px → tổng cộng ~2,05× ở màn thường và **~4,1× trên màn 2×**. Đó là cái "vỡ".

**Sửa:** đổi nguồn sang ảnh thân bài của **trang chi tiết** từng điểm (`/cung-vang-dien-ngoc`,
`/lau-dai-tuyet`, …) — chỗ đó có ảnh 975–1200px mà trang danh sách `/kham-pha` không có.
9/12 ảnh lên được ≥900px; **cắt và không bao giờ phóng to** (bề ngang xuất = bề ngang
thật của nguồn sau khi cắt, trần 1200).

| | Trước | Sau |
|---|---|---|
| Bề ngang ảnh | 760 (đã phóng từ 600) | 500 – 1200, **không phóng** |
| Hệ số phóng ở thẻ 820px, màn 1× | 1,08× *(trên nền đã nội suy 1,27×)* | 0,68× – 1,64× |
| Tổng bộ | ~930 KB | ~1,32 MB |

**3 điểm KHÔNG cứu được:** `cong` · `casau` (600×600) và `tulinh` (500×499) — trang chi
tiết của chúng không có ảnh nào lớn hơn. Đã kiểm cả `/vuong-quoc-ca-sau`, `/ca-sau`,
`/du-thuyen-tu-linh`, `/thuy-cung`. Chỉ khách mới có bản gốc → **Q-37 nâng lên 🔴**.

> Vì sao lần trước không phát hiện: docs §6.8 chỉ ghi "gốc 116 KB – 17 MB" — **dung
> lượng**, không phải **kích thước pixel**. Một PNG 600×600 nặng 846 KB nên con số
> dung lượng trông rất yên tâm. Bài học: bảng nguồn ảnh phải ghi `W×H`, không ghi KB.

### (g) `--st-n-800` không tồn tại — ô wall chưa tải ảnh thành vệt xám

`.st-wall-tile { background: var(--st-n-800) }` — thang neutral trong `tokens.css` nhảy
thẳng `700 → 900`, **không có 800**. Khai báo hỏng → nền thành `transparent`, nên ô chưa
tải xong ảnh chỉ còn `.st-wt-veil` phủ lên nền trắng: một vệt xám dọc trông y như ảnh
lỗi. Đổi sang `--st-n-200` — cũng là lựa chọn đúng hơn cho nền trắng: chỗ giữ ảnh phải
**sáng hơn** ảnh, không tối hơn.

Bắt được nhờ chụp màn hình ở mốc 500ms của animation vào (mục e) — ở trạng thái cuối
ảnh đã tải xong nên lỗi này **không bao giờ hiện ra** trong ảnh chụp thường.
*(Đã nằm trong `TODO.md` từ D-54 dưới dạng "xem lại `--st-n-800`" nhưng ghi là chuyện
thẩm mỹ, không phải lỗi.)*

### (h) Mobile: thẻ `78vw → 92vw`

Ở màn dọc, thứ chặn cỡ thẻ là **bề ngang**, không phải chiều cao — `78vw` ra thẻ
`304×203` nằm giữa một sân khấu cao 430px, tức bỏ không hơn 200px. Nới bề ngang là cách
*duy nhất* lấy lại chỗ đó (chiều cao thừa cũng vô dụng khi tỉ lệ đã khoá ở 3:2). Thẻ
lên `359×239`, **+45% diện tích**.

Nới xong phải kéo `--st-card-step` `82% → 74%` theo, nếu không 2 thẻ preview bị đẩy ra
gần hết màn, chỉ còn hở ~37px — hết ý nghĩa "còn nữa, quẹt tiếp đi".

**Phương án đã loại:** giấu phụ đề trên mobile để lấy chỗ. Không giải quyết gì — thẻ
đang bị chặn bởi *bề ngang*, cho thêm chiều cao chỉ làm khoảng trống to hơn.

---

## D-56 · Danh sách điểm: từ DÒNG sang THẺ ẢNH · 🟢 · 2026-08-04

**Yêu cầu (YC-15):** *"Trang danh sách các nơi trong từng khu vực không đẹp, thiết kế
kiểu khác đi"*.

Bản trước (D-52) mỗi điểm là một **dòng ngang**: ảnh 104px bên trái · chữ ở giữa · cột
nút xanh bên phải. Ba mảng màu khác nhau trên mỗi dòng, 12 dòng chồng lên nhau ra một
**bảng dữ liệu** — trong khi thứ người dùng đang chọn là **cảnh để đi xem**.

Giờ mỗi điểm là một thẻ ảnh `4:3` phủ kín, chữ đè lên đáy sau một lớp gradient — **đúng
ngôn ngữ của thẻ carousel ở màn trước đó và của ô wall bên bản 2**. Ba màn của cùng một
sản phẩm thì phải trông như cùng một sản phẩm.

| Thành phần | Ghi chú |
|---|---|
| `.st-li-no` | Số hiệu bản đồ, góc trên-trái — **cùng con số với pin** ở §3.5, để nối được hai màn |
| `.st-li-must` | Badge ★ vàng, góc trên-phải (`D.mustOf`) |
| `.st-li-cat` `.st-li-name` | Luôn hiện |
| `.st-li-blurb` `.st-li-cta` | `max-height: 0` → chỉ hiện khi hover. 12 thẻ cùng khoe mô tả một lúc thì không đọc được cái nào — cùng cách làm với `.st-wt-sub` của bản 2 |
| `.st-li-noimg` | Vẫn giữ: gradient brand + số hiệu cho 8 điểm chưa có ảnh (Q-38) |

Lưới `minmax(300px → 238px, 1fr)`, `align-content: start` (3 thẻ thì bám đỉnh, không
giãn ra chiếm cả màn). Vào màn so le `--i × 38ms`, **chặn ở `min(--i, 9)`**:
`renderList()` chạy lại **mỗi lần gõ** vào ô tìm kiếm, không chặn thì thẻ thứ 20 phải
đợi 760ms mới hiện — gõ nhanh sẽ thấy danh sách như đang treo.

`listGrid.scrollTop = 0` sau mỗi lần dựng: đổi khu vực mà giữ nguyên vị trí cuộn cũ thì
danh sách mới hiện ra ở giữa chừng, trông như đã bị bấm nhầm.

**Mobile: 2 cột, bỏ hẳn blurb/CTA.** Một cột ở 390px ra thẻ cao 292px — cuộn 12 thẻ như
vậy là 3,5 màn hình. Blurb/CTA chỉ hiện khi hover mà điện thoại không có hover, nên để
lại chỉ tốn chỗ tính toán.

**`D.mustOf(key)` mới trong `js/data.js`:** `must` sống trên `CARDS` chứ không trên
`DESTINATIONS` (nó là thuộc tính của việc *trưng bày*, không phải của *địa điểm*) —
nhưng danh sách cũng cần đọc nó, nên bọc lại thành helper thay vì lặp `filter`.

---

## Nhật ký sửa đổi

| Ngày | Thay đổi |
|---|---|
| 2026-08-04 (v16) | **Thêm D-55 + D-56 (YC-15).** D-55: carousel lên 5 thẻ với 4 biến bậc tách riêng (bậc ±2 nén lại, nghiêng bằng bậc ±1) · độ mờ thôi làm việc diễn tả chiều sâu (`.70 → .925`, dồn cho brightness) · autoplay `3600 → 3000ms`, transition `620 → 720ms` + token easing mới `--st-ease-flow` + delay so le theo bậc · parallax trên thẻ giữa (mượn của `wall.js`) · dựng lại animation vào màn cho **cả hai bản** (bản 2 trước đây có nhưng bị lớp fade khung nuốt mất) · **ảnh nguồn: 9/12 ảnh gốc trên site chỉ 600×600 và bản cũ đã phóng lên 760 từ khâu dựng asset** → đổi sang ảnh trang chi tiết, 9/12 lên ≥900px, không bao giờ phóng to · sửa `--st-n-800` (token không tồn tại) · mobile thẻ `78vw → 92vw`. D-56: danh sách điểm từ DÒNG sang THẺ ẢNH 4:3. |
| 2026-08-04 (v15) | **Thêm D-54** — nền trắng phẳng cho **cả 2 bản** (bỏ vệt radial; **đảo ngược D-50 #4** = bản 2 hết nền tối), nút bản đồ chuyển từ footer lên hàng tìm kiếm, cỡ thẻ carousel suy từ chiều cao sân khấu thay vì hằng số `66vh` (bỏ cặp auto-margin). |
| 2026-08-03 (v14) | **Thêm D-53** — `base.css` `img { max-width: 100% }` kẹp `.st-wt-img` (`width: 112%`) làm lộ dải trống 34px mép phải mọi ô wall. Sửa bằng `max-width: none`; thêm `tools/check-image-cover.js` đo rect thật thay vì chỉ kiểm thuộc tính CSS. |
| 2026-08-03 (v13) | **Thêm D-51 + D-52** — bản đồ 2D có pin số hiệu (dùng chung 2 bản, lọc theo khu vực đang xem) và bản 1 đổi thẻ carousel từ ĐIỂM sang KHU VỰC + thêm ô tìm kiếm. |
| 2026-08-03 (v12) | **Thêm D-50** — dựng `index2.html` (VR Wall + Infinite Slider) theo note.md §137, **song song** với `index.html` để khách so sánh. 6 file mới, dùng chung `bridge.js` nên trang cha không phải sửa gì. |
| 2026-08-03 (v11) | **Thêm D-48 + D-49** — khách chốt popup **chiếm trọn màn** (bỏ scrim + panel) và carousel còn **3 thẻ** (1 giữa to + 1 preview mỗi bên). D-47 hết đối tượng. |
| 2026-08-03 (v10) | **Thêm D-46 + D-47** — khách chốt project chỉ còn CÁI POPUP, nhúng iframe vào trang khác. Gỡ 12 file, gộp 4 file engine thành `popup.js`, thêm `bridge.js` + `host-demo.html`. **Hết hiệu lực: D-29, D-39, D-40, D-41, D-42, D-43, D-45.** |
| 2026-08-03 (v9) | **Thêm D-44 + D-45** — khách yêu cầu bỏ bản đồ hotspot, thay bằng 3D carousel ảnh banner lấy từ suoitien.vn; và báo lỗi modal mở lần 2 không thấy nội dung. **Đảo ngược D-08 (cả nhánh Q-30) + D-32.** |
| 2026-08-01 (v4) | **Thêm D-43** — khách gửi 2 ảnh overlay và yêu cầu clone luôn "trang mở ra bên trong nút". Dựng `#st-route` (M2) + `#st-places` (M3). **Đảo ngược D-09v2.** |
| 2026-08-01 (v3) | **Thêm D-41 + D-42** — khách phản hồi lần 2: nút combo tách thành **thẻ vé** (dạng `.j-seanote`, bỏ stamp + bỏ nút trong vé) đặt dưới navbar bên phải; cụm C **bỏ div nền**, 2 pill rời xếp ngang. **Đảo ngược phần "xếp dọc" của D-40** — combo rời đi nên hàng ngang lại vừa. |
| 2026-08-01 (v2) | **Thêm D-39 + D-40** — khách chốt lại phạm vi: chỉ header + 3 nút cụm C + modal welcome. **Đảo ngược D-05v2**: cụm C về dưới-trái, xếp dọc, vì prototype sẽ ĐÈ LÊN trip360 chứ không thay thế nó. |
| 2026-08-01 | **Thêm D-38** — khách yêu cầu bỏ badge `360°` trên tab VR360. Gỡ CSS + JS + field `badge` trong schema. |
| 2026-07-30 | Tạo file. D-01 → D-22 từ phân tích site + brief. Mọi D liên quan tới Q đều 🟡. |
| 2026-07-30 (v2) | Khách trả lời 28 câu + gửi 6 ảnh. **Đảo ngược D-05, D-07, D-10** (đều vì thông tin mới từ ảnh / lựa chọn của khách). **Sửa** D-09, D-12, D-21. **Thêm** D-23 → D-30. Phần lớn D chuyển 🟡 → 🟢. |
| 2026-07-31 (v2) | **Thêm D-37** — khách phản hồi lần 5. Sửa luật responsive topbar về đúng gốc (dải 900–1200) + đo lại 2 lá cờ bằng fit RMS ở cỡ thật. |
| 2026-07-31 | **Thêm D-36** — khách phản hồi lần 4 về topbar phải. Bỏ hẳn lối vẽ tay icon FontAwesome, chuyển sang trích outline từ font gốc; sửa cỡ glyph, tỉ lệ cờ, sao VN, khoảng hở cờ↔social. |
| 2026-07-30 (v3) | Viết code prototype. **Thêm D-31 → D-35** — cả 5 đều phát hiện khi **chạy test tự động (Playwright)**, không phải khi đọc code: nút peek không bấm được, mobile map quá nhỏ, CORS `file://`, hotspot lệch do letterbox, vệt nối panorama. |

### Ghi chú về 6 quyết định bị đảo ngược

Đều do **thiếu thông tin** hoặc **ràng buộc thay đổi**, không phải do lập luận sai:

- **D-05** — tôi không biết dưới-giữa đã có cụm 4 nút. Ảnh 5 mới cho thấy. Kết luận
  mới (hợp nhất) mạnh hơn kết luận cũ (dời chỗ).
- **D-07** — khách có ý cụ thể hơn (slide + nút peek) và **tốt hơn** ý của tôi
  (fade + auto-hiện).
- **D-10** — khách chọn nhảy thẳng; hoá ra nó còn cho bản đồ rộng hơn 38%, và rủi ro
  click nhầm được D-29 (nút mở lại) xử lý gọn.
- **D-05v2** — lập luận thẩm mỹ đúng nhưng thiếu một ràng buộc: prototype không THAY
  giao diện trip360, nó ĐÈ LÊN. "Hợp nhất 2 pill" trên bản mô phỏng = "2 pill chồng
  nhau" khi ghép thật. D-40 sửa lại.
- **D-40 (phần "xếp dọc")** — tính toán đúng với ràng buộc lúc đó (3 nhãn không lọt
  454px). Ràng buộc mất khi nút combo tách ra thành thẻ vé riêng (D-41), nên hàng ngang
  lại vừa. Phần "về góc dưới-trái" của D-40 **vẫn giữ**.
- **D-09v2** — lập luận "đừng dựng lại cái đã tốt" đúng cho câu hỏi *dùng*, sai cho
  câu hỏi *demo*. Bản giữ chỗ làm mạch trình bày đứt đúng chỗ khách muốn xem nhất.
  D-43 sửa lại.
- **D-50 #4 (nền tối của bản 2)** — lập luận thị giác đúng ("9 ô ảnh trên nền trắng
  thành mảng màu hỗn loạn") nhưng trả lời sai câu hỏi. Câu hỏi thật không phải *"nền
  nào đẹp hơn?"* mà *"làm sao để khách so được carousel với mosaic?"* — và hai nền
  khác nhau làm hỏng đúng phép so đó. D-54(a) sửa lại; phần tương phản mất đi được bù
  bằng viền ô + hạ độ mờ, không bằng nền.
- **D-08 / D-32** — bản đồ stylized là câu trả lời hợp lý cho *"lấy gì lấp
  modal khi chưa có ảnh?"*. Câu hỏi đó hết hạn khi khách chỉ ra kho ảnh banner có
  sẵn trên site chính. Ảnh thật thắng hình vẽ ở mọi tiêu chí, kể cả tiêu chí ban
  đầu là "gây ấn tượng". D-44 sửa lại; Q-30 và D-32 là hai nhánh mọc ra từ D-08 nên
  rụng theo.
