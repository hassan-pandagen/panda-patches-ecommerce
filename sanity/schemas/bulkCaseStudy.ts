import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bulkCaseStudy',
  title: 'Bulk Page - Case Studies',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Patch Photo (optional — add real photo to replace icon)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity (e.g. "800 pieces")',
      type: 'string',
    }),
    defineField({
      name: 'patchType',
      title: 'Patch Type (e.g. "Embroidered")',
      type: 'string',
    }),
    defineField({
      name: 'turnaround',
      title: 'Turnaround (e.g. "10 days")',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order (lower = first)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'image', patchType: 'patchType' },
    prepare({ title, media, patchType }) {
      return {
        title: title || 'Untitled',
        subtitle: patchType || '',
        media,
      }
    },
  },
})
