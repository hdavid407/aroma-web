# Aroma Gastro Bar URL migration map

Use this map when the owner moves from the current public Owner.com site to the replacement deployment. GitHub Pages can preserve the alias pages in this repo, but permanent redirects for the old custom-domain URLs must be configured by the owner at the hosting layer.

| Current or legacy path | Replacement canonical path | Handling |
| --- | --- | --- |
| `/` | `/` | Preserve. |
| `/menu` and `/menu/` | `/menu/` | Preserve or permanently redirect the no-slash form. |
| `/page/menu/` | `/menu/` | Permanent redirect or retained canonical alias. |
| `/gallery` and `/gallery/` | `/gallery/` | Preserve or permanently redirect the no-slash form. |
| `/page/gallery/` | `/gallery/` | Permanent redirect or retained canonical alias. |
| `/events` and `/events/` | `/events/` | Preserve or permanently redirect the no-slash form. |
| `/catering` and `/catering/` | `/catering/` | Preserve or permanently redirect the no-slash form. |
| `/story` and `/story/` | `/story/` | Preserve or permanently redirect the no-slash form. |
| `/contact` and `/contact/` | `/contact/` | Preserve or permanently redirect the no-slash form. |
| `/page/contact/` | `/contact/` | Permanent redirect or retained canonical alias. |
| `/rsvp/` | `/contact/` | Permanent redirect or retained canonical alias. |
| `/happyhour/` | `/menu/` | Permanent redirect or retained canonical alias. |
| `/gift-cards` and `/gift-cards/` | `/gift-cards/` | Preserve or permanently redirect the no-slash form. |
| `/careers` and `/careers/` | `/careers/` | Preserve or permanently redirect the no-slash form. |

Do not put aliases in the sitemap. Keep only canonical replacement URLs in the sitemap and make every replacement page self-canonical.
