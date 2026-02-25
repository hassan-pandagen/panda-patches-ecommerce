/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Check, ChevronDown, ShoppingCart, FileText, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import HeroForm from "@/components/home/HeroForm";
import { createClient } from '@supabase/supabase-js';
import { urlFor } from "@/lib/sanity";
import { calculatePatchPrice, getUpsellTiers } from "@/lib/pricingCalculator";
import TrustBadges from "@/components/shared/TrustBadges";

// Initialize Supabase client (anon key is fine for storage uploads)
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
  const [showBackingDropdown, setShowBackingDropdown] = useState(false);
  const backingDropdownRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState(PLACEMENTS[0].label);
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1');

  // Contact State (used in Step 2)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Shipping Address State (single field for reduced friction)
  const [address, setAddress] = useState("");

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

  // Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cashapp" | "afterpay" | "applepay" | "klarna">("card");

  // Checkout Loading State
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close backing dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backingDropdownRef.current && !backingDropdownRef.current.contains(e.target as Node)) {
        setShowBackingDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when quote modal is open
  useEffect(() => {
    if (showQuoteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showQuoteModal]);

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

  // Upsell tiers — next 2 quantity breakpoints with savings
  const upsellTiers = useMemo(() => {
    return getUpsellTiers(productType, width, height, quantity);
  }, [productType, width, height, quantity]);

  useEffect(() => {
    setPricePulse(true);
    const timer = setTimeout(() => setPricePulse(false), 300);
    return () => clearTimeout(timer);
  }, [width, height, quantity, backing, deliveryOption]);

  // Step validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return true;
    }
    if (step === 2) {
      if (!name || !email) {
        alert("Please enter your name and email to continue");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }
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

    if (!validateStep(2)) {
      return;
    }

    setCheckoutLoading(true);

    try {
      // Choose API endpoint based on payment method
      const endpoint = paymentMethod === 'paypal' ? '/api/checkout-paypal' : '/api/checkout';

      const response = await fetch(endpoint, {
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
          specialInstructions: specialInstructions || null,
          paymentMethod: paymentMethod // Pass payment method to backend
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
        alert("Payment Error: " + data.error);
      }

    } catch (err) {
      setCheckoutLoading(false);
      console.error(err);
      alert("Something went wrong.");
    }
  };

  // Quote Modal Submit — saves lead to Supabase via /api/quote
  const handleQuoteModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quoteEmail) {
      alert("Please enter your email address");
      return;
    }

    setQuoteSubmitting(true);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: quoteEmail, // use email as name since we don't ask for name in modal
            email: quoteEmail,
            phone: quotePhone || '',
          },
          details: {
            width,
            height,
            quantity,
            backing: backing || 'Not specified',
            placement,
            instructions: quoteMessage || '',
            patchType: productType,
          },
          artworkUrl: null,
          isBulkOrder: false,
        }),
      });

      if (response.ok) {
        setQuoteSubmitted(true);
      } else {
        const data = await response.json();
        alert("Failed to send quote: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // Get max size based on product type
  const getMaxSize = () => {
    const type = productType.toLowerCase();
    if (type.includes('pvc') || type.includes('woven') || type.includes('leather')) {
      return 6; // 6 inches max for PVC, Woven, and Leather
    }
    return 50; // Default max for other types
  };

  const maxSize = getMaxSize();

  const handleInc = (setter: any, val: number) => {
    if (val < maxSize) {
      setter(val + 0.5);
    }
  };
  const handleDec = (setter: any, val: number) => val > 0.5 && setter(val - 0.5);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const uniqueFileName = `artwork-${randomId}-${timestamp}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('order-attachments')
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

      const { data: urlData } = supabase.storage
        .from('order-attachments')
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

      <form onSubmit={handleCheckout} className="space-y-5">

        {!mounted && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-[60px] bg-gray-200 rounded-[12px]"></div>
              <div className="h-[60px] bg-gray-200 rounded-[12px]"></div>
              <div className="h-[60px] bg-gray-200 rounded-[12px]"></div>
            </div>
          </div>
        )}

        {/* === STEP 1: CONFIGURE PATCH + SEE PRICE === */}
        {mounted && currentStep === 1 && (
          <>
            {/* 1. BACKING SELECTOR — compact image dropdown */}
            {BACKINGS.length > 0 && (
            <div ref={backingDropdownRef} className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-black text-black uppercase tracking-wide">Select Backing</label>
                <span className="text-[11px] font-semibold text-gray-400">Optional</span>
              </div>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setShowBackingDropdown(!showBackingDropdown)}
                className={`w-full h-[52px] border-2 rounded-[12px] px-4 flex items-center justify-between transition-all ${showBackingDropdown ? 'border-black' : 'border-gray-300 hover:border-gray-400'} bg-white`}
              >
                <div className="flex items-center gap-3">
                  {backing ? (() => {
                    const sel = BACKINGS.find(b => b.id === backing);
                    return sel ? (
                      <>
                        {sel.icon.startsWith('http') ? (
                          <div className="relative w-7 h-7 flex-shrink-0">
                            <Image src={sel.icon} alt={sel.name} fill className="object-contain" />
                          </div>
                        ) : (
                          <span className="text-xl leading-none">{sel.icon}</span>
                        )}
                        <span className="font-bold text-black text-sm">{sel.name}</span>
                      </>
                    ) : null;
                  })() : (
                    <span className="text-gray-400 font-medium text-sm">Select Backing Type</span>
                  )}
                </div>
                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${showBackingDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown panel */}
              {showBackingDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black rounded-[14px] shadow-2xl z-50 overflow-hidden">
                  <div
                    onClick={() => { setBacking(''); setShowBackingDropdown(false); }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${!backing ? 'bg-gray-50' : ''}`}
                  >
                    <span className="text-gray-400 text-sm font-medium">No preference / Skip</span>
                  </div>
                  {BACKINGS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => { setBacking(opt.id); setShowBackingDropdown(false); }}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-panda-yellow/10 transition-colors ${backing === opt.id ? 'bg-panda-yellow/20' : ''}`}
                    >
                      {opt.icon.startsWith('http') ? (
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <Image src={opt.icon} alt={opt.name} fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-2xl leading-none">{opt.icon}</span>
                      )}
                      <span className={`font-bold text-sm flex-1 ${backing === opt.id ? 'text-black' : 'text-gray-700'}`}>{opt.name}</span>
                      {backing === opt.id && <Check size={16} className="text-green-600" strokeWidth={3} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* 2. PLACEMENT & SIZE */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-black text-black uppercase tracking-wide">Size & Placement</label>
                <span className="text-[11px] font-semibold text-gray-400">Optional</span>
              </div>
              <div className="relative mb-3">
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-base text-black outline-none focus:border-black appearance-none cursor-pointer bg-white"
                >
                  {PLACEMENTS.map((p, i) => <option key={i} value={p.label}>{p.label}</option>)}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center border-2 border-gray-300 rounded-[12px] overflow-hidden h-[52px]">
                  <button type="button" onClick={() => handleDec(setWidth, width)} className="px-4 hover:bg-gray-100 text-gray-500 font-black text-xl border-r border-gray-300 h-full">-</button>
                  <div className="flex-1 text-center font-black text-black text-xl">{width} <span className="text-gray-400 text-sm font-medium ml-1">W</span></div>
                  <button type="button" onClick={() => handleInc(setWidth, width)} className="px-4 hover:bg-black hover:text-white text-gray-500 border-l border-gray-300 transition-colors font-black text-xl h-full">+</button>
                </div>
                <div className="flex items-center border-2 border-gray-300 rounded-[12px] overflow-hidden h-[52px]">
                  <button type="button" onClick={() => handleDec(setHeight, height)} className="px-4 hover:bg-gray-100 text-gray-500 font-black text-xl border-r border-gray-300 h-full">-</button>
                  <div className="flex-1 text-center font-black text-black text-xl">{height} <span className="text-gray-400 text-sm font-medium ml-1">H</span></div>
                  <button type="button" onClick={() => handleInc(setHeight, height)} className="px-4 hover:bg-black hover:text-white text-gray-500 border-l border-gray-300 transition-colors font-black text-xl h-full">+</button>
                </div>
              </div>
            </div>

            {/* 3. QUANTITY */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">QUANTITY</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={quantityInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setQuantityInput(val);
                      if (val !== '') {
                        setQuantity(Math.max(1, Number(val)));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    const num = val === '' ? 1 : Math.max(1, Number(val));
                    setQuantity(num);
                    setQuantityInput(String(num));
                  }}
                  className="w-full h-[70px] border-2 border-gray-300 rounded-[12px] px-6 font-black text-3xl text-black outline-none focus:border-black transition-all"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold pointer-events-none uppercase tracking-wide">Pieces</div>
              </div>
            </div>

            {/* 4. ARTWORK UPLOAD - Moved UP */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-black text-black uppercase tracking-wide">
                  Upload Your Artwork
                </label>
                <span className="text-[11px] font-semibold text-gray-400 normal-case">Optional — we design for free</span>
              </div>
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
                  border-2 border-dashed border-panda-dark bg-panda-yellow/20
                  rounded-[14px] h-[130px]
                  flex flex-col items-center justify-center
                  cursor-pointer hover:bg-panda-yellow/30 hover:border-black transition-all group
                  block
                "
              >
                {uploading ? (
                  <>
                    <div className="flex items-center gap-3 text-base font-bold text-blue-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span>Uploading...</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Please wait</p>
                  </>
                ) : fileName ? (
                  <>
                    <div className="flex items-center gap-3 text-base font-bold text-green-700">
                      <Check size={24} />
                      <span>{fileName}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-base font-black text-panda-dark group-hover:text-black">
                      <UploadCloud size={26} />
                      <span>Click to Upload Artwork</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">JPG, PNG, AI, EPS, PDF · No file? We design for free!</p>
                  </>
                )}
              </label>
            </div>

            {/* 5. UPSELL TIERS — Moved near price for better visibility */}
            {upsellTiers.length > 0 && !priceResult.error && (
              <div className="space-y-3">
                {upsellTiers.map((tier) => (
                  <button
                    key={tier.quantity}
                    type="button"
                    onClick={() => {
                      setQuantity(tier.quantity);
                      setQuantityInput(String(tier.quantity));
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-[14px] border-2 border-dashed border-green-400 bg-green-50 hover:border-green-600 hover:bg-green-100 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-green-600 text-white text-[13px] font-black px-3 py-1.5 rounded-md uppercase tracking-wide">
                        SAVE {tier.savingsPercent}%
                      </span>
                      <span className="text-base font-bold text-gray-800 group-hover:text-black">
                        Order {tier.quantity} pcs
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-green-700 group-hover:text-green-800">${tier.unitPrice.toFixed(2)}/ea</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 6. PRICE BAR — shown on Step 1 so they see the price before proceeding */}
            <div className="bg-white border-2 border-black p-5 rounded-[16px] shadow-lg">
              {priceResult.error ? (
                <div className="text-center py-2">
                  <p className="text-red-600 font-bold text-base">{priceResult.error}</p>
                  <p className="text-sm text-gray-500 mt-1">Please adjust your quantity to see pricing.</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Price</p>
                    <div className={`text-4xl font-black text-black tracking-tight transition-transform duration-200 ${pricePulse ? 'scale-105' : ''}`}>
                      ${basePrice.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">${unitPrice.toFixed(2)}</span> per patch × {quantity}
                    </p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <span className="bg-black text-panda-yellow text-[11px] font-black px-3 py-1.5 rounded uppercase tracking-wide block">FREE SHIPPING</span>
                    {discount > 0 && (
                      <span className="bg-panda-yellow text-black text-[11px] font-black px-3 py-1.5 rounded uppercase tracking-wide block">
                        {(discount * 100).toFixed(0)}% OFF
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* === STEP 2: CONTACT + PERSONALIZE + DELIVERY === */}
        {mounted && currentStep === 2 && (
          <>
            {/* CONTACT INFORMATION — now at top of step 2 */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Contact Information
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-5 font-bold text-base text-black outline-none focus:border-black transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                📧 We&apos;ll send your order confirmation and updates to this email
              </p>
            </div>

            {/* SHIPPING ADDRESS */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Shipping Address
              </label>
              <textarea
                placeholder="Street, City, State/Province, ZIP/Postal Code, Country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full border-2 border-gray-300 rounded-[12px] px-5 py-3 font-bold text-base text-black outline-none focus:border-black transition-all resize-none"
              />
            </div>

            {/* DELIVERY OPTIONS */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Delivery Options
              </label>
              <div className="space-y-2">
                {/* Rush Delivery */}
                <div
                  className={`
                    relative cursor-pointer p-4 rounded-[12px] border-2 transition-all
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
                    relative cursor-pointer p-4 rounded-[12px] border-2 transition-all
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

                {/* Economy Delivery */}
                <div
                  onClick={() => setDeliveryOption("economy")}
                  className={`
                    relative cursor-pointer p-4 rounded-[12px] border-2 transition-all
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

            {/* ADD-ONS (OPTIONAL) */}
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

            {/* SPECIAL INSTRUCTIONS */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder={'e.g. "Please use metallic gold thread", "Add text on back side", "Match Pantone color 123C"'}
                className="w-full h-[90px] border-2 border-gray-300 rounded-[12px] px-5 py-3 font-medium text-base text-black outline-none focus:border-black transition-all resize-none"
              />
            </div>

            {/* UPSELL TIERS ON STEP 2 — Moved near price for better visibility */}
            {upsellTiers.length > 0 && !priceResult.error && (
              <div className="space-y-3">
                <label className="text-sm font-black text-black uppercase tracking-wide block">
                  💰 Save More on Bulk Orders
                </label>
                {upsellTiers.map((tier) => (
                  <button
                    key={tier.quantity}
                    type="button"
                    onClick={() => {
                      setQuantity(tier.quantity);
                      setQuantityInput(String(tier.quantity));
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-[14px] border-2 border-dashed border-green-400 bg-green-50 hover:border-green-600 hover:bg-green-100 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-green-600 text-white text-[13px] font-black px-3 py-1.5 rounded-md uppercase tracking-wide">
                        SAVE {tier.savingsPercent}%
                      </span>
                      <span className="text-base font-bold text-gray-800 group-hover:text-black">
                        Order {tier.quantity} pcs
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-green-700 group-hover:text-green-800">${tier.unitPrice.toFixed(2)}/ea</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* PRICE SUMMARY (Step 2) */}
            <div className="bg-white border-2 border-black p-5 rounded-[16px] shadow-lg">
              {priceResult.error ? (
                <div className="text-center py-2">
                  <p className="text-red-600 font-bold text-base">{priceResult.error}</p>
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
                    </div>
                    <div className="text-right space-y-1.5">
                      <span className="bg-black text-panda-yellow text-[12px] font-black px-3 py-1.5 rounded uppercase tracking-wide block">FREE SHIPPING</span>
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

        {/* === PAYMENT METHOD SELECTOR (Step 2 only) === */}
        {mounted && currentStep === 2 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-sm font-bold text-black uppercase tracking-wide mb-4 block">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">

              {/* Credit/Debit Cards */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`h-[72px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center px-1 ${
                  paymentMethod === "card" ? "border-black bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <img src="/assets/payments/cards.svg" alt="Visa, Mastercard, Amex" style={{width: '100%', height: 'auto'}} />
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`h-[72px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center px-3 ${
                  paymentMethod === "paypal" ? "border-black bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <img src="/assets/payments/paypal.svg" alt="PayPal" style={{height: '52px', width: 'auto'}} />
              </button>

              {/* Cash App */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cashapp")}
                className={`h-[72px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center px-3 ${
                  paymentMethod === "cashapp" ? "border-black bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <img src="/assets/payments/cashapp.svg" alt="Cash App" style={{height: '50px', width: 'auto'}} />
              </button>

              {/* Afterpay */}
              <button
                type="button"
                onClick={() => setPaymentMethod("afterpay")}
                className={`h-[72px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center px-1 ${
                  paymentMethod === "afterpay" ? "border-black bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <img src="/assets/payments/afterpay.svg" alt="Afterpay" style={{width: '100%', height: 'auto'}} />
              </button>

              {/* Apple Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod("applepay")}
                className={`h-[72px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center px-3 ${
                  paymentMethod === "applepay" ? "border-black bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <img src="/assets/payments/applepay.svg" alt="Apple Pay" style={{height: '50px', width: 'auto'}} />
              </button>

              {/* Klarna */}
              <button
                type="button"
                onClick={() => setPaymentMethod("klarna")}
                className={`h-[72px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center px-1 ${
                  paymentMethod === "klarna" ? "border-black bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <img src="/assets/payments/klarna.svg" alt="Klarna" style={{width: '100%', height: 'auto'}} />
              </button>

            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-semibold text-green-700">
                {paymentMethod === "paypal" ? "Secure PayPal checkout" : "256-bit SSL encrypted payment"}
              </span>
            </div>
          </div>
        )}

        {/* === NAVIGATION BUTTONS === */}
        {mounted && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {currentStep === 1 ? (
            /* STEP 1 BUTTONS: Get Free Quote + Proceed to Order */
            <div className="space-y-3">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleNext}
                className="w-full h-[70px] bg-black text-panda-yellow rounded-[14px] font-black text-[16px] md:text-[18px] uppercase tracking-wide md:tracking-widest hover:scale-[1.01] transition-transform shadow-xl"
              >
                PROCEED TO ORDER →
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={() => {
                  setQuoteSubmitted(false);
                  setShowQuoteModal(true);
                }}
                className="w-full h-[60px] bg-white border-2 border-gray-300 text-gray-800 rounded-[14px] font-bold uppercase tracking-widest text-[13px] hover:border-black hover:text-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={18} /> GET FREE QUOTE
              </button>

              <p className="text-center text-xs text-gray-400 font-medium">
                Not sure? Get a free quote — no commitment required
              </p>
            </div>
          ) : (
            /* STEP 2 BUTTONS: Checkout + Back */
            <>
              <button
                type="submit"
                disabled={checkoutLoading}
                className={`w-full h-[70px] bg-black text-panda-yellow rounded-[14px] font-black text-[18px] uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 ${
                  checkoutLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
                }`}
              >
                {checkoutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-panda-yellow"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={22} strokeWidth={2.5} />
                    <span>Proceed to Checkout</span>
                  </>
                )}
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

      {/* === QUOTE MODAL OVERLAY === */}
      {showQuoteModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowQuoteModal(false); }}
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-wide">Get Free Quote</h2>
                <p className="text-sm text-gray-500 font-medium mt-0.5">We&apos;ll get back to you within 2 hours</p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {quoteSubmitted ? (
              /* Success State */
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-black text-black mb-2">Quote Request Sent!</h3>
                <p className="text-gray-500 font-medium text-sm mb-6">
                  We&apos;ve received your quote request. Our team will email you within 2 hours with the best price.
                </p>
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="w-full h-[52px] bg-black text-panda-yellow rounded-[12px] font-black text-sm uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Quote Form */
              <form onSubmit={handleQuoteModalSubmit} className="px-6 py-5 space-y-4">

                {/* Patch Summary */}
                <div className="bg-gray-50 rounded-[12px] px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{productType}</p>
                    <p className="text-sm font-black text-black">
                      {width}&quot; × {height}&quot; · {quantity} pcs
                      {backing ? ` · ${BACKINGS.find(b => b.id === backing)?.name || ''}` : ''}
                    </p>
                  </div>
                  {!priceResult.error && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium">Est. Price</p>
                      <p className="text-lg font-black text-black">${basePrice.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wide mb-1.5 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all"
                    required
                    autoFocus
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wide mb-1.5 block">
                    Phone Number <span className="text-gray-400 font-medium normal-case">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wide mb-1.5 block">
                    What are you making? <span className="text-gray-400 font-medium normal-case">(Optional)</span>
                  </label>
                  <textarea
                    placeholder="e.g. Patches for our school sports team, company uniforms, custom gifts..."
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    rows={3}
                    className="w-full border-2 border-gray-300 rounded-[12px] px-4 py-3 font-medium text-base text-black outline-none focus:border-black transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="w-full h-[60px] bg-black text-panda-yellow rounded-[14px] font-black text-[15px] uppercase tracking-widest hover:scale-[1.01] transition-transform shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {quoteSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-panda-yellow"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Quote Request'
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 font-medium pb-1">
                  No spam. We&apos;ll only contact you about your quote.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
