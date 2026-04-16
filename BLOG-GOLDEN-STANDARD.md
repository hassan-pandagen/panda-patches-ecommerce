# PANDA PATCHES: BLOG GOLDEN STANDARD
## Every Blog Must Follow This. No Exceptions.
## Created: March 25, 2026

---

## QUICK REFERENCE CARD

| Element | Requirement |
|---------|------------|
| Word count | 1,800 - 2,500 words (commercial), 1,500 - 2,000 (informational) |
| Primary keyword | 1 per post. In H1, first 100 words, one H2, meta title, meta description |
| Secondary keywords | 3-5 variations used naturally in body |
| Semantic keywords | 8-15 related terms included once each |
| H2 sections | 5-8 per post |
| FAQ questions | 4-6 with FAQPage JSON-LD schema |
| Internal links | 5-8 (2-3 to product pages, 1-2 to related blogs, 1 to /offers) |
| External citations | 2-3 to authoritative sources |
| Images | 3-5 with descriptive alt text, WebP format |
| Tables | At least 1 comparison or pricing table |
| Meta title | Under 60 characters |
| Meta description | 150-160 characters with CTA |
| Published date | Set in Sanity on publish day |
| Author | Imran Raza with photo and bio |

---

## BLOG POST STRUCTURE (Follow This Exactly)

```
[Meta Title] - under 60 chars, primary keyword included
[Meta Description] - 150-160 chars, includes benefit + CTA

H1: [Primary Keyword + Benefit] (matches meta title)

[Key Takeaways Box - 3-4 bullet points summarizing the post]

[Intro paragraph - 80-120 words]
- Hook with a specific fact or number
- State what the reader will learn
- Include primary keyword in first 100 words
- First internal link within first 200 words

H2: [What/Why section - defines the topic]
- 150-250 words
- Include a "citation-ready" sentence (standalone fact an AI can quote)
- External citation to an authoritative source

H2: [Comparison or Options section]
- Include a TABLE (pricing, comparison, or specifications)
- Tables are the #1 most-cited content format by AI search engines
- Bold key figures and prices

H2: [How-to / Process section]
- Numbered steps or bullet list
- Specific to Panda Patches (our process, our pricing, our lead times)
- Include original photos of your actual products

H2: [Sizing / Pricing / Specifications section]
- Link to /offers with actual package pricing
- Use "stat sandwich" format: fact, number, context
  Example: "Embroidered patches for team orders of 100 pieces cost $2.40 per
  piece. This includes free shipping and a digital mockup within 24 hours."

H2: [Use Cases / Who Orders This section]
- Fire departments, police, sports teams, corporate, etc.
- Link to relevant landing pages (/custom-fire-department-patches, etc.)

H2: [How to Order from Panda Patches]
- 3-5 steps of your actual ordering process
- Emphasize: free mockup, unlimited revisions, approval before production
- CTA button or link to /offers or /contact

H2: Frequently Asked Questions
- 4-6 questions matching "People Also Ask" for this topic
- Each answer: 40-80 words, self-contained, citable
- Add FAQPage JSON-LD schema for these

[Final CTA section]
- "Ready to order? Get a free mockup in 24 hours."
- Link to /offers and /contact
- Phone number: (302) 250-4340

[Author bio card]
- Imran Raza photo
- Title: Founder, Panda Patches
- 2-3 sentence bio
```

---

## WRITING RULES

### Voice and Tone
- Write as Panda Patches, not as a generic content writer
- Use "we" and "our" (first-person plural)
- Be direct and confident. No hedging ("might," "could possibly," "it depends")
- Use specific numbers, not vague qualifiers ("from $2.40/piece" not "affordable pricing")
- Never use em dashes. Use periods, commas, or rewrite.

### AI-Citable Sentences
Every blog must have at least 5 "citation-ready" sentences. These are standalone facts that AI search engines (Google AI Overviews, Perplexity, ChatGPT) can extract and quote.

**Test:** Can this sentence be understood without reading anything before or after it?

Bad: "There are many factors that go into the pricing."
Good: "Custom embroidered patches cost between $1.20 and $4.40 per piece for orders of 50 to 1,000 pieces, with price decreasing as quantity increases."

### The Inverted Pyramid (Every Section)
1. Lead with the answer (40-60 words, snippet candidate)
2. Follow with supporting detail
3. Close with nuance or related info

