/**
 * SANITY CMS FAQ SCHEMA
 * 
 * Add these schemas to your Sanity studio to support
 * the comprehensive FAQ system across all pages
 * 
 * Location: sanity/schemas/ (create new files or add to existing schema files)
 */

// ============================================================================
// 1. GLOBAL FAQ (Homepage)
// ============================================================================

export const globalFAQ = {
  name: 'globalFAQ',
  title: 'Homepage FAQ',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'FREQUENTLY ASKED QUESTIONS',
      description: 'Main heading displayed above FAQ list'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description text before FAQ list (appears once)',
    },
    {
      name: 'questions',
      title: 'FAQ Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Question',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(10).max(200),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'blockContent', // Use your existing blockContent type
              description: 'Rich text answer - supports formatting, links, lists',
            },
            {
              name: 'keywords',
              title: 'SEO Keywords',
              type: 'string',
              description: 'Comma-separated keywords for this Q&A (for analytics)',
            },
            {
              name: 'featured',
              title: 'Featured Question?',
              type: 'boolean',
              initialValue: false,
              description: 'Pin this question to top of list'
            }
          ],
          preview: {
            select: {
              title: 'question',
            },
            prepare(selection: any) {
               return {
                 title: selection.title,
               };
             },
          },
        }
      ],
    },
    {
      name: 'displayCount',
      title: 'Initial Display Count',
      type: 'number',
      initialValue: 5,
      description: 'Number of questions to show initially, rest behind "See More" button',
    },
  ],
};

// ============================================================================
// 2. CATEGORY FAQ
// ============================================================================

export const categoryFAQ = {
  name: 'categoryFAQ',
  title: 'Category FAQ',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Linked Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Which product category is this FAQ for?',
      validation: (Rule: any) => Rule.required(),
      },
      {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'FAQ section title for this category',
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      description: 'Optional description before FAQ list',
    },
    {
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'categoryFaqItem',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
              description: 'Use rich text for better formatting',
            },
            {
              name: 'relatedProduct',
              title: 'Link to Product (Optional)',
              type: 'reference',
              to: [{ type: 'customProduct' }],
              description: 'Link this FAQ answer to a specific product',
            },
            {
              name: 'keywords',
              title: 'Keywords',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        }
      ],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    },
  ],
};

// ============================================================================
// 3. PRODUCT FAQ
// ============================================================================

export const productFAQ = {
  name: 'productFAQ',
  title: 'Product FAQ',
  type: 'document',
  fields: [
    {
      name: 'product',
      title: 'Linked Product',
      type: 'reference',
      to: [{ type: 'customProduct' }],
      validation: (Rule: any) => Rule.required(),
      description: 'Which product is this FAQ for?',
    },
    {
      name: 'heading',
      title: 'FAQ Heading',
      type: 'string',
      initialValue: 'FREQUENTLY ASKED QUESTIONS',
    },
    {
      name: 'description',
      title: 'Intro Text',
      type: 'text',
      description: 'Brief text introducing the FAQ section',
    },
    {
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'productFaqItem',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(10).max(150),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
              description: 'Detailed answer (should be 80-150 words)',
            },
            {
              name: 'answerCategory',
              title: 'Answer Category',
              type: 'string',
              options: {
                list: [
                  { title: 'About Product', value: 'about' },
                  { title: 'Customization', value: 'customization' },
                  { title: 'Pricing', value: 'pricing' },
                  { title: 'Turnaround', value: 'turnaround' },
                  { title: 'Quality', value: 'quality' },
                  { title: 'Ordering', value: 'ordering' },
                  { title: 'Shipping', value: 'shipping' },
                  { title: 'Guarantees', value: 'guarantees' },
                ]
              },
              description: 'Helps organize FAQ by type',
            },
            {
              name: 'keywords',
              title: 'SEO Keywords',
              type: 'string',
              description: 'For tracking (e.g., "custom pins sizing")',
            },
            {
              name: 'internalLink',
              title: 'Link to Resource',
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Link Text',
                  type: 'string',
                  example: 'See sizing guide',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  example: '/sizing-guide',
                },
              ],
              description: 'Optional link to sizing guide, care instructions, etc.',
            },
          ],
          preview: {
            select: {
              title: 'question',
              category: 'answerCategory',
            },
            prepare({ title, category }) {
              return {
                title,
                subtitle: category ? `(${category})` : '',
              };
            },
          },
        }
      ],
    },
    {
      name: 'seoSchema',
      title: 'Generate SEO Schema?',
      type: 'boolean',
      initialValue: true,
      description: 'Automatically generate Schema.org FAQ markup for SEO',
    },
    {
      name: 'displayCount',
      title: 'Questions Per Page',
      type: 'number',
      initialValue: 10,
      description: 'Show first N questions, rest behind pagination',
    },
  ],
};

// ============================================================================
// 4. SUPPORT/COMPANY FAQ
// ============================================================================

