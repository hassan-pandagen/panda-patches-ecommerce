/**
 * Case studies data layer.
 *
 * Each published object becomes a page at /case-studies/<slug> and a card on
 * the /case-studies index. To add a new case study, copy the template at the
 * bottom of this file, fill it in, set `published: true`, and add any images.
 *
 * Built for E-E-A-T + AEO (researched June 2026):
 *  - First-hand, specific, verifiable detail (named brands, real numbers) is the
 *    #1 ranking signal after the March 2026 core update. No vague claims.
 *  - `keyFacts` and `faqs` exist because AI answer engines (ChatGPT, AI
 *    Overviews) lift self-contained bullet lists and FAQ pairs verbatim, and
 *    ~71% of ChatGPT-cited pages carry schema. faqs also emit FAQPage schema.
 *  - Tone is warm and authentic (a partner celebrating a client's milestone),
 *    which reads as genuine experience rather than a vendor brag.
 *
 * Pages render text-forward and degrade gracefully when images are missing, so
 * a case study can ship before its photos are licensed and cleared.
 */

export interface CaseStudyStat {
  /** Punchy figure, e.g. "9,600". */
  value: string;
  /** What the figure describes, e.g. "custom patches delivered". */
  label: string;
}

export interface CaseStudyImage {
  src: string;
  alt: string;
  /** Photo credit line, shown under the image. Required for third-party photos. */
  credit?: string;
  caption?: string;
}

export interface CaseStudySection {
  heading: string;
  /** One or more paragraphs. Split paragraphs with a blank line (\n\n). */
  body: string;
  /** Optional image shown after this section's text (interleaves photos with copy). */
  image?: CaseStudyImage;
}

export interface CaseStudyFAQ {
  question: string;
  answer: string;
}

export interface CaseStudy {
  slug: string;
  published: boolean;

  /** Client/brand name. Only use a real name with the client's permission. */
  client: string;
  /** Short descriptor shown under the client name, e.g. "Global money platform". */
  clientDescriptor: string;
  /** Optional link to the client's site. Links the client name (entity signal + courtesy). */
  clientUrl?: string;

  /** Page H1. */
  title: string;
  /** Shorter title for the index card. */
  cardTitle: string;

  metaTitle: string;
  metaDescription: string;

  /** 1-2 sentence summary used on the card and below the H1. */
  summary: string;

  event?: string;
  location?: string;
  /** Human-readable date, e.g. "May 2026". */
  date: string;
  /** ISO date for Article schema, e.g. "2026-05-12". */
  isoDate: string;

  productType: string;
  /** Optional link to the matching product page. */
  productHref?: string;

  stats: CaseStudyStat[];

  /**
   * Self-contained, quotable facts. AI answer engines lift these verbatim, so
   * each line must stand alone and name the real entities involved.
   */
  keyFacts?: string[];

  sections: CaseStudySection[];

  /** FAQ pairs. Rendered on-page AND emitted as FAQPage schema (AEO). */
  faqs?: CaseStudyFAQ[];

  heroImage?: CaseStudyImage;
  gallery?: CaseStudyImage[];
  quote?: { text: string; author: string; role?: string };

  tags?: string[];
}

