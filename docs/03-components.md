> Cập nhật: 2026-07-30

# 03 — Components

Spec từng thứ hiển thị trên màn hình. Modal/overlay tách riêng ở
[`04-modals.md`](04-modals.md).

Ký hiệu: 🟢 sẽ code trong v1 · 🟡 code nhưng là mock rỗng · ⬜ v2

---

## 3.1 `#st-topbar` — Thanh trên cùng 🟢

Clone từ `suoitien.vn`. Ẩn hoàn toàn trên mobile (`≤599px`).

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ☎ 1900 636 787   ✉ phongkinhdoanh@suoitien.com │  f ♪ ⓘ ▶  VI|EN  [Mua vé] │
└─────────────────────────────────────────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-topbar` |
| Vị trí | `position: fixed; top: var(--st-sat); left/right: 0` |
| z-index | `--st-z-navbar` (40) |
| Chiều cao | `36px` |
| Nền | `--st-glass-dark` + `backdrop-filter: var(--st-glass-blur)` |
| Text | `--st-t-xs`, `#fff`, `text-shadow: 0 1px 2px rgba(0,0,0,.5)` |
| Nội dung trái | Hotline `1900 636 787` (link `tel:`), email (link `mailto:`) |
| Nội dung phải | 4 icon social · switch `VI/EN` · nút "Mua vé" nhỏ |
| Responsive | `≤599px`: `display: none`. `600–1023px`: bỏ email, giữ hotline + Mua vé |
| Data | `ST.data.CONTACT`, `ST.data.SOCIAL` |

---

## 3.2 `#st-navbar` — Navbar chính 🟢

**Yêu cầu YC-3.** Clone menu site chính + thêm tab VR360.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [LOGO]  Trang chủ  Giới thiệu  Trải nghiệm ▾  ⟨VR360 360°⟩  TRÒ CHƠI ▾  │
│                                Dịch vụ ▾  Bảng giá  Tin tức ▾  Liên hệ   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-navbar` |
| Vị trí | `fixed; top: calc(var(--st-sat) + 36px)` (dưới topbar; `36px→0` khi topbar ẩn) |
| z-index | `--st-z-navbar` (40), dropdown `--st-z-dropdown` (45) |
| Chiều cao | `60px` desktop · `54px` mobile |
| Nền | `--st-glass-dark` + blur. **Không** nền đặc — xem D-06 |
| Logo | `assets/logo.svg`, cao `34px`, click → `https://suoitien.vn` |
| Item | `--st-t-body-md`, `#fff`, padding `10px 14px`, `--st-r-pill` |
| Item hover | `background: --st-glass-light` |
| Item active | `background: --st-brand-600`, `#fff` |
| Data | `ST.data.NAV_MENU` |

### Hành vi auto-dim (D-07)

Navbar cần biến mất khi user đang xem 360°, nhưng phải quay lại dễ dàng.

| Trigger | Hành vi |
|---|---|
| User `pointerdown` trên `#st-viewer` | Thêm `.st-nav-dim` → `opacity: .16`, `pointer-events: none`, `transform: translateY(-6px)` |
| `pointerup` + 2.2s không tương tác | Bỏ `.st-nav-dim` |
| Chuột vào vùng `top: 0 → 100px` | Bỏ ngay `.st-nav-dim` |
| Modal/overlay bất kỳ đang mở | Bỏ `.st-nav-dim` và **khoá** không cho dim lại |
| Bàn phím `Tab` focus vào navbar | Bỏ ngay `.st-nav-dim` (bắt buộc cho a11y) |
| `?nav=off` | Navbar `display: none` hoàn toàn |

Transition: `opacity/transform var(--st-dur-base) var(--st-ease)`.

