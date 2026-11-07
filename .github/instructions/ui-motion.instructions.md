# UI/UX and Motion Design Specification

This file is mandatory for every UI, visual design, responsive layout, interaction, or animation task in this repository. It is project-specific guidance, not permission to redesign the product without a brief.

## 1. Non-negotiable typography: SF Pro only
- Use the locally hosted SF Pro Display family already present in `public/fonts` and declared in `src/style.css`.
- SF Pro is the only typeface permitted anywhere: hero, headings, body, buttons, navigation, metadata, forms, numbers, tooltips, and dynamically rendered content.
- Never add Google Fonts, Adobe Fonts, CDN fonts, variable font packages, or font-loading services.
- Never pair SF Pro with serif, monospace, Inter, Geist, Roboto, Arial, or another family. No one-off exceptions for code, labels, or decorative text.
- Do not silently change font files or their licensing/provenance. Use only the font assets already in the repository unless the user explicitly supplies/approves additional SF Pro assets.
- Build hierarchy using SF Pro weight, size, optical sizing when supported, line-height, tracking, and colour. Do not use letter spacing so tight that it harms readability.
- Use real available font weights where possible. Avoid synthetic bold/italic if a matching local face exists. Keep `font-synthesis: none` where appropriate.
- Keep font loading local and predictable. Avoid layout shift; use suitable `font-display` behavior and preload only the exact above-the-fold font file if measurement justifies it.
- If an SF Pro asset is missing for a needed weight/style, use the closest available SF Pro face and adjust weight/size. Do not substitute another typeface.

## 2. Design process: intent before pixels
Before coding:
1. Identify the page's primary user, purpose, key task, and most important content.
2. Inspect the current page, assets, components, and existing visual language. Record what should remain unchanged.
3. Define the visual direction in a short design brief: mood, focal point, hierarchy, layout, palette, density, and interaction character.
4. Define a small token set before adding scattered CSS values.
5. Sketch the page structure or component states mentally or in a compact outline. Avoid starting with decorative effects.
6. Check the design against the actual content and viewport. Reject generic template decisions that could fit any unrelated site.
7. Implement, inspect at mobile/tablet/desktop sizes, then run a visual and accessibility critique.

Do not redesign the entire portfolio or invent new sections, copy, imagery, or interactions unless the task asks for them. Preserve the current identity and content by default.

## 3. Layout, hierarchy, and visual craft
- Establish one primary focal point per view. Secondary elements must support it rather than compete.
- Use a deliberate grid and alignment system. Align related elements consistently; do not center everything by default.
- Use whitespace to group and separate content. Density should follow information importance, not arbitrary symmetry.
- Build spacing from a compact scale using CSS custom properties. Avoid unrelated one-off margins and padding.
- Use responsive constraints such as `min()`, `max()`, `clamp()`, and fluid grids where they improve behavior. Do not let fluid sizing create unreadable text or oversized empty regions.
- Keep text measure comfortable. Long-form body copy should not span the full desktop viewport.
- Establish clear hierarchy through SF Pro size, weight, line-height, tracking, and contrast. Do not depend on all-caps micro-labels for every section.
- Use colour with intent. Maintain sufficient contrast and avoid using colour alone to signal success, failure, selection, or status.
- Use borders, shadows, blur, gradients, glow, and glass effects only when they clarify depth or focus. Avoid stacking effects until the interface becomes muddy.
- Keep radii and elevation consistent. Not every element needs a rounded card or shadow.
- Avoid repeated identical card grids when the content calls for a more editorial, spatial, or asymmetric composition.
- Use real content and realistic text lengths when evaluating layout. Placeholder text can hide wrapping and overflow defects.
- Design empty, loading, error, success, disabled, hover, focus, pressed, and selected states when those states exist.
- Make controls understandable without relying on icons alone. Use accessible names and visible labels where needed.

## 4. Responsive and adaptive behavior
- Start at narrow mobile widths, then expand to tablet and desktop. Check at least 320px, 375/390px, 768px, 1024px, and a wide desktop viewport.
- Reflow composition intentionally. Do not simply shrink desktop layouts or hide essential content.
- Check text wrapping, heading line breaks, navigation collapse, image crops, card density, control reachability, and safe spacing.
- Avoid fixed heights for text-bearing components unless overflow behavior is intentionally designed.
- Ensure touch targets are comfortably usable; aim for at least 44 by 44 CSS pixels for primary touch controls.
- Hover must never be the only way to reveal essential information or operate a control. Provide touch, keyboard, and focus equivalents.
- Avoid horizontal scrolling unless it is a deliberate, discoverable interaction with a clear affordance.
- Respect device safe areas when building edge-to-edge layouts.

