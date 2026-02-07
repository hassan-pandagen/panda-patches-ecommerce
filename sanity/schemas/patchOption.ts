import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'patchOption',
  title: 'Product Info Cards',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Card Title (e.g. Patch Material)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'image',
      title: 'Card Image',
      type: 'image',
      options: { hotspot: true }
    }),
  ],
})