### Tab VR360 (Q19)

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-nav-vr360` |
| Vị trí trong menu | Sau "Trải nghiệm đặc biệt" (thứ 4/9) |
| Label | `VR360` + badge `360°` |
| Badge | `--st-t-xs`, nền `--st-accent-500`, chữ `--st-accent-ink`, `--st-r-pill`, `2px 6px` |
| State | Luôn `aria-current="page"` (đang ở trang này) → nền `--st-brand-600` |
| Hiệu ứng thu hút | `::after` là ring `--st-accent-400` chạy `stpulse` 2 lần rồi dừng (không loop vô hạn — gây rối) |

### Dropdown

| Thuộc tính | Giá trị |
|---|---|
| Selector | `.st-nav-dd` (panel), `.st-nav-item[aria-expanded]` (trigger) |
| Mở bằng | Hover (desktop, delay-in 120ms / delay-out 240ms) **và** click/Enter (bắt buộc — hover-only fail a11y) |
| Nền | `#fff` (đặc, không glass — để đọc được), `--st-r-lg`, `--st-sh-md` |
| Item | `--st-t-body`, `--st-n-700`, hover nền `--st-brand-50` chữ `--st-brand-800` |
| Đóng | Esc · click ngoài · blur khỏi cây con |
| Có dropdown | "Trải nghiệm đặc biệt", "TRÒ CHƠI", "Dịch vụ", "Tin tức & Thư viện" (mock 4 item/cái — Q18) |

---

## 3.3 `#st-dock` — Thanh nút chính 🟢

**Đây là câu trả lời cho YC-2.** Thay `#fp-fabs` góc dưới-trái bằng dock dưới-giữa.

```
                    ┌───────────────────────────────────────────┐
                    │ ⎇ Chỉ đường │ ☰ Điểm đến │ ⤢ │ ♪ │ ↻ │ ⋯ │
                    └───────────────────────────────────────────┘
                              ↑ dưới-giữa, cách đáy 20px
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-dock` |
| Vị trí | `fixed; left: 50%; transform: translateX(-50%); bottom: calc(var(--st-s-5) + var(--st-sab))` |
| z-index | `--st-z-dock` (20) |
| Layout | `display: flex; gap: var(--st-s-2); padding: var(--st-s-2)` |
| Nền | `--st-glass-dark` + `backdrop-filter: var(--st-glass-blur)` |
| Viền | `1px solid var(--st-glass-border)` |
| Radius | `--st-r-pill` |
| Shadow | `--st-sh-glass` |
| Data | `ST.data.DOCK_BUTTONS` |

### Vì sao dời từ dưới-trái sang dưới-giữa (D-05)

1. Góc dưới-trái là nơi 3DVista đặt control của nó → dễ đè nhau.
2. Dưới-giữa là vùng ngón tay với tới dễ nhất trên mobile (thumb zone).
3. Dock gộp làm 1 bề mặt → chỉ 1 bóng, 1 viền → gọn hơn 2 pill rời cãi màu nhau.
4. Panorama đẹp nhất ở giữa-trên màn hình; nút ở giữa-dưới không che chủ thể.
5. Quen thuộc: Google Maps, Apple Photos, Matterport đều dùng dock dưới.

### Danh sách nút trong dock

| # | ID | Icon | Label | Loại | Hành động | TT |
|---|---|---|---|---|---|---|
| 1 | `#st-btn-route` | `i-route` | Chỉ đường | **primary** | Mở `#st-directions` | 🟢 |
| 2 | `#st-btn-places` | `i-list` | Điểm đến | secondary | Mở `#st-places` | 🟢 |
| 3 | — | — | — | divider | — | 🟢 |
| 4 | `#st-btn-fullscreen` | `i-expand`/`i-collapse` | (icon only) | ghost toggle | `requestFullscreen()` | 🟢 |
| 5 | `#st-btn-sound` | `i-sound-on`/`i-sound-off` | (icon only) | ghost toggle | Bật/tắt nhạc nền (mock) | 🟡 |
| 6 | `#st-btn-rotate` | `i-rotate` | (icon only) | ghost toggle | `ST.viewer.setAutoRotate()` | 🟢 |
| 7 | `#st-btn-more` | `i-more` | (icon only) | ghost | Popover: VR mode, Chia sẻ, Hướng dẫn, Ngôn ngữ | 🟢 |

**Chốt style 2 nút của YC-2:**

