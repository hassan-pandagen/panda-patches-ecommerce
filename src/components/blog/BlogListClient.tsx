"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";

const POSTS_PER_PAGE = 10;

interface Blog {
  _id: string;
  title: string;
  excerpt?: string;
  slug?: { current: string };
  image?: any;
  category?: string;
  tags?: string[];
  _createdAt: string;
}

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Derive categories and tags from actual blog data
  const categories = useMemo(() => {
    const cats = blogs.map((b) => b.category).filter(Boolean) as string[];
    return [...new Set(cats)].sort();
  }, [blogs]);

  const tags = useMemo(() => {
    const allTags = blogs.flatMap((b) => b.tags || []);
    return [...new Set(allTags)].sort();
  }, [blogs]);

  // Filter blogs
  const filtered = useMemo(() => {
    let result = blogs;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.excerpt && b.excerpt.toLowerCase().includes(q))
      );
    }

    if (activeCategory) {
      result = result.filter((b) => b.category === activeCategory);
    }

    if (activeTag) {
      result = result.filter((b) => b.tags?.includes(activeTag));
    }

    return result;
  }, [blogs, search, activeCategory, activeTag]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const clearFilters = () => {
    setSearch("");
    setActiveCategory(null);
    setActiveTag(null);
    setCurrentPage(1);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(activeCategory === cat ? null : cat);
    setActiveTag(null);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
    setActiveCategory(null);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-20 items-start">
      {/* === LEFT COLUMN: BLOG LIST === */}
      <div className="flex-1 flex flex-col gap-10">
        {/* Active filter indicator */}
        {(activeCategory || activeTag || search.trim()) && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">Filtering by:</span>
            {search.trim() && (
              <span className="text-xs bg-black text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
                &quot;{search}&quot;
                <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="hover:text-panda-yellow">x</button>
              </span>
            )}
            {activeCategory && (
              <span className="text-xs bg-black text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
                {activeCategory}
                <button onClick={() => { setActiveCategory(null); setCurrentPage(1); }} className="hover:text-panda-yellow">x</button>
              </span>
            )}
            {activeTag && (
              <span className="text-xs bg-black text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
                {activeTag}
                <button onClick={() => { setActiveTag(null); setCurrentPage(1); }} className="hover:text-panda-yellow">x</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black underline">
              Clear all
            </button>
          </div>
        )}

        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 mb-4">No posts found.</p>
            <button onClick={clearFilters} className="text-sm text-black underline hover:text-panda-green">
              Clear filters
            </button>
          </div>
        ) : (
          paginated.map((post) => (
            <div
              key={post._id}
              className="flex flex-col md:flex-row bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all border-2 border-purple-300 rounded-[20px]"
            >
              {/* IMAGE */}
              <div className="relative w-full md:w-1/2 h-[250px] md:h-[350px] flex-shrink-0 bg-[#F4F4F4]">
                {post.image ? (
                  <Image
                    src={urlFor(post.image).width(600).format("webp").quality(70).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>

              {/* TEXT CONTENT */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center bg-[#F4F4F4]">
                {post.category && (
                  <span className="text-[11px] font-bold text-panda-green uppercase tracking-wider mb-2">
                    {post.category}
                  </span>
                )}
                <h2 className="text-[18px] md:text-[28px] font-bold text-panda-dark leading-tight mb-4">
                  {post.title}
                </h2>
                <p className="text-[14px] md:text-[16px] text-gray-600 leading-[1.6] mb-6 md:mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                {post.slug?.current ? (
                  <Link
                    href={`/${post.slug.current}`}
                    className="inline-block bg-black text-panda-yellow font-black text-xs uppercase px-8 py-3 tracking-widest hover:scale-105 transition-transform self-start"
                  >
                    Read More: {post.title}
                  </Link>
                ) : (
                  <span className="inline-block bg-gray-300 text-gray-500 font-black text-xs uppercase px-8 py-3 tracking-widest self-start">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-6 py-2 border rounded-md transition-all ${currentPage === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-gray-300 text-black hover:bg-gray-100"}`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md transition-all ${currentPage === page ? "bg-black text-white" : "border border-gray-300 text-black hover:bg-gray-100"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={`px-6 py-2 border rounded-md transition-all ${currentPage >= totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-gray-300 text-black hover:bg-gray-100"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* === RIGHT COLUMN: SIDEBAR === */}
      <div className="w-full lg:w-[300px] flex-shrink-0 space-y-12 sticky top-24">
        {/* SEARCH */}
        <div>
          <h3 className="text-xl font-bold text-panda-dark mb-4">Search</h3>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search blog posts..."
            className="w-full h-12 border border-gray-300 px-4 outline-none focus:border-black transition-colors"
          />
        </div>

        {/* CATEGORIES */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-panda-dark mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => {
                const count = blogs.filter((b) => b.category === cat).length;
                return (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left flex justify-between items-center py-1 transition-colors ${activeCategory === cat ? "text-black font-semibold" : "text-gray-600 hover:text-black"}`}
                    >
                      <span>{cat}</span>
                      <span className="text-xs text-gray-400">({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* TAGS */}
        {tags.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-panda-dark mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`text-xs border px-3 py-1.5 rounded transition-colors ${activeTag === tag ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
