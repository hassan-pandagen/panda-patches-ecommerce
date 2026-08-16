import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TrustStrip from "@/components/products/TrustStrip";
import BulkQuoteForm from "@/components/bulk/BulkQuoteForm";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import MakerNote from "@/components/seo/MakerNote";
import {
  generateSchemaScript,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateEventPatchesServiceSchema,
} from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { caseStudies } from "@/lib/caseStudies";

/**
 * /event-patches — hub for the agency / event-planner buyer.
 *
 * TRUTH RULE FOR THIS PAGE (CL9BCF_1 item 3): every number and every named
 * client is sourced from a PUBLISHED case study. Nothing here is a new claim.
 * The three activations are pulled from `caseStudies` at build time rather than
 * retyped, so if a case study's stats are ever corrected this page follows and
 * cannot drift into stating something the source no longer says.
 *
 * NAMING: Wise and Karbach are named because their case studies name them, with
 * written permission on file (see GSC/CLAIMS-REGISTER.md). The Nashville client
 * is NOT named and must never be — Version B is a contractual condition, and the
 * end brand is referred to only as "a national snack brand". Do not "improve"
 * that phrasing.
 */

const SLUGS = [
  "wise-nasdaq-times-square-activation",
  "nashville-event-patches-2026",
  "karbach-brewing-patches",
] as const;

const activations = SLUGS.map((slug) => {
  const cs = caseStudies.find((c) => c.slug === slug && c.published);
  if (!cs) return null;
  return {
    slug: cs.slug,
    cardTitle: cs.cardTitle,
    client: cs.client,
    event: cs.event,
    location: cs.location,
    stats: cs.stats,
  };
}).filter((a): a is NonNullable<typeof a> => a !== null);

const eventFAQs = [
  {
    question: "Can custom patches be used as an activity at an event?",
    answer:
      "Yes, and it is the most common reason event teams order them. Patches with adhesive peel-and-stick backing need no iron, no heat and no sewing, so guests apply them themselves at a patch bar, onto hats, tote bags, denim or lanyards. For a Nashville activation Panda Patches produced 1,500 woven patches across 10 designs with peel-and-stick backing so the event team could hand them out without any application step. For Karbach Brewing's Los Angeles event, guests used the patches to customise their own hats. Ordering several designs rather than one is what makes it an activity: guests choose, rather than receive.",
  },
  {
    question: "How many different patch designs can be produced for one event?",
    answer:
      "There is no fixed cap, and multi-design runs are routine. Published examples: 16 designs for Wise's Nasdaq Times Square listing activation, 10 designs for a national snack brand's Nashville activation, and 6 designs for Karbach Brewing. Every design is produced, counted and bagged separately, so the event team can distribute them without sorting on site. Each design gets its own digital mockup for written approval before anything is produced.",
  },
  {
    question: "How far in advance should event patches be ordered?",
    answer:
      "Earlier is safer, but the honest answer is that the deadline matters more than the lead time. Panda Patches confirms your exact in-hand date by email within 2 to 6 hours of ordering, before any rush fee is charged — if the date cannot be met, the rush fee is removed. Published turnarounds: 1,200 patches shipped 5 days after mockup approval and signed for a day before the event, and 1,500 patches across 10 designs delivered 9 business days from approval, more than 24 hours ahead of the deadline.",
  },
  {
    question: "What happens if an event order is too large to ship in one go?",
    answer:
      "Large or complex rush orders split-ship. The first batch arrives in as fast as 5 business days and the remainder follows in 8 to 11 business days, so the most time-critical pieces still make the date. For Wise's Nasdaq activation, 9,600 woven patches across 16 designs were delivered in two shipments on May 4 and May 7, both on the contractual dates, with every design approved before production.",
  },
  {
    question: "What patch type works best for event giveaways?",
    answer:
      "Woven is the usual answer for event work, because it holds fine slogan text at around 3 inches where embroidery thread would blur it — all 1,500 Nashville patches and all 9,600 Wise patches were woven. Leather suits premium or hat-focused activations and was used alongside woven for Karbach Brewing. Backing is the more important decision than the material: adhesive peel-and-stick for guest-applied giveaways, iron-on for merchandise the recipient keeps and applies at home.",
  },
  {
    question: "Do you work with agencies running activations for a client brand?",
    answer:
      "Yes. Agency-run activations are a regular part of this work, including cases where the end brand cannot be named publicly. One of the activations referenced on this page was produced for a New York creative agency on behalf of a national snack brand, and that brand is not named anywhere on this site because naming approval was not granted. Confidentiality on the end client is respected as a default, not as an exception.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches for Brand Activations & Events | Panda Patches",
  description:
    "Custom patches for brand activations, trade shows and events — patch bars, hat customisation and tote decorating. Multi-design runs bagged per design, peel-and-stick backing, exact in-hand date confirmed within 2-6 hours.",
  url: "https://www.pandapatches.com/event-patches",
  ogTitle: "Custom Patches for Brand Activations & Events",
  ogDescription:
    "9,600 patches across 16 designs for a Nasdaq activation. 1,500 across 10 designs delivered a day early. Multi-design event runs, counted and bagged per design.",
});

