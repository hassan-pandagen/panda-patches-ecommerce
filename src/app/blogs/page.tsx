import type { Metadata } from "next";
import { client } from "@/lib/sanity";
import { REDIRECTED_SLUGS } from "@/lib/redirectedSlugs";
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

/**
 * Per-page metadata, because /blogs?page=2 is a different page from /blogs.
 *
 * It used to be one static object, so every paginated URL would have claimed
 * /blogs as its canonical — five URLs insisting they were the same page, which
 * is how a paginated series turns into a duplicate-content problem. Page one
 * keeps the clean /blogs canonical; the rest canonicalise to themselves and say
 * so in the title, so a result for page three does not look like the homepage
 * of the blog.
 */
function pageNumber(v: string | string[] | undefined): number {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n > 1 ? n : 1;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const page = pageNumber((await searchParams).page);
  const base = buildPageMetadata({
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
  if (page === 1) return base;
  return {
    ...base,
    title: `Custom Patch Blog - Page ${page} | Panda Patches`,
    alternates: { canonical: `https://www.pandapatches.com/blogs?page=${page}` },
    // Deeper pages are navigation, not destinations. Followed so the posts on
    // them are discovered, not indexed so they do not compete with the posts
    // themselves for the queries those posts answer.
    robots: { index: false, follow: true },
  };
}

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
  // Drop anything that 301s. Listing a card for a redirecting URL shows the
  // reader a post that is not at that address — which is how the duplicate
  // soccer guide stayed visible on page 2 for a week after it was redirected
  // and removed from the sitemap.
  return (data || []).filter(
    (b: any) => !REDIRECTED_SLUGS.has(b?.slug?.current ?? b?.slug),
  );
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const blogs = await getBlogs();
  // Reading a search param makes this route dynamic rather than static. It
  // already fetches Sanity on a 30-minute revalidate, so the real cost is
  // small, and a listing whose pages 2-5 exist only under JavaScript is the
  // worse trade.
  const initialPage = pageNumber((await searchParams).page);

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
        <div className="container mx-auto px-4 max-w-[75rem]">

          {/* PAGE TITLE */}
          <h1 className="text-[1.5rem] md:text-[3.125rem] font-black text-center text-panda-dark uppercase mb-20 tracking-tight">
            Guides &amp; Tips for Custom Patches
          </h1>

          <BlogListClient blogs={blogs} initialPage={initialPage} />

        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
