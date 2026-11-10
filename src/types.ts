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

export interface OverviewData {
  lastRun: SyncRun | null;
  environment: string;
  connectionHealth: {
    status: "healthy" | "degraded" | "unknown";
    message: string;
  };
  totalRuns: number;
  rowsSyncedLastSuccess: number;
  schedulePlaceholder: string;
  nextScheduledUtc: string;
}

export interface MaskedConfig {
  credentialsFilePath: string;
  environment: string;
  sqlDw: {
    server: string;
    database: string;
    user: string;
    passwordMasked: string;
    options?: {
      encrypt?: boolean;
      trustServerCertificate?: boolean;
    };
  };
}

export type SyncMode = "auto" | "manual";
