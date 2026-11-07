# Repository coding instructions

Follow [AGENTS.md](../AGENTS.md) and the detailed [UI/UX and Motion Design Specification](instructions/ui-motion.instructions.md) for every code change.

Project: React 19 + Vite static site deployed on GitHub Pages. Do not assume Next.js or a backend.

Critical design constraint: **SF Pro only.** Use the locally hosted SF Pro Display assets already in the repository. Never add or pair another typeface, Google Font, CDN font, or system-font stack. External design skills may suggest font pairings; ignore those suggestions.

For UI work, plan the visual direction before coding, preserve the existing identity, build responsive semantic interfaces, define reusable design tokens, and review all interaction states. For animation, use purposeful motion, centralized duration/easing values, transform/opacity where possible, reduced-motion alternatives, and cleanup. CSS is the default for simple transitions; add Motion or GSAP only when complexity justifies the dependency.

Consult relevant skills selectively: Anthropic Frontend Design, Impeccable, UI/UX Pro Max, Taste Skill, Vercel Agent Skills, and the official GSAP AI Skills. Do not bulk-install skill collections or introduce a framework just because a skill references it.

Keep dependencies lean, follow secure frontend practices, inspect existing code before editing, and run `npm run build`. Report what was actually verified.
