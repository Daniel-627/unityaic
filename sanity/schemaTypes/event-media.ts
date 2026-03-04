import { defineField, defineType } from 'sanity'

export const eventMediaSchema = defineType({
  name: 'eventMedia',
  title: 'Event Media',
  type: 'document',
  fields: [
    defineField({ name: 'eventId', title: 'Event ID (Neon DB UUID)', type: 'string', validation: R => R.required() }),
    defineField({ name: 'eventTitle', title: 'Event Title', type: 'string' }),
    defineField({
      name: 'banner', title: 'Banner Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'gallery', title: 'Event Gallery', type: 'array',
      of: [{
        type: 'image', options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        ],
      }],
    }),
  ],
  preview: { select: { title: 'eventTitle', subtitle: 'eventId', media: 'banner' } },
})