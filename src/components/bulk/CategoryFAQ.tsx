"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { generateFAQSchema, generateSchemaScript } from "@/lib/schemas";

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
  const faqSchema = generateFAQSchema(faqs);

  return (
    <section className="w-full py-16 md:py-24 bg-panda-light">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-[800px]">

        {/* Heading */}
        <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-10 md:mb-14">
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
                <span className="text-[14px] md:text-[16px] font-bold text-panda-dark pr-4 leading-tight">
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
                <p className="px-5 md:px-6 pb-5 text-[13px] md:text-[15px] text-gray-600 leading-[1.7]">
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
