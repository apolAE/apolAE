import { useCallback, useEffect, useState } from "react";
import type { SyncMode } from "../types";

const STORAGE_KEY = "sql-agent-sync-mode";

export function useSyncMode(): [SyncMode, (mode: SyncMode) => void] {
  const [mode, setModeState] = useState<SyncMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "manual" ? "manual" : "auto";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((next: SyncMode) => {
    setModeState(next);
  }, []);

  return [mode, setMode];
}
