# Aroma Poster Director — Design Specification

## Status

The design direction was approved in conversation. This written spec is now awaiting user review; implementation begins only after it is reviewed and accepted.

## Context

Aroma Gastro Bar’s current website has a cohesive, editorial nightlife identity, while the supplied event posters are visually fragmented. The posters use unrelated display fonts, uncontrolled neon and warm color combinations, inconsistent logo treatment, crowded information blocks, weak contrast, and uneven spacing. The business still needs expressive posters for different event types, including karaoke, games, Caribbean/day parties, R&B after-dark events, ladies nights, and similar nightlife programming.

The requested solution is a local, repo-owned conversational art director that uses the current site and repository as its primary visual source of truth, then uses ChatGPT image generation to create Instagram-ready poster concepts.

## Goals

1. Capture the current site’s visual language once through an LLM-led audit of screenshots, source styles, fonts, logos, layout, imagery, and interaction cues.
2. Store that audit as a reviewable style profile and curated site-reference set in the repository.
3. Create a local skill and agent prompt named **Aroma Poster Director**.
4. Support conversational event-poster requests with brief confirmation, three rough visual previews, selection, refinement, and export.
5. Keep posters recognizably Aroma while allowing controlled event-specific variation.
6. Produce tailored Instagram feed and Reel/Story assets in PNG and JPEG formats.
7. Preserve approved poster references and their creative metadata without allowing unapproved drafts to influence future work.

## Non-goals

- Redesigning the website or changing its existing design system.
- Automatically re-auditing the site on every poster request.
- Turning the existing bad event posters into style references.
- Generating captions or alt text by default.
- Creating animated Reel assets in the first version.
- Silently inventing or reusing business details when the user has not confirmed them for the current event.

## Source-of-truth hierarchy

The agent must resolve conflicts in this order:

1. The frozen Aroma site style profile.
2. Explicit instructions for the current event request.
3. Explicitly approved poster references.
4. General image-generation conventions.

The current event request may authorize a controlled expressive deviation, but it should not erase the core identity. When the deviation is meaningful, the agent presents both an on-brand direction and a more expressive direction.

## One-time visual audit

The audit documents the current site before the agent prompt is finalized. The live-site refresh on 2026-09-03 supersedes the initial concept-only evidence. It uses:

- Live runtime captures in `docs/aroma-poster-style/site-references/live-site-*.png` as primary visual evidence; existing screenshots in `docs/concepts/` are historical context only.
- Current runtime assets in `public/assets/`.
- The actual `Italiana` and `DM Sans` font references and CSS declarations.
- `src/App.tsx`, `src/styles.css`, and `src/siteContent.ts` for composition, content, and interaction cues.
- The actual Aroma logo asset.

The audit output will live in `docs/aroma-poster-style/style-profile.md`. A small curated set of screenshots, logo files, font references, and approved site imagery will be saved under `docs/aroma-poster-style/site-references/`.

The audit is frozen after the live refresh. It is refreshed only when the user explicitly asks for a new style audit.

## Frozen Aroma design language

The profile must encode these non-negotiable anchors:

- Near-black canvas: `#080a08`, with soft-black surfaces around `#10120f`.
- Warm champagne-gold accent: `#c7a26a`; gold rules and controls should remain restrained.
- Ivory text: `#f3f0e8`.
- `Italiana` for large editorial display headlines.
- `DM Sans` for small uppercase metadata, labels, dates, buttons, and supporting copy, with generous tracking.
- Editorial, photographic, nocturnal, luxe, and culturally rooted tone.
- Full-bleed or strongly cropped imagery with intentional dark overlays for legibility.
- Thin rules, numbered details, arrows, clean grids, and disciplined negative space.
- Square-edged controls and panels; no rounded-card or glassmorphism language.
- Imagery may bring controlled coral, burgundy, tropical green, amber, or jewel-tone energy, but the interface system remains black, gold, and ivory.

The profile must also include an anti-pattern list: uncontrolled rainbow/neon palettes, unrelated novelty or script fonts by default, competing headline treatments, crowded text blocks, edge collisions, inconsistent logo placement, low-contrast information, and decorative effects that overpower the event message.

## Local skill and agent

The project-owned skill will live at:

`.agents/skills/aroma-poster-director/`

It will contain:

- `SKILL.md` — concise invocation and routing instructions.
- `agents/openai.yaml` — UI metadata for the local skill.

The conversational agent prompt will live at:

`docs/aroma-poster-style/agent-prompt.md`

The skill will direct the agent to read the frozen style profile and agent prompt before handling a poster request. The skill will not trigger a site re-scan unless the user explicitly requests a refresh.

## Conversational workflow

