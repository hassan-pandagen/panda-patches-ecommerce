'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import ReviewsSection from '@/components/home/ReviewsSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import { getStoredAttribution, generateEventId } from '@/lib/clientAttribution';
import {
  OFFER_CATEGORIES, calculateOfferTotal,
  OfferCategory, OfferPack,
} from '@/lib/offerPackages';
import type { SelectedOffer, FormData } from './OffersOrderFlow';

// The multi-step order form (steps 1-4, ~600 lines) only ever renders after a
// customer clicks "Order Now" — code-split it so that bundle isn't downloaded
// or hydrated on every /offers page load (audit P2-1).
const OrderFlow = dynamic(() => import('./OffersOrderFlow'), { ssr: false });

const INITIAL_FORM: FormData = {
  artworkUrl: '', designDescription: '', width: '', height: '',
  backing: 'Iron-On', delivery: 'standard', upgrades: [], upgradesOpen: false,
  specialInstructions: '', name: '', email: '', phone: '', company: '',
  street: '', apt: '', city: '', state: '', zip: '',
};

// ─── Small components ─────────────────────────────────────────────────────────

function OfferPackCard({ pack, category, onSelect, isSelected }: {
  pack: OfferPack; category: OfferCategory; onSelect: () => void; isSelected: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-3 md:p-5 flex flex-col gap-1.5 md:gap-2 transition-all duration-200 bg-white hover:shadow-lg hover:-translate-y-0.5 ${isSelected ? 'border-[#051C05] shadow-xl' : 'border-gray-200 hover:border-gray-400'}`}
    >
      {pack.badge && (
        <span className={`absolute -top-2.5 left-3 text-[0.625rem] md:text-[0.6875rem] font-bold px-2 md:px-3 py-0.5 rounded-full ${pack.badge === 'Best Value' ? 'bg-[#DFFF00] text-[#051C05]' : 'bg-[#051C05] text-[#DFFF00]'}`}>
          {pack.badge}
        </span>
      )}
      <div className="text-[0.625rem] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{pack.name}</div>
      <div className="text-lg md:text-2xl font-black text-[#051C05]">${pack.price.toLocaleString('en-US')}</div>
      <div className="text-xs md:text-sm text-gray-500">{pack.qty} patches</div>
      <div className="text-xs md:text-sm font-bold text-green-700">${pack.perPiece.toFixed(2)}/pc</div>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={`mt-1 md:mt-2 w-full py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${isSelected ? 'bg-[#051C05] text-[#DFFF00]' : 'bg-[#DFFF00] text-[#051C05] hover:bg-[#d4f000]'}`}
      >
        {isSelected ? 'Selected' : 'Order Now'}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OffersClient({ categoryImages, ctaImageUrl, industryImages, craftmanshipSlot }: { categoryImages?: Record<string, string>; ctaImageUrl?: string; industryImages?: Record<string, string>; craftmanshipSlot?: React.ReactNode }) {
  const [selectedOffer, setSelectedOffer] = useState<SelectedOffer | null>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fileName, fileUrl, uploading, handleFileUpload, setFileName, setFileUrl } = useFileUpload();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fileUrl) setFormData(prev => ({ ...prev, artworkUrl: fileUrl }));
  }, [fileUrl]);


  const total = selectedOffer
    ? calculateOfferTotal(selectedOffer.basePrice, selectedOffer.qty, formData.backing, formData.delivery, formData.upgrades)
    : 0;

  const handleSelectOffer = (offer: SelectedOffer) => {
    setSelectedOffer(offer);
    setStep(1);
    setFormData(INITIAL_FORM);
    setFileName('');
    setFileUrl('');
    setError(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleStripeCheckout = async () => {
    if (!selectedOffer) return;
    setLoading(true);
    setError(null);
    const attribution = getStoredAttribution();
    // Shared event ID so browser pixel + server CAPI can dedupe (fixes May 26 Meta diagnostic)
    const initiateCheckoutEventId = generateEventId('initcheckout');
    try {
      try {
        if (typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'InitiateCheckout', {
            content_name: selectedOffer.packName,
            content_category: selectedOffer.categoryId,
            value: total,
            currency: 'USD',
          }, { eventID: initiateCheckoutEventId });
        }
      } catch { /* noop */ }
      // Store PII for Enhanced Conversions on success page (cleared after use)
      try {
        if (formData.email) sessionStorage.setItem('ec_email', formData.email);
        if (formData.phone) sessionStorage.setItem('ec_phone', formData.phone);
        const np = (formData.name || '').trim().split(' ');
        if (np[0]) sessionStorage.setItem('ec_first', np[0]);
        if (np.length > 1) sessionStorage.setItem('ec_last', np.slice(1).join(' '));
      } catch { /* noop */ }

      const res = await fetch('/api/checkout-offers-square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedOffer.categoryId,
          packName: selectedOffer.packName,
          backing: formData.backing,
          delivery: formData.delivery,
          upgrades: formData.upgrades,
          customer: { name: formData.name, email: formData.email, phone: formData.phone },
          shippingAddress: `${formData.street}${formData.apt ? ', ' + formData.apt : ''}, ${formData.city}, ${formData.state} ${formData.zip}`,
          width: parseFloat(formData.width) || 3,
          height: parseFloat(formData.height) || 3,
          artworkUrl: formData.artworkUrl || null,
          designDescription: formData.designDescription,
          specialInstructions: formData.specialInstructions,
          company: formData.company,
          attribution,
          initiateCheckoutEventId,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Checkout failed. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>

      {/* HERO — unified with stats strip at bottom */}
      <section className="relative w-full overflow-hidden bg-[#051C05]">
        {/* Background image — desktop only (hidden on mobile) */}
        {ctaImageUrl && (
          <div className="absolute inset-0 bottom-[88px] hidden md:block">
            {/* No priority: hidden on mobile yet priority forced a preload there,
                competing with real critical resources (audit P2). */}
            <Image src={ctaImageUrl} alt="Custom patch packages" fill sizes="100vw" className="object-cover object-center" />
          </div>
        )}

        {/* Hero text */}
        <div className="relative z-10 text-center px-6 pt-12 md:pt-16 pb-12 max-w-3xl mx-auto">
          <div className="inline-block bg-[#DFFF00] text-[#051C05] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Exclusive Packages</div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4 text-white md:text-[#051C05]">
            Custom Patch Packages<br />at Fixed Prices
          </h1>
          <p className="text-gray-300 md:text-gray-700 text-lg mb-6">No setup fees. No surprise charges. Mockup in 12-24 hours included.<br />Order in minutes, we handle the rest.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {['Mockup in 12-24 hours', '7-14 day delivery', 'Low 5-piece minimum', 'Money-back guarantee'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-[#DFFF00] md:text-[#051C05] font-semibold"><span>✓</span>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats strip — fused to bottom of hero */}
        <div className="relative z-10 border-t border-white/20">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-white/10">
            {[
              { stat: '1M+', label: 'Patches Delivered' },
              { stat: '5pc', label: 'Low Minimum Order' },
              { stat: '24h', label: 'Mockup' },
              { stat: '∞', label: 'Free Revisions' },
              { stat: '100%', label: 'Money-Back Guarantee' },
              { stat: 'A+', label: 'Top Notch Quality' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center justify-center py-5 px-3 bg-[#051C05]/80 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-black text-[#DFFF00] tracking-tight">{item.stat}</span>
                <span className="text-[0.625rem] font-semibold text-gray-400 uppercase tracking-widest mt-1 text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO ORDERS FROM US */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#051C05] mb-3">Trusted by Organizations Across the US</h2>
          <p className="text-gray-500 text-sm mb-10">From first responders to Fortune 500 brands, we make patches for teams that demand quality.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {[
              { key: 'fire department', label: 'Fire Departments', href: '/custom-fire-department-patches' },
              { key: 'sports', label: 'Sports Teams', href: '/custom-sports-patches' },
              { key: 'corporate', label: 'Corporate Brands', href: '/custom-corporate-patches' },
              { key: 'police', label: 'Law Enforcement', href: '/custom-police-patches' },
              { key: 'apparel', label: 'Apparel Brands', href: '/custom-patches/woven' },
              { key: 'bands', label: 'Band Merchandise', href: '/custom-patches/embroidered' },
            ].map(item => {
              const imgUrl = industryImages?.[item.key];
              return (
                <Link key={item.label} href={item.href} className="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-[#DFFF00] hover:shadow-md transition-all block">
                  <div className="relative w-full h-[160px] sm:h-[200px] bg-white flex items-center justify-center overflow-hidden">
                    {imgUrl ? (
                      <Image src={imgUrl} alt={`Custom patches for ${item.label}`} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gray-50" />
                    )}
                  </div>
                  <div className="py-3 px-4 bg-[#051C05]">
                    <span className="text-white text-xs sm:text-sm font-bold">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="text-gray-400 text-xs mt-6">Also serving: Military units, motorcycle clubs, schools, universities, bands, and event organizers.</p>
        </div>
      </section>

      {/* OFFER CARDS — moved above reviews/craftsmanship (audit P3/UI-UX): this
          is the primary buy page, and paid-social visitors with a ~9s attention
          budget were never reaching a price behind ~3 screens of social proof. */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-14 md:space-y-20">
          {(() => {
            const slugCount: Record<string, number> = {};
            return OFFER_CATEGORIES.map(cat => {
            const count = slugCount[cat.slug] || 0;
            slugCount[cat.slug] = count + 1;
            const imgSrc = count === 0
              ? categoryImages?.[cat.slug]
              : categoryImages?.[`${cat.slug}_${count}`] || categoryImages?.[cat.slug];
            const isThisCatSelected = selectedOffer?.categoryId === cat.id && step > 0;
            return (
              <div key={cat.id} id={cat.id} className="border-b border-gray-100 pb-14 last:border-0 last:pb-0">

                {/* Category header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#051C05]">{cat.type}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{cat.subtitle}</p>
                </div>

                {/* Image + Pricing cards */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Product image */}
                  {imgSrc && (
                    <div className="w-full md:w-56 shrink-0">
                      <div className="relative w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                        <Image
                          src={imgSrc}
                          alt={`${cat.type} sample`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 224px"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pricing cards */}
                  <div className={`grid gap-3 md:gap-4 flex-1 w-full ${cat.packs.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                    {cat.packs.map(pack => (
                      <OfferPackCard
                        key={pack.name}
                        pack={pack}
                        category={cat}
                        isSelected={selectedOffer?.categoryId === cat.id && selectedOffer?.packName === pack.name}
                        onSelect={() => handleSelectOffer({
                          categoryId: cat.id,
                          packName: pack.name,
                          qty: pack.qty,
                          basePrice: pack.price,
                          type: cat.type,
                          subtitle: cat.subtitle,
                        })}
                      />
                    ))}
                  </div>
                </div>

                {/* INLINE ORDER FORM — expands below this category when selected.
                    Code-split via OrderFlow (next/dynamic, ssr:false) so steps 1-4
                    only download/hydrate once a customer actually clicks Order Now
                    (audit P2-1). The ref stays on this wrapper (not inside the
                    dynamically-imported component) so scrollIntoView keeps working
                    without needing forwardRef. */}
                {isThisCatSelected && selectedOffer && (
                  <div ref={formRef}>
                    <OrderFlow
                      offer={selectedOffer}
                      step={step}
                      setStep={setStep}
                      total={total}
                      formData={formData}
                      setFormData={setFormData}
                      fileName={fileName}
                      uploading={uploading}
                      handleFileUpload={handleFileUpload}
                      clearFile={() => { setFileName(''); setFileUrl(''); setFormData(prev => ({ ...prev, artworkUrl: '' })); }}
                      loading={loading}
                      error={error}
                      onStripe={handleStripeCheckout}
                      onClose={() => { setStep(0); setSelectedOffer(null); }}
                    />
                  </div>
                )}

              </div>
            );
          });
          })()}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <ReviewsSection />

      {/* CRAFTSMANSHIP REELS */}
      {craftmanshipSlot}

      {/* WHAT'S INCLUDED */}
      <section className="bg-[#f9fdf0] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-[#051C05] mb-8">What&apos;s Included in Every Offer</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {[
              'Digital mockup delivered in 12 to 24 hours',
              'Unlimited free revisions until you are 100% happy',
              'Production starts only after your written approval',
              'Free shipping on every order anywhere in the US',
              'Zero setup fees and zero hidden charges',
              'Choice of backing type. Velcro hook and loop is charged separately',
              '7 to 14 day standard delivery. Rush production available',
              'Over 1,000,000 patches delivered to brands across the US',
              '100% money-back guarantee',
              'Dedicated support team available 7 days a week',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <span className="text-green-600 font-black text-lg mt-0.5">✓</span>
                <span className="text-sm font-semibold text-[#051C05]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-[#051C05] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What happens after I pay?',
                a: 'Within 24 hours, our design team emails you a digital mockup. You review, request changes, and approve. Production starts only after your sign-off.',
              },
              {
                q: 'What if I don\'t like the mockup?',
                a: 'Request as many changes as needed — all free. If we still can\'t get it right, full refund. Money-back guarantee.',
              },
              {
                q: 'Why is Velcro backing extra?',
                a: 'Velcro needs hook and loop both sides — more materials and labor, so it is charged separately. Best for tactical, military, and uniform patches.',
              },
              {
                q: 'What delivery options are there?',
                a: 'Economy (16-18 days, 10% off) | Standard (7-14 days, free) | Rush (50pcs +$50, 100pcs +$75, 500pcs +$150, 1000pcs +$200). Rush date confirmed by email within 2-6 hours.',
              },
              {
                q: 'What does "under 4 inches" mean?',
                a: 'The longest dimension is 4" or less — covers 90% of hat patches, left-chest and shoulder patches.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'Visa, Mastercard, Amex, Apple Pay, Google Pay, Cash App, AfterPay. All 256-bit SSL encrypted via Square.',
              },
              {
                q: 'Can I order a different quantity?',
                a: 'These offers cover 90% of orders. For custom sizes, mixed types, or anything else — free quote in minutes.',
              },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#051C05] py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Need a Custom Size or Quantity?</h2>
          <p className="text-gray-300 text-base mb-8">Our offers cover 90% of orders. For custom sizes, mixed types, or anything else. Free quote in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact" className="inline-block px-8 py-3 bg-black text-white font-bold uppercase tracking-wider text-sm transition-colors duration-300 hover:bg-panda-yellow hover:text-black rounded-[4px] border border-white/40">
              Get a Free Quote
            </Link>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const api = (window as any).Tawk_API;
                if (api?.maximize) api.maximize();
                else if (api?.toggle) api.toggle();
              }}
              className="inline-block px-8 py-3 bg-black text-white font-bold uppercase tracking-wider text-sm transition-colors duration-300 hover:bg-panda-yellow hover:text-black rounded-[4px] border border-white/40"
            >
              Chat With Us Now
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-bold text-[#051C05] text-sm sm:text-base pr-4">{q}</span>
        <span className={`text-[#051C05] font-black text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{a}</div>
      )}
    </div>
  );
}
