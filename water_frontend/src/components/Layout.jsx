
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  Factory,
  Droplets,
  Beaker,
  FlaskConical,
  Bell,
  Wrench,
  LogOut,
  User,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  CalendarDays,
} from 'lucide-react';

import { useState } from 'react';
import '../css/Layout.css';

const navItems = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/plants',
    icon: Factory,
    label: 'Water Plants',
  },
  {
    to: '/reservoirs',
    icon: Droplets,
    label: 'Reservoirs',
  },
  {
    to: '/quality',
    icon: FlaskConical,
    label: 'Water Quality',
  },
  {
    to: '/chemicals',
    icon: Beaker,
    label: 'Chemicals',
  },
  {
    to: '/maintenance',
    icon: Wrench,
    label: 'Maintenance',
  },
  {
    to: '/alerts',
    icon: Bell,
    label: 'Alerts',
  },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const currentDate = new Date().toLocaleDateString(
    'en-IN',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="premium-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="layout-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`premium-sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >

        {/* Logo */}
        <div className="premium-sidebar-header">

          <div className="premium-brand">
            <div className="premium-logo">
              <Droplets size={22} />
            </div>

            <div className="premium-brand-text">
              <h1>Water Plant</h1>
              <span>Management System</span>
            </div>
          </div>

          <button
            className="mobile-sidebar-close"
            onClick={closeMobileSidebar}
          >
            <X size={20} />
          </button>

        </div>

        {/* System Status */}
        <div className="sidebar-system-status">
          <div className="system-status-icon">
            <ShieldCheck size={15} />
          </div>

          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>

          <span className="online-dot" />
        </div>

        {/* Navigation */}
        <div className="sidebar-nav-label">
          MAIN MENU
        </div>

        <ul className="premium-nav-menu">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.to}
                className="premium-nav-item"
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `premium-nav-link ${
                      isActive ? 'active' : ''
                    }`
                  }
                >
                  <span className="nav-icon">
                    <Icon size={18} />
                  </span>

                  <span className="nav-label">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={15}
                    className="nav-arrow"
                  />
                </NavLink>
              </li>
            );
          })}

        </ul>

        {/* User Area */}
        <div className="premium-sidebar-footer">

          <div className="sidebar-user-card">

            <div className="sidebar-user-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : <User size={18} />}
            </div>

            <div className="sidebar-user-info">
              <strong>
                {user?.name || 'User'}
              </strong>

              <span>
                {user?.role || 'Administrator'}
              </span>
            </div>

            <div className="user-active-dot" />

          </div>

          <button
            onClick={handleLogout}
            className="premium-logout-btn"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          <div className="sidebar-version">
            <span>Water Plant CMS</span>
            <span>v1.0</span>
          </div>

        </div>

      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="premium-main">

        {/* Topbar */}
        <header className="premium-topbar">

          <div className="topbar-left">

            <button
              className="mobile-menu-btn"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={21} />
            </button>

            <div className="topbar-title">

              <div className="topbar-title-icon">
                <Droplets size={17} />
              </div>

              <div>
                <h2>
                  Water Plant Management
                </h2>

                <span>
                  Operations & Monitoring
                </span>
              </div>

            </div>

          </div>

          <div className="topbar-right">

            <div className="topbar-date">
              <CalendarDays size={15} />

              <span>
                {currentDate}
              </span>
            </div>

            <div className="topbar-user">

              <div className="topbar-avatar">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : <User size={16} />}
              </div>

            </div>

          </div>

        </header>

        {/* Page */}
        <div className="premium-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

