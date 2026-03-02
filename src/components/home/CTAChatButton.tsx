'use client';

import { MessageCircle } from 'lucide-react';

export default function CTAChatButton() {
  function openChat() {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.maximize();
    }
  }

  return (
    <button
      onClick={openChat}
      className="
        flex items-center gap-2
        bg-black text-panda-yellow
        font-bold text-[16px]
        px-10 py-3
        rounded-[6px]
        hover:scale-105 transition-transform duration-300 shadow-xl
        mt-2
      "
    >
      <MessageCircle size={18} strokeWidth={2.5} />
      Chat Now
    </button>
  );
}
