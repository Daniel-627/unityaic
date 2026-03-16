'use client'

import Link              from 'next/link'
import { useRouter }     from 'next/navigation'
import { useTransition } from 'react'
import { seedDepartments } from '@/lib/actions/ministry'

type Department = {
  id:          string
  name:        string
  type:        string
  description: string | null
  isActive:    boolean
  headId:      string | null
  headName:    string | null
  memberCount: number
}

const DEPT_EMOJI: Record<string, string> = {
  YOUTH:             '🎯',
  WOMENS_FELLOWSHIP: '🌸',
  MENS_FELLOWSHIP:   '🤝',
  SUNDAY_SCHOOL:     '📖',
  CADET_STAR:        '⭐',
}

const DEPT_COLOR: Record<string, string> = {
  YOUTH:             'border-t-blue-400',
  WOMENS_FELLOWSHIP: 'border-t-pink-400',
  MENS_FELLOWSHIP:   'border-t-indigo-400',
  SUNDAY_SCHOOL:     'border-t-amber-400',
  CADET_STAR:        'border-t-green-400',
}

export function DepartmentsList({ departments }: { departments: Department[] }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSeed() {
    startTransition(async () => {
      await seedDepartments()
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Ministry Departments</h2>
          <p className="text-sm text-muted mt-0.5">
            {departments.length} CED department{departments.length !== 1 ? 's' : ''}
          </p>
        </div>
        {departments.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-primary-dark text-sm font-semibold hover:bg-accent-light transition-colors cursor-pointer disabled:opacity-60 self-start"
          >
            {isPending ? 'Setting up...' : '⚡ Setup Departments'}
          </button>
        )}
      </div>

      {/* Empty state */}
      {departments.length === 0 && (
        <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">⛪</span>
          <p className="font-display text-lg font-bold text-primary">No departments yet</p>
          <p className="text-sm text-muted max-w-xs">
            Click "Setup Departments" to create the five standard AIC CED ministry departments.
          </p>
        </div>
      )}

      {/* Department cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {departments.map(dept => (
          <Link
            key={dept.id}
            href={`/admin-ministry/${dept.id}`}
            className={`no-underline bg-white rounded-xl border border-border border-t-4 ${DEPT_COLOR[dept.type] ?? 'border-t-primary'} p-5 flex flex-col gap-4 hover:shadow-md hover:border-primary/20 transition-all animate-fade-in`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{DEPT_EMOJI[dept.type] ?? '⛪'}</span>
                <div>
                  <p className="font-display text-base font-bold text-primary leading-tight">
                    {dept.name}
                  </p>
                  {dept.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{dept.description}</p>
                  )}
                </div>
              </div>
              <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                dept.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {dept.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-2xl font-display font-bold text-primary">{dept.memberCount}</p>
                <p className="text-xs text-muted">Members</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#111827]">
                  {dept.headName ?? '—'}
                </p>
                <p className="text-xs text-muted">Department Head</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}