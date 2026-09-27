# Centered Contact Form Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the contact guidance items and center the remaining section introduction above the contact form without leaving empty space.

**Architecture:** Keep the existing `EnquirySection` and `EnquiryForm` component boundary. Simplify the section markup to an intro plus form, then convert the section grid into a constrained single-column layout through the existing global stylesheet.

**Tech Stack:** Astro, TypeScript, CSS, Playwright

---

### Task 1: Center the contact section

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/components/EnquirySection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing browser test**

Add a contact-page assertion that the guidance items are absent and the section uses the centered layout class:

```ts
test('contact page centers the form without guidance items', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('.enquiry-intro .trust-item')).toHaveCount(0);
  await expect(page.locator('.enquiry-layout')).toHaveClass(/centered/);
  await expect(page.locator('.enquiry-layout > .enquiry-form')).toHaveCount(1);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm run test:e2e -- tests/e2e/site.spec.ts --project=desktop -g "centers the form"`

Expected: FAIL because `.enquiry-layout` does not yet include `centered` and the guidance items still exist.

- [ ] **Step 3: Simplify the Astro markup**

Remove the Lucide icon import and the three `.trust-item` blocks from `EnquirySection.astro`. Add the layout class:

```astro
<div class="shell enquiry-layout centered">
  <div class="enquiry-intro">
    <h2>Reach out to us</h2>
    <p>Use this form for general questions, feedback, corrections, collaborations, or anything else you would like to send to the Hyper Florist team.</p>
  </div>
  <EnquiryForm />
</div>
```

- [ ] **Step 4: Center and constrain the section in CSS**

Replace the two-column contact layout rules with:

```css
.enquiry-layout.centered { display: grid; grid-template-columns: minmax(0, 780px); justify-content: center; gap: 28px; }
.enquiry-layout.centered .enquiry-intro { position: static; text-align: center; }
.enquiry-layout.centered .enquiry-intro p { margin: 14px auto 0; color: #4d4b3f; max-width: 640px; }
```

Keep the existing form panel, fields, submission states, and responsive field stacking unchanged.

- [ ] **Step 5: Run focused and existing contact-form tests**

Run: `npm run test:e2e -- tests/e2e/site.spec.ts -g "contact page centers|contact form"`

Expected: all matching desktop and mobile tests PASS.

- [ ] **Step 6: Build the production site**

Run: `npm run build`

Expected: Astro check reports zero diagnostics and the static build completes.

- [ ] **Step 7: Commit the implementation**

```bash
git add src/components/EnquirySection.astro src/styles/global.css tests/e2e/site.spec.ts docs/superpowers/plans/2026-09-27-centered-contact-form-layout.md
git commit -m "Center contact form layout"
```
