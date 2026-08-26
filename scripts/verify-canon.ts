/**
 * Canon guard — fails the build if published copy contradicts what checkout enforces.
 *
 * Run: `npm run verify:canon`
 *
 * WHY THIS EXISTS. In August 2026 the site carried two live, opposite pricing
 * contradictions at the same time:
 *   - /custom-patches/woven promised a 5-piece minimum in visible copy AND in
 *     its FAQPage schema, while the calculator rejected anything under 10. A
 *     buyer only discovered it after designing.
 *   - PVC, printed and sequin advertised a 10-piece minimum the calculator did
 *     not enforce, turning away orders we would happily have taken.
 * Both had been live for months. Nothing caught them because the numbers were
 * hand-typed prose in half a dozen files, and prose does not fail a build.
 *
 * This script makes the calculator the single arbiter: every minimum stated in
 * customer-facing copy must equal the quantity the calculator actually accepts.
 *
 * It deliberately reads the SAME modules the pages render from, so it verifies
 * shipped strings — not a duplicate list of expectations.
 */
import { calculatePatchPrice } from "../src/lib/pricingCalculator";
import { aeoContent } from "../src/lib/aeoContent";
import { slugFaqMap } from "../src/lib/slugFaqs";
import { genericFaqs } from "../src/lib/genericFaqs";
import { MIN_ORDER_EXCEPTIONS, MIN_ORDER_DEFAULT, OVERSIZE_CHENILLE } from "../src/lib/factConstants";

const PRODUCTS: Record<string, string> = {
  embroidered: "Custom Embroidered Patches",
  pvc: "Custom PVC Patches",
  woven: "Custom Woven Patches",
  chenille: "Custom Chenille Patches",
  leather: "Custom Leather Patches",
  printed: "Custom Printed Patches",
  sequin: "Custom Sequin Patches",
};

/** Lowest quantity the calculator will actually price, at a given size. */
function enforcedMinimum(productName: string, size = 2): number {
  for (let q = 1; q <= 100; q++) {
    if (!calculatePatchPrice(productName, size, size, q).error) return q;
  }
  return -1;
}

/**
 * Pull every minimum-order figure a piece of copy asserts ABOUT US.
 * The competitor-comparison clause is stripped first: "far below the
 * 50-to-100-piece minimum most patch manufacturers require" describes other
 * suppliers, not our floor, and must not be read as a claim about us.
 */
function statedMinimums(text: string): number[] {
  const t = text.replace(/50-to-100-piece minimum most patch manufacturers require/gi, "");
  const found = new Set<number>();
  const patterns = [
    /minimum(?: order)?(?: for [^.]{0,40})? (?:at Panda Patches )?is (?:just )?(\d{1,3}) pieces/gi,
    /\b(\d{1,3})-piece minimum/gi,
    /Minimum order: (\d{1,3}) pieces/gi,
    /minimum order (?:for [^.]{0,40} )?is (\d{1,3}) pieces/gi,
  ];
  for (const re of patterns) {
    for (const m of t.matchAll(re)) found.add(Number(m[1]));
  }
  return [...found];
}

const failures: string[] = [];

// 1. Per-type copy must match the calculator.
for (const [slug, productName] of Object.entries(PRODUCTS)) {
  const enforced = enforcedMinimum(productName);
  const surfaces: { where: string; text: string }[] = [];

  const aeo = aeoContent[slug];
  if (aeo) {
    surfaces.push({ where: `aeoContent.${slug}.answer`, text: aeo.answer });
    aeo.keyFacts.forEach((k, i) =>
      surfaces.push({ where: `aeoContent.${slug}.keyFacts[${i}]`, text: `${k.label}: ${k.value}` })
    );
    aeo.faqs.forEach((f, i) =>
      surfaces.push({ where: `aeoContent.${slug}.faqs[${i}]`, text: f.a })
    );
  }
  (slugFaqMap[slug] ?? []).forEach((f, i) =>
    surfaces.push({ where: `slugFaqs.${slug}[${i}]`, text: f.answer })
  );

  for (const s of surfaces) {
    for (const claim of statedMinimums(s.text)) {
      if (claim !== enforced) {
        failures.push(
          `${s.where}: states ${claim}-piece minimum, calculator enforces ${enforced}`
        );
      }
    }
  }
}

// 2. Shared generic copy must match the default (it is type-agnostic).
genericFaqs.forEach((f, i) => {
  for (const claim of statedMinimums(f.answer)) {
    if (claim !== MIN_ORDER_DEFAULT) {
      failures.push(
        `genericFaqs[${i}]: states ${claim}-piece minimum, canon default is ${MIN_ORDER_DEFAULT}`
      );
    }
  }
});

// 3. Every declared exception must be real — an exception the calculator does
//    not actually enforce is drift in the constant itself.
for (const [productName, declared] of Object.entries(MIN_ORDER_EXCEPTIONS)) {
  const enforced = enforcedMinimum(productName);
  if (enforced !== declared) {
    failures.push(
      `MIN_ORDER_EXCEPTIONS["${productName}"] = ${declared}, calculator enforces ${enforced}`
    );
  }
}

// 4. The size-conditional oversized-chenille floor must be real, and must NOT
//    leak down to normal sizes. A run constraint that silently applied to a
//    3-inch chenille would block orders we can happily make.
{
  const { fromSizeInches, minQty } = OVERSIZE_CHENILLE;
  const atOversize = enforcedMinimum("Custom Chenille Patches", fromSizeInches);
  const belowOversize = enforcedMinimum("Custom Chenille Patches", fromSizeInches - 1);
  if (atOversize !== minQty) {
    failures.push(
      `OVERSIZE_CHENILLE: declares ${minQty} at ${fromSizeInches}in, calculator enforces ${atOversize}`
    );
  }
  if (belowOversize !== MIN_ORDER_DEFAULT) {
    failures.push(
      `OVERSIZE_CHENILLE: floor leaked below ${fromSizeInches}in — ` +
        `chenille at ${fromSizeInches - 1}in enforces ${belowOversize}, expected ${MIN_ORDER_DEFAULT}`
    );
  }
}

const summary = Object.entries(PRODUCTS)
  .map(([slug, n]) => `${slug}=${enforcedMinimum(n)}`)
  .join("  ") +
  `  |  3D-transfer=${enforcedMinimum("Custom 3D Embroidered Transfer")}` +
  `  chenille@${OVERSIZE_CHENILLE.fromSizeInches}in=${enforcedMinimum("Custom Chenille Patches", OVERSIZE_CHENILLE.fromSizeInches)}`;

if (failures.length) {
  console.error("\nCANON CHECK FAILED\n");
  failures.forEach((f) => console.error("  x " + f));
  console.error(`\nEnforced minimums: ${summary}`);
  console.error(
    "\nFix the COPY to match the calculator, or change the calculator deliberately\n" +
      "and sweep every surface. Do not silence this check.\n"
  );
  process.exit(1);
}

console.log(`Canon check passed — every stated minimum matches the calculator.`);
console.log(`Enforced minimums: ${summary}`);
