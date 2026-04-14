/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Check, ChevronDown, ShoppingCart, FileText, Lightbulb } from "lucide-react";
import HeroForm from "@/components/home/HeroForm";
import { urlFor } from "@/lib/sanity";
import TrustBadges from "@/components/shared/TrustBadges";
import { useFileUpload } from "@/hooks/useFileUpload";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import FormFeedback from "@/components/feedback/FormFeedback";


// Default backing options if none provided
const DEFAULT_BACKINGS = [
  { id: "iron", name: "Iron On", icon: "🔥" },
  { id: "sew", name: "Sew On", icon: "🪡" },
  { id: "velcro", name: "Velcro", icon: "🔗" },
  { id: "peel", name: "Peel & Stick", icon: "🏷️" },
];

const SHAPES = [
  { id: "circle", name: "Circle" },
  { id: "square", name: "Square" },
  { id: "rectangle", name: "Rectangle" },
  { id: "oval", name: "Oval" },
  { id: "cut-to-shape", name: "Cut to Shape" },
];

function ShapeIcon({ id, size = 24 }: { id: string; size?: number }) {
  const s = size;
  switch (id) {
    case 'circle':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.75"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4"/>
        </svg>
      );
    case 'square':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.75"/>
          <rect x="6" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4"/>
        </svg>
      );
    case 'rectangle':
      return (
        <svg width={Math.round(s * 1.4)} height={s} viewBox="0 0 34 24" fill="none" className="flex-shrink-0">
          <rect x="2" y="3" width="30" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.75"/>
          <rect x="6" y="7" width="22" height="10" rx="1" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4"/>
        </svg>
      );
    case 'oval':
      return (
        <svg width={Math.round(s * 1.4)} height={s} viewBox="0 0 34 24" fill="none" className="flex-shrink-0">
          <ellipse cx="17" cy="12" rx="14.5" ry="9" stroke="currentColor" strokeWidth="1.75"/>
          <ellipse cx="17" cy="12" rx="9" ry="5.5" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4"/>
        </svg>
      );
    case 'cut-to-shape':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M12 2.5L14.2 8.7L21 9.6L16.2 14.1L17.6 20.8L12 17.6L6.4 20.8L7.8 14.1L3 9.6L9.8 8.7L12 2.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
          <path d="M12 6L13.4 9.8L17.5 10.4L14.5 13.2L15.3 17.2L12 15.4L8.7 17.2L9.5 13.2L6.5 10.4L10.6 9.8L12 6Z" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.4"/>
        </svg>
      );
    default:
      return null;
  }
}


interface BackingOption {
  title: string;
  description?: string;
  image?: any;
}

interface ColorOption {
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
  borderOptions?: ColorOption[];
  borderSectionLabel?: string;
  upgradeOptions?: UpgradeOption[];
  productType?: string;
  trustBadges?: any[];
}

