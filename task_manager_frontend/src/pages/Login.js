import React, { useState } from 'react';
import './Auth.css';

// PUBLIC_INTERFACE
/**
 * Login page for user sign-in.
 */
function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  // TODO: Connect to backend login service on submit.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login with service
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
          />
        </label>
        <button className="btn btn-block" type="submit">
          Sign In
        </button>
        <div className="auth-alt">
          Don&apos;t have an account? <a className="auth-link" href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
