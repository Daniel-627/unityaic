import { getReceipts }   from '@/lib/actions/finance'
import { ReceiptsPage }  from '@/components/finance/RecieptsPage'

export default async function ReceiptsRoute() {
  const receiptsList = await getReceipts()
  return <ReceiptsPage receipts={receiptsList} />
}