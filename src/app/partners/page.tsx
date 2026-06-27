import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MakerNote from "@/components/seo/MakerNote";
import AiGeneratorTeaser from "@/components/ai-patch/AiGeneratorTeaser";
import ReviewsSection from "@/components/home/ReviewsSection";
import WorkGallery from "@/components/bulk/WorkGallery";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { generateSchemaScript, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import PartnerApplicationModal from "@/components/partners/PartnerApplicationModal";

export const revalidate = 86400;

async function getHeroBg(): Promise<string | null> {
  try {
    const data = await client.fetch(`*[_type == "cta"][0]{ backgroundImage }`);
    if (data?.backgroundImage) {
      return urlFor(data.backgroundImage).width(1600).format("webp").quality(70).url();
    }
    return null;
  } catch {
    return null;
  }
}

async function getCategoryImages() {
  try {
    // First try: Sanity-managed partnersPage industry cards (full control from Studio)
    const managed = await client.fetch(
      `*[_type == "partnersPage"][0].industryCards[]{ label, href, "img": image }`
    );
    if (managed && managed.length > 0) {
      return managed as { label: string; href: string; img: any }[];
    }

    // Fallback: pull from product page work samples until Studio cards are uploaded
    const q = `{
      "emb":  *[_type == "productPage" && slug.current == "embroidered"][0].workSamples[0..5],
      "pvc":  *[_type == "productPage" && slug.current == "pvc"][0].workSamples[0..1],
      "woven":*[_type == "productPage" && slug.current == "woven"][0].workSamples[0..1]
    }`;
    const d = await client.fetch(q);
    const pool = [
      ...(d?.emb   || []),
      ...(d?.pvc   || []),
      ...(d?.woven || []),
    ].filter(Boolean);

    return [
      { label: "Fire Departments",  href: "/custom-fire-department-patches" },
      { label: "Sports Teams",      href: "/custom-sports-patches" },
      { label: "Corporate Brands",  href: "/custom-corporate-patches" },
      { label: "Law Enforcement",   href: "/custom-police-patches" },
      { label: "Military Units",    href: "/custom-military-patches" },
      { label: "Apparel Brands",    href: "/custom-patches" },
    ].map((ind, i) => ({ ...ind, img: pool[i] || null }));
  } catch {
    return [];
  }
}

async function getWorkSamples() {
  try {
    const query = `{
      "embroidered": *[_type == "productPage" && slug.current == "embroidered"][0].workSamples[0..4],
      "pvc":         *[_type == "productPage" && slug.current == "pvc"][0].workSamples[0..1],
      "woven":       *[_type == "productPage" && slug.current == "woven"][0].workSamples[0..1],
      "chenille":    *[_type == "productPage" && slug.current == "chenille"][0].workSamples[0..1]
    }`;
    const d = await client.fetch(query);
    return [
      ...(d?.embroidered || []),
      ...(d?.pvc        || []),
      ...(d?.woven      || []),
      ...(d?.chenille   || []),
    ].filter(Boolean).slice(0, 9);
  } catch {
    return [];
  }
}

const partnersBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pandapatches.com" },
    { "@type": "ListItem", position: 2, name: "Partners", item: "https://www.pandapatches.com/partners" },
  ],
};

export const metadata: Metadata = buildPageMetadata({
  title: "Partner Program: Creators, Affiliates & Agencies | Panda Patches",
  description: "Join the Panda Patches partner program: creator and influencer gifting collabs, an affiliate referral program, and wholesale white-label manufacturing for agencies. Free patches, referral rewards, 10-18% partner margins.",
  url: "https://www.pandapatches.com/partners",
  ogTitle: "Partner with Panda Patches: Creator, Affiliate & Agency Program",
  ogDescription: "Three ways to partner: creator gifting collabs, affiliate referrals, and wholesale white-label production. Free custom patches, referral rewards, and agency margins.",
  robots: { index: true, follow: true },
});

