import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'mainHeading',
      title: 'Main Page Title',
      type: 'string',
      initialValue: 'About Us'
    }),
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges (Top)',
      type: 'array',
      of: [{ type: 'image' }]
    }),
    defineField({
      name: 'textSections',
      title: 'Text Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'heading', title: 'Heading', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
        ]
      }]
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Reviews Image',
      type: 'image',
      description: 'The screenshot of the phone chat reviews',
      options: { hotspot: true }
    }),

    // === FACTORY SECTION ===
    defineField({
      name: 'factoryHeading',
      title: 'Factory Heading',
      type: 'string',
      initialValue: 'PANDA PATCHES FACTORY'
    }),
    defineField({
      name: 'factoryDescription',
      title: 'Factory Description',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'factoryImage',
      title: 'Factory Image',
      type: 'image',
      options: { hotspot: true }
    }),

    // === PICK YOUR PATCH SECTION ===
    defineField({
      name: 'pickPatchHeading',
      title: 'Pick Patch Heading',
      type: 'string',
      initialValue: 'PICK YOUR PATCH!'
    }),
    defineField({
      name: 'patchCards',
      title: 'Patch Cards (Add 5)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', title: 'Patch Image', type: 'image' }),
          defineField({ name: 'label', title: 'Label (e.g. Chenille Patches)', type: 'string' }),
        ]
      }]
    }),
  ],
})
