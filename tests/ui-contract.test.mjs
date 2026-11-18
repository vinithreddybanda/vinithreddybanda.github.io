import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("dock uses a contextual action instead of a decorative plus or mail shortcut", async () => {
  const header = await read("../src/components/SiteHeader.astro");
  assert.match(header, /data-dock-action/);
  assert.match(header, /data-dock-label/);
  assert.match(header, /href: "#selected-work"/);
  assert.ok(header.indexOf("links.slice(0, 2)") < header.indexOf("data-dock-action"));
  assert.ok(header.indexOf("data-dock-action") < header.indexOf("links.slice(2)"));
  assert.doesNotMatch(header, /mailto:vinithreddybanda@gmail\.com/);
});

test("dock has a compact glass material and an opaque transparency fallback", async () => {
  const css = await read("../src/styles/ui.css");
  assert.match(css, /\.tab-dock[\s\S]*backdrop-filter:\s*blur\(/);
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  assert.match(css, /\.tab-dock\.is-hidden/);
});

test("motion respects reduced-motion and uses intersection observation", async () => {
  const app = await read("../src/scripts/app.ts");
  const css = await read("../src/styles/ui.css");
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /prefers-reduced-motion/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("navigation announces its active route accessibly", async () => {
  const header = await read("../src/components/SiteHeader.astro");
  assert.match(header, /aria-current=/);
  assert.match(header, /aria-label="Primary navigation"/);
});
