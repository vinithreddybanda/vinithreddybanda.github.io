---
name: portfolio-uiux
description: Mandatory visual and motion system for the Vinith Reddy Banda portfolio.
---

# Portfolio UI/UX system

Read root AGENTS.md first. Follow the Botanical editorial brief.

## Visual direction
- Calm daylight botanical atmosphere, soft sage, warm white, mist and layered greens.
- Floating translucent navigation with restrained blur and clear touch targets.
- One coherent system font stack. Use fluid type, weight and whitespace for hierarchy.
- Hero: welcoming garden image, readable text, restrained botanical line details.
- Projects: consistent open editorial rows with number, category, title, description, link and small original illustration. Never use immersive full-screen scenes, project cards, photo grids or fake screenshots.
- Keep copy concise and natural. Avoid status dots, availability badges, location callouts and dot separators.

## Motion direction
- Native scrolling remains in control.
- One GSAP context and ScrollTrigger for restrained hero parallax and one-shot content reveals.
- Reveal blur is brief and bounded to entering content only. Never animate backdrop-filter or continuously scrub filter blur.
- Animate transform and opacity for scroll-linked motion.
- Respect reduced motion and ensure content is visible without JavaScript.
- Avoid layout-property animation and unnecessary scroll listeners.

## Quality gate
Check desktop, tablet and 320px mobile; scroll in both directions; test navigation, project links, keyboard focus and reduced motion; run npm run check and npm run build. Never claim a test or visual review that did not happen.
