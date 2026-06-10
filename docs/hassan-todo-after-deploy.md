# Hassan to-do after the next deploy

Items below need Sanity Studio access. None of these block the deploy.

---

## 1. Create the `/custom-scout-patches` Sanity page (WEBSIT_1.MD T22)

The code is already wired: `src/lib/patchStyleMeta.ts` has the metadata and `src/lib/patchStyleProductSchema.ts` has the product schema. The route renders the moment a Sanity `patchStyle` document with slug `custom-scout-patches` exists.

### Steps in Sanity Studio

1. Open `https://www.pandapatches.com/studio`
2. Click **Patch Style Pages (SEO)** in the left sidebar
3. Click **Create new patchStyle**
4. Fill the fields:

**Title:** `Custom Scout Patches`

**URL Slug:** `custom-scout-patches`

**Hero Short Description:**
```
Custom scout patches built to the BSA Insignia Guide standard. Patrol patches, troop numerals, council strips, segment patches, custom merit badges, and Eagle court of honor presentation patches. Standard sizes for sleeves, sashes, and red vest jacket placement. Iron-on or sew-on backing. 5-piece minimum, 12-24 hour mockup, free worldwide shipping.
```

**Hero Gallery Images:** upload 3 to 5 real scout patch photos (patrol patch, troop numeral, Eagle ceremony patch, OA flap, segment patch).

**SEO Heading 1:** `Custom Scout Patches Built to BSA Insignia Guide Placement`

**SEO Text 1 (Top):** paste these three paragraphs:

> Scout uniforms follow strict placement rules. The Boy Scouts of America Insignia Guide locks down where every patch lives: troop numerals on the right shoulder, council strip above them, patrol patch on the right sleeve below the shoulder seam, world crest centered above the left pocket, position patch on the left sleeve. Custom scout patches that do not match those dimensions look wrong on the uniform even when the design is perfect. We build to those dimensions by default.
>
> Standard sleeve patches run 2.5 inches at the widest point for round and 3 inches by 1.5 inches for rectangular. Patrol patches are 2-inch round. Troop numerals come as individual digits roughly 0.75 inch tall on a 1-inch background, or as a single combined strip. Council strips are 3 inches by 0.5 inch arc. Sashes and red vest segments are typically 2-inch round or 2.5-inch oval. We hold those sizes on every order unless you ask for something custom.
>
> BSA color guidelines matter too. Sleeve patches use a tan or olive background to match the field uniform; class B and activity patches can use any background. We match Pantone codes for council colors, lodge colors, and unit colors so the new patch sits next to the existing patches on the uniform without a visible color shift.

**Work Sample Gallery:** upload 4 to 6 work samples (different scout patches you have produced).

**SEO Heading 2:** `Patrol, Troop, Council, Merit, Segment, and Court of Honor Patches`

**SEO Text 2 (Bottom):** paste these five paragraphs:

> Patrol patches are the most ordered scout item. A patrol patch carries the patrol identity for the year and is sewn on the right sleeve. We produce custom patrol designs at the 2-inch round standard with a merrowed border so the patch sits cleanly without curling at the edge after the first wash. Merrowed edges are the BSA preference.
>
> Troop numerals and council strips run on the same uniform. Numerals come as individual digit patches or as a single fused strip; the fused strip aligns better and stays straighter on the shoulder than three separate patches. Council strips are arc shaped to follow the shoulder curve. We make both, and we will ship the troop numeral set as a single piece by default unless you request individual digits.
>
> Eagle Scout courts of honor and Order of the Arrow ordeals are the high stakes patch jobs. Presentation patches for an Eagle ceremony are usually 3 to 4 inches, embroidered on tan twill with a metallic gold border, and produced as a small one time run of 10 to 50 pieces. OA lodge flaps follow the standard pocket flap shape with the lodge totem and number. We make both. Lead time for a court of honor is 7 to 14 business days from approved mockup, with rush available when the ceremony date is tight.
>
> Segment patches for camporees, summer camp, and high adventure trips fit around a centerpiece patch (often a generic round) and stack on a sash or vest as a visible record of the scout's career. Segments are 2 inches round or 1.5 by 2 inch crescents. Customers usually order 100 to 500 for a single event.
>
> Cub Scouts, Webelos, Venturing Crew, Sea Scouts, and Girl Scouts all use the same custom patch workflow. Cubs use a blue field with a yellow border, Webelos add the Webelos colors, Venturing uses green, Sea Scouts wear white. We match the program colors and the placement guide for each program. Girl Scouts of the USA has its own insignia guide with troop and council patches in a similar layout; we follow GSUSA placement when the customer specifies a Girl Scout order.

