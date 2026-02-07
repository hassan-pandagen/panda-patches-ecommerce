import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'patchStyle',
  title: 'Patch Style Pages (SEO)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (e.g. Custom Morale Patches)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    
    // HERO DATA
    defineField({
      name: 'description',
      title: 'Hero Short Description',
      type: 'text',
      rows: 3,
      description: 'The short text that appears next to the main image in the Hero.',
    }),
    defineField({
      name: 'gallery',
      title: 'Hero Gallery Images',
      type: 'array',
      of: [{ type: 'image' }]
    }),

    // SEO SECTION 1
    defineField({
      name: 'seoTitle1',
      title: 'SEO Heading 1',
      type: 'string'
    }),
    defineField({
      name: 'seoContent1',
      title: 'SEO Text 1 (Top)',
      type: 'array',
      of: [{ type: 'block' }]
    }),

    // WORK SAMPLES
    defineField({
      name: 'workSamples',
      title: 'Work Sample Gallery',
      type: 'array',
      of: [{ type: 'image' }]
    }),

    // SEO SECTION 2
    defineField({
      name: 'seoTitle2',
      title: 'SEO Heading 2',
      type: 'string'
    }),
    defineField({
      name: 'seoContent2',
      title: 'SEO Text 2 (Bottom)',
      type: 'array',
      of: [{ type: 'block' }]
    }),
  ],
})
