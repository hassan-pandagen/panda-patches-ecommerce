'use client'

import { useEffect, useState } from "react";
import FAQList from "./FAQList";
import { generateFAQSchema, generateSchemaScript } from "@/lib/schemas";
import { genericFaqs } from "@/lib/genericFaqs";

interface FAQData {
  heading?: string;
  questions: Array<{ question: string; answer: string }>;
}

interface FAQProps {
  questions?: Array<{ question: string; answer: string }>;
  heading?: string;
}

export default function FAQ({ questions: propQuestions, heading: propHeading }: FAQProps = {}) {
  const [data, setData] = useState<FAQData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch FAQ data from Sanity on client side
    const getFAQData = async () => {
      try {
        // You can add client-side fetch here if needed
        setData(null);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        setData(null);
      }
    };
    getFAQData();
  }, []);

  // Use prop questions if provided (location-specific), otherwise Sanity data, otherwise generic fallback
  const questions = propQuestions || data?.questions || genericFaqs;

  if (!mounted) {
    return null;
  }

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(questions);

  return (
    <section className="w-full py-12 bg-white">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
      />

      <div className="container mx-auto px-6">
        
        {/* HEADING - Mobile Optimized */}
        <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-center text-panda-dark uppercase tracking-wide mb-8 md:mb-12 lg:mb-16">
          {propHeading || data?.heading || "FREQUENTLY ASKED QUESTIONS"}
        </h2>

        {/* LIST */}
        <FAQList questions={questions} />

      </div>
    </section>
  );
}
