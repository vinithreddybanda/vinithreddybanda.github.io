# Engineering guide

This repository is a multi-page, static-first Astro application. Keep the architecture simple, typed, reusable and fast.

## Structure
- `src/pages/`: route composition only.
- `src/layouts/`: shared document shell, metadata, header and footer.
- `src/components/`: reusable Astro components with clear props.
- `src/data/`: typed content models and portfolio content.
- `src/styles/`: centralized design tokens and global styles.
- `src/scripts/`: lightweight browser state and progressive enhancement.

## Rules
1. Prefer Astro components and static HTML. Avoid client-rendered frameworks, hydration and state libraries unless a measured requirement justifies them.
2. Keep project data centralized. Do not duplicate project data between cards and case studies.
3. Keep tokens centralized. Do not append override blocks or duplicate component styles.
4. Use semantic HTML, keyboard-accessible controls, visible focus and reduced-motion support.
5. Animate transform and opacity. Never run continuous layout reads or per-frame blur on scroll.
6. Preserve factual portfolio content. Never invent clients, impact metrics, outcomes or dates.
7. Support 320px and wider without horizontal overflow or clipped content.
8. Prefer browser-native APIs and keep dependencies lean.
9. Run `npm run build` before considering a change complete.

## Design system
Monochrome palette, editorial typography, square geometry, restrained translucent navigation on scroll and clear hierarchy. Avoid generic gradients, decorative blobs, gratuitous pills, over-rounded cards and animation for its own sake.
