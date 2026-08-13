# Panda Patches — Trustpilot Review Log

**Canonical, deduplicated record of every Trustpilot review.** Single source of truth for:
- `src/lib/reviewConstants.ts` — the sitewide Organization aggregateRating (rating + count).
- `src/lib/productReviews.ts` — the per-product reviews shown on product pages + their Product.aggregateRating.

## Live stats (verify against https://www.trustpilot.com/review/pandapatches.com)

| | Value |
|---|---|
| TrustScore | **4.8** |
| Total reviews | **83** |
| 5★ | ⚠ re-read from live profile |
| 4★ | ⚠ re-read from live profile |
| 3★ | ⚠ re-read from live profile |
| 2★ | ⚠ re-read from live profile |
| 1★ | ⚠ re-read from live profile |
| Last synced | 2026-08-13 |

> **TrustScore and total are verified** against the live profile on 2026-08-13
> (screenshot). The **star split is not** — it was read off a bar chart and the
> exact per-band counts were not legible, so it is marked for re-read rather
> than estimated. Do not publish a star breakdown until someone reads the real
> numbers off the profile.
>
> **Known ±1 discrepancy, deliberately not reconciled.** The previous sync
> recorded 75 total on 2026-07-12. Nine new reviews are logged below, which
> would give 84, but Trustpilot displays 83. Most likely one review was removed
> or the earlier 75 was slightly off. The authoritative figure is what
> Trustpilot shows — **83** — so that is what the site publishes. The gap is
> recorded here rather than papered over by dropping an entry to make the
> arithmetic tidy.

> ⚠ **Count reconciliation open (2026-08-14).** Two reviews were added to the
> log below — Kelly Paschall (Aug 9) and Emily Rodgers (Aug 13) — that were not
> in the Aug 13 sync. The **83** above was verified against the live profile on
> Aug 13, and Emily's review is dated Aug 13, so it is unknown whether 83
> already includes either of them. Per the CASE-S_3 instruction, the count has
> **not** been hand-bumped: re-read TrustScore and total off the live profile
> and update both together. Adding reviews to this log does not, by itself,
> license changing the published count.

## How to add a new review

1. Add a row below in the correct date order (newest first), with: ISO date · name · country · rating · product tag(s) · verbatim body.
2. If the review names a product type or use-case (PVC, chenille, leather, MC, fire dept, cheer, martial arts, labels, hats, event…), tag it so `productReviews.ts` can surface it on the right product page. Otherwise tag `general`.
3. Bump **Total reviews** + **Last synced** above; recompute the star split and update **TrustScore** to match the live Trustpilot number (it is a weighted score, not a plain average — copy what Trustpilot shows).
4. If it's a 5★/4★ with good product relevance, also add it to the `REVIEWS` array in `src/lib/productReviews.ts` (keep that a curated working subset — it does not need all 75).
5. Do NOT edit review text. These are real customer words; paraphrasing them breaks the "genuine, visible review" requirement for the schema.

> Tags are relevance hints only. `general` = a real patch-order review with no specific product type, usable as fill on any patch product page. Product-specific tags surface first on their matching page.

---

## Reviews (newest first)

### 2026-08-13 · Emily Rodgers (US) · ★★★★★ · [event, hats, leather, woven, rush, repeat]
**Exactly what we wanted!** — Lance was great to work with and helped us out with a project that needed to be turned around quickly. He stayed on top of order and communicated well throughout the entire process. The patches ordered turned out great and our guests were excited to create their hats with the designs.

> Labeled "Unprompted" by Trustpilot; experience date 2026-01-12. This is the
> closing quote on /case-studies/karbach-brewing-patches (named and approved —
> Emily Rodgers, Aug 13, 2026). Source: CASE-S_3 brief, quoted verbatim.

### 2026-08-11 · David Puerto (US) · ★★★★★ · [general]
**Excellent quality** — Excellent quality. Great communication. They delivered exactly what I wanted. I will use them again.

### 2026-08-09 · Kelly Paschall (US) · ★★★★★ · [event, woven, rush] · ⚠ ABRIDGED
**Working with Lance and Panda Patches was a great experience** — Working with Lance and Panda Patches was a great experience… quality patches against a tight timeline… kept me in the loop from end to end… turned out great for the event!