export const caseStudies: CaseStudy[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // VERSION B — the end brand is NEVER named. This is a contractual condition,
  // not a stylistic choice: the client's agency asked us to say "a national
  // snack brand" because brand-side approval to be named was not obtained
  // ("there may be some red tape to get approvals with the client", Aug 13).
  //
  // Do NOT add the brand to copy, headings, alt text, captions, filenames,
  // slug, schema, or the OG image. There is no Version A to switch to.
  //
  // Also never publish: the carrier tracking number (register-only, standing
  // canon — on-page wording is "carrier delivery record on file"), the order
  // value, or the venue address.
  //
  // Photos supplied by the agency for posting. The brand mark IS visible in
  // them; that was flagged to the owner before publishing and the decision to
  // use all four was made on 2026-08-13. Alt text stays neutral regardless.
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "nashville-event-patches-2026",
    published: true,

    client: "A New York creative agency",
    clientDescriptor: "Summer activation for a national snack brand",

    title:
      "1,500 event patches, 10 designs, 9 business days — delivered a day early for a Nashville brand activation",
    cardTitle: "Nashville Activation: 1,500 Patches in 9 Business Days",

    metaTitle:
      "1,500 Event Patches in 9 Business Days, Delivered a Day Early | Case Study",
    metaDescription:
      "A New York creative agency needed 1,500 woven patches across 10 designs for a national snack brand's Nashville activation, in hand by August 7. Panda Patches delivered on August 6 — more than 24 hours early.",

    summary:
      "Ten different designs, 150 pieces each, and a hard in-hand date two days before the event. Panda Patches produced 1,500 woven patches with peel-and-stick backing in 9 business days from mockup approval, and the shipment landed on August 6 — over a day ahead of the deadline.",

    event: "Summer brand activation at a youth gymnastics camp",
    location: "Nashville, Tennessee",
    date: "August 2026",
    isoDate: "2026-08-09",

    productType: "Woven Patches",
    productHref: "/custom-patches/woven",

    heroImage: {
      src: "/assets/case-studies/nashville-event-patches-3.webp",
      alt: "Children at a youth gymnastics camp choosing peel-and-stick patches from display trays and applying them to event tote bags",
    },

    stats: [
      { value: "1,500", label: "woven patches delivered" },
      { value: "10", label: "designs produced" },
      { value: "9", label: "business days, approval to in hand" },
      { value: "24h+", label: "ahead of the deadline" },
    ],

    keyFacts: [
      "Client: a New York creative agency, producing a summer activation for a national snack brand.",
      "Maker: Panda Patches, a U.S.-registered custom patch company producing at its own facility in Pakistan.",
      "Product: 1,500 woven patches across 10 designs, 150 pieces per design, around 3 inches, with adhesive peel-and-stick backing.",
      "Designs: five slogans across multiple colorways, ranging from a 3-inch rosette to slim 0.9-inch banner patches.",
      "Timeline: all ten mockups sent and approved in writing on the same day, July 24, 2026.",
      "Delivery: in hand on August 6, 2026, against a deadline of August 7 — more than 24 hours early. Carrier delivery record on file.",
      "Event: a youth gymnastics camp in Nashville, Tennessee, on August 9, 2026.",
    ],

    sections: [
      {
        heading: "Ten designs, 150 each, and a date that could not move",
        body:
          "When a New York creative agency needed custom patches for a national snack brand's Nashville activation, the math was tight: ten different designs, 150 pieces each, and a hard in-hand date of August 7 — with the event on August 9.\n\nThe patches were the activity, not the giveaway. Kids at the camp would pick their own patches and apply them to tote bags, which meant every design had to arrive, counted and separated, ready to hand out.",
      },
      {
        heading: "Day 1 — all ten mockups approved",
        body:
          "All ten designs — five slogans across multiple colorways, from a 3-inch rosette down to slim 0.9-inch banner patches — were mocked up, revised, and approved in writing the same day.\n\nThat matters more than it sounds. On a fixed-date job, the mockup round is where the schedule is usually lost. Approving all ten on day one is what made a 9-business-day turnaround possible at all.",
        image: {
          src: "/assets/case-studies/nashville-event-patches-1.webp",
          alt: "Children seated on a gym floor applying patches to event tote bags, with trays of loose patches beside them",
        },
      },
      {
        heading: "9 business days — production",
        body:
          "All ten designs ran as woven patches — the construction that holds fine slogan text at 3 inches, where embroidery thread would blur it — with adhesive peel-and-stick backing so they could be applied by hand at the event without heat or sewing.\n\nEach design was counted and packed separately, so the event team could distribute them without sorting 1,500 loose patches on the day.",
        image: {
          src: "/assets/case-studies/nashville-event-patches-2.webp",
          alt: "Event tote bags with patches applied, next to a tray of loose peel-and-stick patches",
        },
      },
      {
        heading: "One day early",
        body:
          "The shipment cleared DHL Express and was delivered on August 6 at 1:21 PM — over 24 hours ahead of the deadline, with two clear days before the event. Carrier delivery record on file.",
      },
      {
        heading: "The event ran August 9",
        body:
          "The patches went out at a youth gymnastics camp in Nashville, where kids chose their own and applied them to tote bags. In the client's words: \"a huge success.\"",
        image: {
          src: "/assets/case-studies/nashville-event-patches-4.webp",
          alt: "Overhead view of a youth gymnastics camp activity, with patches, display trays and decorated tote bags across the floor",
        },
      },
    ],

    faqs: [
      {
        question: "How fast can Panda Patches produce custom patches for an event?",
        answer:
          "This order — 1,500 woven patches across 10 distinct designs — went from mockup approval to in hand in 9 business days, and arrived more than 24 hours before the deadline. Turnaround depends on design count, quantity and construction, and your exact in-hand date is confirmed by email within 2 to 6 hours of ordering, before any rush fee is charged.",
      },
      {
        question: "Can you produce multiple patch designs in one order?",
        answer:
          "Yes. This order was ten separate designs at 150 pieces each, with several slogans produced in multiple colorways. Each design was counted and packed separately so the event team could distribute them without sorting.",
      },
      {
        question: "What backing works for patches applied at an event?",
        answer:
          "Adhesive peel-and-stick backing, which is what this order used. It lets people apply patches by hand on the spot, with no heat press, iron or sewing — the right choice when the application is the activity. Iron-on and sew-on are better where the patch needs to survive repeated washing.",
      },
      {
        question: "Why woven rather than embroidered for slogan patches?",
        answer:
          "Woven construction holds finer detail than embroidery. These designs carried slogan text on patches as small as 0.9 inches tall, where embroidery thread — roughly 1mm wide at its finest — would have merged the letters. Woven thread is finer, so the text stays legible at that size.",
      },
    ],

    gallery: [],

    quote: {
      text:
        "Working with Lance and Panda Patches was a great experience… quality patches against a tight timeline… kept me in the loop from end to end… turned out great for the event!",
      author: "Kelly Paschall",
      role: "Verified Trustpilot review, August 2026",
    },

    tags: ["Brand Activation", "Event", "Woven Patches", "Fast Turnaround"],
  },
  {
    slug: "wise-nasdaq-times-square-activation",
    published: true,
    client: "Wise",
    clientDescriptor: "Global money platform, listed on Nasdaq",
    clientUrl: "https://wise.com",
    title: "Wise rang the Nasdaq bell in Times Square. We were proud to make the patches.",
    cardTitle: "Wise: Nasdaq Times Square Activation",
    metaTitle: "Wise Nasdaq Times Square Activation: 9,600 Custom Patches | Case Study",
    metaDescription:
      "Congratulations to Wise on its Nasdaq listing. See how Panda Patches delivered 9,600 woven patches across 16 designs for the Times Square activation, in two shipments that both landed on their contractual dates.",
    summary:
      "Congratulations to Wise on going public. When the global money platform celebrated its Nasdaq listing with a brand activation in Times Square, the 9,600 custom patches in the giveaway came from Panda Patches, designed, approved, and delivered in two shipments on May 4 and May 7, both on contractual dates that could not move.",
    event: "Nasdaq Listing Brand Activation",
    location: "Times Square, New York",
    date: "May 11, 2026",
    isoDate: "2026-05-11",
    productType: "Custom Patches",
    productHref: "/custom-patches",
    // Event photo — confirm the photographer credit and usage rights with Wise before going live.
    heroImage: {
      src: "/assets/case-studies/wise-billboard.jpg",
      alt: "Wise team in Times Square at the Nasdaq MarketSite for the company's listing",
    },
    stats: [
      { value: "9,600", label: "woven patches delivered" },
      { value: "16", label: "designs produced" },
      { value: "Both on time", label: "May 4 and May 7 shipments" },
    ],
    keyFacts: [
      "Client: Wise, the global money platform, celebrating its Nasdaq listing.",
      "Event: a brand activation in Times Square at the Nasdaq MarketSite, produced by IDEKO Productions.",
      "Maker: Panda Patches, a U.S.-registered custom patch company producing at its own facility in Pakistan.",
      "Product: 9,600 woven patches across 16 designs, in Wise's signature green.",
      "Timeline: mockups for the first 10 designs sent under 3 hours after artwork arrived; delivered in two shipments on May 4 and May 7, both on their contractual dates.",
      "Use: giveaway patches handed to the crowd at the opening-bell activation.",
    ],
    tags: ["Brand Activation", "Giveaway", "Event"],
    sections: [
      {
        heading: "Congratulations, Wise",
        body:
          "First, the part that matters most: congratulations to Wise on going public. Taking a company from a London startup to the Nasdaq opening bell is a milestone very few teams ever reach, and we were genuinely proud that custom patches from Panda Patches were part of how Wise marked the day.",
      },
      {
        heading: "The moment in Times Square",
        body:
          "Wise celebrated its Nasdaq listing with a full brand activation in Times Square at the Nasdaq MarketSite, produced by IDEKO Productions. Brand-green ran through everything, from the billboards to a giveaway for the crowd gathered for the opening bell. The patches were part of that giveaway, going out alongside the rest of the Wise-green merch.",
      },
      {
        heading: "The brief: brand-exact, at scale, on a fixed date",
        body:
          "For the giveaway, Wise needed patches that matched their brand exactly, at event scale, and ready before a date that could not move. An opening bell does not wait on a production queue. That meant the artwork had to be right the first time, the color had to be true Wise green, and several thousand finished patches had to arrive before the event, not after it.",
      },
      {
        heading: "What we delivered: 9,600 woven patches",
        body:
          "Panda Patches delivered 9,600 woven patches across 16 Wise designs in the brand's signature green, made for the giveaway with backing that presses straight onto a hat, jacket, or tote. Woven construction was the right call for artwork this detailed — it holds fine line work and small type that embroidery thread would blur.\n\nLike every Panda Patches order, each design went out as a digital mockup first and only moved into production once Wise approved it, so nothing was made until the brand signed off on the artwork and the color.",
        image: {
          src: "/assets/case-studies/wise-patches.png",
          alt: "The custom Wise patch designs Panda Patches produced for the Nasdaq activation",
        },
      },
      {
        heading: "Two shipments, two contractual dates, both met",
        body:
          "The timeline was tight and the dates were fixed. The first batch of artwork arrived on April 21 and mockups for those 10 designs went back under 3 hours later. Approvals came through on April 23 and 24, and the finished patches went out in two shipments, delivered on May 4 and May 7 — each on the date it had been promised for.\n\nNothing entered production before Wise approved the design and the color, and no rush surcharge was applied.",
      },
      {
        heading: "On the day",
        body:
          "The patches went into Wise's green giveaway bags in Times Square, in the hands of the crowd celebrating the listing. A publicly-listed global brand, on one of its biggest days, trusted Panda Patches to deliver brand-exact quality at scale, on dates that could not slip. That is the same standard we hold whether an order is 5 patches or, like this one, 9,600.",
        image: {
          src: "/assets/case-studies/wise-times-square.png",
          alt: "Wise patches and merch being handed out at the Times Square activation tables",
        },
      },
    ],
    faqs: [
      {
        question: "Who made the patches for Wise's Nasdaq Times Square activation?",
        answer:
          "Panda Patches, a U.S.-registered custom patch company, delivered the 9,600 woven patches for the giveaway at Wise's Nasdaq listing brand activation in Times Square, produced by IDEKO Productions.",
      },
      {
        question: "How many patches did Wise order for the activation?",
        answer:
          "9,600 woven patches, made across 16 Wise designs in the brand's signature green.",
      },
      {
        question: "What type of patches were used at the Wise Nasdaq event?",
        answer:
          "Woven patches in 16 designs in Wise's signature green, made for the activation giveaway and easy to apply to bags, jackets, and apparel.",
      },
      {
        question: "Can Panda Patches produce custom patches at event scale on a deadline?",
        answer:
          "Yes. Panda Patches produces custom patches from a 5-piece minimum up to event scale. The Wise activation was 9,600 woven patches across 16 designs, delivered in two shipments on May 4 and May 7 against fixed contractual dates, with mockups approved before production.",
      },
    ],
    gallery: [
      { src: "/assets/case-studies/wise-event-1.png", alt: "Guests choosing Wise patches from the giveaway tables in Times Square" },
      { src: "/assets/case-studies/wise-event-2.png", alt: "Wise tote bags handed out at the Nasdaq listing activation" },
      { src: "/assets/case-studies/wise-event-3.png", alt: "Crowds at the Wise giveaway tables during the Times Square activation" },
    ],
    // Claims corrected 2026-07-20 per SEDAA3_1 §E, which supersedes the earlier
    // draft: total is 9,600 woven patches across 16 designs (not 16,000), delivered
    // in TWO shipments (May 4 + May 7), both on their contractual dates.
    //
    // Do NOT reintroduce, all explicitly prohibited by §E:
    //   - "16,000"
    //   - "under two weeks from first enquiry" (the real span is 19 days: Apr 15 → May 4)
    //   - any project-wide "in-hand in 13 days" phrasing implying one shipment
    //   - "US custom patch manufacturer" (contradicts the overseas-production disclosure)
    //   - payment-timing commentary, client logos, endorsement wording
    // GATED until an airway bill or packing list ties each quantity to its shipment:
    // the 6,000 / 3,600 per-shipment split (currently inferred from deadlines, not documented).
    // Client naming itself remains pending written permission (§A.7) — owner's call.
    //
    // Source correspondence (Apr 15 enquiry, Apr 21/23 artwork, Apr 23/24 approvals,
    // May 4 + May 7 PODs) and Wise's private details (address, VAT, PO, bank) are
    // confidential and must NOT be published. Event/billboard photos are credited to
    // Nasdaq, Inc./Vanja Savic — link or official embed only, never copy the file.
  },

  // ---------------------------------------------------------------------------
  // TEMPLATE for the next case study. Copy, fill in, set published: true.
  // ---------------------------------------------------------------------------
  // {
  //   slug: "client-event-name",
  //   published: false,
  //   client: "Client",
  //   clientDescriptor: "What they are",
  //   title: "Page H1",
  //   cardTitle: "Client: short title",
  //   metaTitle: "... : N Custom Patches | Case Study",
  //   metaDescription: "...",
  //   summary: "Warm 1-2 sentences, naming the real entities and the number.",
  //   event: "Event name",
  //   location: "City",
  //   date: "Month 2026",
  //   isoDate: "2026-01-01",
  //   productType: "Custom ... Patches",
  //   productHref: "/custom-patches/...",
  //   stats: [{ value: "", label: "" }],
  //   keyFacts: ["Self-contained, quotable facts that name the entities."],
  //   tags: [],
  //   sections: [{ heading: "The brief", body: "" }],
  //   faqs: [{ question: "", answer: "Self-contained answer naming the brand." }],
  // },
];

export function getPublishedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => c.published);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug && c.published);
}
