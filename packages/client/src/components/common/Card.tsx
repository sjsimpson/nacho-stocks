import './Card.scss'

export enum CardStyles {
  elevated = 'elevated',
  filled = 'filled',
  outlined = 'outlined',
}

interface CardProps {
  cardStyle: CardStyles
  children: JSX.Element
}

export const Card = (props: CardProps) => {
  return <div className={`m3-card ${props.cardStyle}`}>{props.children}</div>
}
