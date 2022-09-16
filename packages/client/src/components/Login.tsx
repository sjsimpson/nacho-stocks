import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import { User } from '../types'

import { Button, ButtonTypes } from './common/Button'
import { TextField, TextFieldStyles, Colors } from './common/TextField'

import { login } from '../api/authApi'

import './styles/Login.scss'
import './styles/Modal.scss'
import { Icon, IconTypes } from './common/Icon'

export const Login = ({ closeModal }: { closeModal: Function }) => {
  let [username, setUsername] = useState<string>('')
  let [password, setPassword] = useState<string>('')

  const auth = useAuth()
  const navigate = useNavigate()

  const handleClose = (event: any) => {
    event.preventDefault()
    closeModal()
  }

  const onSubmit = async () => {
    try {
      const token = await login({ username, password })
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
        <div className="login">
          <div className="auth-header">
            <div className="header-text">Login</div>
            <div className="close-button" onClick={handleClose}>
              <Icon icon={IconTypes.close} />
            </div>
          </div>
          <div className="auth-content">
            <div className="form-group">
              <TextField
                id="username"
                value={username}
                inputStyle={TextFieldStyles.outlined}
                background={Colors.tintedSurface}
                onInput={setUsername}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <TextField
                id="password"
                value={password}
                type="password"
                inputStyle={TextFieldStyles.outlined}
                background={Colors.tintedSurface}
                onInput={setPassword}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="auth-footer">
            <div className="button-container">
              <div style={{ marginRight: '16px' }}>
                <Button
                  type={ButtonTypes.filled}
                  text="Check Auth"
                  onClick={() => {
                    console.log('auth', auth)
                  }}
                />
              </div>
              <Button
                type={ButtonTypes.filled}
                text="Login"
                onClick={onSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
