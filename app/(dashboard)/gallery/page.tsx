'use client'

import { useState, useRef, useTransition } from 'react'
import { uploadGalleryImage, deleteGalleryImage, getGalleryItems } from '@/lib/actions/gallery'
import { Trash2, Upload, ImagePlus } from 'lucide-react'

const CATEGORIES = [
  { label: 'Sunday Service',     value: 'sunday_service'    },
  { label: 'Event',              value: 'event'             },
  { label: 'Youth (JOY)',        value: 'youth'             },
  { label: "Women's Fellowship", value: 'womens_fellowship' },
  { label: "Men's Fellowship",   value: 'mens_fellowship'   },
  { label: 'Sunday School',      value: 'sunday_school'     },
  { label: 'Cadet / Star',       value: 'cadet_star'        },
  { label: 'Community',          value: 'community'         },
  { label: 'General',            value: 'general'           },
]

export default function GalleryDashboard() {
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview]   = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await uploadGalleryImage(formData)
      if (result.success) {
        setSuccess(true)
        setPreview(null)
        formRef.current?.reset()
      } else {
        setError(result.error ?? 'Upload failed')
      }
    })
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>

      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Dashboard
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1B3A6B' }}>
          Gallery Management
        </h1>
        <p style={{ color: '#6B7280', marginTop: '8px' }}>
          Upload photos directly to the public gallery.
        </p>
      </div>

      {/* Upload form */}
      <form ref={formRef} onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B3A6B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImagePlus size={18} /> Upload New Photo
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Title *</label>
            <input
                title='Enter a descriptive title for the photo'
              name="title" required
              placeholder="e.g. Sunday Service March 2026"
              style={{ padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Category *</label>
            <select
              title='Select the category that best describes the photo'
              name="category" required
              style={{ padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Caption</label>
            <input
              title='A short description that will appear below the photo in the gallery'
              name="caption"
              placeholder="Optional short description"
              style={{ padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {/* Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Date Taken</label>
            <input
              title='Date when the photo was taken'
              name="takenAt" type="date"
              style={{ padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>

        {/* File input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Image *</label>
          <input
            title='file input'
            name="file" type="file" accept="image/*" required
            onChange={handleFileChange}
            style={{ padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', width: '100%' }}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', maxHeight: '240px' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Feedback */}
        {success && (
          <div style={{ padding: '12px 16px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
            ✓ Photo uploaded successfully.
          </div>
        )}
        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={isPending}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: isPending ? '#9CA3AF' : '#1B3A6B',
            color: '#ffffff', padding: '12px 28px', borderRadius: '8px',
            fontSize: '14px', fontWeight: '700', border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          <Upload size={16} />
          {isPending ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>

    </div>
  )
}