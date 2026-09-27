import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { canonicalPages } from '../src/lib/site-pages';

const knowledgePath = new URL('../src/data/knowledge-pages.json', import.meta.url);
const knowledgeImagesPath = new URL('../src/data/knowledge-images.json', import.meta.url);
const faqPath = new URL('../src/data/faq.json', import.meta.url);

function loadJson<T>(url: URL): T {
  expect(existsSync(url), `${url.pathname} must exist`).toBe(true);
  return JSON.parse(readFileSync(url, 'utf8')) as T;
}

async function differenceHash(imagePath: URL): Promise<boolean[]> {
  const { data } = await sharp(fileURLToPath(imagePath))
    .resize(17, 16, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bits: boolean[] = [];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      bits.push(data[(y * 17) + x] > data[(y * 17) + x + 1]);
    }
  }
  return bits;
}

function hashSimilarity(first: boolean[], second: boolean[]): number {
  const matchingBits = first.reduce(
    (count, bit, index) => count + Number(bit === second[index]),
    0,
  );
  return matchingBits / first.length;
}

type KnowledgePage = {
  id: string;
  path: string;
  parent: string | null;
  kind: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
  sections: { heading: string; body: string }[];
  relatedPages: string[];
};

type FaqEntry = {
  id: string;
  question: string;
  slug: string;
  answer: string;
  category: string;
  relatedPages: string[];
  sources: { label: string; url: string }[];
  priority: number;
};

type KnowledgeImage = {
  path: string;
  filename: string;
  alt: string;
};

const requiredHubs = [
  '/flowers/',
  '/occasions/',
  '/flowers-for/',
  '/bouquets-and-arrangements/',
  '/gift-ideas/',
  '/hampers/',
  '/plants/',
  '/guides/',
  '/flower-culture/',
  '/faq/',
];