### Paragraph Rules
- Maximum 3-4 sentences per paragraph
- Maximum 80 words per paragraph
- One idea per paragraph
- Break up walls of text with subheadings, lists, or tables

---

## KEYWORD STRATEGY PER POST

### How Many Keywords to Target
- **1 primary keyword** per post (the main search term you want to rank for)
- **3-5 secondary keywords** (close variations and long-tail versions)
- **8-15 semantic keywords** (related terms that show topical depth)

### Where to Place Primary Keyword
| Location | Required? |
|----------|-----------|
| H1 title | Yes |
| Meta title | Yes |
| Meta description | Yes |
| First 100 words | Yes |
| At least one H2 | Yes |
| URL slug | Yes |
| Image alt text (1 image) | Yes |
| Naturally in body (3-5 times for 2,000 words) | Yes |

### Semantic Keywords
For every blog, identify 8-15 related terms using:
- Google "People Also Ask" for your primary keyword
- Google related searches at bottom of SERP
- Google autocomplete suggestions
- Competitor content in positions 1-5 (what subtopics do they cover?)

Include each related term at least once in your content. This signals topical completeness to Google.

---

## TABLES (Required in Every Post)

Every blog must have at least one table. Tables are:
- The #1 most-cited content format by AI Overviews
- Featured snippet triggers for comparison queries
- Scannable for readers who skim

### Table Types to Use

**Pricing Table** (for commercial posts):
| Pack | Qty | Price | Per Piece |
|------|-----|-------|-----------|
| Starter | 50 | $220 | $4.40 |
| Team | 100 | $350 | $3.50 |

**Comparison Table** (for vs/comparison posts):
| Feature | Embroidered | Woven | PVC |
|---------|------------|-------|-----|
| Detail Level | Medium | High | Medium |
| Durability | High | Medium | Very High |

**Specification Table** (for product-focused posts):
| Spec | Details |
|------|---------|
| Min Order | 50 pieces |
| Turnaround | 7-14 business days |
| Free Mockup | Yes, within 24 hours |

---

## HOWTO SCHEMA (Required in Every Post with "How to Order" Section)

Every blog with a "How to Order from Panda Patches" section must have HowTo schema.
Fill in the `howToSteps` field in Sanity with each step. The schema is auto-generated.

### Standard 5-Step Order Process (copy for every blog)
```
Step 1: Submit your design — Upload artwork or describe your idea
Step 2: Receive your free mockup — Digital mockup within 24 hours
Step 3: Request changes — Unlimited free revisions until approval
Step 4: Approve and we produce — Production starts after your sign-off
Step 5: Receive your patches — Ships with tracking, free US shipping
```

---

## PRODUCT SCHEMA (Required in Every Post with Pricing Table)

Every blog with a pricing table must have Product schema.
Fill in the `productOffers` field in Sanity with product name, price, and currency.

### Example Product Offer Entry
```
Name: Custom Embroidered Patches 100 Pack
Price: 240.00
Currency: USD
Availability: InStock
```

Add one product offer per row in your pricing table. The schema is auto-generated.

---

## FAQ SECTION (Required in Every Post)

### Rules
- 4-6 questions per post
- Use exact questions people search for (check Google "People Also Ask")
- Each answer: 40-80 words, self-contained
- Answers must be visible on the page (not hidden in accordions for schema purposes)
- Add FAQPage JSON-LD schema

### FAQ Format
```
## Frequently Asked Questions

### How much do custom [type] patches cost?
Custom [type] patches cost between $X.XX and $X.XX per piece for orders
of 50 to 1,000 pieces. Pricing depends on size, thread count, and backing
type. All orders include free shipping and a digital mockup within 24 hours.

### What is the minimum order for [type] patches?
The minimum order for custom [type] patches is [X] pieces. Our Starter
pack includes [X] pieces for $[X]. No setup fees or hidden charges.

### How long does it take to get custom [type] patches?
Standard delivery is 7-14 business days after mockup approval. Rush
production is available for an additional fee. Economy shipping (16-18
business days) saves 10% on your order total.
```

---

## INTERNAL LINKING STRATEGY

### Link Budget Per Post (5-8 links)
| Link Type | Count | Where |
|-----------|-------|-------|
| Product page (/custom-patches/[type]) | 2-3 | Body, within relevant sections |
| /offers page | 1 | Pricing section + final CTA |
| Related blog post | 1-2 | Body, where topic is mentioned |
| /contact or /bulk-custom-patches | 1 | Final CTA section |

