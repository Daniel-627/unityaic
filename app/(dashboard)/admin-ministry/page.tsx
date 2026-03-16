import { getDepartments }   from '@/lib/actions/ministry'
import { DepartmentsList }  from '@/components/ministry/DepartmentsList'

export default async function MinistryPage() {
  const departments = await getDepartments()
  return <DepartmentsList departments={departments} />
}