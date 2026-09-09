
import { useEffect, useState } from 'react';
import {
  getAlerts,
  resolveAlert,
  markAlertRead
} from '../services/api';

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Clock3,
  Building2,
  BellRing,
  RefreshCw,
  Check
} from 'lucide-react';
import '../css/Alert.css'

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  const load = () => {
    setLoading(true);

    getAlerts({ resolved: 'false' })
      .then((r) => setAlerts(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleResolve = async (id) => {
    try {
      setResolving(id);
      await resolveAlert(id);
      load();
    } catch (err) {
      alert('Failed to resolve');
    } finally {
      setResolving(null);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAlertRead(id);

      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === id
            ? { ...alert, read: true }
            : alert
        )
      );
    } catch (err) {
      console.error('Failed to mark alert as read', err);
    }
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
      case 'emergency':
        return {
          className: 'critical',
          icon: <ShieldAlert size={21} />,
          badge: 'danger',
          label: severity
        };

      case 'warning':
        return {
          className: 'warning',
          icon: <AlertTriangle size={21} />,
          badge: 'warning',
          label: severity
        };

      default:
        return {
          className: 'info',
          icon: <Info size={21} />,
          badge: 'info',
          label: severity || 'info'
        };
    }
  };

  if (loading) {
    return (
      <div className="alerts-page">
        <div className="alerts-loading">
          <div className="alerts-loader">
            <RefreshCw size={22} />
          </div>
          <span>Loading alerts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-page">

      {/* Header */}
      <div className="alerts-header">
        <div className="alerts-title-section">
          <div className="alerts-title-icon">
            <BellRing size={22} />
          </div>

          <div>
            <h2>Active Alerts</h2>
            <p>
              Monitor and manage important water plant notifications
            </p>
          </div>
        </div>

        <div className="alerts-count">
          <span>{alerts.length}</span>
          <small>Active</small>
        </div>
      </div>

      {/* Empty state */}
      {alerts.length === 0 ? (
        <div className="alerts-empty">
          <div className="empty-icon">
            <CheckCircle2 size={38} />
          </div>

          <h3>All Clear</h3>

          <p>
            There are currently no active alerts.
            Your water plants are looking good.
          </p>

          <div className="empty-status">
            <Check size={15} />
            System operating normally
          </div>
        </div>
      ) : (
        <div className="alerts-list">

          {alerts.map((a) => {
            const severity = getSeverityConfig(a.severity);

            return (
              <div
                key={a._id}
                className={`alert-card ${severity.className} ${
                  a.read ? 'is-read' : ''
                }`}
              >
                {/* Severity indicator */}
                <div className="alert-severity-line"></div>

                {/* Icon */}
                <div className="alert-icon">
                  {severity.icon}
                </div>

                {/* Content */}
                <div className="alert-content">

                  <div className="alert-top">
                    <div className="alert-heading">
                      <h3>{a.title}</h3>

                      <span
                        className={`alert-badge ${severity.badge}`}
                      >
                        {severity.label}
                      </span>

                      {!a.read && (
                        <span className="unread-badge">
                          New
                        </span>
                      )}
                    </div>

                    <div className="alert-actions">
                      {!a.read && (
                        <button
                          type="button"
                          className="mark-read-btn"
                          onClick={() => handleMarkRead(a._id)}
                          title="Mark as read"
                        >
                          <Check size={16} />
                          <span>Mark read</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="resolve-btn"
                        onClick={() => handleResolve(a._id)}
                        disabled={resolving === a._id}
                      >
                        {resolving === a._id ? (
                          <>
                            <span className="mini-spinner"></span>
                            Resolving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            Resolve
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="alert-message">
                    {a.message}
                  </p>

                  {/* Metadata */}
                  <div className="alert-meta">

                    {a.plant?.name && (
                      <div className="alert-meta-item">
                        <Building2 size={14} />
                        <span>{a.plant.name}</span>
                      </div>
                    )}

                    <div className="alert-meta-item">
                      <Clock3 size={14} />
                      <span>
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {a.type && (
                      <div className="alert-meta-item alert-type">
                        <span>{a.type}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

