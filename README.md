# Vinith Reddy Banda · Portfolio

A fast, accessible, static portfolio built with Astro.

## Stack

- Astro 6 for component-driven static rendering
- TypeScript for structured content and safer changes
- Tailwind CSS 4 through the official Vite plugin
- GSAP + ScrollTrigger for restrained page and scroll choreography
- GitHub Pages for hosting and GitHub Actions for deployment

## Local development

```sh
npm install
npm run dev
```

## Quality checks

```sh
npm run check
npm run build
npm run preview
```

The production site is generated in `dist/`. GitHub Actions builds the site and deploys that directory to GitHub Pages.

## Project structure

```
src/
  components/   Shared navigation, section headings, project and experience entries, footer
  data/         Portfolio content and structured project information
  layouts/      Shared document shell and metadata
  pages/        Astro routes
  scripts/      GSAP motion behavior
  styles/       Global design tokens and responsive styling
public/         Static assets
```

Motion follows one shared reveal pattern, uses transform and opacity only, respects reduced-motion preferences, and leaves native scrolling intact.