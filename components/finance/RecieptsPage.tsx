type Receipt = {
  id:            string
  receiptNo:     number
  issuedAt:      Date
  amount:        string
  type:          string
  method:        string
  contributedAt: Date
  memberName:    string
  fundName:      string
  issuedByName:  string
}

function formatKES(n: string | number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(Number(n))
}

function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

const TYPE_BADGE: Record<string, string> = {
  TITHE:    'bg-blue-100 text-blue-700',
  OFFERING: 'bg-green-100 text-green-700',
  PLEDGE:   'bg-purple-100 text-purple-700',
  DONATION: 'bg-amber-100 text-amber-700',
}

export function ReceiptsPage({ receipts }: { receipts: Receipt[] }) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Receipts</h2>
        <p className="text-sm text-muted mt-0.5">
          {receipts.length} receipts — auto-generated on every contribution
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Receipt #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Fund</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Issued By</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted text-sm">No receipts yet — record a contribution to generate one</td></tr>
              ) : receipts.map((r, i) => (
                <tr key={r.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                  <td className="px-5 py-3">
                    <span className="font-display font-bold text-primary text-base">
                      #{String(r.receiptNo).padStart(4, '0')}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-[#111827]">{r.memberName}</td>
                  <td className="px-5 py-3 text-muted">{r.fundName}</td>
                  <td className="px-5 py-3 font-semibold text-green-700">{formatKES(r.amount)}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[r.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted text-xs hidden md:table-cell">{formatDate(r.contributedAt)}</td>
                  <td className="px-5 py-3 text-muted text-xs hidden lg:table-cell">{r.issuedByName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}