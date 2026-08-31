# Aroma Gastro Bar owner launch brief

This repo is a migration-ready replacement for the current public Aroma Gastro Bar site. It is not connected to the business domain, Owner.com account, Google Business Profile, Search Console, or analytics accounts.

## What changed

- Added focused menu, visit, reservation, FAQ, group-dining, and nightlife routes while preserving the existing visual system.
- Added verified-upcoming event detail pages that drop expired events from rendered output, Event schema, and the sitemap.
- Added a curated menu summary with an explicit handoff to the live ordering menu at `https://aromagastrobar.com/menu`.
- Preserved static route pages, legacy aliases, canonicals, sitemap generation, robots rules, and conservative restaurant/menu/breadcrumb structured data.
- Added stronger prerendered-output assertions for H1s, hero layers, base-aware internal links, and conversion analytics hooks.
- Added local ESLint configuration and pull-request CI checks for lint, typecheck, both deployment builds, and SEO verification.
- Added an owner fact sheet, URL migration map, and archived the redundant implementation plan.

## GitHub Pages demo

1. Review the feature branch and the [fact sheet](./owner-fact-sheet.md).
2. Verify the content used for the demo is acceptable, understanding that some facts remain provisional.
3. Run `npm run build:pages`.
4. Publish the generated `dist/` directory through GitHub Pages for the repository.
5. Confirm that the demo uses `https://hdavid407.github.io/aroma-web/` as its canonical origin and that routes work under `/aroma-web/`.

The normal production build uses the root path and the default GitHub Pages origin. The Pages build supplies the `/aroma-web/` base path. The site origin can be overridden at build time with `SITE_ORIGIN` or `VITE_SITE_ORIGIN`.

## Future custom-domain migration

Only the owner or an authorized site administrator should perform these steps:

1. Obtain access to the domain DNS and current hosting account.
2. Build with `SITE_ORIGIN=https://aromagastrobar.com` and the root base path.
3. Deploy the replacement site and confirm HTTPS.
4. Apply the [URL migration map](./url-migration-map.md) with permanent redirects at the hosting layer.
5. Confirm every canonical, Open Graph URL, JSON-LD URL, sitemap URL, and robots sitemap directive uses the custom domain.
6. Verify the old Owner.com pages are not left as competing duplicates.

## Owner-controlled SEO setup

- Claim and verify the Google Business Profile.
- Make the business name, address, phone, hours, website, menu, reservation, and ordering links consistent.
- Verify the domain in Google Search Console and submit the generated sitemap.
- Connect an owner-approved analytics provider.
- Map the existing `data-analytics` attributes to reservation, phone, directions, menu, ordering, and event-detail click events.
- Keep current photos, menu details, hours, brunch information, and events synchronized with the website.
- Link the website from the official business profiles and other legitimate local listings.

## Maintenance rule

Time-sensitive information lives in `src/siteContent.ts`. Any change to hours, menu items, prices, brunch programming, events, reservations, or ordering should be reviewed, rebuilt, and rechecked with `npm run verify:seo` before publishing.

## Required verification commands

```text
npm run typecheck
npm run build
npm run build:pages
npm run verify:seo
```

The current plan allows a public GitHub Pages demo before all facts are verified. That is a known customer-trust risk and does not authorize a custom-domain cutover.
