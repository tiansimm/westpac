import { useState } from 'react'
import SettingsSectionTabs from '../components/SettingsSectionTabs.jsx'
import '../styles/aiDataSettings.css'

const dataPreferences = [
  {
    key: 'spendingInsights',
    title: 'Spending insights',
    description: 'Spot patterns like overlapping subscriptions.'
  },
  {
    key: 'homeSuggestions',
    title: 'Suggestions on Home',
    description: 'Bills, savings and tips picked for you.'
  },
  {
    key: 'assistantCanReadTransactions',
    title: 'Assistant can read my transactions',
    description: 'So it can answer questions about your money.'
  },
  {
    key: 'personalizedOffers',
    title: 'Personalised offers',
    description: 'Use the spending categories I choose to share.'
  }
]

function AIDataSettings({
  preferences,
  onPreferenceChange,
  onSectionChange,
  onBack,
  onDeleteChatHistory
}) {
  const [feedback, setFeedback] = useState('')
  const [showContactInfo, setShowContactInfo] = useState(false)

  const deleteChatHistory = () => {
    try {
      onDeleteChatHistory()
      setFeedback('Your assistant chat history has been deleted from this device.')
    } catch (error) {
      console.error('Unable to delete assistant chat history:', error)
      setFeedback('Could not delete chat history. Please try again.')
    }
  }

  return (
    <section className="ai-data-settings-page">
      <header className="ai-data-settings-header">
        <button
          className="ai-data-settings-back"
          onClick={onBack}
          aria-label="Back to home"
        >
          ‹
        </button>
        <h1>AI and your data</h1>
      </header>

      <SettingsSectionTabs
        activeSection="aiData"
        onSelect={onSectionChange}
      />

      <div className="ai-data-settings-content">
        <p className="ai-data-settings-intro">
          AI helps with insights, suggestions and your assistant. You choose
          what it can use, and you can change that at any time.
        </p>

        <fieldset className="ai-data-settings-section">
          <legend>WHAT AI CAN USE</legend>
          <div className="ai-data-preference-card">
            {dataPreferences.map((preference) => (
              <div className="ai-data-preference-row" key={preference.key}>
                <div className="ai-data-preference-copy">
                  <h2 id={`${preference.key}-label`}>{preference.title}</h2>
                  <p id={`${preference.key}-description`}>{preference.description}</p>
                </div>
                <button
                  className={`ai-data-switch ${
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

        <aside className="ai-data-limit-note">
          <h2>What AI can’t do</h2>
          <p>
            It can’t move money or change settings without your OK. It won’t
            receive data you’ve switched off. A person is always available.
          </p>
        </aside>

        <button className="ai-data-delete-button" onClick={deleteChatHistory}>
          Delete my assistant chat history
        </button>

        {feedback && (
          <p className="ai-data-feedback" role="status">{feedback}</p>
        )}

        <button
          className="ai-data-contact-button"
          onClick={() => setShowContactInfo(!showContactInfo)}
          aria-expanded={showContactInfo}
          aria-controls="ai-data-contact-info"
        >
          Talk to a person
        </button>

        {showContactInfo && (
          <p className="ai-data-contact-info" id="ai-data-contact-info" role="status">
            This prototype can’t connect you to a person. Contact the bank
            through its official app or visit a branch. For urgent card or
            fraud concerns, call the number on the back of your card.
          </p>
        )}

        <p className="ai-data-prototype-note">
          These demo preferences apply only while this prototype is open.
          Account data is fictional and not connected to Westpac.
        </p>
      </div>
    </section>
  )
}

export default AIDataSettings
