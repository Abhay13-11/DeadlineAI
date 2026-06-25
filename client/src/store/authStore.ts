import { create } from 'zustand'
import { IUser } from '../types'
import { setAccessToken, setAuthenticationFailureHandler } from '../services/api'
import { authService } from '../services/authService'

let fetchMeRequest: Promise<void> | null = null
let initializationRequest: Promise<void> | null = null

interface AuthState {
  user: IUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  setUser: (user: IUser | null) => void
  setToken: (token: string | null) => void
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  initialize: (token?: string | null) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    setAccessToken(token)
    set({ accessToken: token })
  },

  fetchMe: () => {
    if (fetchMeRequest) return fetchMeRequest

    set({ isLoading: true })
    fetchMeRequest = authService.getMe()
      .then((res) => {
        set({ user: res.data, isAuthenticated: true })
      })
      .catch((error: unknown) => {
        set({ user: null, isAuthenticated: false })
        throw error
      })
      .finally(() => {
        set({ isLoading: false })
        fetchMeRequest = null
      })

    return fetchMeRequest
  },

  initialize: (token) => {
    if (initializationRequest) return initializationRequest
    if (get().isInitialized) return Promise.resolve()

    if (token) {
      setAccessToken(token)
      set({ accessToken: token })
    }

    initializationRequest = get().fetchMe()
      .catch(() => undefined)
      .finally(() => {
        set({ isInitialized: true, isLoading: false })
      })

    return initializationRequest
  },

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      setAccessToken(null)
      set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true })
    }
  },
}))

setAuthenticationFailureHandler(() => {
  setAccessToken(null)
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
  })
})
