# Aroma Gastro Bar route-based SEO strategy

## What is implemented now

The site no longer depends on a single SEO landing page. It now ships a small set of maintained, prerendered routes with unique metadata and visible content for:

- `/`
- `/menu/`
- `/events/`
- `/visit/`
- `/reservations/`
- `/faq/`
- `/group-dining/`
- `/catering/`
- `/story/`
- `/contact/`
- `/gallery/`
- `/gift-cards/`
- `/careers/`
- `/events/{event-slug}/` for verified upcoming events only

Each canonical route gets its own `<title>`, meta description, canonical URL, Open Graph data, Twitter card data, and JSON-LD. The build also generates `sitemap.xml` and `robots.txt` from the prerendered output.

This is a stronger local SEO foundation than a thin one-page strategy because search engines can index distinct, useful destinations that match real visitor intent: menu browsing, event discovery, catering inquiries, contact details, and brand/story exploration.

## Why stronger maintained routes beat thin `/tags/*` or `/places/*` pages

The current implementation intentionally avoids automated taxonomy pages such as `/tags/*` or `/places/*`. Those pages are weak because they tend to create near-duplicate copy, shallow intent matching, and URLs that are hard to keep accurate over time.

For Aroma, stronger pages are the ones the team can actually maintain:

- `menu` has real menu sections and visible item content.
- `events` has a hand-maintained event list, while each verified upcoming event gets a readable detail route and Event schema.
- `visit`, `reservations`, `faq`, and `group-dining` answer high-intent planning questions without creating thin neighborhood pages.
- `catering` has direct conversion paths by phone and email.
- `contact` has address, directions, reservation, and posted hours.
- `story`, `gallery`, `gift-cards`, and `careers` answer specific user needs without filler.

The 404 fallback script still catches legacy `/tags/*` and `/places/*` requests, but it routes them toward stronger destinations instead of rebuilding thin SEO pages. In the current implementation, those legacy taxonomy requests resolve toward `/menu/`, while non-taxonomy misses fall back toward `/`.

## Local discovery focus

The route set should stay focused on real Orlando discovery themes the site already supports:

- Orlando restaurant discovery
- Dominican food in Orlando
- Latin fusion dining
- brunch
- cocktails
- lounge and late-night plans
- catering and group dining

Nearby-area wording needs restraint. It is fine to describe Aroma as an Orlando destination on North Semoran or as useful for nearby Orlando-area discovery. Do not claim Aroma is located in Mills 50, and do not pad copy with competitor names or comparison language. If future copy mentions nearby neighborhoods or districts, keep that language factual, sparing, and easy to defend.

## Canonical, alias, and base-path behavior

The canonical route set above is the only route set that belongs in the sitemap.

Several legacy aliases still exist for continuity:

- `/page/menu/` -> canonical `/menu/`
- `/page/gallery/` -> canonical `/gallery/`
- `/page/contact/` -> canonical `/contact/`
- `/rsvp/` -> canonical `/contact/`
- `/happyhour/` -> canonical `/menu/`

These aliases intentionally reuse the destination route metadata and canonical URL. They are useful for old links and user continuity, but they are not separate ranking pages and should not be added to `sitemap.xml`.

The build is also base-path aware:

- `npm run build` builds for root-path deployment with `--base=/`
- `npm run build:pages` builds for GitHub Pages project-path deployment with `--base=/aroma-web/`

`src/seo.ts` and the prerender pipeline build canonicals and asset URLs from the configured site origin plus the active base path. The current default origin is `https://hdavid407.github.io/aroma-web`.

### GitHub Pages project-path limitation

The current deployment shape is a project site under `/aroma-web/`, not a root-host deployment. That matters for two reasons:

- canonical and asset URLs must continue to include the project path until the site moves to its own domain or root path
- `robots.txt` at `https://hdavid407.github.io/aroma-web/robots.txt` is useful for the project, but it is not authoritative for the entire `hdavid407.github.io` host root

