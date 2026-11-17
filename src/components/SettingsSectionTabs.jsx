import '../styles/settingsSectionTabs.css'

const sections = [
  { id: 'notifications', label: 'Notifications' },
  { id: 'aiData', label: 'AI and your data' }
]

function SettingsSectionTabs({ activeSection, onSelect }) {
  return (
    <nav className="settings-section-tabs" aria-label="Settings sections">
      {sections.map((section) => (
        <button
          type="button"
          key={section.id}
          className={activeSection === section.id ? 'active' : ''}
          aria-current={activeSection === section.id ? 'page' : undefined}
          onClick={() => onSelect(section.id)}
        >
          {section.label}
        </button>
      ))}
    </nav>
  )
}

export default SettingsSectionTabs
