"use client";

import dynamic from "next/dynamic";

// PA259A T4: server-render the gallery (ssr: true) so the first image lands in the
// initial HTML as the LCP element with priority, and Next emits its preload. It was
// ssr: false, which kept the LCP image out of the server HTML until the JS chunk
// hydrated, pushing product-page LCP to ~3s. The component's internal `mounted` gate
// still renders only the static first image on the server and upgrades to the Swiper
// carousel after mount, so there is no hydration mismatch and Swiper stays a
// code-split client chunk. The loading fallback now only shows during client-side
// route transitions to the page.
const ProductGallery = dynamic(() => import("./ProductGallery"), {
  ssr: true,
  loading: () => (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[600px]">
      {/* Main image placeholder, same aspect-square as the gallery */}
      <div className="w-full aspect-square rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md bg-gradient-to-br from-gray-50 via-white to-gray-50 animate-pulse" />
      {/* Thumbnail row placeholder, matches the 90px/120px thumbs */}
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
