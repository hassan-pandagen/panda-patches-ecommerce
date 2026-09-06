/**
 * The shipping/duties hub (CL3A9B B2.4).
 *
 * THE QUERY BEHIND THIS PAGE is not "do you ship to Canada". It is "will I get
 * a customs bill", asked in a dozen phrasings — "custom patches no customs
 * fees", "custom patches DDP", "no duties custom patches", "custom patches free
 * shipping UK". That worry is the reason an overseas buyer abandons a cart, and
 * almost nobody answers it in a sentence a machine can quote.
 *
 * DDP IS THE WHOLE ANSWER, so the page leads with it and then does the boring,
 * useful work of saying what it means per country. The EU section carries the
 * 2026 customs reform because a German buyer reading about abolished de minimis
 * thresholds needs telling that the change does not reach them — that is the
 * point of DDP, and it is more persuasive than repeating "free shipping".
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
import { MIN_ORDER_PER_DESIGN, CONSTRAINT_HUBS } from "@/lib/constraintsRemoved";

const CANONICAL = "https://www.pandapatches.com/free-worldwide-shipping-duty-paid";
const UPDATED = "2026-09-07";

export const revalidate = 86400;

/** Country pages this hub feeds, and which link back to it. */
const COUNTRIES = [
  { name: "Canada", href: "/custom-patches-canada", transit: "7 to 15 business days" },
  { name: "United Kingdom", href: "/custom-patches-uk", transit: "7 to 15 business days" },
  { name: "Germany", href: "/custom-patches-germany", transit: "7 to 15 business days" },
  { name: "Australia", href: "/custom-patches-australia", transit: "10 to 20 business days" },
];

const faqs = [
  {
    question: "Is shipping really free on every order?",
    answer:
      "Yes. Free worldwide shipping is included on every order, at every quantity and to every destination, with door-to-door tracking. It applies to a 5-piece order exactly as it applies to a 10,000-piece one. There is no minimum order value to qualify and no surcharge for remote addresses.",
  },
  {
    question: "Will I have to pay customs duties or import fees when my patches arrive?",
    answer:
      "No. Orders ship delivered duty paid, usually written DDP. That means we pay the import duty and any clearance charges before your parcel reaches you, so the courier does not invoice you on delivery and nothing is held pending payment. The price you agreed at checkout is the entire cost.",
  },
  {
    question: "What does delivered duty paid actually mean?",
    answer:
      "Delivered duty paid is an Incoterm that puts the cost and the responsibility for import clearance on the seller rather than the buyer. In practice it is the difference between a parcel arriving and a parcel arriving with a bill attached. The alternative most suppliers use is delivered at place, where the courier collects duty plus a handling charge from you before releasing the goods.",
  },
  {
    question: "Does the 2026 EU customs change affect my order?",
    answer:
      "No, not for you. From 1 July 2026 the European Union abolished the 150-euro duty-free threshold on imported goods and applies a flat per-item duty on low-value consignments, with a handling fee expected to follow later in the year. Those charges fall on the importer, and on a delivered-duty-paid shipment the importer is us. Your total does not change.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Production is 7 to 14 business days after you approve your mockup, then transit by DHL or FedEx. Canada, the UK and Germany usually total 7 to 15 business days from approval, Australia 10 to 20. Rush production is available at 25% of the order total with a $50 minimum, and we confirm your exact in-hand date by email within 2 to 6 hours of ordering.",
  },
  {
    question: "Do you charge for shipping on small orders?",
    answer: `No. ${MIN_ORDER_PER_DESIGN} Shipping is free at that quantity too, which is unusual: a supplier who ships free only above a threshold is using shipping as a minimum by another name.`,
  },
  {
    question: "Do other patch suppliers not offer free shipping?",
    answer:
      "Many do, and the catch is usually a condition rather than a charge. In a September 2026 benchmark of fourteen published US patch suppliers, none published a shipping rate at all, and the six offering free shipping mostly limited it to the continental United States or to orders above a spend threshold such as $75 or $200. None offered delivered-duty-paid shipping. So the useful question to ask any supplier is not whether shipping is free, but whether it is free to your address at your order size, and whether anything is owed to the courier on arrival.",
  },
  {
    question: "Which countries do you ship to?",
    answer:
      "Worldwide. The United States is our largest market, and we ship regularly to Canada, the United Kingdom, Germany and the rest of the EU, Australia and New Zealand. Every destination is free and delivered duty paid on the same terms.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Free Worldwide Shipping on Custom Patches | Duty Paid, No Customs",
  description:
    "Free worldwide shipping on every custom patch order, delivered duty paid. No customs charges, no import fees and no courier invoice on arrival, to Canada, the UK, Germany, Australia and worldwide.",
  url: CANONICAL,
  ogTitle: "Free Worldwide Shipping, Delivered Duty Paid",
  ogDescription:
    "Every order ships free with tracking and arrives duty paid. Nothing to pay the courier, including in the EU after the 2026 customs change.",
});

