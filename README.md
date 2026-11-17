# Cashflow IQ

A personal finance companion prototype built for the Westpac Project Future competition (QUT). It uses React and Vite, and the AI Assistant is powered by Google Gemini.

> **Prototype notice:** all financial data in this app is fictional. It is not connected to real Westpac accounts and does not give financial advice.

## Features

| Page | What it does |
| --- | --- |
| Home | Overview dashboard of balances, budget and alerts |
| Smart Budgeting | Spending breakdown by category and budget progress |
| Savings Goals | Tracks goals such as the Japan Holiday fund |
| Fraud Protection | Simulated security alerts for suspicious transactions |
| Accounts | Demo account summaries |
| AI Assistant | A chat assistant (Google Gemini) that answers questions using the demo data |
| Settings | Notification preferences for promotions, personalised offers and savings tips |

## Getting started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (includes npm)

### 2. Install dependencies

```bash
npm install
```

### 3. AI setup: choose one option

**Option A: use the team's shared AI (no key needed, recommended for teammates)**

When the app is deployed to Vercel (see [Deploying](#deploying-so-everyone-gets-the-real-ai)) and its URL is pasted into `SHARED_API_URL` in [`vite.config.js`](vite.config.js), you don't need to do anything. Run `npm run dev` and the assistant uses the team's hosted AI automatically. The terminal shows `[ai] No local key, forwarding /api/chat to ...`. Skip to step 4.

**Option B: use your own Gemini API key**

Use this if you're the person who maintains the deployment, or if you want to test prompt changes locally. With no key and no shared URL, the app still runs, but the assistant falls back to scripted demo replies and shows **● Demo mode**.

1. **Get a free key.** Go to <https://aistudio.google.com/apikey>, sign in with a Google account and click **Create API key**. Copy the key.

2. **Create your env file.** In the project root (the folder that contains `package.json`), copy the template:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env.local
   ```

   ```powershell
   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

3. **Paste your key.** Open `.env.local` and put the key directly after the `=` with no spaces or quotes:

   ```env
   GEMINI_API_KEY=paste-your-key-here
   ```

   Optional: to use a different Gemini model, uncomment and edit this line:

   ```env
   GEMINI_MODEL=gemini-3.8-flash
   ```

4. **Save the file.** If the dev server is already running, it restarts automatically when `.env.local` changes. If not, start it in the next step.

> **Keep your key secret.**
> - `.env.local` is listed in `.gitignore`, so never commit it and never paste your key into chat, screenshots or issues.
> - Do **not** rename the variable to `VITE_GEMINI_API_KEY` and do not put the key anywhere in `src/`. Anything there is bundled into the browser, where anyone can read it.
> - If a key leaks, delete it in Google AI Studio and create a new one.

### 4. Run the app

```bash
npm run dev
```

Open <http://localhost:5173>.

### 5. Check the AI is working

Go to **AI Assistant** and ask a question, such as *"Can I cancel my Netflix subscription?"*

- **● Gemini AI** in the chat header means replies come from Gemini.
- **● Demo mode** means the Gemini call failed and the app used scripted replies. Check the terminal running `npm run dev` for the error, then see Troubleshooting below.

## How the AI integration works

```
                               ┌─ has GEMINI_API_KEY ──▶ Google Gemini API
Browser ──POST /api/chat──▶ Vite dev server ┤
(aiAssistant.jsx)          (geminiPlugin.js)└─ no key ──▶ Shared Vercel API (api/chat.js) ──▶ Google Gemini API
                                                          (team key stored in Vercel)

Deployed site:  Browser ──POST /api/chat──▶ Vercel function (api/chat.js) ──▶ Google Gemini API
```

| File | Purpose |
| --- | --- |
| [`server/chatHandler.js`](server/chatHandler.js) | Shared logic: the system prompt (Olivia's demo data, topics, safety rules) and the Gemini call. Gemini returns a reply **plus 3 follow-up suggestions**. Edit `SYSTEM_PROMPT` here to change the assistant. |
| [`server/geminiPlugin.js`](server/geminiPlugin.js) | Adds `/api/chat` to the local Vite server. Uses your key if you have one, otherwise forwards to the shared URL. |
| [`api/chat.js`](api/chat.js) | Vercel serverless function for the deployed site. |
| [`src/pages/aiAssistant.jsx`](src/pages/aiAssistant.jsx) | Chat UI. Edit the `categories` list at the top to add topics or suggested questions. If the AI is unreachable, it falls back to scripted replies. |

### Chatbot features

- **Topic categories:** My money, Savings goals, Products & services, Security & fraud, and App help (troubleshooting). Each has its own suggested questions, on the welcome screen and in the **☰ Topics** panel during a chat.
- **AI follow-up suggestions:** after every answer, Gemini suggests 3 relevant next questions as clickable chips.
- **Action buttons:** the AI can attach up to 2 shortcuts to a reply (for example "Go to Fraud Protection" or "Open Savings Goals") that take the customer straight to the right screen.
- **Urgent alerts:** possible fraud, scams or a lost card get a highlighted "Act now" banner.
- **Talk to a person:** a human-handoff option in the chat header, which the AI also offers when self-help isn't working.
- **Readable answers:** **bold** text, numbered steps and bullet lists are formatted.
- **Feedback and controls:** 👍/👎 on each answer, Copy, and "Try again with AI" on offline replies.
- **Saved conversations:** chats are kept in the browser (`localStorage`), so they survive moving between screens, and "New conversation" moves the old one into *Previous conversations*.
- **Safety rules:** the assistant never asks for PINs or passwords, doesn't quote real rates or fees as fact, and points urgent fraud issues to the bank's official channels.

## Deploying so everyone gets the real AI

Deploy once to [Vercel](https://vercel.com) (free). The API key lives only in Vercel's settings, so teammates and judges never need it.

1. Push this repo to GitHub.
2. On vercel.com, sign in with GitHub, click **Add New → Project** and import the repo. Vercel detects Vite automatically, so keep the default build settings.
3. Before clicking **Deploy**, open **Environment Variables** and add:
   - `GEMINI_API_KEY` = your key
   - `GEMINI_MODEL` = `gemini-3.8-flash` (optional)
4. Click **Deploy**. You'll get a URL like `https://your-project.vercel.app`, where the full app, including the real AI, works for anyone.
5. To let teammates' local `npm run dev` use the shared AI too, paste the endpoint into [`vite.config.js`](vite.config.js) and commit it:

   ```js
   const SHARED_API_URL = 'https://your-project.vercel.app/api/chat'
   ```

If you change `GEMINI_API_KEY` in Vercel later, redeploy for it to take effect.

> **Note:** the shared endpoint is public, so anyone who finds the URL could use your Gemini quota. That's fine for a competition prototype, but delete or rotate the key when the competition ends.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Badge shows **Demo mode**; terminal says `GEMINI_API_KEY is not set` | `.env.local` is missing, in the wrong folder, not saved, or has an empty key. Check that it sits next to `package.json`, then save it again. |
| Error mentions `API key not valid` or `403` | The key was copied incorrectly or has been deleted. Create a new key in AI Studio. |
| Error mentions `429` or quota | You hit the free-tier rate limit. Wait a minute and try again. |
| Error mentions the model not being found | Set `GEMINI_MODEL` in `.env.local` to a current model from the [Gemini models list](https://ai.google.dev/gemini-api/docs/models). |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally (includes `/api/chat`) |
| `npm run lint` | Run ESLint |

## Project structure

```
├── api/
│   └── chat.js             # Vercel serverless /api/chat (deployed site)
├── server/
│   ├── chatHandler.js      # Shared Gemini logic + system prompt
│   └── geminiPlugin.js     # Local /api/chat (dev server)
├── src/
│   ├── App.jsx             # Navigation and page switching
│   ├── pages/              # One component per page
│   └── styles/             # Per-page CSS
├── .env.example            # Template for your .env.local
└── vite.config.js
```
