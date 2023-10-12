import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from 'm3-react'
import { Navigate, useNavigate } from 'react-router-dom'
import api from '../api'
import { useToasts } from '../context/ToastProvider'
import { useAuthStore } from '../stores/authStore'
import Card from './common/Card'
import MainContent from './common/MainContent'

import StockSearch from './StockSearch'

export default function Profile() {
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const navigate = useNavigate()
  const toasts = useToasts()

  const handleLogout = (event: any) => {
    event.preventDefault()
    setToken(null)
    navigate('/')
  }

  const positions = useQuery({
    queryFn: () => api.get('/positions', { headers: { 'x-api-token': token } }),
    queryKey: ['positions'],
  })

  const value = useQuery({
    queryFn: () =>
      api.get('/positions/value', { headers: { 'x-api-token': token } }),
    queryKey: ['value'],
  })

  const gains = useQuery({
    queryFn: () =>
      api.get('/positions/gains', { headers: { 'x-api-token': token } }),
    queryKey: ['gains'],
  })

  const addToast = () => {
    toasts?.addToast({ message: 'This is an error message', type: 'error' })
  }

  return (
    <MainContent>
      <div>
        <button onClick={() => console.log('auth', token)}>Check Auth</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={addToast}>Add Toast</button>
      </div>
      <div style={{ width: '100%', height: '100%', border: '1px solid black' }}>
        <div style={{ width: '100%' }}>
          <div
            style={{
              width: '100%',
              height: '120px',
              border: '1px solid black',
            }}
          >
            Header
          </div>
          <div
            style={{
              display: 'flex',
              direction: 'ltr',
              width: '100%',
              gap: 8,
            }}
          >
            <div
              style={{
                width: '400px',
                height: '320px',
              }}
            >
              <Card cardStyle="elevated">
                <div>Total Moneys</div>
                <div>Portfolio Graph</div>
              </Card>
            </div>
            <div>
              Portfolio Value: {value.isSuccess && value.data.data.value}
            </div>
            <div>Gains/Losses: {gains.isSuccess && gains.data.data.value}</div>
            <div>Best Performing Stock</div>
            <div>Worst Performing Stock</div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            // height: '320px',
            border: '1px solid black',
          }}
        >
          Purchase History
          <div>
            {positions.isSuccess &&
              positions.data.data.map((position: Position, index: number) => (
                <div key={position.symbol + index}>
                  <div>{position.symbol}</div>
                  <div>{position.price}</div>
                  <div>{position.quantity}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </MainContent>
  )
}