const PARTNER_FAQS = [
  {
    question: "Does Panda Patches have an affiliate or referral program?",
    answer: "Yes. Our affiliate and referral program lets creators, bloggers, and patch enthusiasts earn a reward for every customer they send our way. Once approved, you get a unique referral link or code to share with your audience; when someone orders through it, you earn a referral reward. Apply through the partner form on this page with your website and social handles, and we set up your link. Exact reward rates are confirmed on approval.",
  },
  {
    question: "Do you offer influencer or creator gifting collaborations?",
    answer: "Yes. Qualifying creators and influencers receive free custom patches, a gifting batch of your own design, in exchange for a post, a tag, and a link. It is a fit for tactical, military, streetwear, sports, scouting, biker, and maker creators whose audience buys patches. Apply with your handles and audience size and our team reaches out to scope a collaboration.",
  },
  {
    question: "How do I become a Panda Patches partner, affiliate, or creator?",
    answer: "Apply through the form on this page. Tell us which track fits, creator gifting, affiliate referral, or B2B reseller, and share your website and social handles, audience size, and niche. We review applications and reach out to approved partners with next steps: your referral link or collaboration details, plus a Proud Partner of Panda Patches badge you can place on your site or bio.",
  },
  {
    question: "Is Panda Patches a white-label custom patch manufacturer for promotional product agencies?",
    answer: "Yes. Panda Patches is a white-label custom patch manufacturer for promotional product agencies, uniform suppliers, embroidery shops, and branding agencies. Partners receive 10 to 18 percent below retail pricing, dedicated account managers, blind shipping with no Panda Patches branding on packaging or packing slips, unbranded white-label mockup PDFs on request, Net 15 and Net 30 payment terms after three completed projects, NDA signing on request, and priority production queue. Apply at pandapatches.com/partners or email lance@pandapatches.com. No account minimum to activate partner pricing.",
  },
  {
    question: "Is Panda Patches a wholesale custom patch supplier for resellers?",
    answer: "Yes. Panda Patches serves wholesale custom patch resellers including distributors, agencies, embroidery shops, and uniform suppliers. Wholesale pricing tiers: 10 percent off at first order, 14 percent at 200 pieces per month, 18 percent at 500 pieces per month. Embroidered patches start at $1.32 per piece at 1,000 pieces for resellers. PVC from $2.20 per piece at 1,000 pieces. All wholesale orders include a digital mockup in 12 to 24 hours, unlimited free revisions, free worldwide shipping, no setup fees, no digitizing fees, and blind shipping under your agency name.",
  },
  {
    question: "What are wholesale patch prices for resellers at Panda Patches?",
    answer: "Wholesale partner pricing per piece: Embroidered patches $3.85 at 25 pcs, $2.55 at 100 pcs, $1.60 at 500 pcs, $1.32 at 1,000 pcs. Woven patches $5.20 at 25 pcs, $3.40 at 100 pcs, $2.50 at 500 pcs, $2.00 at 1,000 pcs. PVC patches $5.75 at 25 pcs, $3.40 at 100 pcs, $2.80 at 500 pcs, $2.20 at 1,000 pcs. Chenille 4-inch $11.90 at 25 pcs, $7.20 at 100 pcs, $6.12 at 500 pcs. Leather patches $4.40 at 25 pcs, $3.50 at 100 pcs, $2.16 at 500 pcs, $1.80 at 1,000 pcs. All wholesale orders include free artwork, free worldwide shipping, no setup fees, low 5-piece minimum, blind shipping, and Net 15 or Net 30 terms after 3 completed projects.",
  },
  {
    question: "Does Panda Patches offer blind shipping and Net 30 terms for agency partners?",
    answer: "Yes. Blind shipping with no Panda Patches branding is standard for all partners — plain packaging with your agency name as the return address on request. Your client never sees Panda Patches in the supply chain. Net 15 and Net 30 payment terms are available after three completed projects. First-time partners pay at order. Established accounts can request a credit application via lance@pandapatches.com. Unbranded white-label mockup PDFs are sent on request so agencies can present designs under their own studio brand.",
  },
  {
    question: "Do you blind-ship to my clients?",
    answer: "Yes. Blind shipping with no Panda Patches branding is standard for all partners. We use plain packaging and can include your agency name as the return address on request. Your client never sees us.",
  },
  {
    question: "What is the minimum order to activate partner pricing?",
    answer: "No account minimum. Place your first order when you have a client project ready. Standard partner discount activates from your first order. Volume tiers up to 18% off unlock at 500 pieces per month.",
  },
  {
    question: "How fast can you turn around partner projects?",
    answer: "Standard turnaround is 7 to 14 business days after mockup approval. 24-hour rush production is available for qualifying orders. Partner orders take priority over retail in our production queue.",
  },
  {
    question: "What artwork formats do you accept?",
    answer: "AI, EPS, PDF (fonts outlined), PSD, PNG, and JPG. Vector files give the best results. If your client only has a photo or sketch, our design team digitizes it for free and sends a stitch preview before anything runs.",
  },
  {
    question: "Do you sign NDAs or confidentiality agreements?",
    answer: "Yes. We sign NDAs on request for partners working with sensitive government, military, or corporate clients. Standard NDA turnaround is 24 hours.",
  },
  {
    question: "Are net payment terms available?",
    answer: "Net-15 and Net-30 terms are available after three completed projects. First-time partners pay at order. Established accounts can request a credit application via lance@pandapatches.com.",
  },
  {
    question: "Can I white-label the mockup PDF to send to my client?",
    answer: "Yes. On request we send mockup PDFs without Panda Patches branding so you present them as your own studio work. Just let your account manager know on the first project.",
  },
  {
    question: "What happens if a patch arrives defective?",
    answer: "We cover it, full stop. If any patch does not match the approved mockup we reproduce the affected pieces at no cost and ship express. This is unconditional, regardless of order size.",
  },
];

