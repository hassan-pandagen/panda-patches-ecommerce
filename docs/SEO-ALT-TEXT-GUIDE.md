# SEO Alt Text Guide & Automation Strategy

## Overview

This document outlines the systematic approach to SEO-optimized alt text across the Panda Patches e-commerce site. All images now require descriptive alt text for better search engine visibility and accessibility.

---

## The SEO Alt Text Formula

Every image alt text should follow this structure:

```
[What it is] + [Key Feature/Detail] + [Context/Brand]
```

### Examples:

**Good Alt Text:**
- ✅ `"Custom embroidered police badge patch with detailed Maltese cross design | Panda Patches"`
- ✅ `"Fire department uniform patches featuring heat-resistant Nomex material | Panda Patches"`
- ✅ `"Sports team chenille letterman jacket patches with vibrant team colors | Panda Patches"`

**Bad Alt Text:**
- ❌ `"Patch"` (Too generic)
- ❌ `"Image 1"` (No description)
- ❌ `"Custom patches for sale"` (Keyword stuffing)
- ❌ `"Click here to see our amazing beautiful custom patches"` (Not descriptive)

---

## Automated System Architecture

### 1. Sanity CMS Schema Updates

All image fields in Sanity now include **required alt text fields**:

#### Updated Schemas:
- **`hero.ts`** - Hero images and trust badges
- **`productPage.ts`** - Gallery images, work samples, and option cards
- **`workSample.ts`** - Work sample images

#### Example Schema Structure:
```typescript
defineField({
  name: 'workSamples',
  title: 'Work Sample Gallery',
  type: 'array',
  of: [{
    type: 'image',
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text (SEO)',
        type: 'string',
        description: 'Describe this work sample: e.g., "Custom embroidered firefighter patch with Maltese cross design"',
        validation: (rule) => rule.required(),
      }),
    ],
  }],
  group: 'gallery',
})
```

### 2. Component Updates

All components now:
1. **Fetch alt text** from Sanity alongside image URLs
2. **Use dynamic alt text** when available
3. **Provide intelligent fallbacks** when alt text is missing

#### Updated Components:
- ✅ **Hero.tsx** - Hero images, trust badges, brand logos
- ✅ **ProductGallery.tsx** - Product image galleries and thumbnails
- ✅ **WorkSamples.tsx** - Work sample carousels
- ✅ **BulkPricingTable.tsx** - Category work sample galleries

#### Example Component Pattern:
```tsx
// Fetch alt text from Sanity
const query = `{
  "workSamples": workSamples[]{
    "image": @,
    "alt": alt
  }
}`;

// Use in Image component with fallback
<Image
  src={urlFor(img.image || img).url()}
  alt={img.alt || "Custom embroidered patch showcasing detailed craftsmanship | Panda Patches"}
  fill
  className="object-cover"
/>
```

---

## Content Manager Workflow

### When Uploading New Images to Sanity:

#### Step 1: Upload the Image
Upload your high-quality image to the appropriate field in Sanity Studio.

#### Step 2: Write Descriptive Alt Text
Fill in the **Alt Text (SEO)** field using this formula:

**Formula:** `[Patch Type] + [Unique Feature] + [Category/Industry] | Panda Patches`

**Examples by Category:**

**Fire Department:**
- `"Custom embroidered fire department patch with Maltese cross and ladder design | Panda Patches"`
- `"Heat-resistant Nomex firefighter uniform patch with station number | Panda Patches"`
- `"Volunteer fire department badge patch with detailed shield embroidery | Panda Patches"`

**Police/Law Enforcement:**
- `"Custom police badge patch with detailed shield and eagle embroidery | Panda Patches"`
- `"Tactical SWAT team PVC patch with subdued color design | Panda Patches"`
- `"Sheriff department uniform patch with star badge and county name | Panda Patches"`

**Sports Teams:**
- `"Custom baseball team chenille patch with mascot embroidery | Panda Patches"`
- `"Embroidered soccer team jersey patch with club logo and colors | Panda Patches"`
- `"Championship tournament patch with gold metallic thread and date | Panda Patches"`

**Corporate/Business:**
- `"Custom corporate logo patch with Pantone color-matched embroidery | Panda Patches"`
- `"Employee uniform name patch with company branding | Panda Patches"`
- `"Promotional PVC brand patch with 3D raised logo design | Panda Patches"`

#### Step 3: Quality Check
Before publishing, ask yourself:
- ✅ Does this describe what someone would SEE in the image?
- ✅ Would this help a visually impaired person understand the image?
- ✅ Does it include relevant keywords naturally (not stuffed)?
- ✅ Is it between 100-125 characters (optimal length)?
- ✅ Does it end with "| Panda Patches" for brand consistency?

---

## SEO Best Practices

### Length Guidelines:
- **Ideal:** 100-125 characters
- **Minimum:** 50 characters
- **Maximum:** 150 characters

### Keyword Strategy:
**Include These Keywords** (when relevant):
- Patch type: embroidered, PVC, woven, chenille, leather
- Industry: police, fire department, military, sports, corporate
- Features: heat-resistant, Nomex, custom, detailed, 3D, raised
- Context: uniform, badge, tactical, jersey, promotional

**Avoid:**
- Keyword stuffing: "custom patches custom embroidered patches custom made patches"
- Promotional language: "best patches", "click here", "amazing quality"
- Irrelevant keywords: Don't mention features not visible in the image

