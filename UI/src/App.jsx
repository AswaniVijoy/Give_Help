// App.jsx — from theme.docx App.jsx pattern
// Concepts:
//   createBrowserRouter    — data router (replaces BrowserRouter + Routes)
//   Layout routes          — MainLayout, AuthLayout, AdminLayout wrap child pages
//   Protected route        — guards admin-only and user-only pages
//   path: "*"              — 404 not found page

import { createBrowserRouter } from "react-router-dom";

import MainLayout   from "./layouts/MainLayout";
import AuthLayout   from "./layouts/AuthLayout";
import AdminLayout  from "./layouts/AdminLayout";
import Protected    from "./routes/Protected";

import Home           from "./pages/Home";
import Explore        from "./pages/Explore";
import CampaignDetail from "./pages/CampaignDetail";
import Donate         from "./pages/Donate";
import Profile        from "./pages/Profile";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import NotFoundPage   from "./pages/NotFoundPage";

import AdminDashboard  from "./admin/AdminDashboard";
import AdminCampaigns  from "./admin/AdminCampaigns";
import AdminDonations  from "./admin/AdminDonations";
import CreateCampaign  from "./admin/CreateCampaign";
import EditCampaign    from "./admin/EditCampaign";

export const router = createBrowserRouter([

  // ── Auth pages (no Navbar, but has ToastContainer) ──────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login",  element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },

  // ── Public pages (with Navbar) ───────────────────────────────────
  {
    element: <MainLayout />,
    children: [
      { path: "/",               element: <Home /> },
      { path: "/explore",        element: <Explore /> },
      { path: "/campaign/:id",   element: <CampaignDetail /> },
    ],
  },

  // ── Logged-in user only pages (with Navbar) ──────────────────────
  {
    element: <MainLayout />,
    children: [
      {
        element: <Protected />,        // any logged-in user
        children: [
          { path: "/donate/:id", element: <Donate /> },
          { path: "/profile",    element: <Profile /> },
        ],
      },
    ],
  },

  // ── Admin-only pages (Admin sidebar layout) ──────────────────────
  {
    element: <AdminLayout />,
    children: [
      {
        element: <Protected role="Admin" />,   // Admin role required
        children: [
          { path: "/admin/dashboard",          element: <AdminDashboard /> },
          { path: "/admin/campaigns",          element: <AdminCampaigns /> },
          { path: "/admin/donations",          element: <AdminDonations /> },
          { path: "/admin/create-campaign",    element: <CreateCampaign /> },
          { path: "/admin/edit-campaign/:id",  element: <EditCampaign /> },
        ],
      },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);
