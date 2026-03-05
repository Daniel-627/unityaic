'use server'

import { db } from '@/lib/db/client'
import {
  contributions,
  receipts,
  expenses,
  funds,
  remittanceRates,
  remittancePayments,
  members,
} from '@/lib/db/schema'
import { eq, sql, sum } from 'drizzle-orm'
import { z } from 'zod'

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

const contributionSchema = z.object({
  memberId:      z.string().uuid(),
  fundId:        z.string().uuid(),
  amount:        z.coerce.number().positive(),
  type:          z.enum(['TITHE', 'OFFERING', 'PLEDGE', 'DONATION']),
  method:        z.enum(['CASH', 'MPESA', 'BANK_TRANSFER', 'OTHER']),
  referenceNo:   z.string().optional(),
  contributedAt: z.string(),
  notes:         z.string().optional(),
})

const expenseSchema = z.object({
  fundId:      z.string().uuid(),
  title:       z.string().min(2),
  category:    z.enum(['MINISTRY', 'UTILITIES', 'MAINTENANCE', 'SALARIES', 'OTHER']),
  amount:      z.coerce.number().positive(),
  date:        z.string(),
  description: z.string().optional(),
  approvedBy:  z.string().uuid().optional(),
})

const fundSchema = z.object({
  name:         z.string().min(2),
  type:         z.enum(['TITHE', 'OFFERING', 'BUILDING', 'BENEVOLENCE', 'GENERAL']),
  description:  z.string().optional(),
  targetAmount: z.coerce.number().optional(),
})

const remittanceRateSchema = z.object({
  council:       z.enum(['DCC', 'RCC', 'ACC', 'CCC']),
  ratePercent:   z.coerce.number().positive().max(100),
  effectiveFrom: z.string(),
})

const remittancePaymentSchema = z.object({
  council:     z.enum(['DCC', 'RCC', 'ACC', 'CCC']),
  period:      z.string().regex(/^\d{4}-\d{2}$/),
  amountDue:   z.coerce.number().positive(),
  amountPaid:  z.coerce.number().min(0),
  referenceNo: z.string().optional(),
  paidAt:      z.string().optional(),
})

// ─── FUNDS ────────────────────────────────────────────────────────────────────

export async function getFunds() {
  const allFunds = await db
    .select()
    .from(funds)
    .orderBy(funds.name)

  const totals = await db
    .select({
      fundId: contributions.fundId,
      total:  sum(contributions.amount),
    })
    .from(contributions)
    .groupBy(contributions.fundId)

  const expenses_ = await db
    .select({
      fundId: expenses.fundId,
      total:  sum(expenses.amount),
    })
    .from(expenses)
    .groupBy(expenses.fundId)

  const contribMap  = Object.fromEntries(totals.map(t => [t.fundId, Number(t.total ?? 0)]))
  const expenseMap  = Object.fromEntries(expenses_.map(e => [e.fundId, Number(e.total ?? 0)]))

  return allFunds.map(f => ({
    ...f,
    totalContributions: contribMap[f.id]  ?? 0,
    totalExpenses:      expenseMap[f.id]  ?? 0,
    balance:           (contribMap[f.id] ?? 0) - (expenseMap[f.id] ?? 0),
  }))
}

export async function createFund(data: unknown) {
  const parsed = fundSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { name, type, description, targetAmount } = parsed.data

  await db.insert(funds).values({
    name,
    type,
    description:  description  ?? null,
    targetAmount: targetAmount ?? null,
    isActive:     true,
  })

  return { success: true }
}

export async function toggleFundActive(id: string, current: boolean) {
  await db.update(funds).set({ isActive: !current }).where(eq(funds.id, id))
  return { success: true }
}

// ─── CONTRIBUTIONS ────────────────────────────────────────────────────────────

export async function getContributions(limit = 50) {
  return db
    .select({
      id:            contributions.id,
      amount:        contributions.amount,
      type:          contributions.type,
      method:        contributions.method,
      referenceNo:   contributions.referenceNo,
      contributedAt: contributions.contributedAt,
      notes:         contributions.notes,
      memberName:    members.name,
      memberId:      members.id,
      fundName:      funds.name,
      fundId:        funds.id,
    })
    .from(contributions)
    .innerJoin(members, eq(contributions.memberId, members.id))
    .innerJoin(funds,   eq(contributions.fundId,   funds.id))
    .orderBy(sql`${contributions.contributedAt} DESC`)
    .limit(limit)
}

