export type RunStatus = "success" | "failed" | "running" | "skipped";

export interface SyncRun {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  status: RunStatus;
  rowsSynced: number;
  trigger: "manual" | "scheduled" | "api";
  message: string;
  correlationId: string;
}

const seedRuns: SyncRun[] = [
  {
    id: "run-2026-11-09-1830",
    startedAt: "2026-11-09T18:30:00.000Z",
    finishedAt: "2026-11-09T18:32:14.000Z",
    status: "success",
    rowsSynced: 1240,
    trigger: "scheduled",
    message: "Pilot mock — DW→SharePoint sync not implemented",
    correlationId: "corr-8f3a2b1c",
  },
  {
    id: "run-2026-11-09-0630",
    startedAt: "2026-11-09T06:30:00.000Z",
    finishedAt: "2026-11-09T06:31:02.000Z",
    status: "success",
    rowsSynced: 1188,
    trigger: "scheduled",
    message: "Pilot mock — DW→SharePoint sync not implemented",
    correlationId: "corr-91d4e7f0",
  },
  {
    id: "run-2026-11-08-1830",
    startedAt: "2026-11-08T18:30:00.000Z",
    finishedAt: "2026-11-08T18:30:45.000Z",
    status: "failed",
    rowsSynced: 0,
    trigger: "manual",
    message: "Pilot mock failure — destination unreachable",
    correlationId: "corr-a2c5b8d1",
  },
];

let runs: SyncRun[] = [...seedRuns];

export function listRuns(): SyncRun[] {
  return [...runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
}

export function getLatestRun(): SyncRun | null {
  const sorted = listRuns();
  return sorted[0] ?? null;
}

export function simulateManualRun(): SyncRun {
  const now = new Date();
  const id = `run-${now.toISOString().replace(/[:.]/g, "-")}`;
  const correlationId = `corr-${crypto.randomUUID().slice(0, 8)}`;
  const rowsSynced = Math.floor(800 + Math.random() * 600);

  const run: SyncRun = {
    id,
    startedAt: now.toISOString(),
    finishedAt: new Date(now.getTime() + 1800).toISOString(),
    status: "success",
    rowsSynced,
    trigger: "manual",
    message: "Simulated sync completed (pilot — no DW or SharePoint call)",
    correlationId,
  };

  runs = [run, ...runs];
  return run;
}
