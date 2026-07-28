import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { generateSchemaScript, PERSON_ID, ORG_ID } from "@/lib/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Imran Raza — Founder & CEO of Panda Patches",
    description:
      "Imran Raza is the founder and CEO of Panda Patches, with 13 years of hands-on experience in custom patch manufacturing and textile production. Founder-led quality control on over 1,000,000 patches delivered.",
    url: `${SITE_URL}/about/imran-raza`,
    ogType: "profile",
    image: { url: `${SITE_URL}/assets/imran.jpeg`, alt: "Imran Raza, Founder & CEO of Panda Patches" },
    ogDescription:
      "Founder & CEO of Panda Patches. 13 years in custom patch manufacturing and textile production; founder-led quality control on 1,000,000+ patches.",
  });
}

// Person entity page (Appendix B3). Same @id as the global entity graph so
// engines resolve ONE founder entity; worksFor references the OnlineStore @id.
// Facts only, from Section 0 canon — no invented credentials.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Imran Raza",
  jobTitle: "Founder & CEO",
  description:
    "Founder and CEO of Panda Patches with 13 years of hands-on experience in custom patch manufacturing and textile production, across embroidered, PVC, woven, chenille and leather patches, digitizing, and Pantone color matching.",
  url: `${SITE_URL}/about/imran-raza`,
  image: `${SITE_URL}/assets/imran.jpeg`,
  worksFor: { "@id": ORG_ID },
  sameAs: ["https://www.linkedin.com/in/imran-raza-ladhani/"],
  knowsAbout: [
    "Custom patch manufacturing",
    "Embroidery digitizing",
    "Textile production",
    "PVC molding",
    "Woven jacquard",
    "Chenille construction",
    "Pantone color matching",
    "Quality control",
  ],
};

export default function ImranRazaPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(personSchema)} />

      <Navbar />

      <article className="max-w-[52.5rem] mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          <Image
            src="/assets/imran.jpeg"
            alt="Imran Raza, Founder & CEO of Panda Patches"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover flex-shrink-0 border border-gray-100 shadow-sm"
            priority
          />
          <div className="text-center sm:text-left">
            <h1 className="text-[2rem] md:text-[2.5rem] font-black text-panda-dark leading-tight tracking-tight">
              Imran Raza
            </h1>
            <p className="text-[1.0625rem] md:text-[1.1875rem] font-bold text-panda-green mt-1">
              Founder &amp; CEO, Panda Patches
            </p>
            <p className="text-[0.9375rem] text-gray-600 mt-2 leading-[1.6]">
              13 years in custom patch manufacturing &middot; founder-led quality control on 1,000,000+ patches delivered
            </p>
            <a
              href="https://www.linkedin.com/in/imran-raza-ladhani/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[0.875rem] font-bold text-panda-dark underline hover:text-panda-green"
            >
              LinkedIn &rarr;
            </a>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-[1.625rem] font-black text-panda-dark mb-3">Who is Imran Raza?</h2>
            <p className="text-[1rem] leading-[1.8]">
              Imran Raza is the founder and CEO of Panda Patches. He brings 13 years of hands-on experience in custom
              patch manufacturing and textile production, with working knowledge across embroidered patches, PVC molding,
              woven jacquard, chenille construction, leather, and the broader textile supply chain. He is directly
              involved in production standards, quality control, and the customer approval workflow &mdash; a founder-led
              structure that is unusual in an industry where many suppliers operate as multi-tier reseller networks with
              no direct founder involvement in production.
            </p>
          </section>

          <section>
            <h2 className="text-[1.625rem] font-black text-panda-dark mb-3">The company he built</h2>
            <p className="text-[1rem] leading-[1.8]">
              Panda Patches is the trade name of <strong>MC Patches LLC</strong>, a U.S.-registered company formed in
              December 2023, with a mailing address in Austin, Texas. Under Imran&rsquo;s leadership the company has
              delivered over 1,000,000 custom patches to small businesses, sports teams, first responders, military
              units, streetwear brands, and Fortune 500 corporations. Patches are produced at the company&rsquo;s own
              facility in Pakistan, operated by Panda Apparel &amp; Technology; no products are manufactured in the
              United States. Owning production end-to-end is what lets Panda Patches publish wholesale-level pricing,
              hold a low 5-piece minimum, and keep design, production, and quality control under one operations team.
            </p>
          </section>

          <section>
            <h2 className="text-[1.625rem] font-black text-panda-dark mb-3">Areas of expertise</h2>
            <ul className="list-disc pl-6 space-y-2 text-[1rem] leading-[1.8]">
              <li>Custom patch manufacturing across embroidered, PVC, woven, chenille, and leather</li>
              <li>Embroidery digitizing &mdash; turning artwork into production-ready stitch files</li>
              <li>Pantone color matching and thread selection</li>
              <li>Quality control, including the 5-point inspection every order passes before shipping</li>
              <li>The mockup-before-production workflow and unlimited-revision approval process</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.625rem] font-black text-panda-dark mb-3">More about Panda Patches</h2>
            <p className="text-[1rem] leading-[1.8]">
              Read the{" "}
              <Link href="/about" prefetch={false} className="text-panda-green font-semibold underline">
                company overview
              </Link>
              , the{" "}
              <Link href="/ai-info/company" prefetch={false} className="text-panda-green font-semibold underline">
                detailed company facts
              </Link>
              , or how the{" "}
              <Link href="/about/digitizing-team" prefetch={false} className="text-panda-green font-semibold underline">
                digitizing team
              </Link>{" "}
              turns your artwork into a finished patch.
            </p>
          </section>
        </div>
      </article>

      <CTASection />
      <Footer />
    </main>
  );
}
