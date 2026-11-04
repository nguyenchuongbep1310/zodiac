# End-to-end tests (Playwright)

```bash
npm run test:e2e            # everything: UI, SEO, API and full-stack flows
npm run test:e2e:frontend   # UI + SEO only, no Docker/Go needed
npm run test:e2e:ui         # interactive runner
npm run test:e2e:report     # open the last HTML report
```

`playwright.config.ts` starts what it needs:

- **backend**: `docker compose up -d --wait postgres redis`, then `go run ./cmd/api` on :8080
  with relaxed rate limits and CORS allowing the test frontend.
- **frontend**: a production build served on :3200 (override with `E2E_FRONTEND_PORT`).

Servers already listening on those ports are reused locally. Docker Desktop must be running
for the full suite. Postgres and Redis keep running afterwards; stop them with
`docker compose down` from the repo root.

| Folder | Project | Needs backend | Covers |
|---|---|---|---|
| `frontend/` | `frontend`, `frontend-mobile` | no | `/vi` routing, language switch, hreflang/canonical, sitemap, robots, landing interactions, mobile layout |
| `api/` | `api` | yes | `/api/v1/charts` through the Next.js proxy: calculation, house systems, lookup, interpretations, validation |
| `fullstack/` | `fullstack` | yes | hero form → chart page (EN and VI), unknown time, bad city, chart tabs, synastry |

Browser calls to OpenStreetMap Nominatim are blocked in `fixtures.ts`, so city lookup uses the
app's built-in city list and tests don't depend on a third-party service.
