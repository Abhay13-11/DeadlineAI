import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const src = fileURLToPath(new URL('./src', import.meta.url))

await build({
  configFile: false,
  root,
  plugins: [react()],
  resolve: {
    alias: {
      '@': src,
    },
  },
})
