"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
interface FAQ {
  question: string;
  answer: string;
}

interface CategoryFAQProps {
  title?: string;
  faqs: FAQ[];
}

export default function CategoryFAQ({ title = "Frequently Asked Questions", faqs }: CategoryFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-8 md:py-14 bg-panda-light">

      <div className="container mx-auto px-4 md:px-6 max-w-[50rem]">

        {/* Heading */}
        <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-10 md:mb-14">
          {title}
        </h2>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[12px] border border-gray-100 overflow-hidden shadow-sm"
            >
              {/* Question */}
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left group"
              >
                <span className="text-[0.875rem] md:text-[1rem] font-bold text-panda-dark pr-4 leading-tight">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180 text-panda-green" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 md:px-6 pb-5 text-[0.8125rem] md:text-[0.9375rem] text-gray-600 leading-[1.7]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
