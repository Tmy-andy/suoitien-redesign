> Cập nhật: 2026-08-01 (v8 — 2 nút cụm C mở M2/M3 clone; §3.16b component mới · D-43)

# 03 — Components

Spec từng thứ hiển thị trên màn hình. Modal/overlay tách riêng ở
[`04-modals.md`](04-modals.md).

Ký hiệu: 🟢 code v1 · 🟡 code nhưng mock · ⬜ v2 · ❌ bỏ · ♻️ đã có trên site, không dựng lại

---

## 3.0 Bản đồ vùng — trước vs sau

### Hiện tại (từ ảnh 5) — 5 cụm rời rạc

```
┌──────────────────────────────────────────────────────────┐
│                                            (A) VN·share  │
│  (B) sidebar                                             │
│  ┌──────────┐«                                    (E) ⛨  │
│  │ LOGO     │                                        📍  │
│  │ THAM QUAN│                                            │
│  │ ẨM THỰC  │          panorama                          │
│  │ FARM…    │                                            │
│  └──────────┘                                            │
│ (C)[Chỉ đường][Điểm đến]    (D)[VR ◎ 🔇 ⛶]              │
└──────────────────────────────────────────────────────────┘
```

Vấn đề: 5 cụm, 3 ngôn ngữ hình ảnh khác nhau (pill màu đặc · card trắng · circle
viền xanh), mắt không biết đâu là chính.

### Chốt 2026-08-01 — chỉ đụng vào cụm C (D-39 / D-40)

Bản đồ vùng ở trên là của **bản v2**, nay đã bị thu lại. Prototype **không** sắp xếp
lại 5 cụm nữa: nó chỉ (1) thêm header vào dải trên cùng đang trống, (2) thay 2 nút của
cụm C bằng 3 nút mới, (3) thêm modal welcome. 4 cụm ⓐ ⓑ ⓓ ⓔ **giữ nguyên tại chỗ**.

```
┌──────────────────────────────────────────────────────────┐
│ 📍địa chỉ  📞hotline  ✉email        🇻🇳🇬🇧 f t in ig yt   │ ← ① topbar vàng   MỚI
│  ╭────────────────────────────────────────────────────╮  │
│  │ TRANG CHỦ  GIỚI THIỆU  …  [LOGO]  …  BẢNG GIÁ  🔍 │  │ ← ② navbar xanh   MỚI
│  ╰────────────────────────────────────────────────────╯  │   (dải này TRỐNG trên
│   ▔▔▔▔▔▔ đường đỏ + vệt gradient ▔▔▔▔▔▔                 │    trip360 → được dựng)
│                                                          │
│                                     ╭───┰────────────╮   │ ← ④ THẺ VÉ COMBO MỚI
│                                     │ 🎟┃ VÉ COMBO   │   │   (dưới navbar, phải)
│  ┌──────────┐«                      ╰───┸────────────╯   │
│  │ sidebar  │                                     ⛨ 📍  │ ← ⓑ và ⓔ: KHÔNG ĐỤNG
│  │ có sẵn   │              panorama                      │
│  └──────────┘                                            │
│                                                          │
│  [⛊ Chỉ đường] [☰ Điểm đến] (⊕)                          │ ← ③ CỤM C — 2 pill RỜI
│                         ╭──────────────────╮             │   KHÔNG div nền (D-42)
│                         │ (VR)(◎)(🔇)(⛶)  │             │ ← ⓓ: KHÔNG ĐỤNG
│                         ╰──────────────────╯             │
└──────────────────────────────────────────────────────────┘
```

**Đã bỏ khỏi trang** so với bản v2: CTA vé vàng bên phải (đè cụm ⓔ — nhu cầu "mua vé" nay do thẻ vé ④ đảm nhiệm), nút `⋯` + popover
và nhóm nút VR/la bàn/âm thanh/toàn màn hình (trùng cụm ⓓ), `#st-scene-label`,
`#st-hint`, modal share (M4), modal help (M5). Code vẫn còn, xem `?full=1`.

---

## 3.1 `#st-topbar` — Dải trên 🟢

Mọi giá trị **đo bằng browser trên site gốc tại viewport 1440**, không suy đoán từ ảnh
chụp (ảnh bị scale → mọi ước lượng đều sai).

### Số đo gốc (viewport 1440) — chuẩn đối chiếu

| Phần tử | Gốc | Prototype |
|---|---|---|
| Dải vàng | `0→1440`, `y 0→90` | ✅ khớp |
| Nội dung topbar | `x 134→1307` | ✅ khớp |
| Contact `<ul>` | `y 15→55` (h 40) | ✅ khớp |
| Contact `<li>` | `y 20→50` (h 30) | ✅ khớp |
| Icon tròn | `30×30` tại `y 20` | ✅ khớp |
| Cờ | hộp `26×20` tại `y 25` (ảnh `24×18`, `box-sizing:border-box` + `border:1px`) | ✅ khớp |
| Navbar pill | `x 72→1368` (90%), `y 60→119` | ✅ khớp |
| Logo | `115×111`, `y 35→146`, **lệch tâm navbar `0px`** | ✅ `y 34→145`, lệch `0px` |
| Font topbar **và** nav | `Arima Madurai 14px / 700` | ✅ khớp mọi khung |
| Nav item | `gap 10px`, link `padding: 0 7px 0 0`, `li h=41` | ✅ khớp |

### Thông số

