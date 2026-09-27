import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { canonicalPages } from '../src/lib/site-pages';

const knowledgePath = new URL('../src/data/knowledge-pages.json', import.meta.url);
const faqPath = new URL('../src/data/faq.json', import.meta.url);

function loadJson<T>(url: URL): T {
  expect(existsSync(url), `${url.pathname} must exist`).toBe(true);
  return JSON.parse(readFileSync(url, 'utf8')) as T;
}

type KnowledgePage = {
  id: string;
  path: string;
  parent: string | null;
  title: string;
  description: string;
  heading: string;
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

const requiredHubs = [
  '/flowers/',
  '/occasions/',
  '/flowers-for/',
  '/bouquets-and-arrangements/',
  '/gifts/',
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
      '/gifts/wallets/',
      '/gifts/jewellery/',
      '/gifts/gadgets/',
      '/gifts/with-flowers/',
      '/hampers/newborn/',
      '/plants/indoor/low-light/',
      '/flower-culture/vanda-miss-joaquim/',
    ]));
    expect([...paths].filter((path) => path.startsWith('/gifts/hampers/'))).toEqual([]);
    expect(paths.has('/gifts/hampers/')).toBe(false);
  });

  it('uses unique titles, descriptions, ids, and paths', () => {
    const pages = loadJson<KnowledgePage[]>(knowledgePath);
    for (const key of ['id', 'path', 'title', 'description'] as const) {
      expect(new Set(pages.map((page) => page[key])).size, key).toBe(pages.length);
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
