import { APIError } from 'better-auth/api'
import { ClassError } from './classes'

export type Result<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string }

/** Turns expected errors into a result the UI can show. Rethrows the rest. */
export async function attempt<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (e) {
    if (e instanceof ClassError || e instanceof APIError) {
      return { ok: false, error: e.message }
    }
    throw e
  }
}
