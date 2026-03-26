'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTrustpilot } from '@/lib/useTrustpilot';
import ReviewsSection from '@/components/home/ReviewsSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import {
  OFFER_CATEGORIES, calculateOfferTotal, getRushFee,
  VELCRO_FEE, METALLIC_FEE, GLOW_FEE, PUFF_FEE,
  OfferCategory, OfferPack,
} from '@/lib/offerPackages';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SelectedOffer {
  categoryId: string;
  packName: string;
  qty: number;
  basePrice: number;
  type: string;
  subtitle: string;
}

interface FormData {
  artworkUrl: string;
  designDescription: string;
  width: string;
  height: string;
  backing: string;
  delivery: string;
  upgrades: string[];
  upgradesOpen: boolean;
  specialInstructions: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

const INITIAL_FORM: FormData = {
  artworkUrl: '', designDescription: '', width: '', height: '',
  backing: 'Iron-On', delivery: 'standard', upgrades: [], upgradesOpen: false,
  specialInstructions: '', name: '', email: '', phone: '', company: '',
  street: '', apt: '', city: '', state: '', zip: '',
};

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

// ─── Small components ─────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
  const labels = ['Design', 'Options', 'Details', 'Review'];
  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {labels.map((label, i) => {
        const s = i + 1;
        const done = step > s;
        const active = step === s;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-[#051C05] text-[#DFFF00]' : 'bg-gray-200 text-gray-500'}`}>
                {done ? '✓' : s}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${active ? 'text-[#051C05]' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < 3 && <div className={`w-8 h-0.5 mb-5 mx-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

function OfferPackCard({ pack, category, onSelect, isSelected }: {
  pack: OfferPack; category: OfferCategory; onSelect: () => void; isSelected: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-3 md:p-5 flex flex-col gap-1.5 md:gap-2 transition-all duration-200 bg-white hover:shadow-lg hover:-translate-y-0.5 ${isSelected ? 'border-[#051C05] shadow-xl' : 'border-gray-200 hover:border-gray-400'}`}
    >
      {pack.badge && (
        <span className={`absolute -top-2.5 left-3 text-[10px] md:text-[11px] font-bold px-2 md:px-3 py-0.5 rounded-full ${pack.badge === 'Best Value' ? 'bg-[#DFFF00] text-[#051C05]' : 'bg-[#051C05] text-[#DFFF00]'}`}>
          {pack.badge}
        </span>
      )}
      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{pack.name}</div>
      <div className="text-lg md:text-2xl font-black text-[#051C05]">${pack.price.toLocaleString('en-US')}</div>
      <div className="text-xs md:text-sm text-gray-500">{pack.qty} patches</div>
      <div className="text-xs md:text-sm font-bold text-green-700">${pack.perPiece.toFixed(2)}/pc</div>
      <button
        className={`mt-1 md:mt-2 w-full py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${isSelected ? 'bg-[#051C05] text-[#DFFF00]' : 'bg-[#DFFF00] text-[#051C05] hover:bg-[#d4f000]'}`}
      >
        {isSelected ? 'Selected' : 'Order Now'}
      </button>
    </div>
  );
}

function OrderSummaryBar({ offer, total }: { offer: SelectedOffer; total: number }) {
  return (
    <div className="bg-[#051C05] text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-widest">Selected</div>
        <div className="font-bold text-[#DFFF00]">{offer.type} — {offer.packName} ({offer.qty} pcs)</div>
        <div className="text-xs text-gray-300">{offer.subtitle}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">Order Total</div>
        <div className="text-2xl font-black text-[#DFFF00]">${total.toFixed(2)}</div>
      </div>
    </div>
  );
}

// ─── Step 1: Design ───────────────────────────────────────────────────────────

function Step1({
  formData, setFormData, onNext, offer,
  fileName, uploading, handleFileUpload, clearFile,
}: {
  formData: FormData; setFormData: (f: FormData) => void; onNext: () => void; offer: SelectedOffer;
  fileName: string; uploading: boolean; handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
}) {
  const isUnder4 = offer.subtitle.includes('Under 4');
  const w = parseFloat(formData.width);
  const h = parseFloat(formData.height);
  const sizeWarn = isUnder4 && ((w > 4 && !isNaN(w)) || (h > 4 && !isNaN(h)));
  const canProceed = (!!formData.artworkUrl || formData.designDescription.length >= 20) && !uploading;

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-black text-[#051C05]">Step 1 — Your Design</h3>

      {/* Artwork Upload — required */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
        <label className="block text-sm font-bold text-[#051C05] mb-1">
          Artwork Upload <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">JPG, PNG, PDF, AI, EPS, SVG — max 20MB. We accept any format.</p>
        {formData.artworkUrl ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-green-600 font-black text-base">✓</span>
              <span className="text-sm font-bold text-green-700 truncate">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="ml-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors shrink-0"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="offer-artwork" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
              {uploading ? (
                <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>
              ) : (
                <div className="text-center px-4">
                  <div className="text-3xl mb-2">📎</div>
                  <span className="text-sm font-semibold text-gray-600">Click to upload your artwork</span>
                </div>
              )}
            </label>
            <p className="text-xs text-amber-600 mt-2 font-medium">No artwork yet? Upload a rough sketch, logo, or reference image. Our designers will handle the rest.</p>
          </>
        )}
        <input id="offer-artwork" type="file" accept=".jpg,.jpeg,.png,.pdf,.ai,.eps,.svg" className="hidden" onChange={handleFileUpload} />
      </div>

      {/* Design Description */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
        <label className="block text-sm font-bold text-[#051C05] mb-2">Design Instructions <span className="font-normal text-gray-400">(optional)</span></label>
        <textarea
          rows={3}
          maxLength={2000}
          value={formData.designDescription}
          onChange={e => setFormData({ ...formData, designDescription: e.target.value })}
          placeholder='e.g. Match Pantone 286C blue. Gold border 3mm. Font: bold italic. Text reads "Est. 1978"'
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] resize-none bg-white"
        />
        <p className="text-xs text-gray-400 mt-1">Colors, fonts, text, layout notes — anything specific for our design team.</p>
      </div>

      {/* Size */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
        <label className="block text-sm font-bold text-[#051C05] mb-2">Exact Size (inches)</label>
        <div className="flex items-center gap-3">
          <input type="number" step="0.1" min="0.5" max="50" value={formData.width} onChange={e => setFormData({ ...formData, width: e.target.value })} placeholder='Width"' className="w-28 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" />
          <span className="text-gray-400 font-bold">×</span>
          <input type="number" step="0.1" min="0.5" max="50" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder='Height"' className="w-28 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Most hat patches: 2&quot;x2&quot;. Left-chest: 3&quot;x3&quot;. Back patches: 10&quot;x12&quot;.</p>
        {sizeWarn && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            This offer is for patches up to 4&quot;. For larger sizes, chat with us for a custom quote.
          </div>
        )}
      </div>

      <button disabled={!canProceed} onClick={onNext} className="w-full py-4 rounded-2xl font-black text-base bg-[#051C05] text-[#DFFF00] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0a2e0a] transition-colors">
        {uploading ? 'Uploading...' : canProceed ? 'Continue to Options' : 'Upload Artwork or Describe Your Design'}
      </button>
    </div>
  );
}

// ─── Step 2: Options ──────────────────────────────────────────────────────────

function Step2({ formData, setFormData, onNext, onBack, offer }: {
  formData: FormData; setFormData: (f: FormData) => void;
  onNext: () => void; onBack: () => void; offer: SelectedOffer;
}) {
  const rushFee = getRushFee(offer.qty);
  const toggleUpgrade = (u: string) => {
    const next = formData.upgrades.includes(u)
      ? formData.upgrades.filter(x => x !== u)
      : [...formData.upgrades, u];
    setFormData({ ...formData, upgrades: next });
  };

  const BackingOptions = ['Iron-On', 'Sew-On', 'Sticker', 'Velcro'];
  const DeliveryOptions = [
    { value: 'economy', label: 'Economy', timeline: '16-18 business days', note: '10% off total', badge: null },
    { value: 'standard', label: 'Standard', timeline: '7-14 business days', note: 'FREE', badge: 'Recommended' },
    { value: 'rush', label: 'Rush', timeline: 'Confirmed by email', note: `+$${rushFee}`, badge: null },
  ];
  const PremiumUpgrades = [
    { name: 'Metallic Thread', fee: METALLIC_FEE, desc: 'Gold, silver or copper thread' },
    { name: 'Glow in the Dark', fee: GLOW_FEE, desc: 'Recharges under light' },
    { name: '3D Puff Embroidery', fee: PUFF_FEE, desc: 'Raises design off surface', badge: 'Most Popular' },
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-black text-[#051C05]">Step 2 — Options &amp; Upgrades</h3>

      {/* Backing */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
        <label className="block text-sm font-bold text-[#051C05] mb-3">Backing Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BackingOptions.map(b => (
            <button key={b} onClick={() => setFormData({ ...formData, backing: b })}
              className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.backing === b ? 'border-[#051C05] bg-[#051C05] text-[#DFFF00]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'}`}>
              {b}
              {b === 'Velcro' && <span className="block text-xs font-normal mt-0.5">+${VELCRO_FEE}</span>}
              {b !== 'Velcro' && <span className={`block text-xs font-normal mt-0.5 ${formData.backing === b ? 'text-[#DFFF00]' : 'text-green-600'}`}>FREE</span>}
            </button>
          ))}
        </div>
        {formData.backing === 'Velcro' && (
          <p className="text-xs text-gray-500 mt-3">Industry standard for tactical, military and uniform patches. Hook + loop both sides included.</p>
        )}
      </div>

      {/* Delivery */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
        <label className="block text-sm font-bold text-[#051C05] mb-3">Delivery Speed</label>
        <div className="space-y-2">
          {DeliveryOptions.map(d => {
            const selected = formData.delivery === d.value;
            return (
              <button key={d.value} onClick={() => setFormData({ ...formData, delivery: d.value })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${selected ? 'border-[#051C05] bg-[#051C05]' : 'border-gray-200 bg-white hover:border-gray-400'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${selected ? 'text-[#DFFF00]' : 'text-[#051C05]'}`}>{d.label}</span>
                    {d.badge && <span className="text-[10px] font-bold bg-[#DFFF00] text-[#051C05] px-2 py-0.5 rounded-full">{d.badge}</span>}
                  </div>
                  <div className={`text-xs mt-0.5 ${selected ? 'text-gray-300' : 'text-gray-500'}`}>{d.timeline}</div>
                </div>
                <div className={`text-sm font-black ${selected ? 'text-[#DFFF00]' : d.value === 'economy' ? 'text-green-700' : d.value === 'rush' ? 'text-orange-600' : 'text-gray-600'}`}>{d.note}</div>
              </button>
            );
          })}
        </div>
        {formData.delivery === 'rush' && (
          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <div className="font-bold mb-1">Rush selected</div>
            We will confirm your exact delivery date by email within 2-6 hours of your order. If the date doesn&apos;t work, reply to that email and we&apos;ll remove the rush upgrade and refund the rush fee — no questions asked.
          </div>
        )}
      </div>

      {/* Premium Upgrades */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
        <button onClick={() => setFormData({ ...formData, upgradesOpen: !formData.upgradesOpen })}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-[#051C05] hover:bg-gray-100 transition-colors">
          <span>+ Add Premium Upgrades (optional)</span>
          <span className="text-gray-400 text-lg">{formData.upgradesOpen ? '▲' : '▼'}</span>
        </button>
        {formData.upgradesOpen && (
          <div className="px-5 pb-5 space-y-2">
            {PremiumUpgrades.map(u => (
              <button key={u.name} onClick={() => toggleUpgrade(u.name)}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${formData.upgrades.includes(u.name) ? 'border-[#051C05] bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-400'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${formData.upgrades.includes(u.name) ? 'border-[#051C05] bg-[#051C05] text-[#DFFF00]' : 'border-gray-300'}`}>
                      {formData.upgrades.includes(u.name) && '✓'}
                    </div>
                    <span className="font-bold text-sm text-[#051C05]">{u.name}</span>
                    {u.badge && <span className="text-[10px] font-bold bg-[#DFFF00] text-[#051C05] px-2 py-0.5 rounded-full">{u.badge}</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 ml-7">{u.desc}</div>
                </div>
                <div className="text-sm font-black text-[#051C05]">+${u.fee}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border-2 border-gray-300 font-bold text-sm text-gray-700 hover:border-gray-400 bg-white">Back</button>
        <button onClick={onNext} className="flex-1 py-3 rounded-2xl font-black text-sm bg-[#051C05] text-[#DFFF00] hover:bg-[#0a2e0a] transition-colors">Continue</button>
      </div>
    </div>
  );
}

// ─── Step 3: Details ──────────────────────────────────────────────────────────

function Step4({ formData, setFormData, onNext, onBack }: {
  formData: FormData; setFormData: (f: FormData) => void; onNext: () => void; onBack: () => void;
}) {
  const upd = (k: keyof FormData, v: string) => setFormData({ ...formData, [k]: v });
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isZipValid = /^\d{5}$/.test(formData.zip);
  const canProceed = formData.name.length >= 2 && isEmailValid && formData.phone.length >= 7 && formData.street && formData.city && formData.state && isZipValid;

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-black text-[#051C05]">Step 3 — Your Details</h3>

      {/* Contact info */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50 space-y-4">
        <p className="text-xs font-bold text-[#051C05] uppercase tracking-widest">Contact</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1">Full Name *</label>
            <input value={formData.name} onChange={e => upd('name', e.target.value)} autoComplete="name" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Email Address *</label>
            <input type="email" value={formData.email} onChange={e => upd('email', e.target.value)} autoComplete="email" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="jane@example.com" />
            <p className="text-xs text-gray-400 mt-1">We&apos;ll send your mockup here</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number *</label>
            <input type="tel" value={formData.phone} onChange={e => upd('phone', e.target.value)} autoComplete="tel" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="(555) 123-4567" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1">Company Name <span className="font-normal text-gray-400">(optional)</span></label>
            <input value={formData.company} onChange={e => upd('company', e.target.value)} autoComplete="organization" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="Acme Corp" />
          </div>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          Your phone number is required by DHL/FedEx to process your shipment and send you delivery notifications.
        </div>
      </div>

      {/* Shipping address */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50 space-y-4">
        <p className="text-xs font-bold text-[#051C05] uppercase tracking-widest">Shipping Address</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1">Street Address *</label>
            <input value={formData.street} onChange={e => upd('street', e.target.value)} autoComplete="street-address" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="123 Main St" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1">Apt / Suite <span className="font-normal text-gray-400">(optional)</span></label>
            <input value={formData.apt} onChange={e => upd('apt', e.target.value)} autoComplete="address-line2" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="Suite 200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">City *</label>
            <input value={formData.city} onChange={e => upd('city', e.target.value)} autoComplete="address-level2" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="New York" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">State *</label>
            <select value={formData.state} onChange={e => upd('state', e.target.value)} autoComplete="address-level1" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white">
              <option value="">Select State</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ZIP Code *</label>
            <input value={formData.zip} onChange={e => upd('zip', e.target.value)} maxLength={5} autoComplete="postal-code" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#051C05] bg-white" placeholder="10001" />
            {formData.zip.length > 0 && !isZipValid && <p className="text-xs text-red-500 mt-1">Please enter a 5-digit ZIP code</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border-2 border-gray-300 font-bold text-sm text-gray-700 hover:border-gray-400 bg-white">Back</button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 py-3 rounded-2xl font-black text-sm bg-[#051C05] text-[#DFFF00] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0a2e0a] transition-colors">Continue to Review</button>
      </div>
    </div>
  );
}

// ─── Step 5: Review & Pay ─────────────────────────────────────────────────────

function Step5({
  offer, formData, total, loading, error,
  onBack, onStripe, onPayPal,
}: {
  offer: SelectedOffer; formData: FormData; total: number; loading: boolean; error: string | null;
  onBack: () => void; onStripe: () => void; onPayPal: () => void;
}) {
  const w = parseFloat(formData.width);
  const h = parseFloat(formData.height);
  const sizeStr = (!isNaN(w) && !isNaN(h) && formData.width && formData.height) ? `${w}" x ${h}"` : 'Not specified';
  const addr = `${formData.street}${formData.apt ? ', ' + formData.apt : ''}, ${formData.city}, ${formData.state} ${formData.zip}`;

  const rows = [
    { label: 'Patch Type', value: `${offer.type} (${offer.subtitle})` },
    { label: 'Pack', value: `${offer.packName} — ${offer.qty} pieces` },
    { label: 'Base Price', value: `$${offer.basePrice.toFixed(2)}` },
    { label: 'Backing', value: `${formData.backing}${formData.backing === 'Velcro' ? ' (+$30)' : ' (FREE)'}` },
    {
      label: 'Delivery',
      value: formData.delivery === 'economy' ? 'Economy 16-18 days (-10%)' :
        formData.delivery === 'rush' ? `Rush (+$${getRushFee(offer.qty)})` :
          'Standard 7-14 days (FREE)'
    },
    ...(formData.upgrades.map(u => ({ label: 'Upgrade', value: u }))),
    { label: 'Size', value: sizeStr },
    { label: 'Artwork', value: formData.artworkUrl ? 'File uploaded' : 'Not provided' },
    ...(formData.designDescription ? [{ label: 'Instructions', value: formData.designDescription.slice(0, 80) + (formData.designDescription.length > 80 ? '...' : '') }] : []),
    { label: 'Ship To', value: `${formData.name}, ${addr}` },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[#051C05]">Step 4 — Review &amp; Pay</h3>

      <div className="bg-gray-50 rounded-2xl p-5 space-y-2.5">
        {rows.map(r => (
          <div key={r.label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-gray-500 shrink-0">{r.label}</span>
            <span className="font-semibold text-[#051C05] text-right">{r.value}</span>
          </div>
        ))}
        <div className="pt-3 mt-2 border-t border-gray-200 flex items-center justify-between">
          <span className="font-bold text-gray-700">TOTAL</span>
          <span className="text-2xl font-black text-[#051C05]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Approval promise */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-1.5 text-sm text-green-800">
        <div className="font-bold text-base mb-2">Your Approval Before Anything Ships</div>
        <div>You&apos;ll receive a digital mockup within 24 hours for your approval.</div>
        <div>Request unlimited changes free of charge. Production starts only after your approval.</div>
        <div>Not happy? Full refund — money-back guarantee.</div>
      </div>

      {/* Payment logos */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span className="font-semibold text-gray-600">Pay with:</span>
        {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'AfterPay', 'Klarna'].map(p => (
          <span key={p} className="px-2 py-1 bg-gray-100 rounded font-medium text-gray-600">{p}</span>
        ))}
        <span className="ml-auto text-[11px] text-gray-400">256-bit SSL. Powered by Stripe.</span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* CTA */}
      <button
        onClick={onStripe}
        disabled={loading}
        className="w-full py-5 rounded-2xl font-black text-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? 'Processing...' : `Complete Order — $${total.toFixed(2)}`}
        {!loading && <span>🔒</span>}
      </button>

      {/* PayPal - temporarily disabled (account blocked) */}

      <button onClick={onBack} className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700">Back to Details</button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OffersClient({ categoryImages, ctaImageUrl, industryImages, craftmanshipSlot }: { categoryImages?: Record<string, string>; ctaImageUrl?: string; industryImages?: Record<string, string>; craftmanshipSlot?: React.ReactNode }) {
  const { rating: TRUSTPILOT_RATING, reviewCount: TRUSTPILOT_REVIEW_COUNT } = useTrustpilot();
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
    try {
      const res = await fetch('/api/checkout-offers', {
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

  const handlePayPalCheckout = async () => {
    if (!selectedOffer) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout-offers-paypal', {
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
        }),
      });
      const data = await res.json();
      if (data.url) {
        try {
          localStorage.setItem('paypal_order_data', JSON.stringify(data.orderData));
          localStorage.setItem('paypal_order_id', data.paypalOrderId);
        } catch {}
        window.location.href = data.url;
      } else {
        setError(data.error || 'PayPal checkout failed. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('PayPal checkout failed. Please try again.');
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
            <Image src={ctaImageUrl} alt="Custom patch packages" fill className="object-cover object-center" priority />
          </div>
        )}

        {/* Hero text */}
        <div className="relative z-10 text-center px-6 pt-12 md:pt-16 pb-12 max-w-3xl mx-auto">
          <div className="inline-block bg-[#DFFF00] text-[#051C05] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Exclusive Packages</div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4 text-white md:text-[#051C05]">
            Custom Patch Packages<br />at Fixed Prices
          </h1>
          <p className="text-gray-300 md:text-gray-700 text-lg mb-6">No setup fees. No surprise charges. Free design mockup included.<br />Order in minutes, we handle the rest.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {['Free design mockup', '7-14 day delivery', `${TRUSTPILOT_RATING} stars on Trustpilot`, 'Money-back guarantee'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-[#DFFF00] md:text-[#051C05] font-semibold"><span>✓</span>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats strip — fused to bottom of hero */}
        <div className="relative z-10 border-t border-white/20">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-white/10">
            {[
              { stat: '1M+', label: 'Patches Delivered' },
              { stat: `${TRUSTPILOT_RATING}★`, label: 'Trustpilot Rating' },
              { stat: '24h', label: 'Free Mockup' },
              { stat: '∞', label: 'Free Revisions' },
              { stat: '100%', label: 'Money-Back Guarantee' },
              { stat: 'A+', label: 'Top Notch Quality' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center justify-center py-5 px-3 bg-[#051C05]/80 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-black text-[#DFFF00] tracking-tight">{item.stat}</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1 text-center leading-tight">{item.label}</span>
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

      {/* CUSTOMER REVIEWS */}
      <ReviewsSection />

      {/* CRAFTSMANSHIP REELS */}
      {craftmanshipSlot}

      {/* OFFER CARDS */}
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

                {/* INLINE ORDER FORM — expands below this category when selected */}
                {isThisCatSelected && (
                  <div ref={formRef} className="mt-8 border-2 border-[#051C05] rounded-2xl overflow-hidden">
                    {/* Form header */}
                    <div className="bg-[#051C05] px-5 py-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Ordering</div>
                        <div className="font-bold text-[#DFFF00] text-sm">{selectedOffer.type} — {selectedOffer.packName} ({selectedOffer.qty} pcs)</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Total</div>
                          <div className="text-xl font-black text-[#DFFF00]">${total.toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => { setStep(0); setSelectedOffer(null); }}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold text-lg transition-colors"
                          aria-label="Close"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <div className="bg-white px-2 pt-0 pb-1">
                      <StepBar step={step} />
                    </div>

                    <div className="px-5 pb-6">
                      {step === 1 && (
                        <Step1
                          formData={formData} setFormData={setFormData}
                          offer={selectedOffer}
                          fileName={fileName} uploading={uploading}
                          handleFileUpload={handleFileUpload}
                          clearFile={() => { setFileName(''); setFileUrl(''); setFormData(prev => ({ ...prev, artworkUrl: '' })); }}
                          onNext={() => setStep(2)}
                        />
                      )}
                      {step === 2 && (
                        <Step2
                          formData={formData} setFormData={setFormData}
                          offer={selectedOffer}
                          onNext={() => setStep(3)} onBack={() => setStep(1)}
                        />
                      )}
                      {step === 3 && (
                        <Step4
                          formData={formData} setFormData={setFormData}
                          onNext={() => setStep(4)} onBack={() => setStep(2)}
                        />
                      )}
                      {step === 4 && (
                        <Step5
                          offer={selectedOffer} formData={formData} total={total}
                          loading={loading} error={error}
                          onBack={() => setStep(3)}
                          onStripe={handleStripeCheckout}
                          onPayPal={handlePayPalCheckout}
                        />
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          });
          })()}
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-[#f9fdf0] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-[#051C05] mb-8">What&apos;s Included in Every Offer</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {[
              'Free digital mockup delivered within 24 hours',
              'Unlimited free revisions until you are 100% happy',
              'Production starts only after your written approval',
              'Free shipping on every order anywhere in the US',
              'Zero setup fees and zero hidden charges',
              'Choice of backing type. Velcro hook and loop costs $30 extra',
              '7 to 14 day standard delivery. Rush production available',
              `Rated ${TRUSTPILOT_RATING} stars on Trustpilot with ${TRUSTPILOT_REVIEW_COUNT} verified customer reviews`,
              '100% money-back guarantee. No questions asked',
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
                a: 'Velcro needs hook and loop both sides — more materials and labor. +$30 is the industry standard. Best for tactical, military, and uniform patches.',
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
                a: 'Visa, Mastercard, Amex, Apple Pay, AfterPay, Klarna, Cash App. All 256-bit SSL encrypted via Stripe.',
              },
              {
                q: 'Can I order a different quantity?',
                a: 'These offers cover 90% of orders. For custom sizes, mixed types, or anything else — free quote in 60 seconds.',
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
          <p className="text-gray-300 text-base mb-8">Our offers cover 90% of orders. For custom sizes, mixed types, or anything else. Free quote in 60 seconds.</p>
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
