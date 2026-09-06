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
 * WHAT IS DELIBERATELY NOT HERE: competitor fee figures. "Most competitors
 * charge $40 to $80 for setup" is live on /ai-info/pricing today with no
 * substantiation row behind it, which is the exact discipline this register
 * was set up to enforce. A claim about what WE do not charge needs no
 * competitor to be true. Keep them separate.
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

/** Pages that carry the expanded version, for cross-linking. */
export const CONSTRAINT_HUBS = {
  minimum: "/custom-patches-no-minimum-order",
  fees: "/custom-patches-no-setup-fees",
  shipping: "/free-worldwide-shipping-duty-paid",
} as const;
