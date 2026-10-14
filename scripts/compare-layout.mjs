import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const source = JSON.parse(await fs.readFile('reference-captures/measurements.json', 'utf8'));
const selectors = ['header', 'h1', '.hero-container', '#servicos h2', '.services-grid', '.service-card', '#sobre img', '#contato input', 'footer'];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const comparison = [];
try {
  for (const reference of source.measurements) {
    await page.setViewportSize(reference.viewport);
    await page.goto('http://127.0.0.1:5173');
    await page.evaluate(() => document.fonts.ready);
    const replica = await page.evaluate(selectors => selectors.map(selector => {
      const el = document.querySelector(selector), css = getComputedStyle(el), rect = el.getBoundingClientRect();
      return { selector, fontFamily: css.fontFamily, fontSize: css.fontSize, fontWeight: css.fontWeight,
        lineHeight: css.lineHeight, letterSpacing: css.letterSpacing, textTransform: css.textTransform,
        background: css.backgroundColor, radius: css.borderRadius, gridColumns: css.gridTemplateColumns,
        gap: css.gap, padding: css.padding, bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
    }), selectors);
    comparison.push({ viewport: reference.viewport, elements: replica.map((element, i) => ({
      reference: reference.elements[i], replica: element,
      delta: Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, element.bounds[key] - reference.elements[i].bounds[key]])),
    })) });
  }
  await fs.writeFile('reference-captures/comparison.json', JSON.stringify(comparison, null, 2));
  for (const entry of comparison) console.log(entry.viewport.width, entry.elements.map(e => ({ selector: e.replica.selector, delta: e.delta })));
} finally { await browser.close(); }
