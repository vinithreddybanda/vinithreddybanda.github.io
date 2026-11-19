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
  const plateRule=css.match(/\.press-plate\{([^}]*)\}/s)?.[1] ?? "";\n  assert.doesNotMatch(plateRule,/rotateY/);
});

test("background uses Carter's spring, repel, bloom and click-ripple model", async () => {
  const paper=await read("../src/scripts/paper.ts");
  assert.match(paper,/SPACING = 34/);
  assert.match(paper,/DOT_R = 2\.4/);
  assert.match(paper,/SPRING = \.055/);
  assert.match(paper,/FRICTION = \.82/);
  assert.match(paper,/REPEL_R = 116/);
  assert.match(paper,/RIPPLE_SPEED = 620/);
  assert.match(paper,/RIPPLE_PUSH = 3\.4/);
  assert.match(paper,/mouse\.active/);
  assert.match(paper,/ctx!\.arc/);
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
