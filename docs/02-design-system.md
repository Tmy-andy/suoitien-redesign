> Cập nhật: 2026-07-30

# 02 — Design System

> 🟡 **CẢNH BÁO:** Toàn bộ palette dưới đây là **TẠM**, suy ra từ màu thật đọc
> được trên site (`#0e6b2e`) + màu chủ đạo xanh lá của `suoitien.vn`.
> **Chưa xác nhận với Figma** (Q24 — Figma cần login, không đọc được).
> Khi có hex chính thức: sửa **duy nhất** `css/tokens.css` §Brand, toàn bộ UI đổi theo.

## 2.1 Màu

### Nguồn gốc

| Màu | Nguồn | Ghi chú |
|---|---|---|
| `#0e6b2e` | `#fp-launch` background trên site thật | Đây là **anchor** — coi là brand green chính thức |
| `#1769ff` | `#fp-list-launch` background | ❌ **Loại bỏ** — cãi màu với brand green (xem D-04) |
| `rgba(15,23,42,…)` | `#fp-close`, `#fp-vrfull-exit` | Slate-900 → giữ làm nền glass tối |
| `#1e293b` | `#fp-overlay` text color | Slate-800 → giữ làm text chính |
| `#cbd5e1` | scrollbar thumb | Slate-300 |
| Xanh lá/teal | `suoitien.vn` | Xác nhận hướng brand là xanh lá |

### Brand — thang xanh lá dẫn xuất từ `#0e6b2e`

`#0e6b2e` là HSL `hsl(140, 77%, 24%)`. Cả thang giữ hue 140–152, chỉ đổi L và S.

| Token | Hex | Dùng cho |
|---|---|---|
| `--st-brand-50` | `#eaf7ef` | Nền nhạt nhất, hover row trong list |
| `--st-brand-100` | `#cbecd8` | Nền chip/badge |
| `--st-brand-200` | `#9dd9b6` | Border nhạt |
| `--st-brand-300` | `#66c08f` | Icon trên nền tối |
| `--st-brand-400` | `#33a56d` | Hover state của primary |
| `--st-brand-500` | `#158a4a` | Primary sáng — dùng khi nền tối |
| `--st-brand-600` | `#0e6b2e` | **PRIMARY — màu thật của site** |
| `--st-brand-700` | `#0a5624` | Active/pressed |
| `--st-brand-800` | `#07411b` | Text trên nền brand-50 |
| `--st-brand-900` | `#052d13` | Nền tối nhất có hue brand |

### Accent — vàng kim (CTA "Mua vé", hotspot nổi bật)

Lý do chọn vàng: bổ trợ (không cãi) xanh lá, gợi "vàng kim / cung điện" khớp
theme văn hoá–tâm linh của Suối Tiên (Cung Vàng Điện Ngọc, Phụng Hoàng Tiên),
và nổi bật nhất khi đè lên panorama xanh–lá–trời.

| Token | Hex | Dùng cho |
|---|---|---|
| `--st-accent-300` | `#ffd980` | Hover CTA |
| `--st-accent-400` | `#ffc94d` | Ring hotspot pulse |
| `--st-accent-500` | `#f5a623` | **CTA chính** — "Mua vé", hotspot active |
| `--st-accent-600` | `#d4860c` | Active/pressed |
| `--st-accent-ink` | `#3d2600` | Text ĐEN-nâu trên nền accent (không dùng trắng — fail contrast) |

### Neutral — thang slate (khớp `rgba(15,23,42)` thật)

| Token | Hex | Dùng cho |
|---|---|---|
| `--st-n-0` | `#ffffff` | Nền modal, text trên nền tối |
| `--st-n-50` | `#f8fafc` | Nền section nhạt |
| `--st-n-100` | `#f1f5f9` | Divider nhạt, nền input |
| `--st-n-200` | `#e2e8f0` | Border |
| `--st-n-300` | `#cbd5e1` | Border đậm, scrollbar (khớp site thật) |
| `--st-n-400` | `#94a3b8` | Placeholder, icon phụ |
| `--st-n-500` | `#64748b` | Text phụ |
| `--st-n-600` | `#475569` | Text body phụ |
| `--st-n-700` | `#334155` | Text body |
| `--st-n-800` | `#1e293b` | **Text chính** (khớp site thật) |
| `--st-n-900` | `#0f172a` | Heading, nền glass tối (khớp site thật) |

### Semantic

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-info` | `#0284c7` | Toast thông tin. **Không** dùng cho button (tránh lặp lại lỗi `#1769ff`) |
| `--st-success` | `--st-brand-500` | Dùng lại brand, không thêm màu xanh lá thứ 2 |
| `--st-warn` | `#f59e0b` | Cảnh báo |
| `--st-danger` | `#dc2626` | Lỗi |

### Glass (control đè lên panorama)

