import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";

async function getData() {
  // 1. Fetch About Page Text
  // 2. Fetch Trust Badges from HERO (Reusing them!)
  const query = `
    {
      "about": *[_type == "about"][0],
      "hero": *[_type == "hero"][0]
    }
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function AboutContent() {
  const { about, hero } = await getData();

  // Fallback Data for Text
  const title = about?.mainHeading || "About Us";
  const sections = about?.textSections || [
    {
      heading: "More Than Just Patches, We're Patch Partners!",
      // The founding story is CEO-approved canon (factConstants.FOUNDER_STORY),
      // quoted verbatim — an approved company fact, not marketing copy. The
      // "13 years" stays attached to the founder, never the company.
      description: "Welcome to Panda Patches, where we are more than just patch makers – we are your patch partners. Imran spent ten years making patches for other companies before founding Panda Patches in 2023 — convinced that customers deserved better service at a better price, from someone who'd actually made the product with his own hands. Drawing on our founder's 13+ years in custom patch manufacturing, we weave brand stories into the hearts of customers worldwide."
    },
    {
      heading: "Rooted in Expertise, Stitched with Dedication",
      // Panda Patches IS MC Patches LLC trading under another name — not a
      // division of it. Matches the Terms page: "MC Patches LLC (trading as
      // Panda Patches)".
      description: "Panda Patches is the trading name of MC Patches LLC, our U.S.-registered company. Owning our production rather than brokering it out is what puts real expertise and craftsmanship into every patch we make. Our skilled artisans infuse passion into every stitch, transforming your patches into more than just fabric – they become symbols of quality and dedication."
    },
    {
      heading: "Your Brand Story Sewn to Perfection",
      description: "We're all about telling your brand's story with style! Imagine your logo or design stitched onto a patch – it's like a mini billboard that speaks volumes about your brand wherever it goes. Whether you're a business, team, or organization, our patches are the perfect way to showcase your unique identity and leave a lasting impression. Let's stitch your story together!"
    },
    {
      heading: "Fast and Flawless Patch-Making Process",
      description: "We turn your patch ideas into reality with speed and precision. From the initial design concept to the final product, our top-notch patch making services ensure your vision shines through in every stitch. Our advanced production facilities, coupled with a dedication to quality, result in patches that are second to none."
    },
    {
      heading: "Customer Satisfaction Is Our Badge Of Honor",
      description: "Customer satisfaction isn't just a goal; it's our badge of honor. We're not just in the business of creating patches; we're in the business of building relationships. From the initial inquiry to the final delivery, our friendly and knowledgeable team is dedicated to guiding you through every step of the process. Your satisfaction is our top priority, and we're here to ensure a seamless experience from start to finish."
    }
  ];

  return (
    <section className="w-full pt-4 pb-8 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center">

        {/* === MAIN PAGE TITLE === */}
        <h1 className="text-[1.25rem] md:text-[2.25rem] font-black text-panda-dark uppercase mb-1 tracking-tight">
          {title}
        </h1>

        {/* === TRUST BADGES (REUSED FROM HERO) === */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
           {hero?.trustBadges && hero.trustBadges.map((badge: any, idx: number) => (
             <div key={idx} className="relative h-7 w-20 md:h-9 md:w-24">
               <Image
                 src={urlFor(badge).width(200).format('webp').quality(80).url()}
                 alt={`Trust badge ${idx + 1}`}
                 fill
                 className="object-contain"
                 sizes="96px"
               />
             </div>
           ))}
        </div>

        {/* === CONTENT BOX === */}
        <div className="flex flex-col gap-5 md:gap-8 max-w-[50rem] text-center">

          {sections.map((section: any, idx: number) => (
            <div key={idx} className="space-y-1.5">

              <h2 className="text-[0.9375rem] md:text-[1.5rem] font-bold text-panda-dark leading-snug">
                {section.heading}
              </h2>

              <p className="text-[0.8125rem] md:text-[0.9375rem] font-normal text-gray-600 leading-[1.6] mx-auto">
                {section.description}
              </p>

            </div>
          ))}

          {/*
            The About hub previously linked to NEITHER of its own subpages, so
            /about/imran-raza was reachable only from scattered deep links and
            /about/digitizing-team only from that page — a two-hop chain off an
            orphan. Google logged the team page as "Discovered - currently not
            indexed" with no crawl ever attempted, which is what an unreachable
            page looks like from outside. A hub that does not link its children
            is the structural bug; these are the links that fix it.
          */}
          <p className="text-[0.8125rem] md:text-[0.9375rem] text-gray-600 leading-[1.6] mx-auto">
            The people behind the patches:{" "}
            <Link href="/about/imran-raza" className="text-panda-green font-semibold underline">
              Imran Raza, our founder
            </Link>
            , and{" "}
            <Link href="/about/digitizing-team" className="text-panda-green font-semibold underline">
              the digitizing team
            </Link>{" "}
            who turn your artwork into a stitch file before anything reaches a machine.
          </p>

        </div>

      </div>
    </section>
  );
}
