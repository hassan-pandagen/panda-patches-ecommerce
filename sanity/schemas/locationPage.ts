import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'locationPage',
  title: 'Location SEO Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'locationName',
      title: 'Location Name (e.g. Alabama)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { 
        source: (doc: any) => `custom-patches-in-${doc.locationName?.toLowerCase().replace(/\s+/g, '-')}` 
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Hero Gallery (Upload 3-4 images)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
    defineField({
      name: 'seoSection1',
      title: 'SEO Text 1 (Buy [Location] Patches)',
      type: 'array', 
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'seoSection2',
      title: 'SEO Text 2 (Why Choose Us / Ordering Made Easy)',
      type: 'array', 
      of: [{ type: 'block' }]
    }),
  ],
})
