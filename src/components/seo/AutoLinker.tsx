import Link from "next/link";
import { internalLinks } from "@/lib/internalLinks";

interface AutoLinkerProps {
  text: string;
  className?: string;
}

/**
 * AutoLinker Component
 * Automatically converts keywords to internal links for SEO
 * Only links the first occurrence of each keyword to avoid over-optimization
 */
export default function AutoLinker({ text, className = "" }: AutoLinkerProps) {
  let processedText: (string | JSX.Element)[] = [text];
  const linkedKeywords = new Set<string>();

  // Process each internal link
  for (const link of internalLinks) {
    const newProcessedText: (string | JSX.Element)[] = [];

    for (const segment of processedText) {
      // Skip if already a React element
      if (typeof segment !== "string") {
        newProcessedText.push(segment);
        continue;
      }

      let found = false;

      // Try each keyword for this link
      for (const keyword of link.keywords) {
        if (linkedKeywords.has(keyword)) continue;

        // Case-insensitive regex to find the keyword
        const regex = new RegExp(`\\b(${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'i');
        const match = segment.match(regex);

        if (match && match.index !== undefined) {
          found = true;
          linkedKeywords.add(keyword);

          const beforeMatch = segment.substring(0, match.index);
          const matchedText = match[0];
          const afterMatch = segment.substring(match.index + matchedText.length);

          newProcessedText.push(
            beforeMatch,
            <Link
              key={`link-${keyword}-${match.index}`}
              href={link.url}
              className="text-panda-green font-semibold hover:underline"
            >
              {matchedText}
            </Link>,
            afterMatch
          );
          break;
        }
      }

      if (!found) {
        newProcessedText.push(segment);
      }
    }

    processedText = newProcessedText;
  }

  return <span className={className}>{processedText}</span>;
}
