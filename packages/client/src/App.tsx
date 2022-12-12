import './styles/App.scss'

import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Home } from './components/Home'
import { About } from './components/About'
import { PrimaryNav } from './components/PrimaryNav'
import { Profile } from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './components/auth'
import { NavDrawer } from './components/NavDrawer'
import { MainContent } from './components/common/MainContent'
import { ColorTester } from './components/ColorTester'
import { StockSearch } from './components/StockSearch'
import { IndividualStock } from './components/IndividualStock'
import { ComponentTesting } from './components/ComponentTesting'
import { NavBar } from './components/NavBar'

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
        {/* Used with smaller screen size*/}
        <NavBar isOpen={isOpen} handleOpenNavDrawer={handleOpen} />
        <NavDrawer open={isOpen} />
        <div className="drawer-container">
          <div className={isOpen ? 'app-content open' : 'app-content'}>
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="stocks" element={<StockSearch />} />
                <Route path="stocks/:symbol" element={<IndividualStock />} />
                <Route path="colors" element={<ColorTester />} />
                <Route path="components" element={<ComponentTesting />} />
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
