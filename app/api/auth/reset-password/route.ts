import { NextRequest, NextResponse } from 'next/server'
import { db }                        from '@/lib/db/client'
import { members, passwordResetTokens } from '@/lib/db/schema'
import { eq, and, gt, isNull }       from 'drizzle-orm'
import bcrypt                        from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const [reset] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        gt(passwordResetTokens.expiresAt, new Date()),
        isNull(passwordResetTokens.usedAt),
      )
    )
    .limit(1)

  if (!reset) {
    return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await db
    .update(members)
    .set({ passwordHash })
    .where(eq(members.id, reset.memberId))

  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, reset.id))

  return NextResponse.json({ success: true })
}