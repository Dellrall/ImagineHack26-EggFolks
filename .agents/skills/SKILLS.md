# EggFolks — Eco-Route & Dynamic Workspace Optimizer
## Team Skills & Contribution Guide

> Hackathon Track: Smarter Resource Management  
> Last updated: June 2026

---

## 📐 System Overview

This platform optimises corporate commutes and workspace occupancy. The AI core recommends eco-friendly routes, schedules WFH rotations, awards Eco Points, and manages allowances. Employees get nudged via messaging apps and can view their stats on a personal dashboard. Admins see aggregated carbon, tardiness, and satisfaction metrics.

**High-level data flow:**
```
Employee / Admin Dashboard  ──►  Request Worker  ──►  The AI (Router, Scheduler, WFH, Allowance, Eco Points)
                                      │                        │
                              Statistic Calculator        Points System
                                      │                        │
                              [Analytics DB]            [Perks/Rankings DB]
                                      └──► Feedback-Based Learning Loop
```

Messaging channels (WhatsApp / Telegram) are used for **outbound notifications only** (commute nudges, WFH alerts, points earned).

---

## 🗂️ Roles & Ownership

| Role | Who Owns It | Primary Tech |
|---|---|---|
| Frontend – Employee Dashboard | Frontend Dev A | TanStack Router + TanStack Query, Tailwind CSS |
| Frontend – Admin Dashboard | Frontend Dev B | TanStack Router + TanStack Query, Tailwind CSS |
| Slackbot / Messaging Integration | Frontend Dev B (or shared) | Slack Bolt SDK, Slack Web API |
| Backend – AI Bridge | Backend Dev A | Go (Golang), REST/gRPC to Python AI service |
| Backend – Data & DB | Backend Dev B | Go (Golang), PostgreSQL, sqlc / pgx |
| AI Logic | AI Dev | Python, FastAPI, RLHF feedback loop |
| Deployment | DevOps | Docker, Docker Compose, (cloud of choice) |

---

## 🛠️ Tech Stack

### Database — PostgreSQL
- Version: 16+
- ORM/Query layer: **sqlc** (generate type-safe Go from SQL) + **pgx/v5** driver
- Migrations: **golang-migrate**
- Schema lives in `/db/migrations/`; never edit the DB schema directly — always create a new migration file

**Key tables to be aware of:**
| Table | Purpose |
|---|---|
| `employees` | Employee meta (name, home location, department) |
| `routes` | Routing history & carbon scores |
| `schedules` | WFH / office scheduling records |
| `allowances` | Allowance records per employee |
| `eco_points` | Points ledger |
| `perks` | Perk catalogue |
| `claimed_perks` | Employee ↔ Perk redemption log |
| `finance_flow` | Allowance finance tracking |
| `carbon_reports` | Aggregated carbon metrics |
| `satisfaction_scores` | RLHF feedback ratings |
| `tardiness_scores` | Tardiness tracking |

---

### Backend — Go (Golang)

**Two backend services:**

#### 1. `backend-ai` — AI Bridge Service (Backend Dev A)
Receives requests from dashboards/Slack, calls the Python AI service, and returns structured results.

```
/cmd/ai-bridge/          ← main entry point
/internal/ai/            ← HTTP client to Python AI service
/internal/handlers/      ← REST handlers (routes, schedule, wfh, allowance, points)
/internal/middleware/     ← Auth, logging, rate limiting
```

**Key responsibilities:**
- Expose REST endpoints for the frontend (see API contract below)
- Forward requests to the Python AI microservice via internal HTTP
- Write results back to DB via the data service or direct DB calls
- Publish notifications to the messaging integration

#### 2. `backend-data` — Data & DB Service (Backend Dev B)
Owns all direct database access and serves as the source of truth for the analytics layer.

```
/cmd/data-service/       ← main entry point
/internal/db/            ← sqlc generated code
/internal/repository/    ← repository pattern wrappers
/internal/stats/         ← Statistic Calculator logic
/db/migrations/          ← SQL migration files
/db/queries/             ← sqlc query definitions (.sql files)
```

**Key responsibilities:**
- All CRUD for employees, routes, schedules, points, perks, finance
- Statistic Calculator: aggregate carbon reports, satisfaction scores, tardiness scores
- Expose internal REST endpoints (called by `backend-ai` and the dashboards)

**Go conventions for this project:**
```go
// Use standard library net/http or chi router
// Error handling: always return (T, error) — never panic in handlers
// Config via environment variables only — no hardcoded secrets
// Use context.Context everywhere for DB calls
// Structs use json tags: `json:"snake_case"`
```

**Environment variables (both services):**
```env
DATABASE_URL=postgres://user:pass@localhost:5432/ecoroute
AI_SERVICE_URL=http://ai-service:8000
PORT=8080
JWT_SECRET=...
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
```

