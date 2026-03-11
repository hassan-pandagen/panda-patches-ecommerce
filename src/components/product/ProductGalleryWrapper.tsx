"use client";

import dynamic from "next/dynamic";

const ProductGallery = dynamic(() => import("./ProductGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[600px]">
      <div className="w-full aspect-square rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-pulse w-full h-full rounded-[16px] bg-gray-100" />
      </div>
    </div>
  )
});

export default function ProductGalleryWrapper({ images }: { images: any[] }) {
  return <ProductGallery images={images} />;
}
