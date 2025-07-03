import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { useAuth } from '../services/auth';

// PUBLIC_INTERFACE
/**
 * Login page for user sign-in, connected to AuthContext.
 */
function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password);
    // Auth redirect handled by useEffect on success
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Login</h1>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </label>
        {error && <div style={{color: "#c00", fontSize: "0.98rem"}}>{error}</div>}
        <button className="btn btn-block" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="auth-alt">
          Don&apos;t have an account? <a className="auth-link" href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
