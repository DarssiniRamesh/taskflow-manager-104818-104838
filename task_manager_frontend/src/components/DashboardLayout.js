import React from 'react';
import './DashboardLayout.css';

// PUBLIC_INTERFACE
/**
 * DashboardLayout component that provides the sidebar, topbar, and main content integration.
 * @param {object} props - React props (expects children, optional title)
 * @returns Dashboard layout with navigation sidebar, topbar and main area.
 */
function DashboardLayout({ children, title }) {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">Task Manager</h2>
        <nav>
          <ul className="dashboard-nav">
            <li><a href="/tasks">Tasks</a></li>
            <li><a href="/tasks/new">Create Task</a></li>
          </ul>
        </nav>
      </aside>
      <div className="dashboard-main-area">
        <header className="dashboard-topbar">
          {title && <span className="dashboard-header-title">{title}</span>}
          <div className="dashboard-user-controls">
            <a href="/profile" className="dashboard-account">Account</a>
            <a href="/logout" className="dashboard-logout">Logout</a>
          </div>
        </header>
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
