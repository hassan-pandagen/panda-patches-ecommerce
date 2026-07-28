import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { generateSchemaScript, ORG_ID } from "@/lib/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "The Panda Patches Digitizing & Design Team",
    description:
      "How the Panda Patches in-house digitizing and design team turns your artwork into a production-ready patch: file prep, a digital mockup in 12-24 hours, unlimited revisions, and a 5-point quality inspection before anything ships.",
    url: `${SITE_URL}/about/digitizing-team`,
    ogDescription:
      "In-house digitizing and design: artwork to production file, mockup in 12-24 hours, unlimited revisions, 5-point QC before shipping.",
  });
}

// AboutPage referencing the OnlineStore entity by @id (Appendix B3). Describes
// the process and team capability; no individual names required.
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "The Panda Patches Digitizing & Design Team",
  url: `${SITE_URL}/about/digitizing-team`,
  about: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
};

const STEPS = [
  {
    n: "1",
    h: "You send artwork — in any state",
    p: "Vector files (AI, EPS, PDF, SVG) reproduce sharpest, but we also accept raster (PNG, JPG, TIFF) and even hand-drawn sketches or photos. No artwork yet? Describe the idea and the design team drafts it for you at no charge.",
  },
  {
    n: "2",
    h: "We digitize it into a production file",
    p: "Digitizing is the craft of translating your art into the instructions a machine follows &mdash; stitch paths and density for embroidery, mold geometry for PVC, weave structure for woven. This step decides whether small text stays legible and fine lines survive; it is done by hand, not auto-generated.",
  },
  {
    n: "3",
    h: "You get a digital mockup in 12–24 hours",
    p: "A full-color rendering of the actual patch at the actual size, showing thread or material colors, border style, and backing. Pantone references are matched to the closest production color so what you approve is what you receive.",
  },
  {
    n: "4",
    h: "Unlimited free revisions until you approve",
    p: "Adjust colors, resize, swap fonts, refine detail &mdash; as many rounds as it takes. Production does not begin until you give written approval of the final mockup.",
  },
  {
    n: "5",
    h: "Production, then a 5-point quality inspection",
    p: "Every finished order is checked for stitching, color accuracy, backing integrity, size accuracy, and overall appearance before it leaves the facility. Because design, production, and QC report to the same operations team, the patch you approved is the patch that ships.",
  },
];

export default function DigitizingTeamPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(pageSchema)} />

      <Navbar />

      <article className="max-w-[52.5rem] mx-auto px-6 py-16 md:py-20">
        <h1 className="text-[2rem] md:text-[2.75rem] font-black text-panda-dark leading-tight tracking-tight mb-4">
          The Digitizing &amp; Design Team
        </h1>
        <p className="text-[1.0625rem] text-gray-600 leading-[1.8] mb-10">
          A custom patch is only as good as the file behind it. Panda Patches keeps digitizing and design in-house so the
          people preparing your artwork answer to the same operations team that produces and inspects it &mdash; not a
          third-party broker. Here is exactly how a design becomes a finished patch.
        </p>

        <div className="space-y-8">
          {STEPS.map((s) => (
            <section key={s.n} className="flex gap-5">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-panda-green text-white font-black text-[1.125rem] flex items-center justify-center">
                {s.n}
              </div>
              <div>
                <h2 className="text-[1.375rem] font-black text-panda-dark mb-2" dangerouslySetInnerHTML={{ __html: s.h }} />
                <p className="text-[1rem] text-gray-700 leading-[1.8]" dangerouslySetInnerHTML={{ __html: s.p }} />
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-[1.625rem] font-black text-panda-dark mb-3">Where to go next</h2>
          <p className="text-[1rem] text-gray-700 leading-[1.8]">
            See what the team can and cannot reproduce in the{" "}
            <Link href="/patch-manufacturability-specs" prefetch={false} className="text-panda-green font-semibold underline">
              manufacturability specifications
            </Link>
            , read about founder{" "}
            <Link href="/about/imran-raza" prefetch={false} className="text-panda-green font-semibold underline">
              Imran Raza
            </Link>
            , or review our{" "}
            <Link href="/ai-info/specs-and-care" prefetch={false} className="text-panda-green font-semibold underline">
              specs and care details
            </Link>
            .
          </p>
        </section>
      </article>

      <CTASection />
      <Footer />
    </main>
  );
}
