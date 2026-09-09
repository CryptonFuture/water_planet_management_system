
import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

import {
  Factory,
  Droplets,
  Bell,
  Wrench,
  Beaker,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import '../css/Dashboard.css'

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loader">
          <RefreshCw size={22} />
        </div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-empty">
        <AlertTriangle size={30} />
        <h3>Unable to load dashboard</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  const { overview, recentQuality } = data;

  const stats = [
    {
      label: 'Total Plants',
      value: overview.totalPlants,
      icon: Factory,
      color: 'blue',
      sub: `${overview.operationalPlants} operational`,
      trend: 'Operational'
    },
    {
      label: 'Reservoirs',
      value: overview.totalReservoirs,
      icon: Droplets,
      color: 'green',
      sub: `${overview.lowReservoirs} low level`,
      trend: 'Capacity'
    },
    {
      label: 'Active Alerts',
      value: overview.activeAlerts,
      icon: Bell,
      color: 'red',
      sub: 'Need attention',
      trend: 'Monitor'
    },
    {
      label: 'Maintenance',
      value: overview.upcomingMaintenance,
      icon: Wrench,
      color: 'yellow',
      sub: 'Scheduled/In progress',
      trend: 'Upcoming'
    },
    {
      label: 'Low Chemicals',
      value: overview.lowChemicals,
      icon: Beaker,
      color: 'purple',
      sub: 'Restock needed',
      trend: 'Inventory'
    },
    {
      label: 'Active Users',
      value: overview.totalUsers,
      icon: Users,
      color: 'cyan',
      sub: 'System users',
      trend: 'Accounts'
    }
  ];

  const statusConfig = (status) => {
    const map = {
      excellent: {
        className: 'excellent',
        icon: <CheckCircle2 size={13} />,
        label: 'Excellent'
      },
      good: {
        className: 'good',
        icon: <CheckCircle2 size={13} />,
        label: 'Good'
      },
      acceptable: {
        className: 'acceptable',
        icon: <Activity size={13} />,
        label: 'Acceptable'
      },
      poor: {
        className: 'poor',
        icon: <AlertTriangle size={13} />,
        label: 'Poor'
      },
      critical: {
        className: 'critical',
        icon: <AlertTriangle size={13} />,
        label: 'Critical'
      }
    };

    return (
      map[status] || {
        className: 'unknown',
        icon: <Activity size={13} />,
        label: status || 'Unknown'
      }
    );
  };

  return (
    <div className="dashboard-page">

      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-heading-row">
            <h2>Dashboard Overview</h2>

            <span className="live-indicator">
              <span></span>
              Live
            </span>
          </div>

          <p>
            Monitor your water treatment operations and system activity.
          </p>
        </div>

        <div className="dashboard-status">
          <ShieldCheck size={17} />
          <span>System Operational</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid premium-stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className={`premium-stat-card ${s.color}`}
            >
              <div className="stat-card-top">
                <div className={`premium-stat-icon ${s.color}`}>
                  <Icon size={21} />
                </div>

                <span className="stat-trend">
                  <TrendingUp size={12} />
                  {s.trend}
                </span>
              </div>

              <div className="premium-stat-content">
                <span className="stat-label">
                  {s.label}
                </span>

                <strong className="stat-value">
                  {s.value}
                </strong>

                <span className="stat-sub">
                  {s.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="dashboard-content-grid">

        {/* Recent Water Quality */}
        <div className="dashboard-card quality-card">

          <div className="dashboard-card-header">
            <div className="card-heading">
              <div className="card-heading-icon blue">
                <Activity size={18} />
              </div>

              <div>
                <h3>Recent Water Quality</h3>
                <p>Latest quality monitoring records</p>
              </div>
            </div>

            <span className="records-badge">
              {recentQuality?.length || 0} Records
            </span>
          </div>

          <div className="dashboard-card-body">
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>PLANT</th>
                    <th>STATUS</th>
                    <th>pH LEVEL</th>
                    <th>TURBIDITY</th>
                    <th>RECORDED</th>
                  </tr>
                </thead>

                <tbody>
                  {recentQuality?.length ? (
                    recentQuality.map((q) => {
                      const status = statusConfig(q.status);

                      return (
                        <tr key={q._id}>

                          <td>
                            <div className="quality-plant">
                              <div className="plant-mini-icon">
                                <Factory size={15} />
                              </div>

                              <div>
                                <strong>
                                  {q.plant?.name || '—'}
                                </strong>
                                <span>Water Treatment Plant</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`quality-status ${status.className}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                          </td>

                          <td>
                            <div className="metric-value">
                              <strong>
                                {q.parameters?.ph ?? '—'}
                              </strong>

                              <span>pH</span>
                            </div>
                          </td>

                          <td>
                            <div className="metric-value">
                              <strong>
                                {q.parameters?.turbidity ?? '—'}
                              </strong>

                              <span>NTU</span>
                            </div>
                          </td>

                          <td>
                            <div className="record-time">
                              <Clock3 size={13} />

                              <span>
                                {new Date(
                                  q.recordedAt
                                ).toLocaleString()}
                              </span>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <div className="no-quality-data">
                          <Activity size={25} />
                          <span>No quality records available</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="dashboard-card tips-card">

          <div className="dashboard-card-header">
            <div className="card-heading">
              <div className="card-heading-icon purple">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h3>Quick Tips</h3>
                <p>Water quality recommendations</p>
              </div>
            </div>
          </div>

          <div className="tips-body">

            <div className="premium-tip info">
              <div className="tip-icon">
                <Activity size={17} />
              </div>

              <div>
                <strong>Monitor pH regularly</strong>

                <p>
                  Ideal range is 6.5 – 8.5 for drinking water.
                </p>
              </div>
            </div>

            <div className="premium-tip warning">
              <div className="tip-icon">
                <Droplets size={17} />
              </div>

              <div>
                <strong>Chlorine residual</strong>

                <p>
                  Maintain 0.2 – 1.0 mg/L residual chlorine.
                </p>
              </div>
            </div>

            <div className="premium-tip critical">
              <div className="tip-icon">
                <Beaker size={17} />
              </div>

              <div>
                <strong>Low stock alerts</strong>

                <p>
                  Check Chemicals section for items below minimum stock.
                </p>
              </div>
            </div>

            <div className="tips-footer">
              <CheckCircle2 size={15} />
              <span>Keep your monitoring routine up to date</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

