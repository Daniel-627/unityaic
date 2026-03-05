'use server'

import { db }      from '@/lib/db/client'
import { members } from '@/lib/db/schema'
import { eq }      from 'drizzle-orm'
import bcrypt      from 'bcryptjs'
import { z }       from 'zod'

const profileSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match.',
  path:    ['confirmPassword'],
})

export async function updateProfile(id: string, data: unknown) {
  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { name, email, phone } = parsed.data

  // check email not taken by another member
  const existing = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.email, email))
    .limit(1)

  if (existing[0] && existing[0].id !== id) {
    return { success: false, error: 'Email already in use.' }
  }

  await db
    .update(members)
    .set({ name, email, phone: phone ?? null })
    .where(eq(members.id, id))

  return { success: true }
}

export async function changePassword(id: string, data: unknown) {
  const parsed = passwordSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const { currentPassword, newPassword } = parsed.data

  const [member] = await db
    .select({ passwordHash: members.passwordHash })
    .from(members)
    .where(eq(members.id, id))
    .limit(1)

  if (!member) return { success: false, error: 'Member not found.' }

  const valid = await bcrypt.compare(currentPassword, member.passwordHash)
  if (!valid) return { success: false, error: 'Current password is incorrect.' }

  const newHash = await bcrypt.hash(newPassword, 12)

  await db
    .update(members)
    .set({ passwordHash: newHash })
    .where(eq(members.id, id))

  return { success: true }
}