export default function EventPatchesPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.pandapatches.com" },
    { name: "Event & Activation Patches", url: "https://www.pandapatches.com/event-patches" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateEventPatchesServiceSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(eventFAQs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateBreadcrumbSchema(breadcrumbs))} />

      <Navbar />
      <main id="main-content" className="min-h-screen bg-white">
        <div className="container mx-auto px-4 md:px-6 pt-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }]} currentPage="Event & Activation Patches" />
        </div>

        {/* HERO */}
        <section className="w-full pt-6 md:pt-10 pb-10 md:pb-14">
          <div className="container mx-auto px-4 md:px-6 max-w-[56rem] text-center">
            <p className="text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-3">
              Brand Activations &middot; Trade Shows &middot; Events
            </p>
            <h1 className="text-[2rem] md:text-[3rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Custom Patches for Brand Activations &amp; Events
            </h1>
            <p className="text-[1rem] md:text-[1.125rem] text-gray-600 leading-[1.7] max-w-[44rem] mx-auto mb-7">
              The patches are not the giveaway. They are the activity. Guests pick a design and
              apply it themselves — to a hat, a tote, a jacket — and walk away wearing something
              they made. That only works if the patches arrive on the right day, in the right
              counts, ready to hand out.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="#quote" className="bg-panda-dark text-panda-yellow font-black text-[0.9375rem] px-8 py-3.5 rounded-full uppercase tracking-wider hover:scale-105 transition-transform">
                Get an event quote
              </Link>
              <Link href="/case-studies" className="border border-gray-300 text-panda-dark font-black text-[0.9375rem] px-8 py-3.5 rounded-full hover:border-panda-dark transition-colors">
                See the case studies
              </Link>
            </div>
          </div>
        </section>

        <TrustStrip />

        {/* THE THREE ACTIVATIONS — every figure from a published case study */}
        <section className="w-full py-12 md:py-16 bg-[#F9FAF5]">
          <div className="container mx-auto px-4 md:px-6 max-w-[62.5rem]">
            <h2 className="text-[1.5rem] md:text-[2.125rem] font-black text-panda-dark text-center mb-3">
              Three activations we have already delivered
            </h2>
            <p className="text-[0.9375rem] text-gray-600 text-center max-w-[42rem] mx-auto mb-10">
              Each of these is a full case study with dates, quantities and a delivery record.
              Nothing on this page is a claim we have not already written up in detail.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              {activations.map((a) => (
                <Link
                  key={a.slug}
                  href={`/case-studies/${a.slug}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-6 hover:border-panda-green transition-colors"
                >
                  <h3 className="text-[1rem] font-black text-panda-dark leading-snug mb-3">
                    {a.cardTitle}
                  </h3>
                  <dl className="space-y-1.5 mb-4">
                    {a.stats.map((s) => (
                      <div key={s.label} className="flex items-baseline gap-2">
                        <dt className="text-[1.125rem] font-black text-panda-dark leading-none">{s.value}</dt>
                        <dd className="text-[0.75rem] text-gray-500 leading-tight">{s.label}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="text-[0.8125rem] text-panda-green font-bold underline">Read the case study</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* THE ACTIVITY — peel-and-stick explainer */}
        <section className="w-full py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-[52rem]">
            <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
            <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-4">
              Peel-and-stick is what turns a patch into an activity
            </h2>
            <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
              Adhesive peel-and-stick backing needs no iron, no heat press and no sewing. A guest
              takes the patch off its liner and presses it on. That is the whole interaction, and
              it is why patch bars, hat-customisation stations and tote-decorating tables work at
              all — the activity has to survive being run by whoever is staffing the booth.
            </p>
            <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
              The Nashville activation used exactly this: 1,500 woven patches with adhesive
              peel-and-stick backing, so the event team could distribute them with no application
              step at all. At Karbach Brewing&apos;s Los Angeles event, guests used their patches to
              customise their own hats.
            </p>
            <p className="text-[1rem] text-gray-700 leading-[1.8]">
              Choose iron-on instead when the patch is merchandise the guest takes home and applies
              later. Choose peel-and-stick when application happens at the event, in front of you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/adhesive-patches" className="text-panda-green font-semibold underline text-[0.9375rem]">
                Adhesive peel-and-stick backing
              </Link>
              <span className="text-gray-300">&middot;</span>
              <Link href="/custom-patches/backing-options" className="text-panda-green font-semibold underline text-[0.9375rem]">
                Compare every backing
              </Link>
            </div>
          </div>
        </section>

        {/* MULTI-DESIGN HANDLING */}
        <section className="w-full py-12 md:py-16 bg-[#F9FAF5]">
          <div className="container mx-auto px-4 md:px-6 max-w-[52rem]">
            <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
            <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-4">
              Many designs, counted and bagged separately
            </h2>
            <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
              An activation is rarely one design. It is a set — slogans, colourways, a logo mark,
              something for the staff. Every design is produced, counted and bagged on its own, so
              nobody is sorting patches into piles on the morning of the event.
            </p>
            <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
              Published multi-design runs: <strong>16 designs</strong> for Wise&apos;s Nasdaq Times
              Square listing activation, <strong>10 designs</strong> for a national snack
              brand&apos;s Nashville activation, and <strong>6 designs</strong> for Karbach Brewing.
              Each design gets its own digital mockup, and production starts only after written
              approval on every one.
            </p>
            <p className="text-[1rem] text-gray-700 leading-[1.8]">
              Mockups arrive in 12 to 24 hours. On a fixed-date job the mockup round is where the
              schedule is usually lost, so approving the full set quickly is what protects the
              timeline more than anything that happens in production.
            </p>
          </div>
        </section>

        {/* THE DATE */}
        <section className="w-full py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-[52rem]">
            <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
            <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-4">
              You get the in-hand date in writing, before you pay a rush fee
            </h2>
            <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
              Within 2 to 6 hours of ordering we confirm your exact in-hand date by email. If we
              cannot hit your deadline, we remove the rush fee. An event date does not move, so the
              only useful answer is a committed one.
            </p>
            <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
              Rush turnaround is as fast as <strong>5 business days</strong> in hand, depending on
              quantity and patch type. Large or complex rush orders split-ship: the first batch
              lands in as fast as 5 business days and the remainder follows in 8 to 11 business
              days, so the most time-critical pieces still make the date. Wise&apos;s 9,600 patches
              were delivered that way, in two shipments on May 4 and May 7, both on the contractual
              dates.
            </p>
            <p className="text-[1rem] text-gray-700 leading-[1.8]">
              For reference on the tighter end: Karbach&apos;s 1,200 patches shipped 5 days after
              mockup approval and were signed for a day before the event, and the Nashville order
              ran 9 business days from approval and landed more than 24 hours early.
            </p>
            <div className="mt-6">
              <Link href="/rush-custom-patches" className="text-panda-green font-semibold underline text-[0.9375rem]">
                Rush custom patches: timings, fees and recent rush orders
              </Link>
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section id="quote" className="w-full py-12 md:py-16 bg-[#F9FAF5] scroll-mt-24">
          <div className="container mx-auto px-4 md:px-6 max-w-[46rem]">
            <h2 className="text-[1.5rem] md:text-[2.125rem] font-black text-panda-dark text-center mb-3">
              Tell us your event date
            </h2>
            <p className="text-[0.9375rem] text-gray-600 text-center max-w-[38rem] mx-auto mb-8">
              Include the date and roughly how many designs you are thinking about. You will get
              your exact in-hand date back by email within 2 to 6 hours.
            </p>
            <BulkQuoteForm formName="event_quote" contentName="Event Patch Quote Request" />
          </div>
        </section>

        <CategoryFAQ title="Event &amp; Activation Patch FAQ" faqs={eventFAQs} />

        <MakerNote intro="Event work is judged on one thing: whether the boxes are there on the day. That is why the in-hand date is confirmed in writing before any rush fee is charged, and why every design is counted and bagged on its own before it ships." />
      </main>
      <Footer />
    </>
  );
}
