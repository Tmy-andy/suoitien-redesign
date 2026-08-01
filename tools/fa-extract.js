/* ═══════════════════════════════════════════════════════════════════════
   Trích outline glyph FontAwesome 4.6.3 (chính file font site gốc đang dùng)
   ra symbol SVG viewBox 24×24 cho bộ `i-fa-*` trong index.html.

   VÌ SAO CẦN: 3 lần trước tôi VẼ TAY lại 8 icon này, lần nào khách cũng thấy
   khác gốc. Site gốc phục vụ sẵn `fontawesome-webfont.svg` (SVG font) — trong
   đó `<glyph d="…">` là outline THẬT. Lấy thẳng thì hết cửa sai. Xem D-36 và
   `docs/02-design-system.md` §2.7.1.

   CÔNG CỤ DEV, chạy tay khi cần dựng lại bộ icon:
     node tools/fa-extract.js            # tự tải font từ site gốc
     node tools/fa-extract.js path.svg   # dùng file font đã tải sẵn
   In ra stdout 8 dòng <g id="i-fa-…">, dán đè vào sprite `#st-icons`.

   ⚠️ `scale` phải giữ ≥5 chữ số thập phân — làm tròn 0.01339 → 0.013 là sai 3%,
   glyph co lại thấy được.
   ═══════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');

const FONT_URL = 'https://suoitien.vn/halink-content/themes/halink-c5/public/template/fonts/fontawesome-webfont.svg';

/* Codepoint tra từ `font-awesome.min.css` 4.6.3 của site gốc
   (`.fa-youtube:before{content:"\f167"}` …). ĐỪNG đoán theo tên: `fa-youtube`
   f167 là logo chữ "You/Tube", KHÔNG phải nút play (đó là `fa-youtube-play` f16a). */
const WANT = {
  'i-fa-pin':   'f041',   // fa-map-marker
  'i-fa-phone': 'f095',   // fa-phone
  'i-fa-mail':  'f0e0',   // fa-envelope
  'i-fa-fb':    'f09a',   // fa-facebook-f
  'i-fa-tw':    'f099',   // fa-twitter
  'i-fa-in':    'f0e1',   // fa-linkedin
  'i-fa-ig':    'f16d',   // fa-instagram
  'i-fa-yt':    'f167'    // fa-youtube
};

const EM = 1792;          // <font-face units-per-em="1792">
const S  = 24 / EM;       // em → viewBox 24

/* Parser path đủ dùng cho SVG font (M L H V C S Q T A Z, hoa & thường).
   Điểm điều khiển cũng tính vào bbox → bbox rộng hơn thực tế vài %; chấp nhận
   được vì chỉ dùng để CANH TÂM, không dùng để scale khít. */
function bbox(d) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const N = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const put = (px, py) => {
    if (px < x0) x0 = px; if (px > x1) x1 = px;
    if (py < y0) y0 = py; if (py > y1) y1 = py;
  };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const up = cmd.toUpperCase(), rel = cmd !== up, n = N[up];
    if (n === undefined) throw new Error('lệnh path lạ: ' + cmd);
    if (up === 'Z') { x = sx; y = sy; continue; }
    const a = []; for (let k = 0; k < n; k++) a.push(parseFloat(toks[i++]));
    if (up === 'H') x = rel ? x + a[0] : a[0];
    else if (up === 'V') y = rel ? y + a[0] : a[0];
    else {
      for (let k = 0; k + 1 < n; k += 2) {
        const px = rel ? x + a[k] : a[k], py = rel ? y + a[k + 1] : a[k + 1];
        put(px, py);
        if (k + 2 >= n) { x = px; y = py; }
      }
      if (up === 'M') { sx = x; sy = y; }
    }
    put(x, y);
  }
  return [x0, y0, x1, y1];
}

function emit(src) {
  const r = (v) => Math.round(v * 100000) / 100000;
  const out = [];
  for (const [id, hex] of Object.entries(WANT)) {
    const m = src.match(new RegExp('<glyph[^>]*unicode="&#x' + hex + ';"[^>]*d="([^"]+)"', 'i'));
    if (!m) throw new Error('không thấy glyph ' + hex + ' (' + id + ')');
    const d = m[1];
    const [bx0, by0, bx1, by1] = bbox(d);
    /* scale(S, −S) = lật trục y (font y hướng lên, SVG y hướng xuống).
       translate đưa tâm bbox về (12,12) của viewBox 24. */
    const tx = r(12 - S * (bx0 + bx1) / 2);
    const ty = r(12 + S * (by0 + by1) / 2);
    out.push('<g id="' + id + '" fill="currentColor" stroke="none"><path transform="translate(' +
      tx + ' ' + ty + ') scale(' + r(S) + ' ' + r(-S) + ')" d="' + d + '"/></g>');
    console.error(id, hex, 'glyph', r((bx1 - bx0) * S) + '×' + r((by1 - by0) * S), 'đơn vị viewBox');
  }
  console.log(out.join('\n'));
}

const arg = process.argv[2];
if (arg) emit(fs.readFileSync(arg, 'utf8'));
else {
  require('https').get(FONT_URL, (res) => {
    if (res.statusCode !== 200) { console.error('HTTP ' + res.statusCode); process.exit(1); }
    let b = ''; res.setEncoding('utf8');
    res.on('data', (c) => { b += c; });
    res.on('end', () => emit(b));
  }).on('error', (e) => { console.error('Không tải được font:', e.message); process.exit(1); });
}
