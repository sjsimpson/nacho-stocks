import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth'

import { StockSearch } from './StockSearch'

export const Profile = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = (event: any) => {
    event.preventDefault()
    auth.logout()
    navigate('/')
  }

  const handleVerifyJWT = async (event: any) => {
    event.preventDefault()

    try {
      const res = await fetch('http://localhost:3001/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': auth.token,
        },
      })

      const test = await res.text()
      console.log('response.text', test)
    } catch (err) {
      console.log('bad credentials', err)
    }
  }

  return (
    <div>
      <button onClick={() => console.log('auth', auth)}>Check Auth</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleVerifyJWT}>Verify JWT</button>
      <StockSearch />
    </div>
  )
}
