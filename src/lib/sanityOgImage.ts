import { client } from './sanity';

const OG_FALLBACK = 'https://www.pandapatches.com/assets/og-image.png';

/**
 * Fetches the hero image from Sanity to use as the default OG image.
 * Falls back to the static PNG if the Sanity image is unavailable.
 */
export async function getSanityOgImage(): Promise<string> {
  try {
    const data = await client.fetch(
      `*[_type == "hero"][0] { "url": heroImage.asset->url }`,
      {},
      { next: { revalidate: 86400 } }
    );
    if (data?.url) {
      return `${data.url}?w=1200&h=630&fit=crop&fm=jpg&q=80`;
    }
  } catch {
    // fall through to fallback
  }
  return OG_FALLBACK;
}
