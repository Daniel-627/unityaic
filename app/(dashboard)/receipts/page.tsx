import { getReceipts }   from '@/lib/actions/finance'
import { ReceiptsPage }  from '@/components/finance/ReceiptsPage'

export default async function ReceiptsRoute() {
  const receiptsList = await getReceipts()
  return <ReceiptsPage receipts={receiptsList} />
}