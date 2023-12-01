import './Login.scss'

import { useEffect, useState } from 'react'

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
import { useLogin, useSignup } from '../../queries/auth'
import { matchPasswords } from '../../lib/matchPasswords'

// TODO: Update TextInput to forwardRef, so I can focus the username input on
// open
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

  const match = matchPasswords({ pass1: password, pass2: confirmedPass })
  const login = useLogin()
  const signup = useSignup()

  const shake = () => {
    const shaker = document.getElementById('login-shake')
    shaker?.classList.add('shake')
    setTimeout(() => {
      shaker?.classList.remove('shake')
    }, 500)
  }

  const setToken = useAuthStore((state) => state.setToken)

  const handleClose = (event: any) => {
    event.preventDefault()
    closeModal()
    setNewUser(false)
    setError('')
  }

  const handleLogin = async () => {
    setLoading(true)
    login.mutate(
      { username, password },
      {
        onError: () => {
          setLoading(false)
          shake()
        },
        onSuccess: (data) => {
          setLoading(false)

          closeModal()
          setToken(data.data)
        },
      }
    )
  }

  const handleSignUp = async () => {
    if (match) {
      setLoading(true)
      signup.mutate(
        { username, password, email },
        {
          onError: (error) => {
            setLoading(false)
            shake()
            setError('Error server side with signup')
          },
          onSuccess: (data) => {
            setLoading(false)

            closeModal()

            setToken(data.data)
          },
        }
      )
    } else {
      setError('Passwords must match.')
      shake()
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    newUser ? handleSignUp() : handleLogin()
  }

  return (
    <>
      <Dialog open={open} modalSize="small" innerProps={{ id: 'login-shake' }}>
        <form action="." className="login" onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="modal-header-container">
              <div className="modal-header-start">
                {newUser && (
                  <div
                    className="back-button"
                    onClick={() => setNewUser(false)}
                  >
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
          </DialogContent>
          {newUser && !match && (
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
              Passwords must match
            </div>
          )}
          <DialogFooter>
            <div
              className="login-footer"
              style={{ justifyContent: newUser ? 'flex-end' : 'space-between' }}
            >
              {!newUser && (
                <Button
                  type="button"
                  variant="text"
                  text="No Account? Sign up!"
                  disabled={loading}
                  onClick={() => setNewUser(true)}
                />
              )}
              <Button
                type="submit"
                variant="filled"
                disabled={loading || (newUser && !match)}
                text={newUser ? 'Create Account' : 'Login'}
              />
            </div>
          </DialogFooter>
        </form>
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
