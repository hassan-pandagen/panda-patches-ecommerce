import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'Home - FAQ Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'FREQUENTLY ASKED QUESTIONS'
    }),
    defineField({
      name: 'questions',
      title: 'Questions List',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string' }),
          defineField({ name: 'answer', title: 'Answer', type: 'text' }),
        ]
      }]
    }),
  ],
})
