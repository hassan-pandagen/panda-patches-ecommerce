import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'craftsmanship',
  title: 'Home - Craftsmanship (Reels)',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'SEE OUR CRAFTSMANSHIP'
    }),
    defineField({
      name: 'videos',
      title: 'Video Reels (Max 5)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ 
            name: 'videoFile', 
            title: 'Video File (MP4)', 
            type: 'file',
            options: { accept: 'video/mp4' }
          }),
          defineField({ 
            name: 'thumbnail', 
            title: 'Cover Image (Poster)', 
            type: 'image' 
          }),
          defineField({
            name: 'link',
            title: 'Instagram Link',
            type: 'url'
          })
        ]
      }],
      validation: (rule) => rule.max(5)
    }),
  ],
})
