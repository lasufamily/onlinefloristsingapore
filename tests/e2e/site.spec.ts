import { expect, test } from '@playwright/test';

const canonicalPaths = [
  '/',
  '/category/flowers/',
  '/category/funeral-flowers/',
  '/collections/birthday/',
  '/fastest-online-flower-delivery-singapore/',
  '/product-category/occasion/official-opening/',
  '/category/occasion/anniversary/',
  '/product-category/occasion/proposal/',
  '/corporate-flowers/',
  '/contact/',
  '/affordable-flowers/',
  '/category/flowers/preserved-flowers/',
  '/category/hampers/newborn-hamper/',
  '/category/occasion/graduation/',
  '/category/flowers/rose/',
];

test('homepage presents the enquiry-first storefront', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Made-to-order flowers in Singapore');
  await expect(page.locator('.category-card')).toHaveCount(8);
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expect(page.locator('#enquiry-form')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onlinefloristsingapore.com/');
});

test('every recovery page is a substantive canonical page', async ({ page }) => {
  for (const path of canonicalPaths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }), path).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), path).toHaveCount(1);
    await expect(page.locator('body'), path).not.toContainText('Launching Soon');
  }
});

test('media backlinks remain unrestored', async ({ request }) => {
  const response = await request.get('/wp-content/uploads/2020/01/legacy-flower.jpg');
  expect(response.status()).toBe(404);
});

test('mobile navigation and enquiry validation are usable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only interaction');
  await page.goto('/');
  await page.locator('.mobile-nav summary').click();
  await expect(page.locator('.mobile-panel')).toBeVisible();
  await page.locator('.mobile-panel a[href="/contact/"]').click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.locator('#name:invalid')).toHaveCount(1);
});

