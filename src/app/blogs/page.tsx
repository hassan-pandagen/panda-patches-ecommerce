import { Metadata } from 'next';
import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import BlogListClient from "@/components/blog/BlogListClient";
import { generateSchemaScript, generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/schemas";

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://pandapatches.com" },
  { name: "Blog", url: "https://pandapatches.com/blogs" },
]);

// ISR: Revalidate blog listing every 30 minutes (blogs update frequently)
export const revalidate = 1800;

// SEO Metadata for Blogs Page
export const metadata: Metadata = {
  title: "Custom Patch Blog - Tips, Guides & Industry News | Panda Patches",
  description: "Read expert guides on custom patches, embroidery tips, design ideas, and industry trends. Learn about patch types, backing options, and more.",
  openGraph: {
    title: "Custom Patch Blog - Tips & Guides | Panda Patches",
    description: "Expert guides on custom patches, embroidery tips, design ideas, and industry trends from Panda Patches.",
    type: "website",
    url: "https://pandapatches.com/blogs",
    images: [
      {
        url: "https://pandapatches.com/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Panda Patches Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Patch Blog | Panda Patches",
    description: "Expert guides on custom patches, embroidery tips, and design ideas.",
    images: ["https://pandapatches.com/assets/og-image.png"]
  },
  alternates: {
    canonical: "https://pandapatches.com/blogs"
  }
};

// Fetch ALL blogs (sorted by newest) with only needed fields
async function getBlogs() {
  const query = `*[_type == "blog"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    excerpt,
    slug,
    image,
    category,
    tags,
    publishedAt,
    _createdAt
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  const collectionSchema = generateCollectionPageSchema(
    (blogs || []).map((b: any) => ({
      title: b.title || 'Blog Post',
      url: `https://pandapatches.com/${b.slug?.current || b.slug}`,
    }))
  );

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(collectionSchema)}
      />
      <Navbar />

      <section className="w-full py-16 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 max-w-[1200px]">

          {/* PAGE TITLE */}
          <h1 className="text-[24px] md:text-[50px] font-black text-center text-panda-dark uppercase mb-20 tracking-tight">
            Our Blogs
          </h1>

          <BlogListClient blogs={blogs} />

        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
