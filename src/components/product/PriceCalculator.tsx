"use client";

import { useState } from "react";
import { Star, Truck, ChevronDown, Box, PenTool, ShieldCheck, Clock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import HeroForm from "@/components/home/HeroForm";

const DIMENSIONS = ["2\"", "2.5\"", "3\"", "3.5\"", "4\"", "4.5\"", "5\"", "6\""];
const QUANTITIES = [50, 100, 200, 300, 500, 1000];

export default function PriceCalculator() {
  // Split Dimensions
  const [height, setHeight] = useState("3\"");
  const [width, setWidth] = useState("3\"");
  const [quantity, setQuantity] = useState(100);
  
  // Dropdown States
  const [showH, setShowH] = useState(false);
  const [showW, setShowW] = useState(false);
  const [showQ, setShowQ] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // === MATH LOGIC ===
  // Average size = (Height + Width) / 2
  const hVal = parseFloat(height);
  const wVal = parseFloat(width);
  const avgSize = (hVal + wVal) / 2;

  const baseRate = 1.00; 
  const sizeMultiplier = 1 + ((avgSize - 2) * 0.3); // Scale price based on size
  let discount = quantity >= 100 ? 0.20 : 0;
  if (quantity >= 500) discount = 0.40;
  
  const unitPrice = (baseRate * sizeMultiplier * (1 - discount)).toFixed(2);
  const totalPrice = (parseFloat(unitPrice) * quantity).toFixed(2);
  const originalPrice = (baseRate * sizeMultiplier * quantity).toFixed(2);

  const accordions = [
    { title: "Free Design and Consultation", icon: PenTool, content: "Got an idea but not sure where to start? Our team is here to help. From first sketch to final stitch, we'll refine your patch design at no cost, start to finish." },
    { title: "Guaranteed Quality", icon: ShieldCheck, content: "Every patch goes through strict quality checks. We use high-grade twill and color-fast threads. If it isn't perfect, we'll make it perfect." },
    { title: "As Fast As You Need", icon: Clock, content: "Standard orders ship in 10-14 days. Rush Service can get patches to your door in as little as 7 days." }
  ];

  return (
    <div className="w-full bg-white text-left">
      
      {/* 1. HEADER */}
      <div className="mb-5">
        <h2 className="text-[34px] font-extrabold text-panda-dark leading-tight mb-2">
          Custom Embroidered Patches
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex text-[#00B67A]">
            {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={16} />)}
          </div>
          <span className="font-bold text-panda-dark">Trustpilot</span>
          <span className="text-gray-300">|</span>
          <button className="text-blue-600 font-medium hover:underline text-xs flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
            <Box size={12} /> Request Samples
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-6 text-[14px] leading-relaxed font-medium">
        Every single one of our patches is custom made from scratch with intricately detailed stitching.
      </p>

      {/* 2. PANDA THEME CHIPS (2x2 Grid - Compact) */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[
          "Pantone Color Match", 
          "Many Backing Options", 
          "Flexible Attachment Methods",
          "Custom Shapes and Sizes"
        ].map((tag, idx) => (
          <div key={tag} className="bg-[#051C05] text-[#E3FF15] rounded-md overflow-hidden shadow-sm border border-black/20 h-[55px] flex items-center justify-center px-2 py-2 text-center">
            <span className="text-[12px] font-black uppercase tracking-wide leading-tight">
              {tag}
            </span>
          </div>
        ))}
      </div>

      {/* 3. DIMENSION SELECTORS (Split H x W) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Height */}
        <div>
           <label className="text-xs font-bold text-gray-500 mb-1 block">HEIGHT (Inches)</label>
           <div className="relative">
             <button onClick={() => setShowH(!showH)} className="w-full h-[50px] border border-gray-300 rounded-[8px] px-4 flex items-center justify-between bg-white hover:border-panda-green transition-all">
               <span className="text-gray-900 font-bold">{height}</span>
               <ChevronDown size={16} className="text-gray-400" />
             </button>
             {showH && (
               <div className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-200 shadow-xl z-20 mt-1 rounded-md no-scrollbar">
                 {DIMENSIONS.map(s => <div key={s} onClick={() => { setHeight(s); setShowH(false) }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">{s}</div>)}
               </div>
             )}
           </div>
        </div>

        {/* Width */}
        <div>
           <label className="text-xs font-bold text-gray-500 mb-1 block">WIDTH (Inches)</label>
           <div className="relative">
             <button onClick={() => setShowW(!showW)} className="w-full h-[50px] border border-gray-300 rounded-[8px] px-4 flex items-center justify-between bg-white hover:border-panda-green transition-all">
               <span className="text-gray-900 font-bold">{width}</span>
               <ChevronDown size={16} className="text-gray-400" />
             </button>
             {showW && (
               <div className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-200 shadow-xl z-20 mt-1 rounded-md no-scrollbar">
                 {DIMENSIONS.map(s => <div key={s} onClick={() => { setWidth(s); setShowW(false) }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">{s}</div>)}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* 4. QUANTITY SELECTOR */}
      <div className="mb-8">
          <label className="text-xs font-bold text-gray-500 mb-1 block">QUANTITY</label>
          <div className="relative w-full">
            <button onClick={() => setShowQ(!showQ)} className="w-full h-[50px] border border-gray-300 rounded-[8px] px-4 flex items-center justify-between bg-white hover:border-panda-green transition-all">
              <span className="text-gray-900 font-bold">{quantity} pieces</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showQ && (
               <div className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-200 shadow-xl z-20 mt-1 rounded-md">
                 {QUANTITIES.map(q => <div key={q} onClick={() => { setQuantity(q); setShowQ(false) }} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium">{q} pieces</div>)}
               </div>
            )}
          </div>
      </div>

      {/* 5. CREATIVE PRICING BOX (The "Pop") */}
      <div className="relative bg-white border-2 border-panda-green/20 rounded-[16px] p-6 mb-6 shadow-[0_10px_30px_rgba(59,126,0,0.05)]">
        {/* Floating Savings Badge */}
        {discount > 0 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E3FF15] text-black text-[12px] font-black px-4 py-1 rounded-full shadow-sm border border-black animate-bounce">
            🎉 YOU SAVE ${(parseFloat(originalPrice) - parseFloat(totalPrice)).toFixed(2)}!
          </div>
        )}

        <div className="flex justify-between items-end">
           <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Estimated Total</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black text-panda-dark tracking-tighter">${totalPrice}</span>
                 {discount > 0 && (
                   <span className="text-lg text-gray-400 line-through decoration-red-500/50 mb-1">${originalPrice}</span>
                 )}
              </div>
           </div>
           
           <div className="text-right">
              <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1">Per Patch</p>
              <p className="text-xl font-bold text-panda-green">${unitPrice}</p>
           </div>
        </div>
      </div>

      {/* 6. BUTTONS */}
      <div className="space-y-3">
        <button className="w-full bg-black text-panda-yellow h-[60px] rounded-[10px] font-black uppercase tracking-widest text-[16px] hover:scale-[1.01] transition-transform shadow-xl flex items-center justify-center gap-2">
           <span>Start Customizing</span>
           <ChevronDown size={16} className="-rotate-90" />
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white border-2 border-black text-black h-[60px] rounded-[10px] font-bold uppercase tracking-widest text-[15px] hover:bg-gray-50 transition-colors"
        >
          Get Free Design
        </button>
      </div>

      {/* === FIX 1: PROPER SHIPPING SECTION === */}
      <div className="mt-8 mb-8 pt-6 border-t border-gray-100 flex items-center gap-4">
        <div className="w-10 h-10 bg-panda-green/10 rounded-full flex items-center justify-center text-panda-green">
           <Truck size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-panda-dark">
            Free shipping <span className="text-panda-green font-bold">Fri, Jan 30</span>
          </p>
          <p className="text-[12px] text-gray-400 mt-0.5">
            *Final delivery date calculated at checkout
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {accordions.map((item, idx) => (
          <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
            <button 
              onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
              className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                 <item.icon size={20} className="text-panda-green" />
                 <span className="text-[14px] font-bold text-panda-dark">{item.title}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${openAccordion === idx ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === idx && (
              <div className="px-4 pb-4 pt-0 text-[13px] text-gray-600 leading-relaxed bg-white">
                <div className="pt-2 border-t border-gray-50">{item.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Get Your Free Quote">
        <div className="p-2"><HeroForm /></div>
      </Modal>

    </div>
  );
}
