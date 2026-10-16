import { describe, expect, it } from 'vitest'
import { checkUsername } from './username'

describe('checkUsername', () => {
  it.each(['sam_99', 'stonks.kid', 'abc'])('accepts %s', (name) => {
    expect(checkUsername(name)).toBeNull()
  })

  it('rejects bad length', () => {
    expect(checkUsername('ab')).toBe('length')
    expect(checkUsername('a'.repeat(25))).toBe('length')
  })

  it('rejects spaces and symbols', () => {
    expect(checkUsername('sam smith')).toBe('characters')
    expect(checkUsername('sam!')).toBe('characters')
  })

  it.each(['fuck_this', 'sh1thead', 'b1tch99'])(
    'rejects profanity %s',
    (name) => {
      expect(checkUsername(name)).toBe('inappropriate')
    }
  )
})
