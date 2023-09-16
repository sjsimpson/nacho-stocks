import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
}

interface AuthActions {
  setToken: (token: AuthState['token']) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) => set({ token: token }),
    }),
    {
      name: 'jwt-storage',
    }
  )
)
