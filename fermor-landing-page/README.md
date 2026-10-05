# Fermor

Fermor is a responsive personal-finance website for exploring everyday money decisions in India. It includes browser-based calculators, sample money-management dashboards, educational articles, and product information.

> **Note:** Fermor is a frontend demo. Calculator results are estimates, dashboards and testimonials are sample content, and the account, contact, and assistant experiences are not connected to backend services. Nothing on the site is personalized financial, investment, tax, or legal advice.

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

Run these commands from the `fermor-landing-page` directory:

```bash
npm install
npm run dev
```

Vite prints a local URL after the development server starts.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run build` | Create the optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for review. Run `npm run build` first. |
| `npm run lint` | Check the project with ESLint. |

## Pages and features

- **Home (`/`)** — Product overview, featured calculators, sample dashboard, educational content, FAQs, and calls to action.
- **Calculators (`/calculators`)** — Browse the available tools. Calculator experiences are available at `/calculators/:slug`, including EMI, loan, SIP, fixed deposit, salary, income tax, investment, and retirement estimates.
- **Money management (`/money-management`)** — Interactive sample dashboard with illustrative financial figures and charts.
- **Insights (`/insights`)** — Educational finance articles. Individual article pages use `/blog/:slug`.
- **About (`/about`)**, **Testimonials (`/testimonials`)**, and **Contact (`/contact`)** — Product and informational pages. Testimonials are explicitly demo content.

The interface is responsive and includes reduced-motion support. Dashboard charts are loaded on demand.

## How calculator data is handled

Calculator inputs and estimates are processed in the browser and are not sent to Fermor for calculation. Results depend on the inputs and simplified assumptions shown in the interface; they should not be treated as guaranteed outcomes or a substitute for professional advice.

The dashboard, investment overview, and testimonials contain sample content. Account login, saved calculations, contact-message delivery, account aggregation, and investment execution are not implemented.

## Project structure

```text
.
├── index.html
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── DashboardCharts.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Production deployment

Build with `npm run build` and deploy the generated `dist/` directory to a static web host. Because the site handles routes in the client, configure the host to serve `index.html` as the fallback for application routes (for example, `/calculators/emi` and `/blog/how-emi-works`).
