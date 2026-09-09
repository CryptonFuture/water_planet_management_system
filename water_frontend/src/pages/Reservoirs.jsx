import { useEffect, useState } from 'react';
import {
  getReservoirs,
  updateReservoirLevel,
} from '../services/api';

import {
  Droplets,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Gauge,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';

import '../css/Reservoirs.css';

export default function Reservoirs() {
  const [reservoirs, setReservoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);

    getReservoirs()
      .then((r) => setReservoirs(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateLevel = async (id) => {
    const level = prompt('Enter new current level:');

    if (level === null || isNaN(level)) return;

    try {
      setUpdatingId(id);

      await updateReservoirLevel(id, Number(level));

      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusConfig = {
    normal: {
      label: 'Normal',
      className: 'reservoir-status-success',
      icon: CheckCircle2,
    },
    low: {
      label: 'Low',
      className: 'reservoir-status-warning',
      icon: AlertTriangle,
    },
    critical: {
      label: 'Critical',
      className: 'reservoir-status-danger',
      icon: AlertTriangle,
    },
    overflow: {
      label: 'Overflow',
      className: 'reservoir-status-info',
      icon: Waves,
    },
    maintenance: {
      label: 'Maintenance',
      className: 'reservoir-status-gray',
      icon: Activity,
    },
  };

  const statusBadge = (status) => {
    const config = statusConfig[status] || {
      label: status || 'Unknown',
      className: 'reservoir-status-gray',
      icon: Activity,
    };

    const Icon = config.icon;

    return (
      <span className={`reservoir-status ${config.className}`}>
        <Icon size={13} />
        {config.label}
      </span>
    );
  };

  const getBarClass = (pct, status) => {
    if (status === 'critical') return 'critical';
    if (status === 'low') return 'low';
    if (status === 'overflow') return 'overflow';
    if (pct > 70) return 'high';
    return 'normal';
  };

  const getLevelText = (pct, status) => {
    if (status === 'critical') return 'Critical level';
    if (status === 'low') return 'Low water level';
    if (status === 'overflow') return 'Overflow warning';
    if (pct >= 80) return 'High capacity';
    if (pct >= 50) return 'Healthy level';
    return 'Moderate level';
  };

  const totalReservoirs = reservoirs.length;

  const normalCount = reservoirs.filter(
    (r) => r.status === 'normal'
  ).length;

  const lowCount = reservoirs.filter(
    (r) => r.status === 'low'
  ).length;

  const criticalCount = reservoirs.filter(
    (r) => r.status === 'critical'
  ).length;

  if (loading) {
    return (
      <div className="reservoir-loading">
        <div className="reservoir-loading-icon">
          <Droplets size={25} />
        </div>

        <span>Loading reservoir data...</span>

        <div className="reservoir-loading-bar">
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="reservoir-page">

      {/* Header */}
      <div className="reservoir-header">
        <div className="reservoir-header-left">
          <div className="reservoir-title-icon">
            <Database size={23} />
          </div>

          <div>
            <h2>Reservoirs & Tanks</h2>
            <p>
              Monitor water levels and storage capacity
            </p>
          </div>
        </div>

        <button
          className="reservoir-refresh-btn"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="reservoir-summary">

        <div className="reservoir-summary-card">
          <div className="reservoir-summary-icon blue">
            <Database size={19} />
          </div>

          <div>
            <span>Total Reservoirs</span>
            <strong>{totalReservoirs}</strong>
          </div>
        </div>

        <div className="reservoir-summary-card">
          <div className="reservoir-summary-icon green">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Normal</span>
            <strong>{normalCount}</strong>
          </div>
        </div>

        <div className="reservoir-summary-card">
          <div className="reservoir-summary-icon orange">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>Low Level</span>
            <strong>{lowCount}</strong>
          </div>
        </div>

        <div className="reservoir-summary-card">
          <div className="reservoir-summary-icon red">
            <Activity size={19} />
          </div>

          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </div>

      </div>

      {/* Cards */}
      {!reservoirs.length ? (
        <div className="reservoir-empty">
          <div className="reservoir-empty-icon">
            <Database size={30} />
          </div>

          <h3>No Reservoirs Found</h3>

          <p>
            There are currently no reservoirs available to monitor.
          </p>

          <button
            className="reservoir-empty-btn"
            onClick={load}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      ) : (
        <div className="reservoir-grid">

          {reservoirs.map((r) => {
            const pct = r.capacity
              ? Math.round(
                  (r.currentLevel / r.capacity) * 100
                )
              : 0;

            const safePct = Math.max(
              0,
              Math.min(pct, 100)
            );

            const barClass = getBarClass(
              pct,
              r.status
            );

            return (
              <div
                key={r._id}
                className="reservoir-card"
              >

                {/* Card Top */}
                <div className="reservoir-card-top">

                  <div className="reservoir-name-area">
                    <div className="reservoir-card-icon">
                      <Droplets size={19} />
                    </div>

                    <div>
                      <h3>{r.name}</h3>

                      <p>
                        {r.plant?.name || 'Unknown Plant'}
                        <span>•</span>
                        {r.type?.replace('_', ' ') || 'Tank'}
                      </p>
                    </div>
                  </div>

                  {statusBadge(r.status)}
                </div>

                {/* Level */}
                <div className="reservoir-level-section">

                  <div className="reservoir-level-heading">
                    <div>
                      <span className="reservoir-label">
                        Current Level
                      </span>

                      <strong>
                        {r.currentLevel?.toLocaleString() || 0}
                        <small>
                          {' '}
                          /{' '}
                          {r.capacity?.toLocaleString() || 0}{' '}
                          {r.unit}
                        </small>
                      </strong>
                    </div>

                    <div className="reservoir-percentage">
                      {pct}%
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="reservoir-progress">
                    <div
                      className={`reservoir-progress-fill ${barClass}`}
                      style={{
                        width: `${safePct}%`,
                      }}
                    />
                  </div>

                  <div className="reservoir-progress-footer">
                    <span>
                      {getLevelText(pct, r.status)}
                    </span>

                    <span>
                      Capacity: {r.capacity?.toLocaleString() || 0}{' '}
                      {r.unit}
                    </span>
                  </div>

                </div>

                {/* Visual Tank */}
                <div className="reservoir-visual">

                  <div className="reservoir-visual-header">
                    <span>
                      <Gauge size={14} />
                      Storage Status
                    </span>

                    <span>{safePct}% filled</span>
                  </div>

                  <div className="reservoir-tank">
                    <div
                      className={`reservoir-water ${barClass}`}
                      style={{
                        height: `${safePct}%`,
                      }}
                    >
                      <div className="reservoir-wave wave-one" />
                      <div className="reservoir-wave wave-two" />
                    </div>

                    <div className="reservoir-tank-mark mark-25">
                      25%
                    </div>

                    <div className="reservoir-tank-mark mark-50">
                      50%
                    </div>

                    <div className="reservoir-tank-mark mark-75">
                      75%
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="reservoir-card-footer">

                  <div className="reservoir-status-text">
                    <span
                      className={`reservoir-status-dot ${barClass}`}
                    />

                    <span>
                      {getLevelText(pct, r.status)}
                    </span>
                  </div>

                  <button
                    className="reservoir-update-btn"
                    onClick={() =>
                      handleUpdateLevel(r._id)
                    }
                    disabled={updatingId === r._id}
                  >
                    {updatingId === r._id ? (
                      <>
                        <RefreshCw
                          size={15}
                          className="reservoir-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        Update Level
                        <ArrowUpRight size={15} />
                      </>
                    )}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

