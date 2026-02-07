import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'threadOptions',
  title: 'Product - Thread Options',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Patch Thread Options' }),
    defineField({ name: 'subtitle', title: 'Sub Heading', type: 'string', initialValue: 'Patch Embroidered Patch' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          defineField({ name: 'image', title: 'Image', type: 'image' }),
        ]
      }]
    }),
  ],
})
