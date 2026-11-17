
import { useState } from 'react'
import '../styles/financialInsight.css'

const spendingCategories = [
  { name: 'Housing', amount: 1800, percentage: 43, color: '#D5002B', icon: '🏠' },
  { name: 'Food & dining', amount: 1050, percentage: 25, color: '#269B70', icon: '🍽️' },
  { name: 'Shopping', amount: 650, percentage: 16, color: '#E6B83F', icon: '🛍️' },
  { name: 'Transport', amount: 400, percentage: 10, color: '#986443', icon: '🚗' },
  { name: 'Other', amount: 250, percentage: 6, color: '#9299A0', icon: '📦' }
]

const transactions = [
  { name: 'Woolworths', category: 'Food & dining', date: '16 Nov 2026', amount: -85.40 },
  { name: 'Cafe Brisbane', category: 'Food & dining', date: '15 Nov 2026', amount: -24.50 },
  { name: 'Translink', category: 'Transport', date: '14 Nov 2026', amount: -12.80 },
  { name: 'Netflix', category: 'Other', date: '13 Nov 2026', amount: -25.99 },
  { name: 'Shopping Centre', category: 'Shopping', date: '12 Nov 2026', amount: -96.00 }
]

const upcomingPayments = [
  { name: 'Spotify', timing: 'Monday · Subscription', amount: 11.99 },
  { name: 'Rent', timing: 'Friday · Usual amount', amount: 380 },
  { name: 'Electricity', timing: 'Next Tuesday · Estimated', amount: 22 }
]

const subscriptions = [
  {
    name: 'Netflix',
    category: 'Video streaming',
    detail: 'Premium plan',
    amount: 25.99,
    icon: '🎬',
    billingCycle: 'Monthly',
    startDate: '12 Mar 2026',
    subscriptionTime: null,
    lastPaymentDate: '13 Nov 2026',
    lastPaymentTime: null,
    nextBillingDate: '12 Dec 2026',
    status: 'Active',
    warning: true
  },
  {
    name: 'Spotify',
    category: 'Music streaming',
    detail: 'Premium plan',
    amount: 13.99,
    icon: '🎵',
    billingCycle: 'Monthly',
    startDate: '5 Jan 2026',
    subscriptionTime: null,
    lastPaymentDate: null,
    lastPaymentTime: null,
    nextBillingDate: '5 Dec 2026',
    status: 'Active'
  },
  {
    name: 'Apple Music',
    category: 'Music streaming',
    detail: 'Individual plan',
    amount: 12.99,
    icon: '🎧',
    billingCycle: 'Monthly',
    startDate: '18 Aug 2026',
    subscriptionTime: null,
    lastPaymentDate: null,
    lastPaymentTime: null,
    nextBillingDate: '18 Dec 2026',
    status: 'Active'
  },
  {
    name: 'iCloud+',
    category: 'Cloud storage',
    detail: 'Cloud storage plan',
    amount: 2.99,
    icon: '☁️',
    billingCycle: 'Monthly',
    startDate: '20 Feb 2026',
    subscriptionTime: null,
    lastPaymentDate: null,
    lastPaymentTime: null,
    nextBillingDate: '20 Dec 2026',
    status: 'Active'
  }
]