> ⚠ **This body is abridged, not verbatim.** It was transcribed into the
> CASE-S_1 brief with ellipses, and the full text has not been read off the live
> profile. Rule 5 forbids editing review text, so this is logged as-is and
> flagged — replace it with the verbatim body on the next profile read before
> it is used anywhere beyond the case study. Labeled "Unprompted" by Trustpilot.
> Closing quote on /case-studies/nashville-event-patches-2026.

### 2026-08-06 · Alden (US) · ★★★★★ · [general]
**Great Service** — Excellent and timely service. Lance and the team responded the same day with my quote and mock-up. I would use again.

### 2026-08-04 · Matt Osborn (US) · ★★★★★ · [general, revisions]
**The requirements for my patch were very…** — The requirements for my patch were very specific, and had to match a very recognizable precedent, so I was extremely focused on the result. The team at Panda were super responsive to my revision requests and ultimately delivered EXACTLY what I needed.

### 2026-08-02 · Chris In-Line Johnson (US) · ★★★★★ · [general, repeat]
**Great business and communications** — Great business and communications. I have used their services several time and will continue using them.

### 2026-08-02 · Goodnews Babade (US) · ★★★★★ · [education, letters]
**Awesome Services!!** — We're a robotics team in Georgia that needed letters, but we didn't have a lot to work with budget-wise. Even though all this, Panda Patches was still willing to work with us. They were so helpful throughout the whole process. We will definitely be buying from them again!!

### 2026-07-31 · Cassidee Domstrich (US) · ★★★★★ · [general, remake]
**Panda patches goes above and beyond** — Panda patches goes above and beyond! The first set didn't have the colors just right, and instead of saying you're SOL... they redid them and worked with me extensively! Thank you! Such a huge impact on my brand!

### 2026-07-31 · Rob Kloss (US) · ★★★★★ · [general]
**I was initially skeptical at ordering…** — I was initially skeptical at ordering but glad I did. They exceeded expectations.

### 2026-07-28 · Dustin Gay (US) · ★★★★★ · [general]
**Fast and great quality and AWSOME…** — Fast and great quality and AWSOME customer service

### 2026-07-28 · James Williams (US) · ★★★★★ · [general, repeat]
**I have placed many orders with panda…** — I have placed many orders with panda and have had great success with them, even when I had problems with my design, they help bring it to life, great customer service and support, make process easy, will be given them more work, I go to them to help make my design come to life

### 2026-07-09 · Mark Pijanowski (IT) · ★★★★★ · [general]
**Great experience overall** — Great experience overall. And the company worked with me to adjust the template I submitted. Would recommend and use again in the future.

### 2026-07-07 · kimberly (US) · ★★★★★ · [general]
**Came faster than expected loved it** — Came faster then expected loved it. Great customer service. Kept me updated all the time.

### 2026-06-27 · Sander (US) · ★☆☆☆☆ · [negative, embroidered, event]
**Absolute garbage quality patches** — Absolute garbage quality patches. Ordered 100 patches for a retirement event, they did not show up in time and when they did a week later the quality was horrible and 2 of the words misspelled, some of the text not even legible. Threads coming off of the patch and they ignored requests to refund this due to missing the delivery date and quality. Made in China but they lead you to believe they are made in US.
_Business reply: apologized, stated they do not ship from China, asked for the order number and offered the money-back guarantee._

### 2026-06-17 · Daniel Pop (US) · ★★★★★ · [general]
**Excellent service and top-quality** — Excellent service and top-quality products! It started with a simple email inquiry and I was impressed by how promptly they replied. We had a short, smooth chat to finalize the details and the communication was flawless. The order arrived incredibly fast, and the quality of the patches is outstanding — they look absolutely amazing!

### 2026-06-16 · Tim Roberts (US) · ★★★★★ · [embroidered, sports, name]
**Great patches, even better customer service** — Ordered 100 embroidered patches for our youth wrestling club and couldn't be happier. The quality was exactly what we designed — clean stitching, colors came out great. When an unexpected customs fee came up on my end, Lance handled it immediately without any hassle. Will definitely be ordering again for our next season.

