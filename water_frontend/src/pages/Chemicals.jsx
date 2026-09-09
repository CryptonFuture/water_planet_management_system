
import { useEffect, useState } from 'react';
import { getChemicals } from '../services/api';

import {
  FlaskConical,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  Building2,
  Boxes,
  RefreshCw
} from 'lucide-react';
import '../css/Chemicals.css'

export default function Chemicals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChemicals()
      .then((r) => setItems(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = (status) => {
    const map = {
      available: {
        className: 'available',
        icon: <CheckCircle2 size={14} />,
        label: 'Available'
      },
      low: {
        className: 'low',
        icon: <AlertTriangle size={14} />,
        label: 'Low Stock'
      },
      out_of_stock: {
        className: 'out',
        icon: <XCircle size={14} />,
        label: 'Out of Stock'
      },
      expired: {
        className: 'expired',
        icon: <Clock3 size={14} />,
        label: 'Expired'
      }
    };

    return (
      map[status] || {
        className: 'unknown',
        icon: <Package size={14} />,
        label: status?.replace('_', ' ') || 'Unknown'
      }
    );
  };

  const getStockPercentage = (quantity, minStock) => {
    if (!minStock || minStock <= 0) return 100;

    return Math.min(
      100,
      Math.round((quantity / (minStock * 2)) * 100)
    );
  };

  if (loading) {
    return (
      <div className="chemicals-page">
        <div className="chemicals-loading">
          <div className="chemicals-loader">
            <RefreshCw size={22} />
          </div>
          <span>Loading chemical inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chemicals-page">

      {/* Header */}
      <div className="chemicals-header">
        <div className="chemicals-title">
          <div className="chemicals-title-icon">
            <FlaskConical size={23} />
          </div>

          <div>
            <h2>Chemical Inventory</h2>
            <p>
              Monitor chemicals, stock levels and plant inventory
            </p>
          </div>
        </div>

        <div className="inventory-summary">
          <div className="summary-icon">
            <Boxes size={17} />
          </div>

          <div>
            <strong>{items.length}</strong>
            <span>Total Items</span>
          </div>
        </div>
      </div>

      {/* Inventory Card */}
      <div className="chemical-card">

        <div className="chemical-card-header">
          <div>
            <h3>Inventory Overview</h3>
            <p>
              Current chemical stock across all treatment plants
            </p>
          </div>

          <div className="inventory-count">
            {items.length} Items
          </div>
        </div>

        {items.length === 0 ? (
          <div className="chemical-empty">
            <div className="chemical-empty-icon">
              <FlaskConical size={32} />
            </div>

            <h3>No Chemicals Found</h3>

            <p>
              There are currently no chemicals available
              in the inventory.
            </p>
          </div>
        ) : (
          <div className="chemical-table-wrapper">
            <table className="chemical-table">
              <thead>
                <tr>
                  <th>CHEMICAL</th>
                  <th>CATEGORY</th>
                  <th>QUANTITY</th>
                  <th>MIN. STOCK</th>
                  <th>PLANT</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {items.map((c) => {
                  const status = statusConfig(c.status);

                  const stockPercentage = getStockPercentage(
                    c.quantity,
                    c.minStock
                  );

                  return (
                    <tr key={c._id}>

                      {/* Chemical */}
                      <td>
                        <div className="chemical-name">
                          <div className="chemical-icon">
                            <FlaskConical size={17} />
                          </div>

                          <div>
                            <strong>{c.name}</strong>
                            <span>{c.code}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="category-pill">
                          {c.category?.replace('_', ' ') || '—'}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td>
                        <div className="quantity-cell">
                          <strong>
                            {c.quantity}
                          </strong>

                          <span>
                            {c.unit}
                          </span>
                        </div>

                        <div className="stock-progress">
                          <div
                            className={`stock-progress-bar ${status.className}`}
                            style={{
                              width: `${stockPercentage}%`
                            }}
                          ></div>
                        </div>
                      </td>

                      {/* Minimum Stock */}
                      <td>
                        <div className="min-stock">
                          <Package size={14} />
                          <span>
                            {c.minStock} {c.unit}
                          </span>
                        </div>
                      </td>

                      {/* Plant */}
                      <td>
                        {c.plant?.name ? (
                          <div className="plant-cell">
                            <Building2 size={15} />
                            <span>{c.plant.name}</span>
                          </div>
                        ) : (
                          <span className="no-data">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`chemical-status ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

