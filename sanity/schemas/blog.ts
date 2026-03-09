import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Blog Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Custom Patches', value: 'Custom Patches' },
          { title: 'Chenille Patches', value: 'Chenille Patches' },
          { title: 'Custom Military Patches', value: 'Custom Military Patches' },
          { title: 'Custom Business Patches', value: 'Custom Business Patches' },
          { title: 'Custom Sublimation Patches', value: 'Custom Sublimation Patches' },
          { title: 'Custom PVC Patch', value: 'Custom PVC Patch' },
          { title: 'Embroidery Patch Vs Woven Patch', value: 'Embroidery Patch Vs Woven Patch' },
          { title: 'Enamel Pins', value: 'Enamel Pins' },
          { title: 'Challenge Coin', value: 'Challenge Coin' },
          { title: 'Types Of Backing Options', value: 'Types Of Backing Options' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
