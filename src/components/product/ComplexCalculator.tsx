"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { UploadCloud, Check, ChevronDown, ShoppingCart, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import HeroForm from "@/components/home/HeroForm";
import { createClient } from '@supabase/supabase-js';
import { urlFor } from "@/lib/sanity";
import { calculatePatchPrice } from "@/lib/pricingCalculator";
import TrustBadges from "@/components/shared/TrustBadges";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Default backing options if none provided
const DEFAULT_BACKINGS = [
  { id: "iron", name: "Iron On", icon: "🔥" },
  { id: "sew", name: "Sew On", icon: "🪡" },
  { id: "velcro", name: "Velcro", icon: "🔗" },
  { id: "peel", name: "Peel & Stick", icon: "🏷️" },
];

const PLACEMENTS = [
  { label: "Choose Size / Placement", w: 0, h: 0 },
  { label: "Cap (2.25 - 2.5 inches)", w: 2.5, h: 2.5 },
  { label: "Left Chest (3 - 4 inches)", w: 3.5, h: 3.5 },
  { label: "Hat / Beanie (2.5 inches)", w: 2.5, h: 2.5 },
  { label: "Sleeve (3.5 - 4 inches)", w: 3.5, h: 3.5 },
  { label: "Across Chest (10 - 12 inches)", w: 11, h: 5 },
  { label: "Jacket Back (12 - 14 inches)", w: 13, h: 10 },
  { label: "Custom Size", w: 3, h: 3 },
];

interface BackingOption {
  title: string;
  description?: string;
  image?: any;
}

interface UpgradeOption {
  title: string;
  description?: string;
  image?: any;
}

interface Props {
  backingOptions?: BackingOption[];
  upgradeOptions?: UpgradeOption[];
  productType?: string;
  trustBadges?: any[];
}

