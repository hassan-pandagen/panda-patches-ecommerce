/**
 * Converts WordPress URLs to Next.js URLs
 * Preserves Instagram, external links, and other social media links
 */
export function convertWordPressUrl(href: string): string {
  if (!href) return href;

  // Keep Instagram, Facebook, TikTok, YouTube, and other social media links as-is
  if (
    href.includes('instagram.com') ||
    href.includes('facebook.com') ||
    href.includes('tiktok.com') ||
    href.includes('youtube.com') ||
    href.includes('twitter.com') ||
    href.includes('linkedin.com')
  ) {
    return href;
  }

  // WordPress domain patterns to detect
  const wpDomains = [
    'pandapatches.com',
    'www.pandapatches.com',
    // Add any other old domains if needed
  ];

  // Check if it's a WordPress URL
  const isWordPressUrl = wpDomains.some(domain => href.includes(domain));

  if (!isWordPressUrl) {
    // Not a WordPress URL, return as-is
    return href;
  }

  // Extract the path from WordPress URL
  try {
    const url = new URL(href);
    const path = url.pathname;

    // Remove trailing slash for consistency
    const cleanPath = path.replace(/\/$/, '');

    // Return the path for Next.js (relative URL)
    // This will work on your new domain automatically
    return cleanPath || '/';
  } catch (e) {
    // If URL parsing fails, return original
    return href;
  }
}
