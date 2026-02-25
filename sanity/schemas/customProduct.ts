import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customProduct',
  title: 'Custom Product Pages (Pins/Coins)',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main Info' },
    { name: 'commerce', title: 'Commerce & UCP' },
    { name: 'details', title: 'Zig-Zag Types' },
    { name: 'options', title: 'Option Carousels' },
    { name: 'seo', title: 'SEO & Content' },
  ],
  fields: [
    // === MAIN INFO ===
    defineField({ 
      name: 'title', 
      title: 'Product Title', 
      type: 'string', 
      group: 'main', 
      validation: r => r.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      options: { source: 'title' }, 
      group: 'main', 
      validation: r => r.required() 
    }),
    defineField({
      name: 'heroImage',
      title: 'Main Product Image (for listing page)',
      type: 'image',
      options: { hotspot: true },
      group: 'main',
      description: 'Main image shown on the Custom Products listing page'
    }),
    defineField({
      name: 'gallery',
      title: 'Hero Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'main',
      description: 'Upload 3-4 images here for the Main Hero on individual product page.'
    }),
    defineField({ 
      name: 'description', 
      title: 'Hero Description', 
      type: 'text', 
      rows: 4, 
      group: 'main' 
    }),
    defineField({ 
      name: 'basePrice', 
      title: 'Starting Price (Optional)', 
      type: 'string', 
      group: 'main' 
    }),
    defineField({ 
      name: 'workSamples', 
      title: 'Work Sample Gallery', 
      type: 'array', 
      of: [{ type: 'image', options: { hotspot: true } }], 
      group: 'main' 
    }),
    defineField({
      name: 'idealFor',
      title: 'Ideal For (Bullet Points)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'main'
    }),

    // === UCP / GOOGLE MERCHANT CENTER FIELDS ===
    defineField({
      name: 'sku',
      title: 'SKU (Stock Keeping Unit)',
      type: 'string',
      description: 'Unique product identifier for inventory and Google Shopping',
      group: 'commerce',
      validation: (rule) => rule.custom((sku) => {
        if (!sku) return true;
        const isValid = /^[A-Z0-9_-]+$/i.test(sku);
        return isValid || 'SKU must contain only letters, numbers, dashes, and underscores';
      }),
    }),
    defineField({
      name: 'gtin',
      title: 'GTIN / UPC / Barcode',
      type: 'string',
      description: 'Global Trade Item Number for Google Merchant Center (optional for custom products)',
      group: 'commerce',
    }),
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'InStock' },
          { title: 'Made to Order (7-14 days)', value: 'MadeToOrder' },
          { title: 'Pre-Order', value: 'PreOrder' },
          { title: 'Out of Stock', value: 'OutOfStock' },
        ],
        layout: 'radio',
      },
      initialValue: 'MadeToOrder',
      group: 'commerce',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'leadTime',
      title: 'Lead Time / Delivery Estimate',
      type: 'string',
      description: 'e.g., "7-14 days", "3-5 business days"',
      initialValue: '7-14 days',
      group: 'commerce',
    }),
    defineField({
      name: 'pricingTiers',
      title: 'Pricing Tiers (for bulk orders)',
      type: 'array',
      of: [
        defineField({
          name: 'priceTier',
          type: 'object',
          fields: [
            defineField({
              name: 'minQuantity',
              title: 'Minimum Quantity',
              type: 'number',
              validation: (rule) => rule.required().positive().integer(),
            }),
            defineField({
              name: 'maxQuantity',
              title: 'Maximum Quantity',
              type: 'number',
              description: 'Leave empty for unlimited upper range (e.g., 500+)',
              validation: (rule) => rule.positive().integer(),
            }),
            defineField({
              name: 'unitPrice',
              title: 'Unit Price (USD)',
              type: 'number',
              validation: (rule) => rule.required().positive(),
            }),
          ],
          preview: {
            select: {
              min: 'minQuantity',
              max: 'maxQuantity',
              price: 'unitPrice',
            },
            prepare({ min, max, price }) {
              return {
                title: `${min}${max ? `-${max}` : '+'} units`,
                subtitle: `$${price.toFixed(2)} per unit`,
              };
            },
          },
        }),
      ],
      group: 'commerce',
      description: 'Define price breaks for different quantity ranges',
    }),
    defineField({
      name: 'materials',
      title: 'Materials Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Metal (Zinc Alloy)', value: 'Metal (Zinc Alloy)' },
          { title: 'Brass', value: 'Brass' },
          { title: 'Copper', value: 'Copper' },
          { title: 'Enamel', value: 'Enamel' },
          { title: 'Gold Plating', value: 'Gold Plating' },
          { title: 'Silver Plating', value: 'Silver Plating' },
          { title: 'Nickel Plating', value: 'Nickel Plating' },
          { title: 'Epoxy Coating', value: 'Epoxy Coating' },
          { title: 'Rubber Backing', value: 'Rubber Backing' },
        ],
      },
      group: 'commerce',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        defineField({ name: 'width', title: 'Width', type: 'number', description: 'in inches' }),
        defineField({ name: 'height', title: 'Height', type: 'number', description: 'in inches' }),
        defineField({ name: 'depth', title: 'Depth/Thickness', type: 'number', description: 'in inches' }),
      ],
      group: 'commerce',
    }),
    defineField({
      name: 'weight',
      title: 'Shipping Weight',
      type: 'object',
      fields: [
        defineField({ name: 'value', title: 'Weight Value', type: 'number' }),
        defineField({
          name: 'unit',
          title: 'Unit',
          type: 'string',
          options: {
            list: [
              { title: 'Ounces (oz)', value: 'oz' },
              { title: 'Pounds (lb)', value: 'lb' },
              { title: 'Grams (g)', value: 'g' },
              { title: 'Kilograms (kg)', value: 'kg' },
            ],
          },
          initialValue: 'oz',
        }),
      ],
      group: 'commerce',
    }),

    // === ZIG ZAG TYPES ===
    defineField({
      name: 'productTypesHeading',
      title: 'Types Section Heading',
      type: 'string',
      initialValue: 'Available Types',
      group: 'details',
      description: 'e.g. "Custom Pin Styles" or "Coin Finishes"'
    }),
    defineField({
      name: 'productTypes',
      title: 'Product Types List (Zig Zag)',
      type: 'array',
      of: [
        defineField({
          name: 'productType',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          ]
        })
      ],
      group: 'details'
    }),

    // === OPTION CAROUSELS ===
    defineField({ 
      name: 'option1Title', 
      title: 'Carousel 1 Title', 
      type: 'string', 
      group: 'options', 
      description: 'e.g. "Plating Options"' 
    }),
    defineField({ 
      name: 'option1Subtitle', 
      title: 'Carousel 1 Subtitle', 
      type: 'string', 
      group: 'options' 
    }),
    defineField({ 
      name: 'option1Cards', 
      title: 'Carousel 1 Cards', 
      type: 'array', 
      of: [
        defineField({
          name: 'option1Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          ]
        })
      ], 
      group: 'options' 
    }),

    defineField({ 
      name: 'option2Title', 
      title: 'Carousel 2 Title', 
      type: 'string', 
      group: 'options', 
      description: 'e.g. "Backing Attachments"' 
    }),
    defineField({ 
      name: 'option2Subtitle', 
      title: 'Carousel 2 Subtitle', 
      type: 'string', 
      group: 'options' 
    }),
    defineField({ 
      name: 'option2Cards', 
      title: 'Carousel 2 Cards', 
      type: 'array', 
      of: [
        defineField({
          name: 'option2Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          ]
        })
      ], 
      group: 'options' 
    }),

    defineField({ 
      name: 'option3Title', 
      title: 'Carousel 3 Title', 
      type: 'string', 
      group: 'options', 
      description: 'e.g. "Packaging"' 
    }),
    defineField({ 
      name: 'option3Subtitle', 
      title: 'Carousel 3 Subtitle', 
      type: 'string', 
      group: 'options' 
    }),
    defineField({ 
      name: 'option3Cards', 
      title: 'Carousel 3 Cards', 
      type: 'array', 
      of: [
        defineField({
          name: 'option3Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          ]
        })
      ], 
      group: 'options' 
    }),

    // === SEO TEXT ===
    defineField({ 
      name: 'seoTop', 
      title: 'Top SEO Text', 
      type: 'array', 
      of: [{ type: 'block' }], 
      group: 'seo' 
    }),
    defineField({ 
      name: 'seoBottom', 
      title: 'Bottom SEO Text', 
      type: 'array', 
      of: [{ type: 'block' }], 
      group: 'seo' 
    }),
  ],
})
