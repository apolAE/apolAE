# SQL Agent — Operations Dashboard (Pilot)

Pilot **operations dashboard** for the Apolinario Jr. Villamor SQL Agent initiative: monitor connection health, toggle **Auto / Manual** mode, trigger simulated sync runs, and review activity — without implementing full DW→SharePoint sync yet.

## Prerequisites

- Node.js 20+
- npm

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure credentials (phase 1 — local file only)**

   ```bash
   cp config/credentials.example.json config/credentials.json
   ```

   Edit `config/credentials.json` with your SQL DW settings. This file is **gitignored** and must not be committed.

   > **Phase 2:** Migrate secrets to **Azure Key Vault** and managed identity. File-based plaintext credentials are for controlled pilot machines only.

3. **Run locally**

   ```bash
   npm run dev
   ```

   - UI: [http://localhost:5173](http://localhost:5173)
   - API (server-side only): `http://127.0.0.1:3001` (proxied via Vite at `/api/*`)

## Features

| Area | Behavior |
|------|----------|
| **Overview** | Last run status (mock seed), rows synced, environment, connection health |
| **Mode** | Auto / Manual toggle; persisted in `localStorage` |
| **Run** | Manual: **Run sync now** (simulated); Auto: next scheduled time + cron placeholder |
| **Activity log** | Mock history + new rows when you trigger a manual run |
| **Settings** | Credentials file path; masked server / database / user (`••••••` for password) |

Passwords and full connection strings are **never** returned to the browser or logged from the API.

## API (pilot)

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Connection config health |
| `GET /api/config/masked` | Masked DW settings |
| `GET /api/runs` | Activity list |
| `GET /api/overview` | Dashboard summary |
| `POST /api/runs/trigger` | Simulate a manual sync run |

## Scripts

- `npm run dev` — Vite + Express API
- `npm run build` — Type-check and production build (UI)
- `npm run preview` — Preview production UI build

## Repository hygiene

- `config/credentials.json` — **never commit**
- `.env` — gitignored
- `config/credentials.example.json` — template with placeholders only
