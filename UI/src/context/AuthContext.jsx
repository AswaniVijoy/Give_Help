// AuthContext.jsx — from theme.docx context/AuthContext.jsx pattern
// Concepts: createContext, useContext, useCallback, useMemo, useEffect, useState

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // useCallback — memoizes fetchProfile so it doesn't re-create on every render
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setProfile(null); return; }

      const res = await fetch("/api/user/profile", {
        headers: { Authorization: token },
        credentials: "include",
      });

      if (!res.ok) { setProfile(null); return; }

      const data = await res.json();
      setProfile({
        username: data.UserName,
        email: data.Email,
        userRole: data.UserRole,
      });
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run fetchProfile once on mount
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Prevent stale page from showing after browser back after logout (theme pattern)
  useEffect(() => {
    const onPageShow = (e) => { if (e.persisted) fetchProfile(); };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [fetchProfile]);

  // useCallback — login function memoized
  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/user/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.msg || "Invalid Credentials!");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
    await fetchProfile();
  }, [fetchProfile]);

  // useCallback — logout function memoized
  const logout = useCallback(async () => {
    await fetch("/api/user/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setProfile(null);
  }, []);

  // useMemo — context value only re-computes when dependencies change
  const value = useMemo(() => ({
    profile,
    loading,
    login,
    logout,
    refresh: fetchProfile,
    isAdmin: profile?.userRole === "Admin",
  }), [profile, loading, login, logout, fetchProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — useAuth (from theme.docx pattern)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
