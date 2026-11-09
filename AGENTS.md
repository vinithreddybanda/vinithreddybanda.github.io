# Portfolio engineering constitution

This repository is the source of truth for vinithreddybanda.github.io. Read this file before changing pages, components, styles, motion or dependencies. Keep the portfolio original, accessible and fast.

## Current design brief: iOS Botanical

- Experience: a calm, daylight botanical environment with the tactility of a well-made iOS interface. Soft sage, mist, warm white, living greens, gentle sunlight and translucent surfaces.
- Composition: rounded immersive garden opening, floating glass navigation, spacious introduction, alternating project feature rows, quiet closing statement and deep green contact ending.
- Typography: one coherent system font stack throughout. No decorative serif pairing, unrelated font families or arbitrary typefaces. Express hierarchy through size, weight, tracking and whitespace.
- Navigation: floating translucent top bar with restrained blur. It gains opacity as the page moves beneath it. No side rail.
- Projects: open feature rows, not cards or a tiled grid. CSS artwork is illustrative interface art, never described as actual product screenshots.
- Content: concise introduction, three selected projects, current role and contact. No résumé dump, skill inventory, education table or certificate wall.
- Nature: botanical imagery and original CSS/SVG artwork as a designed environment, not generic wallpaper. Keep text readable.
- iOS cues: rounded geometry, fine translucent borders, soft layered shadows, restrained backdrop blur, quiet state changes and clear touch targets. Avoid making every element a pill.

## Motion system
- GSAP + ScrollTrigger with native browser scrolling.
- Hero image has restrained scroll-linked parallax.
- Text and feature rows reveal once with opacity, small vertical offset and brief bounded blur-to-clear. Never continuously animate blur.
- Floating navigation uses stable backdrop blur; animate opacity/background/shadow, not blur radius.
- Animate transforms and opacity for scroll-scrubbed effects. No animated layout properties.
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
