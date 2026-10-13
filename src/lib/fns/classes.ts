import { createServerFn } from '@tanstack/react-start'
import { APIError } from 'better-auth/api'
import { z } from 'zod'
import { checkUsername, usernameProblemMessage } from '@/lib/username'
import {
  ClassError,
  createClass,
  getClassBySlug,
  getRoster,
  getStudentInClass,
  joinClass,
  listClassesFor,
  regenerateJoinCode,
  removeFromClass,
  renameStudent,
  requireTeacher,
  resetStudentPassword,
  setMemberRole,
} from '@/lib/server/classes'
import { getPortfolio, getValueHistory } from '@/lib/server/portfolio'
import { authed } from '@/lib/server/session'

type Result<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string }

/** Turns expected errors into a result the UI can show. Rethrows the rest. */
async function attempt<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (e) {
    if (e instanceof ClassError || e instanceof APIError) {
      return { ok: false, error: e.message }
    }
    throw e
  }
}

const orgId = z.string().min(1)

export const getMyClasses = createServerFn({ method: 'GET' })
  .middleware([authed])
  .handler(({ context }) => listClassesFor(context.user.id))

export const createClassFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ name: z.string().trim().min(2).max(60) }))
  .handler(({ data, context }) =>
    attempt(async () => {
      if (context.user.accountType !== 'teacher') {
        throw new ClassError('Only teachers can create classes.')
      }
      const org = await createClass(data.name)
      return { slug: org!.slug }
    })
  )

export const joinClassFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ code: z.string().trim().min(4).max(12) }))
  .handler(({ data, context }) =>
    attempt(async () => {
      if (context.user.accountType !== 'student') {
        throw new ClassError('Only student accounts can join a class.')
      }
      const org = await joinClass(context.user.id, data.code)
      return { name: org.name }
    })
  )

/** Teacher dashboard data: class, join code, roster with portfolio values. */
export const getClassDashboard = createServerFn({ method: 'GET' })
  .middleware([authed])
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    const org = await getClassBySlug(data.slug)
    if (!org) return null
    const me = await requireTeacher(context.user.id, org.id).catch(() => null)
    if (!me) return null
    return {
      class: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        joinCode: org.joinCode,
      },
      myRole: me.role,
      roster: await getRoster(org.id),
    }
  })

export type ClassDashboard = NonNullable<
  Awaited<ReturnType<typeof getClassDashboard>>
>

export const getStudentPortfolio = createServerFn({ method: 'GET' })
  .middleware([authed])
  .validator(z.object({ slug: z.string().min(1), userId: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    const org = await getClassBySlug(data.slug)
    if (!org) return null
    const student = await getStudentInClass(
      context.user.id,
      org.id,
      data.userId
    ).catch(() => null)
    if (!student) return null
    const [portfolio, history] = await Promise.all([
      getPortfolio(student.id),
      getValueHistory(student.id),
    ])
    return {
      class: { name: org.name, slug: org.slug },
      student,
      portfolio: portfolio!,
      history,
    }
  })

export const regenerateJoinCodeFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ organizationId: orgId }))
  .handler(({ data, context }) =>
    attempt(() => regenerateJoinCode(context.user.id, data.organizationId))
  )

export const renameStudentFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      organizationId: orgId,
      studentId: z.string().min(1),
      username: z
        .string()
        .trim()
        .superRefine((v, ctx) => {
          const p = checkUsername(v)
          if (p)
            ctx.addIssue({ code: 'custom', message: usernameProblemMessage[p] })
        }),
      reason: z.string().trim().max(200).optional(),
    })
  )
  .handler(({ data, context }) =>
    attempt(() => renameStudent({ actorId: context.user.id, ...data }))
  )

export const resetStudentPasswordFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      organizationId: orgId,
      studentId: z.string().min(1),
      password: z.string().min(8).max(128),
    })
  )
  .handler(({ data, context }) =>
    attempt(() => resetStudentPassword({ actorId: context.user.id, ...data }))
  )

export const removeMemberFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ organizationId: orgId, memberId: z.string().min(1) }))
  .handler(({ data, context }) =>
    attempt(() =>
      removeFromClass(context.user.id, data.organizationId, data.memberId)
    )
  )

export const setMemberRoleFn = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      organizationId: orgId,
      memberId: z.string().min(1),
      role: z.enum(['member', 'admin']),
    })
  )
  .handler(({ data, context }) =>
    attempt(() =>
      setMemberRole(
        context.user.id,
        data.organizationId,
        data.memberId,
        data.role
      )
    )
  )
