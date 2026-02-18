import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateFAQSchema, generateProductSchema, generateSchemaScript } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Custom Corporate Patches | Company Logo Patches | Panda Patches",
  description: "Custom corporate logo patches for businesses, brands, and employee uniforms. Embroidered company patches with no minimum order, free mockup, and 7-14 day turnaround.",
  keywords: [
    "custom corporate patches",
    "company logo patches",
    "custom business patches",
    "employee uniform patches",
    "branded patches",
    "promotional patches",
    "custom logo patches",
    "corporate embroidered patches",
    "wholesale company patches",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-corporate-patches" },
  openGraph: {
    title: "Custom Corporate & Company Logo Patches | Panda Patches",
    description: "Custom embroidered patches for businesses and brands. No minimum, free mockup, fast delivery. Trusted by Fortune 500 companies.",
    url: "https://pandapatches.com/custom-corporate-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Corporate Logo Patches",
  description: "Custom embroidered patches for corporate uniforms, branded merchandise, and promotional products. No minimum order, free design, fast turnaround.",
  image: "https://pandapatches.com/assets/logo-panda.svg",
  url: "https://pandapatches.com/custom-corporate-patches",
  priceRange: "$50-$2000",
  includeReviews: true,
});

const faqSchema = generateFAQSchema([
  {
    question: "What types of corporate patches do you make?",
    answer: "We make logo patches for uniforms, promotional merchandise, employee swag, trade show giveaways, and branded apparel. Available in embroidered, woven, PVC, and iron-on formats.",
  },
  {
    question: "Can you match our exact brand colors and logo?",
    answer: "Yes. We Pantone color-match your brand colors and replicate your logo with precision embroidery or PVC molding. We work from your vector files or raster artwork.",
  },
  {
    question: "Do you handle large corporate bulk orders?",
    answer: "Yes. We handle orders from 1 to 50,000+ pieces. Volume pricing applies for orders of 100+ pieces, and we offer dedicated account management for large corporate accounts.",
  },
  {
    question: "What is the turnaround time for corporate orders?",
    answer: "Standard production is 7-14 business days. For large corporate orders (1,000+), allow 2-3 weeks. Rush production is available.",
  },
]);

const PATCH_TYPES = [
  { title: "Logo Patches for Uniforms", desc: "Replicate your brand logo precisely on employee uniforms, workwear, and branded apparel. Iron-on or sew-on for easy application." },
  { title: "Promotional Patches", desc: "Trade show giveaways, event swag, and branded merchandise that recipients actually keep and display." },
  { title: "Employee Recognition Patches", desc: "Years-of-service patches, department badges, and achievement patches that build company culture and loyalty." },
  { title: "Woven Patches for Premium Brands", desc: "Ultra-fine detail and smooth texture for luxury brands and premium apparel lines. Woven thread at 200+ threads per inch." },
  { title: "PVC Patches for Outdoor Brands", desc: "Waterproof, durable, 3D PVC patches for outdoor and adventure brands. Perfect for gear, bags, and hard surfaces." },
  { title: "Iron-On Patches for Retail", desc: "Ready-to-apply iron-on patches for retail clothing brands and fashion labels. Minimum order from 1 piece." },
];

const BRANDS = ["Fortune 500 Companies", "Retail Clothing Brands", "Outdoor & Sporting Goods", "Food & Beverage Brands", "Technology Companies", "Healthcare & Medical", "Automotive Brands", "Hotels & Hospitality"];

