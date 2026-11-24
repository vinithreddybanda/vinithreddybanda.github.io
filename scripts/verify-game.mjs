import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { ASSET_NAMES, NPC_DATA, PICKUPS, QUESTS, REGIONS } from "../src/data.js";

const fail = (message) => { console.error("FAIL:", message); process.exitCode = 1; };
const ok = (message) => console.log("PASS:", message);

const modelNames = new Set(ASSET_NAMES);
for (const name of ASSET_NAMES) {
  const path = join("assets", "models", name + ".glb");
  try {
    const data = readFileSync(path);
    const magic = data.toString("ascii", 0, 4);
    const version = data.readUInt32LE(4);
    const declaredLength = data.readUInt32LE(8);
    if (magic !== "glTF" || version !== 2 || declaredLength !== data.length) {
      fail(name + ".glb has an invalid GLB 2.0 header");
    }
  } catch (error) {
    fail("Missing or unreadable model: " + path);
  }
}
if (process.exitCode !== 1) ok(ASSET_NAMES.length + " self-hosted GLB models have valid binary headers");

const npcIds = new Set(NPC_DATA.map(n => n.id));
const regionIds = new Set(REGIONS.map(r => r.id));
const questIds = new Set(QUESTS.map(q => q.id));
for (const npc of NPC_DATA) {
  if (!modelNames.has(npc.asset)) fail("NPC " + npc.id + " references missing model " + npc.asset);
  if (!regionIds.has(npc.region)) fail("NPC " + npc.id + " references missing region " + npc.region);
}
for (const quest of QUESTS) {
  if (!npcIds.has(quest.giver)) fail("Quest " + quest.id + " has no valid giver");
  if (!npcIds.has(quest.target)) fail("Quest " + quest.id + " has no valid target");
  if (quest.requires && !questIds.has(quest.requires)) fail("Quest " + quest.id + " has an unknown prerequisite");
  if (quest.kind === "collect") {
    const count = PICKUPS.filter(p => p.type === quest.pickupType).length;
    if (count < quest.amount) fail("Quest " + quest.id + " needs " + quest.amount + " pickups but only " + count + " exist");
  }
  if (!regionIds.has(quest.region)) fail("Quest " + quest.id + " references a missing region");
}
if (!process.exitCode) ok("Six regions, " + NPC_DATA.length + " residents, and " + QUESTS.length + " connected quest definitions are valid");

const totalBytes = ASSET_NAMES.reduce((sum, name) => sum + statSync(join("assets", "models", name + ".glb")).size, 0);
ok("Bundled model payload: " + (totalBytes / 1024 / 1024).toFixed(2) + " MiB");
