'use client'

import { useState, useTransition } from 'react'
import {
  getFinancialSummary,
  getGivingReport,
  getExpensesReport,
  getAttendanceReport,
  getMemberGrowth,
} from '@/lib/actions/reports'
import { Download } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type FinancialSummary = Awaited<ReturnType<typeof getFinancialSummary>>
type GivingRow        = Awaited<ReturnType<typeof getGivingReport>>[0]
type ExpenseRow       = Awaited<ReturnType<typeof getExpensesReport>>[0]
type AttendanceData   = Awaited<ReturnType<typeof getAttendanceReport>>
type GrowthRow        = Awaited<ReturnType<typeof getMemberGrowth>>[0]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatKES(n: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', minimumFractionDigits: 0,
  }).format(n)
}

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0]).join(',')
  const body    = rows.map(r => Object.values(r).join(',')).join('\n')
  const blob    = new Blob([`${headers}\n${body}`], { type: 'text/csv' })
  const url     = URL.createObjectURL(blob)
  const a       = document.createElement('a')
  a.href        = url
  a.download    = filename
  a.click()
  URL.revokeObjectURL(url)
}

const REPORT_TABS = [
  { key: 'financial',  label: 'Financial Summary' },
  { key: 'giving',     label: 'Giving'            },
  { key: 'expenses',   label: 'Expenses'          },
  { key: 'attendance', label: 'Attendance'        },
  { key: 'growth',     label: 'Member Growth'     },
] as const

