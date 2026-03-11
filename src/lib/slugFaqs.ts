// Per-slug unique FAQs for custom-patches/[slug] product pages.
// Each patch type gets distinct questions relevant to that material.

interface FAQItem {
  question: string;
  answer: string;
}

const embroideredFaqs: FAQItem[] = [
  {
    question: "What thread coverage percentage is recommended for embroidered patches?",
    answer: "We recommend 70-80% thread coverage for most logos. Full coverage (100%) creates a richer look but costs slightly more and is best for bold, simple designs. We guide you to the right coverage during the free mockup review."
  },
  {
    question: "What backing options are available for embroidered patches?",
    answer: "Embroidered patches are available with iron-on, sew-on, velcro, peel-and-stick, and heat-seal backings. Iron-on is most popular for casual apparel. Sew-on is best for uniforms and high-wash items. Velcro is ideal for tactical and removable applications."
  },
  {
    question: "How many thread colors can you use in an embroidered patch?",
    answer: "Standard embroidered patches include up to 8 thread colors at no extra charge. Additional colors are available for a small fee. We use Pantone-matched threads to replicate your brand colors accurately."
  },
  {
    question: "What is the minimum size for an embroidered patch?",
    answer: "Embroidered patches can be made as small as 1 inch, though 2-4 inches is the most popular range. For very small patches with fine details, we recommend woven patches instead, which can handle thinner lines and smaller fonts."
  },
  {
    question: "Do embroidered patches fade or fray over time?",
    answer: "Our patches use high-tenacity polyester thread rated for 50+ wash cycles without significant fading. The edges are merrowed (overstitched) to prevent fraying. For maximum longevity, wash inside-out in cold water and avoid tumble drying."
  },
  {
    question: "What is your minimum order for embroidered patches?",
    answer: "Our minimum order is 5 pieces for embroidered patches. Volume discounts apply at 50, 100, 200, and 500+ pieces. The more you order, the lower the per-patch price."
  },
];

const pvcFaqs: FAQItem[] = [
  {
    question: "Are PVC patches waterproof and suitable for outdoor gear?",
    answer: "Yes. PVC (polyvinyl chloride) patches are 100% waterproof, UV-resistant, and rated for outdoor use. They are commonly used on tactical gear, bags, hats, and outdoor apparel that is exposed to rain, sweat, and sunlight."
  },
  {
    question: "Can PVC patches have 3D raised detail?",
    answer: "Absolutely. PVC patches are molded, allowing multiple layers of raised 3D elements. We can create up to 4 levels of depth, giving your logo a premium, sculptural look that embroidery cannot replicate."
  },
  {
    question: "How many colors are available for PVC patches?",
    answer: "PVC patches can be made in virtually any Pantone color. Unlike embroidery, color blending is more limited, but solid colors are vivid and highly accurate. We match your brand colors using Pantone references."
  },
  {
    question: "What backing options do PVC patches come with?",
    answer: "PVC patches are available with hook velcro, loop velcro, sew-on, or adhesive backing. Velcro-backed PVC patches are especially popular for military, law enforcement, and tactical applications."
  },
  {
    question: "What is the minimum order for PVC patches?",
    answer: "Our minimum order for PVC patches is 10 pieces. Volume discounts apply from 50 pieces upward. Rush production (7 business days) is available for an additional fee."
  },
  {
    question: "How durable are PVC patches compared to embroidered patches?",
    answer: "PVC patches are generally more durable in wet and outdoor conditions than embroidered patches. They do not absorb water, resist tearing, and maintain color without fading under UV exposure. Embroidered patches, however, have a softer, more traditional textile feel."
  },
];

