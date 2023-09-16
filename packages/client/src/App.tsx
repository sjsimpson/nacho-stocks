import './styles/App.scss'

import { Route, Routes } from 'react-router-dom'

import Home from './components/Home'
import About from './components/About'
import Profile from './components/Profile'
import RequireAuth, { Test } from './components/RequireAuth'
import { AuthProvider } from './components/auth'
import MainContent from './components/common/MainContent'
import StockSearch from './components/StockSearch'
import IndividualStock from './components/IndividualStock'
import PrimaryNav from './components/PrimaryNav'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PrimaryNav />
        <div className="app-container">
          <div className="app-content">
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="stocks" element={<StockSearch />} />
                <Route path="stocks/:symbol" element={<IndividualStock />} />
                <Route
                  path="profile"
                  element={
                    <Test>
                      <Profile />
                    </Test>
                  }
                />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: '1rem' }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
              </Routes>
            </MainContent>
          </div>
        </div>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
}
