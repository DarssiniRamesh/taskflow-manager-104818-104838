import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskEdit from './pages/TaskEdit';

// PUBLIC_INTERFACE
/**
 * App - Main entry point for the Task Manager React frontend.
 * Handles theme provider and routing for authentication and dashboard.
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

  // Note: In production, user authentication state and protected routes would be handled here.
  return (
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
          {/* Dashboard Pages: normally wrapped with authenticated guard */}
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskEdit />} />
          <Route path="/tasks/:id/edit" element={<TaskEdit />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          {/* Default route: redirect to tasks list */}
          <Route path="/" element={<Navigate to="/tasks" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
