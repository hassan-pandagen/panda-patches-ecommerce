import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateFAQSchema, generateProductSchema, generateSchemaScript } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Custom Fire Department Patches | Firefighter Patches | Panda Patches",
  description: "Custom fire department patches for firefighters, EMTs, and fire rescue units. Embroidered, PVC, and velcro options. No minimum order, free mockup, 7-14 day delivery.",
  keywords: [
    "custom fire department patches",
    "firefighter patches",
    "fire dept patches",
    "custom fire rescue patches",
    "EMT patches",
    "fire department velcro patches",
    "firefighter name patches",
    "custom fire patches bulk",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-fire-department-patches" },
  openGraph: {
    title: "Custom Fire Department Patches | Panda Patches",
    description: "High-quality custom patches for fire departments, firefighters, and EMTs. Free mockup, no minimum order.",
    url: "https://pandapatches.com/custom-fire-department-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Fire Department Patches",
  description: "Custom embroidered and PVC patches for fire departments, firefighters, and EMTs. No minimum order, free design, 7-14 day turnaround.",
  image: "https://pandapatches.com/assets/logo-panda.svg",
  url: "https://pandapatches.com/custom-fire-department-patches",
  priceRange: "$50-$500",
  includeReviews: true,
});

const faqSchema = generateFAQSchema([
  {
    question: "What types of patches do you make for fire departments?",
    answer: "We make embroidered, PVC, velcro, woven, and iron-on patches for fire departments. Common types include station patches, rank patches, name patches, helmet decals, and commemorative patches.",
  },
  {
    question: "Do you offer velcro backing for firefighter patches?",
    answer: "Yes. We offer hook-and-loop (velcro) backing for all patch types. This is the most popular option for firefighter gear, helmets, and tactical vests.",
  },
  {
    question: "What is the minimum order for fire department patches?",
    answer: "There is no minimum order. Whether you need 5 patches for your crew or 5,000 for your department, we handle all order sizes.",
  },
  {
    question: "How long does it take to produce fire department patches?",
    answer: "Standard production time is 7-14 business days after artwork approval. Rush 7-day production is available for urgent orders.",
  },
  {
    question: "Can you match our department's specific colors?",
    answer: "Yes. We color-match to Pantone standards and can replicate your department's exact colors, badges, and insignia.",
  },
]);

const PATCH_TYPES = [
  { title: "Station & Unit Patches", desc: "Identify your station, battalion, or unit with precision-embroidered patches. Custom shapes, colors, and badge designs." },
  { title: "Rank Patches", desc: "Captain, Lieutenant, Engineer, Firefighter — clear rank identification with durable embroidered or woven patches." },
  { title: "Name Patches", desc: "Personalized firefighter name patches in embroidered or woven styles. Sew-on, velcro, or iron-on backing." },
  { title: "Helmet & Gear Patches", desc: "PVC and embroidered patches designed to withstand heat, moisture, and heavy use on helmets and turnout gear." },
  { title: "Commemorative Patches", desc: "Honor fallen heroes, mark anniversaries, or celebrate department milestones with collectible patches." },
  { title: "Tactical Velcro Patches", desc: "Hook-and-loop patches for vests, jackets, and bags. Interchangeable and built to last in demanding conditions." },
];

export default function FireDepartmentPatchesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      {/* HERO */}
      <section className="w-full bg-panda-dark pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-[900px] text-center">
          <p className="text-panda-yellow font-bold text-[14px] uppercase tracking-widest mb-4">Trusted by Fire Departments Nationwide</p>
          <h1 className="text-[34px] md:text-[54px] font-black text-white leading-tight tracking-tight mb-6">
            Custom Fire Department Patches
          </h1>
          <p className="text-[17px] md:text-[19px] text-gray-300 leading-[1.8] max-w-[700px] mx-auto mb-10">
            High-quality embroidered, PVC, and velcro patches for fire departments, firefighters, and EMTs.
            No minimum order. Free mockup. 7–14 day turnaround.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#quote"
              className="inline-block bg-panda-yellow text-panda-dark font-black text-[16px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/bulk-custom-patches"
              className="inline-block bg-white/10 text-white font-bold text-[16px] px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
            >
              Bulk Orders (50+)
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
          <span>✓ 7-14 Day Turnaround</span>
          <span>✓ Velcro, Iron-On & Sew-On</span>
        </div>
      </section>

      {/* PATCH TYPES */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-14">
            Patch Types for Fire Departments
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

      {/* WHY CHOOSE US */}
      <section className="w-full py-20 bg-[#F6F6F6]">
        <div className="container mx-auto px-4 max-w-[900px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-10">
            Why Fire Departments Choose Panda Patches
          </h2>
          <div className="space-y-5 text-[16px] text-gray-700 leading-[1.8]">
            <p>
              Fire departments across the United States trust Panda Patches for their custom patch needs.
              Founded by <strong>Imran Raza</strong> with 13 years of textile and embroidery expertise, we understand
              that every detail of a fire department patch carries meaning — from the color of a rank stripe to the
              precision of a department seal.
            </p>
            <p>
              We produce <strong>custom fire department patches</strong> in embroidered, PVC, woven, and iron-on formats.
              Our patches withstand the rigors of the job — heat, moisture, and heavy use — while maintaining their
              color and structure. Hook-and-loop (velcro) backing is our most popular option for turnout gear and tactical vests.
            </p>
            <p>
              Whether you need <strong>1 commemorative patch</strong> for a retirement ceremony or <strong>500 station patches</strong>
              for a department-wide rollout, we deliver the same quality and care. Free digital mockup included with every order.
              Color-matched to your department&apos;s official colors.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <ProcessSection />

      {/* FAQ */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[800px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-12">
            Fire Department Patch FAQs
          </h2>
          <div className="space-y-6">
            {[
              { q: "What types of patches do you make for fire departments?", a: "We make embroidered, PVC, velcro, woven, and iron-on patches. Common types include station patches, rank patches, name patches, helmet patches, and commemorative patches." },
              { q: "Is there a minimum order quantity?", a: "No minimum. Order 1 or 10,000 — same quality, same service." },
              { q: "Do you offer velcro backing?", a: "Yes. Hook-and-loop (velcro) is our most popular backing for fire department patches. It works on gear, vests, helmets, and bags." },
              { q: "Can you match our department's exact colors?", a: "Yes. We Pantone color-match to replicate your department's official colors, seals, and badge designs accurately." },
              { q: "How long does production take?", a: "Standard production is 7-14 business days after mockup approval. Rush 7-day production is available." },
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
