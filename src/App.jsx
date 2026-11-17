
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
import NotificationSettings from './pages/notificationSettings.jsx'
import AIDataSettings from './pages/aiDataSettings.jsx'
import { deleteAssistantChatHistory } from './utils/assistantChatStorage.js'

const navItems = [
  { id: 'dashboard', label: 'Home', icon: '⌂' },
  { id: 'insights', label: 'Smart Budgeting', icon: '▥' },
  { id: 'journey', label: 'Savings Goals', icon: '◎' },
  { id: 'fraud', label: 'Fraud Protection', icon: '▣' },
  { id: 'accounts', label: 'Accounts', icon: '▤' },
  { id: 'assistant', label: 'AI Assistant', icon: '✦' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
]

const initialNotificationPreferences = {
  promotionalNotifications: true,
  personalizedOffers: true,
  savingsTips: false,
  frequency: 'twiceAWeek'
}

const initialAIDataPreferences = {
  spendingInsights: true,
  homeSuggestions: true,
  assistantCanReadTransactions: true
}

const initialNotifications = [
  {
    id: 1,
    title: 'Grocery promotion found!',
    message: 'Save $15 on your next grocery shop. We found an offer that matches your regular spending.',
    time: 'Just now',
    saving: '$15.00',
    category: 'Groceries',
    icon: '🛒',
    personalized: true,
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
    personalized: true,
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
    personalized: true,
    read: false
  }
]

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState(
    initialNotificationPreferences
  )
  const [settingsSection, setSettingsSection] = useState('notifications')
  const [aiDataPreferences, setAIDataPreferences] = useState(initialAIDataPreferences)

  const visibleNotifications = notifications.filter(notification =>
    notificationPreferences.promotionalNotifications
      && (!notification.personalized || notificationPreferences.personalizedOffers)
  )
  const unreadCount = visibleNotifications.filter(
    notification => !notification.read
  ).length

  const markAllAsRead = () => {
    const visibleIds = new Set(visibleNotifications.map(notification => notification.id))

    setNotifications(previous =>
      previous.map(notification => ({
        ...notification,
        read: notification.read || visibleIds.has(notification.id)
      }))
    )
  }

  const updateNotificationPreference = (key, value) => {
    setNotificationPreferences(previous => ({
      ...previous,
      [key]: value
    }))
  }

  const updateAIDataPreference = (key, value) => {
    if (key === 'personalizedOffers') {
      updateNotificationPreference(key, value)
      return
    }

    setAIDataPreferences(previous => ({
      ...previous,
      [key]: value
    }))
  }

  const openNotificationSettings = () => {
    setShowNotifications(false)
    setSettingsSection('notifications')
    setCurrentPage('settings')
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
          promotionalNotificationsEnabled={notificationPreferences.promotionalNotifications}
          personalizedOffersEnabled={notificationPreferences.personalizedOffers}
          spendingInsightsEnabled={aiDataPreferences.spendingInsights}
          homeSuggestionsEnabled={aiDataPreferences.homeSuggestions}
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

    if (currentPage === 'settings') {
      const settingsProps = {
        onBack: () => setCurrentPage('dashboard'),
        onSectionChange: setSettingsSection
      }

      if (settingsSection === 'aiData') {
        return (
          <AIDataSettings
            {...settingsProps}
            preferences={{
              ...aiDataPreferences,
              personalizedOffers: notificationPreferences.personalizedOffers
            }}
            onPreferenceChange={updateAIDataPreference}
            onDeleteChatHistory={deleteAssistantChatHistory}
          />
        )
      }

      return (
        <NotificationSettings
          {...settingsProps}
          activeSection={settingsSection}
          preferences={notificationPreferences}
          onPreferenceChange={updateNotificationPreference}
        />
      )
    }

    if (currentPage === 'assistant') {
      return (
        <AIAssistant
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={setCurrentPage}
          dataPermissions={{
            spendingInsights: aiDataPreferences.spendingInsights,
            homeSuggestions: aiDataPreferences.homeSuggestions,
            assistantCanReadTransactions: aiDataPreferences.assistantCanReadTransactions,
            personalizedOffers: notificationPreferences.personalizedOffers
          }}
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
                onClick={() => {
                  setShowNotifications(false)
                  if (item.id === 'settings') setSettingsSection('notifications')
                  setCurrentPage(item.id)
                }}
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
                          : visibleNotifications.length > 0
                            ? 'You are all caught up!'
                            : 'No promotional notifications to show'}
                      </p>
                    </div>

                    <div className="notification-panel-actions">
                      <button
                        className="notification-close"
                        onClick={openNotificationSettings}
                        aria-label="Notification settings"
                        title="Notification settings"
                      >
                        ⚙
                      </button>
                      <button
                        className="notification-close"
                        onClick={() => setShowNotifications(false)}
                        aria-label="Close notifications"
                      >
                        ×
                      </button>
                    </div>
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
                    {visibleNotifications.length === 0 ? (
                      <div className="notification-empty-state">
                        <p>
                          {notificationPreferences.promotionalNotifications
                            ? 'No offers match your current notification preferences.'
                            : 'Promotional notifications are turned off.'}
                        </p>
                        <button onClick={openNotificationSettings}>
                          Manage notification settings →
                        </button>
                      </div>
                    ) : visibleNotifications.map(notification => (
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
