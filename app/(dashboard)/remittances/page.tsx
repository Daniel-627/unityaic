import { getRemittanceRates, getRemittancePayments } from '@/lib/actions/finance'
import { auth }             from '@/lib/auth'
import { RemittancesPage }  from '@/components/finance/RemittancesPage'

export default async function RemittancesRoute() {
  const session = await auth()
  const [rates, payments] = await Promise.all([
    getRemittanceRates(),
    getRemittancePayments(),
  ])
  return (
    <RemittancesPage
      rates={rates}
      payments={payments}
      userId={session!.user.id}
    />
  )
}