
import { useState } from 'react'
import '../styles/dashboard.css'

function Dashboard({ onInsights, onJourney, onFraud, onAssistant }) {
  const [showOverlapReminder, setShowOverlapReminder] = useState(true)
  const [highlightOverlappingExpenses, setHighlightOverlappingExpenses] = useState(false)

  const transactions = [
    { name: 'Woolworths', category: 'Groceries', date: 'Today, 10:24 AM', amount: '-$85.40', icon: '🛒' },
    { name: 'Spotify', category: 'Music streaming', date: 'Today, 9:40 AM', amount: '-$11.99', icon: '🎵' },
    { name: 'Cafe Brisbane', category: 'Dining & cafes', date: 'Today, 8:15 AM', amount: '-$24.50', icon: '☕' },
    { name: 'Apple Music', category: 'Music streaming', date: 'Yesterday', amount: '-$10.99', icon: '🎵' },
    { name: 'Translink', category: 'Transport', date: 'Yesterday', amount: '-$12.80', icon: '🚆' },
    { name: 'Salary payment', category: 'Income', date: '14 Nov 2026', amount: '+$3,000.00', icon: '💰' },
  ]

  const overlappingExpenses = transactions.reduce((groups, transaction) => {
    if (transaction.amount.startsWith('-')) {
      groups[transaction.category] = [...(groups[transaction.category] || []), transaction]
    }

    return groups
  }, {})
  const duplicateExpenseGroups = Object.entries(overlappingExpenses)
    .filter(([, expenses]) => expenses.length > 1)

  const quickLinks = [
    {
      title: 'Smart Budgeting',
      description: 'Understand your spending and discover opportunities to save.',
      icon: '📊',
      action: onInsights,
      button: 'View insights',
    },
    {
      title: 'Savings Goals',
      description: 'Track your goals and see how close you are to achieving them.',
      icon: '🎯',
      action: onJourney,
      button: 'View goals',
    },
    {
      title: 'Fraud Protection',
      description: 'Review unusual transactions and keep your money secure.',
      icon: '🛡️',
      action: onFraud,
      button: 'Check security',
    },
    {
      title: 'AI Banking Assistant',
      description: 'Get helpful answers and personalised financial guidance.',
      icon: '✦',
      action: onAssistant,
      button: 'Chat with AI',
    },
  ]

  return (
    <main className="dashboard-page home-dashboard">

      <div className="dashboard-welcome-row">
        <div>
          <p className="eyebrow">YOUR PERSONAL FINANCIAL SPACE</p>
          <h1>Good morning, Olivia</h1>
          <p className="description">
            Here's your financial overview. Let's make your money work for you.
          </p>
        </div>
      </div>

      {/* Account overview */}
      <section className="home-balance-card">
        <div className="balance-card-top">
          <div>
            <p className="balance-label">TOTAL ACCOUNT BALANCE</p>
            <h2>$16,500.00</h2>
            <span className="balance-account-name">Across your linked accounts</span>
          </div>
          <span className="balance-card-icon">W</span>
        </div>

        <div className="balance-card-divider"></div>

        <div className="balance-summary">
          <div>
            <span className="summary-label">↗ Money in</span>
            <strong>$3,000.00</strong>
            <small>This month</small>
          </div>

          <div>
            <span className="summary-label">↘ Money out</span>
            <strong>$2,450.00</strong>
            <small>This month</small>
          </div>

          <div>
            <span className="summary-label">Available budget</span>
            <strong>$550.00</strong>
            <small>Remaining this month</small>
          </div>
        </div>
      </section>

      {/* Recent transactions */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">YOUR ACCOUNT ACTIVITY</p>
            <h2>Recent transactions</h2>
          </div>
          <span className="demo-label">DEMO DATA</span>
        </div>

        {showOverlapReminder && duplicateExpenseGroups.map(([category, expenses]) => (
          <aside className="overlap-reminder" key={category} aria-label={`Possible overlap in ${category}`}>
            <div className="overlap-reminder-icon" aria-hidden="true">↻</div>
            <div className="overlap-reminder-content">
              <p className="overlap-reminder-label">POSSIBLE OVERLAP · {category.toUpperCase()}</p>
              <h3>{expenses.length} expenses in one category</h3>
              <p>
                {expenses.map((expense) => expense.name).join(' and ')} may cover similar services.
                Check whether you meant to keep both.
              </p>
              <button
                className="overlap-review-button"
                onClick={() => setHighlightOverlappingExpenses(!highlightOverlappingExpenses)}
                aria-controls="recent-transactions-list"
                aria-pressed={highlightOverlappingExpenses}
              >
                {highlightOverlappingExpenses ? 'Stop highlighting' : 'Review transactions'} →
              </button>
            </div>
            <button
              className="overlap-dismiss-button"
              onClick={() => setShowOverlapReminder(false)}
              aria-label="Dismiss possible overlap reminder"
            >
              ×
            </button>
          </aside>
        ))}

        <div className="home-transactions" id="recent-transactions-list">
          {transactions.map((transaction) => (
            <div
              className={`home-transaction ${
                highlightOverlappingExpenses && duplicateExpenseGroups.some(
                  ([, expenses]) => expenses.includes(transaction)
                ) ? 'home-transaction-overlap' : ''
              }`}
              key={transaction.name}
            >
              <div className="transaction-icon">
                {transaction.icon}
              </div>

              <div className="transaction-details">
                <strong>{transaction.name}</strong>
                <span>{transaction.category} · {transaction.date}</span>
              </div>

              <strong className={
                transaction.amount.startsWith('+')
                  ? 'transaction-income'
                  : 'transaction-expense'
              }>
                {transaction.amount}
              </strong>
            </div>
          ))}
        </div>
      </section>

      {/* Savings goal */}
      <section className="home-getaway-card">
        <div className="getaway-content">
          <p className="eyebrow">YOUR NEXT GETAWAY</p>
          <h2>Japan is getting closer! ✈️</h2>
          <p>
            Keep building your savings and take one step closer
            to your next adventure.
          </p>

          <div className="getaway-progress-label">
            <span>Progress towards your goal</span>
            <strong>40%</strong>
          </div>

          <div className="getaway-progress-track">
            <div className="getaway-progress-fill"></div>
          </div>

          <div className="getaway-amounts">
            <strong>$4,000 saved</strong>
            <span>$10,000 goal</span>
          </div>

          <button className="home-primary-button" onClick={onJourney}>
            View my savings goal →
          </button>
        </div>

        <div className="getaway-illustration" aria-hidden="true">
          <span>🗻</span>
          <span>🌸</span>
          <span>⛩️</span>
        </div>
      </section>

      {/* Quick navigation */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">YOUR FINANCIAL TOOLS</p>
            <h2>Explore your finances</h2>
          </div>
        </div>

        <div className="home-tools-grid">
          {quickLinks.map((item) => (
            <article className="home-tool-card" key={item.title}>
              <span className="home-tool-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button onClick={item.action}>
                {item.button} →
              </button>
            </article>
          ))}
        </div>
      </section>

      <p className="dashboard-disclaimer">
        Cashflow IQ is a demonstration prototype. All account balances
        and transactions shown are illustrative and not connected to
        real Westpac accounts.
      </p>

    </main>
  )
}

export default Dashboard