export const supportFAQ = {
  name: 'supportFAQ',
  title: 'Support & Company FAQ',
  type: 'document',
  fields: [
    {
      name: 'faqType',
      title: 'FAQ Type',
      type: 'string',
      options: {
        list: [
          { title: 'General Support', value: 'general' },
          { title: 'Shipping & Delivery', value: 'shipping' },
          { title: 'Returns & Refunds', value: 'returns' },
          { title: 'Payment & Billing', value: 'payment' },
          { title: 'About Company', value: 'company' },
        ]
      },
      validation: (Rule: any) => Rule.required(),
      },
      {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      },
    {
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'supportFaqItem',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
            },
            {
              name: 'urgency',
              title: 'Urgency Level',
              type: 'string',
              options: {
                list: [
                  { title: 'Standard', value: 'standard' },
                  { title: 'Important', value: 'important' },
                  { title: 'Critical', value: 'critical' },
                ]
              },
              description: 'Helps identify top questions for support team',
            },
          ],
        }
      ],
    },
  ],
};

// ============================================================================
// 5. ADD TO EXISTING SCHEMAS
// ============================================================================

/**
 * Add this field to your existing 'customProduct' schema
 * to embed product FAQs directly on product pages
 */

export const productFAQEmbedField = {
  name: 'faqs',
  title: 'Product FAQs',
  type: 'reference',
  to: [{ type: 'productFAQ' }],
  description: 'Link to this product\'s FAQ document'
};

/**
 * Add this field to your existing 'category' schema
 * to embed category FAQs directly on category pages
 */

export const categoryFAQEmbedField = {
  name: 'faqs',
  title: 'Category FAQs',
  type: 'reference',
  to: [{ type: 'categoryFAQ' }],
  description: 'Link to this category\'s FAQ document'
};

// ============================================================================
// 6. FAQMETRICS (For tracking analytics in Sanity)
// ============================================================================

export const faqMetrics = {
  name: 'faqMetrics',
  title: 'FAQ Metrics',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question Text',
      type: 'string',
    },
    {
      name: 'faqDocument',
      title: 'FAQ Document',
      type: 'reference',
      to: [
        { type: 'globalFAQ' },
        { type: 'categoryFAQ' },
        { type: 'productFAQ' },
        { type: 'supportFAQ' }
      ],
    },
    {
      name: 'views',
      title: 'Total Views',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'expansions',
      title: 'Times Expanded',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'expansionRate',
      title: 'Expansion Rate (%)',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
    },
  ],
};

// ============================================================================
// 7. EXAMPLE BLOCK CONTENT TYPE (if you don't have one)
// ============================================================================

/**
 * If your project doesn't have a 'blockContent' type,
 * use this portable text configuration for FAQ answers
 */

export const blockContent = {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      // You can add more block styles if needed:
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
              {
                title: 'Open in new window',
                name: 'blank',
                type: 'boolean',
              },
            ],
          },
          {
            title: 'Internal Link',
            name: 'internalLink',
            type: 'object',
            fields: [
              {
                title: 'Select Document',
                name: 'reference',
                type: 'reference',
                to: [
                  { type: 'customProduct' },
                  { type: 'category' },
                  { type: 'page' },
                ],
              },
            ],
          },
        ],
      },
    },
    // You can add other block types here
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        }
      ]
    }
  ],
};

// ============================================================================
// 8. STRUCTURE/ORGANIZATION CONFIG
// ============================================================================

/**
 * Add this to your sanity.config.ts or structure file
 * to organize FAQs in the Sanity studio sidebar
 */

export const faqStructure = {
  title: 'FAQs',
  name: 'faqs',
  icon: 'help',
  items: [
    {
      title: 'Homepage FAQ',
      name: 'globalFaqList',
      icon: 'home',
    },
    {
      title: 'Category FAQs',
      name: 'categoryFaqList',
      icon: 'list',
    },
    {
      title: 'Product FAQs',
      name: 'productFaqList',
      icon: 'cube',
    },
    {
      title: 'Support FAQs',
      name: 'supportFaqList',
      icon: 'lifesaver',
    },
    {
      title: 'FAQ Metrics',
      name: 'faqMetricsList',
      icon: 'analytics',
    },
  ],
};

// ============================================================================
// 9. INITIAL DATA TEMPLATE
// ============================================================================

/**
 * Use this as a template to seed your first FAQ documents
 */

export const initialHomepageFAQ = {
  _type: 'globalFAQ',
  heading: 'FREQUENTLY ASKED QUESTIONS',
  description: 'Have questions about custom patches? We've got answers.',
  questions: [
    {
      _type: 'faqItem',
      question: 'What are personalized iron-on patches?',
      answer: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Personalized patches are custom-made fabric patches designed to your exact specifications. These can feature unique designs, logos, text, or images that represent a brand, event, team, or personal expression.'
            }
          ]
        }
      ],
      keywords: 'custom patches, iron-on patches, personalized patches',
      featured: true,
    },
    // ... add more questions
  ],
  displayCount: 5,
};

// ============================================================================
// 10. EXPORT ALL SCHEMAS
// ============================================================================

export const allFAQSchemas = [
  globalFAQ,
  categoryFAQ,
  productFAQ,
  supportFAQ,
  faqMetrics,
];
