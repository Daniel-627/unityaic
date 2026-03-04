import { defineField, defineType } from 'sanity'

export const memberAvatarSchema = defineType({
  name: 'memberAvatar',
  title: 'Member Avatar',
  type: 'document',
  fields: [
    defineField({ name: 'memberId', title: 'Member ID (Neon DB UUID)', type: 'string', validation: R => R.required() }),
    defineField({ name: 'memberName', title: 'Member Name', type: 'string' }),
    defineField({
      name: 'image', title: 'Avatar', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      validation: R => R.required(),
    }),
  ],
  preview: { select: { title: 'memberName', subtitle: 'memberId', media: 'image' } },
})