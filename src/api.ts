import type { MaskedConfig, OverviewData, SyncRun } from "./types";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? `Request failed: ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export function fetchOverview(): Promise<OverviewData> {
  return fetchJson<OverviewData>("/api/overview");
}

export function fetchRuns(): Promise<{ runs: SyncRun[] }> {
  return fetchJson<{ runs: SyncRun[] }>("/api/runs");
}

export function fetchMaskedConfig(): Promise<MaskedConfig> {
  return fetchJson<MaskedConfig>("/api/config/masked");
}

export function triggerRun(): Promise<{ run: SyncRun }> {
  return fetchJson<{ run: SyncRun }>("/api/runs/trigger", { method: "POST" });
}
