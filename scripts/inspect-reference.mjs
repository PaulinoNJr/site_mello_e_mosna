// Read-only visual QA: all non-GET/HEAD requests are blocked before transmission.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const blocked = [];
await page.route('**/*', route => {
  if (!['GET', 'HEAD'].includes(route.request().method())) {
    blocked.push({ method: route.request().method(), url: route.request().url() });
    return route.abort();
  }
  return route.continue();
});
await fs.mkdir('reference-captures', { recursive: true });
try {
  const measurements = [];
  for (const [width, height] of [[1440, 900], [1280, 800], [768, 1024], [390, 844], [360, 800]]) {
    await page.setViewportSize({ width, height });
    await page.goto('https://dainty-launch-pixel-flow.base44.app/', { waitUntil: 'domcontentloaded' });
    await page.locator('#topo').waitFor({ timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#sobre').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('#sobre img')).every(img => img.complete && img.naturalWidth > 0));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    measurements.push(await page.evaluate(() => {
      const selectors = ['header', 'h1', '#topo > div:last-child', '#servicos h2', '#servicos .grid', '#servicos .grid > div', '#sobre img', '#contato input', 'footer'];
      return { viewport: { width: innerWidth, height: innerHeight }, overflow: document.documentElement.scrollWidth > innerWidth,
        elements: selectors.map(selector => {
          const el = document.querySelector(selector);
          if (!el) return { selector, found: false };
          const css = getComputedStyle(el), rect = el.getBoundingClientRect();
          return { selector, fontFamily: css.fontFamily, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight,
            letterSpacing: css.letterSpacing, textTransform: css.textTransform, background: css.backgroundColor,
            radius: css.borderRadius, gridColumns: css.gridTemplateColumns, gap: css.gap, padding: css.padding,
            bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
        }) };
    }));
    await page.screenshot({ path: `reference-captures/${width}x${height}.png`, fullPage: true });
    await page.screenshot({ path: `reference-captures/${width}x${height}-hero.png` });
    if (width < 1024) {
      await page.locator('header button').click();
      await page.screenshot({ path: `reference-captures/${width}x${height}-menu.png` });
      await page.locator('header nav a[href="#contato"]:visible').click();
      await page.locator('#contato h2').waitFor();
    }
  }
  await fs.writeFile('reference-captures/measurements.json', JSON.stringify({ measurements, blockedWrites: blocked }, null, 2));
  console.log('Reference screenshots and computed styles captured for all five viewports; writes blocked.');
} finally { await browser.close(); }
