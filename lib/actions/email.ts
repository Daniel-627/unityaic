'use server'

import { db }                   from '@/lib/db/client'
import { eventRegistrations, members, events } from '@/lib/db/schema'
import { eq }                   from 'drizzle-orm'
import { resend, FROM }         from '@/lib/email'
import { eventReminderEmail, contributionReceiptEmail } from '@/lib/email-templates'

export async function sendEventReminders(eventId: string) {
  const event = await db
    .select({ title: events.title, startDate: events.startDate, location: events.location })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1)
    .then(r => r[0])

  if (!event) return { success: false, error: 'Event not found' }

  const registrations = await db
    .select({ name: members.name, email: members.email })
    .from(eventRegistrations)
    .innerJoin(members, eq(eventRegistrations.memberId, members.id))
    .where(eq(eventRegistrations.eventId, eventId))

  if (!registrations.length) return { success: false, error: 'No registered members' }

  const date = new Intl.DateTimeFormat('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(event.startDate))

  await Promise.allSettled(
    registrations.map(r => {
      const template = eventReminderEmail(r.name, event.title, date, event.location)
      return resend.emails.send({ from: FROM, to: r.email, subject: template.subject, html: template.html })
    })
  )

  return { success: true, count: registrations.length }
}

export async function sendContributionReceiptEmail(
  memberEmail: string,
  memberName:  string,
  receiptNo:   string,
  amount:      string,
  fund:        string,
  method:      string,
  date:        string,
) {
  const template = contributionReceiptEmail(memberName, receiptNo, amount, fund, method, date)
  await resend.emails.send({ from: FROM, to: memberEmail, subject: template.subject, html: template.html })
  return { success: true }
}