> Cập nhật: 2026-08-04 (v11 — §2.11 viết lại: hai bản dùng CHUNG nền trắng · D-54)

# 02 — Design System

> ⚠️ **Phần lớn file này viết cho bản trước** (header, navbar, dock, thẻ vé) và giữ lại
> làm nguồn tra **màu/font gốc từ site chính** — phần đó vẫn đúng và vẫn là nguồn của
> `tokens.css`. Nhưng các mục tả spec của UI đã gỡ (§2.3.1 vùng cấm, §2.4.1 răng cưa
> tấm vé, §2.7.1 bộ icon `i-fa-*`) **không còn tương ứng với code** — xem
> [`08-decisions.md`](08-decisions.md) D-46.
>
> `tokens.css` hiện chỉ còn những token popup thật sự dùng: 3 thang màu brand, neutral,
> `--st-bg`, 6 bậc chữ, spacing, radius, shadow, motion, 3 z-index.
> **Đã gỡ:** `--st-topbar-h` · `--st-navbar-h` · `--st-header-h` · `--st-rz-*` (vùng
> cấm) · `--st-c-max-w` · `--st-sh-brand` · `--st-sh-cta` · `--st-blur` ·
> `--st-surface-blur` · `--st-scrim` (D-48 bỏ lớp nền mờ).

> ✅ **v2:** Toàn bộ token dưới đây **đọc trực tiếp từ CSS thật** của
> `suoitien.vn/halink-content/themes/halink-c5/public/theme/css/style.css`
> (114 KB) và từ `js/floorplan.css` của trang VR. Không còn màu suy đoán.
> Figma vẫn chưa đọc được nhưng **không còn là blocker** — site chính là nguồn chuẩn.

## 2.1 Màu — nguồn gốc từ code thật

### Cách lấy

```bash
curl -sL https://suoitien.vn/halink-content/themes/halink-c5/public/theme/css/style.css \
  | grep -oE 'rgba?\([0-9., ]*\)|#[0-9a-fA-F]{6}' | sort | uniq -c | sort -rn
```

### Kết quả — tần suất thật trong CSS site chính

| Lần dùng | Giá trị | Hex | Vai trò suy ra từ selector |
|---|---|---|---|
| **54** | `rgb(18, 129, 37)` | **`#128125`** | **Xanh lá thương hiệu** — nền navbar, nền submenu, màu heading `h2` |
| 18 | `rgba(18, 19, 18, .12)` | — | Bóng chung |
| **12** | `rgb(222, 168, 0)` | **`#DEA800`** | **Vàng đồng** — nền topbar, icon home |
| **11** | `rgb(235, 0, 41)` | **`#EB0029`** | **Đỏ** — chữ nút "Mua vé" |
| 9 | `rgb(245, 61, 45)` | `#F53D2D` | Đỏ-cam phụ |
| 8 | `rgb(20, 130, 37)` | `#148225` | Xanh lá biến thể (gần như trùng `#128125`) |
| 4 | `rgb(255, 123, 1)` | `#FF7B01` | Cam |
| 4 | `rgb(214, 40, 46)` | `#D6282E` | Đỏ trong gradient viền chạy nút "Mua vé" |
| 4 | `rgb(101, 167, 35)` | `#65A723` | Xanh lá sáng (lá non) |
| 3 | `rgb(231, 49, 59)` | `#E7313B` | Đỏ — `box-shadow` dưới navbar |
| 2 | `rgba(251, 210, 85, .79)` | `#FBD255` | Vàng nhạt — nền nút "Mua vé" |

### Giải phẫu header thật (từ CSS, không phải đoán)

```css
/* Dải trên — VÀNG */
header.halink-site-header .halink-site-header-content {
  background: rgb(222, 168, 0);          /* #DEA800 */
}

/* Navbar — XANH LÁ, viên thuốc bo 50px, có ĐƯỜNG ĐỎ dưới đáy */
header.halink-site-header .container-wrapper {
  background: rgb(18, 129, 37);          /* #128125 */
  border-radius: 50px;                   /* ← pill hoàn toàn */
  width: 90%;
  top: 60px;
  box-shadow: rgb(231, 49, 59) 0px 2px 0px;   /* ← #E7313B đường đỏ 2px */
}

/* Vệt gradient ĐỎ→TRẮNG→ĐỎ dưới navbar — chi tiết nhận diện đặc trưng */
header.halink-site-header .container-wrapper::after {
  background: linear-gradient(90deg,
    rgb(217, 36, 44) 0%, rgba(255,255,255,.97) 50%, rgb(217, 36, 44) 100%);
  height: 5px; bottom: -3px; width: 49%; border-radius: 1000%;
}

/* Link nav — TRẮNG, ĐẬM, IN HOA */
.search-form-menu .halink-nav-menu a  { color: rgb(255,255,255); }
.search-form-menu .halink-nav-menu li a { font-weight: bold; }
.halink-nav-menu li { text-transform: uppercase; font-weight: normal; }

/* Gạch chân hover — gradient trắng mờ dần */
.halink-nav-menu li > a::after {
  height: 2px; width: 0;                 /* → animate ra khi hover */
  background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,.42) 50%, rgba(255,255,255,0) 100%);
  transition: all .3s;
}

/* Submenu — cùng xanh lá, chữ thường, 14px */
.halink-nav-menu ul.sub-menu {
  background: rgb(18,129,37); min-width: 240px; padding: 10px 0;
}
.halink-nav-menu ul.sub-menu a  { font-size: 14px; }
.halink-nav-menu ul.sub-menu li { text-transform: none; font-weight: normal; }

/* Nút "Mua vé" — vàng nhạt + chữ ĐỎ + 4 vệt viền CHẠY (đỏ↔xanh lá) */
a.book-now-cus {
  background: rgba(251, 210, 85, .79);   /* #FBD255 */
  color: rgb(235, 0, 41);                /* #EB0029 */
  text-transform: uppercase; font-weight: 700; font-size: 20px;
  position: fixed; bottom: 105px; right: 0;
}
a.book-now-cus span:nth-child(1) {       /* ×4 vệt, animate1..4, 2s loop */
  background: linear-gradient(to right, rgb(214,40,46), rgb(18,129,37));
  animation: 2s linear infinite animate1;
}
```

