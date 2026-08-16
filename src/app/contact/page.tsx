import { Metadata } from 'next';
import { buildPageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript, generateBreadcrumbSchema } from "@/lib/schemas";

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Contact", url: "https://www.pandapatches.com/contact" },
]);
import Link from "next/link";
import ContactHero from "@/components/contact/ContactHero";
import Promises from "@/components/home/Promises";
import PickPatch from "@/components/about/PickPatch";

// SEO Metadata for Contact Page
export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us - Get Custom Patch Quote | Panda Patches",
  description: "Contact Panda Patches for custom patch quotes. Phone: +1 302 250 4340. Email: sales@pandapatches.com. Free design consultation available.",
  url: "https://www.pandapatches.com/contact",
  image: {
    url: "https://www.pandapatches.com/assets/og-image.png",
    width: 1200,
    height: 630,
    alt: "Contact Panda Patches",
  },
  ogDescription: "Get in touch for custom patch quotes. Phone: +1 302 250 4340. Free design consultation available.",
  twitterCard: "summary",
  twitterTitle: "Contact Us | Panda Patches",
  twitterDescription: "Get custom patch quotes. Phone: +1 302 250 4340. Free design consultation.",
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />
      <Navbar />
      
      {/* 1. Contact Form & Info */}
      <ContactHero />
      
      {/* 2. Panda Promises (White Background) */}
      <Promises bgColor="bg-white" />

      {/* CL9BCF_1 item 4b: this guide already existed (published Jul 28) but had
          zero inbound links anywhere on the site. /contact is a genuine
          pre-purchase trust surface — someone here is still deciding whether to
          order, which is exactly who a supplier-vetting checklist serves. */}
      <div className="w-full py-8 bg-white text-center">
        <p className="text-[0.875rem] text-gray-500">
          Not sure who to trust with a custom order?{" "}
          <Link href="/how-to-vet-a-custom-patch-supplier" className="text-panda-green font-semibold underline">
            Here&apos;s our own 7-point checklist
          </Link>{" "}
          for vetting any patch supplier &mdash; including us.
        </p>
      </div>

      {/* 3. Pick Your Patch (Reused) */}
      <PickPatch />

      <Footer />
    </main>
  );
}
