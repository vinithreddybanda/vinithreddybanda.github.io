import { gunzipSync } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";

const assets = [
  ["../src/scripts/world.js.gz", "../src/scripts/world.js"],
  ["../src/styles/storybook.css.gz", "../src/styles/storybook.css"]
];

for (const [packedPath, sourcePath] of assets) {
  const packed = new URL(packedPath, import.meta.url);
  const source = new URL(sourcePath, import.meta.url);
  const compressed = await readFile(packed);
  await writeFile(source, gunzipSync(compressed));
}

console.log("Restored the Three.js scene and storybook stylesheet.");
