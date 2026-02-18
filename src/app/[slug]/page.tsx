import type { Metadata } from "next";
import { client, urlFor } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import LocationLayout from "@/components/locations/LocationLayout";
import { generateArticleSchema, generateLocationBusinessSchema, generateSchemaScript } from "@/lib/schemas";

// ISR: Revalidate blog/location/patch-style pages every 1 hour
export const revalidate = 3600;

// Dynamic metadata for Google/AI search engines
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getData(params.slug);

  // Location page metadata
  if (data.location) {
    const locationName = data.location.locationName;
    return {
      title: `Custom Patches in ${locationName} | Panda Patches`,
      description: `Order custom embroidered patches in ${locationName}. Low minimums, free mockups, fast 7-14 day turnaround. Get a free quote today!`,
      alternates: { canonical: `https://pandapatches.com/${params.slug}` },
      openGraph: {
        title: `Custom Patches in ${locationName} | Panda Patches`,
        description: `Custom patches delivered anywhere in ${locationName}. Low minimums, free design, fast shipping.`,
        url: `https://pandapatches.com/${params.slug}`,
        siteName: 'Panda Patches',
        type: 'website',
      },
    };
  }

  // Patch style page metadata
  if (data.patchStyle) {
    const styleName = data.patchStyle.title;
    return {
      title: `${styleName} | Custom Patches | Panda Patches`,
      description: `Order custom ${styleName} with low minimums, free design services, and fast 7-14 day delivery. Get a free quote today!`,
      alternates: { canonical: `https://pandapatches.com/${params.slug}` },
      openGraph: {
        title: `${styleName} | Panda Patches`,
        description: `Custom ${styleName} with free mockups and fast delivery.`,
        url: `https://pandapatches.com/${params.slug}`,
        siteName: 'Panda Patches',
        type: 'website',
      },
    };
  }

  // Blog post metadata
  if (data.blog) {
    const imageUrl = data.blog.mainImage
      ? urlFor(data.blog.mainImage).url()
      : data.blog.image
        ? urlFor(data.blog.image).url()
        : 'https://pandapatches.com/assets/logo-panda.svg';
    return {
      title: `${data.blog.title} | Panda Patches Blog`,
      description: data.blog.excerpt || data.blog.description || 'Custom patch tips, tutorials, and industry insights from Panda Patches.',
      alternates: { canonical: `https://pandapatches.com/${params.slug}` },
      openGraph: {
        title: data.blog.title,
        description: data.blog.excerpt || data.blog.description || '',
        url: `https://pandapatches.com/${params.slug}`,
        siteName: 'Panda Patches',
        type: 'article',
        images: [{ url: imageUrl }],
      },
    };
  }

  return {
    title: 'Panda Patches | Custom Iron On Patches',
    description: 'Low Minimums, Quick Delivery!',
  };
}

// Fetch Logic: Try to find Blog, Location Page, OR Patch Style Page
async function getData(slug: string) {
  // Validate slug format to prevent injection (alphanumeric, hyphens, and underscores only)
  if (!/^[a-z0-9-_]+$/i.test(slug)) {
    return { blog: null, location: null, patchStyle: null };
  }

  // Use parameterized query to prevent GROQ injection
  // Explicitly exclude drafts to only get published documents
  const query = `
    {
      "blog": *[_type == "blog" && slug.current == $slug && !(_id in path("drafts.**"))][0],
      "location": *[_type == "locationPage" && slug.current == $slug && !(_id in path("drafts.**"))][0],
      "patchStyle": *[_type == "patchStyle" && slug.current == $slug && !(_id in path("drafts.**"))][0]
    }
  `;
  const data = await client.fetch(query, { slug });
  return data;
}

export default async function CatchAllPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);

  // OPTION A: It's a Patch Style Page (e.g., "custom-anime-patches")
  if (data.patchStyle) {
    return <LocationLayout data={{
      locationName: data.patchStyle.title,
      gallery: data.patchStyle.gallery,
      seoSection1: data.patchStyle.seoContent1,
      seoSection2: data.patchStyle.seoContent2,
      isPatchStyle: true // Flag to indicate it's a patch style page
    }} />;
  }

  // OPTION B: It's a Location Page (e.g., "custom-patches-in-alabama")
  if (data.location) {
    const locationSchema = generateLocationBusinessSchema(data.location.locationName);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(locationSchema)}
        />
        <LocationLayout data={data.location} />
      </>
    );
  }

  // OPTION C: It's a Blog Post
  if (data.blog) {
    // Generate Article schema for SEO
    const articleSchema = generateArticleSchema({
      title: data.blog.title || "Blog Post",
      description: data.blog.description || data.blog.excerpt || "Read our latest blog post about custom patches.",
      datePublished: data.blog._createdAt || new Date().toISOString(),
      dateModified: data.blog._updatedAt || data.blog._createdAt || new Date().toISOString(),
      image: data.blog.mainImage
        ? urlFor(data.blog.mainImage).url()
        : data.blog.image
          ? urlFor(data.blog.image).url()
          : 'https://pandapatches.com/assets/logo-panda.svg',
      url: `https://pandapatches.com/${params.slug}`,
    });

    return (
      <>
        {/* Article Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(articleSchema)}
        />
        <BlogPostLayout post={data.blog} />
      </>
    );
  }

  // OPTION D: 404 Not Found
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-black text-panda-dark">Page Not Found</h1>
        <p className="text-gray-500">
          We couldn&apos;t find a page or blog post at <span className="font-mono bg-gray-100 px-2 py-1">{params.slug}</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
