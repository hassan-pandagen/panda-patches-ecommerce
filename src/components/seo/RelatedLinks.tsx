import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { findRelevantLinks, InternalLink } from "@/lib/internalLinks";

interface RelatedLinksProps {
  content: string;
  title?: string;
  maxLinks?: number;
  manualLinks?: InternalLink[];
}

/**
 * RelatedLinks Component
 * Shows contextual internal links based on content
 * Automatically finds relevant links or uses manual overrides
 */
export default function RelatedLinks({
  content,
  title = "Related Pages",
  maxLinks = 4,
  manualLinks,
}: RelatedLinksProps) {
  // Use manual links if provided, otherwise auto-detect from content
  const links = manualLinks || findRelevantLinks(content, maxLinks);

  if (links.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-panda-light/50">
      <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
        <h3 className="text-[20px] md:text-[24px] font-black text-panda-dark uppercase tracking-tight mb-6">
          {title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.url}
              className="group bg-white rounded-lg p-5 border border-gray-100 hover:border-panda-green hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] md:text-[16px] font-bold text-panda-dark group-hover:text-panda-green transition-colors">
                  {link.anchor}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-panda-green group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
