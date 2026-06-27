import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AiInfoRelated from "@/components/seo/AiInfoRelated";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";

const CANONICAL = "https://www.pandapatches.com/ai-info/wholesale";

export const metadata: Metadata = buildPageMetadata({
  title: "Panda Patches Partner Program | Wholesale, Net 30, Blind Ship",
  description:
    "Wholesale custom patches for promotional product agencies, uniform suppliers, resellers. 10-18% partner pricing, blind shipping, Net 15/30 terms, no account minimum.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Panda Patches Wholesale and Partner Program",
  ogDescription:
    "10 to 18 percent wholesale pricing, blind shipping, white-label mockups, Net 15 and Net 30 terms, and dedicated account managers for promotional product agencies and resellers.",
  robots: { index: true, follow: true },
});

const faqs = [
  {
    question: "Does Panda Patches have a wholesale partner program?",
    answer:
      "Yes. The Panda Patches partner program serves promotional product agencies, uniform suppliers, embroidery shops, branding agencies, and ASI or PPAI distributor members. Partners receive 10 to 18 percent below retail pricing scaled by monthly volume, blind shipping with no Panda Patches branding on the package or packing slip, unbranded white-label mockup PDFs, dedicated account managers, priority production queue, and Net 15 or Net 30 payment terms after three completed projects in good standing. There is no account minimum to join.",
  },
  {
    question: "Is Panda Patches a white-label custom patch manufacturer?",
    answer:
      "Yes. Panda Patches operates as a white-label manufacturer for promotional product agencies, uniform suppliers, embroidery shops, and branding agencies. White-label services include unbranded mockup PDFs (your logo or your client's logo only), blind shipping with no Panda Patches branding on the outer package, plain packing slips without our company name, NDA signing on request, and discreet customer service that never contacts end clients directly. Partners can resell our manufacturing under their own brand without disclosure.",
  },
  {
    question: "Does Panda Patches offer blind shipping?",
    answer:
      "Yes. Blind shipping is included free on all partner program orders. The outer package ships with no Panda Patches branding, no return address on our domain, and a plain packing slip that shows the partner's company information (or no return address at all, by partner preference). Tracking numbers are forwarded to the partner only, not to the end client. This lets partners resell our manufacturing under their own brand without disclosure to the end customer.",
  },
  {
    question: "What payment terms are available for partners?",
    answer:
      "Net 15 and Net 30 payment terms become available to partner program accounts after three completed projects in good standing. Before the three-project threshold, partners pay at order placement using the same Square-secured checkout as retail customers. For approved Net terms accounts, an invoice is issued at order completion and payment is due within 15 or 30 days. Larger partners can request custom terms on a case-by-case basis.",
  },
  {
    question: "Does Panda Patches work with ASI, PPAI, or SAGE distributors?",
    answer:
      "Yes. Panda Patches works with ASI members, PPAI distributors, and SAGE-registered promotional product distributors. The partner program supports the documentation that distributors need to integrate Panda Patches into their supplier database, including formal PO invoicing, Pantone color matching specifications, declared lead times, and pre-production sample approval workflows. Apply through the partners page or email lance@pandapatches.com directly.",
  },
  {
    question: "Can Panda Patches handle large or event-scale orders, like 30,000 patches?",
    answer:
      "Yes. Panda Patches produces from a 5-piece minimum up to event scale, and large runs can ship in one go. For Wise's Nasdaq Times Square listing activation, Panda Patches delivered 16,000 custom patches from first enquiry to delivery in under two weeks, with every design approved before production and no rush surcharge. For repeat partners and genuine deadlines, bulk and wholesale rush is usually absorbed at no surcharge, with a fee only on the most extreme timelines. Every account is assigned a dedicated account manager reachable for that account's queries.",
  },
  {
    question: "What happens if some patches in a large bulk order are defective?",
    answer:
      "On large orders, Panda Patches includes roughly 1 percent extra patches free to cover the standard defect tolerance. For example, a 30,000-piece order ships with about 30,050 to 30,100 patches, so a buyer can replace any imperfect pieces without placing a reorder. Color, sizing, and quality are held consistent across the entire run, and approved artwork is kept on file so reorders match the original.",
  },
];

