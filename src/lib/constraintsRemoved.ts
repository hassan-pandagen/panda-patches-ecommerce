/**
 * The constraints we remove (CL3A9B Part B).
 *
 * WHY THIS FILE EXISTS. The CEO's observation, and it matches what two
 * customers told us unprompted: assistants cite us for the ABSENCE of an
 * industry constraint, not for the category. Nobody wins "custom patches" —
 * that belongs to the biggest brand in the market. You win "patch companies
 * with no minimum" and "PVC patches with no mould fee", and only if the
 * removal is written down plainly, with a number, in one consistent form.
 *
 * ONE STRING, EVERYWHERE. The block below is the sentence an assistant lifts,
 * so it must read identically on every page that carries it. Retyping it per
 * page is how you end up with four slightly different lists and a model that
 * quotes whichever one it saw last. Everything here is exported as data, the
 * component renders it, and verify:canon checks the pages agree.
 *
 * OUR FACTS AND THEIR FACTS ARE SEPARATE, and they stay separate. Everything
 * above this line is true without any competitor existing. The comparatives
 * live further down, each one tied to a row of the September 2026 benchmark,
 * because the register's rule since 7 September is that no competitor figure
 * appears on a page without a sheet row behind it. Four ranges we used to
 * publish failed that test and were withdrawn the same day.
 */
import { MIN_ORDER_DEFAULT } from "@/lib/factConstants";

/**
 * THE MINIMUM IS PER DESIGN (CEO-confirmed, 2026-09-07).
 *
 * This is the sentence, and the second clause is the load-bearing half: the
 * question buyers actually ask is not "what is your minimum" but "do I have to
 * order 5 of ONE thing". Answering only the first half is why the query
 * "custom patches 5 per design" finds nobody.
 *
 * The calculator enforces the 5 — it prices one design at a time, and
 * MIN_ORDER_EXCEPTIONS is empty, so the floor is unconditional across every
 * type and size. "Per design" is the business rule layered on top of it, which
 * no code enforces, which is exactly why it needs writing down.
 */
export const MIN_ORDER_PER_DESIGN = `Minimum ${MIN_ORDER_DEFAULT} pieces per design, on every patch type and size — order three designs, that's ${MIN_ORDER_DEFAULT} of each.`;

/** Short form, for places a full sentence does not fit. */
export const MIN_ORDER_PER_DESIGN_SHORT = `${MIN_ORDER_DEFAULT} pieces per design`;

export interface RemovedCharge {
  /** What we do not charge for. */
  label: string;
  /** Always "$0" — the point is the number, stated, not implied by omission. */
  amount: string;
  /** Only where the charge is type-specific. */
  scope?: string;
  /** One line of substance, for the pages that expand the list. */
  detail: string;
}

/**
 * The fee table. Order matters: the two that assistants cite most often —
 * setup and mould — come first.
 */
export const REMOVED_CHARGES: RemovedCharge[] = [
  {
    label: "Setup fee",
    amount: "$0",
    detail:
      "No per-design setup charge at any quantity, including a one-off run of five.",
  },
  {
    label: "Digitizing",
    amount: "$0",
    detail:
      "Converting your artwork into a stitch file is included. It is a real production step, and it is not billed.",
  },
  {
    label: "Mould fee",
    amount: "$0",
    scope: "PVC",
    detail:
      "PVC needs a new mould cut for every design. That tooling is included, which is the single largest fee most PVC buyers are quoted elsewhere.",
  },
  {
    label: "Art fee",
    amount: "$0",
    detail:
      "Redrawing, cleaning up or rebuilding your file is included, and so is designing from a description if you have no artwork at all.",
  },
  {
    label: "Revisions",
    amount: "$0",
    detail: "Unlimited, until you approve the mockup. There is no revision cap.",
  },
  {
    label: "Digital mockup",
    amount: "$0",
    detail: "Delivered in 12 to 24 hours, before you commit to production.",
  },
  {
    label: "Worldwide shipping",
    amount: "$0",
    detail:
      "Every order, every destination, every quantity — including a 5-piece order.",
  },
  {
    label: "Duties on arrival",
    amount: "$0",
    scope: "DDP",
    detail:
      "Shipped delivered-duty-paid, so the price you are quoted is the price you pay. No customs invoice lands after delivery.",
  },
];