### Accessibility Requirements:
1. **Describe visible content** - What can actually be seen in the image
2. **Be specific** - "Firefighter patch with Maltese cross" not just "Patch"
3. **Avoid redundancy** - Don't say "image of" or "picture of"
4. **Context matters** - Different pages may need slightly different descriptions

---

## Technical Implementation

### Data Flow:

```
Sanity CMS (Alt Text Field)
    ↓
GROQ Query (Fetch alt text)
    ↓
Component Props (Pass alt to Image component)
    ↓
Next.js Image Component (Render with alt attribute)
    ↓
HTML Output (SEO-optimized img tag)
```

### Fallback System:

All components implement a **3-tier fallback system**:

1. **Primary:** Use alt text from Sanity CMS
2. **Secondary:** Use context-aware fallback with patch type
3. **Tertiary:** Generic but descriptive fallback

```tsx
alt={
  img.alt ||  // Sanity alt text (primary)
  `${activeType} custom patch sample showcasing detailed craftsmanship | Panda Patches` ||  // Context-aware (secondary)
  "Custom patch work sample | Panda Patches"  // Generic (tertiary)
}
```

---

## Monitoring & Maintenance

### Monthly Audit Checklist:

- [ ] Check Sanity Studio for images missing alt text
- [ ] Review Google Search Console for image indexing issues
- [ ] Validate alt text length (aim for 100-125 characters)
- [ ] Test screen readers on key pages
- [ ] Update alt text for seasonal/promotional images

### Analytics to Track:

1. **Google Search Console:**
   - Image search impressions
   - Image search clicks
   - Image index coverage

2. **Accessibility Audit:**
   - Run Lighthouse accessibility score monthly
   - Target: 100% alt text coverage
   - Use axe DevTools for WCAG compliance

---

## Category-Specific Templates

### Fire Department Patches:
```
"[Type] fire department patch with [feature] for [use] | Panda Patches"
```
Example: `"Embroidered fire department patch with Maltese cross for turnout gear | Panda Patches"`

### Police Patches:
```
"[Type] police [item] patch featuring [design element] for [unit/dept] | Panda Patches"
```
Example: `"PVC tactical patch featuring subdued badge for SWAT team | Panda Patches"`

### Sports Team Patches:
```
"[Type] [sport] team patch with [feature] for [apparel] | Panda Patches"
```
Example: `"Chenille baseball team patch with mascot logo for varsity jackets | Panda Patches"`

### Corporate Patches:
```
"[Type] corporate [item] patch with [feature] for [purpose] | Panda Patches"
```
Example: `"Woven corporate logo patch with Pantone colors for employee uniforms | Panda Patches"`

---

## Future Automation Opportunities

### Potential Enhancements:

1. **AI-Assisted Alt Text Generation:**
   - Use GPT-4 Vision API to suggest alt text during upload
   - Content manager reviews and approves suggestion
   - Reduces time to create descriptive alt text

2. **Bulk Alt Text Editor:**
   - Create Sanity Studio plugin for batch editing
   - Filter images missing alt text
   - Apply templates to multiple images at once

3. **Alt Text Quality Score:**
   - Build validator that scores alt text quality (0-100)
   - Flag alt text that's too short, too long, or missing keywords
   - Provide suggestions for improvement

4. **Automated SEO Reports:**
   - Weekly email with alt text coverage percentage
   - List of recently uploaded images needing alt text
   - Top-performing alt text by image search traffic

---

## Common Mistakes to Avoid

### ❌ DON'T:
- Use filename as alt text: `"IMG_1234.jpg"`
- Leave alt text empty or use generic "image" or "photo"
- Stuff keywords: `"custom patches custom embroidered custom made"`
- Use the same alt text for all images
- Include "image of" or "picture of" (redundant)
- Make it too long (over 150 characters)

### ✅ DO:
- Be specific and descriptive
- Include relevant keywords naturally
- Match alt text to page context
- Keep it concise (100-125 characters ideal)
- End with "| Panda Patches" for brand consistency
- Consider what a screen reader user would need to know

---

## Validation Rules

All alt text must pass these checks:

1. **Required Field:** Cannot be empty (Sanity validation)
2. **Length:** 50-150 characters recommended
3. **Keywords:** Contains at least one relevant patch keyword
4. **Brand:** Ends with "| Panda Patches" (optional but recommended)
5. **Uniqueness:** Not duplicated across different images
6. **Descriptive:** Actually describes visual content

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│         PANDA PATCHES ALT TEXT FORMULA                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Patch Type] + [Key Feature] + [Context] | Brand       │
│                                                          │
│  Example:                                                │
│  "Custom embroidered police badge patch with           │
│   detailed shield embroidery | Panda Patches"           │
│                                                          │
│  Length: 100-125 characters (optimal)                    │
│  Keywords: Natural, relevant, no stuffing                │
│  Context: Matches page/category                          │
│  Brand: Always end with "| Panda Patches"               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Support & Questions

For questions about alt text guidelines:
- **Technical:** Review this document and component implementation
- **Content:** Follow the formula and category templates above
- **SEO Strategy:** Focus on descriptive, keyword-rich, natural language

**Remember:** Every image tells a story. Alt text is how you tell that story to search engines and visually impaired users. Make it count!

---

*Last Updated: February 2026*
*Maintained by: Panda Patches Development Team*
