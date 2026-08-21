// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  webServer: {
    command: 'npx http-server . -p 8080 -c-1',
    url: 'http://127.0.0.1:8080/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:8080',
  },
});