### Anchor Text Rules
- Use descriptive text: "our custom embroidered patches" not "click here"
- Vary anchor text. Don't use the same exact phrase every time.
- Include the target page's primary keyword in at least one anchor
- Don't link the same page more than twice from one post
- First internal link within the first 200 words

### Hub and Spoke Model
- Every blog links to its parent product page (the hub)
- The product page should link back to related blogs (the spokes)
- Related blogs should link to each other

Example for "Custom Velcro Patches" blog:
- Links TO: /custom-velcro-patches (hub), /offers, 1-2 related blogs
- Links FROM: /custom-velcro-patches should link back to this blog

---

## EXTERNAL CITATIONS (2-3 Per Post)

### What to Cite
- Industry statistics (e.g., "the custom patches market is projected to reach $X billion by 2027")
- Material specifications (e.g., thread weight standards, PVC durometer ratings)
- Regulatory references (e.g., NFPA standards for fire department patches)
- Historical facts

### Where to Find Citable Sources
- Government sites (.gov) for regulations
- Industry associations for standards
- Research firms (Statista, IBISWorld) for market data
- Wikipedia for historical context (cite the Wikipedia source, not Wikipedia itself)

### How to Cite
- Link directly to the source page
- Use descriptive anchor: "according to the 2025 IBIS World report"
- Open in new tab (target="_blank" rel="noopener")
- Do NOT use rel="nofollow" for editorial citations
- Do NOT cite competitor websites

---

## IMAGE REQUIREMENTS

### Per Post
- Minimum 3 images, ideally 1 per 500 words
- At least 1 must be an original Panda Patches product photo
- Use WebP format, under 200KB each
- Set width and height attributes (prevents layout shift)
- First image above the fold: do NOT lazy-load
- All other images: lazy-load

### Alt Text
- Describe what the image shows (not what you want to rank for)
- Include primary keyword naturally if the image is relevant
- Under 125 characters
- No "Image of..." or "Photo of..." prefix

Good: `alt="Red embroidered fire department patch with gold border and station number"`
Bad: `alt="custom embroidered patches best quality cheap free shipping"`

### File Names
- Use descriptive hyphenated names: `fire-department-embroidered-patch.webp`
- Not: `IMG_4392.webp` or `patch1.webp`

---

## AUTHOR E-E-A-T SETUP

### Author Bio (Bottom of Every Post)
```
Written by Imran Raza
Founder of Panda Patches. Over [X] years in the custom patches industry.
Delivered 1,000,000+ patches to fire departments, police departments,
sports teams, and Fortune 500 brands across the United States.
```

### Author Schema (Already in blog template)
The blog template includes `author` in the Article schema with:
- name, jobTitle, url, sameAs (LinkedIn)

### Experience Signals to Include in Content
- "In our experience..." or "We have found that..."
- "After producing over 1 million patches..."
- References to specific customer types you have served
- Production process details only a manufacturer would know
- Original product photos (not stock images)

---

## CONTENT FRESHNESS

### Visible Date
Every post must show "Published: [date]" and "Last Updated: [date]" visibly on the page.

### Schema Dates
- `datePublished`: the original publish date
- `dateModified`: updated every time content is refreshed

### Review Schedule
| Content Type | Review Every |
|-------------|-------------|
| Pricing posts | 3 months |
| Comparison posts | 6 months |
| How-to guides | 12 months |
| Industry/trend posts | When developments occur |

When updating, change at least 15-20% of the content. Google detects cosmetic date changes without real updates.

---

## AI SNIPPET OPTIMIZATION CHECKLIST

To get cited in Google AI Overviews, Perplexity, and ChatGPT:

- [ ] Key Takeaways section at top (3-4 bullet points)
- [ ] Definition or key fact in first 100 words
- [ ] At least 1 data table
- [ ] At least 5 "citation-ready" standalone sentences
- [ ] Specific numbers, prices, and timelines (not vague qualifiers)
- [ ] FAQ section with structured Q&A
- [ ] H2 headings phrased as questions matching "People Also Ask"
- [ ] FAQPage + Article + HowTo + Product schema with author and dates
- [ ] Page loads under 2.5 seconds
- [ ] Mobile-responsive layout

---

## PRE-PUBLISH CHECKLIST

Use this for every blog before publishing:

