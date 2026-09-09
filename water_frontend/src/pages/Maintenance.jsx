
import { useEffect, useState } from 'react';
import { getMaintenances } from '../services/api';
import {
  Wrench,
  CalendarDays,
  Building2,
  Settings2,
  UserRound,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  RefreshCw,
} from 'lucide-react';
import '../css/Maintenance.css'

export default function Maintenance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaintenances()
      .then((r) => setItems(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    scheduled: {
      label: 'Scheduled',
      className: 'maintenance-status-info',
      icon: CalendarDays,
    },
    in_progress: {
      label: 'In Progress',
      className: 'maintenance-status-warning',
      icon: RefreshCw,
    },
    completed: {
      label: 'Completed',
      className: 'maintenance-status-success',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Cancelled',
      className: 'maintenance-status-gray',
      icon: CircleDot,
    },
    overdue: {
      label: 'Overdue',
      className: 'maintenance-status-danger',
      icon: AlertTriangle,
    },
  };

  const priorityConfig = {
    low: {
      label: 'Low',
      className: 'maintenance-priority-low',
    },
    medium: {
      label: 'Medium',
      className: 'maintenance-priority-medium',
    },
    high: {
      label: 'High',
      className: 'maintenance-priority-high',
    },
    critical: {
      label: 'Critical',
      className: 'maintenance-priority-critical',
    },
  };

  const statusBadge = (status) => {
    const config = statusConfig[status] || {
      label: status?.replace('_', ' ') || 'Unknown',
      className: 'maintenance-status-gray',
      icon: CircleDot,
    };

    const Icon = config.icon;

    return (
      <span className={`maintenance-status ${config.className}`}>
        <Icon size={13} />
        {config.label}
      </span>
    );
  };

  const priorityBadge = (priority) => {
    const config = priorityConfig[priority] || {
      label: priority || 'Unknown',
      className: 'maintenance-priority-low',
    };

    return (
      <span className={`maintenance-priority ${config.className}`}>
        <span className="priority-dot" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="maintenance-loading">
        <div className="maintenance-loading-icon">
          <Wrench size={24} />
        </div>
        <div className="maintenance-loading-text">
          Loading maintenance schedule...
        </div>
        <div className="maintenance-loading-bar">
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="maintenance-page">

      {/* Header */}
      <div className="maintenance-header">
        <div className="maintenance-header-left">
          <div className="maintenance-title-icon">
            <Wrench size={23} />
          </div>

          <div>
            <h2>Maintenance Schedule</h2>
            <p>
              Manage and monitor plant equipment maintenance
            </p>
          </div>
        </div>

        <div className="maintenance-header-badge">
          <span className="maintenance-live-dot" />
          {items.length} {items.length === 1 ? 'Task' : 'Tasks'}
        </div>
      </div>

      {/* Summary */}
      <div className="maintenance-summary">

        <div className="maintenance-summary-card">
          <div className="maintenance-summary-icon blue">
            <CalendarDays size={19} />
          </div>
          <div>
            <span>Total Schedule</span>
            <strong>{items.length}</strong>
          </div>
        </div>

        <div className="maintenance-summary-card">
          <div className="maintenance-summary-icon orange">
            <Clock3 size={19} />
          </div>
          <div>
            <span>In Progress</span>
            <strong>
              {items.filter((m) => m.status === 'in_progress').length}
            </strong>
          </div>
        </div>

        <div className="maintenance-summary-card">
          <div className="maintenance-summary-icon green">
            <CheckCircle2 size={19} />
          </div>
          <div>
            <span>Completed</span>
            <strong>
              {items.filter((m) => m.status === 'completed').length}
            </strong>
          </div>
        </div>

        <div className="maintenance-summary-card">
          <div className="maintenance-summary-icon red">
            <AlertTriangle size={19} />
          </div>
          <div>
            <span>Critical</span>
            <strong>
              {items.filter((m) => m.priority === 'critical').length}
            </strong>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="maintenance-card">

        <div className="maintenance-card-header">
          <div>
            <div className="maintenance-card-title">
              <Wrench size={18} />
              Maintenance Tasks
            </div>
            <p>Upcoming and ongoing maintenance activities</p>
          </div>

          <div className="maintenance-record-count">
            {items.length} Records
          </div>
        </div>

        {items.length === 0 ? (
          <div className="maintenance-empty">
            <div className="maintenance-empty-icon">
              <Wrench size={30} />
            </div>
            <h3>No Maintenance Records</h3>
            <p>
              There are currently no maintenance tasks available.
            </p>
          </div>
        ) : (
          <div className="maintenance-table-container">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Maintenance</th>
                  <th>Plant</th>
                  <th>Equipment</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Scheduled</th>
                  <th>Assigned To</th>
                </tr>
              </thead>

              <tbody>
                {items.map((m) => (
                  <tr key={m._id}>

                    {/* Title */}
                    <td>
                      <div className="maintenance-title-cell">
                        <div className="maintenance-row-icon">
                          <Wrench size={16} />
                        </div>

                        <div>
                          <strong>{m.title}</strong>
                          <small>
                            Maintenance Task
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* Plant */}
                    <td>
                      <div className="maintenance-info-cell">
                        <Building2 size={15} />
                        <span>{m.plant?.name || '—'}</span>
                      </div>
                    </td>

                    {/* Equipment */}
                    <td>
                      <div className="maintenance-info-cell">
                        <Settings2 size={15} />
                        <span>{m.equipment || '—'}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="maintenance-type">
                        {m.type
                          ? m.type.replace('_', ' ')
                          : '—'}
                      </span>
                    </td>

                    {/* Priority */}
                    <td>
                      {priorityBadge(m.priority)}
                    </td>

                    {/* Status */}
                    <td>
                      {statusBadge(m.status)}
                    </td>

                    {/* Scheduled */}
                    <td>
                      <div className="maintenance-date">
                        <CalendarDays size={14} />
                        <span>
                          {m.scheduledDate
                            ? new Date(
                                m.scheduledDate
                              ).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>
                    </td>

                    {/* Assigned */}
                    <td>
                      <div className="maintenance-assigned">
                        <div className="maintenance-user-icon">
                          <UserRound size={14} />
                        </div>

                        <span>
                          {m.assignedTo?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

