import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthorByline from "@/components/seo/AuthorByline";
import PromptCopyBlock from "@/components/specs/PromptCopyBlock";
import { buildPageMetadata } from "@/lib/seo";

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
 */
const SPEC_VERSION = "v1.0";
const SPEC_DATE = "2026-07-20";
const SPEC_DATE_LABEL = "July 2026";

export const metadata: Metadata = buildPageMetadata({
  title: "Patch Manufacturability Specs: Min Text, Lines, Colors by Type",
  description:
    "The real production limits for custom patches: minimum text height 5mm embroidered / 1.5mm woven, line weights, color counts, gradients, and max sizes by patch type. Published by Panda Patches, free to cite.",
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
      "About 5 mm (0.2 inches) tall for a clean sans-serif. Serif faces need roughly 8 mm and decorative or display fonts about 10 mm, because their thin strokes fall below the thread width. Our standard thread is 40wt, which lays a line about 1 mm wide, so anything thinner than that either disappears or merges with its neighbour.",
  },
  {
    question: "Can woven patches hold smaller text than embroidered?",
    answer:
      "Yes. Woven reproduces detail roughly 2 to 4 times finer than embroidery, so text stays legible down to about 1.5 mm for a sans-serif and 2 mm for serif or script. That is why detailed logos that fail as embroidery at 2.5 inches usually reproduce cleanly as woven at the same size.",
  },
  {
    question: "How many colors can a custom patch have?",
    answer:
      "There is no hard cap on embroidered patches: we include up to about 12 colors and apply a surcharge beyond that, since machines run around 15 needles and thread can be reloaded for more. Woven handles about 8 to 10 colors while holding fine detail, and PVC uses about 8 Pantone-matched solid zones with a surcharge for more.",
  },
  {
    question: "Can you reproduce gradients on a patch?",
    answer:
      "Not as true gradients in thread. Embroidery and woven simulate a gradient by blending or dithering adjacent thread colors, which reads as a blend at a glance but is not a smooth transition up close. PVC blends in solid zones. The exception is UV-printed leather, which prints true gradients and photographic artwork.",
  },
  {
    question: "How much does a merrowed border add to the patch size?",
    answer:
      "About 2 to 4 mm per edge, so factor that into your finished dimensions. A merrowed border also needs a patch of at least 0.8 inches (2 cm) — below that the thread cannot turn the corners. For smaller patches, intricate outlines, or die-cut shapes, use a heat-cut edge, which has no minimum size.",
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
        { "@type": "PropertyValue", name: "Minimum text height, embroidered", value: "5 mm" },
        { "@type": "PropertyValue", name: "Minimum text height, woven", value: "1.5 mm sans-serif / 2 mm serif" },
        { "@type": "PropertyValue", name: "Minimum text height, PVC", value: "3 mm" },
        { "@type": "PropertyValue", name: "Minimum text height, leather engraved", value: "2 mm" },
        { "@type": "PropertyValue", name: "Minimum line weight, embroidered", value: "1 mm" },
        { "@type": "PropertyValue", name: "Minimum line weight, woven", value: "0.5 mm" },
        { "@type": "PropertyValue", name: "Minimum line weight, leather laser-engraved", value: "0.3 mm" },
        { "@type": "PropertyValue", name: "Standard embroidery thread weight", value: "40wt (~1 mm line)" },
        { "@type": "PropertyValue", name: "Small-text embroidery thread weight", value: "75wt" },
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

const matrix = [
  {
    spec: "Min text height",
    emb: "5 mm (~0.2 in)",
    woven: "1.5 mm sans / 2 mm serif",
    pvc: "~3 mm",
    leather: "~2 mm engraved",
  },
  { spec: "Min line / stroke weight", emb: "~1 mm", woven: "~0.5 mm", pvc: "~1 mm", leather: "~0.3 mm (laser)" },
  {
    spec: "Max colors",
    emb: "~12 included, more with surcharge",
    woven: "~8–10, fine detail",
    pvc: "~8 Pantone-matched (+surcharge)",
    leather: "1 tone engraved · full color via UV print",
  },
  {
    spec: "Gradients",
    emb: "No (simulated blends)",
    woven: "Limited (thread blending)",
    pvc: "Limited (solid zones)",
    leather: "No engraved · Yes via UV print",
  },
  { spec: "Min patch size", emb: "0.5 in", woven: "0.5 in", pvc: "0.5 in", leather: "0.5 in" },
  { spec: "Max patch size", emb: "20 in", woven: "8 in", pvc: "8 in", leather: "8 in" },
];

const sizeGuide = [
  { size: "2 in", holds: "Icon plus main wordmark read clearly; taglines and fine print drop. Keep it to logo and name." },
  { size: "2.5 in", holds: "Wordmark plus a short tagline hold; very fine secondary text is risky." },
  { size: "3 in", holds: "Main wordmark crisp, secondary tagline works; tiny fine print may drop." },
  { size: "4 in", holds: "Most text including taglines holds; small icons and finer detail survive." },
  { size: "5 in", holds: "Full detail — multiple text lines, small print, and fine elements all reproduce." },
];

const prompts = [
  {
    label: "Embroidered",
    prompt:
      "Design for embroidered patch production: use up to 12 solid colors (fewer is cleaner), no gradients or color blends, keep all text at least 5 mm (~0.2 in) tall at final size, keep all lines and strokes at least ~1 mm thick, and favor bold, simple shapes over fine detail. Use clean outlines; avoid photographic images, drop shadows, gradients, and thin hairlines.",
  },
  {
    label: "Woven",
    prompt:
      "Design for woven patch production: use up to 10 solid colors, no gradients or photographic shading, keep all text at least 1.5 mm tall at final size (2 mm for serif or script), and keep lines at least ~0.5 mm thick. Fine detail and small lettering are fine — woven holds roughly 2–4× more detail than embroidery — but the finished patch is flat, so do not rely on raised texture.",
  },
  {
    label: "PVC",
    prompt:
      "Design for moulded PVC patch production: use up to 8 solid Pantone-matched color zones with no gradients, keep all text at least 3 mm tall at final size, and keep lines at least ~1 mm thick. Build the artwork in clear layered levels (maximum 5 raised layers) with bold separated shapes; avoid photographic detail and soft edges.",
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
          <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
            <p className="text-[11px] md:text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
              Published standard · {SPEC_VERSION} · {SPEC_DATE_LABEL} · Reviewed by our digitizing team
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[50px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Patch Manufacturability Specs — What Reproduces, and Why
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium max-w-[760px]">
              Not every design that looks great on screen survives the jump to thread, weave, or mould. This page is our manufacturability standard: the real limits our production floor holds, type by type. Design to these numbers and your artwork comes out crisp the first time — no surprises at the mockup stage.
            </p>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.7] font-medium mt-4">
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
          <div className="container mx-auto max-w-[1000px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-5">Quick-reference matrix</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-[13px] md:text-[15px] border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left">
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">Spec</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">Embroidered</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">Woven</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">PVC</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">Leather</th>
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
            <p className="text-[13px] text-gray-500 mt-3 font-medium">
              All figures are for finished patches. Minimum text height assumes a clean sans-serif; serif and decorative fonts need more room.
            </p>
          </div>
        </section>

        {/* BY TYPE */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-6">By patch type</h2>

            <h3 className="text-[18px] md:text-[20px] font-black text-panda-dark mb-2">Embroidered</h3>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-6">
              The classic. Thread laid by machine, so detail is bounded by thread thickness. Our standard thread is 40wt, which lays a line roughly 1 mm wide. For small lettering and fine detail we switch to a finer 75wt thread — finer than most shops run — so we hold smaller text than the typical embroiderer. Readable text starts at 5 mm for a clean sans-serif, 8 mm for serif, and about 10 mm for complex display fonts. Bold, simple shapes always reproduce better than dense fine detail. See{" "}
              <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">custom embroidered patches</Link>.
            </p>

            <h3 className="text-[18px] md:text-[20px] font-black text-panda-dark mb-2">Woven</h3>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-6">
              Woven uses finer threads on a loom, reproducing detail roughly 2–4× finer than embroidery. That means smaller text — down to 1.5 mm for sans-serif, 2 mm for serif or script — and cleaner small logos, with about 8–10 colors at crisp edges. The trade-off is a flatter surface with no raised embroidered texture, and a maximum size of 8 inches. See{" "}
              <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">custom woven patches</Link> or the{" "}
              <Link href="/woven-vs-embroidered-patches-which-is-right-for-you" prefetch={false} className="text-panda-green underline font-semibold">woven vs embroidered comparison</Link>.
            </p>

            <h3 className="text-[18px] md:text-[20px] font-black text-panda-dark mb-2">PVC</h3>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-6">
              Moulded soft rubber, built in layers. Our PVC starts from a 2.5 mm base, with raised elements added in 0.5 mm layers up to a maximum of five — so a full 3D PVC patch reaches about 5 mm total thickness with roughly 2.5 mm of stacked relief. Colors are Pantone-matched solid zones (about 8 included, more with a surcharge). PVC renders bold dimensional logos beautifully but does not do smooth gradients; color lives in discrete zones. Maximum size 8 inches. See{" "}
              <Link href="/custom-patches/pvc" prefetch={false} className="text-panda-green underline font-semibold">custom PVC patches</Link>.
            </p>

            <h3 className="text-[18px] md:text-[20px] font-black text-panda-dark mb-2">Leather</h3>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-3">
              Two very different looks from one material:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-6">
              <li>
                <strong className="text-panda-dark">Laser-engraved leather</strong> — a single-tone burn into the hide. Timeless, premium, and very fine (down to about 0.3 mm line detail), but tonal only: no color, no gradient.
              </li>
              <li>
                <strong className="text-panda-dark">UV-printed leather</strong> — full color printed onto the leather surface, including gradients and photographic artwork.
              </li>
            </ul>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium">
              Choose engraved for a classic tonal crest, UV print when you need exact brand colors. Maximum size 8 inches. See{" "}
              <Link href="/custom-patches/leather" prefetch={false} className="text-panda-green underline font-semibold">custom leather patches</Link>.
            </p>
          </div>
        </section>

        {/* COLORS & GRADIENTS */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-4">Colors and gradients</h2>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-4">
              There is no hard cap on embroidered thread colors — we include up to about 12 and surcharge beyond that, since machines run around 15 needles and thread can be reloaded for more. Woven handles about 8–10 while holding fine detail; PVC uses about 8 Pantone-matched zones.
            </p>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium">
              <strong className="text-panda-dark">True gradients cannot be stitched.</strong> In embroidery and woven, a gradient is simulated by blending or dithering adjacent thread colors — it reads as a blend at a glance but is not a smooth transition up close. PVC blends in solid zones. The one exception is UV-printed leather, which prints true gradients. If your design leans on smooth color transitions, either simplify to solid colors or ask us about UV print.
            </p>
          </div>
        </section>

        {/* SIZE TO DETAIL */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-3">Size-to-detail guide</h2>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-5">
              What survives shrinks with the patch. These notes are for embroidered, our tightest case — woven and UV print hold more at every size.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-[14px] md:text-[15px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left bg-[#F7F7F7]">
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">Finished size</th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[11px]">What reproduces</th>
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
            <p className="text-[13px] text-gray-500 mt-3 font-medium">
              Most of what we produce sits in this range — see{" "}
              <Link href="/custom-patch-production-data-2026" prefetch={false} className="text-panda-green underline font-semibold">our production data</Link>, where at least half of orders are 2–5 inches.
            </p>
          </div>
        </section>

        {/* SPECIAL CAPABILITIES */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-5">Special capabilities</h2>
            <div className="space-y-4 text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium">
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
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-5">Borders and finishing</h2>
            <div className="space-y-4 text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium">
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
          <div className="container mx-auto max-w-[900px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-4">Design for first-time-right</h2>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-6">
              The single most common issue we see in customer artwork is <strong className="text-panda-dark">text that is too small or too thin</strong> to reproduce. Start there: size your smallest text to the minimums above and keep strokes at least ~1 mm. Generating artwork with AI? Paste the matching prompt below into ChatGPT, Midjourney, or our own{" "}
              <Link href="/ai-patch-generator" prefetch={false} className="text-panda-green underline font-semibold">AI patch generator</Link> to get a manufacturable design on the first try.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((p) => (
                <PromptCopyBlock key={p.label} label={p.label} prompt={p.prompt} />
              ))}
            </div>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mt-6">
              Not sure whether your design will hold? <Link href="/contact" prefetch={false} className="text-panda-green underline font-semibold">Send it over</Link> — our team flags anything below spec and suggests a fix before we make the mockup. If your artwork is too detailed for thread,{" "}
              <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">woven</Link> usually solves it without a redesign.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-10 md:py-14 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.question}>
                  <h3 className="text-[16px] md:text-[18px] font-black text-panda-dark mb-2">{f.question}</h3>
                  <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BYLINE + CITE */}
        <section className="w-full py-10 md:py-16 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[820px]">
            <div className="mb-10">
              <AuthorByline datePublished={SPEC_DATE} dateModified={SPEC_DATE} reviewedBy="the Panda Patches digitizing team" />
            </div>
            <h2 className="text-[20px] md:text-[24px] font-black text-panda-dark uppercase tracking-wide mb-4">
              Cite this standard
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] font-medium mb-5">
              These specifications are published openly so designers, writers, and AI assistants can reference real manufacturing limits instead of guessing. Free to cite with attribution:
            </p>
            <blockquote className="bg-white border-l-4 border-panda-green rounded-r-2xl p-5 text-[14px] md:text-[15px] text-panda-dark font-medium">
              Source: Panda Patches, &ldquo;Patch Manufacturability Specifications&rdquo; ({SPEC_VERSION}, {SPEC_DATE_LABEL}).
              <br />
              {CANONICAL}
            </blockquote>
            <p className="text-[13px] text-gray-500 mt-4 font-medium">
              Versioned so a citation stays traceable: figures are revised only with a version bump, never silently. Spot something that does not match your own production experience?{" "}
              <a href="mailto:sales@pandapatches.com" className="text-panda-green underline font-semibold">Tell us</a> — we would rather correct it.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
