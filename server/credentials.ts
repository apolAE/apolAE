import fs from "node:fs";
import path from "node:path";

export interface SqlDwConfig {
  server: string;
  database: string;
  user: string;
  password: string;
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
  };
}

export interface CredentialsFile {
  sqlDw: SqlDwConfig;
  environment?: string;
}

const CREDENTIALS_PATH = path.resolve(
  process.cwd(),
  "config",
  "credentials.json",
);

export function getCredentialsPath(): string {
  return CREDENTIALS_PATH;
}

export function loadCredentials(): CredentialsFile | null {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      return null;
    }
    const raw = fs.readFileSync(CREDENTIALS_PATH, "utf8");
    return JSON.parse(raw) as CredentialsFile;
  } catch {
    return null;
  }
}

export function toMaskedConfig(creds: CredentialsFile) {
  return {
    credentialsFilePath: CREDENTIALS_PATH,
    environment: creds.environment ?? "unknown",
    sqlDw: {
      server: creds.sqlDw.server,
      database: creds.sqlDw.database,
      user: creds.sqlDw.user,
      passwordMasked: "••••••",
      options: creds.sqlDw.options,
    },
  };
}

export function checkConnectionHealth(creds: CredentialsFile | null): {
  status: "healthy" | "degraded" | "unknown";
  message: string;
} {
  if (!creds) {
    return {
      status: "unknown",
      message: "credentials.json not found — copy from config/credentials.example.json",
    };
  }
  const { server, database, user, password } = creds.sqlDw;
  if (!server || !database || !user || !password) {
    return {
      status: "degraded",
      message: "Incomplete SQL DW configuration in credentials file",
    };
  }
  // Pilot: validate shape only — no live SQL connection yet.
  return {
    status: "healthy",
    message: "Configuration loaded (connection not tested in pilot)",
  };
}
