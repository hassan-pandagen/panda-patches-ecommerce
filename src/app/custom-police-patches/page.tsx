import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateFAQSchema, generateProductSchema, generateSchemaScript } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Custom Police Patches | Law Enforcement Patches | Panda Patches",
  description: "Custom police patches for law enforcement agencies, sheriff departments, and security teams. Embroidered, PVC, and velcro options. No minimum, free mockup, 7-14 day delivery.",
  keywords: [
    "custom police patches",
    "law enforcement patches",
    "sheriff department patches",
    "custom tactical patches",
    "police velcro patches",
    "custom morale patches police",
    "law enforcement name patches",
    "custom security patches",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-police-patches" },
  openGraph: {
    title: "Custom Police & Law Enforcement Patches | Panda Patches",
    description: "Custom patches for police, sheriff, and law enforcement agencies. No minimum order, free mockup, fast delivery.",
    url: "https://pandapatches.com/custom-police-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Police & Law Enforcement Patches",
  description: "Custom embroidered, PVC, and velcro patches for police departments, sheriff offices, and law enforcement agencies. No minimum order.",
  image: "https://pandapatches.com/assets/logo-panda.svg",
  url: "https://pandapatches.com/custom-police-patches",
  priceRange: "$50-$500",
  includeReviews: true,
});

const faqSchema = generateFAQSchema([
  {
    question: "What types of patches do you make for police departments?",
    answer: "We make embroidered, PVC, velcro, and woven patches for police and law enforcement. Common types include department shoulder patches, rank patches, unit patches, K9 patches, SWAT patches, and name patches.",
  },
  {
    question: "Can you replicate our department's official seal or badge on a patch?",
    answer: "Yes. We can replicate official department seals, badges, and insignia with precision embroidery. We Pantone color-match to your official department colors.",
  },
  {
    question: "Do you offer PVC patches for law enforcement?",
    answer: "Yes. PVC patches are a popular choice for tactical gear, plate carriers, and helmets. They are waterproof, durable, and hold fine detail better than embroidery for complex designs.",
  },
  {
    question: "What is the minimum order for police patches?",
    answer: "No minimum order. We produce patches for individual officers as well as bulk orders for entire departments.",
  },
]);

const PATCH_TYPES = [
  { title: "Department Shoulder Patches", desc: "Classic embroidered shoulder patches with your department name, seal, and state. Precise color matching and professional finish." },
  { title: "Rank & Chevron Patches", desc: "Officer, Detective, Sergeant, Lieutenant, Captain — clear rank identification in embroidered or woven styles." },
  { title: "Unit & Division Patches", desc: "SWAT, K9, Narcotics, Traffic — specialized unit identification patches for distinct teams within your department." },
  { title: "Tactical PVC Patches", desc: "Waterproof and durable PVC patches for plate carriers, tactical vests, helmets, and bags. Perfect for field operations." },
  { title: "Name Patches", desc: "Officer name patches for uniforms in embroidered or woven style. Sew-on, velcro, or iron-on backing options." },
  { title: "Morale Patches", desc: "Custom morale patches for police teams — unit pride, humor, and esprit de corps. Hook-and-loop backing for easy swapping." },
];

export default function PolicePatchesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      {/* HERO */}
      <section className="w-full bg-panda-dark pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-[900px] text-center">
          <p className="text-panda-yellow font-bold text-[14px] uppercase tracking-widest mb-4">Trusted by Law Enforcement Agencies</p>
          <h1 className="text-[34px] md:text-[54px] font-black text-white leading-tight tracking-tight mb-6">
            Custom Police &amp; Law Enforcement Patches
          </h1>
          <p className="text-[17px] md:text-[19px] text-gray-300 leading-[1.8] max-w-[700px] mx-auto mb-10">
            Professional embroidered, PVC, and velcro patches for police departments, sheriff offices, and security agencies.
            No minimum order. Free mockup. 7–14 day turnaround.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#quote" className="inline-block bg-panda-yellow text-panda-dark font-black text-[16px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity">
              Get a Free Quote
            </Link>
            <Link href="/custom-tactical-patches" className="inline-block bg-white/10 text-white font-bold text-[16px] px-8 py-4 rounded-full hover:bg-white/20 transition-colors">
              View Tactical Patches
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="w-full bg-panda-yellow py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-x-10 gap-y-2 text-panda-dark font-bold text-[14px] text-center">
          <span>★ 4.7/5 on Trustpilot</span>
          <span>✓ No Minimum Order</span>
          <span>✓ Free Digital Mockup</span>
          <span>✓ Pantone Color Matching</span>
          <span>✓ PVC + Embroidered Options</span>
        </div>
      </section>

      {/* PATCH TYPES */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-14">
            Patch Types for Law Enforcement
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
            Why Law Enforcement Chooses Panda Patches
          </h2>
          <div className="space-y-5 text-[16px] text-gray-700 leading-[1.8]">
            <p>
              Law enforcement agencies trust Panda Patches because accuracy matters. Your department&apos;s patch is
              more than a logo — it&apos;s a symbol of service, accountability, and professionalism. Founded by{" "}
              <strong>Imran Raza</strong>, with 13 years of patch and textile manufacturing expertise, we ensure
              every patch meets your exact specifications.
            </p>
            <p>
              We produce <strong>custom police patches</strong> and <strong>law enforcement patches</strong> in embroidered,
              PVC, woven, and iron-on formats. Our embroidery machines achieve thread counts and detail levels that capture
              even the finest badge elements. PVC patches are available for tactical and field use where waterproofing and
              durability are essential.
            </p>
            <p>
              No minimum order — order patches for one officer or an entire department. Free digital mockup with every
              order, Pantone color matching, and unlimited revisions until your design is perfect.
            </p>
          </div>
        </div>
      </section>

      <ProcessSection />

      {/* FAQ */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[800px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-12">
            Law Enforcement Patch FAQs
          </h2>
          <div className="space-y-6">
            {[
              { q: "Can you replicate our department seal or badge?", a: "Yes. We replicate official seals, badges, and insignia with precision embroidery and Pantone color matching to your official department colors." },
              { q: "Do you offer PVC patches for tactical use?", a: "Yes. PVC patches are waterproof, durable, and ideal for plate carriers, helmets, and tactical bags." },
              { q: "What is the minimum order?", a: "No minimum. We serve individual officers and full department bulk orders with equal quality and service." },
              { q: "How long does production take?", a: "Standard is 7-14 business days after mockup approval. Rush 7-day production is available." },
              { q: "Do you do velcro backing for police patches?", a: "Yes. Hook-and-loop velcro is available on all patch types. Most popular for uniforms and tactical vests." },
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
