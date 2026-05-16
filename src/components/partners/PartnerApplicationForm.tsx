'use client';

import { useState } from 'react';

const inputCls = 'w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-panda-green focus:border-transparent transition';
const labelCls = 'block text-[12px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase';

export default function PartnerApplicationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hearAboutUs, setHearAboutUs] = useState('');
  const [hearOther, setHearOther] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('');
  const [customVolume, setCustomVolume] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const resolvedVolume = monthlyVolume === 'Custom' ? customVolume.trim() : monthlyVolume;
    const resolvedHearAboutUs = hearAboutUs === 'Other' ? hearOther.trim() : hearAboutUs;

    const payload = {
      fullName: String(fd.get('fullName') || '').trim(),
      businessEmail: String(fd.get('businessEmail') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      businessName: String(fd.get('businessName') || '').trim(),
      businessWebsite: String(fd.get('businessWebsite') || '').trim(),
      productsInterest: String(fd.get('productsInterest') || '').trim(),
      monthlyVolume: resolvedVolume,
      hearAboutUs: resolvedHearAboutUs,
      website: String(fd.get('website') || ''),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Submission failed. Please try again or call (302) 250-4340.');
      }

      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again or call (302) 250-4340.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[22px] font-black text-gray-900 mb-2">Application received!</h3>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-6 max-w-[320px] mx-auto">
          Lance will reach out within 24 hours with your partner pricing and onboarding details.
        </p>
        <p className="text-[13px] text-gray-400">
          Need us sooner?{' '}
          <a href="tel:+13022504340" className="text-panda-green font-semibold underline">
            Call (302) 250-4340
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      id="partner-application"
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl overflow-hidden"
      noValidate
    >
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }} aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Modal Header */}
      <div className="px-8 pt-8 pb-6">
        <h3 id="partner-application-title" className="text-[22px] font-black text-gray-900 mb-1.5">
          Apply to Partner Program
        </h3>
        <p className="text-[14px] text-gray-500 leading-relaxed">
          Tell us about your business. Lance reaches out within 24 hours with your partner pricing.
        </p>
      </div>

      {/* Form Fields */}
      <div className="px-8 pb-2 space-y-5">

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className={labelCls}>Full name <span className="text-red-500">*</span></label>
            <input id="fullName" name="fullName" type="text" required autoComplete="name" className={inputCls} placeholder="Jane Smith" />
          </div>
          <div>
            <label htmlFor="businessName" className={labelCls}>Business name <span className="text-red-500">*</span></label>
            <input id="businessName" name="businessName" type="text" required autoComplete="organization" className={inputCls} placeholder="Your Agency" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessEmail" className={labelCls}>Email <span className="text-red-500">*</span></label>
            <input id="businessEmail" name="businessEmail" type="email" required autoComplete="email" className={inputCls} placeholder="jane@agency.com" />
          </div>
          <div>
            <label htmlFor="phone" className={labelCls}>Phone <span className="text-red-500">*</span></label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputCls} placeholder="(555) 123-4567" />
          </div>
        </div>

        {/* Row 3 — Volume + How heard */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="monthlyVolume" className={labelCls}>Monthly volume</label>
            <select
              id="monthlyVolume"
              value={monthlyVolume}
              onChange={e => setMonthlyVolume(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled hidden>Select range</option>
              <option value="Under 100">Under 100 / mo</option>
              <option value="100-499">100 – 499 / mo</option>
              <option value="500-1,999">500 – 1,999 / mo</option>
              <option value="2,000+">2,000+ / mo</option>
              <option value="Custom">Enter custom range</option>
            </select>
            {monthlyVolume === 'Custom' && (
              <input
                type="text"
                value={customVolume}
                onChange={e => setCustomVolume(e.target.value)}
                className={`${inputCls} mt-2`}
                placeholder="e.g. 3,500 / mo"
              />
            )}
          </div>
          <div>
            <label htmlFor="hearAboutUs" className={`${labelCls} whitespace-nowrap`}>How did you find us?</label>
            <select
              id="hearAboutUs"
              value={hearAboutUs}
              onChange={e => setHearAboutUs(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled hidden>Select</option>
              <option value="Google search">Google search</option>
              <option value="Referral">Referral</option>
              <option value="Social media">Social media</option>
              <option value="ChatGPT or AI search">ChatGPT / AI</option>
              <option value="Industry directory">Industry directory</option>
              <option value="Other">Other</option>
            </select>
            {hearAboutUs === 'Other' && (
              <input
                type="text"
                value={hearOther}
                onChange={e => setHearOther(e.target.value)}
                className={`${inputCls} mt-2`}
                placeholder="Please specify..."
              />
            )}
          </div>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="businessWebsite" className={labelCls}>
            Website <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <input id="businessWebsite" name="businessWebsite" type="url" autoComplete="url" className={inputCls} placeholder="https://youragency.com" />
        </div>

        {/* Products */}
        <div>
          <label htmlFor="productsInterest" className={labelCls}>
            Products you typically order <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            id="productsInterest" name="productsInterest" rows={2} maxLength={1000}
            className={`${inputCls} resize-none`}
            placeholder="e.g. embroidered hat patches, PVC keychains, chenille letterman..."
          />
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-8 pb-7 pt-0">
        <button
          type="submit"
          disabled={submitting}
          className="w-full font-black text-[15px] py-4 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#111827', color: '#ffffff' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dcff70'; (e.currentTarget as HTMLButtonElement).style.color = '#111827'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111827'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
        >
          {submitting ? 'Submitting…' : 'Apply to Partner Program →'}
        </button>
        <p className="text-[11px] text-gray-400 text-center mt-3">
          Response within 24 hours · No commitment required
        </p>
      </div>
    </form>
  );
}
