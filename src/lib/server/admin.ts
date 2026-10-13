import { and, count, desc, eq, ilike, inArray, or } from 'drizzle-orm'
import { db, schema } from '@/db'
import { ClassError, createClass } from './classes'
import { isPlaceholderEmail, sendEmail } from './email'
import * as templates from './email/templates'
import { env } from './env'

const appUrl = (path: string) =>
  new URL(path, env.BETTER_AUTH_URL ?? 'http://localhost:3000').toString()

export function requireAdmin(user: { role?: string | null }) {
  if (user.role !== 'admin') throw new ClassError('Admins only.')
}

// --- Requests (teacher side) ---

export async function createClassroomRequest(
  user: {
    id: string
    email: string
    emailVerified: boolean
    username?: string | null
  },
  input: {
    schoolName: string
    className: string
    expectedStudents: number
    message?: string
  }
) {
  if (isPlaceholderEmail(user.email)) {
    throw new ClassError('Add an email address to your account first.')
  }
  if (!user.emailVerified) {
    throw new ClassError('Verify your email address first.')
  }
  const [pending] = await db
    .select({ id: schema.classroomRequest.id })
    .from(schema.classroomRequest)
    .where(
      and(
        eq(schema.classroomRequest.userId, user.id),
        eq(schema.classroomRequest.status, 'pending')
      )
    )
  if (pending) throw new ClassError('You already have a pending request.')

  const [request] = await db
    .insert(schema.classroomRequest)
    .values({ userId: user.id, ...input })
    .returning()

  if (env.ADMIN_EMAILS.length) {
    await sendEmail({
      to: env.ADMIN_EMAILS,
      ...templates.classroomRequested({
        username: user.username ?? user.id,
        email: user.email,
        schoolName: input.schoolName,
        className: input.className,
        adminUrl: appUrl('/admin'),
      }),
    }).catch((e: unknown) => console.error('Admin notification failed', e))
  }
  return request!
}

export function listMyRequests(userId: string) {
  return db
    .select({
      id: schema.classroomRequest.id,
      schoolName: schema.classroomRequest.schoolName,
      className: schema.classroomRequest.className,
      status: schema.classroomRequest.status,
      rejectionReason: schema.classroomRequest.rejectionReason,
      createdAt: schema.classroomRequest.createdAt,
      slug: schema.organization.slug,
    })
    .from(schema.classroomRequest)
    .leftJoin(
      schema.organization,
      eq(schema.classroomRequest.organizationId, schema.organization.id)
    )
    .where(eq(schema.classroomRequest.userId, userId))
    .orderBy(desc(schema.classroomRequest.createdAt))
}

// --- Admin ---

export async function listRequests() {
  return db
    .select({
      id: schema.classroomRequest.id,
      schoolName: schema.classroomRequest.schoolName,
      className: schema.classroomRequest.className,
      expectedStudents: schema.classroomRequest.expectedStudents,
      message: schema.classroomRequest.message,
      status: schema.classroomRequest.status,
      rejectionReason: schema.classroomRequest.rejectionReason,
      createdAt: schema.classroomRequest.createdAt,
      userId: schema.user.id,
      username: schema.user.username,
      name: schema.user.name,
      email: schema.user.email,
    })
    .from(schema.classroomRequest)
    .innerJoin(schema.user, eq(schema.classroomRequest.userId, schema.user.id))
    .orderBy(desc(schema.classroomRequest.createdAt))
}

async function getPendingRequest(requestId: number) {
  const [request] = await db
    .select()
    .from(schema.classroomRequest)
    .where(eq(schema.classroomRequest.id, requestId))
  if (!request) throw new ClassError('Request not found.')
  if (request.status !== 'pending') {
    throw new ClassError('This request was already reviewed.')
  }
  return request
}

export async function approveRequest(adminId: string, requestId: number) {
  const request = await getPendingRequest(requestId)
  const org = await createClass(request.className, request.userId)
  await db
    .update(schema.classroomRequest)
    .set({
      status: 'approved',
      organizationId: org.id,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    })
    .where(eq(schema.classroomRequest.id, requestId))

  const [owner] = await db
    .select({ email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, request.userId))
  if (owner) {
    await sendEmail({
      to: owner.email,
      ...templates.classroomApproved({
        className: request.className,
        url: appUrl(`/classes/${org.slug}`),
      }),
    }).catch((e: unknown) => console.error('Approval email failed', e))
  }
  return org
}

export async function rejectRequest(
  adminId: string,
  requestId: number,
  reason: string | null
) {
  const request = await getPendingRequest(requestId)
  await db
    .update(schema.classroomRequest)
    .set({
      status: 'rejected',
      rejectionReason: reason,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    })
    .where(eq(schema.classroomRequest.id, requestId))

  const [owner] = await db
    .select({ email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, request.userId))
  if (owner) {
    await sendEmail({
      to: owner.email,
      ...templates.classroomRejected({ className: request.className, reason }),
    }).catch((e: unknown) => console.error('Rejection email failed', e))
  }
}

export async function listClassrooms() {
  const orgs = await db
    .select({
      id: schema.organization.id,
      name: schema.organization.name,
      slug: schema.organization.slug,
      createdAt: schema.organization.createdAt,
    })
    .from(schema.organization)
    .orderBy(desc(schema.organization.createdAt))
  if (orgs.length === 0) return []

  const ids = orgs.map((o) => o.id)
  const [owners, counts] = await Promise.all([
    db
      .select({
        organizationId: schema.member.organizationId,
        username: schema.user.username,
        email: schema.user.email,
      })
      .from(schema.member)
      .innerJoin(schema.user, eq(schema.member.userId, schema.user.id))
      .where(
        and(
          inArray(schema.member.organizationId, ids),
          eq(schema.member.role, 'owner')
        )
      ),
    db
      .select({ organizationId: schema.member.organizationId, n: count() })
      .from(schema.member)
      .where(
        and(
          inArray(schema.member.organizationId, ids),
          eq(schema.member.role, 'member')
        )
      )
      .groupBy(schema.member.organizationId),
  ])

  return orgs.map((o) => {
    const owner = owners.find((x) => x.organizationId === o.id)
    return {
      ...o,
      createdAt: o.createdAt.toISOString(),
      owner: owner?.username ?? null,
      students: counts.find((c) => c.organizationId === o.id)?.n ?? 0,
    }
  })
}

/** Finds a user by exact username or email. */
async function findUser(identifier: string) {
  const id = identifier.trim().toLowerCase()
  const [u] = await db
    .select()
    .from(schema.user)
    .where(or(eq(schema.user.username, id), eq(schema.user.email, id)))
  return u ?? null
}

export async function createClassroomFor(input: {
  ownerIdentifier: string
  name: string
}) {
  const owner = await findUser(input.ownerIdentifier)
  if (!owner) throw new ClassError('No user with that username or email.')
  return createClass(input.name, owner.id)
}

export async function searchUsers(query: string) {
  const q = `%${query.trim()}%`
  const rows = await db
    .select({
      id: schema.user.id,
      username: schema.user.username,
      email: schema.user.email,
      emailVerified: schema.user.emailVerified,
      role: schema.user.role,
      banned: schema.user.banned,
      createdAt: schema.user.createdAt,
    })
    .from(schema.user)
    .where(or(ilike(schema.user.username, q), ilike(schema.user.email, q)))
    .orderBy(schema.user.username)
    .limit(25)
  return rows.map((r) => ({
    ...r,
    email: isPlaceholderEmail(r.email) ? null : r.email,
    createdAt: r.createdAt.toISOString(),
  }))
}
