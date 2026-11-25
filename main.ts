// The Best Meal You Ever Had — make.fun entry
// Bounty: u-pangg7-the-best-meal-you-ever-had-a3ac0f85 ($2 in USDC).
//
// The entry is one sentence about the best meal ever had: my
// grandmother's rendang, eaten cross-legged on her kitchen floor
// while rain hammered the tin roof above us.
//
// Output contract (from the bounty gate):
//   - /output/entry.txt must be UTF-8 text
//   - 1-200 characters long
//   - not only whitespace, and a single sentence
//
// Node stdlib only, no dependencies. Deterministic: the line is a
// fixed string, so every run writes the exact same bytes.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The best meal I ever had was my grandmother's rendang, slow-cooked until the beef fell apart, eaten cross-legged on her kitchen floor while rain hammered the tin roof above us.";

// Check that a candidate line satisfies the bounty gate before it is
// written anywhere. Throws on the first failing rule.
function validateLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry line must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line.endsWith("\n") || line.endsWith("\r")) {
    throw new Error("entry line must not end with a newline");
  }
  if (!/^[^.!?]+[.!?]$/.test(line)) {
    throw new Error("entry line must be a single sentence");
  }
}

validateLine(LINE);

// Output filename, kept as a constant so the write step and the
// verification step below can never disagree about it.
const OUTPUT_FILE = "entry.txt";

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const file = join(outDir, OUTPUT_FILE);
writeFileSync(file, LINE, "utf8");
// Leave the output file world-readable; never chmod the output dir itself.
chmodSync(file, 0o644);

const back = readFileSync(file, "utf8");
// Read back what was just written: the file must contain exactly
// the validated line, with no extra bytes added by the write.
if (back !== LINE) {
  throw new Error("verification failed: entry.txt does not match the line");
}
