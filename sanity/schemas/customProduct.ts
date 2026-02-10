import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customProduct',
  title: 'Custom Product Pages (Pins/Coins)',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main Info' },
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
