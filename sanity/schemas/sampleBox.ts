import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sampleBox',
  title: 'Sample Box',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Sample Box Media',
      description: 'Internal title for this content'
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required(),
              description: 'Describe the image for accessibility and SEO'
            },
            {
              name: 'caption',
              title: 'Caption (Optional)',
              type: 'string',
              description: 'Optional caption to display over the image'
            }
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'image',
              subtitle: 'caption'
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).max(6),
      description: 'Upload 1-6 product images. Recommended: 3 images (closed box, open box, patches display)'
    }),
    defineField({
      name: 'video',
      title: 'Unboxing Video',
      type: 'object',
      fields: [
        {
          name: 'file',
          title: 'Video File',
          type: 'file',
          options: {
            accept: 'video/mp4,video/webm'
          },
          validation: Rule => Rule.required(),
          description: 'Upload your video (recommended: under 5MB, MP4 format)'
        },
        {
          name: 'thumbnail',
          title: 'Video Thumbnail (Optional)',
          type: 'image',
          description: 'Custom thumbnail for video. If not set, will use first gallery image'
        },
        {
          name: 'title',
          title: 'Video Title',
          type: 'string',
          initialValue: 'Sample Box Unboxing',
          description: 'Title shown on video thumbnail'
        }
      ],
      description: 'Your unboxing video (10-30 seconds recommended)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'gallery.0.image'
    }
  }
})
