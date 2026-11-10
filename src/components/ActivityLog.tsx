import type { SyncRun } from "../types";
import { StatusPill } from "./StatusPill";
import "./ActivityLog.css";

interface Props {
  runs: SyncRun[];
  loading: boolean;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ActivityLog({ runs, loading }: Props) {
  if (loading && runs.length === 0) {
    return <p className="muted">Loading activity…</p>;
  }

  if (runs.length === 0) {
    return <p className="muted">No runs recorded.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="activity-table">
        <thead>
          <tr>
            <th scope="col">Started</th>
            <th scope="col">Status</th>
            <th scope="col">Rows</th>
            <th scope="col">Trigger</th>
            <th scope="col">Correlation</th>
            <th scope="col">Message</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>{formatWhen(run.startedAt)}</td>
              <td>
                <StatusPill status={run.status} />
              </td>
              <td className="num">{run.rowsSynced.toLocaleString()}</td>
              <td>{run.trigger}</td>
              <td className="mono">{run.correlationId}</td>
              <td className="msg">{run.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