→ **Nhận diện Suối Tiên = xanh lá + vàng + đỏ**, dạng pill bo tròn, có đường đỏ
viền dưới. Rất "theme park" — tươi, gia đình, không tối giản.

### 2.1.1 Brand Green — thang từ `#128125`

`#128125` = `hsl(130, 76%, 29%)`. Cả thang giữ hue 125–135.

| Token | Hex | Ghi chú |
|---|---|---|
| `--st-green-50` | `#e9f7ec` | Nền row hover, nền chip |
| `--st-green-100` | `#c9ecd1` | Nền badge |
| `--st-green-200` | `#95d9a6` | Viền nhạt |
| `--st-green-300` | `#5cbf76` | Icon trên nền tối |
| `--st-green-400` | `#65A723` | ✅ **màu thật của site** (lá non) |
| `--st-green-500` | `#169e2c` | Hover của primary |
| `--st-green-600` | `#128125` | ✅ **PRIMARY — màu thật, dùng 54 lần** |
| `--st-green-700` | `#0e6b2e` | ✅ **màu thật của nút VR hiện tại** — dùng cho active/pressed |
| `--st-green-800` | `#0a5220` | Text trên nền green-50 |
| `--st-green-900` | `#063514` | Nền tối nhất có hue brand |

> 💡 `#0e6b2e` (nút VR hiện tại) và `#128125` (site chính) **lệch nhau nhẹ** —
> cùng hue, khác lightness. Thang trên **hợp nhất cả hai**: `#128125` làm primary,
> `#0e6b2e` thành bậc 700 (pressed). Không phải bỏ màu nào, chỉ xếp lại thứ bậc.

### 2.1.2 Brand Gold — thang từ `#DEA800`

| Token | Hex | Ghi chú |
|---|---|---|
| `--st-gold-100` | `#fef4d6` | Nền nhạt |
| `--st-gold-200` | `#fde79f` | Viền |
| `--st-gold-300` | `#FBD255` | ✅ **màu thật** — nền nút "Mua vé" |
| `--st-gold-400` | `#f0bc24` | Hover |
| `--st-gold-500` | `#DEA800` | ✅ **màu thật** — nền topbar |
| `--st-gold-600` | `#b88800` | Pressed |
| `--st-gold-icon` | `#FED12B` | ✅ **màu thật** — nền vòng tròn của icon topbar (`.list-top-nav i`) |
| `--st-gold-ink` | `#3d2c00` | Text tối trên nền vàng khi cần contrast cao |

### 2.1.3 Brand Red — thang từ `#EB0029`

| Token | Hex | Ghi chú |
|---|---|---|
| `--st-red-400` | `#F53D2D` | ✅ **màu thật** — đỏ-cam phụ |
| `--st-red-500` | `#EB0029` | ✅ **màu thật** — chữ nút "Mua vé" |
| `--st-red-600` | `#D6282E` | ✅ **màu thật** — gradient viền chạy |
| `--st-red-line` | `#E7313B` | ✅ **màu thật** — đường 2px dưới navbar |
| `--st-orange-500` | `#FF7B01` | ✅ **màu thật** — cam |

### 2.1.4 Vai trò từng màu — quy tắc dùng

Đây là phần quan trọng nhất. Site chính dùng 3 màu mạnh cùng lúc; nếu bê nguyên
sang UI đè lên panorama sẽ loạn. Phân vai rõ:

| Màu | Dùng cho | KHÔNG dùng cho |
|---|---|---|
| **Xanh lá `#128125`** | Nền navbar · nút primary · icon · chip active · text nhấn | Nền lớn phủ panorama |
| **Vàng `#DEA800` / `#FBD255`** | Nền topbar · nền nút "Mua vé"/"Mua combo" · badge `★ Nên xem` trên thẻ carousel + chip chú giải | Text (contrast kém) |
| **Đỏ `#EB0029`** | **Chỉ** chữ trên nút vé · đường viền nhận diện `#E7313B` · badge "MỚI" | Nút thường, icon thường — đỏ nhiều = báo lỗi |
| **Trắng** | Nền mọi panel/modal/dock (theo Q25 = light) | — |

**Quy tắc 3-1:** trên 1 màn hình, tối đa **1 vùng vàng** (nút vé) + **1 vùng đỏ**
(chữ trong nút vé đó). Còn lại xanh lá + trắng.

### 2.1.5 Neutral

Giữ thang slate khớp với `floorplan.css` thật (`rgb(15,23,42)`, `#1e293b`, `#cbd5e1`).

| Token | Hex | Dùng cho |
|---|---|---|
| `--st-n-0` | `#ffffff` | Nền panel, dock, modal |
| `--st-n-50` | `#f8fafc` | Nền section nhạt |
| `--st-n-100` | `#f1f5f9` | Nền input, chip off |
| `--st-n-200` | `#e2e8f0` | Border |
| `--st-n-300` | `#cbd5e1` | ✅ màu thật — scrollbar |
| `--st-n-400` | `#94a3b8` | Placeholder |
| `--st-n-500` | `#64748b` | Text phụ |
| `--st-n-600` | `#475569` | Text body phụ |
| `--st-n-700` | `#334155` | Text body |
| `--st-n-800` | `#1e293b` | ✅ màu thật — **text chính** |
| `--st-n-900` | `#0f172a` | ✅ màu thật — heading, scrim |

### 2.1.6 Bề mặt — LIGHT (Q25 = a)

