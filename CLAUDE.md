# PANDA PATCHES — AI DEVELOPER CONTEXT
# Drop this file in your project root. Works with Claude, Cursor, Copilot, Minimax.
# Last updated: March 12, 2026

---

## WHAT YOU ARE BUILDING

A self-contained **Offers Page** at `pandapatches.com/offers` with:
1. Offer cards (fixed-price patch packages)
2. Inline multi-step order flow (no redirects to other pages)
3. Upsells: backing type, delivery speed, premium upgrades
4. Customer details collection
5. Stripe/PayPal checkout
6. Post-payment confirmation

**Critical rule:** Offer cards do NOT link to `/custom-patches/*` product pages.
All ordering happens entirely on `/offers`. Prices here are lower than the calculator — keep them separate.

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| CMS | Sanity |
| Auth | Supabase |
| Payments | Stripe + PayPal |
| Buy Now Pay Later | AfterPay, Klarna |
| Live Chat | Tawk.to |
| Email | ZeptoMail (transactional) |
| Hosting | Vercel Pro |
| Analytics | GA4 via GTM (GTM-KQQQ674D) |
| Google Ads | AW-11221237770 |

---

## PROJECT STRUCTURE (existing)

```
/app
  /custom-patches
    /embroidered      ← DO NOT TOUCH — separate product pages
    /woven
    /pvc
    /chenille
    /leather
  /bulk-custom-patches
  /offers             ← BUILD THIS (new page)
/components
  TawkToWidget.tsx    ← Live chat + conversion tracking
  HeroForm.tsx        ← Quote form (existing)
/middleware.ts        ← CSP headers (be careful editing)
```

---

## OFFERS PAGE — URL & NAV

- **URL:** `/offers`
- **Add to main nav** between "Products" and "Bulk Order"
- **Nav label:** `🔥 Offers`
- **Style:** Red or orange text, optional subtle pulse animation or "NEW" badge

---

## OFFER PACKAGES (all prices fixed — do not pull from calculator)

### Woven Patches — Under 4 Inches
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Starter | 50 | $220 | $4.40 |
| Team | 100 | $350 | $3.50 |
| Business | 500 | $1,200 | $2.40 |
| Enterprise | 1,000 | $2,000 | $2.00 |

### Embroidered Patches — Under 4 Inches
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Starter | 50 | $180 | $3.60 |
| Team | 100 | $240 | $2.40 |
| Business | 500 | $750 | $1.50 |
| Enterprise | 1,000 | $1,200 | $1.20 |

### Embroidered Patches — 12 Inch Across Chest
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Small Run | 25 | $400 | $16.00 |
| Standard | 50 | $750 | $15.00 |
| Team Order | 100 | $1,100 | $11.00 |

### PVC Patches — Under 4 Inches
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Starter | 50 | $230 | $4.60 |
| Team | 100 | $340 | $3.40 |
| Business | 500 | $1,400 | $2.80 |
| Enterprise | 1,000 | $2,200 | $2.20 |

### Chenille Patches — Under 4 Inches
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Starter | 25 | $230 | $9.20 |
| Team | 50 | $340 | $6.80 |
| Club | 100 | $1,400 | $14.00 |

### Chenille Patches — 12 Inch
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Small Run | 25 | $500 | $20.00 |
| Standard | 50 | $850 | $17.00 |
| Team Order | 100 | $1,400 | $14.00 |

### Leather Patches — Under 4 Inches
| Pack | Qty | Price | Per piece |
|------|-----|-------|-----------|
| Starter | 50 | $220 | $4.40 |
| Team | 100 | $350 | $3.50 |
| Business | 500 | $1,200 | $2.40 |
| Enterprise | 1,000 | $2,000 | $2.00 |

---

## ORDER FLOW (inline — no redirects)

When customer clicks "Order Now" on any offer card:
- An inline multi-step form **expands below that card** (accordion style)
- Selected offer (patch type, qty, base price) pre-loaded automatically
- Progress bar: Step 1 → 2 → 3 → 4 → 5
- Customer can go back at any step
- **Mobile:** full-screen step view
- **Desktop:** inline expansion with sticky order summary on right side

### Step 1 — Your Design
```
Field: Artwork Upload
  - Accepted: JPG, PNG, PDF, AI, EPS, SVG
  - Max: 20MB
  - Helper: "Don't have artwork? Describe your idea below."

Field: Design Description (textarea)
  - Required if no artwork uploaded
  - Min 20 characters
  - Placeholder: "e.g. Our fire department logo — red eagle, gold text, dept name and year est. 1978"

Field: Exact Size (two number inputs)
  - Width __ inches × Height __ inches
  - Helper: 'Most hat patches: 2"×2". Left-chest: 3"×3". Back patches: 10"×12".'
  - Validation: if offer is "Under 4 inches" and customer enters >4", show warning:
    "This offer is for patches up to 4". For larger sizes, chat with us for a custom quote."
```