export default function CorporatePatchesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      {/* HERO */}
      <section className="w-full bg-panda-dark pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-[900px] text-center">
          <p className="text-panda-yellow font-bold text-[14px] uppercase tracking-widest mb-4">Trusted by Fortune 500 Brands</p>
          <h1 className="text-[34px] md:text-[54px] font-black text-white leading-tight tracking-tight mb-6">
            Custom Corporate Patches
          </h1>
          <p className="text-[17px] md:text-[19px] text-gray-300 leading-[1.8] max-w-[700px] mx-auto mb-10">
            Embroidered company logo patches for uniforms, branded merchandise, and promotional products.
            Trusted by Google, Coca-Cola, Microsoft, and Nissan.
            No minimum order. Free mockup. 7–14 day turnaround.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#quote" className="inline-block bg-panda-yellow text-panda-dark font-black text-[16px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity">
              Get a Free Quote
            </Link>
            <Link href="/bulk-custom-patches" className="inline-block bg-white/10 text-white font-bold text-[16px] px-8 py-4 rounded-full hover:bg-white/20 transition-colors">
              Bulk Corporate Orders
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="w-full bg-panda-yellow py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-x-10 gap-y-2 text-panda-dark font-bold text-[14px] text-center">
          <span>★ 4.7/5 on Trustpilot</span>
          <span>✓ Pantone Color Matching</span>
          <span>✓ No Minimum Order</span>
          <span>✓ Free Digital Mockup</span>
          <span>✓ Volume Pricing Available</span>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="w-full py-12 bg-[#F6F6F6]">
        <div className="container mx-auto px-4 max-w-[900px] text-center">
          <p className="text-[15px] font-bold text-gray-500 uppercase tracking-wider mb-6">Serving businesses across all industries:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {BRANDS.map((brand) => (
              <span key={brand} className="bg-white border border-gray-200 text-panda-dark font-semibold text-[14px] px-4 py-2 rounded-full">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PATCH TYPES */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-14">
            Corporate Patch Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PATCH_TYPES.map((type, idx) => (
              <div key={idx} className="border border-gray-100 rounded-2xl p-7 hover:shadow-lg transition-shadow">
                <h3 className="text-[18px] font-black text-panda-dark mb-3">{type.title}</h3>
                <p className="text-[15px] text-gray-600 leading-[1.7]">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO COPY */}
      <section className="w-full py-20 bg-[#F6F6F6]">
        <div className="container mx-auto px-4 max-w-[900px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-10">
            Why Brands Choose Panda Patches
          </h2>
          <div className="space-y-5 text-[16px] text-gray-700 leading-[1.8]">
            <p>
              Brands like Google, Coca-Cola, Microsoft, and Nissan have trusted Panda Patches for their custom patch
              needs. Founded by <strong>Imran Raza</strong> with 13 years of textile and embroidery expertise, we
              understand that brand consistency is non-negotiable. Every stitch, every color, every edge must match
              your brand standards precisely.
            </p>
            <p>
              We produce <strong>custom corporate patches</strong> in embroidered, woven, PVC, and iron-on formats.
              Our Pantone color-matching system ensures your brand colors are reproduced accurately across all patch
              types. Vector files, brand guidelines, and style guides are welcome — we work with your existing assets.
            </p>
            <p>
              For large corporate accounts, we offer <strong>volume pricing</strong>, dedicated account management,
              and sample approval for orders of 500+ pieces. Our standard minimum is 1 piece — meaning you can test
              designs before committing to a large run.
            </p>
          </div>
        </div>
      </section>

      <ProcessSection />

      {/* FAQ */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[800px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-12">
            Corporate Patch FAQs
          </h2>
          <div className="space-y-6">
            {[
              { q: "Can you match our Pantone brand colors exactly?", a: "Yes. We use Pantone color-matching to replicate your brand colors precisely across all embroidery and PVC patches." },
              { q: "Do you handle large corporate bulk orders?", a: "Yes. We handle orders from 1 to 50,000+ pieces with volume pricing for 100+ pieces and dedicated account management for large accounts." },
              { q: "What file formats do you accept for artwork?", a: "We accept AI, EPS, PDF, PSD, PNG, and JPG files. Vector files produce the best results. We also offer free design services if you need help." },
              { q: "Do you offer sample patches before the full production run?", a: "Yes. For orders of 500+ pieces, we provide a free physical sample for approval before full production." },
              { q: "What is your turnaround time for corporate orders?", a: "Standard is 7-14 business days. Large orders (1,000+) may take 2-3 weeks. Rush production available." },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6">
                <h3 className="text-[17px] font-bold text-panda-dark mb-2">{item.q}</h3>
                <p className="text-[15px] text-gray-600 leading-[1.7]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
