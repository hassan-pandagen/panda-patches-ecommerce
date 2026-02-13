"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image?: any;
  slug?: { current: string };
}

export default function BlogSwiper({ blogs }: { blogs: Blog[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevMobile = () => {
    setCurrentIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));
  };

  const handleNextMobile = () => {
    setCurrentIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  };

  // Desktop scroll handler
  const handlePrevDesktop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const handleNextDesktop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const currentBlog = blogs[currentIndex];
  const imgSrc = currentBlog.image?.asset
    ? urlFor(currentBlog.image).url()
    : "/assets/placeholder-blog.png";

  return (
    <div className="w-full">
      {/* MOBILE: Single Blog Swiper */}
      <div className="md:hidden flex flex-col items-center gap-6">
        {/* Blog Card */}
        <div className="w-full max-w-[362px] h-[603px] bg-white rounded-[10px] overflow-hidden shadow-sm">
          
          {/* IMAGE AREA */}
          <div className="relative w-full h-[350px] overflow-hidden">
            <Image 
              src={imgSrc} 
              alt={currentBlog.title} 
              fill 
              className="object-cover transition-transform duration-700"
            />
          </div>

          {/* TEXT AREA */}
          <div className="flex flex-col items-center text-center pt-8 pb-6 px-4 flex-grow h-[253px]">
            
            {/* Title */}
            <h3 className="text-[22px] leading-[1.3] font-bold text-panda-dark mb-4">
              {currentBlog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-[15px] leading-[1.6] text-gray-600 mb-auto line-clamp-3">
              {currentBlog.excerpt}
            </p>

            {/* Button */}
            <Link href={`/blog/${currentBlog.slug?.current || "#"}`} className="mt-6">
              <button className="
                px-8 py-3 
                bg-black text-white 
                font-bold uppercase tracking-wider text-sm
                transition-colors duration-300
                hover:bg-panda-yellow hover:text-black
                rounded-[4px]
              ">
                Read More
              </button>
            </Link>

          </div>
        </div>

        {/* Navigation Controls - Mobile */}
        <div className="flex items-center justify-center gap-6 w-full px-4">
          <button
            onClick={handlePrevMobile}
            className="p-2 rounded-full bg-panda-dark text-white hover:bg-panda-yellow hover:text-panda-dark hover:shadow-lg transition-all"
            aria-label="Previous blog"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Progress Indicator */}
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-panda-dark transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / blogs.length) * 100}%` }}
            />
          </div>

          <button
            onClick={handleNextMobile}
            className="p-2 rounded-full bg-panda-dark text-white hover:bg-panda-yellow hover:text-panda-dark hover:shadow-lg transition-all"
            aria-label="Next blog"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* DESKTOP: Horizontal Scrolling Cards */}
      <div className="hidden md:block relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-4 px-4 -mx-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {blogs.map((blog: Blog) => (
            <div
              key={blog._id}
              className="flex-shrink-0 w-[362px] h-[603px] bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              
              {/* IMAGE AREA */}
              <div className="relative w-full h-[350px] overflow-hidden">
                <Image 
                  src={blog.image?.asset ? urlFor(blog.image).url() : "/assets/placeholder-blog.png"} 
                  alt={blog.title} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* TEXT AREA */}
              <div className="flex flex-col items-center text-center pt-8 pb-6 px-4 flex-grow h-[253px]">
                
                {/* Title */}
                <h3 className="text-[22px] leading-[1.3] font-bold text-panda-dark mb-4">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[15px] leading-[1.6] text-gray-600 mb-auto line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Button */}
                <Link href={`/blog/${blog.slug?.current || "#"}`} className="mt-6">
                  <button className="
                    px-8 py-3 
                    bg-black text-white 
                    font-bold uppercase tracking-wider text-sm
                    transition-colors duration-300
                    hover:bg-panda-yellow hover:text-black
                    rounded-[4px]
                  ">
                    Read More
                  </button>
                </Link>

              </div>
            </div>
          ))}
        </div>

        {/* Desktop Navigation Buttons */}
        <button
          onClick={handlePrevDesktop}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-3 rounded-full bg-panda-dark text-white hover:bg-panda-yellow hover:text-panda-dark hover:shadow-lg transition-all z-10"
          aria-label="Previous blogs"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNextDesktop}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-3 rounded-full bg-panda-dark text-white hover:bg-panda-yellow hover:text-panda-dark hover:shadow-lg transition-all z-10"
          aria-label="Next blogs"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
