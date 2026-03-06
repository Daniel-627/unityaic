import { Heart, BookOpen, Users } from 'lucide-react'

const PILLARS = [
  {
    icon:        Heart,
    title:       'Worship',
    description: 'We gather every Sunday to worship God in spirit and truth — through song, prayer, and the preaching of His Word.',
    color:       'text-rose-500',
    bg:          'bg-rose-50',
  },
  {
    icon:        BookOpen,
    title:       'Word',
    description: 'We are committed to the faithful teaching of Scripture, equipping every member to live out their faith daily.',
    color:       'text-blue-600',
    bg:          'bg-blue-50',
  },
  {
    icon:        Users,
    title:       'Community',
    description: 'We build genuine relationships within our ministries — Youth, Women, Men, Sunday School, and Cadet — for every season of life.',
    color:       'text-amber-600',
    bg:          'bg-amber-50',
  },
]

export function Pillars() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            What We Stand For
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            Built on Three Pillars
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${pillar.bg} flex items-center justify-center`}>
                  <Icon size={24} className={pillar.color} />
                </div>
                <h3 className="font-display text-xl font-bold text-primary">{pillar.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{pillar.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}