Khách chọn **(a) light/airy**. Điều này khớp đúng với UI VR hiện có (ảnh 5): panel
trắng, icon xanh viền tròn, pill trắng. Nên **bỏ hướng dark-glass** ở v1.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-surface` | `#ffffff` | Nền panel/dock/modal |
| `--st-surface-blur` | `rgba(255, 255, 255, .82)` | Dock đè panorama — trắng mờ + blur |
| `--st-surface-hi` | `#ffffff` | Hover (đặc hơn) |
| `--st-surface-border` | `rgba(18, 129, 37, .14)` | Viền 1px — **có hue xanh lá**, không phải xám trung tính |
| `--st-blur` | `blur(14px) saturate(120%)` | `backdrop-filter` |
| `--st-scrim` | `rgba(6, 12, 20, .52)` | Scrim sau modal |
| `--st-scrim-blur` | `blur(8px)` | Blur panorama khi modal mở |

> Viền có hue xanh lá (`rgba(18,129,37,.14)`) thay vì xám — chi tiết nhỏ nhưng làm
> mọi bề mặt "thuộc về" hệ màu brand thay vì trông như component mặc định.

### 2.1.7 Contrast check (WCAG AA cần ≥ 4.5:1)

| Cặp | Tỉ lệ | Kết luận |
|---|---|---|
| `#ffffff` trên `--st-green-600 #128125` | ~6.1:1 | ✅ AA |
| `#ffffff` trên `--st-green-700 #0e6b2e` | ~7.4:1 | ✅ AA + AAA |
| `#ffffff` trên `--st-green-400 #65A723` | ~3.2:1 | ❌ chỉ dùng cho text ≥ 18.66px bold |
| `--st-green-600 #128125` trên `#ffffff` | ~6.1:1 | ✅ AA — **cách dùng chính** cho text/icon |
| `--st-red-500 #EB0029` trên `--st-gold-300 #FBD255` | ~4.6:1 | ✅ AA (sát ngưỡng) — đúng combo site đang dùng |
| `--st-n-900 #0f172a` trên `--st-gold-500 #DEA800` | ~9.1:1 | ✅ AAA — dùng khi cần chắc chắn |
| `#ffffff` trên `--st-gold-500 #DEA800` | ~2.3:1 | ❌ **CẤM** |
| `#ffffff` trên `--st-red-500 #EB0029` | ~4.9:1 | ✅ AA |
| `--st-n-800 #1e293b` trên `#ffffff` | ~13.9:1 | ✅ AAA |
| `--st-n-500 #64748b` trên `#ffffff` | ~4.8:1 | ✅ AA — text ≥ 14px |

**Ràng buộc cứng:**
- Trên nền vàng: dùng `--st-red-500` (đúng site) hoặc `--st-n-900`. **Không bao giờ trắng.**
- Trên nền `--st-green-400 #65A723`: chỉ text lớn bold. Text thường phải dùng `600`/`700`.
- Bề mặt trắng-mờ đè panorama: text `--st-n-800` + `text-shadow: 0 1px 0 rgba(255,255,255,.8)`
  để không bị panorama tối phía sau ăn mất.

### 2.1.8 `--st-orange-500` lên vai chính trong M2/M3 ⭐ (D-43)

Cho tới D-42, `#ff7b01` chỉ nằm trong bảng "màu phụ" và không được dùng ở đâu. Hai
overlay clone làm nó thành **màu chức năng**:

| Dùng ở | Vì sao cam chứ không phải xanh brand |
|---|---|
| `.st-rt-pin` — pin số trên bản đồ | Pin phải nổi trên nền bản đồ **xanh lá + xanh nước**. Pin xanh lá chìm nghỉm |
| `.st-pl-chip[aria-selected]` — chip lọc đang chọn | Bản gốc dùng cam; và cam phân biệt rõ với viền xanh của trạng thái hover |
| `.st-rt-logo` · `#st-rt-collapse` | Clone đúng 2 chi tiết nhận diện của bản đồ gốc |
| `.st-pc-food` — tên nhóm Ăn uống | Trong bộ 5 màu phân nhóm |

`#ff7b01` là màu **thật** của `suoitien.vn` (§2.1), không phải accent tôi chọn — nên
việc nâng vai trò không làm loãng bảng màu.

**Hai chỗ vẫn KHÔNG dùng màu bản gốc:** nút "Vị trí của tôi" và đường đi trên bản đồ,
bản gốc đều xanh dương. D-04 đã bỏ hẳn hệ xanh dương → thay bằng xanh lá brand. Đây là
lệch **có chủ đích**, ghi ở đầu `css/route.css`.

### 2.1.9 Bề mặt overlay toàn màn hình

`.st-fs-panel` (M2/M3) **không** dùng `--st-surface-blur` như `.st-modal-panel`:

| | `.st-modal-panel` | `.st-fs-panel` |
|---|---|---|
| Nền | trắng + scrim mờ phía sau | trắng đặc, **không scrim** |
| Vì sao | hộp thoại nổi trên panorama, cần thấy ngữ cảnh phía sau | overlay phủ kín — blur một thứ không nhìn thấy chỉ tốn GPU |
| Bo góc | `--st-r-xl` | không bo — nó là "trang", không phải "thẻ" |

## 2.2 Typography

### Font thật của site chính

```css
/* style.css dòng 53 */
body { font-family: "Arima Madurai", cursive; }
```

Nạp từ Google Fonts, weight `100;200;300;400;500;700`:
```
https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@100;200;300;400;500;700&display=swap
```

**Đã verify hỗ trợ tiếng Việt** — subset `vietnamese` có mặt:
`U+0102-0103, U+0110-0111, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB…`

### Vấn đề & giải pháp: font kép

`Arima Madurai` là font **display/decorative** (Google phân loại `cursive`). Nó
đẹp và đúng nhận diện cho tiêu đề, nhưng ở 13–15px cho **danh sách 158 điểm** hoặc
**chỉ dẫn từng chặng** ("Đi ~40 m rồi rẽ phải (gần j9)") thì khó đọc, nhất là chữ
Việt nhiều dấu.

Trang VR hiện tại đã dùng `Be Vietnam Pro` (`vr-360/fonts.css`) cho đúng lý do này.

**Chốt — hệ 2 font:**

```css
--st-font-display: 'Arima Madurai', 'Be Vietnam Pro', system-ui, cursive;  /* tiêu đề, nav, nút */
--st-font-ui:      'Be Vietnam Pro', -apple-system, BlinkMacSystemFont,
                   'Segoe UI', Roboto, Arial, sans-serif;                  /* body, list, form */
```

