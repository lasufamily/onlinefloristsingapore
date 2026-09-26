import { describe, expect, it } from 'vitest';
import categories from '../src/data/categories.json';
import products from '../src/data/products.json';
import { canonicalPages } from '../src/lib/site-pages';

describe('storefront content inventory', () => {
  it('includes every canonical recovery and demand page', () => {
    const paths = canonicalPages.map(({ path }) => path);
    expect(paths).toEqual(expect.arrayContaining([
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
    ]));
  });

  it('uses unique titles and descriptions on canonical pages', () => {
    const titles = canonicalPages.map(({ title }) => title);
    const descriptions = canonicalPages.map(({ description }) => description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('contains at least twelve enquiry concepts with valid category references', () => {
    const categoryIds = new Set(categories.map(({ id }) => id));
    expect(products.length).toBeGreaterThanOrEqual(12);
    expect(products.every(({ category }) => categoryIds.has(category))).toBe(true);
    expect(new Set(products.map(({ id }) => id)).size).toBe(products.length);
  });

  it('does not declare legacy upload paths as pages or assets', () => {
    const serialized = JSON.stringify({ canonicalPages, categories, products });
    expect(serialized).not.toContain('/wp-content/uploads/');
  });
});
