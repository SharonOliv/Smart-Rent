import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import * as api from "../utils/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "smartrent_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasListings, setHasListings] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .fetchMe()
      .then(({ user: u }) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (username, password) => {
    const { token: newToken, user: newUser } = await api.login({ username, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const signup = useCallback(async (payload) => {
    // EMAIL VERIFICATION (disabled): account was unverified until the email link was clicked, so no token was returned.
    // Now the account is active immediately; Signup.jsx calls login() right after.
    const data = await api.signup(payload);
    return data; // { message: "..." }
  }, []);

  // EMAIL VERIFICATION (disabled)
  // const verifyEmail = useCallback(async (verifyToken) => {
  //   const { token: newToken, user: newUser } = await api.verifyEmail(verifyToken);
  //   localStorage.setItem(TOKEN_KEY, newToken);
  //   setToken(newToken);
  //   setUser(newUser);
  //   return newUser;
  // }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

    const refreshListings = useCallback(async () => {
    try {
      const list = await api.fetchMyProperties();
      setHasListings(list.length > 0);
    } catch {
      // keep the last known value
    }
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (userId) refreshListings();
    else setHasListings(false);
  }, [userId, refreshListings]);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const { user: u } = await api.fetchMe();
    setUser(u);
    return u;
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        signup,
        // verifyEmail,   // EMAIL VERIFICATION (disabled)
        logout,
        refreshUser,
        setUser,
        hasListings,
        refreshListings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};