Đây là điểm khác biệt lớn nhất so với UI hiện tại: thay `background: #0e6b2e` đặc
bằng glass có `backdrop-filter` → chữ luôn đọc được bất kể panorama sáng/tối.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-glass-dark` | `rgba(15, 23, 42, .62)` | Nền dock, rail, scene label |
| `--st-glass-dark-hi` | `rgba(15, 23, 42, .78)` | Hover / active |
| `--st-glass-light` | `rgba(255, 255, 255, .14)` | Nút phụ trong dock |
| `--st-glass-border` | `rgba(255, 255, 255, .18)` | Viền 1px của mọi bề mặt glass |
| `--st-glass-blur` | `blur(16px) saturate(140%)` | `backdrop-filter` |
| `--st-scrim` | `rgba(6, 12, 20, .58)` | Scrim sau modal |
| `--st-scrim-blur` | `blur(8px)` | Blur panorama khi modal mở |

> ⚠️ `backdrop-filter` không có ở Firefox cũ / một số WebView. Fallback:
> `@supports not (backdrop-filter: blur(1px))` → tăng alpha nền lên `.88`.

### Contrast check (WCAG AA cần ≥ 4.5:1 cho text thường)

| Cặp | Tỉ lệ | Kết luận |
|---|---|---|
| `#ffffff` trên `--st-brand-600 #0e6b2e` | ~7.4:1 | ✅ AA + AAA |
| `#ffffff` trên `--st-brand-500 #158a4a` | ~4.9:1 | ✅ AA (không AAA) |
| `--st-accent-ink #3d2600` trên `--st-accent-500 #f5a623` | ~7.2:1 | ✅ AA + AAA |
| `#ffffff` trên `--st-accent-500 #f5a623` | ~2.1:1 | ❌ **CẤM** — luôn dùng `--st-accent-ink` |
| `--st-n-800 #1e293b` trên `#ffffff` | ~13.9:1 | ✅ AAA |
| `--st-n-500 #64748b` trên `#ffffff` | ~4.8:1 | ✅ AA — dùng cho text ≥14px |
| `#ffffff` trên `--st-glass-dark` phủ panorama sáng | không đảm bảo | ⚠️ vì vậy mọi glass phải có `text-shadow: 0 1px 2px rgba(0,0,0,.5)` |

## 2.2 Typography

Font: **Be Vietnam Pro** — giữ nguyên vì site VR360 thật đã dùng (`vr-360/fonts.css`),
và nó là font Việt hoá tốt, có đủ dấu, nhiều weight.

```css
--st-font: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont,
           'Segoe UI', Roboto, Arial, sans-serif;
```

| Token | size / line-height / weight | Dùng cho |
|---|---|---|
| `--st-t-display` | `clamp(26px, 4vw, 40px)` / 1.15 / 800 | Tiêu đề modal welcome |
| `--st-t-h1` | `clamp(22px, 3vw, 30px)` / 1.2 / 800 | Tiêu đề overlay |
| `--st-t-h2` | `20px` / 1.3 / 700 | Tiêu đề section |
| `--st-t-h3` | `17px` / 1.35 / 700 | Tên điểm trong list |
| `--st-t-body` | `15px` / 1.55 / 400 | Text thường |
| `--st-t-body-md` | `15px` / 1.55 / 600 | Label nút |
| `--st-t-sm` | `13px` / 1.5 / 500 | Text phụ, type của điểm |
| `--st-t-xs` | `11px` / 1.4 / 700 | Badge, chip, uppercase (letter-spacing `.04em`) |

Quy tắc: **không dùng weight 300/100** (chữ Việt có dấu, weight mỏng thì dấu bị
mất trên màn hình thường). Min weight = 400.

## 2.3 Spacing — thang 4px

```
--st-s-1: 4px    --st-s-2: 8px    --st-s-3: 12px   --st-s-4: 16px
--st-s-5: 20px   --st-s-6: 24px   --st-s-8: 32px   --st-s-10: 40px
--st-s-12: 48px  --st-s-16: 64px
```

Safe area (iPhone notch / home bar) — bắt buộc cho mọi thứ `position: fixed`:

```css
--st-sat: env(safe-area-inset-top, 0px);
--st-sab: env(safe-area-inset-bottom, 0px);
--st-sal: env(safe-area-inset-left, 0px);
--st-sar: env(safe-area-inset-right, 0px);
```

