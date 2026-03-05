import { getFunds } from '@/lib/actions/finance'
import { FundsPage } from '@/components/finance/FundsPage'

export default async function FundsRoute() {
  const fundsList = await getFunds()
  return <FundsPage funds={fundsList} />
}