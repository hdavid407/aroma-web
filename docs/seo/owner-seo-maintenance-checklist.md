# Aroma Gastro Bar SEO maintenance checklist

Use this checklist before publishing content changes to the GitHub Pages main site.

## Business facts

- [ ] Confirm the business name, address, phone number, email, map link, and regular hours.
- [ ] Add special hours for holidays or one-off events when needed.
- [ ] Confirm the reservation link and the live ordering destination.

## Menu and dining content

- [ ] Update curated signature dishes when the public menu changes.
- [ ] Keep dish names and descriptions aligned with the live ordering menu.
- [ ] Confirm brunch, cocktails, late-night food, pickup, and delivery claims before publishing.

## Events

- [ ] Add only confirmed event names, dates, times, summaries, and approved images.
- [ ] Add a readable event slug and external details link when one exists.
- [ ] Remove or mark expired records so the next build removes their pages and event schema.

## Proof and local presence

- [ ] Approve every testimonial, press mention, award, rating link, and original photo before adding it.
- [ ] Keep the Google Business Profile name, address, hours, menu link, reservation link, ordering link, and website URL consistent.
- [ ] Refresh Google Business Profile menu items, photos, event posts, and review replies as the business changes.

## Verification and measurement

- [ ] Run `npm run lint` and `npm run typecheck`.
- [ ] Run `npm run build` and `npm run build:pages`.
- [ ] Run `npm run verify:seo` after the final build.
- [ ] Review Search Console impressions, clicks, indexing, and queries.
- [ ] Track reservation, order, phone, directions, and event-detail CTA activity through the approved analytics setup.
