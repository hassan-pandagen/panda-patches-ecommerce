import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Home - CTA Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Get started with your design today!'
    }),
    defineField({
      name: 'subheading',
      title: 'Sub Heading',
      type: 'text',
      initialValue: "Why wait? Select your options, share your artwork, and we'll get you started on your custom products."
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Get Quote'
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image (Giant Pic)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
