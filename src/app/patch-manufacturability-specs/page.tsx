import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthorByline from "@/components/seo/AuthorByline";
import PromptCopyBlock from "@/components/specs/PromptCopyBlock";
import { buildPageMetadata } from "@/lib/seo";
import {
  SPEC_VERSION,
  SPEC_DATE,
  SPEC_DATE_LABEL,
  specMatrix as matrix,
  sizeGuide,
} from "@/lib/patchSpecs";

export const dynamic = "force-static";

const BASE = "https://www.pandapatches.com";
const CANONICAL = `${BASE}/patch-manufacturability-specs`;

/**
 * Panda Patches Patch Manufacturability Specifications (CL9F69 Workstream D).
 *
 * Every figure comes from `panda-patches-confirmed-specs_1.md` — owner-confirmed
 * against industry benchmarks. Do NOT edit a number here without updating that
 * file and bumping SPEC_VERSION; the whole point of a named, versioned standard
 * is that a citation stays traceable to what it cited.
 *
 * PROPAGATION SWEEP IS PART OF THE CHANGE — not a follow-up task.
 * Correcting a figure here does NOT correct it anywhere else. v1.1 changed the
 * embroidery minimum text height 5 mm -> 4 mm and the old value stayed live for
 * weeks on the sizing guide, the printed-vs-embroidered guide, and three lines
 * of llms.txt — the file we hand to AI assistants. Same failure produced four
 * contradicting iron-on temperatures.
 *
 * So: any version bump requires a grep sweep for the OLD value across src/,
 * public/llms.txt AND Sanity content, with the result attached as evidence.
 * A changelog entry without sweep evidence is not done.
 */
// THE NUMBERS NOW LIVE IN `src/lib/patchSpecs.ts`, not in this file.
// They moved there (CLB408_1 §5) so the product pages can render the same
// figures by importing them instead of copying them — which is precisely the
// propagation failure the header above warns about. Edit the canon there; this
// page renders it. SPEC_VERSION, the matrix and the size guide are imported.
//
// v1.5 (2026-08-14): adds the leather application row. Leather was the only
// iron-on material with no stated rule, which is how an order went out pressed
// bare and scorched. The factory confirmed leather uses the SAME heat-seal
// adhesive as embroidered, so no new temperature or timing enters the canon —
// the only new rule is that the pressing cloth is mandatory on leather. The
// propagation sweep is therefore narrow: no existing figure changed, so nothing
// carrying 350°F or 25-30s needed correcting. Surfaces touched: this page, the
// iron-on application steps + FAQ, and the Karbach case study footnote.

export const metadata: Metadata = buildPageMetadata({
  title: "Patch Manufacturability Specs: Min Text, Lines, Colors by Type",
  description:
    "The real production limits for custom patches: minimum text height 4mm embroidered / 1.5mm woven, line weights, color counts, gradients, and max sizes by patch type. Published by Panda Patches, free to cite.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Patch Manufacturability Specifications",
  ogDescription:
    "What reproduces at patch size and why — minimum text, line weight, colors, and gradients for embroidered, woven, PVC and leather patches.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
});