| Thuộc tính | Giá trị | Nguồn |
|---|---|---|
| Selector | `#st-topbar` trong `#st-header` (fixed) | |
| Chiều cao | `--st-topbar-h: 90px` | ✅ `.header-content { height: 90px }` |
| Nền | `#DEA800` đặc | ✅ `.halink-site-header-content` |
| Bề rộng nội dung | `padding: 0 30px` + `.st-topbar-in { width: 85% }` | ✅ `.navbar-wrapper{padding:0 30px}` + `.container-cus{width:85%}` |
| **Màu chữ** | **`#fff`, weight 700, 14px** | ✅ `.list-top-nav{color:rgb(255,255,255)}` + `li span{font-weight:700;font-size:14px}` |
| Vị trí nội dung | `padding-top: 15px`, `align-items: flex-start`, row `h 40` → chiếm `15–55px`; **nửa dưới dải vàng bị navbar che** | ✅ `.list-top-nav{margin-top:10px;padding:5px 0}` |
| Trái | địa chỉ đầy đủ · `1900 636 787` (`tel:`) · email (`mailto:`) | |
| **Icon: tròn VÀNG SÁNG, glyph TRẮNG** | `.st-tb-ic` — `30×30`, `border-radius:100%`, nền `--st-gold-icon #FED12B`, glyph **`15px`** `#fff` | ✅ `.list-top-nav i{background:rgb(254,209,43);border-radius:100%;width:30px;height:30px;font-size:15px}` |
| **Kiểu icon: ĐẶC** | Bộ `i-fa-*` — **outline trích thẳng từ `fontawesome-webfont.svg` 4.6.3 của site gốc**: `i-fa-pin` `i-fa-phone` `i-fa-mail` `i-fa-fb` `i-fa-tw` `i-fa-in` `i-fa-ig` `i-fa-yt`, khai báo `fill="currentColor" stroke="none"` inline | ✅ gốc dùng **FontAwesome 4.6.3** (`fa-map-marker` `f041`, `fa-phone` `f095`, `fa-envelope` `f0e0`, `fa-facebook-f` `f09a`, `fa-twitter` `f099`, `fa-linkedin` `f0e1`, `fa-instagram` `f16d`, `fa-youtube` `f167`) |
| Icon hover | `scale(1.2)` + nền `#E7313B` + `box-shadow: 0 0 4px #fff` | ✅ copy y hệt `.list-top-nav li:hover i` |
| **Cỡ glyph** | `15px` = **đúng `font-size` gốc**. Symbol dựng theo tỉ lệ em (`1792 unit = 24 viewBox`) nên `svg{width:15px}` ra đúng cỡ glyph gốc — xem [D-36](08-decisions.md) |
| Gap icon ↔ chữ | `5px` · gap giữa các mục `10px` | ✅ `.list-top-nav li{gap:5px}` · `.list-top-nav{gap:10px}` |
| Cờ | hộp `26×20` (ảnh `24×18`, viewBox `0 0 24 18`), `border: 1px solid #fff`, mờ `opacity:.4`, đang chọn `1` | ✅ `.flag-language li img` + `li.actived img` |
| Sao cờ VN | tâm `(12, 9)`, bán kính ngoài **`5.6`** (cao 56% lá cờ) | ✅ fit RMS với `vi.png` — xem D-37 |
| Cờ UK | nét **đẳng hướng**: thập đỏ `4`, trắng `6`, chéo trắng `3.6`, **không có chéo đỏ** | ✅ đo từng pixel `en.png`: đường chéo chỉ có trắng/xanh |
| **Hở cờ ↔ social** | `20px` = `#st-lang{padding:0 10px}` + gap hàng `10px` | ✅ `.list-top-nav ul{padding:10px}` áp lên `ul.flag-language` |
| Thứ tự social | `Facebook · TikTok · LinkedIn · Instagram · YouTube` | ✅ đúng thứ tự markup gốc |
| Data | `ST.data.CONTACT`, `ST.data.SOCIAL` | |

> ⚠️ **Icon nét mảnh vs icon đặc.** [`08-decisions.md`](08-decisions.md) D-16 quy định UI
> VR dùng **1 hệ nét mảnh** `stroke-width: 1.75`. Topbar là **ngoại lệ có chủ đích**: nó
> là bản clone header của site chính, mà site chính dùng FontAwesome đặc — vẽ nét mảnh
> thì nhìn khác hẳn ngay. Vì vậy có bộ `i-fa-*` riêng, **chỉ dùng trong `#st-topbar` và
> `#st-drawer`**. Dock, modal, hotspot vẫn giữ hệ nét mảnh.

> ⚠️ **Accessibility:** chữ trắng trên `#DEA800` ~2.3:1, glyph trắng trên `#FED12B` ~1.9:1
> — **fail WCAG AA**. Đây **đúng như site chính đang làm** và khách yêu cầu giống hệt nên
> giữ nguyên. Nếu sau này muốn đạt AA: đổi màu chữ sang `--st-n-900` (9.1:1), sửa 2 dòng
> trong `navbar.css`.

> ⚠️ **`fa-twitter` cho link TikTok** — site gốc gắn icon chim Twitter cho link TikTok.
> Giữ đúng như gốc theo yêu cầu "giống hệt". Muốn đúng nghĩa thì đổi `icon:'i-fa-tw'` →
> `'i-tt'` trong `data.js`.

### Responsive

| BP | Hành vi |
|---|---|
| `≥1200px` | Đầy đủ, chữ `14px` |
| `≤1200px` | **Theo đúng gốc**: giữ đủ 3 mục + giữ `.st-topbar-in{width:85%}`, thu chữ còn `11px`, **bỏ `white-space:nowrap`** ✅ `@media(max-width:1200px){.list-top-nav li span{font-size:11px}}` + gốc không set `white-space` |
| ~`1000–1100px` | Địa chỉ & hotline **xuống 2 dòng** — đúng như gốc. ⚠️ Là khuyết điểm của chính site gốc (2 dòng tràn khỏi row `40px`); clone theo yêu cầu "giống hệt". Muốn gọn: nâng ngưỡng bỏ địa chỉ ở khối `≤999px` lên `≤1199px` (sửa 1 số) |
| `≤999px` | **Quyết định riêng** (gốc từ `≤900px` bỏ hẳn header desktop, đổi sang header mobile — ngoài phạm vi): bỏ địa chỉ, topbar dùng hết bề ngang |
| `≤599px` | Topbar `66px`, chỉ hotline + cờ. Bỏ social/email/địa chỉ. Tròn `26px`, glyph `13px` (giữ tỉ lệ glyph/tròn = `15/30`), cờ `23.4×18`, `#st-lang{padding:0 8px}` |

---

## 3.2 `#st-navbar` — Navbar chính 🟢

**YC-3.** Clone chính xác giải phẫu site chính, thêm tab VR360.

### Giải phẫu (copy từ CSS thật)

| Thuộc tính | Giá trị | Nguồn |
|---|---|---|
| Selector | `#st-navbar` | — |
| **Vị trí — ĐÈ LÊN dải vàng** | `position: absolute; top: 60px` trong `#st-header` → navbar phủ `60–118px`, **tràn 28px xuống dưới** dải vàng (dải vàng chỉ cao 90px) | ✅ site: `.container-wrapper { position: absolute; top: 60px; height: 65% }` trong `.header-content { height: 90px }` |
| Chiều rộng | `width: 90%; margin: 0 auto` | ✅ site: `width: 90%` |
| Khoảng trống 2 mép | 2 nhóm menu `justify-content: center` trong nửa của mình → chừa trống ở 2 đầu pill | ✅ khớp bố cục ảnh gốc |
| ⚠️ `#st-header` phải cao tới đáy navbar | `height: calc(sat + 60 + 58)` — navbar `absolute` không cộng vào chiều cao, thiếu thì `translateY(-100%)` chỉ đẩy 90px và **navbar còn lòi ra khi ẩn** | lỗi đã gặp, đã sửa |
| `pointer-events` | `none` trên `#st-header`, `auto` trên `#st-topbar` + `#st-navbar` — dải trong suốt 28px dưới navbar không chặn kéo panorama | |
| Nền | `var(--st-green-600)` = `#128125` | ✅ site: `rgb(18,129,37)` |
| Radius | `var(--st-r-pill)` | ✅ site: `border-radius: 50px` |
| Chiều cao | `--st-navbar-h: 60px`, cách topbar `--st-navbar-gap: 10px` | ✅ site: `max-height: 70px`, navbar là pill rời |
| **KHÔNG có mũi tên ▾** | Mục có dropdown **không** hiện caret | ✅ site chính không có — dropdown vẫn mở bằng hover/click |
| Bóng | `var(--st-sh-brand)` = `0 2px 0 #E7313B` | ✅ site: `box-shadow: rgb(231,49,59) 0 2px 0` |
| Vệt gradient | `::after` — `linear-gradient(90deg, #D9242C, rgba(255,255,255,.97) 50%, #D9242C)`, `height: 5px; bottom: -3px; width: 49%; border-radius: 1000%` | ✅ copy y hệt site |
| Item | `--st-t-nav`: `15px/1`, **weight 700**, **UPPERCASE**, `color: #fff` | ✅ site: `font-weight: bold` + `text-transform: uppercase` |
| **Hover — KHÔNG có nền** | Không đổi `background` gì cả | ✅ site ghi rõ: `.search-form-menu .halink-nav-menu li a:hover { background: none; }` |
| Gạch chân hover | `::after` `height: 2px`, `width: 0 → 100%`, gradient `#fff → rgba(255,255,255,.42) → transparent`, `transition: all .3s` | ✅ copy y hệt site — **đây là phản hồi hover DUY NHẤT** |
| **Logo** | **Ở GIỮA navbar**, không phải bên trái | ✅ site chính đặt logo giữa |
| Nút search | `36×36` tròn trắng, **có bóng** `0 0 10px rgba(0,0,0,.48)`, glyph `16px` màu **`#212529`** (không phải xanh lá), hover đổi sang quầng trắng `rgba(255,255,255,.38)` | ✅ `.search-item-show i { background:#fff; padding:10px; border-radius:50px; box-shadow: rgba(0,0,0,.48) 0 0 10px }` |
| ⚠️ Search phải `position:absolute` | Nếu để trong luồng flex, nút chiếm chỗ ở nửa phải và **đẩy logo lệch trái đúng 1/2 bề rộng nút** | lỗi đã gặp, đã sửa |
| z-index | `--st-z-navbar`, dropdown `--st-z-dropdown` |

