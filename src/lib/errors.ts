/**
 * Server fn validation errors arrive as an Error whose message is a JSON list
 * of zod issues. Return the first human-readable message.
 */
export function errorMessage(e: unknown) {
  if (!(e instanceof Error)) return 'Something went wrong.'
  try {
    const issues = JSON.parse(e.message) as { message: string }[]
    return issues[0]?.message ?? e.message
  } catch {
    return e.message
  }
}