```
Chỉ đường  → PRIMARY:   nền --st-brand-600, chữ #fff, icon #fff, pill
                         hover → --st-brand-500  ·  active → --st-brand-700
Điểm đến   → SECONDARY: nền --st-glass-light, chữ #fff, viền --st-glass-border, pill
                         hover → rgba(255,255,255,.22)
```

→ Bỏ hẳn `#1769ff`. Hierarchy rõ: 1 nút "kêu", 1 nút "êm", không cãi nhau.

| Loại nút | Nền | Chữ | Min size |
|---|---|---|---|
| primary | `--st-brand-600` | `#fff` | `44px` cao, padding `11px 18px` |
| secondary | `--st-glass-light` + viền | `#fff` | `44px` cao, padding `11px 16px` |
| ghost (icon) | trong suốt | `#fff` | `44×44px` |
| ghost active (toggle on) | `--st-brand-600` | `#fff` | `44×44px` |

`min-height: 44px` cho mọi nút — chuẩn touch target của Apple HIG. Site thật đã
làm đúng chỗ này, giữ nguyên.

### Responsive dock

| Breakpoint | Hành vi |
|---|---|
| `≥1024px` | Đầy đủ, có label chữ trên 2 nút đầu |
| `600–1023px` | Đầy đủ, giữ label |
| `≤599px` | `left: var(--st-s-3); right: var(--st-s-3); transform: none; overflow-x: auto` → dock full-width cuộn ngang, `scrollbar-width: none`, có fade gradient 2 đầu báo còn cuộn được |
| `≤380px` | 2 nút đầu bỏ label, chỉ icon |
| Landscape mobile (`height ≤ 460px`) | `bottom: var(--st-s-2)`, nút cao `40px` |

---

## 3.4 `#st-rail` — Nút phụ bên phải ⬜ v2

Cột nút icon tròn ở giữa-phải, cho các action không thuộc luồng chính.
**Chưa code trong v1** — nếu dock đã đủ chỗ thì không cần rail (tránh 2 vùng
control cạnh tranh nhau). Ghi lại ở đây làm phương án dự phòng nếu khách tick
nhiều nút ở Q16.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-rail` |
| Vị trí | `fixed; right: calc(var(--st-s-4) + var(--st-sar)); top: 50%; translateY(-50%)` |
| Layout | `flex-direction: column; gap: var(--st-s-2)` |
| Nút | `44×44px` tròn, `--st-glass-dark`, hover bung label sang trái (tooltip) |

---

## 3.5 `#st-cta-ticket` — Nút "Mua vé" 🟢

**Q17** — nếu là ưu tiên kinh doanh thì đây phải là thứ nổi nhất trên màn hình.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-cta-ticket` |
| Vị trí | Trong `#st-topbar` (desktop) · nút nổi `bottom-right` (mobile, vì topbar ẩn) |
| Nền | `--st-accent-500` |
| Chữ | `--st-accent-ink` (**không bao giờ** trắng — fail contrast, xem §2.1) |
| Icon | `i-ticket` |
| Shadow | `--st-sh-cta` (bóng màu vàng) |
| Hành động | Mở tab mới → `https://suoitien.vn` (mock, chờ link đặt vé thật) |
| Ghi chú | Là **màu accent duy nhất** trên toàn UI ngoài hotspot active → nên nó luôn nổi nhất |

---

## 3.6 `#st-scene-label` — Tên điểm hiện tại 🟢

Không phải nút. Cho user biết "tôi đang ở đâu" — hiện tại site thật không có,
là một lỗ UX lớn (158 điểm mà không biết đang ở đâu).

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-scene-label` |
| Vị trí | `fixed; left: calc(var(--st-s-4) + var(--st-sal)); bottom: calc(var(--st-s-5) + var(--st-sab))` |
| z-index | `--st-z-scene-label` (10) |
| Nội dung | Chip `type` (VD "tham quan") + tên điểm + số thứ tự `4/158` |
| Nền | `--st-glass-dark`, `--st-r-pill`, padding `8px 14px` |
| Cập nhật | Subscribe `store.on('scene:change')` |
| Animation | Đổi scene → fade out 120ms → đổi text → slide up 6px + fade in 240ms |
| Responsive | `≤599px`: dời lên `bottom: calc(dock-height + 12px)` để không đè dock |
| ARIA | `aria-live="polite"` — screen reader đọc tên điểm mới |

---

## 3.7 `#st-hint` — Hint "kéo để xem 360°" 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-hint` |
| Vị trí | Giữa màn hình, `--st-z-hint` (5) |
| Nội dung | Icon bàn tay kéo + "Kéo để xem toàn cảnh 360°" |
| Khi hiện | Sau khi modal welcome đóng, chờ 600ms |
| Khi ẩn | User drag lần đầu · hoặc tự ẩn sau 4s |
| Chỉ hiện 1 lần | `localStorage['st.hint.seen']` |
| Animation | Bàn tay dịch ngang ±14px, loop 2 lần rồi dừng |

