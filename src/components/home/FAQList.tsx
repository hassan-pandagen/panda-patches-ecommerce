"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQList({ questions }: { questions: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // All closed by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >

            {/* QUESTION HEADER (Clickable) */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 md:py-6 flex items-center justify-between text-left group"
            >
              {/* Mobile-Optimized Typography: 18px mobile, 22px desktop */}
              <span className={`
                text-[18px] md:text-[22px] lg:text-[24px] leading-[26px] md:leading-[32px] font-semibold transition-colors duration-300
                ${isOpen ? 'text-panda-dark' : 'text-gray-800'}
              `}>
                {item.question}
              </span>

              {/* Arrow Icon */}
              <div className={`
                transition-transform duration-300 text-gray-400 group-hover:text-panda-dark flex-shrink-0 ml-4
                ${isOpen ? 'rotate-180' : 'rotate-0'}
              `}>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </button>

            {/* ANSWER BODY (Animated) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  {/* Mobile-Optimized Typography: 15px mobile, 17px desktop */}
                  <p className="text-[15px] md:text-[17px] leading-[24px] md:leading-[28px] font-normal text-gray-600 px-6 py-5 md:py-6">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        );
      })}
    </div>
  );
}
