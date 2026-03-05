import { auth }        from '@/lib/auth'
import { redirect }    from 'next/navigation'
import { ReportsPage } from '@/components/reports/ReportsPage'

export default async function ReportsRoute() {
  const session = await auth()
  if (!session) redirect('/login')

  return <ReportsPage />
}