const wovenFaqs: FAQItem[] = [
  {
    question: "What makes woven patches different from embroidered patches?",
    answer: "Woven patches are made by weaving extremely thin threads together like fabric, rather than stitching thread onto a base. The result is a flat, smooth surface that can reproduce much finer detail, smaller fonts, and more intricate artwork than embroidered patches."
  },
  {
    question: "What is the smallest font size that woven patches can reproduce?",
    answer: "Woven patches can accurately reproduce text as small as 4pt font, compared to 8-10pt minimum for embroidery. This makes them ideal for detailed logos, fine lines, and designs with small lettering."
  },
  {
    question: "Are woven patches thinner than embroidered patches?",
    answer: "Yes. Woven patches lie almost flat (1-2mm thick) compared to embroidered patches (3-5mm). This makes them ideal for lightweight garments, labels, and applications where a low-profile look is important."
  },
  {
    question: "What backing options are available for woven patches?",
    answer: "Woven patches are available with iron-on, sew-on, peel-and-stick, and velcro backings. Iron-on woven patches are commonly used as clothing labels and brand tags."
  },
  {
    question: "How many colors can a woven patch include?",
    answer: "Woven patches typically support up to 8 thread colors. Because threads are woven together, gradients and color transitions are smoother than embroidery, making them ideal for complex multi-color logos."
  },
  {
    question: "What is the minimum order for woven patches?",
    answer: "Our minimum order for woven patches is 10 pieces. Orders of 50, 100, and 500+ pieces receive volume discounts. Woven patches have slightly higher setup costs than embroidered patches due to the weaving process."
  },
];

const chenilleFaqs: FAQItem[] = [
  {
    question: "What are chenille patches and what do they feel like?",
    answer: "Chenille patches are made from a looped pile yarn (the same material as varsity sweaters and luxury towels), giving them a distinctive fuzzy, raised texture. They have a premium, tactile quality that makes them popular for varsity jackets, athletic wear, and fashion apparel."
  },
  {
    question: "Can chenille patches include embroidered details?",
    answer: "Yes. Most chenille patches combine chenille fill for large areas with embroidery for fine details, outlines, lettering, and borders. This hybrid approach gives you the best of both materials in a single patch."
  },
  {
    question: "Are chenille patches washable?",
    answer: "Yes, but with care. We recommend machine washing inside-out in cold water on a gentle cycle, then laying flat to dry. Avoid tumble drying, ironing directly on the chenille, or dry cleaning with harsh chemicals, which can flatten the pile."
  },
  {
    question: "What sizes do chenille patches come in?",
    answer: "Chenille patches are typically produced in larger sizes (3 inches and up) because the fuzzy texture does not read well at very small sizes. Most popular sizes are 4-8 inches for jackets and large letter patches. Smaller chenille elements are often combined with embroidery for detail."
  },
  {
    question: "What is the minimum order for chenille patches?",
    answer: "Our minimum order for chenille patches is 5 pieces. Due to the hand-finishing involved, chenille patches cost more per piece than embroidered patches, but volume pricing makes them competitive for team and school orders of 50+ pieces."
  },
  {
    question: "Can you make chenille letter patches for varsity jackets?",
    answer: "Yes. Chenille letter patches are one of our specialties. We produce chenille alphabet letters in any size, color, and font. We also produce school mascots, athletic numbers, and award patches using chenille fill with embroidered detail."
  },
];

const leatherFaqs: FAQItem[] = [
  {
    question: "Do you use genuine leather or synthetic leather for patches?",
    answer: "We offer both genuine leather and premium synthetic (faux) leather patches. Genuine leather has natural grain and aging characteristics. Synthetic leather is more consistent, vegan-friendly, and slightly more affordable. Both options accept laser engraving, embossing, and embroidered detail."
  },
  {
    question: "Can leather patches be laser engraved or debossed?",
    answer: "Yes. Laser engraving creates a permanent, precise marking by burning the leather surface. Debossing presses a design into the leather with a heated die, creating a classic branded look. Both methods are included in our standard leather patch production."
  },
  {
    question: "How are leather patches attached to clothing?",
    answer: "Leather patches are available with sew-on, iron-on, or adhesive backing. Sew-on is most durable for denim jackets and jeans labels. Iron-on backing uses a heat-activated adhesive. Some leather patches are provided with pre-punched holes for custom lacing attachment."
  },
  {
    question: "What colors are available for leather patches?",
    answer: "Natural, tan, brown, black, navy, and dark green are the most common leather patch colors. Custom-dyed colors are available for genuine leather. We can also apply screen printing or foil stamping on top of the leather for multi-color designs."
  },
  {
    question: "Are leather patches waterproof?",
    answer: "Genuine leather is water-resistant but not fully waterproof. Synthetic leather patches are more water-resistant and easier to maintain. We apply a protective coating to all leather patches to enhance durability and water resistance."
  },
  {
    question: "What is the minimum order for leather patches?",
    answer: "Our minimum order for leather patches is 10 pieces. For genuine leather, longer production time (14-18 business days) is standard due to material preparation and hand-finishing. Rush options are available."
  },
];

