import { getEvents }         from '@/lib/actions/events'
import { getDepartments }    from '@/lib/actions/ministry'
import Hero                  from '@/components/home/Hero'
import { Pillars }           from '@/components/home/Pillars'
import { UpcomingEvents }    from '@/components/home/UpcomingEvents'
import { Ministries }        from '@/components/home/Ministries'
import { CTABanner }         from '@/components/home/CTABanner'

export default async function HomePage() {
  const [events, departments] = await Promise.all([
    getEvents(),
    getDepartments(),
  ])

  const upcoming = events
    .filter(e => e.isPublished && new Date(e.startDate) >= new Date())
    .slice(0, 3)

  return (
    <main>
      <Hero />
      <Pillars />
      <UpcomingEvents events={upcoming} />
      <Ministries departments={departments} />
      <CTABanner />
    </main>
  )
}