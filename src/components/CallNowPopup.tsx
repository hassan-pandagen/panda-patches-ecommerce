'use client';

import { useEffect, useState } from 'react';
import { X, Phone } from 'lucide-react';

const PHONE_NUMBER = '+1 (302) 250-4340';
const PHONE_TEL = 'tel:+13022504340';
const WHATSAPP_URL = 'https://wa.me/14157999969?text=Hi%20I%20need%20help%20placing%20my%20order';
const DELAY_MS = 60_000; // show after 60 seconds

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function CallNowPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('callPopupDismissed')) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem('callPopupDismissed', '1');
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 animate-slide-up animate-popup-ring"
      role="dialog"
      aria-label="Call us popup"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-[270px]">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {/* Ringing phone icon */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#DFFF00] flex items-center justify-center animate-phone-ring">
              <Phone size={18} className="text-[#051C05]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-bold text-[#051C05] text-sm leading-tight">Need help placing your order?</p>
            <p className="text-xs text-gray-500 mt-0.5">Our team is online now</p>
          </div>
        </div>

        {/* Call button */}
        <a
          href={PHONE_TEL}
          onClick={dismiss}
          className="flex items-center justify-center gap-2 w-full bg-[#051C05] hover:bg-[#0a3a0a] text-[#DFFF00] font-bold text-sm py-3 rounded-xl transition-colors mb-2"
        >
          <Phone size={15} />
          {PHONE_NUMBER}
        </a>

        {/* WhatsApp button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm py-3 rounded-xl transition-colors"
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>

        <p className="text-center text-[10px] text-gray-400 mt-2">Mon–Sun · 11am–7pm ET</p>
      </div>
    </div>
  );
}
