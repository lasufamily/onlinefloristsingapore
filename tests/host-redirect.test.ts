import { describe, expect, it } from 'vitest';
import { canonicalHostRedirect } from '../src/lib/host-redirect';

describe('canonical host redirect', () => {
  it('redirects www to the HTTPS apex while preserving path and query', () => {
    const response = canonicalHostRedirect(
      new Request('https://www.onlinefloristsingapore.com/category/flowers/?utm_source=test'),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get('location')).toBe(
      'https://onlinefloristsingapore.com/category/flowers/?utm_source=test',
    );
  });

  it('does not redirect the canonical host or Pages preview', () => {
    expect(canonicalHostRedirect(new Request('https://onlinefloristsingapore.com/'))).toBeNull();
    expect(canonicalHostRedirect(new Request('https://onlinefloristsingapore.pages.dev/'))).toBeNull();
  });
});
