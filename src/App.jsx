
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

const initialNotifications = [
  {
    id: 1,
    title: 'Grocery promotion found!',
    message: 'Save $15 on your next grocery shop. We found an offer that matches your regular spending.',
    time: 'Just now',
    saving: '$15.00',
    category: 'Groceries',
    icon: '🛒',
    read: false
  },
  {
    id: 2,
    title: 'Dining offer ending soon',
    message: 'Your selected dining promotion expires tomorrow. Do not miss the opportunity to save.',
    time: '2 hours ago',
    saving: '20% off',
    category: 'Dining',
    icon: '🍽️',
    read: false
  },
  {
    id: 3,
    title: 'Transport offer available',
    message: 'Get 10% off selected rides this week. This offer may help reduce your transport expenses.',
    time: 'Yesterday',
    saving: '10% off',
    category: 'Transport',
    icon: '🚗',
    read: false
  }
]

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter(
    notification => !notification.read
  ).length

  const markAllAsRead = () => {
    setNotifications(previous =>
      previous.map(notification => ({
        ...notification,
        read: true
      }))
    )
  }

  const openPromotion = (id) => {
    setNotifications(previous =>
      previous.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )

    setShowNotifications(false)
    setCurrentPage('insights')
  }

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

          <div className="navbar-actions">

            <div className="notification-wrapper">
              <button
                className="notification-button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={showNotifications}
                title="Notifications"
              >
                <span className="notification-bell">🔔</span>

                {unreadCount > 0 && (
                  <span className="notification-count">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-panel">

                  <div className="notification-panel-header">
                    <div>
                      <h3>Notifications</h3>
                      <p>
                        {unreadCount > 0
                          ? `${unreadCount} unread promotional updates`
                          : 'You are all caught up!'}
                      </p>
                    </div>

                    <button
                      className="notification-close"
                      onClick={() => setShowNotifications(false)}
                      aria-label="Close notifications"
                    >
                      ×
                    </button>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      className="mark-read-button"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}

                  <div className="notification-list">
                    {notifications.map(notification => (
                      <div
                        className={`notification-item ${
                          notification.read ? 'read' : 'unread'
                        }`}
                        key={notification.id}
                      >
                        <div className="notification-icon">
                          {notification.icon}
                        </div>

                        <div className="notification-content">
                          <div className="notification-item-heading">
                            <h4>{notification.title}</h4>
                            {!notification.read && (
                              <span className="notification-dot" />
                            )}
                          </div>

                          <p>{notification.message}</p>

                          <div className="notification-meta">
                            <span>{notification.time}</span>
                            <span>{notification.category}</span>
                          </div>

                          <div className="notification-offer">
                            Potential saving: {notification.saving}
                          </div>

                          <button
                            className="notification-view-button"
                            onClick={() => openPromotion(notification.id)}
                          >
                            View promotion →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>

            <button
              className="navbar-profile"
              onClick={() => setCurrentPage('dashboard')}
              aria-label="Demo profile"
              title="Demo profile"
            >
              A
            </button>

          </div>

        </header>
      )}

      <main className="app-content">
        {renderPage()}
      </main>

    </div>
  )
}

export default App
