/**
 * Industry page -> its matching guides (CL3A9B A3.4).
 *
 * One sentence in prose, not a card grid: the crawl counted links inside <p>,
 * <li> and <td> because those are what a reader follows, so a "related
 * articles" grid would have registered as a fix and moved nothing.
 */
import Link from "next/link";
import { INDUSTRY_GUIDES } from "@/lib/industryGuides";

export default function IndustryGuidesBlock({ slug }: { slug: string }) {
  const set = INDUSTRY_GUIDES[slug];
  if (!set) return null;

  return (
    <section className="w-full py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
        <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.85]">
          {set.lead}{" "}
          {set.guides.map((g, i) => (
            <span key={g.slug}>
              <Link href={`/${g.slug}`} className="text-panda-green font-semibold underline">
                {g.label}
              </Link>
              {i < set.guides.length - 2 ? ", " : i === set.guides.length - 2 ? ", and " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
