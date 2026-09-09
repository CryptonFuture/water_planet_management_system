import { useEffect, useState } from 'react';
import {
  getQualityRecords,
  createQualityRecord,
  getPlants,
  analyzeQuality,
} from '../services/api';

import {
  Plus,
  X,
  Sparkles,
  Droplets,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Thermometer,
  FlaskConical,
  Gauge,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';

import '../css/Quality.css';

export default function Quality() {
  const [records, setRecords] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [form, setForm] = useState({
    plant: '',
    parameters: {
      ph: 7.0,
      turbidity: 2,
      chlorine: 0.5,
      tds: 300,
      temperature: 25,
      dissolvedOxygen: 6,
    },
  });

  const load = () => {
    Promise.all([getQualityRecords(), getPlants()])
      .then(([q, p]) => {
        setRecords(q.data.data);
        setPlants(p.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createQualityRecord(form);
      setShowModal(false);
      setAnalysis(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);

    try {
      const res = await analyzeQuality({
        ph: form.parameters.ph,
        turbidity: form.parameters.turbidity,
        chlorine: form.parameters.chlorine,
        tds: form.parameters.tds,
        temperature: form.parameters.temperature,
        dissolved_oxygen: form.parameters.dissolvedOxygen,
      });

      setAnalysis(res.data);
    } catch (err) {
      alert(
        'Python analysis service may not be running. Start it on port 8000.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const statusConfig = {
    excellent: {
      label: 'Excellent',
      className: 'quality-status-success',
      icon: CheckCircle2,
    },
    good: {
      label: 'Good',
      className: 'quality-status-success',
      icon: CheckCircle2,
    },
    acceptable: {
      label: 'Acceptable',
      className: 'quality-status-info',
      icon: Activity,
    },
    poor: {
      label: 'Poor',
      className: 'quality-status-warning',
      icon: AlertTriangle,
    },
    critical: {
      label: 'Critical',
      className: 'quality-status-danger',
      icon: AlertTriangle,
    },
  };

  const statusBadge = (status) => {
    const config = statusConfig[status] || {
      label: status || 'Unknown',
      className: 'quality-status-gray',
      icon: Activity,
    };

    const Icon = config.icon;

    return (
      <span className={`quality-status ${config.className}`}>
        <Icon size={13} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="quality-loading">
        <div className="quality-loading-icon">
          <Droplets size={25} />
        </div>

        <span>Loading water quality data...</span>

        <div className="quality-loading-bar">
          <span />
        </div>
      </div>
    );
  }

  const excellentCount = records.filter(
    (r) => r.status === 'excellent'
  ).length;

  const criticalCount = records.filter(
    (r) => r.status === 'critical'
  ).length;

  const poorCount = records.filter(
    (r) => r.status === 'poor'
  ).length;

  return (
    <div className="quality-page">

      {/* Header */}
      <div className="quality-header">
        <div className="quality-header-left">
          <div className="quality-title-icon">
            <Droplets size={23} />
          </div>

          <div>
            <h2>Water Quality Monitoring</h2>
            <p>
              Monitor and analyze water quality parameters
            </p>
          </div>
        </div>

        <button
          className="quality-add-btn"
          onClick={() => {
            setShowModal(true);
            setAnalysis(null);
          }}
        >
          <Plus size={17} />
          Add Record
        </button>
      </div>

      {/* Summary */}
      <div className="quality-summary">

        <div className="quality-summary-card">
          <div className="quality-summary-icon blue">
            <Activity size={19} />
          </div>

          <div>
            <span>Total Records</span>
            <strong>{records.length}</strong>
          </div>
        </div>

        <div className="quality-summary-card">
          <div className="quality-summary-icon green">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Excellent</span>
            <strong>{excellentCount}</strong>
          </div>
        </div>

        <div className="quality-summary-card">
          <div className="quality-summary-icon orange">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>Poor</span>
            <strong>{poorCount}</strong>
          </div>
        </div>

        <div className="quality-summary-card">
          <div className="quality-summary-icon red">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </div>

      </div>

      {/* Main Card */}
      <div className="quality-card">

        <div className="quality-card-header">
          <div>
            <div className="quality-card-title">
              <FlaskConical size={18} />
              Quality Records
            </div>

            <p>
              Latest water quality measurements from all plants
            </p>
          </div>

          <div className="quality-record-count">
            {records.length} Records
          </div>
        </div>

        {records.length === 0 ? (
          <div className="quality-empty">
            <div className="quality-empty-icon">
              <Droplets size={30} />
            </div>

            <h3>No Quality Records</h3>

            <p>
              Add a water quality record to start monitoring.
            </p>

            <button
              className="quality-empty-btn"
              onClick={() => {
                setShowModal(true);
                setAnalysis(null);
              }}
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        ) : (
          <div className="quality-table-container">
            <table className="quality-table">
              <thead>
                <tr>
                  <th>Plant</th>
                  <th>Status</th>
                  <th>pH</th>
                  <th>Turbidity</th>
                  <th>Chlorine</th>
                  <th>TDS</th>
                  <th>Source</th>
                  <th>Recorded</th>
                </tr>
              </thead>

              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>

                    {/* Plant */}
                    <td>
                      <div className="quality-plant-cell">
                        <div className="quality-row-icon">
                          <Droplets size={16} />
                        </div>

                        <div>
                          <strong>
                            {r.plant?.name || '—'}
                          </strong>

                          <small>Water Facility</small>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      {statusBadge(r.status)}
                    </td>

                    {/* pH */}
                    <td>
                      <div className="quality-metric">
                        <span className="quality-metric-value">
                          {r.parameters?.ph ?? '—'}
                        </span>

                        <span className="quality-unit">
                          pH
                        </span>
                      </div>
                    </td>

                    {/* Turbidity */}
                    <td>
                      <div className="quality-metric">
                        <span className="quality-metric-value">
                          {r.parameters?.turbidity ?? '—'}
                        </span>

                        <span className="quality-unit">
                          NTU
                        </span>
                      </div>
                    </td>

                    {/* Chlorine */}
                    <td>
                      <div className="quality-metric">
                        <span className="quality-metric-value">
                          {r.parameters?.chlorine ?? '—'}
                        </span>

                        <span className="quality-unit">
                          mg/L
                        </span>
                      </div>
                    </td>

                    {/* TDS */}
                    <td>
                      <div className="quality-metric">
                        <span className="quality-metric-value">
                          {r.parameters?.tds ?? '—'}
                        </span>

                        <span className="quality-unit">
                          mg/L
                        </span>
                      </div>
                    </td>

                    {/* Source */}
                    <td>
                      <span className="quality-source">
                        {r.source || '—'}
                      </span>
                    </td>

                    {/* Recorded */}
                    <td>
                      <div className="quality-date">
                        <Clock3 size={14} />

                        <span>
                          {new Date(
                            r.recordedAt
                          ).toLocaleString()}
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

      {/* Add Quality Modal */}
      {showModal && (
        <div
          className="quality-modal-overlay"
          onClick={() => {
            setShowModal(false);
            setAnalysis(null);
          }}
        >
          <div
            className="quality-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="quality-modal-header">

              <div className="quality-modal-title">
                <div className="quality-modal-icon">
                  <FlaskConical size={19} />
                </div>

                <div>
                  <h3>Add Quality Record</h3>
                  <p>
                    Enter water quality measurements
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="quality-modal-close"
                onClick={() => {
                  setShowModal(false);
                  setAnalysis(null);
                }}
              >
                <X size={19} />
              </button>

            </div>

            <form onSubmit={handleCreate}>

              <div className="quality-modal-body">

                {/* Plant */}
                <div className="quality-form-group">
                  <label>
                    Plant
                    <span>*</span>
                  </label>

                  <select
                    className="quality-form-control"
                    value={form.plant}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        plant: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select plant
                    </option>

                    {plants.map((p) => (
                      <option
                        key={p._id}
                        value={p._id}
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parameters */}
                <div className="quality-section-title">
                  Water Quality Parameters
                </div>

                <div className="quality-form-grid">

                  <div className="quality-form-group">
                    <label>pH</label>

                    <div className="quality-input-wrap">
                      <Gauge size={15} />

                      <input
                        type="number"
                        step="0.1"
                        className="quality-form-control"
                        value={form.parameters.ph}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            parameters: {
                              ...form.parameters,
                              ph: +e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="quality-form-group">
                    <label>Turbidity (NTU)</label>

                    <div className="quality-input-wrap">
                      <Activity size={15} />

                      <input
                        type="number"
                        step="0.1"
                        className="quality-form-control"
                        value={form.parameters.turbidity}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            parameters: {
                              ...form.parameters,
                              turbidity: +e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="quality-form-group">
                    <label>Chlorine (mg/L)</label>

                    <div className="quality-input-wrap">
                      <FlaskConical size={15} />

                      <input
                        type="number"
                        step="0.1"
                        className="quality-form-control"
                        value={form.parameters.chlorine}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            parameters: {
                              ...form.parameters,
                              chlorine: +e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="quality-form-group">
                    <label>TDS (mg/L)</label>

                    <div className="quality-input-wrap">
                      <Droplets size={15} />

                      <input
                        type="number"
                        className="quality-form-control"
                        value={form.parameters.tds}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            parameters: {
                              ...form.parameters,
                              tds: +e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="quality-form-group">
                    <label>Temperature (°C)</label>

                    <div className="quality-input-wrap">
                      <Thermometer size={15} />

                      <input
                        type="number"
                        className="quality-form-control"
                        value={form.parameters.temperature}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            parameters: {
                              ...form.parameters,
                              temperature: +e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="quality-form-group">
                    <label>Dissolved Oxygen</label>

                    <div className="quality-input-wrap">
                      <Activity size={15} />

                      <input
                        type="number"
                        step="0.1"
                        className="quality-form-control"
                        value={form.parameters.dissolvedOxygen}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            parameters: {
                              ...form.parameters,
                              dissolvedOxygen: +e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                </div>

                {/* AI Analysis */}
                <div className="quality-ai-box">

                  <div className="quality-ai-header">
                    <div className="quality-ai-icon">
                      <BrainCircuit size={19} />
                    </div>

                    <div>
                      <strong>AI Quality Analysis</strong>
                      <span>
                        Powered by Python analysis service
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="quality-analyze-btn"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    <Sparkles
                      size={16}
                      className={
                        analyzing
                          ? 'quality-spin'
                          : ''
                      }
                    />

                    {analyzing
                      ? 'Analyzing...'
                      : 'Analyze with AI'}
                  </button>

                </div>

                {/* Analysis Result */}
                {analysis && (
                  <div className="quality-analysis-result">

                    <div className="quality-analysis-top">

                      <div>
                        <span>AI Analysis Score</span>

                        <strong>
                          {analysis.overall_score}
                          <small>/100</small>
                        </strong>
                      </div>

                      {statusBadge(analysis.status)}

                    </div>

                    <div
                      className={`quality-safety ${
                        analysis.is_safe_for_drinking
                          ? 'safe'
                          : 'unsafe'
                      }`}
                    >
                      <ShieldCheck size={17} />

                      <div>
                        <span>
                          Drinking Water Safety
                        </span>

                        <strong>
                          {analysis.is_safe_for_drinking
                            ? 'Safe for drinking'
                            : 'Not safe for drinking'}
                        </strong>
                      </div>
                    </div>

                    {analysis.recommendations?.length > 0 && (
                      <div className="quality-recommendations">

                        <strong>
                          Recommendations
                        </strong>

                        <ul>
                          {analysis.recommendations.map(
                            (recommendation, index) => (
                              <li key={index}>
                                {recommendation}
                              </li>
                            )
                          )}
                        </ul>

                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="quality-modal-footer">

                <button
                  type="button"
                  className="quality-cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setAnalysis(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="quality-save-btn"
                >
                  <Plus size={16} />
                  Save Record
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

