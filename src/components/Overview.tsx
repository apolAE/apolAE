import type { OverviewData } from "../types";
import { HealthBadge } from "./HealthBadge";
import { StatusPill } from "./StatusPill";
import "./Overview.css";

interface Props {
  data: OverviewData | null;
  loading: boolean;
}

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function Overview({ data, loading }: Props) {
  if (loading && !data) {
    return <p className="muted">Loading overview…</p>;
  }

  const last = data?.lastRun;
  const rows =
    last?.status === "success"
      ? last.rowsSynced
      : (data?.rowsSyncedLastSuccess ?? 0);

  return (
    <dl className="overview-grid">
      <div className="overview-item">
        <dt>Last run</dt>
        <dd>
          {last ? (
            <span className="overview-last">
              <StatusPill status={last.status} />
              <span className="overview-time">{formatWhen(last.startedAt)}</span>
            </span>
          ) : (
            "No runs yet"
          )}
        </dd>
      </div>
      <div className="overview-item">
        <dt>Rows synced (last success)</dt>
        <dd className="overview-metric">{rows.toLocaleString()}</dd>
      </div>
      <div className="overview-item">
        <dt>Environment</dt>
        <dd>{data?.environment ?? "—"}</dd>
      </div>
      <div className="overview-item">
        <dt>Connection</dt>
        <dd>
          <HealthBadge health={data?.connectionHealth} />
        </dd>
      </div>
    </dl>
  );
}
