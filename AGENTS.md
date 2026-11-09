# Portfolio engineering constitution

This repository is the source of truth for vinithreddybanda.github.io. Follow this file before changing any page, component, style, animation, or dependency. The portfolio is an original work. Awwwards references are research evidence, never templates to copy.

## One design direction

Build one coherent, editorial portfolio with an Apple-quality interaction finish:

- **Visual character:** precise, minimal, high-contrast, editorial, calm, and tactile. Use a near-black canvas, warm off-white text, restrained neutral surfaces, and one cool blue accent. Keep the existing black-first identity unless the owner explicitly changes it.
- **Geometry:** use a strict grid, deliberate alignment, and predominantly square corners. Use a 4px radius only where a control needs it. Never turn the interface into a collection of pills or rounded cards.
- **Typography:** use Geist Sans for all interface and body typography. Use Instrument Serif Italic only for a small number of editorial emphasis moments. Use a clear type scale, tight display tracking, readable body measure, and consistent line-height. Do not add decorative handwriting fonts.
- **Translucency:** use a restrained iOS-style material only for the fixed navigation and true overlays. The navigation is clear at the top of the page and gains backdrop blur only after content scrolls behind it. Never leave the header permanently blurred. Never apply blur to every card or section.
- **Motion:** use GSAP with ScrollTrigger for scroll choreography. Use CSS transitions for simple hover and focus feedback. All reveal motion follows one pattern: opacity 0 to 1 and translateY(18px) to 0, with one shared easing curve and a short stagger. Elements enter once, remain visible, and never jump or disappear unexpectedly during reverse scrolling.
- **Scroll:** retain native browser scrolling. Do not replace it with a smooth-scroll library or custom wheel/touch interception.
- **Responsive behavior:** design mobile deliberately, not as a compressed desktop. Keep touch targets at least 44px and preserve readable type and content order.

## Hard implementation rules

1. Read the existing implementation before editing. Preserve working content, routing, metadata, accessibility, and deployment behavior.
2. Use the Awwwards MCP configured in `.mcp.json` before making substantial visual decisions. Research references, inspect their screenshots and design DNA, and study actual motion evidence. Do not invent a reference's behavior from a thumbnail.
3. Use one reference-led design direction. Do not present multiple themes, competing variants, optional design systems, or choose-your-own implementation paths.
4. Keep design tokens centralized. Define colors, type, spacing, radii, shadows, easing, and durations once. Components must consume those tokens.
5. Keep shared navigation, buttons, links, section headings, cards, and reveal behavior consistent across the whole site. A global behavior change must be applied and verified across every relevant element.
6. Animate only `transform` and `opacity` for reveals. Do not animate layout properties. Never use `transition: all`. Never animate `filter: blur()` or `backdrop-filter`; do not create blur-heavy scroll effects.
7. Do not attach scroll listeners to every element. Use one shared observer/GSAP context with proper cleanup. Avoid forced synchronous layout, repeated measurements, large shadow stacks, and unnecessary state updates.
8. Respect `prefers-reduced-motion`. Reduced-motion users receive the same content and hierarchy without non-essential movement.
9. Every interactive element must have visible keyboard focus, semantic markup, and an accessible name. Maintain WCAG AA contrast.
10. Do not add a dependency for a visual effect that can be implemented cleanly with the existing stack. Do not introduce a second animation system.
11. Do not leave dead CSS, duplicate selectors, unused components, placeholder content, or scattered one-off overrides. Keep files organized by responsibility.
12. Do not change the live page merely to demonstrate a design system. Implement the requested page work only after the design foundation is coherent.

## Required build sequence

1. Inspect the repository tree, package scripts, current page, and deployment workflow.
2. Use Awwwards MCP to search a focused set of award-winning portfolio references. Inspect the strongest matches and produce one evidence-backed design direction.
3. Capture full-page structure for the chosen reference and inspect actual motion before writing animation code.
4. Write or update the single source of truth for design tokens and component behavior.
5. Implement one page section at a time. Finish and verify each section before moving on.
6. Test desktop and mobile, initial page load, scrolling in both directions, navigation state, hover, keyboard focus, and reduced motion.
7. Run the repository's build and checks. Fix all errors and visual regressions before committing.
8. Summarize exactly what changed, what was tested, and any remaining limitation.

## Required quality gates

- No horizontal overflow at mobile widths.
- No content hidden behind fixed navigation.
- No permanent header blur at the top of the page.
- No flicker, flash of hidden content, repeated reveal, or scroll-direction jump.
- No choppy scrolling, blur animation, layout animation, or unbounded animation loop.
- Consistent type, spacing, grid, corner geometry, and motion across every section.
- Build and deployment configuration remain valid.

## Source attribution

The Awwwards research workflow is informed by:
- https://github.com/INSANE0777/Awwwards-mcp
- https://github.com/INSANE0777/awwwards-skills

Use those projects as research tooling and workflow references. Do not copy showcased websites, proprietary assets, or another creator's complete visual identity.
