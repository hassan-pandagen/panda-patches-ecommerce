import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'assetResource',
  title: 'Asset - Single Image Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'The Giant Image',
      type: 'image',
      options: { hotspot: true }
    }),
  ],
})