describe('knowledge-base content inventory', () => {
  it('defines every primary knowledge hub as a canonical page', () => {
    const paths = canonicalPages.map(({ path }) => path);
    expect(paths).toEqual(expect.arrayContaining(['/', ...requiredHubs, '/about/', '/contact/', '/privacy/']));
    expect(paths.some((path) => path.startsWith('/singapore-flower-culture/'))).toBe(false);
  });

  it('provides a broad, nested page inventory with valid parents and relationships', () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    const paths = new Set(pages.map(({ path }) => path));

    expect(pages.length).toBeGreaterThanOrEqual(75);
    expect(paths.size).toBe(pages.length);
    expect(pages.every(({ path }) => path.startsWith('/') && path.endsWith('/'))).toBe(true);
    expect(pages.every(({ parent }) => parent === null || parent === '/' || paths.has(parent))).toBe(true);
    expect(pages.every(({ relatedPages }) => relatedPages.every((path) => path === '/' || path === '/faq/' || paths.has(path)))).toBe(true);
    expect([...paths]).toEqual(expect.arrayContaining([
      '/flowers/fresh/roses/',
      '/flowers/fresh/roses/white-roses-meaning/',
      '/occasions/condolence/condolence-messages/',
      '/flowers-for/girlfriend/',
      '/flowers-for/teacher/',
      '/gift-ideas/wallets/',
      '/gift-ideas/jewellery/',
      '/gift-ideas/gadgets/',
      '/gift-ideas/with-flowers/',
      '/gift-ideas/wife/',
      '/gift-ideas/mother/',
      '/hampers/newborn/',
      '/plants/indoor/low-light/',
      '/flower-culture/vanda-miss-joaquim/',
    ]));
    expect([...paths].filter((path) => path.startsWith('/gifts/hampers/'))).toEqual([]);
    expect(paths.has('/gifts/hampers/')).toBe(false);
    expect(paths.has('/gifts/')).toBe(false);
    expect(paths.has('/hampers/wine/')).toBe(false);

    const giftIdeas = pages.find(({ path }) => path === '/gift-ideas/');
    expect(giftIdeas?.title).toBe('Gift Ideas in Singapore | Hyper Florist');
    expect(giftIdeas?.heading).toBe('Gift Ideas in Singapore');
    expect(pages.find(({ path }) => path === '/gift-ideas/wife/')?.title).toBe('Gift Ideas for Wife | Hyper Florist');
    expect(pages.find(({ path }) => path === '/gift-ideas/wife/')?.heading).toBe('Gift Ideas for Wife');
    expect(pages.find(({ path }) => path === '/gift-ideas/mother/')?.title).toBe('Gift Ideas for Mother | Hyper Florist');
    expect(pages.find(({ path }) => path === '/gift-ideas/mother/')?.heading).toBe('Gift Ideas for Mother');
  });

  it('uses unique titles, descriptions, ids, and paths', () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    for (const key of ['id', 'path', 'title', 'description'] as const) {
      expect(new Set(pages.map((page) => page[key])).size, key).toBe(pages.length);
    }
  });

  it('uses real local images with descriptive Singapore alt text', () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    const images = pages.map(({ image }) => image);

    expect(new Set(images).size).toBe(images.length);

    for (const page of pages) {
      expect(page.image, page.path).toMatch(/^\/images\/.+\.(jpg|png|webp)$/);
      expect(existsSync(new URL(`../public${page.image}`, import.meta.url)), page.image).toBe(true);
      expect(page.imageAlt, page.path).toContain('Singapore');
      expect(page.imageAlt.trim().split(/\s+/).length, page.path).toBeGreaterThanOrEqual(7);
    }
  });

  it('defines one distinct visual brief for every knowledge page', () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    const images = loadJson<KnowledgeImage[]>(knowledgeImagesPath);
    const pagePaths = pages.map(({ path }) => path).sort();
    const imagePaths = images.map(({ path }) => path).sort();

    expect(imagePaths).toEqual(pagePaths);
    expect(new Set(images.map(({ filename }) => filename)).size).toBe(images.length);
    expect(new Set(images.map(({ alt }) => alt)).size).toBe(images.length);

    for (const image of images) {
      expect(image.filename).toMatch(/^[a-z0-9-]+\.jpg$/);
      expect(image.alt).toContain('Singapore');

      const page = pages.find(({ path }) => path === image.path);
      expect(page?.image).toBe(`/images/generated/pages/${image.filename}`);
      expect(page?.imageAlt).toBe(image.alt);
    }
  });

  it('does not reuse exact or perceptually near-identical page images', async () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    const images = await Promise.all(pages.map(async (page) => {
      const imagePath = new URL(`../public${page.image}`, import.meta.url);
      const contents = readFileSync(imagePath);
      return {
        path: page.path,
        digest: createHash('sha256').update(contents).digest('hex'),
        differenceHash: await differenceHash(imagePath),
      };
    }));

    expect(new Set(images.map(({ digest }) => digest)).size).toBe(images.length);

    const repeatedPairs: string[] = [];
    for (let first = 0; first < images.length; first += 1) {
      for (let second = first + 1; second < images.length; second += 1) {
        const similarity = hashSimilarity(images[first].differenceHash, images[second].differenceHash);
        if (similarity >= 0.85) {
          repeatedPairs.push(`${images[first].path} and ${images[second].path} (${Math.round(similarity * 100)}%)`);
        }
      }
    }

    expect(repeatedPairs, repeatedPairs.join('\n')).toEqual([]);
  });

  it('does not include alcohol, wine, or non-halal meat products in public knowledge content', () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    const bannedProductTerms = /\b(wine|alcohol|champagne|prosecco|beer|liquor|whisky|whiskey|vodka|gin|rum|pork|ham|bacon|lard|non-halal|non halal)\b/i;

    for (const page of pages) {
      const publicText = [
        page.id,
        page.path,
        page.kind,
        page.title,
        page.description,
        page.heading,
        page.intro,
        page.image,
        page.imageAlt,
        ...page.sections.flatMap((section) => [section.heading, section.body]),
        ...page.relatedPages,
      ].join('\n');

      expect(publicText, page.path).not.toMatch(bannedProductTerms);
    }
  });

  it('defines the DataForSEO FAQ set with exact question-derived slugs', () => {
    const faqs = loadJson<FaqEntry[]>(faqPath);
    expect(faqs).toHaveLength(23);
    expect(new Set(faqs.map(({ slug }) => slug)).size).toBe(faqs.length);

    for (const faq of faqs) {
      const expectedSlug = faq.question
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      expect(faq.slug, faq.question).toBe(expectedSlug);
      expect(faq.answer).not.toMatch(/[\n\r]|<[^>]+>/);
      expect(faq.answer.trim().split(/\s+/).length, faq.question).toBeGreaterThanOrEqual(40);
      expect(faq.answer.trim().split(/\s+/).length, faq.question).toBeLessThanOrEqual(90);
      expect(faq.relatedPages.length).toBeGreaterThan(0);
      expect(faq.priority).toBeGreaterThan(0);
    }
  });

  it('keeps authoritative sources on pet-safety guidance', () => {
    const faqs = loadJson<FaqEntry[]>(faqPath);
    const petSafety = faqs.find(({ slug }) => slug === 'what-flowers-are-safe-for-cats');
    expect(petSafety?.sources.length).toBeGreaterThan(0);
    expect(petSafety?.sources.some(({ url }) => url.startsWith('https://www.aspca.org/'))).toBe(true);
  });
});
