
import { useState } from 'react'
import './styles/navigation.css'
import './App.css'

import Welcome from './pages/welcome.jsx'
import Dashboard from './pages/dashboard.jsx'
import FinancialInsights from './pages/financialInsights.jsx'
import FinancialJourney from './pages/financialJourney.jsx'
import FraudProtection from './pages/fraudProtection.jsx'
import AIAssistant from './pages/aiAssistant.jsx'
import Accounts from './pages/accounts.jsx'

const navItems = [
  { id: 'dashboard', label: 'Home', icon: '⌂' },
  { id: 'insights', label: 'Smart Budgeting', icon: '▥' },
  { id: 'journey', label: 'Savings Goals', icon: '◎' },
  { id: 'fraud', label: 'Fraud Protection', icon: '▣' },
  { id: 'accounts', label: 'Accounts', icon: '▤' },
  { id: 'assistant', label: 'AI Assistant', icon: '✦' }
]

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')

  const renderPage = () => {
    if (currentPage === 'dashboard') {
      return (
        <Dashboard
          onBack={() => setCurrentPage('welcome')}
          onInsights={() => setCurrentPage('insights')}
          onJourney={() => setCurrentPage('journey')}
          onFraud={() => setCurrentPage('fraud')}
          onAssistant={() => setCurrentPage('assistant')}
        />
      )
    }

    if (currentPage === 'insights') {
      return (
        <FinancialInsights
          onBack={() => setCurrentPage('dashboard')}
          onAssistant={() => setCurrentPage('assistant')}
        />
      )
    }

    if (currentPage === 'journey') {
      return (
        <FinancialJourney
          onBack={() => setCurrentPage('dashboard')}
        />
      )
    }

    if (currentPage === 'fraud') {
      return (
        <FraudProtection
          onBack={() => setCurrentPage('dashboard')}
        />
      )
    }

    if (currentPage === 'accounts') {
      return (
        <Accounts
          onAssistant={() => setCurrentPage('assistant')}
        />
      )
    }

    if (currentPage === 'assistant') {
      return (
        <AIAssistant
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={setCurrentPage}
        />
      )
    }

    return (
      <Welcome
        onGetStarted={() => setCurrentPage('dashboard')}
      />
    )
  }

  // Show application navigation after entering the app
  const showNavigation = currentPage !== 'welcome'

  return (
    <div className="app-shell">

      {showNavigation && (
        <header className="top-navbar">

          <button
            className="navbar-brand"
            onClick={() => setCurrentPage('dashboard')}
          >
            <span className="brand-mark">C</span>
            <span>Cashflow IQ</span>
          </button>

          <nav className="navbar-links" aria-label="Main navigation">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-link ${
                  currentPage === item.id ? 'active' : ''
                }`}
                onClick={() => setCurrentPage(item.id)}
                aria-label={item.label}
                aria-current={
                  currentPage === item.id ? 'page' : undefined
                }
                title={item.label}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>

                <span className="nav-label">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <button
            className="navbar-profile"
            onClick={() => setCurrentPage('dashboard')}
            aria-label="Demo profile"
            title="Demo profile"
          >
            A
          </button>

        </header>
      )}

      <main className="app-content">
        {renderPage()}
      </main>

    </div>
  )
}

export default App
