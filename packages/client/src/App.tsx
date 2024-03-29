import './styles/App.scss'

import { Route, Routes } from 'react-router-dom'

import Home from './components/Home'
import About from './components/About'
import Profile from './components/Profile'
import RequireAuth from './components/RequireAuth'
import MainContent from './components/common/MainContent'
import StockSearch from './components/StockSearch'
import IndividualStock from './components/IndividualStock'
import PrimaryNav from './components/PrimaryNav'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ToastProvider from './context/ToastProvider'
import Portfolio from './components/Profile/Portfolio'
import Account from './components/Profile/Account'

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimaryNav />
      <div className="app-container">
        <div className="app-content">
          <MainContent>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="stocks" element={<StockSearch />} />
                <Route path="stocks/:symbol" element={<IndividualStock />} />
                <Route
                  path="profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                >
                  <Route index element={<Portfolio />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="account" element={<Account />} />
                </Route>
                <Route
                  path="*"
                  element={
                    <main style={{ padding: '1rem' }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
              </Routes>
            </ToastProvider>
          </MainContent>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
}
