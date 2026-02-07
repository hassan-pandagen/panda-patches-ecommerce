import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'patchTypes',
  title: 'Patch Types Slider',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Patch Name (e.g. Custom Embroidered Patches)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'idealFor',
      title: 'Ideal For (List)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add items like "Military", "Scouts", etc.'
    }),
    defineField({
      name: 'image',
      title: 'Patch Image',
      type: 'image',
      options: { hotspot: true }
    }),
  ],
})
