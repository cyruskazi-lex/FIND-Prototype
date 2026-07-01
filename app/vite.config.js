import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { ttsEndpoint } from './server/tts-endpoint.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv reads .env files (and process.env). These stay server-side: only
  // import.meta.env.VITE_* is exposed to the browser bundle, so the TTS key
  // passed into ttsEndpoint() never reaches the client.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), ttsEndpoint(env)],
  }
})
