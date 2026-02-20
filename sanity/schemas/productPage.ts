import { defineField, defineType } from 'sanity'

// Reusable Object for Option Cards
const optionCard = {
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (SEO)',
          type: 'string',
          description: 'Describe this option image for SEO',
        }),
      ],
    }),
  ]
}

export default defineType({
  name: 'productPage',
  title: 'Product Page Template',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main Info' },
    { name: 'options', title: 'Customization Options' },
    { name: 'gallery', title: 'Work Samples' },
  ],
  fields: [
    // === MAIN INFO ===
    defineField({ name: 'title', title: 'Page Title', type: 'string', group: 'main', validation: rule => rule.required() }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' }, group: 'main', validation: rule => rule.required() }),
    defineField({
      name: 'gallery',
      title: 'Hero Gallery',
      type: 'array',
      of: [{
        type: 'image',
        fields: [
          defineField({
            name: 'alt',
            title: 'Alt Text (SEO)',
            type: 'string',
            description: 'Describe this specific patch image for SEO',
            validation: (rule) => rule.required(),
          }),
        ],
      }],
      group: 'main'
    }),
    defineField({ name: 'description', title: 'Hero Description', type: 'text', rows: 4, group: 'main' }),

    // === CUSTOMIZATION OPTIONS (Specific to this Product) ===
    
    // 1. BACKING
    defineField({
      name: 'backingOptions',
      title: '1. Backing Options',
      type: 'array',
      of: [optionCard],
      group: 'options',
      description: 'Specific backings for this product (e.g. PVC backing vs Embroidery backing)'
    }),

    // 2. BORDERS
    defineField({
      name: 'borderOptions',
      title: '2. Border Options',
      type: 'array',
      of: [optionCard],
      group: 'options'
    }),

    // 3. THREADS / COLORS
    defineField({
      name: 'threadOptions',
      title: '3. Thread/Color Options',
      type: 'array',
      of: [optionCard],
      group: 'options'
    }),

    // 4. UPGRADES / ADDONS
    defineField({
      name: 'upgradeOptions',
      title: '4. Upgrades & Add-ons',
      type: 'array',
      of: [optionCard],
      group: 'options'
    }),

    // 5. PRODUCT TYPES / VARIANTS (Coin Types, Pin Styles, etc.)
    defineField({
      name: 'productVariants',
      title: '5. Product Types / Variants',
      description: 'Use this for "Coin Types", "Pin Styles", "Keychain Materials", etc.',
      type: 'object',
      group: 'options',
      fields: [
        defineField({ 
          name: 'heading', 
          title: 'Black Card Heading', 
          type: 'string', 
          initialValue: 'Coin Types' 
        }),
        defineField({ 
          name: 'subheading', 
          title: 'Black Card Subheading', 
          type: 'string', 
          initialValue: 'Customizable Challenge Coins' 
        }),
        defineField({
          name: 'types',
          title: 'The Cards',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', title: 'Title', type: 'string' }),
              defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
              defineField({ name: 'image', title: 'Image', type: 'image' }),
            ]
          }]
        })
      ]
    }),

    // === IDEAL FOR (Bullet Points) ===
    defineField({
      name: 'idealFor',
      title: 'Ideal For (Bullet Points)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List items like "Sports Teams", "Corporate Events", "Schools", etc.',
      group: 'main',
    }),

    // === WORK SAMPLES ===
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
      description: 'Real photos of THIS specific product type with SEO-friendly descriptions.'
    }),
  ],
})
