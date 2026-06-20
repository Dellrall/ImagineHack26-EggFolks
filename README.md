# 🌿 EggFolks — Eco-Route & Dynamic Workspace Optimizer

[![ImagineHack 26](https://img.shields.io/badge/ImagineHack-2026-emerald?style=for-the-badge)](https://github.com/Dellrall/ImagineHack26-EggFolks)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Go%20%7C%20Postgres-blue?style=for-the-badge)](https://github.com/Dellrall/ImagineHack26-EggFolks)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An intelligent, data-driven platform designed to optimize **corporate commutes** and **office workspace occupancy**. Built as part of **ImagineHack 2026** (Track: *Smarter Resource Management*), EggFolks helps organizations reduce their Scope 3 carbon footprint, mitigate employee tardiness due to traffic, and efficiently balance hybrid WFH (Work From Home) rotas using predictive scheduling and gamified incentives.

---


AI Usage credits: Codex, Gemini, Antigravity's Models, Zed's Model, ChatGPT.

## 🗺️ System Architecture

The application is structured as a multi-service workspace. It consists of a React-based single-page application (SPA), an AI Bridge API Gateway service, a dedicated database source-of-truth microservice, and local logic simulation engines.

```mermaid
graph TD
    subgraph Client [Client Tier]
        FE[React Single Page Application]
        SB[Slack / Messaging Outbound Nudges]
    end

    subgraph Gateway [Gateway / AI Bridge Service]
        AI_Bridge[backend-ai :8080]
        Go_Handlers[AI handlers]
        Google_API[Google Routes API]
    end

    subgraph Data [Data / Database Service]
        Data_Service[backend-data :8081]
        SQLC[SQLC Generated Queries]
        Repo[Repository Layer]
        Stats_Calc[Statistics Calculator]
    end

    subgraph Database [Storage Tier]
        Postgres[(PostgreSQL DB)]
    end

    subgraph Engines [Simulation / Fallback Engines]
        RouterSim[Transportation Router]
        PointsSim[Eco-Points Engine]
        SchedSim[Smart Scheduler]
    end

    FE -->|HTTP / JSON| AI_Bridge
    AI_Bridge -->|Compute Routes| Google_API
    AI_Bridge -.->|Internal RPC / HTTP| Data_Service
    AI_Bridge -->|Local Fallbacks| Engines
    Data_Service -->|SQLC + pgxpool| Postgres
    Stats_Calc -.->|Aggregate KPI Metrics| Data_Service
```

---

## ⚡ Core Features

### 🧑‍💼 1. Employee Portal

Designed as a modern, high-fidelity dashboard built with premium glassmorphism aesthetics.
*   **Suggested Commute Widget:** Displays optimal daily route recommendations.
    *   *Modes:* Toggle between **Eco-Friendly** (maximizes CO₂ saved) and **Speed** (minimizes duration).
    *   *Metrics:* Returns travel time, carbon saved in kg CO₂, and route confidence.
    *   *Navigation:* Integrates a "Confirm & Navigate" link straight to Google Maps and includes a "Copy URL" utility.
*   **Today's Schedule & Status:** Real-time visibility into today's work modes:
    *   *Work Modes:* Office, WFH, or Hybrid.
    *   *Commute Details:* Predicted arrival/departure times, target desk location (e.g. *HQ Floor 2*), and a 5-day week calendar overview.
*   **Carbon Tree Card:** A gamified widget containing a visual tree whose leaves grow and fill up green as employees accumulate carbon savings against their monthly goals.
*   **Eco-Points Ledger:** Tracks point balances, daily point accrual, and displays progress towards the nearest reward.
*   **Redeemable Perks Catalog:** Allows employees to claim corporate rewards (e.g., RM10/RM20 Grab Vouchers, Coffee Vouchers, Extra Leave Days) using their earned Eco-Points.
*   **My Vouchers (Wallet):** Manages active redeemed vouchers with custom-generated alphanumeric codes, mock QR codes, and options to mark vouchers as used.
*   **Employee Profile:** Allows updates to departments, home locations, preferred transport methods, and email.

### 👑 2. Admin Portal

A control center for HR and Sustainability officers to run operations and monitor compliance.
*   **ESG Analytics & Charts:** Displays corporate carbon saving trends (Recharts line graph), WFH/office density breakdowns, and average employee satisfaction scores.
*   **System Overview Sidebar:** High-level metrics tracking total carbon saved, gridlock hours avoided, office density, and total Eco-Points in circulation.
*   **WFH Management System:** Oversees WFH/Office rotations by department, with capabilities to "Assign WFH" or edit individual schedules.
*   **Employee Performance Directory:** A master directory showing individual employee metrics: accumulated points, carbon saved, tardiness flags (Low/Medium/High), and satisfaction.
*   **Gamification Control Center:**
    *   *Point Multipliers:* Configure custom rules (e.g., *Rainy Day Transit 3x Points*, *Cross-Department Carpool +500 Bonus*).
    *   *Rewards Catalog Manager:* Add new rewards, edit costs, update stock, or delete items.
    *   *Economy Health Metrics:* Monitors points in circulation vs. points redeemed, alongside an employee leaderboard.
*   **Compliance Reports:** View "Audit Health" compliance statuses (100% compliant logs) and export reports to CSV.

---

## 🛠️ Tech Stack & Dependencies

### Frontend
*   **Framework:** React v18 (Vite-based build system)
*   **Routing:** TanStack Router (File-based, type-safe navigation)
*   **State Management:** TanStack Query (React Query v5 for API caching and data fetching)
*   **Styling:** Tailwind CSS (Theme tokens defined in `tailwind.config.js` for colors, shadows, and dark mode compatibility)
*   **Visual Assets:** Lucide React icons, Recharts SVG charting libraries, and Framer Motion micro-animations.

### Backend services (Go 1.22)
*   **`backend-ai` (AI Bridge - Port 8080):** 
    *   Serves as the API gateway.
    *   Integrates with the Google Routes API (`/directions/v2:computeRoutes`) using traffic-aware and multi-mode driving/transit queries.
    *   Handles CORS, timeouts, and forwards payloads.
*   **`backend-data` (Data & DB Service - Port 8081):**
    *   Controls CRUD operations and manages PostgreSQL access via **pgx/v5** connection pooling.
    *   Compiles database schemas and parameters using **SQLC** (generating type-safe Go packages).
    *   Calculates consolidated company metrics (carbon saved, hours saved).

### Database (PostgreSQL 16+)
*   **Driver:** `jackc/pgx/v5`
*   **Migrations:** Managed via `golang-migrate` (`/db/migrations/`).
*   **SQL Compilation:** `sqlc` (`sqlc.yaml`).

---


---

## 🧮 Core Business Logic Modules

When the Python AI backend or the Google Routes API is unavailable, the system leverages local JavaScript engines in `src/lib/` to perform calculations:

### 1. Transportation Router (`transportationRouter.js`)
Calculates routing scores based on whether the employee is in a rush:
*   **Rushing Score:** Prioritizes faster travel times and high route reliability:
    $$\text{Score} = (\text{Travel Time} \times -1) + (\text{Reliability} \times 0.01)$$
*   **Eco-Friendly Score:** Balances carbon saved, lower monetary costs, and minimal travel duration:
    $$\text{Score} = (\text{Environmental Score} \times 0.45) + (\text{Carbon Saved (kg)} \times 12) - (\text{Cost} \times 0.8) - (\text{Travel Time} \times 0.15)$$
*   *Carbon saved estimations:* Evaluates standard driving emissions ($0.150\text{ kg CO₂/km}$) vs. public transit ($0.040\text{ kg CO₂/km}$).

### 2. Smart Scheduler (`smartScheduler.js`)
Recommends optimal daily schedules by cross-referencing transit delays and weather events:
*   **Weather Alerts:** Active alerts for rain, storms, or floods trigger a suggestion to switch to **WFH** to prevent tardiness.
*   **Lateness Prediction:** Shift office work slots forward by 30 minutes if travel predictions show arrival times exceeding company starts.
*   **Operating Hours constraint:** Flags and rejects Office entries scheduling work outside the operating window (09:00 - 21:00).

### 3. Eco-Points Engine (`ecoPointsEngine.js`)
Calculates gamification payouts based on transportation modes and consistent behavior:
*   **Base Points:** Distance multiplied by the transportation mode rate:
    *   *Walking:* 10 pts/km | *Cycling:* 8 pts/km | *MRT/LRT:* 5 pts/km | *Bus:* 4 pts/km | *Carpool:* 3 pts/km
*   **Carbon Bonus:** Adds $+10\text{ points}$ for every kg of CO₂ saved.
*   **Streak Bonuses:** Adds $+50\text{ points}$ for 7 consecutive eco-trips, $+300\text{ points}$ for 30 consecutive eco-trips, and $+500\text{ points}$ for achieving the monthly goal.

---

## 🔌 API Interface Contracts

### AI Bridge Endpoints (`backend-ai` :8080)
| Method | Path | Description |
|:---|:---|:---|
| **GET** | `/api/v1/health` | Service health check |
| **GET** | `/api/v1/routes/recommend` | Computes or returns route suggestions |
| **POST** | `/api/v1/routes/recommend` | Submits origin/destination for routing |

### Data Service Endpoints (`backend-data` :8081)
| Method | Path | Description |
|:---|:---|:---|
| **GET** | `/internal/v1/health` | Operational health check |
| **GET** | `/internal/v1/stats/carbon` | Aggregated carbon metrics |

---

## 📁 Repository Directory Structure

```
ImagineHack26-EggFolks/
├── .agents/
│   └── skills/
│       └── SKILLS.md               # Hackathon team guide & contract specs
├── backend/
│   └── go.mod                      # Root Go workspace configurations
├── backend-ai/                     # Gateway & AI Routing integration service
│   ├── cmd/
│   │   └── ai-bridge/
│   │       └── main.go             # Server bootstrapper (Port 8080)
│   ├── internal/
│   │   ├── google/
│   │   │   └── routes.go           # Google Routes directions compiler
│   │   ├── handlers/
│   │   │   ├── ai_handler.go       # Route recommendations API handler
│   │   │   └── routes.go           # Router registry
│   │   └── middleware/             # CORS and timeout middlewares
│   ├── .env                        # AI Bridge configuration properties
│   └── go.mod                      # Go modules file
├── backend-data/                   # Database CRUD and Statistics aggregator
│   ├── cmd/
│   │   └── data-service/
│   │       └── main.go             # Server bootstrapper (Port 8081)
│   ├── db/
│   │   ├── migrations/
│   │   │   └── 001_schema.sql      # Schema definitions
│   │   └── queries/
│   │       └── routes.sql          # SQLC query profiles
│   ├── internal/
│   │   ├── db/                     # SQLC-compiled Go models
│   │   ├── repository/             # Database repository pattern layer
│   │   └── stats/                  # Statistics structures
│   ├── go.mod                      # Go modules file
│   └── sqlc.yaml                   # SQLC code generator config
├── src/                            # React Frontend SPA Source Code
│   ├── components/                 # UI Component Library
│   │   ├── admin/                  # Admin portal widgets & charts
│   │   ├── employee/               # Employee dashboard widgets
│   │   └── shared/                 # Common elements (Table, Navbar, Sidebar, Modals)
│   ├── data/                       # Local Mock Data (KPIs, Employees, Perks)
│   ├── hooks/                      # TanStack Query custom HTTP hooks
│   ├── layouts/                    # Admin, Employee, and SaaS view shells
│   ├── lib/                        # Local business calculation logic engines
│   │   ├── api.js                  # Axios client wrappers & simulated fallbacks
│   │   ├── auth.js                 # Authentication store & user role states
│   │   ├── ecoPointsEngine.js      # Point multiplier logic
│   │   ├── smartScheduler.js       # Dynamic office schedule recommendations
│   │   └── transportationRouter.js # Route selection models
│   ├── routes/                     # TanStack Router folder
│   │   ├── admin/                  # Admin page components
│   │   ├── auth/                   # Authentication screen (Login)
│   │   ├── employee/               # Employee dashboard & pages
│   │   └── routeTree.jsx           # Global routes mapping
│   ├── main.jsx                    # App startup script
│   └── styles/                     # Global CSS file
├── package.json                    # Workspace dependencies & NPM commands
├── run.ps1                         # Startup automation script
├── tailwind.config.js              # Custom Tailwind variables and theme colors
└── vite.config.js                  # Vite builder settings
```

---

## 🚀 Setup & Installation

Follow these steps to run the application locally on your machine:

### 1. Database Configuration
Create a PostgreSQL database and configure the environment schema using the migration file in `backend-data/db/migrations/001_initial_schema.up.sql`:
```bash
# Example: Creating database via psql
psql -U postgres -c "CREATE DATABASE ecoroute;"
psql -U postgres -d ecoroute -f backend-data/db/migrations/001_initial_schema.up.sql
```

### 2. Configure Environment Variables
Create `.env` files in both backend service directories with the following structure:

**For `backend-ai/.env`:**
```env
PORT=8080
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**For `backend-data/.env`:**
```env
PORT=8081
DATABASE_URL=postgres://postgres:password@localhost:5432/ecoroute?sslmode=disable
```

### 3. Launch Services

#### Start the Database Service (`backend-data`):
```bash
cd backend-data
go run ./cmd/data-service/
```
*Alternatively, if on Windows, you can execute the PowerShell helper: `./run.ps1`*

#### Start the AI Bridge Service (`backend-ai`):
```bash
cd backend-ai
go run ./cmd/ai-bridge/
```

#### Start the Frontend Development Server:
Install workspace dependencies and start the Vite server from the root directory:
```bash
npm install
npm run dev
```

The application will launch on **[http://localhost:5173](http://localhost:5173)**.

---

### 🔑 Local Credentials (Role-Based Testing)
Use the following credentials in the login page to access different dashboard layouts:
*   **Employee Portal:**
    *   *Email:* `john.tan@egofolks.eco` (or any email format)
    *   *Password:* any password
    *   *Role selector:* Employee
*   **Admin Portal:**
    *   *Email:* `admin@egofolks.eco`
    *   *Password:* any password
    *   *Role selector:* Admin
