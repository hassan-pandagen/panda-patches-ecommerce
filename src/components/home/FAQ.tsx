import FAQList from "./FAQList";
import { genericFaqs } from "@/lib/genericFaqs";

interface FAQProps {
  questions?: Array<{ question: string; answer: string }>;
  heading?: string;
}

export default function FAQ({ questions: propQuestions, heading: propHeading }: FAQProps = {}) {
  const questions = propQuestions || genericFaqs;

  return (
    <section className="w-full py-12 bg-white">

      <div className="container mx-auto px-6">
        
        {/* HEADING - Mobile Optimized */}
        <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-center text-panda-dark uppercase tracking-wide mb-8 md:mb-12 lg:mb-16">
          {propHeading || "FREQUENTLY ASKED QUESTIONS"}
        </h2>

        {/* LIST */}
        <FAQList questions={questions} />

      </div>
    </section>
  );
}
