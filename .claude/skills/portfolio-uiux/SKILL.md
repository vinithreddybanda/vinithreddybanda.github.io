---
name: portfolio-uiux
description: Mandatory visual and motion system for the Vinith Reddy Banda portfolio.
---

# Portfolio UI/UX system

Read root AGENTS.md first. Follow the iOS Botanical brief. This is a new visual system, not an extension of the previous forest-photo and side-rail concept.

## Visual direction
- Calm daylight botanical atmosphere, soft sage, warm white, mist and layered greens.
- Native iOS cues: floating translucent top navigation, restrained glass blur, fine borders, rounded geometry, soft depth and generous touch targets.
- One system font stack throughout. Do not pair unrelated fonts or introduce a decorative serif.
- Hero: rounded garden scene with clear hierarchy, legible overlay and compact supporting glass note.
- Projects: open alternating feature rows with custom illustrative artwork. Never use card grids or fake screenshots.
- Keep copy concise. No résumé dump or filler labels.

## Motion direction
- Native scrolling remains in control.
- One GSAP context and ScrollTrigger for restrained hero parallax and one-shot section reveals.
- Reveal blur is brief and bounded to entering content only. Never animate backdrop-filter or continuously scrub filter blur.
- Animate transform and opacity for scroll-linked motion.
- Respect reduced motion and ensure content is visible without JavaScript.
- Avoid layout-property animation and unnecessary scroll listeners.

## Quality gate
Check desktop, tablet and 320px mobile; scroll in both directions; test navigation, project links, keyboard focus and reduced motion; run npm run check and npm run build. Never claim a test or visual review that did not happen.
