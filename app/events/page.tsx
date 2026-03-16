import { getEvents }     from '@/lib/actions/events'
import { PublicEvents }  from '@/components/events/PublicEvents'

export default async function EventsPage() {
  const events = await getEvents()
  const published = events.filter(e => e.isPublished)
  return <PublicEvents events={published} />
}