import Link    from 'next/link'
import { urlFor } from '@/sanity/lib/image'
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
  YOUTH:             'Empowering young people through faith, fellowship, and purposeful activities aligned with God\'s Word.',
  WOMENS_FELLOWSHIP: 'A sisterhood of faith where women grow together in Scripture, prayer, and community service.',
  MENS_FELLOWSHIP:   'Men committed to godly leadership in family, church, and the wider community.',
  SUNDAY_SCHOOL:     'Nurturing children in the love and knowledge of God through age-appropriate Bible teaching.',
  CADET_STAR:        'Building character and faith in pre-teens through the AIC Kenya Cadet and Star programme.',
}

const DEPT_ACTIVITIES: Record<string, string[]> = {
  YOUTH: [
    'Weekly youth fellowship and Bible study',
    'Annual youth rallies and competitions',
    'Community outreach and evangelism',
    'Leadership development programmes',
  ],
  WOMENS_FELLOWSHIP: [
    'Weekly women\'s Bible study and prayer',
    'Annual Women\'s Fellowship AGM',
    'Welfare and benevolence programmes',
    'Inter-church rallies and conferences',
  ],
  MENS_FELLOWSHIP: [
    'Men\'s Bible study and accountability groups',
    'Annual Men\'s Fellowship AGM',
    'Family and marriage enrichment programmes',
    'Community service and outreach',
  ],
  SUNDAY_SCHOOL: [
    'Sunday morning children\'s classes',
    'Bible memory and Scripture training',
    'Annual Sunday School presentations',
    'Children\'s holiday programmes',
  ],
  CADET_STAR: [
    'Weekly Cadet and Star meetings',
    'Character and leadership training',
    'AIC Kenya Cadet programme activities',
    'Annual Cadet and Star rallies',
  ],
}

const DEPT_COLOR: Record<string, string> = {
  YOUTH:             '#3B82F6',
  WOMENS_FELLOWSHIP: '#EC4899',
  MENS_FELLOWSHIP:   '#6366F1',
  SUNDAY_SCHOOL:     '#F59E0B',
  CADET_STAR:        '#10B981',
}

export function PublicMinistries({
  departments,
  mediaMap,
}: {
  departments:  Department[]
  mediaMap:     Record<string, any>
}) {
  return (
    <main>

      {/* Page header */}
      <div style={{ backgroundColor: '#1B3A6B', padding: '80px 32px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Find Your Place
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.05' }}>
              Ministries.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '380px', textAlign: 'right', lineHeight: '1.7' }}>
              Five CED ministry departments serving every age and stage of life at Unity AIC Church.
            </p>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div style={{ padding: '64px 32px', backgroundColor: '#F7F8FC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {departments.map((dept, i) => {
            const media    = mediaMap[dept.type]
            const color    = DEPT_COLOR[dept.type] ?? '#1B3A6B'
            const desc     = dept.description ?? DEPT_DESC[dept.type] ?? ''
            const acts     = DEPT_ACTIVITIES[dept.type] ?? []
            const isEven   = i % 2 === 0

            return (
              <div
                key={dept.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '48px',
                  alignItems: 'center',
                }}
              >
                {/* Image — alternates left/right */}
                <div style={{ order: isEven ? 0 : 1 }}>
                  {media?.image ? (
                    <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
                      <img
                        src={urlFor(media.image).width(600).height(450).fit('crop').url()}
                        alt={dept.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      borderRadius: '16px', aspectRatio: '4/3',
                      backgroundColor: color, opacity: 0.12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '4rem' }}>
                        {{ YOUTH: '🎯', WOMENS_FELLOWSHIP: '🌸', MENS_FELLOWSHIP: '🤝', SUNDAY_SCHOOL: '📖', CADET_STAR: '⭐' }[dept.type] ?? '⛪'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div style={{ order: isEven ? 1 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '4px', height: '32px', backgroundColor: color, borderRadius: '2px' }} />
                    <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                      CED Ministry
                    </p>
                  </div>

                  <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800', color: '#1B3A6B', marginBottom: '16px', lineHeight: '1.1' }}>
                    {dept.name}
                  </h2>

                  <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
                    {desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {acts.map((act, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiCheckCircle style={{ color, marginTop: '2px', flexShrink: 0 }} size={16} />
                        <p style={{ fontSize: '14px', color: '#374151' }}>{act}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1B3A6B', lineHeight: 1 }}>{dept.memberCount}</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Members</p>
                    </div>
                    {dept.headName && (
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1B3A6B' }}>{dept.headName}</p>
                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Department Head</p>
                      </div>
                    )}
                    <Link
                      href="/register"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        backgroundColor: color, color: '#ffffff',
                        padding: '10px 20px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '700', textDecoration: 'none',
                      }}
                    >
                      Join This Ministry →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </main>
  )
}