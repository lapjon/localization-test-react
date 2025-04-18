import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    browserName: 'chromium',
    headless: false,
    baseURL: 'http://localhost:5173',
    locale: 'en-US',
  },
});