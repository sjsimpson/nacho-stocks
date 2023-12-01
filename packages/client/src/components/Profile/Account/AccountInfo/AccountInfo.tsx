import { useEffect, useRef, useState } from 'react'
import { Button, LoadingSpinner, TextInput } from 'm3-react'

interface AccountInfoProps {
  name: string
  data: string
  loading: boolean
  error: boolean
  onSave: (value: string) => void
}
function AccountInfo(props: AccountInfoProps) {
  const { name, data, error, loading, onSave } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState(data)
  const [editing, setEditing] = useState(false)

  const handleSave = (e: any) => {
    e.preventDefault()
    onSave(value)
  }

  useEffect(() => {
    if (editing) {
      setValue(data)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [editing])

  useEffect(() => {
    // TODO: Abstract this because we need an error state
    if (!loading && !error) {
      setEditing(false)
    }
  }, [loading, error])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div>{name}</div>
      {editing ? (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            // ref={inputRef}
            id={'input' + name}
            inputStyle="outlined"
            background="surface"
            label={name}
            value={value}
            disabled={loading}
            onInput={(e: any) => setValue(e.target.value)}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Button
                  text="Close"
                  icon="close"
                  iconOnly
                  disabled={loading}
                  onClick={() => setEditing(false)}
                />
                <Button
                  text="Save"
                  icon="done"
                  disabled={loading}
                  onClick={handleSave}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '56px',
              padding: '16px',
            }}
          >
            {data}
          </div>
          <Button
            text="Edit"
            icon="edit"
            iconOnly
            onClick={() => setEditing(true)}
          />
        </div>
      )}
    </div>
  )
}

export default AccountInfo
