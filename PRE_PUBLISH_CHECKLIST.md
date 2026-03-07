# Blog Pre-Publish Checklist — Panda Patches
## Optimised for: Fast Ranking + Business Lead Conversion (2026)

Every blog post MUST pass all REQUIRED items before publishing.
Recommended items improve ranking speed and conversion rate.

---

## SYSTEM AUDIT — What Every Post Gets Automatically

These are already handled by the blog template. No action needed per post.

| Feature | Status | Notes |
|---|---|---|
| Article JSON-LD schema | DONE | `datePublished`, `dateModified`, `author`, `image` |
| Author byline (Imran Raza, LinkedIn) | DONE | E-E-A-T signal |
| Author bio card at bottom | DONE | Founder credentials, 13 years |
| OG tags + Twitter cards | DONE | `type: article` |
| Canonical URL | DONE | Auto-set to `pandapatches.com/[slug]` |
| ISR (1hr revalidation) | DONE | Fresh content served fast |
| RelatedLinks section | DONE | Auto-detects relevant internal links |
| CTA section (quote form) | DONE | Lead capture at end of every post |
| Featured image — Next.js optimised | FIXED | WebP served, responsive sizes |

---

## REQUIRED — Must Pass Before Publishing

### 1. TITLE AND SLUG
- [ ] H1 title contains the primary keyword (exact match or close variant)
- [ ] Title is 50-60 characters (fits Google title tag without truncation)
- [ ] Title addresses a specific intent: how-to, what-is, comparison, guide, or list
- [ ] Slug is lowercase, hyphenated, matches H1 keyword (e.g. `custom-iron-on-patches-guide`)
- [ ] Slug does NOT contain dates (e.g. avoid `/blog/2024/...`) — keeps URL evergreen

### 2. META DESCRIPTION
- [ ] Written in Sanity `excerpt` field (this becomes the meta description)
- [ ] 140-155 characters — not truncated in SERPs
- [ ] Contains the primary keyword naturally
- [ ] Includes a clear value proposition or action trigger (e.g. "Learn exactly how...", "Complete guide to...", "Find out which...")
- [ ] Does NOT start with "In this article..." or the post title

