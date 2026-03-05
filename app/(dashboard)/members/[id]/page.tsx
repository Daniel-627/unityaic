import { getMemberById } from '@/lib/actions/members'
import { MemberForm }    from '@/components/members/MemberForm'
import { notFound }      from 'next/navigation'

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }   = await params
  const member   = await getMemberById(id)
  if (!member) notFound()

  return <MemberForm member={member} />
}