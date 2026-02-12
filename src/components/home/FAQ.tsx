'use client'

import { useEffect, useState } from "react";
import FAQList from "./FAQList";

interface FAQData {
  heading?: string;
  questions: Array<{ question: string; answer: string }>;
}

export default function FAQ() {
  const [data, setData] = useState<FAQData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch FAQ data from Sanity on client side
    const getFAQData = async () => {
      try {
        // You can add client-side fetch here if needed
        setData(null);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        setData(null);
      }
    };
    getFAQData();
  }, []);

  // Fallback Data if Sanity is empty - ALL 18 FAQs
   const questions = data?.questions || [
     // TIER 1 - CORE FAQs (1-6)
     { 
       question: "What's your quality guarantee?", 
       answer: "We guarantee 100% satisfaction. Our patches go through 5-point quality inspection: thread tension verification, color matching confirmation, backing durability test, stitch integrity check, and final visual inspection. If you receive patches that don't meet your expectations, contact us within 48 hours for a remake or refund. We use military-grade thread and professional twill backing. Real-world durability: 50+ washing cycles without fading, outdoor wear and weather exposure, daily friction and contact. Used by military units, police departments, and sports teams that demand durability. Why trust us: Military and police departments use us, 1000+ 5-star reviews, professional sports teams, 99.2% orders approved without issues." 
     },
     { 
       question: "Embroidered vs Woven vs Chenille vs PVC—which should I choose?", 
       answer: "Each material has unique benefits. Embroidered patches offer classic texture at affordable cost—great for sports teams and fashion. Woven patches handle fine details perfectly—ideal for band logos and complex designs. PVC patches are waterproof and durable for outdoor use. Chenille has a luxury fuzzy feel for premium look. Tell us your design and we'll recommend the best option. EMBROIDERED: Thread stitched onto fabric, classic look, 2-4\" ideal, $0.85-$2.50 per patch. WOVEN: Ultra-thin threads woven together, photo-like clarity, any size, $1.20-$3.50 per patch. PVC: Waterproof plastic, 3D effects, outdoor durable, custom pricing. CHENILLE: Fuzzy varsity look, luxury feel, $2.50-$6.00 per patch." 
     },
     { 
       question: "What size should my patch be?", 
       answer: "Most patches are 2-4 inches for standard wear. Embroidered patches work best at 2-4\". Woven patches can be smaller (1-2\") with fine details. Consider where the patch will be worn: hats (2-3\"), jackets (3-4\"), or bags (4-6\"). We'll show you size options during design approval. Large (5-6\"): Back of jacket, statement wear, simple logos. Medium (3-4\"): Chest, sleeves, hat front, most popular. Small (2-2.5\"): Hat back, subtle branding, lower cost. Our design team can help recommend the perfect size for your design." 
     },
     { 
       question: "How much do custom patches cost?", 
       answer: "Pricing depends on patch type, size, and quantity. Embroidered patches typically range from $1-3 per patch with volume discounts. Woven patches cost 20-30% more due to fine detail capability. PVC patches are similarly priced to embroidered. Volume discounts: 5-50 pieces (standard), 51-200 (5% off), 201-500 (10% off), 501+ (15% off). Examples: 5-10 patches ($3-5 each), 50-100 patches ($2-3.50 each), 500+ patches ($1-2 each). Get an instant quote after uploading your design." 
     },
     { 
       question: "What's your turnaround time?", 
       answer: "Standard production: 10-14 business days. Rush option: 5-7 business days. Express: 2-3 business days. All timelines start after design approval (mockup phase = 1-2 days). Shipping typically adds 3-7 business days depending on your location. Total timeline: 13-21 days standard, 8-14 days rush, 3-6 days express. Important: timelines exclude weekends and holidays, we start counting after design approval, tracking provided for all orders." 
     },
     { 
       question: "What's your design approval process?", 
       answer: "Step 1: Submit your design (instant). Step 2: We create a digital mockup (1-2 days). Step 3: You review and request changes. Step 4: Unlimited free revisions until you approve. Step 5: Payment and production starts immediately. Step 6: We ship with tracking and care instructions. Total approval phase: 3-5 days from submission to production start. We'll revise for free as many times as needed. We don't move to production until you say YES. This is why mockup phase is so important." 
     },

     // TIER 2 - EMBROIDERED SPECIFIC FAQs (7-9)
     { 
       question: "What makes embroidered patches durable?", 
       answer: "Our embroidered patches use military-grade thread and professional twill backing, making them incredibly durable. Premium colorfast, high-strength threads resist fading even after hundreds of washes. Double-reinforced twill backing prevents fraying. Every embroidered patch goes through 5-point quality inspection. Real-world durability: 50+ washing cycles without fading, outdoor wear and weather exposure, daily friction and contact, storage without deterioration. Used by military units, police departments, and sports teams demanding durability. Comparison to low-quality patches: Cheap patches use thin threads and weak backing—they fray after 5-10 washes. Our patches are built to last years, not weeks." 
     },
     { 
       question: "Can embroidered patches handle outdoor/weather exposure?", 
       answer: "Yes, but with limitations. Embroidered patches handle well: rain and moisture (if properly sealed), temperature changes, UV exposure (though colors may fade over time), regular outdoor wear. DON'T handle well: saltwater/marine environments (salt corrodes threads), extreme prolonged moisture (backing deteriorates), intense UV (colors fade after 2+ years), harsh chemicals or solvents. Best use: Outdoor jackets, hiking gear, casual outdoor wear. For extreme conditions (tactical gear, marine, expeditions), consider PVC patches instead—they're waterproof and weather-resistant. Pro tips: Use UV-protective thread colors (darker colors fade less), position patches in less direct sun, store in cool/dry places, reapply waterproof sealant annually if needed." 
     },
     { 
       question: "What's the difference between embroidered and woven patches?", 
       answer: "Both use thread, but work differently. EMBROIDERED: Thicker raised stitches, 3D appearance, good for bold logos/large text, simple-moderate designs, more affordable, 2-4\" ideal size, classic look, may fray slightly over time. WOVEN: Thin flat threads woven together, smooth flat surface, excellent fine detail/small text, complex designs with 10+ colors, photo-like clarity, any size, modern appearance, extremely durable. Choose embroidered for classic/cost-effective. Choose woven for intricate details. We can show you mockups in both styles to decide which looks better for your project." 
     },

     // TIER 2 - WOVEN SPECIFIC FAQs (10-11)
     { 
       question: "Can woven patches show tiny text and fine details?", 
       answer: "Yes—that's the main advantage! Woven patches use ultra-thin threads woven together, creating a 'pixel-like' effect for fine detail. CAN DO: Small text (as small as 1/4 inch readable), complex logos with 10+ colors, photo-like clarity and shading, intricate designs with fine lines, gradient colors and color blending, realistic images and detailed artwork. EMBROIDERED CAN'T: Small text becomes unreadable, too many colors create muddy appearance, fine lines blend together, photo-like quality impossible. Perfect for: Band/music album art, company logos with fine lettering, realistic mascot designs, intricate military insignia, photo-realistic patches, small designs with lots of detail." 
     },
     { 
       question: "What file formats do you accept for patch design?", 
       answer: "PREFERRED: EPS, AI, PDF, SVG (vector formats—sharpest quality). ALSO ACCEPTED: PNG, JPG, TIFF (raster formats). EVEN HAND-DRAWN: Sketches, photos, rough concepts. Pro tips: Vector files are best for sharpness, high resolution (300 DPI minimum for raster), transparent background helpful, 8-10 colors ideal for embroidered, bold lines (avoid thin delicate lines). Can't find a file? Describe your design—we'll design it for you. Design services: format conversion, simplification, color adjustment, file optimization (adds 1-2 days)." 
     },

     // TIER 3 - SHIPPING & ORDERING FAQs (12-18)
     { 
       question: "What are your minimum order quantities?", 
       answer: "Minimum orders: Embroidered 5 pieces, Woven 10 pieces, PVC 10 pieces, Chenille 5 pieces. No expensive startup fees! Volume discounts: 5-50 (standard pricing), 51-200 (5% discount), 201-500 (10% discount), 501-1000 (15% discount), 1000+ (custom pricing). Examples: 5-10 patches ($3-5 each), 50-100 patches ($2-3.50 each), 500+ patches ($1-2 each). Want to test quality? Start with 10-25 patches—most customers do larger reorders." 
     },
     { 
       question: "How long does shipping take?", 
       answer: "PRODUCTION TIME: Standard 10-14 days, Rush 5-7 days, Express 2-3 days. SHIPPING TIME: US Standard 3-7 days, US Expedited 1-3 days, International 5-15 days. TOTAL TIMELINE: Standard 13-21 days, Rush 8-14 days, Express 3-6 days, International 15-29 days. Important: timelines exclude weekends/holidays, start after design approval, tracking provided for all orders. REAL EXAMPLE: Submit Monday → Mockup Wednesday → Approve Friday → Production Monday → Ships Thursday (10 days) → Arrives next week (5-7 days) = 18 days total." 
     },
     { 
       question: "How much does shipping cost?", 
       answer: "US SHIPPING: Small 5-25 patches ($8-15), Medium 25-100 ($12-25), Large 100-500 ($20-50), Bulk 500+ (custom quote). EXPEDITED: +$15-30 (1-2 day), +$30-50 (overnight). INTERNATIONAL: Canada $15-30 (5-10 days), Mexico $20-40 (7-15 days), Europe $25-60 (10-15 days), Australia $40-80 (12-20 days), Asia $50-100 (14-21 days). FREE SHIPPING: $500+ (standard) or $1000+ (expedited). MONEY TIPS: Combine orders, choose standard shipping, larger quantities = lower per-patch cost. All costs shown before checkout—no hidden fees!" 
     },
     { 
       question: "Can I make changes after I approve the design?", 
       answer: "BEFORE PRODUCTION (up to 24 hours): FREE CHANGES—colors, size, design tweaks, backing type, thread colors. AFTER PRODUCTION STARTS: LIMITED—can't pause production mid-run, changes require scrapping + restarting (costly), not recommended. AFTER SHIPMENT: NO CHANGES—but we accept returns within 48 hours if quality issue. TIPS: Review mockup carefully, ask questions before approval, request unlimited revisions (free), get stakeholder approval early. We don't move to production until you say YES." 
     },
     { 
       question: "Do you offer international shipping?", 
       answer: "YES! We ship to: Canada, Mexico, UK, Europe, Australia, New Zealand, Japan, Asia, most other countries. SHIPPING TIMES: Canada 5-10 days ($15-30), Mexico 7-15 days ($20-40), UK/Europe 10-15 days ($25-60), Australia 12-20 days ($40-80), Asia 14-21 days ($50-100). CUSTOMS: Recipient may pay import duties (we pay export), tracking to border, customs clearance 1-2 weeks. PROCESS: Enter international address → system calculates cost → customs form generated → we handle paperwork. EXPRESS OPTION: +$30-50 reduces delivery to 7-10 days (post-customs)." 
     },
     { 
       question: "Do you offer sample patches?", 
       answer: "YES! THREE OPTIONS: (1) Digital Mockup Sample (FREE, 1-2 days)—high-res digital image, design approval. (2) Pre-Production Sample (RECOMMENDED, $25-50, 3-5 days, refundable if 100+ order)—2-3 actual patches from production, verify quality/color/sizing. (3) Express Sample ($75-100, overnight/2-day)—2-3 patches fast. WHEN SAMPLES MAKE SENSE: first-time order, new design/material, unsure about colors, test with customers first. PROCESS: Request → we create mockup → you approve → we produce samples → inspect → confirm full order. Sample cost credited toward 100+ patch orders!" 
     },
     { 
       question: "What's your satisfaction guarantee?", 
       answer: "100% SATISFACTION GUARANTEE (30-day): Receive patches not meeting expectations? Contact within 48 hours. We either: remake at no cost OR refund minus shipping. COVERED: manufacturing defects (stitching, backing), color mismatches (if not approved in mockup), design clarity issues, damaged patches on arrival. NOT COVERED: customer-requested changes after production, damage after 2 weeks of use, improper care/application. OUR 5-POINT QUALITY INSPECTION: stitching check, color verification, backing integrity, size accuracy, overall appearance. SUPPORT: Questions anytime, 24-48 hour response, free design consultation." 
     }
   ];

  if (!mounted) {
    return null;
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-6">
        
        {/* HEADING - Mobile Optimized */}
        <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-center text-panda-dark uppercase tracking-wide mb-8 md:mb-12 lg:mb-16">
          {data?.heading || "FREQUENTLY ASKED QUESTIONS"}
        </h2>

        {/* LIST */}
        <FAQList questions={questions} />

      </div>
    </section>
  );
}
