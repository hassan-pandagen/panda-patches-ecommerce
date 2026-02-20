import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workSample',
  title: 'Product - Work Samples',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'WORK SAMPLE'
    }),
    defineField({
      name: 'images',
      title: 'Sample Images',
      type: 'array',
      of: [{
        type: 'image',
        fields: [
          defineField({
            name: 'alt',
            title: 'Alt Text (SEO)',
            type: 'string',
            description: 'Describe this work sample: e.g., "Custom police badge patch with detailed embroidery"',
            validation: (rule) => rule.required(),
          }),
        ],
      }],
      description: 'Upload 4-8 high quality photos of finished patches with SEO descriptions.'
    }),
  ],
})
