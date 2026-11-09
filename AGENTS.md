# Portfolio engineering constitution

This repository is the source of truth for vinithreddybanda.github.io. Read this file before changing pages, components, styles, motion or dependencies. Keep the portfolio original, accessible and fast.

## Current design brief: Botanical editorial

- Experience: a calm, daylight botanical environment with soft sage, mist, warm white, living greens and gentle sunlight.
- Composition: a restrained floating navigation, one welcoming garden hero, spacious editorial introduction, a consistent open project index, a quiet closing thought and a deep green contact ending.
- Projects: use a repeatable editorial row structure with project number, category, title, short description, link and a small original CSS illustration. No project cards, tiled thumbnails, photo grids, full-screen project scenes or device mockup collages.
- Typography: one coherent system font stack. Express hierarchy through fluid type, weight, tracking and whitespace. No decorative serif pairing or unrelated font families.
- Content: concise introduction, selected projects, current role and contact. Avoid résumé dumps, filler labels and generic availability claims.
- Language: avoid dot separators and status-dot labels. Use natural phrases and botanical vocabulary sparingly. Do not use "available for work" or location badges.
- Responsiveness: fluid widths, clamp-based type and spacing, content-driven heights and explicit layouts for compact phones, tablets and wide windows. Never force desktop compositions into tiny mobile panels.
- Nature: botanical imagery and original CSS/SVG details should feel integrated, not decorative clutter. Keep text readable.

## Motion system
- Native browser scrolling remains in control.
- Hero image has restrained scroll-linked parallax.
- Content reveals once with opacity, a small vertical offset and brief bounded blur-to-clear.
- Floating navigation keeps stable backdrop blur. Animate opacity/background/shadow, not blur radius.
- Animate transforms and opacity for scroll-linked effects. No animated layout properties.
- Respect prefers-reduced-motion. Content remains visible without JavaScript.
- Avoid per-element scroll listeners, unbounded RAF loops and wheel/touch interception.
- Keep one GSAP context and revert it on page hide.

## Engineering and verification
1. Read actual source files and deployment workflow before editing.
2. Use Awwwards references as research, never templates. If configured MCP is unavailable, state so and use verifiable public references.
3. Keep design tokens centralized. No appended override patches or duplicate selectors.
4. Preserve semantic HTML, keyboard access, focus states, metadata and GitHub Pages deployment.
5. Verify 320px mobile, tablet, desktop, reverse scroll, navigation, links and reduced motion.
6. Run npm run check and npm run build. Fix errors before calling work complete.
7. Never claim visual inspection, MCP capture, performance scores or deployment success unless verified.