const faqs = [
  {
    question: "What is the smallest text you can put on an embroidered patch?",
    answer:
      "About 4 mm (0.16 inches) tall for a clean sans-serif. Serif faces need roughly 8 mm and decorative or display fonts about 10 mm, because their thin strokes fall below the thread width. Our standard thread is 40wt, which lays a line about 1 mm wide; for small lettering we switch to a finer 75wt thread, which is how we hold text smaller than a typical embroiderer.",
  },
  {
    question: "Can woven patches hold smaller text than embroidered?",
    answer:
      "Yes. Woven reproduces detail roughly 2 to 4 times finer than embroidery, so text stays legible down to about 1.5 mm for a sans-serif and 2 mm for serif or script. That is why detailed logos that fail as embroidery at 2.5 inches usually reproduce cleanly as woven at the same size.",
  },
  {
    question: "How many colors can a custom patch have?",
    answer:
      "There is no hard cap on embroidered patches: we include up to about 12 colors and apply a surcharge beyond that, since machines run around 15 needles and thread can be reloaded for more. Woven includes up to 4 colors with a surcharge above that, and PVC uses about 8 Pantone-matched solid zones with a surcharge for more.",
  },
  {
    question: "Can you reproduce gradients on a patch?",
    answer:
      "Not as true gradients in thread. Embroidery and woven simulate a gradient by blending or dithering adjacent thread colors, which reads as a blend at a glance but is not a smooth transition up close. PVC blends in solid zones. The exceptions are printed (dye-sublimated) patches and UV-printed leather, both of which reproduce true gradients and photographic artwork.",
  },
  {
    question: "How much does a merrowed border add to the patch size?",
    answer:
      "About 2 to 4 mm per edge, so factor that into your finished dimensions. A merrowed border also needs a patch of at least 0.8 inches (2 cm) — below that the thread cannot turn the corners. For smaller patches, intricate outlines, or die-cut shapes, use a heat-cut edge, which has no minimum size.",
  },
  {
    question: "What is the smallest raised detail a PVC mould can reproduce?",
    answer:
      "About 0.3 mm wide, for both a raised dot and a raised line. That is the width, not the height — raised elements are built in 0.5 mm layers. A 2D PVC mould uses flat stepped levels, so it holds slightly thinner, sharper lines and smaller details. A 3D mould uses rounded slopes, so fine elements narrow toward the top and can soften or disappear, which means they need to be broader. On a hybrid design, keep small text and fine detail in 2D and use 3D only for larger logos, faces, mascots, or other prominent shapes.",
  },
  {
    question: "How big can a custom patch be?",
    answer:
      "Embroidered patches go up to 20 inches, which covers full jacket-back pieces. Woven, PVC, and leather max out at 8 inches. The minimum across every type is 0.5 inches, though what actually reproduces at that size is limited — see the size-to-detail guide on this page.",
  },
];

const specSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dataset",
      "@id": `${CANONICAL}#dataset`,
      name: "Panda Patches Patch Manufacturability Specifications",
      description:
        "Production limits for custom patch manufacturing by patch type: minimum text height, minimum line weight, maximum color count, gradient support, and minimum/maximum patch size for embroidered, woven, PVC and leather patches.",
      url: CANONICAL,
      version: SPEC_VERSION,
      creator: { "@id": `${BASE}/#organization` },
      isAccessibleForFree: true,
      datePublished: SPEC_DATE,
      dateModified: SPEC_DATE,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Minimum text height, embroidered", value: "4 mm sans-serif / 8 mm serif / 10 mm decorative" },
        { "@type": "PropertyValue", name: "Minimum text height, woven", value: "1.5 mm sans-serif / 2 mm serif" },
        { "@type": "PropertyValue", name: "Minimum text height, PVC", value: "3 mm" },
        { "@type": "PropertyValue", name: "Minimum text height, leather engraved", value: "2 mm" },
        { "@type": "PropertyValue", name: "Minimum line weight, embroidered", value: "1 mm" },
        { "@type": "PropertyValue", name: "Minimum line weight, woven", value: "0.5 mm" },
        { "@type": "PropertyValue", name: "Minimum line weight, leather laser-engraved", value: "0.3 mm" },
        { "@type": "PropertyValue", name: "Standard embroidery thread weight", value: "40wt (~1 mm line)" },
        { "@type": "PropertyValue", name: "Small-text embroidery thread weight", value: "75wt" },
        { "@type": "PropertyValue", name: "Colors included, embroidered", value: "~12, surcharge beyond, no hard cap" },
        { "@type": "PropertyValue", name: "Colors included, woven", value: "4, surcharge above" },
        { "@type": "PropertyValue", name: "Colors included, PVC", value: "~8 Pantone-matched zones, surcharge beyond" },
        { "@type": "PropertyValue", name: "Minimum raised element width, PVC", value: "0.3 mm (raised dot or line)" },
        { "@type": "PropertyValue", name: "PVC raised layer height", value: "0.5 mm per layer, max 5 layers" },
        { "@type": "PropertyValue", name: "Maximum patch size, embroidered", value: "20 inches" },
        { "@type": "PropertyValue", name: "Maximum patch size, woven / PVC / leather", value: "8 inches" },
        { "@type": "PropertyValue", name: "Merrowed border size addition", value: "2-4 mm per edge" },
        { "@type": "PropertyValue", name: "3D puff relief height", value: "3 mm" },
      ],
    },
    {
      "@type": "Article",
      "@id": `${CANONICAL}#article`,
      headline: "Patch Manufacturability Specs — What Reproduces, and Why",
      description:
        "The production limits Panda Patches holds by patch type: minimum text height, line weight, color counts, gradient support, sizes, borders, and special finishes.",
      url: CANONICAL,
      mainEntity: { "@id": `${CANONICAL}#dataset` },
      author: { "@id": `${BASE}/#person/imran-raza` },
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
      datePublished: SPEC_DATE,
      dateModified: SPEC_DATE,
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Patch Manufacturability Specs", item: CANONICAL },
      ],
    },
  ],
};