export default function ComplexCalculator({
  backingOptions = [],
  borderOptions = [],
  borderSectionLabel = "",
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
  const [shape, setShape] = useState("");
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [showBorderDropdown, setShowBorderDropdown] = useState(false);
  const calcRef = useRef<HTMLDivElement>(null);
  const backingDropdownRef = useRef<HTMLDivElement>(null);
  const shapeDropdownRef = useRef<HTMLDivElement>(null);
  const borderDropdownRef = useRef<HTMLDivElement>(null);
  const formLoadedAt = useRef(Date.now());
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const [widthInput, setWidthInput] = useState('3');
  const [heightInput, setHeightInput] = useState('3');
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1');

  // Contact State (used in Step 2)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; address?: string }>({});

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

  // File Upload (hook)
  const { files, setFiles, uploading, handleFileUpload, removeFile } = useFileUpload();

  // Multi-Step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [mounted, setMounted] = useState(false);

  // Direct Quote State
  const [quoteSending, setQuoteSending] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  // Patch Idea State
  const [patchIdea, setPatchIdea] = useState("");
  const [showPatchIdea, setShowPatchIdea] = useState(false);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cashapp" | "afterpay" | "applepay" | "klarna">("card");

  // Checkout Loading State
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Weekend warning for rush date
  const [weekendWarning, setWeekendWarning] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Namespaced key keeps each product type's form state separate
  const storageKey = `pp_checkout_state_${productType.toLowerCase().replace(/\s+/g, '_')}`;

  // Restore saved form state from localStorage (survives Stripe redirects / failures)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const s = JSON.parse(saved);
      if (s.backing) setBacking(s.backing);
      if (s.shape) setShape(s.shape);
      if (s.selectedColor) setSelectedColor(s.selectedColor);
      if (s.width) { const w = Math.ceil(s.width); setWidth(w); setWidthInput(String(w)); }
      if (s.height) { const h = Math.ceil(s.height); setHeight(h); setHeightInput(String(h)); }
      if (s.quantity) { setQuantity(s.quantity); setQuantityInput(String(s.quantity)); }
      if (s.fileUrl) { setFiles([{ url: s.fileUrl, name: s.fileName || '' }]); }
      if (s.name) setName(s.name);
      if (s.email) setEmail(s.email);
      if (s.phone) setPhone(s.phone);
      if (s.address) setAddress(s.address);
      if (s.deliveryOption) setDeliveryOption(s.deliveryOption);
      if (s.rushDate) setRushDate(s.rushDate);
      if (s.specialInstructions) setSpecialInstructions(s.specialInstructions);
      if (s.selectedAddons) setSelectedAddons(s.selectedAddons);
      if (s.paymentMethod) setPaymentMethod(s.paymentMethod);
      if (s.currentStep) setCurrentStep(s.currentStep);
      if (s.patchIdea) { setPatchIdea(s.patchIdea); setShowPatchIdea(true); }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save form state to localStorage on every change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        backing, shape, selectedColor, width, height, quantity,
        fileUrl: files[0]?.url || '', fileName: files[0]?.name || '',
        name, email, phone, address,
        deliveryOption, rushDate, specialInstructions, selectedAddons, paymentMethod, currentStep,
        patchIdea
      }));
    } catch {}
  }, [mounted, backing, shape, selectedColor, width, height, quantity, files, name, email, phone, address, deliveryOption, rushDate, specialInstructions, selectedAddons, paymentMethod, currentStep, patchIdea]);

  // Close backing/shape dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backingDropdownRef.current && !backingDropdownRef.current.contains(e.target as Node)) {
        setShowBackingDropdown(false);
      }
      if (shapeDropdownRef.current && !shapeDropdownRef.current.contains(e.target as Node)) {
        setShowShapeDropdown(false);
      }
      if (borderDropdownRef.current && !borderDropdownRef.current.contains(e.target as Node)) {
        setShowBorderDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Calculate minimum date (6 days from now for rush, skip weekends)
  const getMinRushDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 6);
    // If min date lands on Saturday or Sunday, push to Monday
    const day = date.getDay();
    if (day === 0) date.setDate(date.getDate() + 1); // Sunday → Monday
    if (day === 6) date.setDate(date.getDate() + 2); // Saturday → Monday
    return date.toISOString().split('T')[0];
  };

  // Prevent selecting Saturday or Sunday for rush delivery
  const handleRushDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value + 'T00:00:00');
    const day = selected.getDay();
    if (day === 0 || day === 6) {
      setWeekendWarning(true);
      setTimeout(() => setWeekendWarning(false), 4000);
      return;
    }
    setWeekendWarning(false);
    setRushDate(e.target.value);
  };


  // Price calculation (hook)
  const { priceResult, upsellTiers, discount, originalPrice, discountAmount, basePrice, unitPrice, pricePulse, rushSurcharge } = usePriceCalculation({
    productType, width, height, quantity, deliveryOption,
  });

  // Step validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (priceResult.error) {
        setFieldErrors({ name: priceResult.error });
        return false;
      }
      const errs: { name?: string; email?: string } = {};
      if (!name) errs.name = "Name is required";
      if (!email) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email";
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return false;
      }
      setFieldErrors({});
      return true;
    }
    if (step === 2) {
      if (!address || address.length < 10) {
        setFieldErrors({ address: "Please enter a complete shipping address" });
        return false;
      }
      if (deliveryOption === "rush" && !rushDate) {
        setFieldErrors({ address: "Please select a rush delivery date" });
        return false;
      }
      setFieldErrors({});
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    setCurrentStep(currentStep + 1);
    calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDirectQuote = async () => {
    // Bot speed check — humans take at least 3 seconds to fill a form
    if (Date.now() - formLoadedAt.current < 3000) {
      setQuoteSent(true);
      setTimeout(() => setQuoteSent(false), 5000);
      return;
    }

    if (!email) {
      setFieldErrors({ email: "Email is required" });
      setCurrentStep(1);
      calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setQuoteSending(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name || email, email, phone: phone || "" },
          details: {
            width: parseFloat(widthInput) || width,
            height: parseFloat(heightInput) || height,
            quantity,
            backing: BACKINGS.find(b => b.id === backing)?.name || "Not specified",
            patchType: productType,
          },
          artworkUrl: files[0]?.url || null,
          artworkUrl2: files[1]?.url || null,
          isBulkOrder: false,
          pageUrl: window.location.href,
          basePrice: priceResult.error ? undefined : basePrice,
        }),
      });
      if (res.ok) {
        setQuoteSent(true);
        setTimeout(() => setQuoteSent(false), 15000);
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11221237770/qTWjCNnZ3oEcEIqA2uYp',
            value: 50.0,
            currency: 'USD',
          });
        }
      } else {
        setQuoteError("Failed to send quote. Please try again.");
      }
    } catch {
      setQuoteError("Something went wrong. Please try again.");
    } finally {
      setQuoteSending(false);
    }
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
          color: selectedColor || null,
          width: parseFloat(widthInput) || width,
          height: parseFloat(heightInput) || height,
          customer: { name, email, phone },
          shippingAddress: address,
          deliveryOption: deliveryOption,
          rushDate: deliveryOption === "rush" ? rushDate : null,
          discount: discount > 0 ? `${(discount * 100).toFixed(0)}% Economy Delivery Discount (16-18 business days)` : null,
          artworkUrl: files[0]?.url || null,
          addons: selectedAddons.length > 0 ? selectedAddons.map(id => ADDON_OPTIONS.find(opt => opt.id === id)?.name).filter(Boolean) : null,
          specialInstructions: [shape ? `Shape: ${SHAPES.find(s => s.id === shape)?.name}` : null, patchIdea ? `Patch Idea: ${patchIdea}` : null, specialInstructions || null].filter(Boolean).join(' | ') || null,
          paymentMethod: paymentMethod // Pass payment method to backend
        }),
      });

      const data = await response.json();

      if (data.url) {
        // For PayPal: store order data so capture route can create the order on payment
        if (data.orderData && data.paypalOrderId) {
          try { localStorage.setItem('pp_paypal_order', JSON.stringify({ paypalOrderId: data.paypalOrderId, orderData: data.orderData })); } catch {}
        }
        try { localStorage.removeItem(storageKey); } catch {}
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
        setCheckoutError("Payment Error: " + data.error);
      }

    } catch (err) {
      setCheckoutLoading(false);
      console.error(err);
      setCheckoutError("Something went wrong. Please try again.");
    }
  };

  // Get max size based on product type
  const getMaxSize = () => {
    const type = productType.toLowerCase();
    if (type.includes('pvc')) return 8;
    if (type.includes('woven') || type.includes('leather')) return 12;
    if (type.includes('embroid')) return 14;
    return 14; // Default max
  };

  const maxSize = getMaxSize();

  const handleInc = (setter: any, val: number) => {
    if (val < maxSize) {
      setter(val + 0.5);
    }
  };
  const handleDec = (setter: any, val: number) => val > 0.5 && setter(val - 0.5);

  return (
    <div ref={calcRef} className="w-full bg-white text-left font-sans">

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
            {/* 1. BACKING + SHAPE — side by side */}
            <div className="grid grid-cols-2 gap-3">

              {/* BACKING SELECTOR */}
              {BACKINGS.length > 0 && (
              <div ref={backingDropdownRef} className="relative">
                <label className="block text-sm font-black text-black uppercase tracking-wide mb-2">Select Backing</label>
                <button
                  type="button"
                  onClick={() => { setShowBackingDropdown(!showBackingDropdown); setShowShapeDropdown(false); setShowBorderDropdown(false); }}
                  style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: showBackingDropdown ? '#000' : '#9ca3af' }}
                  className="w-full h-[52px] rounded-[12px] px-3 flex items-center justify-between transition-all bg-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {backing ? (() => {
                      const sel = BACKINGS.find(b => b.id === backing);
                      return sel ? (
                        <>
                          {sel.icon.startsWith('http') ? (
                            <div className="relative w-6 h-6 flex-shrink-0">
                              <Image src={sel.icon} alt={sel.name} fill className="object-contain" sizes="24px" />
                            </div>
                          ) : (
                            <span className="text-lg leading-none flex-shrink-0">{sel.icon}</span>
                          )}
                          <span className="font-bold text-black text-xs truncate">{sel.name}</span>
                        </>
                      ) : null;
                    })() : (
                      <span className="text-gray-400 font-medium text-xs truncate">Select Backing</span>
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${showBackingDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showBackingDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black rounded-[14px] shadow-2xl z-50 overflow-hidden">
                    <div
                      onClick={() => { setBacking(''); setShowBackingDropdown(false); }}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${!backing ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-gray-400 text-sm font-medium">Skip</span>
                    </div>
                    {BACKINGS.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => { setBacking(opt.id); setShowBackingDropdown(false); }}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-panda-yellow/10 transition-colors ${backing === opt.id ? 'bg-panda-yellow/20' : ''}`}
                      >
                        {opt.icon.startsWith('http') ? (
                          <div className="relative w-8 h-8 flex-shrink-0">
                            <Image src={opt.icon} alt={opt.name} fill className="object-contain" sizes="32px" />
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

              {/* SHAPE SELECTOR */}
              <div ref={shapeDropdownRef} className="relative">
                <label className="block text-sm font-black text-black uppercase tracking-wide mb-2">Select Shape</label>
                <button
                  type="button"
                  onClick={() => { setShowShapeDropdown(!showShapeDropdown); setShowBackingDropdown(false); setShowBorderDropdown(false); }}
                  style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: showShapeDropdown ? '#000' : '#9ca3af' }}
                  className="w-full h-[52px] rounded-[12px] px-3 flex items-center justify-between transition-all bg-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {shape ? (() => {
                      const sel = SHAPES.find(s => s.id === shape);
                      return sel ? (
                        <>
                          <span className="flex-shrink-0"><ShapeIcon id={shape} size={20} /></span>
                          <span className="font-bold text-black text-xs truncate">{sel.name}</span>
                        </>
                      ) : null;
                    })() : (
                      <span className="text-gray-400 font-medium text-xs truncate">Select Shape</span>
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${showShapeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showShapeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black rounded-[14px] shadow-2xl z-50 overflow-hidden">
                    <div
                      onClick={() => { setShape(''); setShowShapeDropdown(false); }}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${!shape ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-gray-400 text-sm font-medium">Skip</span>
                    </div>
                    {SHAPES.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => { setShape(opt.id); setShowShapeDropdown(false); }}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-panda-yellow/10 transition-colors ${shape === opt.id ? 'bg-panda-yellow/20' : ''}`}
                      >
                        <span className="text-gray-600"><ShapeIcon id={opt.id} size={24} /></span>
                        <span className={`font-bold text-sm flex-1 ${shape === opt.id ? 'text-black' : 'text-gray-700'}`}>{opt.name}</span>
                        {shape === opt.id && <Check size={16} className="text-green-600" strokeWidth={3} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* 1c. BORDER SELECTOR — dropdown */}
            {borderOptions.length > 0 && (
              <div ref={borderDropdownRef} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-black text-black uppercase tracking-wide">
                    {borderSectionLabel || "Select Border"}
                  </label>
                  <span className="text-[11px] font-semibold text-gray-400">Optional</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowBorderDropdown(!showBorderDropdown); setShowBackingDropdown(false); setShowShapeDropdown(false); }}
                  style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: showBorderDropdown ? '#000' : '#9ca3af' }}
                  className="w-full h-[52px] rounded-[12px] px-4 flex items-center justify-between transition-all bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedColor ? (() => {
                      const sel = borderOptions.find(o => o.title.toLowerCase().replace(/\s+/g, '-') === selectedColor);
                      const imgUrl = sel?.image ? urlFor(sel.image).width(60).height(60).url() : null;
                      return sel ? (
                        <>
                          {imgUrl ? (
                            <div className="relative w-7 h-7 rounded-[5px] overflow-hidden flex-shrink-0">
                              <Image src={imgUrl} alt={sel.title} fill className="object-cover" sizes="28px" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-[5px] bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                              {sel.title.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-black text-sm truncate">{sel.title}</span>
                        </>
                      ) : null;
                    })() : (
                      <span className="text-gray-400 font-medium text-sm">Select Border / Color</span>
                    )}
                  </div>
                  <ChevronDown size={18} className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${showBorderDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showBorderDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black rounded-[14px] shadow-2xl z-50 overflow-hidden">
                    <div
                      onClick={() => { setSelectedColor(''); setShowBorderDropdown(false); }}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${!selectedColor ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-gray-400 text-sm font-medium">No preference / Skip</span>
                    </div>
                    {borderOptions.map((opt) => {
                      const id = opt.title.toLowerCase().replace(/\s+/g, '-');
                      const imgUrl = opt.image ? urlFor(opt.image).width(80).height(80).url() : null;
                      const isSelected = selectedColor === id;
                      return (
                        <div
                          key={id}
                          onClick={() => { setSelectedColor(isSelected ? '' : id); setShowBorderDropdown(false); }}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-panda-yellow/10 transition-colors ${isSelected ? 'bg-panda-yellow/20' : ''}`}
                        >
                          {imgUrl ? (
                            <div className="relative w-8 h-8 rounded-[6px] overflow-hidden flex-shrink-0">
                              <Image src={imgUrl} alt={opt.title} fill className="object-cover" sizes="32px" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-[6px] bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                              {opt.title.charAt(0)}
                            </div>
                          )}
                          <span className={`font-bold text-sm flex-1 ${isSelected ? 'text-black' : 'text-gray-700'}`}>{opt.title}</span>
                          {isSelected && <Check size={16} className="text-green-600" strokeWidth={3} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. SIZE */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-black text-black uppercase tracking-wide">Size (inches)</label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#9ca3af' }} className="flex items-center rounded-[12px] overflow-hidden h-[52px] focus-within:border-black transition-all">
                  <button type="button" onClick={() => { const cur = parseFloat(widthInput) || width; const v = Math.max(1, Math.floor(cur) - 1); setWidth(v); setWidthInput(String(v)); }} className="px-4 hover:bg-gray-100 text-gray-500 font-black text-xl border-r border-gray-400 h-full flex-shrink-0">-</button>
                  <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
                    <input
                      type="text"
                      inputMode="decimal"
                      min="1"
                      max={maxSize}
                      value={widthInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/^\d*\.?\d*$/.test(raw)) {
                          setWidthInput(raw);
                          const val = parseFloat(raw);
                          if (!isNaN(val) && val >= 1) setWidth(Math.min(Math.ceil(val), maxSize));
                        }
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val) || val < 1) { setWidth(1); setWidthInput('1'); }
                        else { const clamped = Math.min(val, maxSize); setWidth(Math.ceil(clamped)); setWidthInput(String(clamped)); }
                      }}
                      className="w-full text-center font-black text-black text-xl outline-none bg-transparent min-w-0"
                    />
                    <span className="text-gray-400 text-sm font-medium flex-shrink-0">W</span>
                  </div>
                  <button type="button" onClick={() => { const cur = parseFloat(widthInput) || width; const v = Math.min(maxSize, Math.ceil(cur) + 1); setWidth(v); setWidthInput(String(v)); }} className="px-4 hover:bg-black hover:text-white text-gray-500 border-l border-gray-400 transition-colors font-black text-xl h-full flex-shrink-0">+</button>
                </div>
                <div style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#9ca3af' }} className="flex items-center rounded-[12px] overflow-hidden h-[52px] focus-within:border-black transition-all">
                  <button type="button" onClick={() => { const cur = parseFloat(heightInput) || height; const v = Math.max(1, Math.floor(cur) - 1); setHeight(v); setHeightInput(String(v)); }} className="px-4 hover:bg-gray-100 text-gray-500 font-black text-xl border-r border-gray-400 h-full flex-shrink-0">-</button>
                  <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
                    <input
                      type="text"
                      inputMode="decimal"
                      min="1"
                      max={maxSize}
                      value={heightInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/^\d*\.?\d*$/.test(raw)) {
                          setHeightInput(raw);
                          const val = parseFloat(raw);
                          if (!isNaN(val) && val >= 1) setHeight(Math.min(Math.ceil(val), maxSize));
                        }
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val) || val < 1) { setHeight(1); setHeightInput('1'); }
                        else { const clamped = Math.min(val, maxSize); setHeight(Math.ceil(clamped)); setHeightInput(String(clamped)); }
                      }}
                      className="w-full text-center font-black text-black text-xl outline-none bg-transparent min-w-0"
                    />
                    <span className="text-gray-400 text-sm font-medium flex-shrink-0">H</span>
                  </div>
                  <button type="button" onClick={() => { const cur = parseFloat(heightInput) || height; const v = Math.min(maxSize, Math.ceil(cur) + 1); setHeight(v); setHeightInput(String(v)); }} className="px-4 hover:bg-black hover:text-white text-gray-500 border-l border-gray-400 transition-colors font-black text-xl h-full flex-shrink-0">+</button>
                </div>
              </div>

              {/* Selected size confirmation */}
              {(parseFloat(widthInput) > 0 && parseFloat(heightInput) > 0) && (
                <p className="mt-2 text-[13px] font-bold text-gray-700">
                  {`📐 Selected Size: ${widthInput}" × ${heightInput}"`}
                </p>
              )}

              {/* Unsure of size nudge */}
              <button
                type="button"
                onClick={() => { if (typeof window !== 'undefined' && (window as any).Tawk_API) { (window as any).Tawk_API.maximize(); } }}
                className="mt-2 flex items-center gap-1.5 text-[12px] text-gray-600 font-semibold hover:text-panda-green transition-colors group cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 group-hover:text-panda-green" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                </svg>
                Unsure of your size? Chat with us now
              </button>
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
                  style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#9ca3af' }}
                  className="w-full h-[52px] rounded-[12px] px-6 font-black text-2xl text-black outline-none focus:border-black transition-all"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold pointer-events-none uppercase tracking-wide">Pieces</div>
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
              {/* Uploaded files list */}
              {files.length > 0 && (
                <div className="space-y-2 mb-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-400 rounded-[12px]">
                      <Check size={16} className="text-green-600 flex-shrink-0" strokeWidth={3} />
                      <span className="text-sm font-bold text-green-700 truncate flex-1">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors font-black text-xs"
                        aria-label="Remove file"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload zone — hide when 2 files uploaded */}
              {files.length < 2 && (
                <>
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
                      rounded-[14px] h-[80px]
                      flex items-center justify-center gap-3
                      cursor-pointer hover:bg-panda-yellow/30 hover:border-black transition-all group
                      block px-4
                    "
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0"></div>
                        <span className="text-sm font-bold text-blue-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={22} className="text-panda-dark group-hover:text-black flex-shrink-0" />
                        <div>
                          <p className="text-sm font-black text-panda-dark group-hover:text-black leading-tight">
                            {files.length === 1 ? 'Add a 2nd file (optional)' : 'Click to Upload Artwork'}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">JPG, PNG, AI, EPS, PDF · No file? We design free!</p>
                        </div>
                      </>
                    )}
                  </label>
                </>
              )}

              {/* Describe Patch Idea */}
              <button
                type="button"
                onClick={() => setShowPatchIdea(!showPatchIdea)}
                className={`mt-3 w-full flex items-center justify-between px-4 py-3 border-2 rounded-[12px] transition-all ${showPatchIdea ? 'border-black bg-gray-50' : 'border-dashed border-gray-300 hover:border-gray-500 bg-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb size={18} className={showPatchIdea ? 'text-black' : 'text-gray-500'} />
                  <span className={`text-sm font-bold ${showPatchIdea ? 'text-black' : 'text-gray-600'}`}>
                    No artwork? Describe your patch idea
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showPatchIdea ? 'rotate-180' : ''}`} />
              </button>

              {showPatchIdea && (
                <div className="mt-2">
                  <textarea
                    value={patchIdea}
                    onChange={(e) => setPatchIdea(e.target.value)}
                    placeholder={`Describe your patch idea in detail — our designers will create a free mockup!\n\ne.g. "A fierce eagle with wings spread wide, bold text reading 'IRON PACK' below, dark navy & gold colors, vintage distressed style, circular shape."\n\nTell us: subject / image, any text, colors, style, and any references you like.`}
                    rows={5}
                    className="w-full border-2 border-black rounded-[12px] px-4 py-3 font-medium text-sm text-black outline-none focus:border-black transition-all resize-none placeholder:text-gray-400 leading-relaxed"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">
                    No file needed — our team designs for free based on your description.
                  </p>
                </div>
              )}
            </div>

            {/* 5. CONTACT INFO — capture lead before showing price */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Contact Information
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                      className={`w-full h-[52px] border-2 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all ${fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      autoComplete="name"
                    />
                    {fieldErrors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {fieldErrors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                      className={`w-full h-[52px] border-2 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      autoComplete="email"
                    />
                    {fieldErrors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {fieldErrors.email}</p>}
                  </div>
                </div>
                {quoteError && <p className="text-red-500 text-[12px] mt-1 font-semibold">⚠ {quoteError}</p>}
                {checkoutError && <p className="text-red-500 text-[12px] mt-1 font-semibold">⚠ {checkoutError}</p>}
              </div>
            </div>

          </>
        )}

        {/* === STEP 2: PRICING + DELIVERY + PAYMENT === */}
        {mounted && currentStep === 2 && (
          <>
            {/* UPSELL TIERS — shown at top of Step 2 */}
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

            {/* PRICE SUMMARY */}
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
                  {rushSurcharge > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Rush Delivery Fee:</span>
                        <span className="text-red-600 font-black">+${rushSurcharge.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* DELIVERY OPTIONS */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Delivery Options
              </label>
              {/* 3 options in one row */}
              <div className="grid grid-cols-3 gap-2">
                {/* Rush Delivery */}
                <div
                  onClick={() => setDeliveryOption("rush")}
                  className="cursor-pointer rounded-[12px] transition-all flex flex-col items-center justify-center py-3 px-2 text-center"
                  style={{ border: deliveryOption === "rush" ? '2px solid #000' : '2px solid #9CA3AF', background: deliveryOption === "rush" ? '#000' : '#fff' }}
                >
                  <p className={`text-base font-black leading-tight ${deliveryOption === "rush" ? 'text-white' : 'text-black'}`}>Rush</p>
                  <p className={`text-xs font-bold mt-1 ${deliveryOption === "rush" ? 'text-panda-yellow' : 'text-red-500'}`}>+${quantity <= 50 ? 100 : quantity <= 250 ? 150 : quantity <= 1000 ? 200 : 300}</p>
                </div>

                {/* Standard Delivery */}
                <div
                  onClick={() => setDeliveryOption("standard")}
                  className="cursor-pointer rounded-[12px] transition-all flex flex-col items-center justify-center py-3 px-2 text-center"
                  style={{ border: deliveryOption === "standard" ? '2px solid #000' : '2px solid #9CA3AF', background: deliveryOption === "standard" ? '#000' : '#fff' }}
                >
                  <p className={`text-base font-black leading-tight ${deliveryOption === "standard" ? 'text-white' : 'text-black'}`}>Standard</p>
                  <p className={`text-[11px] font-medium mt-1 ${deliveryOption === "standard" ? 'text-gray-300' : 'text-gray-400'}`}>12-14 days</p>
                </div>

                {/* Economy Delivery */}
                <div
                  onClick={() => setDeliveryOption("economy")}
                  className="cursor-pointer rounded-[12px] transition-all flex flex-col items-center justify-center py-3 px-2 text-center"
                  style={{ border: deliveryOption === "economy" ? '2px solid #000' : '2px solid #9CA3AF', background: deliveryOption === "economy" ? '#000' : '#fff' }}
                >
                  <p className={`text-base font-black leading-tight ${deliveryOption === "economy" ? 'text-white' : 'text-black'}`}>Economy</p>
                  <span className="inline-block bg-panda-yellow text-black text-[10px] font-black px-2 py-0.5 rounded-full mt-1">10% OFF</span>
                  <p className={`text-[11px] font-medium mt-0.5 ${deliveryOption === "economy" ? 'text-gray-300' : 'text-gray-400'}`}>16-18 days</p>
                </div>
              </div>

              {/* Rush date picker — shown below grid when rush is selected */}
              {deliveryOption === "rush" && (
                <div className="mt-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Select Rush Date <span className="normal-case font-medium text-gray-400">(Mon - Fri only)</span>
                  </label>
                  <input
                    type="date"
                    value={rushDate}
                    min={getMinRushDate()}
                    onChange={handleRushDateChange}
                    className="w-full h-[52px] rounded-[12px] px-5 font-bold text-base text-black outline-none transition-all cursor-pointer"
                    style={{ border: '2px solid #9CA3AF' }}
                  />
                  {weekendWarning && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 font-medium">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Rush delivery is not available on weekends. Please select a weekday (Monday - Friday).
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    Our representative will get back to you within 4-16 hours with a mockup for approval and will also confirm the rush date.
                  </p>
                </div>
              )}

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
                className="w-full rounded-[12px] bg-white transition-all flex items-center justify-between px-5 h-[52px] hover:border-gray-500"
                style={{ border: '2px solid #9CA3AF' }}
              >
                <span className="text-base font-bold text-black">
                  {selectedAddons.length > 0
                    ? `${selectedAddons.length} Upgrade${selectedAddons.length > 1 ? 's' : ''} Selected`
                    : 'Click to Add Upgrades'}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform flex-shrink-0 text-gray-400 ${showAddons ? 'rotate-180' : ''}`}
                />
              </button>

              {showAddons && ADDON_OPTIONS.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-3">
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
                        className="cursor-pointer flex items-center gap-3 p-4 rounded-[12px] bg-white transition-all"
                        style={{ border: selectedAddons.includes(addon.id) ? '2px solid #000' : '2px solid #9CA3AF' }}
                      >
                        {addon.icon.startsWith('http') ? (
                            <div className="relative w-8 h-8 flex-shrink-0">
                              <Image src={addon.icon} alt={addon.name} fill className="object-contain" sizes="32px" />
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
              )}
            </div>
            )}

            {/* PHONE NUMBER */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Phone Number <span className="normal-case font-medium text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[52px] rounded-[12px] px-5 font-bold text-base text-black outline-none focus:border-black transition-all"
                style={{ border: '2px solid #9CA3AF' }}
              />
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
                className="w-full rounded-[12px] px-5 py-3 font-bold text-base text-black outline-none focus:border-black transition-all resize-none"
                style={{ border: '2px solid #9CA3AF' }}
              />
            </div>

            {/* SPECIAL INSTRUCTIONS */}
            <div>
              <label className="text-sm font-black text-black uppercase tracking-wide mb-2 block">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder={'e.g. "Please use metallic gold thread", "Add text on back side", "Match Pantone color 123C"'}
                className="w-full h-[90px] rounded-[12px] px-5 py-3 font-medium text-base text-black outline-none focus:border-black transition-all resize-none"
                style={{ border: '2px solid #9CA3AF' }}
              />
            </div>

          </>
        )}

        {/* === PAYMENT METHOD SELECTOR (Step 2 only) === */}
        {mounted && currentStep === 2 && (
          <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #9CA3AF' }}>
            <label className="text-sm font-bold text-black uppercase tracking-wide mb-4 block">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">

              {/* Credit/Debit Cards */}
              <button type="button" onClick={() => setPaymentMethod("card")}
                className="h-[72px] rounded-xl transition-all duration-150 flex items-center justify-center px-1"
                style={{ border: paymentMethod === "card" ? '2px solid #000' : '2px solid #9CA3AF', background: paymentMethod === "card" ? '#fff' : '#F9FAFB' }}
              >
                <img src="/assets/payments/cards.svg" alt="Visa, Mastercard, Amex" style={{width: '100%', height: 'auto'}} />
              </button>

              {/* PayPal - temporarily disabled (account blocked) */}

              {/* Cash App */}
              <button type="button" onClick={() => setPaymentMethod("cashapp")}
                className="h-[72px] rounded-xl transition-all duration-150 flex items-center justify-center px-3"
                style={{ border: paymentMethod === "cashapp" ? '2px solid #000' : '2px solid #9CA3AF', background: paymentMethod === "cashapp" ? '#fff' : '#F9FAFB' }}
              >
                <img src="/assets/payments/cashapp.svg" alt="Cash App" style={{height: '50px', width: 'auto'}} />
              </button>

              {/* Afterpay */}
              <button type="button" onClick={() => setPaymentMethod("afterpay")}
                className="h-[72px] rounded-xl transition-all duration-150 flex items-center justify-center px-1"
                style={{ border: paymentMethod === "afterpay" ? '2px solid #000' : '2px solid #9CA3AF', background: paymentMethod === "afterpay" ? '#fff' : '#F9FAFB' }}
              >
                <img src="/assets/payments/afterpay.svg" alt="Afterpay" style={{width: '100%', height: 'auto'}} />
              </button>

              {/* Apple Pay */}
              <button type="button" onClick={() => setPaymentMethod("applepay")}
                className="h-[72px] rounded-xl transition-all duration-150 flex items-center justify-center px-3"
                style={{ border: paymentMethod === "applepay" ? '2px solid #000' : '2px solid #9CA3AF', background: paymentMethod === "applepay" ? '#fff' : '#F9FAFB' }}
              >
                <img src="/assets/payments/applepay.svg" alt="Apple Pay" style={{height: '50px', width: 'auto'}} />
              </button>

              {/* Klarna */}
              <button type="button" onClick={() => setPaymentMethod("klarna")}
                className="h-[72px] rounded-xl transition-all duration-150 flex items-center justify-center px-1"
                style={{ border: paymentMethod === "klarna" ? '2px solid #000' : '2px solid #9CA3AF', background: paymentMethod === "klarna" ? '#fff' : '#F9FAFB' }}
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
                {"256-bit SSL encrypted payment"}
              </span>
            </div>
          </div>
        )}

        {/* === NAVIGATION BUTTONS === */}
        {mounted && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {currentStep === 1 ? (
            /* STEP 1 BUTTONS */
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleNext}
                className="w-full h-[70px] bg-black text-panda-yellow rounded-[14px] font-black text-[16px] md:text-[18px] uppercase tracking-wide md:tracking-widest hover:scale-[1.01] transition-transform shadow-xl"
              >
                CHECK BEST PRICES →
              </button>
            </div>
          ) : (
            /* STEP 2 BUTTONS: Checkout + Quote + Back */
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
                onClick={handleDirectQuote}
                disabled={quoteSending || quoteSent}
                className={`w-full h-[56px] rounded-[14px] font-bold uppercase tracking-widest text-[13px] flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed ${quoteSent ? 'bg-green-50 text-green-700' : 'bg-white text-gray-800 hover:border-black hover:text-black hover:bg-gray-50'}`}
                style={{ border: quoteSent ? '2px solid #16a34a' : '2px solid #9CA3AF' }}
              >
                {quoteSending ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" /> Sending...</>
                ) : quoteSent ? (
                  <><Check size={18} /> Quote Sent! Check Your Email</>
                ) : (
                  <><FileText size={18} /> GET FREE QUOTE — Email Me The Price</>
                )}
              </button>

              {quoteSent && <FormFeedback formType="calculator_quote" />}

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
