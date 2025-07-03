import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskEdit from './pages/TaskEdit';
import { AuthProvider, useAuth } from './services/auth';

// PUBLIC_INTERFACE
/**
 * ProtectedRoute - for guarding routes that require authentication.
 * Redirects to /login if user is not authenticated.
 */
function ProtectedRoute({ redirectTo = "/login" }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or spinner
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

// PUBLIC_INTERFACE
/**
 * App - Main entry point for the Task Manager React frontend.
 * Handles AuthProvider, theme provider, and routing for authentication and dashboard.
 */
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Theme toggle is global and visible on all pages */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />} />
            {/* Protected Dashboard Pages */}
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/new" element={<TaskEdit />} />
              <Route path="/tasks/:id/edit" element={<TaskEdit />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
            </Route>
            {/* Default route: redirect to tasks list */}
            <Route path="/" element={<Navigate to="/tasks" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
