'use server'

import { db }      from '@/lib/db/client'
import { members, departmentMemberships, ministryDepartments } from '@/lib/db/schema'
import { eq, sql, ilike, or } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

const createMemberSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  phone:    z.string().optional(),
  role:     z.enum(['MEMBER', 'DEPT_HEAD', 'FINANCE_OFFICER', 'ADMIN']),
  password: z.string().min(6),
})

const updateMemberSchema = z.object({
  id:       z.string().uuid(),
  name:     z.string().min(2),
  email:    z.string().email(),
  phone:    z.string().optional(),
  role:     z.enum(['MEMBER', 'DEPT_HEAD', 'FINANCE_OFFICER', 'ADMIN']),
  isActive: z.boolean(),
})

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export async function getMembers(search?: string) {
  if (search) {
    return db
      .select()
      .from(members)
      .where(
        or(
          ilike(members.name,  `%${search}%`),
          ilike(members.email, `%${search}%`),
        )
      )
      .orderBy(sql`${members.createdAt} DESC`)
  }

  return db
    .select()
    .from(members)
    .orderBy(sql`${members.createdAt} DESC`)
}

export async function getMemberById(id: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, id))
    .limit(1)

  if (!member) return null

  const depts = await db
    .select({
      id:   ministryDepartments.id,
      name: ministryDepartments.name,
      type: ministryDepartments.type,
    })
    .from(departmentMemberships)
    .innerJoin(
      ministryDepartments,
      eq(departmentMemberships.departmentId, ministryDepartments.id)
    )
    .where(
      sql`${departmentMemberships.memberId} = ${id} AND ${departmentMemberships.isActive} = true`
    )

  return { ...member, departments: depts }
}

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export async function createMember(data: unknown) {
  const parsed = createMemberSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { name, email, phone, role, password } = parsed.data

  const existing = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.email, email))
    .limit(1)

  if (existing[0]) return { success: false, error: 'Email already exists.' }

  const passwordHash = await bcrypt.hash(password, 12)

  await db.insert(members).values({
    name,
    email,
    phone:    phone ?? null,
    role,
    passwordHash,
    isActive: true,
  })

  return { success: true }
}

export async function updateMember(data: unknown) {
  const parsed = updateMemberSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { id, name, email, phone, role, isActive } = parsed.data

  await db
    .update(members)
    .set({ name, email, phone: phone ?? null, role, isActive })
    .where(eq(members.id, id))

  return { success: true }
}

export async function deactivateMember(id: string) {
  await db
    .update(members)
    .set({ isActive: false })
    .where(eq(members.id, id))

  return { success: true }
}