### 2026-06-16 · Erica Turner (US) · ★★★★★ · [embroidered, sports, velcro]
**On behalf of Harvest Preparatory School Cheer** — Huge thank you to Panda Patches and especially Lance for outstanding customer service throughout. When our patches arrived we were beyond impressed — the quality is amazing, and they adhered perfectly to our cheerleaders' backpacks. The finished product exceeded our expectations and looks absolutely fantastic.

### 2026-06-09 · Whitney (US) · ★★★★★ · [embroidered, fire, tactical, police]
**Lance was wonderful to work with** — Lance was wonderful to work with and very timely with his emails. Our fire department patches turned out better than expected!! Would totally recommend them.

### 2026-06-06 · Gary Maryland (US) · ★★★★★ · [general]
**Great work** — Great work, great customer service, I will be doing business again.

### 2026-05-30 · Eduardo Valerdi (US) · ★★★★★ · [general]
**Get ordering fellas** — Get ordering fellas... you know you want them just like I did 😊

### 2026-05-20 · Jason Casey (US) · ★★★★★ · [pvc, reseller]
**Ordered my first run of custom PVC patches** — Ordered my first run of custom PVC patches for a small business I'm launching. Design process was easy, they kept me updated during production, and the finished product looks exactly like the proof. PVC quality is solid — clean lines, good color, Velcro backing holds well. Turnaround and shipping were fast. Already planning my next set.

### 2026-05-14 · David Newbert (US) · ★★★★★ · [general]
**Great patches** — Very happy with my order! They were precise with my custom order, had great communication, and delivered faster than promised. Matthew was a huge help and quick with all modifications. The patches came in looking great and the quality was excellent. 100% will order again!

### 2026-04-30 · Mike (US) · ★★★★★ · [general]
**Correct and delivered timely** — Lance made sure my patches were exactly what I wanted. Communication was prompt, shipping was fast. They even included extra patches, which was a great bonus. Will definitely be ordering again.

### 2026-04-23 · N & J Cabinet Refacing (US) · ★★★★★ · [general]
**Great patches at a good price** — Great paches at a good price.

### 2026-04-14 · Adam Stranc (US) · ★★★★★ · [general]
**Ordering was easy** — Ordering was easy, production was fast, and the patches look amazing! Will be ordering again soon.

### 2026-03-20 · Eric Miner (US) · ★★★★★ · [embroidered, motorcycle]
**Excellent source for quality MC patches** — Panda Patches has been an excellent source for quality MC patches. They referenced an old family patch and made requested updates based on the AI images I provided. The final result is perfect with top quality at a very competitive price. They will have all of my future business.

### 2026-03-18 · David Pollard (US) · ★★★★★ · [general]
**Awesome work!** — Great communication. Awesome looking patches!

### 2026-03-16 · Bennie Pearson (US) · ★★★★★ · [general]
**Awesome** — Great work. Awesome, very satisfied. Wonderful customer service. I will order again.

### 2026-03-14 · Alexander Nicolaidis (CA) · ★★★★★ · [woven]
**Excellent Source!** — Panda Patches has been an excellent source for quality patches, prints and emblems. All logos sent are thoroughly checked, colors are matched, and during the review process any issues are brought forward ahead of time so a perfect product can be produced. Highly recommend.

### 2026-03-13 · Kevin Grant (US) · ★★★★★ · [general]
**Highly recommended** — Top-tier communication, follow up, production, and speedy turnaround with pristine customer service!

### 2026-02-26 · Brandon Boone (US) · ★★★★★ · [general]
**Quality came out so good!** — Quality came out so good! Was not expecting them as fast as I got them. Very happy with the overall result!

### 2026-02-21 · Billy Bob Jackson (US) · ★★★★★ · [brand]
**They're legit!!** — They're legit!! I saw the reviews and asked ChatGPT before ordering. My patches arrived on time and a few were messed up. I sent 1 email with pictures and they mailed me more than I said were unusable. I'll be back for more! Good quality!

