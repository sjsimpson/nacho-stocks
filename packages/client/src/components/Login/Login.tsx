import './Login.scss'

import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  TextInput,
  Icon,
  LoadingSpinner,
} from 'm3-react'

import { useAuthStore } from '../../stores/authStore'
import { useMutation } from '@tanstack/react-query'
import api from '../../api'

export default function Login({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: Function
}) {
  const [newUser, setNewUser] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPass, setConfirmedPass] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shake = () => {
    const shaker = document.getElementById('login-shake')
    shaker?.classList.add('shake')
    setTimeout(() => {
      shaker?.classList.remove('shake')
    }, 500)
  }

  const login = useMutation(
    () => api.post('/auth/login', { username, password }),
    {
      onError: () => {
        setLoading(false)
        shake()
      },
      onSuccess: (data) => {
        setLoading(false)

        closeModal()
        setToken(data.data)
        console.log('data', data)
      },
    }
  )

  const signup = useMutation(
    () => api.post('/user', { username, password, email }),
    {
      onError: (error) => {
        setLoading(false)
        shake()
        setError('Error server side with signup')
      },
      onSuccess: () => {
        setLoading(false)
      },
    }
  )

  const setToken = useAuthStore((state) => state.setToken)

  const handleClose = (event: any) => {
    event.preventDefault()
    closeModal()
    setNewUser(false)
    setError('')
  }

  const handleLogin = async () => {
    setLoading(true)
    login.mutate()
  }

  const handleSignUp = async () => {
    if (confirmedPass === password) {
      setLoading(true)
      signup.mutate()
    } else {
      setError('Passwords must match')
      shake()
    }
  }

  return (
    <>
      <Dialog open={open} modalSize="small" innerProps={{ id: 'login-shake' }}>
        <DialogHeader>
          <div className="modal-header-container">
            <div className="modal-header-start">
              {newUser && (
                <div className="back-button" onClick={() => setNewUser(false)}>
                  <Icon icon="arrow_back" />
                </div>
              )}
              <div className="header-text">
                {newUser ? 'Create New Account' : 'Login'}
              </div>
            </div>
            <div className="close-button" onClick={handleClose}>
              <Icon icon="close" />
            </div>
          </div>
        </DialogHeader>
        <DialogContent>
          <div className="login">
            <div className="form-group">
              <TextInput
                id="username"
                label="Username"
                value={username}
                inputStyle="outlined"
                background="tinted-surface"
                onInput={(event: any) => setUsername(event.target.value)}
                placeholder="Username"
              />
            </div>
            {newUser && (
              <div className="form-group">
                <TextInput
                  id="email"
                  label="Email"
                  value={email}
                  type="text"
                  inputStyle="outlined"
                  background="tinted-surface"
                  onInput={(event: any) => setEmail(event.target.value)}
                  placeholder="Email"
                />
              </div>
            )}
            <div className="form-group">
              <TextInput
                id="password"
                label="Password"
                value={password}
                type="password"
                inputStyle="outlined"
                background="tinted-surface"
                onInput={(event: any) => setPassword(event.target.value)}
                placeholder="Password"
              />
            </div>
            {newUser && (
              <div className="form-group">
                <TextInput
                  id="confirm-password"
                  label="Confirm Password"
                  value={confirmedPass}
                  type="password"
                  inputStyle="outlined"
                  background="tinted-surface"
                  onInput={(event: any) => setConfirmedPass(event.target.value)}
                  placeholder="Repeat Password"
                />
              </div>
            )}
          </div>
        </DialogContent>
        {error && (
          <div
            style={{
              borderRadius: 2,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              marginBottom: 16,
              backgroundColor: 'red',
            }}
          >
            {error}
          </div>
        )}
        <DialogFooter>
          <div
            className="login-footer"
            style={{ justifyContent: newUser ? 'flex-end' : 'space-between' }}
          >
            {!newUser && (
              <Button
                variant="text"
                text="No Account? Sign up!"
                disabled={loading}
                onClick={() => setNewUser(true)}
              />
            )}
            <Button
              variant="filled"
              disabled={loading}
              text={newUser ? 'Create Account' : 'Login'}
              onClick={newUser ? handleSignUp : handleLogin}
            />
          </div>
        </DialogFooter>
        {loading && (
          <div className="login-overlay">
            <LoadingSpinner size="small" />
          </div>
        )}
      </Dialog>
      <div
        onClick={handleClose}
        className={`modal-background ${open ? 'open' : ''}`}
      />
    </>
  )
}
