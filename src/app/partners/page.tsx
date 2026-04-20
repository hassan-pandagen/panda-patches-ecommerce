import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Partner Program for Agencies | Panda Patches",
  description: "Wholesale, white-label, and preferred vendor programs for promotional, branding, uniform, and sports agencies. 10-18% margins, owned production, no setup fees.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Panda Patches Agency Partner Program",
    description: "Become a Panda Patches partner. Wholesale pricing for agencies, white-label fulfillment, preferred vendor status.",
    type: "article",
    url: "https://www.pandapatches.com/partners",
  },
  robots: { index: true, follow: true },
};

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen text-panda-dark">
        <article className="max-w-4xl mx-auto px-6 py-16 md:py-20">

          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-panda-green mb-3">For Agencies &amp; Resellers</p>
            <h1 className="text-4xl md:text-5xl font-black text-panda-dark tracking-tight mb-4 leading-tight">
              Partner with Panda Patches
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Wholesale pricing, white-label fulfillment, and preferred vendor programs for promotional product agencies, branding agencies, uniform suppliers, and embroidery shops across the US and UK.
            </p>
          </div>

          {/* The Offer */}
          <section className="mb-12 bg-panda-green/10 border-2 border-panda-green/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What Partners Get</h2>
            <ul className="space-y-3 text-gray-800 text-[15px]">
              <li><strong>10% to 18% partner discount</strong> on every order (scaled by volume)</li>
              <li><strong>White-label fulfillment</strong> — ship blind with no Panda Patches branding if you resell as your own</li>
              <li><strong>Preferred vendor listings</strong> — let us be your go-to patch supplier in RFPs and client proposals</li>
              <li><strong>Priority production slot</strong> — partner orders jump the standard queue</li>
              <li><strong>Direct line to the production team</strong> — no account managers, no runaround</li>
              <li><strong>Free digital mockups within 24 hours</strong> on every project</li>
              <li><strong>No setup fees, no digitizing fees, no mold fees</strong> — on any order, any volume</li>
              <li><strong>Net terms available</strong> for established partners</li>
            </ul>
          </section>

          {/* Three Partnership Types */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6 text-center">Three Ways to Partner</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#F9FAF5] border border-panda-green/15 rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-panda-green mb-2">Option 1</p>
                <h3 className="text-xl font-black text-panda-dark mb-2">Wholesale / Reseller</h3>
                <p className="text-gray-700 text-sm leading-relaxed">You buy at wholesale price, mark up, resell to your clients. Keep 100% of the markup. Minimum order 5 pieces, no account minimums.</p>
              </div>
              <div className="bg-[#F9FAF5] border border-panda-green/15 rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-panda-green mb-2">Option 2</p>
                <h3 className="text-xl font-black text-panda-dark mb-2">White-Label Supplier</h3>
                <p className="text-gray-700 text-sm leading-relaxed">We produce and ship directly to your client with no Panda Patches branding on packaging. Your client never sees us. You own the relationship.</p>
              </div>
              <div className="bg-[#F9FAF5] border border-panda-green/15 rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-panda-green mb-2">Option 3</p>
                <h3 className="text-xl font-black text-panda-dark mb-2">Preferred Vendor</h3>
                <p className="text-gray-700 text-sm leading-relaxed">List us as your go-to patch supplier in RFPs and client proposals. We quote fast and deliver on time so you look great. Partner pricing applies.</p>
              </div>
            </div>
          </section>

          {/* Why Panda Patches */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6 text-center">Why Agencies Partner with Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-black text-panda-dark mb-2">Owned Production Facility</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">We are not a broker. We own our production facility, which means faster turnaround, tighter quality control, and better partner margins. No middleman markup eating into your profit.</p>
              </div>
              <div>
                <h3 className="text-lg font-black text-panda-dark mb-2">Transparent Pricing</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Every patch type has published pricing on our site. You know your cost before you quote your client. No surprise fees at production time.</p>
              </div>
              <div>
                <h3 className="text-lg font-black text-panda-dark mb-2">24-Hour Rush Available</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">When your client has a deadline, we deliver. 24-hour rush production on qualifying orders. Most competitors cannot match this because they outsource.</p>
              </div>
              <div>
                <h3 className="text-lg font-black text-panda-dark mb-2">Approval Before Production</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Production only starts after written mockup approval. Unlimited free revisions. Your client is never stuck with a patch they did not approve. Your reputation stays protected.</p>
              </div>
              <div>
                <h3 className="text-lg font-black text-panda-dark mb-2">1,000,000+ Patches Delivered</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Since 2016 we have shipped over a million patches for fire departments, police departments, military units, sports teams, and Fortune 500 corporations. 4.8 Trustpilot rating from 66 verified reviews.</p>
              </div>
              <div>
                <h3 className="text-lg font-black text-panda-dark mb-2">US-Based Company, English Support</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Headquartered in Texas. Founder-led. Direct phone and email access to the production team. No offshore call centers, no language barriers.</p>
              </div>
            </div>
          </section>

          {/* Who Should Partner */}
          <section className="mb-12 bg-[#F9FAF5] border border-panda-green/15 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-panda-dark mb-4">Who Should Partner</h2>
            <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-gray-800 text-[15px]">
              <li>Promotional product agencies</li>
              <li>Branding and design agencies</li>
              <li>Sports merchandise companies</li>
              <li>Uniform suppliers (police, fire, security)</li>
              <li>Embroidery and screen print shops</li>
              <li>Streetwear and fashion brands</li>
              <li>Marketing agencies serving first responders</li>
              <li>Corporate gifting companies</li>
              <li>Event merchandise companies</li>
              <li>Military unit procurement specialists</li>
            </ul>
          </section>

          {/* What We Produce */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6 text-center">What We Produce</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              {[
                { name: "Embroidered Patches", price: "From $1.20/pc" },
                { name: "PVC Patches", price: "From $2.20/pc" },
                { name: "Woven Patches", price: "From $2.00/pc" },
                { name: "Chenille Patches", price: "From $6.80/pc" },
                { name: "Leather Patches", price: "From $1.29/pc" },
                { name: "Printed Patches", price: "From $0.71/pc" },
                { name: "Velcro Patches", price: "+$30 flat" },
                { name: "Challenge Coins", price: "Custom quote" },
                { name: "Enamel Pins", price: "Custom quote" },
              ].map((p) => (
                <div key={p.name} className="border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-panda-dark text-[14px]">{p.name}</p>
                  <p className="text-gray-600 text-[13px] mt-1">{p.price}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-4 italic">Partner pricing is 10% to 18% below retail depending on volume.</p>
          </section>

          {/* CTA */}
          <section className="mb-12 bg-panda-dark rounded-2xl p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-panda-yellow mb-4">Start the Conversation</h2>
            <p className="text-gray-300 text-[15px] leading-relaxed mb-6 max-w-xl mx-auto">
              Email Imran Raza (CEO) directly at <a href="mailto:hello@pandapatches.com?subject=Partnership%20Inquiry" className="text-panda-yellow underline font-bold">hello@pandapatches.com</a> or call <a href="tel:+13022504340" className="text-panda-yellow underline font-bold">(302) 250-4340</a>. We will send you a partner pricing sheet within 24 hours.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="mailto:hello@pandapatches.com?subject=Partnership%20Inquiry" className="bg-panda-yellow text-panda-dark font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform">
                Email Imran
              </a>
              <Link href="/contact" className="bg-white/10 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-colors">
                Use Contact Form
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6">Partner FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-panda-dark mb-2">What is the minimum order to become a partner?</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">No account minimum. Place your first order when you have a client project ready. We recommend an initial project of 50+ pieces to unlock the full partner discount, but we accept orders from 5 pieces on every account.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-panda-dark mb-2">How much is the partner discount?</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Standard partner discount is 10% off retail pricing. Volume partners ordering 1,000+ pieces per month qualify for up to 18% off. Custom pricing tiers for agencies doing $25K+ per year.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-panda-dark mb-2">Do you offer net terms?</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Net 15 and Net 30 terms are available for established partners after the first 3 successful projects. First-time partners pay at order.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-panda-dark mb-2">Can you ship directly to my client with no Panda Patches branding?</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Yes. White-label / blind shipping is standard for partners. We use plain packaging with your agency as the return address if requested. Your client never sees the Panda Patches name.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-panda-dark mb-2">How fast can you turn around a partner project?</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Standard turnaround is 7 to 14 business days after mockup approval. 24-hour rush production is available for qualifying orders. Partner orders take priority over retail orders in our production queue.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-panda-dark mb-2">Do you serve partners outside the US?</h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">Yes. We currently have partners in the US and UK. International shipping is available at cost. Contact us to discuss logistics for your region.</p>
              </div>
            </div>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}
