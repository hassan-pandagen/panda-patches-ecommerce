import { getProductReviews } from "@/lib/productReviews";
import { TRUSTPILOT_PROFILE_URL } from "@/lib/reviewConstants";

/**
 * Customer testimonials, shown on product pages.
 *
 * These are real Trustpilot reviews of Panda Patches, and that is now what the
 * page says they are. Until 9 Sept 2026 this block was headed "<Product>
 * Reviews" and led with "4.8 out of 5 from 6 verified customer reviews", which
 * presented company reviews as ratings of the specific product — the same claim
 * the Product schema was making, and the reason both had to change. See the
 * long note in productReviews.ts.
 *
 * The per-product selection is kept: tag-matching still surfaces the most
 * relevant testimonial first, and rotation stops every page showing the same
 * six. That is a reasonable thing to do with testimonials. Computing an average
 * from them and calling it a product rating was not.
 *
 * Individual star counts stay because each is that reviewer's real Trustpilot
 * score. What is gone is the aggregate, which is the number that implied a
 * product had been rated.
 */
export default function ProductReviews({
  productKey,
  productName,
}: {
  productKey?: string;
  productName: string;
}) {
  const reviews = getProductReviews(productKey);
  if (!reviews.length) return null;

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[(m || 1) - 1]} ${d}, ${y}`;
  };

  return (
    <section className="w-full py-8 md:py-12 bg-panda-light">
      <div className="container mx-auto px-4 md:px-6 max-w-[68.75rem]">
        <div className="text-center mb-8">
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark tracking-tight mb-2">
            What customers say about working with us
          </h2>
          <p className="text-[0.875rem] md:text-[0.9375rem] text-gray-600 font-medium">
            Verified reviews of Panda Patches on{" "}
            <a
              href={TRUSTPILOT_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-panda-green underline font-semibold"
            >
              Trustpilot
            </a>
            . These are reviews of our company and service, not ratings of {productName} specifically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill={i < r.rating ? "#22a35d" : "#e5e7eb"}
                    aria-hidden="true"
                  >
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </div>
              <p className="text-[0.875rem] text-gray-700 leading-relaxed flex-1">{r.body}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="font-semibold text-gray-800 text-[0.8125rem]">{r.name}</span>
                <span className="text-[0.75rem] text-gray-400">{formatDate(r.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
