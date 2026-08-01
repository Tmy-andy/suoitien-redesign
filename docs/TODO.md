> Cập nhật: 2026-08-01 (v9 — clone overlay M2/M3 · D-43)

# TODO

Ký hiệu: `[ ]` chưa làm · `[~]` đang làm · `[x]` xong (kèm ngày) · `[!]` bị chặn · `[-]` bỏ

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

- [ ] Q-30 · Bản đồ welcome: SVG tự vẽ (đang dùng) hay bản đồ 3D thật?
      → Đã làm sẵn `?map=real`, chỉ cần bỏ ảnh vào `assets/map/park-map-real.jpg`
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
- [ ] `assets/map/park-map-real.jpg` — bỏ vào là `?map=real` chạy (hiện tự fallback + toast)
- [ ] Ảnh thumbnail thật cho từng điểm (Q27 = chưa có → đang dùng gradient theo nhóm)
- [ ] Rà lại `blurb` 20 điểm — hiện là tôi tự viết, cần người của Suối Tiên duyệt
- [ ] Dịch EN cho các mục con của menu (hiện chỉ dịch 9 mục cấp 1)

### Cải thiện đã xác định
- [ ] **Bản đồ dọc riêng cho mobile** — `xm/ym` đã có sẵn trong `data.js`, cần vẽ SVG portrait mới (D-32)
- [ ] Zoom / pan bản đồ trong modal welcome (desktop)
- [ ] Panorama mock: thêm biến thể cảnh cho `culture` / `food` (hiện 6 nhóm dùng chung 1 hình dạng, chỉ khác màu)

### A11y & QA còn phải làm thủ công
- [ ] Screen reader thật (NVDA / VoiceOver) — modal welcome đọc tiêu đề + hotspot
- [ ] Verify 10 cặp contrast ở §2.1.7 bằng tool (mới tính lý thuyết)
- [ ] iPhone thật có notch — `env(safe-area-inset-*)` ở dock, topbar, scene-label, CTA
- [ ] Safari iOS + Samsung Internet (mới test Chromium)
- [ ] `prefers-reduced-motion` — kiểm tra morph, viền chạy, peek bob đã tắt hết
- [ ] `localStorage` bị chặn (chế độ riêng tư)
- [ ] Đo FPS trên máy Android tầm trung khi modal mở (scrim blur toàn màn hình)

### Đóng gói
- [ ] Trang `compare.html` — before/after 2 nút + before/after header, để thuyết trình
- [ ] Screenshot / GIF các luồng chính cho `README.md`
- [ ] Bản `@font-face` local cho Arima Madurai (hiện lấy Google Fonts → offline mất font)

### v2 — sau khi khách duyệt
- [ ] Re-skin 2 overlay có sẵn theo token brand
- [ ] Thanh thumbnail carousel các điểm ở đáy
- [ ] Thuyết minh audio từng điểm
- [ ] "Đã ghé" state cho hotspot (localStorage)
- [ ] Journey mode — tuyến tham quan gợi ý
- [ ] Nối `ST.track()` thật + dashboard 9 event ([`05-flows.md`](05-flows.md) §5.9)
- [ ] Xử lý cụm B (sidebar trái) và cụm E (2 nút phải) nếu khách mở phạm vi
- [ ] Bật lại từng phần của bản v2 nếu khách đổi ý — mỗi phần chỉ là 1 dòng trong
      `css/scope.css`, không phải viết lại

---

## Nhật ký

| Ngày | Việc |
|---|---|
| 2026-08-01 (v4) | **Clone 2 overlay (YC-8).** Dựng `#st-route` (M2) + `#st-places` (M3) bám sát 2 ảnh khách gửi. Thêm `css/route.css`, `css/places.css`, `js/route.js`, `js/places.js`, lớp `.st-fs`, `MAP_META`, `WAYFIND`, khối `BI` trong i18n, 9 icon. 2 nút cụm C trỏ vào overlay mới. **Đảo ngược D-09v2.** D-43. |
| 2026-08-01 (v3) | **Thẻ vé combo + bỏ div nền (YC-7).** Nút combo tách khỏi cụm C thành `#st-ticket` dạng tấm vé (rút gọn từ `.j-seanote`: bỏ con dấu, bỏ nút trong vé, nhỏ gọn hơn), đặt dưới navbar bên phải, nảy nhẹ mỗi 8s. Cụm C bỏ `background`/`border`/`shadow` → 2 pill rời, quay lại hàng ngang. Thêm `css/ticket.css`. D-41 + D-42. |
| 2026-08-01 (v2) | **Thu phạm vi (YC-6).** Khách chốt chỉ giao header + cụm C 3 nút + modal welcome; mọi thứ khác không được thêm vào trang vì trip360 đã có control ở đó. Thêm `css/scope.css` + cờ `SCOPE`. **Đảo ngược D-05v2**: cụm C về dưới-trái, xếp dọc (hàng ngang tràn qua cụm ⓓ ở 1280px với nhãn EN). Thêm nút `Xem combo`. Cập nhật cả 11 file docs. |
| 2026-07-30 | Đọc source trang VR (3DVista, VRCore, floorplan, catalog.json 158 điểm). Figma không truy cập được. Tạo `CLAUDE.md` + 12 file docs. Chốt D-01→D-22. Gửi khách 28 câu hỏi. |
| 2026-07-30 (chiều) | Khách trả lời 28 câu + gửi 6 ảnh. Lấy được **10 màu + font thật** từ `style.css`, 84 mục menu, link mua vé, URL logo + social. Phát hiện trang VR có **5 cụm control**. **Đảo ngược D-05/D-07/D-10**. Cập nhật `00`, `01`, `02`, `03`, `04`, `06`, `08`. |
| 2026-07-31 (v2) | **Header vòng 5.** Sửa luật responsive topbar dải 900–1200 về đúng gốc; đo lại sao cờ VN (R=5.6) và cờ UK (nét đẳng hướng, không chéo đỏ) bằng fit RMS ở cỡ 24×18. Cập nhật `03`, `08`, `TODO`. |
| 2026-07-31 | **Header vòng 4 — topbar phải.** Bỏ lối vẽ tay icon FontAwesome, trích outline từ font gốc; sửa cỡ glyph `15px`, cờ `24×18`, sao VN, hở cờ↔social `20px`. Thêm cách kiểm **so pixel với site gốc** bằng Chrome headless. Cập nhật `02`, `03`, `08`, `TODO`. |
| 2026-07-30 (tối) | **Viết xong prototype v1**: 1 HTML + 8 CSS + 10 JS. Test Playwright desktop 1440 + mobile 390 → **0 lỗi console**, mọi luồng đúng. Tìm và sửa **7 lỗi** chỉ lộ ra khi chạy thật (D-31→D-35). Cập nhật docs `01`, `03`, `04`, `08`, `TODO`. |
