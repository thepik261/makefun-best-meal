// The Best Meal You Ever Had — make.fun entry (u-pangg7-the-best-meal-you-ever-had-a3ac0f85).
// Writes one sentence about the best meal ever had: a single sentence of 1–200 characters, to /output/entry.txt.
// Node stdlib only. Deterministic: the line is a fixed string.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The best meal I ever had was my grandmother's rendang, slow-cooked until the beef fell apart, eaten cross-legged on her kitchen floor while rain hammered the tin roof above us.";

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry line must be 1-200 characters, got ${LINE.length}`);
}
if (!/^[^.!?]+[.!?]$/.test(LINE)) {
  throw new Error("entry line must be a single sentence");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const file = join(outDir, "entry.txt");
writeFileSync(file, LINE, "utf8");
// Leave the output file world-readable; never chmod the output dir itself.
chmodSync(file, 0o644);

const back = readFileSync(file, "utf8");
if (back !== LINE) {
  throw new Error("verification failed: entry.txt does not match the line");
}
