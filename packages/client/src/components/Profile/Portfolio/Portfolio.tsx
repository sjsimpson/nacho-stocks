import { useQuery } from '@tanstack/react-query'
import { Route } from 'react-router-dom'
import api from '../../../api'
import { useAuthStore } from '../../../stores/authStore'
import Card from './../../common/Card'
import MainContent from './../../common/MainContent'
// import Nav from './Nav'
import Positions from './../Positions/Positions'
import TransactionHistory from './../TransactionHistory'

export default function Portfolio() {
  const token = useAuthStore((state) => state.token)

  const value = useQuery({
    queryFn: () =>
      api.get('/positions/value', { headers: { 'x-api-token': token } }),
    queryKey: ['value'],
  })

  const cash = useQuery({
    queryFn: () => api.get('/user/cash', { headers: { 'x-api-token': token } }),
    queryKey: ['cash'],
  })

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
            <h3 style={{ marginTop: '0px' }}>Portfolio Graph</h3>
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
                ${value.isSuccess && value.data.data.value}
              </div>
            </Card>
            <Card cardStyle="elevated" style={{ maxHeight: '50%' }}>
              <h3 style={{ marginTop: '0px' }}>Total Cash</h3>
              <div style={{ fontSize: '24px', lineHeight: '32px' }}>
                ${cash.isSuccess && cash.data.data.cash}
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
