import { create } from 'zustand'
import { IUser } from '../types'
import { setAccessToken } from '../services/api'
import { authService } from '../services/authService'

interface AuthState {
  user: IUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: IUser | null) => void
  setToken: (token: string | null) => void
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    setAccessToken(token)
    set({ accessToken: token })
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true })
      const res = await authService.getMe()
      set({ user: res.data, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      setAccessToken(null)
      set({ user: null, accessToken: null, isAuthenticated: false })
    }
  },
}))