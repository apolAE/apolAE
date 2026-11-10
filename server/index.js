const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const CREDENTIALS_PATH =
  process.env.CREDENTIALS_PATH ||
  path.join(__dirname, "..", "config", "credentials.json");

app.use(cors());
app.use(express.json());

let runs = [
  {
    id: "run-seed-1",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    status: "success",
    mode: "manual",
    rowsRead: 1240,
    rowsWritten: 1180,
    message: "Simulated sync (pilot)",
  },
  {
    id: "run-seed-2",
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    status: "success",
    mode: "auto",
    rowsRead: 980,
    rowsWritten: 980,
    message: "Simulated scheduled run",
  },
];

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    return { loaded: false, error: "credentials.json not found" };
  }
  try {
    const raw = fs.readFileSync(CREDENTIALS_PATH, "utf8");
    return { loaded: true, config: JSON.parse(raw) };
  } catch (e) {
    return { loaded: false, error: "Invalid credentials file" };
  }
}

function maskConfig(config) {
  if (!config?.sqlServer) return null;
  const { server, database, user, password } = config.sqlServer;
  return {
    sqlServer: {
      server: server || "—",
      database: database || "—",
      user: user || "—",
      passwordMasked: password ? "••••••••" : "—",
    },
    sharepoint: config.sharepoint || {},
    credentialsPath: CREDENTIALS_PATH,
  };
}

app.get("/api/health", (_req, res) => {
  const cred = loadCredentials();
  res.json({
    ok: true,
    credentialsLoaded: cred.loaded,
    credentialsError: cred.loaded ? undefined : cred.error,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/config/masked", (_req, res) => {
  const cred = loadCredentials();
  if (!cred.loaded) {
    return res.status(503).json({ error: cred.error });
  }
  res.json(maskConfig(cred.config));
});

app.get("/api/runs", (_req, res) => {
  res.json({ runs: [...runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)) });
});

app.post("/api/runs", (req, res) => {
  const cred = loadCredentials();
  if (!cred.loaded) {
    return res.status(503).json({ error: cred.error });
  }
  const mode = req.body?.mode === "auto" ? "auto" : "manual";
  const run = {
    id: `run-${Date.now()}`,
    startedAt: new Date().toISOString(),
    status: "success",
    mode,
    rowsRead: Math.floor(800 + Math.random() * 600),
    rowsWritten: Math.floor(750 + Math.random() * 550),
    message: "Simulated sync — wire DW→SharePoint in next phase",
  };
  runs.unshift(run);
  res.status(201).json({ run });
});

app.listen(PORT, () => {
  console.log(`SQL Agent pilot API on http://127.0.0.1:${PORT}`);
});
