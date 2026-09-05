/**
 * Read the real hex values out of the supplier's chenille yarn chart image.
 *
 * WHY THIS EXISTS. `src/lib/yarnColours.ts` shipped with hex values eyeballed
 * from the chart image, because the image itself was not in the repo when the
 * picker was built. Eyeballed values are fine for a bright green and poor for
 * the browns and taupes, where a dozen cones sit within a few points of each
 * other and a guess can put them in the wrong order. This replaces the guesses
 * with pixels.
 *
 * It does NOT touch the codes. The codes are transcribed from the chart and are
 * the thing we actually match; only the on-screen approximation is regenerated.
 *
 *   npx tsx scripts/sample-yarn-chart.ts public/assets/yarn-chart.png
 *
 * Prints a ready-to-paste YARN_COLOURS table. Read the output before pasting:
 * if the grid detection is off, the colours will be shifted by one row and the
 * script will say so rather than let it pass silently.
 *
 * HOW IT FINDS THE SWATCHES. The chart is a regular grid: four column pairs of
 * (code, swatch), each row one colour. Rather than hard-code pixel offsets that
 * break the moment someone re-exports the image, it looks for the vertical runs
 * of saturated or non-white pixels that make up each swatch block, then samples
 * the middle of each. The sample is a MEDIAN of the block's centre region, not a
 * mean: the swatches carry a subtle fabric texture, and a mean drags toward the
 * highlights.
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

const COLUMNS = 4;

function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0").toUpperCase()).join("");
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function main() {
  const img = sharp(imagePath).ensureAlpha();
  const { width, height } = await img.metadata();
  if (!width || !height) throw new Error("Could not read image dimensions");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const px = (x: number, y: number) => {
    const i = (y * info.width + x) * ch;
    return [data[i], data[i + 1], data[i + 2]] as const;
  };
  const isBackground = ([r, g, b]: readonly [number, number, number]) =>
    r > 244 && g > 244 && b > 244;

  const colWidth = width / COLUMNS;
  const rowsPerColumn = Math.ceil(YARN_COLOURS.length / COLUMNS);
  const sampled: string[] = [];
  const warnings: string[] = [];

  for (let col = 0; col < COLUMNS; col++) {
    // The swatch sits in the right-hand ~55% of each column pair; the left is
    // the printed code. Sampling a band inside that avoids the label entirely.
    const xStart = Math.round(col * colWidth + colWidth * 0.52);
    const xEnd = Math.round(col * colWidth + colWidth * 0.95);
    const xMid = Math.round((xStart + xEnd) / 2);

    // Find the vertical runs of non-white pixels down the middle of the swatch
    // band. Each run is one swatch.
    const runs: [number, number][] = [];
    let runStart: number | null = null;
    for (let y = 0; y < height; y++) {
      const filled = !isBackground(px(xMid, y));
      if (filled && runStart === null) runStart = y;
      if (!filled && runStart !== null) {
        if (y - runStart > 4) runs.push([runStart, y - 1]);
        runStart = null;
      }
    }
    if (runStart !== null && height - runStart > 4) runs.push([runStart, height - 1]);

    if (runs.length !== rowsPerColumn) {
      warnings.push(
        `column ${col + 1}: found ${runs.length} swatch blocks, expected ${rowsPerColumn}. ` +
          `The grid detection is off — do NOT paste this column's output.`,
      );
    }

    for (let r = 0; r < runs.length; r++) {
      const [y0, y1] = runs[r];
      const cy0 = Math.round(y0 + (y1 - y0) * 0.3);
      const cy1 = Math.round(y0 + (y1 - y0) * 0.7);
      const reds: number[] = [];
      const greens: number[] = [];
      const blues: number[] = [];
      for (let y = cy0; y <= cy1; y++) {
        for (let x = xStart; x <= xEnd; x += 2) {
          const [pr, pg, pb] = px(x, y);
          reds.push(pr);
          greens.push(pg);
          blues.push(pb);
        }
      }
      const idx = col * rowsPerColumn + r;
      const code = YARN_COLOURS[idx]?.code ?? `?${idx}`;
      sampled[idx] = `  { code: "${code}", hex: "${toHex(median(reds), median(greens), median(blues))}", family: "${YARN_COLOURS[idx]?.family ?? "grey"}" },`;
    }
  }

  console.log(`// Sampled from ${path.basename(imagePath)} on ${new Date().toISOString().slice(0, 10)}.`);
  console.log("// Set HEX_PROVENANCE to \"sampled\" when pasting this in.\n");
  console.log(sampled.filter(Boolean).join("\n"));

  if (warnings.length) {
    console.error("\n⚠ GRID DETECTION PROBLEMS — read before pasting:");
    warnings.forEach((w) => console.error("   " + w));
    process.exit(1);
  }
  const missing = YARN_COLOURS.length - sampled.filter(Boolean).length;
  if (missing > 0) console.error(`\n⚠ ${missing} codes got no sample.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