### 2026-02-17 · Demetrius Jamison (US) · ★★★★★ · [general]
**Great work matched a price** — Great work, matched a price and produced great quality with fast return.

### 2026-02-16 · Selena Perry (US) · ★★★★★ · [general]
**Excellent experience ordering** — The quality is outstanding — durable, vibrant, and exactly what I envisioned. From my first message the team was friendly, responsive, and helpful. They even gave great advice on choosing the best background colors to make my design stand out, and checked in after delivery. Highly recommend.

### 2026-01-02 · Mid-America Hap Ki Do (US) · ★★★★★ · [martial-arts, embroidered]
**High quality patches!** — The patches I received were high quality and exactly what I asked for. I will definitely be ordering from this company again.

### 2026-01-01 · Blackbox (US) · ★★★★★ · [general]
**First time ordering and I was amazed** — First time ordering and I was amazed with the final result. Fast shipping too. Will be ordering a new design again. Amazing job.

### 2025-12-30 · Vrinda Holmes (US) · ★★★★★ · [general]
**Quick turnaround and great work!!!** — Quick turnaround and great work!!!

### 2025-12-16 · Deb (US) · ★★★★★ · [digitizing]
**Best digitizer** — Hands down, the best digitizing I've received! My design was very intricate so it was a few dollars more, but they did a fabulous job bringing out all the details! They will be my go-to from now on. Highly recommend!

### 2025-11-30 · Kimberly Tabron (US) · ★★★★★ · [general]
**Simple to do business with** — Panda Patches makes it simple to do business with them. Great customer service and prompt with response.

### 2025-11-20 · Wesley Bush (US) · ★★★★☆ · [general]
**Great as advertised** — Patches turned out to be great as advertised and the turnaround time was just as good 👍

### 2025-11-15 · Mike Lowery (US) · ★★★★★ · [general]
**Found them on Instagram** — I found Panda Patches on Instagram. They were extremely professional and sent mockups of my design before production. I ABSOLUTELY LOVE THEM! The process was super fast. Highly recommend.

### 2025-10-28 · Robert Fisher (US) · ★★★★★ · [general]
**My experience was Exquisite** — My experience was Exquisite! I felt like family, not just a customer. I will most definitely be doing more business.

### 2025-10-24 · Star (US) · ★★★★★ · [general]
**Absolutely love my patches!!** — ABSOLUTELY LOVE MY PATCHES! I definitely recommend this company! ❤️

### 2025-10-21 · Ah (US) · ★★★★★ · [general]
**Timely manner** — Was hesitant to order, but my mind was put at ease. I submitted one idea, then changed mid-way to a different approach; we came to an agreement on another look and I was happy I did. Received my patches within 2 weeks, quicker than expected. They look great and I'll order again.

### 2025-10-15 · Tony Price (US) · ★★★★★ · [reseller]
**Satisfied first-time customer** — Hesitant ordering through my inbox, but Lance and the staff walked me through the process. Got my order today and I'm already planning my reorder. The quality is amazing, so I'll have no problem marking up the prices of my hoodies for the winter!

### 2025-10-15 · Cecily Tetterton (US) · ★★★★★ · [general]
**Absolutely amazing** — Absolutely amazing. I will definitely be doing business with this company. All my questions answered. Very understanding and helpful. Recommend to anyone looking for outstanding quality work.

### 2025-10-07 · Pamela Santos (US) · ★★★★★ · [label, woven]
**Great label experience** — Dan was very helpful perfecting my logo and quickly responded with a label for review! In record time my labels were complete with shipping notification. I can't wait to see them on my bags! Thank you Dan.

### 2025-09-26 · Gilberto Pamias (US) · ★★★★★ · [general]
**WOW!!!** — WOW! I am completely blown away by how amazing my patches look. Panda Patches is simply the best, hands down! Ready for my next order.

### 2025-09-16 · Nathan Steele (US) · ★★★★★ · [general]
**Understood the assignment** — Panda Patches understood the assignment and killed the delivery! Most appreciative of them and their team's work. Would definitely refer them to anyone.

