import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import BlogSwiper from "./BlogSwiper";

async function getBlogs() {
   // Fetch all blogs with only needed fields
   const query = `*[_type == "blog"] | order(_createdAt desc) {
     _id,
     title,
     excerpt,
     "slug": slug.current,
     image,
     _createdAt
   }`;
   const data = await client.fetch(query);
   return data;
}

export default async function BlogSection() {
  const blogs = await getBlogs();

  // Fallback Data (If Sanity is empty, show placeholders like Figma)
  const displayBlogs = blogs.length > 0 ? blogs : [
    {
      _id: "1",
      title: "Top Types of Hats and How to Wear Them",
      excerpt: "Whether you're dressing for function, fashion, or a little bit of both, hats are one of the most versatile accessories in any wardrobe...",
      image: "/assets/blog-1.png",
      slug: { current: "#" }
    },
    {
      _id: "2",
      title: "Boy Scout Patch Placements: A Complete Guide",
      excerpt: "For Scouts, every patch tells a story. From early achievements to higher ranks, patches represent dedication and accomplishments...",
      image: "/assets/blog-2.png",
      slug: { current: "#" }
    },
    {
      _id: "3",
      title: "Can Civilians Own Challenge Coins?",
      excerpt: "Challenge coins have long held a revered place in military, law enforcement, and first responder cultures worldwide...",
      image: "/assets/blog-3.png",
      slug: { current: "#" }
    },
  ];

  return (
    // Section Background: Light Grey (#F6F6F6)
    <section className="w-full py-12 bg-[#F6F6F6]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        
        {/* HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-black text-panda-dark uppercase tracking-tight">
            OUR BLOGS
          </h2>
        </div>

        {/* Swiper for both Mobile and Desktop */}
        <BlogSwiper blogs={displayBlogs} />

      </div>
    </section>
  );
}

// === BLOG CARD COMPONENT ===
function BlogCard({ blog }: { blog: any }) {
  // Handle image source (Sanity vs Local Fallback)
  const imgSrc = blog.image?.asset
    ? urlFor(blog.image).url()
    : "/assets/placeholder-blog.png";

  return (
    <div className="
      flex flex-col 
      w-[362px] h-[603px] 
      bg-white
      rounded-[10px]
      overflow-hidden
      shadow-sm
      group
      hover:shadow-lg
      transition-shadow duration-300
    ">
      
      {/* IMAGE AREA (Top) */}
      <div className="relative w-full h-[350px] overflow-hidden">
        <Image 
          src={imgSrc} 
          alt={blog.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* TEXT AREA (Bottom) */}
      <div className="flex flex-col items-center text-center pt-8 pb-6 px-4 flex-grow">
        
        {/* Title */}
        <h3 className="text-[22px] leading-[1.3] font-bold text-panda-dark mb-4">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[15px] leading-[1.6] text-gray-600 mb-auto line-clamp-3">
          {blog.excerpt}
        </p>

        {/* 
           BUTTON 
           - Default: Black
           - Hover: Yellow (Like Figma middle card)
        */}
        <Link href={`/blog/${blog.slug?.current || "#"}`} className="mt-6">
          <button className="
            px-8 py-3 
            bg-black text-white 
            font-bold uppercase tracking-wider text-sm
            transition-colors duration-300
            group-hover:bg-panda-yellow group-hover:text-black
            rounded-[4px]
          ">
            Read More
          </button>
        </Link>

      </div>
    </div>
  );
}
