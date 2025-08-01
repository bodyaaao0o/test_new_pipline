import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  // testIgnore: [
  //   'tests/login.spec.ts',
  // ],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter:
    [
      ["line"],
      ['allure-playwright', { outputFolder: 'allure-results' }],
      // ['html']
    ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 120000,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    navigationTimeout: 120000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
    // storageState: 'auth/investorPage.json',
    // baseURL: 'https://dev.invest.penomo.com',
  },
  expect: {
    timeout: 100000,
  },

  /* Configure projects for major browsers */
  projects: [

    // {
    //   name: "infestor E2E",
    //   testMatch: /.*\/tests\/E2E\/investor\.spec\.ts/,
    //   use: {
    //     storageState: 'playwright/.auth/redistered_invest_login.json',
    //   },
    // },

    // {
    //   name: "Investor presale",
    //   testMatch: /.*\/tests\/E2E\/presale\.spec\.ts/,
    //   use: {
    //     storageState: 'playwright/.auth/invest_login.json'
    //   },
    // },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //     isMobile: true,
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //     isMobile: true,
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
