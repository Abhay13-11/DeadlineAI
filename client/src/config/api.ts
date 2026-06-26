const DEFAULT_API_URL = 'http://localhost:5000/api/v1'

function normalizeApiUrl(rawUrl: string | undefined): string {
  const value = (rawUrl?.trim() || DEFAULT_API_URL).replace(/\/+$/, '')

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error('VITE_API_URL must be an absolute URL, for example https://your-api.onrender.com/api/v1.')
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error('VITE_API_URL must use http or https.')
  }

  const path = parsed.pathname.replace(/\/+$/, '')
  if (path === '/api/v1') return parsed.toString().replace(/\/+$/, '')
  if (path === '') return `${parsed.origin}/api/v1`

  throw new Error('VITE_API_URL must point to the API root, for example https://your-api.onrender.com/api/v1.')
}

export const API_BASE_URL = normalizeApiUrl(import.meta.env.VITE_API_URL)
export const API_ORIGIN = new URL(API_BASE_URL).origin
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`
