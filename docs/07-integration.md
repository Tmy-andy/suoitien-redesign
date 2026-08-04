> Cập nhật: 2026-08-04 (v9 — D-57: còn MỘT bản, `host-demo.html` đã gỡ)

# 07 — Tích hợp: hợp đồng giữa popup và trang cha

Popup là **một trang HTML độc lập** (`index.html`) được nhúng vào trang VR bằng
`<iframe>`. Đây là file quan trọng nhất của bộ docs: nó là toàn bộ những gì bên tích
hợp cần đọc.

**Muốn chép được ngay?** → **§7.2 dưới đây là toàn bộ code trang cha cần viết**, đã
chạy được, ~40 dòng. Chép vào một file HTML rỗng là thử được ngay.

> `host-demo.html` — bản chạy sẵn của chính đoạn đó, có thêm panorama giả và log
> postMessage — **đã gỡ ở D-57**, sẽ dựng lại lúc bàn giao. Lấy tạm:
> `git show 3be9e22:host-demo.html > host-demo.html`. **Nó không phải deliverable.**

> ⭐ **Hợp đồng này không đổi khi đổi thiết kế bên trong popup.** Nó từng được dùng
> chung cho hai bản song song (D-50) và chọn một bản (D-57) **không phải sửa gì** ở
> trang cha — đó chính là bằng chứng cho giá trị của cái seam này.
> Thực tế khi gỡ bản 1: **không một dòng nào trong §7.2 phải đổi.**

---

## 7.1 Bức tranh 30 giây

```
┌─ TRANG CHA (suoitien.trip360.vn) ──────────────────────────────────┐
│                                                                     │
│   3DVista player  +  window.VRCore  +  floorplan (z 10000-10009)    │
│                                                                     │
│   ┌─ <iframe id="st-popup-frame"> ─ position:fixed; inset:0 ──────┐ │
│   │  z-index: 10050 · background: transparent                     │ │
│   │                                                                │ │
│   │      index.html  =  #st-popup  — CHIẾM TRỌN MÀN               │ │
│   │      (VR Wall 9 ô → Infinite Slider, nền trắng đặc)          │ │
│   │                                                                │ │
│   └────────────────────────────────────────────────────────────────┘ │
│                          ▲                    │                      │
│         postMessage      │                    │  postMessage         │
│         st:lang, st:open │                    ▼  st:ready,           │
│                          │                       st:navigate,        │
│                          └──── js/bridge.js ────  st:close           │
└─────────────────────────────────────────────────────────────────────┘
```

Popup **không biết gì** về trang cha ngoài `js/bridge.js`. Muốn nhúng vào chỗ khác
(app khác, landing page khác) thì chỉ phải đọc lại đúng một file đó.

---

## 7.2 Trang cha phải viết gì

### Bước 1 — nhúng iframe

```html
<iframe id="st-popup-frame"
        src="https://cdn-cua-ban/popup/index.html?lang=vi"
        title="Chọn điểm bắt đầu tour 360°"></iframe>
```

```css
#st-popup-frame {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  border: 0;
  background: transparent;    /* ⚠️ BẮT BUỘC — xem §7.2.1 */
  z-index: 10050;             /* ⚠️ phải > 10009 — xem §7.4 */
}
```

Đúng 5 dòng. **Không** cần `backdrop-filter` — popup chiếm trọn màn với nền đặc
(D-48), không còn lớp nền mờ nào để blur. Xem §7.2.2.

### Bước 2 — nghe message

```js
window.addEventListener('message', function (e) {
  var d = e.data;
  if (!d || typeof d.type !== 'string' || d.type.indexOf('st:') !== 0) return;

  if (d.type === 'st:navigate') {
    /* d.direct === true nghĩa là popup đã tự gọi VRCore rồi (cùng origin).
       false thì trang cha phải tự đi. */
    if (!d.direct && window.VRCore) VRCore.navigateToPano(window.tour, d.pano);
  }

  if (d.type === 'st:close') {
    document.getElementById('st-popup-frame').hidden = true;
    document.documentElement.style.overflow = '';        /* mở lại cuộn */
  }
});
```

