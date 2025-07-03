/**
 * API service for backend interaction.
 * Handles HTTP methods and API endpoints for authentication and tasks.
 *
 * Centralizes ALL task-related network interaction here for consistency.
 */

const API_ROOT = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';

//////// Helper for auth header ////////
/**
 * Prepares headers with Authorization if JWT token provided.
 */
function authHeaders(token, extra = {}) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

///////// AUTH ENDPOINTS /////////

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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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

///////// TASK CRUD - all endpoints require JWT /////////

// PUBLIC_INTERFACE
/**
 * Fetches the list of all tasks for authenticated user.
 * @param {string} token - JWT token
 * @returns {Promise<{tasks?: array, error?: string}>}
 */
export async function fetchTasks(token) {
  try {
    const res = await fetch(`${API_ROOT}/tasks`, {
      headers: authHeaders(token),
    });
    if (!res.ok) {
      let msg = "Failed loading tasks";
      try {
        const d = await res.json();
        msg = d.detail || msg;
      } catch { /* ignore */ }
      return { error: msg };
    }
    const data = await res.json();
    return { tasks: data };
  } catch {
    return { error: "Network error" };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetches a single task by ID.
 * @param {string|number} id - task ID
 * @param {string} token - JWT
 * @returns {Promise<{task?: object, error?: string}>}
 */
export async function getTask(id, token) {
  try {
    const res = await fetch(`${API_ROOT}/tasks/${id}`, {
      headers: authHeaders(token),
    });
    if (!res.ok) {
      let msg = "Task not found";
      try {
        const d = await res.json();
        msg = d.detail || msg;
      } catch { /* ignore */ }
      return { error: msg };
    }
    const data = await res.json();
    return { task: data };
  } catch {
    return { error: "Network error" };
  }
}

// PUBLIC_INTERFACE
/**
 * Creates a new task, returns saved task or error.
 * @param {object} data - {title, description, due_date, completed}
 * @param {string} token
 * @returns {Promise<{task?: object, error?: string}>}
 */
export async function createTask(data, token) {
  try {
    const res = await fetch(`${API_ROOT}/tasks`, {
      method: "POST",
      headers: authHeaders(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const d = await res.json();
    if (!res.ok) {
      return { error: d.detail || "Could not create task" };
    }
    return { task: d };
  } catch {
    return { error: "Network error" };
  }
}

// PUBLIC_INTERFACE
/**
 * Updates a task (PATCH).
 * @param {string|number} id
 * @param {object} data
 * @param {string} token
 * @returns {Promise<{task?: object, error?: string}>}
 */
export async function updateTask(id, data, token) {
  try {
    const res = await fetch(`${API_ROOT}/tasks/${id}`, {
      method: "PATCH",
      headers: authHeaders(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const d = await res.json();
    if (!res.ok) {
      return { error: d.detail || "Could not update task" };
    }
    return { task: d };
  } catch {
    return { error: "Network error" };
  }
}

// PUBLIC_INTERFACE
/**
 * Deletes a task.
 * @param {string|number} id
 * @param {string} token
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export async function deleteTask(id, token) {
  try {
    const res = await fetch(`${API_ROOT}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!res.ok) {
      let msg = "Delete failed";
      try {
        const d = await res.json();
        msg = d.detail || msg;
      } catch { /* ignore */ }
      return { error: msg };
    }
    return { success: true };
  } catch {
    return { error: "Network error" };
  }
}

