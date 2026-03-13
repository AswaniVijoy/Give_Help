// Protected.jsx — from theme.docx routes/Protected.jsx
// Concept: Route guard using useAuth context + Navigate + Outlet
// Usage:
//   <Protected />           — any logged-in user
//   <Protected role="Admin" /> — admin only

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ role }) {
  const { loading, profile } = useAuth();

  // While checking auth, show loading
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  // Not logged in → redirect to login
  if (!profile) return <Navigate to="/login" replace />;

  // Logged in but wrong role → redirect to home
  if (role && profile.userRole !== role) return <Navigate to="/" replace />;

  // All checks passed — render the child route
  return <Outlet />;
}