### Layout

```
╭─────────────────────────────────────────────────────────────────────────────╮
│ TRANG CHỦ GIỚI THIỆU TRẢI NGHIỆM ĐẶC BIỆT VR360⟨360°⟩ TRÒ CHƠI              │
│                        [LOGO]        DỊCH VỤ BẢNG GIÁ TIN TỨC TUYỂN DỤNG 🔍│
╰─────────────────────────────────────────────────────────────────────────────╯
```

Logo chia navbar thành 2 nửa: **5 mục trái** (Trang chủ, Giới thiệu, Trải nghiệm,
**VR360**, Trò chơi) · logo · **4 mục phải** (Dịch vụ, Bảng giá, Tin tức, Tuyển dụng)
+ search.

> Site gốc là **4 | 4**. Ta chèn thêm tab VR360 nên chia **5 | 4** để chiều rộng 2 bên
> gần bằng nhau. Nếu để 4 | 5 thì nhóm phải quá rộng, tràn ngược vào giữa và **logo đè
> lên chữ "TRÒ CHƠI"** — lỗi đã gặp và đã sửa.

| Logo | Giá trị |
|---|---|
| Src | `https://suoitien.vn/halink-content/uploads/logosuoitien.png` |
| Kích thước | `height: 111px` trong navbar cao `58px` → **tràn cả lên trên và xuống dưới** | ✅ gốc `115×111`, `y 35→146` |
| **Không shadow** | Bỏ `filter: drop-shadow` | ✅ gốc `filter: none` |
| Căn tâm | `logoCenter === navbarCenter` ở **mọi** bề rộng (đo: lệch `0px` từ 1280→1920) | ✅ gốc cũng lệch `0px` |
| Chỗ dành riêng | `.st-logo { flex: none; width: 116px }` — 2 nhóm menu không bao giờ tràn vào vùng logo |
| Lớp | `z-index: 2` — nằm trên vệt gradient `::after` của navbar |
| Fallback | `onerror` → wordmark SVG "SUỐI TIÊN" |
| Click | `href="#"` + toast (Q22 = b) |

### Tab VR360 (Q19)

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-nav-vr360` |
| Vị trí | Thứ 4, **sau "TRẢI NGHIỆM ĐẶC BIỆT"** |
| Label | `VR360` (chỉ chữ — badge `360°` đã bỏ, D-38) |
| State | `aria-current="page"` → gạch chân **đứng sẵn** (`width` 100%, dày `2.5px`, sáng hơn hover). **Không dùng nền** — giữ đúng ngôn ngữ site chính (xem hàng "Hover" ở trên) |

> Vì sao vị trí 4: (a) tab VR360 **là** một "trải nghiệm đặc biệt" → đặt cạnh nhóm
> cùng nghĩa; (b) sát logo ở giữa → vùng mắt quét đầu tiên; (c) không bị chìm ở cuối.

### Dropdown

| Thuộc tính | Giá trị |
|---|---|
| Selector | `.st-nav-dd` |
| Nền | `var(--st-green-600)` — ✅ site: submenu **cùng màu xanh** navbar (không phải trắng) |
| Min-width | `240px` — ✅ site |
| Padding | `10px 0`, item `10px` — ✅ site |
| Chữ item | `14px`, weight 400, **`text-transform: none`** — ✅ site |
| **Radius `0`, không bóng, không icon** | Khối vuông đặc — ✅ site: `.halink-nav-menu ul.sub-menu` không có `border-radius` cũng không `box-shadow`; item không có mũi tên |
| Vị trí | `top: calc(100% + 11px)` — dán ngay dưới mép pill + đường đỏ, **không hở nền vàng** |
| Hover item | **KHÔNG nền** — dùng đúng **gạch chân gradient** như nav cha (`::after`, `width: 0 → 100%`, `.3s`) ✅ giống site |
| Bù khoảng hở | `.st-nav-dd::before` phủ `10px` phía trên — nếu không, chuột đi từ nav item xuống dropdown lọt vào vùng trống 6px → `mouseleave` → dropdown đóng giữa đường |
| Mở bằng | Hover (delay-in 120ms / out 240ms) **và** click/Enter |
| Cấp 3 | "TRÒ CHƠI" có 3 nhóm × 8–14 mục → dropdown 3 cột, mỗi cột 1 nhóm có heading |
| Đóng | Esc · click ngoài · blur khỏi cây con |

Menu có dropdown: cả 7 mục (trừ "Trang chủ"). Data thật ở [`06-data.md`](06-data.md) §6.6.

### Hành vi ẩn/hiện (Q20 — **c + d**) ⭐

Khách chốt: "Khi tương tác thì ẩn đi bằng animation **thu lên trên**. Có nút **mũi
tên kép animation di chuyển xuống** để người dùng biết chỗ click mở navbar lại."

```
Trạng thái HIỆN                    Trạng thái ẨN
┌──────────────────────┐           ┌──────────────────────┐
│ topbar vàng          │           │        ╭────╮        │ ← #st-nav-peek
│ ╭──navbar xanh────╮  │  ──────>  │        │ ⌄⌄ │        │   tab nhỏ, mũi tên
│ ╰─────────────────╯  │  thu lên  │        ╰────╯        │   nhấp nhô xuống
│                      │           │                      │
│    panorama          │           │    panorama          │
```

| Thuộc tính | Giá trị |
|---|---|
| Wrapper | `#st-header` bọc cả `#st-topbar` + `#st-navbar` — **animate cùng nhau** |
| Ẩn | `transform: translateY(-100%)` + `opacity: .0`, `--st-dur-slow` `--st-ease` |
| Trigger ẩn | `pointerdown` trên `#st-viewer` (bind **capture phase** — 3DVista có thể `stopPropagation`) |
| Trigger hiện | ① click `#st-nav-peek` ② `Tab` focus vào header ③ modal/overlay mở |
| Khoá | Khi modal mở → `navHideLock = true`, không cho ẩn |
| Không auto-hiện lại | **Không** có timer 2.2s. Khách muốn có nút để mở lại → ẩn thì ẩn hẳn cho tới khi user chủ động mở. |
| ⚠️ **KHÔNG** hover-để-hiện | Đã thử "chuột vào vùng `top: 0–56px` thì hiện lại" → **nút peek không bao giờ bấm được bằng chuột**: đưa chuột tới nút là đã lọt vùng 56px, header bung ra, nút biến mất. Phát hiện khi test tự động (Playwright timeout 30s ở bước click peek). Đã bỏ. |

