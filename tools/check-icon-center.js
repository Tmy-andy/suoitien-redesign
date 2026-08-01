/* ═══════════════════════════════════════════════════════════════════════
   Kiểm CĂN TÂM của mọi icon trong sprite của index.html.

   Đo TÂM KHỐI (ink centroid) bằng cách rasterize từng symbol ra canvas rồi
   lấy trọng tâm pixel — KHÔNG dùng tâm bbox.
   Lý do: bbox căn giữa hoàn hảo vẫn có thể nhìn lệch rõ, vì khối lượng nét
   dồn về một phía (vd `i-fa-phone` bbox lệch 0.05 nhưng tâm khối lệch 1.23).
   Mắt nhìn theo khối, không theo hộp bao.

   Tự quét toàn bộ `#st-icons g[id]` — không dùng danh sách cứng (đã từng sót
   nguyên bộ i-fa-* vì lý do này).

   CÔNG CỤ DEV — không phải dependency của bản demo (CLAUDE.md RULE #3).
   Chạy:  npm i -D playwright && node tools/check-icon-center.js
   Exit 1 nếu có icon lệch quá ngưỡng.
   ═══════════════════════════════════════════════════════════════════════ */
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { console.error('Thiếu playwright. Chạy: npm i -D playwright'); process.exit(2); }

const path = require('path');
const TOL = 0.25;                       // đơn vị viewBox
/* Mũi tên / chevron: khối lệch là CỐ Ý (chúng chỉ hướng) → căn theo bbox */
const SKIP = ['i-arrow-right', 'i-chevron-right', 'i-chevron-down', 'i-chevrons-down', 'i-swap'];

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 900, height: 600 } });
  const url = 'file:///' + path.join(__dirname, '..', 'index.html').split(String.fromCharCode(92)).join('/') + '?welcome=0';
  await p.goto(url);
  await p.waitForTimeout(1500);

  const res = await p.evaluate(async (skip) => {
    const NS = 'http://www.w3.org/2000/svg', S = 256, out = {};
    for (const src of document.querySelectorAll('#st-icons g[id]')) {
      const id = src.id;
      if (id.startsWith('i-flag-') || skip.indexOf(id) > -1) continue;
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('xmlns', NS);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', S); svg.setAttribute('height', S);
      /* Phải khai lại thuộc tính nét: rule `svg use` của base.css không đi
         theo vào data-URL độc lập. */
      const wrap = document.createElementNS(NS, 'g');
      wrap.setAttribute('fill', 'none');
      wrap.setAttribute('stroke', '#fff');
      wrap.setAttribute('stroke-width', '1.75');
      wrap.setAttribute('stroke-linecap', 'round');
      wrap.setAttribute('stroke-linejoin', 'round');
      const c = src.cloneNode(true); c.removeAttribute('id');
      wrap.appendChild(c); svg.appendChild(wrap);

      const img = new Image();
      await new Promise(r => {
        img.onload = r; img.onerror = r;
        img.src = 'data:image/svg+xml;charset=utf-8,' +
          encodeURIComponent(new XMLSerializer().serializeToString(svg));
      });
      const cv = document.createElement('canvas'); cv.width = cv.height = S;
      const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, S, S);
      const d = ctx.getImageData(0, 0, S, S).data;
      let sx = 0, sy = 0, n = 0;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const a = d[(y * S + x) * 4 + 3];
        if (a) { const w = a / 255; sx += x * w; sy += y * w; n += w; }
      }
      const k = 24 / S;
      out[id] = n ? [ +(12 - sx / n * k).toFixed(2), +(12 - sy / n * k).toFixed(2) ] : [0, 0];
    }
    return out;
  }, SKIP);

  const bad = Object.entries(res)
    .filter(([, v]) => Math.abs(v[0]) > TOL || Math.abs(v[1]) > TOL)
    .sort((a, b2) => (Math.abs(b2[1][0]) + Math.abs(b2[1][1])) - (Math.abs(a[1][0]) + Math.abs(a[1][1])));

  console.log('Kiem ' + Object.keys(res).length + ' icon (bo qua ' + SKIP.length +
              ' mui ten) | lech: ' + bad.length);
  bad.forEach(([k, v]) => console.log('  ' + k.padEnd(18) + 'can dich them dx=' + v[0] + ' dy=' + v[1]));
  if (bad.length) console.log('\nCong don gia tri tren vao transform="translate(...)" cua symbol trong index.html.');
  await b.close();
  process.exit(bad.length ? 1 : 0);
})();
