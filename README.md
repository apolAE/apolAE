# SQL Agent — Pilot

Operations dashboard for the Data Warehouse → SharePoint pilot. Sync runs are **simulated** until your manual process flow is wired in.

## Setup

1. Copy credentials (never commit the real file):

   ```bash
   cp config/credentials.example.json config/credentials.json
   ```

2. Install and run API + UI:

   ```bash
   npm install
   cd dashboard && npm install && cd ..
   npm run dev
   ```

3. Open **http://127.0.0.1:5173** (UI proxies `/api` to port 3001).

## Credentials

- Phase 1: plaintext JSON in `config/credentials.json` (gitignored).
- UI shows **masked** password only; full secret is read on the server, not sent to the browser.
- Phase 2: Azure Key Vault (see Project Context in Cursor).

## Dashboard

- **Manual mode:** use **Run sync now**.
- **Auto mode:** placeholder schedule; toggle stored in browser `localStorage` until a real scheduler is added.

## Layout

| Path | Role |
|------|------|
| `server/index.js` | API: health, masked config, run history, simulated POST run |
| `dashboard/` | React + Vite UI |
| `config/credentials.example.json` | Template |
