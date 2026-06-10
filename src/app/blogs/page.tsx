import type { Metadata } from "next";
import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import BlogListClient from "@/components/blog/BlogListClient";
import { generateSchemaScript, generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Blog", url: "https://www.pandapatches.com/blogs" },
]);

// ISR: Revalidate blog listing every 30 minutes (blogs update frequently)
export const revalidate = 1800;

// SEO Metadata for Blogs Page
export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patch Blog - Tips, Guides & Industry News | Panda Patches",
  description: "Read expert guides on custom patches, embroidery tips, design ideas, and industry trends. Learn about patch types, backing options, and more.",
  url: "https://www.pandapatches.com/blogs",
  image: {
    url: "https://www.pandapatches.com/assets/og-image.png",
    width: 1200,
    height: 630,
    alt: "Panda Patches Blog",
  },
  ogTitle: "Custom Patch Blog - Tips & Guides | Panda Patches",
  ogDescription: "Expert guides on custom patches, embroidery tips, design ideas, and industry trends from Panda Patches.",
  twitterTitle: "Custom Patch Blog | Panda Patches",
  twitterDescription: "Expert guides on custom patches, embroidery tips, and design ideas.",
});

// Fetch ALL blogs (sorted by newest) with only needed fields.
// Coalesces mainImage and image: some posts use one, some use the other (a
// historical migration left both shapes in production). Without the
// coalesce, posts that only have mainImage rendered with a blank tile on
// /blogs (T12). Picking the first non-null preserves whichever field the
// editor used.
async function getBlogs() {
  const query = `*[_type == "blog"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    excerpt,
    slug,
    "image": coalesce(mainImage, image),
    category,
    tags,
    publishedAt,
    _createdAt,
    _updatedAt
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  const collectionSchema = generateCollectionPageSchema(
    (blogs || []).map((b: any) => ({
      title: b.title || 'Blog Post',
      url: `https://www.pandapatches.com/${b.slug?.current || b.slug}`,
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
            Guides &amp; Tips for Custom Patches
          </h1>

          <BlogListClient blogs={blogs} />

        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