## 5. Interaction design and feedback
- Every control must have a clear action and a predictable result.
- Provide distinct hover, focus-visible, pressed, selected, disabled, loading, success, and error states where relevant.
- Use immediate feedback for actions. Keep labels consistent between the action and its confirmation.
- Prevent double submission and repeated triggering when an action is pending.
- Make dialogs, menus, and overlays keyboard operable, correctly labelled, dismissible where appropriate, and focus-managed.
- Preserve browser-native behavior for links, buttons, forms, selection, and scrolling unless there is a strong usability reason to customize it.
- Avoid fake controls, dead links, decorative buttons, and interactions that exist only to demonstrate animation.

## 6. Motion principles
Motion is a functional layer of the interface, not decoration. Each animation must serve at least one purpose:
- Feedback: confirm press, selection, submission, copy, save, or error.
- Continuity: show where an element came from or where it went.
- Hierarchy: direct attention to the most important change.
- Spatial understanding: communicate expansion, collapse, navigation, or layered depth.
- Character: express the identity of the experience, but never at the expense of clarity or speed.

If removing the animation changes nothing about comprehension, feedback, or the intended character, remove it.

### Motion token baseline
Use these as starting ranges, then tune to the actual interaction. Centralize values as CSS custom properties or shared animation constants. Avoid inventing a new duration for every element.

- Instant feedback: 90–140ms.
- Small hover/focus/press transitions: 140–220ms.
- Standard component state changes: 180–280ms.
- Menus, popovers, and small panels: 180–300ms.
- Larger layout transitions: 280–450ms.
- Hero/section entrance choreography: 450–750ms, only when it earns the time.
- Stagger: usually 30–70ms between related items; keep total sequence short.
- Easing: use restrained ease-out for entrances, ease-in for exits, and a balanced ease-in-out for state changes. Use spring physics only when the object metaphor and interaction justify it.
- Travel distance: keep routine UI movement small, usually 4–16px. Larger movement must be spatially meaningful.
- Scale: subtle feedback only; avoid repeated elastic overshoot and bouncy default motion.

These are guidance ranges, not targets that every element must animate toward. Prefer shorter motion when the user is waiting.

### Animation implementation rules
- Prefer CSS transitions for simple hover, focus, pressed, opacity, and transform states.
- Prefer transform and opacity because they generally avoid layout recalculation. Animate `height` or `width` only when necessary and verify the result.
- Avoid animating large blur radii, box shadows, filters, expensive gradients, and full-screen backdrops continuously.
- Avoid layout thrashing. Batch reads and writes; use IntersectionObserver for reveal triggers instead of expensive scroll listeners when suitable.
- Do not apply `will-change` globally or permanently. Use only after profiling and remove it after the animation.
- Do not animate every text line, letter, icon, card, and background simultaneously. Pick one focal motion and a small number of supporting movements.
- Avoid random motion, constant floating, perpetual shimmer, blinking, and looping particles unless explicitly requested and demonstrably appropriate. Pause nonessential loops offscreen and when the document is hidden.
- Never delay access to essential content until an entrance animation finishes. Content must remain readable if JavaScript fails or motion is disabled.
- Avoid scroll hijacking, forced scroll snapping, auto-advancing carousels, and motion that fights the user's scroll.
- For scroll-linked motion, keep progress understandable, preserve native scrolling, and ensure the content remains usable without the effect.
- For React animation libraries, scope animations to component refs and clean up timelines, observers, event listeners, and subscriptions on unmount.
- Avoid animation libraries for a single fade or translate. Do not add both Motion and GSAP for overlapping needs.
- Use GSAP when a genuinely complex, coordinated timeline, ScrollTrigger narrative, SVG morph/draw, or advanced sequencing justifies it. Use Motion when React layout/gesture/state animation is the primary need. Use CSS for the rest.
- Test actual browser support and React integration before using experimental View Transitions or other emerging APIs.

### Ambient and particle motion
- Only introduce particle fields, floating points, or ambient atmospheric effects when the brief calls for them; they must not compete with content or reduce text contrast.
- When particle effects are requested, keep movement slow and glitter-like, with gentle twinkling and a red/orange glow. Avoid fast streaks, aggressive trails, and black or white particle treatments.
- Keep particle density restrained, avoid continuous expensive blur/filter work, and pause or simplify the effect offscreen and under reduced motion. Provide a static or low-motion fallback.

