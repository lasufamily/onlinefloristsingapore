# OnlineFloristSingapore.com

Static Astro storefront for the new **Stem & Story** working brand, with a Cloudflare Pages enquiry function. The site intentionally does not reuse the expired domain's former business identity, content, images, reviews, or claims.

## Local development

```bash
npm install
npm run dev
```

The static site works in Astro's local server. Successful enquiry submission requires the Cloudflare Pages runtime, a D1 binding, Turnstile, and Resend.

Quality commands:

```bash
npm run check
npm test
npm run build
npm run test:e2e
```

## Cloudflare Pages

1. The `onlinefloristsingapore` Pages project is live at `onlinefloristsingapore.pages.dev` and serves the custom apex and `www` domains.
2. Build with `npm run build`, then deploy with `npx wrangler pages deploy dist --project-name onlinefloristsingapore --branch main`.
3. The provisioned `ofs-enquiries` D1 database is bound as `DB` in [`wrangler.jsonc`](./wrangler.jsonc).
4. Apply [`schema.sql`](./schema.sql) to that D1 database after any schema changes.
5. Add the private runtime values listed in [`.env.example`](./.env.example) as encrypted secrets or variables.
6. Add `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_GA4_ID`, and `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` as build-time variables when those services are ready.
7. Configure Turnstile for `onlinefloristsingapore.com` and authorize the domain in Resend before enabling the public form.
8. The apex and `www` domains are attached to Pages. [`functions/_middleware.ts`](./functions/_middleware.ts) normalizes `www`, while [`public/_redirects`](./public/_redirects) restores the approved legacy HTML paths.

Apply the D1 schema with Wrangler:

```bash
npx wrangler d1 execute ofs-enquiries --file=schema.sql --remote
```

## Launch gates

- Confirm that **Stem & Story** is the final owned business name, or replace it site-wide before launch.
- Supply and verify a real contact channel, legal entity details, privacy contact, delivery policy, coverage, charges, and operating process.
- Validate every product direction, price, flower claim, and delivery commitment before publishing it as orderable inventory.
- Replace concept photography if the final arrangements materially differ from the depicted directions.
- Submit `https://onlinefloristsingapore.com/sitemap-index.xml` to Google Search Console and Bing Webmaster Tools.
- Request indexing for the homepage and the restored backlink destinations after DNS cutover.
- Confirm the GA4 `generate_lead` event and Cloudflare Web Analytics beacon in production.
- Test Turnstile, D1 persistence, Resend delivery, consent storage, rate limiting, and generic failure responses in a Pages preview.

## URL recovery

Canonical pages are defined in [`src/lib/site-pages.ts`](./src/lib/site-pages.ts). Redirect logic is represented in [`src/lib/redirects.ts`](./src/lib/redirects.ts) and deployed through [`public/_redirects`](./public/_redirects).

Legacy `/wp-content/uploads/...` requests are intentionally excluded. There are no replacement media pages or media redirects; those URLs should remain `404` (or may be changed to `410` at the edge later).

## Content editing

Editable category and product data lives in:

- [`src/data/categories.json`](./src/data/categories.json)
- [`src/data/products.json`](./src/data/products.json)

Keep product cards enquiry-only until the underlying items, prices, stock rules, and fulfilment process are operationally verified.