### `#st-nav-peek` — Tab mở lại navbar 🟢 ⭐ MỚI

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-nav-peek` |
| Vị trí | `fixed; top: 0; left: 50%; translateX(-50%)` |
| Kích thước | `56 × 26px`, `border-radius: 0 0 14px 14px` (bo 2 góc dưới — như cái tab kéo xuống) |
| Nền | `var(--st-green-600)` + viền dưới `2px var(--st-red-line)` — giữ nhận diện |
| Icon | `i-chevrons-down` (mũi tên kép ⌄⌄), `18px`, trắng |
| Animation | `@keyframes st-peek-bob`: `translateY(0) → translateY(3px) → translateY(0)`, `1.6s ease-in-out infinite` — **nhấp nhô xuống**, mời click |
| Chỉ hiện khi | Header đang ẩn (`html.st-nav-hidden`) |
| Vào/ra | `opacity` + `translateY(-100% → 0)`, `--st-dur-base`, **delay 120ms** sau khi header thu xong (không chồng animation) |
| Hover | `height: 30px`, animation dừng, icon `translateY(4px)` |
| ARIA | `<button aria-label="Mở menu" aria-expanded="false" aria-controls="st-header">` |
| Touch | `::before` phủ `56 × 44px` |

> Đây là điểm khác biệt lớn nhất so với v1 — v1 dùng fade + auto-hiện, khách muốn
> slide + nút chủ động. Cách của khách tốt hơn: không có gì "tự nhảy" trước mắt user.

---

## 3.3 `#st-dock` — CỤM C: Chỉ đường + Điểm đến 🟢 (YC-2 · D-39/D-40/D-42)

> Bản v2 (dock hợp nhất 10 phần tử ở dưới-giữa, có nền kính mờ) đã bị đảo ngược 2 lần:
> **D-40** đưa cụm về dưới-trái, **D-42** bỏ div nền và quay lại hàng ngang.
> Lý do đầy đủ ở [`08-decisions.md`](08-decisions.md).

### Vị trí & hình dạng

```
[⛊ Chỉ đường]  [☰ Điểm đến]  (⊕)
 primary        secondary     tonal — mở lại modal welcome
 xanh đặc       trắng viền    (ẩn tới khi modal đóng lần đầu)

góc DƯỚI-TRÁI, cách mép 16px · KHÔNG có div nền bọc ngoài
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-dock` |
| Vị trí | `fixed; left: calc(var(--st-s-4) + var(--st-sal)); bottom: calc(var(--st-s-5) + var(--st-sab))` |
| Hướng | `flex-direction: row` — hàng ngang, đúng bố cục gốc trip360 |
| Bề rộng | `max-width: var(--st-c-max-w)` |
| z-index | `--st-z-dock` |
| **Nền / viền / bóng** | **KHÔNG CÓ** — container trong suốt (D-42) |
| gap | `--st-s-2` `8px` |

**Vì sao bỏ div nền (D-42).** Khách: *"Các nút không nằm trong cùng 1 div có nền, nhìn
ngu lắm"*. Nền bọc hợp lý khi dock có 10 phần tử — cần một bề mặt để gom lại. Nay cụm C
chỉ còn 2 nút + 1 nút tròn, bọc chúng trong tấm kính mờ tạo ra một khối chữ nhật vô
nghĩa. Quan trọng hơn: **trip360 gốc vốn là 2 pill rời, không nền** — thêm nền là tự chế
thêm bề mặt mà bản gốc không có.

Hệ quả: **mỗi nút tự mang bóng**. Không có bóng thì pill trắng đặt trên panorama sáng
sẽ mất mép.

**Vì sao hàng ngang lại vừa (đảo phần "xếp dọc" của D-40).** D-40 chọn cột vì 3 nhãn
cần ~450px (VI) / ~500px (EN) mà trần ở 1280px chỉ 454px. Nút combo đã tách ra thành
thẻ vé riêng (§3.3b), nên giờ:

| | Bề ngang cần | Trần ở 1280px |
|---|---|---|
| VI | ≈ 304px | 454px ✓ |
| EN | ≈ 342px | 454px ✓ |

**Ràng buộc vùng cấm** (`tokens.css`, không gõ số tay):

```css
--st-rz-d-w:  340px;                                    /* bề ngang cụm ⓓ + lề */
--st-c-max-w: calc(50vw - var(--st-rz-d-w)/2 - 16px);   /* trần của #st-dock */
```

### Danh sách nút

| # | ID | Icon | Label VI / EN | Variant | Hành động | TT |
|---|---|---|---|---|---|---|
| 1 | `#st-btn-route` | `i-route` | Chỉ đường / Directions | **primary** | `existing:route` → M7 giữ chỗ (♻️ bản thật gọi handler `#fp-launch`) | 🟢 |
| 2 | `#st-btn-places` | `i-list` | Điểm đến / Destinations | **secondary** | `existing:places` → M7 giữ chỗ (♻️ `#fp-list-launch`) | 🟢 |
| 3 | `#st-welcome-reopen` | `i-map` | (icon only) | **tonal** | Mở lại modal welcome (Q12 / D-29) — **ẩn** tới khi modal đóng lần đầu | 🟢 |

> Mục 3 không phải "nút thứ 3" trong nghĩa deliverable: nó là affordance của **chính
> modal welcome** (modal morph co về nó khi đóng). Bỏ nó thì bỏ luôn hành vi morph.

### Style từng variant

| Variant | Nền | Chữ / Icon | Kích thước | Bóng riêng |
|---|---|---|---|---|
| `primary` | `--st-green-600` `#128125` | `#fff` | cao `46px`, padding `0 17px`, pill | `0 1px 2px rgba(10,82,32,.28)`, `0 6px 16px rgba(18,129,37,.32)` |
| `secondary` | `#fff`, viền `1.5px --st-green-200` (hover → `--st-green-600`) | `--st-green-700`, icon `--st-green-600` | cao `46px`, padding `0 16px`, pill | `0 1px 2px` + `0 6px 16px rgba(18,19,18,…)` |
| `tonal` | `#fff`, viền `1.5px --st-green-200` | `--st-green-700` | `46×46px` **circle** | như secondary |

