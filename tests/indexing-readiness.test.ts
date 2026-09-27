import { describe, expect, it } from 'vitest';
import { GET as robotsTxt } from '../src/pages/robots.txt';
import { brand } from '../src/lib/brand';
import { canonicalPages } from '../src/lib/site-pages';

const canonicalPathPattern = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/;

describe('indexing readiness', () => {
  it('publishes crawl-friendly robots directives with the canonical sitemap index', async () => {
    const response = await robotsTxt({} as Parameters<typeof robotsTxt>[0]);
    const body = await response.text();

    expect(response.headers.get('content-type')).toContain('text/plain');
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Disallow: /api/');
    expect(body).toContain(`Sitemap: ${brand.url}sitemap-index.xml`);
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
  });

  it('keeps canonical URLs normalized for sitemap and Search Console submission', () => {
    const paths = canonicalPages.map(({ path }) => path);

    expect(paths.length).toBeGreaterThan(100);
    expect(new Set(paths).size).toBe(paths.length);

    for (const path of paths) {
      expect(path, 'canonical path should be lowercase, slash-delimited, and trailing-slashed').toMatch(canonicalPathPattern);
      expect(new URL(path, brand.url).toString(), path).toBe(`${brand.url.replace(/\/$/, '')}${path}`);
    }
  });

  it('uses unique, indexable search snippets for canonical pages', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const page of canonicalPages) {
      expect(page.title.length, `${page.path} title is too short`).toBeGreaterThanOrEqual(30);
      expect(page.title.length, `${page.path} title is too long`).toBeLessThanOrEqual(65);
      expect(page.description.length, `${page.path} description is too short`).toBeGreaterThanOrEqual(80);
      expect(page.description.length, `${page.path} description is too long`).toBeLessThanOrEqual(160);
      expect(page.title, `${page.path} title should not be duplicated`).not.toSatisfy((title: string) => titles.has(title));
      expect(page.description, `${page.path} description should not be duplicated`).not.toSatisfy((description: string) => descriptions.has(description));
      titles.add(page.title);
      descriptions.add(page.description);
    }
  });
});
