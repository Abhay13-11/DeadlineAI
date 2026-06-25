import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingScreen } from '../../components/common/LoadingScreen'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) return
    void navigate(isAuthenticated ? '/dashboard' : '/login?error=auth_failed', { replace: true })
  }, [isAuthenticated, isInitialized, navigate])

  return <LoadingScreen />
}