| Dùng `--st-font-display` | Dùng `--st-font-ui` |
|---|---|
| Logo wordmark | Danh sách điểm đến |
| Item navbar | Chỉ dẫn từng chặng |
| Tiêu đề modal welcome | Mô tả, blurb |
| Label nút chính (Chỉ đường, Điểm đến, Mua vé) | Input, placeholder, chip |
| Tên điểm trong scene-label | Text phụ, số liệu |
| Tiêu đề overlay | Toast |

→ Nav + heading **giống hệt site chính** (đồng bộ như khách yêu cầu), phần dày chữ
thì đọc được. Xem [`08-decisions.md`](08-decisions.md) D-26.

### Thang chữ

| Token | size / line-height / weight | Font | Dùng cho |
|---|---|---|---|
| `--st-t-display` | `clamp(26px, 4vw, 42px)` / 1.15 / 700 | display | Tiêu đề modal welcome |
| `--st-t-h1` | `clamp(22px, 3vw, 30px)` / 1.2 / 700 | display | Tiêu đề overlay |
| `--st-t-h2` | `20px` / 1.3 / 700 | display | Tiêu đề section |
| `--st-t-nav` | `15px` / 1 / 700 · `uppercase` · `ls .02em` | display | Item navbar (khớp site: bold + uppercase) |
| `--st-t-btn` | `15px` / 1 / 700 | display | Label nút chính |
| `--st-t-h3` | `16px` / 1.35 / 700 | ui | Tên điểm trong list |
| `--st-t-body` | `15px` / 1.55 / 400 | ui | Text thường |
| `--st-t-sm` | `13px` / 1.5 / 500 | ui | Text phụ, type |
| `--st-t-xs` | `11px` / 1.4 / 700 · `uppercase` · `ls .05em` | ui | Badge, chip, eyebrow |

**Cấm weight 100/200/300** — chữ Việt nhiều dấu, weight mỏng làm dấu biến mất trên
màn hình thường. Min = 400. (Site chính có nạp weight 100–300 nhưng ta không dùng.)

## 2.3 Spacing — thang 4px

```
--st-s-1: 4px   --st-s-2: 8px   --st-s-3: 12px  --st-s-4: 16px
--st-s-5: 20px  --st-s-6: 24px  --st-s-8: 32px  --st-s-10: 40px
--st-s-12: 48px --st-s-16: 64px
```

Safe area — bắt buộc cho mọi `position: fixed`:

```css
--st-sat: env(safe-area-inset-top, 0px);
--st-sab: env(safe-area-inset-bottom, 0px);
--st-sal: env(safe-area-inset-left, 0px);
--st-sar: env(safe-area-inset-right, 0px);
```

Chiều cao header — **copy đúng cấu trúc site chính**:

```css
--st-topbar-h:   90px;   /* THẬT: .header-content { height: 90px }      — dải vàng */
--st-navbar-h:   58px;   /* THẬT: .container-wrapper { height: 65% }    — pill xanh */
--st-navbar-top: 60px;   /* THẬT: .container-wrapper { top: 60px }      — navbar ĐÈ lên vàng */
--st-header-h:   calc(var(--st-navbar-top) + var(--st-navbar-h));   /* = 118px */
```

Điểm quan trọng: navbar là **pill `position: absolute`, bắt đầu ở `y=60px`** trong dải
vàng cao `90px` → nó **đè lên 30px dưới của dải vàng và tràn 28px xuống dưới**. Logo
(`112px`) căn giữa navbar nên tràn cả lên trên (vào dải vàng) và xuống dưới (ra ngoài
header). Đây là chi tiết làm header Suối Tiên khác mọi header thường — không phải
"topbar rồi tới navbar" xếp chồng.

### 2.3.1 Token VÙNG CẤM — ràng buộc hình học, không phải khoảng cách ⭐ (D-40)

Prototype được thả **đè lên** trip360 chứ không thay thế nó, nên 4 cụm control có sẵn
vẫn còn nguyên tại chỗ. Vị trí của cụm C phải né chúng. Ràng buộc đó được mã hoá thành
token để không ai gõ số tay rồi quên:

```css
--st-rz-a-h:  60px;    /* ⓐ trên-phải  — VN + chia sẻ            */
--st-rz-b-w:  244px;   /* ⓑ trái       — sidebar danh mục + lề   */
--st-rz-d-w:  340px;   /* ⓓ dưới-giữa  — pill 4 nút + lề an toàn */
--st-rz-d-h:  76px;    /* ⓓ cao pill + lề dưới                   */
--st-rz-e-w:  72px;    /* ⓔ phải-giữa  — 2 nút tròn              */

/* Trần bề ngang của cụm C trước khi chạm mép trái cụm ⓓ */
--st-c-max-w: calc(50vw - var(--st-rz-d-w) / 2 - var(--st-s-4));
```

**Khác gì với `--st-s-*`:** thang spacing là *quyết định thẩm mỹ* (nhịp 4px, đổi được
tuỳ ý). `--st-rz-*` là *sự thật đo đạc* về một hệ thống khác — đổi nó chỉ khi trip360
đổi, và phải đo lại chứ không chọn cho đẹp. Nguồn số:
[`00-requirements.md`](00-requirements.md) §0.3 + `ST.data.RESERVED_ZONES`.

> ⚠️ `--st-rz-*` (CSS) và `RESERVED_ZONES` (JS) **không tự đồng bộ**. Sửa một bên phải
> sửa bên kia. JS dùng để vẽ ghost `?zones=1`; CSS dùng để ràng buộc bố cục thật.

## 2.4 Radius

Site chính dùng `border-radius: 50px` cho navbar (pill hoàn toàn) — đây là đặc
trưng nhận diện, phải giữ.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-r-sm` | `8px` | Chip, badge |
| `--st-r-md` | `12px` | Card, input |
| `--st-r-lg` | `18px` | Thẻ carousel `.st-cr-card` · Panel, dropdown |
| `--st-r-xl` | `24px` | Modal welcome, **`#st-dock` cụm C** (cột cao thì pill trông lạ) |
| `--st-r-pill` | `999px` | ✅ Navbar, từng nút trong cụm C — **đặc trưng site** |
| `--st-r-circle` | `50%` | Nút icon tròn, nút ‹ › của carousel |

