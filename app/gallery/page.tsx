import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

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

async function getGallery(): Promise<GalleryItem[]> {
  return client.fetch(`
    *[_type == "galleryItem"] | order(takenAt desc) {
      _id, title, caption, category, takenAt, image
    }
  `)
}

export default async function GalleryPage() {
  const items = await getGallery()

  // Group by category
  const grouped = items.reduce<Record<string, GalleryItem[]>>((acc, item) => {
    const key = item.category ?? 'general'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <main>

      {/* Page header */}
      <div style={{ backgroundColor: '#1B3A6B', padding: '80px 32px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Moments
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.05' }}>
            Gallery.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '16px', maxWidth: '480px', lineHeight: '1.7' }}>
            A glimpse into the life of Unity AIC Church — worship, fellowship, and ministry in action.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '64px 32px', backgroundColor: '#F7F8FC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7280' }}>
              <p style={{ fontSize: '1.1rem' }}>No gallery items yet. Add some in the Sanity Studio.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, photos]) => (
              <div key={category} style={{ marginBottom: '64px' }}>

                {/* Category heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1B3A6B' }}>
                    {CATEGORY_LABELS[category] ?? category}
                  </h2>
                  <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#E5E7EB', padding: '2px 10px', borderRadius: '999px' }}>
                    {photos.length} photo{photos.length !== 1 ? 's' : ''}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                </div>

                {/* Photo grid */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
  {photos.map(photo => (
    <div
      key={photo._id}
      style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}
    >
      <img
        src={urlFor(photo.image).width(600).height(450).fit('crop').url()}
        alt={photo.image?.alt ?? photo.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  ))}
</div>

              </div>
            ))
          )}

        </div>
      </div>

    </main>
  )
}