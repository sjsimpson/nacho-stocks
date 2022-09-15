import './Icon.scss'

export enum IconSizes {
  small = 'small',
  large = 'large',
}

export enum IconTypes {
  home = 'home',
  openMenu = 'menu',
  closeMenu = 'menu_open',
  stocks = 'monitoring',
  palette = 'palette',
  info = 'info',
  search = 'search',
  cancel = 'cancel',
  login = 'login',
  logout = 'logout',
  add = 'add',
  remove = 'remove',
}

export enum IconWeights {
  light = 'light',
  normal = 'normal',
  heavy = 'heavy',
}

export enum ColorVariants {
  onPrimaryContainer = 'on-primary-container',
  onSurfaceVariant = 'on-surface-variant',
}

export const Icon = ({
  icon,
  color = ColorVariants.onPrimaryContainer,
  onClick = () => {},
}: {
  icon: IconTypes
  color?: ColorVariants
  onClick?: Function
}) => {
  return (
    <span
      onClick={() => {
        onClick()
      }}
      className={`material-symbols-outlined ${color}`}
    >
      {icon}
    </span>
  )
}