### 2.4.1 Răng cưa tấm vé — CSS mask 3 lớp ⭐ (D-41)

Hình "tấm vé" của `#st-ticket` không vẽ bằng ảnh hay SVG mà **đục** ra khỏi một hình
chữ nhật bằng `mask`. Ba lớp gradient giao nhau (`mask-composite: intersect`):

```css
.st-ticket {
  --seam:  52px;   /* vị trí đường răng cưa = width của cuống vé */
  --notch: 8px;    /* bán kính 2 khuyết tròn mép trên/dưới       */
  mask-image:
    radial-gradient(circle var(--notch) at var(--seam) 0,    transparent 99%, #000 100%),
    radial-gradient(circle var(--notch) at var(--seam) 100%, transparent 99%, #000 100%),
    radial-gradient(circle 2.5px        at var(--seam) 6px,  transparent 99%, #000 100%);
  mask-repeat: no-repeat, no-repeat, repeat-y;
  mask-size:   100% 100%, 100% 100%, 100% 12px;
  mask-composite: intersect;
}
```

Lớp 3 dùng `repeat-y` với `mask-size` cao `12px` → sinh ra hàng lỗ tròn `r=2.5px` cách
nhau `12px` chạy dọc suốt chiều cao. Có kèm bản `-webkit-` (`-webkit-mask-composite:
source-in`) cho Safari.

**3 ràng buộc bắt buộc:**

1. `--seam` **phải** bằng `width` của `.st-ticket-stub`. Lệch một pixel là hàng lỗ không
   nằm đúng ranh giới cuống/thân vé. Đổi ở breakpoint nào thì đổi cả hai ở đó.
2. `mask` **cắt luôn `box-shadow`** → bóng phải đổ ở phần tử CHA bằng
   `filter: drop-shadow(...)`. Bù lại `drop-shadow` bám theo đúng hình đã đục lỗ, đẹp hơn
   `box-shadow` hình chữ nhật.
3. Không `border-right` cho stub / `border-left` cho main — mép giáp phải trống thì răng
   cưa mới liền, có viền là thấy vạch đôi.

Kỹ thuật lấy từ [`../design-seanote.txt`](../design-seanote.txt) §4.

## 2.5 Shadow

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-sh-sm` | `0 1px 2px rgba(18,19,18,.08), 0 1px 3px rgba(18,19,18,.10)` | Chip (dùng `rgba(18,19,18)` thật của site) |
| `--st-sh-md` | `0 2px 4px rgba(18,19,18,.06), 0 4px 12px rgba(18,19,18,.12)` | Card, dropdown |
| `--st-sh-lg` | `0 8px 24px rgba(18,19,18,.14), 0 2px 6px rgba(18,19,18,.08)` | Panel, dock |
| `--st-sh-xl` | `0 24px 64px rgba(6,12,20,.34)` | Modal welcome |
| `--st-sh-brand` | `0 2px 0 var(--st-red-line)` | ✅ **Đường đỏ dưới navbar — copy y hệt site** |
| `--st-sh-cta` | `0 4px 14px rgba(222,168,35,.45)` | Nút "Mua vé" |
| `--st-sh-focus` | `0 0 0 3px rgba(18,129,37,.40)` | Focus ring `:focus-visible` |

## 2.6 Motion

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--st-dur-fast` | `140ms` | Hover, màu |
| `--st-dur-base` | `240ms` | Toggle, slide nhỏ |
| `--st-dur-nav` | `300ms` | ✅ Gạch chân nav — **khớp `transition: all .3s` của site** |
| `--st-dur-slow` | `400ms` | Modal vào/ra, navbar thu lên |
| `--st-dur-scene` | `500ms` | Chuyển panorama |
| `--st-ease` | `cubic-bezier(.4, 0, .2, 1)` | Mặc định |
| `--st-ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Modal xuất hiện |
| `--st-ease-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | Nút morph, chấm carousel giãn thành gạch |

Animation đặc trưng lấy từ site: **4 vệt viền chạy quanh nút vé** (`animate1..4`,
2s linear infinite, gradient `#D6282E → #128125`). Tái dùng cho nút "Mua vé" +
"Mua combo vé" → nhận ra ngay là của Suối Tiên.

**Bắt buộc:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

## 2.7 Icon

- Sprite inline trong `index.html`, dùng `<use href="#i-xxx">`.
- **1 hệ duy nhất**: `stroke`, `stroke-width: 1.75`, `linecap/linejoin: round`,
  viewBox `0 0 24 24`, không `fill`.

### ⚠️ Icon phải căn theo TÂM KHỐI, không phải tâm bbox

Đây là chỗ tôi sai 2 lần liên tiếp, ghi lại để không lặp:

**Lần 1 — quên căn hẳn.** Vẽ path trong viewBox `24×24` không tự cho ra icon nằm giữa.
Đứng một mình không thấy, đặt vào **vòng tròn** (topbar `30px`, dock `40px`) là lệch rõ.

**Lần 2 — căn nhầm chỉ số.** Tôi căn theo **tâm bbox**. Sai: bbox căn giữa hoàn hảo vẫn
có thể nhìn lệch rõ, vì **khối lượng nét dồn về một phía**. Số đo thực tế:

| icon | lệch tâm BBOX | lệch TÂM KHỐI |
|---|---|---|
| `i-fa-phone` | `0.05` ✅ | **`[0.69, −1.23]`** ❌ |
| `i-fa-pin` | `0.05` ✅ | **`[0.05, 1.25]`** ❌ |
| `i-adv` | `0` ✅ | **`[0.09, −2.43]`** ❌ |

Mắt nhìn theo **khối**, không theo hộp bao. → **Chuẩn là tâm khối.**

