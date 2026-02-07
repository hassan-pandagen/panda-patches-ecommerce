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
      of: [{ type: 'image' }],
      description: 'Upload 4-8 high quality photos of finished patches.'
    }),
  ],
})