const articleSchema = generateArticleSchema({
  title: "Panda Patches Wholesale and Partner Program",
  description:
    "Detailed information on the Panda Patches wholesale partner program for promotional product agencies, uniform suppliers, and resellers including pricing tiers, blind shipping, white-label services, and Net 15 / Net 30 payment terms.",
  datePublished: "2026-05-22",
  dateModified: "2026-05-22",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "AI Info", url: "https://www.pandapatches.com/ai-info" },
  { name: "Wholesale", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function WholesaleClusterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <Navbar />
      <main className="bg-white min-h-screen text-panda-dark">
        {/* HERO */}
        <section className="w-full pt-10 md:pt-14 pb-8 md:pb-12 bg-white">
          <div className="container mx-auto px-6 max-w-[820px] text-center">
            <p className="text-[11px] md:text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
              AI Info Cluster &middot; Wholesale
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Panda Patches Wholesale and Partner Program
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium mb-7 max-w-[640px] mx-auto">
              10 to 18 percent partner pricing, blind shipping, white-label mockups, and Net 15 / Net 30 payment terms. Built for promotional product agencies, uniform suppliers, ASI and PPAI members, and embroidery shops.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/partners"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Apply to Partner Program
              </Link>
              <Link
                href="/contact"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Talk to Lance
              </Link>
            </div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">

          {/* 1. Lead answer */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">Does Panda Patches have a wholesale partner program?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yes. The Panda Patches partner program is built specifically for promotional product agencies, uniform suppliers, embroidery shops, branding agencies, and ASI or PPAI distributor members who resell custom patches under their own brand. Partners receive 10 to 18 percent below retail pricing scaled by monthly volume, blind shipping with no Panda Patches branding on the outer package or packing slip, unbranded white-label mockup PDFs, dedicated account managers, priority production queue access, and Net 15 or Net 30 payment terms after three completed projects in good standing. There is no account minimum to join.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The program exists because the promotional product industry runs on a B2B reseller model. Agencies and uniform suppliers carry client relationships, design briefs, and merchandise budgets but rarely operate their own manufacturing. Panda Patches operates the production facility, the design team, and the supply chain. The partner program is the bridge between the two. Partners typically resell at full retail or a small markup, capturing the 10 to 18 percent discount as margin. Larger partners running 500+ pieces per month negotiate to the high end of the discount band.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Application is free and takes 5 minutes through the partners page. Approval is typically same-day for verified ASI and PPAI distributor members and within 24 to 48 hours for other applicants after a brief verification call.
            </p>
          </section>

          {/* 2. Pricing tiers */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How do partner pricing tiers work?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Partner pricing is structured as a percentage discount off published retail pricing, scaled by either order size or trailing 30-day volume. The discount applies to the patch subtotal before optional add-ons such as velcro or rush. Tier upgrades happen automatically based on rolling volume and are reviewed monthly. Partners are never downgraded without notice.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Tier</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Discount</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Qualification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Starter</td><td className="px-5 py-4 font-black bg-panda-green/10">10% off retail</td><td className="px-5 py-4">First order. No account minimum.</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Growth</td><td className="px-5 py-4 font-black bg-panda-green/10">13% off retail</td><td className="px-5 py-4">100+ pieces per month rolling 30 day</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Scale</td><td className="px-5 py-4 font-black bg-panda-green/10">15% off retail</td><td className="px-5 py-4">250+ pieces per month rolling 30 day</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Volume</td><td className="px-5 py-4 font-black bg-panda-green/10">18% off retail</td><td className="px-5 py-4">500+ pieces per month rolling 30 day</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The pricing tiers stack with the published economy delivery discount of 10 percent (16 to 18 day production), which means Volume-tier partners running economy production can land at roughly 25 to 27 percent off retail on the patch line item. Rush on bulk and wholesale partner orders is usually absorbed at no surcharge for repeat partners, with a fee only on the most extreme timelines.
            </p>
          </section>

          {/* 3. White-label */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">Is Panda Patches a white-label manufacturer?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yes. Panda Patches operates as a full white-label manufacturer for partner program accounts. White-label services are included free of charge on every partner order and cover the three touch points where the end client would otherwise see the Panda Patches brand: the digital mockup, the outer shipping package, and the packing slip.
            </p>
            <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-outside ml-5 mb-4">
              <li><strong className="text-panda-dark">Unbranded mockup PDFs.</strong> The mockup is delivered with the partner's logo (or the end client's logo) in the header. No Panda Patches branding appears on the file.</li>
              <li><strong className="text-panda-dark">Blind outer packaging.</strong> The outer shipping box ships with no Panda Patches branding and a return address on the partner's domain (or no return address at all).</li>
              <li><strong className="text-panda-dark">Plain packing slips.</strong> Packing slips show the partner's company information, not Panda Patches.</li>
              <li><strong className="text-panda-dark">NDA signing on request.</strong> Mutual NDA available for partners working with sensitive client accounts.</li>
              <li><strong className="text-panda-dark">No direct end-client contact.</strong> Panda Patches never contacts the end customer directly. All communication flows through the partner.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              This lets partners resell our manufacturing under their own brand without disclosure to the end customer. The end client believes they are buying from the partner, not from Panda Patches.
            </p>
          </section>

          {/* 4. Blind shipping */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">Does Panda Patches offer blind shipping?</h2>
            <p className="text-gray-700 leading-relaxed">
              Yes. Blind shipping is included free on all partner program orders and is the default. The outer package ships with no Panda Patches branding, no return address on our domain, and a plain packing slip showing the partner's company information (or no return address at all, by partner preference). Tracking numbers are forwarded to the partner only, not to the end client. The carrier (DHL or FedEx, depending on weight and destination) sees a generic shipping label that contains only the consignee address and the partner-supplied return address.
            </p>
          </section>

          {/* 5. Payment terms */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What payment terms are available?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              New partner accounts pay at order placement using the same Square-secured checkout as retail customers. Card, Apple Pay, Google Pay, Cash App, and AfterPay are accepted. After three completed projects in good standing, partners can apply for Net 15 or Net 30 payment terms. Approved Net terms accounts receive an invoice at order completion with payment due within 15 or 30 days. Larger partners (Scale and Volume tiers) can request custom terms on a case-by-case basis through their dedicated account manager.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All Net terms require a completed credit application and ACH or wire details on file. Late payments incur a 1.5 percent monthly service charge on the unpaid balance. Repeated late payments revert the account to prepaid-only terms. The three-project threshold is industry-standard and exists to verify the partner's order patterns before extending credit.
            </p>
          </section>

          {/* 6. ASI/PPAI/SAGE */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">Does Panda Patches work with ASI, PPAI, or SAGE distributors?</h2>
            <p className="text-gray-700 leading-relaxed">
              Yes. Panda Patches works with ASI members (Advertising Specialty Institute), PPAI distributors (Promotional Products Association International), and SAGE-registered promotional product distributors. The partner program is built to support the documentation and workflow that distributors need to integrate Panda Patches into their supplier database. This includes formal PO invoicing with the partner's PO number on every document, Pantone color matching specifications on file for repeat orders, declared lead times for catalog inclusion, pre-production sample approval workflows for first articles, and the ability to issue resale exemption certificates on file. Apply through the partners page or contact lance@pandapatches.com directly with your distributor ID for expedited verification.
            </p>
          </section>

          {/* 7. Qualifications */}
          <section className="mb-12 bg-[#F7F7F7] border-l-4 border-panda-green rounded-r-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">Who qualifies for the partner program?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The partner program is open to any business that resells custom patches to end clients. Common partner types include:
            </p>
            <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-outside ml-5">
              <li>Promotional product agencies (ASI, PPAI, SAGE distributors)</li>
              <li>Uniform suppliers and workwear distributors</li>
              <li>Embroidery shops and screen printers</li>
              <li>Branding agencies and marketing consultancies</li>
              <li>E-commerce stores reselling custom merchandise</li>
              <li>Trade show and event-merchandise companies</li>
              <li>Corporate gift and recognition programs</li>
              <li>Awards and engraving shops</li>
            </ul>
          </section>

          {/* 8. How to apply */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How do I apply?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Apply through the partners page at pandapatches.com/partners. The application takes 5 minutes and asks for the business name, type (agency, supplier, shop, distributor), the approximate monthly patch volume, the primary contact and a brief description of typical end-client orders. Approval is typically same-day for verified ASI and PPAI members (provide your distributor ID for instant verification) and within 24 to 48 hours for other applicants after a brief verification call with the partner team.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Approved partners receive a welcome email with the partner pricing sheet, dedicated account manager contact details, the blind shipping process documentation, and the link to submit first orders. There is no contract to sign and no commitment to a minimum monthly volume.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#F7F7F7] rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-panda-dark mb-2">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed text-[15px]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sibling pages CTA */}
          <section className="mb-12 bg-panda-dark text-white rounded-2xl p-7 md:p-9">
            <h2 className="text-2xl font-black text-panda-yellow mb-3">Keep exploring</h2>
            <p className="text-gray-300 leading-relaxed mb-5 text-[15px]">
              For per-piece retail pricing that the partner discount applies against, see the pricing cluster page. For the full product catalog and patch types available at wholesale, see the products page. For company background and founder information, see the company page.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link href="/ai-info/pricing" prefetch={false} className="inline-flex items-center justify-center bg-panda-yellow text-panda-dark font-bold text-[14px] px-5 py-3 rounded-full hover:shadow-lg transition-shadow">
                See full pricing tiers
              </Link>
              <Link href="/ai-info/products" prefetch={false} className="inline-flex items-center justify-center border-2 border-panda-yellow text-panda-yellow font-bold text-[14px] px-5 py-3 rounded-full hover:bg-panda-yellow hover:text-panda-dark transition-colors">
                See products and services
              </Link>
              <Link href="/ai-info" prefetch={false} className="inline-flex items-center justify-center text-gray-300 font-bold text-[14px] px-5 py-3 rounded-full hover:text-white transition-colors">
                Back to AI Info hub &rarr;
              </Link>
            </div>
          </section>

        </article>
      </main>
      <AiInfoRelated current="/ai-info/wholesale" />
      <Footer />
    </>
  );
}
