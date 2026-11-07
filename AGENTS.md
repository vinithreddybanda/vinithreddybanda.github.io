# Engineering Standards

These instructions govern every code change in this repository. Follow them before editing, not after.

## Project context
- This is a React 19 + Vite application deployed as a static site on GitHub Pages.
- Do not assume Next.js, a server runtime, a database, or backend APIs exist.
- Preserve the existing visual identity and working behavior unless the task explicitly asks for a change.
- The only permitted typeface is **SF Pro**. The current project uses locally hosted SF Pro Display font files. Do not add, import, pair, or substitute Inter, Geist, Roboto, Arial, system font stacks, Google Fonts, or any other typeface. Do not change the font family without explicit user approval.
- Prefer the smallest coherent change. Do not rewrite unrelated files or introduce dependencies without a clear benefit.

## Required workflow for every change
1. Inspect the relevant source files, package.json, existing styles, assets, and current architecture before proposing an implementation.
2. State the intended behavior and identify affected components, routes, responsive states, and risks.
3. Reuse existing components, design tokens, typography, and patterns. Avoid duplicate components and one-off styling.
4. Implement the smallest maintainable solution. Keep components focused and data separate from presentation where appropriate.
5. Verify with `npm run build`. Run any relevant tests or checks that already exist. If a check cannot be run, say so explicitly.
6. Review the final diff for regressions, accessibility, responsive behavior, console errors, security, performance, and unnecessary complexity.
7. Summarize changed files, behavior, verification performed, and known limitations.

## Architecture and React
- Use functional components and React hooks. Keep state as local as possible; lift it only when multiple components need it.
- Use stable keys for rendered collections. Avoid array indexes as keys when items can reorder or be inserted.
- Avoid unnecessary effects, duplicated state, prop drilling that makes components brittle, and giant components.
- Prefer semantic HTML and native browser capabilities over custom abstractions.
- Keep CSS organized and scoped to clear component or page responsibilities. Reuse CSS custom properties for design tokens.
- Do not introduce a state-management, routing, component, or utility library for a problem that React and the platform already solve cleanly.
- Keep dependencies lean and compatible with the existing React/Vite setup.

## UI/UX quality bar
- Follow the detailed project UI and motion specification in [`.github/instructions/ui-motion.instructions.md`](.github/instructions/ui-motion.instructions.md) for every interface or animation change.
- Design mobile-first and verify narrow, medium, and wide layouts. No horizontal overflow, clipped controls, accidental overlap, or layout jumps.
- Design from the user's task and content hierarchy, not from a fashionable template. Establish one clear focal point and a deliberate visual rhythm.
- Use SF Pro only, with the locally hosted SF Pro Display family and its available weights. Preserve its native character; do not fake weight variants when a real file exists.
- Establish consistent spacing, type scale, line lengths, alignment, contrast, and hierarchy. Use design tokens rather than arbitrary values.
- Every interactive element needs a clear purpose, visible hover/focus/active/disabled/loading states, and a sufficiently large touch target.
- Use semantic landmarks, correct heading order, labels for inputs, descriptive link text, and keyboard-operable interactions.
- Do not communicate state through colour alone. Target WCAG 2.2 AA contrast and keyboard accessibility.
- Avoid gratuitous gradients, glass effects, parallax, cursor tricks, scroll hijacking, and animation for decoration alone. Visual polish must support usability.

## Motion and interaction
- Read and follow [`.github/instructions/ui-motion.instructions.md`](.github/instructions/ui-motion.instructions.md) before implementing motion.
- Motion must communicate hierarchy, continuity, feedback, spatial relationships, or state change. If its purpose cannot be explained, remove it.
- Prefer transform and opacity for smooth animation. Avoid animating layout-heavy properties unless necessary.
- Use consistent duration and easing tokens; choreograph a small number of elements rather than animating everything.
- Use CSS transitions for simple state changes. Use the Web Animations API or a dedicated library only when the interaction complexity justifies it.
- Before adding Motion or GSAP, inspect current dependencies and explain why the library is warranted. Do not install both for overlapping use cases.
- Respect `prefers-reduced-motion` with an intentional alternative, not merely a global kill switch.
- Any scroll-triggered or continuous animation must be interruptible, avoid scroll hijacking, clean up listeners/observers, and pause when offscreen or when the page is hidden where appropriate.
- Do not assume React ViewTransition APIs are stable or available in this Vite app. Check current official React/browser support before using them.

