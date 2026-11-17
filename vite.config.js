import react from '@vitejs/plugin-react'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import geminiPlugin from './server/geminiPlugin.js'

// Shared hosted AI endpoint (deployed on Vercel with the team's key).
// Teammates without their own GEMINI_API_KEY are forwarded here automatically.
// Paste the deployed URL here once, e.g. 'https://cashflow-iq.vercel.app/api/chat'
const SHARED_API_URL = ''

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix) for server-side use only.
  // GEMINI_API_KEY has no VITE_ prefix, so it is never exposed to the browser.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      geminiPlugin({
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL,
        sharedApiUrl: env.SHARED_API_URL || SHARED_API_URL
      })
    ]
  }
})
