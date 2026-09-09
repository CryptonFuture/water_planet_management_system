
import { useEffect, useState } from 'react';
import { getPlants, createPlant } from '../services/api';
import {
  Plus,
  X,
  Factory,
  MapPin,
  Gauge,
  Activity,
  CheckCircle2,
  Wrench,
  PowerOff,
  Construction,
  Droplets,
} from 'lucide-react';
import '../css/Plants.css';

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    capacity: '',
    plantType: 'treatment',
    status: 'operational',
    description: '',
  });

  const load = () => {
    getPlants()
      .then((r) => setPlants(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createPlant({
        ...form,
        capacity: Number(form.capacity),
      });

      setShowModal(false);

      setForm({
        name: '',
        code: '',
        capacity: '',
        plantType: 'treatment',
        status: 'operational',
        description: '',
      });

      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create');
    }
  };

  const statusConfig = {
    operational: {
      label: 'Operational',
      className: 'plant-status-success',
      icon: CheckCircle2,
    },
    maintenance: {
      label: 'Maintenance',
      className: 'plant-status-warning',
      icon: Wrench,
    },
    offline: {
      label: 'Offline',
      className: 'plant-status-danger',
      icon: PowerOff,
    },
    under_construction: {
      label: 'Under Construction',
      className: 'plant-status-info',
      icon: Construction,
    },
  };

  const statusBadge = (status) => {
    const config = statusConfig[status] || {
      label: status?.replace('_', ' ') || 'Unknown',
      className: 'plant-status-gray',
      icon: Activity,
    };

    const Icon = config.icon;

    return (
      <span className={`plant-status ${config.className}`}>
        <Icon size={13} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="plants-loading">
        <div className="plants-loading-icon">
          <Factory size={25} />
        </div>

        <span>Loading water plants...</span>

        <div className="plants-loading-bar">
          <span />
        </div>
      </div>
    );
  }

  const operational = plants.filter(
    (p) => p.status === 'operational'
  ).length;

  const maintenance = plants.filter(
    (p) => p.status === 'maintenance'
  ).length;

  const offline = plants.filter(
    (p) => p.status === 'offline'
  ).length;

  const totalCapacity = plants.reduce(
    (sum, p) => sum + (Number(p.capacity) || 0),
    0
  );

  return (
    <div className="plants-page">

      {/* Header */}
      <div className="plants-header">
        <div className="plants-header-left">
          <div className="plants-title-icon">
            <Factory size={23} />
          </div>

          <div>
            <h2>Water Plants</h2>
            <p>
              Manage water treatment and distribution facilities
            </p>
          </div>
        </div>

        <button
          className="plants-add-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={17} />
          Add Plant
        </button>
      </div>

      {/* Summary Cards */}
      <div className="plants-summary">

        <div className="plants-summary-card">
          <div className="plants-summary-icon blue">
            <Factory size={19} />
          </div>

          <div>
            <span>Total Plants</span>
            <strong>{plants.length}</strong>
          </div>
        </div>

        <div className="plants-summary-card">
          <div className="plants-summary-icon green">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Operational</span>
            <strong>{operational}</strong>
          </div>
        </div>

        <div className="plants-summary-card">
          <div className="plants-summary-icon orange">
            <Wrench size={19} />
          </div>

          <div>
            <span>Maintenance</span>
            <strong>{maintenance}</strong>
          </div>
        </div>

        <div className="plants-summary-card">
          <div className="plants-summary-icon purple">
            <Gauge size={19} />
          </div>

          <div>
            <span>Total Capacity</span>
            <strong>{totalCapacity} MLD</strong>
          </div>
        </div>

      </div>

      {/* Main Table Card */}
      <div className="plants-card">

        <div className="plants-card-header">
          <div>
            <div className="plants-card-title">
              <Droplets size={18} />
              Plant Directory
            </div>

            <p>
              Overview of all registered water facilities
            </p>
          </div>

          <div className="plants-record-count">
            {plants.length} {plants.length === 1 ? 'Plant' : 'Plants'}
          </div>
        </div>

        {plants.length === 0 ? (
          <div className="plants-empty">
            <div className="plants-empty-icon">
              <Factory size={30} />
            </div>

            <h3>No Plants Found</h3>

            <p>
              Add your first water plant to get started.
            </p>

            <button
              className="plants-empty-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              Add Plant
            </button>
          </div>
        ) : (
          <div className="plants-table-container">
            <table className="plants-table">
              <thead>
                <tr>
                  <th>Plant</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Production</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>

              <tbody>
                {plants.map((p) => (
                  <tr key={p._id}>

                    {/* Plant */}
                    <td>
                      <div className="plant-name-cell">
                        <div className="plant-row-icon">
                          <Factory size={16} />
                        </div>

                        <div>
                          <strong>{p.name}</strong>
                          <small>Water Facility</small>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td>
                      <span className="plant-code">
                        {p.code}
                      </span>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="plant-type">
                        {p.plantType
                          ? p.plantType.replace('_', ' ')
                          : '—'}
                      </span>
                    </td>

                    {/* Capacity */}
                    <td>
                      <div className="plant-metric">
                        <Gauge size={14} />
                        <strong>{p.capacity ?? '—'}</strong>
                        <span>MLD</span>
                      </div>
                    </td>

                    {/* Production */}
                    <td>
                      <div className="plant-metric production">
                        <Activity size={14} />
                        <strong>
                          {p.currentProduction ?? '—'}
                        </strong>
                        <span>MLD</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      {statusBadge(p.status)}
                    </td>

                    {/* Location */}
                    <td>
                      <div className="plant-location">
                        <MapPin size={14} />

                        <span>
                          {p.location?.city || '—'}
                          {p.location?.state
                            ? `, ${p.location.state}`
                            : ''}
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

      {/* Add Plant Modal */}
      {showModal && (
        <div
          className="plants-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="plants-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="plants-modal-header">
              <div className="plants-modal-title">
                <div className="plants-modal-icon">
                  <Factory size={19} />
                </div>

                <div>
                  <h3>Add New Plant</h3>
                  <p>Create a new water facility</p>
                </div>
              </div>

              <button
                type="button"
                className="plants-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreate}>

              {/* Modal Body */}
              <div className="plants-modal-body">

                <div className="plants-form-section">
                  <div className="plants-form-section-title">
                    Basic Information
                  </div>

                  <div className="plants-form-row">

                    <div className="plants-form-group">
                      <label>
                        Plant Name
                        <span>*</span>
                      </label>

                      <input
                        className="plants-form-control"
                        placeholder="e.g. Karachi Water Plant"
                        value={form.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="plants-form-group">
                      <label>
                        Plant Code
                        <span>*</span>
                      </label>

                      <input
                        className="plants-form-control"
                        placeholder="e.g. KWP-001"
                        value={form.code}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            code: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                  </div>

                  <div className="plants-form-row">

                    <div className="plants-form-group">
                      <label>
                        Capacity (MLD)
                        <span>*</span>
                      </label>

                      <div className="plants-input-icon">
                        <Gauge size={16} />

                        <input
                          type="number"
                          min="0"
                          className="plants-form-control"
                          placeholder="e.g. 100"
                          value={form.capacity}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              capacity: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="plants-form-group">
                      <label>Plant Type</label>

                      <select
                        className="plants-form-control"
                        value={form.plantType}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            plantType: e.target.value,
                          })
                        }
                      >
                        <option value="treatment">
                          Treatment
                        </option>

                        <option value="distribution">
                          Distribution
                        </option>

                        <option value="desalination">
                          Desalination
                        </option>

                        <option value="wastewater">
                          Wastewater
                        </option>

                        <option value="combined">
                          Combined
                        </option>
                      </select>
                    </div>

                  </div>

                  <div className="plants-form-group">
                    <label>Description</label>

                    <textarea
                      className="plants-form-control"
                      rows={4}
                      placeholder="Enter plant description..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="plants-modal-footer">

                <button
                  type="button"
                  className="plants-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="plants-create-btn"
                >
                  <Plus size={16} />
                  Create Plant
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

