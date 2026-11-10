import { useCallback, useEffect, useState } from "react";

type RunMode = "auto" | "manual";

interface Run {
  id: string;
  startedAt: string;
  status: string;
  mode: RunMode;
  rowsRead: number;
  rowsWritten: number;
  message: string;
}

interface MaskedConfig {
  sqlServer: {
    server: string;
    database: string;
    user: string;
    passwordMasked: string;
  };
  sharepoint: { siteUrl?: string; listName?: string };
  credentialsPath: string;
}

const MODE_KEY = "sql-agent-pilot-mode";

export default function App() {
  const [healthOk, setHealthOk] = useState<boolean | null>(null);
  const [credError, setCredError] = useState<string | null>(null);
  const [config, setConfig] = useState<MaskedConfig | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [mode, setMode] = useState<RunMode>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === "auto" ? "auto" : "manual";
  });
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const h = await fetch("/api/health");
      const health = await h.json();
      setHealthOk(health.ok && health.credentialsLoaded);
      setCredError(health.credentialsLoaded ? null : health.credentialsError);

      if (health.credentialsLoaded) {
        const c = await fetch("/api/config/masked");
        if (c.ok) setConfig(await c.json());
      } else {
        setConfig(null);
      }

      const r = await fetch("/api/runs");
      if (r.ok) {
        const data = await r.json();
        setRuns(data.runs);
      }
    } catch {
      setHealthOk(false);
      setCredError("API unreachable — run npm run dev from repo root");
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  async function runSync() {
    setRunning(true);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) await refresh();
    } finally {
      setRunning(false);
    }
  }

  const lastRun = runs[0];
  const nextAuto = "Every 15 minutes (placeholder — set in phase 2)";

  return (
    <div className="app">
      <header>
        <div>
          <h1>SQL Agent · Pilot</h1>
          <p>Data Warehouse → SharePoint (simulated runs)</p>
        </div>
        <span className={healthOk ? "badge ok" : "badge bad"}>
          {healthOk === null
            ? "Checking…"
            : healthOk
              ? "Credentials loaded"
              : credError || "Not ready"}
        </span>
      </header>

      <div className="grid">
        <section className="card">
          <h2>Overview</h2>
          {lastRun ? (
            <>
              <div className="stat">
                {lastRun.rowsWritten.toLocaleString()}
                <small>Rows written · last run ({lastRun.mode})</small>
              </div>
              <p className="hint">
                Last run: {new Date(lastRun.startedAt).toLocaleString()} —{" "}
                {lastRun.status}
              </p>
            </>
          ) : (
            <p className="hint">No runs yet.</p>
          )}
        </section>

        <section className="card">
          <h2>Sync mode</h2>
          <div className="mode-toggle">
            <button
              type="button"
              className={mode === "manual" ? "active" : ""}
              onClick={() => setMode("manual")}
            >
              Manual
            </button>
            <button
              type="button"
              className={mode === "auto" ? "active" : ""}
              onClick={() => setMode("auto")}
            >
              Auto
            </button>
          </div>
          <p className="hint">
            {mode === "manual"
              ? "You start each sync with Run sync now."
              : `Scheduler: ${nextAuto} (not wired in pilot UI yet).`}
          </p>
          <button
            type="button"
            className="btn-primary"
            disabled={!healthOk || running || mode === "auto"}
            onClick={runSync}
          >
            {running ? "Running…" : "Run sync now"}
          </button>
          {mode === "auto" && (
            <p className="hint">Switch to Manual to trigger a run from the UI.</p>
          )}
        </section>
      </div>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Activity log</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Read</th>
              <th>Written</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td>{new Date(run.startedAt).toLocaleString()}</td>
                <td>{run.mode}</td>
                <td>
                  <span className={`status-pill ${run.status}`}>{run.status}</span>
                </td>
                <td>{run.rowsRead}</td>
                <td>{run.rowsWritten}</td>
                <td>{run.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Settings (masked)</h2>
        {config ? (
          <dl className="settings-dl">
            <div>
              <dt>SQL server</dt>
              <dd>{config.sqlServer.server}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>{config.sqlServer.database}</dd>
            </div>
            <div>
              <dt>User</dt>
              <dd>{config.sqlServer.user}</dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>{config.sqlServer.passwordMasked}</dd>
            </div>
            <div>
              <dt>SharePoint site</dt>
              <dd>{config.sharepoint.siteUrl || "—"}</dd>
            </div>
            <div>
              <dt>List</dt>
              <dd>{config.sharepoint.listName || "—"}</dd>
            </div>
            <div>
              <dt>Config file</dt>
              <dd style={{ fontSize: "0.75rem" }}>{config.credentialsPath}</dd>
            </div>
          </dl>
        ) : (
          <p className="hint">
            Copy <code>config/credentials.example.json</code> to{" "}
            <code>config/credentials.json</code> and restart the API.
          </p>
        )}
        <p className="hint" style={{ marginTop: "1rem" }}>
          Phase 2: move secrets to Azure Key Vault; passwords stay server-side only.
        </p>
      </section>
    </div>
  );
}
