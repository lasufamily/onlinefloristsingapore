import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const knowledgePages = JSON.parse(readFileSync(new URL('../../src/data/knowledge-pages.json', import.meta.url), 'utf8')) as { path: string }[];
const faqEntries = JSON.parse(readFileSync(new URL('../../src/data/faq.json', import.meta.url), 'utf8')) as { slug: string }[];
const knowledgePaths = new Set(knowledgePages.map(({ path }) => path));
const canonicalPaths = [
  '/',
  '/faq/',
  '/about/',
  '/contact/',
  '/privacy/',
  ...knowledgePages.map(({ path }) => path),
  ...faqEntries.map(({ slug }) => `/faq/${slug}/`),
];

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
  '/gift-ideas/with-flowers/',
  '/gift-ideas/wife/',
  '/hampers/newborn/',
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
  await expect(page.locator('.desktop-nav a')).toHaveText(['Flowers', 'Plants', 'Occasions', 'Gift Ideas', 'FAQ']);
  await expect(page.locator('.site-footer .brand img')).toHaveCount(0);
  await expect(page.locator('.site-footer nav')).toHaveText([
    'AboutAbout UsContactPrivacy',
    'LearnFlowersArrangementsPlantsGuidesFAQ',
    'GiftingOccasionsFlowers ForGift IdeasHampers',
  ]);
  const logoBox = await headerLogo.boundingBox();
  expect(logoBox?.height).toBeGreaterThanOrEqual(testInfo.project.name === 'mobile' ? 110 : 140);
  await expect(page.locator('.eyebrow, .article-marker, .topic-card .copy > span, .link-card > span')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Flowers for real Singapore occasions');
  await expect(page.locator('.topic-card')).toHaveCount(9);
  await expect(page.locator('.popular-questions a:not(.all-questions)')).toHaveCount(6);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onlinefloristsingapore.com/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon-32x32.png');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
});

test('all canonical pages meet the on-page SEO baseline', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One full-site crawl is sufficient');
  test.setTimeout(180_000);
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const path of canonicalPaths) {
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response?.status(), path).toBe(200);
    await page.locator('main').waitFor();

    const headings = await page.locator('main h1, main h2, main h3').evaluateAll((elements) =>
      elements.map((element) => Number(element.tagName.slice(1))),
    );
    const isFaqDirectory = path === '/faq/';
    const isFaqAnswer = path.startsWith('/faq/') && !isFaqDirectory;
    expect(headings.filter((level) => level === 1), `${path} must have one H1`).toHaveLength(1);
    if (isFaqAnswer) {
      expect(headings, `${path} must keep the answer page simple`).toEqual([1]);
    } else {
      expect(headings.includes(2), `${path} must have an H2`).toBe(true);
      if (knowledgePaths.has(path)) expect(headings.includes(3), `${path} must use H3s below its H2 sections`).toBe(true);
    }
    expect(
      headings.every((level, index) => index === 0 || level <= headings[index - 1] + 1),
      `${path} must not skip heading levels`,
    ).toBe(true);

    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title.length, `${path} title length`).toBeGreaterThanOrEqual(30);
    expect(title.length, `${path} title length`).toBeLessThanOrEqual(65);
    expect(description?.length, `${path} description length`).toBeGreaterThanOrEqual(110);
    expect(description?.length, `${path} description length`).toBeLessThanOrEqual(160);
    expect(titles.has(title), `${path} title must be unique`).toBe(false);
    expect(descriptions.has(description ?? ''), `${path} description must be unique`).toBe(false);
    titles.add(title);
    descriptions.add(description ?? '');

    await expect(page.locator('link[rel="canonical"]'), `${path} canonical`).toHaveAttribute('href', `https://onlinefloristsingapore.com${path}`);
    await expect(page.locator('meta[name="robots"][content*="noindex"]'), `${path} must be indexable`).toHaveCount(0);
    const imageAlts = await page.locator('main img').evaluateAll((images) => images.map((image) => image.getAttribute('alt')?.trim() ?? ''));
    expect(imageAlts.every(Boolean), `${path} images need alt text`).toBe(true);

    const wordCount = await page.locator('main').innerText().then((text) => text.trim().split(/\s+/).filter(Boolean).length);
    if (!isFaqDirectory && !isFaqAnswer) expect(wordCount, `${path} main content`).toBeGreaterThanOrEqual(200);
    await expect(page.locator('.eyebrow, .article-marker, .topic-card .copy > span, .link-card > span'), path).toHaveCount(0);
  }
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
  await expect(page.locator('.faq-overview')).toHaveCount(0);
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
  await expect(page.locator('.breadcrumbs, .faq-guidance, .source-note, .faq-next')).toHaveCount(0);
  await expect(page.locator('.faq-page > *')).toHaveCount(2);
});