## Security and privacy
- Never commit API keys, credentials, private tokens, personal secrets, or environment-specific secrets. A static frontend cannot securely hide secrets bundled into client code.
- Treat user-controlled strings and external data as untrusted. Do not use `dangerouslySetInnerHTML` unless there is a reviewed, well-justified sanitization strategy.
- Validate and constrain URLs before using them in navigation or resource attributes. Avoid unsafe URL schemes.
- Avoid unsafe DOM manipulation, eval, dynamic code execution, and unnecessary third-party scripts.
- Minimize personal data collection and third-party tracking. Do not add analytics or external services without explicit approval.
- Keep dependencies current and review advisories before adding or upgrading packages.
- For security-sensitive changes, use OWASP guidance and CodeQL-compatible patterns. Do not claim a security audit was completed unless checks were actually run.

## Performance
- Keep shipped JavaScript and CSS lean. Avoid large dependencies for small effects.
- Optimize images with appropriate dimensions, formats, and loading behavior. Avoid layout shifts by reserving media dimensions.
- Prefer transform/opacity animation and avoid unnecessary re-renders or expensive scroll handlers.
- Use lazy loading for below-the-fold media when appropriate; do not lazy-load critical above-the-fold content.
- Measure before applying speculative micro-optimizations. Check animation performance on a mid-range mobile device, not only a desktop.
- Avoid permanent `will-change`; apply it only to elements with measured need and remove it when no longer needed.

## Design system
- Prefer existing tokens and components. If a new pattern is repeated, promote it into a reusable component or token.
- Keep colour, spacing, typography, radius, shadows, and motion values consistent.
- SF Pro is the sole typeface across headings, body text, controls, labels, and numeric content. Create hierarchy through size, weight, tracking, line-height, and opacity, not font pairing.
- Do not change the global font, reset, base sizing, or design tokens casually.
- Document meaningful design-system changes in the relevant source or docs.

## Agent skill and reference library
Consult the skill that matches the task. Treat skills as guidance, not authority to override this repository's constraints, existing architecture, or the user's brief. In particular, reject any suggested font pairing that conflicts with SF Pro only.

### High-value UI/UX skills
- Anthropic Frontend Design: https://github.com/anthropics/skills/tree/main/skills/frontend-design
  - Strong for deliberate visual direction, anti-template thinking, layout concepts, and design planning before implementation.
- Impeccable: https://github.com/pbakaus/impeccable
  - Strong for critique, audit, polish, layout, typesetting, animation, hardening, and design-system documentation. Use its `animate`, `audit`, `critique`, `layout`, and `polish` thinking where relevant.
- UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  - Searchable design intelligence for UX patterns, visual systems, accessibility, and implementation patterns. Its font-pairing suggestions are explicitly subordinate to the SF Pro-only rule.
- Taste Skill: https://github.com/leonxlnx/taste-skill
  - Useful for distinctive art direction, avoiding generic AI-generated interfaces, and auditing existing work before redesigning.
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills
  - Use React best practices, composition patterns, and Web Design Guidelines for implementation quality and review.
- shadcn/ui skills: https://github.com/shadcn-ui/ui
  - Consult only when this project actually adopts shadcn/ui; do not introduce it just to follow a skill.

### Motion-specific skills
- Official GSAP AI Skills: https://github.com/greensock/gsap-skills
  - Use for advanced timelines, ScrollTrigger, sequencing, React lifecycle cleanup, performance, and reduced-motion handling. GSAP is not a default dependency.
- Motion for React documentation: https://motion.dev/
  - Use for declarative React transitions, layout animation, and gestures if Motion is chosen. Do not add it for simple CSS transitions.
- GSAP documentation: https://gsap.com/docs/v3/
- Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

### Accessibility, platform, and security references
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- React: https://react.dev/
- Vite: https://vite.dev/guide/
- MDN Web APIs: https://developer.mozilla.org/en-US/docs/Web/API
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- OWASP Application Security Verification Standard: https://owasp.org/www-project-application-security-verification-standard/
- GitHub CodeQL: https://codeql.github.com/docs/
- GitHub Dependabot: https://docs.github.com/en/code-security/dependabot

## Non-negotiable review checklist
- [ ] Existing architecture, assets, fonts, and conventions were inspected.
- [ ] SF Pro is the only typeface used; no remote font or fallback typeface was introduced.
- [ ] No unrelated rewrites or unjustified dependencies.
- [ ] Responsive layout checked at mobile and desktop widths.
- [ ] Keyboard navigation, focus visibility, semantics, touch targets, and contrast considered.
- [ ] Reduced-motion behavior considered for every new animation.
- [ ] Motion is purposeful, interruptible, and performant.
- [ ] Untrusted input, URLs, secrets, and dependency risks considered.
- [ ] Performance and layout shift considered.
- [ ] Production build passes, or the exact failure is reported.
- [ ] Final diff and changed files are summarized.
