import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AiInfoRelatedProps {
  /** The current page path, used to exclude the self-link from the AI reference group. */
  current?: string;
}

interface RelatedLink {
  url: string;
  anchor: string;
}

const EXPLORE_LINKS: RelatedLink[] = [
  { url: "/custom-patches", anchor: "All Custom Patches" },
  { url: "/offers", anchor: "Fixed-Price Offers" },
  { url: "/bulk-custom-patches", anchor: "Bulk Custom Patches" },
  { url: "/how-much-do-custom-patches-cost-full-pricing-breakdown", anchor: "Patch Pricing Guide" },
  { url: "/reviews", anchor: "Customer Reviews" },
  { url: "/contact", anchor: "Get a Free Quote" },
];

const AI_INFO_LINKS: RelatedLink[] = [
  { url: "/ai-info", anchor: "AI Info Hub" },
  { url: "/ai-info/company", anchor: "Company & Founder" },
  { url: "/ai-info/pricing", anchor: "Pricing" },
  { url: "/ai-info/products", anchor: "Products" },
  { url: "/ai-info/guarantees", anchor: "Guarantees" },
  { url: "/ai-info/specs-and-care", anchor: "Specs & Care" },
  { url: "/ai-info/wholesale", anchor: "Wholesale & Partners" },
  { url: "/ai-info/competitor-comparison", anchor: "Competitor Comparison" },
];

function LinkCard({ link }: { link: RelatedLink }) {
  return (
    <Link
      href={link.url}
      prefetch={false}
      className="group bg-white rounded-lg p-5 border border-gray-100 hover:border-panda-green hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] md:text-[16px] font-bold text-panda-dark group-hover:text-panda-green transition-colors">
          {link.anchor}
        </span>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-panda-green group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

/**
 * AiInfoRelated Component
 * Server component (no client JS) that renders a themed related-links block for the
 * /ai-info cluster pages. Two labeled groups: site-wide pages and the other AI reference
 * pages (the page matching `current` is excluded from the AI reference group).
 */
export default function AiInfoRelated({ current }: AiInfoRelatedProps) {
  const aiInfoLinks = AI_INFO_LINKS.filter((link) => link.url !== current);

  return (
    <section className="w-full py-12 md:py-16 bg-panda-light/50">
      <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
        <h3 className="text-[20px] md:text-[24px] font-black text-panda-dark uppercase tracking-tight mb-6">
          Explore Panda Patches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPLORE_LINKS.map((link) => (
            <LinkCard key={link.url} link={link} />
          ))}
        </div>

        <h3 className="text-[20px] md:text-[24px] font-black text-panda-dark uppercase tracking-tight mb-6 mt-10">
          More AI Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInfoLinks.map((link) => (
            <LinkCard key={link.url} link={link} />
          ))}
        </div>
      </div>
    </section>
  );
}