test('mobile navigation exposes the knowledge hubs', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only interaction');
  await page.goto('/');
  await page.locator('.mobile-nav summary').click();
  await expect(page.locator('.mobile-panel')).toBeVisible();
  await expect(page.locator('.mobile-panel a')).toHaveText(['Flowers', 'Plants', 'Occasions', 'Gift Ideas', 'FAQ']);
});

test('contact form posts a simple required message to Formspark', async ({ page }) => {
  await page.goto('/contact/');
  const form = page.locator('#contact-form');

  await expect(form).toHaveAttribute('action', 'https://submit-form.com/6Aa3k1TjD');
  await expect(form).toHaveAttribute('method', 'POST');
  await expect(form.locator('input, textarea')).toHaveCount(4);

  for (const name of ['name', 'phone', 'email', 'message']) {
    await expect(form.locator(`[name="${name}"]`)).toHaveAttribute('required', '');
    await expect(form.locator(`label[for="${name}"] .required-marker`)).toHaveText('*');
  }

  await expect(form.locator('[name="phone"]')).toHaveAttribute('pattern', '[0-9]{8}');
  await expect(form.locator('[name="phone"]')).toHaveAttribute('inputmode', 'numeric');
  await expect(form.locator('[name="phone"]')).toHaveAttribute('maxlength', '8');
  await expect(form.locator('select, input[name="deliveryDate"], input[name="deliveryPostalCode"], input[name="budget"], input[name="product"], input[name="consent"]')).toHaveCount(0);
});

test('contact page centers the form without guidance items', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('.enquiry-intro .trust-item')).toHaveCount(0);
  const layout = page.locator('.enquiry-layout');
  const form = page.locator('.enquiry-layout > .enquiry-form');
  const layoutBox = await layout.boundingBox();
  const formBox = await form.boundingBox();

  expect(layoutBox).not.toBeNull();
  expect(formBox).not.toBeNull();
  expect(formBox!.width).toBeLessThanOrEqual(780);
  expect(Math.abs(layoutBox!.x + layoutBox!.width / 2 - (formBox!.x + formBox!.width / 2))).toBeLessThan(1);
});

test('contact form acknowledges a successful submission on the page', async ({ page }) => {
  await page.route('https://submit-form.com/6Aa3k1TjD', async (route) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    await route.fulfill({
      status: route.request().method() === 'OPTIONS' ? 204 : 200,
      headers,
      contentType: 'application/json',
      body: route.request().method() === 'OPTIONS' ? '' : '{}',
    });
  });
  await page.goto('/contact/');
  await page.waitForTimeout(150);

  await page.locator('[name="name"]').fill('Jamie Tan');
  await page.locator('[name="phone"]').fill('81234567');
  await page.locator('[name="email"]').fill('jamie@example.com');
  await page.locator('[name="message"]').fill('I found an outdated guide.');
  await expect(page.locator('[name="name"]')).toHaveValue('Jamie Tan');
  expect(await page.locator('#contact-form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(true);
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByRole('status')).toHaveText('Thanks, we received your message.');
});

test('legacy media remains unrestored', async ({ request }) => {
  const response = await request.get('/wp-content/uploads/2020/01/legacy-flower.jpg');
  expect(response.status()).toBe(404);
});
