# Online Florist Singapore Revival Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Astro and Cloudflare florist enquiry storefront that recovers valuable legacy URLs.

**Architecture:** Astro statically renders canonical commerce and SEO pages from content collections. Cloudflare redirects consolidate legacy duplicates, while a Pages Function validates, rate-limits, stores, and emails enquiries through injected services.

**Tech Stack:** Astro, TypeScript, Vitest, Cloudflare Pages Functions, D1, Turnstile, Resend, Playwright

---

### Task 1: Project foundation and URL recovery

**Files:** `package.json`, `astro.config.mjs`, `src/lib/redirects.ts`, `public/_redirects`, `tests/redirects.test.ts`

- [ ] Write redirect-map tests and verify they fail because the module is missing.
- [ ] Add the project configuration and canonical redirect map.
- [ ] Run redirect tests and confirm every legacy path has one destination.

### Task 2: Enquiry domain and Cloudflare endpoint

**Files:** `src/lib/enquiries.ts`, `functions/api/enquiries.ts`, `schema.sql`, `tests/enquiries.test.ts`

- [ ] Write failing tests for validation, normalization, consent, date, and postal-code rules.
- [ ] Implement the pure enquiry parser and make the unit tests pass.
- [ ] Add the Pages Function with Turnstile, keyed-IP throttling, D1 persistence, and Resend notification.
- [ ] Add endpoint integration tests for success and failure responses.

### Task 3: Content system and storefront pages

**Files:** `src/content.config.ts`, `src/content/categories/*.md`, `src/content/products/*.md`, `src/pages/**`, `src/components/**`

- [ ] Write failing tests for canonical page inventory, unique metadata, and product/category references.
- [ ] Add category and product content using only new names and copy.
- [ ] Build layouts, navigation, product grids, category pages, and the enquiry form.
- [ ] Add canonical metadata and only verified-safe structured data.

### Task 4: Visual system and original assets

**Files:** `src/styles/global.css`, `public/images/**`

- [ ] Generate original floral hero and category imagery with no text, logos, or legacy references.
- [ ] Add responsive image treatments and a restrained botanical visual system.
- [ ] Verify all local assets resolve and have useful alternative text.

### Task 5: SEO, analytics, and deployment

**Files:** `src/pages/robots.txt.ts`, sitemap output, `public/_headers`, `.env.example`, `README.md`

- [ ] Add sitemap integration, robots directives, security headers, and optional analytics hooks.
- [ ] Document Cloudflare Pages, D1, Turnstile, Resend, and search-console setup.
- [ ] Build and inspect generated canonicals, sitemap URLs, redirects, and excluded media behavior.

### Task 6: Browser verification

**Files:** `playwright.config.ts`, `tests/e2e/storefront.spec.ts`

- [ ] Start the production preview server.
- [ ] Test desktop and mobile navigation, category browsing, form interaction, and responsive layout.
- [ ] Capture screenshots and inspect for blank content, overlap, clipping, or broken assets.
- [ ] Run the full test, type-check, and production-build suite.

