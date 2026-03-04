import { defineField, defineType } from 'sanity'

const DOCUMENT_CATEGORIES = [
  { title: 'Church Form',        value: 'church_form'       },
  { title: 'Notice / Circular',  value: 'notice'            },
  { title: 'Minutes',            value: 'minutes'           },
  { title: 'Financial Report',   value: 'financial_report'  },
  { title: "Women's Fellowship", value: 'womens_fellowship'  },
  { title: "Men's Fellowship",   value: 'mens_fellowship'   },
  { title: 'Youth (JOY)',        value: 'youth'             },
  { title: 'Sunday School',      value: 'sunday_school'     },
  { title: 'Cadet / Star',       value: 'cadet_star'        },
  { title: 'General',            value: 'general'           },
]

export const documentUploadSchema = defineType({
  name: 'documentUpload',
  title: 'Documents',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Document Title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: DOCUMENT_CATEGORIES, layout: 'dropdown' }, initialValue: 'general', validation: R => R.required() }),
    defineField({ name: 'file', title: 'File (PDF / Document)', type: 'file', options: { accept: '.pdf,.doc,.docx' }, validation: R => R.required() }),
    defineField({ name: 'isPublished', title: 'Published', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', published: 'isPublished' },
    prepare({ title, subtitle, published }) {
      return { title, subtitle: `${subtitle} ${published ? '✓ Published' : '— Draft'}` }
    },
  },
})