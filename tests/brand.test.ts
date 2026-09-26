import { describe, expect, it } from 'vitest';
import { brand } from '../src/lib/brand';

describe('brand', () => {
  it('publishes the complete official color palette', () => {
    expect(brand.colors).toEqual({
      pink: '#fb5a72',
      green: '#166c58',
      grey: '#545454',
      yellow: '#f7d962',
    });
  });

  it('publishes favicon assets derived from the approved logo', () => {
    expect(brand.favicons).toEqual({
      icon: '/favicon-32x32.png',
      appleTouchIcon: '/apple-touch-icon.png',
    });
  });
});
