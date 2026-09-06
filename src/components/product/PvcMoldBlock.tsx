/**
 * "PVC patches with no mold fee" (CL3A9B B2.3).
 *
 * WHY PVC GETS ITS OWN BLOCK when the shared NoChargeBlock already lists mold
 * at $0: on every other type, free setup is unremarkable — the September 2026
 * benchmark found none of fourteen published US suppliers charging for it. The
 * mold is the exception. It is the one fee suppliers in this market do charge,
 * and it is the reason six of those fourteen set their PVC minimum at 50 or 100
 * pieces. A tooling charge and a high minimum are the same decision: spread the
 * mold across enough units that it stops being visible.
 *
 * No figure and no competitor named, by owner decision on 2026-09-07. The claim
 * is true if a single supplier charges a mold fee, so nothing here goes stale.
 *
 * So this block does the thing the generic list cannot. It explains why the
 * fee exists, what it does to a small order, and what removing it actually
 * buys — which is a five-piece PVC run being possible at all.
 *
 * The Q&A is rendered as visible copy AND fed to FAQPage schema by the caller,
 * because "do pvc patches have a mold fee" is a question people type.
 */
import Link from "next/link";
import { MOLD_COMPARATIVE, CONSTRAINT_HUBS } from "@/lib/constraintsRemoved";
import { MIN_ORDER_DEFAULT } from "@/lib/factConstants";

/** Exported so the page can mirror these into FAQPage JSON-LD. */
export const PVC_MOLD_FAQS = [
  {
    question: "Do PVC patches have a mold fee?",
    answer:
      "No. The mold is $0 at Panda Patches, at every quantity. Every PVC design needs its own mold cut before production, and billing that tooling back as a separate one-time charge per design is normal in this industry — some suppliers list it, others fold it into the quote. We do neither. It is not charged separately and it is not buried in the per-piece price.",
  },
  {
    question: "Why do other PVC suppliers have a 50 or 100-piece minimum?",
    answer:
      "Because of the mold. A tooling charge and a high minimum are the same decision viewed from two sides: cutting a mold costs a supplier real money, so they either bill it to you or set a minimum large enough to absorb it across the run. In a September 2026 benchmark of fourteen published US patch suppliers, six set their PVC minimum at 50 to 100 pieces. Including the mold is what lets our PVC minimum be 5 pieces per design like every other type.",
  },
  {
    question: "Do I pay for a new mold if I reorder the same PVC design?",
    answer:
      "No, and you did not pay for the first one either. The mold is kept on file so a reorder runs from the existing tooling, and because there was no charge to begin with there is nothing to avoid on the second order. Changing the artwork means a new mold, which is also $0.",
  },
];

export default function PvcMoldBlock() {
  return (
    <section
      id="pvc-mold-fee"
      className="w-full py-10 md:py-14 bg-white border-t border-gray-100 scroll-mt-24"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
        <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3">
          PVC patches with no mold fee
        </h2>
        <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
          {MOLD_COMPARATIVE}
        </p>
        <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-6">
          That is also why PVC minimums are usually so high elsewhere. For a supplier, a tooling
          charge and a high minimum are the same decision seen from two sides: cutting a mold costs
          real money, so you either bill it to the customer or set a floor big enough to bury it.
          Six of the fourteen suppliers we benchmarked set their PVC minimum at 50 to 100 pieces.
          Including the mold is what lets our PVC minimum be{" "}
          <Link href={CONSTRAINT_HUBS.minimum} className="text-panda-green font-semibold underline">
            {MIN_ORDER_DEFAULT} pieces per design
          </Link>
          , the same as every other type, and it is why a reorder costs nothing extra in tooling.
        </p>

        <div className="space-y-5">
          {PVC_MOLD_FAQS.map((f) => (
            <div key={f.question}>
              <h3 className="text-[1rem] md:text-[1.125rem] font-black text-panda-dark mb-1.5">
                {f.question}
              </h3>
              <p className="text-[0.9375rem] text-gray-700 leading-[1.75]">{f.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[0.8125rem] text-gray-500">
          Minimum-order figures come from a September 2026 benchmark of fourteen published US patch
          suppliers, quoted from their own public pages. More on{" "}
          <Link href={CONSTRAINT_HUBS.fees} className="text-panda-green underline">
            what we do not charge for
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
