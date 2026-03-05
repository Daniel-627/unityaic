import { auth }    from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { DeptHeadDashboard } from '@/components/dashboards/DeptHeadDashboard'
import { MemberDashboard } from '@/components/dashboards/MemberDashboard'
import { FinanceOfficerDashboard } from '@/components/dashboards/FinanceDashboard'


export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role

  if (role === 'ADMIN')           return <AdminDashboard />
  if (role === 'FINANCE_OFFICER') return <FinanceOfficerDashboard />
  if (role === 'DEPT_HEAD')       return <DeptHeadDashboard />
  return <MemberDashboard />
}