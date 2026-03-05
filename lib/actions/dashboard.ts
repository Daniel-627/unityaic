'use server'

import { db }      from '@/lib/db/client'
import { members, contributions, expenses, ministryDepartments, funds, remittancePayments, departmentMemberships, events } from '@/lib/db/schema'
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

export async function getFinanceStats() {
  const [
    monthlyContributions,
    monthlyExpenses,
    pendingRemittances,
    totalFunds,
  ] = await Promise.all([
    db.select({ total: sum(contributions.amount) })
      .from(contributions)
      .where(sql`DATE_TRUNC('month', ${contributions.contributedAt}) = DATE_TRUNC('month', NOW())`),

    db.select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(sql`DATE_TRUNC('month', ${expenses.date}) = DATE_TRUNC('month', NOW())`),

    db.select({ total: sum(remittancePayments.amountDue) })
      .from(remittancePayments)
      .where(sql`${remittancePayments.amountPaid} < ${remittancePayments.amountDue}`),

    db.select({ count: count() })
      .from(funds)
      .where(sql`${funds.isActive} = true`),
  ])

  return {
    monthlyContributions: Number(monthlyContributions[0]?.total ?? 0),
    monthlyExpenses:      Number(monthlyExpenses[0]?.total ?? 0),
    pendingRemittances:   Number(pendingRemittances[0]?.total ?? 0),
    totalFunds:           totalFunds[0]?.count ?? 0,
  }
}

export async function getDeptHeadStats(memberId: string) {
  const [dept] = await db
    .select()
    .from(ministryDepartments)
    .where(sql`${ministryDepartments.headId} = ${memberId}`)
    .limit(1)

  if (!dept) return null

  const [rosterCount, upcomingEvents] = await Promise.all([
    db.select({ count: count() })
      .from(departmentMemberships)
      .where(sql`${departmentMemberships.departmentId} = ${dept.id} AND ${departmentMemberships.isActive} = true`),

    db.select()
      .from(events)
      .where(sql`${events.departmentId} = ${dept.id} AND ${events.startDate} >= CURRENT_DATE`)
      .orderBy(sql`${events.startDate} ASC`)
      .limit(3),
  ])

  return {
    department:    dept,
    rosterCount:   rosterCount[0]?.count ?? 0,
    upcomingEvents,
  }
}

export async function getMemberStats(memberId: string) {
  const [myContributions, myDepartments, upcomingEvents] = await Promise.all([
    db.select({ total: sum(contributions.amount) })
      .from(contributions)
      .where(sql`${contributions.memberId} = ${memberId}`),

    db.select({
      id:   ministryDepartments.id,
      name: ministryDepartments.name,
      type: ministryDepartments.type,
    })
      .from(departmentMemberships)
      .innerJoin(ministryDepartments, sql`${departmentMemberships.departmentId} = ${ministryDepartments.id}`)
      .where(sql`${departmentMemberships.memberId} = ${memberId} AND ${departmentMemberships.isActive} = true`),

    db.select()
      .from(events)
      .where(sql`${events.isPublished} = true AND ${events.startDate} >= CURRENT_DATE`)
      .orderBy(sql`${events.startDate} ASC`)
      .limit(3),
  ])

  const recentGiving = await db
    .select({
      id:            contributions.id,
      amount:        contributions.amount,
      type:          contributions.type,
      method:        contributions.method,
      contributedAt: contributions.contributedAt,
    })
    .from(contributions)
    .where(sql`${contributions.memberId} = ${memberId}`)
    .orderBy(sql`${contributions.contributedAt} DESC`)
    .limit(5)

  return {
    totalGiving:    Number(myContributions[0]?.total ?? 0),
    departments:    myDepartments,
    upcomingEvents,
    recentGiving,
  }
}