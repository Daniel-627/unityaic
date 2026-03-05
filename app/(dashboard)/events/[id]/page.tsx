import { getEventById } from '@/lib/actions/events'
import { EventDetail }  from '@/components/events/EventDetail'
import { notFound }     from 'next/navigation'

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event  = await getEventById(id)
  if (!event) notFound()

  return <EventDetail event={event} />
}