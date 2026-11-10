import cors from "cors";
import express from "express";
import {
  checkConnectionHealth,
  getCredentialsPath,
  loadCredentials,
  toMaskedConfig,
} from "./credentials.js";
import { getLatestRun, listRuns, simulateManualRun } from "./runs.js";

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const creds = loadCredentials();
  const health = checkConnectionHealth(creds);
  res.json({
    ok: health.status !== "degraded",
    connection: health,
    credentialsFileExists: creds !== null,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/config/masked", (_req, res) => {
  const creds = loadCredentials();
  if (!creds) {
    res.status(404).json({
      error: "credentials_not_found",
      credentialsFilePath: getCredentialsPath(),
      hint: "Copy config/credentials.example.json to config/credentials.json",
    });
    return;
  }
  res.json(toMaskedConfig(creds));
});

app.get("/api/runs", (_req, res) => {
  res.json({ runs: listRuns() });
});

app.get("/api/overview", (_req, res) => {
  const creds = loadCredentials();
  const health = checkConnectionHealth(creds);
  const latest = getLatestRun();
  res.json({
    lastRun: latest,
    environment: creds?.environment ?? "unconfigured",
    connectionHealth: health,
    totalRuns: listRuns().length,
    rowsSyncedLastSuccess:
      listRuns().find((r) => r.status === "success")?.rowsSynced ?? 0,
    schedulePlaceholder: "0 */6 * * *",
    nextScheduledUtc: "2026-11-10T12:00:00.000Z",
  });
});

app.post("/api/runs/trigger", (_req, res) => {
  const creds = loadCredentials();
  if (!creds) {
    res.status(400).json({
      error: "credentials_required",
      message: "Load config/credentials.json before triggering a run",
    });
    return;
  }
  const run = simulateManualRun();
  res.status(201).json({ run });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`SQL Agent API listening on http://127.0.0.1:${PORT}`);
});
