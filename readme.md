![Static Badge](https://img.shields.io/badge/Playwright-1.55.1-blue)
[![Playwright tests](https://github.com/khinsushein/Playwright_project_01/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/khinsushein/Playwright_project_01/actions/workflows/playwright.yml)
#![tests](https://github.com/khinsushein/Playwright_project_01/blob/main/.github/workflows/playwright.yml)






# Project 1 – Automation Testing for Authentication & Shopping Flow

This project demonstrates automated testing of the [Demoblaze](https://wwwon using [Playwright](https://playwrightModel (POM).

It covers both successful login and failed login, and explains how the setup can be extended and scaled across products, browsers, and CI/CD.
## Running the Tests

- Run all tests (headed mode):
  ```bash
  npx playwright test --headed
- Rue with UI 
    npx playwright test --ui


________________________________________
## Features Demonstrated

- **Sign-up**: Create a new user
- **Log in**: User login
- **Log out**: User logout
- **Shopping Flow**: Login → Add to cart → Place order → View receipt → Logout
- **Negative Tests**:
  - Login with non-existent user
  - Login with wrong password
- **Added API endpoints test**
  - GET /entries – fetch all product items
  - POST /view – verify product details by ID
  - Category extraction and validation
  - Schema and data consistency checks


####   **Architecture**
```md
## Architecture

- **Page Object Model**: Centralized selectors in `pages/LoginPage.ts` for maintainability.
- **CI/CD Ready**: Supports environment-based secrets, artifacts, and selective test runs.

## Author
[Khin Su Shein] — QA Automation Engineer  
Based in France, open to Luxembourg/Switzerland roles

## Playwright API + UI Tests for Demoblaze

[![Playwright CI](https://github.com/khinsushein/Playwright_project_01/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/khinsushein/Playwright_project_01/actions/workflows/playwright.yml)

## HTML report
📄 [Download latest HTML report](https://github.com/khinsushein/Playwright_project_01/actions)


