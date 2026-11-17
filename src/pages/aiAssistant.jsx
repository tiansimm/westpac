import { useEffect, useRef, useState } from 'react'
import { CURRENT_CHAT_KEY, HISTORY_KEY } from '../utils/assistantChatStorage.js'
import '../styles/aiAssistant.css'

// Buttons the AI can attach to a reply. Ids match the page ids in App.jsx,
// plus "contact" for a human handoff.
const ACTIONS = {
  insights: { icon: '▥', label: 'View Smart Budgeting' },
  journey: { icon: '◎', label: 'Open Savings Goals' },
  fraud: { icon: '▣', label: 'Go to Fraud Protection' },
  accounts: { icon: '▤', label: 'View Accounts' },
  dashboard: { icon: '⌂', label: 'Go to Home' },
  contact: { icon: '☎', label: 'Talk to a person' }
}

const HANDOFF_MESSAGE = `In the real app, this would connect you with a banking specialist through secure chat, with this conversation attached so you don't have to repeat yourself.

- **Urgent (fraud, lost or stolen card):** call the number on the back of your card, available 24/7.
- **General enquiries:** use secure messaging in the official app, or visit a branch.

This is a prototype, so no one will actually be contacted.`

// Example conversations shown until the user has saved some of their own.
const exampleConversations = [
  {
    title: 'Making room for a holiday',
    detail: 'Example · Savings and spending',
    question: 'Help me make more room in my budget for my holiday.'
  },
  {
    title: 'Understanding my spending',
    detail: 'Example · Budget planning',
    question: 'Where did most of my money go?'
  }
]

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode etc.): chat still works, just isn't saved.
  }
}

// Only ever called from event handlers (archiving a chat), never during render.
function currentTimestamp() {
  return Date.now()
}

// Renders **bold**, numbered lists and "- " bullet lists from the AI's reply.
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  )
}

function FormattedText({ text }) {
  const blocks = []
  let list = null

  for (const line of text.split('\n')) {
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)/)
    const bullet = line.match(/^\s*[-•*]\s+(.*)/)

    if (ordered || bullet) {
      const type = ordered ? 'ol' : 'ul'
      if (!list || list.type !== type) {
        list = { type, items: [] }
        blocks.push(list)
      }
      list.items.push((ordered || bullet)[1])
    } else {
      list = null
      if (line.trim()) blocks.push({ type: 'p', text: line })
    }
  }

  return blocks.map((block, i) => {
    if (block.type === 'p') return <p key={i}>{renderInline(block.text)}</p>
    const List = block.type
    return (
      <List key={i}>
        {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
      </List>
    )
  })
}

// Prompt suggestions grouped by topic. Add or edit questions here.
const categories = [
  {
    id: 'money',
    icon: '💰',
    label: 'My money',
    questions: [
      'How much budget do I have left?',
      'Where did most of my money go?',
      'Which subscriptions could I cut?',
      'How can I save an extra $2,000 this year?'
    ]
  },
  {
    id: 'goals',
    icon: '🎯',
    label: 'Savings goals',
    questions: [
      'How long until I reach my Japan holiday goal?',
      'What if I saved $500 a month instead?',
      'How do I build an emergency fund?'
    ]
  },
  {
    id: 'products',
    icon: '🏦',
    label: 'Products & services',
    questions: [
      "What's the difference between a savings account and a term deposit?",
      'How does an offset account work?',
      'Which type of credit card suits me?',
      'How do I send money overseas?',
      'What is PayID and how do I set it up?'
    ]
  },
  {
    id: 'security',
    icon: '🔒',
    label: 'Security & fraud',
    questions: [
      "I don't recognise a transaction",
      'How do I lock my card?',
      'I got a suspicious text claiming to be my bank',
      'Why was the $850 payment flagged?'
    ]
  },
  {
    id: 'help',
    icon: '🛠️',
    label: 'App help',
    questions: [
      "I can't log in to the app",
      "The app keeps crashing or won't load",
      "My payment didn't go through",
      'Where can I find my statements?',
      "I'm not getting notifications"
    ]
  }
]

const fallbackSuggestions = [
  'How much budget do I have left?',
  'How do I lock my card?',
  "I can't log in to the app"
]


