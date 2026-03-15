'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { deleteGalleryImage, getGalleryItems } from '@/lib/actions/gallery'
import { urlFor } from '@/sanity/lib/image'
import { Trash2, ArrowLeft } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  sunday_service:    'Sunday Service',
  event:             'Event',
  youth:             'Youth (JOY)',
  womens_fellowship: "Women's Fellowship",
  mens_fellowship:   "Men's Fellowship",
  sunday_school:     'Sunday School',
  cadet_star:        'Cadet / Star',
  community:         'Community',
  general:           'General',
}

type GalleryItem = {
  _id:      string
  title:    string
  caption:  string | null
  category: string
  takenAt:  string | null
  image:    any
}

export default function ManageGalleryPage() {
  const [items, setItems]               = useState<GalleryItem[]>([])
  const [loading, setLoading]           = useState(true)
  const [isDeleting, setIsDeleting]     = useState<string | null>(null)

  async function fetchItems() {
    setLoading(true)
    const data = await getGalleryItems()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setIsDeleting(id)
    const result = await deleteGalleryImage(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i._id !== id))
    } else {
      alert('Delete failed. Try again.')
    }
    setIsDeleting(null)
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <Link
          href="/dashboard/admin-gallery"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '13px', textDecoration: 'none', marginBottom: '16px' }}
        >
          <ArrowLeft size={14} /> Back to Gallery
        </Link>
        <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Gallery Management
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1B3A6B' }}>
            All Photos
          </h1>
          {!loading && (
            <span style={{ fontSize: '13px', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '4px 12px', borderRadius: '999px' }}>
              {items.length} photo{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading photos...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>No photos uploaded yet.</p>
          <Link
            href="/dashboard/admin-gallery"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', backgroundColor: '#1B3A6B', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}
          >
            Upload First Photo
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {items.map(item => (
            <div
              key={item._id}
              style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                <img
                  src={urlFor(item.image).width(400).height(300).fit('crop').url()}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Delete button overlay */}
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={isDeleting === item._id}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    backgroundColor: isDeleting === item._id ? '#9CA3AF' : '#EF4444',
                    color: '#ffffff', border: 'none', borderRadius: '8px',
                    padding: '6px 10px', cursor: isDeleting === item._id ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '12px', fontWeight: '600',
                  }}
                >
                  <Trash2 size={12} />
                  {isDeleting === item._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B3A6B', marginBottom: '2px' }}>{item.title}</p>
                <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{CATEGORY_LABELS[item.category] ?? item.category}</p>
                {item.caption && (
                  <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{item.caption}</p>
                )}
                {item.takenAt && (
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.takenAt))}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}