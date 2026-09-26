import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { canonicalPages } from '../src/lib/site-pages';
import { redirects } from '../src/lib/redirects';

const redirectsFile = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');

describe('deployment contract', () => {
  it('keeps the code redirect map synchronized with Cloudflare', () => {
    for (const rule of redirects) {
      expect(redirectsFile).toContain(`${rule.from} ${rule.to} ${rule.status}`);
    }
  });

  it('sends each recovery redirect directly to a canonical page', () => {
    const canonical = new Set(canonicalPages.map((page) => page.path));
    for (const rule of redirects) expect(canonical.has(rule.to), rule.from).toBe(true);
  });

  it('does not mention legacy uploaded media in deployable redirects', () => {
    expect(redirectsFile).not.toContain('/wp-content/uploads/');
  });

  it('contains no redirect that becomes a self-loop after slash normalization', () => {
    const rules = redirectsFile
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .filter((parts) => parts.length === 3 && parts[0].startsWith('/'));

    for (const [source, destination] of rules) {
      const normalizedSource = source.replace(/\/{2,}/g, '/');
      expect(normalizedSource, `${source} redirects to itself`).not.toBe(destination);
    }
  });
});
