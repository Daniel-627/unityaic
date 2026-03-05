'use server'

import { db } from '@/lib/db/client'
import {
  ministryDepartments,
  departmentMemberships,
  members,
} from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

const updateDepartmentSchema = z.object({
  id:          z.string().uuid(),
  name:        z.string().min(2),
  description: z.string().optional(),
  headId:      z.string().uuid().nullable(),
})

const addMemberSchema = z.object({
  departmentId: z.string().uuid(),
  memberId:     z.string().uuid(),
})

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export async function getDepartments() {
  const depts = await db
    .select({
      id:          ministryDepartments.id,
      name:        ministryDepartments.name,
      type:        ministryDepartments.type,
      description: ministryDepartments.description,
      isActive:    ministryDepartments.isActive,
      headId:      ministryDepartments.headId,
      headName:    members.name,
    })
    .from(ministryDepartments)
    .leftJoin(members, eq(ministryDepartments.headId, members.id))
    .orderBy(ministryDepartments.name)

  // member count per dept
  const counts = await db
    .select({
      departmentId: departmentMemberships.departmentId,
      count:        sql<number>`COUNT(*)::int`,
    })
    .from(departmentMemberships)
    .where(sql`${departmentMemberships.isActive} = true`)
    .groupBy(departmentMemberships.departmentId)

  const countMap = Object.fromEntries(counts.map(c => [c.departmentId, c.count]))

  return depts.map(d => ({ ...d, memberCount: countMap[d.id] ?? 0 }))
}

export async function getDepartmentById(id: string) {
  const [dept] = await db
    .select({
      id:          ministryDepartments.id,
      name:        ministryDepartments.name,
      type:        ministryDepartments.type,
      description: ministryDepartments.description,
      isActive:    ministryDepartments.isActive,
      headId:      ministryDepartments.headId,
      headName:    members.name,
    })
    .from(ministryDepartments)
    .leftJoin(members, eq(ministryDepartments.headId, members.id))
    .where(eq(ministryDepartments.id, id))
    .limit(1)

  if (!dept) return null

  const roster = await db
    .select({
      membershipId: departmentMemberships.id,
      memberId:     members.id,
      memberName:   members.name,
      memberEmail:  members.email,
      memberRole:   members.role,
      joinedAt:     departmentMemberships.joinedAt,
      isActive:     departmentMemberships.isActive,
    })
    .from(departmentMemberships)
    .innerJoin(members, eq(departmentMemberships.memberId, members.id))
    .where(eq(departmentMemberships.departmentId, id))
    .orderBy(sql`${departmentMemberships.joinedAt} DESC`)

  const allMembers = await db
    .select({ id: members.id, name: members.name, role: members.role })
    .from(members)
    .where(sql`${members.isActive} = true`)
    .orderBy(members.name)

  return { ...dept, roster, allMembers }
}

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export async function updateDepartment(data: unknown) {
  const parsed = updateDepartmentSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { id, name, description, headId } = parsed.data

  await db
    .update(ministryDepartments)
    .set({ name, description: description ?? null, headId })
    .where(eq(ministryDepartments.id, id))

  return { success: true }
}

export async function addMemberToDepartment(data: unknown) {
  const parsed = addMemberSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { departmentId, memberId } = parsed.data

  // check not already active member
  const existing = await db
    .select({ id: departmentMemberships.id })
    .from(departmentMemberships)
    .where(
      sql`${departmentMemberships.departmentId} = ${departmentId}
      AND ${departmentMemberships.memberId} = ${memberId}
      AND ${departmentMemberships.isActive} = true`
    )
    .limit(1)

  if (existing[0]) return { success: false, error: 'Member already in this department.' }

  await db.insert(departmentMemberships).values({
    departmentId,
    memberId,
    isActive: true,
  })

  return { success: true }
}

export async function removeMemberFromDepartment(membershipId: string) {
  await db
    .update(departmentMemberships)
    .set({ isActive: false, leftAt: sql`NOW()` })
    .where(eq(departmentMemberships.id, membershipId))

  return { success: true }
}

export async function seedDepartments() {
  const existing = await db.select({ id: ministryDepartments.id }).from(ministryDepartments).limit(1)
  if (existing[0]) return { success: false, error: 'Departments already exist.' }

  await db.insert(ministryDepartments).values([
    { name: 'Youth (JOY)',         type: 'YOUTH',             isActive: true },
    { name: "Women's Fellowship",  type: 'WOMENS_FELLOWSHIP', isActive: true },
    { name: "Men's Fellowship",    type: 'MENS_FELLOWSHIP',   isActive: true },
    { name: 'Sunday School',       type: 'SUNDAY_SCHOOL',     isActive: true },
    { name: 'Cadet / Star',        type: 'CADET_STAR',        isActive: true },
  ])

  return { success: true }
}