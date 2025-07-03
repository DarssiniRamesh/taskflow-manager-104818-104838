/**
 * API service for backend interaction.
 * Handles HTTP methods and API endpoints for authentication and tasks.
 */

const API_ROOT = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';

// PUBLIC_INTERFACE
/**
 * Logs in user via backend API.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token?: string, error?: string}>}
 */
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_ROOT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.detail || "Login failed" };
    }
    return { token: data.access_token };
  } catch (err) {
    return { error: "Network error" };
  }
}

// PUBLIC_INTERFACE
/**
 * Registers new user via backend API.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token?: string, error?: string}>}
 */
export async function registerUser(email, password) {
  try {
    const res = await fetch(`${API_ROOT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.detail || "Registration failed" };
    }
    return { token: data.access_token };
  } catch (err) {
    return { error: "Network error" };
  }
}