**Nút tonal đổi màu (D-42):** trước là nền `--st-green-50`. Nền xanh rất nhạt hợp lý khi
nằm trong tấm kính mờ; đứng rời trên panorama thì trông như vết bẩn → đổi sang
**trắng + viền xanh**, đúng ngôn ngữ của cụm ⓓ có sẵn.

**Bỏ hẳn `#1769ff`** (D-04). Hierarchy: đặc > viền > tròn nhỏ.
Touch target `::before` luôn phủ tối thiểu `44px`.

### Responsive

| BP | Hành vi | Vì sao |
|---|---|---|
| `≥1100px` | hàng ngang, `bottom: 20px` | đứng cạnh cụm ⓓ; trần ở 1099px còn 364px, EN cần 342px |
| `≤1099px` | `bottom: 20px + var(--st-rz-d-h)` → **leo lên trên cụm ⓓ** | trần tụt dưới 342px, không đứng cạnh được nữa. Trên cụm ⓓ thì full bề ngang |
| `≤899px` | tắt tooltip `data-tip` | không có hover trên cảm ứng |
| `≤380px` | padding `0 13/12px`, chữ `13.5px`, **GIỮ nhãn** | bản v2 bỏ hẳn chữ vì có 10 phần tử; giờ 2 nút thì không cần — mà mất chữ là mất nghĩa |
| `height ≤460px` | nút `40px`, `bottom: 12px` | máy xoay ngang thiếu chiều cao |

### Kiểm chứng không đè lên UI có sẵn

`index.html?zones=1` vẽ ghost 4 cụm ⓐ ⓑ ⓓ ⓔ theo số đo lấy từ ảnh khách gửi
(`ST.data.RESERVED_ZONES`). Mặc định **TẮT**. Ghost xám = vùng cấm cứng; ghost vàng =
vùng cấm **mềm** (cụm ⓐ, xem D-40 và Q-35).

---

## 3.3b `#st-ticket` — Thẻ vé combo 🟢 ⭐ MỚI (D-41)

> Khách: *"Nút xem combo nằm riêng, thiết kế theo dạng hình ticket […] không cần stamp,
> chỉ cần thẻ, nhỏ gọn chút, click vào vé là chuyển luôn chứ không cần nút bấm trong
> ticket. Ticket sẽ nằm dưới navbar, phía bên phải. Lâu lâu nhảy một cái gây sự chú ý."*

Rút gọn từ `.j-seanote` — xem [`../design-seanote.txt`](../design-seanote.txt).

```
    ╭─────┰────────────────────────╮
    │  🎟 ┃ VÉ COMBO               │   ← eyebrow, đỏ, uppercase
    │  VÉ ┃ Xem combo trò chơi   → │   ← title + mũi tên (KHÔNG phải nút)
    ╰─────┸────────────────────────╯
      ↑cuống  ↑răng cưa đục lỗ
       52px    --seam = 52px
```

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-ticket-wrap` › `a#st-ticket` › `span.st-ticket` › `.st-ticket-stub` + `.st-ticket-main` |
| Vị trí | `fixed; right: calc(var(--st-s-4) + var(--st-sar)); top: calc(var(--st-sat) + var(--st-header-h) + var(--st-s-3))` |
| z-index | `--st-z-cta` |
| Cao | `62px` (bản gốc `.j-seanote` ~92px — "nhỏ gọn chút") |
| Radius | `--st-r-md` `12px` |
| `--seam` | `52px` desktop · `44px` ở `≤599px` |
| `--notch` | `8px` desktop · `7px` ở `≤599px` |

### Lấy gì / bỏ gì so với `.j-seanote`

| Bản gốc | Ở đây |
|---|---|
| Thân trắng + cuống trái + răng cưa + 2 khuyết tròn | ✅ giữ — cái làm nó ra hình tấm vé |
| Răng cưa = 3 lớp CSS mask composite `intersect` (+ bản `-webkit-`) | ✅ giữ nguyên kỹ thuật |
| Con dấu đỏ "CHƯA BAO GỒM" + `stampPress` | ❌ **bỏ** — khách yêu cầu |
| `button` "Thêm vé" bên trong | ❌ **bỏ** — cả tấm vé là 1 `<a>` |
| Câu phụ `.j-seanote-sub` | ❌ bỏ — cho gọn |
| `seanoteTear` (xé vé bay đi) | ❌ bỏ — thẻ này không có state "đã xong" |
| Teal `#10A6AE` + cam `#F2671C` | ❌ đổi sang vàng-đỏ brand |
| Font `DM Mono` | ❌ `--st-t-xs` + `letter-spacing` — RULE #3 cấm thêm dependency |

### Màu — cặp vàng-đỏ của nút "Mua vé" trên `suoitien.vn`

| Phần | Token |
|---|---|
| Nền vé | `--st-surface` `#fff` |
| Viền `1.5px` | `--st-surface-border` `rgba(18,129,37,.14)` |
| Nền cuống vé | `--st-gold-100` `#fef4d6` |
| Vòng tròn icon | nền `#fff`, viền `1.5px --st-gold-200`, icon `--st-red-500` |
| Nhãn cuống | `--st-gold-600` · `8.5px` · `letter-spacing .12em` · uppercase |
| Eyebrow | `--st-red-500` · `9px` · `letter-spacing .18em` · uppercase |
| Title | `--st-n-900` · `13.5px` · `nowrap` |
| Mũi tên | `--st-green-600` · `16px`, dịch phải `3px` khi hover |

### "Lâu lâu nhảy một cái"

`@keyframes st-ticket-nudge`, chu kỳ **8s** nhưng chỉ **0.9s cuối** có chuyển động →
phần lớn thời gian thẻ đứng yên, không thành thứ nhấp nháy gây khó chịu. Nảy 2 nhịp
giảm dần (`−7px → 0 → −3px → 0`) cho giống vật thể có quán tính.
Dừng khi `hover` (đang định bấm thì đừng nhảy) và khi `prefers-reduced-motion`.

### 3 cái bẫy kỹ thuật

1. **`mask` cắt luôn `box-shadow`.** Phải tách 2 lớp: `<a>` ngoài giữ
   `filter: drop-shadow(...)`, `<span class="st-ticket">` trong giữ mask. `drop-shadow`
   bám theo đúng hình vé đã đục lỗ — đẹp hơn `box-shadow` hình chữ nhật.
2. **`--seam` PHẢI bằng `width` của `.st-ticket-stub`**, cả desktop lẫn mobile. Lệch là
   hàng lỗ đục không nằm đúng ranh giới cuống/thân vé.
3. **Không thêm `border-right` cho stub / `border-left` cho main.** Mép giáp phải trống
   thì răng cưa mới liền; có viền là thấy vạch đôi.

### Responsive & hành vi

