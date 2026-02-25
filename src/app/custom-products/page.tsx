import React from "react";
import { Metadata } from "next";
import { client, urlFor } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustStrip from "@/components/products/TrustStrip";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import TimelineSection from "@/components/home/TimelineSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Products - Coins, Pins, Keychains & More | Panda Patches",
  description: "Custom lapel pins, challenge coins, keychains, stickers, and more. Professional quality with low minimums. Free design services, fast 7-14 day delivery. Perfect for businesses, events, and organizations.",
  keywords: [
    "custom lapel pins",
    "challenge coins",
    "custom keychains",
    "custom stickers",
    "enamel pins",
    "custom coins",
    "promotional products",
    "branded merchandise",
    "custom products",
  ],
  alternates: {
    canonical: "https://pandapatches.com/custom-products",
  },
  openGraph: {
    title: "Custom Products - Coins, Pins, Keychains & More | Panda Patches",
    description: "Custom lapel pins, challenge coins, keychains, and promotional products with low minimums and fast delivery.",
    url: "https://pandapatches.com/custom-products",
    siteName: "Panda Patches",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Products - Coins, Pins, Keychains | Panda Patches",
    description: "Custom lapel pins, challenge coins, keychains, and promotional products with low minimums.",
  },
};

// ISR: Revalidate custom products listing every 6 hours (pricing may change)
export const revalidate = 21600;

async function getAllProducts() {
  const query = `*[_type == "customProduct" && !(_id in path("drafts.**"))] | order(_createdAt asc)`;
  const data = await client.fetch(query);
  return data;
}

export default async function CustomProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-white text-black py-24">
        <div className="container mx-auto px-6 max-w-[1200px] text-center">
          <h1 className="text-[48px] md:text-[64px] font-black mb-6 tracking-tight">
            <span className="text-black">Custom </span>
            <span className="text-panda-yellow">Products</span>
          </h1>
          <p className="text-[20px] text-gray-800 max-w-[700px] mx-auto leading-relaxed">
            High-quality custom products designed to your exact specifications.
            From lapel pins to keychains, we bring your vision to life with premium materials and expert craftsmanship.
          </p>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-[1300px]">

          <div className="flex flex-col gap-32">
            {products.map((product: any, idx: number) => {
              const isReverse = idx % 2 !== 0;

              return (
                <div
                  key={product._id}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isReverse ? 'lg:flex-row-reverse' : ''}`}
                >

                  {/* IMAGE */}
                  <div className="flex-1 w-full relative h-[450px] group">
                    {(product.heroImage || (product.gallery && product.gallery.length > 0)) && (
                      <Image
                        src={urlFor(product.heroImage || product.gallery[0]).url()}
                        alt={product.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="flex-1 space-y-8">
                    <h2 className="text-[36px] font-black text-panda-dark uppercase leading-none">
                      {product.title}
                    </h2>

                    {product.basePrice && (
                      <p className="text-[24px] font-bold text-panda-green">
                        Starting at ${product.basePrice}
                      </p>
                    )}

                    <p className="text-[17px] text-gray-600 leading-[1.8] font-medium">
                      {product.description || "Premium custom products made to order with expert craftsmanship."}
                    </p>

                    {/* Ideal For List */}
                    {product.idealFor && product.idealFor.length > 0 && (
                      <div>
                        <h4 className="font-bold text-lg text-panda-dark mb-3">Ideal for:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {product.idealFor.slice(0, 5).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link href={`/custom-products/${product.slug.current}`}>
                        <button className="bg-black text-panda-yellow px-10 py-4 rounded-[12px] font-black uppercase tracking-widest text-[13px] flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                          View Product <ArrowRight size={18} />
                        </button>
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5 STAR RATINGS */}
      <TrustStrip />

      {/* 4 PROMISES */}
      <Promises bgColor="bg-white" />

      {/* GORILLA MOCKUP PROCESS */}
      <ProcessSection />

      {/* 4 WAYS OF ORDERING */}
      <TimelineSection />

      <Footer />
    </main>
  );
}