### Content Quality
- [ ] Word count meets minimum (1,500+ informational, 1,800+ commercial)
- [ ] At least 1 unique insight not in competing top 5 results
- [ ] All facts cited with sources
- [ ] No filler paragraphs
- [ ] 5+ citation-ready sentences
- [ ] Passes the "Would an AI quote this?" test

### On-Page SEO
- [ ] Primary keyword in: H1, first 100 words, one H2, meta title, meta description, URL slug
- [ ] 8-15 semantic keywords included
- [ ] Meta title under 60 characters
- [ ] Meta description 150-160 characters with CTA
- [ ] URL slug: 3-5 words with primary keyword

### Structure
- [ ] H1 > H2 (5-8) > H3 hierarchy, no skipped levels
- [ ] Key Takeaways section at top
- [ ] At least 1 table
- [ ] Paragraphs under 80 words / 4 sentences
- [ ] FAQ section with 4-6 questions
- [ ] Final CTA with links to /offers and /contact

### Links
- [ ] 5-8 internal links (product pages + blogs + /offers)
- [ ] 2-3 external citations
- [ ] All links tested and working
- [ ] Descriptive anchor text

### Images
- [ ] 3-5 images, at least 1 original product photo
- [ ] All have alt text under 125 characters
- [ ] WebP format, under 200KB
- [ ] Width/height attributes set
- [ ] First image not lazy-loaded

### Schema
- [ ] Article schema with author, datePublished, dateModified
- [ ] FAQPage schema for FAQ section
- [ ] HowTo schema for "How to Order" section (fill howToSteps in Sanity)
- [ ] Product schema for pricing tables (fill productOffers in Sanity)

### Sanity Fields
- [ ] Blog Title filled
- [ ] Slug auto-generated
- [ ] Main Image uploaded (original product photo)
- [ ] Excerpt (first 1-2 sentences)
- [ ] Category selected
- [ ] Tags added (4-6)
- [ ] Published Date set
- [ ] SEO Title filled (if different from blog title)
- [ ] Meta Description filled
- [ ] Author Photo uploaded

---

## TRAFFIC TARGETS

### Based on GSC Data (Baseline: March 2026)

| Timeline | Monthly Clicks | Monthly Impressions | Avg Position |
|----------|---------------|--------------------|--------------|
| Current (March 2026) | 2,350 | 237,000 | 19.6 |
| After 38 blog optimization | 3,000-3,500 | 250,000+ | 17-18 |
| After 10 new blogs (April) | 4,000-5,000 | 290,000+ | 14-16 |
| After 20 new blogs (May) | 5,000-6,500 | 330,000+ | 12-14 |
| After 3 months (June) | 7,000-10,000 | 400,000+ | 10-12 |

### How We Get There
- **CTR improvement** from meta descriptions on 38 blogs: +500-800 clicks
- **Striking-distance keywords** moving to page 1: +1,000-1,500 clicks
- **20 new commercial blogs** indexing and ranking: +1,500-3,000 clicks
- **Internal linking boost** to product pages: +500-1,000 clicks
- **Compounding effect** of topical authority: grows month over month

### 20-30% Impression Increase
Current: 237K impressions over 3 months (79K/month)
Target: 95K-103K impressions/month (20-30% increase)
How: 20 new blogs targeting zero-click keywords with 400-3,600 impressions each

---

## WHAT NOT TO DO

1. Do not write generic content that any AI tool could produce
2. Do not copy competitor content or paraphrase it
3. Do not stuff keywords unnaturally
4. Do not use em dashes anywhere
5. Do not publish without filling ALL Sanity fields
6. Do not use stock photos when you have real product photos
7. Do not write posts under 1,500 words
8. Do not skip the FAQ section
9. Do not skip the table requirement
10. Do not publish without running the pre-publish checklist

---

*This standard is effective March 25, 2026. Review and update by September 2026 or after any major Google core update.*

---
---

# 20 NEW BLOGS TO WRITE

## PUBLISHING SCHEDULE

| Week | Blogs | Focus |
|------|-------|-------|
| Week 1 (Mar 25-31) | #1-#5 | Highest-impression keywords near page 1 |
| Week 2 (Apr 1-7) | #6-#10 | Zero-click sports/niche keywords |
| Week 3 (Apr 8-14) | #11-#15 | Commercial gap-fillers |
| Week 4 (Apr 15-21) | #16-#20 | Bottom-funnel + topical clusters |