const printedFaqs: FAQItem[] = [
  {
    question: "Can printed patches reproduce photographic images?",
    answer: "Yes. Sublimation-printed patches can reproduce full-color photographic images, gradients, and complex artwork with photo-realistic quality. This is not possible with embroidered or woven patches, making printed patches ideal for portrait patches, detailed illustrations, and full-color brand imagery."
  },
  {
    question: "How durable are printed patches compared to embroidered patches?",
    answer: "Printed patches are highly durable with proper care. We use UV-resistant, fade-proof inks. The print is sealed under a protective coating. However, embroidered patches generally have a longer lifespan under heavy washing conditions. For best results, wash printed patches inside-out in cold water."
  },
  {
    question: "What file formats work best for printed patches?",
    answer: "High-resolution PNG, TIFF, or PDF files work best for printed patches. We require a minimum of 300 DPI at the final printed size. Vector files (AI, EPS, SVG) are also accepted and provide the sharpest output. Low-resolution images may appear blurry when scaled up."
  },
  {
    question: "What shape options are available for printed patches?",
    answer: "Printed patches can be cut to any shape: circle, square, rectangle, oval, or fully custom die-cut to the outline of your design. Custom die-cut printed patches give a professional, polished look with no visible background fabric."
  },
  {
    question: "What is the minimum order for printed patches?",
    answer: "Our minimum order for printed patches is 10 pieces. Unlike embroidered patches, there are no color limitations — full-color printing is included at the same price regardless of the number of colors in your design."
  },
  {
    question: "Can printed patches be used for photo patches or memorial patches?",
    answer: "Yes. Printed patches are perfect for memorial patches, photo patches, and commemorative patches. We can reproduce a portrait, team photo, or any photograph onto a patch with high clarity. These are popular for memorial jackets, tribute patches, and custom gifts."
  },
];

const sequinFaqs: FAQItem[] = [
  {
    question: "What are sequin patches and how do they work?",
    answer: "Sequin patches feature tiny reflective discs (sequins) stitched or bonded onto a fabric base to create a shimmering, eye-catching effect. They are popular for dance costumes, cheerleading uniforms, fashion apparel, and special event wear."
  },
  {
    question: "Can sequin patches change color when brushed?",
    answer: "Yes. We offer reversible (flip) sequin patches where each sequin has two different-colored sides. Brushing the sequins in one direction reveals one color; brushing the opposite direction reveals the second color. This creates an interactive, attention-grabbing effect perfect for cheer and dance uniforms."
  },
  {
    question: "Are sequin patches suitable for machine washing?",
    answer: "Sequin patches should be hand-washed in cold water or machine washed on a delicate cycle inside a mesh laundry bag. Avoid tumble drying and high heat, which can melt or dislodge sequins. Ironing directly on sequins will damage them — always iron from the reverse side."
  },
  {
    question: "What colors are available for sequin patches?",
    answer: "Sequin patches are available in gold, silver, red, blue, green, pink, purple, black, white, holographic, and custom colors. For flip sequin patches, we can combine any two colors for the reversible effect."
  },
  {
    question: "What size can sequin patches be made?",
    answer: "Sequin patches are most effective at larger sizes (3 inches and up) because fine details are difficult to achieve with individual sequins. Most popular sizes are 4-8 inches. We often combine sequin fill with embroidered outlines and lettering for complex designs."
  },
  {
    question: "What is the minimum order for sequin patches?",
    answer: "Our minimum order for sequin patches is 10 pieces. Due to the hand-finishing and sequential placement of sequins, production times are slightly longer (14-18 days). Rush production is available for an additional fee."
  },
];

export const slugFaqMap: Record<string, FAQItem[]> = {
  embroidered: embroideredFaqs,
  pvc: pvcFaqs,
  woven: wovenFaqs,
  chenille: chenilleFaqs,
  leather: leatherFaqs,
  printed: printedFaqs,
  sequin: sequinFaqs,
};
