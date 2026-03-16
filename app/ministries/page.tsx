import { getDepartments }        from '@/lib/actions/ministry'
import { getAllDepartmentMedia }  from '@/lib/actions/department-media'
import { PublicMinistries }      from '@/components/ministry/PublicMinistries'

export default async function MinistriesPage() {
  const [departments, mediaList] = await Promise.all([
    getDepartments(),
    getAllDepartmentMedia(),
  ])

  const mediaMap: Record<string, any> = {}
  for (const m of mediaList) {
    if (m.departmentType) mediaMap[m.departmentType] = m
  }

  const active = departments.filter(d => d.isActive)
  return <PublicMinistries departments={active} mediaMap={mediaMap} />
}