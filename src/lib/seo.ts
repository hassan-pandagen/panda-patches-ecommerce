import type { Metadata } from "next";

/**
 * Shared metadata builder.
 *
 * Every page on the site repeats the same three blocks: title/description,
 * an openGraph object, and a twitter object whose title/description/images
 * always mirror the openGraph values. That's roughly 150 lines of
 * boilerplate scattered across 30-plus pages and 4-plus dynamic generators.
 *
 * This helper collapses all three into one input. Pass openGraph values and
 * the helper emits the matching twitter card automatically, so they cannot
 * silently drift apart. Override individual twitter fields only when a page
 * genuinely needs different copy on Twitter than on Facebook.
 *
 * The shape is intentionally a SUPERSET of `Metadata` so any field the
 * built-in type accepts (robots, icons, manifest, other, etc.) flows
 * through untouched.
 */

export const SITE_URL = "https://www.pandapatches.com";
export const SITE_NAME = "Panda Patches";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/og-image.png`;

type OGImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildPageMetadataInput = Omit<Metadata, "openGraph" | "twitter"> & {
  /** Page title — used for <title>, og:title, twitter:title (unless overridden). */
  title: string;

  /** Page description — used for meta description, og:description, twitter:description (unless overridden). */
  description: string;

  /** Canonical URL. Will be set as alternates.canonical AND og:url unless either is explicitly set. */
  url?: string;

  /** OG image URL. Defaults to /assets/og-image.png. Accepts a string or full OGImage object. */
  image?: string | OGImage;

  /** og:type. Defaults to "website". Set to "article" for blogs/comparisons. */
  ogType?: "website" | "article" | "book" | "profile";

  /**
   * Optional overrides — use ONLY when og:title or og:description
   * should differ from the main <title>/description (e.g. blog posts
   * with a longer SEO title but a shorter share title).
   */
  ogTitle?: string;
  ogDescription?: string;

  /**
   * Optional Twitter-specific overrides. Almost never needed —
   * twitter:title and twitter:description default to the og: values,
   * which default to the main title/description.
   */
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
};

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const {
    title,
    description,
    url,
    image = DEFAULT_OG_IMAGE,
    ogType = "website",
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    twitterCard = "summary_large_image",
    alternates,
    ...rest
  } = input;

  const ogImageObj: OGImage =
    typeof image === "string"
      ? { url: image, width: 1200, height: 630, alt: title }
      : { width: 1200, height: 630, alt: image.alt ?? title, ...image };

  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDesc = ogDescription ?? description;

  const resolvedTwitterTitle = twitterTitle ?? resolvedOgTitle;
  const resolvedTwitterDesc = twitterDescription ?? resolvedOgDesc;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(alternates ?? {}),
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDesc,
      url,
      siteName: SITE_NAME,
      type: ogType,
      images: [ogImageObj],
    },
    twitter: {
      card: twitterCard,
      title: resolvedTwitterTitle,
      description: resolvedTwitterDesc,
      images: [ogImageObj.url],
    },
    ...rest,
  };
}
