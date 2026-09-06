/**
 * The fee-removal hub (CL3A9B B2.2).
 *
 * TARGETS THE ABSENCE, NOT THE CATEGORY. Nobody wins "custom patches". The
 * queries this page exists for are "custom patches no setup fee", "custom
 * patches no digitizing fee", "pvc patches no mold fee", "custom patches no
 * hidden fees" — buyers searching for the removal of a charge they have already
 * been quoted somewhere else. Each one gets an exact-sentence answer with a
 * figure in it, because a figure is what survives being quoted second-hand.
 *
 * NO UNEVIDENCED COMPETITOR NUMBERS. The brief suggested competitor norms, and
 * /ai-info/pricing already carries two of them ("most competitors charge $40 to
 * $80 for setup", "most PVC manufacturers charge $80 to $150 per mold") with
 * no substantiation row behind either. Both are flagged for evidencing; neither
 * is repeated here. The one comparative on this page is the register's approved
 * wording, which says what published prices commonly exclude without asserting
 * a figure nobody has checked. A page about what WE do not charge does not need
 * a competitor to be true.
 */
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CTASection from "@/components/home/CTASection";
import {
  generateSchemaScript,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import {
  REMOVED_CHARGES,
  MIN_ORDER_PER_DESIGN,
  CONSTRAINT_HUBS,
  DIFFERENTIATORS,
  MOLD_COMPARATIVE,
  SAMPLE_COMPARATIVE,
  BENCHMARK_NOTE,
} from "@/lib/constraintsRemoved";
import { getFromPriceLabel } from "@/lib/pricingCalculator";

const CANONICAL = "https://www.pandapatches.com/custom-patches-no-setup-fees";
const UPDATED = "2026-09-07";

export const revalidate = 86400;

const faqs = [
  {
    question: "Do you charge a setup fee for custom patches?",
    answer:
      "No. Setup is $0 on every order, every patch type and every quantity, including a one-off run of five pieces. There is no per-design charge, no minimum-order fee, and no separate charge for a second or third design on the same order. The per-piece price you are quoted is the entire cost of the patches.",
  },
  {
    question: "Do PVC patches have a mold fee?",
    answer:
      "No. PVC patches need a new mold cut for each design, and that tooling is included at $0. This is usually the largest single fee a PVC buyer is quoted, and it is the reason PVC quotes elsewhere often look reasonable per piece and then arrive with a separate line item. On a small PVC run the mold charge can exceed the cost of the patches themselves.",
  },
  {
    question: "Do you charge a digitizing fee?",
    answer:
      "No. Digitizing — converting your artwork into the stitch file an embroidery machine reads — is included at $0. It is a real production step done by a person, and it is not billed to you. The same applies to the vector work behind PVC, woven and printed patches.",
  },
  {
    question: "Do you charge an art fee if my file is not print-ready?",
    answer:
      "No. Redrawing, cleaning up or rebuilding a file is included at $0, and so is designing from scratch if you have no artwork at all. Send a photograph, a sketch on paper, or a description in an email, and the design team builds it into a mockup at no cost.",
  },
  {
    question: "Are revisions to my mockup charged?",
    answer:
      "No. Revisions are unlimited and free until you approve the mockup. There is no revision cap and no charge for changing your mind about a colour, a size or the whole design. Production does not begin until you approve in writing, so nothing is manufactured against a design you are not happy with.",
  },
  {
    question: "Is there a charge for the mockup itself?",
    answer:
      "No. The digital mockup is $0 and arrives within 12 to 24 hours, at every order size, with unlimited free revisions. This one is worth checking on any quote you compare: proof fees are real in this industry. One large US patch supplier publishes a $19.99 charge for a proof on orders under $300, free only above that, which means a small buyer either pays to see their design or sends it to production unseen. Ours is free at five pieces and at five thousand.",
  },
  {
    question: "Do you charge for shipping?",
    answer:
      "No. Free worldwide shipping is included on every order, at every quantity and to every destination, including a 5-piece order. Orders ship delivered duty paid, so there is nothing to pay a courier on arrival either.",
  },
  {
    question: "What is the minimum order if there are no setup fees?",
    answer: `${MIN_ORDER_PER_DESIGN} Setup being free is what makes a small run viable at all: when a supplier charges $50 to set up a design, a 5-piece order carries that $50 across five patches, which is why most suppliers set a minimum high enough to bury it.`,
  },
  {
    question: "Are there any fees at all beyond the per-piece price?",
    answer:
      "Velcro backing is charged separately, at $0.35 per piece, and rush production is charged at 25% of the order total with a $50 minimum, refunded if we miss the date we confirm. Those two are the complete list, they are both shown in the calculator before you order, and everything else on this page is $0.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches With No Setup Fees | No Mold or Art Fees",
  description:
    "No setup, digitizing, mold, art, revision or mockup fees on custom patches, at any quantity. 5 pieces per design minimum, free worldwide shipping delivered duty paid. See exactly what is and is not charged.",
  url: CANONICAL,
  ogTitle: "Custom Patches With No Setup Fees, No Mold Fees, No Art Fees",
  ogDescription:
    "Setup $0, digitizing $0, mold $0 on PVC, art $0, revisions $0, mockup $0, shipping $0, duties $0. The per-piece price is the whole price.",
});

const articleSchema = generateArticleSchema({
  title: "Custom Patches With No Setup Fees: What Is and Is Not Charged",
  description:
    "A complete account of every charge Panda Patches does not apply to a custom patch order, including setup, digitizing, PVC mold tooling, artwork, revisions, mockups, shipping and import duties.",
  datePublished: "2026-09-07",
  dateModified: UPDATED,
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "No Setup Fees", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function NoSetupFeesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />
      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="No Setup Fees"
      />

      {/* ANSWER FIRST. The first paragraph has to stand alone as a quotation,
          because that is the unit an assistant lifts. */}
      <section className="w-full pt-8 md:pt-12 pb-8 bg-white">
        <div className="container mx-auto px-6 max-w-[56.25rem]">
          <p className="text-[0.6875rem] md:text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-4">
            What we don&rsquo;t charge for
          </p>
          <h1 className="text-[1.875rem] md:text-[2.625rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
            Custom patches with no setup fees
          </h1>
          <p className="text-[1rem] md:text-[1.1875rem] text-gray-700 leading-[1.75] mb-6 max-w-[45rem]">
            Panda Patches charges <strong>no setup fee, no digitizing fee, no mold fee on PVC, no
            art fee, no revision fee and no mockup fee</strong>, at any quantity including a run of
            five. Free worldwide shipping is included and orders arrive delivered duty paid, so
            nothing is owed on delivery. The per-piece price you are quoted is the entire cost of
            the patches. {MIN_ORDER_PER_DESIGN}
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white mb-4">
            <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse min-w-[26.25rem]">
              <thead>
                <tr className="border-b-2 border-panda-dark text-left">
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Charge
                  </th>
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Ours
                  </th>
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    What it covers
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {REMOVED_CHARGES.map((c) => (
                  <tr key={c.label} className="border-b border-gray-100 last:border-0">
                    <th scope="row" className="py-3 px-4 font-bold text-panda-dark text-left whitespace-nowrap">
                      {c.label}
                      {c.scope && <span className="block text-[0.75rem] font-medium text-gray-500">{c.scope}</span>}
                    </th>
                    <td className="py-3 px-4 font-black text-panda-dark tabular-nums">{c.amount}</td>
                    <td className="py-3 px-4 leading-[1.6]">{c.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[0.8125rem] text-gray-500 mb-8">
            The two things that <em>are</em> charged separately: Velcro backing at $0.35 per piece,
            and rush production at 25% of the order total with a $50 minimum, refunded if we miss
            the date we confirm. Both are shown in the calculator before you order.
          </p>

          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3">
            Why a setup fee decides your minimum
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            The two charges are the same problem wearing different clothes. A supplier who bills,
            say, $50 to set up a design has to spread it across the run: on 500 pieces it disappears
            into the rounding, on five it is $10 a patch. So the minimum goes up until the fee stops
            being visible. That is why so much of this industry starts at 50 or 100 pieces, and it
            is why removing the fee is what actually makes a five-piece order possible rather than
            merely advertised.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            The same logic runs through PVC and its mold. A mold is cut for each new design, and
            on a small PVC order that tooling can cost more than the patches. Included, it stops
            being a reason to over-order.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            The proof is the one people forget to check. Seeing your design before it is
            manufactured reads like a basic courtesy rather than a line item, and it is not always
            free: one large US patch supplier publishes a $19.99 proof charge on orders under $300,
            waived above it. That is the wrong way round, because the buyer ordering ten patches is
            the one who most needs to see it first. Ours is free at every size, with unlimited
            revisions, and production does not start until you approve.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-8">
            Our published from-prices already include shipping and a standard backing —
            embroidered from {getFromPriceLabel("Custom Embroidered Patches")} and PVC from{" "}
            {getFromPriceLabel("Custom PVC Patches")} per piece at 2 by 2 inches and 1,000 pieces,
            with smaller orders costing more per piece.
          </p>

          {/* THE HONEST VERSION OF THIS PAGE'S ARGUMENT. We benchmarked 14
              published US suppliers in September 2026 and it did not say what we
              expected: free setup and free artwork are the industry norm, not our
              edge. Saying so costs us a talking point and buys the rest of the
              page its credibility, and the things that DO differ are stronger
              than the one we were leaning on. */}
          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3">
            Where we are genuinely different, and where we are not
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-5">
            We benchmarked fourteen published US patch suppliers in September 2026, quoting their
            own public pages. It is worth reporting the part that went against us: <strong>free
            setup and free artwork are the norm, not a differentiator</strong>. None of the
            fourteen publishes a setup charge, seven state it is free, and nine include artwork.
            Our $0 on both is true and it is unremarkable. What follows is what actually differs.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white mb-4">
            <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse min-w-[30rem]">
              <thead>
                <tr className="border-b-2 border-panda-dark text-left">
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Panda Patches
                  </th>
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    What competitors publish
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {DIFFERENTIATORS.map((d) => (
                  <tr key={d.ours} className="border-b border-gray-100 last:border-0">
                    <th scope="row" className="py-3 px-4 font-bold text-panda-dark text-left align-top">
                      {d.ours}
                    </th>
                    <td className="py-3 px-4 leading-[1.6]">{d.theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            {MOLD_COMPARATIVE}
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-3">
            {SAMPLE_COMPARATIVE}
          </p>
          <p className="text-[0.8125rem] text-gray-500 mb-8">
            {BENCHMARK_NOTE} Suppliers change their pricing without telling us, so every figure here
            is re-checked at least every six months.
          </p>

          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-4">
            Questions about fees
          </h2>
          <div className="space-y-5">
            {faqs.map((f) => (
              <div key={f.question}>
                <h3 className="text-[1rem] md:text-[1.125rem] font-black text-panda-dark mb-1.5">
                  {f.question}
                </h3>
                <p className="text-[0.9375rem] text-gray-700 leading-[1.75]">{f.answer}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[0.9375rem] text-gray-700 leading-[1.8]">
            Related:{" "}
            <Link href={CONSTRAINT_HUBS.minimum} className="text-panda-green font-semibold underline">
              custom patches with no minimum order
            </Link>
            ,{" "}
            <Link href={CONSTRAINT_HUBS.shipping} className="text-panda-green font-semibold underline">
              free worldwide shipping delivered duty paid
            </Link>
            , and the{" "}
            <Link href="/how-much-do-custom-patches-cost-full-pricing-breakdown" className="text-panda-green font-semibold underline">
              full pricing breakdown by type and quantity
            </Link>
            .
          </p>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
