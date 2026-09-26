# Header and Footer Brand Treatment

## Goal

Make the Hyper Florist identity more legible in the site header and remove the low-contrast logo from the dark green footer.

## Design

- Keep the approved Hyper Florist logo as the linked home mark in the site header.
- Remove the `Singapore flower guides` tagline from the header logo area.
- Increase the header logo height from 54px to 72px on desktop and from 46px to 56px on mobile.
- Allow the header row and mobile menu panel position to follow the larger logo without overlapping navigation or page content.
- Remove the logo and its link from the footer.
- Retain the existing plain-spoken footer description and navigation columns.

## Components

- `SiteHeader.astro`: render only the linked logo in the brand area.
- `SiteFooter.astro`: remove the logo link and keep the descriptive paragraph.
- `global.css`: apply header-specific logo sizing and align the mobile navigation panel with the resized header.

## Verification

- Browser tests confirm the header logo remains visible, the header tagline is absent, and the footer contains no logo.
- Desktop and mobile screenshots confirm the larger logo does not overlap navigation or content.
- The existing Astro, unit, build, and Playwright checks remain green.
