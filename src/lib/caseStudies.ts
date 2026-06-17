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
  {
    slug: "wise-nasdaq-times-square-activation",
    published: true,
    client: "Wise",
    clientDescriptor: "Global money platform, listed on Nasdaq",
    clientUrl: "https://wise.com",
    title: "Wise rang the Nasdaq bell in Times Square. We were proud to make the patches.",
    cardTitle: "Wise: Nasdaq Times Square Activation",
    metaTitle: "Wise Nasdaq Times Square Activation: 16,000 Custom Patches | Case Study",
    metaDescription:
      "Congratulations to Wise on its Nasdaq listing. See how Panda Patches delivered 16,000 custom patches for the Times Square activation, from first enquiry to delivery in under two weeks.",
    summary:
      "Congratulations to Wise on going public. When the global money platform celebrated its Nasdaq listing with a brand activation in Times Square, the 16,000 custom patches in the giveaway came from Panda Patches, designed, approved, and delivered in under two weeks to hit a date that could not move.",
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
      { value: "16,000", label: "custom patches delivered" },
      { value: "Under 2 weeks", label: "enquiry to delivery" },
      { value: "Times Square", label: "Nasdaq listing activation" },
    ],
    keyFacts: [
      "Client: Wise, the global money platform, celebrating its Nasdaq listing.",
      "Event: a brand activation in Times Square at the Nasdaq MarketSite, produced by IDEKO Productions.",
      "Maker: Panda Patches, a US custom patch manufacturer.",
      "Product: 16,000 custom patches in multiple die-cut designs, in Wise's signature green.",
      "Timeline: first enquiry April 21, mockups approved April 24, all 16,000 delivered by May 4, under two weeks.",
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
        heading: "What we delivered: 16,000 custom patches",
        body:
          "Panda Patches delivered 16,000 custom patches across multiple Wise designs in the brand's signature green, in custom die-cut shapes made for the giveaway, with backing that presses straight onto a hat, jacket, or tote.\n\nLike every Panda Patches order, each design went out as a digital mockup first and only moved into production once Wise approved it, so nothing was made until the brand signed off on the artwork and the color.",
        image: {
          src: "/assets/case-studies/wise-patches.png",
          alt: "The custom Wise patch designs Panda Patches produced for the Nasdaq activation",
        },
      },
      {
        heading: "Sixteen thousand patches in under two weeks",
        body:
          "The timeline was tight. Wise's first enquiry came in on April 21. Mockups went back and forth, and final approval landed on April 24. From there, all 16,000 patches were delivered by May 4, the date they had to be ready. Enquiry to doorstep in under two weeks, with the brand approving every design before a single patch was made.",
      },
      {
        heading: "On the day",
        body:
          "The patches went into Wise's green giveaway bags in Times Square, in the hands of the crowd celebrating the listing. A publicly-listed global brand, on one of its biggest days, trusted Panda Patches to deliver brand-exact quality at scale, on a deadline that could not slip. That is the same standard we hold whether an order is 5 patches or, like this one, 16,000.",
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
          "Panda Patches, a US custom patch manufacturer, delivered the 16,000 custom patches for the giveaway at Wise's Nasdaq listing brand activation in Times Square, produced by IDEKO Productions.",
      },
      {
        question: "How many patches did Wise order for the activation?",
        answer:
          "16,000 custom patches, made across multiple Wise designs in the brand's signature green.",
      },
      {
        question: "What type of patches were used at the Wise Nasdaq event?",
        answer:
          "Custom die-cut patches in multiple designs in Wise's signature green, made for the activation giveaway and easy to apply to bags, jackets, and apparel.",
      },
      {
        question: "Can Panda Patches produce custom patches at event scale on a deadline?",
        answer:
          "Yes. Panda Patches produces custom patches from a 5-piece minimum up to event scale. The Wise activation was 16,000 patches, delivered in under two weeks for a fixed deadline, with mockups approved before production.",
      },
    ],
    gallery: [
      { src: "/assets/case-studies/wise-event-1.png", alt: "Guests choosing Wise patches from the giveaway tables in Times Square" },
      { src: "/assets/case-studies/wise-event-2.png", alt: "Wise tote bags handed out at the Nasdaq listing activation" },
      { src: "/assets/case-studies/wise-event-3.png", alt: "Crowds at the Wise giveaway tables during the Times Square activation" },
    ],
    // Facts verified from the client correspondence (Apr 21 enquiry, Apr 24 approval,
    // May 4 delivery, 16,000 custom patches total). The emails themselves
    // and Wise's private details (address, VAT, PO, bank) are confidential and must NOT
    // be published. Event/billboard photos need Wise/Nasdaq permission before going live.
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
