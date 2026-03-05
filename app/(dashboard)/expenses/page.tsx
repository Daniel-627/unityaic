import { getExpenses }   from '@/lib/actions/finance'
import { getFunds }      from '@/lib/actions/finance'
import { getMembers }    from '@/lib/actions/members'
import { auth }          from '@/lib/auth'
import { ExpensesPage }  from '@/components/finance/ExpensesPage'

export default async function ExpensesRoute() {
  const session = await auth()
  const [expensesList, fundsList, membersList] = await Promise.all([
    getExpenses(),
    getFunds(),
    getMembers(),
  ])
  return (
    <ExpensesPage
      expenses={expensesList}
      funds={fundsList}
      members={membersList}
      userId={session!.user.id}
    />
  )
}