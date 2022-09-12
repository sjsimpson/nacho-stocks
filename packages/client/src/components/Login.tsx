import { useState, MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import { User } from '../types'

import { Button, ButtonTypes } from './common/Button'

import './styles/Login.scss'
import './styles/Modal.scss'

export const Login = ({ closeModal }: { closeModal: Function }) => {
  const [user, setUser] = useState<User | null>({ username: '', password: '' })

  const auth = useAuth()
  const navigate = useNavigate()

  const handleClose = (event: any) => {
    event.preventDefault()
    closeModal()
  }

  const handleInputChange = (event: any) => {
    const { value, name } = event.target

    const newUser: User = {
      ...user,
      [name]: value,
    }

    setUser(newUser)
  }

  const onSubmit = async (event: any) => {
    event.preventDefault()

    try {
      const res = await fetch('http://localhost:3001/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (res.status !== 200) {
        throw new Error(res.statusText)
      }

      const token = await res.text()
      console.log('token', token)

      auth.login(token)
      closeModal()
      navigate('/')
    } catch (err) {
      console.log('bad credentials', err)
    }
  }

  return (
    <div className="container">
      <div className="darkBG" onClick={handleClose} />
      <div className="modal centered">
        <div className="header" style={{ display: 'inline' }}>
          <span>Machu Login</span>
          <button className="close" onClick={handleClose}>
            close
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              id="username"
              type="username"
              name="username"
              value={user?.username}
              onChange={handleInputChange}
              required
            />
            <label className="control-label" htmlFor="username">
              Username
            </label>
          </div>
          <div className="form-group">
            <input
              id="password"
              type="password"
              name="password"
              value={user?.password}
              onChange={handleInputChange}
              required
            />
            <label className="control-label" htmlFor="passowrd">
              Password
            </label>
          </div>
          <input className="button" type="submit" value="Login" />
        </form>
        <Button
          type={ButtonTypes.filled}
          text="Check Auth"
          onClick={() => {
            console.log('auth', auth)
          }}
        />
      </div>
    </div>
  )
}