**Pace: 2 blogs/day is fine if quality stays high. 1/day if you need more time.**

---

## WEEK 1: PAGE-1 BOOSTERS

### Blog #1: Custom Velcro Patches: Styles, Uses and How to Order
- **Target Keyword:** custom velcro patches
- **Secondary:** velcro patches custom, custom velcro name patches, hook and loop patches
- **GSC:** 3,662 impressions, position 15.6
- **Category:** Custom Patches
- **Tags:** custom velcro patches, hook and loop patches, tactical velcro patches, velcro name patches
- **Meta Description:** Custom velcro patches for tactical gear, uniforms, and hats. Hook and loop included. No minimum order. Free mockup in 24 hours from Panda Patches.
- **Internal Links:** /custom-velcro-patches, /custom-patches/embroidered, /offers
- **Word Count:** 2,000+
- **H2 Structure:**
  1. What Are Velcro (Hook and Loop) Patches?
  2. Popular Uses for Custom Velcro Patches
  3. Velcro vs Iron-On vs Sew-On: Which Backing to Choose (TABLE)
  4. Custom Velcro Patch Sizes and Pricing (TABLE from /offers)
  5. How to Order Custom Velcro Patches from Panda Patches
  6. Frequently Asked Questions

### Blog #2: Custom Printed Patches: When to Choose Print Over Embroidery
- **Target Keyword:** printed patches
- **Secondary:** custom printed patches, printed patches vs embroidered, full color patches
- **GSC:** 3,277 impressions, position 16.4
- **Category:** Custom Patches
- **Tags:** printed patches, custom printed patches, full color patches, printed vs embroidered
- **Meta Description:** When to choose printed patches over embroidered. Full-color designs, photo-quality detail, lower cost. Compare side by side. Free mockup included.
- **Internal Links:** /custom-patches/printed, /custom-patches/embroidered, /offers
- **Word Count:** 1,800+

### Blog #3: Custom Hockey Patches: Team Logos, Numbers and Crests
- **Target Keyword:** custom hockey patches
- **Secondary:** hockey jersey patches, hockey team patches, custom hockey jersey patches
- **GSC:** 733 impressions, position 27 (zero content)
- **Category:** Custom Sports Patches
- **Tags:** custom hockey patches, hockey jersey patches, hockey team patches, hockey crest patches
- **Meta Description:** Custom hockey patches for teams and leagues. Jersey crests, numbers, and captain patches. Embroidered or chenille. No minimum order. Free design mockup.
- **Internal Links:** /custom-patches/embroidered, /custom-sports-patches, /offers
- **Word Count:** 1,500+

### Blog #4: Custom Embroidered Patches with No Minimum Order
- **Target Keyword:** custom embroidered patches no minimum
- **Secondary:** embroidered patches no minimum, no minimum order patches, small batch patches
- **GSC:** 704 impressions, position 16.5 (pure buying keyword)
- **Category:** Custom Patches
- **Tags:** embroidered patches no minimum, custom patches no minimum, small batch patches, low minimum patches
- **Meta Description:** Order custom embroidered patches with no minimum. Starter packs from 50 pieces at $3.60 each. Free mockup, free shipping. Panda Patches.
- **Internal Links:** /custom-patches/embroidered, /offers
- **Word Count:** 1,500+

### Blog #5: Chenille Patches Wholesale: Bulk Pricing and Lead Times
- **Target Keyword:** chenille patches wholesale
- **Secondary:** wholesale chenille patches, bulk chenille patches, chenille patches bulk order
- **GSC:** 658 impressions, position 12.3 (near page 1)
- **Category:** Chenille Patches
- **Tags:** chenille patches wholesale, bulk chenille patches, wholesale patches, chenille bulk pricing
- **Meta Description:** Wholesale chenille patches from 25 to 1,000+ pieces. Bulk pricing from $6.80/pc. Varsity letters, mascots, custom designs. Free mockup. 2-week delivery.
- **Internal Links:** /custom-patches/chenille, /bulk-custom-patches, /offers
- **Word Count:** 1,500+

---

## WEEK 2: ZERO-CLICK SPORTS AND NICHE

