# Route-Based SEO Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development to implement this plan task-by-task.

**Goal:** Replace the current one-page SEO surface with a stronger, migration-ready route structure that preserves the existing Aroma Gastrobar visual system and does not depend on Owner.com, GitHub account access, Toast access, or a live review API key.

**Architecture:** Keep React and Vite, but render a shared site shell through separate static route entry documents. Route content, business facts, page metadata, menu sections, and event records live in one typed content module. Build output includes real `/menu/`, `/events/`, `/catering/`, `/story/`, `/contact/`, `/gallery/`, `/gift-cards/`, and `/careers/` paths, plus canonical legacy aliases. The current homepage remains the visual anchor.

**Tech Stack:** React 19, TypeScript, Vite 6, existing CSS design system, static HTML route entries, Schema.org JSON-LD, XML sitemap.

## Global Constraints

- Preserve the existing homepage UI, typography, colors, imagery, animations, navigation labels, and responsive behavior.
- Do not modify or overwrite the user’s existing `src/styles.css` changes unrelated to this task.
- Use verified public business facts: Aroma Gastrobar, 1700 N Semoran Blvd #118, Orlando, FL 32807, `(407) 237-9661`, `aromagastrobar@gmail.com`, reservation URL, social URLs, and homepage hours as provisional facts.
- Do not claim Aroma is located in Mills 50. Use nearby-area wording only when it is accurate and natural.
- Do not add competitor names, fabricated testimonials, awards, menu items, prices, events, hours, or SEO-only filler.
- Do not add a Toast URL until the user supplies it. Until then, the homepage Food and Cocktails cards link to the first-party `/menu/` route.
- Do not add a live Google review widget or invented review content without a Google Cloud API key. Document the future integration point only.
- Do not recreate thin automated tag/place pages as ranking pages. Preserve important legacy URLs through canonical aliases or safe redirects to stronger pages.
- Keep the current GitHub Pages project path configurable so the same build can later run at the production domain root.

## Task 1: Build shared route content and reusable page UI

**Files:**
- Add: `src/siteContent.ts`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/styles.css` only for new route-page styles; preserve the existing glitter change exactly.

- [ ] Define typed shared content for business identity, contact details, provisional hours, social links, reservation URL, route metadata, menu sections/items, catering FAQs, and evergreen/current event records.
- [ ] Refactor the existing homepage into reusable shell pieces without changing its visual structure or visible labels.
- [ ] Add route-specific page rendering selected from the current pathname/data attribute, with semantic headings and useful visible content.
- [ ] Implement the approved canonical routes: `/menu/`, `/events/`, `/catering/`, `/story/`, `/contact/`, `/gallery/`, `/gift-cards/`, and `/careers/`.
- [ ] Reuse the existing header/footer and visual tokens; route pages should feel like the same site rather than a new template.
- [ ] Make the Menu page useful with the public menu categories and item names/descriptions, while treating prices as optional content that can be manually updated.
- [ ] Make Events evergreen plus manually maintained upcoming events; only future records with verified dates may be eligible for event schema.
- [ ] Make Catering use phone/email CTAs instead of an unconnected form.
- [ ] Add a Google Reviews UI placeholder only as a clearly deferred component/configuration boundary; it must not display fake or stale review text.
- [ ] Add stable `data-analytics` attributes to reservation, directions, menu, and future ordering actions without adding an analytics vendor.

## Task 2: Add static route entries, build configuration, and legacy aliases

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json`
- Add: route entry HTML files and build helper scripts as needed.
- Modify: `nginx.conf` only if required for directory route resolution or legacy handling.

- [ ] Configure Vite to build separate HTML entries for the approved canonical routes.
- [ ] Ensure route pages render as static HTML paths, not only client-side SPA navigation; each route must retain crawlable metadata and visible content in the built output.
- [ ] Support `npm run build` at `/` and `npm run build:pages` at `/aroma-web/` without hardcoded asset failures.
- [ ] Add configurable `SITE_ORIGIN`/base-path handling with the current GitHub Pages origin as the default.
- [ ] Preserve important support aliases: `/page/menu/`, `/page/gallery/`, `/page/contact/`, `/rsvp/`, and `/happyhour/` with canonical links to the appropriate stronger route.
- [ ] Generate deterministic handling for former `/tags/*` and `/places/*` paths that points visitors and crawlers toward relevant canonical pages instead of recreating thin duplicate content.
- [ ] Keep Docker/Nginx serving canonical directory routes and aliases correctly.

## Task 3: Implement page-level SEO output and crawl files

**Files:**
- Add/modify: SEO metadata generation used by route entries.
- Modify: `public/sitemap.xml`
- Modify: `public/robots.txt`
- Add: `scripts/verify-seo-output.mjs`

- [ ] Give every canonical route a distinct title, meta description, canonical, Open Graph, Twitter Card, and route-relevant JSON-LD.
- [ ] Add `Restaurant`/`LocalBusiness` data from shared verified facts; include telephone and hours consistently from the provisional content source.
- [ ] Add Menu/MenuSection/MenuItem structured data only for menu content present in the repository.
- [ ] Add Event structured data only for verified future event records, and remove expired events from generated output.
- [ ] Do not use self-serving Google review or aggregate-rating schema.
- [ ] Generate sitemap entries for canonical routes only, with the configured origin and no priority/changefreq claims.
- [ ] Generate robots.txt with the configured sitemap URL and document the GitHub Pages project-path limitation.
- [ ] Add an automated verifier that checks route existence, unique metadata, canonical consistency, parseable JSON-LD, sitemap membership, no Owner.com URLs, no placeholder Toast URL, and no accidental noindex directives.

## Task 4: Update SEO handoff documentation

**Files:**
- Modify: `docs/seo/one-page-strategy.md` or replace with the route-based strategy.

- [ ] Document the stronger-route approach and why thin location/tag pages are excluded.
- [ ] Document the intended Orlando search themes and careful nearby-area positioning.
- [ ] Document provisional hours and the need to confirm them before production cutover.
- [ ] Document the future Toast destination insertion point.
- [ ] Document the future official Google Places API review integration: four live reviews, attribution, direct Google links, restricted API key, and no self-serving rating schema.
- [ ] Document local Docker/GitHub Pages verification and later domain/Search Console/Google Business Profile steps.

## Task 5: Verify the finished surface

**Files:**
- Verify generated `dist/` output and Docker/browser behavior; do not commit generated output unless already tracked.

- [ ] Run `npm run build`.
- [ ] Run `npm run build:pages`.
- [ ] Run `npm run verify:seo` against the built output.
- [ ] Build and run Docker locally.
- [ ] Verify homepage plus every canonical and legacy route in the Browser plugin.
- [ ] Check desktop and mobile-sized layouts, first viewport, route navigation, menu toggle, reservation CTA, directions link, and internal links.
- [ ] Confirm no relevant console errors or framework overlays.
- [ ] Inspect the accepted concept screenshots at `docs/concepts/landing-hero.png`, `docs/concepts/landing-experiences.png`, and `docs/concepts/landing-reservation-footer.png` alongside the latest implementation screenshot.
- [ ] Record any intentional visual deviations; fix material drift before handoff.

## Completion Notes

- [ ] Preserve the existing `src/styles.css` worktree change and unrelated `docs/superpowers/` artifacts.
- [ ] Report local implementation results separately from deferred external work: Toast URL, Google Cloud API key, DNS/hosting, Search Console, Google Business Profile, final hours, and off-site authority signals.
