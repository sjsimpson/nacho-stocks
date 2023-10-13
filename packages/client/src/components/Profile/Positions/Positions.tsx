import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../stores/authStore'
import api from '../../../api'
import Position from './Position'
import Card from './../../common/Card'

function Positions() {
  const token = useAuthStore((state) => state.token)
  const positions = useQuery({
    queryFn: () => api.get('/positions', { headers: { 'x-api-token': token } }),
    queryKey: ['positions'],
  })
  return (
    <Card cardStyle="elevated">
      <h3 style={{ marginTop: '0px' }}>Positions</h3>
      {positions.isSuccess &&
        positions.data.data.map((position: Position, index: number) => (
          <Position
            key={'position' + position.symbol + index}
            position={position}
          />
        ))}
    </Card>
  )
}

export default Positions
