import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'commerce', title: 'Commerce & UCP' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'basic',
    }),
    defineField({
      name: 'tag',
      title: 'Discount Tag',
      type: 'string',
      initialValue: '25% Off',
      group: 'basic',
    }),
    defineField({
      name: 'category',
      title: 'Section Category',
      type: 'string',
      options: {
        list: [
          { title: 'Main Patches (Top 8)', value: 'main' },
          { title: 'Other Products (Bottom 4)', value: 'other' }
        ],
        layout: 'radio'
      },
      initialValue: 'main',
      validation: (rule) => rule.required(),
      group: 'basic',
    }),

    // === UCP / GOOGLE MERCHANT CENTER FIELDS ===
    defineField({
      name: 'sku',
      title: 'SKU (Stock Keeping Unit)',
      type: 'string',
      description: 'Unique product identifier for inventory and Google Shopping',
      group: 'commerce',
      validation: (rule) => rule.custom((sku) => {
        if (!sku) return true; // Optional field
        // SKU should be alphanumeric with dashes/underscores
        const isValid = /^[A-Z0-9_-]+$/i.test(sku);
        return isValid || 'SKU must contain only letters, numbers, dashes, and underscores';
      }),
    }),
    defineField({
      name: 'gtin',
      title: 'GTIN / UPC / Barcode',
      type: 'string',
      description: 'Global Trade Item Number for Google Merchant Center (optional for custom products)',
      group: 'commerce',
    }),
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'InStock' },
          { title: 'Made to Order (7-14 days)', value: 'MadeToOrder' },
          { title: 'Pre-Order', value: 'PreOrder' },
          { title: 'Out of Stock', value: 'OutOfStock' },
        ],
        layout: 'radio',
      },
      initialValue: 'MadeToOrder',
      group: 'commerce',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'leadTime',
      title: 'Lead Time / Delivery Estimate',
      type: 'string',
      description: 'e.g., "7-14 days", "3-5 business days"',
      initialValue: '7-14 days',
      group: 'commerce',
    }),
    defineField({
      name: 'pricingTiers',
      title: 'Pricing Tiers (for bulk orders)',
      type: 'array',
      of: [
        defineField({
          name: 'priceTier',
          type: 'object',
          fields: [
            defineField({
              name: 'minQuantity',
              title: 'Minimum Quantity',
              type: 'number',
              validation: (rule) => rule.required().positive().integer(),
            }),
            defineField({
              name: 'maxQuantity',
              title: 'Maximum Quantity',
              type: 'number',
              validation: (rule) => rule.positive().integer(),
            }),
            defineField({
              name: 'unitPrice',
              title: 'Unit Price (USD)',
              type: 'number',
              validation: (rule) => rule.required().positive(),
            }),
          ],
          preview: {
            select: {
              min: 'minQuantity',
              max: 'maxQuantity',
              price: 'unitPrice',
            },
            prepare({ min, max, price }) {
              return {
                title: `${min}${max ? `-${max}` : '+'} units`,
                subtitle: `$${price.toFixed(2)} per unit`,
              };
            },
          },
        }),
      ],
      group: 'commerce',
      description: 'Define price breaks for different quantity ranges',
    }),
    defineField({
      name: 'materials',
      title: 'Materials Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Embroidered Thread', value: 'Embroidered Thread' },
          { title: 'PVC Rubber', value: 'PVC Rubber' },
          { title: 'Woven Fabric', value: 'Woven Fabric' },
          { title: 'Chenille', value: 'Chenille' },
          { title: 'Leather', value: 'Leather' },
          { title: 'Metal', value: 'Metal' },
          { title: 'Twill Fabric', value: 'Twill Fabric' },
          { title: 'Velcro', value: 'Velcro' },
          { title: 'Iron-on Backing', value: 'Iron-on Backing' },
        ],
      },
      group: 'commerce',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        defineField({ name: 'width', title: 'Width', type: 'number', description: 'in inches' }),
        defineField({ name: 'height', title: 'Height', type: 'number', description: 'in inches' }),
        defineField({ name: 'depth', title: 'Depth/Thickness', type: 'number', description: 'in inches' }),
      ],
      group: 'commerce',
    }),
    defineField({
      name: 'weight',
      title: 'Shipping Weight',
      type: 'object',
      fields: [
        defineField({ name: 'value', title: 'Weight Value', type: 'number' }),
        defineField({
          name: 'unit',
          title: 'Unit',
          type: 'string',
          options: {
            list: [
              { title: 'Ounces (oz)', value: 'oz' },
              { title: 'Pounds (lb)', value: 'lb' },
              { title: 'Grams (g)', value: 'g' },
              { title: 'Kilograms (kg)', value: 'kg' },
            ],
          },
          initialValue: 'oz',
        }),
      ],
      group: 'commerce',
    }),
  ],
})
