import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SampleBoxHero from "@/components/samplebox/SampleBoxHero";
import SampleBoxForm from "@/components/samplebox/SampleBoxForm";
import ProductSwiper from "@/components/samplebox/ProductSwiper";
import { Check } from "lucide-react";

export const metadata = {
  title: "Order Sample Box | Panda Patches",
  description: "Order our sample box and experience the high quality of our custom products.",
};

// Categories included in the sample box - All 9 categories
const includedCategories = [
  "Custom Embroidered Patches",
  "Custom PVC Patches",
  "Custom Chenille Patches",
  "Custom Woven Patches",
  "Custom Leather Patches",
  "Custom Printed Patches",
  "Custom Sequin Patches",
  "Custom 3D Embroidered Transfers",
  "Custom Silicone Labels",
];

export default function SampleBoxPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <SampleBoxHero />

      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-6 max-w-[1350px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Large Sample Box Image & Info */}
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-panda-green/10 to-panda-yellow/10 border-4 border-panda-green/20">
                {/* Placeholder sample box visual */}
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-9xl mb-4">📦</div>
                    <h3 className="text-3xl font-black text-panda-dark uppercase mb-2">Sample Box</h3>
                    <p className="text-lg text-gray-700 font-semibold">High-Quality Patch Samples</p>
                    <p className="text-2xl font-black text-panda-green mt-4">Only $45</p>
                  </div>
                </div>
                {/* You can replace this div with an actual image when you have one:
                <img
                  src="/assets/sample-box.jpg"
                  alt="Panda Patches Sample Box"
                  className="w-full h-full object-cover"
                />
                */}
              </div>

              {/* What's Included Section */}
              <div className="mt-8 bg-gradient-to-br from-panda-green/5 to-panda-yellow/5 rounded-xl p-6 border-2 border-panda-green/20">
                <h3 className="text-2xl font-black text-panda-dark uppercase mb-4 flex items-center gap-2">
                  <span className="text-panda-green">✓</span> What&apos;s Included
                </h3>
                <p className="text-gray-700 font-semibold mb-4">
                  Get 1 sample of each category to experience our quality:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {includedCategories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                      <Check size={18} className="text-panda-green flex-shrink-0" />
                      <span className="text-[13px] font-bold text-gray-700">{category}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 font-medium">
                  * Shipping charges included in price
                </p>
              </div>

              {/* Product Categories Swiper Below */}
              <div className="mt-8">
                <h4 className="text-xl font-black text-panda-dark uppercase mb-4">Explore Our Categories</h4>
                <ProductSwiper />
              </div>
            </div>

            {/* Right: Order Form */}
            <div className="w-full sticky top-6">
              <SampleBoxForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
