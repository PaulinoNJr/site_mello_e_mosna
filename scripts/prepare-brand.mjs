// Browser-native encoding only: preserve the supplied artwork and transparency.
// Requires the existing Playwright Chromium installation used by the tests.
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const assets = new URL('../public/assets/', import.meta.url);
const full = await readFile(new URL('logo-mello-mosna.jpeg', assets));
const icon = await readFile(new URL('logo-mello-mosna.png', assets));
// The supplied .jpeg is actually PNG. Keep it intact; serve a correctly named copy.
if (full.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Expected the supplied transparent PNG artwork.');
await writeFile(new URL('logo-mello-mosna-completo.png', assets), full);
const browser = await chromium.launch();
let encoded;
try {
  const page = await browser.newPage();
  encoded = await page.evaluate(async ({ full, icon }) => {
    const load = async (data) => { const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode(); return image; };
    const [logo, monogram] = await Promise.all([load(full), load(icon)]);
    const render = (image, width, height, type, background = '') => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, width, height); }
      ctx.imageSmoothingQuality = 'high';
      const scale = Math.min(width / image.width, height / image.height) * (background ? .92 : 1);
      const w = image.width * scale, h = image.height * scale;
      ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
      return canvas.toDataURL(type, .92).split(',')[1];
    };
    return {
      'logo-mello-mosna-272.webp': render(logo, 272, 136, 'image/webp'),
      'logo-mello-mosna-544.webp': render(logo, 544, 272, 'image/webp'),
      'icone-mello-mosna.png': render(monogram, 192, 192, 'image/png'),
      'apple-touch-icon.png': render(monogram, 180, 180, 'image/png', '#0a182e'),
      'compartilhamento.png': render(logo, 1200, 630, 'image/png', '#0a182e'),
    };
  }, { full: full.toString('base64'), icon: icon.toString('base64') });
} finally { await browser.close(); }
for (const [name, data] of Object.entries(encoded)) await writeFile(new URL(name, assets), Buffer.from(data, 'base64'));
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="24" fill="#0a182e"/><image width="192" height="192" href="data:image/png;base64,${encoded['icone-mello-mosna.png']}"/></svg>`;
await writeFile(new URL('../public/favicon.svg', import.meta.url), favicon);
