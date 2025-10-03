Project 2 – Automation Testing for Authentication Flow
This project demonstrates automated testing of Alohi’s authentication flow using Playwright and the Page Object Model (POM).
It covers both successful login and failed login, and explains how the setup can be extended and scaled across products, browsers, and CI/CD.
Running the tests
•	Run all tests (default = all projects in config):
•	npx playwright test
•	Run success login only:
•	npx playwright test -g "Login succeeds" --project=chromium-sign --headed
•	Run failure login only:
•	npx playwright test -g "Login fails" --project=chromium-sign --headed
•	View the HTML report:
•	npx playwright show-report
________________________________________
Features demonstrated

Positive & negative paths: login succeeds with valid credentials, fails with wrong password.

Page Object Model (pages/LoginPage.ts) centralizes selectors for maintainability.

Multi-product support: playwright.config.ts defines different baseURLs (sign.plus, fax.plus) — same tests run against multiple apps.

Artifacts: trace, video, and screenshots captured on failure.

Scalability:

Tagging (@smoke, @regression) for selective runs.

Multi-browser support (Chromium + Firefox;+WebKit).

CI/CD ready: environment-based secrets, artifacts, and selective test runs