# Aroma Gastrobar SEO improvement implementation plan

## Goal

Improve the current static Aroma Gastrobar site by fixing crawl correctness, removing unsupported structured data, strengthening local-business markup, adding breadcrumbs, improving verified content handling, and optimizing important images and motion behavior. Preserve the existing route architecture, avoid fabricated business facts, and do not add new SEO-only routes.

## Global constraints

- Preserve existing uncommitted user changes unless they are directly required by this plan.
- Keep the site as a static Vite/GitHub Pages deployment.
- Do not add unverified coordinates, price range, menu facts, hours, reviews, Toast URLs, or domain changes.
- Keep visible FAQ content for users but remove FAQPage JSON-LD.
- Do not publish Event JSON-LD on the multi-event listing; dedicated event pages are deferred.
- Keep explicit legacy aliases; unknown URLs must remain true 404s.

## Task 1: Fix crawl behavior and structured-data correctness

- Update `404.html` and the generated fallback behavior in `vite.config.ts` so unknown URLs show a helpful noindex 404 with Home, Menu, and Contact links, no canonical URL, and no forced JavaScript redirect.
- Preserve the explicit legacy aliases already represented by static route entries.
- Remove FAQPage and Event graph generation from `src/seo.ts`.
- Update `scripts/verify-seo-output.mjs` to assert the new 404 behavior and absence of FAQPage/Event schema on the events listing.

## Task 2: Strengthen local entity markup and breadcrumbs

- Use `Restaurant` as the primary JSON-LD type with the existing stable restaurant ID.
- Emit the documented `menu` property pointing to the canonical menu route; do not add unverified `geo` or `priceRange` values.
- Add derived visible breadcrumbs to non-home route pages and matching BreadcrumbList JSON-LD.
- Extend the verifier for Restaurant.menu and breadcrumb consistency.

## Task 3: Improve image delivery and motion accessibility

- Optimize the large hero image into a browser-supported modern format with a fallback, preserving visual appearance.
- Render important hero/gallery images as semantic images where practical, with dimensions, responsive sources, descriptive alt text, and loading priorities.
- Lazy-load below-the-fold images and reduce avoidable font-loading cost without changing the visual system.
- Ensure `prefers-reduced-motion` disables glitter animation rather than forcing an infinite animation.

## Task 4: Verify and document

- Run typecheck, lint, root build, GitHub Pages build, SEO verification, and relevant static checks.
- Ensure the staged/deleted SEO documentation state and existing untracked plan artifacts are not overwritten or silently removed.
- Report any deferred external work separately.
