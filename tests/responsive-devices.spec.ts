import { expect, test } from '@playwright/test';

test.use({ hasTouch: true, deviceScaleFactor: 2 });

const viewports = [
  [280, 653], [320, 568], [344, 882], [360, 640], [375, 667], [390, 844],
  [412, 915], [430, 932], [540, 720], [600, 960], [639, 900], [640, 900],
  [667, 375], [740, 360], [768, 1024], [800, 1280], [820, 1180], [834, 1194],
  [912, 1368], [1023, 768], [1024, 768], [1112, 834], [1180, 820], [1194, 834],
  [1279, 800], [1280, 800], [1366, 1024],
];

for (const [width, height] of viewports) {
  test(`touch layout ${width}x${height}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4180/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const outside = await page.evaluate(() => Array.from(document.querySelectorAll(
      'h1,h2,h3,.national-badge,.brand,.hero-buttons .button,.contact-direct .button,.footer-national,.footer-contact a,input,select,textarea',
    )).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
    }).map(el => ({ tag: el.tagName, text: el.textContent?.slice(0, 60) })));
    expect(outside).toEqual([]);
    const clipped = await page.locator('h1,h2,h3,.national-badge').evaluateAll(elements => elements
      .filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2).map(el => el.textContent));
    expect(clipped).toEqual([]);
    const columns = await page.locator('.services-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width < 340 ? 1 : width < 640 ? 2 : width < 1024 ? 3 : 4);
    if (width < 1280) {
      await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
      const gap = await page.evaluate(() => document.querySelector('.menu-toggle')!.getBoundingClientRect().left - document.querySelector('header .brand')!.getBoundingClientRect().right);
      expect(gap).toBeGreaterThanOrEqual(7);
    } else {
      await expect(page.locator('.desktop-nav')).toBeVisible();
    }
    if ([280, 768, 1024, 1194].includes(width)) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      const drawer = page.getByRole('dialog', { name: 'Explore o site' });
      await expect(drawer).toBeVisible();
      await drawer.locator('a[href="#servicos"]').click();
      await expect(drawer).toHaveCount(0);
    }
    await page.locator('#contato').scrollIntoViewIfNeeded();
    await page.getByLabel('Nome completo').fill('Pessoa Teste');
    await expect(page.locator('.mobile-contact-bar')).not.toBeVisible();
    expect(await page.getByLabel('Nome completo').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    await page.getByLabel('Nome completo').blur();
    if (width < 768 && height > 500) {
      await expect(page.locator('.mobile-contact-bar')).toBeVisible();
      await expect.poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom) - document.querySelector('.mobile-contact-bar')!.getBoundingClientRect().height)).toBeGreaterThanOrEqual(-1);
    }
    else await expect(page.locator('.mobile-contact-bar')).not.toBeVisible();
    await page.goto('http://127.0.0.1:4180/#servicos');
    const expectedOffset = width < 1280 && height <= 500 ? 64 : 80;
    await expect.poll(() => page.locator('#servicos').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(expectedOffset);
    if ([280, 320, 390, 667, 820, 1024, 1194, 1366].includes(width)) {
      await page.goto('http://127.0.0.1:4180/');
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: testInfo.outputPath(`${width}x${height}.png`) });
    }
    expect(errors).toEqual([]);
  });
}

test('rotation, scrollable short menu and return to desktop layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4180/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const drawer = page.getByRole('dialog', { name: 'Explore o site' });
  await expect(drawer).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(drawer).toBeVisible();
  await drawer.locator('a[href="#contato"]').click();
  await expect(drawer).toHaveCount(0);
  await expect(page.locator('#contato h2')).toBeInViewport();
  await expect(page.locator('.mobile-contact-bar')).not.toBeVisible();
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.setViewportSize({ width: 1366, height: 1024 });
  await expect(drawer).toHaveCount(0);
  await expect(page.locator('.desktop-nav')).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
});

test('increased default text size still fits a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('http://127.0.0.1:4180/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
  await page.locator('#contato').scrollIntoViewIfNeeded();
  await expect(page.getByLabel('Nome completo')).toBeVisible();
});