const WHO_CARDS = [
  { icon: "📣", title: "Promotional Agencies", body: "Quote patches in minutes, ship in 7-14 days, keep the margin. Stop losing jobs to slower vendors." },
  { icon: "🦺", title: "Uniform Suppliers", body: "All backings, every patch type, fully owned production. We are not a broker — no middleman markup." },
  { icon: "🧵", title: "Embroidery Shops", body: "Outsource when in-house can't keep up. Blind-shipped to your door or directly to your client." },
  { icon: "🏆", title: "Sports & Branding Agencies", body: "Mockup in 12-24 hours. Your client approves, we produce. Championship rush available." },
];

const HOW_STEPS = [
  { n: "01", title: "Apply in 60 seconds", body: "Email lance@pandapatches.com with your company name and business type. No forms, no waiting list." },
  { n: "02", title: "Account manager assigned", body: "Within 24 hours your dedicated manager reaches out with partner pricing and onboarding." },
  { n: "03", title: "Submit your first project", body: "Send artwork or a brief. Mockup back in 12-24 hours. You approve, we produce." },
  { n: "04", title: "We ship, you bill", body: "Blind ship to your client or your warehouse. You keep 100% of your markup." },
];

const MARGIN_TABLE = [
  { type: "Embroidered", r25: "$3.85", r100: "$2.55", r500: "$1.60", r1000: "$1.32" },
  { type: "Woven", r25: "$5.20", r100: "$3.40", r500: "$2.50", r1000: "$2.00" },
  { type: "PVC", r25: "$5.75", r100: "$3.40", r500: "$2.80", r1000: "$2.20" },
  { type: "Chenille (4\")", r25: "$11.90", r100: "$7.20", r500: "$6.12", r1000: "—" },
  { type: "Leather", r25: "$4.40", r100: "$3.50", r500: "$2.16", r1000: "$1.80" },
];