function FinancialInsights({ onBack, onAssistant }) {
  const [monthlyReduction, setMonthlyReduction] = useState(100)

  const yearlySavings = monthlyReduction * 12

  const goalTarget = 10000
  const currentGoalSavings = 4000
  const remainingGoal = goalTarget - currentGoalSavings

  const regularMonthlySavings = 300
  const totalMonthlySavings = regularMonthlySavings + monthlyReduction

  const monthsWithoutExtra = Math.ceil(
    remainingGoal / regularMonthlySavings
  )

  const monthsWithExtra = Math.ceil(
    remainingGoal / totalMonthlySavings
  )

  const monthsSaved = monthsWithoutExtra - monthsWithExtra

  const subscriptionTotal = subscriptions.reduce(
    (total, subscription) => total + subscription.amount,
    0
  )

  const annualSubscriptionTotal = subscriptionTotal * 12

  // Group subscriptions by category
  const subscriptionGroups = Object.values(
    subscriptions.reduce((groups, subscription) => {
      if (!groups[subscription.category]) {
        groups[subscription.category] = []
      }

      groups[subscription.category].push(subscription)

      return groups
    }, {})
  )

  // Identify categories containing multiple subscriptions
  const overlappingSubscriptions = subscriptionGroups.filter(
    group => group.length > 1
  )

  // Calculate possible savings if the customer keeps only one
  const potentialSavings = overlappingSubscriptions.reduce(
    (total, group) => {
      const groupTotal = group.reduce(
        (sum, item) => sum + item.amount,
        0
      )

      const highestPrice = Math.max(
        ...group.map(item => item.amount)
      )

      const lowestPrice = Math.min(
        ...group.map(item => item.amount)
      )

      return {
        minimum: total.minimum + groupTotal - highestPrice,
        maximum: total.maximum + groupTotal - lowestPrice
      }
    },
    { minimum: 0, maximum: 0 }
  )

  return (
    <main className="insights-page smart-budgeting-page">

      {/* Page heading */}
      <div className="budgeting-header">
        <div>
          <p className="eyebrow">YOUR MONEY, MADE CLEARER</p>
          <h1>Smart Budgeting</h1>
          <p className="description">
            Understand your spending habits and find smarter ways
            to make your money go further.
          </p>
        </div>

        <div className="budgeting-month">
          <span>Viewing period</span>
          <strong>November 2026</strong>
        </div>
      </div>

      <div className="insights-notice">
        <span>ℹ</span>
        Demonstration account — all financial data shown is fictional.
      </div>

      <section className="money-outlook-section" aria-labelledby="money-outlook-title">
        <div className="budget-section-heading">
          <div>
            <p className="eyebrow">PLAN AHEAD</p>
            <h2 id="money-outlook-title">Money outlook</h2>
          </div>
        </div>

        <div className="money-outlook-card">
          <div className="safe-to-spend">
            <span>Safe to spend until your next pay</span>
            <strong>$1,946</strong>
            <p>
              After upcoming bills and a small buffer. Your balance is
              {' '}$12,840.50.
            </p>
          </div>

          <figure className="outlook-chart">
            <svg
              viewBox="0 0 640 190"
              preserveAspectRatio="none"
              role="img"
              aria-labelledby="outlook-chart-title outlook-chart-description"
            >
              <title id="outlook-chart-title">Illustrative balance forecast</title>
              <desc id="outlook-chart-description">
                The balance trends down after today, with expected bill payments
                for rent and power before the next pay.
              </desc>
              <line className="outlook-grid-line" x1="0" y1="30" x2="640" y2="30" />
              <line className="outlook-grid-line" x1="0" y1="95" x2="640" y2="95" />
              <line className="outlook-grid-line" x1="0" y1="160" x2="640" y2="160" />
              <path
                className="outlook-forecast-area"
                d="M270 65 L365 82 L380 119 L490 132 L530 149 L640 143 L640 174 L530 155 L490 148 L380 137 L365 105 Z"
              />
              <path
                className="outlook-actual-line"
                d="M0 54 L70 47 L132 67 L196 60 L270 70"
              />
              <path
                className="outlook-forecast-line"
                d="M270 70 L365 88 L380 123 L490 137 L530 151 L640 145"
              />
              <circle className="outlook-today-marker" cx="270" cy="70" r="11" />
              <circle className="outlook-bill-marker" cx="380" cy="123" r="9" />
              <circle className="outlook-bill-marker" cx="530" cy="151" r="9" />
              <text className="outlook-bill-label" x="380" y="106" textAnchor="middle">Rent</text>
              <text className="outlook-bill-label" x="530" y="134" textAnchor="middle">Power</text>
              <text className="outlook-today-label" x="270" y="184" textAnchor="middle">Today</text>
            </svg>
            <figcaption className="outlook-chart-legend">
              <span><i className="legend-line" />So far</span>
              <span><i className="legend-line legend-line-forecast" />Forecast</span>
              <span><i className="legend-bill-dot" />Bill</span>
            </figcaption>
          </figure>
        </div>

        <div className="upcoming-payments">
          <h3>Coming up</h3>
          <div className="upcoming-payments-card">
            {upcomingPayments.map(payment => (
              <div className="upcoming-payment" key={payment.name}>
                <div>
                  <strong>{payment.name}</strong>
                  <span>{payment.timing}</span>
                </div>
                <strong className="upcoming-payment-amount">
                  −${payment.amount.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
          <p className="outlook-disclaimer">
            Illustrative estimate only. Upcoming payments and forecasts use fictional sample data.
          </p>
        </div>
      </section>

      {/* Monthly spending overview */}
      <section className="budget-section">
        <div className="budget-section-heading">
          <div>
            <p className="eyebrow">NOVEMBER 2026</p>
            <h2>Your monthly spending</h2>
          </div>
        </div>

        <div className="monthly-budget-card">
          <div className="monthly-budget-header">
            <div>
              <h2>$4,150</h2>
              <span>of $4,800 monthly budget</span>
            </div>

            <div className="budget-left">
              <strong>$650</strong>
              <span>left to spend</span>
            </div>
          </div>

          <div className="spending-stacked-bar">
            {spendingCategories.map((category) => (
              <div
                key={category.name}
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color
                }}
                title={`${category.name}: $${category.amount}`}
              />
            ))}
          </div>

          <div className="budget-usage-labels">
            <span>86.5% of budget used</span>
            <span>13.5% remaining</span>
          </div>
        </div>

        <div className="budget-category-card">
          <div className="budget-section-heading">
            <div>
              <p className="eyebrow">SPENDING BREAKDOWN</p>
              <h2>Where your money goes</h2>
            </div>
          </div>

          <div className="budget-category-list">
            {spendingCategories.map((category) => (
              <div className="budget-category-item" key={category.name}>
                <div className="budget-category-top">
                  <div className="budget-category-name">
                    <span
                      className="category-colour-dot"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.icon}</span>
                    <strong>{category.name}</strong>
                  </div>

                  <div className="budget-category-amount">
                    <strong>
                      ${category.amount.toLocaleString('en-AU')}
                    </strong>
                    <span>{category.percentage}%</span>
                  </div>
                </div>

                <div className="budget-category-track">
                  <div
                    className="budget-category-fill"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI savings recommendation */}
      <section className="budget-ai-insight">
        <div className="budget-ai-heading">
          <span className="budget-ai-icon">✦</span>
          <div>
            <p className="eyebrow">YOUR PERSONAL FINANCIAL INSIGHT</p>
            <h2>Small changes, more freedom.</h2>
          </div>
        </div>

        <p>
          Food & dining is your biggest flexible spending category.
          Try spending $50 less each week on takeaway.
          That's $200 back towards your holiday every month.
        </p>

        <div className="budget-ai-results">
          <div>
            <span>Weekly spending reduction</span>
            <strong>$50</strong>
          </div>

          <div>
            <span>Potential monthly savings</span>
            <strong>$200</strong>
          </div>
        </div>

        <small>
          Why this suggestion? Food & dining accounts for 25% of
          your spending. This is an illustrative AI-generated suggestion.
        </small>
      </section>

      {/* AI Subscription Manager */}
      <section className="budget-section subscription-manager">

        <div className="budget-section-heading">
          <div>
            <p className="eyebrow">RECURRING PAYMENTS</p>
            <h2>Subscription Manager</h2>
            <p className="budget-section-description">
              Track recurring payments, identify overlapping services
              and discover opportunities to save.
            </p>
          </div>
        </div>

        {/* Subscription summary */}
        <div className="subscription-overview">

          <div className="subscription-overview-card">
            <span>Monthly subscriptions</span>
            <h3>${subscriptionTotal.toFixed(2)}</h3>
            <small>Estimated recurring cost</small>
          </div>

          <div className="subscription-overview-card">
            <span>Annual subscriptions</span>
            <h3>${annualSubscriptionTotal.toFixed(2)}</h3>
            <small>Estimated yearly cost</small>
          </div>

          <div className="subscription-overview-card">
            <span>Potential monthly savings</span>
            <h3>
              ${potentialSavings.minimum.toFixed(2)}
              {potentialSavings.maximum > potentialSavings.minimum
                ? `–$${potentialSavings.maximum.toFixed(2)}`
                : ''}
            </h3>
            <small>By reviewing overlapping services</small>
          </div>

        </div>

        {/* Overlap detection */}
        <div className="subscription-analysis">

          <div className="subscription-analysis-heading">
            <span className="subscription-analysis-icon">✦</span>
            <div>
              <p className="eyebrow">SUBSCRIPTION VALIDATION</p>
              <h3>Potential subscription overlaps</h3>
            </div>
          </div>

          {overlappingSubscriptions.length > 0 ? (
            overlappingSubscriptions.map((group) => {

              const categoryTotal = group.reduce(
                (sum, item) => sum + item.amount,
                0
              )

              const cheapest = Math.min(
                ...group.map(item => item.amount)
              )

              const mostExpensive = Math.max(
                ...group.map(item => item.amount)
              )

              const minimumSaving = categoryTotal - mostExpensive
              const maximumSaving = categoryTotal - cheapest

              return (
                <div
                  className="subscription-overlap-card"
                  key={group[0].category}
                >

                  <div className="overlap-top">
                    <div>
                      <span className="overlap-label">
                        POSSIBLE OVERLAP
                      </span>
                      <h4>{group[0].category}</h4>
                    </div>

                    <span className="overlap-count">
                      {group.length} services
                    </span>
                  </div>

                  <div className="overlap-services">

                    {group.map((subscription) => (
                      <div
                        className="overlap-service"
                        key={subscription.name}
                      >
                        <span className="subscription-icon">
                          {subscription.icon}
                        </span>

                        <div className="subscription-details">
                          <strong>{subscription.name}</strong>
                          <span>{subscription.detail}</span>
                        </div>

                        <strong>
                          ${subscription.amount.toFixed(2)}/mo
                        </strong>
                      </div>
                    ))}

                  </div>

                  <div className="overlap-recommendation">
                    <strong>✦ Suggested action</strong>

                    <p>
                      You have multiple subscriptions in the same
                      category. If you only need one service,
                      consider keeping your preferred option.
                    </p>

                    <div className="overlap-saving">
                      <span>Potential monthly savings</span>
                      <strong>
                        ${minimumSaving.toFixed(2)}
                        {maximumSaving > minimumSaving
                          ? ` – $${maximumSaving.toFixed(2)}`
                          : ''}
                      </strong>
                    </div>
                  </div>

                </div>
              )
            })
          ) : (
            <p className="no-overlap-message">
              No overlapping subscription categories detected.
            </p>
          )}

          <p className="subscription-disclaimer">
            Similar categories do not necessarily mean duplicate
            subscriptions. Review your usage and preferences before
            cancelling a service.
          </p>

        </div>

        {/* Individual subscription details */}
        <div className="subscription-list-heading">
          <div>
            <p className="eyebrow">PAYMENT HISTORY & DETAILS</p>
            <h3>All subscriptions</h3>
          </div>

          <span>{subscriptions.length} services</span>
        </div>

        <div className="subscription-list">

          {subscriptions.map((subscription) => (
            <div
              className="subscription-detail-card"
              key={subscription.name}
            >

              <div className="subscription-detail-header">

                <span className="subscription-icon">
                  {subscription.icon}
                </span>

                <div className="subscription-details">
                  <strong>{subscription.name}</strong>
                  <span>{subscription.category} · {subscription.detail}</span>
                </div>

                <div className="subscription-price">
                  <strong>
                    ${subscription.amount.toFixed(2)}
                  </strong>
                  <span>/month</span>
                </div>

              </div>

              <div className="subscription-metadata">

                <div>
                  <span>Subscription started</span>
                  <strong>{subscription.startDate}</strong>
                  <small>
                    {subscription.subscriptionTime || 'Time unavailable'}
                  </small>
                </div>

                <div>
                  <span>Last payment</span>
                  <strong>
                    {subscription.lastPaymentDate || 'Not available'}
                  </strong>
                  <small>
                    {subscription.lastPaymentTime || 'Time unavailable'}
                  </small>
                </div>

                <div>
                  <span>Next billing date</span>
                  <strong>{subscription.nextBillingDate}</strong>
                  <small>{subscription.billingCycle} billing</small>
                </div>

                <div>
                  <span>Subscription status</span>
                  <strong className="subscription-status">
                    {subscription.status}
                  </strong>
                  <small>Sample account record</small>
                </div>

              </div>

              {subscription.warning && (
                <div className="subscription-warning-box">
                  ⚠ This subscription has been flagged for review.
                </div>
              )}

            </div>
          ))}

        </div>

        <button
          className="subscription-ai-button"
          onClick={onAssistant}
        >
          ✦ Ask AI to review my subscriptions →
        </button>

      </section>

      {/* Savings planner */}
      <section className="savings-calculator">
        <p className="eyebrow">INTERACTIVE SAVINGS PLANNER</p>
        <h2>What if you saved a little more?</h2>

        <p className="calculator-description">
          Adjust your monthly spending reduction to see how much
          extra you could save towards your goals.
        </p>

        <div className="calculator-amount">
          <span>Your monthly savings target</span>
          <h2>${monthlyReduction}</h2>
        </div>

        <input
          className="savings-slider"
          type="range"
          min="0"
          max="300"
          step="10"
          value={monthlyReduction}
          onChange={(event) =>
            setMonthlyReduction(Number(event.target.value))
          }
        />

        <div className="slider-labels">
          <span>$0</span>
          <span>$300</span>
        </div>

        <div className="calculator-results">
          <div>
            <span>Extra savings per month</span>
            <h3>${monthlyReduction.toLocaleString('en-AU')}</h3>
          </div>
          <div>
            <span>Potential savings per year</span>
            <h3>${yearlySavings.toLocaleString('en-AU')}</h3>
          </div>
        </div>

        <div className="calculator-message">
          ✦ {monthlyReduction === 0
            ? 'Choose a monthly savings target to explore your potential.'
            : `Saving $${monthlyReduction} monthly could add $${yearlySavings.toLocaleString('en-AU')} to your savings in one year!`}
        </div>

        <div className="goal-impact">
          <p className="eyebrow">YOUR JAPAN HOLIDAY GOAL</p>

          <div className="goal-impact-header">
            <div>
              <h3>${currentGoalSavings.toLocaleString('en-AU')}</h3>
              <span>Saved so far</span>
            </div>
            <div className="goal-target">
              <h3>${goalTarget.toLocaleString('en-AU')}</h3>
              <span>Target amount</span>
            </div>
          </div>

          <div className="goal-progress-track">
            <div
              className="goal-progress-fill"
              style={{
                width: `${(currentGoalSavings / goalTarget) * 100}%`
              }}
            ></div>
          </div>

          <p className="goal-progress-label">
            40% completed · ${remainingGoal.toLocaleString('en-AU')} remaining
          </p>

          <div className="goal-timeline">
            <div>
              <span>Without extra savings</span>
              <h3>{monthsWithoutExtra} months</h3>
            </div>
            <div>
              <span>With your new target</span>
              <h3>{monthsWithExtra} months</h3>
            </div>
          </div>

          <div className="goal-result">
            ✦ {monthlyReduction === 0
              ? 'Set an extra monthly savings target to see how you could reach your goal sooner.'
              : `You could reach your Japan holiday goal approximately ${monthsSaved} months sooner!`}
          </div>

          <p className="calculator-disclaimer">
            Estimate based on an assumed regular $300 monthly contribution,
            plus your selected extra savings. Actual results may vary.
          </p>
        </div>

        <p className="calculator-disclaimer">
          This is an illustrative calculation, not a guaranteed saving
          or financial recommendation.
        </p>
      </section>

      {/* Transactions */}
      <section className="budget-section">
        <div className="budget-section-heading">
          <div>
            <p className="eyebrow">RECENT ACTIVITY</p>
            <h2>Your recent transactions</h2>
          </div>
        </div>

        <div className="transaction-list">
          {transactions.map((transaction, index) => (
            <div className="transaction-item" key={index}>
              <div className="transaction-icon">
                {spendingCategories.find(
                  (item) => item.name === transaction.category
                )?.icon || '💳'}
              </div>

              <div className="transaction-details">
                <strong>{transaction.name}</strong>
                <span>{transaction.category} · {transaction.date}</span>
              </div>

              <strong className="transaction-amount">
                -${Math.abs(transaction.amount).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <p className="demo-disclaimer">
        Cashflow IQ concept demonstration. Sample data and recommendations
        are illustrative, not actual banking records or financial advice.
      </p>

    </main>
  )
}

export default FinancialInsights
