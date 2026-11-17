import '../styles/notificationSettings.css'
import SettingsSectionTabs from '../components/SettingsSectionTabs.jsx'

const promotionPreferences = [
  {
    key: 'promotionalNotifications',
    title: 'Promotional notifications',
    description: 'Offers and rewards from us and our partners.'
  },
  {
    key: 'personalizedOffers',
    title: 'Personalised offers',
    description: 'Use the spending categories I choose to share.'
  },
  {
    key: 'savingsTips',
    title: 'Savings tips',
    description: 'Occasional tips based on my insights.'
  }
]

const notificationFrequencies = [
  { value: 'weekly', label: 'Weekly digest' },
  { value: 'twiceAWeek', label: 'Up to 2 a week' },
  { value: 'asTheyHappen', label: 'As they happen' }
]

function NotificationSettings({
  preferences,
  onPreferenceChange,
  onBack,
  activeSection,
  onSectionChange
}) {
  return (
    <section className="notification-settings-page">
      <header className="notification-settings-header">
        <button
          className="notification-settings-back"
          onClick={onBack}
          aria-label="Back to home"
        >
          ‹
        </button>
        <h1>Notifications</h1>
      </header>

      <SettingsSectionTabs
        activeSection={activeSection}
        onSelect={onSectionChange}
      />

      <div className="notification-settings-content">
        <fieldset className="notification-settings-section">
          <legend>PROMOTIONS</legend>
          <div className="notification-preference-card">
            {promotionPreferences.map((preference) => (
              <div className="notification-preference-row" key={preference.key}>
                <div className="notification-preference-copy">
                  <h2 id={`${preference.key}-label`}>{preference.title}</h2>
                  <p id={`${preference.key}-description`}>{preference.description}</p>
                </div>
                <button
                  className={`notification-switch ${
                    preferences[preference.key] ? 'is-on' : ''
                  }`}
                  type="button"
                  role="switch"
                  aria-checked={preferences[preference.key]}
                  aria-labelledby={`${preference.key}-label`}
                  aria-describedby={`${preference.key}-description`}
                  onClick={() => onPreferenceChange(
                    preference.key,
                    !preferences[preference.key]
                  )}
                >
                  <span />
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="notification-settings-section">
          <legend>HOW OFTEN</legend>
          <div className="notification-frequency-options" role="group" aria-label="Promotional notification frequency">
            {notificationFrequencies.map((frequency) => (
              <button
                className={`notification-frequency-option ${
                  preferences.frequency === frequency.value ? 'is-selected' : ''
                }`}
                type="button"
                key={frequency.value}
                aria-pressed={preferences.frequency === frequency.value}
                onClick={() => onPreferenceChange('frequency', frequency.value)}
              >
                {frequency.label}
              </button>
            ))}
          </div>
        </fieldset>

        <section className="notification-settings-section">
          <h2 className="notification-settings-legend">QUIET HOURS</h2>
          <div className="notification-quiet-hours">
            <strong>No promotions</strong>
            <span>9:00 pm – 8:00 am</span>
          </div>
        </section>

        <aside className="notification-personalisation-note">
          <h2>What we use to personalise</h2>
          <p>
            Personalised offers use the spending categories you choose to share.
            Turn this off any time to receive only general promotions.
          </p>
        </aside>

        <p className="notification-security-note">
          Security alerts and payment confirmations are always on, even if you
          turn off promotional notifications.
        </p>
        <p className="notification-prototype-note">
          These demo settings apply to in-app promotional notifications only.
          No messages are sent to your device.
        </p>
      </div>
    </section>
  )
}

export default NotificationSettings
