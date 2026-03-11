"use client";

import dynamic from "next/dynamic";

const ProductGallery = dynamic(() => import("./ProductGallery"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[600px]">
      {/* Main image placeholder — same aspect-square as gallery */}
      <div className="w-full aspect-square rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md bg-gradient-to-br from-gray-50 via-white to-gray-50 animate-pulse" />
      {/* Thumbnail row placeholder — matches 90px/120px thumbs */}
      <div className="flex gap-2 md:gap-4 overflow-x-hidden justify-start md:justify-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-[12px] md:rounded-[16px] border-2 border-gray-200 bg-gray-100 animate-pulse flex-shrink-0" />
        ))}
      </div>
    </div>
  )
});

export default function ProductGalleryWrapper({ images }: { images: any[] }) {
  return <ProductGallery images={images} />;
}
