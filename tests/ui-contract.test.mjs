import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = p => readFile(new URL(p, import.meta.url), "utf8");

test("home renders a data-driven project press with accessible controls", async () => {
  const page=await read("../src/pages/index.astro");
  const app=await read("../src/scripts/app.ts");
  const css=await read("../src/styles/press.css");
  assert.match(page,/data-press-ring/);
  assert.match(page,/data-project-index/);
  assert.match(page,/data-view="grid"/);
  assert.match(page,/featured/);
  assert.match(page,/tabindex="0"/);
  assert.match(app,/function initPress/);
  assert.match(app,/const goSteps=/);
  assert.match(app,/target-=steps\*slice/);
  assert.match(app,/const mod=/);
  assert.match(app,/Math\.sin\(rad\)/);
  assert.match(css,/translate3d\(var\(--plate-x/);
  const plateRule=css.match(/\.press-plate\{([^}]*)\}/s)?.[1] ?? "";
  assert.doesNotMatch(plateRule,/rotateY/);
});

test("background is invisible at rest and creates a tactile pixel ripple on interaction", async () => {
  const paper=await read("../src/scripts/paper.ts");
  assert.match(paper,/SPACING=14/);
  assert.match(paper,/PIXEL_SIZE=1\.35/);
  assert.match(paper,/RIPPLE_SPEED=720/);
  assert.match(paper,/RIPPLE_WIDTH=78/);
  assert.match(paper,/CURSOR_RADIUS=104/);
  assert.match(paper,/FRICTION=\.82/);
  assert.match(paper,/pointerdown/);
  assert.match(paper,/Math\.exp\(/);
  assert.match(paper,/ctx!\.fillRect/);
  assert.match(paper,/if\(alpha<\.018\)continue/);
  assert.doesNotMatch(paper,/REST_ALPHA/);
  assert.match(paper,/ctx!\.clearRect\(0,0,width,height\);last=0/);
});

test("theme, clock, presence, badge and letter interactions remain wired", async () => {
  const layout=await read("../src/layouts/BaseLayout.astro");
  const header=await read("../src/components/SiteHeader.astro");
  const app=await read("../src/scripts/app.ts");
  assert.match(layout,/data-dot-field/);
  assert.match(layout,/data-remote-cursors/);
  assert.match(header,/data-theme-toggle/);
  assert.match(header,/data-fps/);
  assert.match(app,/function initTheme/);
  assert.match(app,/function initPresence/);
  assert.match(app,/setInterval\(send,4000\)/);
  assert.match(app,/function initBadge/);
  assert.match(app,/function initLetter/);
});

test("all primary routes have distinct content", async () => {
  const about=await read("../src/pages/about.astro");
  const work=await read("../src/pages/work/index.astro");
  const lab=await read("../src/pages/lab/index.astro");
  const contact=await read("../src/pages/contact/index.astro");
  assert.match(about,/typed-letter/);
  assert.match(about,/lanyard-badge/);
  assert.match(work,/archive-row/);
  assert.match(lab,/lab-entry/);
  assert.match(contact,/data-letter-form/);
});

test("project detail pages remain statically generated from project data", async () => {
  const page=await read("../src/pages/work/[slug].astro");
  const data=await read("../src/data/projects.ts");
  assert.match(page,/getStaticPaths/);
  assert.match(page,/project\.description/);
  assert.match(data,/export const projects/);
});
