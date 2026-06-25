import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'


interface AuthContextValue {
  isReady: boolean
}

const AuthContext = createContext<AuthContextValue>({ isReady: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  useEffect(() => {
    // Check if token was passed via URL callback (Google OAuth redirect)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      // Clean token from URL
      window.history.replaceState({}, '', window.location.pathname)
    }
    void initialize(urlToken)
  }, [initialize])

  return (
    <AuthContext.Provider value={{ isReady: isInitialized && !isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
