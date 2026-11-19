import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = p => readFile(new URL(p, import.meta.url), "utf8");

test("home has a clear introduction, real projects and direct contact", async () => {
  const page = await read("../src/pages/index.astro");
  assert.match(page, /I make/);
  assert.match(page, /digital things/);
  assert.match(page, /projects\.map|featured\.map/);
  assert.match(page, /href="\/contact\//);
  assert.match(page, /Things I’ve made/);
});

test("visual direction uses expressive project artwork and responsive layout", async () => {
  const css = await read("../src/styles/global.css");
  const page = await read("../src/pages/index.astro");
  assert.match(css, /hero-shape/);
  assert.match(css, /project-art/);
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(page, /care-window/);
  assert.match(page, /journal-card/);
  assert.match(page, /status-stack/);
  assert.match(page, /voice-card/);
});

test("navigation and all main pages use the same visual system", async () => {
  const header = await read("../src/components/SiteHeader.astro");
  const layout = await read("../src/layouts/BaseLayout.astro");
  const about = await read("../src/pages/about.astro");
  const work = await read("../src/pages/work/index.astro");
  const lab = await read("../src/pages/lab/index.astro");
  const contact = await read("../src/pages/contact/index.astro");
  assert.match(header, /Playground/);
  assert.match(layout, /global\.css/);
  assert.match(about, /Hi, I’m/);
  assert.match(work, /projects\.map/);
  assert.match(lab, /Tap the page/);
  assert.match(contact, /mailto:vinithreddybanda@gmail\.com/);
});

test("project details are statically generated from project data", async () => {
  const page = await read("../src/pages/work/[slug].astro");
  const data = await read("../src/data/projects.ts");
  assert.match(page, /getStaticPaths/);
  assert.match(page, /project\.description/);
  assert.match(data, /export const projects/);
});