### Blog #6: Custom Baseball Patches for Teams and Leagues
- **Target Keyword:** custom baseball patches
- **GSC:** 682 impressions, position 33
- **Category:** Custom Sports Patches
- **Tags:** custom baseball patches, baseball team patches, little league patches, baseball jersey patches
- **Meta Description:** Custom baseball patches for teams and leagues. Hat patches, jersey patches, and championship patches. No minimum order. Free design from Panda Patches.
- **Internal Links:** /custom-patches/embroidered, /custom-sports-patches, /offers

### Blog #7: Custom Fire Department Patches: Design and Ordering Guide
- **Target Keyword:** custom fire department patches
- **GSC:** 615 impressions, position 49
- **Category:** Custom Military Patches
- **Tags:** custom fire department patches, firefighter patches, fire dept patches, fire station patches
- **Meta Description:** Custom fire department patches with your station logo and number. Embroidered or woven. Velcro or sew-on. Free mockup. Trusted by departments across the US.
- **Internal Links:** /custom-fire-department-patches, /custom-patches/embroidered, /offers
- **Word Count:** 2,000+

### Blog #8: Custom Football Patches for Teams and Clubs
- **Target Keyword:** custom football patches
- **GSC:** 553 impressions, position 44
- **Category:** Custom Sports Patches
- **Tags:** custom football patches, football team patches, football helmet patches, varsity football patches
- **Meta Description:** Custom football patches for teams and clubs. Helmet decals, jersey patches, and letterman chenille. No minimum order. Free mockup from Panda Patches.
- **Internal Links:** /custom-patches/chenille, /custom-sports-patches, /offers

### Blog #9: Custom Soccer Patches: Crests, Badges and Arm Patches
- **Target Keyword:** custom soccer patches
- **GSC:** 490 impressions, position 56
- **Category:** Custom Sports Patches
- **Tags:** custom soccer patches, soccer crest patches, soccer team badges, soccer club patches
- **Meta Description:** Custom soccer patches and club crests. Woven or embroidered. Full-color designs for jerseys and jackets. No minimum order. Free mockup included.
- **Internal Links:** /custom-patches/woven, /custom-sports-patches, /offers

### Blog #10: Custom Leather Patches for Hats, Bags and Apparel
- **Target Keyword:** custom leather patches
- **GSC:** 463 impressions, position 53
- **Category:** Custom Leather Patches
- **Tags:** custom leather patches, leather hat patches, leather jacket patches, leather logo patches
- **Meta Description:** Custom leather patches for hats, bags, and apparel. Debossed, embossed, or laser-etched. Premium quality from Panda Patches. Free mockup included.
- **Internal Links:** /custom-patches/leather, /offers

---

## WEEK 3: COMMERCIAL GAP-FILLERS

### Blog #11: Custom Patches No Minimum: Small Batch Ordering Guide
- **Target Keyword:** custom patches no minimum
- **GSC:** 797 impressions, position 22.7
- **Category:** Ordering Guide
- **Tags:** custom patches no minimum, small batch patches, low minimum custom patches, patches no MOQ
- **Meta Description:** Order custom patches with no minimum. Embroidered, woven, PVC, chenille from 25 pieces. Starter packs with fixed pricing. Free mockup from Panda Patches.
- **Internal Links:** /offers, /custom-patches/embroidered, /contact

### Blog #12: Custom Chenille Patches: Letterman and Varsity Style
- **Target Keyword:** custom chenille patches
- **GSC:** 460 impressions, position 40
- **Category:** Chenille Patches
- **Tags:** custom chenille patches, letterman patches, varsity chenille, chenille letter patches
- **Meta Description:** Custom chenille patches for letterman jackets, varsity teams, and brands. Soft, textured, bold. From 25 pieces. Free mockup from Panda Patches.
- **Internal Links:** /custom-patches/chenille, /offers

### Blog #13: Custom Tactical Patches: Morale, Unit and Flag Patches
- **Target Keyword:** custom tactical patches
- **GSC:** 419 impressions, position 37
- **Category:** Custom Tactical Patches
- **Tags:** custom tactical patches, morale patches, tactical velcro patches, unit patches custom
- **Meta Description:** Custom tactical and morale patches with velcro backing. PVC or embroidered. No minimum order. Free design from Panda Patches.
- **Internal Links:** /custom-patches/pvc, /custom-patches/embroidered, /custom-velcro-patches

