import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Panda Patches",
  description: "Terms of Service for Panda Patches (MC Patches LLC). Read our terms for ordering custom patches, payments, refunds, and artwork policies.",
  alternates: { canonical: "https://pandapatches.com/terms-of-service" },
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  const lastUpdated = "February 18, 2026";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <article className="max-w-[860px] mx-auto py-24 px-6">

        <h1 className="text-[38px] md:text-[48px] font-black text-panda-dark mb-4 leading-tight tracking-tight">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-[15px] mb-12 border-b border-gray-100 pb-8">
          Last Updated: {lastUpdated} · MC Patches LLC (Panda Patches)
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-10">

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">1. Agreement to Terms</h2>
            <p className="text-[16px] leading-[1.8]">
              By accessing or using <strong>pandapatches.com</strong>, placing an order, or communicating with us, you agree
              to be bound by these Terms of Service and our Privacy Policy. These terms apply to all visitors, customers,
              and others who use our services. If you do not agree to any part of these terms, please do not use our site.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">2. Our Services</h2>
            <p className="text-[16px] leading-[1.8] mb-4">
              MC Patches LLC (trading as <strong>Panda Patches</strong>) manufactures and sells custom patches including
              embroidered, iron-on, velcro, woven, PVC, and printed patches, as well as challenge coins, enamel pins, and keychains.
            </p>
            <p className="text-[16px] leading-[1.8]">
              All products are custom-manufactured to your specifications. As such, all sales are final upon production approval
              (see Section 7: Refund Policy).
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">3. Ordering Process</h2>
            <ul className="list-disc pl-6 space-y-3 text-[16px] leading-[1.8]">
              <li>
                <strong>Quote & Mockup:</strong> You submit your design and specifications. We provide a free digital mockup
                within 24 hours. Unlimited revisions are provided at no charge until you approve the design.
              </li>
              <li>
                <strong>Order Confirmation:</strong> Production begins only after you provide written approval of the final mockup.
                By approving the mockup, you confirm all details (size, color, quantity, backing) are correct.
              </li>
              <li>
                <strong>Payment:</strong> Full payment is required before production begins, processed securely via Stripe.
              </li>
              <li>
                <strong>Production:</strong> Standard production time is 7-14 business days from approval. Rush options
                (7-day) are available at an additional fee.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">4. Pricing and Payment</h2>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li>All prices are in US Dollars (USD) unless otherwise stated.</li>
              <li>Prices are subject to change without notice. Your quoted price is honored for 30 days.</li>
              <li>Payment is processed securely via Stripe. We accept all major credit cards.</li>
              <li>We do not store credit card numbers — all payment data is handled by Stripe (PCI-DSS Level 1 compliant).</li>
              <li>Rush fees, shipping costs, and any applicable taxes are displayed at checkout.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">5. Artwork and Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-3 text-[16px] leading-[1.8]">
              <li>
                <strong>Your Responsibility:</strong> By submitting artwork, you confirm that you own the rights to the
                design or have permission to reproduce it. You grant Panda Patches a limited license to use the artwork
                solely for production purposes.
              </li>
              <li>
                <strong>Copyright:</strong> We will not knowingly reproduce copyrighted or trademarked designs without
                written authorization from the rights holder.
              </li>
              <li>
                <strong>Our Work:</strong> Digital mockups created by our designers remain the property of Panda Patches
                until full payment is received.
              </li>
              <li>
                <strong>Portfolio:</strong> We may use images of completed orders in our portfolio or marketing materials
                unless you request otherwise in writing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">6. Shipping and Delivery</h2>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li>We ship to all 50 US states, Canada, United Kingdom, Australia, and internationally.</li>
              <li>Shipping costs are calculated at checkout based on weight, destination, and carrier.</li>
              <li>Delivery times are estimates and not guaranteed. We are not responsible for carrier delays.</li>
              <li>Risk of loss transfers to you upon handover to the carrier.</li>
              <li>We provide tracking information for all shipments.</li>
              <li>If a package is lost in transit, we will work with the carrier to resolve the issue.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">7. Refund and Replacement Policy</h2>
            <p className="text-[16px] leading-[1.8] mb-4">
              Because all products are custom-manufactured to your specifications, <strong>we do not accept returns or offer
              refunds</strong> unless the error is ours.
            </p>
            <p className="text-[16px] leading-[1.8] mb-3 font-semibold">We will replace or refund your order if:</p>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8] mb-4">
              <li>Products are significantly different from the approved mockup</li>
              <li>Products arrive damaged or defective</li>
              <li>Wrong items are shipped</li>
            </ul>
            <p className="text-[16px] leading-[1.8] mb-3 font-semibold">We do not offer refunds for:</p>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li>Customer errors in approved mockups (wrong size, color, spelling)</li>
              <li>Change of mind after production has begun</li>
              <li>Slight color variations (screen color vs. embroidery thread color)</li>
              <li>Minor size variations within ±5% of specified dimensions</li>
            </ul>
            <p className="text-[16px] leading-[1.8] mt-4">
              To request a replacement, contact us within <strong>14 days of delivery</strong> at{" "}
              <a href="mailto:admin@pandapatches.com" className="text-panda-dark font-semibold underline">admin@pandapatches.com</a>{" "}
              with photos of the issue.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">8. Prohibited Uses</h2>
            <p className="text-[16px] leading-[1.8] mb-3">You may not use our services to produce patches containing:</p>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li>Hate speech, racist, or discriminatory imagery</li>
              <li>Obscene or pornographic content</li>
              <li>Counterfeit brands, logos, or trademarked designs without authorization</li>
              <li>Content that violates any applicable law or regulation</li>
            </ul>
            <p className="text-[16px] leading-[1.8] mt-4">
              We reserve the right to refuse any order at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">9. Limitation of Liability</h2>
            <p className="text-[16px] leading-[1.8]">
              To the maximum extent permitted by law, MC Patches LLC shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of our products or services. Our total
              liability to you shall not exceed the amount paid for the specific order giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">10. Governing Law</h2>
            <p className="text-[16px] leading-[1.8]">
              These Terms are governed by the laws of the State of Texas, United States, without regard to conflict of law
              provisions. Any disputes shall be resolved in the courts of Fort Bend County, Texas.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">11. Changes to Terms</h2>
            <p className="text-[16px] leading-[1.8]">
              We reserve the right to update these Terms at any time. Changes take effect immediately upon posting.
              Continued use of our website after changes constitutes acceptance. The &quot;Last Updated&quot; date reflects the
              most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">12. Contact</h2>
            <p className="text-[16px] leading-[1.8]">Questions about these Terms? Contact us:</p>
            <div className="mt-4 bg-gray-50 rounded-2xl p-6 text-[16px] space-y-2">
              <p><strong>MC Patches LLC (Panda Patches)</strong></p>
              <p>Missouri City, TX, United States</p>
              <p>Email: <a href="mailto:admin@pandapatches.com" className="text-panda-dark font-semibold underline">admin@pandapatches.com</a></p>
              <p>Phone: <a href="tel:+13022504340" className="text-panda-dark font-semibold underline">+1 (302) 250-4340</a></p>
            </div>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
