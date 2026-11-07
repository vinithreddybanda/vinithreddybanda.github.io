# Engineering Standards

These instructions govern every code change in this repository. Follow them before editing, not after.

## Project context
- This is a React 19 + Vite application deployed as a static site on GitHub Pages.
- Do not assume Next.js, a server runtime, a database, or backend APIs exist.
- Preserve the existing visual identity and working behavior unless the task explicitly asks to change them.
- Prefer the smallest coherent change. Do not rewrite unrelated files or introduce dependencies without a clear benefit.

## Required workflow for every change
1. Inspect the relevant source files, package.json, existing styles, and current architecture before proposing an implementation.
2. State the intended behavior and identify affected components, routes, responsive states, and risks.
3. Reuse existing components, design tokens, typography, and patterns. Avoid duplicate components and one-off styling.
4. Implement the smallest maintainable solution. Keep components focused and data separate from presentation where appropriate.
5. Verify with `npm run build`. Run any relevant tests or checks that already exist. If a check cannot be run, say so explicitly.
6. Review the final diff for regressions, accessibility, responsive behavior, console errors, security, and unnecessary complexity.
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
- Design mobile-first and verify narrow, medium, and wide layouts. No horizontal overflow or clipped controls.
- Establish consistent spacing, type scale, line lengths, alignment, contrast, and hierarchy. Use the existing SF Pro Display font setup and existing visual language unless asked otherwise.
- Every interactive element needs a clear purpose, visible hover/focus/active/disabled states, and a sufficiently large touch target.
- Use semantic landmarks, correct heading order, labels for inputs, descriptive link text, and keyboard-operable interactions.
- Do not communicate state through colour alone. Maintain WCAG 2.2 AA contrast and keyboard accessibility where applicable.
- Respect `prefers-reduced-motion: reduce`. Motion must not block content, cause disorientation, or make essential information inaccessible.
- Avoid gratuitous gradients, glass effects, parallax, cursor tricks, scroll hijacking, and animation for decoration alone. Visual polish must support usability.

## Motion and interaction
- Animate to communicate hierarchy, continuity, feedback, or state change. If the purpose cannot be explained, do not add the animation.
- Prefer transform and opacity for smooth animation. Avoid animating layout-heavy properties unless necessary.
- Keep durations and easing consistent. Avoid excessive stagger, looping motion, and competing simultaneous animations.
- Use CSS transitions for simple state changes. Use the Web Animations API or a dedicated library only when the interaction complexity justifies it.
- Before adding Motion/Framer Motion or GSAP, inspect current dependencies and explain why the library is warranted. Do not install both for overlapping use cases.
- Preserve keyboard interaction and provide reduced-motion alternatives.
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
- Keep the shipped JavaScript and CSS lean. Avoid large dependencies for small effects.
- Optimize images with appropriate dimensions, formats, and loading behavior. Avoid layout shifts by reserving media dimensions.
- Prefer transform/opacity animation and avoid unnecessary re-renders or expensive scroll handlers.
- Use lazy loading for below-the-fold media when appropriate; do not lazy-load critical above-the-fold content.
- Measure before applying speculative micro-optimizations.

## Design system
- Prefer existing tokens and components. If a new pattern is repeated, promote it into a reusable component or token.
- Keep colour, spacing, typography, radius, shadows, and motion values consistent.
- Do not change the global font, reset, base sizing, or design tokens casually.
- Document meaningful design-system changes in the relevant source or docs.

## Source references
Use these as living references. Check the documentation that matches the actual stack and API version; do not blindly copy snippets from unrelated frameworks.

### Vercel Agent Skills
- Repository: https://github.com/vercel-labs/agent-skills
- React best practices and composition patterns: https://github.com/vercel-labs/agent-skills/tree/main/skills
- Web Interface Guidelines: https://vercel.com/design/guidelines
- React View Transitions skill: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-view-transitions

### UI/UX design intelligence
- UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

### Official implementation documentation
- React: https://react.dev/
- Vite: https://vite.dev/guide/
- MDN Web APIs: https://developer.mozilla.org/en-US/docs/Web/API

### Motion
- Motion for React: https://motion.dev/
- GSAP: https://gsap.com/docs/v3/
- Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

### Security and code quality
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- OWASP Application Security Verification Standard: https://owasp.org/www-project-application-security-verification-standard/
- GitHub CodeQL: https://codeql.github.com/docs/
- GitHub Dependabot: https://docs.github.com/en/code-security/dependabot

## Non-negotiable review checklist
- [ ] Existing architecture and conventions were inspected.
- [ ] No unrelated rewrites or unjustified dependencies.
- [ ] Responsive layout checked at mobile and desktop widths.
- [ ] Keyboard navigation, focus visibility, semantics, and contrast considered.
- [ ] Reduced-motion behavior considered for every new animation.
- [ ] Untrusted input, URLs, secrets, and dependency risks considered.
- [ ] Performance and layout shift considered.
- [ ] Production build passes, or the exact failure is reported.
- [ ] Final diff and changed files are summarized.
