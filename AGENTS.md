# Repository guidance

## Project baseline
- This is a React 19 + Vite static portfolio deployed to GitHub Pages.
- Preserve the black, minimal visual identity and existing portfolio content unless the user requests a change.
- Use the locally hosted SF Pro Display fonts in `public/fonts`.
- Prefer semantic HTML, accessible links, responsive layouts, and small React components.
- Keep dependencies lean. Prefer native, reduced-motion-aware implementations for small effects.

## Mandatory Awwwards research workflow
- Use **Awwwards MCP** as the design-research plugin before visual or motion work. Its upstream source of truth is [INSANE0777/Awwwards-mcp](https://github.com/INSANE0777/Awwwards-mcp), with companion agent skills in [INSANE0777/awwwards-skills](https://github.com/INSANE0777/awwwards-skills).
- The project MCP entry is `.mcp.json` under server name `awwwards`. Do not silently substitute generic web-search inspiration for MCP evidence. If the server or a required tool is unavailable, state that limitation and continue only with clearly labelled, non-MCP reasoning.
- Before changing visual design:
  1. Translate the request into concrete visual attributes (mood, palette, typography, layout, industry, and interaction).
  2. Search 1–3 focused queries with `search_sites`; inspect the actual screenshots and shortlist 2–3 references.
  3. Use `get_site_details` for design DNA (palette, technologies, design elements, awards) and `get_site_elements` for component-level references.
  4. Use `create_design_brief` with 2–5 shortlisted slugs and the actual project goal. Treat the result as evidence, not a template. Extract shared signals and deliberately avoid copying a single site.
  5. Write a short design direction before implementation: palette, type mood, layout/section structure, interaction behavior, and the evidence behind each choice.
- When the user names a live reference URL, capture it with `capture_live_site` before building. Compare full page structure, not only the hero screenshot. Use mobile capture when responsive behavior matters.

## Awwwards MCP architecture and tool map
- Upstream implementation is TypeScript/ESM, exposed as a stdio MCP server. Its public facade is `src/server.ts`; handler composition lives in `src/server/create-handlers.ts`, with domain handlers under `src/server/handlers/` and tool registration under `src/tools/`.
- Research/data domains include `awwwards.ts`, `collections.ts`, `directory.ts`, `annual.ts`, and the local Atlas search/index modules under `src/atlas/`. Cached reference data is local; Awwwards screenshots/media remain reference URLs and must not be republished as portfolio assets.
- Browser evidence is separated into capture/analysis modules: `capture.ts`, `structure.ts`, `census.ts`, `hover-census.ts`, `motion-dna.ts`, `pose3d.ts`, `scene-capture.ts`, and `bundle-forensics.ts`.
- Build/verification helpers include `design-brief.ts`, `gsap-stub.ts`, `pose-stub.ts`, `build-project.ts`, `audit-url.ts`, and the build verification handlers.
- Prefer these tools when relevant: `search_sites`, `list_categories`, `get_site_details`, `get_site_elements`, `create_design_brief`, `capture_live_site`, `analyze_page_structure`, `analyze_stack`, `get_motion_dna`, `analyze_scroll_map`, `analyze_hover_census`, `record_site_motion`, `audit_url`, and `verify_build`.
- MCP package reference checked against upstream `awwwards-mcp@1.18.0`. The upstream package requires Node >=22.13. The simple `npx` setup provides core tools; browser capture/census/recording/verification tools require Playwright, Chromium, and (for video recording) ffmpeg-static available alongside the MCP package. Do not claim browser tools are working until a browser-backed call succeeds.
- Consult the matching companion skills from `awwwards-skills`: `awwwards-inspiration` for visual research and `awwwards-motion-study` for motion capture/study. The latter requires instrument-first evidence and frame-by-frame review; a poster or static screenshot is not proof of motion.

## Motion implementation and verification
- For requested motion, inspect the reference with motion evidence before writing animation code. Use `get_motion_dna` and `analyze_scroll_map` first; use `record_site_motion` and frame-tile/review the relevant passages when needed. Record observed triggers, animated properties, easing, durations, scrub/pin behavior, and direction/velocity response.
- Build from measured evidence, not invented timing. Use GSAP ScrollTrigger for pinned/scrubbed timelines and Lenis only when the reference or product brief justifies smooth-scroll control. Avoid hand-rolled scroll-position animation when a supported library pattern is appropriate.
- Re-record and compare the build against the same reference and viewport. Use `verify_build` and structure/band comparison where available. Fix section structure and motion mismatches before decorative polish.
- Respect `prefers-reduced-motion`; keep content visible without JavaScript; preserve keyboard access and avoid scroll hijacking.

## Editing and delivery
- Inspect the relevant source and assets before editing.
- Run `npm run build` when a local project workspace is available. This repository is static Vite: use `npm install` if needed, not `npm ci` unless a lockfile exists.
- Report checks accurately. Never claim visual testing, browser verification, or deployment success unless it actually happened.
