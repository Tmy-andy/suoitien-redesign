/* ═══════════════════════════════════════════════════════════════════════
   check-image-cover.js — mọi ảnh PHỦ phải phủ kín khung chứa, ở mọi trạng thái.

   Vì sao cần file này: `css/base.css` đặt `img { max-width: 100% }` cho ảnh
   nội dung. Ảnh nào cố ý RỘNG HƠN khung chứa (ví dụ `.st-wt-img` khai
   `width: 112%` để parallax dịch được) sẽ bị kẹp im lặng xuống 100% — không
   lỗi, không cảnh báo, chỉ là một dải trống dọc ở mép phải. Đã xảy ra thật,
   xem docs/08-decisions.md D-53.

   Kiểm `object-fit: cover` là CHƯA ĐỦ: `cover` chỉ nói cách ảnh lấp khung của
   CHÍNH NÓ, không nói ảnh có đủ to để trùm khung cha hay không. Phải đo rect.

   Chạy:  npm i -D playwright  &&  node tools/check-image-cover.js
   Exit 1 nếu có ảnh hụt mép.
   ═══════════════════════════════════════════════════════════════════════ */
const { chromium } = require('playwright');
const path = require('path');
const ROOT = 'file:///' + path.resolve(__dirname, '..').split(path.sep).join('/') + '/';
const fail = [], errs = [];

/* Trả về danh sách ảnh KHÔNG phủ kín ô cha (âm = hụt). Bỏ qua 1px sai số làm tròn. */
const PROBE = (sel) => {
  const out = [];
  document.querySelectorAll(sel).forEach(im => {
    if (!im.offsetParent && getComputedStyle(im).position !== 'absolute') return;
    const box = im.closest('.st-wt-media, .st-cr-card, .st-sld-panel, .st-li-media, .st-map-canvas');
    if (!box) return;
    const b = box.getBoundingClientRect(), r = im.getBoundingClientRect();
    if (!b.width || !r.width) return;
    const gap = {
      left:   b.left - r.left,
      right:  r.right - b.right,
      top:    b.top - r.top,
      bottom: r.bottom - b.bottom
    };
    const bad = Object.entries(gap).filter(([, v]) => v < -1).map(([k, v]) => k + ':' + Math.round(v));
    if (bad.length) out.push((im.className || '?') + ' → hut ' + bad.join(', '));
  });
  return out;
};

(async () => {
  const b = await chromium.launch();

  /* ══ BẢN 2 — wall ══ */
  let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => errs.push('v2 ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('v2 ' + m.text()); });
  await p.goto(ROOT + 'index2.html');
  await p.waitForTimeout(1800);

  let bad = await p.evaluate(PROBE, '.st-wt-img');
  console.log('v2 wall — 9 o, nghi ngoi:', bad.length ? bad : 'OK (phu kin het)');
  if (bad.length) fail.push('v2 wall: ' + bad.join(' | '));

  /* parallax ở biên: đẩy --px/--py tới mức tối đa js/wall.js có thể sinh */
  bad = await p.evaluate(() => {
    document.querySelectorAll('.st-wall-tile').forEach(t => {
      t.style.setProperty('--px', '2.50%');
      t.style.setProperty('--py', '2.50%');
    });
    return null;
  });
  await p.waitForTimeout(300);
  bad = await p.evaluate(PROBE, '.st-wt-img');
  console.log('v2 wall — parallax bien (+2.5%):', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v2 wall parallax: ' + bad.join(' | '));

  await p.evaluate(() => {
    document.querySelectorAll('.st-wall-tile').forEach(t => {
      t.style.setProperty('--px', '-2.50%'); t.style.setProperty('--py', '-2.50%');
    });
  });
  await p.waitForTimeout(300);
  bad = await p.evaluate(PROBE, '.st-wt-img');
  console.log('v2 wall — parallax bien (-2.5%):', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v2 wall parallax-: ' + bad.join(' | '));

  /* hover 1 ô (scale 1.07) */
  await p.evaluate(() => {
    document.querySelectorAll('.st-wall-tile').forEach(t => {
      t.style.removeProperty('--px'); t.style.removeProperty('--py');
    });
  });
  await p.hover('.st-s-lg');
  await p.waitForTimeout(600);
  bad = await p.evaluate(PROBE, '.st-wt-img');
  console.log('v2 wall — hover:', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v2 wall hover: ' + bad.join(' | '));

  /* slider */
  await p.click('.st-wall-tile[data-g="noibat"]');
  await p.waitForTimeout(1500);
  bad = await p.evaluate(PROBE, '.st-sld-img');
  console.log('v2 slider:', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v2 slider: ' + bad.join(' | '));
  await p.close();

  /* ══ BẢN 1 ══ */
  p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => errs.push('v1 ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('v1 ' + m.text()); });
  await p.goto(ROOT + 'index.html');
  await p.waitForTimeout(1800);

  bad = await p.evaluate(PROBE, '.st-cr-img');
  console.log('v1 carousel:', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v1 carousel: ' + bad.join(' | '));

  await p.click('.st-cr-card.st-active');
  await p.waitForTimeout(800);
  bad = await p.evaluate(PROBE, '.st-li-media img');
  console.log('v1 danh sach:', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v1 list: ' + bad.join(' | '));

  /* ══ MOBILE — cùng bộ kiểm ══ */
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(700);
  bad = await p.evaluate(PROBE, '.st-li-media img');
  console.log('v1 danh sach mobile:', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v1 list mobile: ' + bad.join(' | '));
  await p.close();

  p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => errs.push('v2m ' + e.message));
  await p.goto(ROOT + 'index2.html');
  await p.waitForTimeout(1800);
  bad = await p.evaluate(PROBE, '.st-wt-img');
  console.log('v2 wall mobile:', bad.length ? bad : 'OK');
  if (bad.length) fail.push('v2 wall mobile: ' + bad.join(' | '));

  console.log('\nERRORS:', errs.length ? errs : 'none');
  if (errs.length) fail.push('co loi console');
  console.log('KET QUA:', fail.length ? 'FAIL\n - ' + fail.join('\n - ') : 'PASS');
  await b.close();
})();
