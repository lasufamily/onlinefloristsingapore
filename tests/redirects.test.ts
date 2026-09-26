import { describe, expect, it } from 'vitest';
import { redirects, resolvedRedirects } from '../src/lib/redirects';

describe('legacy redirect map', () => {
  it('maps every approved backlink-bearing HTML path directly', () => {
    expect(resolvedRedirects()).toMatchObject({
      '/collections/flowers': '/category/flowers/',
      '/product-category/flowers/': '/category/flowers/',
      '/category/occasion/funeral-flowers/': '/category/funeral-flowers/',
      '/category/occasion/birthday/': '/collections/birthday/',
      '/category/last-minute-flower-delivery/': '/fastest-online-flower-delivery-singapore/',
      '/collections/last-minute-flower-delivery': '/fastest-online-flower-delivery-singapore/',
      '/category/occasion/official-opening/': '/product-category/occasion/official-opening/',
      '/collections/official-opening': '/product-category/occasion/official-opening/',
      '/product-category/occasion/anniversary/': '/category/occasion/anniversary/',
      '/corpoate/': '/corporate-flowers/',
      '/contact-us/': '/contact/',
      '/flower-shop-online-singapore-florist/cheapest-online-florist-singapore': '/affordable-flowers/',
      '/product/flowers-zenith-vd/': '/category/flowers/',
    });
  });

  it('contains no redirect chains', () => {
    const sources = new Set(redirects.map(({ from }) => from));
    expect(redirects.filter(({ to }) => sources.has(to))).toEqual([]);
  });

  it('does not restore or redirect legacy media', () => {
    expect(redirects.some(({ from }) => from.startsWith('/wp-content/uploads/'))).toBe(false);
  });
});
