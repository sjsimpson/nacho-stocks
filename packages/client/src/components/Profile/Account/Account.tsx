import { Button, TextInput } from 'm3-react'
import { useState } from 'react'
import { useUserQuery } from '../../../queries/user'
import { useAuthStore } from '../../../stores/authStore'
import { matchPasswords } from '../../../lib/matchPasswords'
import Card from '../../common/Card'
import AccountInfo from './AccountInfo'

function Account() {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPassRepeat, setNewPassRepeat] = useState('')

  const token = useAuthStore((store) => store.token)

  const { query, updateEmail, updateUsername, updatePassword } =
    useUserQuery(token)

  const match = matchPasswords({ pass1: newPass, pass2: newPassRepeat })

  const handleChangePassword = () => {
    if (newPass === newPassRepeat && token) {
      updatePassword.mutate({ password: oldPass, newPassword: newPass, token })
    }
  }

  const handleUpdateEmail = (value: string) => {
    if (value && token) {
      updateEmail.mutate({ body: { email: value }, token })
    }
  }

  const handleUpdateUsername = (value: string) => {
    if (value && token) {
      updateUsername.mutate({ body: { username: value }, token })
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
              data={query.isSuccess ? query.data.data.email : ''}
              loading={updateEmail.isLoading}
              error={updateEmail.isError}
              onSave={handleUpdateEmail}
            />
            <AccountInfo
              name="Username"
              data={query.isSuccess ? query.data.data.username : ''}
              loading={updateUsername.isLoading}
              error={updateUsername.isError}
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