**Ngoại lệ:** mũi tên / chevron (`i-arrow-right`, `i-chevron-*`, `i-swap`) — khối lệch là
**cố ý** vì chúng chỉ hướng. Giữ căn bbox, và script bỏ qua chúng.

**Cách làm:** `transform="translate(dx dy)"` trên `<g>` của symbol.

```bash
npm i -D playwright
node tools/check-icon-center.js     # exit 1 nếu lệch, in sẵn dx/dy cần cộng thêm
```

Script rasterize từng symbol ra canvas `256×256` rồi lấy trọng tâm pixel (có trọng số
alpha). Nó **tự quét toàn bộ `#st-icons g[id]`** — bản đầu dùng danh sách cứng nên khi
thêm bộ `i-fa-*` thì cả 8 icon lọt lưới. Ngưỡng: `|dx|, |dy| ≤ 0.25` đơn vị viewBox.

### ⚠️ Căn tâm trong symbol CHƯA ĐỦ — phải đo pixel ĐÃ RENDER

Lần 3. Script `check-icon-center.js` báo `0 lệch` nhưng icon trên trang **vẫn lệch rõ**,
vì nó chỉ đo **symbol cô lập**, không thấy được ảnh hưởng của CSS trang.

Đo pixel thật (`tools/check-icon-rendered.js` — chụp đúng cái vòng tròn rồi tính trọng
tâm pixel trắng):

```
pin=[-6.98, 0.88]   phone=[-6.87, 0.59]   mail=[-7.96, 0.89]   fb=[0.19, 0.31]
```

**Lệch −7px** = đúng nửa chiều rộng svg (15px) → icon dán vào **mép trái** vòng tròn.

**Nguyên nhân — specificity CSS:**

```css
.st-tb-ic          { display: grid; place-items: center; }   /* (0,1,0) */
.st-tb-contact span { display: inline-flex; }                /* (0,1,1) ← THẮNG */
```

`.st-tb-ic` cũng là một `<span>` nằm trong `.st-tb-contact`, nên nó **trúng luôn** rule
thứ hai. `display` bị đổi `grid → inline-flex`, `place-items` mất tác dụng (chỉ có ở
grid), svg rơi về mép trái. Icon social không dính vì nằm trong `.st-tb-social`.

**Sửa:** giới hạn ở con trực tiếp — `.st-tb-contact > li > a, .st-tb-contact > li > span`.

**Bài học:** rule kiểu `.wrapper span` rất dễ trúng phần tử con không định nhắm tới. Với
CSS đặt layout (`display`, `place-items`) phải dùng **child combinator** hoặc class riêng.

Sau khi sửa: `pin=[0.02, 0.88]`, `phone=[0.13, 0.59]`, `mail=[0.04, 0.89]`. Phần dư dọc
`0.3–0.9px` là **nhiễu ngưỡng khi rasterize icon 15px** — chạy `BIG=1` phóng 8× thì chỉ
còn `±0.3px`, tức không phải lệch thật.

### Ba tầng kiểm icon

| Công cụ | Bắt được | KHÔNG bắt được |
|---|---|---|
| mắt thường | lỗi rất lớn | lệch < 2px, lỗi ở cỡ nhỏ |
| `tools/check-icon-center.js` | tâm khối của **symbol** | lỗi do CSS trang |
| `tools/check-icon-rendered.js` | **pixel thật** người dùng thấy | (chậm, chỉ chạy vài icon mẫu) |

Chạy cả hai sau mỗi lần đụng vào icon hoặc CSS quanh icon.

### Icon đặc phải kiểm cả độ ĐỌC ĐƯỢC ở cỡ nhỏ

`i-fa-mail` bản đầu vẽ thân + nắp thành **2 mảnh sát nhau**; khe hở quá mảnh nên ở `15px`
dính thành **một cục đặc**, không còn ra hình phong bì. Sửa: vẽ 1 khối đặc rồi **khoét
chữ V bằng `fill-rule="evenodd"`** dày `~1.85` đơn vị viewBox (≈1.2px ở cỡ 15px).

→ Chi tiết âm bên trong icon đặc phải dày **≥ 1.5 đơn vị viewBox**, và luôn xem thử ở
**đúng cỡ hiển thị thật**, đừng chỉ xem lúc phóng to.

### 2.7.1 Bộ `i-fa-*` — thôi vẽ tay, TRÍCH THẲNG từ font gốc (2026-07-31)

Lần 4, và là lần cuối. Cả 3 mục trên (căn tâm khối, đo pixel, độ đọc được) đều là hệ quả
của **một sai lầm gốc: tự vẽ lại glyph FontAwesome bằng mắt**. Vẽ tay thì mãi mãi
"na ná" — khách nhìn phát ra ngay ("icon không đúng").

Site gốc phục vụ sẵn file **`fontawesome-webfont.svg`** (SVG font, FA **4.6.3**) —
trong đó mỗi `<glyph>` có `d=` là **outline thật**. Lấy thẳng cái đó thì hết cửa sai:

```
https://suoitien.vn/halink-content/themes/halink-c5/public/template/fonts/fontawesome-webfont.svg
<font-face units-per-em="1792" ascent="1536" descent="-256">
```

**Cách quy về symbol `viewBox 0 0 24 24`** (script: `tools/fa-extract.js`):

1. Lấy `d` của glyph theo codepoint (`.fa-youtube:before{content:"\f167"}` → tra `&#xf167;`).
2. Trục y của SVG font **hướng lên**, của SVG thường **hướng xuống** → phải lật.
3. Tỉ lệ **em → viewBox**: `s = 24 / 1792`. Giữ đúng tỉ lệ em là mấu chốt —
   nhờ vậy `svg { width: 15px }` cho ra glyph **to đúng bằng** `font-size: 15px` của gốc,
   không phải đoán hệ số phóng nào cả.
4. Căn giữa bằng bbox của chính path đó: `translate(12 − s·x̄, 12 + s·ȳ)`.

```html
<g id="i-fa-fb" fill="currentColor" stroke="none">
  <path transform="translate(4.94196 21.42857) scale(0.01339 -0.01339)" d="M959 1524v-264…"/>
</g>
```

