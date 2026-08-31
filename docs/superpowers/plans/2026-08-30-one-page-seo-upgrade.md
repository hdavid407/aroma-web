# One-Page SEO Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Aroma Gastrobar one-page site a stronger, lower-cost SEO foundation than the current Owner.com implementation while preserving the current visual design, section labels, wording style, and GitHub Pages route.

**Architecture:** Keep the site as a single Vite/React document. Put crawl-critical metadata and stable Restaurant structured data in the static document head, use the existing sections as the content hierarchy, and publish one accurate sitemap URL. Do not create doorway location/tag pages, new page UIs, or guessed Toast links.

**Tech Stack:** React 19, TypeScript, Vite 6, static HTML metadata, Schema.org JSON-LD, XML sitemap.

**Spec:** Existing live-site and competitor SEO review summarized in the task conversation; implementation follows the agreed one-page scope and preserves the current UI at `https://hdavid407.github.io/aroma-web/`.

## Global Constraints

- Keep the current one-page experience and route exactly as-is.
- Keep visible navigation labels such as “After dark”; use relevant terms such as nightlife, Orlando, Dominican fusion, cocktails, and brunch in metadata and supporting semantics rather than forcing a rebrand of the UI.
- Do not add new pages, new interfaces, automated city/tag pages, competitor names, fabricated events, reviews, FAQs, hours, or menu details.
- Do not add an online-ordering URL until the owner supplies the Toast destination. Keep Toast as a future link/configuration change.
- Preserve the user’s existing unrelated `src/styles.css` changes.
- Treat `https://hdavid407.github.io/aroma-web/` as the current canonical site URL. When the custom domain cutover happens, update the documented site-origin values in one pass.

---

## Task 1: Establish the crawl and social metadata contract

**Files:**
- Modify: `index.html`

- [ ] Replace the generic title and description with concise, search-intent-aligned copy covering Aroma Gastrobar, Orlando, Dominican/Latin fusion, cocktails, brunch, late nights, reservations, and the Mills/Semoran-area context without claiming the restaurant is in Mills 50.
- [ ] Add a self-referencing canonical URL for the current GitHub Pages route.
- [ ] Add `robots` metadata that permits indexing and large image previews.
- [ ] Add Open Graph and Twitter card metadata using the existing hero asset as the share image.
- [ ] Add a single `Restaurant` JSON-LD graph with only verified business facts: name, URL, logo/image, cuisine, address, map link, reservation action, and social profiles. Keep any hours or telephone fields out unless they are confirmed against the current business information during implementation.
- [ ] Avoid copying Owner.com’s FAQ schema or generic filler because the current one-page UI does not provide a strong FAQ experience and FAQ rich results are not a dependable restaurant SEO lever.

## Task 2: Improve semantic image signals without changing the design

**Files:**
- Modify: `src/App.tsx`

- [ ] Add descriptive, concise `alt` text to the four experience-card images so the visual content supports the existing Food, Cocktails, Brunch, and After dark sections.
- [ ] Keep the existing headings, visible copy, card layout, animations, navigation labels, and outbound reservation behavior unchanged.
- [ ] Leave the current Owner-dependent Food/Cocktails destinations untouched until the Toast URL is supplied; record the future replacement point without inventing a destination.

## Task 3: Publish a focused one-page sitemap

**Files:**
- Add: `public/sitemap.xml`
- Add: `public/robots.txt`

- [ ] Add only the canonical one-page URL to the sitemap, with an accurate `lastmod` date for this SEO update.
- [ ] Omit ineffective `priority` and `changefreq` values and avoid manufacturing tag/location URLs that would resemble doorway pages.
- [ ] Add a robots file that allows the site and declares the sitemap, keeping the origin easy to update when the custom domain replaces the GitHub Pages host.

## Task 4: Document the free replacement strategy and future handoff points

**Files:**
- Add: `docs/seo/one-page-strategy.md`

- [ ] Document the current target intent: Orlando restaurant discovery, Dominican/Latin fusion, cocktails, brunch, late-night/lounge searches, reservations, and future Toast ordering.
- [ ] Document why the implementation uses one strong page instead of Owner-style thin tag/place-page expansion.
- [ ] Record the future Toast URL insertion point and the canonical/sitemap origin change required during custom-domain cutover.
- [ ] Include a lightweight measurement checklist for Google Search Console, GA4 or equivalent analytics, Google Business Profile links, reservation clicks, and future Toast clicks.

## Task 5: Verify the finished SEO surface

**Files:**
- Verify generated output in `dist/` after build; do not commit generated output unless the repository already tracks it.

- [ ] Run `npm run lint`.
- [ ] Run `npm run build:pages` to verify the existing GitHub Pages base path.
- [ ] Inspect the built `dist/index.html` to confirm the title, canonical, social metadata, and JSON-LD survive Vite processing.
- [ ] Validate that `dist/sitemap.xml` and `dist/robots.txt` are present and contain the intended origin.
- [ ] Review the diff to confirm no visual CSS changes, new routes, new UI, competitor references, guessed Toast URL, or unrelated user changes were introduced.

## Completion Notes

- [ ] Summarize exactly what changed and what remains intentionally deferred (Toast URL and custom-domain cutover).
- [ ] Leave the work uncommitted unless the owner explicitly requests a commit.