### 2025-08-31 · Jennifer Matlock (US) · ★★★★★ · [general]
**Great patches and fast service** — Great patches and fast service. Received my patches with no issues, friendly service.

### 2025-08-19 · Vic (DE) · ★★★★★ · [general]
**Einfach nur WOW!!!** — (German) Excellent quality made exactly to my specs, great value, exemplary communication, and remarkably fast delivery despite a tight timeline. Speechless and very happy — Panda Patches would be my first choice again.

### 2025-07-31 · Johnnye Johnson (US) · ★★★★★ · [general]
**Top quality product** — The product is top quality. You can tell great attention is paid to the finished product. Received in a great time period. Will recommend to anyone.

### 2025-07-29 · karon liggins (US) · ★★★★★ · [general]
**Panda experience** — Panda is the best patch company I've ever had. Very passionate about meeting every customer need. Great quality work, fast shipping, and 24hr customer service always available. I recommend any company to use Panda for all your designs.

### 2025-07-25 · William Samuels (US) · ★★★★★ · [general]
**Amazing work!!** — Amazing work!!

### 2025-07-22 · NoGame Entertainment (US) · ★★★★★ · [general]
**Great quality, nice design** — Great quality, nice design, very satisfied. Thank you Panda Patches, heavily referred.

### 2025-07-12 · Edward Thornton (US) · ★★★★★ · [brand, embroidered]
**Felt at ease with Matt** — From the time I spoke with Matt at Panda Patches I felt at ease. He talked to me personally on the phone and through text. My package came exactly when they said it would, and the patches were everything I expected and more — excellent quality and precision to detail, as the patch is my own hand-drawn logo and they nailed it.

### 2025-07-10 · Javier Peña Ineditas (US) · ★★★★★ · [general]
**My Panda Patches experience** — I have nothing but great things to say about this company; they make the greatest patch work I've seen. They're trustworthy and have never once failed to message me back the same day or early the next. This is how every company should treat its customers.

### 2025-07-08 · Ezra Price (US) · ★★★★☆ · [general]
**The quality was very good** — The quality was very good. I will be shopping again.

### 2025-07-08 · KENNETH WITCHER (US) · ★★★★★ · [general]
**Great product** — The representative kept in contact with me through the whole process, which made it simple and easy.

### 2025-06-18 · Nakiesha Smith (US) · ★★★★★ · [general]
**True to size** — The patches are true to size and excellent quality! Thanks!

### 2025-06-12 · Eddie Green (US) · ★★★★★ · [general]
**Clear and detailed** — The quality of these patches is outstanding. Very clear and detailed to use on any garment. Glad I tried them out — now they're my go-to.

### 2025-04-02 · Christina Chaney (US) · ★★★★★ · [general]
**Amazing quality and customer service** — Amazing quality and customer service.

### 2025-01-30 · World Changer (US) · ★★★★★ · [general]
**Great experience** — Great experience, great communication, faster service.

### 2025-01-23 · Markees Brown (US) · ★☆☆☆☆ · [negative]
**Very bad customer service** — Very bad customer service.
_Business reply: noted they reserve the right to deny service when a customer is rude, and apologized that they didn't get to work together._

### 2025-01-16 · Consumer (US) · ★★★★★ · [reseller]
**Amazing experience, quick turnaround** — Amazing experience, quick turnaround time, and the work is always A1. Thank you Panda Patches — truly appreciate all the work you've done for my business so far.

### 2025-01-14 · Andrea (US) · ★★★★★ · [general]
**If I could give 10 stars I would** — Lance is absolutely the best representative. Extremely knowledgeable, excellent customer service, helped every step of the way. Patches are high quality, vibrant, excellent materials, affordable especially in bulk, and arrived to the east coast US in about a week. Highly recommend for all your patch needs.

### 2024-08-28 · Gianni Diaz (US) · ★★★★★ · [general]
**Exceptional communicator** — Lance was an exceptional communicator and made sure the work was done to perfection. Answered all my questions, very responsive with emails. Will recommend and get future jobs done with him.

