import { defineField, defineType } from 'sanity'

const GALLERY_CATEGORIES = [
  { title: 'Sunday Service',     value: 'sunday_service'    },
  { title: 'Event',              value: 'event'             },
  { title: 'Youth (JOY)',        value: 'youth'             },
  { title: "Women's Fellowship", value: 'womens_fellowship' },
  { title: "Men's Fellowship",   value: 'mens_fellowship'   },
  { title: 'Sunday School',      value: 'sunday_school'     },
  { title: 'Cadet / Star',       value: 'cadet_star'        },
  { title: 'Community',          value: 'community'         },
  { title: 'General',            value: 'general'           },
]

export const gallerySchema = defineType({
  name: 'galleryItem',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: GALLERY_CATEGORIES, layout: 'dropdown' }, initialValue: 'general', validation: R => R.required() }),
    defineField({ name: 'takenAt', title: 'Date Taken', type: 'date' }),
    defineField({
      name: 'image', title: 'Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      validation: R => R.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } },
})