## 2.4 Radius

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-r-sm` | `8px` | Chip, badge, input nhỏ |
| `--st-r-md` | `12px` | Card, input |
| `--st-r-lg` | `18px` | Modal panel, dropdown |
| `--st-r-xl` | `24px` | Modal welcome (bo mềm cho cảm giác thân thiện) |
| `--st-r-pill` | `999px` | Nút pill, dock, chip filter |
| `--st-r-circle` | `50%` | Nút icon tròn, hotspot |

Site thật dùng `border-radius: 30px` cho nút → tương đương pill. Giữ hướng pill,
vì nó là chỗ "thân thiện" trong yêu cầu "chuyên nghiệp nhưng thân thiện".

## 2.5 Shadow

Site thật dùng `0 3px 10px rgba(0,0,0,.35)` — bóng đen 35% khá nặng và bẩn khi
panorama sáng. Thay bằng thang mềm hơn + có bóng màu brand cho CTA.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-sh-sm` | `0 1px 2px rgba(15,23,42,.08), 0 1px 3px rgba(15,23,42,.10)` | Chip |
| `--st-sh-md` | `0 2px 4px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.10)` | Card, dropdown |
| `--st-sh-lg` | `0 8px 24px rgba(15,23,42,.14), 0 2px 6px rgba(15,23,42,.08)` | Modal |
| `--st-sh-xl` | `0 24px 64px rgba(6,12,20,.34)` | Modal welcome |
| `--st-sh-glass` | `0 4px 20px rgba(6,12,20,.32), inset 0 1px 0 rgba(255,255,255,.12)` | Dock, rail — có inset highlight cho cảm giác kính |
| `--st-sh-cta` | `0 4px 14px rgba(245,166,35,.42)` | Nút "Mua vé" (bóng màu accent) |
| `--st-sh-focus` | `0 0 0 3px rgba(21,138,74,.45)` | Focus ring — dùng `:focus-visible` |

## 2.6 Motion

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-dur-fast` | `140ms` | Hover, màu |
| `--st-dur-base` | `240ms` | Toggle, slide nhỏ |
| `--st-dur-slow` | `400ms` | Modal vào/ra |
| `--st-dur-scene` | `500ms` | Chuyển panorama (fade) |
| `--st-ease` | `cubic-bezier(.4, 0, .2, 1)` | Mặc định |
| `--st-ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Modal xuất hiện (bung mạnh rồi dịu) |
| `--st-ease-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | Hotspot hover, badge pop |

**Bắt buộc** — mọi animation phải tôn trọng:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

## 2.7 Icon

- 1 file `assets/icons.svg`, inline vào `index.html`, dùng `<use href="#i-xxx">`.
- **Toàn bộ icon cùng hệ**: `stroke`, `stroke-width: 1.75`, `stroke-linecap: round`,
  `stroke-linejoin: round`, viewBox `0 0 24 24`, không `fill`.
  → Sửa lỗi hiện tại của site: `#fp-launch` dùng `fill`, `#fp-list-launch` dùng
  `stroke` width 2 → 2 icon nhìn khác hệ nhau.
- Size: `18px` trong nút pill, `22px` trong nút icon tròn, `26px` trong hotspot.

Danh sách symbol: `i-route` `i-pin` `i-list` `i-search` `i-close` `i-menu`
`i-expand` `i-collapse` `i-sound-on` `i-sound-off` `i-rotate` `i-vr` `i-share`
`i-help` `i-ticket` `i-globe` `i-chevron-down` `i-chevron-right` `i-arrow-right`
`i-my-location` `i-gate` `i-see` `i-thrill` `i-wave` `i-boat` `i-ride` `i-spa`
`i-gift` `i-adv`

(9 icon cuối khớp field `icon` trong `catalog.json` — xem [`06-data.md`](06-data.md) §6.2.)

## 2.8 Breakpoint

| Tên | Điều kiện | Thay đổi chính |
|---|---|---|
| Mobile | `≤ 599px` | Topbar ẩn · navbar → hamburger · dock cuộn ngang · welcome fullscreen · bản đồ portrait |
| Tablet | `600–1023px` | Topbar ẩn · navbar rút gọn 5 mục + "Thêm" · dock đầy đủ |
| Desktop | `1024–1439px` | Đầy đủ |
| Wide | `≥ 1440px` | Modal welcome max-width `1080px`, bản đồ to hơn |

Dùng `svh`/`dvh` thay `vh` cho mọi chiều cao full-screen (mobile browser bar).
Site thật đã dùng `100svh` → giữ nhất quán.

## 2.9 So sánh trước / sau (dùng để thuyết trình với khách)

| Hạng mục | Hiện tại | Đề xuất |
|---|---|---|
| Màu nút | `#0e6b2e` xanh lá + `#1769ff` xanh dương, ngang hàng | 1 primary brand green + 1 secondary glass. Accent vàng chỉ cho CTA |
| Bề mặt | Màu đặc, bóng đen 35% | Glass + `backdrop-filter` + inset highlight |
| Vị trí | 2 nút dồn góc dưới-trái | Dock dưới-giữa (chính) + rail phải (phụ) |
| Icon | 2 hệ khác nhau (fill vs stroke) | 1 hệ stroke 1.75 duy nhất |
| Hierarchy | Không có — 2 nút cùng trọng lượng | 3 cấp: CTA vàng > primary brand > glass phụ |
| Onboarding | Không có | Modal welcome + bản đồ hotspot |
| Liên kết với site chính | Không có | Navbar clone + tab VR360 |
