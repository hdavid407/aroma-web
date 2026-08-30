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

The current owner-dependent replacement points already live in `src/App.tsx`:

- `https://www.aromagastrobar.com/dinner` for the Food card
- `https://www.aromagastrobar.com/drinks` for the Cocktails card

When the approved Toast destination exists, replace those two existing hrefs intentionally rather than adding guessed new routes elsewhere in the app.

## URL and domain handoff

The current production origin is:

`https://hdavid407.github.io/aroma-web/`

The canonical link, Open Graph URL, restaurant structured-data URL, asset references, robots sitemap reference, and sitemap location currently use that GitHub Pages origin.

For the current GitHub Pages project site, `public/robots.txt` is served under `/aroma-web/robots.txt`. That file is useful as a project artifact and should keep the sitemap reference accurate, but it does not control the entire `hdavid407.github.io` host because robots directives are authoritative only at the host root. For the current deployment shape, submit the sitemap directly in Google Search Console for `https://hdavid407.github.io/aroma-web/` instead of treating the project-path robots file as host-level control.

During a future custom-domain cutover, update the documented site origin in one pass, configure the custom domain and HTTPS, and verify redirects plus the deployed sitemap before changing canonical references. That handoff must also explicitly verify and, if needed, change the Vite `/aroma-web/` build base and the runtime asset base so generated asset URLs match the target custom-domain path shape. Once the site is served from the custom domain at its root, the deployed `/robots.txt` becomes authoritative for that host. The custom domain is not yet specified here.

## Lightweight measurement checklist

- [ ] Confirm the deployed page is indexed in Google Search Console and submit or verify the sitemap.
- [ ] For the current GitHub Pages project URL, submit or verify `https://hdavid407.github.io/aroma-web/sitemap.xml` directly in Google Search Console.
- [ ] Monitor impressions, clicks, queries, average position, indexing, and URL inspection in Google Search Console.
- [ ] Configure GA4 or an equivalent analytics tool and confirm page-view and outbound-click collection.
- [ ] Verify Google Business Profile links point to the current canonical page and the intended reservation/directions destinations.
- [ ] Track reservation-link clicks as a primary conversion event.
- [ ] After the approved Toast URL is added, track Toast outbound clicks separately and validate the destination.
- [ ] Recheck canonical, sitemap, structured data, Vite base-path behavior, runtime asset URLs, and links after any custom-domain cutover.
