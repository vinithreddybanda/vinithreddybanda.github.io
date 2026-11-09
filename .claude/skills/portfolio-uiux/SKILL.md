---
name: portfolio-uiux
description: Apply the repository's single visual and interaction system to every portfolio change. Use before designing, implementing, or debugging any page, component, typography, blur, scroll behavior, or animation.
---

# Portfolio UI/UX system

This skill is mandatory for all visual work in this repository. Read the root `AGENTS.md` first. Its rules are binding. This skill defines the single workflow; do not offer alternate design directions or implementation choices.

## Design north star

Create a quiet, precise, nature-led editorial portfolio with iOS-level interaction polish, not an imitation of iOS chrome. Use deep forest green, moss and fern accents, warm limestone backgrounds, and muted botanical neutrals. Photography and organic tonal depth provide atmosphere; avoid literal leaf motifs, decorative dots, and noisy textures. Use Geist Sans throughout, with Instrument Serif Italic reserved for editorial emphasis. Keep geometry disciplined and layouts spacious.

The iOS material treatment belongs only on the fixed navigation and overlays. The navigation begins transparent. It becomes subtly translucent with backdrop blur only after the page has scrolled beneath it. It must not look blurred on initial load. Never apply a blur filter to moving content.

## Awwwards MCP research protocol

Before substantial visual work, use the connected `awwwards` MCP server:

1. Translate the request into concrete search terms for portfolio, typography, interaction, color, and technology.
2. Search award-winning sites and inspect the returned screenshots. Shortlist the strongest references based on the actual visual evidence.
3. Inspect site details and elements for palette, type, layout, and motion. When a motion reference matters, inspect its video or record the motion; a poster is not motion evidence.
4. Create one design brief from the selected references. Extract shared principles and useful outliers, then define one original direction for this portfolio.
5. State the chosen direction briefly before implementation. Every visual decision must trace to the brief or to this repository's design constitution.
6. Never copy one reference site wholesale. Do not reuse its brand assets or present a study recreation as original work.

Use the MCP's available tool names and profile mapping from its installed documentation. Do not fabricate MCP results when the server is unavailable. If it is unavailable, report that limitation and work only from evidence already available in the repository.

## Canonical visual rules

- **Typography:** Geist Sans is the sole interface and body family. Instrument Serif Italic is the sole editorial accent. Establish a fluid type scale with `clamp()`; use consistent tracking and line-height.
- **Color:** deep forest green, moss and fern accents, warm limestone backgrounds, and muted botanical neutrals. Keep contrast accessible.
- **Layout:** use a consistent max-width container, shared spacing scale, stable grid, generous section padding, and deliberate editorial rhythm. Favor open space over decorative panels.
- **Surfaces:** use solid surfaces for ordinary content. Use translucent material only for the navigation and overlays that need to sit above scrolling content.
- **Corners:** 4px maximum radius for ordinary controls and surfaces. No pill UI.
- **Icons:** use one consistent stroke weight and optical size. Icons support labels; they do not replace essential text.

## Canonical motion rules

- Use GSAP + ScrollTrigger for scroll reveals and choreography. Use CSS transitions only for local hover/focus feedback.
- Use one shared easing curve: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Use one reveal recipe: `opacity: 0; transform: translate3d(0, 18px, 0)` to `opacity: 1; transform: translate3d(0, 0, 0)`. Keep duration between 0.55s and 0.75s and stagger nearby children by 0.08s.
- Reveal on first meaningful viewport entry. Once revealed, content stays visible. Do not replay on every tiny scroll reversal.
- Use the same reveal behavior for headings, paragraphs, media, cards, and footer content. Vary only stagger order to respect reading order.
- Keep native scrolling. Do not install or add a smooth-scroll engine.
- Animate transform and opacity only. Never animate blur, backdrop-filter, width, height, top, left, margin, or padding. Never use `transition: all`.
- Use a single shared observer or GSAP context and clean up all triggers on unmount.
- Disable non-essential movement under `prefers-reduced-motion: reduce`.

## Navigation blur behavior

The navigation starts fully clear with no backdrop blur. When the page moves beneath it, apply one restrained translucent background and a static backdrop blur. Toggle the state from one shared scroll-aware mechanism with a small threshold and hysteresis to prevent flicker. Do not animate the blur amount. Do not blur the page, hero, cards, or section content. On returning to the top, restore the clear navigation state.

## Implementation sequence

1. Inspect the actual files and existing component architecture.
2. Research references through Awwwards MCP and form one design brief.
3. Define shared tokens and reusable primitives before page-specific styling.
4. Implement the shared shell and navigation behavior first.
5. Implement page sections in document order, completing each section before starting the next.
6. Apply the same type, spacing, grid, and reveal primitives to every section.
7. Verify initial load, scroll down, scroll up, rapid direction changes, mobile touch scrolling, navigation blur threshold, focus states, and reduced motion.
8. Run the build and available tests. Fix performance and console errors before committing.

## Performance and accessibility gate

- No scroll event handler per element.
- No forced layout reads in animation callbacks.
- No infinite decorative animation.
- No filter/backdrop-filter tween.
- No layout-property tween.
- No hidden content flash on initial render.
- No focus trap outside a true modal.
- Keyboard access and visible focus for all controls.
- Minimum 44px touch targets.
- AA text contrast.
- No horizontal overflow at 320px viewport width.

A visual change is complete only when the shared behavior works consistently across all affected sections and both scroll directions.
