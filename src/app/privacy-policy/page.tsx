import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Panda Patches",
  description: "Privacy Policy for Panda Patches (MC Patches LLC). Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://pandapatches.com/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "February 18, 2026";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <article className="max-w-[860px] mx-auto py-24 px-6">

        <h1 className="text-[38px] md:text-[48px] font-black text-panda-dark mb-4 leading-tight tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-[15px] mb-12 border-b border-gray-100 pb-8">
          Last Updated: {lastUpdated} · MC Patches LLC (Panda Patches)
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-10">

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">1. Introduction</h2>
            <p className="text-[16px] leading-[1.8] mb-4">
              MC Patches LLC, operating as <strong>Panda Patches</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operates the website
              <strong> pandapatches.com</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website or place an order with us.
            </p>
            <p className="text-[16px] leading-[1.8]">
              By using our website, you agree to the terms of this Privacy Policy. If you disagree, please discontinue use of our site.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">2. Information We Collect</h2>
            <h3 className="text-[20px] font-bold text-panda-dark mb-3">Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8] mb-6">
              <li><strong>Name and contact details</strong> — name, email address, phone number</li>
              <li><strong>Shipping address</strong> — for order delivery</li>
              <li><strong>Payment information</strong> — processed securely via Stripe; we do not store card numbers</li>
              <li><strong>Order details</strong> — patch specifications, artwork files, special instructions</li>
              <li><strong>Communications</strong> — messages sent through our chat widget (Tawk.to) or email</li>
            </ul>
            <h3 className="text-[20px] font-bold text-panda-dark mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li><strong>Usage data</strong> — pages visited, time on site, referring URLs</li>
              <li><strong>Device data</strong> — browser type, IP address, operating system</li>
              <li><strong>Cookies and tracking</strong> — via Google Tag Manager, Meta Pixel, and Bing UET (see Section 5)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li>Process and fulfill your custom patch orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and products</li>
              <li>Send promotional emails (with your consent; you may unsubscribe at any time)</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">4. Sharing Your Information</h2>
            <p className="text-[16px] leading-[1.8] mb-4">We do not sell your personal information. We share data only with:</p>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li><strong>Stripe</strong> — payment processing (PCI-DSS compliant)</li>
              <li><strong>Supabase</strong> — order management database (encrypted at rest)</li>
              <li><strong>Google Analytics / GTM</strong> — aggregated website analytics</li>
              <li><strong>Meta (Facebook/Instagram)</strong> — ad performance tracking</li>
              <li><strong>Tawk.to</strong> — live chat customer support</li>
              <li><strong>Legal authorities</strong> — when required by law or court order</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-[16px] leading-[1.8] mb-4">We use cookies and similar tracking technologies for:</p>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8] mb-4">
              <li><strong>Essential cookies</strong> — required for the site to function</li>
              <li><strong>Analytics cookies</strong> — Google Analytics via GTM (aggregate traffic data)</li>
              <li><strong>Advertising cookies</strong> — Meta Pixel and Bing UET for ad measurement and remarketing</li>
              <li><strong>Chat cookies</strong> — Tawk.to live chat persistence</li>
            </ul>
            <p className="text-[16px] leading-[1.8]">
              You may disable cookies through your browser settings. Some features may not function correctly if cookies are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">6. Data Retention</h2>
            <p className="text-[16px] leading-[1.8]">
              We retain your personal information for as long as necessary to fulfill your order, provide customer support,
              and comply with legal obligations. Order records are kept for a minimum of 5 years for accounting and tax purposes.
              You may request deletion of your personal data at any time by contacting us at{" "}
              <a href="mailto:admin@pandapatches.com" className="text-panda-dark font-semibold underline">admin@pandapatches.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">7. Your Rights (GDPR / CCPA)</h2>
            <p className="text-[16px] leading-[1.8] mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-[16px] leading-[1.8]">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Correction</strong> — request correction of inaccurate data</li>
              <li><strong>Deletion</strong> — request erasure of your personal data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
              <li><strong>Opt-out</strong> — opt out of marketing communications at any time</li>
              <li><strong>Do Not Sell</strong> — California residents: we do not sell personal information</li>
            </ul>
            <p className="text-[16px] leading-[1.8] mt-4">
              To exercise these rights, email us at{" "}
              <a href="mailto:admin@pandapatches.com" className="text-panda-dark font-semibold underline">admin@pandapatches.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-[16px] leading-[1.8]">
              Our website is not directed at children under 13 years of age. We do not knowingly collect personal information
              from children under 13. If we discover that we have inadvertently collected such data, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">9. Security</h2>
            <p className="text-[16px] leading-[1.8]">
              We implement industry-standard security measures to protect your data, including SSL/TLS encryption, secure payment
              processing via Stripe, and encrypted database storage via Supabase. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">10. Third-Party Links</h2>
            <p className="text-[16px] leading-[1.8]">
              Our website may contain links to third-party websites (e.g., Instagram, Facebook, Trustpilot). This Privacy Policy
              does not apply to those sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">11. Changes to This Policy</h2>
            <p className="text-[16px] leading-[1.8]">
              We may update this Privacy Policy from time to time. Changes are effective when posted on this page.
              The &quot;Last Updated&quot; date at the top will reflect the most recent revision.
              Continued use of our website after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-[26px] font-black text-panda-dark mb-4">12. Contact Us</h2>
            <p className="text-[16px] leading-[1.8]">
              For privacy-related questions, data requests, or concerns, contact us:
            </p>
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
