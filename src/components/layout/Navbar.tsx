"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ChevronDown, Package } from "lucide-react";
import { usePathname } from "next/navigation";

// CONFIGURATION: Define your menus here
const navLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  {
    name: "CUSTOM PATCHES",
    href: "/custom-patches",
    dropdown: [
      { name: "Custom Embroidery Patches", href: "/custom-patches/embroidered" },
      { name: "Custom PVC Patches", href: "/custom-patches/pvc" },
      { name: "Custom Leather Patches", href: "/custom-patches/leather" },
      { name: "Custom Sequin Patches", href: "/custom-patches/sequin" },
      { name: "Custom 3D Embroidered Transfers", href: "/custom-patches/custom-3d-embroidered-transfers" },
      { name: "Custom Chenille Patches", href: "/custom-patches/chenille" },
      { name: "Custom Woven Patches", href: "/custom-patches/woven" },
      { name: "Custom Printed Patches", href: "/custom-patches/printed" },
      { name: "Custom Silicone Labels", href: "/custom-patches/custom-silicone-labels" },
    ]
  },
  {
    name: "CUSTOM PRODUCTS",
    href: "/custom-products",
    dropdown: [
      { name: "Custom Lapel Pins", href: "/custom-products/lapel-pins" },
      { name: "Custom Challenge Coins", href: "/custom-products/challenge-coin" },
      { name: "Custom Keychains", href: "/custom-products/keychains" },
      { name: "Custom PVC Shoe Charms", href: "/custom-products/pvc-shoe-charms" },
    ]
  },
  { 
    name: "ASSETS", 
    href: "/assets", 
    dropdown: [
      { name: "Thread Color Chart", href: "/assets/thread-color-chart" },
      { name: "Iron On Instructions", href: "/assets/iron-on-instructions" }
    ] 
  },
  {
    name: "PATCH STYLE",
    href: "/custom-morale-patches",
    dropdown: [
      { name: "Custom Morale Patches", href: "/custom-morale-patches" },
      { name: "Custom Anime Patches", href: "/custom-anime-patches" },
      { name: "Custom Baseball Patches", href: "/custom-baseball-patches" },
      { name: "Christmas Patches", href: "/christmas-patches" },
      { name: "Valentine's Day Patches", href: "/valentines-day-patches" },
      { name: "Custom Soccer Patches", href: "/custom-soccer-patches" },
      { name: "Custom Fire Department Patches", href: "/custom-fire-department-patches" },
      { name: "Custom Hockey Patches", href: "/custom-hockey-patches" },
      { name: "Patches For Hats", href: "/patches-for-hats" },
      { name: "Custom Jacket Patches", href: "/custom-jacket-patches" },
      { name: "Custom Law Enforcement Patches", href: "/custom-law-enforcement-patches" },
      { name: "Custom Logo Patches", href: "/custom-logo-patches" },
      { name: "Motorcycle Patches", href: "/motorcycle-patches" },
      { name: "Custom Name Patches", href: "/custom-name-patches" },
      { name: "Custom Rock Band Patches", href: "/custom-rock-band-patches" },
      { name: "Custom Super Bowl Patch", href: "/custom-super-bowl-patch" },
      { name: "Custom Tactical Patches", href: "/custom-tactical-patches" },
      { name: "Custom Velcro Patches", href: "/custom-velcro-patches" },
    ]
  },
  { name: "BLOGS", href: "/blogs" },
  { name: "CONTACT US", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white relative z-50">
      <div className="container mx-auto px-6 h-[100px] flex items-center justify-between">
        
        {/* === 1. LOGO === */}
        <Link href="/" className="flex-shrink-0 relative w-[160px] h-[50px]">
           <Image 
             src="/assets/logo-panda.svg" 
             alt="Panda Patches" 
             fill 
             className="object-contain object-left" 
             priority
           />
        </Link>

        {/* === 2. NAVIGATION (Center) === */}
        <nav className="hidden xl:flex items-center bg-[#F0F0F0] rounded-full px-2 py-1.5 shadow-sm">
          {navLinks.map((link: any) => {
            const isActive = pathname === link.href;
            const hasDropdown = link.dropdown && link.dropdown.length > 0;

            return (
              <div key={link.name} className="relative group">
                
                {/* Main Link */}
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-1
                    text-[13px] font-bold tracking-wide px-5 py-2.5 rounded-full transition-all duration-300
                    ${isActive 
                      ? "bg-[#051C05] text-[#DFFF00] shadow-md" 
                      : "text-gray-700 hover:text-black hover:bg-gray-200/50"
                    }
                  `}
                >
                  {link.name}
                  
                  {/* The Arrow Icon */}
                  {hasDropdown && (
                    <ChevronDown 
                      size={14} 
                      className={`ml-1 transition-transform duration-300 group-hover:rotate-180 ${isActive ? "text-[#DFFF00]" : "text-gray-500"}`} 
                    />
                  )}
                </Link>

                {/* === DROPDOWN MENU (Appears on Hover) === */}
                {hasDropdown && (
                  <div className="
                    absolute top-full left-0 mt-2 w-[220px] 
                    bg-white rounded-xl shadow-xl border border-gray-100 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-300 transform group-hover:translate-y-0 translate-y-2
                    overflow-hidden z-50
                  ">
                    <div className="flex flex-col py-2">
                      {link.dropdown.map((subItem: any, idx: number) => (
                        <Link 
                          key={idx} 
                          href={subItem.href}
                          className="
                            px-5 py-3 text-[13px] font-medium text-gray-600 
                            hover:bg-[#F9FAF5] hover:text-panda-green hover:pl-7
                            transition-all duration-200 border-b border-gray-50 last:border-0
                          "
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </nav>

        {/* === 3. SOCIALS & ACTION BUTTONS === */}
        <div className="flex items-center gap-3 flex-nowrap">
          <div className="hidden lg:flex gap-2">
            {/* 1. Facebook */}
            <a href="#" className="w-[32px] h-[32px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#DFFF00]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            {/* 2. Instagram */}
            <a href="#" className="w-[32px] h-[32px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#DFFF00]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            {/* 3. LinkedIn */}
            <a href="#" className="w-[32px] h-[32px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#DFFF00]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            {/* 4. TikTok */}
            <a href="#" className="w-[32px] h-[32px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#DFFF00]"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
            </a>
          </div>

          {/* Chat Now Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                (window as any).Tawk_API.toggle();
              }
            }}
            className="flex items-center gap-2.5 bg-[#DFFF00] text-[#051C05] font-bold text-[15px] px-7 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
          >
            <MessageCircle size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            <span>Chat Now</span>
          </button>

          {/* Sample Box Button */}
          <Link
            href="/sample-box"
            className="flex items-center gap-2.5 bg-[#051C05] text-[#DFFF00] font-bold text-[15px] px-7 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
          >
            <Package size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span>Sample Box</span>
          </Link>
        </div>

      </div>
      <div className="w-full h-[1px] bg-gray-200 opacity-50"></div>
    </header>
  );
}
