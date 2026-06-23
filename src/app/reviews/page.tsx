import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewCard from "@/components/reviews/ReviewCard";
import TrustpilotRatingLine from "@/components/reviews/TrustpilotRatingLine";
import { generateSchemaScript, generateBreadcrumbSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Panda Patches Customer Reviews. Custom Patch Quality and Turnaround",
  description: "Real customer feedback on patch quality, fast turnaround, and our 12-24 hour digital mockup service. See what brands say about their custom embroidered, PVC, woven, and chenille patches.",
  url: "https://www.pandapatches.com/reviews",
  ogDescription: "Read what our customers say about patch quality, fast 7-14 day turnaround, and our 12-24 hour mockup service. Custom embroidered, PVC, chenille, woven, and leather patches.",
  twitterDescription: "Real customer feedback on patch quality, fast turnaround, and our 12-24 hour digital mockup service.",
  robots: { index: true, follow: true },
});

// Real verified Trustpilot reviews, newest first. Archived in TRUSTPILOT_REVIEWS.md.
// Add new ones there first, then mirror here. Do not invent reviews.
const FEATURED_REVIEWS = [
  {
    name: "Whitney",
    date: "Jun 8, 2026",
    title: "Better than expected",
    body: "Lance was wonderful to work with and very timely with his emails. Our fire department patches turned out better than expected! Would totally recommend them.",
  },
  {
    name: "Jason C.",
    date: "May 20, 2026",
    title: "First run of custom PVC patches",
    body: "Ordered my first run of custom PVC patches from Panda Patches for a small business I'm launching. The design process was easy, they kept me updated during production, and the finished product looks exactly like the proof they sent over. PVC quality is solid: clean lines, good color, and the velcro backing holds well. Turnaround and shipping were fast. Already planning my next set of designs with them.",
  },
  {
    name: "David N.",
    date: "May 14, 2026",
    title: "Great patches",
    body: "Very happy with my order from Panda Patches! They were precise with my custom order, had great communication, and delivered faster than promised. Matthew was a huge help and was quick with all modifications. The patches came in looking great and the quality was excellent. 100% will order again!",
  },
  {
    name: "N & J Cabinet Refacing",
    date: "Apr 22, 2026",
    title: "Great patches at a good price",
    body: "Great patches at a good price.",
  },
  {
    name: "Adam S.",
    date: "Apr 14, 2026",
    title: "Ordering was easy",
    body: "Ordering was easy, production was fast, and the patches look amazing! Will be ordering again soon.",
  },
  {
    name: "Eric M.",
    date: "Mar 20, 2026",
    title: "Excellent source for quality MC patches",
    body: "Panda Patches has been an excellent source for quality MC patches. They were able to reference an old family patch, and make requested updates based on the AI images I provided. The final result is perfect with top quality at a very competitive price. They will have all of my future business.",
  },
  {
    name: "David P.",
    date: "Mar 18, 2026",
    title: "Awesome work!",
    body: "Great communication. Awesome looking patches!",
  },
  {
    name: "Bennie P.",
    date: "Mar 16, 2026",
    title: "Very satisfied",
    body: "Great work. Awesome, very satisfied. Wonderful customer service. I will order again.",
  },
  {
    name: "Rena C.",
    date: "Mar 14, 2026",
    title: "Remarkable work",
    body: "Panda Patches does remarkable work and their customer service is excellent. Very pleased with my custom design product.",
  },
  {
    name: "Alexander N.",
    date: "Mar 14, 2026",
    title: "Excellent source!",
    body: "Panda Patches has been an excellent source for quality patches, prints and emblems. The experience has been great! All logos sent are thoroughly checked, colors are matched, and during the review process any issues that may arise are brought forward ahead of time so a perfect product can be produced. Highly recommend.",
  },
  {
    name: "Kevin G.",
    date: "Mar 13, 2026",
    title: "Highly recommended",
    body: "Top tier communication, follow up, production, and speedy turnaround with pristine customer service!",
  },
  {
    name: "Brandon B.",
    date: "Feb 26, 2026",
    title: "Quality came out so good",
    body: "Quality came out so good! Was not expecting them as fast as I got them. Very happy with the overall result!",
  },
  {
    name: "Billy Bob J.",
    date: "Feb 21, 2026",
    title: "They're legit!!",
    body: "They're legit! I saw the reviews and asked ChatGPT before ordering. My patches arrived on time and a few were messed up. I sent 1 email with pictures and they mailed me more than I said were unusable. I'll be back for more! Good quality! My brand is on IG @focusonyou_brand if you wanna see their work.",
  },
  {
    name: "Demetrius J.",
    date: "Feb 17, 2026",
    title: "Great work, matched a price",
    body: "Great work, matched a price and produced great quality with a fast return.",
  },
  {
    name: "Selena P.",
    date: "Feb 16, 2026",
    title: "Excellent experience ordering my patches",
    body: "I had an excellent experience ordering my patches. The quality is outstanding, durable, vibrant, and exactly what I envisioned. From my very first message, the team was friendly, responsive, and incredibly helpful. They even gave great advice on choosing the best background colors to make my design stand out.",
  },
  {
    name: "Mid-America Hap Ki Do",
    date: "Jan 2, 2026",
    title: "High quality patches!",
    body: "The patches I received were high quality and exactly what I asked for. I will definitely be ordering from this company again.",
  },
  {
    name: "Blackbox",
    date: "Jan 1, 2026",
    title: "Amazed with the final result",
    body: "First time ordering and I was amazed with the final result. Fast shipping too. Will be ordering a new design again. Amazing job.",
  },
  {
    name: "Vrinda H.",
    date: "Dec 30, 2025",
    title: "Quick turnaround",
    body: "Quick turnaround and great work!",
  },
  {
    name: "Deb",
    date: "Dec 16, 2025",
    title: "Best digitizer, hands down",
    body: "Hands down, the best digitizing I've received! My design was very intricate so it was a few dollars more, but they did a fabulous job bringing out all the details! They will be my go to from now on! Highly recommend!",
  },
  {
    name: "Kimberly T.",
    date: "Nov 30, 2025",
    title: "Makes it simple",
    body: "Panda Patches makes it simple to do business with them. Great customer service and prompt with response.",
  },
  {
    name: "Taye S.",
    date: "Nov 28, 2025",
    title: "Impressively on time",
    body: "My experience with Panda Patches was quite positive. They were impressively on time with both delivery and service. No unexpected delays or last-minute changes. The quality of the material used for the patches was excellent. It felt sturdy yet flexible, which is essential for long-lasting wear.",
  },
  {
    name: "Wesley B.",
    date: "Nov 20, 2025",
    title: "Great as advertised",
    body: "Patches turned out to be great as advertised and the turn around time was just as good.",
  },
  {
    name: "Mike L.",
    date: "Nov 15, 2025",
    title: "Extremely professional",
    body: "I found Panda Patches on Instagram. They were extremely professional. They sent mockups of my design before they started production. I ABSOLUTELY LOVE THEM!! The process was super fast. Highly recommend.",
  },
  {
    name: "Robert F.",
    date: "Oct 28, 2025",
    title: "My experience was Exquisite",
    body: "My experience was Exquisite! I felt like family not just a customer! I will most definitely be doing more business. We're locked in.",
  },
  {
    name: "Star",
    date: "Oct 24, 2025",
    title: "Absolutely love my patches!",
    body: "ABSOLUTELY LOVE MY PATCHES! I definitely recommend this company!",
  },
  {
    name: "Ah",
    date: "Oct 21, 2025",
    title: "Timely delivery, great revision process",
    body: "Was hesitant to order as anyone should be with any site but my mind was put at ease once I submitted one idea and then made changes mid way. We finally came to an agreement on another look and when I tell you I was happy I did. I received my patches within 2 weeks, extremely quicker than I initially expected.",
  },
  {
    name: "Tony P.",
    date: "Oct 15, 2025",
    title: "Satisfied first-time customer",
    body: "While I was very hesitant making an order through my inbox, Lance and the staff walked me through the process and I got my order today and I'm already planning my reorder purchase. The quality is amazing.",
  },
  {
    name: "Cecily T.",
    date: "Oct 15, 2025",
    title: "Absolutely amazing",
    body: "Absolutely amazing. I will definitely be doing business with this company. I got all my questions answered. Very understanding and very helpful. I will definitely recommend this company to anyone looking for outstanding quality work.",
  },
  {
    name: "Pamela S.",
    date: "Oct 7, 2025",
    title: "Perfected my logo",
    body: "Dan was very helpful perfecting my logo and quickly responded with a label for review! In record time my labels were complete with notification they were being shipped! I cannot wait to see them on my bags! Thank you Dan for a great experience!",
  },
  {
    name: "Gilberto P.",
    date: "Sep 26, 2025",
    title: "Blown away",
    body: "I am completely blown away by how amazing my patches look. Panda Patches is simply the best, hands down! I'm ready for my next order. Thanks Panda!",
  },
  {
    name: "Nathan S.",
    date: "Sep 16, 2025",
    title: "Understood the assignment",
    body: "Panda Patches understood the assignment and killed the delivery! I'm most appreciative of them and their team's work. I'd definitely refer them to anyone trying to make something great through this service!",
  },
  {
    name: "Jennifer M.",
    date: "Aug 31, 2025",
    title: "Great patches and fast service",
    body: "Great patches and fast service. Received my patches and had no issues, friendly service.",
  },
  {
    name: "Johnnye J.",
    date: "Jul 31, 2025",
    title: "Top quality product",
    body: "The product is top quality. You can tell great attention is paid to the finished product. Received in a great time period. Will recommend to anyone.",
  },
  {
    name: "Karon L.",
    date: "Jul 29, 2025",
    title: "Best patch company I've ever had",
    body: "Panda is the best patch company I've ever had. The team is very passionate about meeting every customer's needs. They provide great quality work, fast shipping and 24hr customer service is always available. I recommend any company to utilize Panda's services for all your designs.",
  },
  {
    name: "William S.",
    date: "Jul 25, 2025",
    title: "Amazing work",
    body: "Amazing work!",
  },
  {
    name: "NoGame Entertainment",
    date: "Jul 22, 2025",
    title: "Great quality, nice design",
    body: "Great quality, nice design, very satisfied. Thank you Panda Patches, heavily referred.",
  },
  {
    name: "Edward T.",
    date: "Jul 12, 2025",
    title: "Hand-drawn logo, they nailed it",
    body: "From the time I spoke with Matt at Panda Patches I felt at ease. My package came exactly when they said it would and the patches were everything I expected and more. Excellent quality and precision to detail. The patch is my very own hand drawn logo and you guys nailed it. I look forward to great future endeavors.",
  },
  {
    name: "Javier P.",
    date: "Jul 10, 2025",
    title: "The greatest patch work I've seen",
    body: "I have nothing but great things to say about this company. They make the greatest patch work I've seen, they're trustworthy, and I have not once messaged them that they haven't messaged me back that same day or early the next. This is how every company should treat its customers.",
  },
  {
    name: "Kenneth W.",
    date: "Jul 8, 2025",
    title: "Great product",
    body: "The representative kept in contact with me through the whole process which made it simple and easy.",
  },
  {
    name: "Nakiesha S.",
    date: "Jun 18, 2025",
    title: "True to size and wonderful",
    body: "The patches are true to size and excellent quality! Thanks!",
  },
  {
    name: "Eddie G.",
    date: "Jun 12, 2025",
    title: "Clear and detailed",
    body: "The quality of these patches is outstanding. They are very clear and detailed to use on any garment. I'm glad I tried them out and now they are my go-to. Thank you.",
  },
  {
    name: "Andrea",
    date: "Jan 14, 2025",
    title: "If I could give 10 stars I would",
    body: "If I could give 10 stars I would. Lance is absolutely the best representative. Extremely knowledgeable, excellent customer service, helped me every step of the way. Patches are high quality, vibrant in color, excellent materials, and affordable especially if you buy in bulk. Arrived to the east coast US in about a week. I highly recommend Panda Patches for all your patch needs.",
  },
  {
    name: "Gianni D.",
    date: "Aug 28, 2024",
    title: "Exceptional communicator",
    body: "Lance was an exceptional communicator and made sure the work was done to perfection. He answered all my questions, very responsive with emails and will definitely recommend and get future jobs done with him.",
  },
  {
    name: "Sara B.",
    date: "May 16, 2024",
    title: "High quality",
    body: "High quality, super fast service, very friendly! Highly recommend!",
  },
  {
    name: "cascalais",
    date: "Mar 1, 2024",
    title: "Great stuff!",
    body: "Great quality patches, great quality service! Good delivery time too, will definitely be doing business again. Big up Panda Patches!",
  },
  {
    name: "Paul H.",
    date: "Aug 10, 2023",
    title: "Great quality",
    body: "Great quality, communication and fast turnaround! We use Panda Patches for all our patches. From mock-up to finished product, every step is done with professionalism and accuracy. They offer a large variety of options and always entertain my unique requests and create exactly what I am looking for. Pricing is extremely competitive. Quality is the best I've seen.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Reviews", url: "https://www.pandapatches.com/reviews" },
]);

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />

      <Navbar />

      {/* Hero */}
      <section className="bg-black text-white pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            What Our Customers Say
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-5">
            Real feedback from brands, motorcycle clubs, fire departments, sports teams, and businesses on patch quality, fast 7-14 day turnaround, and our 12-24 hour digital mockup service.
          </p>
          <TrustpilotRatingLine variant="dark" className="!text-center" />
        </div>
      </section>

      {/* Brand trust signals */}
      <section className="bg-[#dcff70] py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "1M+", label: "Patches Delivered" },
            { value: "12-24 Hours", label: "Mockup" },
            { value: "7-14 Days", label: "Standard Delivery" },
            { value: "5 Pieces", label: "Low Minimum Order" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-black">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Customer Testimonials</h2>
          <p className="text-gray-600 mb-8">
            A selection of verified reviews from our Trustpilot profile.{" "}
            <a
              href="https://www.trustpilot.com/review/pandapatches.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-panda-green"
            >
              Read all reviews on Trustpilot
            </a>
            .
          </p>
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
            Mockup in 12-24 hours. Unlimited revisions. Money-back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/custom-patches"
              className="bg-[#dcff70] text-black px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/offers"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all"
            >
              See Offers
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
