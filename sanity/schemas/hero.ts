import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Home - Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Main Heading',
      type: 'string',
      description: 'The big text (e.g., "Custom Iron On Patches...")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Text',
      type: 'text',
      description: 'The paragraph below the heading.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Patch Pile Image',
      type: 'image',
      options: { hotspot: true },
      description: 'The big image of the patches on the left.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (SEO)',
          type: 'string',
          description: 'Describe the image for SEO: e.g., "Custom embroidered patches display featuring police, sports, and military designs"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'image',
            title: 'Badge Image',
            type: 'image',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'alt',
            title: 'Badge Name',
            type: 'string',
            description: 'e.g., "Trustpilot 5-star rating", "Google Verified Business"',
            validation: (rule) => rule.required(),
          }),
        ],
        preview: {
          select: {
            title: 'alt',
            media: 'image',
          },
        },
      }],
      description: 'Upload logos like Etsy, Trustpilot, Google with descriptive names.',
    }),
  ],
})