### 2024-05-25 · ARD (US) · ★★★★★ · [embroidered, brand]
**Came out exactly as I drew it** — Great work — my patches came out exactly as the logo I drew up. Communication was simple and easy. Production and shipping were a fast turnaround. Will purchase again.

### 2024-05-16 · Sara Bynum (US) · ★★★★★ · [general]
**High quality** — High quality, super fast service, very friendly! Highly recommend!

### 2024-05-15 · Pedro (US) · ★★★★★ · [general]
**Best online purchase** — The best online purchase I have ever done. Thank you guys.

### 2024-05-09 · gabriel obadia (US) · ★★★★★ · [brand]
**A very serious company** — They are a very serious company, determined to serve according to the customer's taste under excellent guidance. Thank you for giving life to our logo with your ideas and products.

### 2024-04-20 · demographics (US) · ★★★★★ · [general]
**5 Stars** — A+. Quality patches. Communication also A+. Highly recommended.

### 2024-04-04 · Sam Jefferson (US) · ★★★★★ · [general]
**Customer service unmatched** — Lance has been very communicative and took the time to give me a good product. Their customer service is unmatched — I'll order again and again. If you're wondering where to get custom patches made, this is the place. An honest company that cares about their customers.

### 2024-03-11 · Hunter Ferreiro (US) · ★★★★★ · [general]
**Good patches** — Good patches.

### 2024-03-01 · cascalais (GB) · ★★★★★ · [general]
**Great stuff!** — Great quality patches, great quality service! Good delivery time too. Will definitely be doing business again. Big up Panda Patches!

### 2024-02-28 · Michelle (US) · ★★★★★ · [event]
**Quick + efficient when it was needed** — I needed a quick turnaround for a patch to commemorate a big project at work — everywhere quoted 1 month+ when I had a little over two weeks. Panda Patches accommodated and got them here quicker than I requested! Helpful, knowledgeable, with options presented by a real human. Will use them for our next patch.

### 2024-02-03 · Ronny Rønning (NO) · ★★★★★ · [general]
**Very satisfied** — I'm very satisfied with the quality and the support service. Direct human chat, quick shipping, and a perfect product.

### 2024-01-31 · Kg (US) · ★★★★★ · [general]
**Great work** — Great work, quality and efficient. Very professional and personable to work with! Can't wait for my next project.

### 2023-11-01 · Kim (US) · ★★★★★ · [brand]
**What an excellent experience!** — 10 days from order date to receiving my beautiful vibrant-colored patches. Fast turnaround, quality workmanship, and excellent customer service. Thanks Panda Patches for helping me build my brand!

### 2023-09-29 · Maddie Simpson (US) · ★★★★★ · [general]
**It was wonderful!** — It was wonderful!

### 2023-09-29 · Tomas Melendez (US) · ★★★★★ · [general]
**Great communication and quality** — Great communication and quality. Listened to everything I wanted and changed things with no problem. Didn't have to wait long. Will definitely use them again.

### 2023-09-29 · M J (US) · ★★★★★ · [general]
**I just love my patches!!** — I just love my patches! This company is amazing. They knew exactly how to get the job done. They are the best.

### 2023-08-15 · Ken Hoyne (US) · ★★★★★ · [general]
**Great communication** — Great communication and product was as expected.

### 2023-08-12 · Betsy Hartman (US) · ★★★★★ · [event]
**Awesome work** — Awesome work, great quality material, and production time was fast as well as shipping. Highly recommend. Will use them again for event products next year. — Betsy Hartman, Justin Rose Memorial Event Coordinator, Jonesborough TN

### 2023-08-11 · Me=.=oW (CA) · ★★★★★ · [general]
**Fabulous** — Friendly and professional. Understood my design for a custom item accurately! Response time was fantastic. Enjoyed the service. Highly recommend.

### 2023-08-10 · Paul Hart (CA) · ★★★★★ · [reseller]
**Great quality** — Great quality, communication and fast turnaround! We use Panda Patches for all our patches. From mock-up to finished product, every step is done with professionalism and accuracy. They offer a large variety of options and always entertain my unique requests. Highly recommend. Pricing is extremely competitive. Quality is the best I've seen.
