> Cập nhật: 2026-08-01 (v6 — YC-8: clone 2 overlay mở ra từ nút · D-43)

# 00 — Yêu cầu

## 0.1 Brief gốc từ khách (nguyên văn, 2026-07-30)

### YC-1 — Modal welcome + bản đồ 2D hotspot

> Tôi muốn khi vừa click vào domain vẫn mở trang vr360, nhưng ngay lập tức hiện
> popup modal kiểu "Bạn quan tâm địa điểm nào nhất" / "Bạn muốn ghé thăm nơi nào
> trước nè?" / ... rồi bên dưới tiêu đề này nọ là bản đồ 2D (mô phỏng thôi) có
> hotspot (cũng mô phỏng thôi) để click vào là nhảy đến địa điểm vr360 tương ứng
> (mô phỏng)
>
> **Mục tiêu:** Gây ấn tượng mạnh cho người dùng, trước khi trải nghiệm, nó cũng
> là trang nói cho người dùng về tour VR 360 trong 3 giây đầu.
>
> Kế đến là bố trí các Button trên giao diện trang.
>
> **Mục tiêu:** Giao diện site VR 360 chuyên nghiệp nhưng thân thiện.

### YC-2 — Re-design 2 nút "Chỉ Đường" + "Điểm đến"

> 2 nút "Chỉ Đường" và "Điểm đến" (3 hình) tôi muốn design lại cho đẹp và phù hợp
> với trang hơn. Hãy xem qua và đề xuất re-design phù hợp. Có thể thay đổi vị trí.
> Đồng thời xem xét figma để đồng bộ giao diện cho phù hợp, chủ yếu là màu chủ đạo

### YC-3 — Navbar header đồng bộ với website chính

> Trên trang vr360 sẽ có luôn phần navbar header giống như trang web để đồng bộ
> hiển thị. Clone navbar ra và thêm 1 tab vr360 vào.

### YC-4 — Deliverable

> Tôi cần bạn lên khung html css js thuần thôi để demo mẫu design prototype cho
> khách xem qua.

### YC-5 — Docs

Đã thực thi: [`../CLAUDE.md`](../CLAUDE.md) RULE #1/#2/#3 + toàn bộ `docs/`.

## 0.1b YC-6 — Chốt lại PHẠM VI (nguyên văn, 2026-08-01) ⭐ ĐÈ LÊN YC-2

