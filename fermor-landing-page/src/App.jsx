import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import logo from '../image.png'
import './App.css'

const TrendChart = lazy(() => import('./DashboardCharts.jsx').then((module) => ({ default: module.TrendChart })))
const SpendingDonut = lazy(() => import('./DashboardCharts.jsx').then((module) => ({ default: module.SpendingDonut })))
const CashflowChart = lazy(() => import('./DashboardCharts.jsx').then((module) => ({ default: module.CashflowChart })))

const calculators = [
  { slug: 'emi', icon: '⌂', title: 'EMI calculator', description: 'Know your monthly payment and total loan cost.' },
  { slug: 'sip', icon: '↗', title: 'SIP calculator', description: 'Explore how regular investing may grow over time.' },
  { slug: 'fd', icon: '▣', title: 'FD calculator', description: 'Estimate fixed-deposit interest and maturity.' },
  { slug: 'income-tax', icon: '₹', title: 'Income tax calculator', description: 'Get an estimate of your income tax liability.' },
  { slug: 'salary', icon: '◉', title: 'Salary calculator', description: 'Understand your estimated monthly take-home.' },
  { slug: 'investment', icon: '⌁', title: 'Investment calculator', description: 'Model a one-time investment over time.' },
  { slug: 'retirement', icon: '◷', title: 'Retirement calculator', description: 'Start planning for your long-term goals.' },
  { slug: 'loan', icon: '▤', title: 'Loan calculator', description: 'Compare repayments, interest and tenure.' },
]

const articles = [
  { slug: 'how-emi-works', category: 'Loans', title: 'How does an EMI actually work?', description: 'Understand principal, interest and what your monthly payment really covers.', time: '6 min read' },
  { slug: 'sip-vs-fd', category: 'Investing', title: 'SIP vs FD: understanding the difference', description: 'A plain-language look at two very different ways to put money aside.', time: '7 min read' },
  { slug: 'take-home-salary', category: 'Salary', title: 'How to calculate your take-home salary', description: 'Learn how deductions can affect the amount that reaches your account.', time: '5 min read' },
  { slug: 'emergency-fund', category: 'Saving', title: 'How much should you keep in an emergency fund?', description: 'A practical starting point for planning a financial safety net.', time: '5 min read' },
  { slug: 'compound-interest', category: 'Personal Finance', title: 'Understanding compound interest', description: 'See how time and reinvested returns work together in an illustration.', time: '4 min read' },
  { slug: 'income-tax-india', category: 'Tax', title: 'Income tax in India: a simple introduction', description: 'Get familiar with the terms before estimating your own tax.', time: '8 min read' },
]

const testimonials = [
  { quote: 'I finally understood how much interest I would actually pay on my loan.', author: 'Demo user', city: 'Bengaluru', category: 'Calculators' },
  { quote: 'The salary estimate made all those deductions much easier to follow.', author: 'Demo user', city: 'Pune', category: 'Salary planning' },
  { quote: 'I could compare a few savings scenarios without feeling overwhelmed.', author: 'Demo user', city: 'Hyderabad', category: 'Money management' },
  { quote: 'The explanations helped me ask better questions about investing.', author: 'Demo user', city: 'Mumbai', category: 'Investing' },
]

function getAssistantReply(question) {
  const text = question.toLowerCase()
  if (text.includes('sip') || text.includes('50 lakh') || text.includes('invest every month')) {
    return 'To explore a ₹50 lakh goal, try the SIP calculator with your monthly contribution and time horizon. Its result is an illustration based on an assumed return rate—not a prediction or guarantee.'
  }
  if (text.includes('emi') || text.includes('car') || text.includes('loan') || text.includes('afford')) {
    return 'An EMI depends on the loan amount, annual interest rate and tenure. Try the EMI calculator to compare scenarios, then consider the payment alongside your other monthly expenses.'
  }
  if (text.includes('compound') || text.includes('interest')) {
    return 'Compound interest means returns can earn returns over time. The result depends on the rate, how often returns are added, and how long money stays invested. The SIP or FD calculator can illustrate different assumptions.'
  }
  if (text.includes('budget') || text.includes('spend') || text.includes('expense')) {
    return 'A simple first step is to compare take-home income with essential expenses, flexible spending and savings. The dashboard here uses sample data only; it is not connected to your accounts.'
  }
  if (text.includes('tax')) {
    return 'Tax depends on the applicable year, regime, deductions and your individual circumstances. The Fermor tax tool offers a simplified illustration; verify current rules with an official source or a tax professional.'
  }
  if (text.includes('salary') || text.includes('take-home') || text.includes('take home')) {
    return 'Take-home pay can differ from gross salary because of tax, provident fund and other payroll deductions. The salary calculator gives a simplified estimate; check your employer’s actual payslip for precise amounts.'
  }
  if (text.includes('calculator') || text.includes('tool')) {
    return 'Fermor has calculators for EMIs and loans, SIPs, fixed deposits, tax, salary, investments and retirement. Choose the one that matches the decision you want to explore.'
  }
  return 'I can explain common money concepts or help you find a Fermor calculator. Share a topic such as EMIs, budgeting, compound interest, salary or tax. This educational demo is not personalized financial advice.'
}

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number.isFinite(value) ? value : 0)