---

## 3.8 `.st-hotspot` — Hotspot trên bản đồ 🟢

Dùng trong `#st-welcome` và `#st-directions`. Chi tiết bản đồ ở
[`04-modals.md`](04-modals.md) §4.3.

| State | Style |
|---|---|
| Bình thường | `36px` tròn, nền `--st-brand-600`, icon `#fff` `20px`, viền `2.5px #fff`, `--st-sh-md` |
| Ring pulse (chỉ 3 điểm "must-see") | `::after` ring `--st-accent-400`, animation `stpulse` 2.4s infinite |
| Hover / focus | `scale(1.18)`, nền `--st-brand-500`, hiện tooltip tên điểm phía trên |
| Selected | Nền `--st-accent-500`, icon `--st-accent-ink`, `scale(1.22)`, ring đứng |
| Đã ghé (v2) | Nền `--st-n-400`, icon check |
| Touch target | `::before` phủ `44×44px` trong suốt (hotspot vẽ 36px nhưng bấm được 44px) |

Tooltip: `.st-hotspot-tip` — nền `--st-n-900`, chữ `#fff`, `--st-t-sm`,
`--st-r-sm`, mũi nhọn 5px, `pointer-events: none`.

---

## 3.9 `.st-place-card` — Card 1 điểm đến 🟢

Dùng trong `#st-places` (grid) và preview của `#st-welcome`.

```
┌──────────────────────────────┐
│ ┌──────────────────────────┐ │
│ │   [thumbnail 16:9]       │ │  ← gradient placeholder (Q27 chưa có ảnh)
│ │              ⟨tham quan⟩ │ │  ← chip type góc dưới-phải
│ └──────────────────────────┘ │
│ Lâu Đài Tuyết                │  ← --st-t-h3
│ Xứ tuyết trong lòng Sài Gòn  │  ← --st-t-sm, --st-n-500
│                  [Đi đến →]  │
└──────────────────────────────┘
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `.st-place-card` |
| Nền | `#fff`, `--st-r-md`, `--st-sh-sm` |
| Hover | `translateY(-3px)`, `--st-sh-md`, thumbnail `scale(1.05)` (overflow hidden) |
| Thumbnail | `aspect-ratio: 16/9`, gradient theo `icon` của điểm (mỗi loại 1 gradient) |
| Chip type | `--st-t-xs` uppercase, nền `--st-brand-100`, chữ `--st-brand-800` |
| Toàn card clickable | `<button>` bọc ngoài, không phải `<div onclick>` — bắt buộc cho keyboard |

---

## 3.10 `.st-chip-filter` — Chip lọc theo loại 🟢

Dùng trong `#st-places`. Lọc theo field `type` của `catalog.json`.

| State | Style |
|---|---|
| Off | Nền `--st-n-100`, chữ `--st-n-700`, viền `1px --st-n-200`, `--st-r-pill` |
| On | Nền `--st-brand-600`, chữ `#fff`, viền trong suốt |
| Layout | `flex-wrap: wrap` desktop · cuộn ngang `≤599px` |

Danh sách chip (từ data thật): `Tất cả` · `vào cổng` · `tham quan` · `cảm giác mạnh` ·
`trải nghiệm` · `di chuyển` · `công viên nước` · `trò chơi` · `khám phá` · `quà tặng` · `khác`

---