> Đừng động vào những design nào ngoài Nút Chỉ Đường và Điểm đến, thêm nút dẫn đến
> trang xem combo. Còn lại ẩn hết và đùng đụng vào (giao diện bố cục
> https://suoitien.trip360.vn/ )
>
> Tôi đang cần design lại 2 nút và thêm 1 nút thôi, và 1 nút modal khi mới mở trang vr
> nữa. Còn lại hãy để nguyên đó kohnog thêm vào trang, nó sẽ cố định trên giao diện vr
> đang có sẵn luôn. THành ra design cũng đừng sử dụng khu vực đó, lúc chồng lên nó sẽ
> bị ghi đè

Và ngay sau đó, khi tôi ẩn nhầm cả header:

> Nhưng navbar vẫn giữ mà? Ở trang https://suoitien.trip360.vn/ làm gì có header đâu mà
> ẩn của tao?

**Diễn giải đã chốt.** "Ẩn hết phần còn lại" **không** phải "ẩn mọi thứ mới". Tiêu chí
là *chỗ đó trên trip360 đã có gì chưa*:

| | Được dựng? | Vì sao |
|---|---|---|
| Dải trên cùng | ✅ | trip360 **không có header** → vùng trống, navbar không đè lên gì (YC-3 còn hiệu lực) |
| Cụm ⓒ dưới-trái | ✅ | chính là 2 nút cần re-design, cộng thêm nút combo |
| Modal welcome | ✅ | lớp trên cùng, chiếm toàn màn hình có chủ đích (YC-1) |
| Cụm ⓐ ⓑ ⓓ ⓔ | ❌ | đã có control thật; dựng đè lên là **ghi đè** chúng khi ghép |

**Hệ quả với bản v2:** CTA vé vàng (đè ⓔ), nút `⋯` + popover và nhóm nút VR/la bàn/âm
thanh/toàn màn hình (trùng ⓓ), `#st-scene-label`, `#st-hint`, modal share, modal help —
**bỏ khỏi trang**. Xem [`08-decisions.md`](08-decisions.md) D-39 và D-40.

**Điểm còn hở → Q-35 (đã có sẵn từ 2026-07-30).** Header trải hết bề ngang nên **có** đè lên cụm ⓐ (VN + chia sẻ,
trên-phải). Header đã mang sẵn bộ chuyển ngôn ngữ và 5 icon social, tức nó *thay thế*
chức năng của ⓐ. Cần khách xác nhận: **khi ghép thật, ẩn cụm ⓐ gốc đi?** Nếu không thì
phải đẩy ⓐ xuống dưới header. Giả định đang dùng: **ẩn cụm ⓐ gốc**.

---

## 0.1c YC-7 — Thẻ vé combo + bỏ div nền (nguyên văn, 2026-08-01)

> 1. Nút xem combo nằm riêng, thiết kế theo dạng hình ticket. Đọc qua design-seanote.txt
> để hiểu kiểu thiết kế tôi muốn, nhưng không cần stamp, chỉ cần thẻ, nhỏ gọn chút,
> click vào vé là chuyển luôn chứ không cần nút bấm trong ticket. Ticket sẽ nằm dưới
> navbar, phía bên phải. Lâu lâu nhảy một cái gây sự chú ý.
>
> 2. Các nút không nằm trong cùng 1 div có nền, nhìn ngu lắm

**Chốt.**

| # | Chốt gì | Ở đâu |
|---|---|---|
| 1 | Nút combo **tách khỏi cụm C**, dựng thành `#st-ticket` hình tấm vé — bỏ con dấu, bỏ nút bên trong (cả vé là 1 `<a>`), nhỏ gọn hơn bản gốc, đặt **dưới navbar bên phải**, nảy nhẹ mỗi 8s | D-41 · [`03-components.md`](03-components.md) §3.3b · `css/ticket.css` |
| 2 | `#st-dock` **bỏ hẳn** `background` / `border` / `box-shadow` / `padding` — 2 pill rời, mỗi nút tự mang bóng. Kèm theo: quay lại **hàng ngang** (combo rời đi nên đủ chỗ) | D-42 · §3.3 |

**Nguồn tham chiếu mới:** [`../design-seanote.txt`](../design-seanote.txt) — mô tả đầy đủ
component `.j-seanote` của một project khác, gồm kỹ thuật răng cưa bằng CSS mask 3 lớp.
Bảng "lấy gì / bỏ gì" ở §3.3b.

---

## 0.1d YC-8 — Clone 2 overlay mở ra từ nút (nguyên văn, 2026-08-01)

Khách gửi lại 2 ảnh chụp overlay đang chạy trên trip360 (bản đồ chỉ đường có sidebar
step-by-step · danh sách điểm đến có chip lọc) kèm:

> clone cái trang mở ra bên trong nút như ảnh ấy

**Chốt.** Dựng `#st-route` (M2) và `#st-places` (M3) bám sát 2 ảnh đó. Hai nút của
cụm C đổi từ *"mở panel giữ chỗ"* sang mở 2 overlay clone này.

**Đây là ĐẢO NGƯỢC** của §0.8 và D-09v2 ("không dựng lại 2 overlay"). Lý do đầy đủ ở
D-43 — tóm tắt: kết luận cũ trả lời câu hỏi *"có nên dựng lại để DÙNG không"*, còn
khách đang hỏi *"bấm nút thì DEMO thấy gì"*.

Chi tiết: [`04-modals.md`](04-modals.md) §4.4 + §4.4b · [`08-decisions.md`](08-decisions.md) D-43.

---

## 0.2 Nguồn tham chiếu

| Nguồn | Truy cập được? | Đã khai thác được gì |
|---|---|---|
| https://suoitien.trip360.vn/ | ✅ | Source `index.htm`, `floorplan.css`, `vr-core/index.js`, `catalog.json` |
| https://suoitien.vn/ | ✅ | **`style.css` 114 KB → toàn bộ màu + font thật**, menu 84 mục với href thật, link mua vé |
| Figma proto / design | ❌ cần login | — |
| 6 ảnh khách gửi | ✅ | Toàn bộ UI hiện trạng trang VR + header site chính |

> **Figma không còn là blocker.** Site chính là nguồn chuẩn cho màu/font, và ảnh 5–6
> cho thấy hiện trạng đầy đủ. Nếu Figma có gì khác thì bổ sung sau.

## 0.3 Hiện trạng trang VR — bổ sung từ 6 ảnh khách gửi ⭐

Đây là phần **thay đổi nhiều nhất** so với v1 của tài liệu. Trước khi có ảnh, tôi
chỉ biết 2 nút FAB. Thực tế trang VR có **5 cụm control rời rạc**.

### Ảnh 1 — 2 nút cần re-design (YC-2)

```
[⛊ Chỉ đường]  [☰ Điểm đến]
   #0e6b2e        #1769ff
```
Pill bo tròn, icon trắng, chữ trắng, bóng đen. Góc dưới-trái.

### Ảnh 5 — Toàn cảnh giao diện VR hiện tại ⭐ QUAN TRỌNG NHẤT

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                    [🇻🇳 VN] [share]  │ ← trên-phải
│                                                                       │
│  ┌──────────────────┐«                                                │
│  │   [LOGO STF]     │                                                 │
│  │ 📍 THAM QUAN     │                                          (⛨)   │ ← phải-giữa
│  │ 🍽 ẨM THỰC       │                                          (📍)   │   2 nút tròn
│  │ 🌾 SUỐI TIÊN FARM│                                                 │
│  │ 🤝 DỊCH VỤ       │        [ảnh panorama 360°]                      │
│  │ 📍 VỊ TRÍ        │                                                 │
│  │ 📞 LIÊN HỆ       │                                                 │
│  └──────────────────┘                                                 │
│                                                                       │
│ [⛊ Chỉ đường][☰ Điểm đến]      ┌──────────────────────┐              │
│                                 │ (VR)(◎)(🔇)(⛶)      │ ← dưới-GIỮA  │
└─────────────────────────────────┴──────────────────────┴──────────────┘
```

| Cụm | Vị trí | Nội dung | Style |
|---|---|---|---|
| A | trên-phải | `VN` + cờ · nút share | Pill trắng, viền mảnh |
| B | trái | Card trắng: logo STF + 6 mục (THAM QUAN, ẨM THỰC, SUỐI TIÊN FARM, DỊCH VỤ, VỊ TRÍ, LIÊN HỆ) + nút `«` thu gọn | Card trắng bo `~12px`, icon xanh lá, chữ đen uppercase |
| C | dưới-trái | Chỉ đường + Điểm đến | Pill màu đặc (YC-2) |
| D | **dưới-giữa** | 4 nút: VR · compass/gyro · sound-off · fullscreen | **Pill TRẮNG, icon trong VÒNG TRÒN VIỀN XANH LÁ** |
| E | phải-giữa | 2 nút tròn trắng (xem từ trên? · vị trí) | Circle trắng |

> 🔴 **Phát hiện làm đổi kết luận:** cụm D **đã chiếm sẵn vị trí dưới-giữa**, và nó
> dùng đúng ngôn ngữ hình ảnh mà tôi đề xuất (trắng + xanh lá + circle). Nghĩa là:
> - Đề xuất "dời sang dưới-giữa" ở v1 (D-05) là **sai** — chỗ đó không trống.
> - Nhưng hướng **hợp nhất C vào D** thì đúng hơn cả: bớt được 1 cụm, và 2 nút
>   quan trọng nhất được nằm ở vị trí trung tâm cùng ngôn ngữ hình ảnh có sẵn.
> - Xem đề xuất mới ở [`03-components.md`](03-components.md) §3.3 và [`08-decisions.md`](08-decisions.md) D-05v2.

### Ảnh 2 + 3 — Overlay "Chỉ đường" (đang mở / đã thu sidebar)

Đã hoàn thiện hơn tôi tưởng rất nhiều:

| Thành phần | Chi tiết |
|---|---|
| Header sidebar | Badge `ST` gradient cam · "Bản đồ Suối Tiên" + "SUOI TIEN PARK · WAYFINDING MAP" · dropdown "Tiếng Việt" · nút `‹` thu gọn màu cam-đỏ |
| Form | ĐIỂM BẮT ĐẦU · FROM (select) → ĐIỂM ĐẾN · TO (select), có marker ⊙ xanh và ⏹ đỏ nối bằng đường dọc |
| Nút | "⇅ Đổi chiều" (outline) · "Vị trí của tôi" (nền xanh nhạt) |
| Summary | Card xanh nhạt: "Quãng đường ≈ **625 m** · Đi bộ ~ **8 phút**" + dòng EN |
| Step-by-step | Danh sách chặng, mỗi chặng có icon tròn màu (xanh xuất phát, đỏ rẽ trái/phải) + text VI + EN |
| Bản đồ | **Bản đồ 3D minh hoạ rất đẹp**, POI là pin số (1, 3, 4, 5, 22A, 200…), **màu pin phân loại**: cam · tím · đỏ · xanh dương · xám · hồng. A/B marker cho tuyến. Đường tuyến vẽ xanh dương. |
| Rail phải | 5 nút dọc: split-view · list · my-location · compass · zoom +/− |
| Thu sidebar | Sidebar biến thành tab cam nhỏ `▯ ›` dán cạnh trái |
| Nút đóng | `×` tròn xám đậm trên-phải |

**Bilingual VI + EN đã có sẵn** ở mọi label → xác nhận Q4 "cần bản EN" là khả thi
và nhất quán với hiện trạng.

### Ảnh 4 — Overlay "Danh sách điểm đến"

| Thành phần | Chi tiết |
|---|---|
| Header | "Danh sách điểm đến" + input "Tìm điểm đến…" full-width + nút `×` clear + nút `×` đóng |
| Chip filter | **Tất cả** (active, nền cam-đỏ) · Trò chơi · Tham quan · Văn hoá · Ăn uống · Tiện ích |
| Grid | 3 cột, mỗi item: `số-TÊN VIỆT` (in hoa, **màu theo phân loại**) + `số-Tên English` (xám nhỏ) |
| Màu tên | xanh lá · cam · đỏ · tím · xanh dương · xám (item disabled/xám = tạm đóng?) |
| Item mờ | `24-Đu Dây Qua Hồ`, `28-Thuyền Bay`, `34-Farm Dừa` xám nhạt → có state "không khả dụng" |

> 🔴 **6 chip filter thật khác hoàn toàn `type` trong `catalog.json`.**
> - `catalog.json`: `vào cổng`, `tham quan`, `cảm giác mạnh`, `trải nghiệm`, `di chuyển`, `công viên nước`, `trò chơi`, `khám phá`, `quà tặng`, `chọn 1 trong 2`
> - UI thật: `Trò chơi`, `Tham quan`, `Văn hoá`, `Ăn uống`, `Tiện ích`
>
> → UI thật đọc từ `map/map_places.json` (có số thứ tự + tên EN + category), không
> phải từ `catalog.json`. Prototype phải dùng **bộ 6 chip thật**, không dùng 10 type
> của catalog. Xem [`06-data.md`](06-data.md) và câu hỏi mới Q-29.

### Ảnh 6 — Header site chính

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📍 120 Xa Lộ Hà Nội…  📞 1900 636 787  ✉ phongkinhdoanh@suoitien.com   │ ← VÀNG #DEA800
│                                              🇻🇳 🇬🇧  f t in ig yt      │
│  ╭─────────────────────────────────────────────────────────────────╮    │
│  │ TRANG CHỦ GIỚI THIỆU TRẢI NGHIỆM… TRÒ CHƠI [LOGO] DỊCH VỤ … 🔍 │    │ ← XANH #128125
│  ╰─────────────────────────────────────────────────────────────────╯    │   pill r=50px
│      ▔▔▔▔▔▔▔▔▔▔ đường đỏ #E7313B + vệt đỏ→trắng→đỏ ▔▔▔▔▔▔▔▔▔▔          │
└─────────────────────────────────────────────────────────────────────────┘
                                    [SẢN PHẨM FARM] ← nút vàng dọc phải
                                    [BẢN ĐỒ]
                                    [MUA VÉ]
```

Đặc điểm phải clone:
- Topbar **vàng `#DEA800`** — địa chỉ + hotline + email bên trái, cờ VI/EN + 5 social bên phải
- Navbar **xanh `#128125`**, `border-radius: 50px`, `width: 90%`, **logo ở GIỮA** (không phải bên trái)
- **Đường đỏ 2px `#E7313B`** dưới navbar + **vệt gradient đỏ→trắng→đỏ 5px** — chi tiết nhận diện
- Chữ nav: **trắng, bold, IN HOA**
- Nút tìm kiếm 🔍 tròn trắng cuối navbar
- 3 nút vàng nổi dọc bên phải: SẢN PHẨM FARM · BẢN ĐỒ · MUA VÉ (có viền chạy animate)

## 0.4 Dữ liệu thật đã lấy được

### Màu (từ `style.css`)

| Hex | rgb | Lần dùng | Vai trò |
|---|---|---|---|
| `#128125` | 18,129,37 | **54** | Xanh lá thương hiệu — navbar, submenu, heading |
| `#DEA800` | 222,168,0 | 12 | Vàng đồng — topbar |
| `#EB0029` | 235,0,41 | 11 | Đỏ — chữ nút "Mua vé" |
| `#F53D2D` | 245,61,45 | 9 | Đỏ-cam |
| `#148225` | 20,130,37 | 8 | Xanh lá biến thể |
| `#FF7B01` | 255,123,1 | 4 | Cam |
| `#D6282E` | 214,40,46 | 4 | Đỏ gradient viền chạy |
| `#65A723` | 101,167,35 | 4 | Xanh lá non |
| `#E7313B` | 231,49,59 | 3 | Đỏ đường viền dưới navbar |
| `#FBD255` | 251,210,85 | 2 | Vàng nhạt nền nút vé |

Chi tiết + thang màu dẫn xuất: [`02-design-system.md`](02-design-system.md) §2.1

### Font

`body { font-family: "Arima Madurai", cursive; }` — Google Fonts, weight 100–700,
**đã verify có subset `vietnamese`**.

### Menu thật — 8 mục cấp 1, 84 mục tổng, 3 cấp

| Cấp 1 | href | Cấp 2 |
|---|---|---|
| Trang chủ | `/` | — |
| Giới thiệu | `/ladingpage/block/index.php` | Về Suối Tiên · Bản đồ |
| Trải nghiệm đặc biệt | `/trai-nghiem-dac-biet` | Công trình văn hóa lịch sử · Công trình văn hóa tâm linh · Biển Tiên Đồng - Ngọc Nữ · Suối Tiên farm · Bốn Mùa Lễ Hội |
| TRÒ CHƠI | `/tro-choi` | THAM QUAN - KHÁM PHÁ (14 mục cấp 3) · CẢM GIÁC MẠNH (9) · GIẢI TRÍ - TRẺ EM (8) |
| Dịch vụ | `/dich-vu` | Ẩm thực · Trạm dừng chân · Mua sắm · Hội Nghị - Tiệc Cưới |
| Bảng giá | `/bang-gia` | Combo trò chơi · Chính sách Tour đoàn · Bảng Giá Lẻ · Trải Ngiệm Mới |
| Tin tức & Thư viện | `/tin-tuc-thu-vien` | Tin tức (4 mục cấp 3) · Thư viện |
| TUYỂN DỤNG & LIÊN HỆ | `/tuyen-dung-lien-he` | Liên hệ hợp tác · Tuyển dụng · Hợp tác thương mại |

Danh sách đầy đủ 84 mục: [`06-data.md`](06-data.md) §6.6.

> ✅ **Q28 đã giải quyết:** site chính dùng **"Lâu Đài Pháp Thuật"**
> (`/lau-dai-phap-thuat`) — khớp `catalog.json`. Chữ "Phép Thuật" tôi thấy trước đó
> là đọc sai. Dùng **"Pháp Thuật"**.

### Link thật

| Mục | URL |
|---|---|
| Mua vé | `https://suoitien.vn/chon-ve` |
| Bản đồ | `https://suoitien.vn/ban-do` |
| Sản phẩm farm | `https://stf.suoitien.vn` |
| Combo trò chơi | `https://suoitien.vn/combo-tro-choi` (candidate cho "Mua combo vé" — chờ Q17b) |
| Logo | `https://suoitien.vn/halink-content/uploads/logosuoitien.png` (131 KB, verify 200 OK) |
| Facebook | `https://www.facebook.com/SuoiTienThemePark/` |
| TikTok | `https://www.tiktok.com/@suoitienthemepark?lang=vi-VN` |
| Instagram | `https://www.instagram.com/suoitienthemeparkofficial/` |
| YouTube | `https://www.youtube.com/@suoitienthemeparkofficial` |
| LinkedIn | `#` (site chính cũng để `#`) |

### Liên hệ

- Hotline: `1900 636 787` · `028.38960260` · `0914347787`
- Địa chỉ: `120 Xa Lộ Hà Nội, P. Tăng Nhơn Phú, TP.Hồ Chí Minh`
- Email: `phongkinhdoanh@suoitien.com`

## 0.5 Giải đáp của khách — ĐÃ CHỐT ✅

### Nhóm 1 — Phạm vi & giao hàng

| # | Câu hỏi | Trả lời | Diễn giải & ảnh hưởng |
|---|---|---|---|
| Q1 | Standalone hay repo thật? | "Chạy độc lập **riêng những phần cần điều chỉnh** thôi" | ✅ Prototype chỉ dựng **những gì thay đổi**: header, modal welcome, dock nút. Không clone lại sidebar trái / overlay chỉ đường / list điểm đến (đã tốt). Panorama là mock. |
| Q2 | Được load asset từ site thật? | "được, nếu bạn lấy được thì được" | ✅ Dùng logo PNG thật, Google Fonts thật, có thể fetch `catalog.json`. Vẫn giữ fallback offline. |
| Q3 | Thiết bị demo? | "trên tất cả thiết bị 1 lần" | ✅ Responsive đầy đủ 4 breakpoint ngay từ v1, không hoãn mobile. |
| Q4 | Bản tiếng Anh? | "cần" | ✅ Làm i18n từ đầu: `COPY.vi` + `COPY.en`, switch VI/EN ở topbar. Khớp hiện trạng (ảnh 2–4 đã bilingual). |
| Q5 | 1 file hay tách? | "tách ra hết cho dễ điều chỉnh về sau" | ✅ Tách theo [`01-architecture.md`](01-architecture.md) §1.1. **Bỏ** ý định gộp 1 file. |

### Nhóm 2 — Modal welcome

| # | Câu hỏi | Trả lời | Diễn giải & ảnh hưởng |
|---|---|---|---|
| Q6 | Chốt tiêu đề? | "Làm các biến thể đi" | ✅ Làm **3 biến thể**, đổi bằng `?title=a\|b\|c` hoặc nút trong panel `?debug=1` để khách xem tại chỗ rồi chọn. |
| Q7 | Subtitle? Số 158? | "ok. Sử dụng **'hơn 150'**" | ✅ Subtitle có, ghi "hơn 150 điểm". |
| Q8 | Loại bản đồ? | **(b) SVG stylized** | ✅ Tự vẽ SVG. ⚠️ Nhưng khách **đã có bản đồ 3D rất đẹp** (ảnh 2–3) → xem Q-30, tôi đề xuất cân nhắc lại. |
| Q9 | Số hotspot? | "cứ làm theo đề xuất trước. **cần có top nhưng kiểu hint cho khách thôi**" | ✅ 8 hotspot. "Top" thể hiện **nhẹ** — không phải huy chương/số thứ tự, mà là ring vàng nhấp nháy + nhãn nhỏ "nên xem". Không xếp hạng 1-2-3. |
| Q10 | Click hotspot? | **(a) nhảy thẳng** | ⚠️ **Đảo ngược D-10.** Bỏ preview panel + nút "Đi đến". Click hotspot → đóng modal → nhảy luôn. Bù lại: **hover/focus hiện mini-card** (tên + type + 1 câu) để vẫn "nói về tour" mà **không thêm click**. |
| Q11 | Nút bỏ qua? | "có" | ✅ "Để tôi tự khám phá →" |
| Q12 | Hiện lại lần sau? | **(b) 1 lần**, "lúc tắt thì nó **thu nhỏ thành 1 nút cạnh 2 nút điểm đến kia**. Bấm vào thì mở lên lại" | ⭐ **Component mới:** `#st-welcome-reopen`. Modal đóng → animate **thu nhỏ (morph) về vị trí nút** trong dock. Click nút → animate **bung ngược lại** thành modal. Xem [`04-modals.md`](04-modals.md) §4.3.8. |
| Q13 | Delay? | "theo bạn đề xuất đi" | ✅ Chờ `viewer:ready` + 800ms → fade + scale-in 400ms (D-13). |

### Nhóm 3 — Button layout

| # | Câu hỏi | Trả lời | Diễn giải & ảnh hưởng |
|---|---|---|---|
| Q14 | Mô phỏng split-view/routing? | "xem qua ảnh" | ✅ Đã xem ảnh 2–3. Overlay chỉ đường **đã hoàn thiện**, không cần dựng lại → theo Q1 thì **ngoài phạm vi prototype**. Chỉ cần nút mở nó. Tiết kiệm rất nhiều công. |
| Q15 | Vị trí nút? | "**đọc lại thiết kế tổng quan trang vr và cả suoitien.vn đi, rồi đề xuất lại. tôi cần sự đồng bộ**" | ⭐ Đã làm. Đề xuất mới: **hợp nhất cụm C vào cụm D** (dock dưới-giữa có sẵn). Chi tiết [`03-components.md`](03-components.md) §3.3 + [`08-decisions.md`](08-decisions.md) D-05v2. |
| Q16 | Thêm nút nào? | "Thêm nút **mua combo vé** (dẫn link sau), nút **help (tour help)**" | ✅ Chỉ thêm 2 nút này. **Không** thêm 10 nút tôi đề xuất → dock gọn. Nút VR/sound/fullscreen/compass **đã có** ở cụm D. |
| Q17 | Mua vé là ưu tiên? | "Có. Và có link nhảy qua trang đặt vé" | ✅ CTA vàng, link `https://suoitien.vn/chon-ve`. |

### Nhóm 4 — Navbar

| # | Câu hỏi | Trả lời | Diễn giải & ảnh hưởng |
|---|---|---|---|
| Q18 | Menu thật? | "đọc https://suoitien.vn/" | ✅ Đã lấy 84 mục, 3 cấp, href thật (§0.4). |
| Q19 | Tab VR360 ở đâu? | "Tùy ý bạn" | ✅ Chèn **sau "Trải nghiệm đặc biệt"** (vị trí 4/9), state active (badge `360°` đã bỏ 2026-08-01, xem D-38). Lý do: đây là "trải nghiệm", đặt cạnh nhóm cùng nghĩa; và ở giữa navbar thì dễ thấy hơn ở cuối. |
| Q20 | Hành vi navbar? | "**kết hợp (c)+(d)**. Khi tương tác thì ẩn đi bằng animation **thu lên trên**. Có nút **mũi tên kép animation di chuyển xuống** để người dùng biết chỗ click mở navbar lại" | ⭐ **Đổi hẳn D-07.** Không phải fade opacity nữa mà **slide `translateY(-100%)`**. Thêm component mới `#st-nav-peek`: tab nhỏ ở đỉnh giữa, icon `⌄⌄` (chevrons-down) animate nhấp nhô lên-xuống. Chi tiết [`03-components.md`](03-components.md) §3.2. |
| Q21 | Logo? | `https://suoitien.vn/halink-content/uploads/logosuoitien.png` | ✅ Verify 200 OK, 131 KB PNG. ⚠️ Nặng cho 1 logo — xem Q-31. |
| Q22 | Item navbar click đi đâu? | **(b) `href="#"` không làm gì** | ✅ Nhưng **vẫn lưu href thật** trong `data.js` + cờ `LINKS_LIVE = false`. Click → `preventDefault()` + toast. Đổi 1 cờ là bật link thật. |
| Q23 | Có topbar? | "có, clone đi" | ✅ Clone topbar vàng đầy đủ: địa chỉ + 3 hotline + email + cờ VI/EN + 5 social. |

### Nhóm 5 — Design direction

| # | Câu hỏi | Trả lời | Diễn giải & ảnh hưởng |
|---|---|---|---|
| Q24 | Màu hex? | "Bạn đọc https://suoitien.vn/ giúp tôi" | ✅ **Đã lấy 10 màu thật** từ `style.css` (§0.4). Blocker đã xoá. |
| Q25 | Tone? | **(a) light/airy** | ✅ **Bỏ hướng dark-glass** của v1. Bề mặt trắng / trắng-mờ + blur, nội dung xanh lá. Khớp đúng UI VR hiện có (ảnh 5). |
| Q26 | Font? | "lấy font của https://suoitien.vn/" | ✅ **Arima Madurai** (verify có tiếng Việt). Dùng hệ 2 font — xem [`02-design-system.md`](02-design-system.md) §2.2 và D-26. |
| Q27 | Ảnh các khu? | "không" | ✅ Dùng gradient placeholder theo phân loại. |
| Q28 | Phép/Pháp Thuật? | — | ✅ Tự giải quyết: site chính dùng **"Pháp Thuật"**. |

## 0.6 Câu hỏi MỚI phát sinh từ ảnh

| # | Câu hỏi | Mức | Giả định đang dùng |
|---|---|---|---|
| Q-29 | **6 chip filter thật** (`Trò chơi · Tham quan · Văn hoá · Ăn uống · Tiện ích`) khác 10 `type` của `catalog.json`. Bộ nào là chuẩn? Nếu prototype cần chip thì dùng bộ nào? | 🟡 | Dùng **bộ 6 chip thật** — vì đó là cái user đang thấy. `type` của catalog chỉ dùng nội bộ. |
| Q-30 | Bạn **đã có bản đồ 3D minh hoạ rất đẹp** (ảnh 2–3) với pin số. Modal welcome dùng **bản đồ đó** (crop + hotspot) sẽ ấn tượng hơn SVG tôi vẽ nhiều. Có muốn đổi Q8 sang (a) không? | 🟡 | Vẫn theo (b) SVG như bạn chọn. Nhưng tôi làm **cả 2 bản**, đổi bằng `?map=svg\|real` để bạn so sánh trực tiếp. |
| Q-31 | Logo PNG 131 KB khá nặng. Có file **SVG** hoặc PNG nhỏ hơn (~20 KB) không? | ⚪ | Dùng PNG thật, `loading="eager"`, `width/height` cố định chống layout shift. |
| Q-32 | Link nút **"Xem combo"** (YC-6) — `suoitien.vn/combo-tro-choi` đúng trang chứ? | 🟡 | Đang dùng `/combo-tro-choi` — **trùng đúng href** mục *Bảng giá › Combo trò chơi* trong menu thật, không phải URL đoán. Nằm ở 1 biến `D.LINKS.combo`. |
| Q-33 | Trong ảnh 4 có item **xám mờ** (`24-Đu Dây Qua Hồ`, `28-Thuyền Bay`, `34-Farm Dừa`). Đó là "tạm đóng"/"chưa có 360°"? Có cần thể hiện state này trong design mới? | ⚪ | Coi là "chưa có ảnh 360°", làm state `.st-disabled` + tooltip. |
| Q-34 | Cụm B (sidebar trái: THAM QUAN / ẨM THỰC / …) và cụm E (2 nút tròn phải) — **có giữ nguyên** hay muốn tôi đề xuất luôn? Theo Q1 thì ngoài phạm vi, nhưng nếu để nguyên thì header mới sẽ đè lên cụm B. | 🔴 | **Cần trả lời** — xem §0.7. Tạm: đề xuất dời cụm B xuống dưới header và thu gọn mặc định. |
| Q-36 ⭐ | **2 overlay clone (M2/M3) dùng để làm gì khi ghép thật?** (a) chỉ để trình bày ý tưởng, bản thật vẫn chạy overlay cũ · (b) thay hẳn overlay cũ bằng bản clone · (c) lấy phần vỏ của bản clone áp lên ruột overlay cũ | 🔴 | Tạm coi là **(a)** — clone để demo và để bàn chuyện re-skin. Chọn (b)/(c) thì phải nối dữ liệu thật, xem [`06-data.md`](06-data.md) §6.7. |
| Q-35 ⭐ | Trang VR có **2 nút cờ VI/EN riêng** (cụm ⓐ) và topbar mới cũng có VI/EN → trùng. Bỏ cụm ⓐ hay bỏ ở topbar? **Câu hỏi này lên 🔴 sau YC-6**: header là thứ DUY NHẤT còn đè lên UI có sẵn. | 🔴 | Bỏ cụm ⓐ, giữ ở topbar (đồng bộ site chính). Nút share của cụm ⓐ: bỏ luôn — modal share đã ra khỏi phạm vi (D-39). Đánh dấu `soft:true` trong `RESERVED_ZONES`. |

## 0.7 Vấn đề bố cục cần chốt 🔴

Thêm header (topbar 46px + navbar 58px = **104px**) vào trang VR sẽ **đè lên**:

| Bị ảnh hưởng | Vị trí hiện tại | Xung đột |
|---|---|---|
| Cụm A (VN + share) | trên-phải, `top ~20px` | ❌ Bị header che hoàn toàn |
| Cụm B (sidebar trái) | trái, `top ~230px` | ⚠️ Không bị che, nhưng nhìn "trôi" vì header đẩy trọng tâm lên |
| `#fp-close` của overlay | `top: 15px; right: 16px; z: 10002` | ❌ Bị header che → không đóng được overlay |

**Đề xuất của tôi:**
1. **Bỏ cụm A** — VI/EN và share chuyển vào topbar/dock (Q-35).
2. **Cụm B** dời xuống `top: calc(header-h + 16px)`, mặc định **thu gọn** thành 1 nút
   tròn logo, click mới bung ra. Trang VR nên để panorama là chủ thể.
3. **`#fp-close`** dời xuống dưới header, hoặc khi overlay mở thì **ẩn header** (overlay
   là chế độ toàn màn hình riêng, không cần nav).

→ Cần bạn xác nhận điểm 2 và 3, vì nó chạm vào code `floorplan` hiện có.

## 0.8 Ngoài phạm vi (xác nhận lại theo Q1 + Q14)

- ❌ Panorama 360° thật → mock
- ~~❌ Dựng lại overlay "Chỉ đường" (ảnh 2–3)~~ → ✅ **ĐÃ DỰNG 2026-08-01** (YC-8 · D-43)
- ~~❌ Dựng lại overlay "Danh sách điểm đến" (ảnh 4)~~ → ✅ **ĐÃ DỰNG 2026-08-01**
- ❌ Pathfinding, GPS, split-view thật
- ❌ Backend, analytics, đặt vé thật
- ❌ SEO, accessibility audit đầy đủ (chỉ ARIA cơ bản)

**Prototype v1 chỉ gồm 3 thứ:**
1. Header (topbar vàng + navbar xanh + tab VR360 + `#st-nav-peek`)
2. Modal welcome (3 biến thể tiêu đề + bản đồ + 8 hotspot + nút thu nhỏ mở lại)
3. Dock nút dưới-giữa (hợp nhất Chỉ đường + Điểm đến + 4 nút có sẵn + Mua vé + Combo + Help)

trên nền panorama mock.
