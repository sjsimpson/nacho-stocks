import { randomInt } from 'node:crypto'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { db, schema } from '@/db'
import { TEACHER_ROLES, STARTING_CASH_CENTS } from '@/lib/constants'
import { holdingsValue } from '@/lib/trading'
import { auth } from './auth'
import { market } from './market'

export class ClassError extends Error {}

// No 0/O/1/I/L to avoid misreading codes off a whiteboard.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const generateJoinCode = (length = 6) =>
  Array.from(
    { length },
    () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  ).join('')

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)

/** Throws unless the user is an owner/admin of the class. Returns their member row. */
export async function requireTeacher(userId: string, organizationId: string) {
  const [m] = await db
    .select()
    .from(schema.member)
    .where(
      and(
        eq(schema.member.userId, userId),
        eq(schema.member.organizationId, organizationId),
        inArray(schema.member.role, [...TEACHER_ROLES])
      )
    )
  if (!m) throw new ClassError('You do not manage this class.')
  return m
}

/** Throws unless the target is a student (role `member`) in the class. */
async function requireStudentIn(userId: string, organizationId: string) {
  const [m] = await db
    .select()
    .from(schema.member)
    .where(
      and(
        eq(schema.member.userId, userId),
        eq(schema.member.organizationId, organizationId),
        eq(schema.member.role, 'member')
      )
    )
  if (!m) throw new ClassError('That student is not in this class.')
  return m
}

export async function getClassBySlug(slug: string) {
  const [org] = await db
    .select()
    .from(schema.organization)
    .where(eq(schema.organization.slug, slug))
  return org ?? null
}

export async function listClassesFor(userId: string) {
  return db
    .select({
      id: schema.organization.id,
      name: schema.organization.name,
      slug: schema.organization.slug,
      role: schema.member.role,
    })
    .from(schema.member)
    .innerJoin(
      schema.organization,
      eq(schema.member.organizationId, schema.organization.id)
    )
    .where(eq(schema.member.userId, userId))
    .orderBy(schema.organization.name)
}

export async function createClass(name: string) {
  const base = slugify(name) || 'class'
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug =
      attempt === 0 ? base : `${base}-${generateJoinCode(4).toLowerCase()}`
    const taken = await getClassBySlug(slug)
    if (taken) continue
    return auth.api.createOrganization({
      body: { name, slug, joinCode: generateJoinCode() },
      headers: getRequestHeaders(),
    })
  }
  throw new ClassError('Could not create class. Try a different name.')
}

export async function joinClass(userId: string, code: string) {
  const [org] = await db
    .select()
    .from(schema.organization)
    .where(eq(schema.organization.joinCode, code.trim().toUpperCase()))
  if (!org) throw new ClassError('No class found with that code.')

  const [existing] = await db
    .select()
    .from(schema.member)
    .where(
      and(
        eq(schema.member.userId, userId),
        eq(schema.member.organizationId, org.id)
      )
    )
  if (existing) throw new ClassError('You are already in this class.')

  // beforeAddMember hook enforces MAX_CLASSES_PER_STUDENT.
  await auth.api.addMember({
    body: { userId, organizationId: org.id, role: 'member' },
  })
  return org
}

export async function regenerateJoinCode(
  actorId: string,
  organizationId: string
) {
  await requireTeacher(actorId, organizationId)
  const joinCode = generateJoinCode()
  await db
    .update(schema.organization)
    .set({ joinCode })
    .where(eq(schema.organization.id, organizationId))
  return joinCode
}

