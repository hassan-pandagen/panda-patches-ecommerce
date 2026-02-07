import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'timeline',
  title: 'Home - Timeline Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      initialValue: 'ORDERING IRON ON PATCHES MADE SIMPLE AND EXCITING!'
    }),
    defineField({
      name: 'subheading',
      title: 'Sub Heading',
      type: 'text',
    }),
    defineField({
      name: 'imageLeft',
      title: 'Top Left Image (Collage 1)',
      type: 'image',
    }),
    defineField({
      name: 'imageRight',
      title: 'Bottom Right Image (Collage 2)',
      type: 'image',
    }),
    defineField({
      name: 'steps',
      title: 'The 4 Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ 
            name: 'number', 
            title: 'Step Number', 
            type: 'string',
            description: 'This will also be used as the Big Watermark (e.g. "1")'
          }),
          defineField({ 
            name: 'title', 
            title: 'Main Title', 
            type: 'string' 
          }),
          defineField({ 
            name: 'subtitle', 
            title: 'Subtitle (Bold Text)', 
            type: 'string',
            description: 'e.g. "Quick, easy, and convenient"'
          }),
          defineField({ 
            name: 'description', 
            title: 'Description (Grey Text)', 
            type: 'text' 
          }),
        ]
      }],
      validation: (rule) => rule.length(4).error('You must have exactly 4 steps')
    }),
  ],
})
