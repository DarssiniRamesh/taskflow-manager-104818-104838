import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { useAuth } from '../services/auth';

// PUBLIC_INTERFACE
/**
 * Register page for user sign-up, connected to AuthContext.
 */
function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { register, error, loading, isAuthenticated } = useAuth();
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
    await register(form.email, form.password);
    // Redirect handled post-registration by isAuthenticated
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Register</h1>
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
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </label>
        {error && <div style={{color: "#c00", fontSize: "0.98rem"}}>{error}</div>}
        <button className="btn btn-block" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div className="auth-alt">
          Already have an account? <a className="auth-link" href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}

export default Register;
