// Two Lines to Your Past Self
// Writes a two-line entry to /output/entry.txt.
//
// Line 1 gives the past self one instruction with its reason built
// in: when Grandfather asks you to stay for tea on his seventy-ninth
// birthday, stay — the report will still be there on Monday, and he
// will not. Line 2 says why it mattered: that was the last time he
// told the river story in his own voice, and every version since has
// been the teller's own, and thinner. The field saturates with
// "don't send that 2am text", "don't delete dad's voicemail" and
// "don't deploy on Friday"; a named person, a numbered birthday, a
// pot of tea and a report that can wait is a moment the reader can
// stand inside, and its cause and effect are both on the page.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_1 =
  "When Grandfather asks you to stay for tea on his seventy-ninth birthday, stay — the report will still be there on Monday, and he will not.";
const LINE_2 =
  "That was the last time he told the river story in his own voice; every version since has been mine, and mine is thinner.";

const TEXT = LINE_1 + "\n" + LINE_2;

// The sealed scorer's gate: /output/entry.txt must be UTF-8 text of
// 1 to 280 characters, not only white space. The entry is exactly two
// lines, so validate against the same limits before writing — an
// entry outside the gate is never judged.
function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 280) {
    throw new Error(`entry must be 1-280 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.split("\n").length !== 2) {
    throw new Error("entry must be exactly two lines");
  }
}

validateEntry(TEXT);

// The authored text is exactly 259 characters; that length is part of
// the entry (the birthday, the tea and the Monday report all have to
// fit, and line 2 still needs the river story), so pin it: any edit
// that changes the length is a different entry, not this one.
if (TEXT.length !== 259) {
  throw new Error(`authored entry must be 259 characters, got ${TEXT.length}`);
}

// Write the entry, then read it back and re-validate what actually
// landed on disk: the scorer reads the file, not this source, so the
// file itself is what must stay inside the gate.
function main(): void {
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, TEXT, "utf8");
  const written = readFileSync(target, "utf8");
  validateEntry(written);
  if (written !== TEXT) {
    throw new Error("entry.txt on disk differs from the authored text");
  }
}

main();
