import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewCard from "@/components/reviews/ReviewCard";
import { generateSchemaScript, generateBreadcrumbSchema } from "@/lib/schemas";
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT, TRUSTPILOT_REVIEW_COUNT_STR, TRUSTPILOT_URL } from "@/lib/reviewConstants";
import { Star, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Panda Patches Reviews — 4.8★ Verified on Trustpilot",
  description: `Panda Patches has a ${TRUSTPILOT_RATING}-star rating from ${TRUSTPILOT_REVIEW_COUNT}+ verified buyers on Trustpilot. Read real customer reviews about patch quality, fast delivery, and our free design service.`,
  alternates: {
    canonical: "https://www.pandapatches.com/reviews",
  },
  openGraph: {
    title: "Panda Patches Reviews — 4.8★ Verified on Trustpilot",
    description: `${TRUSTPILOT_REVIEW_COUNT}+ verified buyers. 4.8★ average rating. Real reviews from military, sports, fire department, and business customers.`,
    url: "https://www.pandapatches.com/reviews",
    type: "website",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630, alt: "Panda Patches Customer Reviews" }],
  },
  robots: { index: true, follow: true },
};

const FEATURED_REVIEWS = [
  {
    name: "Eric Miner",
    rating: 5,
    date: "Mar 20, 2026",
    title: "Excellent source for quality MC patches",
    body: "Panda Patches has been an excellent source for quality MC patches. They were able to reference an old family patch, and make requested updates based on the AI images I provided. The final result is perfect with top quality at a very competitive price. They will have all of my future business.",
  },
  {
    name: "Selena Perry",
    rating: 5,
    date: "Feb 16, 2026",
    title: "Excellent experience ordering my patches",
    body: "I had an excellent experience ordering my patches. The quality is outstanding — durable, vibrant, and exactly what I envisioned. From my very first message, the team was friendly, responsive, and incredibly helpful. They even gave great advice on choosing the best background colors to make my design stand out.",
  },
  {
    name: "Billy Bob Jackson",
    rating: 5,
    date: "Feb 21, 2026",
    title: "They're legit!!",
    body: "They're legit! I saw the reviews and asked ChatGPT before ordering. My patches arrived on time and a few were messed up. I sent 1 email with pictures and they mailed me more than I said were unusable. I'll be back for more! Good quality! My brand is on IG @focusonyou_brand if you wanna see their work.",
  },
  {
    name: "Adam Stranc",
    rating: 5,
    date: "Apr 14, 2026",
    title: "Ordering was easy",
    body: "Ordering was easy, production was fast, and the patches look amazing! Will be ordering again soon.",
  },
  {
    name: "Deb",
    rating: 5,
    date: "Dec 16, 2025",
    title: "Best digitizer — hands down",
    body: "Hands down, the best digitizing I've received! My design was very intricate so it was a few dollars more, but they did a fabulous job bringing out all the details! They will be my go to from now on! Highly recommend!",
  },
  {
    name: "Taye Sims",
    rating: 5,
    date: "Nov 28, 2025",
    title: "Impressively on time",
    body: "My experience with Panda Patches was quite positive. They were impressively on time with both delivery and service — no unexpected delays or last-minute changes. The quality of the material used for the patches was excellent. It felt sturdy yet flexible, which is essential for long-lasting wear.",
  },
  {
    name: "Mike Lowery",
    rating: 5,
    date: "Nov 15, 2025",
    title: "Extremely professional",
    body: "I found Panda Patches on Instagram. They were extremely professional. They sent mockups of my design before they started production. I ABSOLUTELY LOVE THEM!! The process was super fast. Highly recommend.",
  },
  {
    name: "Tony Price",
    rating: 5,
    date: "Oct 15, 2025",
    title: "Satisfied first-time customer",
    body: "While I was very hesitant making an order through my inbox, Lance and the staff walked me through the process and I got my order today and I'm already planning my reorder purchase. The quality is amazing.",
  },
  {
    name: "Ah",
    rating: 5,
    date: "Oct 21, 2025",
    title: "Timely delivery, great revision process",
    body: "Was hesitant to order as anyone should be with any site but my mind was put at ease once I submitted one idea and then made changes mid way. We finally came to an agreement on another look and when I tell you I was happy I did. I received my patches within 2 weeks — extremely quicker than I initially expected.",
  },
  {
    name: "Robert Fisher",
    rating: 5,
    date: "Oct 28, 2025",
    title: "My experience was Exquisite",
    body: "My experience was Exquisite! I felt like family not just a customer! I will most definitely be doing more business. We're locked in.",
  },
  {
    name: "karon liggins",
    rating: 5,
    date: "Jul 29, 2025",
    title: "Best patch company I've ever had",
    body: "Panda is the best patch company I've ever had. The team is very passionate about meeting every customer's needs. They provide great quality work, fast shipping and 24hr customer service is always available. I recommend any company to utilize Panda's services for all your designs.",
  },
  {
    name: "Edward Thornton",
    rating: 5,
    date: "Jul 12, 2025",
    title: "Hand-drawn logo — they nailed it",
    body: "From the time I spoke with Matt at Panda Patches I felt at ease. My package came exactly when they said it would and the patches were everything I expected and more — excellent quality and precision to detail. The patch is my very own hand drawn logo and you guys nailed it. I look forward to great future endeavors.",
  },
  {
    name: "Johnnye Johnson",
    rating: 5,
    date: "Jul 31, 2025",
    title: "Top quality product",
    body: "The product is top quality. You can tell great attention is paid to the finish product. Received in a great time period. Will recommend to anyone.",
  },
  {
    name: "Eddie Green",
    rating: 5,
    date: "Jun 12, 2025",
    title: "Clear and detailed",
    body: "The quality of these patches is outstanding. They are very clear and detailed to use on any garment. I'm glad I tried them out and now they are my go-to. Thank you.",
  },
  {
    name: "Jennifer Matlock",
    rating: 5,
    date: "Aug 31, 2025",
    title: "Great patches and fast service",
    body: "Great patches and fast service. Received my patches and had no issues, friendly service.",
  },
  {
    name: "Wesley Bush",
    rating: 4,
    date: "Nov 20, 2025",
    title: "Great as advertised",
    body: "Patches turned out to be great as advertised and the turn around time was just as good.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Reviews", url: "https://www.pandapatches.com/reviews" },
]);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Custom Patches",
  "description": "Custom embroidered, woven, PVC, chenille, leather and printed patches with no minimum order, free design, and 7-14 day delivery.",
  "brand": { "@type": "Brand", "name": "Panda Patches" },
  "image": "https://www.pandapatches.com/assets/og-image.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": TRUSTPILOT_RATING,
    "reviewCount": TRUSTPILOT_REVIEW_COUNT_STR,
    "bestRating": "5",
    "worstRating": "1",
  },
  "review": FEATURED_REVIEWS.map((r) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": r.name },
    "datePublished": r.date,
    "reviewBody": r.body,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": String(r.rating),
      "bestRating": "5",
    },
  })),
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      {/* Hero */}
      <section className="bg-black text-white pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} size={28} className="fill-[#00b67a] text-[#00b67a]" />
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Panda Patches Customer Reviews — {TRUSTPILOT_RATING}★ Verified on Trustpilot
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Panda Patches has a {TRUSTPILOT_RATING}-star rating on Trustpilot from over {TRUSTPILOT_REVIEW_COUNT} verified buyers, citing patch quality, fast 7-14 day turnaround, and responsive customer service. Below are recent reviews from real orders.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#dcff70] py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "1M+", label: "Patches Delivered" },
            { value: `${TRUSTPILOT_REVIEW_COUNT}+`, label: "Verified Reviews" },
            { value: `${TRUSTPILOT_RATING}★`, label: "Trustpilot Rating" },
            { value: "7-14 Days", label: "Standard Delivery" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-black">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trustpilot widget */}
      <section className="py-10 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Verified independently on</p>
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#00b67a] font-bold text-lg hover:underline"
            >
              Trustpilot <ExternalLink size={16} />
            </a>
          </div>
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00b67a] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#009e6a] transition-colors"
          >
            Leave a Review
          </a>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_REVIEWS.map((review) => (
              <ReviewCard key={review.name + review.date} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Order With Confidence</h2>
          <p className="text-gray-300 mb-8">
            Join {TRUSTPILOT_REVIEW_COUNT}+ verified buyers. Free design mockup in 24 hours. Money-back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/custom-patches"
              className="bg-[#dcff70] text-black px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all"
            >
              Get a Free Quote
            </Link>
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#00b67a] text-[#00b67a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00b67a] hover:text-white transition-all inline-flex items-center justify-center gap-2"
            >
              See All Reviews <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
