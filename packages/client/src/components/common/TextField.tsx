import './TextField.scss'

import { useState } from 'react'

import { Icon, IconTypes, ColorVariants } from './Icon'

export enum TextFieldStyles {
  filled = 'filled',
  outlined = 'outlined',
}

export enum Colors {
  surface = 'surface',
  tintedSurface = 'tinted-surface',
}

export const TextField = ({
  id,
  value,
  onInput,
  placeholder,
  inputStyle,
  icon,
  type = 'text',
  background = Colors.surface,
  disabled = false,
}: {
  id: string
  value: string
  onInput: Function
  placeholder: string
  inputStyle: TextFieldStyles
  type?: string
  icon?: IconTypes
  background?: Colors
  disabled?: boolean
}) => {
  let [active, setActive] = useState<boolean>(false)

  const handleInput = (event: any) => {
    event.preventDefault()
    console.log(event)

    onInput(event.target.value)
  }

  const handleClick = () => {
    const input = document.getElementById(id)
    input?.focus()
  }

  // const handleKeyUp = (event: any) => {
  //   event.preventDefault()
  //   if (event.key === 'Enter') {
  //     handleSearch(searchTerm)
  //   }
  // }

  return (
    <div
      className={
        disabled
          ? `text-field ${inputStyle} disabled`
          : active
          ? `text-field ${inputStyle} active`
          : `text-field ${inputStyle}`
      }
      onClick={handleClick}
    >
      <div className="text-field-content">
        {icon && (
          <div className="icon-container">
            <Icon
              icon={IconTypes.search}
              color={ColorVariants.onSurfaceVariant}
            />
          </div>
        )}
        <div className="text-field-container">
          <label
            className={
              active || value
                ? icon
                  ? `${background} has-icon active`
                  : `${background} active`
                : icon
                ? `${background} has-icon`
                : `${background}`
            }
          >
            {placeholder}
          </label>
          <input
            id={id} // Change this at some point, so this can be reused
            value={value}
            type={type}
            className={active || value ? 'active' : ''}
            onInput={handleInput}
            placeholder={active ? placeholder : ''}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
          />
        </div>
        <div className="clear-text-field-container">
          {value && (
            <Icon
              onClick={() => {
                onInput('')
              }}
              icon={IconTypes.cancel}
              color={ColorVariants.onSurfaceVariant}
            />
          )}
        </div>
      </div>
    </div>
  )
}
