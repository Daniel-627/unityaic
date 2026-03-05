import { getAttendanceOverview } from '@/lib/actions/services'
import { AttendanceOverview }    from '@/components/services/AttendanceOverview'

export default async function AttendancePage() {
  const data = await getAttendanceOverview()
  return <AttendanceOverview data={data} />
}