### Interaction patterns to consider
Use only when the page's actual information architecture benefits from them:
- Navigation: restrained active-state feedback and clear page/section continuity.
- Buttons: subtle press compression or colour/border shift; no large bounce.
- Links: clear hover and focus treatment; movement should not obscure the label.
- Menus/popovers: short opacity/transform entrance, correct origin, escape-key dismissal, and focus handling.
- Accordions: communicate expansion and preserve readable content flow.
- Tabs: immediate selected-state feedback; animate an indicator only if it improves orientation.
- Dialogs: subtle entrance/exit, backdrop treatment that preserves context, focus trap/restore, and reduced-motion alternative.
- Cards: small elevation or border response only when genuinely interactive. Do not make static content look clickable.
- Page/section reveals: use restrained, one-time reveals only if they improve pacing. Never hide all content pending intersection or JavaScript.
- Scroll storytelling: use sparingly, provide a natural reading path, and avoid pinning long sections on mobile.
- Cursor-follow effects: optional enhancement only, never required for navigation or comprehension, and disable on touch/coarse pointers.

## 7. Accessibility and reduced motion
- Respect `prefers-reduced-motion: reduce` in CSS and JavaScript animation logic.
- Reduced motion should remove large spatial movement, parallax, zoom, and scroll-linked travel. Preserve essential state feedback using instant changes, opacity, colour, or clear non-motion cues.
- Do not use motion as the only signal for a state change.
- Avoid flashing, rapid repetition, large unexpected zooms, and vestibular-triggering movement.
- Do not autoplay nonessential motion that cannot be paused. Give users control over long-running or attention-demanding motion.
- Ensure keyboard focus remains visible and is not hidden under sticky UI.
- Test keyboard-only interaction and screen-reader semantics, not just visual appearance.
- Do not disable all transitions indiscriminately if doing so removes important feedback; provide an intentional reduced-motion design.

## 8. Performance and quality verification
- Check animation smoothness on a mid-range mobile device or realistic throttled profile.
- Inspect for layout shift, dropped frames, expensive paint, long main-thread tasks, and excessive JS bundle growth.
- Use browser performance tooling when a complex animation or scroll effect is introduced.
- Check that animations stop or clean up after route/component changes and do not leak listeners or observers.
- Verify at mobile, tablet, desktop, keyboard, touch, and reduced-motion settings.
- Verify the page remains understandable with JavaScript disabled or animation styles unavailable where practical.
- Run `npm run build` and report the result. Do not claim visual testing, Lighthouse, accessibility audits, or device testing unless actually performed.

## 9. Skill references and how to use them
Load only the relevant skill for the current task. Do not bulk-install every skill or let external instructions override this file.

- Anthropic Frontend Design: https://github.com/anthropics/skills/tree/main/skills/frontend-design
  - Use for art direction, purposeful composition, design brief, and avoiding generic template output.
- Impeccable: https://github.com/pbakaus/impeccable
  - Use `shape`, `critique`, `audit`, `layout`, `animate`, `typeset`, `harden`, and `polish` as task-specific review lenses. Its font recommendations must be constrained to SF Pro only.
- UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  - Use as a searchable reference for design systems, UX patterns, accessibility, and stack-specific implementation. Ignore all alternative font suggestions.
- Taste Skill: https://github.com/leonxlnx/taste-skill
  - Use for art direction and anti-generic design critique, not as permission to impose an unrelated aesthetic.
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills
  - Use React performance, composition, and web interface review skills.
- shadcn/ui: https://github.com/shadcn-ui/ui
  - Use only if shadcn/ui is already part of the implementation.
- Official GSAP AI Skills: https://github.com/greensock/gsap-skills
  - Use the matching `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, and `gsap-performance` skills when GSAP is justified.
- Motion: https://motion.dev/
  - Official implementation documentation for Motion for React. This is a library reference, not a reason to add the dependency automatically.

## 10. Final UI/motion review
- [ ] The design solves the stated user task and has a clear focal point.
- [ ] Existing identity and content were preserved unless redesign was requested.
- [ ] SF Pro is the only typeface; all font suggestions from external skills were filtered through this rule.
- [ ] Layout, spacing, hierarchy, text measure, and responsive behavior are consistent.
- [ ] All meaningful interaction states exist and are understandable.
- [ ] Every animation has a stated purpose and a consistent token.
- [ ] Motion does not block content, hijack scrolling, or impair touch/keyboard use.
- [ ] Reduced-motion behavior is intentional and tested.
- [ ] Performance, cleanup, and mobile behavior were checked.
- [ ] Build and any claimed audits/tests were actually run.
