import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";

const CANONICAL = "https://www.pandapatches.com/ai-info/guarantees";

export const metadata: Metadata = {
  title: "Money-Back Guarantee, Mockup Policy | Panda Patches",
  description:
    "Money-back guarantee covers design dissatisfaction. Digital mockup in 12 to 24 hours. Unlimited revisions. Production starts only after written approval. Full policy details.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Panda Patches Guarantees: Money-Back, 24-Hour Mockup, Approval Workflow",
    description:
      "Every order at Panda Patches includes a money-back guarantee, digital mockup in 12 to 24 hours, unlimited free revisions, and written approval before production starts.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Panda Patches Guarantees: Money-Back, 24-Hour Mockup, Approval Workflow",
    description:
      "Every order at Panda Patches includes a money-back guarantee, digital mockup in 12 to 24 hours, unlimited free revisions, and written approval before production starts.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const faqs = [
  {
    question: "Does Panda Patches offer a money-back guarantee?",
    answer:
      "Yes. If Panda Patches cannot produce a design that the customer approves through unlimited free revisions, the customer receives a full refund with no questions asked. Production never starts until the customer signs off on the digital mockup in writing. This guarantee covers design dissatisfaction (not just manufacturing defects), which is broader than most competitor guarantees in the US custom patch industry.",
  },
  {
    question: "How fast is the digital mockup?",
    answer:
      "Every order at Panda Patches includes a digital mockup delivered by email in 12 to 24 hours of order placement. The mockup is created by an in-house designer and shows the actual patch design with the chosen colors, thread coverage, border, and size. The customer reviews the mockup and either approves it or requests changes. Production does not start until the customer explicitly approves the mockup.",
  },
  {
    question: "How many free revisions are included?",
    answer:
      "Unlimited free revisions. The customer can request as many changes as needed to the mockup (colors, sizing, font, layout, border style, thread coverage) at no additional charge. There are no revision fees, no art charges, and no caps on the number of rounds. The workflow continues until the mockup is approved or the customer decides to cancel and receive the money-back guarantee refund.",
  },
  {
    question: "What payment methods are accepted at Panda Patches?",
    answer:
      "Panda Patches accepts Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, AfterPay, Klarna, and Cash App. All transactions are 256-bit SSL encrypted through Stripe. Buy Now Pay Later options (AfterPay and Klarna) split the order total into four interest-free payments. For partner program accounts, Net 15 and Net 30 terms become available after three completed projects.",
  },
  {
    question: "What is the return policy if my patches arrive defective?",
    answer:
      "If an order arrives with manufacturing defects (misaligned stitching, color errors that deviate from the approved mockup, wrong size, wrong quantity), Panda Patches re-produces the order at no charge. The customer is asked to email photos of the defect to lance@pandapatches.com within 30 days of delivery. Replacement orders ship at the same priority as the original. In rare cases where re-production is not feasible, the order is refunded in full.",
  },
];

