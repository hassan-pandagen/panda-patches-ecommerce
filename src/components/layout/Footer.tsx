import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";

// TikTok SVG icon component (same as Navbar)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 border-t border-gray-100 text-[14px]">
      <div className="container mx-auto px-6 lg:px-8 max-w-[1400px]">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* === COLUMN 1: BRAND & CONTACT (Spans 2) === */}
          <div className="lg:col-span-2 space-y-6">
            {/* LOGO + TAGLINE */}
            <div className="space-y-2">
              <Link href="/" className="block relative w-40 h-12">
                 <Image
                    src="/assets/logo-panda.svg"
                    alt="Panda Patches"
                    fill
                    className="object-contain object-left"
                  />
               </Link>
               <p className="text-gray-500 font-medium">Panda Makes Patches Easy!</p>
             </div>

             {/* CUSTOMER CARE */}
             <div className="space-y-1">
               <h4 className="font-bold text-lg text-panda-dark">24/7 Customer Care</h4>
               <p className="underline decoration-1 underline-offset-2">US Phone: +1 302 250 4340</p>
             </div>

             {/* ADDRESS */}
             <div className="space-y-1">
               <h4 className="font-bold text-lg text-panda-dark">Located At</h4>
               <p className="text-gray-600 leading-relaxed">
                 1914 Quail Feather Ct,<br />
                 Missouri City, TX 77489,<br />
                 United States
               </p>
             </div>

             {/* ALSO */}
             <div className="space-y-1">
               <h4 className="font-bold text-lg text-panda-dark">Also</h4>
               <Link href="#" className="underline decoration-1 underline-offset-2">Find Us On Google</Link>
             </div>
           </div>

           {/* === COLUMN 2: SUPPORT & SOCIALS (Spans 2) === */}
           <div className="lg:col-span-2 space-y-6">

             {/* SUPPORT */}
             <div className="space-y-1 lg:pt-24">
               <h4 className="font-bold text-lg text-panda-dark">Need Live Support</h4>
               <a href="mailto:admin@pandapatches.com" className="underline decoration-1 underline-offset-2 block">
                 admin@pandapatches.com
               </a>
             </div>

             {/* FOLLOW US */}
             <div className="space-y-2">
               <h4 className="font-bold text-lg text-panda-dark">Follow Us</h4>
               <div className="flex gap-3">
                 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-panda-dark text-white hover:bg-panda-green hover:shadow-lg transition-all flex items-center justify-center">
                   <Facebook size={16} />
                 </a>
                 <a href="https://www.instagram.com/pandapatchesofficial/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-panda-dark text-white hover:bg-panda-green hover:shadow-lg transition-all flex items-center justify-center">
                   <Instagram size={16} />
                 </a>
                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-panda-dark text-white hover:bg-panda-green hover:shadow-lg transition-all flex items-center justify-center">
                   <Linkedin size={16} />
                 </a>
                 <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-panda-dark text-white hover:bg-panda-green hover:shadow-lg transition-all flex items-center justify-center">
                   <TikTokIcon />
                 </a>
               </div>
             </div>

             {/* PAYMENT MODES */}
             <div className="space-y-2">
               <h4 className="font-bold text-lg text-panda-dark">Our Payment modes:</h4>
               <div className="relative w-full h-8">
                  <Image 
                    src="/assets/payment-methods.png" 
                    alt="Visa Mastercard Paypal" 
                    width={250} 
                    height={30} 
                    className="object-contain object-left" 
                  />
               </div>
             </div>
           </div>

          {/* === SEO LINKS COLUMNS === */}
          
          {/* COLUMN 3: Custom Patches (Spans 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-lg text-panda-dark text-left">Custom Patches</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/custom-patches/embroidered">Custom Embroidered Patches</Link></li>
              <li><Link href="/custom-patches/custom-3d-embroidered-transfers">Custom 3D Embroidered Transfers</Link></li>
              <li><Link href="/custom-patches/chenille">Custom Chenille Patches</Link></li>
              <li><Link href="/custom-patches/pvc">Custom PVC Patches</Link></li>
              <li><Link href="/custom-patches/woven">Custom Woven Patches</Link></li>
              <li><Link href="/custom-patches/printed">Custom Printed Patches</Link></li>
              <li><Link href="/custom-patches/leather">Custom Leather Patches</Link></li>
              <li><Link href="/custom-patches/custom-silicone-labels">Custom Silicone Labels</Link></li>
              <li><Link href="/custom-patches/sequin">Custom Sequin Patch</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: Custom Products (Spans 1) */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-lg text-panda-dark">Custom Products</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/custom-products/pvc-shoe-charms">PVC Shoe Charms</Link></li>
              <li><Link href="/custom-products/challenge-coin">Challenge Coins</Link></li>
              <li><Link href="/custom-products/keychains">Keychains</Link></li>
              <li><Link href="/custom-products/lapel-pins">Lapel Pins</Link></li>
            </ul>
          </div>

          {/* COLUMN 5: Patch Style (Spans 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-lg text-panda-dark">Patch Style</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/custom-anime-patches">Custom Anime Patches</Link></li>
              <li><Link href="/custom-baseball-patches">Custom Baseball Patches</Link></li>
              <li><Link href="/christmas-patches">Christmas Patches</Link></li>
              <li><Link href="/valentines-day-patches">Valentine&apos;s Day Patches</Link></li>
              <li><Link href="/custom-morale-patches">Custom Morale Patches</Link></li>
              <li><Link href="/custom-soccer-patches">Custom Soccer Patches</Link></li>
              <li><Link href="/custom-fire-department-patches">Custom Fire Department Patches</Link></li>
              <li><Link href="/custom-hockey-patches">Custom Hockey Patches</Link></li>
              <li><Link href="/patches-for-hats">Patches For Hats</Link></li>
              <li><Link href="/custom-jacket-patches">Custom Jacket Patches</Link></li>
              <li><Link href="/custom-law-enforcement-patches">Custom Law Enforcement Patches</Link></li>
              <li><Link href="/custom-logo-patches">Custom Logo Patches</Link></li>
              <li><Link href="/motorcycle-patches">Motorcycle Patches</Link></li>
              <li><Link href="/custom-name-patches">Custom Name Patches</Link></li>
              <li><Link href="/custom-rock-band-patches">Custom Rock Band Patches</Link></li>
              <li><Link href="/custom-super-bowl-patch">Custom Super Bowl Patch</Link></li>
              <li><Link href="/custom-tactical-patches">Custom Tactical Patches</Link></li>
              <li><Link href="/custom-velcro-patches">Custom Velcro Patches</Link></li>
            </ul>
          </div>

          {/* COLUMN 6: Locations (Spans 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-lg text-panda-dark">Custom Patches</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/alabama-patches">Alabama Patches</Link></li>
              <li><Link href="/custom-austin-patches">Custom Austin Patches</Link></li>
              <li><Link href="/custom-patches-in-boston">Custom Patches in Boston</Link></li>
              <li><Link href="/custom-california-patches">Custom California Patches</Link></li>
              <li><Link href="/custom-patches-in-chicago">Custom Patches in Chicago</Link></li>
              <li><Link href="/custom-patches-colorado">Custom Patches Colorado</Link></li>
              <li><Link href="/custom-patches-dallas">Custom Patches Dallas</Link></li>
              <li><Link href="/custom-denver-patches">Custom Denver Patches</Link></li>
              <li><Link href="/custom-patches-in-florida">Custom Patches in Florida</Link></li>
              <li><Link href="/custom-patches-houston">Custom Patches Houston</Link></li>
              <li><Link href="/kentucky-patches">Kentucky Patches</Link></li>
              <li><Link href="/custom-patches-los-angeles">Custom Patches Los Angeles</Link></li>
              <li><Link href="/custom-miami-patches">Custom Miami Patches</Link></li>
              <li><Link href="/custom-patches-in-new-york">Custom Patches in New York</Link></li>
              <li><Link href="/custom-ohio-state-patches">Custom Ohio State Patches</Link></li>
              <li><Link href="/custom-patches-portland">Custom Patches Portland</Link></li>
              <li><Link href="/custom-patches-in-san-francisco">Custom Patches in San Francisco</Link></li>
              <li><Link href="/custom-patches-in-texas">Custom Patches in Texas</Link></li>
              <li><Link href="/custom-utah-patches">Custom Utah Patches</Link></li>
              <li><Link href="/custom-patches-in-washington">Custom Patches in Washington</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-500 font-medium">
          <p>Copyright © 2023 <span className="text-black font-bold">Panda Patches</span> All rights reserved</p>
        </div>

      </div>
    </footer >
  );
}
