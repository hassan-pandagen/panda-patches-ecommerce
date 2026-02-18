import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateFAQSchema, generateProductSchema, generateSchemaScript } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Custom Sports Team Patches | Sports Uniform Patches | Panda Patches",
  description: "Custom sports patches for teams, leagues, and clubs. Embroidered uniform patches, jersey numbers, varsity letters, and championship patches. No minimum, free mockup.",
  keywords: [
    "custom sports patches",
    "sports team patches",
    "custom team patches",
    "embroidered sports patches",
    "custom jersey patches",
    "varsity letter patches",
    "championship patches",
    "custom uniform patches",
    "baseball patches",
    "football patches",
    "soccer patches",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-sports-patches" },
  openGraph: {
    title: "Custom Sports Team Patches | Panda Patches",
    description: "Custom embroidered patches for sports teams, leagues, and clubs. No minimum order, free mockup, fast delivery.",
    url: "https://pandapatches.com/custom-sports-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Sports Team Patches",
  description: "Custom embroidered patches for sports teams, leagues, and athletic clubs. Uniform patches, championship patches, varsity letters. No minimum order.",
  image: "https://pandapatches.com/assets/logo-panda.svg",
  url: "https://pandapatches.com/custom-sports-patches",
  priceRange: "$50-$500",
  includeReviews: true,
});

const faqSchema = generateFAQSchema([
  {
    question: "What sports team patches do you make?",
    answer: "We make patches for football, baseball, basketball, soccer, hockey, wrestling, swimming, tennis, and any sport. Types include team logo patches, number patches, varsity letters, championship patches, and uniform patches.",
  },
  {
    question: "Can you make patches for youth sports leagues?",
    answer: "Yes. We serve youth leagues, high school teams, college clubs, and professional organizations. No minimum order — perfect for small teams.",
  },
  {
    question: "What backing is best for sports uniform patches?",
    answer: "Iron-on backing is the most popular for jerseys and uniforms — apply with a household iron. Sew-on backing provides the most durability for heavy-use athletic wear.",
  },
  {
    question: "Can you make championship patches?",
    answer: "Yes. We specialize in championship, trophy, and award patches for leagues and tournaments. Custom shapes, metallic threads, and premium embroidery available.",
  },
]);

const PATCH_TYPES = [
  { title: "Team Logo Patches", desc: "Bring your team mascot, logo, and colors to life with precision embroidery. Perfect for jerseys, jackets, and bags." },
  { title: "Varsity Letter Patches", desc: "Traditional chenille or embroidered varsity letters for high school and college athletic programs." },
  { title: "Championship Patches", desc: "Commemorate victories with custom championship patches. Metallic threads, custom shapes, premium quality." },
  { title: "Uniform Number Patches", desc: "Embroidered or woven number patches for jerseys and uniforms. Heat-press iron-on for easy application." },
  { title: "League & Club Patches", desc: "Identify your league division, club affiliation, or conference with distinctive embroidered patches." },
  { title: "Award & Recognition Patches", desc: "MVP, most improved, all-star — custom award patches for recognizing athletes and celebrating achievement." },
];

const SPORTS = ["Football", "Baseball", "Basketball", "Soccer", "Hockey", "Wrestling", "Swimming", "Tennis", "Lacrosse", "Softball", "Volleyball", "Track & Field"];

export default function SportsPatchesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      {/* HERO */}
      <section className="w-full bg-panda-dark pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-[900px] text-center">
          <p className="text-panda-yellow font-bold text-[14px] uppercase tracking-widest mb-4">For Teams of Every Size</p>
          <h1 className="text-[34px] md:text-[54px] font-black text-white leading-tight tracking-tight mb-6">
            Custom Sports Team Patches
          </h1>
          <p className="text-[17px] md:text-[19px] text-gray-300 leading-[1.8] max-w-[700px] mx-auto mb-10">
            Custom embroidered patches for sports teams, leagues, and athletic clubs.
            Jersey patches, championship patches, varsity letters, and more.
            No minimum order. Free mockup. 7–14 day delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#quote" className="inline-block bg-panda-yellow text-panda-dark font-black text-[16px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity">
              Get a Free Quote
            </Link>
            <Link href="/bulk-custom-patches" className="inline-block bg-white/10 text-white font-bold text-[16px] px-8 py-4 rounded-full hover:bg-white/20 transition-colors">
              Bulk Team Orders
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
          <span>✓ Iron-On & Sew-On Options</span>
          <span>✓ Varsity Chenille Available</span>
        </div>
      </section>

      {/* SPORTS LIST */}
      <section className="w-full py-12 bg-[#F6F6F6]">
        <div className="container mx-auto px-4 max-w-[900px] text-center">
          <p className="text-[15px] font-bold text-gray-500 uppercase tracking-wider mb-6">We make patches for every sport including:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SPORTS.map((sport) => (
              <span key={sport} className="bg-white border border-gray-200 text-panda-dark font-semibold text-[14px] px-4 py-2 rounded-full">
                {sport}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PATCH TYPES */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-14">
            Sports Patch Types
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
            Patches Built for Athletic Excellence
          </h2>
          <div className="space-y-5 text-[16px] text-gray-700 leading-[1.8]">
            <p>
              From youth recreational leagues to professional clubs, sports teams across the United States choose
              Panda Patches for their custom uniform and award patches. Our founder <strong>Imran Raza</strong> has
              13 years of embroidery and textile manufacturing expertise — the same level of precision that goes into
              every sports team patch we produce.
            </p>
            <p>
              We understand that sports patches serve multiple purposes: team identity, player recognition, milestone
              commemoration, and fan merchandise. That&apos;s why we offer the full range of embroidery styles —
              flat embroidery, 3D puff, chenille, and metallic threads — to match the prestige of each application.
            </p>
            <p>
              For uniform patches, iron-on backing allows coaches and players to apply patches at home. For championship
              patches and award patches, we recommend sew-on backing for the most durable attachment to letterman jackets
              and athletic bags.
            </p>
          </div>
        </div>
      </section>

      <ProcessSection />

      {/* FAQ */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[800px]">
          <h2 className="text-[26px] md:text-[38px] font-black text-panda-dark text-center uppercase tracking-tight mb-12">
            Sports Patch FAQs
          </h2>
          <div className="space-y-6">
            {[
              { q: "What sports do you make patches for?", a: "All of them — football, baseball, basketball, soccer, hockey, wrestling, swimming, tennis, lacrosse, track and field, and more." },
              { q: "What's the best backing for jersey patches?", a: "Iron-on backing is most popular for jerseys and uniforms. Sew-on provides the most durability for heavy-use athletic wear." },
              { q: "Do you make championship patches?", a: "Yes. Championship, trophy, and award patches with custom shapes, metallic threads, and premium embroidery." },
              { q: "Can you do varsity letters?", a: "Yes. Traditional chenille and embroidered varsity letters for high school and college athletic programs." },
              { q: "Is there a minimum order?", a: "No minimum. We work with small youth teams and large leagues equally." },
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
