# AGENTS.md

## Project Overview

OnlineFloristSingapore.com is an Astro and Cloudflare Pages site for a Singapore florist enquiry storefront and knowledge base. It must remain independently branded and must not reuse the expired domain's former business identity, copy, reviews, images, claims, or contact details.

The site is mostly static Astro output, with Cloudflare Pages Functions handling enquiries. D1 stores enquiry and rate-limit data, Turnstile protects the public form, and Resend sends notifications.

## Working Rules

- Make the smallest useful change that solves the request, and keep unrelated files untouched.
- Preserve any existing user edits in the worktree. Do not revert, overwrite, or reformat unrelated changes.
- After changes or improvements have been made and verified, pushing to `main` is the default workflow unless the user explicitly asks for a branch, PR, or local-only work.
- Keep implementation aligned with the current Astro, TypeScript, Cloudflare Pages, Vitest, and Playwright setup.
- Prefer structured data files in `src/data/` for editable site content instead of hard-coding content into components.
- Do not add unverified business claims, fixed prices, same-day availability, business hours, islandwide delivery promises, or live-inventory language.
- Do not add wine, alcohol, or other alcoholic products, pages, copy, URL paths, image filenames, alt text, or imagery. Do not add non-halal food products such as pork, ham, bacon, or lard in pages, copy, URL paths, image filenames, alt text, or imagery.
- Do not add affiliate links until the partner URL, disclosure copy, and `sponsored nofollow` treatment are approved.
- Keep raw IP addresses out of storage; enquiry rate limiting should use the existing keyed hash approach.

## Design And Content Style

- The first screen should feel like the usable storefront, not a generic marketing landing page.
- Keep the visual direction editorial, botanical, and commerce-ready without relying on beige, purple, or dark-blue monochrome palettes.
- Use original or approved imagery only. Do not restore legacy media or redirect old WordPress upload URLs to unrelated pages.
- Write practical Singapore-specific floral guidance, but verify safety, cultural, delivery, and care claims before publishing.
- FAQ answers should remain one body paragraph, and each FAQ page should use the full question as its slug, page title, and H1.

## Important Commands

```bash
npm run check
npm test
npm run build
npm run test:e2e
```

Use focused tests while developing, then run the relevant quality commands before considering work complete. For deploys, build with `npm run build` and deploy Cloudflare Pages from `dist`.

## Key Files

- `src/data/knowledge-pages.json` - editable knowledge-page inventory.
- `src/data/faq.json` - FAQ content and linked questions.
- `src/data/affiliate-links.json` - affiliate destination registry; keep empty until approved.
- `src/lib/site-pages.ts` - canonical site inventory.
- `src/lib/redirects.ts` and `public/_redirects` - legacy URL recovery behavior.
- `functions/api/enquiries.ts` - Cloudflare Pages enquiry endpoint.
- `schema.sql` - D1 schema.
- `README.md` - operational setup, launch gates, and deployment notes.
