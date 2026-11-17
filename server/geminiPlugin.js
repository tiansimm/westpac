// Vite plugin that adds POST /api/chat to the local dev/preview server.
//
// - If GEMINI_API_KEY is set in .env.local, it calls Gemini directly.
// - Otherwise, if a shared hosted API URL is configured, it forwards the
//   request there, so teammates get the real AI without needing a key.
import { createChat, ChatError } from './chatHandler.js'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 100_000) reject(new ChatError(413, 'Request too large'))
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new ChatError(400, 'Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export default function geminiPlugin({ apiKey, model, sharedApiUrl }) {
  const chat = createChat({ apiKey, model })

  if (apiKey) {
    console.log('[ai] Using your local GEMINI_API_KEY')
  } else if (sharedApiUrl) {
    console.log(`[ai] No local key, forwarding /api/chat to ${sharedApiUrl}`)
  } else {
    console.log('[ai] No GEMINI_API_KEY and no shared API URL: assistant will use demo replies')
  }

  const handler = async (req, res, next) => {
    if (req.url !== '/api/chat') return next()
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST' })

    try {
      const { messages, dataPermissions } = await readJsonBody(req)

      if (!apiKey && sharedApiUrl) {
        const upstream = await fetch(sharedApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, dataPermissions })
        })
        return sendJson(res, upstream.status, await upstream.json())
      }

      sendJson(res, 200, await chat(messages, dataPermissions))
    } catch (err) {
      console.error('[ai]', err.message)
      sendJson(res, err.status || 500, { error: err.message || 'AI request failed' })
    }
  }

  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    }
  }
}