⚠️ **`scale` phải giữ ≥ 5 chữ số thập phân.** Làm tròn `0.01339` → `0.013` là sai **3%**,
glyph co lại thấy được.

**Hệ quả:** phần "căn tâm khối" ở trên **không còn áp dụng cho `i-fa-*`** — glyph gốc vốn
đã cân theo em box của nhà thiết kế font; căn theo bbox là đủ và đúng. Bảng lệch tâm khối
ở §2.7 chỉ còn giá trị cho các icon **tự vẽ** (`i-gate`, `i-see`, `i-adv`…).

**Cách kiểm mới — so pixel với chính site gốc**, thay cho việc ngắm bằng mắt:

```bash
chrome --headless=new --force-device-scale-factor=4 --window-size=1440,900 \
       --screenshot=real.png https://suoitien.vn/
chrome --headless=new --force-device-scale-factor=4 --window-size=1440,900 \
       --screenshot=mine.png "file:///…/index.html?welcome=0"
# rồi crop cùng vùng + ImageChops.difference
```

Ba cái bẫy khi chụp (cả ba đều đã làm tôi tưởng có bug):

1. **`--window-size` cao ≥ 900**, chụp rồi cắt. Window thấp kích
   `@media (max-height: 520px)` → header co lại, nhìn như sai vị trí.
2. **`--virtual-time-budget` ~3000ms.** Lâu hơn thì header đã tự trượt lên (`st-nav-hidden`).
3. **Chrome headless có bề rộng window TỐI THIỂU (~500px).** Đặt `--window-size=390`
   thì **layout vẫn là 504px**, ảnh chỉ bị cắt còn 390 → tưởng cụm cờ "biến mất" ở
   mobile. Muốn test `≤599px` thì dùng `520`, và kiểm lại `innerWidth` thật bằng
   `--dump-dom` trước khi kết luận.

### 2.7.2 Asset là ẢNH BITMAP nhỏ (cờ) — fit RMS ở đúng cỡ, đừng đo ngưỡng

`i-fa-*` giải quyết được vì có file font gốc. Hai lá cờ thì **không có vector gốc** —
chỉ có `vi.png` / `en.png` **24×18**. Ở cỡ đó ảnh có **ringing**: quanh ngôi sao, kênh
green tụt xuống `0`, **thấp hơn cả nền đỏ (`37`)**.

⚠️ Hệ quả: **mọi cách đo kiểu "lọc pixel đủ vàng rồi lấy bbox / diện tích" đều sai**, và
sai có hệ thống (luôn cho ra nhỏ hơn thật). Tôi đã đo hụt bán kính sao **3 lần liên tiếp**
(`4.6 → 4.35 → 4.95`, đúng là `5.6`). Phóng ảnh lên 4–8× rồi đo cũng sai — blur làm ảnh
gốc luôn "béo" hơn vector, lệch theo hướng ngược lại.

**Cách đúng — fit RMS ở ĐÚNG cỡ hiển thị:**

1. Sinh N ứng viên (quét tham số: bán kính, tâm, bề rộng nét).
2. Render **1 CỘT**, mỗi ô đúng `24×18` CSS px, `--force-device-scale-factor=1`.
3. Chụp, cắt ô thứ `i` tại `y = i × bước`, tính RMS với file PNG gốc, lấy min.

⚠️ **Phải xếp 1 cột với bước cố định.** Bản đầu tôi xếp lưới nhiều cột rồi dò ô bằng màu
→ **thứ tự ô lệch khỏi thứ tự ứng viên**, RMS chọn ra một cấu hình mà nhìn mắt thường là
sai rõ ràng. Luôn kiểm chéo kết quả tốt nhất bằng cách render nó cạnh ảnh gốc.

**Khi RMS mất tác dụng:** cờ UK gần như pixel nào cũng là biên → RMS ~80 và **phẳng**,
không phân biệt được. Lúc đó đo **cấu trúc**: in lưới phân loại màu của `en.png` rồi đếm
bề rộng từng dải. Ra kết quả quyết định: thập đỏ `4` và trắng `6` ở **cả hai chiều**
(nét *đẳng hướng*, không phải cờ 2:1 bị bóp), và **không có chéo đỏ nào** — xem D-37.

## 2.8 Breakpoint

| Tên | Điều kiện | Thay đổi chính |
|---|---|---|
| Mobile | `≤ 599px` | Thẻ carousel `min(78vw,340px)` · footer đảo `column-reverse`, nút skip thành pill 48px · nút × thu còn 40px |
| Tablet | `600–1023px` | Topbar rút gọn · navbar 5 mục + "Thêm" · dock đầy đủ |
| Desktop | `1024–1439px` | Đầy đủ |
| Wide | `≥ 1440px` | Modal welcome `max-width: 1120px` |

Dùng `svh`/`dvh` thay `vh` (site VR thật đã dùng `100svh` — giữ nhất quán).

## 2.9 Nền của popup toàn màn (D-48)

| | Bản modal (D-46) | Bản toàn màn (D-48) |
|---|---|---|
| Lớp nền | `.st-scrim` `rgba(6,12,20,.62)` | **không có** |
| Nền popup | Panel trắng `min(94vw,1120px)` | `--st-bg: #fff` phủ kín màn |
| `backdrop-filter` | Phải đẩy sang thẻ `<iframe>` của trang cha (D-47) | Không cần |

Popup không "nổi lên trên" panorama nữa mà **thay thế hẳn nó** trong lúc mở. Vì vậy
token `--st-scrim` đã gỡ, thay bằng `--st-bg`.

### Vì sao không để trắng trơn

Một mặt phẳng trắng tinh cỡ full HD trông chết cứng, nhất là khi nó vừa thay thế một
tấm panorama đầy màu. `#st-popup` có 2 vệt `radial-gradient` cực nhạt:

```css
background:
  radial-gradient(78% 52% at 50% -8%,   var(--st-green-50)  0%, transparent 72%),
  radial-gradient(48% 42% at 104% 108%, var(--st-gold-100) 0%, transparent 74%),
  var(--st-bg);
```