function estimateNewRegimeTax(income) {
  const taxableIncome = Math.max(0, income - 750000)
  if (taxableIncome <= 1200000) return 0
  const slabs = [
    [400000, 0],
    [400000, 0.05],
    [400000, 0.1],
    [400000, 0.15],
    [400000, 0.2],
    [400000, 0.25],
    [Infinity, 0.3],
  ]
  let remaining = taxableIncome
  let tax = 0
  for (const [width, rate] of slabs) {
    const taxable = Math.min(remaining, width)
    tax += taxable * rate
    remaining -= taxable
    if (remaining <= 0) break
  }
  return tax * 1.04
}

function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function Link({ to, children, className = '', onClick, ...props }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        onClick?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        navigate(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}

function ButtonLink({ to, children, className = '', onClick }) {
  return <Link to={to} className={`button ${className}`} onClick={onClick}>{children}</Link>
}

function Navbar({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  return (
    <header className={`site-header ${compact ? 'is-compact' : ''}`}>
      <nav className="nav-wrap container" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="Fermor home">
          <img src={logo} alt="" />
          <span>fermor</span>
        </Link>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/calculators" onClick={closeMenu}>Calculators</Link>
          <Link to="/money-management" onClick={closeMenu}>Money management</Link>
          <Link to="/insights" onClick={closeMenu}>Insights</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <div className="mobile-nav-actions">
            <button className="text-button" onClick={() => { closeMenu(); onLogin() }}>Log in</button>
            <ButtonLink to="/calculators" className="button-small">Get started</ButtonLink>
          </div>
        </div>
        <div className="nav-actions">
          <button className="text-button" onClick={onLogin}>Log in</button>
          <ButtonLink to="/calculators" className="button-small">Get started</ButtonLink>
        </div>
      </nav>
    </header>
  )
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading ${centered ? 'centered' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}

function Sparkline({ color = '#31956a', wide = false }) {
  return (
    <svg className={`sparkline ${wide ? 'sparkline-wide' : ''}`} viewBox="0 0 240 74" role="img" aria-label="Illustrative upward trend">
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".19" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 60 C18 57 24 42 42 47 S65 56 82 39 S112 43 127 31 S152 39 171 25 S201 31 217 12 S231 15 240 4 L240 74 L0 74 Z" fill={`url(#spark-fill-${color.replace('#', '')})`} />
      <path d="M0 60 C18 57 24 42 42 47 S65 56 82 39 S112 43 127 31 S152 39 171 25 S201 31 217 12 S231 15 240 4" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function DashboardPreview({ period, setPeriod }) {
  const periods = ['Monthly', '6 months', '1 year']
  const chartData = period === 'Monthly'
    ? [{ month: 'Jul', balance: 38, savings: 24 }, { month: 'Aug', balance: 49, savings: 30 }, { month: 'Sep', balance: 43, savings: 32 }, { month: 'Oct', balance: 61, savings: 38 }, { month: 'Nov', balance: 55, savings: 40 }, { month: 'Dec', balance: 84, savings: 53 }]
    : period === '6 months'
      ? [{ month: 'Jan', balance: 35, savings: 20 }, { month: 'Feb', balance: 42, savings: 25 }, { month: 'Mar', balance: 50, savings: 29 }, { month: 'Apr', balance: 47, savings: 33 }, { month: 'May', balance: 67, savings: 43 }, { month: 'Jun', balance: 88, savings: 57 }]
      : [{ month: 'Jan', balance: 28, savings: 18 }, { month: 'Mar', balance: 40, savings: 26 }, { month: 'May', balance: 54, savings: 31 }, { month: 'Jul', balance: 66, savings: 42 }, { month: 'Sep', balance: 78, savings: 49 }, { month: 'Dec', balance: 91, savings: 62 }]
  const cashflowData = [{ month: 'Jul', income: 78, expenses: 46 }, { month: 'Aug', income: 82, expenses: 51 }, { month: 'Sep', income: 80, expenses: 44 }, { month: 'Oct', income: 86, expenses: 53 }, { month: 'Nov', income: 83, expenses: 48 }, { month: 'Dec', income: 90, expenses: 51 }]
  const spendingData = [{ name: 'Home', value: 35, color: '#e87948' }, { name: 'Food', value: 24, color: '#65a876' }, { name: 'Travel', value: 18, color: '#e4c46d' }, { name: 'Other', value: 23, color: '#dfe4d9' }]
  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div>
          <span className="dashboard-greeting">YOUR SAMPLE DASHBOARD</span>
          <h3>Your money overview <span className="demo-badge">DEMO</span></h3>
        </div>
        <div className="period-switch" aria-label="Dashboard time period">
          {periods.map((item) => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}
        </div>
      </div>
      <div className="metric-grid">
        <div className="metric-card net-worth"><span>Net worth</span><strong>₹12,48,500</strong><small className="positive">↗ 8.4% <em>this period</em></small></div>
        <div className="metric-card"><span>Income</span><strong>₹85,000</strong><small>Monthly</small></div>
        <div className="metric-card"><span>Expenses</span><strong>₹42,300</strong><small>Monthly</small></div>
        <div className="metric-card"><span>Savings</span><strong>₹22,700</strong><small className="positive">26.7% of income</small></div>
        <div className="metric-card"><span>Investments</span><strong>₹20,000</strong><small className="positive">Monthly SIP</small></div>
        <div className="metric-card health-metric"><span>Financial health</span><strong>78 <small>/ 100</small></strong><small className="positive">Sample score</small></div>
      </div>
      <div className="dashboard-lower">
        <div className="chart-card growth-chart">
          <div className="chart-title"><div><span>OVERVIEW</span><strong>Savings & investments</strong></div><div className="chart-legends"><span className="chart-legend"><i /> Investments</span><span className="chart-legend savings-legend"><i /> Savings</span></div></div>
          <div className="chart-area" role="img" aria-label={`${period} sample savings and investment chart`}>
            <Suspense fallback={<div className="chart-loading">Preparing sample chart…</div>}><TrendChart data={chartData} /></Suspense>
          </div>
        </div>
        <div className="chart-card allocation">
          <div className="chart-title"><div><span>SPENDING</span><strong>Monthly breakdown</strong></div><button className="dots-button" aria-label="More chart options">···</button></div>
          <div className="donut-row">
            <div className="donut" role="img" aria-label="Sample monthly spending category chart"><Suspense fallback={<div className="chart-loading">…</div>}><SpendingDonut data={spendingData} /></Suspense><div className="donut-label"><strong>₹42.3k</strong><span>Total</span></div></div>
            <ul className="legend-list">
              {spendingData.map((entry) => <li key={entry.name}><i style={{ background: entry.color }} />{entry.name}<b>{entry.value}%</b></li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="dashboard-extra">
        <div className="chart-card cashflow-card">
          <div className="chart-title"><div><span>CASH FLOW</span><strong>Income vs expenses</strong></div><div className="chart-legends"><span className="chart-legend income-legend"><i /> Income</span><span className="chart-legend expense-legend"><i /> Expenses</span></div></div>
          <div className="cashflow-chart" role="img" aria-label="Sample income versus expenses chart">
            <Suspense fallback={<div className="chart-loading">Preparing sample chart…</div>}><CashflowChart data={cashflowData} /></Suspense>
          </div>
        </div>
        <div className="savings-summary"><span className="savings-summary-icon">↗</span><span className="dashboard-greeting">SAVINGS TREND</span><strong>26.7%</strong><p>Sample monthly savings rate</p><Sparkline color="#65a876" wide /></div>
      </div>
      <div className="goals-row">
        <div className="goal-item"><span className="goal-icon">⌂</span><div><strong>Emergency fund</strong><small>₹1.2L of ₹2L</small></div><div className="progress-track"><i style={{ width: '60%' }} /></div><b>60%</b></div>
        <div className="goal-item"><span className="goal-icon goal-green">✈</span><div><strong>Holiday fund</strong><small>₹42k of ₹80k</small></div><div className="progress-track green-track"><i style={{ width: '52%' }} /></div><b>52%</b></div>
      </div>
      <p className="sample-note">Sample figures for illustration only. No personal financial data is connected.</p>
    </div>
  )
}

function MoneyIllustrations() {
  return (
    <div className="money-illustrations" aria-hidden="true">
      <div className="money-note">
        <svg viewBox="0 0 128 78" role="presentation">
          <rect x="3" y="3" width="122" height="72" rx="13" fill="#e5f0d5" stroke="#8db45f" strokeWidth="2" />
          <rect x="10" y="10" width="108" height="58" rx="9" fill="none" stroke="#a6c27d" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="64" cy="39" r="22" fill="#f6faef" stroke="#a6c27d" strokeWidth="2" />
          <text x="64" y="47" textAnchor="middle" fill="#4d7939" fontFamily="sans-serif" fontSize="27" fontWeight="700">₹</text>
          <text x="19" y="27" fill="#658b4d" fontFamily="sans-serif" fontSize="9" fontWeight="700">FERMOR</text>
          <path d="M19 55h15M94 55h15" stroke="#8db45f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="money-coin coin-one"><span>₹</span></div>
      <div className="money-coin coin-two"><span>₹</span></div>
      <div className="money-stack"><i /><i /><i /><span>₹</span></div>
      <div className="money-spark spark-one">✦</div>
      <div className="money-spark spark-two">✦</div>
    </div>
  )
}

function MoneyAccents({ variant = 'orange' }) {
  return (
    <div className={`money-accent-pair money-accent-${variant}`} aria-hidden="true">
      <span className="accent-bill"><i>₹</i></span>
      <span className="accent-coin">₹</span>
    </div>
  )
}

function CalculatorCard({ item }) {
  return (
    <Link to={`/calculators/${item.slug}`} className="calculator-card">
      <span className="calculator-icon">{item.icon}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="card-link">Calculate <span aria-hidden="true">↗</span></span>
    </Link>
  )
}

function CalculatorGrid({ compact = false }) {
  return (
    <div className={`calculator-grid ${compact ? 'compact-grid' : ''}`}>
      {(compact ? calculators.slice(0, 4) : calculators).map((item) => <CalculatorCard key={item.slug} item={item} />)}
    </div>
  )
}

function PrivacySection() {
  return (
    <section className="privacy-section section-pad money-scene scene-privacy">
      <div className="container privacy-layout">
        <div>
          <p className="eyebrow">Private by design</p>
          <h2>Your numbers stay in your browser.</h2>
          <p className="section-description">Fermor's calculator math runs on your device. The numbers you enter are not sent to our servers simply to calculate your result.</p>
          <ul className="check-list">
            <li>Browser-based calculations</li>
            <li>No account required to calculate</li>
            <li>Save calculations only if you choose</li>
            <li>Clear, transparent explanations</li>
          </ul>
          <Link to="/about" className="text-link">Learn about our privacy approach <span>→</span></Link>
        </div>
        <div className="privacy-visual" aria-label="Your device calculates your results privately">
          <div className="privacy-step"><span>01</span><b>Your numbers</b><small>Stay on your device</small></div>
          <span className="privacy-arrow">→</span>
          <div className="privacy-calc"><span className="privacy-lock">✓</span><b>Fermor calculator</b><small>Runs in your browser</small></div>
          <span className="privacy-arrow">→</span>
          <div className="privacy-step result-step"><span>02</span><b>Clear result</b><small>Only you see it</small></div>
          <div className="no-server"><span>×</span> No calculation data sent to a server</div>
        </div>
      </div>
      <MoneyAccents variant="green" />
    </section>
  )
}

function EverydayDecisions() {
  const decisions = [
    ['⌂', 'Buying a home', 'Understand your EMI and total interest.'],
    ['◇', 'Buying a car', 'See what could fit your monthly budget.'],
    ['↗', 'Starting an SIP', 'Explore potential long-term growth.'],
    ['▣', 'Choosing an FD', 'Compare interest and maturity values.'],
    ['◉', 'Understanding salary', 'Estimate your take-home pay.'],
    ['₹', 'Planning taxes', 'Explore how tax may affect your income.'],
  ]
  return <div className="decision-grid">{decisions.map(([icon, title, desc]) => <article className="decision-card" key={title}><span>{icon}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
}

function HowItWorks() {
  const steps = [
    ['01', 'Enter your numbers', 'Add only the details that matter to your decision.'],
    ['02', 'Fermor does the math', 'The calculation happens directly in your browser.'],
    ['03', 'Understand the result', 'Explore clear numbers, charts and explanations.'],
    ['04', 'Make a decision', 'Use the information to consider your next step.'],
  ]
  return (
    <section className="how-section section-pad" id="how-it-works">
      <div className="container">
        <SectionHeading eyebrow="A clearer way to decide" title="From numbers to a next step." description="No jargon, no pressure. Just a simple way to understand the math." centered />
        <div className="steps-flow">{steps.map(([number, title, desc]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
        <p className="flow-line">Your numbers <span>→</span> Fermor <span>→</span> Clear insight <span>→</span> Better-informed decision</p>
      </div>
    </section>
  )
}

function WhyFermor() {
  const items = [
    ['✓', 'Accurate', 'Built around transparent, standard financial formulas.'],
    ['₹', 'Free', 'Core calculators are free to use.'],
    ['⌑', 'Private', 'Your inputs stay in your browser during calculation.'],
    ['✳', 'Simple', 'Complex financial concepts in plain language.'],
  ]
  return <div className="why-grid">{items.map(([icon, title, desc]) => <article className="why-card" key={title}><span>{icon}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
}

function FAQ() {
  const questions = [
    ['Are Fermor calculators free?', 'Yes. Fermor’s core calculators are designed to be free to use.'],
    ['Do I need an account?', 'No. An account is optional and only needed if you want to save calculations.'],
    ['Is my calculator data sent to Fermor?', 'Calculator calculations run in your browser. The numbers you enter are not sent to Fermor’s servers simply to calculate the result.'],
    ['How does Fermor make money?', 'Fermor is supported through advertising and affiliate partnerships. Any partnerships should be clearly identified.'],
    ['Are the calculations financial advice?', 'No. Fermor provides calculations and educational information, not personalized financial, investment, tax or legal advice.'],
  ]
  return <div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
}

function BlogCard({ article, index }) {
  return (
    <Link to={`/blog/${article.slug}`} className="blog-card">
      <div className={`blog-art blog-art-${index % 3}`} aria-hidden="true"><span>{['₹', '↗', '◷'][index % 3]}</span></div>
      <div className="blog-content"><span className="tag">{article.category}</span><h3>{article.title}</h3><p>{article.description}</p><span className="blog-meta">{article.time} <b>Read article →</b></span></div>
    </Link>
  )
}

function ChatPreview() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    { from: 'user', text: 'Can I afford a ₹15 lakh car on a ₹90,000 monthly salary?' },
    { from: 'assistant', text: 'We can explore an example together. Your EMI depends on the down payment, interest rate and loan term. Try the EMI calculator to compare monthly payments with your other expenses.' },
  ])
  const suggestions = ['Explain compound interest', 'Which calculator should I use?']
  const respond = (text) => {
    if (!text.trim()) return
    setMessages((current) => [...current, { from: 'user', text }, { from: 'assistant', text: getAssistantReply(text) }])
    setQuestion('')
  }
  return (
    <div className="chat-card">
      <div className="chat-header"><span className="assistant-avatar">f</span><div><strong>Fermor guide</strong><small>Educational demo · Not financial advice</small></div><span className="online-dot" /></div>
      <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}>{message.text}</div>)}</div>
      <div className="chat-suggestions">{suggestions.map((item) => <button key={item} onClick={() => respond(item)}>{item}</button>)}</div>
      <form className="chat-input" onSubmit={(event) => { event.preventDefault(); respond(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a money question..." aria-label="Ask an educational money question" /><button aria-label="Send message">↑</button></form>
    </div>
  )
}

function HomePage({ period, setPeriod }) {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="hero-kicker"><i /> Personal finance, made clearer</span>
            <h1><span className="green-text">Make better money decisions.</span><br /><span className="orange-text">Every day.</span></h1>
            <p>Understand your spending, savings, investments and financial goals with simple financial tools built for India.</p>
            <div className="hero-actions"><ButtonLink to="/calculators" className="button-primary">Explore Calculators <span>→</span></ButtonLink><a className="button button-outline-green" href="#how-it-works">See How Fermor Works</a></div>
            <div className="hero-proof"><span className="avatar-stack"><i>₹</i><i>↗</i><i>✓</i></span><span><b>Free tools.</b> No account needed to calculate.</span></div>
          </div>
          <div className="hero-visual">
            <MoneyIllustrations />
            <DashboardPreview period={period} setPeriod={setPeriod} />
          </div>
        </div>
      </section>
      <section className="support-strip"><div className="container support-inner"><h2>Your money is more than numbers.</h2><p>Fermor turns complicated financial calculations into simple insights you can use in everyday life.</p><div className="support-steps"><span>Understand</span><i>→</i><span>Plan</span><i>→</i><span>Act</span><i>→</i><span>Grow</span></div></div></section>
      <section className="section-pad container money-scene scene-calculators" id="calculators">
        <SectionHeading eyebrow="Free tools for real decisions" title="The math behind your money, made simple." description="Explore free calculators for the financial decisions you make every day." />
        <CalculatorGrid compact />
        <ButtonLink to="/calculators" className="button-light section-button">Explore all calculators <span>→</span></ButtonLink>
        <MoneyAccents />
      </section>
      <PrivacySection />
      <section className="section-pad container money-scene scene-decisions">
        <SectionHeading eyebrow="Everyday money decisions" title="From your next EMI to your long-term goals." description="Fermor helps turn financial decisions into numbers you can understand." />
        <EverydayDecisions />
        <MoneyAccents variant="green" />
      </section>
      <HowItWorks />
      <section className="section-pad container money-scene scene-why">
        <SectionHeading eyebrow="Why Fermor" title="Finance should be easier to understand." description="Practical tools, transparent assumptions and a little more clarity." />
        <WhyFermor />
        <MoneyAccents />
      </section>
      <section className="insights-section section-pad money-scene scene-insights">
        <div className="container">
          <div className="split-heading"><SectionHeading eyebrow="Learn at your pace" title="Money, explained simply." description="A growing library of straightforward guides to everyday personal finance." /><Link to="/insights" className="text-link">All insights <span>→</span></Link></div>
          <div className="blog-grid">{articles.slice(0, 3).map((article, index) => <BlogCard key={article.title} article={article} index={index} />)}</div>
        </div>
        <MoneyAccents variant="green" />
      </section>
      <section className="section-pad container money-scene scene-assistant">
        <SectionHeading eyebrow="A little more clarity" title="Your financial questions, explained simply." description="Explore a sample of Fermor's educational assistant. Responses are illustrative, not personalized advice." />
        <div className="assistant-layout"><div className="assistant-copy"><div className="assistant-feature"><span>01</span><div><b>Understand concepts</b><p>Get plain-language explanations for common money topics.</p></div></div><div className="assistant-feature"><span>02</span><div><b>Find the right tool</b><p>Discover which calculator can help you explore a decision.</p></div></div><p className="disclaimer">Fermor provides educational information and calculations. It does not constitute personalized financial, investment, tax or legal advice.</p></div><ChatPreview /></div>
        <MoneyAccents />
      </section>
      <section className="coming-section section-pad money-scene scene-investments"><div className="container coming-layout"><div><span className="tag">Coming soon</span><h2>Know where your money is going.</h2><p className="section-description">We're exploring ways to help you organize and understand investment decisions. Fermor does not currently manage investments or execute trades.</p><Link className="text-link" to="/money-management">Explore the sample dashboard <span>→</span></Link></div><div className="portfolio-card"><div className="portfolio-card-head"><span>INVESTMENT OVERVIEW</span><span className="demo-badge">SAMPLE</span></div><div className="portfolio-value"><span>Total invested</span><strong>₹8,20,000</strong></div><div className="portfolio-value"><span>Illustrative current value</span><strong>₹10,45,000</strong></div><div className="portfolio-growth"><b>+27.4%</b><span>Illustrative growth · not a return promise</span></div><Sparkline wide /></div></div><MoneyAccents variant="green" /></section>
      <section className="section-pad container money-scene scene-faq"><div className="split-heading"><SectionHeading eyebrow="Good to know" title="Questions, answered." /><Link to="/about" className="text-link">About Fermor <span>→</span></Link></div><FAQ /><MoneyAccents /></section>
      <FinalCta />
    </>
  )
}

function CalculatorTool({ slug }) {
  const item = calculators.find((calculator) => calculator.slug === slug) || calculators[0]
  const [principal, setPrincipal] = useState(slug === 'fd' ? 200000 : 1500000)
  const [rate, setRate] = useState(slug === 'fd' || slug === 'sip' || slug === 'investment' ? 7 : 8.5)
  const [years, setYears] = useState(20)
  const [monthly, setMonthly] = useState(10000)
  const result = useMemo(() => {
    const r = Math.max(rate, 0) / 100
    const months = Math.max(years, 1) * 12
    const monthlyRate = r / 12
    if (slug === 'sip' || slug === 'retirement') {
      const totalInvested = monthly * months
      const maturity = monthlyRate ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate) : totalInvested
      return { label: 'Estimated value', amount: maturity, detail: `Total contribution: ${money(totalInvested)}`, note: 'Illustration only; actual returns vary and are not guaranteed.' }
    }
    if (slug === 'fd') {
      const maturity = principal * Math.pow(1 + r / 4, 4 * years)
      return { label: 'Estimated maturity value', amount: maturity, detail: `Estimated interest: ${money(maturity - principal)}`, note: 'Illustrative quarterly compounding. Actual bank terms and tax may differ.' }
    }
    if (slug === 'salary') {
      const annualTax = estimateNewRegimeTax(principal)
      const estimatedMonthlyPf = principal * 0.5 * 0.12 / 12
      const estimate = Math.max(0, (principal - annualTax) / 12 - estimatedMonthlyPf)
      return { label: 'Illustrative monthly take-home', amount: estimate, detail: `After estimated tax of ${money(annualTax)} per year and assumed PF of ${money(estimatedMonthlyPf)} per month.`, note: 'Simplified example using assumed PF and new-regime slab inputs; exemptions, deductions and payroll rules vary. Verify current rules.' }
    }
    if (slug === 'income-tax') {
      const tax = estimateNewRegimeTax(principal)
      return { label: 'Illustrative annual tax estimate', amount: tax, detail: `Gross annual income entered: ${money(principal)} · includes 4% cess estimate`, note: 'Simplified new-regime slab illustration with a standard-deduction assumption. Tax rules and eligibility change; verify with an official source or tax professional.' }
    }
    if (slug === 'investment') {
      const value = principal * Math.pow(1 + r, years)
      return { label: 'Illustrative future value', amount: value, detail: `Potential growth: ${money(value - principal)} on ${money(principal)} invested`, note: 'Assumes a steady annual rate for illustration only. Investment values can fall as well as rise.' }
    }
    const payment = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : principal / months
    return { label: 'Estimated monthly payment', amount: payment, detail: `Total repayment: ${money(payment * months)} · Interest: ${money(payment * months - principal)}`, note: 'Estimate excludes fees and other lender charges. Confirm terms with your lender.' }
  }, [principal, rate, years, monthly, slug])

  return (
    <main className="tool-page container">
      <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/calculators">Calculators</Link><span>/</span><b>{item.title}</b></div>
      <div className="tool-heading"><p className="eyebrow">Free browser-based tool</p><h1>{item.title}</h1><p>{item.description} Adjust the example values to explore an estimate.</p></div>
      <div className="calculator-tool-layout">
        <form className="calculator-form" onSubmit={(event) => event.preventDefault()}>
          <label>{slug === 'fd' ? 'Deposit amount' : slug === 'salary' || slug === 'income-tax' ? 'Annual income' : slug === 'sip' || slug === 'retirement' ? 'Monthly contribution' : 'Loan amount'}
            <span className="input-with-prefix"><i>₹</i><input type="number" min="0" value={slug === 'sip' || slug === 'retirement' ? monthly : principal} onChange={(event) => slug === 'sip' || slug === 'retirement' ? setMonthly(Number(event.target.value)) : setPrincipal(Number(event.target.value))} /></span>
          </label>
          {!['salary', 'income-tax'].includes(slug) && <label>Estimated annual rate (%)<input type="number" min="0" max="100" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>}
          {!['salary', 'income-tax'].includes(slug) && <label>{slug === 'fd' || slug === 'investment' || slug === 'sip' || slug === 'retirement' ? 'Time period (years)' : 'Loan term (years)'}<input type="number" min="1" max="50" value={years} onChange={(event) => setYears(Number(event.target.value))} /></label>}
          {(slug === 'emi' || slug === 'loan') && <label>Monthly expenses (optional)<input type="number" min="0" placeholder="₹0" /></label>}
          <p className="privacy-inline">⌑ Calculated locally in your browser. Your entries aren't sent to Fermor to calculate.</p>
        </form>
        <aside className="result-card"><span className="result-label">{result.label}</span><strong>{money(result.amount)}</strong><p>{result.detail}</p><Sparkline /><div className="result-note">{result.note}</div><ButtonLink to="/calculators" className="button-light">Explore another calculator →</ButtonLink></aside>
      </div>
      <section className="tool-explain"><SectionHeading eyebrow="Understand the estimate" title="A useful starting point, not a promise." description="This interactive estimate is generated on your device. Check the assumptions and update the example values to see how the result changes." /></section>
    </main>
  )
}

function CalculatorsPage() {
  return <main className="page-main container"><PageIntro eyebrow="Free, practical tools" title="Make your next money decision clearer." description="Explore browser-based calculators for loans, savings, salary, taxes and long-term goals." /><CalculatorGrid /><PrivacySection /></main>
}

function PageIntro({ eyebrow, title, description }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
}

function AboutPage() {
  return <main className="page-main">
    <div className="container"><PageIntro eyebrow="About Fermor" title="We're making finance easier for everyday India." description="Fermor is building a simpler way for people to understand, act and grow financially — one informed decision at a time." /></div>
    <section className="about-belief section-pad"><div className="container about-columns"><div><p className="eyebrow">Our mission</p><h2>More clarity. More confidence.</h2><p>We make everyday financial math easier to understand, so people can explore their options without feeling lost in jargon.</p></div><div className="belief-list"><article><span>01</span><div><h3>Understand</h3><p>Make financial information easier to understand.</p></div></article><article><span>02</span><div><h3>Act</h3><p>Support informed everyday decisions with practical tools.</p></div></article><article><span>03</span><div><h3>Grow</h3><p>Encourage thoughtful financial habits over time.</p></div></article></div></div></section>
    <section className="section-pad container"><SectionHeading eyebrow="What we believe" title="Useful finance starts with trust." /><WhyFermor /></section>
    <PrivacySection />
    <section className="section-pad container"><div className="about-team"><span className="team-mark"><img src={logo} alt="" /></span><div><p className="eyebrow">The people behind Fermor</p><h2>A team section ready for the real story.</h2><p>Real team profiles will be added here as the Fermor team is confirmed. We don't invent people or credentials.</p></div></div></section>
  </main>
}

function InsightsPage({ articleSlug }) {
  if (articleSlug !== undefined) {
    const article = articles.find((entry) => entry.slug === articleSlug) || articles[0]
    return <main className="article-page container"><div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/insights">Insights</Link><span>/</span><b>{article.category}</b></div><span className="tag">{article.category}</span><h1>{article.title}</h1><p className="article-deck">{article.description}</p><div className="article-illustration">₹</div><p className="article-note">Educational overview · {article.time}</p><h2>Start with the basics</h2><p>Financial choices can feel complicated when the terms are unfamiliar. A good first step is to understand the inputs, assumptions and trade-offs behind each estimate.</p><p>Use a calculator to explore example scenarios, change one value at a time and compare how the result changes. The output is an illustration—not a guarantee or personalized recommendation.</p><div className="article-callout">Fermor calculations are performed in your browser. This educational content is not personalized financial, investment, tax or legal advice.</div><ButtonLink to="/calculators">Explore a calculator →</ButtonLink></main>
  }
  return <main className="page-main container"><PageIntro eyebrow="Fermor insights" title="Money, explained simply." description="Straightforward guides to help make personal finance concepts easier to follow." /><div className="category-pills">{['All topics', 'Personal finance', 'Investing', 'Loans', 'Tax', 'Salary', 'Saving'].map((category) => <span key={category}>{category}</span>)}</div><div className="blog-grid blog-grid-all">{articles.map((article, index) => <BlogCard key={article.title} article={article} index={index} />)}</div><p className="editorial-note">These articles are educational and do not replace personalized professional advice.</p></main>
}

function TestimonialsPage() {
  return <main className="page-main container"><PageIntro eyebrow="Stories (demo content)" title="People are making better sense of their money." description="These illustrative examples show the kinds of experiences Fermor hopes to support. They are not real customer testimonials." /><div className="category-pills">{['Calculators', 'Money management', 'Investing', 'Salary planning'].map((category) => <span key={category}>{category}</span>)}</div><div className="testimonial-grid">{testimonials.map((item, index) => <article className="testimonial-card" key={`${item.city}-${index}`}><span className="quote-mark">“</span><span className="tag">{item.category}</span><blockquote>“{item.quote}”</blockquote><div className="testimonial-author"><span>{item.author[0].toUpperCase()}</span><div><b>{item.author}</b><small>{item.city} · Demo content</small></div></div></article>)}</div><p className="editorial-note">All testimonials on this page are placeholders for design purposes, not verified customer statements.</p></main>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  return <main className="page-main container"><PageIntro eyebrow="Contact Fermor" title="Let's talk." description="Questions, feedback, partnerships or just want to say hello? Choose a topic and send us a note." /><div className="contact-layout"><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="form-row"><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label></div><label>Subject<select name="subject" defaultValue=""><option value="" disabled>Select a topic</option><option>General question</option><option>Partnerships</option><option>Advertising or affiliate</option><option>Media</option><option>Careers</option><option>Feedback</option></select></label><label>Message<textarea required name="message" rows="5" placeholder="How can we help?" /></label><button className="button" type="submit">Send message <span>→</span></button>{sent && <p className="form-success" role="status">Thanks for reaching out. This demo form is not connected to a mailbox yet.</p>}</form><aside className="contact-aside"><p className="eyebrow">Reach out</p><h2>We'd love to hear from you.</h2><p>Placeholder contact details can be replaced when Fermor's official channels are ready.</p><div className="contact-detail"><span>EMAIL</span><a href="mailto:hello@fermor.example">hello@fermor.example</a></div><div className="contact-detail"><span>LINKEDIN</span><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">Fermor on LinkedIn ↗</a></div><div className="contact-detail"><span>RESPONSE TIME</span><b>Usually within 2 business days</b></div></aside></div></main>
}

function MoneyManagementPage({ period, setPeriod }) {
  return <main className="page-main"><div className="container"><PageIntro eyebrow="Money management · sample" title="See your financial life in one place." description="A product concept for bringing income, spending, savings and goals together. All figures below are sample demo data." /><DashboardPreview period={period} setPeriod={setPeriod} /></div><section className="section-pad container"><SectionHeading eyebrow="Coming soon" title="A clearer view of your everyday money." description="Organize example income, expenses, savings and goals in one place. This preview is not connected to accounts or real financial data." /><EverydayDecisions /></section></main>
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Link to="/" className="brand"><img src={logo} alt="" /><span>fermor</span></Link><p>Making finance simpler, clearer and easier to use.</p><p className="footer-disclaimer">Fermor provides educational information and calculations, not personalized financial advice.</p></div><div className="footer-column"><b>Product</b><Link to="/calculators">Calculators</Link><Link to="/money-management">Money management</Link><Link to="/insights">AI insights</Link></div><div className="footer-column"><b>Company</b><Link to="/about">About</Link><Link to="/testimonials">Testimonials</Link><Link to="/contact">Contact</Link><a href="mailto:careers@fermor.example">Careers</a></div><div className="footer-column"><b>Resources</b><Link to="/insights">Blog & guides</Link><Link to="/about">Privacy</Link><Link to="/about">FAQ</Link><Link to="/about">Disclaimer</Link></div></div><div className="footer-bottom"><span>© 2026 Fermor. All rights reserved.</span><span>Free tools, supported by advertising and affiliate partnerships.</span></div></div></footer>
}

function FinalCta() {
  return <section className="final-cta"><div className="container final-cta-inner"><div><p className="eyebrow">A clearer next step</p><h2>Your money. Your decisions. Made simpler.</h2><p>Start with the numbers. Understand the decision. Take the next step.</p></div><div className="final-cta-actions"><ButtonLink to="/calculators">Explore calculators →</ButtonLink><ButtonLink to="/about" className="button-cream">Learn more</ButtonLink></div><span className="cta-decoration">₹</span></div></section>
}

function LoginDialog({ onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="modal-close" aria-label="Close dialog" onClick={onClose}>×</button><span className="assistant-avatar">f</span><p className="eyebrow">Optional account</p><h2 id="login-title">Save your calculations.</h2><p>Account features are a product preview and aren't available yet. You can use Fermor's calculators without signing in.</p><ButtonLink to="/calculators" className="button" onClick={onClose}>Use free calculators →</ButtonLink></section></div>
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [period, setPeriod] = useState('Monthly')
  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  useEffect(() => {
    const pageName = path === '/' ? 'Home' : path.split('/').filter(Boolean).map((part) => part.replaceAll('-', ' ')).join(' · ')
    document.title = path === '/' ? 'Fermor — Simple Personal Finance Tools for India' : `Fermor — ${pageName}`
    window.scrollTo(0, 0)
  }, [path])

  let content
  if (path.startsWith('/calculators/')) content = <CalculatorTool slug={path.split('/')[2]} />
  else if (path === '/calculators') content = <CalculatorsPage />
  else if (path === '/about') content = <AboutPage />
  else if (path === '/insights') content = <InsightsPage />
  else if (path.startsWith('/blog/')) content = <InsightsPage articleSlug={path.split('/')[2]} />
  else if (path === '/testimonials') content = <TestimonialsPage />
  else if (path === '/contact') content = <ContactPage />
  else if (path === '/money-management') content = <MoneyManagementPage period={period} setPeriod={setPeriod} />
  else content = <HomePage period={period} setPeriod={setPeriod} />

  return (
    <>
      <Navbar onLogin={() => setShowLogin(true)} />
      {content}
      <Footer />
      {showLogin && <LoginDialog onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default App
