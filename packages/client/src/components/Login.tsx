import { useState } from 'react'
import { useAuth } from './auth'

import {
  Button,
  ButtonVariants,
  Icon,
  IconVariants,
  TextInput,
  TextInputVariants,
} from 'm3-react'

import { login } from '../api/authApi'

export const Login = ({ closeModal }: { closeModal: Function }) => {
  let [username, setUsername] = useState<string>('')
  let [password, setPassword] = useState<string>('')

  const auth = useAuth()

  const handleClose = (event: any) => {
    event.preventDefault()
    closeModal()
  }

  const onSubmit = async () => {
    try {
      const token = await login({ username, password })
      auth.login(token)
      closeModal()
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
              <Icon icon={IconVariants.IconStyles.close} />
            </div>
          </div>
          <div className="auth-content">
            <div className="form-group">
              <TextInput
                id="username"
                value={username}
                inputStyle={TextInputVariants.TextInputStyles.outlined}
                background={TextInputVariants.TextInputColors.tintedSurface}
                onInput={setUsername}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <TextInput
                id="password"
                value={password}
                type="password"
                inputStyle={TextInputVariants.TextInputStyles.outlined}
                background={TextInputVariants.TextInputColors.tintedSurface}
                onInput={setPassword}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="auth-footer">
            <div className="button-container">
              <div style={{ marginRight: '16px' }}>
                <Button
                  type={ButtonVariants.ButtonStyles.filled}
                  text="Check Auth"
                  onClick={() => {
                    console.log('auth', auth)
                  }}
                />
              </div>
              <Button
                type={ButtonVariants.ButtonStyles.filled}
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
