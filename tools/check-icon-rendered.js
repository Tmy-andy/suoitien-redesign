/* ═══════════════════════════════════════════════════════════════════════
   Chụp CHÍNH cái vòng tròn đang render trên trang rồi đo trọng tâm pixel
   trắng so với tâm vòng tròn.

   Vì sao cần cả file này khi đã có check-icon-center.js:
   check-icon-center.js chỉ đo symbol CÔ LẬP → nó không thấy được lỗi do CSS
   của trang. Thực tế đã bắt được lỗi lệch −7px do specificity CSS mà bản kia
   báo "0 lệch". Muốn biết người dùng THẤY gì thì phải đo pixel đã render.

   CÔNG CỤ DEV. Chạy:  npm i -D playwright && node tools/check-icon-rendered.js
   Ngưỡng: |lệch| ≤ 1px CSS. Lệch dọc ±0.3–0.9px ở cỡ 15px là nhiễu ngưỡng
   khi rasterize, không phải lỗi (kiểm chứng bằng BIG=1 để phóng 8×).
   ═══════════════════════════════════════════════════════════════════════ */
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { console.error('Thiếu playwright. Chạy: npm i -D playwright'); process.exit(2); }
const zlib = require('zlib');
const path = require('path');

function decodePNG(buf) {
  let pos = 8, w = 0, h = 0, bd = 0, ct = 0; const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos); const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bd = data[8]; ct = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (bd !== 8) throw new Error('bit depth ' + bd);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch, out = Buffer.alloc(h * stride);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[p++]; const line = raw.slice(p, p + stride); p += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[y * stride + x - ch] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = (x >= ch && y > 0) ? out[(y - 1) * stride + x - ch] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
                          v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      out[y * stride + x] = v & 255;
    }
  }
  return { w, h, ch, data: out };
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const dpr of [1, 2]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: dpr });
    await p.goto('file:///' + path.join(__dirname, '..', 'index.html').split(String.fromCharCode(92)).join('/') + '?welcome=0');
    await p.waitForTimeout(1800);
    if (process.env.BIG) await p.addStyleTag({ content:
      '.st-tb-ic{width:240px!important;height:240px!important}' +
      '.st-tb-ic svg{width:120px!important;height:120px!important}' +
      '.st-tb-contact,.st-tb-right{height:auto!important}' });
    await p.waitForTimeout(200);
    const sels = [['pin', '.st-tb-contact li:nth-child(1) .st-tb-ic'],
                  ['phone', '.st-tb-contact li:nth-child(2) .st-tb-ic'],
                  ['mail', '.st-tb-contact li:nth-child(3) .st-tb-ic'],
                  ['fb', '.st-tb-social li:nth-child(1) .st-tb-ic']];
    const line = [];
    for (const [name, sel] of sels) {
      const el = await p.$(sel);
      const img = decodePNG(await el.screenshot());
      const { w, h, ch, data } = img;
      let sx = 0, sy = 0, n = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * ch, r = data[i], g = data[i + 1], bl = data[i + 2];
        if (r > 245 && g > 245 && bl > 235) { sx += x; sy += y; n++; }   // pixel TRẮNG
      }
      const cx = sx / n, cy = sy / n;
      // quy về px CSS
      const k = process.env.BIG ? 8 : 1;   // 120px so 15px = 8x
      line.push(name + '=[' + ((cx - (w - 1) / 2) / dpr / k).toFixed(2) + ',' +
                ((cy - (h - 1) / 2) / dpr / k).toFixed(2) + ']');
    }
    console.log('DPR' + dpr + '  lech tam (px CSS):  ' + line.join('  '));
    await p.close();
  }
  await b.close();
})();
