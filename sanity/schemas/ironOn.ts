import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ironOn',
  title: 'Asset - Iron On Instructions',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Iron On Instruction'
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    // The Unlimited List of Instructions
    defineField({
      name: 'instructions',
      title: 'Instruction List',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Instruction Block',
        fields: [
          defineField({ 
            name: 'patchType', 
            title: 'Patch Type Name (e.g. Chenille)', 
            type: 'string' 
          }),
          defineField({ 
            name: 'image', 
            title: 'Instruction Image', 
            type: 'image',
            options: { hotspot: true }
          }),
          defineField({ 
            name: 'steps', 
            title: 'Steps (Bulleted List)', 
            type: 'array', 
            of: [{ type: 'block' }] // This allows Rich Text / Bullets
          }),
          defineField({
            name: 'tableData',
            title: 'Extra Info Rows (Temperature/Time)',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({ 
                  name: 'value', 
                  title: 'Row Text', 
                  type: 'string',
                  description: 'e.g. "Temperature 160 C / 320 F for 15-20 seconds"'
                }),
              ]
            }]
          })
        ]
      }]
    }),
  ],
})
