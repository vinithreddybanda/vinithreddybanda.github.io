---
name: awwwards-motion-study
description: Use before authoring or debugging a motion-led website. Requires sequential motion evidence, not static screenshots.
---

# Awwwards Motion Study

Motion is part of the design. Do not author complex animation from a thumbnail or a vague impression.

## Capture

1. Fingerprint the reference stack with analyze_stack when available.
2. Use analyze_scroll_map, analyze_hover_census, and get_motion_dna to measure triggers, animated properties, durations and easing.
3. Record a motion-through pass with record_site_motion: wait for the page to settle, scroll in measured steps, and inspect hover and navigation behavior.
4. Capture desktop and mobile when their compositions differ.
5. Review video sequentially. Tile individual passages at 1–2 fps when direct video review is unavailable. A single poster is not motion evidence.

## Motion inventory

For each important element, record:
- trigger: load, scroll-enter, scroll-scrub, hover or click
- properties: transform, opacity, clip-path, or other observed property
- duration and easing
- stagger and overlap
- pin/scrub behavior and reduced-motion fallback

Build only the interactions supported by the evidence. Use GSAP ScrollTrigger for scrubbed camera paths and pinned scenes when the reference warrants them.

## Implementation

- Keep native scroll and avoid per-element scroll listeners.
- Prefer transforms and opacity for motion.
- Never animate CSS blur or backdrop-filter.
- Avoid layout-property animation, forced synchronous measurements and unbounded animation loops.
- Keep a reduced-motion version with all content visible.
- Pause canvas animation when off-screen and cap device pixel ratio.
- Clean up GSAP contexts and observers.

## Verify

Record the build with the same viewport and pass shape as the reference. Compare section centers, trigger order, easing family, overlap, and motion duration. Run build and performance checks. Do not claim motion parity without evidence.