### Blog #14: Custom Sequin Patches: Design Options and Pricing
- **Target Keyword:** custom sequin patches
- **GSC:** 541 impressions, position 12.5
- **Category:** Custom Sequin Patches
- **Tags:** custom sequin patches, flip sequin patches, reversible sequin, sequin patch design
- **Meta Description:** Custom sequin patches with flip and reversible options. Full-color designs for fashion, merch, and branding. Free mockup. No minimum order.
- **Internal Links:** /custom-patches/sequin, /offers

### Blog #15: Embroidered vs Woven Patches: Which Should You Order?
- **Target Keyword:** embroidered vs woven patches
- **GSC:** 327 impressions, position 18.1
- **Category:** Embroidery Patch Vs Woven Patch
- **Tags:** embroidered vs woven patches, woven vs embroidered, patch comparison, which patch type
- **Meta Description:** Embroidered vs woven patches compared. Durability, detail, cost, and best uses. Side-by-side photos and pricing. Free mockup of either type.
- **Internal Links:** /custom-patches/embroidered, /custom-patches/woven, /offers

---

## WEEK 4: BOTTOM-FUNNEL AND TOPICAL CLUSTERS

### Blog #16: Custom Patches for Hats: Sizes, Styles and How to Order
- **Target Keyword:** custom patches for hats
- **Category:** Custom Patches
- **Tags:** custom patches for hats, hat patches, cap patches, trucker hat patches
- **Meta Description:** Custom patches for hats. Woven, leather, and embroidered options. Sizing guide for snapbacks, trucker hats, and beanies. Free mockup from Panda Patches.
- **Internal Links:** /patches-for-hats, /custom-patches/woven, /custom-patches/leather, /offers

### Blog #17: Custom Patches for Uniforms: Work, Medical and Security
- **Target Keyword:** custom patches for uniforms
- **Category:** Custom Business Patches
- **Tags:** custom uniform patches, work patches, medical uniform patches, security patches custom
- **Meta Description:** Custom patches for work uniforms, medical scrubs, and security gear. Embroidered or PVC. Bulk pricing from 50 pieces. Free mockup from Panda Patches.
- **Internal Links:** /custom-patches/embroidered, /bulk-custom-patches, /offers

### Blog #18: Custom Iron-On Patches: Best Uses and How to Order
- **Target Keyword:** custom iron on patches
- **GSC:** 518 impressions, position 18.9
- **Category:** Custom Patches
- **Tags:** custom iron on patches, iron on patches custom, iron on embroidered, custom heat press patches
- **Meta Description:** Order custom iron-on patches for clothing, bags, and hats. Embroidered with heat-seal backing. No minimum order. Free design mockup from Panda Patches.
- **Internal Links:** /custom-patches/embroidered, /offers

### Blog #19: Custom Patches for Jackets: Biker, Denim and Varsity
- **Target Keyword:** custom patches for jackets
- **Category:** Custom Patches
- **Tags:** custom jacket patches, biker patches, denim jacket patches, varsity jacket patches
- **Meta Description:** Custom patches for jackets. Biker back patches, denim iron-ons, and varsity chenille. All sizes and styles. Free mockup from Panda Patches.
- **Internal Links:** /custom-patches/chenille, /custom-patches/embroidered, /custom-patches/leather

### Blog #20: How to Order Custom Patches Online (Step by Step)
- **Target Keyword:** order custom patches online
- **Category:** Ordering Guide
- **Tags:** order custom patches, buy custom patches online, how to order patches, custom patch process
- **Meta Description:** How to order custom patches online in 5 simple steps. Upload artwork, choose options, approve mockup, receive patches. Free shipping from Panda Patches.
- **Internal Links:** /offers, /contact, /custom-patches

---

## EXPECTED IMPACT

| Metric | Current (March) | After 20 Blogs (May) | After 3 Months (June) |
|--------|----------------|---------------------|----------------------|
| Monthly clicks | 2,350 | 4,000-5,500 | 7,000-10,000 |
| Indexed blog pages | 38 | 58 | 58+ |
| Non-branded traffic | 44% | 55% | 65% |
| Avg position (non-branded) | 19.6 | 12-15 | 8-12 |
| Keywords on page 1 | ~5 | 15-20 | 25-30 |

## WEEKLY TRACKING (Every Monday)

- [ ] How many new blogs indexed (site:pandapatches.com)
- [ ] GSC clicks vs previous week
- [ ] Which new blogs getting impressions
- [ ] Which striking-distance keywords moved up
- [ ] Re-export GSC after 4 weeks and compare
