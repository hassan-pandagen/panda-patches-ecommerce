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
          }),
          defineField({
            name: 'videoName',
            title: 'Video Title (for SEO)',
            type: 'string',
            description: 'e.g. "Custom Embroidered Patches Manufacturing Process"',
          }),
          defineField({
            name: 'videoDescription',
            title: 'Video Description (for SEO)',
            type: 'text',
            rows: 2,
            description: 'e.g. "Watch how we create custom embroidered patches from artwork to finished product at Panda Patches."',
          }),
          defineField({
            name: 'uploadDate',
            title: 'Upload Date',
            type: 'date',
            description: 'The date this reel was posted.',
          }),
          defineField({
            name: 'duration',
            title: 'Duration (ISO 8601)',
            type: 'string',
            description: 'e.g. PT0M30S = 30 seconds, PT1M15S = 1 min 15 sec',
            initialValue: 'PT0M30S',
          })
        ]
      }],
      validation: (rule) => rule.max(5)
    }),
  ],
})