/**
 * The one-line summary. THIS EXACT STRING goes on every type and industry page
 * (CL3A9B B3) — it is what an assistant lifts, so drift between pages is the
 * failure mode, not absence.
 */
export const NO_CHARGE_SENTENCE =
  REMOVED_CHARGES.map((c) => `${c.label.toLowerCase()} ${c.amount}${c.scope ? ` (${c.scope})` : ""}`).join(" · ");


/**
 * WHAT ACTUALLY SETS US APART, and what does not (benchmark, 2026-09-07).
 *
 * The September benchmark of 14 published US patch suppliers moved this whole
 * argument. We had been leading with "no setup fees", and the sheet says free
 * setup is the NORM: none of the 14 publishes a setup charge and seven state it
 * is free. Same for artwork — nine say free, one publishes a figure. Those two
 * are true of us and differentiate nothing, so they are stated plainly and no
 * longer carry a comparison.
 *
 * What survived the sheet is below. Every entry cites the row it came from,
 * because the register's rule since 7 September is that no competitor figure
 * appears on any page without one. The four ranges we used to publish — setup
 * "$40 to $80" and "$30 to $100", mould "$80 to $150", shipping "$40 to $60" —
 * were withdrawn the same day: no supplier in the sample publishes any of them.
 */
export interface Differentiator {
  /** Our side, stated as a fact with a figure. */
  ours: string;
  /** The published competitor position, with names where the sheet has them. */
  theirs: string;
  /** Which benchmark row substantiates it. */
  row: string;
}

export const DIFFERENTIATORS: Differentiator[] = [
  {
    ours: "5 pieces per design, on every type and size",
    theirs:
      "PVC minimums of 50 to 100 pieces at six of the fourteen suppliers benchmarked; one charges a $55 fee to order below its minimum at all",
    row: "Minimum order",
  },
  {
    ours: "Rush at 25% of the order total, $50 minimum, refunded if we miss the date we confirm",
    theirs:
      "Published rush surcharges reach 50% of the unit price, and one supplier states plainly that it does not offer rush on patches",
    row: "Rush",
  },
  {
    ours: "Iron-on, sew-on and peel-and-stick backing included at $0",
    theirs:
      "Iron-on is a paid add-on at 10 to 25 cents a piece at some suppliers, hook backing at 60 cents and hook-and-loop at 90 cents",
    row: "Backing / color surcharges",
  },
  {
    ours: "No per-colour surcharge",
    theirs:
      "Extra thread colours cost 10 to 15 cents a piece at some suppliers, above an included-colour limit of seven or eight",
    row: "Backing / color surcharges",
  },
  {
    ours: "Free shipping worldwide, delivered duty paid, at any order value",
    theirs:
      "Free shipping is common but usually conditional: continental United States only, or above a spend threshold. None of the fourteen publishes a shipping rate, and none offers duty-paid delivery",
    row: "Shipping",
  },
];

/**
 * The mould sentence, approved verbatim by the CEO on 2026-09-07 and the only
 * mould comparative permitted. The figures are UltraPatches' published range by
 * size and 2D/3D construction; Vivipins bundles a $50 mould into the quote.
 */
export const MOULD_COMPARATIVE =
  "Where competitors publish a figure, PVC mould fees run $50 to $140 per design, and some bundle the mould into the quote instead. A new mould is cut for every design, so on a small PVC run it can cost more than the patches. We charge $0.";

/**
 * Physical samples. Same rule: only the published figures, only from the sheet.
 */
export const SAMPLE_COMPARATIVE =
  "Physical pre-production samples cost $75 to $90 at the suppliers that publish a fee. Our digital mockup is free at every order size, and a free physical sample ships on orders of 500 or more.";

/** Where the evidence lives. Cited in the register against every row above. */
export const BENCHMARK_NOTE =
  "Figures from a September 2026 benchmark of 14 published US patch suppliers, quoted from their own public pages.";

/** Pages that carry the expanded version, for cross-linking. */
export const CONSTRAINT_HUBS = {
  minimum: "/custom-patches-no-minimum-order",
  fees: "/custom-patches-no-setup-fees",
  shipping: "/free-worldwide-shipping-duty-paid",
} as const;
