import './Card.scss'

export type CardStyles = 'elevated' | 'filled' | 'outlined'

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  cardStyle: CardStyles
}

export default function Card(props: CardProps) {
  const { cardStyle, children, ...rest } = props
  return (
    <div {...rest} className={`m3-card ${cardStyle}`}>
      {children}
    </div>
  )
}
