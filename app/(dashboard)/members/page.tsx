import { getMembers }  from '@/lib/actions/members'
import { MembersList } from '@/components/members/MembersList'

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const members    = await getMembers(search)

  return <MembersList members={members} search={search ?? ''} />
}