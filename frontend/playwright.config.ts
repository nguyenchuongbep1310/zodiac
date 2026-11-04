import { defineConfig, devices } from "@playwright/test";

// Ports are separate from the usual dev servers (3000/3100) so a test run can
// sit alongside them. The backend is the real Go API on its default port.
const FRONTEND_PORT = Number(process.env.E2E_FRONTEND_PORT ?? 3200);
const BACKEND_PORT = 8080;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${FRONTEND_PORT}`;

// E2E_FRONTEND_ONLY=1 runs the UI/SEO suite without Docker, Postgres or Go.
const frontendOnly = !!process.env.E2E_FRONTEND_ONLY;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Every worker drives a browser against one local Next server and Go API;
  // more than a few at once slows teardown past the timeout on a laptop.
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  // Generous on laptops, where an IDE indexing or a Docker VM can stall the
  // first requests to a cold server; CI machines are dedicated to the run.
  timeout: process.env.CI ? 30_000 : 60_000,
  expect: { timeout: process.env.CI ? 10_000 : 15_000 },

  use: {
    baseURL,
    // E2E_SLOWMO=500 pauses between actions so a headed run can be watched.
    launchOptions: { slowMo: Number(process.env.E2E_SLOWMO ?? 0) },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Recording video for every test is the slowest part of teardown, so only CI keeps it.
    video: process.env.CI ? "retain-on-failure" : "off",
  },

  projects: [
    {
      name: "frontend",
      // Regexes, not globs: this package itself lives in a folder called "frontend".
      testMatch: /e2e\/frontend\/(?!.*\.mobile\.e2e\.ts$).*\.e2e\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "frontend-mobile",
      testMatch: /e2e\/frontend\/.*\.mobile\.e2e\.ts$/,
      use: { ...devices["Pixel 7"] },
    },
    ...(frontendOnly
      ? []
      : [
          {
            name: "api",
            testMatch: /e2e\/api\/.*\.e2e\.ts$/,
          },
          {
            name: "fullstack",
            testMatch: /e2e\/fullstack\/.*\.e2e\.ts$/,
            use: { ...devices["Desktop Chrome"] },
          },
        ]),
  ],

  webServer: [
    ...(frontendOnly
      ? []
      : [
          {
            name: "backend",
            // Brings up Postgres + Redis from the repo's compose file, then the API
            // (migrations run on boot). The first run also compiles the Go binary.
            command: "docker compose -f ../docker-compose.yml up -d --wait postgres redis && go run ./cmd/api",
            cwd: "../backend",
            url: `http://localhost:${BACKEND_PORT}/health`,
            reuseExistingServer: !process.env.CI,
            timeout: 240_000,
            stdout: "ignore" as const,
            stderr: "pipe" as const,
            env: {
              ZODIAC_APP_PORT: String(BACKEND_PORT),
              ZODIAC_LOG_LEVEL: "warn",
              // .env.local points the browser straight at :8080, so the API sees
              // the test frontend's origin and must allow it for CORS.
              ZODIAC_SECURITY_ALLOWED_ORIGINS: `http://localhost:3000,http://localhost:${FRONTEND_PORT}`,
              // Tests calculate many charts in a few seconds; the production
              // limit (10/min) would turn them into 429s.
              ZODIAC_SECURITY_CALCULATE_RATE_LIMIT_PER_MINUTE: "1000",
              ZODIAC_SECURITY_CALCULATE_RATE_LIMIT_BURST: "200",
              ZODIAC_SECURITY_RATE_LIMIT_PER_MINUTE: "5000",
              ZODIAC_SECURITY_RATE_LIMIT_BURST: "1000",
            },
          },
        ]),
    {
      name: "frontend",
      // Production build so tests see what users get (proxy, static SEO tags).
      command: `npm run build && npm run start -- -p ${FRONTEND_PORT}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
});
