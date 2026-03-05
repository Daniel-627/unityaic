import { auth }          from '@/lib/auth'
import { redirect }      from 'next/navigation'
import { getMemberById } from '@/lib/actions/members'
import { SettingsPage }  from '@/components/settings/SettingsPage'

export default async function SettingsRoute() {
  const session = await auth()
  if (!session) redirect('/login')

  const member = await getMemberById(session.user.id)
  if (!member) redirect('/login')

  return <SettingsPage member={member} />
}