For each poster request, the agent will:

1. Accept either a structured brief or a natural-language description.
2. Ask for missing essentials and confirm the current business details rather than silently reusing them.
3. Confirm: event name, date/day, time or doors, event mode, main hook, performer/DJ details, offer, venue/address, RSVP or ticket CTA, age restriction, and optional assets.
4. Infer an initial emotional tone from the event type and include it in the brief confirmation for user adjustment.
5. Select a controlled palette and event treatment, while allowing explicit user overrides.
6. Present three rough visual poster previews for comparison.
7. After the user chooses one, preserve its composition and identity through revisions by default.
8. Generate the complete poster with text included in the image-generation composition.
9. Inspect critical text and regenerate up to three times when event name, date, time, venue, or CTA is wrong or materially distorted.
10. Internally quality-check each preview for brand fit, hierarchy, legibility, spacing, contrast, color control, and Instagram readiness; show only the strongest three directions.
11. Deliver a concise explanation with the image(s).
12. Create a tailored 4:5 feed version and a tailored 9:16 Reel/Story version.
13. Export both PNG and JPEG versions.
14. Save final approved exports and metadata in the event output folder.

The actual logo is a protected asset. The agent must place the supplied logo rather than ask image generation to redraw it. The logo uses a protected lower-area zone with consistent clear space, minimum size, and contrast; alignment may adapt between formats.

## Poster system

The first supported event modes are:

1. Aroma After Dark / DJ and nightlife.
2. Live music or performance.
3. Themed or special events, including Caribbean, karaoke, and game-night variants.

All modes share typography, spacing, information hierarchy, logo treatment, and finishing standards. Modes may vary image subject, crop, accent color, and energy.

The default top brand line is **Aroma Social Presents**.

The main information hierarchy is:

1. Event name.
2. Date and day.
3. Main hook — DJ, performer, theme, or offer.
4. Time or doors open.
5. Aroma logo.
6. Address.
7. RSVP or ticket CTA.

Supporting information is optional. The agent should prefer one dominant headline, one supporting hook, and a small number of secondary details. If an event needs substantial additional information, it should propose an optional carousel/detail slide instead of overcrowding the hero poster.

The default image style is photorealistic editorial nightlife imagery. The agent chooses people-centered, atmosphere-focused, food/drink, object, or graphic-motif imagery based on the event type. Supplied DJ, performer, sponsor, venue, or QR assets may be used when provided, while remaining within the Aroma system.

## Instagram outputs

- Feed: 1080 × 1350 px, 4:5.
- Reel/Story: 1080 × 1920 px, 9:16.

The 9:16 output is a tailored recomposition, not a crop. Both formats must protect essential text from common Instagram interface overlays. The selected concept remains visually consistent across both formats while adapting crop, scale, hierarchy, and spacing.

## Approval and storage

Only the explicit phrase **“Approve this as a reference”** promotes a poster into the reference set. The agent must never treat a rough preview or unapproved final as a future reference.

Approved references are stored with their image and creative metadata: confirmed brief, event mode, final prompt, and revision notes. The style profile remains the higher authority when a reference conflicts with it.

Planned directories:

- `docs/aroma-poster-style/` — frozen style profile and agent prompt.
- `docs/aroma-poster-style/site-references/` — one-time audit screenshots, logo, font references, and curated site imagery.
- `docs/aroma-poster-style/approved-posters/` — explicitly approved generated references and metadata.
- `public/assets/event-posters/<event-slug>/` — finished exports and event metadata.

Recommended event filenames:

- `<event-slug>-feed.png`
- `<event-slug>-feed.jpg`
- `<event-slug>-reel.png`
- `<event-slug>-reel.jpg`
- `metadata.md`

Rough previews are temporary unless explicitly approved.

## Quality and failure handling

- Critical text must be verified after every generation pass.
- The agent makes up to three automatic regeneration attempts per direction.
- After three failed attempts, it reports the issue and asks whether to simplify copy, change composition, or try again.
- Correct text takes priority over exact font imitation, while the prompt still requests Italiana and DM Sans character.
- Missing or ambiguous event details are resolved during brief confirmation, not guessed silently.
- Expressive requests are supported through paired on-brand and expressive directions when the deviation is substantial.

## Validation

Validation will be split into:

1. Static validation of skill frontmatter, naming, discoverability, and reference links.
2. Manual review of the frozen style profile against the inspected site screenshots and source files.
3. A realistic poster request using one of the supplied event types.
4. Visual review of three rough previews, selected-concept revision behavior, correct critical text, tailored 4:5/9:16 outputs, protected logo use, and saved metadata.
5. A final repository status check confirming only scoped files changed.

No website application code should change as part of this work.
