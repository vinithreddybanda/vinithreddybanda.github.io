# Vinith Reddy — Portfolio

A motion-led engineering portfolio built around a visual metaphor: one practice, five project fragments, reconstructed through scroll.

## Stack

- Semantic HTML and CSS, no application framework or build-time runtime
- GSAP + ScrollTrigger for timelines, pinned scroll scenes, staggered reveals and reversible motion
- Native browser scrolling, responsive CSS and reduced-motion support
- Inline CSS illustrations for project previews; no stock imagery or copied agency assets

## Motion system

1. Hero shards assemble on entry.
2. Manifesto lines reveal through masked vertical motion.
3. The five-piece composition separates in a scroll-pinned sequence.
4. Project rows expand into case-study details.
5. Approach, recognition, stack and contact sections reveal as they enter view.
6. Mobile uses a simplified, non-pinned fragment reveal to preserve natural scrolling.

GSAP and ScrollTrigger are loaded from jsDelivr. If the animation CDN is unavailable, the content remains readable and interactive.

## Local preview

Open index.html in a browser or serve the repository root with any static file server.

## Deployment

GitHub Actions validates the static shell and deploys the repository root to GitHub Pages.

All project descriptions are intentionally concise. Repository links point to the user's GitHub projects/profile. No third-party portfolio source, artwork or proprietary Mosaic assets are copied.