const articleSchema = generateArticleSchema({
  title: "Free Worldwide Shipping on Custom Patches, Delivered Duty Paid",
  description:
    "How Panda Patches ships custom patch orders: free worldwide shipping at every quantity, delivered duty paid so no customs charge or courier handling fee is owed on arrival, including in the EU after the July 2026 customs reform.",
  datePublished: "2026-09-07",
  dateModified: UPDATED,
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Free Worldwide Shipping, Duty Paid", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function FreeShippingDutyPaidPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />
      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Free Shipping, Duty Paid"
      />

      <section className="w-full pt-8 md:pt-12 pb-8 bg-white">
        <div className="container mx-auto px-6 max-w-[56.25rem]">
          <p className="text-[0.6875rem] md:text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-4">
            What we don&rsquo;t charge for
          </p>
          <h1 className="text-[1.875rem] md:text-[2.625rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
            Free worldwide shipping, delivered duty paid
          </h1>
          <p className="text-[1rem] md:text-[1.1875rem] text-gray-700 leading-[1.75] mb-6 max-w-[45rem]">
            Every Panda Patches order ships free, worldwide, with door-to-door tracking, and arrives{" "}
            <strong>delivered duty paid</strong>. We pay the import duty and clearance before the
            parcel reaches you, so there is no customs charge, no courier handling fee and no
            invoice on the doorstep. What you agreed at checkout is what the order costs, whether
            it goes to Ohio or to Osnabr&uuml;ck. {MIN_ORDER_PER_DESIGN}
          </p>

          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3">
            The bit that actually costs people money
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            &ldquo;Free shipping&rdquo; and &ldquo;no customs charges&rdquo; are different promises,
            and only the second one decides whether a parcel arrives with a bill. Free shipping is
            common in this industry, but usually with a condition attached: of fourteen published US
            suppliers benchmarked in September 2026, the six offering it mostly limited it to the
            continental United States or to orders above a spend threshold, and none offered
            duty-paid delivery. Most overseas
            orders travel delivered at place, which means the courier pays the duty at the border
            and then collects it from you, plus a handling charge for the favour, before releasing
            the goods. The shipping was free; the delivery was not.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-8">
            Delivered duty paid moves that cost and that paperwork to us. It is the reason we can
            quote one number to an international buyer and have it still be true on arrival.
          </p>

          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3">
            The EU change of July 2026, and why it does not reach you
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-8">
            On 1 July 2026 the European Union abolished the 150-euro duty-free threshold on
            imported goods and began applying a flat per-item duty to low-value consignments, with a
            handling fee expected to follow later in the year. It is a real change and it has caught
            out plenty of buyers ordering from outside the EU. It does not change your total with
            us: those charges fall on the importer of record, and on a delivered-duty-paid shipment
            that is us, not you.
          </p>

          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-4">
            By destination
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white mb-8">
            <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse min-w-[26.25rem]">
              <thead>
                <tr className="border-b-2 border-panda-dark text-left">
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Destination
                  </th>
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Shipping
                  </th>
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Duty on arrival
                  </th>
                  <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                    Typical total time
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {COUNTRIES.map((c) => (
                  <tr key={c.name} className="border-b border-gray-100 last:border-0">
                    <th scope="row" className="py-3 px-4 font-bold text-panda-dark text-left">
                      <Link href={c.href} className="text-panda-green underline">
                        {c.name}
                      </Link>
                    </th>
                    <td className="py-3 px-4 font-black text-panda-dark">$0</td>
                    <td className="py-3 px-4 font-black text-panda-dark">$0</td>
                    <td className="py-3 px-4 whitespace-nowrap">{c.transit}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-panda-dark text-left">
                    United States
                  </th>
                  <td className="py-3 px-4 font-black text-panda-dark">$0</td>
                  <td className="py-3 px-4 font-black text-panda-dark">$0</td>
                  <td className="py-3 px-4 whitespace-nowrap">7 to 14 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[0.8125rem] text-gray-500 mb-8">
            Times run from written mockup approval, not from payment. Production is 7 to 14 business
            days and transit is by DHL or FedEx with tracking.
          </p>

          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-4">
            Questions about shipping and duties
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
            <Link href={CONSTRAINT_HUBS.fees} className="text-panda-green font-semibold underline">
              custom patches with no setup fees
            </Link>
            ,{" "}
            <Link href={CONSTRAINT_HUBS.minimum} className="text-panda-green font-semibold underline">
              custom patches with no minimum order
            </Link>
            , and{" "}
            <Link href="/rush-custom-patches" className="text-panda-green font-semibold underline">
              rush production when a deadline is tight
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
