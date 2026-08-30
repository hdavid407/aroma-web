# Task 1 Report: Shared Route Content and Reusable Page UI

Date: 2026-08-30

## Scope Completed

Implemented Task 1 of the approved route-based SEO upgrade inside `/home/dhernandez/Dev/work/aroma-web`:

- Added a typed shared content source in `src/siteContent.ts` for:
  - verified business facts
  - provisional posted hours
  - social links
  - reservation and directions URLs
  - canonical route definitions with the explicit `id`, `path`, `meta`, and `content` contract
  - menu sections/items
  - manually maintained event records
  - catering FAQs
  - gallery items
- Refactored `src/App.tsx` into focused top-level components that reuse one content source and avoid nested component definitions.
- Preserved the homepage visual structure and core content order:
  - hero
  - experiences
  - reservation
  - footer
- Added route-aware rendering for:
  - `/menu/`
  - `/events/`
  - `/catering/`
  - `/story/`
  - `/contact/`
  - `/gallery/`
  - `/gift-cards/`
  - `/careers/`
- Added pathname plus `data-route-path` selection in `src/main.tsx` so Task 2 can mount the same app contract from static route entries.
- Added stable `data-analytics` hooks to primary reservation, directions, menu, and future-ordering controls without introducing an analytics vendor.
- Added a clearly deferred Google reviews boundary with no copied, fake, or stale review content rendered.
- Implemented event filtering so only verified future event records render on the Events page.
- Kept catering actions direct via `tel:` and `mailto:` links instead of a faux submit form.

## Content Sources Used

Public first-party Aroma pages were used to keep content factual:

- Homepage positioning and experience framing from `https://www.aromagastrobar.com/`
- Current public menu names/descriptions from `https://aromagastrobar.com/menu` and `https://aromagastrobar.com/page/menu`
- Current posted hours from `https://www.aromagastrobar.com/contact`
- Public upcoming/past event records from:
  - `https://aromagastrobar.com/events/EIQqsARgdFDv`
  - `https://aromagastrobar.com/events/Z0hQVsxVmS8f`

## Constraints Preserved

- Homepage visuals remain intentionally equivalent in layout, imagery, typography, animation behavior, and section order.
- Existing unrelated worktree modifications in `src/styles.css` were preserved; only additive route-page styles were introduced for this task.
- No Toast URL was invented or added.
- No Google review quotes, aggregate ratings, or copied testimonials were added.
- No Mills 50 location claim was introduced.
- Business facts were centralized instead of duplicated across components.

## Validation Run

Executed:

- `npm run build`
- `npm run build:pages`
- targeted source checks with `rg` to confirm:
  - no Toast URL usage
  - no Mills 50 claim
  - explicit future-only review placeholder text
  - explicit future ordering placeholder

## Notes / Follow-Up for Task 2+

- Route selection is already base-path aware through `import.meta.env.BASE_URL`, but Task 2 still needs the actual static HTML route entries and canonical output generation.
- Hours are intentionally stored as provisional posted facts and should be confirmed before production cutover.
- The menu content is intentionally typed so Task 2 can reuse it for static HTML metadata/schema generation.
- The events list includes a past public event record to exercise the “expired records do not render” rule.
