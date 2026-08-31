# Aroma Gastro Bar SEO fact sheet

**Status:** Owner verification required  
**Compared:** 2026-08-30  
**Purpose:** Identify the business facts that must be confirmed before this repo replaces the live site.

## Sources

- [Current public homepage](https://aromagastrobar.com/)
- [Current public menu](https://aromagastrobar.com/menu)
- [Current public contact page](https://aromagastrobar.com/contact)
- Demo repo canonical origin: `https://hdavid407.github.io/aroma-web`

The public site is currently hosted on Owner.com. This repo is an independent, migration-ready replacement and is currently on the `feature/seo-optimize` branch.

## Fact comparison

| Area | Repo currently says | Public site currently says | Owner decision needed |
| --- | --- | --- | --- |
| Business name | Aroma Gastro Bar | Aroma Gastro Bar | Keep the customer-facing and structured-data name consistent. |
| Address | 1700 N Semoran Blvd, Suite 118, Orlando, FL 32807 | 1700 N Semoran Blvd #118, Orlando, FL 32807 | Confirm formatting and suite number. |
| Phone | (407) 237-9661 | (407) 237-9661 | Confirm it is the primary public number. |
| Hours | Monday closed; Tuesday–Friday 5 PM–late; Saturday 5 PM–2 AM; Sunday 12 PM–12 AM | The homepage shows Tuesday–Wednesday 5 PM–late, Thursday–Saturday 5 PM–2 AM, and Sunday 12 PM–12 AM. The contact page shows different Tuesday–Friday and weekend hours. | Resolve the conflict before using hours in production schema or prominent page copy. |
| Brunch | General weekend brunch copy | Homepage promotes Saturday and Sunday brunch from 12–6 PM with a DJ. | Confirm current days, hours, and DJ programming. |
| Ordering | `https://aromagastrobar.com/menu` live-menu handoff | Public menu exposes pickup and delivery ordering. | Reconfirm the destination whenever the ordering provider or URL changes. |
| Menu | Curated signature-dish summary with an external live-menu CTA | Public menu contains additional sections, items, and prices. | Confirm dish names and descriptions before changing the curated summary. |
| Events | Verified future records generate the hub, slugged detail pages, Event schema, and sitemap entries; expired records are filtered out | Public site has event detail pages and changing event programming. | Confirm dates, times, summaries, images, and the owner update process. |
| Reservations | Google Calendar reservation link | Public site links to reservations through Google Calendar. | Confirm the exact reservation destination. |
| Social profiles | Instagram and TikTok handles are stored in the repo | Public pages do not provide a reliable text confirmation of both handles. | Confirm official profile URLs. |
| Google assets | No repo access to Google Business Profile, Search Console, or analytics | Owner-controlled assets | Owner must claim/connect these separately. |

## Known launch risk

The repo can be published as a GitHub Pages demo before all facts are verified, but it must be treated as a demo. Incorrect hours, event dates, menu details, or ordering links could mislead customers. No custom-domain cutover should happen from this repo without owner authorization.

## Owner approval checklist

- [ ] Confirm the exact business name and keep “Aroma Gastro Bar” consistent.
- [ ] Confirm address, phone, email, and hours.
- [ ] Confirm brunch schedule and nightlife claims.
- [ ] Confirm menu source, prices, reservation link, and live ordering link.
- [ ] Confirm event dates and who will maintain them.
- [ ] Confirm official social profile URLs.
- [ ] Confirm who controls the domain and current hosting account.
