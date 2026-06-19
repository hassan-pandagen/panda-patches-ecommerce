import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  // CDN (apicdn.sanity.io) on Vercel only: it's fast and edge-cached, and
  // Vercel resolves it fine. Anywhere else (local dev AND local builds) we use
  // the plain API (api.sanity.io), because some networks (incl. this dev
  // machine) cannot DNS-resolve the apicdn subdomain, which silently empties
  // every Sanity fetch (blank galleries) and times out local builds. Gating on
  // VERCEL rather than NODE_ENV is deliberate so the local production build
  // works too. Production (Vercel) behavior is unchanged.
  useCdn: !!process.env.VERCEL,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
