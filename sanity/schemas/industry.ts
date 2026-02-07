import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'industry',
  title: 'Home - Industry Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      initialValue: 'CUSTOMIZED IRON ON PATCHES FOR VARIOUS INDUSTRIES'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'cards',
      title: 'Industry Cards',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Card Title', type: 'string' }),
          defineField({ name: 'image', title: 'Card Image', type: 'image' }),
          defineField({ name: 'text', title: 'Card Text', type: 'text', rows: 3 }),
          defineField({ 
            name: 'list', 
            title: 'Ideal For List', 
            type: 'array', 
            of: [{ type: 'string' }] 
          }),
        ]
      }]
    }),
  ],
})
