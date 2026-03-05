import { getContributions }    from '@/lib/actions/finance'
import { getFunds }            from '@/lib/actions/finance'
import { getMembers }          from '@/lib/actions/members'
import { auth }                from '@/lib/auth'
import { ContributionsPage }   from '@/components/finance/ContributionsPage'

export default async function ContributionsRoute() {
  const session = await auth()
  const [contribs, fundsList, membersList] = await Promise.all([
    getContributions(),
    getFunds(),
    getMembers(),
  ])
  return (
    <ContributionsPage
      contributions={contribs}
      funds={fundsList}
      members={membersList}
      userId={session!.user.id}
    />
  )
}