"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQList({ questions }: { questions: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="border-b border-gray-200">

            {/* QUESTION HEADER (Clickable) */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full py-8 flex items-center justify-between text-left group"
            >
              {/* EXACT TYPOGRAPHY: 27px, Weight 400, Leading 36px */}
              <span className={`
                text-[27px] leading-[36px] font-normal transition-colors duration-300
                ${isOpen ? 'text-panda-dark' : 'text-gray-800'}
              `}>
                {item.question}
              </span>

              {/* Arrow Icon */}
              <div className={`
                transition-transform duration-300 text-gray-400 group-hover:text-panda-dark flex-shrink-0 ml-4
                ${isOpen ? 'rotate-180' : 'rotate-0'}
              `}>
                <ChevronDown size={28} />
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
                  className="overflow-hidden"
                >
                  {/* EXACT TYPOGRAPHY: 17px, Weight 400, Leading 30.6px */}
                  <p className="text-[17px] leading-[30.6px] font-normal text-gray-500 pb-8 max-w-4xl">
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
