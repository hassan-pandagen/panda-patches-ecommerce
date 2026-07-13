import { getProductReviews } from "@/lib/productReviews";

/**
 * Visible customer reviews for a product page. Google requires the reviews that
 * back a Product.aggregateRating to be visible on the page — this renders exactly
 * the set returned by getProductReviews(productKey), the same set fed to the
 * Product schema. Renders nothing when the product has too few genuine reviews
 * (matches the schema, which then omits aggregateRating).
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

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const avgLabel = (Math.round(avg * 10) / 10).toString();

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[(m || 1) - 1]} ${d}, ${y}`;
  };

  return (
    <section className="w-full py-8 md:py-12 bg-panda-light">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">
        <div className="text-center mb-8">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark tracking-tight mb-2">
            {productName} Reviews
          </h2>
          <p className="text-[14px] md:text-[15px] text-gray-600 font-medium">
            <span className="font-bold text-panda-dark">{avgLabel} out of 5</span>
            {" "}from {reviews.length} verified customer {reviews.length === 1 ? "review" : "reviews"}
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
              <p className="text-[14px] text-gray-700 leading-relaxed flex-1">{r.body}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="font-semibold text-gray-800 text-[13px]">{r.name}</span>
                <span className="text-[12px] text-gray-400">{formatDate(r.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
