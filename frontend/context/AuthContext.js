'use client';

// ------------------------------------------------------------
// AuthContext — login / signup / logout, token in localStorage.
// Restores the session on page load via GET /api/auth/me.
// ------------------------------------------------------------

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup as apiSignup, login as apiLogin, fetchMe } from '../lib/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'libaas-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session once on mount
  useEffect(() => {
    async function restore() {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;
        const me = await fetchMe(token);
        setUser(me);
      } catch {
        // Bad / expired token — drop it quietly
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  function saveSession(token, profile) {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(profile);
  }

  async function signup(data) {
    const res = await apiSignup(data);
    saveSession(res.token, res.user);
    return res.user;
  }

  async function login(data) {
    const res = await apiLogin(data);
    saveSession(res.token, res.user);
    return res.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push('/');
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
