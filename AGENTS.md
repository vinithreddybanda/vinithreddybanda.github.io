# Portfolio engineering constitution

This repository is the source of truth for vinithreddybanda.github.io. Follow this file before changing any page, component, style, animation, or dependency. The portfolio is an original work. Awwwards references are research evidence, never templates to copy.

## Experience direction

The portfolio is an immersive botanical walk, not a résumé with a green palette.

- **Story:** enter a forest, discover a small collection of work, meet the developer, then reach out. Keep the narrative short. Do not publish the full résumé, skill inventories, education tables, or certification lists on the home page.
- **Visual character:** cinematic forest photography, deep evergreen shadows, warm limestone, moss and fern tones, soft atmospheric light. Avoid generic forest wallpaper, decorative dots, slash-separated labels, pill tags, and card grids.
- **Hero:** a layered forest scene with a clear focal path, blurred distant atmosphere, softly defocused foreground foliage, parallax depth planes, scroll-scrubbed camera push, and restrained wind-driven leaf movement. Blur is static depth-of-field, never an animated CSS filter.
- **Projects:** no cards. Use full-width editorial project scenes with large visual compositions, generous breathing room, concise copy and one clear link. Custom CSS product visualisations must not pretend to be real product screenshots.
- **Navigation:** use the slim side rail on desktop and compact top rail on mobile. Do not revert to a conventional horizontal pill header.
- **Content:** show the strongest three projects, one concise current-work note, a short introduction and contact details. No skill list, education table, or award catalogue on the home page.
- **Motion:** GSAP + ScrollTrigger for camera choreography and one-shot reveals. Use a small canvas for falling leaves. Preserve native scrolling and keep animation subtle, intentional and performant.

## Engineering rules

1. Read actual source files and the deployment workflow before editing.
2. Use the configured Awwwards MCP and the awwwards-inspiration and awwwards-motion-study Claude skills before substantial visual decisions. Search actual sites, inspect design DNA, capture real motion evidence, and cite findings in the design brief. Never claim an MCP call happened if the server is unavailable in the current environment.
3. Keep tokens centralized. Do not append override patches or duplicate selectors.
4. Use one GSAP context and ScrollTrigger. Clean up on page hide. Animate transforms and opacity only. Never animate blur, backdrop-filter, layout dimensions or margins.
5. Keep native browser scrolling. Do not add Lenis or wheel/touch interception unless a measured reference and clear user benefit justify it.
6. Respect prefers-reduced-motion; content must remain visible when JS is disabled.
7. Keep canvas pixel ratio capped, pause it outside the viewport, and reduce particle count on mobile.
8. Preserve semantic HTML, keyboard access, focus states, metadata and GitHub Pages deployment.
9. Verify 320px mobile, tablet and desktop; test scroll down/up, camera scrub, navigation, links, and reduced motion.
10. Run npm run check and npm run build. Fix errors before committing.

## Awwwards workflow

The repository registers the MCP server in .mcp.json as npx -y awwwards-mcp. Claude Code must load that server and the local skills in .claude/skills/awwwards-inspiration and .claude/skills/awwwards-motion-study. Search 2–3 focused references, inspect screenshots and design DNA, capture motion before authoring scroll animation, and form one original design brief. Never copy another creator's site or media.

## Quality gates

- No horizontal overflow at 320px.
- No project cards or résumé-style data dumps.
- No slash or dot separators used as filler.
- No permanent blurred navigation.
- No hidden content flash, repeated reveal, or scroll-direction jump.
- No blur animation, unbounded RAF loop, or canvas work while off-screen.
- The full build passes before deployment.