Until a later domain cutover, treat the GitHub Pages deployment as a project-path environment. Submit the generated sitemap directly in Search Console for the deployed project URL instead of assuming host-root robots behavior.

## Structured data boundaries

The current JSON-LD implementation supports:

- `Restaurant` and `LocalBusiness` on canonical pages
- `Menu`, `MenuSection`, and `MenuItem` only on `/menu/`
- `Event` only for verified upcoming events on `/events/`
- visible FAQ content on the dedicated FAQ and catering routes; FAQPage schema remains intentionally disabled

The current implementation does not publish review schema or aggregate rating schema. Keep that boundary in place unless a future review integration is explicitly designed to support it safely and compliantly.

## Provisional hours

The shared schedule currently used in route content and structured data is:

- Monday: Closed
- Tuesday: 5 PM to 12 AM
- Wednesday: 5 PM to 12 AM
- Thursday: 5 PM to 2 AM
- Friday: 5 PM to 2 AM
- Saturday: 5 PM to 2 AM
- Sunday: 12 PM to 12 AM

These hours are marked as provisional in the content model and should be confirmed before any production cutover or final indexing push. If the restaurant updates posted hours, update the shared source in `src/siteContent.ts` so the visible route copy and structured data stay aligned.

## Ordering handoff

The curated menu summary links to the confirmed live ordering destination: `https://aromagastrobar.com/menu`.

The current route content keeps the handoff explicit:

- the menu route exposes an external `Order online` action
- the visit and event-detail routes keep ordering available as a secondary action
- the FAQ explains that pickup and delivery are available through the live menu

If the provider or URL changes, update `businessProfile.orderUrl` in `src/siteContent.ts`, then rebuild and rerun SEO verification. Do not create a thin SEO-only ordering page.

## Future Google Places reviews integration

Live Google reviews are not implemented in this build.

The current site only defines a safe integration boundary for future review content. When the team adds an official Google Places API-backed reviews module, keep the scope narrow:

- show four live reviews
- preserve attribution required by Google
- link each review or review source directly back to Google
- use a restricted API key
- do not add `review` or `aggregateRating` schema to the site

The goal is trustworthy, attributed review content for users, not self-serving rating markup.

## Verification workflow

The implementation should continue to be checked in both deployment modes:

1. Root-path build:
   `npm run build`

2. Root-path SEO verification against the generated `dist/` output:
   `npm run verify:seo`

3. GitHub Pages project-path build:
   `npm run build:pages`

4. Project-path SEO verification against the generated `dist/` output:
   `npm run verify:seo`

5. Docker smoke check:
   build and run the container from the repository root to confirm the production-style Nginx image serves the prerendered output correctly

The verification script currently checks:

- canonical and alias route output exists
- prerendered HTML contains real route content
- canonical metadata is unique across canonical routes
- alias pages canonicalize to their destination routes
- JSON-LD is present and parseable
- only approved schema appears on the relevant routes
- only verified future events remain in visible event output, generated event pages, Event schema, and the sitemap
- sitemap membership contains canonical routes only
- `robots.txt` points to the generated sitemap
- fallback handling covers `/tags/*` and `/places/*`
- Owner.com URLs and placeholder ordering URLs are absent

## Later launch work outside this task

This documentation update does not complete launch readiness. The remaining steps are still separate follow-through items:

- confirm the final public hours before production indexing work
- reconfirm the live ordering destination and synchronize the Google Business Profile menu/order links
- add the official Google Places API reviews integration when credentials and implementation time are available
- cut over from the GitHub Pages project path to the later production domain when available
- verify the domain in Google Search Console and submit the production sitemap
- align Google Business Profile links with the final canonical site URLs
- connect analytics and track key actions such as reservations, directions, ordering, calls, and event-detail clicks
- build off-site authority over time through citations, links, and other credible local signals
