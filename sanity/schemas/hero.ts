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
    }),
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Upload logos like Etsy, Trustpilot, Google.',
    }),
  ],
})