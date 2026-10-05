# Fermor Website Implementation Plan

## Objective

Turn the requirements in [`implementation.md`](./implementation.md) into a responsive, accessible Fermor website while keeping financial calculations local to the browser and clearly separating working tools from sample or future product concepts.

## Implementation approach

1. **Establish the application shell**
   - Keep the existing Vite and React setup.
   - Use a shared responsive header, client-side navigation, page content area, and footer.
   - Apply Fermor's orange, green, warm-white and charcoal design system, including reduced-motion and keyboard-focus support.
   - Use Recharts for responsive dashboard charts and lazy-load chart code to keep the initial page bundle smaller.
2. **Build the requested pages**
   - Home, calculators, money management, insights and article detail, about, testimonials, and contact.
   - Use reusable section headings, calculator/blog/testimonial cards, dashboard visuals, FAQ, CTA, and privacy messaging.
3. **Implement client-side interactions**
   - Add EMI, SIP, FD, tax, salary, investment and retirement estimate views.
   - Recalculate results from input changes in the browser; disclose assumptions and limitations alongside results.
   - Make dashboard time-period controls, the educational assistant demo, mobile menu, account preview dialog, FAQ, and contact form interactive.
4. **Keep claims grounded**
   - Mark dashboards and testimonials as sample/demo content.
   - Label investment management as coming soon and avoid suggesting trade execution or personalized financial advice.
   - Explain that calculator inputs are not sent to Fermor's server to perform calculations.
5. **Verify delivery**
   - Run the production build and lint checks.
   - Exercise the home, navigation, calculator, and responsive layouts in the browser.

## Acceptance criteria

- The site renders without runtime errors on direct page loads and internal navigation.
- All requested primary page types and calculator cards are reachable.
- Calculator results update when inputs change and no calculator input is sent to an API.
- Dashboard values, testimonial cards, and investment examples are clearly identified as demo content.
- Navigation, forms, controls, and links are keyboard-accessible and usable on mobile.
- The production build and lint checks pass.

## Known limitations

- Calculations are educational estimates, not personal financial or tax advice. Tax and salary examples use simplified assumptions that must be checked against current rules and individual circumstances.
- The assistant is a local scripted UI demo, not a connected AI service.
- Login, saved calculations, contact delivery, account aggregation, and investment execution are not connected to a backend.
- Article content and contact channels are starter placeholders for editorial and business review.
