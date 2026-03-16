import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

type Department = {
  id:          string
  name:        string
  type:        string
  description: string | null
  headName:    string | null
  memberCount: number
}

const DEPT_DESC: Record<string, string> = {
  YOUTH:             'Empowering young people through faith, fellowship, and purposeful activities.',
  WOMENS_FELLOWSHIP: 'A sisterhood of faith where women grow together in the Word and serve.',
  MENS_FELLOWSHIP:   'Men committed to godly leadership in family, church, and community.',
  SUNDAY_SCHOOL:     'Nurturing children in the love and knowledge of God every Sunday.',
  CADET_STAR:        'Building character and faith in pre-teens through structured programmes.',
}

const DEPT_ACTIVITIES: Record<string, string[]> = {
  YOUTH:             ['Weekly youth fellowship', 'Annual rallies and competitions', 'Community outreach'],
  WOMENS_FELLOWSHIP: ['Weekly Bible study', 'Annual AGM', 'Welfare programmes'],
  MENS_FELLOWSHIP:   ['Men\'s Bible study', 'Annual AGM', 'Family enrichment'],
  SUNDAY_SCHOOL:     ['Sunday morning classes', 'Bible memory training', 'Holiday programmes'],
  CADET_STAR:        ['Weekly Cadet meetings', 'Character training', 'Annual rallies'],
}

const DEPT_COLOR: Record<string, string> = {
  YOUTH:             '#3B82F6',
  WOMENS_FELLOWSHIP: '#EC4899',
  MENS_FELLOWSHIP:   '#6366F1',
  SUNDAY_SCHOOL:     '#F59E0B',
  CADET_STAR:        '#10B981',
}

const DEPT_EMOJI: Record<string, string> = {
  YOUTH:             '🎯',
  WOMENS_FELLOWSHIP: '🌸',
  MENS_FELLOWSHIP:   '🤝',
  SUNDAY_SCHOOL:     '📖',
  CADET_STAR:        '⭐',
}

export function Ministries({ departments }: { departments: Department[] }) {
  if (!departments.length) return null

  return (
    <section style={{ padding: '80px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Editorial heading */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Find Your Place
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#1B3A6B', lineHeight: '1.05' }}>
              Our<br />Ministries.
            </h2>
            <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '380px', textAlign: 'right', lineHeight: '1.7' }}>
              Five CED ministry departments serving every age and stage of life at Unity AIC Church.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {departments.map(dept => {
            const color = DEPT_COLOR[dept.type] ?? '#1B3A6B'
            const acts  = DEPT_ACTIVITIES[dept.type] ?? []
            return (
              <div
                key={dept.id}
                style={{
                  backgroundColor: '#F7F8FC',
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  borderTop: `4px solid ${color}`,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{DEPT_EMOJI[dept.type] ?? '⛪'}</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1B3A6B', lineHeight: '1.3' }}>{dept.name}</h3>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{dept.memberCount} members</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.7' }}>
                  {dept.description ?? DEPT_DESC[dept.type] ?? ''}
                </p>

                {/* Activities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {acts.map((act, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiCheckCircle style={{ color, flexShrink: 0 }} size={13} />
                      <p style={{ fontSize: '13px', color: '#374151' }}>{act}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                {dept.headName && (
                  <div style={{ paddingTop: '12px', borderTop: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Head</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B3A6B' }}>{dept.headName}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href="/ministries"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#1B3A6B', color: '#ffffff',
              padding: '14px 32px', borderRadius: '8px',
              fontSize: '14px', fontWeight: '700', textDecoration: 'none',
            }}
          >
            Explore All Ministries →
          </Link>
        </div>

      </div>
    </section>
  )
}