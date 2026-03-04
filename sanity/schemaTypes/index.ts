import { type SchemaTypeDefinition } from 'sanity'
import { memberAvatarSchema }    from './member-avatar'
import { eventMediaSchema }      from './event-media'
import { departmentMediaSchema } from './department-media'
import { gallerySchema }         from './gallery'
import { documentUploadSchema }  from './document-upload'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    memberAvatarSchema,
    eventMediaSchema,
    departmentMediaSchema,
    gallerySchema,
    documentUploadSchema,
  ],
}