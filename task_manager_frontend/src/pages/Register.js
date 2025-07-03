import React, { useState } from 'react';
import './Auth.css';

// PUBLIC_INTERFACE
/**
 * Register page for user sign-up.
 */
function Register() {
  const [form, setForm] = useState({ email: '', password: '' });

  // TODO: Connect to backend register service on submit.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle registration with service
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
          />
        </label>
        <button className="btn btn-block" type="submit">
          Create Account
        </button>
        <div className="auth-alt">
          Already have an account? <a className="auth-link" href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}

export default Register;