// Scripted backup replies, used only when the AI service can't be reached.
function getAssistantReply(question, dataPermissions) {
  const q = question.toLowerCase()

  const asksAboutTransactions = /(?:my|this|that|a|an|recent|unrecognised|unrecognized|suspicious)\s+(?:bank\s+)?(?:transaction|payment|purchase|charge)|(?:transaction|payment|purchase|charge).*(?:flagged|unrecognised|unrecognized|merchant|\$850)|(?:fraud|suspicious).*(?:payment|transaction|charge)/.test(q)
  if (!dataPermissions.assistantCanReadTransactions && asksAboutTransactions) {
    return 'I can’t access transaction details because that permission is turned off. You can change it in Settings > AI and your data. I can still provide general guidance.'
  }

  const asksForSpendingInsights = /\b(my budget|budget left|budget remaining|my spending|spend(?:ing)? so far|subscriptions?|my expenses|where did (?:most of )?(?:my )?(?:money|spending) go|how much.*(?:spent|budget))\b/.test(q)
    || /\b(spend|spending|expense|expenses)\b/.test(q)
    || /\b(save an extra \$?2,?000|my savings goal|how much.*saved)\b/.test(q)
  if (!dataPermissions.spendingInsights && asksForSpendingInsights) {
    return 'Spending insights are turned off, so I can’t access your budget, categories or subscriptions. You can change this in Settings > AI and your data. I can still answer general money questions.'
  }

  const asksAboutPersonalGoal = /\b(japan|holiday|goal|saved|planned contribution)\b/.test(q)
  if (!dataPermissions.spendingInsights && asksAboutPersonalGoal) {
    return 'I can’t access your savings-goal details while spending insights are turned off. You can change this in Settings > AI and your data.'
  }

  if (q.includes('subscription')) {
    return "You currently have 3 recurring subscriptions costing $68.97 per month. Netflix is $25.99, Spotify is $13.99 and iCloud+ is $28.99. Netflix is marked for review because there has been no activity in the last 30 days. If you no longer use it, reviewing that subscription could save you $25.99 per month, or $311.88 per year. Remember to check before cancelling anything."
  }

  if (q.includes('lock') || q.includes('card')) {
    return "If you think your card may be lost or compromised, use your bank's official app or contact the bank immediately. In a real banking app, you would normally find a card management or card security option to temporarily lock your card. Cashflow IQ is a demonstration prototype, so I cannot actually lock your card. Never share your PIN or banking password in this chat."
  }

  if (
    q.includes('fraud') ||
    q.includes('flagged') ||
    q.includes('suspicious') ||
    q.includes('transaction')
  ) {
    if (!dataPermissions.assistantCanReadTransactions) {
      return 'I can offer general security guidance, but I can’t access specific transaction details because that permission is turned off. For a payment you don’t recognise, contact the bank through its official channels.'
    }

    return "Your demo security monitor flagged an $850 payment to an unfamiliar online store as high risk. The amount and unfamiliar merchant triggered the alert. If this were a real transaction, check your account activity and contact your bank through its official channels if you don't recognise it. This is simulated activity, not a real bank alert."
  }

  if (
    q.includes('japan') ||
    q.includes('goal') ||
    q.includes('holiday')
  ) {
    return "Your Japan Holiday goal has a target of $10,000, and you've already saved $4,000. That means you have $6,000 remaining. At your planned contribution of $300 per month, you could reach your goal in approximately 20 months. You're already 40% of the way there! You could also consider redirecting some savings from subscriptions or flexible spending towards your holiday."
  }

  if (
    q.includes('spend') ||
    q.includes('money go') ||
    q.includes('expense')
  ) {
    return "You've spent $4,150 from your $4,800 monthly budget so far. Your biggest category is Housing at $1,800, followed by Food & Dining at $1,050. Shopping accounts for another $650. Food and dining could be a good place to review flexible spending."
  }

  if (
    q.includes('2000') ||
    q.includes('save') ||
    q.includes('saving')
  ) {
    if (!dataPermissions.spendingInsights) {
      return 'I can share general saving strategies, but I can’t use your budget or spending details while spending insights are turned off.'
    }

    return "To save an additional $2,000 over 12 months, you would need to put aside approximately $167 per month. You currently have $650 remaining in your monthly budget. You could consider allocating part of that amount towards your savings goal while keeping some available for unexpected expenses."
  }

  if (
    q.includes('budget') ||
    q.includes('remaining') ||
    q.includes('left')
  ) {
    if (!dataPermissions.spendingInsights) {
      return 'Spending insights are turned off, so I can’t access your budget details. You can change this in Settings > AI and your data.'
    }

    return "Your monthly budget is $4,800, and you've spent $4,150 so far. That leaves $650 remaining, meaning you've used approximately 86% of your budget. Keep an eye on flexible spending for the rest of the month."
  }

  return "Sorry, the AI assistant is offline right now, so I can only answer a few set questions about your budget, spending, subscriptions, savings goal and security alerts. Please try again in a moment, or pick one of the suggested topics."
}


