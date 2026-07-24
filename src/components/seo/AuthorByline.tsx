import Image from "next/image";
import Link from "next/link";

interface AuthorBylineProps {
  /** ISO date the page was published, e.g. "2026-07-20". Omit while unpublished. */
  datePublished?: string;
  /** ISO date of the last substantive review. */
  dateModified?: string;
  /** Optional line naming who fact-checked the page's data claims. */
  reviewedBy?: string;
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Author byline for glossary entries and data pages — the E-E-A-T signal that
 * ties published claims to a named, verifiable person (CL2051 §6). Server
 * component, no client JS. Schema is emitted by the host page, not here.
 */
export default function AuthorByline({ datePublished, dateModified, reviewedBy }: AuthorBylineProps) {
  const published = formatDate(datePublished);
  const modified = formatDate(dateModified);

  return (
    <div className="flex items-start gap-4 border-t border-gray-200 pt-6">
      <Image
        src="/assets/imran.jpeg"
        alt="Imran Raza, founder of Panda Patches"
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
      />
      <div className="min-w-0">
        <p className="text-[0.875rem] md:text-[0.9375rem] font-bold text-panda-dark">
          Written by{" "}
          <Link href="/about" prefetch={false} className="text-panda-green underline">
            Imran Raza
          </Link>
          , Founder of Panda Patches
        </p>
        <p className="text-[0.8125rem] text-gray-600 leading-[1.6] font-medium mt-1">
          13+ years in custom patch manufacturing. Figures on this page come from Panda Patches&rsquo; own production records.
          {reviewedBy ? ` Reviewed by ${reviewedBy}.` : ""}
        </p>
        {(published || modified) && (
          <p className="text-[0.75rem] text-gray-500 font-medium mt-2">
            {published && <>Published {published}</>}
            {published && modified && " · "}
            {modified && <>Last reviewed {modified}</>}
          </p>
        )}
      </div>
    </div>
  );
}
