# Aroma Gastrobar one-page SEO strategy

## Approved approach

Aroma Gastrobar uses one strong, crawlable page as the primary SEO surface. The page is the source of truth for the restaurant’s Orlando discovery intent and connects searchers to the existing on-page experiences, reservation action, directions, and social presence.

The target search intent is local discovery for:

- Orlando restaurants
- Dominican and Latin fusion
- Cocktails
- Weekend brunch
- Late-night and lounge experiences
- Reservations
- Future Toast ordering

The current page supports these themes through its title and description, restaurant structured data, visible experience sections, reservation call to action, location information, and current internal anchors. Content should remain specific to what the implementation actually supports; this document does not authorize adding hours, phone information, FAQs, menu details, or other unverified claims.

## Why this stays one page

The strategy intentionally avoids thin automated city/tag pages. A page for every city, tag, or keyword variation would create near-duplicate pages with little distinct value, dilute crawl and internal-link signals, and risk making location or experience claims that are not supported by the current implementation. One useful page gives search engines a clearer canonical destination and gives visitors a coherent path from discovery to reservation or directions.

Additional pages should only be considered when there is genuinely unique, maintained content and a clear user need—not as a programmatic substitute for substance.

## Future ordering handoff

When a real Toast ordering URL is approved, insert it as a clearly labeled ordering action alongside the existing “Reserve your table” action in the reservation section. Update the relevant page copy and any applicable structured data only after the destination is confirmed. Do not publish a placeholder or fabricated Toast URL, and do not create a separate thin ordering page solely for SEO.

## URL and domain handoff

The current production origin is:

`https://hdavid407.github.io/aroma-web/`

The canonical link, Open Graph URL, restaurant structured-data URL, asset references, robots sitemap reference, and sitemap location currently use that GitHub Pages origin. During a future custom-domain cutover, replace the origin consistently in all of those locations, configure the custom domain and HTTPS, and verify redirects and the deployed sitemap before changing the canonical and sitemap references. The custom domain is not yet specified here.

## Lightweight measurement checklist

- [ ] Confirm the deployed page is indexed in Google Search Console and submit or verify the sitemap.
- [ ] Monitor impressions, clicks, queries, average position, indexing, and URL inspection in Google Search Console.
- [ ] Configure GA4 or an equivalent analytics tool and confirm page-view and outbound-click collection.
- [ ] Verify Google Business Profile links point to the current canonical page and the intended reservation/directions destinations.
- [ ] Track reservation-link clicks as a primary conversion event.
- [ ] After the approved Toast URL is added, track Toast outbound clicks separately and validate the destination.
- [ ] Recheck canonical, sitemap, structured data, and links after any custom-domain cutover.