| Điều kiện | Hành vi |
|---|---|
| `≥600px` | đầy đủ, `--seam: 52px` |
| `≤599px` | `--seam: 44px`, ẩn nhãn cuống (còn icon), title `12.5px` |
| `height ≤460px` | thu lề trên |
| header trượt lên (`html.st-nav-hidden` / `html.st-no-nav`) | thẻ đi theo nhưng **dừng dưới cụm ⓐ**: `top: var(--st-rz-a-h) + 12px` |
| `?full=1` | **không render** — bản v2 đã có CTA vé riêng, dựng cả 2 là thừa |

---

## 3.4 `#st-welcome-reopen` — Nút mở lại modal 🟢 ⭐ MỚI (Q12)

Khách: *"lúc tắt thì nó sẽ thu nhỏ thành 1 nút cạnh 2 nút điểm đến kia. Bấm vào thì
mở lên lại"*.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-welcome-reopen` |
| Vị trí | Phần tử thứ 3 trong `#st-dock`, ngay sau "Điểm đến" |
| Variant | `tonal` — `44×44px` circle, nền `--st-green-50`, icon `i-map` `--st-green-700` |
| Tooltip | "Chọn điểm bắt đầu" |
| Hiện khi | Modal welcome **đã từng mở và đã đóng**. Chưa đóng lần nào thì nút chưa tồn tại. |
| Animation xuất hiện | **Morph từ modal** — xem [`04-modals.md`](04-modals.md) §4.3.8 |
| Badge | Dot vàng `8px` góc trên-phải, `stpulse` 3 lần rồi tắt — nhắc "còn cái này nữa" |
| ARIA | `aria-label="Mở lại bản đồ chọn điểm"`, `aria-haspopup="dialog"` |

### Animation morph (chi tiết)

Đây là chi tiết "wow" — modal không biến mất mà **co về đúng cái nút**:

```
Đóng:  modal panel  →  scale + translate về rect của #st-welcome-reopen
       (dùng FLIP: đo rect nút, set transform-origin, animate 400ms --st-ease-out)
       modal opacity 1→0 ở 60% cuối · nút opacity 0→1 ở 40% cuối

Mở:    ngược lại — nút scale-up bung thành panel
```

Fallback `prefers-reduced-motion`: chỉ fade, không morph.

---

## 3.5 `#st-cta-tickets` — Cụm CTA vé 🟢

> ⛔ **NGOÀI PHẠM VI từ 2026-08-01 (D-39)** — nằm đúng chỗ cụm ⓔ (2 nút tròn phải-giữa) của trip360 → đè lên. Nhu cầu "mua combo" nay do thẻ vé `#st-ticket` (§3.3b) đảm nhiệm.
> Code + docs giữ nguyên để trace; xem lại bằng `index.html?full=1`.


Q17 = "Có" + có link đặt vé. Q16 = thêm "Mua combo vé".

Site chính có **3 nút vàng nổi dọc bên phải** (SẢN PHẨM FARM · BẢN ĐỒ · MUA VÉ) —
clone ngôn ngữ đó, rút còn 2 nút liên quan tới trang VR.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-cta-tickets` (wrapper), `.st-cta` (item) |
| Vị trí desktop | `fixed; right: 0; bottom: 22%`, xếp dọc, `gap: 6px` |
| Vị trí mobile | Dời vào `#st-topbar` thành 1 nút nhỏ (bottom-right đè dock) |
| Nền | `var(--st-gold-300)` `rgba(251,210,85,.9)` — ✅ site: `rgba(251,210,85,.79)` |
| Chữ | `var(--st-red-500)` `#EB0029`, **UPPERCASE**, weight 700 — ✅ site |
| Radius | `--st-r-md` bên trái, `0` bên phải (dán mép màn hình) — ✅ site |
| Bóng | `--st-sh-cta` |
| Viền chạy | 4 `<span>` animate gradient `#D6282E → #128125`, `2s linear infinite`, lệch pha `0s/1s` — ✅ **copy `animate1..4` của site** |

| Nút | Icon | Label | Link |
|---|---|---|---|
| `#st-cta-ticket` | `i-ticket` | MUA VÉ | `https://suoitien.vn/chon-ve` |
| `#st-cta-combo` | `i-combo` | MUA COMBO | `https://suoitien.vn/combo-tro-choi` *(chờ Q-32)* |

> Đây là **vùng vàng + đỏ duy nhất** trên màn hình (quy tắc 3-1 ở
> [`02-design-system.md`](02-design-system.md) §2.1.4) → luôn nổi nhất, không cần
> phóng to hay nhấp nháy quá.

---

## 3.6 `#st-scene-label` — Tên điểm hiện tại 🟢

> ⛔ **NGOÀI PHẠM VI từ 2026-08-01 (D-39)** — là thành phần THÊM MỚI vào trang, không nằm trong 3 khối khách chốt.
> Code + docs giữ nguyên để trace; xem lại bằng `index.html?full=1`.


Trang VR hiện tại **không có** → user nhảy 3–4 điểm là mất phương hướng (D-15).

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-scene-label` |
| Vị trí | `fixed; left: calc(var(--st-s-4) + var(--st-sal)); bottom: calc(var(--st-s-5) + var(--st-sab))` |
| Nội dung | Chip phân loại + tên điểm + `4/158` |
| Nền | `var(--st-surface-blur)` + blur, viền `--st-surface-border`, `--st-r-pill`, padding `8px 14px` |
| Chip | `--st-t-xs`, nền `--st-green-50`, chữ `--st-green-800` |
| Tên | `--st-font-display`, `15px`, weight 700, `--st-n-800` |
| Số | `--st-t-sm`, `--st-n-500` |
| Cập nhật | `store.on('scene:change')` |
| Animation | fade out 120ms → đổi text → slide up 6px + fade in 240ms |
| Responsive | `≤599px`: `bottom: calc(dock-h + 12px)` để không đè dock |
| ARIA | `aria-live="polite"` |

---

## 3.7 `#st-hint` — Hint kéo xem 360° 🟢

> ⛔ **NGOÀI PHẠM VI từ 2026-08-01 (D-39)** — là thành phần THÊM MỚI vào trang, không nằm trong 3 khối khách chốt.
> Code + docs giữ nguyên để trace; xem lại bằng `index.html?full=1`.


| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-hint` |
| Vị trí | Giữa màn hình, `--st-z-hint` |
| Nội dung | Icon bàn tay + "Kéo để xem toàn cảnh 360°" / EN "Drag to look around" |
| Nền | `var(--st-surface-blur)` + blur, pill |
| Hiện | Sau khi modal welcome đóng + 600ms |
| Ẩn | User drag lần đầu · hoặc tự ẩn sau 4s |
| Chỉ 1 lần | `localStorage['st.hint.seen']` |
| Animation | Bàn tay dịch ngang ±14px, loop 2 lần rồi dừng |

---

## 3.8 `.st-hotspot` — Hotspot trên bản đồ 🟢

Dùng trong `#st-welcome`. Chi tiết bản đồ ở [`04-modals.md`](04-modals.md) §4.3.

