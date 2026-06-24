import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, isAuthenticated, isLoading, logout, fetchMe } = useAuthStore()
  return { user, isAuthenticated, isLoading, logout, fetchMe }
}