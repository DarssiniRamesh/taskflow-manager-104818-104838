import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from "./api";

// Key for localStorage
const TOKEN_KEY = "tm_jwt_token";

// PUBLIC_INTERFACE
/**
 * AuthContext provides authentication state (user, token), login/logout/register methods, and loading/error status.
 */
export const AuthContext = createContext();

/**
 * Returns token from localStorage (if any).
 */
function getTokenFromStorage() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Stores token to localStorage.
 * @param {string} token
 */
function setTokenToStorage(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes JWT from storage.
 */
function clearTokenFromStorage() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Extract user email or claims from JWT token (if available).
 * @param {string|null} token
 * @returns {string|null} user email or null
 */
function getUserEmailFromToken(token) {
  if (!token) return null;
  try {
    // JWT is in the format header.payload.signature (payload is base64 json)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || null;
  } catch {
    return null;
  }
}

/**
 * AuthProvider wraps app, provides login/logout/register and authentication state.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getTokenFromStorage());
  const [user, setUser] = useState(() =>
    getUserEmailFromToken(getTokenFromStorage())
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Whenever token changes, update user claim
  useEffect(() => {
    setUser(getUserEmailFromToken(token));
    if (token) setTokenToStorage(token);
    else clearTokenFromStorage();
  }, [token]);

  // PUBLIC_INTERFACE
  /**
   * Log in user with email/password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const res = await loginUser(email, password);
    setLoading(false);
    if (res.token) {
      setToken(res.token);
      return true;
    }
    setError(res.error);
    return false;
  };

  // PUBLIC_INTERFACE
  /**
   * Register new user (returns success boolean)
   */
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    const res = await registerUser(email, password);
    setLoading(false);
    if (res.token) {
      setToken(res.token);
      return true;
    }
    setError(res.error);
    return false;
  };

  // PUBLIC_INTERFACE
  /**
   * Logout user.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    clearTokenFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        login,
        logout,
        register,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use AuthContext values.
 */
export function useAuth() {
  return useContext(AuthContext);
}