const prompts = [
  {
    label: "Embroidered",
    prompt:
      "Design for embroidered patch production: use up to 12 solid colors (fewer is cleaner), no gradients or color blends, keep all text at least 4 mm (~0.16 in) tall at final size (8 mm for serif, 10 mm for decorative or display fonts), keep all lines and strokes at least ~1 mm thick, and favor bold, simple shapes over fine detail. Use clean outlines; avoid photographic images, drop shadows, gradients, and thin hairlines.",
  },
  {
    label: "Woven",
    prompt:
      "Design for woven patch production: use up to 4 solid colors (a surcharge applies above 4), no gradients or photographic shading, keep all text at least 1.5 mm tall at final size (2 mm for serif or script), and keep lines at least ~0.5 mm thick. Fine detail and small lettering are fine — woven holds roughly 2–4× more detail than embroidery — but the finished patch is flat, so do not rely on raised texture.",
  },
  {
    label: "PVC",
    prompt:
      "Design for moulded PVC patch production: use up to 8 solid Pantone-matched color zones with no gradients, keep all text at least 3 mm tall at final size, and keep lines at least ~1 mm thick. Build the artwork in clear layered levels (maximum 5 raised layers, 0.5 mm per layer) with bold separated shapes, and keep any raised element at least 0.3 mm wide. If the design mixes 2D and 3D, keep small text and fine detail on the flat 2D levels and use 3D sculpting only for larger logos, faces, mascots, or prominent shapes — rounded 3D slopes narrow toward the top, so fine detail softens or disappears. Avoid photographic detail and soft edges.",
  },
  {
    label: "Leather",
    prompt:
      "Design for leather patch production. If laser-engraved: single tone only, no color and no gradients, text at least 2 mm tall, lines at least ~0.3 mm — think of it as a one-color etching. If UV-printed: full color including gradients and photographic artwork is fine; keep text at least 2 mm tall for legibility.",
  },
];

