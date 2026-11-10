import type { RunStatus } from "../types";
import "./StatusPill.css";

const labels: Record<RunStatus, string> = {
  success: "Success",
  failed: "Failed",
  running: "Running",
  skipped: "Skipped",
};

export function StatusPill({ status }: { status: RunStatus }) {
  return (
    <span className={`pill pill-${status}`}>{labels[status]}</span>
  );
}