export default function ComplexCalculator({
  backingOptions = [],
  upgradeOptions = [],
  productType = "Custom Patch",
  trustBadges = []
}: Props) {
  // Transform Sanity backing options to component format
  const BACKINGS = useMemo(() => {
    if (backingOptions.length === 0) {
      return DEFAULT_BACKINGS;
    }

    return backingOptions.map((option) => ({
      id: option.title.toLowerCase().replace(/\s+/g, '-'),
      name: option.title,
      icon: option.image ? urlFor(option.image).width(100).height(100).url() : "🔲"
    }));
  }, [backingOptions]);

  // Transform Sanity upgrade options to add-ons format
  const ADDON_OPTIONS = useMemo(() => {
    if (upgradeOptions.length === 0) {
      return [];
    }

    return upgradeOptions.map((option) => ({
      id: option.title.toLowerCase().replace(/\s+/g, '-'),
      name: option.title,
      category: "Upgrade",
      icon: option.image ? urlFor(option.image).width(100).height(100).url() : "✨"
    }));
  }, [upgradeOptions]);

  const [backing, setBacking] = useState("");
  const [placement, setPlacement] = useState(PLACEMENTS[0].label);
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const [quantity, setQuantity] = useState(50);
  const [quantityInput, setQuantityInput] = useState('50');

  // Contact State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Shipping Address State (single field for reduced friction)
  const [address, setAddress] = useState("");

  // Set initial backing when BACKINGS array changes
  useEffect(() => {
    if (BACKINGS.length > 0 && !backing) {
      setBacking(BACKINGS[0].id);
    }
  }, [BACKINGS, backing]);

  // Delivery Options State
  const [deliveryOption, setDeliveryOption] = useState<"rush" | "standard" | "economy">("standard");
  const [rushDate, setRushDate] = useState("");

  // Special Instructions State
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Add-ons State
  const [showAddons, setShowAddons] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // File Upload State
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);

  // Multi-Step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate minimum date (6 days from now for rush)
  const getMinRushDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 6);
    return date.toISOString().split('T')[0];
  };

  // Calculate discount (10% for economy delivery 16-18 business days)
  const discount = deliveryOption === "economy" ? 0.10 : 0;

  useEffect(() => {
    const selected = PLACEMENTS.find(p => p.label === placement);
    if (selected && selected.label !== "Custom Size" && selected.label !== "Choose Size / Placement") {
      setWidth(selected.w);
      setHeight(selected.h);
    }
  }, [placement]);

  // Real Price Calculation using pricing tables
  const priceResult = useMemo(() => {
    return calculatePatchPrice(productType, width, height, quantity);
  }, [productType, width, height, quantity]);

  const originalPrice = priceResult.totalPrice;
  const discountAmount = originalPrice * discount;
  const basePrice = originalPrice - discountAmount;
  const unitPrice = priceResult.unitPrice;

  useEffect(() => {
    setPricePulse(true);
    const timer = setTimeout(() => setPricePulse(false), 300);
    return () => clearTimeout(timer);
  }, [width, height, quantity, backing, deliveryOption]);

  // Step validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!name || !email) {
        alert("Please enter your name and email to continue");
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }
      if (placement === "Choose Size / Placement") {
        alert("Please select a size or placement");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!address || address.length < 10) {
        alert("Please enter a complete shipping address");
        return false;
      }
      if (deliveryOption === "rush" && !rushDate) {
        alert("Please select a rush delivery date");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = async (e: any) => {
    e.preventDefault();

    // Final validation
    if (!validateStep(4)) {
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productType,
          price: basePrice,
          quantity: quantity,
          backing: backing,
          width: width,
          height: height,
          customer: { name, email, phone },
          shippingAddress: address,
          deliveryOption: deliveryOption,
          rushDate: deliveryOption === "rush" ? rushDate : null,
          discount: discount > 0 ? `${(discount * 100).toFixed(0)}% Economy Delivery Discount (16-18 business days)` : null,
          artworkUrl: fileUrl || null,
          addons: selectedAddons.length > 0 ? selectedAddons.map(id => ADDON_OPTIONS.find(opt => opt.id === id)?.name).filter(Boolean) : null,
          specialInstructions: specialInstructions || null
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment Error: " + data.error);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const handleQuote = async () => {
    if(!name || !email) {
      alert("Please fill in your Contact Info first!");
      return;
    }
    if(!address || address.length < 10) {
      alert("Please enter a complete shipping address!");
      return;
    }

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone },
          shippingAddress: address,
          details: {
            width,
            height,
            quantity,
            backing,
            placement,
            deliveryOption,
            rushDate: deliveryOption === "rush" ? rushDate : null,
            estimatedDelivery:
              deliveryOption === "rush" ? "Rush (min. 6 days)" :
              deliveryOption === "standard" ? "Standard (12-14 business days)" :
              "Economy (16-18 business days) - 10% discount applied",
            addons: selectedAddons.length > 0 ? selectedAddons.map(id => ADDON_OPTIONS.find(opt => opt.id === id)?.name).filter(Boolean) : null,
            specialInstructions: specialInstructions || null
          },
          artworkUrl: fileUrl || null
        }),
      });

      if (response.ok) {
        alert("Success! We have received your quote request. Check your email shortly.");
      } else {
        alert("Failed to send quote.");
      }

    } catch (err) {
      console.error(err);
      alert("Error sending quote.");
    }
  };

  const handleInc = (setter: any, val: number) => setter(val + 0.5);
  const handleDec = (setter: any, val: number) => val > 0.5 && setter(val - 0.5);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      // Create anonymous filename (NO customer info for privacy)
      // Production team should NOT see customer details
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();

      // Generate random 8-character ID
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Format: artwork-AB12CD34-1738582847291.jpg
      // Anonymous filename protects customer privacy from outsourced production team
      const uniqueFileName = `artwork-${randomId}-${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('customer-artwork')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file. Please try again.');
        setFileName('');
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('customer-artwork')
        .getPublicUrl(uniqueFileName);

      setFileUrl(urlData.publicUrl);
      setUploading(false);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file. Please try again.');
      setFileName('');
      setUploading(false);
    }
  };

  return (
    <div className="w-full bg-white text-left font-sans">

      {/* TRUST BADGES */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <TrustBadges badges={trustBadges} layout="grid" />
      </div>

      <form onSubmit={handleCheckout} className="space-y-10">

        {!mounted && (
          /* Loading placeholder to prevent hydration mismatch */
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-[60px] bg-gray-200 rounded-[12px]"></div>
              <div className="h-[60px] bg-gray-200 rounded-[12px]"></div>
              <div className="h-[60px] bg-gray-200 rounded-[12px]"></div>
            </div>
          </div>
        )}

        {/* === STEP 1: CONTACT INFO + CONFIGURE PATCH === */}
        {mounted && currentStep === 1 && (
          <>
            {/* CONTACT INFORMATION */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-3 block">
                Contact Information
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[60px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-lg text-black outline-none focus:border-black transition-all"
                  required
                />
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[60px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-lg text-black outline-none focus:border-black transition-all"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-[60px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-lg text-black outline-none focus:border-black transition-all"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 font-medium">
                📧 We&apos;ll send your quote and order updates to this email
              </p>
            </div>
            {/* 1. BACKING SELECTOR */}
            {BACKINGS.length > 0 && (
            <div>
          <div className="flex justify-between items-end mb-4">
            <label className="text-sm font-black text-black uppercase tracking-wide">Select Backing</label>
            {BACKINGS[0] && (
              <span className="text-[12px] font-bold text-black bg-panda-yellow px-3 py-1 rounded-full border border-black">
                Recommended: {BACKINGS[0].name}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {BACKINGS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setBacking(opt.id)}
                className={`
                  cursor-pointer flex flex-col items-center justify-center p-2 rounded-[14px] border-2 transition-all duration-200 h-[100px]
                  ${backing === opt.id ? 'border-black bg-gray-50 shadow-md ring-1 ring-black' : 'border-gray-200 hover:border-gray-400 bg-white'}
                `}
              >
                {opt.icon.startsWith('http') ? (
                  <div className="relative w-12 h-12 mb-2">
                    <Image src={opt.icon} alt={opt.name} fill className="object-contain" />
                  </div>
                ) : (
                  <span className="text-3xl mb-2">{opt.icon}</span>
                )}
                <span className={`text-[12px] font-bold uppercase text-center leading-tight ${backing === opt.id ? 'text-black' : 'text-gray-500'}`}>{opt.name}</span>
              </div>
            ))}
          </div>
        </div>
            )}

        {/* 2. PLACEMENT & SIZE */}
        <div>
           <label className="text-sm font-black text-black uppercase tracking-wide mb-3 block">Size & Placement</label>
           <div className="relative mb-5">
             <select 
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full h-[60px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-lg text-black outline-none focus:border-black appearance-none cursor-pointer bg-white"
             >
                {PLACEMENTS.map((p, i) => <option key={i} value={p.label}>{p.label}</option>)}
             </select>
             <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
           </div>

           <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center border-2 border-gray-300 rounded-[12px] overflow-hidden h-[60px]">
                <button type="button" onClick={() => handleDec(setWidth, width)} className="px-4 hover:bg-gray-100 text-gray-500 font-black text-xl border-r border-gray-300 h-full">-</button>
                <div className="flex-1 text-center font-black text-black text-xl">{width} <span className="text-gray-400 text-sm font-medium ml-1">W</span></div>
                <button type="button" onClick={() => handleInc(setWidth, width)} className="px-4 hover:bg-black hover:text-white text-gray-500 border-l border-gray-300 transition-colors font-black text-xl h-full">+</button>
              </div>
              <div className="flex items-center border-2 border-gray-300 rounded-[12px] overflow-hidden h-[60px]">
                <button type="button" onClick={() => handleDec(setHeight, height)} className="px-4 hover:bg-gray-100 text-gray-500 font-black text-xl border-r border-gray-300 h-full">-</button>
                <div className="flex-1 text-center font-black text-black text-xl">{height} <span className="text-gray-400 text-sm font-medium ml-1">H</span></div>
                <button type="button" onClick={() => handleInc(setHeight, height)} className="px-4 hover:bg-black hover:text-white text-gray-500 border-l border-gray-300 transition-colors font-black text-xl h-full">+</button>
              </div>
           </div>
        </div>

        {/* 3. QUANTITY */}
        <div>
          <label className="text-sm font-black text-black uppercase tracking-wide mb-3 block">QUANTITY</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={quantityInput}
              onChange={(e) => {
                const val = e.target.value;
                // Only allow numbers
                if (val === '' || /^\d+$/.test(val)) {
                  setQuantityInput(val);
                  // Only update quantity if there's a valid number
                  if (val !== '') {
                    setQuantity(Math.max(1, Number(val)));
                  }
                }
              }}
              onBlur={(e) => {
                // When user leaves field, ensure valid number
                const val = e.target.value;
                const num = val === '' ? 50 : Math.max(1, Number(val));
                setQuantity(num);
                setQuantityInput(String(num));
              }}
              className="w-full h-[70px] border-2 border-gray-300 rounded-[12px] px-6 font-black text-3xl text-black outline-none focus:border-black transition-all"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold pointer-events-none uppercase tracking-wide">Pieces</div>
          </div>
        </div>
          </>
        )}

        {/* === STEP 2: PERSONALIZE + DELIVERY === */}
        {mounted && currentStep === 2 && (
          <>
        {/* ARTWORK UPLOAD */}
        <div>
          <input
            type="file"
            id="artwork-upload"
            accept=".jpg,.jpeg,.png,.pdf,.ai,.eps"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="artwork-upload"
            className="
              border-2 border-dashed border-gray-300 bg-[#FAFAFA]
              rounded-[14px] h-[120px]
              flex flex-col items-center justify-center
              cursor-pointer hover:bg-white hover:border-black transition-all group
              block
            "
          >
            {uploading ? (
              <>
                <div className="flex items-center gap-3 text-base font-bold text-blue-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>Uploading...</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">Please wait</p>
              </>
            ) : fileName ? (
              <>
                <div className="flex items-center gap-3 text-base font-bold text-green-600">
                  <Check size={24} />
                  <span>{fileName}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">Click to change file</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-base font-bold text-gray-700 group-hover:text-black">
                  <UploadCloud size={24} />
                  <span>Click to Upload Artwork</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">JPG, PNG, AI, EPS, PDF</p>
              </>
            )}
          </label>
        </div>

        {/* SHIPPING ADDRESS */}
        <div>
           <label className="text-sm font-black text-black uppercase tracking-wide mb-3 block">
             Shipping Address
           </label>
           <textarea
             placeholder="Enter your complete shipping address (Street, City, State/Province, ZIP/Postal Code, Country)"
             value={address}
             onChange={(e) => setAddress(e.target.value)}
             rows={3}
             className="w-full border-2 border-gray-300 rounded-[12px] px-5 py-4 font-bold text-lg text-black outline-none focus:border-black transition-all resize-none"
           />
        </div>

        {/* 5.6 DELIVERY OPTIONS */}
        <div>
           <label className="text-sm font-black text-black uppercase tracking-wide mb-3 block">
             Delivery Options
           </label>
           <div className="space-y-4">
              {/* Rush Delivery - With Date Picker */}
              <div
                className={`
                  relative cursor-pointer p-6 rounded-[12px] border-2 transition-all
                  ${deliveryOption === "rush"
                    ? 'border-black bg-gray-50 ring-2 ring-black'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                  }
                `}
              >
                <div
                  onClick={() => setDeliveryOption("rush")}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className={`
                    w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center
                    ${deliveryOption === "rush" ? 'border-black bg-black' : 'border-gray-300'}
                  `}>
                    {deliveryOption === "rush" && (
                      <Check className="text-panda-yellow" size={16} strokeWidth={3} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-black">Rush Delivery</h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      Select your preferred delivery date (min. 6 days)
                    </p>
                  </div>
                </div>

                {/* Date Picker - Only show when rush is selected */}
                {deliveryOption === "rush" && (
                  <div className="mt-4 pl-9">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                      Select Rush Date
                    </label>
                    <input
                      type="date"
                      value={rushDate}
                      min={getMinRushDate()}
                      onChange={(e) => setRushDate(e.target.value)}
                      className="w-full h-[60px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-lg text-black outline-none focus:border-black transition-all cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Standard Delivery */}
              <div
                onClick={() => setDeliveryOption("standard")}
                className={`
                  relative cursor-pointer p-6 rounded-[12px] border-2 transition-all
                  ${deliveryOption === "standard"
                    ? 'border-black bg-gray-50 ring-2 ring-black'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center
                    ${deliveryOption === "standard" ? 'border-black bg-black' : 'border-gray-300'}
                  `}>
                    {deliveryOption === "standard" && (
                      <Check className="text-panda-yellow" size={16} strokeWidth={3} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-black">Standard Delivery</h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      Estimated delivery in 12-14 business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Economy Delivery - With 10% Discount */}
              <div
                onClick={() => setDeliveryOption("economy")}
                className={`
                  relative cursor-pointer p-6 rounded-[12px] border-2 transition-all
                  ${deliveryOption === "economy"
                    ? 'border-black bg-gray-50 ring-2 ring-black'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center
                      ${deliveryOption === "economy" ? 'border-black bg-black' : 'border-gray-300'}
                    `}>
                      {deliveryOption === "economy" && (
                        <Check className="text-panda-yellow" size={16} strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-black">Economy Delivery</h3>
                      <p className="text-sm text-gray-600 font-medium mt-1">
                        Estimated delivery in 16-18 business days
                      </p>
                    </div>
                  </div>
                  <span className="bg-panda-yellow text-black text-xs font-black px-3 py-1.5 rounded-full uppercase border border-black">
                    10% OFF
                  </span>
                </div>
              </div>
           </div>
        </div>

        {/* 5.7 ADD-ONS (OPTIONAL) */}
        {ADDON_OPTIONS.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-black text-black uppercase tracking-wide">
              Upgrade Options (Optional)
            </label>
            <span className="text-xs text-gray-400 font-medium">
              Enhance your patches
            </span>
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setShowAddons(!showAddons)}
            className={`
              w-full h-[60px] rounded-[12px] border-2 transition-all
              flex items-center justify-between px-6
              ${showAddons ? 'border-black bg-gray-50' : 'border-gray-300 bg-white hover:border-gray-400'}
            `}
          >
            <span className="text-base font-bold text-black">
              {selectedAddons.length > 0
                ? `${selectedAddons.length} Add-on${selectedAddons.length > 1 ? 's' : ''} Selected`
                : 'Click to Add Upgrades'}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${showAddons ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Add-ons Grid (Collapsible) */}
          {showAddons && ADDON_OPTIONS.length > 0 && (
            <div className="mt-4 p-6 bg-gray-50 rounded-[12px] border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {ADDON_OPTIONS.map((addon) => (
                  <div
                    key={addon.id}
                    onClick={() => {
                      if (selectedAddons.includes(addon.id)) {
                        setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                      } else {
                        setSelectedAddons([...selectedAddons, addon.id]);
                      }
                    }}
                    className={`
                      cursor-pointer flex items-center gap-3 p-4 rounded-[10px] border-2 transition-all
                      ${selectedAddons.includes(addon.id)
                        ? 'border-black bg-white shadow-md'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                      }
                    `}
                  >
                    {addon.icon.startsWith('http') ? (
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image src={addon.icon} alt={addon.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <span className="text-2xl">{addon.icon}</span>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${selectedAddons.includes(addon.id) ? 'text-black' : 'text-gray-700'}`}>
                        {addon.name}
                      </p>
                    </div>
                    {selectedAddons.includes(addon.id) && (
                      <Check className="text-panda-green" size={20} strokeWidth={3} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* 5.8 SPECIAL INSTRUCTIONS (OPTIONAL) */}
        <div>
          <label className="text-sm font-black text-black uppercase tracking-wide mb-3 block">
            Special Instructions (Optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Add any special requirements, design details, or notes for your order..."
            className="w-full h-[120px] border-2 border-gray-300 rounded-[12px] px-5 py-4 font-medium text-base text-black outline-none focus:border-black transition-all resize-none"
          />
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Example: &quot;Please use metallic gold thread&quot;, &quot;Add text on back side&quot;, &quot;Match Pantone color 123C&quot;
          </p>
        </div>

        {/* 6. PRICE BAR */}
        <div className="bg-white border-2 border-black p-6 rounded-[16px] shadow-lg">
            {priceResult.error ? (
              <div className="text-center py-4">
                <p className="text-red-600 font-bold text-lg">{priceResult.error}</p>
                <p className="text-sm text-gray-500 mt-2">Please adjust your quantity to see pricing.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Cost</p>
                    {discount > 0 && (
                      <p className="text-sm font-bold text-gray-400 line-through mt-1">
                        ${originalPrice.toFixed(2)}
                      </p>
                    )}
                    <div className={`text-4xl font-black text-black tracking-tight transition-transform duration-200 ${pricePulse ? 'scale-105' : ''}`}>
                      ${basePrice.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold">${unitPrice.toFixed(2)}</span> per patch × {quantity} patches
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Pricing based on {priceResult.patchSize}&quot; average size
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-black text-panda-yellow text-[12px] font-black px-3 py-1.5 rounded uppercase tracking-wide block mb-2">FREE SHIPPING</span>
                    {discount > 0 && (
                      <span className="bg-panda-yellow text-black text-[12px] font-black px-3 py-1.5 rounded uppercase tracking-wide block">
                        {(discount * 100).toFixed(0)}% OFF
                      </span>
                    )}
                  </div>
                </div>
                {discount > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Economy Delivery Discount (16-18 business days):</span>
                      <span className="text-green-600 font-black">-${discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
          </>
        )}

        {/* === NAVIGATION BUTTONS === */}
        {mounted && (
        <div className="space-y-4 pt-6 border-t border-gray-200">
          {currentStep < 2 ? (
            /* NEXT BUTTON (Step 1) */
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleNext}
                className="w-full h-[70px] bg-black text-panda-yellow rounded-[14px] font-black text-[14px] md:text-[18px] uppercase tracking-wide md:tracking-widest hover:scale-[1.01] transition-transform shadow-xl"
              >
                <span className="md:hidden">GET BEST PRICE →</span>
                <span className="hidden md:inline">GET THE BEST PRICE →</span>
              </button>
            </div>
          ) : (
            /* CHECKOUT BUTTONS (Step 2) */
            <>
              <button
                type="submit"
                className="w-full h-[70px] bg-black text-panda-yellow rounded-[14px] font-black text-[18px] uppercase tracking-widest hover:scale-[1.01] transition-transform shadow-2xl flex items-center justify-center gap-3"
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                <span>Proceed to Checkout</span>
              </button>

              <button
                type="button"
                onClick={handleQuote}
                className="w-full h-[60px] bg-white border-2 border-gray-300 text-gray-800 rounded-[14px] font-bold uppercase tracking-widest text-[14px] hover:border-black hover:text-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={18} /> Get Free Quote
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full h-[50px] text-gray-600 font-medium text-sm hover:text-black transition-colors"
              >
                ← Back to Configuration
              </button>
            </>
          )}
        </div>
        )}

      </form>
    </div>
  );
}
