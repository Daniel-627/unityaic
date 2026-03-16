'use server'

import { createClient } from '@sanity/client'
import { revalidatePath } from 'next/cache'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

export async function getEventMedia(eventId: string) {
  return writeClient.fetch(
    `*[_type == "eventMedia" && eventId == $eventId][0]`,
    { eventId }
  )
}

export async function uploadEventBanner(eventId: string, eventTitle: string, file: File) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset  = await writeClient.assets.upload('image', buffer, {
      filename:    file.name,
      contentType: file.type,
    })

    // Check if doc exists
    const existing = await writeClient.fetch(
      `*[_type == "eventMedia" && eventId == $eventId][0]._id`,
      { eventId }
    )

    if (existing) {
      await writeClient
        .patch(existing)
        .set({ banner: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }, eventTitle })
        .commit()
    } else {
      await writeClient.create({
        _type: 'eventMedia', eventId, eventTitle,
        banner: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      })
    }

    revalidatePath('/events')
    revalidatePath('/admin-events')
    return { success: true }
  } catch (err) {
    console.error('[uploadEventBanner]', err)
    return { success: false, error: 'Upload failed' }
  }
}

export async function uploadEventGalleryImage(eventId: string, eventTitle: string, file: File, caption: string) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset  = await writeClient.assets.upload('image', buffer, {
      filename:    file.name,
      contentType: file.type,
    })

    const existing = await writeClient.fetch(
      `*[_type == "eventMedia" && eventId == $eventId][0]._id`,
      { eventId }
    )

    const imageObj = {
      _type: 'image',
      _key:  asset._id,
      asset: { _type: 'reference', _ref: asset._id },
      caption: caption || undefined,
    }

    if (existing) {
      await writeClient
        .patch(existing)
        .setIfMissing({ gallery: [] })
        .append('gallery', [imageObj])
        .commit()
    } else {
      await writeClient.create({
        _type: 'eventMedia', eventId, eventTitle,
        gallery: [imageObj],
      })
    }

    revalidatePath('/events')
    return { success: true }
  } catch (err) {
    console.error('[uploadEventGalleryImage]', err)
    return { success: false, error: 'Upload failed' }
  }
}

export async function deleteEventGalleryImage(eventId: string, key: string) {
  try {
    const docId = await writeClient.fetch(
      `*[_type == "eventMedia" && eventId == $eventId][0]._id`,
      { eventId }
    )
    if (!docId) return { success: false, error: 'Not found' }

    await writeClient
      .patch(docId)
      .unset([`gallery[_key == "${key}"]`])
      .commit()

    revalidatePath('/events')
    return { success: true }
  } catch (err) {
    console.error('[deleteEventGalleryImage]', err)
    return { success: false, error: 'Delete failed' }
  }
}