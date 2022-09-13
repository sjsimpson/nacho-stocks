import './styles/App.scss'

import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Home } from './components/Home'
import { About } from './components/About'
import { PrimaryNav } from './components/PrimaryNav'
import { Profile } from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './components/auth'
import { SecondaryNav } from './components/SecondaryNav'
import { MainContent } from './components/common/MainContent'
import { ColorTester } from './components/ColorTester'
import { StockSearchList } from './components/StockSearchList'
import { StockPage } from './components/StockPage'

import { Stock } from './types/stocks'

export const App = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpen = () => {
    return setIsOpen(!isOpen)
  }

  const test: Stock = { name: 'Alphabet Inc Cl C', symbol: 'GOOG' }

  return (
    <div>
      <AuthProvider>
        {/* <PrimaryNav /> */}
        <PrimaryNav isOpen={isOpen} handleOpenSecondaryNav={handleOpen} />
        <SecondaryNav open={isOpen} />
        <div className="drawer-container">
          <div className={isOpen ? 'app-content open' : 'app-content'}>
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="stocks" element={<StockSearchList />} />
                <Route path="stocks/:stockId" element={<StockPage />} />
                <Route path="color-testing" element={<ColorTester />} />
                {/* <Route path="graph" element={<StockSearchList />} /> */}
                <Route
                  path="profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
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
    </div>
  )
}
