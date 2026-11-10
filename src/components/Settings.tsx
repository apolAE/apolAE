import type { MaskedConfig } from "../types";
import "./Settings.css";

interface Props {
  config: MaskedConfig | null;
  configError: string | null;
}

export function Settings({ config, configError }: Props) {
  if (configError) {
    return (
      <div className="settings">
        <p className="settings-error">{configError}</p>
      </div>
    );
  }

  if (!config) {
    return <p className="muted">Loading settings…</p>;
  }

  return (
    <div className="settings">
      <dl className="settings-list">
        <div>
          <dt>Credentials file</dt>
          <dd className="mono path">{config.credentialsFilePath}</dd>
        </div>
        <div>
          <dt>Server</dt>
          <dd>{config.sqlDw.server}</dd>
        </div>
        <div>
          <dt>Database</dt>
          <dd>{config.sqlDw.database}</dd>
        </div>
        <div>
          <dt>User</dt>
          <dd>{config.sqlDw.user}</dd>
        </div>
        <div>
          <dt>Password</dt>
          <dd className="masked">{config.sqlDw.passwordMasked}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>{config.environment}</dd>
        </div>
      </dl>
      <p className="settings-foot">
        Values are read server-side only. Passwords are never sent in full to
        the browser or written to the console.
      </p>
    </div>
  );
}
