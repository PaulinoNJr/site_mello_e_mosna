import { expect, test } from '@playwright/test';

test('production HTML contains the business, services and FAQs before JavaScript', async ({ browser, request }) => {
  const response = await request.get('http://127.0.0.1:4180/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('application/ld+json');
  expect(html).not.toContain('<!--seo-start-->');
  expect(html).not.toContain('<div id="root"></div>');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4180/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Corretora de seguros em Hortolândia');
  await expect(page.locator('.service-card')).toHaveCount(17);
  await page.locator('.office-photo').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.office-photo img').evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.webp$/);
  await page.evaluate(() => document.fonts.ready);
  const fontRequests = await page.evaluate(() => performance.getEntriesByType('resource').map(item => item.name).filter(name => /\.(woff2|ttf)$/.test(name)));
  expect(fontRequests.some(name => name.endsWith('.woff2'))).toBe(true);
  expect(fontRequests.some(name => name.endsWith('.ttf'))).toBe(false);
  await expect(page.locator('.contact-faq details')).toHaveCount(4);
  await page.locator('.contact-faq summary').first().click();
  await expect(page.locator('.contact-faq details').first()).toHaveAttribute('open', '');
  await expect(page.locator('.contact-faq details p').first()).toBeVisible();
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}');
  expect(schema['@graph'][0]['@type']).toBe('Organization');
  expect(schema['@graph'][0].aggregateRating).toBeUndefined();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Hortolândia, Sumaré e Campinas/);
  await context.close();
});

test('production hydration preserves the static HTML and interactive menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('http://127.0.0.1:4180/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.locator('.mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-nav')).toHaveCount(0);
  await expect(page.locator('.service-card')).toHaveCount(17);
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  const canonical = page.locator('link[rel="canonical"]');
  if (robots?.startsWith('index,')) {
    await expect(canonical).toHaveCount(1);
    const url = await canonical.getAttribute('href');
    const sitemap = await page.request.get('http://127.0.0.1:4180/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain(`<loc>${url}</loc>`);
  } else {
    expect(robots).toContain('noindex');
  }
  const crawl = await page.request.get('http://127.0.0.1:4180/robots.txt');
  expect(await crawl.text()).toContain('Allow: /');
  expect(errors).toEqual([]);
});