| State | Style |
|---|---|
| Bình thường | `38px` circle, nền `#fff`, viền `2.5px --st-green-600`, icon `--st-green-600` `20px`, `--st-sh-md` |
| "Top" (Q9 — hint nhẹ) | Ring ngoài `--st-gold-400`, `stpulse` `2.4s infinite` + nhãn nhỏ "nên xem" hiện khi hover. **Không** số thứ tự, **không** huy chương |
| Hover / focus | `scale(1.16)`, nền `--st-green-600`, icon `#fff`, hiện **mini-card** (§3.9) |
| Active (đang click) | `scale(1.28)` rồi fade → nhảy scene |
| Touch target | `::before` phủ `44×44px` trong suốt |

> Đảo màu khi hover (trắng→xanh) thay vì chỉ scale → phản hồi rõ hơn nhiều trên
> bản đồ nhiều chi tiết.

---

## 3.9 `.st-hotspot-card` — Mini-card khi hover 🟢 ⭐ MỚI

Bù cho việc bỏ preview panel (Q10 = a, nhảy thẳng). Vẫn "nói về tour" mà **không
thêm click nào**.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `.st-hotspot-card` |
| Trigger | `mouseenter` / `focus` trên `.st-hotspot` (desktop) · `≤899px`: bỏ hẳn, chỉ tooltip tên |
| Vị trí | Neo trên hotspot, `bottom: 100% + 10px`, tự flip xuống nếu sát mép trên |
| Nội dung | Chip phân loại · tên điểm (`--st-t-h3`) · 1 câu blurb (`--st-t-sm`, max 2 dòng) · dòng mờ "Bấm để đến đây →" |
| Nền | `#fff`, `--st-r-md`, `--st-sh-md`, viền `--st-surface-border`, `width: 240px` |
| Mũi nhọn | `6px`, cùng màu nền |
| Vào/ra | `opacity` + `translateY(4px)`, `--st-dur-fast`, delay-in `140ms` (không bật khi chỉ quét chuột qua) |
| `pointer-events` | `none` — không chặn click hotspot |

---

## 3.9b `#st-welcome-list` — Danh sách 8 điểm (chỉ mobile) 🟢 ⭐ MỚI

Phát sinh khi test mobile 390×844: bản đồ landscape (tỉ lệ 1.61) trên máy dọc chỉ được
**358 × 222px**, 8 hotspot 32px chen chúc, gần như không bấm trúng — và phía dưới còn
một khoảng trống chết lớn.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-welcome-list`, item `.st-wl-item` |
| Hiện khi | **chỉ** `≤599px` (`display: none` ở breakpoint khác) |
| Vị trí | Ngay dưới bản đồ, `flex: 1 1 auto` + `overflow-y: auto` → chiếm hết chỗ trống |
| Item | Icon circle viền xanh `40px` + tên điểm + phân loại (+ "điểm nên xem") + `i-chevron-right` |
| Chiều cao item | `min-height: 56px` — thoải mái cho ngón tay |
| Item "must" | Circle có thêm ring vàng `--st-gold-200` |
| Hành động | Giống hệt hotspot: `pick()` → đóng modal (morph) → `viewer.goTo()` |
| Fade đáy | `mask-image` gradient 22px — báo còn cuộn được |
| Data | Cùng `ST.data.HOTSPOTS`, render trong `renderList()` |

> Bản đồ vẫn giữ trên mobile (để "gây ấn tượng" như YC-1 yêu cầu), danh sách chỉ là
> **đường bấm thứ hai** cho thao tác thực tế. Xem [`08-decisions.md`](08-decisions.md) D-32.

---

## 3.10 `.st-chip` — Chip phân loại 🟢

| State | Style |
|---|---|
| Off | Nền `--st-n-100`, chữ `--st-n-700`, viền `1px --st-n-200`, `--st-r-pill` |
| On | Nền `--st-green-600`, chữ `#fff` |
| Read-only (trong card) | Nền `--st-green-50`, chữ `--st-green-800`, `--st-t-xs` uppercase |

> ⚠️ Overlay "Điểm đến" thật (ảnh 4) dùng chip active **cam-đỏ**. Nếu re-skin để
> đồng bộ thì đổi sang xanh brand. Chờ khách xác nhận (§0.8 của [`00-requirements.md`](00-requirements.md)).

---

## 3.11 `#st-toast` — Thông báo 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-toast` (container), `.st-toast-item` |
| Vị trí | `fixed; top: calc(var(--st-sat) + var(--st-header-h) + 14px); left: 50%; translateX(-50%)` |
| Nền | `--st-n-900` + blur, chữ `#fff`, `--st-r-pill` |
| Biến thể | `info` (mặc định) · `warn` viền `--st-gold-500` · `success` viền `--st-green-400` |
| Vào/ra | slide down 8px + fade, `--st-dur-base` |
| Tự tắt | 2800ms |
| API | `ST.toast(key)` — nhận **key i18n**, không phải chuỗi cứng (Q4 = cần EN) |
| ARIA | `role="status" aria-live="polite"` |
| Dùng cho | Mọi nút mock + mọi link `href="#"` (Q22 = b) |

---

## 3.12 `#st-drawer` — Menu mobile 🟢

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-drawer`, trigger `#st-btn-menu` |
| Hiện khi | `≤899px` |
| Vị trí | Slide từ phải, `width: min(86vw, 360px)`, full height |
| Nền | `#fff` (đặc — menu 84 mục cần đọc được) |
| Header drawer | Nền `--st-green-600` + logo + nút × trắng |
| Nội dung | 9 mục cấp 1 (accordion 2–3 cấp) · divider · hotline · email · 5 social · cờ VI/EN · nút MUA VÉ vàng |
| Đóng | × · click scrim · Esc · swipe phải > 60px |
| A11y | `ST.a11y.trap()` |

---

## 3.13 `#st-lang` — Switch VI/EN 🟢

Q4 = cần bản EN. Q-35: bỏ cụm A của trang VR, giữ ở topbar.

| Thuộc tính | Giá trị |
|---|---|
| Selector | `#st-lang`, `.st-lang-btn[data-lang]` |
| Vị trí | `#st-topbar` phải · trong `#st-drawer` trên mobile |
| Style | 2 nút cờ `20×14px` + mã `VI`/`EN`, active có viền dưới `2px --st-n-900` |
| Hành động | `ST.i18n.set('en')` → re-render mọi text từ `COPY[lang]` |
| Lưu | `localStorage['st.lang']` |
| ARIA | `role="group" aria-label="Ngôn ngữ"`, nút có `aria-pressed` |

Cách i18n: mọi text trong DOM có `data-i18n="key"`, `ST.i18n.apply()` quét và thay.
Không dùng thư viện.

---

## 3.14 `#st-debug` — Panel debug 🟡

Chỉ khi `?debug=1`. Hiện: state hiện tại · modal đang mở · scene · **3 nút đổi biến
thể tiêu đề welcome (Q6)** · nút đổi bản đồ SVG↔thật (Q-30) · nút reset localStorage
· toggle grid 8px.

> Panel này là công cụ để khách **tự bấm chọn** biến thể ngay khi xem demo — quan
> trọng cho Q6 và Q-30.

---

## 3.15 ❌ Bỏ / ♻️ Không dựng lại

