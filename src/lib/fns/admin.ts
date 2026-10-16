import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  approveRequest,
  createClassroomFor,
  createClassroomRequest,
  listClassrooms,
  listMyRequests,
  listRequests,
  rejectRequest,
  requireAdmin,
  searchUsers,
  setAdmin,
} from '@/lib/server/admin'
import { attempt } from '@/lib/server/result'
import { authed } from '@/lib/middleware'

// --- Classroom requests (any signed-in user) ---

export const requestClassroomFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      schoolName: z.string().trim().min(2, 'Enter your school.').max(120),
      className: z.string().trim().min(2, 'Enter a class name.').max(60),
      expectedStudents: z.number().int().min(1).max(500),
      message: z.string().trim().max(1000).optional(),
    })
  )
  .handler(({ data, context }) =>
    attempt(async () => {
      await createClassroomRequest(context.user, data)
    })
  )

export const getMyRequestsFn = createServerFn({ method: 'GET' })
  .middleware([authed])
  .handler(async ({ context }) =>
    (await listMyRequests(context.user.id)).map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  )

// --- Admin ---

export const getAdminDashboardFn = createServerFn({ method: 'GET' })
  .middleware([authed])
  .handler(async ({ context }) => {
    requireAdmin(context.user)
    const [requests, classrooms] = await Promise.all([
      listRequests(),
      listClassrooms(),
    ])
    return {
      requests: requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      classrooms,
    }
  })

export type AdminDashboard = Awaited<ReturnType<typeof getAdminDashboardFn>>

export const approveRequestFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ requestId: z.number().int() }))
  .handler(({ data, context }) =>
    attempt(async () => {
      requireAdmin(context.user)
      const org = await approveRequest(context.user.id, data.requestId)
      return { slug: org.slug }
    })
  )

export const rejectRequestFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      requestId: z.number().int(),
      reason: z.string().trim().max(500).optional(),
    })
  )
  .handler(({ data, context }) =>
    attempt(async () => {
      requireAdmin(context.user)
      await rejectRequest(context.user.id, data.requestId, data.reason || null)
    })
  )

export const createClassroomForFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      ownerIdentifier: z.string().trim().min(1),
      name: z.string().trim().min(2).max(60),
    })
  )
  .handler(({ data, context }) =>
    attempt(async () => {
      requireAdmin(context.user)
      const org = await createClassroomFor(data)
      return { slug: org.slug }
    })
  )

export const searchUsersFn = createServerFn({ method: 'GET' })
  .middleware([authed])
  .validator(z.object({ q: z.string().trim().min(1).max(100) }))
  .handler(({ data, context }) => {
    requireAdmin(context.user)
    return searchUsers(data.q)
  })

export const setAdminFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ userId: z.string().min(1), admin: z.boolean() }))
  .handler(({ data, context }) =>
    attempt(async () => {
      requireAdmin(context.user)
      await setAdmin(context.user.id, data.userId, data.admin)
    })
  )
