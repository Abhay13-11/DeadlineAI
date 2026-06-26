import { build, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const src = fileURLToPath(new URL('./src', import.meta.url))
const mode = 'production'
const env = loadEnv(mode, root, 'VITE_')

function validateApiUrl(value) {
  if (!value?.trim()) {
    throw new Error('VITE_API_URL is required for production builds.')
  }

  let parsed
  try {
    parsed = new URL(value)
  } catch {
    throw new Error('VITE_API_URL must be an absolute URL, for example https://your-api.onrender.com/api/v1.')
  }

  const path = parsed.pathname.replace(/\/+$/, '')
  if (!/^https?:$/.test(parsed.protocol) || (path !== '' && path !== '/api/v1')) {
    throw new Error('VITE_API_URL must be the Render API origin or API root, for example https://your-api.onrender.com/api/v1.')
  }
}

validateApiUrl(env.VITE_API_URL)

await build({
  configFile: false,
  mode,
  root,
  plugins: [react()],
  resolve: {
    alias: {
      '@': src,
    },
  },
})
