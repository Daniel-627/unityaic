import { auth }    from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role

  if (role === 'ADMIN')           return <AdminDashboard />
  // others coming soon
  return <AdminDashboard />
}