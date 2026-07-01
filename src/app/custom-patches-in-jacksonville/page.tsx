import type { Metadata } from "next";
import LocationLayout from "@/components/locations/LocationLayout";
import { buildPageMetadata } from "@/lib/seo";

// Standalone Jacksonville location page. GSC showed dozens of "…jacksonville"
// queries ranking pos 8–16 with no dedicated page (the Florida page was catching
// them). This app route takes precedence over the Sanity [slug] route and renders
// the shared LocationLayout with hardcoded data; FAQs, description, and SEO
// sections come from locationFaqs / locationDescriptions / LocationSEOSections
// keyed by this slug.
const SLUG = "custom-patches-in-jacksonville";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Custom Patches in Jacksonville, FL | Military, MC & First Responder",
    description:
      "Custom patches in Jacksonville, FL — for NAS Jax & Mayport military units, MC/biker clubs, JSO & Jacksonville Fire and Rescue, sports teams, and businesses. Low 5-piece minimum, free design, mockup in 12-24 hours, free shipping across Northeast Florida.",
    url: `https://www.pandapatches.com/${SLUG}`,
  });
}

export default function JacksonvillePatchesPage() {
  return <LocationLayout data={{ locationName: "Jacksonville", isPatchStyle: false }} slug={SLUG} />;
}
