/** Starting cash for every new account, in cents. */
export const STARTING_CASH_CENTS = 1_000_000

/** How many classes a student may join. Raise to allow multiple classes. */
export const MAX_CLASSES_PER_STUDENT = 1

export const ACCOUNT_TYPES = ['student', 'teacher'] as const
export type AccountType = (typeof ACCOUNT_TYPES)[number]

export const TEACHER_ROLES = ['owner', 'admin'] as const
