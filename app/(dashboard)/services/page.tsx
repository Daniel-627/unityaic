import { getServices }  from '@/lib/actions/services'
import { ServicesList } from '@/components/services/ServicesList'

export default async function ServicesPage() {
  const servicesList = await getServices()
  return <ServicesList services={servicesList} />
}