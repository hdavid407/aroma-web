# Aroma Gastro Bar — Live Poster Style Profile

## Purpose and audit status

This is the repo-local Aroma Poster Director’s one-time visual audit. It was refreshed against the live preview on **2026-09-03** after the older repo concept screenshots were found to feel dated. The audit is frozen again unless the user explicitly requests another style refresh.

Primary live source: <https://hdavid407.github.io/aroma-web/#experiences>

The `live-site-*.png` references are the current visual authority. The older `site-*.png` files remain as historical repo evidence only; do not use them as the default poster references.

## Evidence reviewed

- Live runtime captures in `docs/aroma-poster-style/site-references/`:
  - `live-site-hero.png`
  - `live-site-experiences.png`
  - `live-site-after-dark.png`
  - `live-site-visit-footer.png`
- Logo reference: `site-references/aroma-logo.png`, sourced from `public/assets/aroma-logo.png`.
- Current implementation: `src/App.tsx`, `src/styles.css`, `src/siteContent.ts`, `src/routeManifest.ts`, and `vite.config.ts`.
- Runtime image set: `public/assets/hero-entrance-v2.png`, `hero-interior.jpg`, `interior-detail.jpg`, `lounge-01.jpg`, food images, drink images, and brunch images.
- Font declaration: `Italiana` for display type and `DM Sans` for utility type.
- Supplied Instagram examples: reviewed only to understand the event categories and the problems the poster system must correct. They are not style references.

The live hero has a settle/fade presentation state. Future audits should wait for the headline, copy, and CTAs to settle before judging the page; the captured hero reference reflects that settled state.

## Live visual character

Aroma currently presents as a dark, intimate, editorial gastrobar and late-night destination. The strongest live-site impression is not “neon club flyer”; it is **black-space hospitality with lush botanical atmosphere, real photography, warm metal, and one memorable illuminated sign**.

The page moves through a quiet visual rhythm:

1. A nearly black hero with the gold wordmark, deep greenery, and a yellow-green illuminated handwritten “Aroma” sign inside the environment.
2. An editorial “ONE PLACE. FOUR MOODS.” section with a large ivory serif statement, restrained gray copy, and a horizontal image-card system.
3. Food, cocktails, brunch, and after-dark imagery presented as one connected hospitality world.
4. A full-bleed after-dark image with a strong black gradient, concise copy, and one clear CTA.
5. A very sparse black-and-gold location/footer treatment using numbered metadata blocks and a large wordmark.

Poster energy should come from the subject, crop, lighting, and event-specific atmosphere. It should not come from piling up unrelated effects, novelty type, or competing neon colors.

## Brand anchors

These are non-negotiable unless the user explicitly requests a controlled expressive variation:

| Element | Rule |
| --- | --- |
| Canvas | Near-black `#080a08`; soft-black surfaces around `#10120f`. |
| Core accent | Warm champagne gold `#c7a26a` for rules, labels, wordmark, controls, and restrained highlights. |
| Text | Ivory `#f3f0e8`; muted support around `#b6b5ae`. |
| Glow accent | Yellow-green `#fff08a` may appear as a single environmental glow/sign cue, not as a general poster palette. |
| Display type | `Italiana`: elegant, high-contrast editorial serif for the dominant statement or event name. |
| Utility type | `DM Sans`: small uppercase metadata, dates, labels, buttons, and supporting copy with generous tracking. |
| Imagery | Photorealistic editorial nightlife, hospitality, cocktail, food, lounge, floral, or culturally relevant imagery. |
| Composition | Full-bleed or strongly cropped image, intentional dark overlay, asymmetrical editorial grid, and clear negative space. |
| Graphic language | Thin rules, numbers, arrows, small metadata, sharp edges, and selective glow—not decorative clutter. |
| Logo | Use the actual gold Aroma logo as a protected asset, with consistent lower-area placement and clear space. Never redraw it in image generation. |

## Layout language

- Use the site’s generous outer-gutter logic, analogous to `clamp(1.25rem, 4.5vw, 5.5rem)`.
- Prefer an editorial split or an intentional off-center anchor over a generic centered flyer.
- Establish one dominant headline, one supporting hook, and one compact information block.
- Use thin gold rules and small numbered/uppercase metadata to create rhythm.
- Align logo, address, date, and CTA to a clear grid; never scatter them as stickers.
- Keep essential information inside Instagram-safe zones and away from common interface overlays.
- Let one image or subject own the composition. Preserve negative space for text instead of placing copy over busy faces or props.
- Recompose the 9:16 version for its taller frame; do not simply crop the 4:5 design.

## Color behavior

The base poster palette is black, ivory, and champagne gold. Photography may introduce one event-specific accent family—such as burgundy/coral for Caribbean energy, a restrained jewel tone for after-dark, or one electric accent for games/karaoke—but it must remain subordinate to the Aroma base.

The live hero’s yellow-green sign is an atmospheric exception: use it as a small glow, edge light, or environmental motif when it supports the event, not as permission to create rainbow/neon posters. Avoid pairing multiple ungoverned neon colors.

## Event modes

Use these as starting modes, not separate brands:

1. **Aroma After Dark** — black, gold, ivory, deep burgundy, lounge shadows, reflective highlights, and music-led nightlife energy.
2. **Live Music / Performance** — editorial performer or stage imagery, controlled warmth, strong title scale, and restrained bloom.
3. **Themed / Special Event** — event-specific subject and one accent family, but the same Aroma typography, spacing, logo, and hierarchy. Caribbean, karaoke, game night, ladies night, and similar programs belong here unless a more specific mode is added.

## Image direction

Default to photorealistic editorial nightlife imagery. Choose the subject from the event type:

- Parties and ladies nights: people-led scenes with intentional pose, flattering directional light, and usable negative space.
- Live performances: performer or stage energy, supplied talent image when available.
- Caribbean or cultural events: celebratory editorial environment and culturally respectful details, avoiding generic stock clichés.
- Karaoke or game night: social atmosphere, microphone/tabletop/game objects, or one art-directed scene instead of an overloaded collage.
- Food or cocktail-led events: tactile, low-key hospitality closeups with dramatic light and black-space framing.

## Typography and copy

The default presenter line is **Aroma Social Presents**. Use it consistently at the top unless the user explicitly supplies a different presenter.

The information hierarchy is:

1. Event name.
2. Date and day.
3. Main hook: DJ, performer, theme, or offer.
4. Time or doors open.
5. Aroma logo.
6. Address.
7. RSVP or ticket CTA.

Use short, edited copy. Critical text must be included in every image-generation request and checked after generation. Correct text takes priority over perfect font imitation, but prompts should still request the Italiana/DM Sans character.

## Anti-patterns from the supplied event examples

Do not reproduce the old poster problems:

- unrelated novelty, brush, or script fonts by default;
- uncontrolled rainbow/neon color combinations;
- multiple competing headline styles;
- dense text colliding with the image or Instagram UI;
- tiny or low-contrast dates, addresses, or CTAs;
- random logo sizes, positions, redraws, or low-quality approximations;
- decorative effects competing with the event name;
- disconnected bars, stickers, wood textures, emojis, or borders unless deliberately reinterpreted through the Aroma system;
- horizontally squeezed or stretched type;
- crops that cut through faces, hands, logos, or critical copy;
- treating every event as the same generic nightclub scene.

## Quality bar

Before presenting a preview, evaluate brand fit against the live references, event clarity, text accuracy, reading order, contrast, spacing, safe-zone compliance, color discipline, logo integrity, image quality, and whether the event still feels exciting. Show three strongest directions, not three arbitrary variations.
