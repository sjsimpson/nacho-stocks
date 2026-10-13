import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'

export const USERNAME_MIN = 3
export const USERNAME_MAX = 24
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

export type UsernameProblem = 'length' | 'characters' | 'inappropriate'

/** Returns the first problem with a username, or null if acceptable. */
export function checkUsername(username: string): UsernameProblem | null {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return 'length'
  }
  if (!USERNAME_PATTERN.test(username)) return 'characters'
  if (matcher.hasMatch(username)) return 'inappropriate'
  return null
}

export const usernameProblemMessage: Record<UsernameProblem, string> = {
  length: `Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters.`,
  characters: 'Use only letters, numbers, underscores, and periods.',
  inappropriate: 'Please choose a different username.',
}
