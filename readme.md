Project 1 – Automation Testing for Authentication/add items in shopping cart/check-out/logout Flow
This project demonstrates automated testing of https://www.demoblaze.com/ authentication flow using Playwright and the Page Object Model (POM).
It covers both successful login and failed login, and explains how the setup can be extended and scaled across products, browsers, and CI/CD.
Running the tests
•	Run all tests (default = all projects in config):
•	npx playwright test --headed
•	Run ui only : npx playwright test --ui
________________________________________
Features demonstrated

Sign-up : create a new user 
Log in : user login
Log out : user log out 
Login → add to cart → place order → receipt → logout
Negative: login for non-existent user shows an error
'Negative: login with wrong password – shows an error'

Page Object Model (pages/LoginPage.ts) centralizes selectors for maintainability.
CI/CD ready: environment-based secrets, artifacts, and selective test runs