type TabKey = typeof REPORT_TABS[number]['key']

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [isPending, startTransition] = useTransition()
  const [tab,       setTab]          = useState<TabKey>('financial')

  // date range — default current month
  const now   = new Date()
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const end   = now.toISOString().split('T')[0]

  const [from, setFrom] = useState(start)
  const [to,   setTo]   = useState(end)

  // report data
  const [financial,  setFinancial]  = useState<FinancialSummary | null>(null)
  const [giving,     setGiving]     = useState<GivingRow[]       | null>(null)
  const [expCats,    setExpCats]    = useState<ExpenseRow[]       | null>(null)
  const [attendance, setAttendance] = useState<AttendanceData     | null>(null)
  const [growth,     setGrowth]     = useState<GrowthRow[]        | null>(null)

  const loaded = {
    financial:  financial  !== null,
    giving:     giving     !== null,
    expenses:   expCats    !== null,
    attendance: attendance !== null,
    growth:     growth     !== null,
  }

  function runReport() {
    startTransition(async () => {
      if (tab === 'financial')  { const d = await getFinancialSummary(from, to);  setFinancial(d)  }
      if (tab === 'giving')     { const d = await getGivingReport(from, to);      setGiving(d)     }
      if (tab === 'expenses')   { const d = await getExpensesReport(from, to);    setExpCats(d)    }
      if (tab === 'attendance') { const d = await getAttendanceReport(from, to);  setAttendance(d) }
      if (tab === 'growth')     { const d = await getMemberGrowth();              setGrowth(d)     }
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Reports</h2>
        <p className="text-sm text-muted mt-0.5">Generate and export platform reports</p>
      </div>

      {/* Date range + run */}
      <div className="bg-white rounded-xl border border-border p-5 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-primary">From</label>
          <input
            title="Select start date for the report"
            type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-primary">To</label>
          <input
            title="Select end date for the report"
            type="date" value={to} onChange={e => setTo(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <button
          onClick={runReport} disabled={isPending}
          className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isPending ? 'Running...' : 'Run Report'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sunken p-1 rounded-lg flex-wrap">
        {REPORT_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-primary'
            }`}
          >
            {t.label}
            {loaded[t.key] && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* ── FINANCIAL SUMMARY ── */}
      {tab === 'financial' && (
        financial ? (
          <div className="flex flex-col gap-6 animate-fade-in">

            {/* Top stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Income',   value: formatKES(financial.totalIn),  color: 'border-t-green-400' },
                { label: 'Total Expenses', value: formatKES(financial.totalOut), color: 'border-t-red-400'   },
                {
                  label: 'Net Surplus',
                  value: formatKES(financial.surplus),
                  color: financial.surplus >= 0 ? 'border-t-primary' : 'border-t-danger',
                },
              ].map(s => (
                <div key={s.label} className={`bg-white rounded-xl border border-border border-t-4 ${s.color} p-5`}>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{s.label}</p>
                  <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
                </div>
              ))}
            </div>

            {/* By fund */}
            <ReportTable
              title="By Fund"
              columns={['Fund', 'Total']}
              rows={financial.byFund.map(r => ({ Fund: r.name, Total: formatKES(r.total) }))}
              onExport={() => downloadCSV('contributions-by-fund.csv', financial.byFund)}
            />

            {/* By type */}
            <ReportTable
              title="By Contribution Type"
              columns={['Type', 'Count', 'Total']}
              rows={financial.byType.map(r => ({ Type: r.type, Count: r.count, Total: formatKES(r.total) }))}
              onExport={() => downloadCSV('contributions-by-type.csv', financial.byType)}
            />

            {/* By method */}
            <ReportTable
              title="By Payment Method"
              columns={['Method', 'Count', 'Total']}
              rows={financial.byMethod.map(r => ({ Method: r.method, Count: r.count, Total: formatKES(r.total) }))}
              onExport={() => downloadCSV('contributions-by-method.csv', financial.byMethod)}
            />

            {/* Remittances */}
            {financial.remittances.length > 0 && (
              <ReportTable
                title="Remittances"
                columns={['Council', 'Due', 'Paid', 'Balance']}
                rows={financial.remittances.map(r => ({
                  Council: r.council,
                  Due:     formatKES(r.due),
                  Paid:    formatKES(r.paid),
                  Balance: formatKES(r.balance),
                }))}
                onExport={() => downloadCSV('remittances.csv', financial.remittances)}
              />
            )}
          </div>
        ) : <EmptyState label="financial summary" onRun={runReport} isPending={isPending} />
      )}

      {/* ── GIVING ── */}
      {tab === 'giving' && (
        giving ? (
          <div className="animate-fade-in">
            <ReportTable
              title={`Giving Report — ${from} to ${to}`}
              columns={['Member', 'Contributions', 'Total Given']}
              rows={giving.map((r, i) => ({
                '#':           i + 1,
                Member:        r.memberName,
                Contributions: r.count,
                'Total Given': formatKES(Number(r.totalGiving ?? 0)),
              }))}
              onExport={() => downloadCSV('giving-report.csv', giving.map(r => ({
                member:        r.memberName,
                contributions: r.count,
                total:         r.totalGiving,
              })))}
            />
          </div>
        ) : <EmptyState label="giving report" onRun={runReport} isPending={isPending} />
      )}

      {/* ── EXPENSES ── */}
      {tab === 'expenses' && (
        expCats ? (
          <div className="animate-fade-in">
            <ReportTable
              title={`Expenses by Category — ${from} to ${to}`}
              columns={['Category', 'Count', 'Total']}
              rows={expCats.map(r => ({
                Category: r.category,
                Count:    r.count,
                Total:    formatKES(Number(r.total ?? 0)),
              }))}
              onExport={() => downloadCSV('expenses-report.csv', expCats.map(r => ({
                category: r.category,
                count:    r.count,
                total:    r.total,
              })))}
            />
          </div>
        ) : <EmptyState label="expenses report" onRun={runReport} isPending={isPending} />
      )}

      {/* ── ATTENDANCE ── */}
      {tab === 'attendance' && (
        attendance ? (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Services',          value: attendance.rows.length },
                { label: 'Total Attendance',  value: attendance.total       },
                { label: 'Avg. per Service',  value: attendance.average     },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-border p-5">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{s.label}</p>
                  <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
                </div>
              ))}
            </div>
            <ReportTable
              title={`Attendance — ${from} to ${to}`}
              columns={['Service', 'Type', 'Date', 'Count']}
              rows={attendance.rows.map(r => ({
                Service: r.serviceTitle,
                Type:    r.serviceType,
                Date:    r.serviceDate,
                Count:   r.count,
              }))}
              onExport={() => downloadCSV('attendance-report.csv', attendance.rows.map(r => ({
                service: r.serviceTitle,
                type:    r.serviceType,
                date:    r.serviceDate,
                count:   r.count,
              })))}
            />
          </div>
        ) : <EmptyState label="attendance report" onRun={runReport} isPending={isPending} />
      )}

      {/* ── GROWTH ── */}
      {tab === 'growth' && (
        growth ? (
          <div className="animate-fade-in">
            <ReportTable
              title="Member Growth — Last 12 Months"
              columns={['Month', 'New Members']}
              rows={growth.map(r => ({ Month: r.month, 'New Members': r.count }))}
              onExport={() => downloadCSV('member-growth.csv', growth.map(r => ({
                month: r.month, count: r.count,
              })))}
            />
          </div>
        ) : <EmptyState label="member growth" onRun={runReport} isPending={isPending} />
      )}
    </div>
  )
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ReportTable({
  title, columns, rows, onExport,
}: {
  title:    string
  columns:  string[]
  rows:     Record<string, unknown>[]
  onExport: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-display text-base font-semibold text-primary">{title}</h3>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white">
              {columns.map(col => (
                <th key={col} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-muted text-sm">
                  No data for this period
                </td>
              </tr>
            ) : rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}
              >
                {columns.map(col => (
                  <td key={col} className="px-5 py-3 text-[#111827]">
                    {String(row[col] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmptyState({
  label, onRun, isPending,
}: {
  label:     string
  onRun:     () => void
  isPending: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center gap-3 text-center animate-fade-in">
      <span className="text-4xl">📊</span>
      <p className="font-display text-lg font-bold text-primary">No data yet</p>
      <p className="text-sm text-muted">Set a date range and click Run Report to generate the {label}.</p>
      <button
        onClick={onRun} disabled={isPending}
        className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
      >
        {isPending ? 'Running...' : 'Run Report'}
      </button>
    </div>
  )
}