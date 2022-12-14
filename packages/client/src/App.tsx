import './styles/App.scss'

import { Route, Routes } from 'react-router-dom'

import { Home } from './components/Home'
import { About } from './components/About'
import { Profile } from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './components/auth'
import { MainContent } from './components/common/MainContent'
import { ColorTester } from './components/ColorTester'
import { StockSearch } from './components/StockSearch'
import { IndividualStock } from './components/IndividualStock'
import { ComponentTesting } from './components/ComponentTesting'
import { PrimaryNav } from './components/PrimaryNav'

export const App = () => {
  return (
    <div>
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
                <Route path="colors" element={<ColorTester />} />
                <Route path="components" element={<ComponentTesting />} />
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
