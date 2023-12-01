import {
  getPerformanceHistory,
  getPositionValue,
} from '../../../queries/positions'
import { getUserCash } from '../../../queries/user'
import { useAuthStore } from '../../../stores/authStore'

import Card from './../../common/Card'
import MainContent from './../../common/MainContent'
import Positions from './Positions'
import TransactionHistory from './TransactionHistory'
import ValueHistory from './ValueHistory'

export default function Portfolio() {
  const token = useAuthStore((state) => state.token)

  const value = getPositionValue(token, !!token)
  const cash = getUserCash(token, !!token)
  // const history = getPerformanceHistory(token, !!token)

  return (
    <MainContent>
      <div
        className="container-maybe"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 200px 500px',
            gap: 24,
            direction: 'ltr',
            width: '100%',
          }}
        >
          <Card cardStyle="elevated">
            <ValueHistory />
          </Card>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
            }}
          >
            <Card cardStyle="elevated" style={{ maxHeight: '50%' }}>
              <h3 style={{ marginTop: '0px' }}>Portfolio Value</h3>
              <div style={{ fontSize: '24px', lineHeight: '32px' }}>
                ${value && value.isSuccess && value.data.data.value}
              </div>
            </Card>
            <Card cardStyle="elevated" style={{ maxHeight: '50%' }}>
              <h3 style={{ marginTop: '0px' }}>Total Cash</h3>
              <div style={{ fontSize: '24px', lineHeight: '32px' }}>
                ${cash && cash.isSuccess && cash.data.data.cash.toFixed(2)}
              </div>
            </Card>
          </div>
          <Positions />
        </div>
        <TransactionHistory />
      </div>
    </MainContent>
  )
}
