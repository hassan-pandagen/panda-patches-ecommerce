import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript } from "@/lib/schemas";
import { client } from "@/lib/sanity";

// Chenille Glitter-specific FAQs
const chenilleGlitterFAQs = [
  {
    question: "What are chenille glitter patches?",
    answer: "Chenille glitter patches combine the soft, raised texture of traditional chenille thread with embedded glitter accents or glitter thread woven into the design. The result is a bold, eye-catching patch that has both dimensional texture and sparkle, popular for dance teams, cheer squads, fashion brands, and custom apparel."
  },
  {
    question: "Does the glitter fall off or fade over time?",
    answer: "No. We use high-quality glitter thread and sealed glitter elements that are integrated into the patch during production, not applied on top as a coating. This means the sparkle is built in and does not peel, flake, or fade with normal use and washing."
  },
  {
    question: "Can I choose specific glitter colors?",
    answer: "Yes! We offer a wide range of glitter thread colors including gold, silver, holographic, rose gold, red, blue, green, and more. You can mix glitter accents with solid chenille areas to create a multi-dimensional design that stands out."
  },
  {
    question: "What fabrics work best with chenille glitter patches?",
    answer: "Chenille glitter patches work on most fabrics including cotton, denim, polyester, and fleece. They are popular on jackets, hoodies, cheer uniforms, dance costumes, backpacks, and hats. For stretchy fabrics, we recommend sew-on backing for the most secure hold."
  },
  {
    question: "Are chenille glitter patches suitable for cheer and dance uniforms?",
    answer: "Absolutely. Chenille glitter patches are a favorite for cheer squads, dance teams, and performance uniforms because the sparkle shows up beautifully under stage lighting. We can match your team colors and add glitter accents to letters, logos, or any custom shape."
  },
  {
    question: "What is the minimum order for chenille glitter patches?",
    answer: "There is no minimum order. We accommodate single-piece custom orders as well as large bulk runs. Volume pricing starts at 50+ pieces with additional savings at 100+, 500+, and 1,000+ pieces."
  },
  {
    question: "How do I care for chenille glitter patches?",
    answer: "We recommend cold machine wash on a gentle cycle or hand washing. Turn the garment inside out before washing and avoid high heat in the dryer. This preserves the glitter thread and chenille texture for long-term use."
  },
  {
    question: "What sizes and shapes are available for chenille glitter patches?",
    answer: "Any size and shape is available. We produce chenille glitter patches in letters, numbers, logos, mascots, stars, shields, and fully custom die-cut shapes. Send us your design or idea and we will create a free digital mockup before production begins."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
async function getChenilleGlitterPageData() {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-chenille-glitter-patches"][0] {
        "heroImage": {
          "url": heroImage.asset->url,
          "alt": heroImage.alt
        },
        "workSamples": workSamples[]{
          "image": @,
          "alt": alt
        },
        seoHeading,
        seoContent
      },
      "hero": *[_type == "hero"][0] {
        "trustBadges": trustBadges[] {
          "url": image.asset->url,
          "alt": alt
        }
      }
    }`;
    const data = await client.fetch(query);
    return {
      heroImage: data?.categoryData?.heroImage?.url || null,
      workSamples: data?.categoryData?.workSamples || [],
      trustBadges: data?.hero?.trustBadges || [],
      seoHeading: data?.categoryData?.seoHeading || null,
      seoContent: data?.categoryData?.seoContent || null,
    };
  } catch (error) {
    console.error("Chenille Glitter page data fetch error:", error);
    return { heroImage: null, workSamples: [], trustBadges: [], seoHeading: null, seoContent: null };
  }
}

export const metadata: Metadata = {
  title: "Custom Chenille Glitter Patches - Sparkle & Texture Combined",
  description: "Custom chenille glitter patches with embedded sparkle thread for cheer squads, dance teams, and fashion brands. Bold texture, long-lasting glitter, no minimum, free mockup.",
  keywords: [
    "custom chenille glitter patches",
    "chenille glitter patches",
    "glitter chenille patches",
    "custom glitter patches",
    "glitter iron on patches",
    "sparkle patches",
    "custom bling patches",
    "glitter letter patches",
    "glitter varsity patches",
    "cheer squad patches",
    "dance team patches",
    "custom glitter iron on patches",
    "bling patches",
    "glitter embroidered patches",
    "holographic patches",
    "sequin patches custom",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-chenille-glitter-patches" },
  openGraph: {
    title: "Custom Chenille Glitter Patches | Panda Patches",
    description: "Custom chenille glitter patches with bold sparkle for cheer squads, dance teams, and fashion brands. No minimum, free mockup.",
    url: "https://pandapatches.com/custom-chenille-glitter-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Chenille Glitter Patches",
  description: "Custom chenille patches with embedded glitter thread for cheer squads, dance teams, fashion brands, and custom apparel.",
  brand: {
    "@type": "Brand",
    name: "Panda Patches",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "1.75",
    highPrice: "9.00",
    offerCount: "6",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1200",
    bestRating: "5",
  },
};

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://pandapatches.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Custom Chenille Glitter Patches",
      item: "https://pandapatches.com/custom-chenille-glitter-patches",
    },
  ],
};

export default async function ChenilleGlitterPatchesPage() {
  const { workSamples, heroImage, trustBadges, seoHeading, seoContent } = await getChenilleGlitterPageData();

  return (
    <main className="min-h-screen bg-white">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(productSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Bulk Orders", href: "/bulk-custom-patches" }
        ]}
        currentPage="Chenille Glitter Patches"
      />

      {/* 1. HERO */}
      <BulkHero
        heroImage={heroImage}
        trustBadges={trustBadges}
        customHeading="Custom Chenille Glitter Patches"
        customSubheading="Bold Sparkle Meets Classic Chenille Texture"
        customDescription="Stand out with patches that have both dimension and dazzle. Our chenille glitter patches weave high-quality glitter thread directly into the design, creating a raised, sparkly finish that performs under stage lights and everyday wear. Loved by cheer squads, dance teams, and fashion brands. No minimum. Free mockup. 2-week turnaround."
      />

      {/* 2. WORK GALLERY */}
      <WorkGallery samples={workSamples} />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. CHENILLE GLITTER FAQ */}
      <CategoryFAQ title="Chenille Glitter Patches FAQ" faqs={chenilleGlitterFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Chenille Glitter Patches: Sparkle, Texture and Lasting Quality
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking for <strong>custom chenille glitter patches</strong> that make a real statement? Panda Patches creates high-quality <strong>glitter chenille patches</strong> for cheer squads, dance teams, fashion brands, schools, and anyone who wants their patches to shine.
            </p>
            <p>
              Our <strong>chenille glitter patches</strong> use glitter thread woven directly into the design during production. Unlike surface-applied glitter that chips and flakes off, our embedded glitter thread stays in place through washing and wear. The result is a patch with the classic soft, raised chenille texture plus <strong>permanent sparkle</strong> that holds up in real life.
            </p>
            <p>
              We produce <strong>custom glitter letter patches</strong>, <strong>glitter varsity patches</strong>, team logo patches, and any custom shape you can imagine. We offer gold glitter, silver glitter, holographic glitter, rose gold, and a full range of colors to match your team or brand palette perfectly.
            </p>
            <p>
              Whether you need <strong>glitter patches for cheer uniforms</strong>, <strong>custom bling patches</strong> for a fashion line, or <strong>sparkle patches</strong> for a school event, Panda Patches delivers with <strong>no minimum orders</strong>, <strong>free design mockups</strong>, and a reliable <strong>2-week turnaround</strong>.
            </p>
            <p>
              Ready to get started? <a href="#bulk-quote" className="text-panda-green font-bold underline">Get your free quote</a> today. We respond within 2 business hours and include a complimentary digital mockup with every inquiry.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
