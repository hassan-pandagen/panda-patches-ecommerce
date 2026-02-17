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
              <p className="text-gray-600 mb-1">+1 302 250 4340</p>
              <p className="text-gray-600">admin@pandapatches.com</p>
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
