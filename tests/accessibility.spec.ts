import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 390]) {
  test(`WCAG automated checks at ${width}px, including open mobile menu`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:4180/');
    await page.evaluate(() => document.fonts.ready);
    const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
    const report = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(report.violations, JSON.stringify(report.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), null, 2)).toEqual([]);
    if (width < 1024) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.getByRole('dialog', { name: 'Explore o site' })).toBeVisible();
      const menuReport = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(menuReport.violations, JSON.stringify(menuReport.violations, null, 2)).toEqual([]);
    }
  });
}
