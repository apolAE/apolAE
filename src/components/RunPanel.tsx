import type { SyncMode } from "../types";
import "./RunPanel.css";

interface Props {
  mode: SyncMode;
  nextScheduledUtc?: string;
  scheduleCron?: string;
  onRunNow: () => void;
  runBusy: boolean;
  credentialsReady: boolean;
}

function formatNext(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RunPanel({
  mode,
  nextScheduledUtc,
  scheduleCron,
  onRunNow,
  runBusy,
  credentialsReady,
}: Props) {
  if (mode === "auto") {
    return (
      <div className="run-panel">
        <p className="run-schedule-label">Next scheduled run</p>
        <p className="run-schedule-time">{formatNext(nextScheduledUtc)}</p>
        <p className="run-cron">
          Cron (placeholder): <code>{scheduleCron ?? "0 */6 * * *"}</code>
        </p>
        <p className="run-note muted-inline">
          Automatic runs are not wired in this pilot build.
        </p>
      </div>
    );
  }

  return (
    <div className="run-panel">
      <button
        type="button"
        className="run-button"
        onClick={onRunNow}
        disabled={runBusy || !credentialsReady}
      >
        {runBusy ? "Running…" : "Run sync now"}
      </button>
      {!credentialsReady && (
        <p className="run-warn">Add config/credentials.json to enable runs.</p>
      )}
      <p className="run-note muted-inline">
        Simulates a sync and appends a row to the activity log.
      </p>
    </div>
  );
}