> **Chốt origin ở production.** Ví dụ trên nhận message từ mọi origin cho gọn. Khi
> deploy thật, thêm `if (e.origin !== 'https://cdn-cua-ban') return;` — popup nằm ở
> origin mình kiểm soát nên không có lý do gì để nới.

### Bước 3 — Esc và khoá cuộn

Hai việc popup **không thể tự làm** (§7.3):

```js
document.documentElement.style.overflow = 'hidden';       /* lúc mở iframe */

document.addEventListener('keydown', function (e) {       /* Esc ngoài iframe */
  if (e.key === 'Escape' && frame && !frame.hidden) closePopup();
});
```

### 7.2.1 Vì sao `background: transparent` là bắt buộc

Iframe lấy nền từ document con. `css/base.css` đã đặt `html, body { background:
transparent }` — nhưng **thẻ `<iframe>` ở trang cha cũng phải khai**, nếu không trình
duyệt vẽ nền mặc định của element.

Popup có nền trắng đặc nên **lúc đứng yên** không thấy khác biệt. Khác biệt nằm ở
**animation vào/ra**: `#st-popup` fade `opacity`, và đúng những frame đó phải nhìn
xuyên qua thấy panorama. Quên khai thì popup "bật" ra từ một tấm màn trắng thay vì
hiện dần lên trên cảnh 360°.

Hai chỗ, phải khai cả hai.

### 7.2.2 Không cần `backdrop-filter` (D-47 → D-48)

Bản trước popup là hộp modal canh giữa trên nền mờ, và có một cái bẫy: `backdrop-filter`
chỉ làm mờ được thứ nằm **sau nó trong cùng một document**. Trong iframe, phía sau lớp
nền mờ là chỗ trống trong suốt → nó không làm gì cả. Cách chữa hồi đó là đẩy
`backdrop-filter` sang chính thẻ `<iframe>` (D-47).

**Từ D-48 câu hỏi này không còn:** popup chiếm trọn màn với nền đặc, không còn lớp nền
mờ nào. Thêm `backdrop-filter` vào iframe giờ chỉ tốn GPU trong ~400 ms fade mà gần
như không thấy gì. **Đừng thêm.**

> Ghi lại vì đây là loại bẫy im lặng — không lỗi, không cảnh báo, chỉ là hiệu ứng
> không xuất hiện. Ai sau này định dựng lại lớp nền mờ trong iframe sẽ vấp đúng nó.

---

## 7.3 Bốn thứ iframe KHÔNG làm được — trách nhiệm của trang cha

| Việc | Vì sao popup không tự làm được | Trang cha phải làm |
|---|---|---|
| **Khoá cuộn nền** | `document` của trang cha nằm ngoài tầm với | `documentElement.style.overflow = 'hidden'` khi mở |
| **Esc khi focus ở ngoài iframe** | `keydown` chỉ bắn trong document đang có focus. Focus ở trong iframe thì popup nghe được (đã cài); người dùng bấm ra ngoài rồi Esc thì không | Tự nghe `keydown` như §7.2 bước 3 |
| **Che nền khỏi screen reader** | `aria-modal="true"` chỉ có tác dụng trong cùng một cây accessibility | `aria-hidden="true"` (hoặc `inert`) lên nội dung trang cha khi popup mở |
| **Trả focus sau khi đóng** | Phần tử được focus trước đó nằm ở document cha | Nhớ `document.activeElement` trước khi mở, `.focus()` lại khi nhận `st:close` |

Ba trong bốn việc trên bản trước (popup là modal cùng document) tự lo được — chúng
từng nằm trong `js/a11y.js` và đã bị gỡ. Chú thích đầu file đó ghi lại lý do.

---

## 7.4 z-index — vấn đề cũ đã tự biến mất

Bản trước phải dịch cả thang z-index lên >10010 vì `floorplan.css` chiếm 10000–10009
và 3DVista còn cao hơn. Kiến trúc iframe **xoá hẳn vấn đề đó**: popup nằm trong
document riêng nên thang bên trong nó (`--st-z-popup: 10`) không tranh chấp với ai.

