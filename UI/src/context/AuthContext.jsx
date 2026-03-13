// AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        username:     data.UserName,
        email:        data.Email,
        userRole:     data.UserRole,
        // Store raw base64 string — Profile.jsx renders as data:image/jpeg;base64,...
        // No separate /avatar route needed at all
        avatarBase64: data.ProfilePicture || null,
      });
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    const onPageShow = (e) => { if (e.persisted) fetchProfile(); };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [fetchProfile]);

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

  const logout = useCallback(async () => {
    await fetch("/api/user/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setProfile(null);
  }, []);

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}