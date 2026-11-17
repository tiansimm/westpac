import '../styles/welcome.css'

// Simple line icons (24x24, stroke = currentColor).
const ICON_PATHS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  sparkles: 'M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z',
  wallet: 'M3 7h18v12H3z M3 7l3-3h12l3 3 M16 13h2',
  chart: 'M4 20V10 M10 20V4 M16 20v-7 M2 20h20',
  target: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z',
  gear: 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9 7 7 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1',
  dollar: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5 M12 6.5v11',
  user: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M4 21c0-4 3.6-6 8-6s8 2 8 6',
  headset: 'M4 14v-2a8 8 0 0 1 16 0v2 M4 14h3v5H4z M17 14h3v5h-3z',
  arrow: 'M5 12h14 M13 6l6 6-6 6'
}

function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

// "All in one" shortcuts: page ids match App.jsx.
const shortcuts = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'assistant', label: 'Cash Flow IQ', icon: 'sparkles' },
  { id: 'accounts', label: 'Accounts', icon: 'wallet' },
  { id: 'insights', label: 'Smart Budgeting', icon: 'chart' },
  { id: 'journey', label: 'Savings Goals', icon: 'target' },
  { id: 'fraud', label: 'Fraud Protection', icon: 'shield' },
  { id: 'settings', label: 'Settings', icon: 'gear' }
]

const features = [
  {
    icon: 'chart',
    title: 'Smarter money management',
    text: 'Understand your spending and discover ways to save.'
  },
  {
    icon: 'target',
    title: 'Personalised financial journey',
    text: 'Get insights tailored to your goals and lifestyle.'
  },
  {
    icon: 'shield',
    title: 'Banking with confidence',
    text: 'Stay informed with intelligent fraud protection.'
  }
]

function Welcome({ onGetStarted, onNavigate }) {
  const go = (page) => (onNavigate ? onNavigate(page) : onGetStarted())

  return (
    <div className="app welcome-page">
      <section className="welcome-hero">

        {/* Decorative network of lines and floating icon nodes */}
        <div className="welcome-network" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="59" y1="7" x2="53" y2="25" />
            <line x1="59" y1="7" x2="64" y2="19" />
            <line x1="53" y1="25" x2="56" y2="44" />
            <line x1="64" y1="19" x2="56" y2="44" />
            <line x1="56" y1="44" x2="94" y2="60" />
            <line x1="94" y1="60" x2="90" y2="96" />
          </svg>
          <span className="network-dot" style={{ left: '59%', top: '7%' }} />
          <span className="network-dot" style={{ left: '56%', top: '44%' }} />
          <span className="network-dot small" style={{ left: '90%', top: '96%' }} />
          <span className="network-node pink" style={{ left: '53%', top: '25%' }}>
            <Icon name="dollar" size={22} />
          </span>
          <span className="network-node lilac" style={{ left: '64%', top: '19%' }}>
            <Icon name="user" size={22} />
          </span>
          <span className="network-node pink" style={{ left: '94%', top: '60%' }}>
            <Icon name="user" size={22} />
          </span>
        </div>

        <header className="welcome-topbar">
          <div className="welcome-brand">
            <span className="welcome-logo">W</span>
            <span>Westpac <strong>Cashflow IQ</strong></span>
          </div>
          <span className="welcome-badge">Interactive prototype</span>
        </header>

        <div className="welcome-hero-grid">
          <div className="welcome-copy">
            <h1 className="welcome-title">
              <span className="title-pink">Take control<br />of</span>
              <span className="title-row">
                <span className="title-outline" aria-hidden="true">IQ</span>
                <span className="title-white">Your<br />money</span>
              </span>
            </h1>

            <p className="welcome-lead">
              Every account, card and savings goal in one place, with an
              AI money companion watching your back.
            </p>

            <button className="welcome-cta" onClick={onGetStarted}>
              Get started
              <Icon name="arrow" />
            </button>

            <h2 className="welcome-section-title">All in one</h2>

            <nav className="welcome-pills" aria-label="Jump to a feature">
              {shortcuts.map((item, index) => (
                <button
                  key={item.id}
                  className={`welcome-pill ${index === 0 ? 'active' : ''}`}
                  onClick={() => go(item.id)}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </nav>

            <p className="welcome-note">
              Demo data and illustrative savings only. No live banking,
              merchant cancellation or rate approvals.
            </p>
          </div>

          {/* Phone mock-up preview of the app */}
          <div className="welcome-phone-wrap">
            <div className="welcome-phone">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-header">
                  <div className="phone-status">
                    <span>9:41</span>
                    <span className="phone-signal">●●● ◔</span>
                  </div>
                  <div className="phone-actions">
                    <span className="phone-chip">
                      <Icon name="headset" size={14} /> Contact us
                    </span>
                    <span className="phone-avatar"><Icon name="user" size={14} /></span>
                  </div>
                  <p className="phone-greeting">Good morning, Olivia</p>
                  <p className="phone-balance-label">Total savings</p>
                  <p className="phone-balance">$16,500.00</p>
                </div>

                <div className="phone-body">
                  <div className="phone-card">
                    <div className="phone-card-row">
                      <span>November budget</span>
                      <strong>$650 left</strong>
                    </div>
                    <div className="phone-bar"><span style={{ width: '86%' }} /></div>
                  </div>

                  <div className="phone-card">
                    <div className="phone-card-row">
                      <span>Japan holiday goal</span>
                      <strong>40%</strong>
                    </div>
                    <div className="phone-bar lilac"><span style={{ width: '40%' }} /></div>
                    <small>$4,000 saved of $10,000</small>
                  </div>

                  <div className="phone-insight">
                    <span className="phone-insight-icon"><Icon name="sparkles" size={16} /></span>
                    <p>
                      <strong>Cash Flow IQ</strong>
                      Netflix hasn't been used in 30 days. Pausing it saves $311/year.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="welcome-features" id="features">
        {features.map(feature => (
          <div className="welcome-feature" key={feature.title}>
            <span className="welcome-feature-icon"><Icon name={feature.icon} size={22} /></span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Welcome
