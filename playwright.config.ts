import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  webServer: { command: 'pnpm vite preview --port 4173 --strictPort', port: 4173, reuseExistingServer: true },
  use: { baseURL: 'http://localhost:4173' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
