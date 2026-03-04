import { defineField, defineType } from 'sanity'

const DEPARTMENT_TYPES = [
  { title: 'Youth (JOY)',         value: 'YOUTH'             },
  { title: "Women's Fellowship",  value: 'WOMENS_FELLOWSHIP' },
  { title: "Men's Fellowship",    value: 'MENS_FELLOWSHIP'   },
  { title: 'Sunday School',       value: 'SUNDAY_SCHOOL'     },
  { title: 'Cadet / Star',        value: 'CADET_STAR'        },
]

export const departmentMediaSchema = defineType({
  name: 'departmentMedia',
  title: 'Department Media',
  type: 'document',
  fields: [
    defineField({ name: 'departmentType', title: 'Department', type: 'string', options: { list: DEPARTMENT_TYPES, layout: 'radio' }, validation: R => R.required() }),
    defineField({
      name: 'image', title: 'Profile Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'banner', title: 'Banner', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'departmentType', media: 'image' },
    prepare({ title, media }) {
      const label = DEPARTMENT_TYPES.find(d => d.value === title)?.title ?? title
      return { title: label, media }
    },
  },
})