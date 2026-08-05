> Cập nhật: 2026-08-05 (v16 — D-63: §2.2 viết lại, popup dùng MỘT font `DVN Gustavo`
> khách gửi, hết Google Fonts. v15 — D-61: hết chỗ nền tối cuối cùng, thêm cặp tonal
> xanh cho hành động phụ, chip đang chọn đổi từ vàng sang xanh brand)

# 02 — Design System

> ⚠️ **Phần lớn file này viết cho bản trước** (header, navbar, dock, thẻ vé) và giữ lại
> làm nguồn tra **màu gốc từ site chính** — phần đó vẫn đúng và vẫn là nguồn của
> `tokens.css`. **Font thì không còn lấy từ site chính nữa** (D-63): khách gửi bộ
> `DVN Gustavo` riêng, §2.2 đã viết lại theo nó. Nhưng các mục tả spec của UI đã gỡ (§2.3.1 vùng cấm, §2.4.1 răng cưa
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
| `--st-n-800` | `#1e293b` | ✅ màu thật — **text chính**; nền `.st-sld-panel` của bản 2. *(Bậc này từng bị thiếu trong `tokens.css` dù bảng đây vẫn khai là có — đã bổ sung ở D-55(g).)* |
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

### 2.2.1 Font hiện tại — DVN Gustavo, MỘT bộ cho cả trang (2026-08-05 · D-63)

Khách gửi thẳng bộ chữ thương hiệu ngày **2026-08-05**. Từ đó popup dùng **duy nhất**
`DVN Gustavo`, và **không còn `<link>` nào ra `fonts.googleapis.com`** — ngoại lệ cuối
cùng của RULE #3 đã dọn xong.

```css
/* css/tokens.css — hai token GIỮ NGUYÊN dù cùng trỏ một family */
--st-font-display: 'DVN Gustavo', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
--st-font-ui:      'DVN Gustavo', system-ui, -apple-system, BlinkMacSystemFont,
                   'Segoe UI', Roboto, Arial, sans-serif;
```

Vì sao **không gộp thành một token**: mọi component đã khai theo **vai trò** (tiêu đề /
thân), không theo tên font. Giữ hai token thì đổi font tiêu đề sau này sửa đúng một dòng;
gộp lại là vứt mất chính chỗ nối đó — và bảng "dùng token nào ở đâu" bên dưới vẫn còn
nguyên giá trị.

`cursive` ở cuối chuỗi fallback đã **bỏ**: nó có từ thời `Arima Madurai` (mặt chữ viết
tay). Gustavo là geometric grotesque — rơi vào `cursive` bây giờ là lệch hẳn tông, nên
fallback xếp toàn font hệ thống **có đủ dấu tiếng Việt**.

| Weight | File nguồn (khách gửi) | `.woff2` build | Dùng ở |
|---|---|---|---|
| 400 | `DVN - Gustavo-Regular.ttf` (192 KB) | `dvn-gustavo-400.woff2` (44 KB) | `--st-t-body` |
| 500 | `DVN - GUSTAVO - Medium.ttf` (186 KB) | `dvn-gustavo-500.woff2` (43 KB) | `--st-t-sm` |
| 700 | `DVN - Gustavo-Bold.ttf` (186 KB) | `dvn-gustavo-700.woff2` (42 KB) | display · h2 · h3 · btn · xs |

**Đã verify đủ dấu tiếng Việt** — dò toàn bộ 67 ký tự có dấu trên `cmap` của cả 3 file,
không thiếu ký tự nào (529–544 glyph/file).

### 2.2.2 `css/fonts.css` — ba điều dễ làm sai

1. **Cả 3 file khai CÙNG một `font-family`**, phân biệt bằng `font-weight`. Nếu khai
   theo tên nội bộ của từng file (`DVN - Gustavo`, `DVN - Gustavo Med`) thì
   `font: 700 20px/1.3 var(--st-font-display)` không tìm ra Bold mà để trình duyệt
   **bôi đậm giả** bản Regular — dày lệch, mất hết đường cong riêng.
2. **`.ttf` gốc ở lại repo làm master**, bản chạy chỉ nạp `.woff2`. Sinh lại:
   ```bash
   python -c "from fontTools.ttLib import TTFont; f=TTFont('in.ttf'); f.flavor='woff2'; f.save('out.woff2')"
   ```
   (cần `fonttools` + `brotli`, đây là **công cụ dev** như `tools/` — bản chạy vẫn thuần).
3. **`font-synthesis: none`** trên `body`. Bộ chỉ có 3 weight và **không có italic**;
   một `<b>`/`<em>` lọt vào từ nội dung động sẽ bị tổng hợp giả, và chữ giả đứng cạnh
   chữ thật trong cùng một thẻ thì lộ ngay.

**Preload** (`index.html`): chỉ **400 + 700**. 500 cố ý không preload — trên wall nó chỉ
dính `.st-wt-sub`, thứ vẫn đang `opacity: 0` cho tới khi rê vào ô; các chỗ còn lại
(slider, bản đồ 2D) đều ở màn sau. Không đáng giành băng thông với 11 ảnh banner đang
tải cùng lúc; `font-display: swap` lo nốt.

### 2.2.3 ⚫ FONT CŨ — hệ 2 font Arima Madurai + Be Vietnam Pro (D-23), gỡ 2026-08-05

**Chép nguyên văn để dựng lại được mà không cần đào git.** Đây là toàn bộ những gì D-63
đã xoá — không thiếu dòng nào.

`index.html`, ngay trên `<link rel="stylesheet" href="css/tokens.css">`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@400;500;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap">
```

`css/tokens.css`:

```css
--st-font-display: 'Arima Madurai','Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',cursive;
--st-font-ui:      'Be Vietnam Pro',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
```

**Quay lại thì làm 3 việc:** chép 2 khối trên vào đúng chỗ · xoá `<link rel="preload">`
font + `<link>` `css/fonts.css` · bỏ `font-synthesis: none` (Arima/Be Vietnam Pro có bản
nghiêng thật, chặn tổng hợp không còn lý do).

Bản git đầy đủ ngay trước khi gỡ: **`e5a17de`** (2026-08-05) — `git show e5a17de:index.html`.

⚠️ **Thang chữ không quay lại được y nguyên.** Từ D-63 `tokens.css` chỉ còn khai weight
**400 · 500 · 700**; hệ cũ nạp thêm `800` cho Arima và `600` cho Be Vietnam Pro. Hai
weight đó **không có bậc nào trong `tokens.css` gọi tới** — chúng nằm trong URL từ thời
navbar/topbar (đã gỡ ở D-46) chứ không phải đang được dùng. Dựng lại thì cứ để nguyên
URL trên, đừng tưởng có chỗ nào đang thiếu weight.

#### Vì sao từng làm vậy, và vì sao hết đúng

Site chính khai `body { font-family: "Arima Madurai", cursive }` (`style.css` dòng 53),
nạp từ Google Fonts. Vì Arima là font **display/decorative**, popup ghép nó với
`Be Vietnam Pro` cho phần thân chữ — đúng cách trang VR đang làm (`vr-360/fonts.css`).

Hết hiệu lực khi khách gửi font riêng: một bộ chữ phủ cả trang thì không còn chỗ cho font
thứ hai, và nỗi lo "font display khó đọc ở 13–15px" cũng tan theo — danh sách 158 điểm
lẫn chỉ dẫn từng chặng đều đã bị gỡ từ D-46/D-57, chữ trong popup giờ toàn **nhãn ngắn**.
Xem [`08-decisions.md`](08-decisions.md) D-63.

### 2.2.4 Bảng vai trò — token nào cho chỗ nào

Vẫn áp dụng nguyên vẹn, chỉ khác là hai token hiện cùng trỏ `DVN Gustavo`:

| Dùng `--st-font-display` | Dùng `--st-font-ui` |
|---|---|
| Tiêu đề wall, tiêu đề bản đồ 2D | Mô tả, blurb |
| Tên ô wall, tên điểm trong slider | Input, placeholder, chip |
| Label nút chính | Text phụ, số liệu, badge |

### Thang chữ

| Token | size / line-height / weight | Font | Dùng cho |
|---|---|---|---|
| `--st-t-display` | `clamp(25px, 3.6vw, 41px)` / 1.14 / 700 | display | Tiêu đề wall, tên điểm trong slider |
| ~~`--st-t-h1`~~ | | | ⚫ không còn trong `tokens.css` — overlay đã gỡ từ D-46 |
| `--st-t-h2` | `20px` / 1.3 / 700 | display | Tên ô wall, tiêu đề bản đồ |
| `--st-t-h3` | `17px` / 1.32 / 700 | display | Tên điểm trong thẻ bản đồ 2D |
| ~~`--st-t-nav`~~ | | | ⚫ không còn — navbar đã gỡ từ D-46 |
| `--st-t-btn` | `15px` / 1 / 700 | display | Label nút chính |
| `--st-t-body` | `15px` / 1.55 / 400 | ui | Text thường |
| `--st-t-sm` | `13px` / 1.5 / 500 | ui | Text phụ, chip, bộ đếm |
| `--st-t-xs` | `11px` / 1.4 / 700 | ui | Badge, eyebrow (`uppercase` + `letter-spacing` khai tại chỗ dùng) |

> ⚠️ **`--st-t-h3` từng được khai ở BẢNG NÀY mà KHÔNG có trong `tokens.css`** — đúng
> họ với `--st-n-800` (D-55(g)). `css/map2d.css` gọi `font: var(--st-t-h3)`; shorthand
> `font` có một var không tồn tại thì **cả khai báo hỏng**, lặng lẽ rơi về font thừa kế.
> Tên điểm trong thẻ bản đồ hiện bằng đúng cỡ chữ body suốt từ D-51 mà không ai đoán ra
> là bug. Đã thêm ở D-58 — và lần này **bằng font display**, khớp `--st-t-h2` ngay trên nó.
>
> **Bài học lặp lại lần hai:** bảng token trong docs mà đi trước `tokens.css` thì nó
> không phải tài liệu nữa, nó là bẫy. Sửa token là phải mở **cả hai** file cùng lượt.

**Chỉ có đúng 3 weight: 400 · 500 · 700.** Thang chữ trên đây khớp sẵn, đừng khai
weight nào khác — `600` chẳng hạn sẽ không tồn tại và bị `font-synthesis: none` chặn
tổng hợp, kết quả là rơi về 500 chứ không đậm lên.

Luật cũ **cấm weight 100/200/300** giờ tự thoả (bộ không có), nhưng lý do vẫn cần nhớ
cho font sau này: chữ Việt nhiều dấu, weight mỏng làm **dấu biến mất** trên màn hình
thường. Min = 400.

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
| `--st-ease-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | Nút morph, chấm carousel giãn thành gạch, nút × pop vào |
| ~~`--st-ease-flow`~~ | `cubic-bezier(.32, .04, .12, 1)` | ⚫ **ĐÃ GỠ (D-57)** — xem dưới |

### ⚫ `--st-ease-flow` — vì sao từng có, và vì sao gỡ (D-55 → D-57)

`--st-ease-out` là expo-out: **80% quãng đường xong trong 25% thời gian**. Ở quãng
ngắn (một nút nảy lên, một panel trượt 20px) đó là "nhanh nhẹn". Nhưng thẻ carousel đi
một quãng dài bằng **cả bề ngang của chính nó** — ở quãng đó cùng đường cong ấy đọc ra
là *giật rồi trôi*. `--st-ease-flow` vào chậm, ra chậm, nhanh ở giữa.

**Gỡ ở D-57** cùng buổi gỡ carousel: không còn thứ nào trong project đi quãng dài đó.
Panel slider trượt gần trọn màn nhưng dùng `--st-ease-out` 620ms và **đọc đúng** — vì
nó trượt kèm `opacity` và `scale`, mắt bám theo hai kênh kia chứ không chỉ bám vị trí.

> **Nguyên tắc rút ra cho việc dọn token:** thang (màu, spacing, radius, typography)
> **giữ đủ bậc kể cả bậc chưa ai dùng** — thang thiếu bậc đã đẻ ra hai bug im lặng
> (`--st-n-800` ở D-55, `--st-t-h3` ở D-58). Còn một đường cong / giá trị đặt **riêng
> cho một component** thì chết theo component đó.

### Dàn nhịp VÀO MÀN (D-55 · số mobile bổ sung ở D-58)

| Mốc | Desktop | ≤599px |
|---|---|---|
| 0 | `.st-brandline` kéo ngang từ mép trái (`scaleX 0→1`, 620ms) | như desktop |
| 100–240ms | eyebrow → title → sub, lệch 70ms | như desktop |
| 200ms+ | ô wall so le **46px + `scale(.86)`**, cách nhau **76ms** (ô cuối vào ở 900ms) | **24px + `scale(.94)`**, cách nhau **46ms**, 520ms (`st-wt-in-sm`) |
| 260ms+ | ảnh ô Ken Burns `1.18 → 1` | như desktop |
| cuối | nút × (620ms) · thanh công cụ (940ms) | thanh công cụ **520ms** |

**Vì sao mobile rút ngắn:** quãng 46px và stagger 76ms được tính cho mosaic trải ngang
cả màn desktop, nơi mắt đi từ trái sang phải. Ở mobile ô xếp dọc và **ô thứ 6 trở đi
đã nằm dưới màn** — chạy hết chuỗi mất 900ms cho những ô không ai nhìn thấy.

Ba quy tắc rút ra:

1. **Quãng đường phải ĐỦ DÀI trên nền trắng.** 14px + `scale(.97)` — nhịp cũ của bản 2
   — chạy đúng nhưng không ai nhìn ra là chuyển động. 22px cho chữ, 38–46px cho khối.
2. **Lớp fade của KHUNG phải xong sớm.** `#st-pop2` fade 400ms đè lên đúng lúc 9 ô đang
   so le, nuốt trọn nhịp bên trong → hạ xuống 320ms.
3. **`animation-fill-mode: backwards`, không phải `both`.** `forwards` giữ quyền điều
   khiển thuộc tính sau khi chạy xong — ảnh thẻ còn phải nhận transform parallax khi
   hover, ô wall còn phải nhận `scale(1.028)`. Cả hai sẽ chết cứng.

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

## 2.8 Breakpoint (viết lại ở D-58)

Toàn bộ @media nằm ở **`css/responsive2.css`** — một file duy nhất, kể cả @media của
bản đồ 2D. Chi tiết từng luật: [`09-variant2.md`](09-variant2.md) §9.5.

| Tên | Điều kiện | Thay đổi chính |
|---|---|---|
| **Rất hẹp** | `≤ 379px` | Thanh công cụ wall xếp dọc, nút "bỏ qua" dáng link |
| **Mobile** | `≤ 599px` | Header căn **trái** · hero `16/10` + ô vuông `1/1` · thanh công cụ 2 hàng (nút bản đồ thành icon vuông) · thẻ slider `78vw` · bản đồ thành **bottom sheet** |
| **Tablet + mobile ngang** | `≤ 1023px` | Wall thành **trang cuộn** 2 cột, thanh công cụ `sticky bottom` · ‹ › của slider còn 44px |
| Desktop | `1024–1599px` | Mosaic 4×3 đầy đủ, không cuộn |
| Wide | `≥ 1600px` | Grid `max-width: 1560px` cho khỏi kéo dãn |
| Landscape thấp | `max-height: 460px` + ngang | Wall **3 cột**, ẩn eyebrow + subtitle, thẻ slider bản bỏ túi |
| **Hướng màn** | `orientation: portrait` | **Trục riêng, không phải một mốc `max-width`** (D-61): thẻ slider đổi từ NGANG (ảnh trái · chữ phải) sang DỌC (ảnh trên · chữ dưới). iPad dọc 768 rộng hơn iPhone ngang 844 — chỉ `orientation` nói đúng chuyện này |
| Chạm | `hover: none` | Tắt "làm tối ô khác" và hover-transform · thêm `:active` cho mọi thứ bấm được |

**Ba trục, không phải một.** `max-width` quyết **các con số** (cỡ chữ, padding, cỡ nút);
`orientation` quyết **hướng xếp thẻ slider** (D-61); `hover: none` quyết **tương tác**.
Một laptop cảm ứng 1440px cần `:active` nhưng không cần bố cục mobile; một iPad dọc
768px rộng hơn iPhone ngang 844px nhưng cần bố cục dọc. Gộp các trục làm một là sai theo
đúng số hướng đã gộp.

**Phần JS có đọc `matchMedia`** — năm chỗ, đều là việc CSS không làm được
([`05-flows.md`](05-flows.md) §5.6): số `<img>` nạp mỗi ô · chiều cao thật của bottom
sheet · nguồn của một sự kiện con trỏ · nhịp tự chạy của slider (2,5s / 6s) · bỏ qua
`mouseenter` giả trên cảm ứng.

> ⚠️ Chuỗi điều kiện của breakpoint **Mobile + Landscape thấp** bị lặp lại ở
> `js/slider.js` (`SMALL_MQ`) vì nhịp 2,5s phục vụ đúng cái bố cục thẻ đó. Sửa một chỗ
> thì sửa cả hai — xem D-60.

Popup `position: fixed; inset: 0` nên bám đúng viewport, không dính bẫy `100vh` của
thanh công cụ trình duyệt di động — không cần `svh`/`dvh` ở đây.

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
| `--st-n-200` | Nền ô **chưa tải xong ảnh**. ⚫ Trước là `--st-n-800` — vừa sai màu (trên nền trắng, chỗ giữ ảnh phải *sáng hơn* ảnh) vừa **trỏ vào một token lúc đó chưa tồn tại**, xem D-55(g) |
| `--st-green-700` trên `--st-green-50` | Eyebrow `SUỐI TIÊN 360` |
| `--st-n-900` / `--st-n-600` | `#st-wall-title` / `#st-wall-sub` |
| `--st-green-600/500` | Nút "Bắt đầu hành trình", "Khám phá VR 360°", hover ‹ ›, viền ô khi hover, **chip nhóm đang chọn** (D-61) |
| `--st-green-50` / `--st-green-700` | Cặp "tonal xanh" cho **hành động phụ**: nút bản đồ 2D (cả `.st-wall-map` lẫn `.st-sld-map`) và chip danh mục `.st-sld-cat` (D-61) |
| `--st-gold-300` | Vòng nhấn khi hover ô · dòng CTA trong ô. ⚫ Từng là màu **chip nhóm đang chọn** — trên nền trắng nó nhạt hơn cả chip thường, đổi sang xanh brand ở D-61 |
| `--st-n-100` / `--st-n-700` | Nút thanh công cụ `.st-wall-bar button`, `.st-p2-close`, `.st-sld-back`, ô tìm, chip chưa chọn |

### ⚫ Chỗ cuối cùng còn nền tối: slider — đã hết từ D-61

Cho tới 2026-08-05, `.st-sld` giữ tông tối với lập luận "phòng chiếu" của D-50: mỗi cảnh
chiếm **gần trọn màn**, mà một ảnh lớn đơn lẻ thì nền tối tôn được — chỉ sai với một
lưới 9 ô.

Khách bác lập luận đó ở **YC-17 (điện thoại) rồi YC-18 (desktop)**: *"nhìn nền đen lệch
tông quá"*. Cả ba màn giờ cùng một nền trắng phẳng, và tiền đề của lập luận cũ cũng
không còn — mỗi cảnh **không** chiếm gần trọn màn nữa mà là một **thẻ** (D-61).

Kéo theo: `#st-pop2.st-state-slider .st-p2-close` — override về kính mờ khi vào slider
— **đã gỡ**. Nút × giờ chỉ có một dáng, cả wall lẫn slider.

> Ba màu brand vẫn đúng vai như site chính: xanh = hành động, vàng = nhấn mạnh nhẹ, đỏ
> = chỉ nhận diện (dải 4px trên đỉnh, không dùng làm nút).
