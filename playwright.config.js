// playwright.config.js — Pruebas E2E del ABM Clientes
// Ejecución SINCRÓNICA (workers: 1) para poder observar cada caso en orden.
// El webServer levanta la app automáticamente con una base de datos exclusiva de E2E.
const { defineConfig } = require('@playwright/test');

const SLOWMO = process.env.PW_SLOWMO ? Number(process.env.PW_SLOWMO) : 0;

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: { slowMo: SLOWMO },
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: true,
    timeout: 15_000,
    env: { DB_FILE: 'tests/e2e/.tmp-e2e-db.json' },
  },
});