Nhạt tới mức không đọc ra là "gradient" — chỉ thấy mặt phẳng bớt phẳng. Và nó dùng đúng
2 màu brand, không phải xám trung tính.

### `opacity` là thứ duy nhất được animate lúc mở

`#st-popup` và `.st-popup-inner` đều là tổ tiên của `.st-cr-stage` (mang `perspective`).
Một `transform` ở đó tạo containing block mới và làm phẳng chiều sâu 3D của thẻ trong
suốt animation — thẻ sẽ bay vào màn dẹt lét rồi mới bật thành 3D. Chỉ `scale(.98)` lúc
**đóng** là được, vì lúc đó cả màn đang mờ đi.

## 2.10 Bảng màu popup thực sự dùng

| Token | Dùng ở đâu trong popup |
|---|---|
| `--st-green-600` `#128125` | Chấm carousel đang chọn · chữ eyebrow · hover nút ‹ › |
| `--st-green-500` | Viền 3px của thẻ giữa |
| `--st-green-50` | Nền chip eyebrow "TOUR 360°" · vệt radial đỉnh màn |
| `--st-gold-300` `#FBD255` | Nền badge `★ Nên xem` + chip legend |
| `--st-gold-400` | Ring focus của thẻ carousel |
| `--st-gold-100` | Vệt radial góc dưới-phải |
| `--st-gold-500` `#DEA800` | 1/3 dải nhận diện trên đỉnh màn |
| `--st-red-500` `#EB0029` | 1/3 dải nhận diện |
| `--st-bg` `#fff` | Nền popup |
| neutral 0–900 | Chữ, nút ×, chấm chưa chọn, nút skip trên mobile |

Ba màu brand đều xuất hiện, và xuất hiện **đúng vai** như trên site chính: xanh = hành
động, vàng = nhấn mạnh nhẹ, đỏ = chỉ để nhận diện (không dùng làm nút).

## 2.11 Hai bản dùng CHUNG một nền trắng (D-54) — ⚫ trước là nền TỐI (D-50)

> **Đã đảo ngược.** Từ D-50 tới 2026-08-04, `index2.html` dùng nền `--st-n-900` +
> 2 vệt radial brand ("phòng chiếu"). Lập luận: 9 ô ảnh cạnh nhau trên nền trắng thành
> một mảng màu hỗn loạn. Khách chốt ngược lại: **hai bản là hai phương án của cùng một
> sản phẩm**, nền khác nhau làm hỏng phép so *carousel ↔ mosaic* mà khách đang cần.
> Lý do đầy đủ: [`08-decisions.md`](08-decisions.md) D-54(a).

Từ 2026-08-04, `#st-popup` (bản 1), `#st-pop2` và `.st-wall` (bản 2) đều là **một màu
`--st-bg` phẳng**, không gradient, không vệt radial.

### Vì sao bỏ cả vệt radial rất nhạt

Bản trước có `radial-gradient(… rgba(18,129,37,.05) …)` neo ở đỉnh màn. Ý định là "ấm
nhẹ"; kết quả trên màn thật là **một mảng ám xanh có mép**, và nó nằm **ngay dưới dải
brand 4px** nên mắt có sẵn một mốc trắng-chuẩn để so. Khách phát hiện ra ngay.

> **Luật rút ra:** gradient dưới 8% alpha trên một vùng phẳng lớn không đọc ra là sắc
> độ — nó đọc ra là **vết bẩn**. Muốn ấm thì đặt màu vào *phần tử* (badge, chip, nút),
> đừng đặt vào *nền*.

### Bù tương phản cho bản 2 mà không cần nền tối

Nền tối làm hai việc miễn phí mà nền trắng phải trả tiền:

| Việc | Nền tối lo | Nền trắng phải làm |
|---|---|---|
| Tách cạnh ô khỏi nền | Ảnh sáng tự cắt ra | `.st-wall-tile` cần `inset 0 0 0 1px var(--st-n-200)` — ảnh có trời/tường trắng sẽ chảy tràn vào nền nếu thiếu |
| Cho ô "lùi ra sau" khi ô khác hover | `brightness(.42)` = chìm vào nền | `brightness(.62) saturate(.72)` — `.42` trên trắng thành **8 vệt đen**, trông như lỗi tải ảnh |

### Bảng vai màu — giờ giống hệt bản 1

| Token | Vai ở bản 2 |
|---|---|
| `--st-bg` | Nền `#st-pop2` + `.st-wall` |
| `--st-n-800` | Nền ô **chưa tải xong ảnh** (chỉ còn vai này của thang tối) |
| `--st-green-700` trên `--st-green-50` | Eyebrow `SUỐI TIÊN 360` |
| `--st-n-900` / `--st-n-600` | `#st-wall-title` / `#st-wall-sub` |
| `--st-green-600/500` | Nút "Bắt đầu hành trình", "Khám phá VR 360°", hover ‹ ›, viền ô khi hover |
| `--st-gold-300` | Vòng nhấn khi hover ô · **chip nhóm đang chọn** · dòng CTA trong ô |
| `--st-n-100` / `--st-n-700` | Nút thanh công cụ `.st-wall-bar button` và `.st-p2-close` |

### Chỗ DUY NHẤT còn nền tối: slider

`.st-slider` giữ nguyên tông tối. Ở đó mỗi cảnh chiếm **gần trọn màn** — lập luận
"phòng chiếu" của D-50 vẫn đúng cho một ảnh lớn đơn lẻ, chỉ sai cho một lưới 9 ô.

Kéo theo **một ngoại lệ phải nhớ**: `.st-p2-close` sáng (`--st-n-100`) ở wall nhưng có
override về kính mờ khi `#st-pop2.st-state-slider` — nút sáng đè lên ảnh tối sẽ chói.

> Ba màu brand vẫn đúng vai như site chính: xanh = hành động, vàng = nhấn mạnh nhẹ, đỏ
> = chỉ nhận diện (dải 4px trên đỉnh, không dùng làm nút).