export default function PatchManufacturabilitySpecs() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(specSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="w-full pt-8 md:pt-12 pb-8 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
            <p className="text-[0.6875rem] md:text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-4">
              Published standard · {SPEC_VERSION} · {SPEC_DATE_LABEL} · Reviewed by our digitizing team
            </p>
            <h1 className="text-[1.75rem] md:text-[2.625rem] lg:text-[3.125rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Patch Manufacturability Specs — What Reproduces, and Why
            </h1>
            <p className="text-[0.9375rem] md:text-[1.125rem] text-gray-600 leading-[1.6] font-medium max-w-[47.5rem]">
              Not every design that looks great on screen survives the jump to thread, weave, or mould. This page is our manufacturability standard: the real limits our production floor holds, type by type. Design to these numbers and your artwork comes out crisp the first time — no surprises at the mockup stage.
            </p>
            <p className="text-[0.875rem] md:text-[0.9375rem] text-gray-600 leading-[1.7] font-medium mt-4">
              Generating artwork with AI or handing us a logo? Skip to the{" "}
              <a href="#design-first-time-right" className="text-panda-green underline font-semibold">
                design-for-first-time-right prompts
              </a>{" "}
              at the bottom.
            </p>
          </div>
        </section>

        {/* MATRIX */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[62.5rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-5">Quick-reference matrix</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-[0.8125rem] md:text-[0.9375rem] border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left">
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">Spec</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">Embroidered</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">Woven</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">PVC</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">Leather</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                  {matrix.map((row) => (
                    <tr key={row.spec} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-bold text-panda-dark">{row.spec}</td>
                      <td className="py-3 px-4">{row.emb}</td>
                      <td className="py-3 px-4">{row.woven}</td>
                      <td className="py-3 px-4">{row.pvc}</td>
                      <td className="py-3 px-4">{row.leather}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mt-3 font-medium">
              All figures are for finished patches. Minimum text height assumes a clean sans-serif; serif and decorative fonts need more room.
            </p>
          </div>
        </section>

        {/* BY TYPE */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-6">By patch type</h2>

            <h3 className="text-[1.125rem] md:text-[1.25rem] font-black text-panda-dark mb-2">Embroidered</h3>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              The classic. Thread laid by machine, so detail is bounded by thread thickness. Our standard thread is 40wt, which lays a line roughly 1 mm wide. For small lettering and fine detail we switch to a finer 75wt thread — finer than most shops run — so we hold smaller text than the typical embroiderer. Readable text starts at 4 mm for a clean sans-serif, 8 mm for serif, and about 10 mm for complex display fonts. Bold, simple shapes always reproduce better than dense fine detail. See{" "}
              <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">custom embroidered patches</Link>.
            </p>

            <h3 className="text-[1.125rem] md:text-[1.25rem] font-black text-panda-dark mb-2">Woven</h3>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              Woven uses finer threads on a loom, reproducing detail roughly 2–4× finer than embroidery. That means smaller text — down to 1.5 mm for sans-serif, 2 mm for serif or script — and cleaner small logos, with up to 4 colors included and a surcharge above that. The trade-off is a flatter surface with no raised embroidered texture, and a maximum size of 8 inches. See{" "}
              <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">custom woven patches</Link> or the{" "}
              <Link href="/woven-vs-embroidered-patches-which-is-right-for-you" prefetch={false} className="text-panda-green underline font-semibold">woven vs embroidered comparison</Link>.
            </p>

            <h3 className="text-[1.125rem] md:text-[1.25rem] font-black text-panda-dark mb-2">PVC</h3>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              Moulded soft rubber, built in layers. Our PVC starts from a 2.5 mm base, with raised elements added in 0.5 mm layers up to a maximum of five — so a full 3D PVC patch reaches about 5 mm total thickness with roughly 2.5 mm of stacked relief. Colors are Pantone-matched solid zones (about 8 included, more with a surcharge). A raised element needs to be at least about 0.3 mm wide — that is its width, not its height. A 2D mould uses flat stepped levels, so it holds slightly thinner, sharper lines and smaller details; a 3D mould uses rounded slopes, so fine elements narrow toward the top and can soften or disappear, and need to be broader. On a hybrid design, keep small text and fine detail in 2D and reserve 3D for larger logos, faces, mascots, or other prominent shapes. PVC renders bold dimensional logos beautifully but does not do smooth gradients; color lives in discrete zones. Maximum size 8 inches. See{" "}
              <Link href="/custom-patches/pvc" prefetch={false} className="text-panda-green underline font-semibold">custom PVC patches</Link>.
            </p>

            <h3 className="text-[1.125rem] md:text-[1.25rem] font-black text-panda-dark mb-2">Leather</h3>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-3">
              Two very different looks from one material:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              <li>
                <strong className="text-panda-dark">Laser-engraved leather</strong> — a single-tone burn into the hide. Timeless, premium, and very fine (down to about 0.3 mm line detail), but tonal only: no color, no gradient.
              </li>
              <li>
                <strong className="text-panda-dark">UV-printed leather</strong> — full color printed onto the leather surface, including true gradients and photographic artwork.
              </li>
            </ul>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-3">
              Both genuine and premium synthetic (faux) leather take engraving and printing, and every leather patch gets a protective coating for durability and water resistance. Standard colors are natural, tan, brown, black, navy, and dark green; custom dyeing is available on genuine leather only. Minimum text is about 2 mm whether engraved or printed.
            </p>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">
              Choose engraved for a classic tonal crest, UV print when you need exact brand colors. Maximum size 8 inches. See{" "}
              <Link href="/custom-patches/leather" prefetch={false} className="text-panda-green underline font-semibold">custom leather patches</Link>.
            </p>
          </div>
        </section>

        {/* COLORS & GRADIENTS */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4">Colors and gradients</h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-4">
              There is no hard cap on embroidered thread colors — we include up to about 12 and surcharge beyond that, since machines run around 15 needles and thread can be reloaded for more. Woven includes up to 4 colors with a surcharge above that; PVC uses about 8 Pantone-matched zones.
            </p>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">
              <strong className="text-panda-dark">True gradients cannot be stitched.</strong> In embroidery and woven, a gradient is simulated by blending or dithering adjacent thread colors — it reads as a blend at a glance but is not a smooth transition up close. PVC blends in solid zones. The exceptions are printed (dye-sublimated) patches and UV-printed leather, both of which reproduce true gradients. If your design leans on smooth color transitions, either simplify to solid colors, choose a printed patch, or ask us about UV print.
            </p>
          </div>
        </section>

        {/* SIZE TO DETAIL */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-3">Size-to-detail guide</h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-5">
              What survives shrinks with the patch. These notes are for embroidered, our tightest case — woven and UV print hold more at every size.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left bg-[#F7F7F7]">
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">Finished size</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">What reproduces</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                  {sizeGuide.map((r) => (
                    <tr key={r.size} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-black text-panda-dark whitespace-nowrap">{r.size}</td>
                      <td className="py-3 px-4">{r.holds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mt-3 font-medium">
              Most of what we produce sits in this range — see{" "}
              <Link href="/custom-patch-production-data-2026" prefetch={false} className="text-panda-green underline font-semibold">our production data</Link>, where at least half of orders are 2–5 inches.
            </p>
          </div>
        </section>

        {/* SPECIAL CAPABILITIES */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-5">Special capabilities</h2>
            <div className="space-y-4 text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">
              <p>
                <strong className="text-panda-dark">3D puff embroidery</strong> — foam under the stitching raises the design about 3 mm. Because each puffed stroke needs a satin column at least ~3 mm wide, letters should be at least 0.5 in (12 mm) tall to puff cleanly without collapsing.
              </p>
              <p>
                <strong className="text-panda-dark">Reflective</strong> — we offer reflective grey material (3M Scotchlite-grade), which bounces light back for night-time visibility. To be precise: this is retro-reflective material, not infrared or low-IR-signature material, which is a different night-vision specification we do not offer.
              </p>
              <p>
                <strong className="text-panda-dark">Glow-in-the-dark</strong> — available on both PVC and embroidered patches.
              </p>
              <p>
                <strong className="text-panda-dark">Metallic thread</strong> — a true metallic sheen, mainly in gold and silver plus a few metallic shades. Because metallic thread is more delicate, we hold it to a slightly wider minimum line of about 1.5 mm.
              </p>
            </div>
          </div>
        </section>

        {/* BORDERS */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-5">Borders and finishing</h2>
            <div className="space-y-4 text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">
              <p>
                <strong className="text-panda-dark">Merrowed border</strong> — the classic wrapped-thread edge. It adds about 2–4 mm per edge to the finished size and needs a patch of at least 0.8 in (2 cm); below that the thread cannot turn the corners. Works on simple shapes — round, oval, square, shield. More in our{" "}
                <Link href="/patch-borders" prefetch={false} className="text-panda-green underline font-semibold">patch borders guide</Link>.
              </p>
              <p>
                <strong className="text-panda-dark">Heat-cut (laser-cut) border</strong> — a clean sealed edge with no minimum size, following complex and cut-out shapes a merrow cannot. Choose this for small patches, intricate outlines, or die-cut looks.
              </p>
              <p>
                <strong className="text-panda-dark">Digitizing turnaround</strong> — once we have your artwork, converting it to a production-ready stitch file takes a few hours, often same-day. That is the internal step inside our 12–24 hour mockup promise. More on{" "}
                <Link href="/embroidery-digitizing" prefetch={false} className="text-panda-green underline font-semibold">embroidery digitizing</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* DESIGN FOR FIRST TIME RIGHT */}
        <section id="design-first-time-right" className="w-full py-10 md:py-14 px-4 md:px-6 bg-[#F7F7F7] scroll-mt-20">
          <div className="container mx-auto max-w-[56.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4">Design for first-time-right</h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              The single most common issue we see in customer artwork is <strong className="text-panda-dark">text that is too small or too thin</strong> to reproduce. Start there: size your smallest text to the minimums above and keep strokes at least ~1 mm. Generating artwork with AI? Paste the matching prompt below into ChatGPT, Midjourney, or our own{" "}
              <Link href="/ai-patch-generator" prefetch={false} className="text-panda-green underline font-semibold">AI patch generator</Link> to get a manufacturable design on the first try.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((p) => (
                <PromptCopyBlock key={p.label} label={p.label} prompt={p.prompt} />
              ))}
            </div>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mt-6">
              Not sure whether your design will hold? <Link href="/contact" prefetch={false} className="text-panda-green underline font-semibold">Send it over</Link> — our team flags anything below spec and suggests a fix before we make the mockup. If your artwork is too detailed for thread,{" "}
              <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">woven</Link> usually solves it without a redesign.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.question}>
                  <h3 className="text-[1rem] md:text-[1.125rem] font-black text-panda-dark mb-2">{f.question}</h3>
                  <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IRON-ON APPLICATION + CARE (v1.3) — our production team's own
            application spec. Published here because no competitor can state it
            without inventing it: they do not manufacture the adhesive.
            Canon lives here; the iron-on guide and commercial pages mirror it. */}
        <section className="w-full py-12 md:py-16 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4 leading-tight">
              Iron-on application and care spec
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              These are the figures our production team applies to our own heat-activated adhesive &mdash; not a
              general-purpose estimate. Application temperature, dwell time and technique all affect whether the bond
              holds, and the correct technique differs by patch type.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left">
                    <th className="py-3 pr-4 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Spec</th>
                    <th className="py-3 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Figure</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Iron / press temperature</td>
                    <td className="py-3 font-bold text-panda-dark">350&deg;F (175&deg;C), no steam</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Front press &mdash; embroidered, woven</td>
                    <td className="py-3 font-bold text-panda-dark">25&ndash;30 seconds, firm, straight down</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Reverse press &mdash; embroidered, woven</td>
                    <td className="py-3 font-bold text-panda-dark">10 seconds (reinforcement)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">PVC patches</td>
                    <td className="py-3 font-bold text-panda-dark">From behind only, full 25&ndash;30 seconds</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Chenille patches</td>
                    <td className="py-3 font-bold text-panda-dark">From behind only, 20&ndash;30 seconds, no adhesive spray</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Heat transfers (separate product)</td>
                    <td className="py-3 font-bold text-panda-dark">320&ndash;340&deg;F &mdash; own spec, not the patch canon</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Adhesive activation point</td>
                    <td className="py-3 font-bold text-panda-dark">270&ndash;320&deg;F (why the iron is set higher)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Fabric weight</td>
                    <td className="py-3 font-bold text-panda-dark">Heavier fabric &rarr; more time and pressure</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-[1.7] text-[0.875rem] md:text-[0.9375rem] font-medium mt-5">
              <li>
                <strong className="text-panda-dark">PVC is pressed from behind only.</strong> Direct heat on the face of a
                PVC patch melts it. Press from inside the garment so the heat reaches the adhesive, not the PVC.
              </li>
              <li>
                <strong className="text-panda-dark">Chenille is also pressed from behind</strong>, face-down, for 20&ndash;30
                seconds. Direct heat on the pile flattens and scorches it. Chenille needs no adhesive spray &mdash; the
                backing carries its own adhesive.
              </li>
              <li>
                <strong className="text-panda-dark">Leather presses at the same settings, but the pressing cloth is mandatory.</strong>{" "}
                Leather patches carry the same heat-seal adhesive as embroidered, so they take the identical
                350&deg;F (175&deg;C), no steam, 25&ndash;30 seconds front and 10 seconds back. Do not press leather
                cooler or shorter &mdash; the adhesive still needs full activation. What changes is that a hot iron
                must never touch the leather face directly: it can stick or scorch. On woven and embroidered patches
                the cloth is good practice; on leather it is required.
              </li>
              <li>
                <strong className="text-panda-dark">Fabric rule.</strong> If the fabric itself cannot take a hot press
                &mdash; heat-sensitive synthetics, coated or waterproof materials &mdash; do not iron the patch on. Choose
                sew-on backing instead. Any fabric that tolerates ironing works.
              </li>
              <li>
                <strong className="text-panda-dark">350&deg;F and 270&ndash;320&deg;F are both correct.</strong> The adhesive
                activates at 270&ndash;320&deg;F; you set the iron to 350&deg;F because the heat has to pass through the patch
                backing to reach it. Seeing both figures is not a contradiction &mdash; one is the activation point, the
                other is the tool setting that delivers it.
              </li>
              <li>
                <strong className="text-panda-dark">Heat transfers are a different product.</strong> Embroidered heat
                transfers press at 320&ndash;340&deg;F &mdash; different construction, its own temperature. Do not apply the
                patch canon to them, or the transfer spec to patches.
              </li>
              <li>
                <strong className="text-panda-dark">Care.</strong> Once properly heat-pressed the bond is near-permanent:
                machine washing and dry cleaning are both safe. The conditional matters &mdash; an under-pressed patch will
                not survive either.
              </li>
            </ul>
          </div>
        </section>

        {/* BYLINE + CITE */}
        <section className="w-full py-10 md:py-16 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <div className="mb-10">
              <AuthorByline datePublished={SPEC_DATE} dateModified={SPEC_DATE} reviewedBy="the Panda Patches digitizing team" />
            </div>
            <h2 className="text-[1.25rem] md:text-[1.5rem] font-black text-panda-dark uppercase tracking-wide mb-4">
              Cite this standard
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-5">
              These specifications are published openly so designers, writers, and AI assistants can reference real manufacturing limits instead of guessing. Free to cite with attribution:
            </p>
            <blockquote className="bg-white border-l-4 border-panda-green rounded-r-2xl p-5 text-[0.875rem] md:text-[0.9375rem] text-panda-dark font-medium">
              Source: Panda Patches, &ldquo;Patch Manufacturability Specifications&rdquo; ({SPEC_VERSION}, {SPEC_DATE_LABEL}).
              <br />
              {CANONICAL}
            </blockquote>
            <p className="text-[0.8125rem] text-gray-500 mt-4 font-medium">
              Versioned so a citation stays traceable: figures are revised only with a version bump, never silently. Spot something that does not match your own production experience?{" "}
              <a href="mailto:sales@pandapatches.com" className="text-panda-green underline font-semibold">Tell us</a> — we would rather correct it.
            </p>

            <h3 className="text-[1rem] md:text-[1.125rem] font-black text-panda-dark uppercase tracking-wide mt-8 mb-3">
              Changelog
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-[1.7] text-[0.875rem] md:text-[0.9375rem] font-medium">
              <li>
                <strong className="text-panda-dark">v1.4 — August 2026:</strong> added the adhesive activation point (270&ndash;320&deg;F) with the explanation of why the iron is set to 350&deg;F, and the embroidered heat-transfer press temperature (320&ndash;340&deg;F) as a separate product spec. Both confirmed by our production team. No existing figure changed.
              </li>
              <li>
                <strong className="text-panda-dark">v1.3 — August 2026:</strong> added the iron-on application spec (350&deg;F / 175&deg;C, 25&ndash;30 second front press, 10 second reverse press, PVC and chenille pressed from behind only, chenille at 20&ndash;30 seconds with no adhesive spray) and care guidance, confirmed by our production team. This replaces earlier per-fabric temperature figures with the manufacturer&rsquo;s own rule.
              </li>
              <li>
                <strong className="text-panda-dark">v1.2 — July 2026:</strong> added the PVC minimum raised-element width (0.3 mm for a raised dot or line), the 2D-versus-3D mould distinction, and hybrid-design guidance. This closes the last open figure in the standard. Confirmed by our production team.
              </li>
              <li>
                <strong className="text-panda-dark">v1.1 — July 2026:</strong> corrected the embroidery minimum text height to 4 mm (was 5 mm), confirmed 75wt thread for small lettering, added the serif (8 mm) and decorative (10 mm) floors, corrected the woven color rule to a surcharge above 4 colors (was 8–10), and added UV-printed leather alongside engraving with the full leather and PVC figures. Reviewed by our digitizing team.
              </li>
              <li>
                <strong className="text-panda-dark">v1.0 — July 2026:</strong> first published edition.
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
