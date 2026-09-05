/**
 * Read the hex values out of the supplier's chenille yarn chart image.
 *
 *   npx tsx scripts/sample-yarn-chart.ts public/assets/yarn-chart.jpeg
 *
 * Prints a ready-to-paste YARN_COLOURS table. It does NOT touch the codes —
 * those are transcribed from the chart and are the thing we actually match;
 * only the on-screen approximation is regenerated.
 *
 * WHY IT LOOKS FOR THE GRID INSTEAD OF ASSUMING IT. The first version divided
 * the image into four equal columns and sampled a fixed fraction of each. That
 * was wrong in a way that would have been invisible: the four swatch bands are
 * not evenly spaced, so the window drifted left across the chart until, in
 * column four, it was sampling white margin and dragging every value lighter.
 * Now the bands are found by looking for the wide runs of non-white pixels that
 * only a swatch produces, so the layout tells the script where it is.
 *
 * WHY ROWS ARE SHARED ACROSS COLUMNS. Detecting rows per column fails on the
 * palest swatches: 10008 is a near-white ivory that does not clear a
 * "not background" test reliably, so column one came up one row short and every
 * colour below it would have shifted up by one. But the chart's rows line up
 * across all four columns, so the row bands are taken from the columns that
 * detect cleanly and applied to all of them. A pale swatch no longer has to be
 * detected — only sampled, at a position the grid already knows.
 *
 * The sample is a MEDIAN of the middle half of each swatch, not a mean: the
 * swatches carry a fabric texture whose highlights drag a mean lighter.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { YARN_COLOURS } from "../src/lib/yarnColours";

const imagePath = process.argv[2];
if (!imagePath) {
  console.error("Usage: npx tsx scripts/sample-yarn-chart.ts <path-to-chart-image>");
  process.exit(1);
}
if (!fs.existsSync(imagePath)) {
  console.error(`No such file: ${imagePath}`);
  process.exit(1);
}

/** Anything above this on every channel is the page, not a swatch. */
const BACKGROUND = 248;
/** A horizontal run this wide can only be a swatch, never a printed digit. */
const MIN_SWATCH_WIDTH = 60;
/** A row counts as inside a swatch when this much of the band is filled. */
const FILL_RATIO = 0.6;

function toHex(r: number, g: number, b: number): string {
  return (
    "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0").toUpperCase()).join("")
  );
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** Group nearby values (band edges found on different rows) into one each. */
function cluster(values: number[], tolerance = 6): number[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const out: number[] = [];
  let run = [sorted[0]];
  for (const v of sorted.slice(1)) {
    if (v - run[run.length - 1] <= tolerance) run.push(v);
    else {
      out.push(Math.round(run.reduce((a, b) => a + b, 0) / run.length));
      run = [v];
    }
  }
  out.push(Math.round(run.reduce((a, b) => a + b, 0) / run.length));
  return out;
}

