'use server'

import { db } from '@/lib/db/client'
import {
  services,
  attendanceRecords,
  members,
  ministryDepartments,
} from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

const serviceSchema = z.object({
  title:       z.string().min(2),
  type:        z.enum(['SUNDAY_SERVICE', 'MIDWEEK', 'PRAYER', 'SPECIAL']),
  date:        z.string(),
  time:        z.string().optional(),
  description: z.string().optional(),
  officiantId: z.string().uuid().optional(),
  notes:       z.string().optional(),
})

const editServiceSchema = serviceSchema.extend({ id: z.string().uuid() })

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export async function getServices() {
  return db
    .select({
      id:           services.id,
      title:        services.title,
      type:         services.type,
      date:         services.date,
      time:         services.time,
      officiantId:  services.officiantId,
      officiantName: members.name,
      createdAt:    services.createdAt,
    })
    .from(services)
    .leftJoin(members, eq(services.officiantId, members.id))
    .orderBy(sql`${services.date} DESC`)
}

export async function getServiceById(id: string) {
  const [service] = await db
    .select({
      id:            services.id,
      title:         services.title,
      type:          services.type,
      date:          services.date,
      time:          services.time,
      description:   services.description,
      notes:         services.notes,
      officiantId:   services.officiantId,
      officiantName: members.name,
    })
    .from(services)
    .leftJoin(members, eq(services.officiantId, members.id))
    .where(eq(services.id, id))
    .limit(1)

  if (!service) return null

  const attendance = await db
    .select({
      id:             attendanceRecords.id,
      memberId:       members.id,
      memberName:     members.name,
      memberEmail:    members.email,
      departmentId:   attendanceRecords.departmentId,
      departmentName: ministryDepartments.name,
      createdAt:      attendanceRecords.createdAt,
    })
    .from(attendanceRecords)
    .innerJoin(members, eq(attendanceRecords.memberId, members.id))
    .leftJoin(ministryDepartments, eq(attendanceRecords.departmentId, ministryDepartments.id))
    .where(eq(attendanceRecords.serviceId, id))
    .orderBy(members.name)

  const allMembers = await db
    .select({ id: members.id, name: members.name })
    .from(members)
    .where(sql`${members.isActive} = true`)
    .orderBy(members.name)

  const allDepartments = await db
    .select({ id: ministryDepartments.id, name: ministryDepartments.name })
    .from(ministryDepartments)
    .where(sql`${ministryDepartments.isActive} = true`)
    .orderBy(ministryDepartments.name)

  return { ...service, attendance, allMembers, allDepartments }
}

export async function getAttendanceOverview() {
  return db
    .select({
      serviceId:    services.id,
      serviceTitle: services.title,
      serviceType:  services.type,
      serviceDate:  services.date,
      count:        sql<number>`COUNT(${attendanceRecords.id})::int`,
    })
    .from(services)
    .leftJoin(attendanceRecords, eq(attendanceRecords.serviceId, services.id))
    .groupBy(services.id, services.title, services.type, services.date)
    .orderBy(sql`${services.date} DESC`)
    .limit(20)
}

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export async function createService(data: unknown) {
  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { title, type, date, time, description, officiantId, notes } = parsed.data

  await db.insert(services).values({
    title,
    type,
    date,
    time:        time        ?? null,
    description: description ?? null,
    officiantId: officiantId ?? null,
    notes:       notes       ?? null,
  })

  return { success: true }
}

export async function updateService(data: unknown) {
  const parsed = editServiceSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid input.' }

  const { id, title, type, date, time, description, officiantId, notes } = parsed.data

  await db
    .update(services)
    .set({ title, type, date, time: time ?? null, description: description ?? null, officiantId: officiantId ?? null, notes: notes ?? null })
    .where(eq(services.id, id))

  return { success: true }
}

export async function markAttendance(
  serviceId:    string,
  memberId:     string,
  recordedBy:   string,
  departmentId?: string,
) {
  // prevent duplicate
  const existing = await db
    .select({ id: attendanceRecords.id })
    .from(attendanceRecords)
    .where(
      sql`${attendanceRecords.serviceId} = ${serviceId}
      AND ${attendanceRecords.memberId} = ${memberId}`
    )
    .limit(1)

  if (existing[0]) return { success: false, error: 'Already marked.' }

  await db.insert(attendanceRecords).values({
    serviceId,
    memberId,
    recordedBy,
    departmentId: departmentId ?? null,
  })

  return { success: true }
}

export async function removeAttendance(attendanceId: string) {
  await db
    .delete(attendanceRecords)
    .where(eq(attendanceRecords.id, attendanceId))

  return { success: true }
}

export async function deleteService(id: string) {
  await db.delete(services).where(eq(services.id, id))
  return { success: true }
}