### 3. FEATURED IMAGE
- [ ] Image uploaded in Sanity `image` field
- [ ] Filename is descriptive before upload (e.g. `custom-iron-on-patches-guide.webp`)
- [ ] Alt text in Sanity matches the H1 keyword (currently uses post title — verify it's descriptive)
- [ ] Image is 1200x628px minimum (safe for OG/Twitter cards)
- [ ] Image is compressed to under 200KB before upload (use Squoosh at 75-80% WebP quality)

### 4. CONTENT STRUCTURE
- [ ] Post opens with a clear 2-3 sentence hook answering: "What will I learn and why does it matter for my patches?"
- [ ] H2 headings used for main sections (NOT H1 — there is only one H1: the post title)
- [ ] H3 headings used for sub-sections under H2s
- [ ] Primary keyword appears in: H1, first paragraph, at least one H2
- [ ] Secondary keywords appear naturally in body (no stuffing)
- [ ] Post includes at least one bulleted or numbered list (triggers featured snippet eligibility)
- [ ] Post has a clear conclusion or summary section
- [ ] Minimum word count: 800 words for informational posts, 1,200+ for comparison/guide posts

### 5. INTERNAL LINKS
- [ ] At least 2 internal links to relevant product pages (e.g. `/custom-patches/embroidered`, `/custom-patches/pvc`)
- [ ] At least 1 internal link to a related blog post (if one exists)
- [ ] Anchor text is descriptive — NOT "click here" or "read more"
- [ ] Good examples: "custom embroidered patches", "iron on patch backing options", "PVC patches for uniforms"

### 6. LEAD CONVERSION
- [ ] Post naturally mentions Panda Patches at least once in the body as the solution/provider
- [ ] At least 1 contextual CTA inside the post body (not just the automatic one at the bottom)
  - Example: "Ready to order? [Get a free quote for your custom patches](#quote)"
- [ ] If the post is a comparison (e.g. embroidered vs woven), it ends with a clear recommendation pointing to the relevant product page

### 7. SANITY FIELDS — All Required
- [ ] `title` — filled
- [ ] `slug.current` — filled, matches title keyword
- [ ] `excerpt` — filled (140-155 chars, acts as meta description)
- [ ] `image` — uploaded
- [ ] `content` — body content added with proper H2/H3 structure

---

## RECOMMENDED — Significantly Improves Ranking Speed

### 8. E-E-A-T SIGNALS (Experience, Expertise, Authoritativeness, Trust)
- [ ] Post references a real-world example, customer case, or specific product detail that only someone with manufacturing experience would know
- [ ] If giving advice (e.g. "best backing for jackets"), back it with a reason grounded in manufacturing ("...because iron-on heat adhesive loses strength on heavy canvas after 20 washes")
- [ ] If statistics are cited, link to the source (add an external link with `rel="noopener noreferrer"`)
- [ ] Mention Panda Patches' 13+ years / 1 million patches delivered where naturally relevant (trust signal)

### 9. FAQ SECTION
- [ ] If the post answers multiple related questions, add a FAQ section at the bottom of the content in Sanity
- [ ] Use H3 for each question, paragraph for each answer
- [ ] FAQ questions should match real Google "People Also Ask" results for the topic
- [ ] Keep each answer to 40-60 words (optimised for featured snippet extraction)
- [ ] NOTE: Once FAQ schema is added to the template (see PENDING below), FAQ sections will auto-generate rich results

### 10. FRESHNESS SIGNALS
- [ ] If updating an existing post, change the content meaningfully (not just typo fixes) — Sanity will update `_updatedAt` automatically
- [ ] Add a "Last updated: Month YYYY" note in the first paragraph if the post covers pricing or specifications that change

### 11. KEYWORD RESEARCH CONFIRMATION
- [ ] Primary keyword has verified search volume (check Google Search Console, Ahrefs, or free tools like Ubersuggest)
- [ ] Keyword intent matches the post type: informational query = guide/how-to post, commercial query = comparison/product post
- [ ] Primary keyword is NOT already covered by another live post (avoid cannibalisation — check `/blogs` listing first)

### 12. IMAGES IN BODY
- [ ] Body images (added via Sanity Portable Text) have descriptive alt text — not "image1.jpg" or blank
- [ ] Body images are compressed before upload

---

## PENDING TEMPLATE IMPROVEMENTS (Not Yet in Code)

These are missing from the blog template and should be added to improve ranking:

| Missing Feature | SEO Impact | Priority |
|---|---|---|
| Visible breadcrumb nav (Home > Blog > Post Title) | Medium — helps users and adds BreadcrumbList schema | High |
| BreadcrumbList JSON-LD on individual post pages | Medium — currently only on /blogs listing | High |
| Speakable schema on key posts | Medium — AEO/voice search eligibility | Medium |
| FAQ JSON-LD schema (auto-generated from FAQ sections in content) | High — rich results + PAA boxes | High |
| Table of contents for posts over 1,500 words | Medium — dwell time + anchor links | Medium |
| Tags/category displayed on post | Low — UX + internal link structure | Low |
| "Last Updated" badge shown visually | Medium — freshness trust signal | Medium |

---

## SCORING REFERENCE — Self-Assess Each Post

Score your post 1-10 before publishing using these criteria:

| Dimension | 1-3 (Weak) | 4-6 (Average) | 7-9 (Strong) | 10 (Best) |
|---|---|---|---|---|
| Schema | No schema | Article schema only | + Breadcrumb | + FAQ + Speakable |
| Content Depth | Under 500w, no structure | 800w, basic H2s | 1200w+, lists, FAQ | 2000w+, original data |
| Keyword Targeting | No research done | Has keyword, not in H2s | In H1+H2+intro | Perfect density + LSI |
| Citations / Sources | None | 1 vague reference | 2+ external links | Primary sources linked |
| Breadcrumbs | None | URL readable | Visible nav | Schema + visible nav |
| Internal Linking | 0 links | 1-2 generic | 3+ descriptive anchors | Contextual + product CTAs |
| E-E-A-T | No author signal | Name only | Bio + LinkedIn | Real expertise shown in content |
| GEO/AEO/Speakable | None | Has FAQ questions | FAQ section structured | Speakable schema + PAA-ready answers |

**Target score before publishing: 7+ on every dimension.**

---

## #1 BEST-PERFORMING POST TEMPLATE (What to Aim For)

A post scores 10/10 if it has ALL of:
1. Primary keyword in H1 + first 100 words + at least one H2
2. Excerpt/meta description written to 145 characters with keyword + value proposition
3. FAQ section with 3-5 questions matching Google PAA, each answer 40-60 words
4. 3+ internal links with keyword-rich anchor text to product pages
5. 1 external citation to a credible source (government, university, or major publication)
6. Author name + LinkedIn visible in byline
7. At least one real manufacturing insight that demonstrates Imran's expertise
8. A contextual CTA inside the body (not just the bottom CTA section)
9. Featured image compressed under 200KB, alt text matches H1 keyword
10. Minimum 1,200 words

---

*Created: March 2026. Update this checklist whenever new schema features are added to the template.*
