import { getServiceById }  from '@/lib/actions/services'
import { ServiceDetail }   from '@/components/services/ServiceDetail'
import { notFound }        from 'next/navigation'

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }    = await params
  const service   = await getServiceById(id)
  if (!service) notFound()

  return <ServiceDetail service={service} />
}