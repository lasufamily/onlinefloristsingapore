# Page-Specific Image Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 106 derived knowledge-page crops with independent, page-relevant Singapore images and prevent exact or perceptual reuse.

**Architecture:** A structured image manifest maps every knowledge page to a unique visual brief and accurate alt text. Each brief is sent through a separate built-in image-generation call, its output is stored as a page-specific local JPEG, and Vitest uses Sharp-based difference hashes to detect visually repeated assets.

**Tech Stack:** Astro, TypeScript, Vitest, Sharp, built-in image generation, Playwright

---

### Task 1: Add Perceptual-Duplicate Regression Coverage

**Files:**
- Modify: `tests/site-content.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Write a failing near-duplicate test**

Add an asynchronous Vitest case that decodes each referenced image with Sharp, resizes it to a 17 by 16 greyscale sample, computes a 256-bit difference hash, and asserts that no page pair reaches 85 percent bit agreement.

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm test -- tests/site-content.test.ts`

Expected: FAIL listing current visually repeated pairs, including `/flowers/fresh/orchids/` and `/flowers/dried/`.

- [ ] **Step 3: Declare Sharp as a direct development dependency**

Run: `npm install --save-dev sharp`

Expected: `sharp` appears in `devDependencies` and the lockfile remains valid.

- [ ] **Step 4: Re-run the focused test**

Run: `npm test -- tests/site-content.test.ts`

Expected: The new test still fails because the current images are near-duplicates, proving that the dependency setup is not masking the regression.

### Task 2: Create The Page Image Manifest

**Files:**
- Create: `src/data/knowledge-images.json`
- Modify: `tests/site-content.test.ts`

- [ ] **Step 1: Extend the test to require one manifest record per page**

Assert that each page path has exactly one manifest record containing `path`, `filename`, `subject`, `setting`, `composition`, `palette`, and `alt` fields; filenames, subjects, compositions, and alt values must be unique.

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm test -- tests/site-content.test.ts`

Expected: FAIL because `src/data/knowledge-images.json` does not exist.

- [ ] **Step 3: Add all 106 page-specific briefs**

Create one record per page. Each subject must name the visible flower, arrangement, gift, plant, occasion, or guide concept; each setting and composition must distinguish adjacent pages. All records use Singapore-appropriate settings and prohibit people, body parts, alcohol, non-halal products, labels, logos, watermarks, and readable text.

- [ ] **Step 4: Run the manifest assertions**

Run: `npm test -- tests/site-content.test.ts`

Expected: Manifest checks pass while the perceptual image test remains red against the old assets.

### Task 3: Generate And Install Independent Images

**Files:**
- Replace: `public/images/generated/pages/*.jpg`

- [ ] **Step 1: Generate every page asset independently**

Issue one built-in image-generation call per manifest record. Each prompt uses the record's subject, setting, composition, and palette plus these invariants: photorealistic editorial-commerce photography, landscape 4:3 framing, natural tropical light, no people or body parts, no alcohol, no non-halal products, no text, no logo, and no watermark.

- [ ] **Step 2: Save all selected outputs into the project**

Copy each generated original to the manifest filename under `public/images/generated/pages/`. Convert to a web-ready 1200 by 900 JPEG without deriving one page image from another.

- [ ] **Step 3: Run exact and perceptual uniqueness tests**

Run: `npm test -- tests/site-content.test.ts`

Expected: PASS with 106 unique paths, hashes, and difference hashes below the 85 percent similarity threshold.

- [ ] **Step 4: Regenerate any flagged pair**

For each similarity failure, regenerate only the less page-specific member with a revised composition, then rerun the focused test until it passes.

### Task 4: Synchronize Alt Text And Perform Visual QA

**Files:**
- Modify: `src/data/knowledge-pages.json`
- Create: `scripts/create-image-contact-sheet.mjs`
- Create: `artifacts/knowledge-page-images-contact-sheet.jpg`

- [ ] **Step 1: Add a failing metadata synchronization test**

Assert that every page's image filename and `imageAlt` match its manifest record exactly.

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm test -- tests/site-content.test.ts`

Expected: FAIL because the old generic alt text does not match the new image descriptions.

- [ ] **Step 3: Update page metadata from the manifest**

Set every knowledge page image path and alt value to its manifest mapping. Alt text describes what is visibly present and naturally includes the page topic and Singapore context.

- [ ] **Step 4: Create and inspect a labelled contact sheet**

Build a Sharp-based contact sheet from all 106 files, label each tile with its page path outside the image, and inspect it for subject accuracy, repeated scenes, people or body parts, prohibited products, readable text, and visual artifacts. Regenerate any failing asset and repeat the inspection.

### Task 5: Verify And Ship

**Files:**
- Verify all modified files

- [ ] **Step 1: Run all project checks**

Run: `npm run check`

Run: `npm test`

Run: `npm run build`

Run: `npm run test:e2e`

Expected: All commands exit successfully with no test failures.

- [ ] **Step 2: Review the final diff and asset inventory**

Run: `git diff --check`

Run: `git status --short`

Expected: Only the planned image, data, test, dependency, script, plan, and contact-sheet files are changed.

- [ ] **Step 3: Commit and push**

Commit the verified implementation to `main` and push it to `origin/main` as required by the repository workflow.
