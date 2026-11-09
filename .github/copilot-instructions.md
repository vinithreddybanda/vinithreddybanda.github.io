# Portfolio design and engineering instructions

These instructions apply to every future change to this repository. Treat the site as a personal portfolio with a calm, minimal, editorial visual language and Apple-inspired interaction quality. The target is polished, distinctive, fast, and usable, not a collection of effects.

## Project context

- Framework: Astro 6. Keep the existing Astro architecture unless a concrete requirement justifies a change.
- Keep the site responsive across narrow phones, large phones, tablets, laptops, and wide desktop screens.
- Preserve the owner's real content, links, project details, and existing working behavior. Never invent experience, clients, metrics, awards, or project outcomes.
- Make focused, coherent changes. Do not scatter duplicate styles, scripts, tokens, or animation logic across files.
- Do not replace the page with a template or redesign unrelated sections without a clear request.
- Keep semantic HTML, accessible controls, keyboard navigation, and useful metadata.

## Design direction

Aim for an understated, premium portfolio: generous but intentional whitespace, strong typographic hierarchy, restrained color, precise alignment, and a clear reading path. Use Awwwards-quality craft as a benchmark, not as a reason to overdecorate.

- Prefer a simple, consistent grid and a small number of deliberate layout patterns.
- Use a restrained palette with accessible contrast. Define colors, spacing, radii, shadows, and motion values as shared CSS custom properties.
- Keep surfaces mostly clean and flat. Use translucent surfaces only where they communicate layering or navigation state.
- Avoid gratuitous gradients, neon accents, oversized decorative blobs, floating badges, excessive cards, noisy backgrounds, ornamental dots, and generic AI-portfolio tropes.
- Avoid unnecessary labels such as "available for work", location callouts, decorative separators, or status pills unless the content genuinely needs them.
- Every section should feel like part of one design system. Do not give each section a different visual language.

## Typography: Apple-inspired, not imitation

Use a native system-first sans stack for the crisp iOS/macOS feel, with robust fallbacks:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
  "SF Pro Text", "Helvetica Neue", Inter, ui-sans-serif, system-ui, sans-serif;