5. Click **Publish**.

### After publishing

Verify the page renders:
```
curl -I https://www.pandapatches.com/custom-scout-patches
# Expect HTTP 200
```

The page will inherit the Product schema with $0.85 to $6.80 price range and the metadata title/description from the code-side wiring.

---

## 2. Add answer-first summary + scout-page link to two guide posts (WEBSIT_1.MD T25)

These are the two guide pages identified as ~30K monthly impressions with high AI Overview citation likelihood. Adding a 40 to 60 word lead summary at the top + linking to the new commercial page (`/custom-scout-patches`) converts the guide traffic into commercial intent.

### 2A. `/boy-scout-patch-placements-a-complete-guide`

Open the doc `Boy Scout Uniform Badge & Patch Placement Guide (BSA 2026)` in Studio and insert this as the FIRST block of the body (above the existing intro):

> **Quick answer:** Boy Scout patches follow the BSA Insignia Guide. Troop numerals sit on the right shoulder with the council strip above. Patrol patches go on the right sleeve below the shoulder seam. Merit badges live on the merit badge sash. World crest is centered over the left pocket. Position patch on the left sleeve below the shoulder. Need custom patrol, troop, or Eagle ceremony patches? [Order custom scout patches from 5 pieces with mockup in 12 to 24 hours.](/custom-scout-patches)

Then add this CTA block roughly two-thirds of the way down the post (right before the Merit Badge section or wherever feels natural):

> ---
>
> ### Need custom patches for your troop?
>
> Patrol patches, troop numerals, OA flaps, and Eagle court of honor presentation patches are all available from a 5-piece minimum with a 12 to 24 hour mockup. Free worldwide shipping, money-back guarantee, no setup fees. **[Get a custom scout patch quote.](/custom-scout-patches)**
>
> ---

### 2B. `/tactical-and-military-ocp-patch-placement-options`

Open the doc `Tactical and Military OCP Patch Placement Options` and insert this as the FIRST body block:

> **Quick answer:** OCP uniform patch placement follows AR 670-1 and AFI 36-2903. US flag goes on the right shoulder (reverse-facing so the stars face forward in motion). Unit patch (combat patch) goes on the right shoulder below the flag. Rank insignia goes on the chest. Name and branch tapes are sewn above the right and left pockets. Morale patches go on the left shoulder velcro panel. Need custom morale or unit patches? [Order custom tactical patches from 5 pieces with Velcro backing and IR-reflective thread options.](/custom-tactical-patches)

Then add this CTA block roughly two-thirds of the way down:

> ---
>
> ### Need custom tactical or morale patches?
>
> Velcro-backed PVC or embroidered, IR-reflective thread, subdued colorways for OCP, and a 5-piece minimum. Mockup in 12 to 24 hours, free worldwide shipping, money-back guarantee. **[Get a custom tactical patch quote.](/custom-tactical-patches)** or **[Get a custom morale patch quote.](/custom-morale-patches)**
>
> ---

### Why this matters

The brief flagged these as zero-click AI Overview citation queries. Pages cited in AI Overviews see ~35% click lift on the rare clicks they do get, and a clear answer-first paragraph plus an internal commercial link turns the citation into a path to revenue.

---

## 3. Verify Vercel deploy picked up the new REVALIDATE_TOKEN

After the deploy completes:

1. Open the Sanity Studio webhook dashboard at `https://www.sanity.io/manage` (you set this up earlier)
2. Open the Vercel Revalidation webhook
3. Make a tiny edit to any blog post (change one character, publish, change it back, publish)
4. Wait ~10 seconds
5. Open Vercel Dashboard for panda-patches-ecommerce, go to Logs, filter for `/api/revalidate`
6. Expect HTTP 200 from each edit. If you see 401, the bearer token in the webhook does not match the env var. If you see 500, the env var is not set.
