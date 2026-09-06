/**
 * "See it made" — the primary placement for the factory tour (CEO, 2026-09-06).
 *
 * THE TEXT UNDER THE VIDEO IS THE POINT, not a caption. A video is opaque to
 * every system that reads this page: Google indexes the words, an assistant
 * quotes the words, and a buyer comparing three suppliers at 11pm skims the
 * words. So everything the footage proves is written out as plain sentences —
 * whose facility it is, which processes run in it, and why a stock room matters
 * to someone deciding where to order. Anyone who watches gets the same facts
 * twice; anyone who does not still gets them once.
 *
 * This is also what lets the page carry VideoObject honestly. Google's bar for
 * video structured data is that the video is the main content of the page or
 * section, and a lone embed dropped beside unrelated copy does not clear it —
 * which is exactly how 30 "Video isn't on a watch page" warnings arrived in
 * August. A heading, a large player and a written account of what it shows do.
 */
import FactoryVideo from "@/components/media/FactoryVideo";

export default function SeeItMadeSection() {
  return (
    <section id="see-it-made" className="w-full py-12 md:py-16 bg-[#F9FAF5] scroll-mt-24">
      <div className="container mx-auto px-6 max-w-[62.5rem]">
        <p className="text-[0.6875rem] md:text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-3">
          Our factory
        </p>
        <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark leading-tight mb-6">
          See it made
        </h2>

        <div className="grid gap-7 md:grid-cols-[22rem_1fr] md:gap-9 items-start">
          <FactoryVideo maxWidth="22rem" className="mx-auto md:mx-0 w-full" />

          <div className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8]">
            <p className="mb-4">
              This is our own facility in Pakistan, operated by Panda Apparel &amp; Technology. It
              is not a broker&rsquo;s showroom or a partner floor we book time on, which is the
              reason we can publish production limits and hold to them.
            </p>
            <p className="mb-4">
              The tour runs through the four processes behind most of what we ship: computerized
              embroidery machines stitching thread onto twill, digitally controlled chenille
              machines laying the looped yarn that gives varsity letters their pile, PVC molding
              for the soft rubber patches, and a laser engraving genuine leather.
            </p>
            <p className="mb-0">
              It ends in the stock room, where finished orders wait to ship. That room is the
              answer to the question buyers actually ask, which is when work starts: production
              begins once you approve your digital mockup, not when you pay, and nothing is made
              before you have signed the design off.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
