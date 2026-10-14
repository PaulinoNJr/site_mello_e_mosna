import { expect, test } from '@playwright/test';
import { createGoogleHarness } from './fixtures/google-script.mjs';
import AxeBuilder from '@axe-core/playwright';

test('old testimonials are removed and unavailable storage never reports a successful submission', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.testimonial-card')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('Mariana Costa');
  await page.locator('.reviews-frame').scrollIntoViewIfNeeded();
  const widget = page.frameLocator('.reviews-frame');
  await expect(widget.locator('#published-section')).toBeVisible();
  await expect(widget.locator('#reviews')).toContainText('Ainda não há avaliações publicadas');
  await expect(widget.getByLabel('Nome para publicação')).toBeVisible();
  await expect(widget.getByRole('button', { name: 'Enviar avaliação para análise' })).toBeDisabled();
  await expect(widget.locator('#availability')).toContainText('estará disponível em breve');
  await expect(widget.locator('#success')).toBeHidden();
});

test('customer submission persists pending, approval publishes, rejection withdraws and HTML stays inert', async ({ page }) => {
  const backend = createGoogleHarness();
  await page.exposeFunction('__reviewCall', (method: string, values: unknown) => method === 'enviarAvaliacao' ? backend.submit(values) : backend.list());
  await page.addInitScript(() => {
    const runner = (success: (value: unknown) => void = () => {}, failure: (error: unknown) => void = () => {}) => ({
      withSuccessHandler: (handler: typeof success) => runner(handler, failure),
      withFailureHandler: (handler: typeof failure) => runner(success, handler),
      enviarAvaliacao: (payload: unknown) => (window as any).__reviewCall('enviarAvaliacao', payload).then(success, failure),
      listarAprovadas: () => (window as any).__reviewCall('listarAprovadas').then(success, failure),
    });
    (window as any).google = { script: { run: runner() } };
  });
  await page.goto('/reviews-preview.html');
  await page.getByLabel('Nome para publicação').fill('Cliente Teste');
  await page.getByLabel('E-mail para contato').fill('teste@example.com');
  await page.getByLabel('4 estrelas', { exact: true }).check();
  await page.getByLabel('Conte sua experiência').fill('Ótimo atendimento. <img src=x onerror=alert(1)>');
  await page.getByLabel('Autorizo a publicação', { exact: false }).check();
  await page.getByRole('button', { name: 'Enviar avaliação para análise' }).click();
  await expect(page.locator('#success')).toBeVisible();
  expect(backend.rows[1][8]).toBe('PENDENTE'); expect(backend.list()).toHaveLength(0);
  await page.reload(); await expect(page.locator('.review-card')).toHaveCount(0);
  backend.rows[1][8] = 'APROVADO';
  await page.reload(); await expect(page.locator('.review-card')).toHaveCount(1);
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const separate = await page.evaluate(() => {
      const published = document.getElementById('published-section')!.getBoundingClientRect();
      const form = document.getElementById('submission-section')!.getBoundingClientRect();
      return published.bottom + 20 <= form.top;
    });
    expect(separate).toBe(true);
  }
  await expect(page.locator('.review-card blockquote')).toContainText('<img src=x');
  await expect(page.locator('.review-card img')).toHaveCount(0);
  await expect(page.getByRole('img', { name: '4 de 5 estrelas' })).toBeVisible();
  await expect(page.locator('#reviews')).not.toContainText('teste@example.com');
  backend.rows[1][8] = 'RECUSADO';
  await page.reload(); await expect(page.locator('.review-card')).toHaveCount(0);
});

test('review form fits a narrow phone and passes selected WCAG checks', async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 740 });
  await page.goto('/reviews-preview.html');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const report = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(report.violations).toEqual([]);
});
