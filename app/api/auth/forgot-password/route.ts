import { NextRequest, NextResponse } from 'next/server'
import { db }                   from '@/lib/db/client'
import { members, passwordResetTokens } from '@/lib/db/schema'
import { eq }                   from 'drizzle-orm'
import { randomBytes }          from 'crypto'
import { resend, FROM }         from '@/lib/email'
import { passwordResetEmail }   from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ success: true }) // silent

  const [member] = await db
    .select({ id: members.id, name: members.name, email: members.email })
    .from(members)
    .where(eq(members.email, email))
    .limit(1)

  // Always return success to prevent email enumeration
  if (!member) return NextResponse.json({ success: true })

  const token     = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await db.insert(passwordResetTokens).values({
    memberId:  member.id,
    token,
    expiresAt,
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  const template = passwordResetEmail(member.name, resetUrl)

  await resend.emails.send({
    from:    FROM,
    to:      member.email,
    subject: template.subject,
    html:    template.html,
  })

  return NextResponse.json({ success: true })
}