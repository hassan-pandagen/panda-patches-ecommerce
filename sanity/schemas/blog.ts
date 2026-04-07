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
          { title: 'Custom Sports Patches', value: 'Custom Sports Patches' },
          { title: 'Custom Leather Patches', value: 'Custom Leather Patches' },
          { title: 'Custom Sequin Patches', value: 'Custom Sequin Patches' },
          { title: 'Custom Tactical Patches', value: 'Custom Tactical Patches' },
          { title: 'Ordering Guide', value: 'Ordering Guide' },
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
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'The date this post was published. Used in byline, schema markup, and sort order.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Title (optional)',
      type: 'string',
      description: 'Overrides the browser tab title. Max 60 characters. Leave blank to use the blog title.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description (optional)',
      type: 'text',
      rows: 2,
      description: 'Overrides the Google snippet description. Max 160 characters. Leave blank to use the excerpt.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Author Photo (Imran Raza)',
      type: 'image',
      description: 'Upload a headshot of Imran Raza. Displayed in the author byline and bio card. Recommended: 200x200px square.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for SEO and accessibility.',
            },
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            },
          ],
        },
        {
          type: 'object',
          name: 'tableBlock',
          title: 'Table',
          fields: [
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            },
            {
              name: 'headers',
              title: 'Column Headers',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'tableRow',
                  title: 'Row',
                  fields: [
                    {
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [{ type: 'string' }],
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { caption: 'caption', headers: 'headers' },
            prepare({ caption, headers }: { caption?: string; headers?: string[] }) {
              return {
                title: caption || 'Table',
                subtitle: headers?.join(' | ') || '',
              };
            },
          },
        },
      ],
    }),
  ],
})
