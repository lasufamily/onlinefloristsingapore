# Page-Specific Image Library Design

## Goal

Replace the current knowledge-page image set with 106 independently generated, photorealistic images. Every image must be visually distinct, relevant to its page, appropriate for a Singapore florist guide, and free of people, body parts, alcohol, non-halal products, logos, watermarks, and readable text.

## Root Cause

The current files have unique paths and byte hashes, but many were cropped from a much smaller source set. The existing test therefore proves file uniqueness without proving visual uniqueness. Broad category-level images and repeated alt-text templates also allow images that do not closely represent individual page topics.

## Image Production

Generate one original image for each entry in `src/data/knowledge-pages.json`. Do not create page assets by cropping, recolouring, mirroring, or otherwise deriving them from a shared source photograph.

Each generation prompt will include:

- The page's exact subject and the most useful visual distinction from related pages.
- A specific composition, flower or gift selection, setting, lighting treatment, and colour direction.
- Singapore context where it can be shown naturally, such as a local florist workspace, HDB interior, tropical daylight, sheltered shopfront, office setting, or urban greenery.
- A landscape editorial-commerce composition suitable for a 4:3 page image.
- Explicit exclusions for people, hands, body parts, alcohol, non-halal products, labels, logos, watermarks, and readable text.

Closely related pages must differ in both subject treatment and composition. For example, the sunflower meaning page may use a symbolic single-variety arrangement, while the sunflower care page should show stems in a clean vase-care setting without hands or tools implying a person.

## Page Mapping And Alt Text

Keep image metadata in `src/data/knowledge-pages.json`. Each page retains one local image path, and each replacement filename remains descriptive of its page topic.

Rewrite every `imageAlt` value to describe the visible image first while naturally including the page topic and Singapore context. Alt text must not be a repeated template and must not make claims that are not visible in the image.

## Validation

Validation has four layers:

1. Every knowledge page references an existing local image with a unique path and exact file hash.
2. A perceptual similarity audit flags images that are near-duplicates despite different crops or compression.
3. A content manifest records the intended subject and exclusions for every page, enabling deterministic checks that filenames and alt text match the page mapping.
4. A generated contact sheet is reviewed visually for repeated compositions, incorrect subjects, people or body parts, prohibited products, unwanted text, and weak Singapore relevance.

The existing Astro, Vitest, and Playwright checks remain part of final verification. The image audit will be added to the repository so future image changes cannot recreate the current issue.

## Scope

This work changes only the generated knowledge-page images, their image metadata, the image-audit tooling or tests, and this design documentation. It does not change page copy, routes, layout, branding, or enquiry functionality.

## Acceptance Criteria

- All 106 knowledge pages use independently generated images.
- No image is reused, cropped from another page image, or perceptually near-identical to another image.
- Every image visibly matches its page's subject.
- Every image is photorealistic and locally appropriate to Singapore.
- No image contains people, body parts, alcohol, non-halal products, logos, watermarks, or readable text.
- Every alt tag accurately describes its image and includes useful page-topic and Singapore context.
- The complete project check, unit test, build, and end-to-end test commands pass.
