import './Icon.scss'

export enum IconSizes {
  small = 'small',
  large = 'large',
}

export enum IconTypes {
  home = 'home',
  openMenu = 'open-menu',
  closeMenu = 'close-menu',
  stocks = 'stocks',
  palette = 'palette',
  info = 'info',
  search = 'search',
  cancel = 'cancel',
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
  color,
  size = IconSizes.small,
  weight = IconWeights.normal,
  filled = false,
  onClick = () => {},
}: {
  icon: string
  size?: IconSizes
  color?: ColorVariants
  weight?: IconWeights
  filled?: boolean
  onClick?: Function
}) => {
  const fillCss = filled ? 'filled' : ''
  const colorCss = color || ''

  return (
    <i
      onClick={() => {
        onClick()
      }}
      className={`${icon} ${size} ${weight} ${fillCss} ${colorCss}`}
    />
  )
}
