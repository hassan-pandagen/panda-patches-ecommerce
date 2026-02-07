import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import LocationLayout from "@/components/locations/LocationLayout";

// ISR: Revalidate blog/location/patch-style pages every 1 hour
export const revalidate = 3600;

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
    return <LocationLayout data={data.location} />;
  }

  // OPTION C: It's a Blog Post
  if (data.blog) {
    return <BlogPostLayout post={data.blog} />;
  }

  // OPTION D: 404 Not Found
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-black text-panda-dark">Page Not Found</h1>
        <p className="text-gray-500">
          We couldn't find a page or blog post at <span className="font-mono bg-gray-100 px-2 py-1">{params.slug}</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
