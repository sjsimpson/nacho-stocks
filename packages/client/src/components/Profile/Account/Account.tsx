import { Button, TextInput } from 'm3-react'
import { useState } from 'react'
import { useToasts } from '../../../context/ToastProvider'
import {
  changeUserPassword,
  getUserInfo,
  updateEmail,
  updateUser,
  updateUsername,
} from '../../../queries/user'
import { useAuthStore } from '../../../stores/authStore'
import { matchPasswords } from '../../../lib/matchPasswords'
import Card from '../../common/Card'
import AccountInfo from './AccountInfo'

function Account() {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPassRepeat, setNewPassRepeat] = useState('')

  const token = useAuthStore((store) => store.token)
  const toasts = useToasts()

  const match = matchPasswords({ pass1: newPass, pass2: newPassRepeat })
  const info = getUserInfo(token)

  const changePassword = changeUserPassword()
  const changeEmail = updateEmail()
  const changeUsername = updateUsername()

  const handleChangePassword = () => {
    if (newPass === newPassRepeat && token) {
      changePassword.mutate(
        { password: oldPass, newPassword: newPass, token },
        {
          onSuccess: (data) => {
            toasts?.addToast({ type: 'success', message: 'Success' })
          },

          onError: (err: any) => {
            toasts?.addToast({ type: 'error', message: err.toString() })
          },
        }
      )
    }
  }

  const handleUpdateEmail = (value: string) => {
    if (value && token) {
      changeEmail.mutate(
        { body: { email: value }, token },
        {
          onSuccess: (data) => {
            toasts?.addToast({ type: 'success', message: 'Success' })
          },

          onError: (err: any) => {
            toasts?.addToast({ type: 'error', message: err.toString() })
          },
        }
      )
    }
  }

  const handleUpdateUsername = (value: string) => {
    if (value && token) {
      changeUsername.mutate(
        { body: { username: value }, token },
        {
          onSuccess: (data) => {
            toasts?.addToast({ type: 'success', message: 'Success' })
          },

          onError: (err: any) => {
            toasts?.addToast({ type: 'error', message: err.toString() })
          },
        }
      )
    }
  }

  return (
    <Card cardStyle="elevated">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          // padding: '40px',
        }}
      >
        <h3 style={{ marginTop: '0px' }}>Account Info</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <AccountInfo
              name="Email"
              data={info.isSuccess ? info.data.data.email : ''}
              loading={changeEmail.isLoading}
              error={changeEmail.isError}
              onSave={handleUpdateEmail}
            />
            <AccountInfo
              name="Username"
              data={info.isSuccess ? info.data.data.username : ''}
              loading={changeUsername.isLoading}
              error={changeUsername.isError}
              onSave={handleUpdateUsername}
            />
          </div>
          <div
            style={{
              display: 'flex',
              width: '50%',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div>Change Password</div>
            <TextInput
              id="old-pass"
              type="password"
              inputStyle="outlined"
              background="surface"
              label="Old Password"
              value={oldPass}
              onInput={(e: any) => setOldPass(e.target.value)}
            />
            <TextInput
              id="new-pass"
              type="password"
              background="surface"
              inputStyle="outlined"
              label="New Password"
              value={newPass}
              onInput={(e: any) => setNewPass(e.target.value)}
            />
            <TextInput
              id="repeat-new-pass"
              type="password"
              background="surface"
              inputStyle="outlined"
              label="Repeat New Password"
              value={newPassRepeat}
              onInput={(e: any) => setNewPassRepeat(e.target.value)}
            />

            {!match && <div>ERROR PASSWORDS MUST MATCH</div>}

            <div style={{ display: 'flex', width: 'fit-content' }}>
              <Button
                text="Change Password"
                onClick={handleChangePassword}
                disabled={!match}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Account