// Offline backup: pick a relevant screen and urgency from keywords.
function getFallbackExtras(question) {
  const q = question.toLowerCase()
  const urgent = /fraud|scam|stolen|lost|recognise|suspicious/.test(q)

  let actions = ['contact']
  if (/fraud|suspicious|flagged|scam|recognise|lock|card/.test(q)) actions = ['fraud']
  else if (/goal|japan|holiday|save|saving/.test(q)) actions = ['journey']
  else if (/spend|budget|subscription|money go|expense/.test(q)) actions = ['insights']
  else if (/statement|account|balance/.test(q)) actions = ['accounts']

  return { actions, urgent }
}

function CategoryTabs({ activeId, onSelect, categoriesToShow = categories }) {
  return (
    <div className="ai-category-tabs" role="tablist">
      {categoriesToShow.map(category => (
        <button
          key={category.id}
          role="tab"
          aria-selected={activeId === category.id}
          className={`ai-category-tab ${activeId === category.id ? 'active' : ''}`}
          onClick={() => onSelect(category.id)}
        >
          <span aria-hidden="true">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  )
}

function AIAssistant({ onNavigate, dataPermissions = {} }) {
  const effectiveDataPermissions = {
    spendingInsights: true,
    homeSuggestions: true,
    assistantCanReadTransactions: true,
    personalizedOffers: true,
    ...dataPermissions
  }
  const [messages, setMessages] = useState(() => loadJson(CURRENT_CHAT_KEY, []))
  const [history, setHistory] = useState(() => loadJson(HISTORY_KEY, []))
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('Gemini AI')
  const [activeCategory, setActiveCategory] = useState('money')
  const [showTopics, setShowTopics] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const messagesEndRef = useRef(null)

  // Save the chat so it survives navigating to another screen and back.
  useEffect(() => saveJson(CURRENT_CHAT_KEY, messages), [messages])
  useEffect(() => saveJson(HISTORY_KEY, history), [history])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  const visibleCategories = categories.filter(
    category => effectiveDataPermissions.spendingInsights || category.id !== 'money'
  )
  const currentCategory = visibleCategories.find(c => c.id === activeCategory)
    || visibleCategories[0]

  // Ask the AI to answer the conversation so far (which must end with a user message).
  const requestReply = async (conversation) => {
    setMessages(conversation)
    setIsLoading(true)

    const dataAccessIsRestricted = !effectiveDataPermissions.spendingInsights
      || !effectiveDataPermissions.assistantCanReadTransactions
      || !effectiveDataPermissions.personalizedOffers
    const requestConversation = dataAccessIsRestricted
      ? conversation.slice(-1)
      : conversation

    let answer
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: requestConversation.map(({ role, text }) => ({ role, text })),
          dataPermissions: effectiveDataPermissions
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      answer = {
        text: data.reply,
        suggestions: (data.suggestions ?? []).filter(suggestion => {
          const text = suggestion.toLowerCase()
          return (effectiveDataPermissions.spendingInsights
              || !/budget|spend|subscription|expense|money go/.test(text))
            && (effectiveDataPermissions.assistantCanReadTransactions
              || !/transaction|merchant|purchase|payment|charge|flagged/.test(text))
        }),
        actions: (data.actions ?? []).filter(action =>
          action !== 'insights' || effectiveDataPermissions.spendingInsights
        ),
        urgent: Boolean(data.urgent)
      }
      setMode('Gemini AI')
    } catch (err) {
      // Fall back to the scripted demo replies so the prototype still works offline.
      console.warn('AI unavailable, using demo replies:', err.message)
      const question = conversation[conversation.length - 1].text
      const fallbackExtras = getFallbackExtras(question)
      if (!effectiveDataPermissions.spendingInsights) {
        fallbackExtras.actions = fallbackExtras.actions.filter(action => action !== 'insights')
      }
      answer = {
        text: getAssistantReply(question, effectiveDataPermissions),
        suggestions: fallbackSuggestions.filter(suggestion => (
          effectiveDataPermissions.spendingInsights
          || !/budget|money|spend|subscription/i.test(suggestion)
        )),
        ...fallbackExtras,
        offline: true
      }
      setMode('Demo mode')
    }

    setMessages([...conversation, { role: 'assistant', ...answer }])
    setIsLoading(false)
  }

  const sendMessage = (question) => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isLoading) return

    setInput('')
    setShowTopics(false)
    requestReply([...messages, { role: 'user', text: trimmedQuestion }])
  }

  const retry = (index) => {
    if (isLoading) return
    requestReply(messages.slice(0, index))
  }

  const talkToPerson = () => {
    if (isLoading) return
    setMessages(current => [
      ...current,
      { role: 'user', text: 'I want to talk to a person' },
      { role: 'assistant', text: HANDOFF_MESSAGE, local: true }
    ])
  }

  const handleAction = (id) => {
    if (id === 'contact') talkToPerson()
    else onNavigate?.(id)
  }

  const setFeedback = (index, value) => {
    setMessages(current =>
      current.map((m, i) =>
        i === index ? { ...m, feedback: m.feedback === value ? undefined : value } : m
      )
    )
  }

  const copyMessage = async (index, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      // Clipboard blocked: ignore.
    }
  }

  const archiveCurrentChat = () => {
    const firstQuestion = messages.find(m => m.role === 'user')
    if (!firstQuestion) return
    const now = currentTimestamp()
    setHistory(current => [
      { id: now, title: firstQuestion.text, date: now, messages },
      ...current
    ].slice(0, 10))
  }

  const clearChat = () => {
    archiveCurrentChat()
    setMessages([])
    setInput('')
    setShowTopics(false)
  }

  const openConversation = (conversation) => {
    archiveCurrentChat()
    setHistory(current => current.filter(c => c.id !== conversation.id))
    setMessages(conversation.messages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const lastMessage = messages[messages.length - 1]
  const followUps =
    !isLoading && lastMessage?.role === 'assistant' ? lastMessage.suggestions ?? [] : []

  return (
    <div className="ai-page">

      {messages.length === 0 ? (
        <section className="ai-welcome-screen">

          <div className="ai-welcome-top">
            <span className="ai-welcome-icon">✦</span>
            <span className="ai-status">● {mode}</span>
          </div>

          <p className="eyebrow">YOUR PERSONAL FINANCIAL COMPANION</p>

          <h1>Hi Olivia, let's make money simpler.</h1>

          <p className="ai-welcome-message">
            {effectiveDataPermissions.spendingInsights
              ? <>You have <strong>$650 left in your November budget.</strong>{' '}</>
              : <>Spending insights are turned off.{' '}</>}
            I can help with your money, explain our products and
            services, check a security concern or fix a problem with the
            app. Choose a topic below or ask me anything.
          </p>

          <div className="ai-question-section">
            <h2>Choose a topic</h2>

            <CategoryTabs
              activeId={currentCategory.id}
              onSelect={setActiveCategory}
              categoriesToShow={visibleCategories}
            />

            <div className="ai-topic-list">
              {currentCategory.questions.map(question => (
                <button
                  className="ai-topic-option"
                  key={question}
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form className="ai-input-area ai-welcome-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Or type your own question..."
              aria-label="Ask the AI assistant"
            />
            <button type="submit" disabled={!input.trim()}>
              Send ↑
            </button>
          </form>

          <div className="ai-history-section">
            <div className="ai-history-header">
              <h2>{history.length > 0 ? 'Previous conversations' : 'Try an example conversation'}</h2>
              {history.length > 0 && (
                <button className="ai-text-button" onClick={() => setHistory([])}>
                  Clear
                </button>
              )}
            </div>

            {history.length > 0
              ? history.map(item => (
                <button
                  className="ai-history-item"
                  key={item.id}
                  onClick={() => openConversation(item)}
                >
                  <span className="ai-history-icon">◷</span>
                  <span className="ai-history-details">
                    <strong>{item.title}</strong>
                    <small>
                      {new Date(item.date).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'long'
                      })}
                      {' · '}
                      {item.messages.length} messages
                    </small>
                  </span>
                  <span className="ai-history-arrow">›</span>
                </button>
              ))
              : exampleConversations.map(item => (
                <button
                  className="ai-history-item"
                  key={item.title}
                  onClick={() => sendMessage(item.question)}
                >
                  <span className="ai-history-icon">◷</span>
                  <span className="ai-history-details">
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className="ai-history-arrow">›</span>
                </button>
              ))}
          </div>

        </section>
      ) : (
        <section className="ai-chat-container">

          <div className="ai-chat-heading">
            <div className="ai-avatar">AI</div>

            <div>
              <h2>Cashflow IQ Assistant</h2>
              <p>Here to help with your finances</p>
            </div>

            <div className="ai-heading-actions">
              <span className="ai-status">● {mode}</span>
              <button className="ai-clear-button" onClick={talkToPerson}>
                ☎ Talk to a person
              </button>
              <button className="ai-clear-button" onClick={clearChat}>
                New conversation
              </button>
            </div>
          </div>

          <div className="ai-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${message.role}`}
              >
                <div className="message-avatar">
                  {message.role === 'assistant' ? 'AI' : 'You'}
                </div>

                {message.role === 'user' ? (
                  <div className="message-bubble">{message.text}</div>
                ) : (
                  <div className="ai-reply">
                    <div className="message-bubble formatted">
                      {message.urgent && (
                        <div className="ai-urgent-banner" role="alert">
                          <strong>⚠ Act now</strong>
                          If your card or account may be at risk, call the
                          number on the back of your card (24/7) or lock your
                          card in the official app.
                        </div>
                      )}
                      <FormattedText text={message.text} />
                    </div>

                    {message.actions?.length > 0 && (
                      <div className="ai-action-buttons">
                        {message.actions.filter(id => ACTIONS[id]).map(id => (
                          <button
                            key={id}
                            className="ai-action-button"
                            onClick={() => handleAction(id)}
                          >
                            <span aria-hidden="true">{ACTIONS[id].icon}</span>
                            {ACTIONS[id].label} →
                          </button>
                        ))}
                      </div>
                    )}

                    {!message.local && (
                      <div className="ai-message-tools">
                        <button
                          className={message.feedback === 'up' ? 'selected' : ''}
                          onClick={() => setFeedback(index, 'up')}
                          aria-label="Helpful"
                          title="Helpful"
                        >
                          👍
                        </button>
                        <button
                          className={message.feedback === 'down' ? 'selected' : ''}
                          onClick={() => setFeedback(index, 'down')}
                          aria-label="Not helpful"
                          title="Not helpful"
                        >
                          👎
                        </button>
                        <button onClick={() => copyMessage(index, message.text)}>
                          {copiedIndex === index ? 'Copied ✓' : 'Copy'}
                        </button>
                        {message.offline && (
                          <button onClick={() => retry(index)}>
                            ↻ Try again with AI
                          </button>
                        )}
                      </div>
                    )}

                    {message.feedback === 'down' && (
                      <p className="ai-feedback-note">
                        Thanks for letting us know. Try rephrasing your question, or{' '}
                        <button className="ai-text-button" onClick={talkToPerson}>
                          talk to a person
                        </button>.
                      </p>
                    )}
                    {message.feedback === 'up' && (
                      <p className="ai-feedback-note">Thanks for the feedback!</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="ai-message assistant">
                <div className="message-avatar">AI</div>
                <div className="message-bubble ai-typing" aria-label="Assistant is typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {followUps.length > 0 && (
              <div className="ai-suggestion-chips" aria-label="Suggested follow-up questions">
                {followUps.map(suggestion => (
                  <button
                    key={suggestion}
                    className="ai-suggestion-chip"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showTopics && (
            <div className="ai-topic-panel">
              <CategoryTabs activeId={activeCategory} onSelect={setActiveCategory} />
              <div className="ai-suggestion-chips">
                {currentCategory.questions.map(question => (
                  <button
                    key={question}
                    className="ai-suggestion-chip"
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="ai-input-area" onSubmit={handleSubmit}>
            <button
              type="button"
              className={`ai-topics-toggle ${showTopics ? 'active' : ''}`}
              onClick={() => setShowTopics(open => !open)}
              aria-expanded={showTopics}
            >
              ☰ Topics
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about your finances..."
              aria-label="Ask the AI assistant"
            />

            <button type="submit" disabled={!input.trim() || isLoading}>
              Send ↑
            </button>
          </form>

        </section>
      )}

      <p className="ai-disclaimer">
        AI demonstration: Responses are generated by Google Gemini
        (or illustrative rules when offline) using fictional financial data.
        This prototype is not connected to real Westpac accounts and does
        not provide financial advice.
      </p>

    </div>
  )
}

export default AIAssistant
