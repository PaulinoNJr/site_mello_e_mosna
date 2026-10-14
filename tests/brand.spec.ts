import { expect, test } from '@playwright/test';

test('official artwork loads without distortion and remains inside the header and footer', async ({ page }) => {
  for (const viewport of [{ width: 320, height: 740 }, { width: 844, height: 390 }, { width: 1024, height: 1366 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const container of ['header', 'footer']) {
      const logo = page.locator(`${container} .brand img`);
      await expect(logo).toHaveAttribute('alt', /Mello & Mosna/);
      await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      expect(await logo.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(container === 'header' ? /icone-mello-mosna\.png$/ : /logo-mello-mosna-(272|544)\.webp$/);
      expect(await logo.evaluate((image: HTMLImageElement) => {
        const canvas = document.createElement('canvas'); canvas.width = 1; canvas.height = 1;
        const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, 1, 1).data[3];
      })).toBe(0);
      const dimensions = await logo.evaluate(image => {
        const bounds = image.getBoundingClientRect();
        return { ratio: bounds.width / bounds.height, left: bounds.left, right: bounds.right };
      });
      expect(dimensions.ratio).toBeCloseTo(container === 'header' ? 1 : 2, 2);
      expect(dimensions.left).toBeGreaterThanOrEqual(0);
      expect(dimensions.right).toBeLessThanOrEqual(viewport.width);
    }
    const insideHeader = await page.locator('header .brand img').evaluate(image => {
      const logo = image.getBoundingClientRect();
      const header = document.querySelector('header')!.getBoundingClientRect();
      return logo.top >= header.top && logo.bottom <= header.bottom;
    });
    expect(insideHeader).toBe(true);
  }
});

test('production social previews and structured data identify the official artwork', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:4180/');
  const html = await response.text();
  expect(html).toContain('content="https://mellomosnaseguros.com.br/assets/compartilhamento.png"');
  expect(html).toContain('property="og:image:width" content="1200"');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1]);
  expect(schema['@graph'][0].logo.url).toBe('https://mellomosnaseguros.com.br/assets/logo-mello-mosna-completo.png');
  const logo = await request.get('http://127.0.0.1:4180/assets/logo-mello-mosna-completo.png');
  expect(logo.ok()).toBe(true);
  expect(logo.headers()['content-type']).toContain('image/png');
  expect((await logo.body()).subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  const favicon = await request.get('http://127.0.0.1:4180/favicon.svg');
  expect(favicon.ok()).toBe(true);
  expect(await favicon.text()).toContain('data:image/png;base64,');
  expect((await request.get('http://127.0.0.1:4180/assets/apple-touch-icon.png')).ok()).toBe(true);
});
