"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { generateFAQSchema, generateSchemaScript } from "@/lib/schemas";

const bulkFAQs = [
  {
    question: "What's the minimum order for bulk pricing?",
    answer: "We start bulk pricing at 50 pieces — no strict minimum. You get better rates at 100+, 500+, and 1,000+ pieces. Whether you need 50 patches for your team or 50,000 for a national rollout, we've got you covered."
  },
  {
    question: "Can I get a pre-production sample before placing a large order?",
    answer: "Absolutely! For orders of 500+ pieces, we provide a free pre-production sample so you can verify quality, color accuracy, and sizing before we run the full batch. For smaller orders, samples are available for $25-$50 (credited toward your order)."
  },
  {
    question: "What file formats do you accept for artwork?",
    answer: "We accept all formats: AI, EPS, PDF, SVG (vector — preferred), as well as PNG, JPG, TIFF (raster). Don't have artwork? Send us a sketch, photo, or description and our design team will create a professional mockup for free."
  },
  {
    question: "Do you offer distributor or wholesale pricing?",
    answer: "Yes! We work with promotional products distributors, ASI members, and resellers. Contact us for special distributor rates, white-label options, and Net 30/60 payment terms. We're set up to be your go-to patch supplier."
  },
  {
    question: "What's the turnaround time for 1,000+ pieces?",
    answer: "Standard production is 2 weeks (10-14 business days) for most bulk orders, regardless of quantity. Rush orders of 7 business days are available for an additional fee. For orders over 10,000 pieces, turnaround may be 3-4 weeks depending on complexity."
  },
  {
    question: "Do returning customers get better pricing?",
    answer: "Yes! Returning bulk customers receive priority pricing, faster turnaround, and a dedicated account manager. Many of our bulk clients place recurring monthly orders and enjoy consistent volume discounts that improve over time."
  },
  {
    question: "Can you handle multiple patch designs in one order?",
    answer: "Absolutely. We frequently handle orders with 5-20+ different designs in a single run. Each design gets its own mockup approval process. Volume pricing is based on total pieces across all designs, so you still get bulk rates."
  },
  {
    question: "What quality standards do you follow?",
    answer: "Every patch goes through our 5-point quality inspection: thread tension verification, color matching, backing durability test, stitch integrity check, and final visual inspection. We use military-grade thread and professional twill backing. Our patches are trusted by fire departments, police departments, and Fortune 500 companies."
  },
];

export default function BulkFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqSchema = generateFAQSchema(bulkFAQs);

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
          Bulk Order FAQ
        </h2>

        {/* FAQ Items */}
        <div className="space-y-3">
          {bulkFAQs.map((faq, idx) => (
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
