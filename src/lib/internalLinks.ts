/**
 * Internal Linking System for SEO
 * Automatically suggests relevant internal links based on keywords
 */

export interface InternalLink {
  url: string;
  anchor: string;
  keywords: string[];
}

/**
 * Comprehensive internal link database
 * Add new links here as new pages are created
 */
export const internalLinks: InternalLink[] = [
  // Patch Types
  {
    url: "/custom-patches/embroidered",
    anchor: "embroidered patches",
    keywords: ["embroidered", "embroidery", "thread", "stitched"],
  },
  {
    url: "/custom-patches/pvc",
    anchor: "PVC patches",
    keywords: ["pvc", "rubber", "3d", "raised"],
  },
  {
    url: "/custom-patches/woven",
    anchor: "woven patches",
    keywords: ["woven", "woven label", "fine detail"],
  },
  {
    url: "/custom-patches/chenille",
    anchor: "chenille patches",
    keywords: ["chenille", "varsity", "letterman", "fuzzy"],
  },
  {
    url: "/custom-patches/leather",
    anchor: "leather patches",
    keywords: ["leather", "premium", "luxury"],
  },

  // Custom Products
  {
    url: "/custom-products/challenge-coins",
    anchor: "challenge coins",
    keywords: ["challenge coin", "military coin", "commemorative coin"],
  },
  {
    url: "/custom-products/lapel-pins",
    anchor: "custom lapel pins",
    keywords: ["lapel pin", "enamel pin", "pin badge"],
  },
  {
    url: "/custom-products/keychains",
    anchor: "custom keychains",
    keywords: ["keychain", "key ring", "keyring"],
  },

  // Use Cases / Categories
  {
    url: "/custom-fire-department-patches",
    anchor: "fire department patches",
    keywords: ["fire department", "firefighter", "fire rescue", "ems"],
  },
  {
    url: "/custom-police-patches",
    anchor: "police patches",
    keywords: ["police", "law enforcement", "sheriff", "swat"],
  },
  {
    url: "/custom-sports-patches",
    anchor: "sports team patches",
    keywords: ["sports team", "athletic", "team logo", "jersey"],
  },
  {
    url: "/custom-corporate-patches",
    anchor: "corporate patches",
    keywords: ["corporate", "company logo", "business", "employee uniform"],
  },

  // Special Pages
  {
    url: "/custom-name-patches",
    anchor: "custom name patches",
    keywords: ["name patch", "name tag", "identification"],
  },
  {
    url: "/custom-tactical-patches",
    anchor: "tactical patches",
    keywords: ["tactical", "military", "morale patch"],
  },
  {
    url: "/custom-velcro-patches",
    anchor: "velcro patches",
    keywords: ["velcro", "hook and loop", "removable"],
  },
  {
    url: "/custom-jacket-patches",
    anchor: "jacket patches",
    keywords: ["jacket", "biker", "motorcycle"],
  },

  // Process / Info
  {
    url: "/about",
    anchor: "about Panda Patches",
    keywords: ["about us", "our company", "who we are"],
  },
  {
    url: "/contact",
    anchor: "contact us",
    keywords: ["contact", "get in touch", "reach us"],
  },
  {
    url: "/sample-box",
    anchor: "sample box",
    keywords: ["sample box", "samples", "try before you buy"],
  },
  {
    url: "/bulk-custom-patches",
    anchor: "bulk custom patches",
    keywords: ["bulk order", "volume pricing", "wholesale"],
  },
];

/**
 * Find relevant internal links based on content text
 * @param text - Content to scan for keywords
 * @param maxLinks - Maximum number of links to return
 * @returns Array of suggested internal links
 */
export function findRelevantLinks(text: string, maxLinks: number = 3): InternalLink[] {
  const lowerText = text.toLowerCase();
  const relevantLinks: Array<InternalLink & { score: number }> = [];

  for (const link of internalLinks) {
    let score = 0;

    // Check if any keywords appear in the text
    for (const keyword of link.keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    if (score > 0) {
      relevantLinks.push({ ...link, score });
    }
  }

  // Sort by score (most relevant first) and return top N
  return relevantLinks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks)
    .map(({ url, anchor, keywords }) => ({ url, anchor, keywords }));
}

