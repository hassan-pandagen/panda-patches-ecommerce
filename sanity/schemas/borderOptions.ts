import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'borderOptions',
  title: 'Product - Border Options',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      initialValue: 'Patch Border Options'
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Heading',
      type: 'string',
      initialValue: 'Patch Embroidered Patch'
    }),
    defineField({
      name: 'cards',
      title: 'Border Cards',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Card Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          defineField({ name: 'image', title: 'Image', type: 'image' }),
        ]
      }]
    }),
  ],
})
