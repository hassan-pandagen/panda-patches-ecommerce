import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewsSection from "@/components/home/ReviewsSection";
import WorkGallery from "@/components/bulk/WorkGallery";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { generateSchemaScript, generateFAQSchema } from "@/lib/schemas";

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

export const metadata: Metadata = {
  title: "Partner Program for Agencies & Resellers | Panda Patches",
  description: "Wholesale and white-label patch manufacturing for promotional agencies, uniform suppliers, and embroidery shops. 10-18% partner margins, dedicated account manager, no minimums.",
  alternates: { canonical: "https://www.pandapatches.com/partners" },
  openGraph: {
    title: "Panda Patches Agency Partner Program",
    description: "Sell custom patches under your brand. We handle production. 10-18% margins, dedicated account manager, blind shipping.",
    type: "website",
    url: "https://www.pandapatches.com/partners",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const PARTNER_FAQS = [
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
    answer: "Net-15 and Net-30 terms are available after three completed projects. First-time partners pay at order. Established accounts can request a credit application via design@pandapatches.com.",
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
  { icon: "🏆", title: "Sports & Branding Agencies", body: "Free mockup in 24 hours. Your client approves, we produce. Championship rush available." },
];

const HOW_STEPS = [
  { n: "01", title: "Apply in 60 seconds", body: "Email design@pandapatches.com with your company name and business type. No forms, no waiting list." },
  { n: "02", title: "Account manager assigned", body: "Within 24 hours your dedicated manager reaches out with partner pricing and onboarding." },
  { n: "03", title: "Submit your first project", body: "Send artwork or a brief. Free mockup back in 24 hours. You approve, we produce." },
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
              For Agencies &amp; Resellers
            </span>
            <h1 className="text-[38px] md:text-[58px] lg:text-[72px] font-black leading-[1.05] tracking-tight mb-5 text-panda-dark">
              Sell custom patches<br />
              <span className="text-panda-green">under your brand.</span><br />
              We handle production.
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-800 leading-relaxed max-w-[560px] mx-auto mb-8">
              Trusted by promotional agencies, uniform suppliers, and embroidery shops across the US and UK. 10–18% partner margins. Dedicated account manager from day one. No minimums, no setup fees.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-panda-yellow text-panda-dark px-8 py-4 rounded-[100px] font-black text-[16px] hover:brightness-105 transition-all"
              >
                Apply to Partner →
              </Link>
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
              { value: "4.8★", label: "Trustpilot Rating" },
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
                    Every partner gets a single point of contact who knows your clients, artwork preferences, and deadlines. No ticket queues, no bots, no hold music.
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
                    Most patch companies broker to Asia and add a markup. We own our production which means we control lead times, quality, and your margin. When something goes wrong we fix it same day.
                  </p>
                  <p className="text-[14px] text-gray-500">1,000,000+ patches delivered since 2016. Zero middlemen.</p>
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
                Apply in 60 seconds. Your dedicated account manager reaches out within 24 hours with partner pricing and onboarding. No commitment, no minimums.
              </p>
              <div className="space-y-4">
                {[
                  "Dedicated account manager in 24 hours",
                  "Partner pricing from your very first order",
                  "Free mockup on every project",
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
              <h3 className="text-[22px] font-black text-panda-dark mb-6">Start the conversation</h3>
              <div className="space-y-4 mb-6">
                {[
                  { icon: "✉️", label: "Email us directly", value: "design@pandapatches.com", href: "mailto:design@pandapatches.com?subject=Partnership%20Inquiry" },
                  { icon: "📞", label: "Call us", value: "(302) 250-4340", href: "tel:+13022504340" },
                  { icon: "💬", label: "Use the contact form", value: "pandapatches.com/contact", href: "/contact" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-panda-light rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-black text-panda-dark text-[14px]">{item.label}</p>
                      <a href={item.href} className="text-panda-green font-bold text-[14px] underline underline-offset-2 hover:text-panda-dark transition-colors">
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block w-full text-center bg-panda-dark text-panda-yellow font-black text-[16px] py-5 rounded-xl hover:bg-panda-green transition-colors"
              >
                Apply to Partner →
              </Link>
              <p className="text-[12px] text-gray-400 text-center mt-4">
                Response within 24 hours. No commitment required.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
