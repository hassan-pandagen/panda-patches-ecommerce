"use client";

import { useForm } from "react-hook-form";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function ContactHero() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // TODO: Connect to your backend/email service to send the message
    // For now, just show success message
    alert("Thank you! We'll get back to you soon.");
  };

  return (
    <section className="w-full pt-16 pb-24 bg-white">
      <div className="container mx-auto px-6 max-w-[1360px]">
        
        {/* MAIN HEADING */}
        <h1 className="text-[28px] md:text-[50px] font-black text-center text-panda-dark uppercase mb-20 tracking-tight">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* === LEFT COLUMN: FORM (Spans 7 cols) === */}
          <div className="lg:col-span-7">
            <h2 className="text-[20px] md:text-[32px] font-bold text-panda-dark mb-4">
              We would love to hear from you.
            </h2>
            <p className="text-gray-500 mb-10 text-[16px]">
              If you&apos;ve got great products your making or looking to work with us then drop us a line.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Name</label>
                  <input 
                    {...register("name")} 
                    placeholder="Name" 
                    className="w-full bg-[#F9FAF5] p-4 rounded-[12px] outline-none focus:ring-2 ring-panda-green/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                  <input 
                    {...register("email")} 
                    placeholder="Email" 
                    className="w-full bg-[#F9FAF5] p-4 rounded-[12px] outline-none focus:ring-2 ring-panda-green/20"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                <textarea 
                  {...register("message")} 
                  placeholder="Message" 
                  className="w-full bg-[#F9FAF5] p-4 rounded-[12px] h-[200px] resize-none outline-none focus:ring-2 ring-panda-green/20"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="saveInfo" className="w-5 h-5 accent-panda-green" />
                <label htmlFor="saveInfo" className="text-sm text-gray-500 cursor-pointer">
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="
                  bg-black text-panda-yellow 
                  font-bold text-[16px] 
                  px-10 py-4 
                  rounded-[8px] 
                  hover:scale-105 transition-transform duration-300 shadow-xl
                  uppercase tracking-wider
                "
              >
                Submit Now
              </button>

            </form>
          </div>

          {/* === RIGHT COLUMN: INFO (Spans 5 cols) === */}
          <div className="lg:col-span-5 space-y-10 lg:pl-12 pt-4">
            
            {/* Address */}
            <div>
              <h3 className="text-xl font-bold text-panda-dark mb-2">Address</h3>
              <p className="text-gray-600 leading-relaxed">
                1914 Quail Feather Ct,<br />
                Missouri City, TX 77489,<br />
                United States
              </p>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-xl font-bold text-panda-dark mb-2">Information</h3>
              <a href="tel:+13022504340" className="flex items-center gap-2 text-gray-600 mb-2 hover:text-panda-dark transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                +1 (302) 250-4340 — Call Us
              </a>
              <a href="https://wa.me/14157999969?text=Hi%20I%20need%20help%20placing%20my%20order" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-600 mb-2 hover:text-[#25D366] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 group-hover:text-[#25D366] transition-colors"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                +1 (415) 799-9969 — WhatsApp
              </a>
              <a href="mailto:admin@pandapatches.com" className="text-gray-600 hover:text-panda-dark transition-colors">admin@pandapatches.com</a>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold text-panda-dark mb-4">Social Media</h3>
              <div className="flex gap-3">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-panda-yellow hover:scale-110 transition-transform cursor-pointer">
                    <Icon size={18} />
                  </div>
                ))}
                {/* TikTok Icon */}
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 text-panda-yellow"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-xl font-bold text-panda-dark mb-2">We&apos;re Open</h3>
              <p className="text-gray-600 mb-1">Our store has re-opened for shopping, exchanges</p>
              <p className="text-gray-900 font-bold">Every day 11am to 7pm</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
