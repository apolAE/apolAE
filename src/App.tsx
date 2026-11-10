import { useCallback, useEffect, useState } from "react";
import {
  fetchMaskedConfig,
  fetchOverview,
  fetchRuns,
  triggerRun,
} from "./api";
import { ActivityLog } from "./components/ActivityLog";
import { ModeToggle } from "./components/ModeToggle";
import { Overview } from "./components/Overview";
import { RunPanel } from "./components/RunPanel";
import { Settings } from "./components/Settings";
import { useSyncMode } from "./hooks/useSyncMode";
import type { MaskedConfig, OverviewData, SyncRun } from "./types";
import "./App.css";

export default function App() {
  const [mode, setMode] = useSyncMode();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [config, setConfig] = useState<MaskedConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runBusy, setRunBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [ov, runList] = await Promise.all([fetchOverview(), fetchRuns()]);
      setOverview(ov);
      setRuns(runList.runs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    }
    try {
      const masked = await fetchMaskedConfig();
      setConfig(masked);
      setConfigError(null);
    } catch {
      setConfig(null);
      setConfigError(
        "Credentials file not loaded — copy config/credentials.example.json to config/credentials.json",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onRunNow = async () => {
    if (mode !== "manual") return;
    setRunBusy(true);
    setError(null);
    try {
      const { run } = await triggerRun();
      setRuns((prev) => [run, ...prev]);
      const ov = await fetchOverview();
      setOverview(ov);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunBusy(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="logo" aria-hidden>
            ◇
          </span>
          <div>
            <h1>SQL Agent</h1>
            <p className="subtitle">Operations dashboard — pilot</p>
          </div>
        </div>
        <p className="header-user">Apolinario Jr. Villamor</p>
      </header>

      {error && (
        <p className="banner banner-error" role="alert">
          {error}
        </p>
      )}

      <main className="main">
        <section className="card" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <Overview data={overview} loading={loading} />
        </section>

        <section className="card" aria-labelledby="mode-heading">
          <h2 id="mode-heading">Mode</h2>
          <ModeToggle mode={mode} onChange={setMode} />
        </section>

        <section className="card" aria-labelledby="run-heading">
          <h2 id="run-heading">Run</h2>
          <RunPanel
            mode={mode}
            nextScheduledUtc={overview?.nextScheduledUtc}
            scheduleCron={overview?.schedulePlaceholder}
            onRunNow={onRunNow}
            runBusy={runBusy}
            credentialsReady={config !== null}
          />
        </section>

        <section className="card card-wide" aria-labelledby="activity-heading">
          <h2 id="activity-heading">Activity log</h2>
          <ActivityLog runs={runs} loading={loading} />
        </section>

        <section className="card card-wide" aria-labelledby="settings-heading">
          <h2 id="settings-heading">Settings</h2>
          <Settings config={config} configError={configError} />
        </section>
      </main>

      <footer className="footer">
        <p>
          Phase 1 credentials: local file only — migrate to{" "}
          <strong>Azure Key Vault</strong> in phase 2.
        </p>
      </footer>
    </div>
  );
}