### Step 2 — Options & Upgrades
All selections update the order summary total in real time.

**Backing (required — radio cards):**
| Option | Price | Note |
|--------|-------|------|
| Iron-On | FREE | Default selected |
| Sew-On | FREE | |
| Sticker | FREE | |
| Velcro | +$30 | Show: "Industry standard for tactical, military & uniform patches. Hook + loop both sides included." |

**Delivery Speed (required — radio cards):**
| Option | Price | Timeline | Note |
|--------|-------|----------|------|
| Economy | -10% off order total | 16–18 business days | |
| Standard | FREE | 7–14 business days | Mark as "Recommended" |
| Rush | Scaled (see below) | Confirmed by email | Show amber info box when selected |

**Rush pricing (auto-calculated from qty):**
| Qty | Rush fee |
|-----|----------|
| 50 | +$50 |
| 100 | +$75 |
| 500 | +$150 |
| 1,000 | +$200 |
| Other | Pro-rate / round up to next tier |

**Rush info box (show when Rush is selected):**
```
⚡ Rush selected
We will confirm your exact delivery date by email within 2–6 hours of your order.
If the date doesn't work, reply to that email and we'll remove the rush upgrade
and refund the rush fee — no questions asked.
```

**Premium Upgrades (optional — checkbox cards, collapsible):**
Label: `+ Add Premium Upgrades (optional)` with chevron ›

| Upgrade | Price | Description |
|---------|-------|-------------|
| Metallic Thread | +$20 | Gold, silver or copper thread |
| Glow in the Dark | +$25 | Recharges under light |
| 3D Puff Embroidery | +$30 | Raises design off surface. ★ Most Popular |

### Step 3 — Special Instructions
```
Field: Special Instructions (textarea, optional)
  - Placeholder: "e.g. Match Pantone 286C blue. Gold border 3mm. Text: Est. 1978"
  - Helper: "Include color codes, font preferences, or anything specific."
  - Max 500 characters, show counter
```

### Step 4 — Your Details
```
Full Name *         text
Email Address *     email      "We'll send your mockup here"
Phone Number *      tel        ← SEE PHONE NOTE BELOW
Company Name        text       optional
Street Address *    text
Apt / Suite         text       optional
City *              text
State *             select     all 50 US states dropdown
ZIP Code *          text       validate 5-digit format
```

**Phone field note — show prominently, especially on mobile:**
```
📦 Your phone number is required by DHL/FedEx to process your shipment
and send you delivery notifications.
```

### Step 5 — Review & Pay
Show full order summary:
```
✓ Patch type: [type], [size], [qty] pieces
✓ Base price: $[price]
✓ Backing: [choice]  [+$X or FREE]
✓ Delivery: [choice]  [+$X or FREE or -10%]
✓ Upgrades: [each one]  [+$X each]
─────────────────────────────────────
TOTAL: $[calculated]
✓ Artwork: [filename or "Description provided"]
✓ Size: [W]" × [H]"
✓ Shipping to: [name], [address]
```

**Approval reminder (show before payment button — green box):**
```
🛡️ You'll receive a digital mockup within 24 hours for your approval.
✏️ Request unlimited changes free. Production starts only after your approval.
💚 Not happy? Full refund — money-back guarantee.
```

**Payment methods (show logos):**
Visa · Mastercard · Amex · PayPal · Apple Pay · AfterPay · Klarna · Cash App
"256-bit SSL encrypted" badge. Powered by Stripe.

**CTA button:**
```
🔒 Complete Order — $[TOTAL]   (large, full width, green)
```

---

## POST-PAYMENT CONFIRMATION

```
🎉 Order Received! Your Mockup Is On Its Way.

✅ Order #[auto] confirmed
🎨 Mockup sent to [email] within 24 hours
✏️ Review it, request changes — free and unlimited
✅ Production begins only after your approval
📦 Estimated delivery: [date range]
📞 Questions? (302) 250-4340
```

**Fire this Google Ads conversion tag on confirmation:**
```javascript
gtag('event', 'conversion', {
  send_to: 'AW-11221237770/BGrrCMHi3oEcEIqA2uYp',
  value: [order_total],
  currency: 'USD'
});
```

---

## APPROVAL PROMISE (show in 2 places on page)

### 1. Banner below hero
```
🛡️ Your Approval Before Anything Ships. Ever.
After payment, our design team creates a digital mockup within 24 hours.
You review it, request changes (free, unlimited), and approve.
Production starts only after your sign-off. Nothing is made without it — guaranteed.
```