export async function getRoster(organizationId: string) {
  const members = await db
    .select({
      memberId: schema.member.id,
      userId: schema.user.id,
      role: schema.member.role,
      name: schema.user.name,
      username: schema.user.username,
      displayUsername: schema.user.displayUsername,
      cashCents: schema.user.cashCents,
      joinedAt: schema.member.createdAt,
    })
    .from(schema.member)
    .innerJoin(schema.user, eq(schema.member.userId, schema.user.id))
    .where(eq(schema.member.organizationId, organizationId))
    .orderBy(schema.user.username)

  const studentIds = members
    .filter((m) => m.role === 'member')
    .map((m) => m.userId)
  const positions = studentIds.length
    ? await db
        .select()
        .from(schema.position)
        .where(inArray(schema.position.userId, studentIds))
    : []
  const prices = await market.quotes(positions.map((p) => p.symbol))

  return members.map((m) => {
    const holdingsCents = holdingsValue(
      positions.filter((p) => p.userId === m.userId),
      prices
    )
    const totalCents = m.cashCents + holdingsCents
    return {
      ...m,
      joinedAt: m.joinedAt.toISOString(),
      holdingsCents,
      totalCents,
      returnRatio: (totalCents - STARTING_CASH_CENTS) / STARTING_CASH_CENTS,
    }
  })
}

export async function getStudentInClass(
  actorId: string,
  organizationId: string,
  studentId: string
) {
  await requireTeacher(actorId, organizationId)
  await requireStudentIn(studentId, organizationId)
  const [u] = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      username: schema.user.username,
      displayUsername: schema.user.displayUsername,
    })
    .from(schema.user)
    .where(eq(schema.user.id, studentId))
  return u
}

export async function renameStudent(input: {
  actorId: string
  organizationId: string
  studentId: string
  username: string
  reason?: string
}) {
  await requireTeacher(input.actorId, input.organizationId)
  await requireStudentIn(input.studentId, input.organizationId)

  const normalized = input.username.toLowerCase()
  const [taken] = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(
      and(
        eq(schema.user.username, normalized),
        sql`${schema.user.id} <> ${input.studentId}`
      )
    )
  if (taken) throw new ClassError('That username is taken.')

  await db.transaction(async (tx) => {
    const [before] = await tx
      .select({ username: schema.user.username })
      .from(schema.user)
      .where(eq(schema.user.id, input.studentId))
    await tx
      .update(schema.user)
      .set({
        username: normalized,
        displayUsername: input.username,
        name: input.username,
      })
      .where(eq(schema.user.id, input.studentId))
    await tx.insert(schema.studentAudit).values({
      userId: input.studentId,
      actorId: input.actorId,
      organizationId: input.organizationId,
      action: 'rename',
      detail: {
        from: before?.username,
        to: normalized,
        reason: input.reason ?? null,
      },
    })
  })
}

export async function resetStudentPassword(input: {
  actorId: string
  organizationId: string
  studentId: string
  password: string
}) {
  await requireTeacher(input.actorId, input.organizationId)
  await requireStudentIn(input.studentId, input.organizationId)

  const ctx = await auth.$context
  const hash = await ctx.password.hash(input.password)
  await db.transaction(async (tx) => {
    const updated = await tx
      .update(schema.account)
      .set({ password: hash })
      .where(
        and(
          eq(schema.account.userId, input.studentId),
          eq(schema.account.providerId, 'credential')
        )
      )
      .returning({ id: schema.account.id })
    if (updated.length === 0)
      throw new ClassError('Student has no password login.')
    // Sign the student out everywhere.
    await tx
      .delete(schema.session)
      .where(eq(schema.session.userId, input.studentId))
    await tx.insert(schema.studentAudit).values({
      userId: input.studentId,
      actorId: input.actorId,
      organizationId: input.organizationId,
      action: 'password_reset',
    })
  })
}

export async function removeFromClass(
  actorId: string,
  organizationId: string,
  memberId: string
) {
  await requireTeacher(actorId, organizationId)
  await auth.api.removeMember({
    body: { memberIdOrEmail: memberId, organizationId },
    headers: getRequestHeaders(),
  })
}

export async function setMemberRole(
  actorId: string,
  organizationId: string,
  memberId: string,
  role: 'member' | 'admin'
) {
  await requireTeacher(actorId, organizationId)
  await auth.api.updateMemberRole({
    body: { memberId, organizationId, role },
    headers: getRequestHeaders(),
  })
}