export async function createContribution(data: unknown, recordedBy: string) {
  const parsed = contributionSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { memberId, fundId, amount, type, method, referenceNo, contributedAt, notes } = parsed.data

  const [contribution] = await db.insert(contributions).values({
    memberId,
    fundId,
    amount:        amount.toString(),
    type,
    method,
    referenceNo:   referenceNo   ?? null,
    contributedAt: new Date(contributedAt),
    recordedBy,
    notes:         notes         ?? null,
  }).returning()

  // auto-generate receipt
  const lastReceipt = await db
    .select({ receiptNo: receipts.receiptNo })
    .from(receipts)
    .orderBy(sql`${receipts.receiptNo} DESC`)
    .limit(1)

  const nextNo = (lastReceipt[0]?.receiptNo ?? 0) + 1

  await db.insert(receipts).values({
    contributionId: contribution.id,
    receiptNo:      nextNo,
    issuedBy:       recordedBy,
  })

  return { success: true }
}

export async function deleteContribution(id: string) {
  await db.delete(contributions).where(eq(contributions.id, id))
  return { success: true }
}

// ─── RECEIPTS ─────────────────────────────────────────────────────────────────

export async function getReceipts(limit = 50) {
  return db
    .select({
      id:            receipts.id,
      receiptNo:     receipts.receiptNo,
      issuedAt:      receipts.issuedAt,
      amount:        contributions.amount,
      type:          contributions.type,
      method:        contributions.method,
      contributedAt: contributions.contributedAt,
      memberName:    members.name,
      fundName:      funds.name,
      issuedByName:  sql<string>`issued_by_member.name`,
    })
    .from(receipts)
    .innerJoin(contributions, eq(receipts.contributionId, contributions.id))
    .innerJoin(members,       eq(contributions.memberId,  members.id))
    .innerJoin(funds,         eq(contributions.fundId,    funds.id))
    .innerJoin(
      sql`${members} AS issued_by_member`,
      sql`${receipts.issuedBy} = issued_by_member.id`
    )
    .orderBy(sql`${receipts.receiptNo} DESC`)
    .limit(limit)
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

export async function getExpenses(limit = 50) {
  return db
    .select({
      id:          expenses.id,
      title:       expenses.title,
      category:    expenses.category,
      amount:      expenses.amount,
      date:        expenses.date,
      description: expenses.description,
      fundName:    funds.name,
      fundId:      funds.id,
      approvedBy:  expenses.approvedBy,
      createdAt:   expenses.createdAt,
    })
    .from(expenses)
    .innerJoin(funds, eq(expenses.fundId, funds.id))
    .orderBy(sql`${expenses.date} DESC`)
    .limit(limit)
}

export async function createExpense(data: unknown) {
  const parsed = expenseSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { fundId, title, category, amount, date, description, approvedBy } = parsed.data

  await db.insert(expenses).values({
    fundId,
    title,
    category,
    amount:      amount.toString(),
    date,
    description: description ?? null,
    approvedBy:  approvedBy  ?? null,
  })

  return { success: true }
}

export async function deleteExpense(id: string) {
  await db.delete(expenses).where(eq(expenses.id, id))
  return { success: true }
}

// ─── REMITTANCES ──────────────────────────────────────────────────────────────

export async function getRemittanceRates() {
  return db
    .select()
    .from(remittanceRates)
    .where(sql`${remittanceRates.isActive} = true`)
    .orderBy(remittanceRates.council)
}

export async function getRemittancePayments() {
  return db
    .select()
    .from(remittancePayments)
    .orderBy(sql`${remittancePayments.period} DESC, ${remittancePayments.council} ASC`)
}

export async function createRemittanceRate(data: unknown, createdBy: string) {
  const parsed = remittanceRateSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { council, ratePercent, effectiveFrom } = parsed.data

  // deactivate old rate for same council
  await db
    .update(remittanceRates)
    .set({ isActive: false })
    .where(sql`${remittanceRates.council} = ${council} AND ${remittanceRates.isActive} = true`)

  await db.insert(remittanceRates).values({
    council,
    ratePercent:   ratePercent.toString(),
    effectiveFrom,
    isActive:      true,
    createdBy,
  })

  return { success: true }
}

export async function createRemittancePayment(data: unknown, recordedBy: string) {
  const parsed = remittancePaymentSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { council, period, amountDue, amountPaid, referenceNo, paidAt } = parsed.data

  // check if period+council already exists
  const existing = await db
    .select({ id: remittancePayments.id })
    .from(remittancePayments)
    .where(sql`${remittancePayments.council} = ${council} AND ${remittancePayments.period} = ${period}`)
    .limit(1)

  if (existing[0]) {
    // update instead
    await db
      .update(remittancePayments)
      .set({
        amountDue:   amountDue.toString(),
        amountPaid:  amountPaid.toString(),
        referenceNo: referenceNo ?? null,
        paidAt:      paidAt ? new Date(paidAt) : null,
        recordedBy,
      })
      .where(eq(remittancePayments.id, existing[0].id))
  } else {
    await db.insert(remittancePayments).values({
      council,
      period,
      amountDue:   amountDue.toString(),
      amountPaid:  amountPaid.toString(),
      referenceNo: referenceNo ?? null,
      paidAt:      paidAt ? new Date(paidAt) : null,
      recordedBy,
    })
  }

  return { success: true }
}