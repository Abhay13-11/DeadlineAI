import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LoadingScreen } from '../../components/common/LoadingScreen'

export function AuthCallbackPage() {
  const [params] = useSearchParams()
  const { setToken, fetchMe } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      void navigate('/login?error=auth_failed')
      return
    }

    setToken(token)
    fetchMe().then(() => navigate('/dashboard')).catch(() => navigate('/login'))
  }, [params, setToken, fetchMe, navigate])

  return <LoadingScreen />
}