![Static Badge](https://img.shields.io/badge/Playwright-1.55.1-blue)


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


#### 🧱 **Architecture**
```md
## Architecture

- **Page Object Model**: Centralized selectors in `pages/LoginPage.ts` for maintainability.
- **CI/CD Ready**: Supports environment-based secrets, artifacts, and selective test runs.