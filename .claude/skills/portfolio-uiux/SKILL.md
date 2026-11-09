---
name: portfolio-uiux
description: Mandatory visual and motion system for the Vinith Reddy Banda portfolio.
---

# Portfolio UI/UX system

Read the root AGENTS.md first. The home page is an immersive botanical portfolio, not a résumé. Keep its narrative short: forest entrance, selected work, brief introduction, current role, and contact.

## Mandatory Awwwards research

Use the configured Awwwards MCP server from .mcp.json together with the local skills:
- Read .claude/skills/awwwards-inspiration/SKILL.md before selecting references.
- Read .claude/skills/awwwards-motion-study/SKILL.md before writing scroll or camera animation.
- Search focused portfolio, cinematic scroll, nature, spatial and WebGL references.
- Inspect real screenshots and site design DNA. For motion, record sequential frames or use the measured scroll census. A poster is not motion evidence.
- Create one original design brief and explain which observed reference mechanics informed the implementation. Do not copy assets or entire layouts.
- If the MCP server is unavailable, state that fact. Do not fabricate its search results.

## Visual system

- Nature-led, immersive, calm and premium. Deep evergreen, moss, warm limestone and restrained light.
- Use the forest scene as an environment with separate foreground, focus and distant planes.
- Keep the focal path readable. Static depth-of-field is allowed; never animate CSS blur.
- Projects are full-width editorial scenes, never cards or card grids.
- The side rail is canonical desktop navigation. Mobile uses the compact top rail.
- Remove filler labels, slash-separated skill dumps, dot separators and unnecessary résumé sections.
- Keep typography expressive but legible. Use one sans family and one editorial serif.

## Motion system

- GSAP + ScrollTrigger. Native scroll remains in control.
- One scrubbed hero camera timeline, driven by scroll progress.
- Foreground, focus and distant planes move at different rates to create parallax. The camera push is slow and restrained.
- Leaf canvas pauses when outside the viewport, caps device pixel ratio at 1.5 and uses fewer particles on mobile.
- Reveal content once with opacity and translateY. No animated blur, layout properties or transition: all.
- Always support prefers-reduced-motion; content stays visible without JS.

## Completion gate

Check initial load, camera scrub, reverse scroll, touch scroll, 320px layout, keyboard focus, reduced motion, console errors, npm run check, and npm run build. Do not report completion while any gate remains unverified.
