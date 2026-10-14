import { expect, test } from '@playwright/test';

const names = ['Auto', 'Residencial', 'Empresarial', 'Vida', 'Moto', 'Saúde', 'Pet', 'Viagem',
  'Consórcio e Previdência', 'Fiança Locatícia', 'RC Profissional', 'Condomínio', 'Celular',
  'Aparelhos Eletrônicos', 'Placas Solares', 'Veículos Elétricos', 'Capitalização'];

test('service rejection preserves input and allows retry', async ({ page }) => {
  await page.goto('/tests/fixtures/form.html');
  await page.getByLabel('Nome completo').fill('Pessoa Teste');
  await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
  await page.getByLabel('Telefone', { exact: true }).fill('19900000000');
  await page.getByLabel('Tipo de seguro').selectOption('Auto');
  await page.locator('.submit-button').click();
  await expect(page.locator('.submit-button')).toBeDisabled();
  await expect(page.getByRole('alert')).toContainText('Não foi possível concluir a demonstração');
  await expect(page.getByLabel('Nome completo')).toHaveValue('Pessoa Teste');
  await expect(page.locator('.submit-button')).toBeEnabled();
});

test('content, destinations, native validation and demo without network writes', async ({ page }) => {
  const writes: string[] = [];
  page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('.service-card h3')).toHaveText(names);
  await expect(page.locator('select option')).toHaveCount(19);
  await expect(page.locator('select option').first()).toHaveAttribute('value', '');
  await expect(page.locator('select option').last()).toHaveText('Outro');
  await expect(page.locator('input[required], select[required], textarea[required]')).toHaveCount(4);
  await expect(page.locator('textarea')).not.toHaveAttribute('required');
  for (const anchor of ['topo', 'servicos', 'diferenciais', 'sobre', 'depoimentos', 'contato']) {
    await expect(page.locator(`section#${anchor}`)).toHaveCount(1);
  }
  for (const button of [page.locator('.header-actions > .button'), page.locator('.hero-buttons > .button.gold')]) {
    await expect(button).toHaveAttribute('href', 'https://wa.me/5519983422822?text=Gostaria%20de%20uma%20cota%C3%A7%C3%A3o%20de%20seguro!');
    await expect(button).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await expect(page.locator('.hero-buttons .outline')).toHaveAttribute('href', '#servicos');
  for (const link of await page.locator('a[aria-label="WhatsApp"]').all()) {
    await expect(link).toHaveAttribute('href', 'https://wa.me/5519983422822?text=Gostaria%20de%20uma%20cota%C3%A7%C3%A3o%20de%20seguro!');
  }
  await expect(page.locator('.desktop-nav a').last()).toHaveAttribute('href', '#contato');
  await expect(page.locator('footer a[href="tel:+5519983556682"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="mailto:atendimento@mellomosnaseguros.com.br"]')).toHaveCount(1);
  await expect(page.locator('footer nav[aria-label="Serviços"] a[href="#servicos"]')).toHaveCount(4);
  await expect(page.locator('footer nav[aria-label="Legal"] a[href="#"]')).toHaveCount(2);
  await page.locator('.submit-button').click();
  await expect(page.locator('#nome:invalid')).toHaveCount(1);
  await page.getByLabel('Nome completo').fill('Pessoa Teste');
  await page.getByLabel('E-mail', { exact: true }).fill('invalid');
  await expect(page.locator('#email:invalid')).toHaveCount(1);
  await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
  await page.getByLabel('Telefone', { exact: true }).fill('19900000000');
  await page.getByLabel('Tipo de seguro').selectOption('Auto');
  await page.locator('.submit-button').click();
  await expect(page.getByRole('status')).toContainText('Sua solicitação não foi enviada');
  await expect(page.getByRole('status')).toBeFocused();
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await page.getByRole('button', { name: 'Voltar ao formulário' }).click();
  await expect(page.getByLabel('Nome completo')).toHaveValue('');
});

for (const [width, height] of [[1440, 900], [1280, 800], [768, 1024], [390, 844], [360, 800]]) {
  test(`responsive ${width}x${height}, anchors, assets and console`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.office-photo').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('.office-photo img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const columns = await page.locator('.services-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width >= 1024 ? 4 : width >= 640 ? 3 : 2);
    await page.goto('/#servicos');
    await expect.poll(() => page.locator('#servicos').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(80);
    await page.reload();
    await expect.poll(() => page.locator('#servicos').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(80);
    if (width < 1024) {
      const menu = page.locator('.menu-toggle');
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toBeFocused();
    }
    for (const [, hash] of [['Serviços', 'servicos'], ['Diferenciais', 'diferenciais'], ['Sobre', 'sobre'], ['Depoimentos', 'depoimentos'], ['Contato', 'contato']]) {
      if (width < 1024) await page.getByRole('button', { name: 'Abrir menu' }).click();
      const nav = width < 1024 ? '.mobile-nav' : '.desktop-nav';
      await page.locator(`${nav} a[href="#${hash}"]`).click();
      await expect.poll(() => page.locator(`#${hash}`).evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeGreaterThanOrEqual(79);
      await expect.poll(() => page.locator(`#${hash}`).evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThanOrEqual(81);
      await expect(page.locator(`#${hash} h2`)).toBeInViewport();
    }
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: testInfo.outputPath(`${width}x${height}.png`), fullPage: true });
    await page.screenshot({ path: testInfo.outputPath(`${width}x${height}-hero.png`) });
    expect(errors).toEqual([]);
  });
}
