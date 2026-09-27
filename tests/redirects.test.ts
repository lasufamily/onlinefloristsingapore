import { describe, expect, it } from 'vitest';
import { redirects, resolvedRedirects } from '../src/lib/redirects';

describe('legacy redirect map', () => {
  it('maps legacy shop URLs directly to the closest knowledge page', () => {
    expect(resolvedRedirects()).toMatchObject({
      '/collections/flowers': '/flowers/',
      '/product-category/flowers/': '/flowers/',
      '/category/occasion/funeral-flowers/': '/occasions/funeral/',
      '/category/occasion/birthday/': '/occasions/birthday/',
      '/category/last-minute-flower-delivery/': '/guides/same-day-flower-delivery/',
      '/collections/last-minute-flower-delivery': '/guides/same-day-flower-delivery/',
      '/category/occasion/official-opening/': '/occasions/grand-opening/',
      '/collections/official-opening': '/occasions/grand-opening/',
      '/product-category/occasion/anniversary/': '/occasions/anniversary/',
      '/corpoate/': '/hampers/corporate/',
      '/gifts/': '/gift-ideas/',
      '/gifts/gadgets/': '/gift-ideas/gadgets/',
      '/gifts/with-flowers/': '/gift-ideas/with-flowers/',
      '/gifts/hampers/': '/hampers/',
      '/gifts/hampers/newborn/': '/hampers/newborn/',
      '/gifts/flowers-with-gifts/': '/gift-ideas/with-flowers/',
      '/contact-us/': '/contact/',
      '/flower-shop-online-singapore-florist/cheapest-online-florist-singapore': '/guides/flower-budgets/',
      '/product/flowers-zenith-vd/': '/flowers/',
      '/singapore-flower-culture/': '/flower-culture/',
      '/singapore-flower-culture/vanda-miss-joaquim/': '/flower-culture/vanda-miss-joaquim/',
    });
  });

  it('contains no redirect chains, duplicates, or self-redirects', () => {
    const sources = new Set(redirects.map(({ from }) => from));
    expect(sources.size).toBe(redirects.length);
    expect(redirects.filter(({ to }) => sources.has(to))).toEqual([]);
    expect(redirects.filter(({ from, to }) => from.replace(/\/$/, '') === to.replace(/\/$/, ''))).toEqual([]);
  });

  it('does not restore or redirect legacy media', () => {
    expect(redirects.some(({ from }) => from.startsWith('/wp-content/uploads/'))).toBe(false);
  });
});
