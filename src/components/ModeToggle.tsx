import type { SyncMode } from "../types";
import "./ModeToggle.css";

interface Props {
  mode: SyncMode;
  onChange: (mode: SyncMode) => void;
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="mode-toggle">
      <p className="mode-desc">
        {mode === "auto"
          ? "Runs follow the schedule when the agent is deployed. Pilot UI stores preference only."
          : "Manual mode: you must click Run sync now to start a sync."}
      </p>
      <div className="mode-switch" role="group" aria-label="Sync mode">
        <button
          type="button"
          className={mode === "auto" ? "active" : ""}
          aria-pressed={mode === "auto"}
          onClick={() => onChange("auto")}
        >
          Auto
        </button>
        <button
          type="button"
          className={mode === "manual" ? "active" : ""}
          aria-pressed={mode === "manual"}
          onClick={() => onChange("manual")}
        >
          Manual
        </button>
      </div>
      <p className="mode-hint">Saved in this browser (localStorage).</p>
    </div>
  );
}
