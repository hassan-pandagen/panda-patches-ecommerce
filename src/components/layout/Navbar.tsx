"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ChevronDown, Package, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// CONFIGURATION: Define your menus here
const navLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  {
    name: "CUSTOM PATCHES",
    href: "/custom-patches",
    dropdown: [
      { name: "Custom Embroidery Patches", href: "/custom-patches/embroidered" },
      { name: "Custom 3D Embroidered Transfers", href: "/custom-patches/custom-3d-embroidered-transfers" },
      { name: "Custom Chenille Patches", href: "/custom-patches/chenille" },
      { name: "Custom PVC Patches", href: "/custom-patches/pvc" },
      { name: "Custom Woven Patches", href: "/custom-patches/woven" },
      { name: "Custom Leather Patches", href: "/custom-patches/leather" },
      { name: "Custom Silicone Labels", href: "/custom-patches/custom-silicone-labels" },
      { name: "Custom Printed Patches", href: "/custom-patches/printed" },
      { name: "Custom Sequin Patches", href: "/custom-patches/sequin" },
    ]
  },
  {
    name: "PRODUCTS",
    href: "/custom-products",
    dropdown: [
      { name: "Custom Lapel Pins", href: "/custom-products/lapel-pins" },
      { name: "Custom Challenge Coins", href: "/custom-products/challenge-coin" },
      { name: "Custom Keychains", href: "/custom-products/keychains" },
      { name: "Custom PVC Shoe Charms", href: "/custom-products/pvc-shoe-charms" },
    ]
  },
  { name: "BULK ORDER", href: "/bulk-custom-patches" },
  {
    name: "ASSETS",
    href: "/assets",
    dropdown: [
      { name: "Thread Color Chart", href: "/assets/thread-color-chart" },
      { name: "Iron On Instructions", href: "/assets/iron-on-instructions" }
    ]
  },
  { name: "BLOGS", href: "/blogs" },
  { name: "CONTACT US", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      sticky top-0 z-50 w-full transition-all duration-300
      xl:bg-white xl:shadow-none
      ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md'
        : 'bg-transparent xl:bg-white'
      }
    `}>
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 h-[70px] md:h-[100px] flex items-center justify-between">

        {/* === 1. LEFT: LOGO === */}
        <div className="flex items-center justify-start flex-shrink-0">
          <Link href="/" className="relative w-[130px] h-[42px] md:w-[160px] md:h-[50px]">
             <Image
               src="/assets/logo-panda.svg"
               alt="Panda Patches"
               fill
               className="object-contain object-left"
               priority
             />
          </Link>
        </div>

        {/* === 2. CENTER: NAVIGATION === */}
        <nav className="hidden xl:flex flex-1 justify-center items-center">
          <div className="flex items-center bg-[#F0F0F0] rounded-full px-2 py-1.5 shadow-sm">
            {navLinks.map((link: any) => {
              const isActive = pathname === link.href;
              const hasDropdown = link.dropdown && link.dropdown.length > 0;

              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`
                      flex items-center gap-1 whitespace-nowrap
                      text-[12px] font-bold tracking-wide px-4 py-2.5 rounded-full transition-all duration-300
                      ${isActive
                        ? "bg-[#051C05] text-[#DFFF00] shadow-md"
                        : "text-gray-700 hover:text-black hover:bg-gray-200/50"
                      }
                    `}
                  >
                    {link.name}
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
          </div>
        </nav>

        {/* === 3. RIGHT: ACTIONS & HAMBURGER === */}
        <div className="flex items-center justify-end gap-3 lg:gap-4 flex-shrink-0">

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden w-[44px] h-[44px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={22} className="text-[#DFFF00]" strokeWidth={2.5} />
            ) : (
              <Menu size={22} className="text-[#DFFF00]" strokeWidth={2.5} />
            )}
          </button>

          {/* DESKTOP ACTION BUTTONS */}
          <div className="hidden xl:flex items-center gap-3 lg:gap-4">
            
            {/* Chat Now Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                  (window as any).Tawk_API.toggle();
                }
              }}
              className="flex items-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] px-5 py-3 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
            >
              <MessageCircle size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              <span>Chat Now</span>
            </button>

            {/* Sample Box Button */}
            <Link
              href="/sample-box"
              className="flex items-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] px-5 py-3 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
            >
              <Package size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Sample Box</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Desktop divider only */}
      <div className="hidden xl:block w-full h-[1px] bg-gray-200 opacity-50" />

      {/* === MOBILE MENU OVERLAY === */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* === MOBILE MENU DRAWER === */}
      <div className={`
        xl:hidden fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        shadow-2xl overflow-y-auto
      `}>

        {/* Mobile Menu Header */}
        <div className="sticky top-0 bg-[#051C05] p-6 flex items-center justify-between">
          <h2 className="text-[#DFFF00] font-bold text-lg uppercase tracking-wide">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-[40px] h-[40px] bg-[#DFFF00] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X size={20} className="text-[#051C05]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Menu Links */}
        <nav className="p-4">
          {navLinks.map((link) => {
            const hasDropdown = link.dropdown && link.dropdown.length > 0;
            const isDropdownOpen = openDropdown === link.name;

            return (
              <div key={link.name} className="border-b border-gray-100 last:border-0">
                {hasDropdown ? (
                  <div className="flex items-center hover:bg-gray-50 transition-colors">
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 py-4 px-3 text-[15px] font-bold text-gray-800 uppercase tracking-wide"
                    >
                      {link.name}
                    </Link>
                    <button
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : link.name)}
                      className="py-4 px-4"
                    >
                      <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 px-3 text-[15px] font-bold text-gray-800 uppercase tracking-wide hover:bg-gray-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                )}

                {/* Dropdown Items */}
                {hasDropdown && isDropdownOpen && (
                  <div className="bg-gray-50 py-2">
                    {link.dropdown.map((subItem: any, idx: number) => (
                      <Link
                        key={idx}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 px-6 text-[14px] font-medium text-gray-600 hover:text-[#051C05] hover:bg-white transition-colors border-l-2 border-transparent hover:border-[#DFFF00]"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Menu Actions */}
        <div className="p-4 space-y-3 border-t border-gray-200 bg-gray-50">
          {/* Chat Now Button */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                (window as any).Tawk_API.toggle();
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[15px] px-6 py-4 rounded-full hover:shadow-lg transition-all"
          >
            <MessageCircle size={20} strokeWidth={2.5} />
            <span>Chat Now</span>
          </button>

          {/* Sample Box Button */}
          <Link
            href="/sample-box"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[15px] px-6 py-4 rounded-full hover:shadow-lg transition-all"
          >
            <Package size={20} strokeWidth={2.5} />
            <span>Sample Box</span>
          </Link>

          {/* Social Icons */}
          <div className="flex justify-center gap-3 pt-4">
            <a href="#" className="w-[40px] h-[40px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-[#DFFF00]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="#" className="w-[40px] h-[40px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-[#DFFF00]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href="#" className="w-[40px] h-[40px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-[#DFFF00]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="#" className="w-[40px] h-[40px] bg-[#051C05] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-[#DFFF00]"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