---

### AI Model — Python

**Service:** FastAPI application exposing internal endpoints called by `backend-ai`.

```
/ai-service/
  main.py                ← FastAPI app entry
  routers/
    transport_router.py  ← Transportation Router logic
    scheduler.py         ← Scheduler logic
    wfh_arranger.py      ← WFH Arranger logic
    allowance_giver.py   ← Allowance Giver logic
    eco_points_giver.py  ← Eco Points Giver logic
  rlhf/
    feedback_loop.py     ← RLHF weight updates from satisfaction ratings
    model_weights.py     ← Persisted weight store
  models/
    schemas.py           ← Pydantic request/response models
  utils/
    carbon_calc.py       ← Carbon-to-Time Efficiency Ratio calculator
```

**AI Modules (maps to architecture diagram):**

| Module | Input | Output |
|---|---|---|
| Transportation Router | Employee home location, office address, time | Ranked eco-route options with carbon score |
| Scheduler | Calendar data, weather forecast, traffic data | Recommended office/WFH schedule |
| WFH Arranger | Congestion forecast, department roster | WFH rotation assignments |
| Allowance Giver | Employee record, route taken | Allowance amount to grant |
| Eco Points Giver | Route taken, carbon saved vs baseline | Points to award |

**RLHF Feedback Loop:**
- After each commute, employee submits a satisfaction rating (1–5)
- Rating is stored in `satisfaction_scores` table
- `feedback_loop.py` reads recent low ratings and adjusts routing weights for that time-bracket / demographic
- Weights are checkpointed to file or a lightweight store (not the main PostgreSQL DB)

**Python conventions:**
```python
# Use pydantic v2 for all request/response schemas
# Return consistent envelope: {"data": ..., "error": null}
# All endpoints must have type hints
# Use async def for FastAPI routes
# Dependencies via requirements.txt (pin versions)
```

**Key packages:**
```
fastapi==0.111.*
uvicorn[standard]
pydantic==2.*
httpx           # async HTTP client for any external calls
numpy / pandas  # for route scoring and stats
scikit-learn    # lightweight ML for RLHF weight updates
python-dotenv
```

---

### Frontend — TanStack + Tailwind CSS

Both dashboards are separate pages/apps but share a common component library.

```
/frontend/
  src/
    routes/              ← TanStack Router file-based routes
      employee/          ← Employee Dashboard pages
      admin/             ← Admin Dashboard pages
    components/          ← Shared UI components
    hooks/               ← TanStack Query hooks (one per API resource)
    lib/
      api.ts             ← Typed API client (fetch wrapper)
      auth.ts            ← JWT token handling
    styles/
      globals.css        ← Tailwind base
```

**Employee Dashboard pages:**
- `/dashboard` — Today's recommended route, Eco Points balance, upcoming schedule
- `/routes` — Route history, satisfaction rating submission
- `/perks` — Perks catalogue, claim perk
- `/profile` — Personal settings

**Admin Dashboard pages:**
- `/admin/overview` — Carbon saved (kg CO₂), gridlock hours bypassed, office density
- `/admin/schedules` — WFH rotation management
- `/admin/employees` — Employee list + individual stats
- `/admin/reports` — Export ESG reports

**TanStack Query conventions:**
```ts
// One query hook per resource, e.g.:
export const useEmployeeRoutes = (employeeId: string) =>
  useQuery({ queryKey: ['routes', employeeId], queryFn: () => api.getRoutes(employeeId) })

// Mutations invalidate the relevant query on success
// Loading and error states must always be handled in UI
```

**Tailwind conventions:**
- Use utility classes only — no custom CSS unless unavoidable
- Dark mode support via `dark:` prefix
- Mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- Colour tokens: define the brand green and brand slate in `tailwind.config.js` — don't hardcode hex values inline

---

### Messaging — Slack

Used for **outbound employee notifications**. The Slackbot also receives commands from employees (e.g. check points, request WFH). Integration lives in its own service using **Slack Bolt for Go** (or the Slack Web API directly).

