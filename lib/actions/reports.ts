'use server'

import { db } from '@/lib/db/client'
import {
  contributions,
  expenses,
  members,
  funds,
  remittancePayments,
  attendanceRecords,
  services,
} from '@/lib/db/schema'
import { eq, sql, sum, count } from 'drizzle-orm'

// ─── FINANCIAL SUMMARY ────────────────────────────────────────────────────────

export async function getFinancialSummary(from: string, to: string) {
  const [totalContributions, totalExpenses, byFund, byType, byMethod, remittances] =
    await Promise.all([
      // total contributions in range
      db.select({ total: sum(contributions.amount) })
        .from(contributions)
        .where(sql`${contributions.contributedAt} BETWEEN ${from} AND ${to}`),

      // total expenses in range
      db.select({ total: sum(expenses.amount) })
        .from(expenses)
        .where(sql`${expenses.date} BETWEEN ${from} AND ${to}`),

      // contributions by fund
      db.select({
        fundName: funds.name,
        total:    sum(contributions.amount),
      })
        .from(contributions)
        .innerJoin(funds, eq(contributions.fundId, funds.id))
        .where(sql`${contributions.contributedAt} BETWEEN ${from} AND ${to}`)
        .groupBy(funds.name)
        .orderBy(sql`SUM(${contributions.amount}) DESC`),

      // contributions by type
      db.select({
        type:  contributions.type,
        total: sum(contributions.amount),
        count: count(),
      })
        .from(contributions)
        .where(sql`${contributions.contributedAt} BETWEEN ${from} AND ${to}`)
        .groupBy(contributions.type),

      // contributions by method
      db.select({
        method: contributions.method,
        total:  sum(contributions.amount),
        count:  count(),
      })
        .from(contributions)
        .where(sql`${contributions.contributedAt} BETWEEN ${from} AND ${to}`)
        .groupBy(contributions.method),

      // remittances in range
      db.select({
        council:    remittancePayments.council,
        amountDue:  sum(remittancePayments.amountDue),
        amountPaid: sum(remittancePayments.amountPaid),
      })
        .from(remittancePayments)
        .where(sql`${remittancePayments.period} BETWEEN ${from.slice(0,7)} AND ${to.slice(0,7)}`)
        .groupBy(remittancePayments.council),
    ])

  const totalIn   = Number(totalContributions[0]?.total ?? 0)
  const totalOut  = Number(totalExpenses[0]?.total      ?? 0)
  const surplus   = totalIn - totalOut

  return {
    totalIn,
    totalOut,
    surplus,
    byFund:       byFund.map(r  => ({ name: r.fundName,   total: Number(r.total  ?? 0) })),
    byType:       byType.map(r  => ({ type: r.type,        total: Number(r.total  ?? 0), count: r.count })),
    byMethod:     byMethod.map(r => ({ method: r.method,   total: Number(r.total  ?? 0), count: r.count })),
    remittances:  remittances.map(r => ({
      council:    r.council,
      due:        Number(r.amountDue  ?? 0),
      paid:       Number(r.amountPaid ?? 0),
      balance:    Number(r.amountDue  ?? 0) - Number(r.amountPaid ?? 0),
    })),
  }
}

// ─── GIVING REPORT ────────────────────────────────────────────────────────────

export async function getGivingReport(from: string, to: string) {
  return db
    .select({
      memberId:      members.id,
      memberName:    members.name,
      totalGiving:   sum(contributions.amount),
      count:         count(),
    })
    .from(contributions)
    .innerJoin(members, eq(contributions.memberId, members.id))
    .where(sql`${contributions.contributedAt} BETWEEN ${from} AND ${to}`)
    .groupBy(members.id, members.name)
    .orderBy(sql`SUM(${contributions.amount}) DESC`)
}

// ─── EXPENSES REPORT ──────────────────────────────────────────────────────────

export async function getExpensesReport(from: string, to: string) {
  return db
    .select({
      category:  expenses.category,
      total:     sum(expenses.amount),
      count:     count(),
    })
    .from(expenses)
    .where(sql`${expenses.date} BETWEEN ${from} AND ${to}`)
    .groupBy(expenses.category)
    .orderBy(sql`SUM(${expenses.amount}) DESC`)
}

// ─── ATTENDANCE REPORT ────────────────────────────────────────────────────────

export async function getAttendanceReport(from: string, to: string) {
  const rows = await db
    .select({
      serviceId:    services.id,
      serviceTitle: services.title,
      serviceType:  services.type,
      serviceDate:  services.date,
      count:        count(attendanceRecords.id),
    })
    .from(services)
    .leftJoin(attendanceRecords, eq(attendanceRecords.serviceId, services.id))
    .where(sql`${services.date} BETWEEN ${from} AND ${to}`)
    .groupBy(services.id, services.title, services.type, services.date)
    .orderBy(sql`${services.date} ASC`)

  const total   = rows.reduce((sum, r) => sum + r.count, 0)
  const average = rows.length ? Math.round(total / rows.length) : 0

  return { rows, total, average }
}

// ─── MEMBER GROWTH ────────────────────────────────────────────────────────────

export async function getMemberGrowth() {
  return db
    .select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${members.createdAt}), 'YYYY-MM')`,
      count: count(),
    })
    .from(members)
    .groupBy(sql`DATE_TRUNC('month', ${members.createdAt})`)
    .orderBy(sql`DATE_TRUNC('month', ${members.createdAt}) ASC`)
    .limit(12)
}