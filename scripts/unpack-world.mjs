import { gunzipSync } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";

const packed = new URL("../src/scripts/world.js.gz", import.meta.url);
const source = new URL("../src/scripts/world.js", import.meta.url);
const compressed = await readFile(packed);
await writeFile(source, gunzipSync(compressed));
console.log("Restored the Three.js storybook scene source.");
