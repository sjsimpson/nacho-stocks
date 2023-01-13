import './styles/Login.scss'

import { useState } from 'react'
import { useAuth } from './auth'

import {
  Button,
  ButtonVariants,
  Dialog,
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
    <Dialog
      handleClose={handleClose}
      header="Login"
      content={
        <div className="login">
          <div className="form-group">
            <TextInput
              id="username"
              label="Username"
              value={username}
              inputStyle={TextInputVariants.TextInputStyles.outlined}
              background={TextInputVariants.TextInputColors.tintedSurface}
              onInput={(event: any) => setUsername(event.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <TextInput
              id="password"
              label="Password"
              value={password}
              type="password"
              inputStyle={TextInputVariants.TextInputStyles.outlined}
              background={TextInputVariants.TextInputColors.tintedSurface}
              onInput={(event: any) => setPassword(event.target.value)}
              placeholder="Password"
            />
          </div>
        </div>
      }
      footer={
        <div className="button-container">
          <Button
            type={ButtonVariants.ButtonStyles.text}
            text="Login"
            onClick={onSubmit}
          />
        </div>
      }
    />
  )
}
