'use server'

import { createClient } from '@sanity/client'
import { revalidatePath }  from 'next/cache'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

export async function uploadGalleryImage(formData: FormData) {
  const file     = formData.get('file') as File
  const title    = formData.get('title') as string
  const caption  = formData.get('caption') as string
  const category = formData.get('category') as string
  const takenAt  = formData.get('takenAt') as string

  if (!file || !title || !category) {
    return { success: false, error: 'Title, category and image are required' }
  }

  try {
    // Upload the image asset to Sanity
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset  = await writeClient.assets.upload('image', buffer, {
      filename:    file.name,
      contentType: file.type,
    })

    // Create the gallery document
    await writeClient.create({
      _type:    'galleryItem',
      title,
      caption:  caption || undefined,
      category,
      takenAt:  takenAt || undefined,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })

    revalidatePath('/gallery')
    revalidatePath('/dashboard/gallery')
    return { success: true }

  } catch (err) {
    console.error('[uploadGalleryImage]', err)
    return { success: false, error: 'Upload failed' }
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await writeClient.delete(id)
    revalidatePath('/gallery')
    revalidatePath('/dashboard/gallery')
    return { success: true }
  } catch (err) {
    console.error('[deleteGalleryImage]', err)
    return { success: false, error: 'Delete failed' }
  }
}

export async function getGalleryItems() {
  return writeClient.fetch(`
    *[_type == "galleryItem"] | order(takenAt desc) {
      _id, title, caption, category, takenAt, image
    }
  `)
}