import './Button.scss'

import { ReactElement, useState } from 'react'
import { Icon, IconTypes } from './Icon'

export enum ButtonTypes {
  filled = 'button-filled',
  elevated = 'button-elevated',
  tonal = 'button-tonal',
  outlined = 'button-outlined',
  text = 'button-text',
  title = 'button-title',
}

export const Button = ({
  type,
  text,
  onClick,
  icon,
  iconOnly = false,
  disabled = false,
}: {
  type: ButtonTypes
  text: string
  onClick: Function
  icon?: IconTypes
  iconOnly?: boolean
  disabled?: boolean
}) => {
  return (
    <button
      className={
        disabled
          ? iconOnly
            ? `icon-button disabled`
            : `button ${type} disabled`
          : iconOnly
          ? `icon-type`
          : `button ${type}`
      }
      onClick={() => {
        onClick()
      }}
    >
      {icon ? <Icon icon={icon} /> : ''}
      {!iconOnly && <span>{text}</span>}
    </button>
  )
}
