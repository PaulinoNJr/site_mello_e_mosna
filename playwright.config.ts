import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5173', reducedMotion: 'reduce' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', testMatch: '**/responsive-devices.spec.ts', use: { browserName: 'webkit' } },
    { name: 'firefox', testMatch: '**/responsive-devices.spec.ts', use: { browserName: 'firefox' } },
  ],
  webServer: [
    { command: 'npm run dev -- --port 5173 --strictPort', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
    { command: 'npm run preview -- --port 4180 --strictPort', url: 'http://127.0.0.1:4180', reuseExistingServer: !process.env.CI },
  ],
});