Chỉ còn **đúng một con số** phải chỉnh, và nó nằm ở trang cha:

```css
#st-popup-frame { z-index: 10050; }   /* > 10009 của floorplan.css */
```

---

## 7.5 Message — bảng tra đầy đủ

Tất cả đều có tiền tố `st:` để trang cha lọc được giữa đủ thứ postMessage khác
(3DVista, GTM, chat widget… đều bắn lung tung).

### Popup → trang cha

| type | Payload | Khi nào | Trang cha nên làm gì |
|---|---|---|---|
| `st:ready` | `{ w, h }` | Popup dựng xong DOM | Bỏ trạng thái loading của iframe (nếu có) |
| `st:navigate` | `{ key, pano, name, direct }` | Người dùng bấm 1 thẻ | `direct === false` → tự gọi `VRCore.navigateToPano()`. `true` → popup gọi rồi, chỉ ghi analytics |
| `st:close` | `{ reason }` | Animation đóng đã chạy xong | Ẩn/gỡ iframe, mở lại cuộn, trả focus |
| `st:resize` | `{ w, h }` | *(chưa dùng)* | Dành cho bên nào muốn iframe co theo panel |

`reason` của `st:close`: `'navigate'` (đã chọn 1 điểm) · `'button'` (nút × hoặc "Để
tôi tự khám phá") · `'esc'` · `'debug'`.

> **`st:close` đến SAU `st:navigate` khoảng 300 ms** — cố ý. Popup chạy hết animation
> đóng rồi mới báo; gỡ iframe ngay lúc `st:navigate` sẽ làm popup biến mất cụp một
> cái. Trang cha cứ điều hướng tour ngay khi nhận `st:navigate` — hai việc chạy song
> song đúng như thiết kế.

### Trang cha → popup

| type | Payload | Tác dụng |
|---|---|---|
| `st:lang` | `{ lang: 'vi' \| 'en' }` | Đổi ngôn ngữ nóng, không reload |
| `st:open` | — | Mở lại popup mà **không** tải lại iframe: **luôn quay về wall** (mở lại mà rơi thẳng vào slider của nhóm lần trước thì người dùng mất ngữ cảnh), chạy lại animation vào màn |

Gửi bằng `frame.contentWindow.postMessage({ type: 'st:lang', lang: 'en' }, '*')`.

---

## 7.6 Hai đường điều hướng — vì sao có cả hai (D-46)

`js/bridge.js` khi người dùng chọn một điểm:

```
1. sameOrigin() ?  →  parent.VRCore.navigateToPano(tour, pano)   → direct = true
2. LUÔN LUÔN       →  postMessage({ type:'st:navigate', …, direct })
```

- **Đường 1** chỉ chạy khi popup và trang cha cùng origin. Phép thử là chạm vào
  `parent.location.href` trong `try/catch` — khác origin thì trình duyệt ném
  `SecurityError`; không có API nào hỏi thẳng được.
- **Đường 2 luôn được gửi**, kể cả khi đường 1 thành công: trang cha vẫn cần biết để
  ghi analytics và để đóng iframe.

`direct` trong payload cho trang cha biết có phải tự điều hướng không.

> **Chữ ký `navigateToPano` chưa xác minh 100%.** `bridge.js` thử `navigateToPano(tour,
> pano)` rồi `navigateToPano(pano)`. Khi ghép thật, xác minh đúng một dạng rồi **xoá
> vòng thử** — chỗ đó đã đánh dấu `// MOCK:`.

---

## 7.7 Deploy — nơi đặt file

Popup là tĩnh hoàn toàn, đặt ở đâu cũng chạy:

```
/popup/
  index.html                  ← popup (wall → slider)
  css/tokens.css  base.css  wall.css  slider.css  map2d.css  responsive2.css
  js/data.js  i18n.js  a11y.js  bridge.js  map2d.js  wall.js  slider.js  popup2.js
  assets/img/cards/*.webp     12 ảnh điểm đến  (~930 KB)
  assets/map/park-2400.webp   bản đồ 2D       (391 KB)
```

Đúng **15 file code + 13 file ảnh**, tổng asset ~1,3 MB. Thứ tự nạp CSS và JS là **ràng
buộc**, không phải quy ước — [`01-architecture.md`](01-architecture.md) §1.3.

**Đừng deploy:** `Ban Do Suoi Tien/` (39 MB ảnh gốc) · `docs/` · `tools/` · `note.md`.
Khách đã chốt một bản (D-57) nên không còn `index2.html` để loại.

**Cùng origin với trang VR thì tốt hơn** — đường 1 hoạt động, đỡ một vòng
postMessage, và siết `e.origin` dễ hơn. Nhưng không bắt buộc.

Không cần build, không npm install, không server-side.

---

## 7.8 Checklist trước khi ghép

**Bên tích hợp**

- [ ] `background: transparent` trên **cả** thẻ `<iframe>` (§7.2.1)
- [ ] `z-index` iframe > 10009 (§7.4)
- [ ] Nghe `st:navigate` + `st:close`; siết `e.origin` ở production (§7.2)
- [ ] Khoá cuộn · Esc ngoài iframe · `aria-hidden` nền · trả focus (§7.3)
- [ ] Quyết định khi nào hiện popup (mỗi phiên? 1 lần? có `?pano=` thì bỏ qua?) —
      popup **không** tự quyết, xem §7.9
- [ ] Truyền `?lang=` khớp ngôn ngữ trang cha, và gửi `st:lang` khi user đổi
- [ ] ⚠️ Cân nhắc **pause render 3DVista** trong lúc popup mở — popup che kín màn nên
      panorama phía dưới vẽ ra cũng không ai thấy, mà vẫn ăn GPU.

**Bên popup**

- [ ] Thay 12 ảnh bằng bản gốc độ phân giải cao của khách (Q-37). Tỉ lệ không còn là
      ràng buộc (D-57) — nhưng **đừng phóng to lúc dựng asset** (D-55)
- [ ] Kiểm trên máy thật ở **320px** và **landscape**, không chỉ ở 390px (D-58)
- [ ] Bổ sung ảnh cho 8 điểm còn thiếu nếu khách gửi (Q-38 · [`06-data.md`](06-data.md) §6.2)
- [ ] ⚠️ **Thay số hiệu + toạ độ pin bằng dữ liệu thật** từ `map/map_places.json`
      (`code` + toạ độ pixel) — hiện mới 2/20 số là thật, còn lại ước lượng bằng mắt.
      Q-43 · [`06-data.md`](06-data.md) §6.10
- [ ] Nếu đổi màu nền khung bản đồ thì phải **flatten lại ảnh** lên đúng màu mới,
      không thì đường nối quay lại ([`06-data.md`](06-data.md) §6.10)
- [ ] Xác minh chữ ký `VRCore.navigateToPano` rồi xoá vòng thử (§7.6)
- [ ] Nối `ST.track()` vào `VR360Track.event()`, hoặc để trang cha tự ghi từ
      `st:navigate` ([`05-flows.md`](05-flows.md) §5.5)
- [ ] `@font-face` local thay Google Fonts ([`TODO.md`](TODO.md))

---

## 7.9 "Hiện 1 lần" — vì sao popup không tự quyết

Bản trước dùng `localStorage['st.welcome.seen']` để chỉ hiện modal lần đầu (Q12 = b).
Trong iframe, `localStorage` thuộc **origin của popup**, không phải của trang cha — và
trang cha mới là nơi biết ngữ cảnh (đang deep-link tới `?pano=`? user vừa vào từ
quảng cáo? đây là lần thứ mấy?).

Vì vậy logic đó chuyển hẳn sang trang cha:

```js
if (!localStorage.getItem('st.popup.seen') && !location.search.includes('pano=')) {
  openPopup();
  localStorage.setItem('st.popup.seen', '1');
}
```

Popup chỉ làm đúng một việc: hiện ra khi được nhúng.
Cùng lý do, `js/i18n.js` **không** đọc `localStorage` cho ngôn ngữ — trang cha là
nguồn sự thật duy nhất, nếu popup tự nhớ thì nó sẽ ghi đè lên cái cha vừa truyền vào.
