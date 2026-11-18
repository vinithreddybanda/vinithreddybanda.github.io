# Vinith Reddy Banda — Portfolio

A multi-page, static-first portfolio built with Astro.

## Routes
- `/` — overview and selected work
- `/work/` — project archive
- `/work/[slug]/` — reusable project case-study route
- `/about/` — experience, education, recognition and skills
- `/contact/` — contact links

## Architecture
Portfolio content is typed and centralized in `src/data`. Reusable Astro components live in `src/components`; `BaseLayout.astro` owns the shared shell and metadata. Design tokens and global styles live in `src/styles`. Lightweight browser state and progressive enhancement live in `src/scripts`.

The site uses Astro static output and browser-native CSS/TypeScript rather than a client-rendered framework or heavy animation runtime.

## Development
```sh
npm install
npm run build
npm run dev
```

## Design research tools
The repository includes a Claude Code-compatible Awwwards MCP entry in `.mcp.json`. Start Claude Code in the repository and approve the project MCP server when prompted. Browser capture features require the optional Playwright/Chromium setup documented by [Awwwards MCP](https://github.com/INSANE0777/Awwwards-mcp).

Optional agent skills: `npx skills add INSANE0777/awwwards-skills --skill awwwards-inspiration awwwards-section-loop motion-authoring`.

Awwwards MCP and its skills are research tools, not UI dependencies. The deployed site does not load them and has no runtime performance cost from them.
