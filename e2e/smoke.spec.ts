import { expect, test } from '@playwright/test';

test('homepage shows the hero and a playable game, with no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mohsen Ghaemmaghami' })).toBeVisible();
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', /\.pdf$/);
  const canvas = page.getByRole('img', { name: /brick breaker/i }).or(page.locator('canvas.game__canvas'));
  await expect(canvas.first()).toBeVisible();

  await canvas.first().click();            // take over from attract mode / start on mobile
  await page.keyboard.type('');            // focus
  await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight');
  await page.keyboard.press('b'); await page.keyboard.press('a');
  await expect(page.getByText('CAREER CLEARED!')).toBeVisible();   // Konami cheat reveals everything
  await expect(page.getByText(/LEVELS 9\/9/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('content pages render from profile and articles', async ({ page }) => {
  await page.goto('/timeline');
  await expect(page.getByText('Lambda Curry')).toBeVisible();
  await page.goto('/skills');
  await expect(page.getByText(/center a div/)).toBeVisible();
  await page.goto('/articles');
  await page.getByRole('link', { name: /hello, world/i }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hello, world');
  await page.goto('/cv');
  await expect(page.getByText('Experience')).toBeVisible();
});
