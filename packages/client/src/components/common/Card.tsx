import './Card.scss'

export type CardStyles = 'elevated' | 'filled' | 'outlined'

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  cardStyle: CardStyles
  loading?: boolean
}

export default function Card(props: CardProps) {
  const { cardStyle, children, loading = false, ...rest } = props
  if (loading) return <div className={`m3-card-skeleton`} />
  return (
    <div className={`m3-card ${cardStyle}`} {...rest}>
      {children}
    </div>
  )
}
