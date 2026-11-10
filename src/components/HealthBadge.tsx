import "./HealthBadge.css";

interface Props {
  health?: {
    status: "healthy" | "degraded" | "unknown";
    message: string;
  };
}

export function HealthBadge({ health }: Props) {
  const status = health?.status ?? "unknown";
  const label =
    status === "healthy"
      ? "Healthy"
      : status === "degraded"
        ? "Degraded"
        : "Unknown";

  return (
    <span className="health-wrap" title={health?.message}>
      <span className={`health-dot health-${status}`} aria-hidden />
      <span>{label}</span>
    </span>
  );
}
