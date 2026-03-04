import { NextRequest, NextResponse } from 'next/server'
import { db }      from '@/lib/db/client'
import { members } from '@/lib/db/schema'
import { eq }      from 'drizzle-orm'
import bcrypt      from 'bcryptjs'
import { z }       from 'zod'

const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  phone:    z.string().optional(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const body   = await req.json()
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  const { name, email, phone, password } = parsed.data

  const existing = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.email, email))
    .limit(1)

  if (existing[0]) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await db.insert(members).values({
    name,
    email,
    phone:        phone ?? null,
    passwordHash,
    role:         'MEMBER',
    isActive:     true,
  })

  return NextResponse.json({ success: true }, { status: 201 })
}