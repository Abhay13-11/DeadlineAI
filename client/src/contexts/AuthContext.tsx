import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'


interface AuthContextValue {
  isReady: boolean
}

const AuthContext = createContext<AuthContextValue>({ isReady: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchMe, setToken, isLoading } = useAuthStore()

  const initAuth = useCallback(async () => {
    // Check if token was passed via URL callback (Google OAuth redirect)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      setToken(urlToken)
      // Clean token from URL
      window.history.replaceState({}, '', window.location.pathname)
    }
    await fetchMe()
  }, [fetchMe, setToken])

  useEffect(() => {
    void initAuth()
  }, [initAuth])

  return (
    <AuthContext.Provider value={{ isReady: !isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)