### 2. Standalone mid-page section
```
Nothing Ships Without Your Approval. Ever.

1. 💳 You pay securely
2. 🎨 Within 24 hours — we email your digital mockup
3. 📧 You review it
4. ✏️ Request any changes — colors, size, font, layout — all free
5. ✅ You approve — production begins
6. 📦 Ships with full tracking to your door

"We've delivered 1,000,000+ patches this way.
Our customers never get surprises — only patches they love."
```

---

## WHAT'S INCLUDED IN EVERY OFFER (checklist section)

```
✅ Free digital mockup within 24 hours
✅ Unlimited free revisions — until you approve
✅ Your approval required before production starts
✅ Free shipping anywhere in the US
✅ No setup fees, no hidden charges
✅ Choice of backing (Velcro +$30)
✅ 7–14 day standard delivery | Rush available
✅ 4.8★ rated on Trustpilot — 57 verified reviews
✅ Money-back guarantee
```

---

## FAQ (use FAQPage schema — same pattern as existing pages)

**Q: What happens after I pay?**
Within 24 hours, our design team emails you a digital mockup. You review, request changes, and approve. Production starts only after your sign-off.

**Q: What if I don't like the mockup?**
Request as many changes as needed — all free. If we still can't get it right, full refund. Money-back guarantee.

**Q: Why is Velcro backing extra?**
Velcro needs hook and loop both sides — more materials and labor. +$30 is the industry standard. Best for tactical, military, and uniform patches.

**Q: What delivery options are there?**
Economy (16-18 days, 10% off) | Standard (7-14 days, free) | Rush (50pcs +$50, 100pcs +$75, 500pcs +$150, 1000pcs +$200). Rush date confirmed by email within 2-6 hours.

**Q: What does "under 4 inches" mean?**
The longest dimension is 4" or less — covers 90% of hat patches, left-chest and shoulder patches.

**Q: What payment methods do you accept?**
Visa, Mastercard, Amex, PayPal, Apple Pay, AfterPay, Klarna. All 256-bit SSL encrypted via Stripe.

**Q: Can I order a different quantity?**
These offers cover 90% of orders. For anything custom, use our quote form or live chat.

---

## BOTTOM CTA SECTION

```
Headline: Need a Custom Size or Quantity?
Body: Our offers cover 90% of orders. For custom sizes, mixed types,
or anything else — free quote in 60 seconds.
Button 1: Get a Free Quote → /contact
Button 2: Chat With Us Now → Tawk.to open trigger
```

---

## SCHEMA MARKUP

Add `Product` schema per offer card:
```json
{
  "@type": "Product",
  "name": "Custom Woven Patches 100 Pack",
  "brand": { "@type": "Brand", "name": "Panda Patches" },
  "offers": {
    "@type": "Offer",
    "price": "350.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Panda Patches" }
  }
}
```

Add `FAQPage` schema for FAQ section — follow same pattern as `/custom-patches/embroidered`.

---

## CONVERSION TRACKING

| Event | When to fire | Tag |
|-------|-------------|-----|
| Purchase | On confirmation page | `AW-11221237770/BGrrCMHi3oEcEIqA2uYp` (dynamic value) |
| Lead form | On confirmation page | `AW-11221237770` Quote Form Sub label |
| Chat started | On Tawk chat open | `AW-11221237770/sWV1CNm--IMcEIqA2uYp` |

All via `window.gtag()` — GTM container GTM-KQQQ674D already loaded.

---

## CSP NOTES

CSP is managed in `middleware.ts` — NOT `next.config.mjs`.
If you add any new third-party scripts, add their domains to middleware.ts.
Do not edit next.config.mjs for CSP changes.

---

## EXISTING PATTERNS TO FOLLOW

- Quote form submission → see `HeroForm.tsx` for form handling pattern
- Conversion firing → see `TawkToWidget.tsx` lines 61-69
- Image optimization → use `next/image` with `quality={75}`, proper `sizes` attribute
- Sanity images → use `urlFor(image).width(400).format('webp').url()`
- All new pages → add to sitemap, use `www.pandapatches.com` canonical (not non-www)

---

## DO NOT TOUCH

- `/custom-patches/*` pages — separate product pages, different pricing
- `middleware.ts` CSP without understanding existing rules
- Conversion tracking labels — already set up correctly
- `Tawk_API` initialization — must use backtick template literals (known bug fixed)

---

## CONTACTS

Owner: Imran Raza — admin@pandapatches.com — (302) 250-4340
Google Ads: imran.ladhani110@gmail.com
GTM: GTM-KQQQ674D
GA4: G-Y391W132NR
Google Ads ID: AW-11221237770
