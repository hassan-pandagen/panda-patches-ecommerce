import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'process',
  title: 'Home - Process Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      initialValue: 'TAKE THE FIRST STEP ON YOUR PATCH QUEST!'
    }),
    defineField({
      name: 'subheading',
      title: 'Sub Heading',
      type: 'text',
    }),
    defineField({
      name: 'steps',
      title: 'The 3 Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Yellow Label (e.g. SKETCH)', type: 'string' }),
          defineField({ name: 'image', title: 'Image', type: 'image' }),
        ]
      }],
      validation: (rule) => rule.length(3).error('You must have exactly 3 steps')
    }),
  ],
})