## 3.11 `#st-toast` — Thông báo 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-toast` (container), `.st-toast-item` |
| Vị trí | `fixed; top: calc(var(--st-sat) + 110px); left: 50%; translateX(-50%)` |
| z-index | `--st-z-toast` (85) |
| Nền | `--st-n-900` + blur, chữ `#fff`, `--st-r-pill` |
| Vào/ra | slide down 8px + fade, `--st-dur-base` |
| Tự tắt | 2800ms |
| API | `ST.toast('Chức năng đang phát triển')`, `ST.toast(msg, 'info'\|'warn')` |
| ARIA | `role="status" aria-live="polite"` |
| Dùng cho | Mọi nút mock chưa có chức năng thật (thay vì click không phản hồi) |

---

## 3.12 `#st-drawer` — Menu mobile 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-drawer`, trigger `#st-btn-menu` |
| Chỉ hiện | `≤599px` (và `600–1023px` cho phần menu tràn) |
| Vị trí | Slide từ phải, `width: min(84vw, 340px)`, full height |
| z-index | `--st-z-drawer` (75) |
| Nền | `#fff` (đặc — cần đọc được list dài) |
| Nội dung | Logo · 9 mục menu (accordion cho mục có dropdown) · divider · hotline · social · nút "Mua vé" |
| Đóng | Nút × · click scrim · Esc · swipe phải |
| A11y | `ST.a11y.trap()` — xem [`04-modals.md`](04-modals.md) §4.2 |

---

## 3.13 `#st-debug` — Panel debug ⬜

Chỉ khi `?debug=1`. Hiện: state hiện tại từ `store`, modal nào đang mở,
scene hiện tại, bảng z-index, toggle grid 8px overlay. Không style đẹp,
chỉ để dev/QA.

---

## 3.14 Bảng tổng hợp — mọi phần tử tương tác

| Selector | Loại | Vùng | Mở/đổi gì | TT |
|---|---|---|---|---|
| `#st-logo` | link | topbar/navbar | → suoitien.vn | 🟢 |
| `.st-nav-item` ×9 | link/button | navbar | → suoitien.vn hoặc dropdown | 🟢 |
| `#st-nav-vr360` | link | navbar | active, không đi đâu | 🟢 |
| `#st-btn-menu` | button | navbar mobile | `#st-drawer` | 🟢 |
| `#st-lang-vi` / `#st-lang-en` | button | topbar | toast "đang phát triển" | 🟡 |
| `.st-social` ×4 | link | topbar | → mạng xã hội | 🟢 |
| `#st-cta-ticket` | link | topbar / floating | → suoitien.vn | 🟢 |
| `#st-btn-route` | button | dock | `#st-directions` | 🟢 |
| `#st-btn-places` | button | dock | `#st-places` | 🟢 |
| `#st-btn-fullscreen` | toggle | dock | Fullscreen API | 🟢 |
| `#st-btn-sound` | toggle | dock | mock + toast | 🟡 |
| `#st-btn-rotate` | toggle | dock | `viewer.setAutoRotate` | 🟢 |
| `#st-btn-more` | button | dock | popover 4 mục | 🟢 |
| `#st-btn-vr` | button | popover | toast "cần thiết bị VR" | 🟡 |
| `#st-btn-share` | button | popover | `#st-share` | 🟢 |
| `#st-btn-help` | button | popover | `#st-help` | 🟢 |
| `.st-hotspot` ×8 | button | welcome map | preview → goTo | 🟢 |
| `#st-welcome-skip` | button | welcome | đóng modal | 🟢 |
| `#st-welcome-go` | button | welcome preview | goTo + đóng | 🟢 |
| `.st-place-card` ×N | button | places | goTo + đóng | 🟢 |
| `.st-chip-filter` ×11 | toggle | places | filter list | 🟢 |
| `#st-places-search` | input | places | filter theo tên | 🟢 |
| `#st-dir-my-location` | button | directions | toast (mock GPS) | 🟡 |
| `#st-dir-split` | toggle | directions | mock split-view | 🟡 |
| `.st-modal-close` ×N | button | mọi modal | đóng | 🟢 |
