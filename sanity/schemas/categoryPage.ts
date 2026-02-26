import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoryPage',
  title: 'Category Pages (Bulk Orders)',
  type: 'document',
  fields: [
    // === MAIN INFO ===
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g., "Custom Fire Department Patches"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'e.g., "custom-fire-department-patches"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category Type',
      type: 'string',
      options: {
        list: [
          { title: 'Fire Department', value: 'fire-department' },
          { title: 'Police / Law Enforcement', value: 'police' },
          { title: 'Sports Teams', value: 'sports' },
          { title: 'Corporate / Business', value: 'corporate' },
          { title: 'Military', value: 'military' },
          { title: 'Schools / Universities', value: 'schools' },
          { title: 'Chenille TPU Patches', value: 'chenille-tpu' },
          { title: 'Chenille Glitter Patches', value: 'chenille-glitter' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),

    // === HERO IMAGE ===
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main hero image for this category page',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (SEO)',
          type: 'string',
          description: 'Describe the hero image for SEO',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // === WORK SAMPLES (5-6 IMAGES) ===
    defineField({
      name: 'workSamples',
      title: 'Work Sample Gallery (5-6 Images)',
      type: 'array',
      of: [{
        type: 'image',
        fields: [
          defineField({
            name: 'alt',
            title: 'Alt Text (SEO)',
            type: 'string',
            description: 'Describe this patch: e.g., "Custom embroidered fire department badge with Maltese cross design"',
            validation: (rule) => rule.required(),
          }),
        ],
      }],
      description: 'Upload 5-6 high-quality patch images specific to this category',
      validation: (rule) => rule.min(5).max(6).warning('Upload 5-6 images for best display'),
    }),

    // === SEO HEADING ===
    defineField({
      name: 'seoHeading',
      title: 'SEO Section Heading',
      type: 'string',
      description: 'e.g., "Custom Fire Department Patches — Professional Firefighter Patches"',
    }),

    // === SEO CONTENT ===
    defineField({
      name: 'seoContent',
      title: 'SEO Content (Rich Text)',
      type: 'array',
      of: [{ type: 'block' }],
      description: '3-4 paragraphs of SEO-optimized content about this category',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'heroImage',
    },
    prepare(selection) {
      const { title, category } = selection;
      return {
        title: title,
        subtitle: `Category: ${category || 'Not set'}`,
      };
    },
  },
})
