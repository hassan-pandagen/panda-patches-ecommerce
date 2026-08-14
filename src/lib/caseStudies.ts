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
  /**
   * Fit the whole image inside the frame instead of cropping to fill it.
   * Set this for product and design shots on a plain background — a square,
   * die-cut patch loses its top and bottom to the default 16:10 crop.
   * Leave unset for photographs, where cropping to the frame is what you want.
   */
  contain?: boolean;
}

export interface CaseStudySection {
  heading: string;
  /**
   * One or more paragraphs. Split paragraphs with a blank line (\n\n).
   * Rendered as plain text — markdown is NOT parsed here, so a [label](href)
   * would print literally. Use `link` below for an outbound link.
   */
  body: string;
  /** Optional image shown after this section's text (interleaves photos with copy). */
  image?: CaseStudyImage;
  /** Optional outbound link rendered under this section's paragraphs. */
  link?: { href: string; label: string };
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
  /**
   * Closing testimonial. `sourceUrl` links the quote to its public source —
   * required when the quote is lifted from a public review rather than private
   * correspondence, so a reader can verify it rather than take our word.
   */
  quote?: { text: string; author: string; role?: string; sourceUrl?: string; sourceLabel?: string };

  /** Overrides the default CTA heading/body on this case study only. */
  ctaHeading?: string;
  ctaBody?: string;

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
  // EVENT PHOTOS: four were supplied, THREE are published (2, 3, 4).
  //
  // nashville-event-patches-1.webp is deliberately withheld and must stay
  // withheld. The brand wordmark is legible on it around twenty times — across
  // the tote bags, the children's shirts, and the patch trays — and the branded
  // bags are the visual SUBJECT of the frame, not incidental background. CASE-S_1
  // line 17 is explicit: "Prefer the shots where patches (not logos) are the
  // visual subject." Publishing it would identify the brand as surely as naming
  // it in the copy, which is the one thing Version B contractually forbids.
  //
  // The brand IS faintly visible in the three that ARE published; that was
  // flagged to the owner and accepted on 2026-08-13. The distinction is
  // incidental visibility versus the logo being the point of the photo.
  //
  // The Aug 14 CEO brief refers to "5 supplied event photos". Only FOUR ever
  // arrived, in both public/event/ and NASHVI_2/nashville-event-photos/. If a
  // fifth exists it was never handed over — worth asking before the source
  // folders are deleted, since they are the last copy outside Sanity.
  //
  // Alt text stays neutral on every image regardless of what is in frame.
  //
  // MOCKUPS: ten were produced and all ten were opened and checked individually,
  // never assumed clean from a filename. design-mockup-1 is the client's brand
  // LOGO patch and is the single asset that would identify them — excluded, and
  // it must stay excluded. The other nine carry no brand mark and are all
  // published here. The set reconciles exactly with the brief's design list:
  // 1 rosette + 3 "Step Up Your Snack" colourways + 3 "Train Like a Champion"
  // colourways + 2 "The Snack You've Been Waiting For" colourways = 9, plus the
  // logo patch = 10.
  //
  // PRODUCTION PHOTOS: safe — the only brand-bearing stack appears edge-on, so
  // no wordmark is legible. Recheck if these are ever re-cropped or enlarged.
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
      "Designs: five artworks across multiple colorways — a 2.4 by 3 inch rosette badge, two slogans at 3 by 1.4 inches, and a banner slogan at 3 by 0.9 inches.",
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
          src: "/assets/case-studies/nashville-design-rosette.webp",
          alt: "Approved patch mockup of a #1 rosette badge, annotated with its finished size of 2.4 by 3 inches and a dark green border",
          caption: "Every design went out as an annotated mockup with its finished size and border colour marked, so nothing went into production before the client had signed off on the spec.",
        },
      },
      {
        heading: "9 business days — production",
        body:
          "All ten designs ran as woven patches — the construction that holds fine slogan text at 3 inches, where embroidery thread would blur it — with adhesive peel-and-stick backing so they could be applied by hand at the event without heat or sewing.\n\nEach design was counted and packed separately, so the event team could distribute them without sorting 1,500 loose patches on the day.",
        image: {
          src: "/assets/case-studies/nashville-production-1.webp",
          alt: "Finished woven patches bagged by design on the production floor, each bag labelled by hand with its piece count",
          caption: "Counted and bagged by design before shipping, with the piece count written on each bag — so the event team could hand them out without sorting.",
        },
      },
      {
        heading: "One day early",
        body:
          "The shipment cleared DHL Express and was delivered on August 6 at 1:21 PM — over 24 hours ahead of the deadline, with two clear days before the event. Carrier delivery record on file.",
        image: {
          src: "/assets/case-studies/nashville-event-patches-2.webp",
          alt: "Event tote bags with patches applied, next to a tray of loose peel-and-stick patches",
        },
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

    // Approved design mockups. The tenth design — the client's brand logo patch
    // — is deliberately absent: it is the one asset that would identify the end
    // brand, which Version B does not permit. Do not add it.
    gallery: [
      {
        src: "/assets/case-studies/nashville-design-stepup-green.webp",
        alt: "Approved patch mockup reading Step Up Your Snack in white and yellow on green, marked 2.32 by 3 inches with a dark green border",
      },
      {
        src: "/assets/case-studies/nashville-design-stepup-yellow.webp",
        alt: "The same Step Up Your Snack design in a second colourway, red on yellow with a red border",
      },
      {
        src: "/assets/case-studies/nashville-design-stepup-purple.webp",
        alt: "The Step Up Your Snack design in a third colourway, white and yellow on purple with a dark purple border",
      },
      {
        src: "/assets/case-studies/nashville-design-champion-red.webp",
        alt: "Approved patch mockup reading Train Like a Champion with a crown, red with a yellow border, marked 3 by 0.9 inches",
      },
      {
        src: "/assets/case-studies/nashville-design-champion-purple.webp",
        alt: "The Train Like a Champion design in a purple colourway with a yellow border",
      },
      {
        src: "/assets/case-studies/nashville-design-champion-green.webp",
        alt: "The Train Like a Champion design in a third colourway, white on green with a yellow border",
      },
      {
        src: "/assets/case-studies/nashville-design-snack-purple.webp",
        alt: "Approved patch mockup reading The Snack You've Been Waiting For, white on purple with a yellow border, marked 3 by 1.4 inches",
      },
      {
        src: "/assets/case-studies/nashville-design-snack-green.webp",
        alt: "The Snack You've Been Waiting For design in a green colourway with a yellow border",
      },
      {
        src: "/assets/case-studies/nashville-production-2.webp",
        alt: "Bagged and labelled woven patches stacked by design before dispatch",
      },
    ],

    quote: {
      text:
        "Working with Lance and Panda Patches was a great experience. They worked with us to produce quality patches against a tight timeline. Lance was very communicative every step of the way and kept me in the loop from end to end production. The patches were great quality and turned out great for the event!",
      author: "Kelly Paschall",
      role: "Verified Trustpilot review, August 2026",
      sourceUrl: "https://www.trustpilot.com/review/pandapatches.com",
      sourceLabel: "Read the review on Trustpilot",
    },

    ctaHeading: "Need patches by a date?",
    ctaBody:
      "We confirm your exact in-hand date by email within 2 to 6 hours — before you pay any rush fee. Tell us your deadline and we plan production around it.",

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
  // ───────────────────────────────────────────────────────────────────────────
  // NAMED version, approved in writing by Emily Rodgers (Aug 13, 2026) —
  // covers naming Karbach, quoting her emails, and showing the designs.
  // Approval email filed in the claims register.
  //
  // Order numbering: this is #3987 in the old Google Sheet log and PP-10191 in
  // the CRM. Both refer to the same order; the numbering changed when the CRM
  // replaced the sheet. Register both so it stays findable from either system.
  //
  // NEVER publish: the order value, the FedEx tracking number, the delivery
  // signer's name, or any rush-fee amount (that fee predates the current
  // 25%/$50-min rush canon and would misrepresent today's pricing).
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "karbach-brewing-patches",
    published: true,

    client: "Karbach Brewing",
    clientDescriptor: "Craft brewery",

    title:
      "1,200 woven and leather patches for Karbach Brewing — approved to in hand in 10 days, a day ahead of deadline",
    cardTitle: "Karbach Brewing: 1,200 Patches, Delivered a Day Early",

    metaTitle:
      "Karbach Brewing: 1,200 Woven and Leather Patches in 10 Days | Case Study",
    metaDescription:
      "Karbach Brewing needed 1,200 woven and leather patches for a Los Angeles event on January 20. Approved January 9, shipped January 14, delivered and signed for January 19 — a day before the event.",

    summary:
      "Six designs, 1,200 pieces, a mix of woven and laser-engraved genuine leather, and an event in Los Angeles that could not move. Mockups were approved on January 9, the order shipped on January 14, and it was signed for on January 19 — one day before the event and ten days after approval.",

    event: "Brand event",
    location: "Los Angeles, California",
    date: "January 2026",
    isoDate: "2026-01-19",

    productType: "Woven and Leather Patches",
    productHref: "/custom-patches/woven",

    // SUBSTANTIATION NOTE — read before "correcting" the woven+leather claim.
    // The CRM record for this order (PP-10191) reads patches_type = "Woven"
    // alone. That is a gap in the CRM's option list, not evidence against the
    // mix: the field does carry combined values (Sublimation+Embroidery,
    // TPU+Chenille and five more, 56 orders between them), but the list grew one
    // pair at a time and Woven+Leather was never added. The mix is evidenced by
    // the January email thread and by the leather design shot published below.
    // Tracked in GSC/CRM-DEV-BRIEF.md.

    // Design shots supplied by the digitizer, Aug 14 2026, and confirmed by the
    // owner as the WOVEN designs from this order. Emily Rodgers' Aug 13 written
    // permission explicitly covers showing the designs.
    //
    // Both images here are woven. Do NOT caption either as leather: a third
    // image showing the leather design is still to come, and the honest-footnote
    // section below is its slot — a leather shot next to the paragraph about
    // leather scorching under an iron is the strongest placement on the page.
    heroImage: {
      src: "/assets/case-studies/karbach-design-texas-lager.webp",
      contain: true,
      alt: "Woven Karbach Brewing patch cut to the shape of Texas, cream ground with navy Karbach lettering, orange Texas Lager type, and a Born in Texas star roundel",
      caption:
        "One of the six designs: a Texas-shaped woven patch, merrowed border, produced at 2.5 to 3.5 inches with iron-on backing.",
    },

    stats: [
      { value: "1,200", label: "patches delivered" },
      { value: "6", label: "designs, woven + leather" },
      { value: "5 days", label: "approval to shipped" },
      { value: "1 day", label: "ahead of the event" },
    ],

    keyFacts: [
      "Client: Karbach Brewing, ordering patches for a brand event in Los Angeles.",
      "Maker: Panda Patches, a U.S.-registered custom patch company producing at its own facility in Pakistan.",
      "Product: 1,200 patches across 6 designs at 200 pieces each — a mix of woven and laser-engraved genuine leather, 2.25 to 3.5 inches, with iron-on backing.",
      "Constraint: a rush order from the first message, with an event in Los Angeles on January 20 that the patches had to make.",
      "Timeline: mockups sent January 8, approved in writing January 9, shipped January 14 — five days after approval.",
      "Delivery: signed for on January 19 at 10:13 AM, one day before the event and ten days after approval, door to door from the production facility.",
      "Outcome: Karbach came back for a second patch order in August 2026.",
    ],

    sections: [
      {
        heading: "Six designs, two materials, one fixed date",
        body:
          "When Karbach Brewing's brand team reached out in early January, they had six patch designs, a quantity of 1,200 — a mix of woven and laser-engraved genuine leather between 2.25 and 3.5 inches — and one hard constraint: an event in Los Angeles on January 20 that the patches had to make.\n\nThis was a rush order from the first message. The deadline was not negotiable, and the order mixed two materials that behave differently in production and in application.",
        image: {
          src: "/assets/case-studies/karbach-design-brewing-co.webp",
          contain: true,
          alt: "Woven Karbach Brewing Co. patch in a half-round shape, navy border and lettering on a white ground, with a gold delivery truck hauling a beer bottle and Est. Houston, Texas 2011 below",
          caption:
            "A second woven design from the same run. Six designs at 200 pieces each meant guests could pick the one they wanted rather than all getting the same patch.",
        },
      },
      {
        heading: "January 8–9: mockups approved",
        body:
          "Every design was mocked up and approved in writing within a day. Emily Rodgers, Karbach's Sr. Brand Manager, came back with three words that start the production clock: \"These are approved.\"",
      },
      {
        heading: "January 14: shipped, five days after approval",
        body:
          "Five days after approval, all 1,200 patches were finished, quality-checked and handed to the carrier — six designs across two different materials, each counted separately.\n\nThe same-day reaction from Karbach: \"Amazing! They look soooo GOOD! Thank you so much for knocking these out!\"",
      },
      {
        heading: "January 19, 10:13 AM: delivered and signed for",
        body:
          "The shipment was delivered in Los Angeles and signed for on the morning of January 19 — one day before the event, ten days after mockup approval, door to door from our facility. Carrier delivery record on file.",
      },
      {
        heading: "The honest footnote: leather behaves differently under an iron",
        body:
          "Karbach's team found that some leather patches stuck or scorched when the iron was applied straight to the leather face. We sent the fix the same day — a pressing cloth between the iron and the patch — and the rest applied cleanly.\n\nThe settings were never the problem. Leather carries the same heat-seal adhesive as our embroidered patches and takes the same 350°F press, the same 25 to 30 seconds. What leather will not take is bare contact with a hot iron. On woven and embroidered patches the pressing cloth is good practice; on leather it is the difference between a clean application and a marked patch.\n\nWe would rather tell you that here than pretend every material behaves identically. This order is why our iron-on guide now spells the leather rule out instead of leaving the pressing cloth as an optional nicety.",
        image: {
          src: "/assets/case-studies/karbach-design-leather-roundel.webp",
          contain: true,
          alt: "Round laser-engraved genuine leather Karbach Brewing patch in tan leather with a stitched edge, the Karbach Brewing wordmark around the rim and a K with a star at the centre",
          caption:
            "The leather design from the same order. Leather takes the same iron-on backing as the woven patches but not the same iron — this is the patch behind the footnote above.",
        },
        link: {
          href: "/custom-iron-on-patches",
          label: "Read the iron-on application guide, including the leather exception",
        },
      },
      {
        heading: "Two weeks later, and then again in August",
        body:
          "At the end of January: \"The patches went over really well and the quality was great… Amazing job and we'll definitely order from you again!\"\n\nWhat the patches were actually for: guests at the event used them to customize their own hats, which is why six designs at 200 each mattered more than one design at 1,200 — everyone got a choice.\n\nIn August 2026 they came back for their next patch order, and left a five-star review. The return is the part of a case study you cannot write on the day you ship.",
      },
    ],

    faqs: [
      {
        question: "Can Panda Patches produce mixed woven and leather patch orders?",
        answer:
          "Yes. This Karbach Brewing order was 1,200 patches across 6 designs at 200 each, mixing woven and laser-engraved genuine leather between 2.25 and 3.5 inches, all with iron-on backing. Mixed-material orders are produced and counted per design so they arrive ready to distribute.",
      },
      {
        question: "How fast can Panda Patches turn around a rush patch order?",
        answer:
          "This order shipped five days after mockup approval and was signed for ten days after approval, door to door from the production facility to Los Angeles — one day ahead of the client's event. Turnaround depends on quantity, design count and materials, and your exact in-hand date is confirmed by email within 2 to 6 hours of ordering, before any rush fee is charged.",
      },
      {
        question: "Do leather iron-on patches apply the same way as woven ones?",
        answer:
          "Same settings, one non-negotiable extra step. Leather patches carry the same heat-seal adhesive as embroidered ones, so they press at the same 350°F (175°C) for the same 25 to 30 seconds — do not press them cooler or shorter. The difference is that the pressing cloth stops being optional: a hot iron placed directly on a leather face can stick to it or scorch it. Keep a thin cotton cloth between the iron and the patch every time.",
      },
    ],

    // CASE-S_3 promoted the closing quote from the Jan 29 private email to
    // Emily's public Trustpilot review (Aug 13, 2026, 5 stars, "Unprompted",
    // experience date Jan 12 2026). A public, linkable review is stronger proof
    // than an email only we can see. The email quote is not lost — it still
    // opens the "Two weeks later" section above.
    quote: {
      text:
        "Lance was great to work with and helped us out with a project that needed to be turned around quickly. He stayed on top of order and communicated well throughout the entire process. The patches ordered turned out great and our guests were excited to create their hats with the designs.",
      author: "Emily Rodgers",
      role: "Sr. Brand Manager, Karbach Brewing — verified Trustpilot review, August 2026",
      sourceUrl: "https://www.trustpilot.com/review/pandapatches.com",
      sourceLabel: "Read the review on Trustpilot",
    },

    tags: ["Brand Event", "Woven Patches", "Leather Patches", "Rush Order", "Repeat Client"],
  },
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
