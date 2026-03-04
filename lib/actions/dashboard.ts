'use server'

import { db }      from '@/lib/db/client'
import { members, contributions, expenses, ministryDepartments, funds } from '@/lib/db/schema'
import { sql, count, sum } from 'drizzle-orm'

export async function getAdminStats() {
  const [
    totalMembers,
    totalDepartments,
    monthlyContributions,
    monthlyExpenses,
  ] = await Promise.all([
    // Total active members
    db.select({ count: count() })
      .from(members)
      .where(sql`${members.isActive} = true`),

    // Total departments
    db.select({ count: count() })
      .from(ministryDepartments)
      .where(sql`${ministryDepartments.isActive} = true`),

    // Contributions this month
    db.select({ total: sum(contributions.amount) })
      .from(contributions)
      .where(sql`DATE_TRUNC('month', ${contributions.contributedAt}) = DATE_TRUNC('month', NOW())`),

    // Expenses this month
    db.select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(sql`DATE_TRUNC('month', ${expenses.date}) = DATE_TRUNC('month', NOW())`),
  ])

  return {
    totalMembers:        totalMembers[0]?.count ?? 0,
    totalDepartments:    totalDepartments[0]?.count ?? 0,
    monthlyContributions: Number(monthlyContributions[0]?.total ?? 0),
    monthlyExpenses:      Number(monthlyExpenses[0]?.total ?? 0),
  }
}

export async function getRecentMembers() {
  return db
    .select({
      id:        members.id,
      name:      members.name,
      email:     members.email,
      role:      members.role,
      isActive:  members.isActive,
      createdAt: members.createdAt,
    })
    .from(members)
    .orderBy(sql`${members.createdAt} DESC`)
    .limit(5)
}

export async function getRecentContributions() {
  return db
    .select({
      id:            contributions.id,
      amount:        contributions.amount,
      type:          contributions.type,
      method:        contributions.method,
      contributedAt: contributions.contributedAt,
      memberName:    members.name,
    })
    .from(contributions)
    .innerJoin(members, sql`${contributions.memberId} = ${members.id}`)
    .orderBy(sql`${contributions.contributedAt} DESC`)
    .limit(5)
}