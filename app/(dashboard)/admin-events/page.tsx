import { getEvents }   from '@/lib/actions/events'
import { auth }        from '@/lib/auth'
import { EventsList }  from '@/components/events/EventsList'

export default async function EventsPage() {
  const session    = await auth()
  const eventsList = await getEvents()

  return <EventsList events={eventsList} userId={session!.user.id} />
}