async function main() {
  const { data, info } = await sharp(imagePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const at = (x: number, y: number) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]] as const;
  };
  const filled = (x: number, y: number) => {
    const [r, g, b] = at(x, y);
    return !(r > BACKGROUND && g > BACKGROUND && b > BACKGROUND);
  };

  // ── 1. find the swatch columns ──────────────────────────────────────────
  const startVotes: number[] = [];
  const endVotes: number[] = [];
  const startCount = new Map<number, number>();
  const endCount = new Map<number, number>();
  for (let y = 10; y < height - 10; y += 7) {
    let run: number | null = null;
    for (let x = 0; x < width; x++) {
      const f = filled(x, y);
      if (f && run === null) run = x;
      if (!f && run !== null) {
        if (x - run > MIN_SWATCH_WIDTH) {
          startCount.set(run, (startCount.get(run) ?? 0) + 1);
          endCount.set(x - 1, (endCount.get(x - 1) ?? 0) + 1);
        }
        run = null;
      }
    }
  }
  // Only edges seen on many rows are real band edges, not one stray mark.
  const MIN_VOTES = 30;
  for (const [x, n] of startCount) if (n > MIN_VOTES) startVotes.push(x);
  for (const [x, n] of endCount) if (n > MIN_VOTES) endVotes.push(x);
  const bandStarts = cluster(startVotes);
  const bandEnds = cluster(endVotes);
  if (bandStarts.length !== bandEnds.length || bandStarts.length === 0) {
    console.error(
      `Could not find the swatch columns: ${bandStarts.length} starts, ${bandEnds.length} ends.`,
    );
    process.exit(1);
  }
  const bands = bandStarts.map((s, i) => [s, bandEnds[i]] as const);
  const rowsPerColumn = Math.ceil(YARN_COLOURS.length / bands.length);

  // ── 2. find the rows, from whichever columns read cleanly ───────────────
  const perColumnRows: (readonly [number, number])[][] = [];
  for (const [x0, x1] of bands) {
    const xs: number[] = [];
    for (let x = x0 + 6; x < x1 - 5; x++) xs.push(x);
    const runs: (readonly [number, number])[] = [];
    let start: number | null = null;
    for (let y = 0; y < height; y++) {
      const hit = xs.reduce((n, x) => n + (filled(x, y) ? 1 : 0), 0) / xs.length > FILL_RATIO;
      if (hit && start === null) start = y;
      if (!hit && start !== null) {
        if (y - 1 - start >= 8) runs.push([start, y - 1] as const);
        start = null;
      }
    }
    if (start !== null && height - 1 - start >= 8) runs.push([start, height - 1] as const);
    perColumnRows.push(runs);
  }
  const clean = perColumnRows.filter((r) => r.length === rowsPerColumn);
  if (clean.length === 0) {
    console.error(
      `No column produced ${rowsPerColumn} rows (got ${perColumnRows.map((r) => r.length).join(", ")}). ` +
        `The chart layout has changed — fix the detection rather than the expected count.`,
    );
    process.exit(1);
  }
  const rowBands = Array.from({ length: rowsPerColumn }, (_, k) => {
    return [
      Math.round(median(clean.map((c) => c[k][0]))),
      Math.round(median(clean.map((c) => c[k][1]))),
    ] as const;
  });

  // ── 3. sample ───────────────────────────────────────────────────────────
  const lines: string[] = [];
  bands.forEach(([x0, x1], col) => {
    rowBands.forEach(([y0, y1], row) => {
      const entry = YARN_COLOURS[col * rowsPerColumn + row];
      if (!entry) return;
      const cy0 = Math.round(y0 + (y1 - y0) * 0.25);
      const cy1 = Math.round(y0 + (y1 - y0) * 0.75);
      const reds: number[] = [];
      const greens: number[] = [];
      const blues: number[] = [];
      for (let y = cy0; y <= cy1; y++) {
        for (let x = x0 + 8; x <= x1 - 7; x += 2) {
          const [r, g, b] = at(x, y);
          reds.push(r);
          greens.push(g);
          blues.push(b);
        }
      }
      lines.push(
        `  { code: "${entry.code}", hex: "${toHex(median(reds), median(greens), median(blues))}", family: "${entry.family}" },`,
      );
    });
  });

  console.log(
    `// Sampled from ${path.basename(imagePath)} on ${new Date().toISOString().slice(0, 10)}.`,
  );
  console.log(`// ${bands.length} columns x ${rowsPerColumn} rows, ${lines.length} swatches.`);
  console.log('// Set HEX_PROVENANCE to "sampled" when pasting this in.\n');
  console.log(lines.join("\n"));

  if (clean.length < bands.length) {
    console.error(
      `\nNote: ${bands.length - clean.length} column(s) did not detect ${rowsPerColumn} rows on their own ` +
        `(pale swatches usually), so their rows were taken from the columns that did. ` +
        `Spot-check a pale entry before pasting.`,
    );
  }
  if (lines.length !== YARN_COLOURS.length) {
    console.error(`\n⚠ Sampled ${lines.length} swatches but the table holds ${YARN_COLOURS.length}.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
