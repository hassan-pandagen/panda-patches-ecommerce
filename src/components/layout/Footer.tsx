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
             <div className="space-y-2">
               <h4 className="font-bold text-lg text-panda-dark">24/7 Customer Care</h4>
               <a href="tel:+13022504340" className="flex items-center gap-2 underline decoration-1 underline-offset-2 hover:text-panda-green transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                 +1 (302) 250-4340
               </a>
               <a href="https://wa.me/14157999969?text=Hi%20I%20need%20help%20placing%20my%20order" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 underline decoration-1 underline-offset-2 hover:text-[#25D366] transition-colors">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 group-hover:text-[#25D366] transition-colors"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 +1 (415) 799-9969 WhatsApp
               </a>
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
              <li><Link href="/custom-patches/custom-chenille-tpu-patches">Custom Chenille TPU Patches</Link></li>
              <li><Link href="/custom-patches/custom-chenille-glitter-patches">Custom Chenille Glitter Patches</Link></li>
              <li><Link href="/custom-patches/pvc">Custom PVC Patches</Link></li>
              <li><Link href="/custom-patches/woven">Custom Woven Patches</Link></li>
              <li><Link href="/custom-patches/printed">Custom Printed Patches</Link></li>
              <li><Link href="/custom-patches/leather">Custom Leather Patches</Link></li>
              <li><Link href="/custom-patches/custom-silicone-labels">Custom Silicone Labels</Link></li>
              <li><Link href="/custom-patches/sequin">Custom Sequin Patch</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: Bulk Orders (Spans 1) */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-lg text-panda-dark">Bulk Orders</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/bulk-custom-patches">Bulk Custom Patches</Link></li>
              <li><Link href="/custom-corporate-patches">Custom Corporate Patches</Link></li>
              <li><Link href="/custom-sports-patches">Custom Sports Patches</Link></li>
              <li><Link href="/custom-police-patches">Custom Police Patches</Link></li>
              <li><Link href="/custom-fire-department-patches">Custom Fire Dept Patches</Link></li>
            </ul>
          </div>

          {/* COLUMN 5: Custom Products (Spans 1) */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-lg text-panda-dark">Custom Products</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/custom-products/pvc-shoe-charms">PVC Shoe Charms</Link></li>
              <li><Link href="/custom-products/challenge-coin">Challenge Coins</Link></li>
              <li><Link href="/custom-products/keychains">Keychains</Link></li>
              <li><Link href="/custom-products/lapel-pins">Lapel Pins</Link></li>
            </ul>
          </div>

          {/* COLUMN 6: Patch Style (Spans 2) */}
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

          {/* COLUMN 7: Locations (Spans 2) */}
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
