'use client'

import { useState, useTransition } from 'react'
import { urlFor }                  from '@/sanity/lib/image'
import {
  uploadEventBanner,
  uploadEventGalleryImage,
  deleteEventGalleryImage,
} from '@/lib/actions/event-media'
import { Upload, Trash2, ImagePlus } from 'lucide-react'

type MediaDoc = {
  _id:     string
  banner:  any
  gallery: { _key: string; asset: any; caption?: string }[]
} | null

export function EventMedia({
  eventId,
  eventTitle,
  initialMedia,
}: {
  eventId:      string
  eventTitle:   string
  initialMedia: MediaDoc
}) {
  const [media, setMedia]           = useState<MediaDoc>(initialMedia)
  const [isPending, startTransition] = useTransition()
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [galleryCaption, setGalleryCaption] = useState('')
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState<string | null>(null)

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setBannerPreview(URL.createObjectURL(file))
  }

  function handleBannerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = (e.currentTarget.elements.namedItem('banner') as HTMLInputElement).files?.[0]
    if (!file) return
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const result = await uploadEventBanner(eventId, eventTitle, file)
      if (result.success) {
        setSuccess('Banner uploaded.')
        setBannerPreview(null)
        // Refetch media
        const updated = await fetch(`/api/event-media?eventId=${eventId}`).then(r => r.json()).catch(() => null)
        if (updated) setMedia(updated)
      } else {
        setError(result.error ?? 'Failed')
      }
    })
  }

  function handleGallerySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = (e.currentTarget.elements.namedItem('galleryFile') as HTMLInputElement).files?.[0]
    if (!file) return
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const result = await uploadEventGalleryImage(eventId, eventTitle, file, galleryCaption)
      if (result.success) {
        setSuccess('Image added to gallery.')
        setGalleryCaption('')
        ;(e.target as HTMLFormElement).reset()
      } else {
        setError(result.error ?? 'Failed')
      }
    })
  }

  async function handleDeleteGallery(key: string) {
    if (!confirm('Remove this image?')) return
    const result = await deleteEventGalleryImage(eventId, key)
    if (result.success) {
      setMedia(prev => prev ? {
        ...prev,
        gallery: prev.gallery.filter(g => g._key !== key)
      } : prev)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {error   && <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '13px' }}>{error}</div>}
      {success && <div style={{ padding: '10px 14px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '13px' }}>{success}</div>}

      {/* Banner */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1B3A6B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImagePlus size={16} /> Event Banner
        </h3>

        {media?.banner && (
          <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/6' }}>
            <img
              src={urlFor(media.banner).width(800).height(300).fit('crop').url()}
              alt="Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <form onSubmit={handleBannerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bannerPreview && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/6' }}>
              <img src={bannerPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <input
            title="Select an image to upload as the event banner" aria-label="Select an image to upload as the event banner"
            name="banner" type="file" accept="image/*" required
            onChange={handleBannerChange}
            style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', width: '100%' }}
          />
          <button
            title="Upload or replace the event banner image" aria-label="Upload or replace the event banner image"
            type="submit" disabled={isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: isPending ? '#9CA3AF' : '#1B3A6B',
              color: '#fff', padding: '8px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600', border: 'none',
              cursor: isPending ? 'not-allowed' : 'pointer', width: 'fit-content',
            }}
          >
            <Upload size={14} />
            {media?.banner ? 'Replace Banner' : 'Upload Banner'}
          </button>
        </form>
      </div>

      {/* Gallery */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1B3A6B', marginBottom: '16px' }}>
          Event Gallery ({media?.gallery?.length ?? 0} photos)
        </h3>

        {/* Existing gallery */}
        {media?.gallery && media.gallery.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {media.gallery.map(img => (
              <div key={img._key} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
                <img
                  src={urlFor(img.asset).width(200).height(200).fit('crop').url()}
                  alt={img.caption ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                    title="Remove this image from the gallery" aria-label="Remove this image from the gallery"
                  onClick={() => handleDeleteGallery(img._key)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    backgroundColor: '#EF4444', color: '#fff',
                    border: 'none', borderRadius: '6px', padding: '4px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                  }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add to gallery */}
        <form onSubmit={handleGallerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            title="Select an image to add to the gallery" aria-label="Select an image to add to the gallery"
            name="galleryFile" type="file" accept="image/*" required
            style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', width: '100%' }}
          />
          <input
            value={galleryCaption}
            onChange={e => setGalleryCaption(e.target.value)}
            placeholder="Caption (optional)"
            style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', width: '100%' }}
          />
          <button
            type="submit" disabled={isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: isPending ? '#9CA3AF' : '#C9A84C',
              color: '#1B3A6B', padding: '8px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600', border: 'none',
              cursor: isPending ? 'not-allowed' : 'pointer', width: 'fit-content',
            }}
          >
            <Upload size={14} /> Add to Gallery
          </button>
        </form>
      </div>

    </div>
  )
}