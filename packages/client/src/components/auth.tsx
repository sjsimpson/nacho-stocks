import { useState, createContext, useContext } from 'react'

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState<string | null>(null)

  const login = async (token: string) => {
    setToken(token)
  }

  const logout = async () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
