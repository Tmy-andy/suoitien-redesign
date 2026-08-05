> Cập nhật: 2026-08-05 (v19 — YC-18: desktop cũng nền sáng, nút bản đồ 2D trở lại · D-61)

# TODO

Ký hiệu: `[ ]` chưa làm · `[~]` đang làm · `[x]` xong (kèm ngày) · `[!]` bị chặn · `[-]` bỏ

---

## ⚠️ ĐỌC TRƯỚC — phần lớn file này thuộc về bản CŨ

Ngày **2026-08-03** project pivot: từ "prototype re-design cả trang VR" thành
**"một cái popup nhúng iframe"** (YC-10 · D-46), rồi popup chuyển sang **toàn màn**
với carousel 3 thẻ (YC-11 · D-48/D-49).

Mọi mục nói về header, navbar, dock, thẻ vé, viewer, M2/M3, vùng cấm, `?full=1`,
`?zones=1` đều **hết hiệu lực** — giữ nguyên làm history theo RULE #2.
Việc còn sống nằm ở §"⏭️ Việc tiếp theo (SAU PIVOT)" gần cuối file.

---

**Quy tắc:** việc mới thêm vào cuối section. Việc xong đánh `[x]` + ngày, **không xoá**
(giữ history). Sửa code là cập nhật file này cùng lượt (CLAUDE.md RULE #1).

---

## 🎯 Trạng thái: prototype v1 CHẠY ĐƯỢC

Mở `index.html` là xem được. Test tự động (Playwright, desktop 1440 + mobile 390):
**0 lỗi console**, mọi luồng chính chạy đúng.

---

## 🔴 P0 — Còn chặn (không chặn v1, chặn bước ghép vào bản thật)

- [!] **Q-34 · Cụm B (sidebar trái THAM QUAN/ẨM THỰC/…)** — header cao 104px làm cụm B
      nhìn "trôi", và `#fp-close` của overlay (`top:15px; z:10002`) bị header che →
      không đóng được overlay. Xem [`00-requirements.md`](00-requirements.md) §0.7.
- [!] **Q-29 · Nguồn dữ liệu chuẩn** — 6 chip thật khác 10 `type` của `catalog.json`.
      `map_places.json` mới là nguồn chính?
- [!] **Q-35 · Header đè cụm ⓐ (VN + chia sẻ)** 🔴 — sau khi thu phạm vi (D-39), đây là
      **điểm DUY NHẤT** còn xung đột với UI có sẵn. Header đã có `#st-lang` + 5 social
      nên nó *thay thế* ⓐ; cần khách chốt: khi ghép thì ẩn cụm ⓐ gốc đi?
      Giả định đang dùng: **ẩn**. Xem [`07-integration.md`](07-integration.md) §7.6.
- [!] **Q-36 · M2/M3 clone dùng làm gì khi ghép thật?** 🔴 ⭐ MỚI (D-43) —
      (a) chỉ để trình bày, bản thật vẫn chạy overlay cũ · (b) thay hẳn overlay cũ ·
      (c) lấy phần vỏ áp lên ruột cũ. Khuyến nghị **(c)**, cùng lý do đã chọn PA-B.
      Chọn (b) thì phải nối 6 nguồn dữ liệu ở [`06-data.md`](06-data.md) §6.7.
      Giả định đang dùng: **(a)**. Xem [`07-integration.md`](07-integration.md) §7.6.1.

## 🟡 P1 — Cần khách trả lời để hoàn thiện

- [-] ~~Q-30 · Bản đồ welcome: SVG tự vẽ hay bản đồ 3D thật?~~ · 2026-08-03 —
      **hết hiệu lực**, M1 không còn bản đồ (D-44). Đã gỡ `?map=real`.
- [ ] **Q-37 · Xác nhận quyền dùng 12 ảnh banner** lấy từ suoitien.vn cho tour VR,
      và xin bản gốc độ phân giải cao (vài tấm site đã nén sẵn) —
      danh sách nguồn: [`06-data.md`](06-data.md) §6.8
- [ ] **Q-38 · Ảnh cho 8 điểm còn thiếu** — `xelua` `taxi` `tauluon` `massage`
      `coixay` `vrgame` `thuyenrong` `thuyenbay` chưa có ảnh banner dùng được trên
      site chính. Có ảnh là carousel phủ hết bộ 20 điểm highlight.
- [ ] Q-32 · Link nút "Xem combo" — đang dùng `suoitien.vn/combo-tro-choi`
      (trùng đúng href mục *Bảng giá › Combo trò chơi* trong menu thật, không phải đoán)
- [ ] Q-31 · Logo SVG hoặc PNG nhỏ hơn (bản đang dùng 131 KB, load từ suoitien.vn)
- [ ] Q-33 · Item xám mờ ở ảnh 4 là "tạm đóng" hay "chưa có 360°"?
- [ ] D-23 · Xác nhận hệ 2 font (Arima cho tiêu đề/nav + Be Vietnam Pro cho body)
- [x] ~~Có muốn re-skin 2 overlay có sẵn?~~ → khách yêu cầu **clone hẳn**, đã dựng
      M2/M3 (2026-08-01 · D-43). Câu hỏi còn lại chuyển thành Q-36 ở §P0.
- [ ] URL LinkedIn thật (site chính cũng để `#`)
- [ ] Chốt 1 trong 3 biến thể tiêu đề — bấm `?debug=1` → nút A/B/C để chọn tại chỗ

## ✅ Đã giải quyết

- [x] Q1–Q28 · Khách trả lời đầy đủ · 2026-07-30
- [x] **Q24 · Màu** — 10 màu thật từ `style.css` site chính · 2026-07-30
- [x] **Q26 · Font** — `Arima Madurai`, verify có subset `vietnamese` · 2026-07-30
- [x] **Q18 · Menu** — 84 mục, 3 cấp, href thật · 2026-07-30
- [x] **Q17 · Link mua vé** — `suoitien.vn/chon-ve` · 2026-07-30
- [x] **Q21 · Logo** — URL verify 200 OK · 2026-07-30
- [x] **Q28** — "Lâu Đài **Pháp** Thuật" theo site chính · 2026-07-30
- [x] URL social thật (FB, TikTok, IG, YouTube) · 2026-07-30
- [x] Figma không còn là blocker · 2026-07-30

---

## 📄 Docs

- [x] `CLAUDE.md` + 12 file docs v1 · 2026-07-30
- [x] `00-requirements.md` v2 — 28 giải đáp + phân tích 6 ảnh + 7 câu hỏi mới · 2026-07-30
- [x] `02-design-system.md` v2 — màu + font THẬT · 2026-07-30
- [x] `03-components.md` v2 — dock hợp nhất, peek, reopen, CTA vé · 2026-07-30
- [x] `04-modals.md` v2 — bỏ preview panel, morph FLIP, M2/M3 ra khỏi phạm vi · 2026-07-30
- [x] `08-decisions.md` v2 — đảo ngược D-05/D-07/D-10, thêm D-23→D-30 · 2026-07-30
- [x] `01-architecture.md` v2 — cấu trúc thật, `i18n.js`, sơ đồ phụ thuộc · 2026-07-30
- [x] `06-data.md` v2 — 84 mục menu thật, `COPY.vi/en`, 6 chip, URL thật · 2026-07-30
- [x] `03/04/08` v3 — `#st-welcome-list`, `#st-existing`, D-31→D-35 · 2026-07-30
- [ ] `05-flows.md` v2 — luồng morph FLIP, luồng i18n, bỏ luồng M2/M3
- [ ] Thêm screenshot demo vào `README.md`

---

## 🏗️ Code — ĐÃ XONG

- [x] `index.html` — shell + **sprite 44 icon inline** + **bản đồ SVG inline** · 2026-07-30
- [x] `css/tokens.css` — 10 màu thật, 2 font, safe-area, z-index, `@supports` fallback · 2026-07-30
- [x] `css/base.css` — reset, focus ring, `prefers-reduced-motion`, nút dùng chung · 2026-07-30
- [x] `css/viewer.css` · `navbar.css` · `controls.css` · `welcome.css` · `overlays.css` · `responsive.css` · 2026-07-30
- [x] `js/data.js` — 20 destination (UUID thật), 8 hotspot, 84 mục menu, dock, CTA, 6 nhóm · 2026-07-30
- [x] `js/i18n.js` — `COPY.vi` + `COPY.en` đầy đủ, `data-i18n` scan · 2026-07-30
- [x] `js/store.js` · `a11y.js` (trap/Esc/lock/roving) · 2026-07-30
- [x] `js/viewer.js` — panorama mock 3 lớp parallax, drag + inertia, `goTo()` fade · 2026-07-30
- [x] `js/navbar.js` — topbar, navbar pill, 7 dropdown (1 dạng 3 cột), peek, drawer, VI/EN · 2026-07-30
- [x] `js/controls.js` — dock hợp nhất, popover, CTA vé, scene label, hint · 2026-07-30
- [x] `js/overlays.js` — engine open/close, **morph FLIP**, share, help, toast, swipe drawer · 2026-07-30
- [x] `js/welcome.js` — 8 hotspot stagger, mini-card, danh sách mobile, `fitMap()` · 2026-07-30
- [x] `js/app.js` — bootstrap, query params, debug panel · 2026-07-30

### Chi tiết đã hiện thực

- [x] Topbar vàng `#DEA800` + navbar xanh `#128125` pill 50px + **đường đỏ + vệt gradient** · 2026-07-30
- [x] Logo **ở giữa** navbar, tràn lên trên, fallback wordmark khi offline · 2026-07-30
- [x] Tab `VR360` + badge `360°` vàng, active, pulse 2 lần · 2026-07-30
- [x] ~~Badge `360°`~~ — **bỏ theo yêu cầu khách**, tab chỉ còn chữ `VR360` (D-38) · 2026-08-01
- [x] Dropdown **nền xanh** (đúng site), "TRÒ CHƠI" dạng **3 cột** · 2026-07-30
- [x] Header **slide `translateY(-100%)`** khi kéo panorama + `#st-nav-peek` mũi tên kép nhấp nhô · 2026-07-30
- [x] Dock hợp nhất: `Chỉ đường` primary · `Điểm đến` secondary outline (**bỏ `#1769ff`**) · nút mở lại welcome · 4 nút circle · `⋯` · 2026-07-30
- [x] CTA `MUA VÉ` + `MUA COMBO` — vàng, chữ đỏ, **4 vệt viền chạy** như site chính · 2026-07-30
- [x] Modal welcome: 3 biến thể tiêu đề, 8 hotspot stagger 55ms, ring vàng "nên xem" · 2026-07-30
- [x] Click hotspot → **nhảy thẳng** (Q10=a) + mini-card khi hover · 2026-07-30
- [x] **Morph FLIP** modal ↔ nút trong dock, có fallback reduced-motion · 2026-07-30
- [x] `#st-scene-label` tên điểm + `9/158`, `aria-live` · 2026-07-30
- [x] `#st-existing` — panel giữ chỗ giải thích 2 overlay đã có sẵn · 2026-07-30
- [x] Share (copy 2 tầng fallback) · Help 5 bước · Toast · Drawer swipe · 2026-07-30
- [x] i18n VI/EN toàn bộ UI, đổi ngôn ngữ render lại menu · 2026-07-30
- [x] Debug panel `?debug=1`: state, đổi tiêu đề A/B/C, đổi bản đồ, reset localStorage · 2026-07-30

### Lỗi tìm được khi test và đã sửa

- [x] **Nút peek không bấm được bằng chuột** (hover-reveal triệt tiêu chính nó) → bỏ hover-reveal · D-31 · 2026-07-30
- [x] **CSS icon toàn cục `svg > g` ghi đè fill của bản đồ SVG** → chỉ nhắm `svg use` · 2026-07-30
- [x] **Focus ring vẽ quanh tiêu đề modal** (heading `tabindex="-1"` nhận focus bằng script) → tắt ring cho heading · 2026-07-30
- [x] **Vệt nối dọc rất rõ trên panorama** khi kéo → thiết kế lại 3 lớp cho liền mạch · D-35 · 2026-07-30
- [x] **Hotspot lệch khỏi bản đồ** khi chiều cao bị cắt (SVG letterbox trong khung) → `fitMap()` · D-34 · 2026-07-30
- [x] **Mobile: bản đồ 358×222, hotspot chen chúc** → thêm `#st-welcome-list` · D-32 · 2026-07-30
- [x] Nhãn "CỔNG CHÍNH" đè hotspot cổng → dời nhãn xuống · 2026-07-30
- [x] **Hover navbar có nền nhạt — site gốc KHÔNG có** (khách chỉ ra). CSS thật ghi rõ
      `.search-form-menu .halink-nav-menu li a:hover { background: none; }`. Đã bỏ nền
      ở cả hover và tab VR360 active; phản hồi chỉ còn gạch chân gradient · 2026-07-30
- [x] **Navbar chưa giống gốc** (khách gửi ảnh so sánh). Đã sửa 6 điểm · 2026-07-30:
      ① bỏ **mũi tên ▾** ở mục có dropdown (gốc không có)
      ② icon topbar cho vào **vòng tròn** `rgba(255,255,255,.42)`
      ③ đổi chữ `VI`/`EN` → **cờ VN / UK** (SVG inline)
      ④ social có **nền tròn** + đúng thứ tự gốc `FB · TikTok · LinkedIn · IG · YouTube`
      ⑤ logo to hơn (`96px`) và **tràn cả xuống dưới** navbar, có `width` dành riêng
      ⑥ **logo đang đè chữ "TRÒ CHƠI"** → chia lại nhóm menu `5 | 4` thay vì `4 | 5`
      Kèm: địa chỉ ghi đủ "TP.Hồ Chí Minh", thêm 2 bậc responsive (1340/1600) và hạ
      ngưỡng hamburger xuống `≤1199px`.
- [x] **Topbar làm cẩu thả, không giống gốc** (khách chỉ ra). Nguyên nhân: tôi **đoán màu
      thay vì đọc CSS**. Đã tra đúng `.list-top-nav` / `.flag-language` / `.header-content`
      rồi sửa theo số thật · 2026-07-30:
      ① chữ **trắng bold 14px** (tôi để chữ tối vì lo contrast — sai, gốc là trắng)
      ② icon glyph **trắng**, vòng tròn **`#FED12B`** `30px` (tôi để `rgba(255,255,255,.42)`)
      ③ icon hover `scale(1.2)` + nền **`#E7313B`** + `box-shadow 0 0 4px #fff`
      ④ cờ `height:20px` + `border:1px solid #fff` + mờ `.4` / chọn `1`
      ⑤ **cấu trúc: dải vàng `90px`, navbar `absolute top:60px` ĐÈ LÊN dải vàng** và tràn
         `28px` xuống dưới — trước tôi xếp chồng topbar → navbar, sai hoàn toàn
      ⑥ 2 nhóm menu `justify-content: center` → chừa **khoảng trống 2 mép navbar**
      ⑦ logo `112px` (to hơn nữa, tràn cả trên và dưới)
- [x] **Dropdown hover: bỏ nền, dùng gạch chân gradient như nav cha** (khách yêu cầu
      không làm khác gốc) · 2026-07-30
- [x] `#st-header` phải cao tới đáy navbar — navbar `absolute` không cộng chiều cao nên
      `translateY(-100%)` chỉ đẩy 90px, navbar còn lòi ra khi ẩn. Thêm `height` + tách
      `pointer-events` · 2026-07-30
- [x] Bù khoảng hở giữa nav item và dropdown (`.st-nav-dd::before`) — chuột đi xuống
      lọt vùng trống làm dropdown đóng giữa đường · 2026-07-30
- [x] **Dropdown: bỏ bo góc, bỏ bóng, bỏ mũi tên `›`** (khách chỉ ra). Site gốc là khối
      vuông đặc, không `border-radius`, không `box-shadow`, item không có icon. Kèm dán
      dropdown ngay dưới đường đỏ (`top: calc(100% + 11px)`) để không hở nền vàng · 2026-07-30
- [x] **Header vẫn chưa giống gốc** (khách gửi ảnh so sánh lần 2). **Đổi cách làm: mở site
      gốc trong browser và ĐO số thật ở viewport 1440**, thay vì suy đoán từ ảnh chụp
      (ảnh bị scale nên mọi phép ước lượng đều sai) · 2026-07-30:
      ① **Font topbar sai hoàn toàn** — tôi dùng `Be Vietnam Pro`, gốc là **`Arima Madurai`**.
         Đây là lý do chữ nhìn "bold hơn/khác" như khách nói
      ② **Nav font `14px`**, tôi để `12.5px` → "chữ không cùng độ to"
      ③ **Chiều rộng topbar**: gốc `x 134→1307` (`padding 0 30px` + `width 85%`), tôi để
         `max-width 1560` → tràn ra `x 24→1416` → "chiều rộng nav không thống nhất"
      ④ **Logo lệch**: gốc `y 35→146` (căn giữa navbar), tôi để `y 60→160` (dính mép trên).
         Nguyên nhân: `display:grid; place-items:center` + `height:100%` không căn được item
         cao hơn track → đổi sang flex `align-items:center` bỏ `height:100%`
      ⑤ **Cờ méo**: gốc `26×20`, tôi vẽ viewBox `24×16` rồi kéo ra `30×20`
      ⑥ **Nav item spacing**: gốc `gap:10px` + link `padding: 0 7px 0 0`, tôi để
         `gap:2px` + `padding: 0 11px`
      ⑦ **`padding: %` tính trên chiều rộng CHA** (`#st-header` = 100vw), không phải chiều
         rộng navbar (90vw) → `7.2%` cho ra 104px thay vì 93px. Sửa thành `6.46%`
- [x] Ghi nhận đánh đổi: 9 mục (gốc 8) không đủ chỗ ở `14px` dưới 1520px → thang giảm
      padding trước, font sau. Bảng đầy đủ ở `03-components.md` §3.2 · 2026-07-30
- [x] **Icon không nằm giữa vòng tròn** (khách chỉ ra). Không phải lỗi CSS căn chỉnh —
      `place-items:center` căn đúng hộp `<svg>`, nhưng **bbox nét vẽ lệch tâm bên trong
      viewBox 24×24**. Đo bằng browser: **14/46 icon lệch**, nặng nhất `i-tt`
      (`dx −1.2, dy +1.48`), `i-thrill` (`dy −1.7`), `i-boat` (`dy −1.5`).
      Sửa bằng `transform="translate(dx dy)"` trên từng `<g>` → còn **0/46 lệch**.
      Script đo: `scratchpad/bbox.js`, quy trình ghi ở `02-design-system.md` §2.7 · 2026-07-30
- [x] **Header vòng 3** — khách so ảnh, chỉ 7 điểm. Đo tiếp trên site gốc · 2026-07-30:
      ① **Logo lệch trái** — nút search nằm trong luồng flex, chiếm chỗ ở nửa phải và đẩy
         logo lệch đúng 1/2 bề rộng nút. Sửa: `#st-btn-search{position:absolute}` →
         đo lại `logoOff = 0px` ở cả 1280/1366/1440/1500/1600/1700/1920
      ② **Logo có shadow** — gốc `filter:none`. Bỏ `drop-shadow`
      ③ **Icon topbar không giống gốc** — gốc dùng **FontAwesome glyph ĐẶC**, tôi vẽ nét
         mảnh. Thêm bộ `i-fa-*` riêng (8 icon đặc) chỉ dùng cho topbar
      ④ **Icon mxh khác gốc** — gốc là `fa-facebook-f / fa-twitter / fa-linkedin /
         fa-instagram / fa-youtube` dạng đặc. Đã thay đúng bộ
      ⑤ **Nút search thiếu shadow + sai màu glyph** — gốc
         `box-shadow: rgba(0,0,0,.48) 0 0 10px`, glyph `16px` màu `rgb(33,37,41)`;
         tôi để không bóng + glyph xanh lá
      ⑥ **Nav giật tới giựt lui khi resize** — tôi đặt `padding` cứng + 3 bậc `@media`
         đổi `font-size`. Gốc giữ `14px` cố định và để flex tự chia (đo được thụt lề
         `11.0%→4.7%` liên tục). Bỏ hết bậc font → `font = 14px` ở mọi khung
      ⑦ **Cờ lệch** — vẽ lại Union Jack đúng tỉ lệ (đường chéo counterchange)
- [x] **Icon envelope nhìn thành cục đặc** (khách chỉ ra). Vẽ thân + nắp thành 2 mảnh
      sát nhau → khe hở quá mảnh, ở `15px` dính thành 1 khối. Vẽ lại: 1 khối đặc, khoét
      chữ V bằng `fill-rule="evenodd"`, bề dày `1.85` đơn vị viewBox · 2026-07-30
- [x] **3 icon đặc mới lệch tâm mà không ai biết** — `bbox.js` dùng **danh sách cứng**
      nên bộ `i-fa-*` vừa thêm không hề được kiểm. Đã đổi script sang **tự quét toàn bộ
      `#st-icons g[id]`** và chuyển vào repo: **`tools/check-icon-center.js`**
      (exit 1 nếu lệch). Kết quả: **54/54 icon căn tâm** · 2026-07-30
- [x] **Icon vẫn lệch dù script báo "0/54 OK"** (khách chỉ ra). Tôi căn theo **tâm bbox**
      — sai chỉ số. Mắt nhìn theo **TÂM KHỐI**. `i-fa-phone` bbox lệch `0.05` (đạt) nhưng
      tâm khối lệch `1.23`; `i-adv` lệch tới `2.43`. Đo lại bằng trọng tâm pixel:
      **28/54 icon lệch**. Đã chỉnh 48 icon, chừa 5 mũi tên (lệch cố ý vì chỉ hướng).
      Công cụ `tools/check-icon-center.js` đổi hẳn sang đo tâm khối · 2026-07-30
- [x] **Icon vẫn lệch dù script báo "0 lệch"** (khách chỉ ra lần 3). Script chỉ đo
      **symbol cô lập** nên mù với lỗi do CSS trang. Viết `tools/check-icon-rendered.js`
      (giải mã PNG, đo trọng tâm pixel trắng của chính vòng tròn đã render) → phát hiện
      **lệch −7px ngang**, đúng nửa chiều rộng svg.
      **Nguyên nhân: specificity CSS.** `.st-tb-contact span` (0,1,1) trúng luôn
      `.st-tb-ic` (0,1,0) và đè `display:grid` → `inline-flex`, làm mất `place-items:
      center`, svg rơi về mép trái. Sửa: dùng child combinator
      `.st-tb-contact > li > a, .st-tb-contact > li > span`. Sau sửa: lệch ngang `0.02px` · 2026-07-30
- [x] ~~Phóng glyph topbar lên **1.5×** (`15px → 22.5px`), vòng tròn giữ nguyên `30px`;
      mobile `13px → 19.5px` trong tròn `26px`~~ · 2026-07-30 →
      **ĐÃ HỦY 2026-07-31**: phóng 1.5× là bù cho outline vẽ tay (nhỏ hơn ô 24). Dùng
      outline FontAwesome thật thì `15px` là đúng cỡ gốc. Xem D-36.
- [x] **Header vòng 4 — topbar phải (cờ + social)**, khách so ảnh: *"icon không đúng, cờ
      không giống nhau, cờ Việt Nam bị khuất, vị trí cũng không giống nhau"* · 2026-07-31:
      ① **Icon**: thôi vẽ tay — trích outline thẳng từ `fontawesome-webfont.svg` **4.6.3**
         của site gốc, quy về viewBox 24 theo tỉ lệ em `24/1792`
         (script `tools/fa-extract.js`). Xác nhận `fa-youtube` = `f167` = logo
         **"You/Tube"**, không phải nút play — chụp site gốc để chốt
      ② **Cỡ glyph**: `22.5px → 15px` (đúng `font-size` gốc); mobile `19.5px → 13px`
      ③ **Cờ VN bị khuất**: sao vẽ cao 75% lá cờ nên viền `1px` cắt mất 2 cánh dưới.
         Đo bbox sao ngay trên `vi.png` (**9×8 px trong khung 24×18**) → tâm `(12, 9.4)`,
         bán kính `4.6`
      ④ **Tỉ lệ cờ**: `vi.png`/`en.png` là **24×18**, không phải 3:2. viewBox `26×20` →
         `24×18`, hộp CSS `26×20` (border-box + border 1px)
      ⑤ **Union Jack**: dựng ở hệ chuẩn `60×30` (fimbriation + counterchange đúng) rồi
         `scale(0.4 0.6)` — bóp không đều đúng như `en.png`
      ⑥ **Vị trí**: hở cờ ↔ social phải là `20px` chứ không phải `10px` —
         `.list-top-nav ul{padding:10px}` của gốc áp cả lên `ul.flag-language`.
         Thêm `#st-lang{padding:0 10px}`
      → Kiểm bằng **so pixel với site gốc** (headless `1440×900`, `dsf=4`): 5 vòng tròn
      social trùng khít từng pixel, cờ trùng vị trí. Quy trình: `02-design-system.md` §2.7.1
- [x] **Header vòng 5 — khoảng cách topbar + cờ VN** (khách chỉ ra) · 2026-07-31:
      ① **Khoảng cách**: ở `1440px` mọi thứ ĐÃ trùng khít; lệch nằm ở dải `900–1200px`.
         Gốc chỉ có 1 luật `@media(max-width:1200px){.list-top-nav li span{font-size:11px}}`
         — **giữ đủ 3 mục + giữ `85%`**. Tôi lại ẩn địa chỉ + `width:100%` → bố cục khác hẳn.
         Đã sửa về đúng gốc, tách ngưỡng tự quyết `≤999px` (gốc từ `≤900px` đổi sang
         header mobile riêng, ngoài phạm vi). Kèm: bỏ `white-space:nowrap` ở dải này —
         gốc để chữ **xuống dòng**, ta giữ nowrap nên chữ **chồng đè** lên mục kế
      ② **Sao cờ VN**: 3 lần trước tôi đo bằng **ngưỡng pixel vàng** → sai cả 3
         (`R = 4.6 → 4.35 → 4.95`). `vi.png` có ringing (green quanh sao tụt xuống 0,
         thấp hơn nền đỏ 37) nên ngưỡng nào cũng ăn mất rìa. Đổi sang **fit RMS ở đúng
         cỡ 24×18** → tâm `(12, 9)`, `R = 5.6` (đáy phẳng `5.5–5.7`)
      ③ **Cờ UK**: bỏ cách dựng `60×30` + `scale(0.4 0.6)` — bóp không đều làm nét DỌC
         mỏng còn 2/3. `en.png` đo ra nét **đẳng hướng**: thập đỏ `4` / trắng `6`,
         chéo trắng `3.6`, và **không có chéo đỏ** (duyệt từng pixel: chỉ trắng + xanh)
      ⚠️ Bẫy: xếp ứng viên thành lưới nhiều cột rồi dò ô bằng màu → **thứ tự ô lệch khỏi
      thứ tự ứng viên**, RMS chọn ra kết quả sai hẳn. Phải xếp **1 cột**, bước cố định.
- [ ] Mỗi lần đụng icon **hoặc CSS quanh icon**: chạy CẢ HAI
      `node tools/check-icon-center.js` và `node tools/check-icon-rendered.js`
- [ ] Quyết định: bớt 1 mục navbar để khoảng chữ→logo bằng gốc (`101px`), hay chấp nhận
      `54px` ở 1440 vì có thêm tab VR360?

---

## 🆕 2026-08-01 — Thu phạm vi (YC-6 · D-39 / D-40)

- [x] Thu phạm vi về **header + cụm C 3 nút + modal welcome** — cờ `ST.data.SCOPE`
      + class `html.st-scope-min` + file mới `css/scope.css` (2026-08-01)
- [x] Ẩn khỏi trang: CTA vé, popover `⋯`, nhóm nút xem, `#st-scene-label`,
      `#st-hint`, modal share (M4), modal help (M5) — **không xoá code** (2026-08-01)
- [x] **Đảo ngược D-05v2**: cụm C về góc dưới-trái, xếp **dọc** (2026-08-01)
- [x] ~~Nút `#st-btn-combo` variant `gold` trong cụm C~~ → **thay bằng thẻ vé
      `#st-ticket`** cùng ngày theo YC-7 (D-41). Khoá i18n đổi `dock.combo` →
      `ticket.*` VI + EN (2026-08-01)
- [x] Token vùng cấm `--st-rz-*` + `--st-c-max-w` trong `tokens.css`,
      `ST.data.RESERVED_ZONES` trong `data.js` (2026-08-01)
- [x] `?full=1` dựng lại bản v2 · `?zones=1` vẽ ghost 4 vùng cấm (2026-08-01)
- [x] Sửa hiểu nhầm: ban đầu ẩn cả header — khách chỉ ra trip360 **không có header**
      nên dải trên cùng là vùng TRỐNG, navbar không đè lên gì. Đã trả lại (2026-08-01)
- [x] **Nút combo tách thành thẻ vé** `#st-ticket` — hình tấm vé (răng cưa CSS mask),
      bỏ con dấu, bỏ nút bên trong, dưới navbar bên phải, nảy nhẹ mỗi 8s.
      File mới `css/ticket.css` + `ST.data.TICKET` + `renderTicket()` (2026-08-01)
- [x] **Cụm C bỏ div nền** — 2 pill rời, mỗi nút tự mang bóng; quay lại hàng ngang vì
      combo rời đi nên đủ chỗ. Nút mở-lại-modal đổi từ nền xanh nhạt sang trắng-viền-xanh
      (đứng rời trên panorama thì nền nhạt trông như vết bẩn) (2026-08-01)
- [ ] **Chưa test bằng trình duyệt** — máy hiện không có playwright/puppeteer. Cần mở
      `index.html` ở 1280×720 / 1440×900 / 390×844 và `?zones=1` để xác nhận:
      cụm C không chạm ghost nào · **răng cưa thẻ vé nằm đúng ranh giới cuống/thân**
      (Chrome + Safari — `mask-composite` là chỗ dễ lệch nhất) · thẻ vé không đè cụm ⓔ ·
      bấm vé bắn toast demo · animation nảy 8s không gây khó chịu
- [ ] Đo lại bề ngang thật của cụm ⓓ trên trip360 → chỉnh `--st-rz-d-w` (đang giả
      định 340px gồm lề)

---

## 🆕 2026-08-01 — Clone 2 overlay mở ra từ nút (YC-8 · D-43)

- [x] **M2 `#st-route`** — overlay Chỉ đường: bảng trái (logo ST, đổi ngôn ngữ, thu
      gọn), thẻ chọn điểm đi/đến có ray chấm-nét đứt-ô vuông, ô kết quả song ngữ,
      chỉ dẫn từng chặng có icon rẽ, bản đồ SVG + pin số + mốc A/B + đường vẽ,
      toolbar 6 nút. File mới `css/route.css` + `js/route.js` (2026-08-01)
- [x] **M3 `#st-places`** — overlay Danh sách: tiêu đề + ô tìm kiếm + nút đóng trên
      1 hàng, 6 chip lọc, lưới thẻ 2 dòng VI/EN màu theo nhóm.
      File mới `css/places.css` + `js/places.js` (2026-08-01)
- [x] Lớp `.st-fs` / `.st-fs-panel` / `.st-fs-close` trong `overlays.css` — overlay
      toàn màn hình dùng chung engine `js/overlays.js` (thêm `.st-fs-panel` vào
      selector tìm panel) (2026-08-01)
- [x] `ST.data.MAP_META` (số hiệu + toạ độ % của 20 điểm) + `ST.data.WAYFIND`
      (tham số tính quãng đường) (2026-08-01)
- [x] Khối `BI` trong `i18n.js` — chuỗi song ngữ cố định dùng chung cho `vi` và `en`,
      vì 2 overlay này luôn hiện đồng thời dòng Việt + dòng Anh như bản gốc (2026-08-01)
- [x] 9 icon mới: `i-flag`, `i-turn-left`, `i-turn-right`, `i-straight`, `i-goal`,
      `i-split`, `i-plus`, `i-minus`, `i-chevron-left` (2026-08-01)
- [x] 2 nút cụm C đổi action `existing:*` → `open:st-route` / `open:st-places`.
      `#st-existing` (M7) giữ nguyên markup nhưng **không còn trigger** (2026-08-01)
- [x] Kiểm bằng script: 380 cặp điểm → không đoạn nào ≤ 0 m, không chuỗi `NaN`,
      gọi 2 lần ra kết quả y hệt; mọi khoá `data-i18n` trong `index.html` và mọi
      `I.t()` trong `route.js`/`places.js` đều resolve (2026-08-01)
- [x] Sửa: bỏ 2 chặng "đi thẳng" liền nhau trong chỉ dẫn — đọc như lỗi lặp (2026-08-01)
- [x] Sửa: số hiệu modal đụng nhau. `#st-existing` đã là M7 → 2 overlay clone lấy lại
      **M2/M3** vốn đã đặt sẵn cho chúng, không đánh số mới (2026-08-01)
- [ ] **Chưa test bằng trình duyệt** — cần mở M2 và M3 ở 1440×900 / 1280×720 /
      390×844 để xác nhận: pin rơi đúng chỗ trên bản đồ (`aspect-ratio` + `dvh`) ·
      hoạt ảnh vẽ đường chạy lại mỗi lần đổi tuyến · thu gọn bảng trái không kẹt nút
      cam · ô tìm kiếm M3 không mất focus khi lọc · lưới M3 về 1 cột ở 599px
- [ ] Đo lại số hiệu 14/20 điểm đang là MOCK — đối chiếu bản đồ giấy của công viên
- [ ] **Q-36 🔴** — 2 overlay clone dùng làm gì khi ghép thật? (a) chỉ demo ·
      (b) thay hẳn · (c) lấy vỏ giữ ruột. Khuyến nghị (c), xem `07-integration.md` §7.6.1

---

## ⏭️ Việc tiếp theo

### Nội dung / asset còn thiếu
- [x] ~~`assets/map/park-map-real.jpg`~~ — không cần nữa, M1 bỏ bản đồ · 2026-08-03 (D-44)
- [ ] Ảnh banner độ phân giải cao cho 12 thẻ carousel (Q-37) + 8 điểm còn thiếu (Q-38)
- [ ] Ảnh thumbnail thật cho từng điểm (Q27 = chưa có → đang dùng gradient theo nhóm)
- [ ] Rà lại `blurb` 20 điểm — hiện là tôi tự viết, cần người của Suối Tiên duyệt
- [ ] Dịch EN cho các mục con của menu (hiện chỉ dịch 9 mục cấp 1)

### Cải thiện đã xác định
- [-] ~~Bản đồ dọc riêng cho mobile~~ · 2026-08-03 — M1 bỏ bản đồ (D-44), D-32 hết hiệu lực
- [-] ~~Zoom / pan bản đồ trong modal welcome~~ · 2026-08-03 — cùng lý do
- [ ] Preload ảnh thẻ kế tiếp — hiện `loading="lazy"` từ thẻ thứ 2; quẹt thật nhanh
      qua 3–4 thẻ vẫn thấy một nhịp trắng trên mạng chậm
- [ ] Panorama mock: thêm biến thể cảnh cho `culture` / `food` (hiện 6 nhóm dùng chung 1 hình dạng, chỉ khác màu)

### A11y & QA còn phải làm thủ công
- [ ] Screen reader thật (NVDA / VoiceOver) — modal welcome đọc tiêu đề, rồi
      `aria-roledescription="carousel"` + `aria-label` từng thẻ + `.st-cr-live` "Tên — 3/12"
- [ ] Verify 10 cặp contrast ở §2.1.7 bằng tool (mới tính lý thuyết)
- [ ] iPhone thật có notch — `env(safe-area-inset-*)` ở dock, topbar, scene-label, CTA
- [ ] Safari iOS + Samsung Internet (mới test Chromium)
- [ ] `prefers-reduced-motion` — kiểm tra morph, viền chạy, peek bob đã tắt hết
      (autoplay + transition của carousel: **đã verify bằng Playwright** 2026-08-03)
- [ ] `localStorage` bị chặn (chế độ riêng tư)
- [ ] Đo FPS trên máy Android tầm trung khi modal mở (scrim blur toàn màn hình
      **+ 7 thẻ 3D cùng transition** — đây là chỗ nặng nhất của prototype giờ)

### Đóng gói
- [ ] Trang `compare.html` — before/after 2 nút + before/after header, để thuyết trình
- [ ] Screenshot / GIF các luồng chính cho `README.md`
- [ ] Bản `@font-face` local cho Arima Madurai (hiện lấy Google Fonts → offline mất font)

### v2 — sau khi khách duyệt
- [ ] Re-skin 2 overlay có sẵn theo token brand
- [ ] Thanh thumbnail các điểm ở đáy viewer (dùng lại `ST.carousel` được)
- [ ] Thuyết minh audio từng điểm
- [ ] "Đã ghé" state cho thẻ carousel (localStorage)
- [ ] Journey mode — tuyến tham quan gợi ý
- [ ] Nối `ST.track()` thật + dashboard 9 event ([`05-flows.md`](05-flows.md) §5.9)
- [ ] Xử lý cụm B (sidebar trái) và cụm E (2 nút phải) nếu khách mở phạm vi
- [ ] Bật lại từng phần của bản v2 nếu khách đổi ý — mỗi phần chỉ là 1 dòng trong
      `css/scope.css`, không phải viết lại

---

## ⏭️ Việc tiếp theo (SAU PIVOT 2026-08-03) — phần còn sống

### ✅ Vòng YC-18 (2026-08-05) — desktop cũng nền sáng + nút bản đồ 2D

**Nền sáng cho mọi khổ (D-61)**

- [x] Gỡ hẳn `.st-sld-bg` khỏi `index.html` + `css/slider.css` + `js/slider.js`
      (`layout()` không còn ghi `background-image`) — 2026-08-05
- [x] Gỡ `.st-sld-shade` — không còn chữ nào nằm trên ảnh nên lớp gradient hết việc — 2026-08-05
- [x] Viết lại `css/slider.css` theo bảng màu sáng: thanh trên, thẻ, chữ, ‹ ›, chip,
      nút bản đồ, bộ đếm, ô trống — 2026-08-05
- [x] Desktop thành **thẻ NGANG**: ảnh trái `60%` giữ `3:2` (chính nó quyết chiều cao
      thẻ), chữ phải căn giữa theo chiều dọc — 2026-08-05
- [x] Chia bố cục theo **`orientation`** thay vì `max-width`; `responsive2.css` chỉ còn
      lo hướng xếp + các con số — 2026-08-05
- [x] Xoá khối "bảng màu dùng chung" 115 dòng của D-60 (giờ là mặc định) + 2 khối
      `@media (hover: none)` chỉ để thu phạm vi `brightness` — 2026-08-05
- [x] Gỡ override `#st-pop2.st-state-slider .st-p2-close` (kính mờ) ở `wall.css` — 2026-08-05
- [x] Chip đang chọn từ vàng `--st-gold-300` sang xanh brand — trên nền trắng vàng nhạt
      hơn cả chip thường — 2026-08-05

**Nút bản đồ 2D (D-61)**

- [x] Thanh dưới slider tách thành 3 cụm: chip (`flex: 1 1 auto`) · nút bản đồ (xanh
      tonal + vạch ngăn `::before`) · bộ đếm. Vạch ngăn tự tắt khi 2 hàng ở mobile — 2026-08-05
- [x] Thêm `.st-wall-map` vào thanh công cụ wall (`data-open-map="all"`, 0 dòng JS
      mới); mobile thành **icon vuông** cạnh ô tìm; `≤379` giữ 2 cột hàng đầu — 2026-08-05
- [x] Dùng lại khoá i18n `map.open` (có từ D-51, chết từ D-57) + `data-i18n-aria` cho
      bản icon-only — 2026-08-05
- [x] Playwright 7 khổ × 10 bất biến, gồm **bấm nút bản đồ ở wall phải mở được
      `#st-map` có pin** → sạch — 2026-08-05

### ✅ Vòng YC-17 (2026-08-05) — màn chi tiết trên điện thoại: nền trắng + thẻ

**Nền + bảng màu (D-60)**

- [x] Tắt `.st-sld-bg` (ảnh blur + tối) trên khổ điện thoại → lộ `--st-bg` trắng — 2026-08-05
- [x] Đổi sang bảng màu sáng cho **toàn bộ** control của slider: nút quay lại · ô tìm +
      placeholder + nút xoá · chip (chip đang chọn từ vàng sang xanh brand) · nút bản
      đồ · bộ đếm · chữ "không có kết quả" — 2026-08-05
- [x] Trả nút × về dáng sáng (`wall.css` cố ý đảo nó sang kính mờ khi vào slider) — 2026-08-05

**Thẻ (D-60)**

- [x] Cảnh thành thẻ: `.st-sld-img` hết `position: absolute`, `.st-sld-info` xuống dưới
      ảnh trên nền trắng, bỏ `.st-sld-shade` — 2026-08-05
- [x] Ảnh nhỏ lại: `--sld-w` `92vw → 78vw`, cao `clamp(170px, 32vh, 300px)` — 2026-08-05
- [x] **Nút hết bị ảnh đè**: CTA xuống vùng trắng của thẻ · ‹ › ra hẳn lề `--sld-x`,
      nền trắng + viền — 2026-08-05
- [x] Thẻ căn giữa sân khấu, cao theo nội dung, `max-height: 100%` + ảnh co để CTA
      không bao giờ bị cắt — 2026-08-05
- [x] Cảnh rìa dùng `opacity` thay `brightness`; thu luật `brightness(.65)` trong
      `@media (hover: none)` về `min-width: 600px` — 2026-08-05
- [x] Điện thoại **nằm ngang**: thẻ NGANG (ảnh trái 42% / chữ phải), lấy lại dòng mô tả — 2026-08-05
- [x] ≤379px: ‹ › còn 32px · CTA bỏ mũi tên đuôi (chữ đang vỡ 2 dòng) — 2026-08-05

**Tự chạy 2,5s (D-60)**

- [x] `AUTO_MS_SM = 2500` cho điện thoại, desktop giữ 6000; `autoMs()` đọc `matchMedia`
      đúng chuỗi @media của bố cục thẻ — 2026-08-05
- [x] `setInterval` → chuỗi `setTimeout` để nhịp đổi theo khi xoay máy — 2026-08-05
- [x] Transition của cảnh `620 → 460ms` trên điện thoại — 2026-08-05
- [x] Sửa 2 bẫy làm autoplay chết trên cảm ứng: `mouseenter` giả (chỉ nghe khi
      `hover: hover`) và `focusin` do chạm (chỉ dừng khi `:focus-visible`) — 2026-08-05
- [x] Không tự trượt khi ngón tay đang đặt trên cảnh (`dragging` vào `tick()`) — 2026-08-05
- [x] Playwright 7 khổ: 5 bất biến hình học + nhịp đo thật + chạm-rồi-vẫn-chạy → sạch — 2026-08-05

### ✅ Vòng YC-16 (2026-08-04) — chốt một bản + dựng lại mobile

**Dọn (D-57)**

- [x] Gỡ `css/carousel.css` · `css/popup.css` · `css/responsive.css` · `js/carousel.js`
      · `js/popup.js` — 2026-08-04
- [x] Gỡ `host-demo.html` (khách: *"chỉ làm index"*) — 2026-08-04
- [x] Gỡ khối `COPY.vi/en.popup` + `.list` — 21 khoá, không khoá nào còn được gọi — 2026-08-04
- [x] Gỡ `D.mustOf()` + cờ `must:true` · gỡ token `--st-ease-flow` — 2026-08-04
- [x] Quyết định **không đổi tên** `#st-pop2` / `popup2.js` / `responsive2.css`, ghi
      chú lý do ở đầu mỗi file + D-57 — 2026-08-04
- [x] Dọn mọi chú thích còn trỏ `index2.html` / `carousel.js` / `host-demo.html`
      trong `js/` và `css/` — 2026-08-04

**Mobile (D-58)**

- [x] `.st-wall` thành scroll container; bỏ cuộn lồng trên `.st-wall-grid` — 2026-08-04
- [x] Ô theo `aspect-ratio` thay chiều cao cố định; ô lớn thành thẻ hero tràn ngang — 2026-08-04
- [x] Thanh công cụ `sticky bottom` 2 hàng + gradient fade; ≤379px xếp dọc — 2026-08-04
- [x] Header căn trái ở ≤599px — 2026-08-04
- [x] Landscape 3 cột (cuộn 4,4 màn → 2,6 màn) — 2026-08-04
- [x] Slider: back thành nút tròn · `object-position: center 38%` · ‹ › lên 30%
      (26% ở landscape) · thanh dưới từ 3 hàng xuống 2 — 2026-08-04
- [x] Bản đồ thành bottom sheet; cụm zoom né bằng `--st-card-h` đo thật — 2026-08-04
- [x] `:active` cho mọi thứ bấm được · tắt parallax trên cảm ứng ·
      `touch-action: pan-y` trên track — 2026-08-04
- [x] `imgsPerTile()` — mobile 2 ảnh/ô thay vì 3 — 2026-08-04
- [x] Dồn @media của bản đồ từ `map2d.css` về `responsive2.css` — 2026-08-04

**Ba lỗi có sẵn lôi ra được**

- [x] `--st-t-h3` **không tồn tại** trong `tokens.css` dù `docs/02` khai là có và
      `map2d.css` đã gọi — tên điểm trong thẻ bản đồ hiện bằng cỡ chữ body suốt từ
      D-51. **Lần thứ HAI dính đúng bẫy này** (lần đầu `--st-n-800`) — 2026-08-04
- [x] `g.cover` chưa bao giờ được `wall.js` đọc → ô hero và ô "Điểm đến nổi bật" hiện
      cùng một tấm ảnh. Thêm `coverFirst()` — 2026-08-04
- [x] @media của bản đồ nằm ở hai file, file nạp sau đè file nạp trước — 2026-08-04

**Kiểm**

- [x] Playwright/Chromium 7 khổ × 4 màn (320 · 375 · 390 · 390-EN · 844 ngang · 820 ·
      1440), 9 bất biến hình học → **sạch, 0 lỗi console** — 2026-08-04
- [ ] Kiểm trên **thiết bị thật** — Chromium hạ màn không thay được ngón tay thật:
      độ trễ của `:active`, quán tính cuộn của Safari iOS, `env(safe-area-inset-*)` ở
      máy có notch, và cử chỉ "lùi trang" có thật sự bị `touch-action: pan-y` chặn không

**Còn nợ từ vòng này**

- [ ] **Dựng lại `host-demo.html`** lúc bàn giao — bỏ nút "Bản 1 / Bản 2", `src` cố
      định `index.html`. Lấy gốc: `git show 3be9e22:host-demo.html`.
      *(Khách bảo "chỉ làm index" nên lượt này không dựng.)*
- [ ] **Ảnh bản đồ có dải tối lớn phía trên-trái** (vùng ngoài công viên, đã flatten
      `#0f172a`). Trên máy dọc, `cover` cắt đúng vào dải đó → ~40% chiều cao là mảng
      tối trống. **Không sửa được bằng CSS** — mức zoom nào cũng dính, vì bản đồ 2:1
      trong khung 0,51:1 thì hoặc cắt ngang hoặc chừa dải trên dưới. Phải **cắt lại
      asset** về bounding box của công viên — kéo theo việc tính lại toàn bộ `x`/`y`
      trong `D.MAP_META`, nên gộp chung với Q-43 (toạ độ pin thật) làm một lần
- [ ] 8 điểm chưa có ảnh giờ **không xuất hiện ở đâu cả** (Q-38 gấp hơn trước) — bản 1
      từng có ô giữ chỗ cho chúng, slider thì cần ảnh phủ toàn cảnh

---

### ✅ Vòng YC-15 (2026-08-04) — chuyển động, ảnh nguồn, danh sách

- [x] Carousel `visible: 1 → 2` (5 thẻ) + 4 biến bậc tách riêng, bậc ±2 nén lại và
      nghiêng bằng bậc ±1 · 2026-08-04
- [x] Ẩn bậc ±2 dưới 1280px bằng CSS (`[data-oa="2"]`), không hạ `visible` · 2026-08-04
- [x] Độ mờ thôi diễn tả chiều sâu (`.70 → .925`), dồn cho `brightness` — 5 thẻ chồng
      nhau nên thẻ mờ 70% thành cửa kính · 2026-08-04
- [x] Autoplay `3600 → 3000ms` · transition `620 → 720ms` · token `--st-ease-flow` mới
      · `transition-delay` so le theo bậc · 2026-08-04
- [x] Parallax trên thẻ giữa (mượn `js/wall.js`), nghe trên sân khấu · 2026-08-04
- [x] Dựng lại animation vào màn **cả 2 bản**: brandline sweep, header so le, sân khấu
      bay lên, Ken Burns, `both → backwards` · 2026-08-04
- [x] **Ảnh nguồn**: truy ra 9/12 ảnh gốc chỉ 600×600 và bản cũ đã phóng lên 760 từ
      khâu dựng → đổi sang ảnh trang chi tiết, 9/12 lên ≥900px, luật "không bao giờ
      phóng to khi dựng" · 2026-08-04 · D-55(f)
- [x] Bổ sung token `--st-n-800` còn thiếu trong `tokens.css` (docs/02 §2.1.5 vẫn khai
      là có, `css/slider.css` đã gọi tới) · 2026-08-04
- [x] Nền ô wall: `--st-n-800` (hỏng) → gradient brand; và `loading="lazy"` của ảnh đầu
      mỗi ô bỏ đi — cả 9 ô đều trong viewport nên lazy chỉ làm ô rỗng lúc vào màn · 2026-08-04
- [x] Mobile thẻ `78vw → 92vw` + step `82% → 74%` (+45% diện tích thẻ) · 2026-08-04
- [x] Danh sách điểm từ DÒNG sang **THẺ ẢNH 4:3** + `D.mustOf()` · 2026-08-04 · D-56
- [x] Playwright: 6 viewport × hình học, danh sách 12 thẻ, và **đo animation bằng cách
      ghim `animation-play-state: paused` rồi tua `currentTime`** (đợi rồi chụp không
      chứng minh được gì — `goto()` đợi tới `load`) · 0 lỗi console · 2026-08-04
- [ ] **3 ảnh còn vỡ: `cong` · `casau` · `tulinh`** — site chỉ có 600×600 / 500×499,
      không có nguồn nào lớn hơn. Chặn bởi Q-37
- [ ] Xem lại tổng dung lượng ảnh `930 KB → 1,32 MB`. Chấp nhận được cho prototype;
      bản thật nên cân nhắc `srcset` 2 cỡ thay vì một cỡ lớn cho mọi máy

### ✅ Vòng YC-14 (2026-08-04)

- [x] Nút *"Xem trên bản đồ 2D"* từ footer lên `.st-search-row` cạnh ô tìm · 2026-08-04
- [x] Xoá `.st-foot-actions` / `.st-foot-map` khỏi HTML + CSS · 2026-08-04
- [x] `css/carousel.css` viết lại: cỡ thẻ suy từ chiều cao sân khấu, bỏ `66vh` · 2026-08-04
- [x] Bỏ cặp auto-margin ở `.st-popup-head` / `.st-popup-foot` · 2026-08-04
- [x] Bỏ 2 vệt radial ở `#st-popup` · 2026-08-04
- [x] `#st-pop2` + `.st-wall` đổi từ nền tối sang `--st-bg`, kê lại viền ô / độ mờ hover
      / eyebrow / tiêu đề / nút thanh công cụ / nút × · 2026-08-04
- [x] Playwright 7 viewport: tỉ lệ thẻ 1.5, không tràn, nút bản đồ cùng hàng ô tìm ở
      ≥600px, nền cả 2 bản `rgb(255,255,255)` + `background-image: none` · 2026-08-04
- [ ] **Verify contrast bằng tool cho chrome MỚI của wall trên nền trắng** — eyebrow
      `--st-green-700` trên `--st-green-50`, `#st-wall-sub` `--st-n-600` trên trắng, và
      nút `.st-wall-bar .st-ghost` `--st-n-500`. Mới xem bằng mắt trên screenshot
- [x] ~~Xem lại `--st-n-800` (nền ô chưa tải ảnh) trên nền trắng — giờ nó là vệt tối duy
      nhất của wall, có thể nên đổi sang `--st-n-200`~~ → **hoá ra là LỖI, không phải
      chuyện thẩm mỹ**: token `--st-n-800` không tồn tại trong `tokens.css` (thang nhảy
      700 → 900) nên nền ô thành `transparent`, ô chưa tải ảnh chỉ còn lớp veil phủ lên
      nền trắng = một vệt xám. Đổi `--st-n-200` · 2026-08-04 · D-55(g)

### 🟡 Cần khách trả lời

- [x] **Q-42 · CHỌN BẢN 1 HAY BẢN 2?** → **khách chọn VR Wall + Infinite Slider**,
      2026-08-04. Bản 1 đã gỡ hẳn (D-57)
- [ ] **Q-43 🔴 · Số hiệu + toạ độ pin trên bản đồ 2D** — mới **2/20** số đọc được từ
      ảnh khách gửi (`1` = Cổng Thiên Tiên Môn, `22A` = Vương Quốc Cá Sấu). 18 số còn
      lại và **toàn bộ x/y** là ước lượng bằng mắt. Đủ để trình bày, **chưa đủ để chỉ
      đường thật**. Bản thật đọc `map/map_places.json` —
      xem [`06-data.md`](06-data.md) §6.10
- [ ] **Q-41 · Duyệt cách chia 9 khu vực của bản 2** — hiện là tôi tự đặt theo `cat` +
      cảm nhận, Suối Tiên chưa có phân loại chính thức. Bảng nhóm:
      [`06-data.md`](06-data.md) §6.9

- [ ] **Q-37 🔴 · Quyền dùng 12 ảnh banner + XIN BẢN GỐC** — nâng lên 🔴 ở D-55.
      Không còn là chuyện "cho đẹp hơn": **9/12 ảnh trên site chỉ là thumbnail
      600×600**, và `cong` · `casau` · `tulinh` thì **không có bản nào lớn hơn ở bất
      kỳ đâu trên site** — ba tấm này đang phải phóng to ở thẻ giữa, đúng cái khách gọi
      là "ảnh vỡ". Chín tấm còn lại đã cứu được bằng ảnh trang chi tiết (975–1200px)
      nhưng vẫn thiếu 1,37× cho màn 2×. Nguồn từng ảnh + W×H:
      [`06-data.md`](06-data.md) §6.8
- [ ] **Q-38 · Ảnh cho 8 điểm còn thiếu** — `xelua` `taxi` `tauluon` `massage` `coixay`
      `vrgame` `thuyenrong` `thuyenbay`. Có ảnh là carousel phủ hết bộ 20 điểm highlight
- [ ] **Q-39 · Popup hiện khi nào?** mỗi phiên · 1 lần duy nhất · bỏ qua khi có
      `?pano=`? Logic này nay thuộc **trang cha**, popup không tự quyết —
      [`07-integration.md`](07-integration.md) §7.9
- [ ] **Q-40 · 3 thẻ hay 5 thẻ?** Đang hiểu "hai bên chỉ cần preview 2 ảnh" = 2 ảnh
      tổng cộng (1 mỗi bên). Nếu ý là 2 ảnh MỖI BÊN thì đổi `visible: 1` → `2` trong
      `js/popup.js`, đúng một con số

### 🔧 Bên tích hợp (trang cha) — checklist đầy đủ ở `07-integration.md` §7.8

- [ ] `background: transparent` trên thẻ `<iframe>` (§7.2.1)
- [ ] `z-index` iframe > 10009 (§7.4)
- [ ] Nghe `st:navigate` + `st:close`, siết `e.origin` ở production
- [ ] Khoá cuộn · Esc ngoài iframe · `aria-hidden` nền · trả focus (§7.3)
- [ ] Cân nhắc pause render 3DVista lúc popup mở (popup che kín màn)

### 🧩 Bên popup

- [ ] **(bản 2)** Thay cross-fade ảnh tĩnh trong ô wall bằng **video loop 4–6 s** hoặc
      panorama nhẹ — `note.md` §59–64. Hiện là MOCK rẻ tiền nhưng đủ trình bày ý tưởng
- [ ] **(bản 2)** Parallax khi hover đang giả lập "xoay panorama 10–20°" (`note.md` §41)
      bằng cách dịch ảnh 5% — bản thật cần panorama nhúng
- [ ] **(bản 2)** Hiệu ứng chuyển cảnh của slider mới có fade + scale; `note.md` §111
      còn gợi ý mây trôi / sóng nước / ánh sáng vàng / âm thanh ngắn theo khu vực

- [ ] Xác minh chữ ký `VRCore.navigateToPano` rồi **xoá vòng thử** trong `js/bridge.js`
      (đang đánh dấu `// MOCK:`)
- [ ] Nối `ST.track()` vào `VR360Track.event()`, hoặc để trang cha ghi từ `st:navigate`
      ([`05-flows.md`](05-flows.md) §5.5)
- [ ] `@font-face` local thay Google Fonts (hiện mất mạng là mất `Arima Madurai`) —
      ngoại lệ RULE #3 duy nhất còn tồn tại
- [ ] Preload ảnh thẻ kế tiếp — hiện `loading="lazy"` từ thẻ thứ 2; quẹt thật nhanh qua
      3–4 thẻ vẫn thấy một nhịp trắng trên mạng chậm

### ♿ A11y & QA còn phải làm thủ công

- [ ] Screen reader thật (NVDA / VoiceOver) **qua ranh giới iframe** — đọc được tiêu đề,
      `aria-roledescription="carousel"`, `aria-label` từng thẻ, vùng live "Tên — 3/12"
- [ ] Kiểm `aria-hidden` nền của trang cha có thật sự che được nội dung dưới không
- [ ] iPhone thật có notch — `env(safe-area-inset-*)` ở `.st-popup-inner` và nút ×
- [ ] Safari iOS + Samsung Internet (mới test Chromium)
- [ ] Đo FPS trên Android tầm trung: 3 thẻ 3D + 3DVista render dưới nền
- [x] `prefers-reduced-motion` — autoplay tắt, transition về .01ms · verify Playwright
      2026-08-03
- [x] Focus trap bao gồm cả nút × · verify Playwright 2026-08-03

### 📦 Đóng gói

- [ ] Screenshot / GIF các luồng chính cho `README.md`
- [ ] Quyết định URL deploy của popup (cùng origin với trang VR thì tốt hơn — §7.7)

---

## Nhật ký

| Ngày | Việc |
|---|---|
| 2026-08-05 (v11) | **Desktop cũng nền sáng + trả lại nút bản đồ (YC-18).** (a) Gỡ hẳn `.st-sld-bg` và `.st-sld-shade` khỏi HTML/CSS/JS — nền đen là thứ cuối cùng còn sót của bố cục cũ. (b) Bảng màu sáng + cấu trúc thẻ thành **mặc định** ở `css/slider.css`; desktop thành **thẻ ngang** (ảnh trái 60% giữ 3:2, chính nó quyết chiều cao thẻ). (c) `responsive2.css` chỉ còn lo hướng xếp, và chia theo **`orientation`** thay vì `max-width` — iPad dọc 768 rộng hơn iPhone ngang 844 nhưng cần bố cục dọc; xoá 115 dòng "bảng màu dùng chung" của D-60. (d) Thanh dưới slider tách 3 cụm có vạch ngăn; **thêm nút bản đồ 2D vào thanh công cụ wall** (icon vuông trên mobile), dùng lại khoá i18n `map.open` chết từ D-57, 0 dòng JS mới. (e) Playwright 7 khổ × 10 bất biến → sạch. D-61. |
| 2026-08-05 (v10) | **Màn chi tiết trên điện thoại (YC-17).** Slider từ "cổng ảnh phủ màn, nền blur tối, chữ đè lên ảnh" thành **thẻ trên nền trắng**: ảnh `78vw × clamp(170px,32vh,300px)` ở trên, chữ + CTA ở dưới trên nền trắng, ‹ › ra hẳn lề nên hết cảnh nút chìm vào ảnh, cảnh rìa dùng `opacity` thay `brightness`. Cả bảng màu của slider đổi sang sáng (kể cả nút × vốn bị `wall.css` đảo sang kính mờ). Điện thoại nằm ngang thành **thẻ ngang** dùng chung bảng màu, lấy lại được dòng mô tả. Autoplay **6000 → 2500ms** trên điện thoại (`setTimeout` chuỗi để đổi được khi xoay máy) + sửa 2 bẫy `mouseenter`/`focusin` giả làm slideshow chết sau cú chạm đầu tiên. Playwright 7 khổ → sạch; ảnh chụp bắt thêm lỗi CTA vỡ 2 dòng ở khổ 320. D-60. |
| 2026-08-04 (v9) | **Chốt MỘT bản + dựng lại mobile (YC-16).** (a) Khách chọn VR Wall + Slider → gỡ `css/carousel.css` · `css/popup.css` · `css/responsive.css` · `js/carousel.js` · `js/popup.js` · `host-demo.html`, gỡ 21 khoá i18n chết + `D.mustOf` + cờ `must` + `--st-ease-flow`. Giữ nguyên tên có hậu tố "2" và ghi rõ vì sao (decision log đang trỏ tới tên cũ ở ~40 chỗ). (b) **Dựng lại toàn bộ `responsive2.css`**: `.st-wall` thành trang cuộn thay vì cuộn lồng, ô theo `aspect-ratio`, ô lớn thành thẻ hero, thanh công cụ `sticky` 2 hàng (≤379 xếp dọc), header căn trái, landscape 3 cột, slider gọn còn 2 hàng dưới, bản đồ thành bottom sheet có `--st-card-h` đo thật. (c) Lôi ra 3 lỗi có sẵn: `--st-t-h3` không tồn tại · `g.cover` chưa bao giờ được đọc nên ô hero trùng ảnh ô kế · @media bản đồ nằm ở hai file. (d) Playwright 7 khổ × 4 màn, 9 bất biến hình học → sạch. D-57 · D-58. |
| 2026-08-04 (v8) | **Chuyển động + ảnh nguồn + danh sách (YC-15).** (a) Carousel 5 thẻ với 4 biến bậc tách riêng; độ mờ thôi làm việc diễn tả chiều sâu; autoplay `3600 → 3000ms`, transition `620 → 720ms` + `--st-ease-flow`; parallax thẻ giữa. (b) Dựng lại animation vào màn cho **cả hai bản** — bản 2 trước đây "chưa có" thật ra là có mà bị lớp fade khung nuốt mất. (c) **Truy ra nguyên nhân "ảnh vỡ": 9/12 ảnh gốc trên site chỉ 600×600**, bản cũ còn phóng lên 760 ngay từ khâu dựng asset → đổi nguồn sang trang chi tiết, 9/12 lên ≥900px, tổng `930 KB → 1,32 MB`. (d) Danh sách điểm từ dòng sang thẻ ảnh 4:3 (D-56). (e) Sửa `--st-n-800` — token không tồn tại. (f) Mobile thẻ `78vw → 92vw`. D-55 · D-56. |
| 2026-08-04 (v7) | **Nền trắng phẳng 2 bản + carousel to hơn (YC-14).** (a) Bỏ 2 vệt radial ở `#st-popup`; `#st-pop2` + `.st-wall` đổi từ nền tối sang `--st-bg` — **đảo ngược D-50 #4**, kèm kê lại viền ô (`inset 1px --st-n-200`), độ mờ hover (`.42 → .62`), eyebrow, tiêu đề, nút thanh công cụ, nút `×` (có override kính mờ ở slider). (b) Nút bản đồ chuyển từ `.st-foot-map` (footer) lên `.st-search-row` cạnh ô tìm; xoá hẳn `.st-foot-actions`. (c) Viết lại `css/carousel.css`: cỡ thẻ suy từ chiều cao sân khấu thay vì hằng số `66vh`, bỏ cặp auto-margin — thẻ giữa `547 → 662px` ở 1440×900, `560 → 820px` ở 1920. Playwright 7 viewport → PASS, 0 lỗi console. D-54. |
| 2026-08-03 (v6) | **Sửa lỗi ảnh ô wall hụt mép phải.** `base.css` `img { max-width: 100% }` kẹp `.st-wt-img` (`width: 112%`) xuống 100% → dải trống dọc 34px (51px khi parallax). Thêm `max-width: none`. Thêm `tools/check-image-cover.js` đo rect thật ở 2 bản × {mặc định, parallax ±2.5%, hover, mobile}; đã kiểm ngược là tool bắt đúng lỗi. D-53. |
| 2026-08-03 (v5) | **Bản đồ 2D + bản 1 đổi sang khu vực (YC-13).** Thêm `js/map2d.js` + `css/map2d.css` (dùng chung 2 bản: pan/zoom, pin số hiệu màu theo nhóm, thẻ chi tiết, lọc theo khu vực đang xem) + `assets/map/park-2400.webp` (flatten `#0f172a`, 391 KB) + `D.MAP`/`D.MAP_META`. Bản 1: thẻ carousel đổi từ ĐIỂM sang **KHU VỰC**, thêm ô tìm kiếm bỏ dấu và trạng thái danh sách. Rule `img { object-fit: cover }` trong `base.css`. Test Playwright 13 nhóm kiểm, cả 2 bản → 0 lỗi console. D-51 + D-52. |
| 2026-08-03 (v4) | **Dựng BẢN 2 (YC-12).** `index2.html` — VR Wall 9 ô → Infinite Slider → VR, theo `note.md` §137. Thêm `js/wall.js` · `js/slider.js` · `js/popup2.js` · `css/wall.css` · `css/slider.css` · `css/responsive2.css` + `D.GROUPS` (9 nhóm) + `D.imgOf` + `D.deaccent` + chuỗi `wall.*`/`slider.*`. **Song song, không thay bản 1**; dùng chung `bridge.js` nên trang cha không phải sửa gì. `host-demo.html` thêm nút chuyển bản. Docs mới: `09-variant2.md`. Test Playwright bản 2 (10 nhóm kiểm) + **hồi quy bản 1** → 0 lỗi console. D-50. |
| 2026-08-03 (v3) | **Popup TOÀN MÀN + carousel 3 thẻ (YC-11).** Bỏ `.st-scrim` + `.st-popup-panel`; `#st-popup` chiếm trọn màn, nền trắng đặc + 2 vệt radial brand. Thẻ giữa `340px → 560px`, `visible` thành tham số của `ST.carousel.create()` (`1` = 3 thẻ). Sửa bẫy cặp auto-margin bị media query mobile phá. D-48 + D-49. |
| 2026-08-03 (v2) | **PIVOT sang popup nhúng iframe (YC-10).** Xoá 12 file của phần "trang VR"; gộp `overlays/store/app/welcome` → `js/popup.js`; thêm `js/bridge.js` (VRCore trực tiếp + postMessage) và `host-demo.html`. Sprite icon 68 → 5. Viết lại `CLAUDE.md` + 11 file docs. Test Playwright: độc lập · iframe · bridge 2 chiều · Esc · mobile · landscape → **0 lỗi console**. D-46 + D-47. |
| 2026-08-03 | **3D carousel + sửa lỗi mở modal lần 2 (YC-9).** Gỡ hoàn toàn bản đồ SVG, 8 hotspot, mini-card, tooltip và danh sách mobile khỏi M1; thay bằng 3D coverflow 12 ảnh banner tải từ `suoitien.vn` (760×507 webp, 930 KB). Thêm `css/carousel.css`, `js/carousel.js`, `assets/img/cards/`, icon `i-star`, 4 chuỗi i18n. Sửa lỗi mở lần 2 mất nội dung: tách event `modal:shown`, thêm token `gen`, dọn animation tồn đọng đầu `open()`. Test Playwright: 4 kịch bản mở modal + reduced-motion + đổi ngôn ngữ + bàn phím → **0 lỗi console**. D-44 + D-45; **đảo ngược D-08 + D-32**. |
| 2026-08-01 (v4) | **Clone 2 overlay (YC-8).** Dựng `#st-route` (M2) + `#st-places` (M3) bám sát 2 ảnh khách gửi. Thêm `css/route.css`, `css/places.css`, `js/route.js`, `js/places.js`, lớp `.st-fs`, `MAP_META`, `WAYFIND`, khối `BI` trong i18n, 9 icon. 2 nút cụm C trỏ vào overlay mới. **Đảo ngược D-09v2.** D-43. |
| 2026-08-01 (v3) | **Thẻ vé combo + bỏ div nền (YC-7).** Nút combo tách khỏi cụm C thành `#st-ticket` dạng tấm vé (rút gọn từ `.j-seanote`: bỏ con dấu, bỏ nút trong vé, nhỏ gọn hơn), đặt dưới navbar bên phải, nảy nhẹ mỗi 8s. Cụm C bỏ `background`/`border`/`shadow` → 2 pill rời, quay lại hàng ngang. Thêm `css/ticket.css`. D-41 + D-42. |
| 2026-08-01 (v2) | **Thu phạm vi (YC-6).** Khách chốt chỉ giao header + cụm C 3 nút + modal welcome; mọi thứ khác không được thêm vào trang vì trip360 đã có control ở đó. Thêm `css/scope.css` + cờ `SCOPE`. **Đảo ngược D-05v2**: cụm C về dưới-trái, xếp dọc (hàng ngang tràn qua cụm ⓓ ở 1280px với nhãn EN). Thêm nút `Xem combo`. Cập nhật cả 11 file docs. |
| 2026-07-30 | Đọc source trang VR (3DVista, VRCore, floorplan, catalog.json 158 điểm). Figma không truy cập được. Tạo `CLAUDE.md` + 12 file docs. Chốt D-01→D-22. Gửi khách 28 câu hỏi. |
| 2026-07-30 (chiều) | Khách trả lời 28 câu + gửi 6 ảnh. Lấy được **10 màu + font thật** từ `style.css`, 84 mục menu, link mua vé, URL logo + social. Phát hiện trang VR có **5 cụm control**. **Đảo ngược D-05/D-07/D-10**. Cập nhật `00`, `01`, `02`, `03`, `04`, `06`, `08`. |
| 2026-07-31 (v2) | **Header vòng 5.** Sửa luật responsive topbar dải 900–1200 về đúng gốc; đo lại sao cờ VN (R=5.6) và cờ UK (nét đẳng hướng, không chéo đỏ) bằng fit RMS ở cỡ 24×18. Cập nhật `03`, `08`, `TODO`. |
| 2026-07-31 | **Header vòng 4 — topbar phải.** Bỏ lối vẽ tay icon FontAwesome, trích outline từ font gốc; sửa cỡ glyph `15px`, cờ `24×18`, sao VN, hở cờ↔social `20px`. Thêm cách kiểm **so pixel với site gốc** bằng Chrome headless. Cập nhật `02`, `03`, `08`, `TODO`. |
| 2026-07-30 (tối) | **Viết xong prototype v1**: 1 HTML + 8 CSS + 10 JS. Test Playwright desktop 1440 + mobile 390 → **0 lỗi console**, mọi luồng đúng. Tìm và sửa **7 lỗi** chỉ lộ ra khi chạy thật (D-31→D-35). Cập nhật docs `01`, `03`, `04`, `08`, `TODO`. |