export default async function PartnersPage() {
  const [faqSchema, workSamples, heroBg, categoryImages] = await Promise.all([
    Promise.resolve(generateFAQSchema(PARTNER_FAQS)),
    getWorkSamples(),
    getHeroBg(),
    getCategoryImages(),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(partnersBreadcrumbSchema)} />
      <Navbar />
      <main className="bg-white overflow-x-hidden">

        {/* ═══════════════════════════════════════════════════
            1. HERO — scattered patches background from Sanity (same as Offers page)
        ═══════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden bg-panda-dark">
          {/* Scattered patches background — no overlay, image is naturally light in the center */}
          {heroBg && (
            <div className="absolute inset-0">
              <Image
                src={heroBg}
                alt="Custom patches for partner agencies"
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          )}

          <div className="relative z-10 text-center px-6 pt-16 pb-16 max-w-[800px] mx-auto">
            <span className="inline-block bg-panda-yellow text-panda-dark text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-5">
              Creator · Affiliate · Agency Program
            </span>
            <h1 className="text-[38px] md:text-[58px] lg:text-[72px] font-black leading-[1.05] tracking-tight mb-5 text-panda-dark">
              Partner with Panda Patches.<br />
              <span className="text-panda-green">Create. Refer. Resell.</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-800 leading-relaxed max-w-[600px] mx-auto mb-8">
              Three ways to work together: creator and influencer gifting collabs, an affiliate referral program, and wholesale white-label production for agencies. Free patches for creators, referral rewards, and 10–18% margins for resellers.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <PartnerApplicationModal
                trigger={
                  <button
                    type="button"
                    className="bg-panda-yellow text-panda-dark px-8 py-4 rounded-[100px] font-black text-[16px] hover:brightness-105 transition-all"
                  >
                    Apply to Partner →
                  </button>
                }
              />
              <a
                href="tel:+13022504340"
                className="bg-panda-dark text-panda-yellow px-8 py-4 rounded-[100px] font-black text-[16px] hover:bg-black transition-all"
              >
                Call (302) 250-4340
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            2. PROOF BAR
        ═══════════════════════════════════════════════════ */}
        <section className="bg-panda-yellow py-8 px-6">
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1M+", label: "Patches Delivered" },
              { value: "5 pc", label: "Low Minimum" },
              { value: "24 hr", label: "Mockup Turnaround" },
              { value: "$0", label: "Setup Fees, Ever" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[38px] md:text-[46px] font-black text-panda-dark leading-none">{s.value}</p>
                <p className="text-[11px] font-black text-panda-dark/60 mt-1 uppercase tracking-[0.18em]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            2b. THREE PARTNER TRACKS (PAC949 Part 4)
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white border-b border-gray-100">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-panda-green text-[11px] font-black uppercase tracking-[0.25em] mb-3">Three ways to partner</p>
              <h2 className="text-[40px] md:text-[56px] font-black text-panda-dark leading-[1.05] mb-4">
                Pick the track that fits you.
              </h2>
              <p className="text-[18px] text-gray-700 font-medium max-w-[640px] mx-auto leading-relaxed">
                Whether you create content, send referrals, or resell to clients, there is a partner lane built for you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-gray-200 rounded-3xl p-8 hover:border-panda-yellow hover:shadow-lg transition-all">
                <span className="text-[34px]" aria-hidden="true">🎨</span>
                <h3 className="text-[22px] font-black text-panda-dark mt-3 mb-2">Creator &amp; Influencer</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-4">A free gifting batch of your own custom patches in exchange for a post, a tag, and a link. Built for tactical, streetwear, sports, scouting, biker, and maker creators.</p>
                <ul className="space-y-2 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Free custom patches you design</li>
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Keep the patches, no cost</li>
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Optional affiliate link on top</li>
                </ul>
              </div>
              <div className="relative border-2 border-panda-yellow rounded-3xl p-8 shadow-lg">
                <span className="absolute -top-3.5 left-6 bg-panda-dark text-panda-yellow text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Earn per sale</span>
                <span className="text-[34px]" aria-hidden="true">🔗</span>
                <h3 className="text-[22px] font-black text-panda-dark mt-3 mb-2">Affiliate &amp; Referral</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-4">Share a unique referral link or code with your audience and earn a reward on every order it brings in. Reward rates confirmed on approval.</p>
                <ul className="space-y-2 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Unique link and discount code</li>
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Referral reward per sale</li>
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Proud Partner badge to embed</li>
                </ul>
              </div>
              <div className="border-2 border-gray-200 rounded-3xl p-8 hover:border-panda-yellow hover:shadow-lg transition-all">
                <span className="text-[34px]" aria-hidden="true">🏭</span>
                <h3 className="text-[22px] font-black text-panda-dark mt-3 mb-2">B2B &amp; Reseller</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-4">Agencies, uniform suppliers, embroidery shops, and event partners buy at 10-18% partner margins with blind shipping and a dedicated account manager.</p>
                <ul className="space-y-2 text-[14px] text-gray-700">
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> 10-18% partner margins</li>
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Blind shipping and white-label</li>
                  <li className="flex gap-2"><span className="text-panda-green font-black">✓</span> Net terms after 3 projects</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-10">
              <PartnerApplicationModal
                trigger={
                  <button type="button" className="bg-panda-dark text-panda-yellow px-8 py-4 rounded-[100px] font-black text-[16px] hover:bg-panda-green transition-colors">
                    Apply to the Program →
                  </button>
                }
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            3. INDUSTRY GRID — "Trusted by Organizations"
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[40px] md:text-[58px] font-black text-panda-dark leading-[1.05] mb-4">
                Trusted by Organizations Across the US
              </h2>
              <p className="text-[18px] text-gray-700 font-medium max-w-[600px] mx-auto leading-relaxed">
                From first responders to Fortune 500 brands, we make patches for teams that demand quality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryImages.map((cat) => (
                <Link key={cat.label} href={cat.href} className="group block">
                  {/* Image box — no label inside */}
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 group-hover:border-panda-yellow group-hover:shadow-lg transition-all bg-panda-light aspect-[4/3]">
                    {cat.img ? (
                      <Image
                        src={urlFor(cat.img).width(600).height(450).format("webp").quality(80).url()}
                        alt={`${cat.label} — custom patches by Panda Patches`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-300 text-sm">Photo coming soon</p>
                      </div>
                    )}
                  </div>
                  {/* Label sits below the image */}
                  <p className="mt-3 text-center font-black text-panda-dark text-[16px] group-hover:text-panda-green transition-colors">
                    {cat.label}
                  </p>
                </Link>
              ))}
            </div>

            <p className="text-center text-[13px] text-gray-400 mt-6 italic">
              Also serving: military units, motorcycle clubs, schools, universities, bands, and event organizers.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            4. WORK GALLERY — heading dark, gallery full-width with lightbox/zoom
        ═══════════════════════════════════════════════════ */}
        <section className="pt-20 pb-4 px-6 bg-panda-dark">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-panda-yellow text-[11px] font-black uppercase tracking-[0.25em] mb-4">Production quality</p>
            <h2 className="text-[42px] md:text-[64px] lg:text-[80px] font-black text-white leading-[1.0] tracking-tight mb-6">
              Work your clients will love.
            </h2>
            <Link href="/custom-patches" className="text-panda-yellow text-[24px] md:text-[32px] font-black hover:underline underline-offset-4 transition-all">
              Browse our full range →
            </Link>
          </div>
        </section>

        {/* WorkGallery handles its own background, lightbox, swiper, and zoom */}
        <WorkGallery samples={workSamples} />

        {/* ═══════════════════════════════════════════════════
            5. WHY PARTNER — 3 DIFFERENTIATORS
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-panda-green text-[11px] font-black uppercase tracking-[0.25em] mb-3">Why agencies switch</p>
            <h2 className="text-[40px] md:text-[58px] font-black text-panda-dark leading-[1.05] mb-16 max-w-[700px]">
              We are not a broker. We own production.
            </h2>

            <div className="space-y-14">

              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block bg-panda-yellow text-panda-dark text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-5">01</span>
                  <h3 className="text-[30px] md:text-[38px] font-black text-panda-dark leading-tight mb-4">
                    One dedicated account manager. Always.
                  </h3>
                  <p className="text-[17px] text-gray-800 leading-relaxed mb-3">
                    Every partner gets a single point of contact &mdash; dedicated to your account and reachable only for your queries, never shared across fifty others &mdash; who knows your clients, artwork preferences, and deadlines. No ticket queues, no bots, no hold music.
                  </p>
                  <p className="text-[14px] text-gray-400">Quotes, mockups, production updates, reorders — one person, one thread.</p>
                </div>
                <div className="bg-panda-light border-2 border-panda-green/20 rounded-3xl p-8 space-y-5">
                  {["Direct email and phone — no ticketing system", "Responds within 1 business hour", "Remembers your account preferences", "Escalates to production immediately if needed"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-panda-green font-black text-xl mt-0.5 flex-shrink-0">✓</span>
                      <p className="text-[16px] text-panda-dark font-medium leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="order-2 md:order-1 bg-panda-dark rounded-3xl p-8 space-y-5 border-2 border-white/10">
                  {["No sourcing delays — made in our own facility", "Full QC before anything ships", "Rush available because we control the queue", "Your client never sees another supplier's name"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-panda-yellow font-black text-xl mt-0.5 flex-shrink-0">✓</span>
                      <p className="text-[16px] text-white font-medium leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="order-1 md:order-2">
                  <span className="inline-block bg-panda-yellow text-panda-dark text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-5">02</span>
                  <h3 className="text-[30px] md:text-[38px] font-black text-panda-dark leading-tight mb-4">
                    Owned facility. Faster, tighter, better margins.
                  </h3>
                  <p className="text-[16px] text-gray-700 leading-relaxed mb-3">
                    Most patch companies broker to Asia and add a markup. We own our production, which means we control lead times, quality, and your margin. When something goes wrong we fix it same day, and for repeat partners we usually absorb rush at no extra charge &mdash; we delivered 16,000 patches for <Link href="/case-studies/wise-nasdaq-times-square-activation" className="text-panda-green font-semibold underline">Wise&apos;s Nasdaq launch</Link> in under two weeks with no rush fee.
                  </p>
                  <p className="text-[14px] text-gray-500">1,000,000+ patches delivered. Built on 13 years of patch manufacturing experience. Zero middlemen.</p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block bg-panda-yellow text-panda-dark text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-5">03</span>
                  <h3 className="text-[30px] md:text-[38px] font-black text-panda-dark leading-tight mb-4">
                    Blind shipping. Your brand, your relationship.
                  </h3>
                  <p className="text-[17px] text-gray-800 leading-relaxed mb-3">
                    Packages ship with plain packaging or with your agency as the return address. Mockup PDFs delivered unbranded on request. Your client buys from you, full stop.
                  </p>
                  <p className="text-[14px] text-gray-400">Net-15 / Net-30 terms available after three successful projects.</p>
                </div>
                <div className="bg-panda-light border-2 border-panda-green/20 rounded-3xl p-8 space-y-5">
                  {["Blind ship to client address", "Your return address on the label", "Unbranded mockup PDFs on request", "White-label invoice available", "NDA signed within 24 hours"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-panda-green font-black text-xl mt-0.5 flex-shrink-0">✓</span>
                      <p className="text-[16px] text-panda-dark font-medium leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            6. PARTNER MARGIN TABLE
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-panda-light">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-panda-green text-[11px] font-black uppercase tracking-[0.25em] mb-3">Transparent pricing</p>
            <h2 className="text-[40px] md:text-[58px] font-black text-panda-dark leading-[1.05] mb-4">
              Your margin, on every order.
            </h2>
            <p className="text-[18px] text-gray-700 font-medium mb-10 max-w-[600px] leading-relaxed">
              Partner pricing is 10–18% below retail. The more you sell, the higher your tier. Prices below are your cost per piece. You set your own client price and keep 100% of the difference.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full min-w-[580px]">
                <thead>
                  <tr className="bg-panda-dark text-white">
                    <th className="text-left px-6 py-4 font-black text-[13px] uppercase tracking-wider">Patch Type</th>
                    <th className="text-center px-4 py-4 font-black text-[13px] uppercase tracking-wider">25 pcs</th>
                    <th className="text-center px-4 py-4 font-black text-[13px] uppercase tracking-wider">100 pcs</th>
                    <th className="text-center px-4 py-4 font-black text-[13px] uppercase tracking-wider">500 pcs</th>
                    <th className="text-center px-4 py-4 font-black text-[13px] uppercase tracking-wider text-panda-yellow">1,000 pcs</th>
                  </tr>
                </thead>
                <tbody>
                  {MARGIN_TABLE.map((row, i) => (
                    <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-panda-light"}>
                      <td className="px-6 py-4 font-bold text-panda-dark text-[15px]">{row.type}</td>
                      <td className="px-4 py-4 text-center text-gray-600 text-[15px]">{row.r25}</td>
                      <td className="px-4 py-4 text-center text-gray-600 text-[15px]">{row.r100}</td>
                      <td className="px-4 py-4 text-center text-gray-600 text-[15px]">{row.r500}</td>
                      <td className="px-4 py-4 text-center font-black text-panda-green text-[15px]">{row.r1000}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-gray-400 mt-4">
              Prices in USD. Sizes under 4 inches. Velcro backing +$30 flat per design. Custom sizes quoted within 4 hours by your account manager.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            7. THREE PARTNERSHIP TYPES
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-panda-green text-[11px] font-black uppercase tracking-[0.25em] mb-3">Partnership options</p>
            <h2 className="text-[40px] md:text-[58px] font-black text-panda-dark leading-[1.05] mb-12">
              Three ways to work with us.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  tag: "Option A",
                  title: "Wholesale Reseller",
                  body: "Buy at partner price, mark up, resell to your clients. You keep 100% of the markup. No account minimums, no contracts.",
                  badge: null,
                },
                {
                  tag: "Option B",
                  title: "White-Label Supplier",
                  body: "We produce and ship directly to your client with no Panda Patches branding. You own the relationship. Client never sees us.",
                  badge: "Most Popular",
                },
                {
                  tag: "Option C",
                  title: "Preferred Vendor",
                  body: "List us in your RFPs and client proposals. We quote fast, deliver on time, and you look great. Partner pricing applies.",
                  badge: null,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group relative border-2 border-gray-200 bg-white rounded-3xl p-8 cursor-default transition-all duration-200 hover:border-panda-yellow hover:bg-panda-yellow/5 hover:shadow-lg"
                >
                  {card.badge && (
                    <span className="absolute -top-3.5 left-6 bg-panda-dark text-panda-yellow text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  )}
                  <p className="text-[11px] font-black uppercase tracking-widest text-panda-green mb-3">{card.tag}</p>
                  <h3 className="text-[22px] font-black text-panda-dark mb-3 group-hover:text-panda-green transition-colors">{card.title}</h3>
                  <p className="text-[15px] text-gray-700 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            8. HOW IT WORKS — 4 STEPS
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-panda-dark">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-panda-yellow text-[11px] font-black uppercase tracking-[0.25em] mb-3">Getting started</p>
            <h2 className="text-[40px] md:text-[58px] font-black text-white leading-[1.05] mb-16">
              Up and running in 24 hours.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_STEPS.map((step) => (
                <div key={step.n} className="border border-white/10 rounded-2xl p-6">
                  <p className="text-[52px] font-black text-panda-yellow leading-none mb-4">{step.n}</p>
                  <h3 className="text-[18px] font-black text-white mb-3">{step.title}</h3>
                  <p className="text-[14px] text-gray-300 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            8b. AFFILIATE LINK + PROUD PARTNER BADGE (PAC949 Part 4)
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-panda-green text-[11px] font-black uppercase tracking-[0.25em] mb-3">How affiliates earn</p>
              <h2 className="text-[36px] md:text-[52px] font-black text-panda-dark leading-[1.05] mb-5">
                Your link. Your badge. Your cut.
              </h2>
              <p className="text-[17px] text-gray-700 leading-relaxed mb-6">
                Approved affiliates get a unique referral link and discount code to share, plus a &quot;Proud Partner of Panda Patches&quot; badge to place on your site, blog, or bio. When your audience orders through your link, you earn a referral reward and they get a warm welcome.
              </p>
              <ol className="space-y-3">
                {[
                  ["Apply", "Send your site and socials through the form. We review for fit."],
                  ["Get your link and badge", "Approved partners receive a unique link, a code, and a Proud Partner badge to embed."],
                  ["Share and earn", "Post, link, or refer. You earn a reward on every order your link brings in."],
                ].map(([t, b], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-panda-dark text-panda-yellow font-black flex items-center justify-center text-[14px]">{i + 1}</span>
                    <p className="text-[15px] text-gray-700 leading-snug"><strong className="text-panda-dark">{t}.</strong> {b}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-panda-light border-2 border-panda-green/20 rounded-3xl p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-panda-dark rounded-2xl px-5 py-3 mb-5">
                <span className="text-panda-yellow font-black text-[15px]">★ Proud Partner</span>
                <span className="text-[13px] text-gray-300">of Panda Patches</span>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                A clean badge and embed snippet, supplied on approval, links back to Panda Patches from your site. It builds your credibility and our shared reach.
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Reward rates and badge assets are confirmed with you on approval. Apply above to get started.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            9. REVIEWS
        ═══════════════════════════════════════════════════ */}
        <ReviewsSection />

        {/* ═══════════════════════════════════════════════════
            10. FAQ
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-panda-light">
          <div className="max-w-[800px] mx-auto">
            <p className="text-panda-green text-[11px] font-black uppercase tracking-[0.25em] mb-3">Before you apply</p>
            <h2 className="text-[40px] md:text-[56px] font-black text-panda-dark leading-[1.05] mb-12">
              Partner FAQ.
            </h2>
            <div className="space-y-8">
              {PARTNER_FAQS.map((faq) => (
                <div key={faq.question} className="border-b border-gray-200 pb-8">
                  <h3 className="text-[19px] font-black text-panda-dark mb-3">{faq.question}</h3>
                  <p className="text-[17px] text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            11. FINAL CTA
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-panda-dark">
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-panda-yellow text-[11px] font-black uppercase tracking-[0.25em] mb-4">Ready to partner?</p>
              <h2 className="text-[40px] md:text-[58px] font-black text-white leading-[1.05] mb-6">
                Add custom patches to your offer today.
              </h2>
              <p className="text-[16px] text-gray-300 leading-relaxed mb-8">
                Apply in 60 seconds. Your dedicated account manager reaches out within 24 hours with partner pricing and onboarding. No commitment, low 5-piece minimums.
              </p>
              <div className="space-y-4">
                {[
                  "Dedicated account manager in 24 hours",
                  "Partner pricing from your very first order",
                  "Mockup in 12-24 hours on every project",
                  "Blind shipping included at no charge",
                  "Net terms after 3 projects",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-panda-yellow font-black text-lg flex-shrink-0">✓</span>
                    <p className="text-[15px] text-gray-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-panda-green mb-3">Start the conversation</p>
              <h3 className="text-[26px] font-black text-panda-dark mb-6 leading-tight">
                Three ways to reach Lance.
              </h3>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-panda-light">
                  <div className="w-10 h-10 rounded-full bg-panda-green/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-panda-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-wider text-gray-500 mb-1">Email Lance directly</p>
                    <a href="mailto:lance@pandapatches.com" className="text-[15px] font-bold text-panda-dark hover:text-panda-green transition-colors break-all">
                      lance@pandapatches.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-panda-light">
                  <div className="w-10 h-10 rounded-full bg-panda-green/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-panda-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-wider text-gray-500 mb-1">Call the partner line</p>
                    <a href="tel:+13022504340" className="text-[15px] font-bold text-panda-dark hover:text-panda-green transition-colors">
                      (302) 250-4340
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-panda-light">
                  <div className="w-10 h-10 rounded-full bg-panda-green/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-panda-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-wider text-gray-500 mb-1">Apply in 60 seconds</p>
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                      Tell us about your business and Lance reaches out within 24 hours with partner pricing.
                    </p>
                  </div>
                </div>
              </div>

              <PartnerApplicationModal
                trigger={
                  <button
                    type="button"
                    className="w-full text-center bg-panda-dark text-panda-yellow font-black text-[16px] py-5 rounded-xl hover:bg-panda-green transition-colors"
                  >
                    Apply to Partner Program →
                  </button>
                }
              />

              <p className="text-[12px] text-gray-400 text-center mt-4">
                Response within 24 hours. No commitment required.
              </p>
            </div>
          </div>
        </section>

        <MakerNote />

        {/* Panda AI teaser — partners pitch their clients with concept art;
            the generator gives them instant visuals to close with. */}
        <AiGeneratorTeaser />

      </main>
      <Footer />
    </>
  );
}
