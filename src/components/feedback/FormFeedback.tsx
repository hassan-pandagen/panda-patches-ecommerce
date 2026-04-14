"use client";

import { useState } from "react";

interface FormFeedbackProps {
  formType: "hero_quote" | "bulk_quote" | "calculator_quote" | "contact";
}

export default function FormFeedback({ formType }: FormFeedbackProps) {
  const [rating, setRating] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRating = async (selectedRating: string) => {
    setRating(selectedRating);

    // Fire GA4 event immediately on click
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "form_feedback", {
        rating: selectedRating,
        form_type: formType,
        page_url: window.location.pathname,
      });
    }
  };

  const handleSubmit = async () => {
    if (!rating) return;

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType,
          rating,
          comment: comment.trim() || null,
          pageUrl: window.location.pathname,
        }),
      });
    } catch {
      // Silent fail — feedback is non-critical
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-[12px] text-gray-400 mt-3 text-center">
        Thanks for your feedback!
      </p>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-[12px] text-gray-500 font-semibold text-center mb-2">
        How easy was filling out this form?
      </p>

      <div className="flex items-center justify-center gap-3 mb-2">
        {[
          { value: "easy", emoji: "😊", label: "Easy" },
          { value: "okay", emoji: "😐", label: "Okay" },
          { value: "difficult", emoji: "😟", label: "Difficult" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleRating(option.value)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-medium ${
              rating === option.value
                ? "border-panda-green bg-panda-green/10 text-panda-dark"
                : "border-gray-200 hover:border-gray-300 text-gray-500"
            }`}
          >
            <span className="text-[18px]">{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {rating && (
        <div className="space-y-2 mt-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any feedback? (optional)"
            maxLength={300}
            className="w-full text-[12px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 resize-none h-[50px] focus:outline-none focus:border-panda-green"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full text-[12px] font-bold text-panda-dark bg-gray-100 hover:bg-gray-200 rounded-lg py-1.5 transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
