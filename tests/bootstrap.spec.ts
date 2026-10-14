import { expect, test } from '@playwright/test';

test('mobile drawer keeps keyboard focus, closes with Escape and navigates to contact', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Abrir menu' });
  await opener.click();
  const drawer = page.getByRole('dialog', { name: 'Explore o site' });
  await expect(drawer).toBeVisible();
  await expect(opener).toHaveAttribute('aria-expanded', 'true');
  await drawer.getByRole('button', { name: 'Fechar menu' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Tab');
  await expect.poll(() => drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(opener).toBeFocused();
  await opener.click();
  await drawer.locator('a[href="#contato"]').click();
  await expect(drawer).toHaveCount(0);
  await expect(page.locator('#contato h2')).toBeInViewport();
  await expect(page.locator('.desktop-nav a[href="#contato"]')).toHaveAttribute('aria-current', 'location');
  await expect(page.locator('.mobile-contact-bar a.button')).toHaveAttribute('href', 'https://wa.me/5519983422822?text=Gostaria%20de%20uma%20cota%C3%A7%C3%A3o%20de%20seguro!');
});

test('forms expose Bootstrap controls and keep native required validation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#nome')).toHaveClass(/form-control/);
  await expect(page.locator('#tipo')).toHaveClass(/form-select/);
  await expect(page.locator('.service-card.card')).toHaveCount(18);
  await page.locator('.submit-button').click();
  await expect(page.locator('#nome:invalid')).toHaveCount(1);
  await expect(page.locator('.demo-result')).toHaveCount(0);
});
