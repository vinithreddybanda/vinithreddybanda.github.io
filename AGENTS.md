# Repository guidance

- This is a React 19 + Vite static portfolio deployed to GitHub Pages.
- Preserve the existing black, minimal visual identity and portfolio content unless the user asks for a change.
- Use the locally hosted SF Pro Display fonts in `public/fonts`.
- Prefer semantic HTML, accessible links, responsive layouts, and simple React components.
- Keep dependencies lean. Do not add animation libraries for small effects when a native, reduced-motion-aware implementation is sufficient.
- Before visual work, use the Awwwards MCP server configured in `.mcp.json` as the evidence source. Follow the `awwwards-inspiration` workflow: search 1–3 concrete reference queries, judge actual screenshots, shortlist 2–3 sites, inspect design DNA, and state an original direction before coding. Never invent reference findings or copy a site wholesale.
- For motion work, follow the `awwwards-motion-study` workflow: capture motion, inspect frame sequences and scroll census data before implementation, record the easing/trigger/duration/velocity behavior, then capture and compare the build. Do not infer motion from a static thumbnail or poster.
- Use MCP evidence tools where available: `search_sites`, `get_site_details`, `get_site_elements`, `create_design_brief`, `record_site_motion`, `get_motion_dna`, `analyze_scroll_map`, `analyze_page_structure`, `capture_live_site`, `audit_url`, and `verify_build`. If the MCP server is unavailable, say so and do not pretend these tools were run.
- Respect reduced-motion preferences, preserve keyboard access, and keep content visible without JavaScript.
- Before editing, inspect the relevant source and assets.
- Run `npm run build` when a local project workspace is available. Report checks accurately.
- Never claim visual testing or deployment success unless it was actually verified.
