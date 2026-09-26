# Header and Footer Brand Treatment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge the header logo, remove its tagline, and remove the low-contrast footer logo.

**Architecture:** Keep the existing header and footer structure, changing only the brand markup and responsive CSS. Browser tests cover visible behavior on desktop and mobile.

**Tech Stack:** Astro, CSS, Playwright

---

### Task 1: Add failing brand-placement assertions

**Files:**
- Modify: `tests/e2e/site.spec.ts`

- [x] **Step 1: Write the failing test**

Add assertions that the header contains no tagline, the footer contains no logo image, and the header logo renders at least 70px tall on desktop and 54px tall on mobile.

- [x] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- --grep "homepage presents"`
Expected: FAIL because the tagline and footer logo still exist and the header logo is too small.

### Task 2: Update header and footer brand presentation

**Files:**
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/styles/global.css`
- Test: `tests/e2e/site.spec.ts`

- [x] **Step 1: Write minimal implementation**

Remove the header tagline span, remove the footer logo link, set `.site-header .brand img` to 72px, set the mobile size to 56px, and make the mobile panel position follow the header height.

- [x] **Step 2: Run focused test to verify it passes**

Run: `npm run test:e2e -- --grep "homepage presents"`
Expected: PASS on desktop and mobile.

- [x] **Step 3: Run full verification**

Run: `npm run check`, `npm test`, `npm run build`, and `npm run test:e2e`.
Expected: all checks pass, with the desktop-only mobile-navigation test skipped as designed.

- [x] **Step 4: Review screenshots**

Capture desktop and mobile pages and confirm the larger header logo does not overlap navigation or content and the footer starts with descriptive copy.

- [x] **Step 5: Commit and push**

```bash
git add docs/superpowers/plans/2026-09-27-header-footer-brand-treatment.md src/components/SiteHeader.astro src/components/SiteFooter.astro src/styles/global.css tests/e2e/site.spec.ts
git commit -m "Refine header and footer branding"
git push origin main
```
