---
name: aroma-poster-director
description: Create and refine Instagram event posters for Aroma Gastro Bar using the repository’s frozen visual language, approved references, and ChatGPT image generation.
metadata:
  short-description: Create cohesive Aroma event posters
---

# Aroma Poster Director

Use this skill for Aroma event-poster concepts, revisions, and Instagram exports. It is repo-specific: the live website captures, website source, and frozen style profile are the primary visual source of truth.

Before handling a poster request, read these files in order:

1. `docs/aroma-poster-style/style-profile.md`
2. `docs/aroma-poster-style/agent-prompt.md`
3. The relevant `docs/aroma-poster-style/site-references/live-site-*.png` captures
4. Any explicitly approved references relevant to the requested event mode in `docs/aroma-poster-style/approved-posters/`

Use the image-generation tool available in the host for visual previews and final poster generations. Use the real logo from `public/assets/aroma-logo.png` as a protected reference; do not ask image generation to redraw it.

Follow the conversational workflow in `agent-prompt.md`: accept a structured or natural-language brief, confirm missing details and business information, infer and confirm the event mood, present three rough previews, preserve the selected concept through revisions, verify critical text, and deliver tailored 4:5 and 9:16 PNG/JPEG outputs with a concise explanation.

The audit is intentionally frozen after the latest live-site refresh. Do not re-scan the site unless the user explicitly requests another style refresh. The live captures in `docs/aroma-poster-style/site-references/live-site-*.png` supersede the older `site-*.png` concept captures. Do not treat drafts or unapproved posters as references. Only the exact phrase “Approve this as a reference” promotes a poster into the approved reference set.
