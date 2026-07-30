> Cập nhật: 2026-07-30

# TODO

Ký hiệu: `[ ]` chưa làm · `[~]` đang làm · `[x]` xong (kèm ngày) · `[!]` bị chặn · `[-]` bỏ

**Quy tắc:** việc mới thêm vào cuối section. Việc xong đánh `[x]` + ngày, **không xoá**
(giữ history). Mỗi lần sửa code là cập nhật file này cùng lượt (CLAUDE.md RULE #1).

---

## 🔴 P0 — Chặn tiến độ, cần khách trả lời

- [!] **Q24 — Bộ màu chính thức từ Figma.** Figma cần login, `WebFetch` không đọc được.
      Đang dùng palette suy ra từ `#0e6b2e` ([`02-design-system.md`](02-design-system.md) §2.1).
      → Cần: export PNG/PDF **hoặc** share link public **hoặc** gõ tay hex primary/secondary/accent.
- [!] **Q15 — Chốt vị trí nút:** dock dưới-giữa (đang chọn) / rail phải / giữ dưới-trái.
- [!] **Q20 — Navbar trên trang VR:** glass overlay + auto-dim (đang chọn) / luôn hiện / hamburger.
- [!] **Q16 — Tick danh sách nút cần thêm** vào dock (12 lựa chọn đã gửi).
- [!] **3 hình của YC-2** — khách nhắc "(3 hình)" nhưng chưa attach. Nếu là 3 phương án
      design để so sánh thì cần gửi.

## 🟡 P1 — Nên có trước khi code, không chặn

- [ ] Q1 — Standalone hay ghép repo thật? Folder đang trống.
- [ ] Q2 — Được load asset từ site thật qua URL không?
- [ ] Q17 — Link đặt vé online thật (nếu có) cho `#st-cta-ticket`.
- [ ] Q18 — Nội dung dropdown thật của "TRÒ CHƠI" / "Dịch vụ" / "Tin tức & Thư viện" + URL thật các mục.
- [ ] Q21 — File logo Suối Tiên (SVG/PNG nền trong suốt).
- [ ] Q27 — Ảnh các khu để làm thumbnail hotspot/card (đang dùng gradient placeholder).
- [ ] Q6 — Chốt 1 trong 3 biến thể tiêu đề modal welcome.
- [ ] Q7 — Được nói số "158 điểm" công khai, hay ghi "hơn 150 điểm"?
- [ ] Q28 — "Lâu Đài **Phép** Thuật" hay "**Pháp** Thuật"? (site chính vs catalog.json lệch nhau)
- [ ] URL Facebook / TikTok / Instagram / YouTube thật.

---

## ✅ Docs

- [x] `CLAUDE.md` — RULE #1/#2/#3 + bối cảnh kỹ thuật site thật · 2026-07-30
- [x] `docs/README.md` — index + cách chạy + query params · 2026-07-30
- [x] `docs/00-requirements.md` — brief gốc + hiện trạng site + 28 câu hỏi mở · 2026-07-30
- [x] `docs/01-architecture.md` — structure, thứ tự load, z-index, sơ đồ phụ thuộc · 2026-07-30
- [x] `docs/02-design-system.md` — palette, typography, spacing, radius, shadow, motion, icon · 2026-07-30
- [x] `docs/03-components.md` — 14 section, spec từng component + bảng tổng hợp · 2026-07-30
- [x] `docs/04-modals.md` — 6 modal + 2 popover + 1 toast, engine chung, ma trận va chạm · 2026-07-30
- [x] `docs/05-flows.md` — 10 luồng, sequence/state/flowchart mermaid, xử lý lỗi · 2026-07-30
- [x] `docs/06-data.md` — schema data.js + data thật catalog.json + checklist MOCK · 2026-07-30
- [x] `docs/07-integration.md` — 3 bẫy, VRCore API, 3 phương án port, 8 rủi ro · 2026-07-30
- [x] `docs/08-decisions.md` — D-01 → D-22 · 2026-07-30
- [x] `docs/TODO.md` — file này · 2026-07-30
- [ ] Cập nhật `02-design-system.md` khi có màu Figma thật (P0)
- [ ] Thêm screenshot demo vào `README.md` sau khi code xong

---

## 🏗️ Nền tảng

- [ ] `index.html` — shell + SVG sprite inline + thứ tự load theo [`01-architecture.md`](01-architecture.md) §1.3
- [ ] `css/tokens.css` — toàn bộ token của [`02-design-system.md`](02-design-system.md)
- [ ] `css/base.css` — reset, `@font-face` Be Vietnam Pro local, `.st-sr-only`, focus ring, `prefers-reduced-motion`
- [ ] `assets/icons.svg` — 29 symbol theo §2.7
- [ ] `assets/logo.svg` — placeholder (chờ Q21)
- [ ] `js/data.js` — DESTINATIONS (40), HOTSPOTS (8), NAV_MENU (9), DOCK_BUTTONS (7), COPY, CONTACT, SOCIAL, TYPE_META, `buildGroups()`
- [ ] `js/store.js` — state + `get/set/patch/on/emit`
- [ ] `js/a11y.js` — `lockScroll/unlockScroll/trap/onEsc/rememberFocus/restoreFocus`
- [ ] `js/app.js` — bootstrap 14 bước theo [`05-flows.md`](05-flows.md) §5.7 + `ST.toast()` + `ST.track()`

## 🎬 Mock viewer

- [ ] `js/viewer.js` — nền gradient/ảnh, drag pan + inertia, auto-rotate, `goTo()` fade, guard `_navigating`
- [ ] `css/viewer.css` — `#st-viewer`, overlay fade trắng, `.st-dimmed` (blur khi modal mở)
- [ ] `#st-hint` — "Kéo để xem toàn cảnh 360°", 1 lần, localStorage
- [ ] `#st-scene-label` — tên điểm + `4/158`, `aria-live`, animation đổi text

## 🧭 YC-3 · Navbar

- [ ] `css/navbar.css` + `js/navbar.js`
- [ ] `#st-topbar` — hotline, email, 4 social, VI/EN, nút Mua vé nhỏ
- [ ] `#st-navbar` — logo + 9 mục từ `NAV_MENU`
- [ ] `#st-nav-vr360` — badge `360°`, active, ring pulse 2 lần
- [ ] `.st-nav-dd` — dropdown, mở bằng hover **và** click, Esc đóng, ↑↓ điều hướng
- [ ] Auto-dim — capture-phase `pointerdown`, timer 2.2s, vùng top 100px, Tab focus, lock khi modal mở
- [ ] `#st-drawer` — mobile, accordion, swipe đóng, focus trap
- [ ] `#st-cta-ticket` — accent, `--st-accent-ink`, floating trên mobile

## ⭐ YC-1 · Modal welcome

- [ ] `assets/map/park-map.svg` — 6 layer, viewBox landscape `1000×640`
- [ ] Biến thể portrait mobile — viewBox `640×800`, bộ toạ độ `xm/ym`
- [ ] `css/welcome.css` + `js/welcome.js`
- [ ] Panel + scrim blur, desktop 2 cột `1fr / 340px`, mobile fullscreen sheet
- [ ] Header — eyebrow `TOUR 360°` + title + subtitle, animation lệch 60ms
- [ ] 8 hotspot — stagger 55ms, spring, ring pulse cho 3 điểm `must`
- [ ] Hotspot states — hover/focus/selected + tooltip + touch target 44px
- [ ] Roving tabindex ←→↑↓ trong `#st-welcome-map`
- [ ] `#st-welcome-preview` — 3 state idle/selected/loading, cross-fade
- [ ] Mobile: preview thành bottom sheet slide-up
- [ ] `#st-welcome-skip` — "Để tôi tự khám phá →"
- [ ] Logic `shouldShow()` + query params + chờ 800ms (D-13)
- [ ] **Không** đóng bằng click scrim (D-14)
- [ ] ARIA đầy đủ theo [`04-modals.md`](04-modals.md) §4.3.7

## 🎛️ YC-1b + YC-2 · Dock & buttons

- [ ] `css/controls.css` + `js/controls.js`
- [ ] `#st-dock` — glass, pill, `--st-sh-glass`, render từ `DOCK_BUTTONS`
- [ ] `#st-btn-route` primary brand · `#st-btn-places` secondary glass (D-04)
- [ ] 4 nút ghost: fullscreen, sound (mock), rotate, more
- [ ] `#st-more-popover` — 4 mục, `role="menu"`, ↑↓, mở lên trên
- [ ] Toggle state — icon on/off, nền brand khi bật, `aria-pressed`
- [ ] Tooltip cho nút icon-only (hover + focus, không chỉ hover)
- [ ] Responsive dock — cuộn ngang `≤599px` + fade gradient 2 đầu, bỏ label `≤380px`, landscape thấp

## 🗺️ Modal Directions (M2)

- [ ] `css/overlays.css` + `js/overlays.js` — engine `open/close/closeAll/isOpen/current`
- [ ] Bind `[data-st-close]` toàn cục
- [ ] `#st-directions` — panel, search, bản đồ dùng lại `park-map.svg`
- [ ] `#st-route-layer` — path dashed + `animation: dashmove`
- [ ] 3 path hardcode + fallback đường thẳng bo góc
- [ ] Tính khoảng cách `getTotalLength() × SCALE` → mét → phút (÷1.25 m/s)
- [ ] `#st-dir-my-location` — mock toast 1s + marker hardcode
- [ ] `#st-dir-split` — mock split-view, divider kéo được (pointer + touch)
- [ ] "Bắt đầu dẫn đường" — highlight từng chặng 1.2s + toast hướng đi

## 📋 Modal Places (M3)

- [ ] `#st-places` — panel, header sticky
- [ ] `#st-places-search` — debounce 180ms, normalize NFD bỏ dấu (D-18)
- [ ] 11 `.st-chip-filter` theo `type`, cuộn ngang mobile
- [ ] 2 section: NỔI BẬT (20) + TẤT CẢ A–Z
- [ ] `.st-place-card` — gradient thumbnail theo `TYPE_META`, chip type, badge "N góc nhìn"
- [ ] Gộp trùng tên `buildGroups()` (D-19)
- [ ] Lazy render 24 card + `IntersectionObserver`
- [ ] Empty state + nút "Xoá tìm kiếm"
- [ ] Grid 2 cột mobile

## 🔗 Modal Share / Help / Toast

- [ ] `#st-share` — link `?pano=<key>`, copy + fallback `execCommand`, 4 social, QR mock, bottom sheet mobile
- [ ] `#st-help` — 4 bước, checkbox "không hiện lại"
- [ ] `#st-toast` — `ST.toast(msg, type)`, `role="status"`, tự tắt 2.8s, dùng cho mọi nút mock

## ♿ A11y & QA

- [ ] Focus trap test — Tab/Shift+Tab không thoát panel ở cả 6 modal
- [ ] Esc đóng + focus quay về nút trigger ở cả 6 modal
- [ ] `aria-hidden` đặt **sau** transition (bẫy ở [`04-modals.md`](04-modals.md) §4.2)
- [ ] Contrast — verify lại 7 cặp màu ở §2.1 bằng tool thật
- [ ] `prefers-reduced-motion` — tắt hết stagger/spring/pulse/dash
- [ ] Screen reader — modal welcome đọc tiêu đề + tên hotspot
- [ ] `env(safe-area-inset-*)` — test dock/topbar/scene-label trên iPhone có notch
- [ ] Landscape mobile `height ≤ 460px`
- [ ] Fallback `@supports not (backdrop-filter)` → alpha `.88`
- [ ] try/catch quanh mỗi `init()` — 1 module lỗi không chết cả app
- [ ] Test `?pano=` với key không tồn tại
- [ ] Test `localStorage` bị chặn (private mode)

## 📦 Đóng gói demo

- [ ] `?debug=1` panel — state, modal đang mở, grid 8px, nút reset localStorage
- [ ] Script gộp thành 1 file HTML để gửi qua Zalo/email (Q5)
- [ ] Screenshot / GIF các luồng chính cho `README.md`
- [ ] Trang `compare.html` — before/after 2 nút, để thuyết trình YC-2
- [ ] Kiểm tra mở `file://` chạy được (không CORS)

## 🔮 v2 — sau khi khách duyệt

- [ ] `#st-rail` nút phụ bên phải (chỉ nếu Q16 tick > 8 nút — D-22)
- [ ] Thanh thumbnail carousel các điểm ở đáy
- [ ] Thuyết minh audio từng điểm
- [ ] "Đã ghé" state cho hotspot (localStorage)
- [ ] Nút "Góc nhìn khác →" chuyển vòng qua `views` của group
- [ ] Bản EN — `COPY_EN` + switch
- [ ] Journey mode — tuyến tham quan gợi ý theo thứ tự
- [ ] Nối `ST.track()` thật + dashboard 9 event ở [`05-flows.md`](05-flows.md) §5.9

---

## Nhật ký

| Ngày | Việc |
|---|---|
| 2026-07-30 | Đọc source site thật (3DVista, VRCore, floorplan, catalog.json 158 điểm). Xác định Figma không truy cập được. Tạo `CLAUDE.md` + 12 file docs. Chốt D-01 → D-22. Gửi khách 28 câu hỏi. Chưa viết code. |
