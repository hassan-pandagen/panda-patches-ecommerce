import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tag',
      title: 'Discount Tag',
      type: 'string',
      initialValue: '25% Off'
    }),
    defineField({
      name: 'category',
      title: 'Section Category',
      type: 'string',
      options: {
        list: [
          { title: 'Main Patches (Top 8)', value: 'main' },
          { title: 'Other Products (Bottom 4)', value: 'other' }
        ],
        layout: 'radio'
      },
      initialValue: 'main',
      validation: (rule) => rule.required(),
    }),
  ],
})
