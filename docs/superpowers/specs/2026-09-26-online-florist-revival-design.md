# Online Florist Singapore Revival Design

## Purpose

Replace the current indexable GoDaddy placeholder with a new, independently branded Singapore florist enquiry site. The site must recover useful legacy backlink destinations without copying the former business's content, claims, images, reviews, or contact details.

## Architecture

- Astro generates static, crawlable HTML for the storefront and recovered landing pages.
- Cloudflare Pages serves the static build and applies direct legacy URL redirects.
- A Cloudflare Pages Function accepts structured enquiries.
- Cloudflare D1 stores leads and rate-limit events; Turnstile blocks automated submissions; Resend sends notification email.
- Astro content collections hold categories and products so inventory can be edited without changing templates.

## Experience

The first screen is the working storefront, not a marketing landing page. It leads with original floral photography, product/category browsing, delivery-request framing, and a prominent enquiry action. The visual system is editorial and botanical without relying on beige, purple, or dark-blue monochrome palettes.

The launch is form-first. Products and categories prefill the enquiry form, but the site does not claim live inventory, fixed pricing, same-day availability, business hours, or islandwide delivery until those facts are supplied and verified.

## URL Recovery

High-value legacy paths either render a new, topically equivalent page or redirect once to the strongest equivalent. WordPress media URLs are intentionally not restored and are excluded from recovery tests.

## Data And Safety

Enquiries capture contact and delivery details, consent, attribution, and source page. Validation and rate limiting run server-side. Raw IP addresses are never stored; only a keyed SHA-256 hash is used for rate limiting.

## Success Criteria

- Every mapped legacy HTML URL returns a canonical 200 response or one direct 301 redirect.
- The sitemap contains canonical HTML pages only.
- The enquiry endpoint has tested success, validation, throttling, Turnstile, storage, and email-failure behavior.
- The static build passes automated tests, responsive browser checks, and accessibility checks.

