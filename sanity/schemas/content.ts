import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'content',
  title: 'Home - SEO Content',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Text Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ 
            name: 'heading', 
            title: 'Heading', 
            type: 'string' 
          }),
          defineField({ 
            name: 'body', 
            title: 'Body Text', 
            type: 'array', 
            of: [{ type: 'block' }]
          }),
        ]
      }]
    }),
  ],
})
