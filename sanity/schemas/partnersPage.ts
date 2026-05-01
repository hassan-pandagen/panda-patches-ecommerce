import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partnersPage',
  title: 'Partners Page',
  type: 'document',
  fields: [
    defineField({
      name: 'industryCards',
      title: 'Industry Cards (up to 6)',
      type: 'array',
      description: 'Upload one image per industry. These show in the "Trusted by Organizations" grid on the partners page.',
      of: [{
        type: 'object',
        name: 'industryCard',
        fields: [
          defineField({
            name: 'label',
            title: 'Industry Label (e.g. Fire Departments)',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'href',
            title: 'Link URL (e.g. /custom-fire-department-patches)',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'image',
            title: 'Card Image',
            type: 'image',
            options: { hotspot: true },
            validation: (rule) => rule.required(),
          }),
        ],
        preview: {
          select: { title: 'label', media: 'image' },
        },
      }],
      validation: (rule) => rule.max(6).warning('Maximum 6 cards for the grid layout'),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Partners Page' };
    },
  },
})
