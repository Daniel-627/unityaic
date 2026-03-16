'use server'

import { db } from '@/lib/db/client'
import {
  events,
  eventRegistrations,
  members,
  ministryDepartments,
} from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { z }       from 'zod'
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn:     false,
})

const eventSchema = z.object({
  title:        z.string().min(2),
  type:         z.enum(['GENERAL', 'RALLY', 'AGM', 'CONFERENCE', 'SPECIAL']),
  description:  z.string().optional(),
  departmentId: z.string().uuid().optional(),
  startDate:    z.string(),
  endDate:      z.string().optional(),
  location:     z.string().optional(),
  capacity:     z.coerce.number().optional(),
  isPublished:  z.boolean().default(false),
})

const editEventSchema = eventSchema.extend({ id: z.string().uuid() })

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export async function getEvents() {
  return db
    .select({
      id:             events.id,
      title:          events.title,
      type:           events.type,
      startDate:      events.startDate,
      endDate:        events.endDate,
      location:       events.location,
      capacity:       events.capacity,
      isPublished:    events.isPublished,
      departmentName: ministryDepartments.name,
    })
    .from(events)
    .leftJoin(ministryDepartments, eq(events.departmentId, ministryDepartments.id))
    .orderBy(sql`${events.startDate} DESC`)
}

export async function getEventById(id: string) {
  const [event] = await db
    .select({
      id:             events.id,
      title:          events.title,
      type:           events.type,
      description:    events.description,
      startDate:      events.startDate,
      endDate:        events.endDate,
      location:       events.location,
      capacity:       events.capacity,
      isPublished:    events.isPublished,
      departmentId:   events.departmentId,
      departmentName: ministryDepartments.name,
    })
    .from(events)
    .leftJoin(ministryDepartments, eq(events.departmentId, ministryDepartments.id))
    .where(eq(events.id, id))
    .limit(1)

  if (!event) return null

  const registrations = await db
    .select({
      id:           eventRegistrations.id,
      memberId:     members.id,
      memberName:   members.name,
      memberEmail:  members.email,
      registeredAt: eventRegistrations.registeredAt,
      attended:     eventRegistrations.attended,
    })
    .from(eventRegistrations)
    .innerJoin(members, eq(eventRegistrations.memberId, members.id))
    .where(eq(eventRegistrations.eventId, id))
    .orderBy(sql`${eventRegistrations.registeredAt} DESC`)

  const allMembers = await db
    .select({ id: members.id, name: members.name })
    .from(members)
    .where(sql`${members.isActive} = true`)
    .orderBy(members.name)

  const allDepartments = await db
    .select({ id: ministryDepartments.id, name: ministryDepartments.name })
    .from(ministryDepartments)
    .where(sql`${ministryDepartments.isActive} = true`)

  const media = await sanityClient
    .fetch(`*[_type == "eventMedia" && eventId == $eventId][0]`, { eventId: id })
    .catch(() => null)

  return { ...event, registrations, allMembers, allDepartments, media }
}

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export async function createEvent(data: unknown, createdBy: string) {
  const parsed = eventSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { title, type, description, departmentId, startDate, endDate, location, capacity, isPublished } = parsed.data

  await db.insert(events).values({
    title,
    type,
    description:  description  ?? null,
    departmentId: departmentId ?? null,
    startDate,
    endDate:      endDate      ?? null,
    location:     location     ?? null,
    capacity:     capacity     ?? null,
    isPublished,
    createdBy,
  })

  return { success: true }
}

export async function updateEvent(data: unknown) {
  const parsed = editEventSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { id, title, type, description, departmentId, startDate, endDate, location, capacity, isPublished } = parsed.data

  await db
    .update(events)
    .set({ title, type, description: description ?? null, departmentId: departmentId ?? null, startDate, endDate: endDate ?? null, location: location ?? null, capacity: capacity ?? null, isPublished })
    .where(eq(events.id, id))

  return { success: true }
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id))
  return { success: true }
}

export async function registerForEvent(eventId: string, memberId: string) {
  const existing = await db
    .select({ id: eventRegistrations.id })
    .from(eventRegistrations)
    .where(sql`${eventRegistrations.eventId} = ${eventId} AND ${eventRegistrations.memberId} = ${memberId}`)
    .limit(1)

  if (existing[0]) return { success: false, error: 'Already registered.' }

  await db.insert(eventRegistrations).values({ eventId, memberId, attended: false })
  return { success: true }
}

export async function toggleAttended(registrationId: string, current: boolean) {
  await db
    .update(eventRegistrations)
    .set({ attended: !current })
    .where(eq(eventRegistrations.id, registrationId))

  return { success: true }
}

export async function removeRegistration(registrationId: string) {
  await db.delete(eventRegistrations).where(eq(eventRegistrations.id, registrationId))
  return { success: true }
}