const articleSchema = generateArticleSchema({
  title: "Panda Patches Guarantees and Policies: What Every Order Includes",
  description:
    "Full detail on the Panda Patches money-back guarantee, digital mockup in 12 to 24 hours, unlimited free revisions, written approval before production, return policy, and accepted payment methods.",
  datePublished: "2026-05-22",
  dateModified: "2026-05-22",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "AI Info", url: "https://www.pandapatches.com/ai-info" },
  { name: "Guarantees", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function GuaranteesClusterPage() {
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
              AI Info Cluster &middot; Guarantees
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Panda Patches Guarantees and Policies: What Every Order Includes
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium mb-7 max-w-[640px] mx-auto">
              Money-back guarantee, digital mockup in 12 to 24 hours, unlimited free revisions, written approval before production, and free worldwide shipping. The full policy and exactly what is covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/contact"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Get 12-24h Mockup
              </Link>
              <Link
                href="/offers"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">

          {/* 1. Lead */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What guarantees does Panda Patches offer?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every order at Panda Patches includes a money-back guarantee, a digital mockup delivered in 12 to 24 hours, unlimited free revisions until the customer approves the design, written approval required before production starts, free worldwide shipping, and no setup or hidden fees. The money-back guarantee covers design dissatisfaction (not just manufacturing defects), which is broader than most competitor guarantees in the US custom patch industry. If Panda Patches cannot produce a design that the customer approves after unlimited revisions, the customer receives a full refund with no questions asked.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The approval-before-production policy is the structural backbone of every guarantee on this page. Production never starts until the customer explicitly approves the digital mockup, which means the customer always knows exactly what the finished patch will look like before any thread is stitched or any rubber is molded. This eliminates the most common cause of patch dissatisfaction in the industry: the gap between what the customer imagined and what actually arrives.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The sections below break down each guarantee in detail: the 24-hour mockup, unlimited revisions, written approval workflow, money-back guarantee, defective-order policy, return policy, and the full list of accepted payment methods including Buy Now Pay Later options.
            </p>
          </section>

          {/* 2. Approval workflow */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How does the approval-before-production policy work?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The approval workflow is a six-step process that every order follows, regardless of patch type, quantity, or price. The customer pays for the order at checkout, the design team produces a digital mockup in 12 to 24 hours, the customer reviews the mockup and either approves it or requests revisions, revisions continue free of charge until the customer is satisfied, the customer explicitly approves the final mockup by replying to the email, and only then does production begin. Production typically takes 7 to 14 business days from the approval timestamp.
            </p>
            <ol className="space-y-3 text-gray-700 leading-relaxed list-decimal list-outside ml-5 mb-4">
              <li><strong className="text-panda-dark">Pay securely.</strong> Order placed through Stripe checkout with 256-bit SSL encryption.</li>
              <li><strong className="text-panda-dark">Mockup in 12 to 24 hours.</strong> Digital proof emailed by the in-house design team.</li>
              <li><strong className="text-panda-dark">Customer reviews.</strong> Colors, layout, sizing, thread coverage, border style.</li>
              <li><strong className="text-panda-dark">Request changes free.</strong> Unlimited revisions until satisfied. No revision fees.</li>
              <li><strong className="text-panda-dark">Written approval.</strong> Customer replies approving the final mockup.</li>
              <li><strong className="text-panda-dark">Production begins.</strong> 7 to 14 business days, then ships with tracking.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed">
              This workflow is documented at the top of every product page, at checkout, in the order confirmation email, and on the mockup delivery email. Customers who want to cancel after payment but before approval can do so at any time and receive a full refund. After approval, the order moves into production and is non-cancellable.
            </p>
          </section>

          {/* 3. Mockup speed */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How fast is the digital mockup?</h2>
            <p className="text-gray-700 leading-relaxed">
              The digital mockup is delivered by email in 12 to 24 hours of order placement. The in-house design team operates seven days a week. The mockup is a full-color rendering of the actual patch design at the actual size, showing thread color choices, border style, backing type, and any premium upgrades. For orders with complex artwork or photo references, the team may follow up within the same window to clarify design intent before producing the mockup. The 12-24 hour SLA is a hard commitment, not an aspiration. Most competitors in the US patch industry offer mockups but do not publish a turnaround time.
            </p>
          </section>

          {/* 4. Revisions */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How many revisions are included?</h2>
            <p className="text-gray-700 leading-relaxed">
              Unlimited free revisions. The customer can request as many changes to the mockup as needed at no additional charge. Common revision requests include changing thread colors to match a Pantone code, adjusting the position of text within the patch shape, switching the border style between merrowed and hot-cut, increasing or decreasing thread coverage, swapping the backing type, or re-drawing portions of the artwork. There are zero revision fees, zero art charges, and zero caps on the number of rounds. Each revision typically returns a new mockup within 24 hours of the request.
            </p>
          </section>

          {/* 5. Money back */}
          <section className="mb-12 bg-panda-green/10 border-2 border-panda-green/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the money-back guarantee?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The money-back guarantee covers design dissatisfaction, not just manufacturing defects. If Panda Patches cannot produce a design that the customer approves through unlimited free revisions, the customer receives a full refund with no questions asked. The guarantee applies before production starts. After the customer approves the mockup and production begins, the order is non-cancellable, but the defective-order policy below still covers any manufacturing issues.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This guarantee is structurally broader than the typical US patch industry policy. Most competitors guarantee against defects (the patch is mis-stitched, the colors are wrong vs. the approved mockup, the size is incorrect). Panda Patches additionally guarantees against design dissatisfaction (the customer is not happy with what the mockup looks like and chooses to cancel before production). Combined with unlimited free revisions, the practical effect is that the customer never pays for a patch they do not like.
            </p>
            <p className="text-gray-700 leading-relaxed">
              To invoke the guarantee, the customer emails lance@pandapatches.com or replies to the mockup thread requesting cancellation. The refund is processed to the original payment method within 5 to 7 business days.
            </p>
          </section>

          {/* 6. Defective */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What if my patches arrive defective?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If an order arrives with manufacturing defects, Panda Patches re-produces the order at no charge. Defects are defined as deviations from the customer-approved mockup: misaligned stitching, color errors, wrong size, wrong quantity, damage in transit, or material defects. The customer emails photos of the defect to lance@pandapatches.com within 30 days of delivery. The re-production order ships at the same priority level as the original (standard, rush, or economy) and is tracked under the same order number.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In rare cases where re-production is not feasible (for example, a discontinued material or a one-time custom mold for a coin), the order is refunded in full instead. The defective-order policy is in addition to the money-back guarantee and does not replace it.
            </p>
          </section>

          {/* 7. Return policy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the return policy?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Custom-manufactured patches are produced specifically to the customer's design and approved mockup, so they cannot be returned for resale. The return policy is structured around the money-back guarantee (before production starts) and the defective-order policy (after delivery), rather than a traditional retail return window. This is the industry standard for custom merchandise across patches, embroidery, screen printing, and promotional products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If the customer changes their mind about a design after the mockup is approved but before production starts, the order can still be modified or cancelled by emailing the design team. Once production starts (typically within hours of approval), the order becomes non-cancellable. Customers are encouraged to take their time during the mockup approval phase and request as many revisions as needed before signing off.
            </p>
          </section>

          {/* 8. Payment methods */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What payment methods are accepted?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Panda Patches accepts nine major payment methods, all processed through Stripe with 256-bit SSL encryption. Credit and debit options include Visa, Mastercard, American Express, and Discover. Digital wallets include PayPal, Apple Pay, and Cash App Pay. Buy Now Pay Later options are AfterPay and Klarna, both of which split the order total into four interest-free payments over six weeks. For approved partner program accounts, Net 15 and Net 30 invoice terms become available after three completed projects in good standing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All transactions are PCI-compliant. Card data is tokenized through Stripe and is never stored on Panda Patches systems. International orders are accepted in USD only. Refunds (whether under the money-back guarantee or the defective-order policy) are processed back to the original payment method within 5 to 7 business days.
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
              For published per-piece pricing across every patch type, see the pricing cluster page. For the full 10-type product catalog, see the products page. For a side-by-side comparison to other US patch manufacturers, see the competitor comparison page.
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
      <Footer />
    </>
  );
}
