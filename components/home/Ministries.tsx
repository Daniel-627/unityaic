import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Department = {
  id:          string
  name:        string
  type:        string
  description: string | null
  memberCount: number
  headName:    string | null
}

const DEPT_CONFIG: Record<string, {
  emoji: string
  color: string
  bg:    string
  description: string
}> = {
  YOUTH: {
    emoji:       '🎯',
    color:       'text-blue-600',
    bg:          'bg-blue-50',
    description: 'Empowering the next generation through faith, fellowship, and fun activities designed for young people.',
  },
  WOMENS_FELLOWSHIP: {
    emoji:       '🌸',
    color:       'text-pink-600',
    bg:          'bg-pink-50',
    description: 'A sisterhood of faith where women grow together in the Word, support one another, and serve the community.',
  },
  MENS_FELLOWSHIP: {
    emoji:       '🤝',
    color:       'text-indigo-600',
    bg:          'bg-indigo-50',
    description: 'Men committed to godly leadership in their families, church, and community through accountability and prayer.',
  },
  SUNDAY_SCHOOL: {
    emoji:       '📖',
    color:       'text-amber-600',
    bg:          'bg-amber-50',
    description: 'Nurturing children in the knowledge and love of God through age-appropriate Bible teaching every Sunday.',
  },
  CADET_STAR: {
    emoji:       '⭐',
    color:       'text-green-600',
    bg:          'bg-green-50',
    description: 'Building character, discipline, and faith in pre-teens through structured programmes and mentorship.',
  },
}

export function Ministries({ departments }: { departments: Department[] }) {
  if (departments.length === 0) return null

  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Find Your Place
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Our Ministries
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
            We have a ministry for every season of life.
            Find your community and grow in faith together.
          </p>
        </div>

        {/* Ministry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map(dept => {
            const config = DEPT_CONFIG[dept.type]
            return (
              <div
                key={dept.id}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-border hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${config?.bg ?? 'bg-gray-50'} flex items-center justify-center text-xl shrink-0`}>
                    {config?.emoji ?? '⛪'}
                  </div>
                  <h3 className="font-display text-base font-bold text-primary leading-tight">
                    {dept.name}
                  </h3>
                </div>

                <p className="text-sm text-muted leading-relaxed">
                  {dept.description ?? config?.description ?? ''}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                  <span className="text-xs text-muted">
                    {dept.memberCount} member{dept.memberCount !== 1 ? 's' : ''}
                  </span>
                  {dept.headName && (
                    <span className="text-xs text-muted">
                      Led by <span className="font-medium text-primary">{dept.headName}</span>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Join CTA */}
        <div className="text-center mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors no-underline"
          >
            Join a Ministry <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}