// Vercel serverless function: POST /api/chat
// Set GEMINI_API_KEY (and optionally GEMINI_MODEL) in the Vercel project's
// Environment Variables. The key never reaches the browser.
import process from 'node:process'
import { createChat, DEFAULT_MODEL } from '../server/chatHandler.js'

const chat = createChat({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || DEFAULT_MODEL
})

export default async function handler(req, res) {
  // Allow teammates' local dev servers (and other origins) to call this API.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    res.status(200).json(await chat(body?.messages, body?.dataPermissions))
  } catch (err) {
    console.error('[ai]', err)
    res.status(err.status || 500).json({ error: err.message || 'AI request failed' })
  }
}
