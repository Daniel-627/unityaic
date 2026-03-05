import { getDepartmentById }  from '@/lib/actions/ministry'
import { DepartmentDetail }   from '@/components/ministry/DepartmentDetail'
import { notFound }           from 'next/navigation'

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dept   = await getDepartmentById(id)
  if (!dept) notFound()

  return <DepartmentDetail department={dept} />
}