```

- Do not assume SF Pro is installed on every platform. Do not bundle or redistribute proprietary font files without a valid license.
- Use a deliberate type scale with responsive sizing via `clamp()`, consistent weights, tight but readable display tracking, and comfortable body line-height.
- Use display typography for a small number of meaningful headings, not every paragraph.
- Keep body copy readable on mobile; avoid tiny metadata and overly tight line-height.
- Use tabular numerals for dates, metrics, and other aligned numeric data where appropriate.
- Load a web font only when it materially improves the design; self-host or use a reputable provider, provide fallbacks, and avoid layout shift.

## Motion and scroll behavior

Motion should make the interface feel responsive and considered. It must never obstruct reading, cause motion sickness, or make the page feel sluggish.

- Use one shared motion vocabulary: consistent duration, easing, stagger, and distance tokens.
- Prefer transform and opacity for animation. Do not animate layout-heavy properties such as width, height, top, left, margin, or padding.
- Never use `transition: all`. Animate only the properties that actually change.
- Use small, one-time entrance reveals: subtle upward movement (roughly 12–24px), opacity, and restrained stagger. Content must remain visible if JavaScript fails.
- Use blur sparingly as a short entrance accent on selected elements only. Do not continuously animate `filter: blur()` while scrolling; it is expensive, can look muddy, and can cause dropped frames. Prefer opacity + transform for scroll reveals.
- If scroll-linked blur is explicitly requested, keep it subtle, bounded, and limited to a small number of elements. Never apply it to every text node or the entire page.
- Use IntersectionObserver for simple reveal-once behavior. Use GSAP + ScrollTrigger only when a measured interaction genuinely needs pinning, scrubbing, or a complex timeline. Avoid custom per-frame scroll handlers and layout reads on every scroll event.
- Do not add smooth-scroll libraries by default. Native scrolling is preferred unless a reference study proves a clear benefit. If Lenis is introduced, keep native keyboard, anchor, reduced-motion, and touch behavior intact.
- Avoid scroll-jacking, forced horizontal scrolling, long pinned sequences, autoplay sound, and cursor effects that interfere with touch or accessibility.
- Hover effects must have equivalent focus-visible states and must not be required to discover essential content.
- Respect `prefers-reduced-motion: reduce`: disable parallax, scrubbing, large translations, and nonessential reveals; show all content immediately.
- Avoid perpetual animation unless it conveys real information. No decorative infinite loops by default.

### iOS-inspired blur and layered surfaces

- Do not keep the header permanently blurred. A header should be clear at rest; introduce a restrained translucent background/backdrop blur only when it overlays content or when a meaningful scrolled state requires it.
- Make the scrolled state conditional and reversible. Keep contrast and legibility in both states.
- Use a restrained blur radius and opaque-enough tint so text remains readable. Provide a solid-color fallback where `backdrop-filter` is unsupported.
- Do not animate large blur radii or apply expensive backdrop filters to large full-screen regions.
- Avoid turning the interface into a glassmorphism theme. Blur is a functional depth cue, not the visual identity.

## Responsive layout and adaptation

- Design mobile-first, then enhance at content-driven breakpoints.
- Use fluid containers, `min()`, `max()`, `clamp()`, CSS Grid, and Flexbox instead of fixed viewport assumptions.
- Prevent horizontal overflow, clipped headings, overlapping navigation, and text collisions at 320px widths and browser zoom.
- Reflow multi-column layouts cleanly; do not merely shrink desktop columns.
- Use responsive images with intrinsic dimensions, appropriate `object-fit`, and lazy loading below the fold.
- Test portrait and landscape mobile, tablet, desktop, and wide desktop. Account for safe areas with `env(safe-area-inset-*)` when needed.
- Keep touch targets comfortably sized and avoid hover-only interaction.

## Awwwards research workflow

When the Awwwards MCP server is available, use it before making substantial visual or motion changes. Follow the workflow documented in [INSANE0777/Awwwards-mcp](https://github.com/INSANE0777/Awwwards-mcp) and [INSANE0777/awwwards-skills](https://github.com/INSANE0777/awwwards-skills):

1. Translate the request into concrete design attributes: portfolio type, visual mood, palette, typography, layout, and interaction goals.
2. Use `list_categories` when filter vocabulary is uncertain. Search `search_sites` with focused portfolio, typography, minimal, editorial, or interaction tags. Inspect screenshots and shortlist 2–3 relevant references.
3. Use `create_design_brief` for the selected references and this project's goal. Extract shared patterns and useful outliers; create an original design rather than copying a reference.
4. Inspect `get_site_details` for palette, technologies, and design elements. Use `get_site_elements` to find relevant component examples.
5. For motion-led references, study actual motion evidence before coding: `record_site_motion`, `analyze_scroll_map`, `analyze_hover_census`, and `get_motion_dna` where supported. Do not infer animation from a still screenshot or poster.
6. State the design direction and implementation plan before making a large redesign.
7. Build in coherent sections. Verify each section's hierarchy, spacing, geometry, and responsive behavior before moving on.
8. Capture and inspect the finished page at desktop and mobile sizes. Use `analyze_page_structure` and `verify_build` when available; fix structural and performance issues before decorative polish.

Use the MCP's actual tool names and schema for the installed profile. Do not pretend a tool ran when it was unavailable. If the MCP is not connected, use the documented principles and say that live Awwwards search/capture was not performed.

## Implementation architecture

- Keep shared design tokens in one global stylesheet or clearly designated token file.
- Keep components small and reusable, but do not create abstractions for one-off markup without a real benefit.
- Keep animation logic centralized and scoped; clean up observers, listeners, and GSAP contexts on teardown.
- Prefer CSS for simple transitions and entrance states. Add dependencies only when native CSS/JS is insufficient.
- Avoid duplicate CSS declarations, conflicting global selectors, inline style sprawl, and unexplained magic numbers.
- Use descriptive component and class names. Keep file and folder structure predictable.
- Do not add a large animation library for a handful of fades or transforms.
- Preserve Astro's static-first rendering and avoid unnecessary client-side hydration.

## Accessibility, performance, and quality gates

Before considering a change complete:

- Run `npm run build` and fix all build errors.
- Check for console errors, missing assets, broken links, and layout overflow.
- Test at minimum 320px, 390px, 768px, 1024px, and 1440px viewport widths.
- Check keyboard navigation, visible focus, semantic heading order, descriptive link text, image alt text, and color contrast.
- Confirm content is visible without JavaScript and with reduced motion enabled.
- Prefer `transform` and `opacity`; avoid animated blur, `transition: all`, forced reflows, unthrottled scroll listeners, and excessive simultaneous animations.
- Check that the first viewport loads quickly and that below-the-fold images are lazy-loaded.
- Verify the whole page, not only the hero. Navigation, project sections, text, buttons, footer, and mobile layouts must share the same tokens and motion rules.

## Decision rule

When choosing between a more elaborate effect and a simpler, faster, more legible implementation, choose the simpler implementation. The portfolio should feel carefully art-directed, not like a demo reel of every animation technique.
