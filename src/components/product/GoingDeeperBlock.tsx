/**
 * "Going deeper" — the type page's link out to its own cluster (CL3A9B A3.1).
 *
 * ONE PARAGRAPH, NOT A CARD GRID. The 7 September crawl counted links inside
 * <p>, <li> and <td> only, on the reasoning that those are the ones a reader
 * actually follows and roughly what carries weight. A grid of related-post
 * cards would have registered as a fix and moved nothing, so this is prose.
 *
 * WHY THE TYPE PAGES CARRY IT. They are where the internal authority already
 * sits — embroidered has 58 contextual inbound links, PVC 39, chenille 29 —
 * while the long guides those pages should be feeding have zero to two. This
 * points the strong pages at the ones that earned attention and cannot get it.
 *
 * THE OFFERS ANCHOR CARRIES A PRICE ("chenille packs from $175 for 25") rather
 * than reading "see our offers". An anchor that states the thing on the other
 * side is both a better link and a better answer when a model quotes the
 * sentence whole.
 */
import Link from "next/link";
import { TYPE_CLUSTERS } from "@/lib/typeClusters";
import { CONSTRAINT_HUBS, MIN_ORDER_PER_DESIGN_SHORT } from "@/lib/constraintsRemoved";

const link = "text-panda-green font-semibold underline";

export default function GoingDeeperBlock({ slug, title }: { slug: string; title: string }) {
  const cluster = TYPE_CLUSTERS[slug];
  if (!cluster) return null;

  const reading: React.ReactNode[] = [];
  if (cluster.guide) {
    reading.push(
      <Link key="guide" href={`/${cluster.guide.slug}`} className={link}>
        {cluster.guide.label}
      </Link>,
    );
  }
  if (cluster.costSpecs) {
    reading.push(
      <Link key="cost" href={`/${cluster.costSpecs.slug}`} className={link}>
        {cluster.costSpecs.label}
      </Link>,
    );
  }
  (cluster.extra ?? []).forEach((e) => {
    reading.push(
      <Link key={e.href} href={e.href} className={link}>
        {e.label}
      </Link>,
    );
  });

  return (
    <section className="w-full py-10 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
        <h2 className="text-[1.125rem] md:text-[1.375rem] font-black text-panda-dark mb-3">
          Going deeper on {title.toLowerCase()}
        </h2>
        <p className="text-[0.9375rem] md:text-[1rem] text-gray-700 leading-[1.85]">
          {reading.length > 0 && (
            <>
              Worth reading next:{" "}
              {reading.map((node, i) => (
                <span key={i}>
                  {node}
                  {i < reading.length - 2 ? ", " : i === reading.length - 2 ? ", and " : ". "}
                </span>
              ))}
            </>
          )}
          Design limits for every type are published in our{" "}
          <Link href="/patch-manufacturability-specs" className={link}>
            patch manufacturability standard
          </Link>
          {cluster.glossary && (
            <>
              , and the{" "}
              <Link href={`/glossary/${cluster.glossary}`} className={link}>
                glossary entry for this patch type
              </Link>{" "}
              defines the terms
            </>
          )}
          . Ordering a small run? The floor is {MIN_ORDER_PER_DESIGN_SHORT} on{" "}
          <Link href={CONSTRAINT_HUBS.minimum} className={link}>
            every type and size
          </Link>
          , with{" "}
          <Link href={CONSTRAINT_HUBS.fees} className={link}>
            no setup, digitizing or mold fees
          </Link>
          . For a fixed price with no calculator, see{" "}
          <Link href="/offers" className={link}>
            {cluster.offersAnchor}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
