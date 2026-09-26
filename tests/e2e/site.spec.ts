import { expect, test } from '@playwright/test';

const representativePaths = [
  '/',
  '/flowers/',
  '/flowers/fresh/',
  '/flowers/fresh/roses/',
  '/flowers/fresh/roses/white-roses-meaning/',
  '/occasions/condolence/condolence-messages/',
  '/flowers-for/girlfriend/',
  '/flowers-for/teacher/',
  '/bouquets-and-arrangements/bridal-bouquets/',
  '/gifts/hampers/newborn/',
  '/plants/indoor/low-light/',
  '/guides/same-day-flower-delivery/',
  '/flower-culture/vanda-miss-joaquim/',
  '/faq/',
  '/faq/how-to-dry-flowers/',
];

test('homepage presents a knowledge-first flower guide', async ({ page }, testInfo) => {
  await page.goto('/');
  const headerBrand = page.locator('.site-header').getByLabel('Hyper Florist home');
  const headerLogo = headerBrand.getByRole('img', { name: 'Hyper Florist logo' });
  await expect(headerBrand).toBeVisible();
  await expect(headerLogo).toBeVisible();
  await expect(page.locator('.site-header .brand span')).toHaveCount(0);
  await expect(page.locator('.site-footer .brand img')).toHaveCount(0);
  const logoBox = await headerLogo.boundingBox();
  expect(logoBox?.height).toBeGreaterThanOrEqual(testInfo.project.name === 'mobile' ? 54 : 70);
  await expect(page.locator('.hero .eyebrow')).toHaveText('Hyper Florist');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Flowers for real Singapore occasions');
  await expect(page.locator('.topic-card')).toHaveCount(8);
  await expect(page.locator('.popular-questions a:not(.all-questions)')).toHaveCount(6);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onlinefloristsingapore.com/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon-32x32.png');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
});

test('representative knowledge routes are substantive canonical pages', async ({ page }) => {
  for (const path of representativePaths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }), path).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute('href', `https://onlinefloristsingapore.com${path}`);
  }
});

test('FAQ directory lists questions without answers', async ({ page }) => {
  await page.goto('/faq/');
  await expect(page.locator('.faq-directory a')).toHaveCount(23);
  await expect(page.locator('.faq-answer')).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).not.toContainText('FAQPage');
});

test('FAQ answer page uses the exact question and a single answer paragraph', async ({ page }) => {
  const question = 'How to dry flowers?';
  await page.goto('/faq/how-to-dry-flowers/');
  await expect(page).toHaveTitle(`${question} | Hyper Florist`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(question);
  await expect(page.locator('.faq-answer')).toHaveCount(1);
  await expect(page.locator('.faq-answer')).not.toBeEmpty();
});

test('mobile navigation exposes the knowledge hubs', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only interaction');
  await page.goto('/');
  await page.locator('.mobile-nav summary').click();
  await expect(page.locator('.mobile-panel')).toBeVisible();
  await expect(page.locator('.mobile-panel a[href="/flowers-for/"]')).toBeVisible();
  await expect(page.locator('.mobile-panel a[href="/faq/"]')).toBeVisible();
});

test('legacy media remains unrestored', async ({ request }) => {
  const response = await request.get('/wp-content/uploads/2020/01/legacy-flower.jpg');
  expect(response.status()).toBe(404);
});
