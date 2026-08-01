> Cập nhật: 2026-08-01 (v8 — thêm D-43 clone M2/M3; D-09v2 bị đảo ngược)

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

## D-08 · Bản đồ welcome SVG stylized, làm thêm bản dùng map thật · 🟢 (Q8) + 🟡 (Q-30)

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

## D-29 · Modal welcome hiện 1 lần + morph về nút · 🟢 (Q12)

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

## D-32 · Mobile: thêm danh sách 8 điểm dưới bản đồ · 🔵 · phát hiện khi test

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

## D-34 · Kích thước bản đồ tính bằng JS (`fitMap`) · 🟢 · phát hiện khi test

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

## D-39 · Thu phạm vi: chỉ header + 3 nút cụm C + modal welcome · 🟢 · 2026-08-01

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

## D-41 · Nút combo tách ra thành THẺ VÉ riêng, dưới navbar bên phải · 🟢 · 2026-08-01

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

## D-43 · Clone 2 overlay mở ra từ cụm C · 🟢 · 2026-08-01 ⭐

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

## Nhật ký sửa đổi

| Ngày | Thay đổi |
|---|---|
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