**Setup:**
- Create a Slack App at [api.slack.com/apps](https://api.slack.com/apps)
- Enable **Bot Token Scopes:** `chat:write`, `commands`, `users:read`
- Enable **Event Subscriptions** if you want to listen to messages
- Store `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET` as environment variables only — never commit to git

**Notification types:**
| Trigger | Slack Message |
|---|---|
| Daily commute recommendation | "Here's your eco route for today + points you'll earn 🌿" |
| WFH assignment | "You've been assigned WFH tomorrow due to forecasted congestion." |
| Eco Points earned | "You earned 120 Eco Points for today's commute! Redeem at [link]" |
| Allowance granted | "Your transport allowance of RM X has been credited." |

**Sending a message (Go example):**
```go
// POST https://slack.com/api/chat.postMessage
payload := map[string]string{
    "channel": slackUserID,
    "text":    "Your eco route for today is ready 🌿",
}
// Set Authorization: Bearer $SLACK_BOT_TOKEN header
```

**Environment variables:**
```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
```

---

## 🔌 Internal API Contract

All endpoints return:
```json
{ "data": <payload>, "error": null }
// or on error:
{ "data": null, "error": "description" }
```

### `backend-ai` endpoints (called by Frontend)

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/routes/recommend` | Get today's eco-route for the authenticated employee |
| POST | `/api/v1/routes/feedback` | Submit satisfaction rating for a completed commute |
| GET | `/api/v1/schedule/me` | Get employee's upcoming WFH/office schedule |
| GET | `/api/v1/points/me` | Get Eco Points balance + history |
| GET | `/api/v1/allowance/me` | Get allowance records |

### `backend-data` endpoints (called by `backend-ai` and Admin Frontend)

| Method | Path | Description |
|---|---|---|
| GET | `/internal/v1/employees/:id` | Fetch employee meta |
| GET | `/internal/v1/stats/carbon` | Aggregated carbon report |
| GET | `/internal/v1/stats/tardiness` | Tardiness scores |
| GET | `/internal/v1/stats/satisfaction` | Satisfaction scores |
| GET | `/internal/v1/perks` | List all perks |
| POST | `/internal/v1/perks/claim` | Claim a perk |
| GET | `/internal/v1/finance` | Finance flow records |

### Python AI service endpoints (called by `backend-ai` only — never from frontend)

| Method | Path | Description |
|---|---|---|
| POST | `/ai/route` | Compute route recommendations |
| POST | `/ai/schedule` | Compute WFH/office schedule |
| POST | `/ai/points` | Compute Eco Points to award |
| POST | `/ai/allowance` | Compute allowance amount |
| POST | `/ai/feedback` | Submit RLHF feedback signal |

---

## 🐳 Local Development Setup

**Prerequisites:** Docker Desktop, Go 1.22+, Python 3.11+, Node 20+

```bash
# 1. Clone the repo
git clone <repo-url> && cd eggfolks-ecoroute

# 2. Spin up PostgreSQL
docker compose up -d postgres

# 3. Run DB migrations
cd backend-data && make migrate-up

# 4. Start the AI service
cd ai-service && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# 5. Start backend-ai
cd backend-ai && go run ./cmd/ai-bridge/

# 6. Start backend-data
cd backend-data && go run ./cmd/data-service/

# 7. Start the frontend
cd frontend && npm install && npm run dev
```

`docker-compose.yml` should define: `postgres`, `ai-service`, `backend-ai`, `backend-data`. Frontend runs on host during dev.

---

## 🗃️ Git Workflow

```
main            ← stable, deployable
dev             ← integration branch (all PRs merge here first)
feature/<name>  ← your working branch
```

- Branch from `dev`, PR back to `dev`
- PR requires at least 1 reviewer approval
- Commit style: `feat:`, `fix:`, `chore:`, `docs:` prefixes
- Never commit `.env` files — use `.env.example` with placeholder values

---

## ✅ Definition of Done (per feature)

- [ ] Feature works end-to-end locally (frontend → backend → AI → DB)
- [ ] Environment variables documented in `.env.example`
- [ ] No hardcoded secrets or localhost URLs in code
- [ ] API endpoint added to this doc if new
- [ ] DB schema change has a migration file
- [ ] Basic error states handled in UI (loading, error, empty)

---

## 🏁 Hackathon Deliverable Checklist

| Deliverable | Owner | Status |
|---|---|---|
| Employee Dashboard (route, points, perks) | Frontend Dev A | ⬜ |
| Admin Dashboard (carbon, density, ESG export) | Frontend Dev B | ⬜ |
| Slackbot notifications + commands | Backend Dev A | ⬜ |
| Transportation Router AI | AI Dev | ⬜ |
| Scheduler + WFH Arranger AI | AI Dev | ⬜ |
| Eco Points + Allowance Giver AI | AI Dev | ⬜ |
| RLHF Feedback Loop | AI Dev | ⬜ |
| PostgreSQL schema + migrations | Backend Dev B | ⬜ |
| Statistic Calculator (carbon/satisfaction/tardiness) | Backend Dev B | ⬜ |
| Points System + Perks DB | Backend Dev B | ⬜ |
| AI Bridge service (Go → Python) | Backend Dev A | ⬜ |
| Docker Compose local setup | DevOps | ⬜ |
| Cloud deployment | DevOps | ⬜ |

---

*Questions? Drop them in the team channel. Good luck — let's build something green 🌿*
