import '../styles/welcome.css'

function Welcome({ onGetStarted }) {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">W</span>
          <span>Westpac <strong>Cashflow IQ</strong></span>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR PERSONAL AI BANKING EXPERIENCE
          </span>

          <h1>
            Your money.<br />
            Your goals.<br />
            <span>Your future.</span>
          </h1>

          <p className="description">
            Meet your personal AI banking assistant.
            Get smarter insights, personalised financial
            guidance and banking that understands you.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={onGetStarted}
            >
              Get Started →
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                document.getElementById('features')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }
            >
              Explore Features
            </button>
          </div>

          <div className="trust-message">
            <span>✓</span>
            Your financial journey, personalised around you.
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="card-header">
              <span>YOUR FINANCIAL OVERVIEW</span>
              <span className="status-dot">●</span>
            </div>

            <p className="balance-label">Total savings</p>
            <h2>$16,500.00</h2>

            <div className="savings-progress">
              <div className="progress-info">
                <span>Holiday goal</span>
                <strong>40%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>

              <p>$4,000 saved of $10,000</p>
            </div>

            <div className="insight-card">
              <span className="insight-icon">✦</span>
              <div>
                <strong>Your AI insight</strong>
                <p>
                  You're making progress towards
                  your financial goals!
                </p>
              </div>
            </div>
          </div>

          <div className="floating-tag">
            ✦ Smarter banking starts here
          </div>
        </div>
      </main>

      <section className="features" id="features">
        <div className="feature">
          <span>◈</span>
          <h3>Smarter Money Management</h3>
          <p>
            Understand your spending and discover ways to save.
          </p>
        </div>

        <div className="feature">
          <span>◎</span>
          <h3>Personalised Financial Journey</h3>
          <p>
            Get insights tailored to your goals and lifestyle.
          </p>
        </div>

        <div className="feature">
          <span>◇</span>
          <h3>Banking with Confidence</h3>
          <p>
            Stay informed with intelligent fraud protection.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Welcome
