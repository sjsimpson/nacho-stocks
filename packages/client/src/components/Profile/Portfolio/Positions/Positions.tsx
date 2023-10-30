import { useAuthStore } from '../../../../stores/authStore'

import Position from './Position'
import Card from './../../../common/Card'
import { getPositions } from '../../../../queries/positions'

function Positions() {
  const token = useAuthStore((state) => state.token)
  const positions = token && getPositions(token)

  return (
    <Card cardStyle="elevated">
      <h3 style={{ marginTop: '0px' }}>Positions</h3>
      {positions &&
        positions.isSuccess &&
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
