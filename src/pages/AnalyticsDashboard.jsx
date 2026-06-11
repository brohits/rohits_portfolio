import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "portfolio-analytics-key";
const DEFAULT_PASSWORD = "9589";

function StatCard({ label, value }) {
  return (
    <article className="analytics-stat">
      <p className="analytics-stat-label">{label}</p>
      <p className="analytics-stat-value">{value}</p>
    </article>
  );
}

function DataTable({ title, rows, emptyText = "No data yet" }) {
  return (
    <section className="analytics-panel">
      <h2 className="analytics-panel-title">{title}</h2>
      {rows.length ? (
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${title}-${row.name}`}>
                <td>{row.name}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="analytics-empty">{emptyText}</p>
      )}
    </section>
  );
}

export function AnalyticsDashboard() {
  const [password, setPassword] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) || ""
  );
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async (key) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analytics", {
        headers: { "X-Analytics-Key": key },
      });

      if (!response.ok) {
        let message = response.status === 401 ? "Wrong password" : "Failed to load";
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          /* ignore parse errors */
        }
        throw new Error(`${message} (${response.status})`);
      }

      const payload = await response.json();
      setData(payload);
    } catch (err) {
      setError(err.message || "Could not load analytics");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (password) {
      fetchAnalytics(password);
    }
  }, [password, fetchAnalytics]);

  const handleLogin = (event) => {
    event.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, input.trim());
    setPassword(input.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword("");
    setInput("");
    setData(null);
  };

  const handleClear = async () => {
    if (!window.confirm("Delete all analytics data?")) return;

    const response = await fetch("/api/analytics", {
      method: "DELETE",
      headers: { "X-Analytics-Key": password },
    });

    if (response.ok) {
      fetchAnalytics(password);
    }
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `portfolio-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!password) {
    return (
      <div className="analytics-page">
        <div className="analytics-login">
          <p className="analytics-eyebrow">Private dashboard</p>
          <h1>Portfolio analytics</h1>
          <p className="analytics-login-copy">
            See who visited your portfolio, which pages they opened, where they came
            from, and what they clicked.
          </p>
          <form className="analytics-login-form" onSubmit={handleLogin}>
            <label htmlFor="analytics-password">Password</label>
            <input
              id="analytics-password"
              type="password"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter dashboard password"
              autoComplete="current-password"
            />
            <button type="submit">Open dashboard</button>
          </form>
          <p className="analytics-hint">
            Default password: <code>{DEFAULT_PASSWORD}</code>
          </p>
          <Link to="/" className="analytics-back">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div className="analytics-page">
      <div className="analytics-shell">
        <header className="analytics-header">
          <div>
            <p className="analytics-eyebrow">Rohit portfolio insights</p>
            <h1>Visitor dashboard</h1>
            <p className="analytics-sub">
              Storage: <strong>{data?.storage || "…"}</strong>
              {data?.storageReady === false &&
                " — visits are not being saved until Blob is connected"}
              {data?.storage === "local" &&
                " — local file (development only)"}
            </p>
          </div>
          <div className="analytics-actions">
            <button type="button" onClick={() => fetchAnalytics(password)} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button type="button" onClick={handleExport} disabled={!data}>
              Export JSON
            </button>
            <button type="button" className="analytics-danger" onClick={handleClear}>
              Clear data
            </button>
            <button type="button" className="analytics-ghost" onClick={handleLogout}>
              Log out
            </button>
            <Link to="/" className="analytics-back">
              Portfolio
            </Link>
          </div>
        </header>

        {error && <p className="analytics-error">{error}</p>}

        {data?.storageWarning && (
          <div className="analytics-alert" role="status">
            <strong>Storage not connected.</strong> {data.storageWarning}
          </div>
        )}

        {summary && (
          <>
            <div className="analytics-stats">
              <StatCard label="Page views" value={summary.totals.pageViews} />
              <StatCard label="Clicks" value={summary.totals.clicks} />
              <StatCard label="Unique visitors" value={summary.totals.visitors} />
              <StatCard label="Sessions" value={summary.totals.sessions} />
            </div>

            <div className="analytics-grid">
              <DataTable title="Top pages" rows={summary.topPages} />
              <DataTable title="Top referrers" rows={summary.topReferrers} />
              <DataTable title="Top countries" rows={summary.topCountries} />
              <DataTable title="Top clicks" rows={summary.topClicks} />
              <DataTable title="Visits by day" rows={summary.visitsByDay} />
            </div>

            <section className="analytics-panel analytics-panel--wide">
              <h2 className="analytics-panel-title">Recent activity</h2>
              {summary.recent.length ? (
                <div className="analytics-recent-wrap">
                  <table className="analytics-table analytics-table--recent">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Page</th>
                        <th>Label</th>
                        <th>Referrer</th>
                        <th>Location</th>
                        <th>Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recent.map((event) => (
                        <tr key={event.id}>
                          <td>{new Date(event.timestamp).toLocaleString()}</td>
                          <td>{event.type}</td>
                          <td>{event.path}</td>
                          <td>{event.label || "—"}</td>
                          <td>{event.referrer || "Direct"}</td>
                          <td>
                            {[event.city, event.region, event.country]
                              .filter(Boolean)
                              .join(", ") || "Unknown"}
                          </td>
                          <td>
                            {event.device} · {event.browser}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="analytics-empty">No visits recorded yet. Share your portfolio link and check back.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
