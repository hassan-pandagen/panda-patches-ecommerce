import "server-only";

/**
 * WEBSIT_4.MD G1.4 — Tiled semi-transparent "PANDA PATCHES PREVIEW" watermark.
 *
 * Applied to every generation BEFORE the public bucket gets the image. The
 * clean (un-watermarked) byte array stays in a separate "clean/" path that
 * is only ever surfaced when the customer hits "Get Free Quote" (G6).
 *
 * Design choices:
 *  - Tiled diagonal, low opacity — visible enough that screenshotters cannot
 *    crop it out, faint enough that the actual design is judgeable.
 *  - SVG overlay composited via sharp so the tile renders crisp at any size.
 *  - The watermark text is fixed; if branding changes, edit BRAND_LINE once.
 */

const BRAND_LINE = "PANDA PATCHES";
const PREVIEW_LINE = "PREVIEW";

// Tile pitch: 280×160 gives ~4 rows × 5 cols at -28deg on a 1024×1024 image.
const TILE_W = 280;
const TILE_H = 160;
const TILE_OPACITY = 0.42;
const TILE_ROTATION_DEG = -28;

/**
 * Apply the watermark to raw PNG/JPEG bytes. Always returns PNG.
 */
export async function applyWatermark(input: Uint8Array): Promise<Uint8Array> {
  const sharp = (await import("sharp")).default;

  const meta = await sharp(input).metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;

  // Build a tiled SVG sized to cover the whole image. The pattern repeats
  // via SVG <pattern>, which sharp composites without any extra raster work.
  const svg = buildTiledWatermarkSvg(width, height);

  const out = await sharp(input)
    .composite([
      {
        input: Buffer.from(svg),
        blend: "over",
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  return new Uint8Array(out);
}

function buildTiledWatermarkSvg(width: number, height: number): string {
  // We rotate the entire pattern around the center so the diagonal cadence
  // looks intentional rather than glitchy. The pattern itself is upright;
  // the wrapping <g> rotates and oversizes the canvas to avoid gaps at the
  // corners after rotation.
  const oversize = Math.ceil(Math.sqrt(width * width + height * height));
  const offset = Math.floor((oversize - width) / 2);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <pattern id="wm" patternUnits="userSpaceOnUse" width="${TILE_W}" height="${TILE_H}">
          <!-- dark shadow behind text for contrast on light AND dark images -->
          <text x="${TILE_W / 2 + 1.5}" y="${TILE_H / 2 - 9 + 1.5}"
                dominant-baseline="middle" text-anchor="middle"
                font-family="Arial, sans-serif" font-size="20" font-weight="900"
                fill="black" fill-opacity="${TILE_OPACITY * 0.7}"
                letter-spacing="3">
            ${BRAND_LINE}
          </text>
          <text x="${TILE_W / 2 + 1}" y="${TILE_H / 2 + 12 + 1}"
                dominant-baseline="middle" text-anchor="middle"
                font-family="Arial, sans-serif" font-size="13" font-weight="700"
                fill="black" fill-opacity="${TILE_OPACITY * 0.7}"
                letter-spacing="5">
            ${PREVIEW_LINE}
          </text>
          <!-- main white text -->
          <text x="${TILE_W / 2}" y="${TILE_H / 2 - 9}"
                dominant-baseline="middle" text-anchor="middle"
                font-family="Arial, sans-serif" font-size="20" font-weight="900"
                fill="white" fill-opacity="${TILE_OPACITY}"
                letter-spacing="3">
            ${BRAND_LINE}
          </text>
          <text x="${TILE_W / 2}" y="${TILE_H / 2 + 12}"
                dominant-baseline="middle" text-anchor="middle"
                font-family="Arial, sans-serif" font-size="13" font-weight="700"
                fill="white" fill-opacity="${TILE_OPACITY}"
                letter-spacing="5">
            ${PREVIEW_LINE}
          </text>
        </pattern>
      </defs>
      <g transform="rotate(${TILE_ROTATION_DEG} ${width / 2} ${height / 2}) translate(-${offset} -${offset})">
        <rect width="${oversize}" height="${oversize}" fill="url(#wm)" />
      </g>
    </svg>`;
}