| Component | Lý do |
|---|---|
| ❌ `#st-rail` (nút phụ bên phải) | Cụm E của trang VR đã chiếm chỗ đó (ảnh 5). Không tạo cụm thứ 6. |
| ❌ Cụm A (VN + share) của trang VR | Bị header che; VI/EN dời lên topbar, share vào popover `⋯` (Q-35) |
| ~~♻️ Overlay "Chỉ đường"~~ | ✅ **ĐÃ CLONE 2026-08-01** → `#st-route` (M2), xem [`04-modals.md`](04-modals.md) §4.4 · D-43 |
| ~~♻️ Overlay "Danh sách điểm đến"~~ | ✅ **ĐÃ CLONE 2026-08-01** → `#st-places` (M3), §4.4b · D-43 |
| ♻️ Cụm D (VR/compass/sound/fullscreen) | Giữ nguyên chức năng, **gộp vào `#st-dock`** để đồng bộ vị trí + style |
| ⚠️ Cụm B (sidebar trái) | Ngoài phạm vi, nhưng **xung đột layout với header** — cần khách chốt (§0.7) |

---

## 3.16 Bảng tổng hợp — mọi phần tử tương tác

| Selector | Loại | Vùng | Hành động | TT |
|---|---|---|---|---|
| `#st-topbar` hotline | link `tel:` | topbar | gọi điện | 🟢 |
| `#st-topbar` email | link `mailto:` | topbar | mở mail | 🟢 |
| `.st-lang-btn` ×2 | toggle | topbar | đổi VI/EN | 🟢 |
| `.st-social` ×5 | link | topbar | → mạng xã hội (URL thật) | 🟢 |
| `#st-logo` | link | navbar | `#` + toast | 🟢 |
| `.st-nav-item` ×9 | link/button | navbar | `#` + toast · hoặc dropdown | 🟢 |
| `#st-nav-vr360` | link | navbar | active, không đi đâu | 🟢 |
| `.st-nav-dd-item` ×75 | link | dropdown | `#` + toast | 🟢 |
| `#st-btn-search` | button | navbar | toast "đang phát triển" | 🟡 |
| `#st-btn-menu` | button | navbar mobile | mở `#st-drawer` | 🟢 |
| `#st-nav-peek` | button | đỉnh giữa | hiện lại header | 🟢 |
| `#st-btn-route` | button | dock | mở **M2 `#st-route`** (clone) | 🟢 |
| `#st-btn-places` | button | dock | mở **M3 `#st-places`** (clone) | 🟢 |
| `#st-welcome-reopen` | button | dock | mở lại modal welcome | 🟢 |
| `#st-btn-vr` | button | dock | toast "cần thiết bị VR" | 🟡 |
| `#st-btn-gyro` | toggle | dock | toast | 🟡 |
| `#st-btn-sound` | toggle | dock | toast + đổi icon | 🟡 |
| `#st-btn-fullscreen` | toggle | dock | Fullscreen API | 🟢 |
| `#st-btn-more` | button | dock | popover 4 mục | 🟢 |
| `#st-btn-help` | button | popover | mở `#st-help` | 🟢 |
| `#st-btn-share` | button | popover | mở `#st-share` | 🟢 |
| `#st-btn-rotate` | toggle | popover | `viewer.setAutoRotate()` | 🟢 |
| `#st-cta-ticket` | link | CTA phải | → `/chon-ve` | 🟢 |
| `#st-cta-combo` | link | CTA phải | → `/combo-tro-choi` | 🟢 |
| `.st-hotspot` ×8 | button | welcome map | **nhảy scene ngay** (Q10=a) | 🟢 |
| `#st-welcome-skip` | button | welcome | đóng modal (morph về nút) | 🟢 |
| `.st-modal-close` ×N | button | mọi modal | đóng | 🟢 |
| `#st-help` checkbox | checkbox | help | localStorage | 🟢 |
| `#st-share` copy | button | share | clipboard + toast | 🟢 |

---

## 3.16b Component của M2 / M3 ⭐ MỚI (D-43)

Chi tiết bố cục ở [`04-modals.md`](04-modals.md) §4.4 / §4.4b. Bảng này chỉ để tra
selector nhanh.

| Selector | Ở đâu | Hành động | TT |
|---|---|---|---|
| `.st-fs-close` | M2 góc trên-phải · M3 trong hàng đầu | đóng overlay | 🟢 |
| `#st-rt-lang` | M2 đầu bảng trái | `ST.i18n.toggle()` | 🟢 |
| `#st-rt-collapse` | M2 đầu bảng trái | thu/mở bảng trái (`.st-rt-off`) | 🟢 |
| `#st-rt-from` / `#st-rt-to` | M2 thẻ chọn điểm | đổi tuyến → render lại | 🟢 |
| `#st-rt-swap` | M2 thẻ chọn điểm | hoán vị đi ↔ đến | 🟢 |
| `#st-rt-mine` | M2 thẻ chọn điểm | toast "đang phát triển" (MOCK) | 🟡 |
| `#st-rt-steps-toggle` | M2 bảng trái | thu/mở danh sách chỉ dẫn | 🟢 |
| `.st-rt-pin` | M2 trên bản đồ | đặt làm điểm đến | 🟢 |
| `.st-rt-pin.st-a` / `.st-b` | M2 trên bản đồ | đóng M2 + `viewer.goTo()` | 🟢 |
| `#st-rt-list` (toolbar) | M2 cạnh phải | mở M3 | 🟢 |
| `#st-rt-in` / `#st-rt-out` | M2 cạnh phải | zoom `--st-rt-z` 1 → 2.5 | 🟢 |
| `#st-rt-locate` | M2 cạnh phải | về zoom 1 | 🟢 |
| `#st-rt-split` / `#st-rt-compass` | M2 cạnh phải | toast (MOCK) | 🟡 |
| `#st-pl-search` | M3 hàng đầu | lọc bỏ dấu → **ẩn** thẻ không khớp | 🟢 |
| `#st-pl-clear` | M3 trong ô tìm kiếm | xoá + focus lại input | 🟢 |
| `.st-pl-chip` ×6 | M3 hàng chip | **làm mờ** thẻ khác nhóm | 🟢 |
| `.st-pl-card` ×20 | M3 lưới | đóng M3 + `viewer.goTo()` | 🟢 |

### Kích thước & breakpoint

| | Desktop | ≤899px | ≤599px |
|---|---|---|---|
| Bảng trái M2 | `clamp(316px, 27vw, 468px)` cạnh trái | xếp trên bản đồ, `max-height: 54dvh` | ẩn `#st-rt-lang`, nút hành động xuống 1 cột |
| Nút thu bảng M2 | hiện | **ẩn** — xếp dọc rồi thì thu gọn vô nghĩa | ẩn |
| Toolbar M2 | 44px, giữa cạnh phải | 38px | 38px |
| Lưới M3 | `auto-fill minmax(296px, 1fr)` | như desktop, lề nhỏ hơn | **1 cột** |
| Ô tìm kiếm M3 | cùng hàng với tiêu đề | xuống hàng riêng (`order: 3`) | cao 46px |
