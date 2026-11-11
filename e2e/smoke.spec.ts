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
  await expect(page.getByText(/SCORE \d{6}/)).toBeVisible();
  expect(errors).toEqual([]);
});

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

test('Konami code opens the Scope Creep egg over a paused breaker, and closing it resumes play', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await page.locator('body').click({ position: { x: 2, y: 2 } }); // make sure the page has focus
  for (const k of KONAMI) await page.keyboard.press(k);
  const egg = page.getByRole('dialog', { name: 'Scope Creep' });
  await expect(egg).toBeVisible();
  for (const name of ['BUG', 'DEADLINE', 'SCOPE CREEP', 'LEGACY']) await expect(egg.getByRole('listitem').filter({ hasText: new RegExp(`^${name}$`) })).toBeVisible();
  await expect(egg.locator('canvas.egg__canvas')).toBeVisible();

  await egg.getByRole('button', { name: /close scope creep/i }).click();
  await expect(egg).toBeHidden();
  const canvas = page.locator('canvas.game__canvas');
  await expect(canvas).toBeVisible();
  await canvas.click();                     // the breaker still takes input after the egg closes
  await expect(page.getByText(/SCORE \d{6}/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('10 quick taps on the marquee logo open the egg too (touch path)', async ({ page }) => {
  await page.goto('/');
  const logo = page.locator('.marquee__logo');
  for (let i = 0; i < 10; i++) await logo.click();
  await expect(page.getByRole('dialog', { name: 'Scope Creep' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Scope Creep' })).toBeHidden();
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
