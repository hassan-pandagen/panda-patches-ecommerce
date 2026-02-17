import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';
import { client, urlFor } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";

// ISR: Revalidate blog listing every 30 minutes (blogs update frequently)
export const revalidate = 1800;

// SEO Metadata for Blogs Page
export const metadata: Metadata = {
  title: "Custom Patch Blog - Tips, Guides & Industry News | Panda Patches",
  description: "Read expert guides on custom patches, embroidery tips, design ideas, and industry trends. Learn about patch types, backing options, military patches, and more from Panda Patches.",
  openGraph: {
    title: "Custom Patch Blog - Tips & Guides | Panda Patches",
    description: "Expert guides on custom patches, embroidery tips, design ideas, and industry trends from Panda Patches.",
    type: "website",
    url: "https://pandapatches.com/blogs",
    images: [
      {
        url: "https://pandapatches.com/assets/logo-panda.svg",
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
    images: ["https://pandapatches.com/assets/logo-panda.svg"]
  },
  alternates: {
    canonical: "https://pandapatches.com/blogs"
  }
};

const POSTS_PER_PAGE = 10;

// Fetch ALL blogs (sorted by newest) with only needed fields
async function getBlogs() {
  const query = `*[_type == "blog"] | order(_createdAt desc) {
    _id,
    title,
    excerpt,
    slug,
    image,
    _createdAt
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function BlogsPage({ searchParams }: { searchParams: { page?: string } }) {
  const blogs = await getBlogs();
  const currentPage = parseInt(searchParams.page || "1");
  
  // Calculate pagination
  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const endIdx = startIdx + POSTS_PER_PAGE;
  const paginatedBlogs = blogs.slice(startIdx, endIdx);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="w-full py-16 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 max-w-[1200px]">
          
          {/* PAGE TITLE */}
          <h1 className="text-[24px] md:text-[50px] font-black text-center text-panda-dark uppercase mb-20 tracking-tight">
            Our Blogs
          </h1>

          <div className="flex flex-col lg:flex-row gap-20 items-start">
            
            {/* === LEFT COLUMN: BLOG LIST === */}
            <div className="flex-1 flex flex-col gap-10">
              {paginatedBlogs.map((post: any) => (
                <div 
                  key={post._id} 
                  className="flex flex-row bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all border-2 border-purple-300 rounded-[20px]"
                >
                  {/* IMAGE (50% width) */}
                  <div className="relative w-1/2 h-[350px] flex-shrink-0 bg-[#F4F4F4]">
                    {post.image ? (
                      <Image
                        src={urlFor(post.image).url()}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* TEXT CONTENT */}
                  <div className="flex-1 p-8 flex flex-col justify-center bg-[#F4F4F4]">
                    <h2 className="text-[18px] md:text-[28px] font-bold text-panda-dark leading-tight mb-4">
                      {post.title}
                    </h2>
                    <p className="text-[16px] text-gray-600 leading-[1.6] mb-8 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <Link href={`/${post.slug?.current || '#'}`}>
                      <button className="bg-black text-panda-yellow font-black text-xs uppercase px-8 py-3 tracking-widest hover:scale-105 transition-transform">
                        Read More
                      </button>
                    </Link>
                  </div>

                </div>
              ))}

              {/* PAGINATION */}
              <div className="flex justify-center gap-2 mt-12">
                <Link href={`/blogs${currentPage > 1 ? `?page=${currentPage - 1}` : ''}`}>
                  <button className={`px-6 py-2 border rounded-md transition-all ${currentPage === 1 ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-black hover:bg-gray-100'}`} disabled={currentPage === 1}>
                    Previous
                  </button>
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link key={page} href={`/blogs?page=${page}`}>
                    <button className={`px-4 py-2 rounded-md transition-all ${currentPage === page ? 'bg-black text-white' : 'border border-gray-300 text-black hover:bg-gray-100'}`}>
                      {page}
                    </button>
                  </Link>
                ))}

                <Link href={`/blogs?page=${currentPage + 1}`}>
                  <button className={`px-6 py-2 border rounded-md transition-all ${currentPage >= totalPages ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-black hover:bg-gray-100'}`} disabled={currentPage >= totalPages}>
                    Next
                  </button>
                </Link>
              </div>

            </div>

            {/* === RIGHT COLUMN: SIDEBAR (Search, Categories, Tags) === */}
            <div className="w-full lg:w-[300px] flex-shrink-0 space-y-12 sticky top-24">
              
              {/* SEARCH */}
              <div>
                <h3 className="text-xl font-bold text-panda-dark mb-4">Search</h3>
                <input type="text" className="w-full h-12 border border-gray-300 px-4 outline-none focus:border-black" />
              </div>

              {/* CATEGORIES */}
              <div>
                <h3 className="text-xl font-bold text-panda-dark mb-4">Categories</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="hover:text-black cursor-pointer transition-colors">Challenge Coin</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Chenille Patches</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Custom Business Patches</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Custom Military Patches</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Custom Patches</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Custom Sublimation Patches</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Custom PVC Patch</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Embroidery Patch Vs Woven Patch</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Enamel Pins</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Types Of Backing Options</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Uncategorized</li>
                </ul>
              </div>

              {/* TAGS */}
              <div>
                <h3 className="text-xl font-bold text-panda-dark mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Branded Custom Patches",
                    "Branded Patches",
                    "Chenille Patches",
                    "Custom Boy Scout Patches",
                    "Custom Challenge Coin",
                    "Custom Chenille Patches",
                    "Custom Chenille Patches For Winters",
                    "Custom Company Logo",
                    "Custom Hat Patches",
                    "Custom Military Patches",
                    "Custom Name Patches",
                    "Custom Patch Guide",
                    "Custom Patch Maker In Usa",
                    "Custom Patch Price",
                    "Custom Patches",
                    "Custom Printed Patch Makers In The USA",
                    "Custom Printed Patch Makers In US",
                    "Custom Sublimation Patches",
                    "Custom Sublimation Patches In The US",
                    "Custom Winter Patches",
                    "Embroidery Patch Vs Woven Patch",
                    "Embroidery Patches Vs Needlepoint",
                    "Eye Catchy Patches",
                    "Fonts And Colors For Custom Patches",
                    "Hard Vs Soft Enamel Pins",
                    "Houston Astros Patches",
                    "How To Iron On Patches",
                    "How To Make PVC Patch",
                    "How To Make Your Own Iron-On Patches",
                    "How To Remove Sewn-On Patches",
                    "How To Use Chenille Patches",
                    "Lapel Pins",
                    "Law Enforcement Patches In The USA",
                    "Logo Patches For Shirts",
                    "OCP Patches",
                    "Owning A Challenge Coin",
                    "PVC Patches In The US",
                    "San Francisco 49ers",
                    "Stylish Patches",
                    "Types Of Backing Options",
                    "Types Of Patches",
                    "Woven Patch Vs Embroidery Patch",
                    "Woven Vs Embroidery Patch",
                    "Enamel Pins",
                    "Custom PVC Patch",
                    "Uncategorized"
                  ].map(tag => (
                    <span key={tag} className="text-xs bg-white border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-black hover:text-black cursor-pointer transition-colors rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
      
      <CTASection />
      <Footer />
    </main>
  );
}
