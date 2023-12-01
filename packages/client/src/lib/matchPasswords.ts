import { useEffect, useState } from 'react'

export const matchPasswords = ({
  pass1,
  pass2,
}: {
  pass1: string
  pass2: string
}) => {
  const [match, setMatch] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMatch(pass1 === pass2)
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [pass1, pass2])

  return match
}
