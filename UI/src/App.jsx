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
import AdminProfile    from "./admin/AdminProfile";      // ← NEW
import CreateCampaign  from "./admin/CreateCampaign";
import EditCampaign    from "./admin/EditCampaign";

export const router = createBrowserRouter([

  // ── Auth pages ───────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login",  element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },

  // ── Public pages ─────────────────────────────────────────────────
  {
    element: <MainLayout />,
    children: [
      { path: "/",               element: <Home /> },
      { path: "/explore",        element: <Explore /> },
      { path: "/campaign/:id",   element: <CampaignDetail /> },
    ],
  },

  // ── Logged-in user pages ──────────────────────────────────────────
  {
    element: <MainLayout />,
    children: [
      {
        element: <Protected />,
        children: [
          { path: "/donate/:id", element: <Donate /> },
          { path: "/profile",    element: <Profile /> },
        ],
      },
    ],
  },

  // ── Admin-only pages ──────────────────────────────────────────────
  {
    element: <AdminLayout />,
    children: [
      {
        element: <Protected role="Admin" />,
        children: [
          { path: "/admin/dashboard",          element: <AdminDashboard /> },
          { path: "/admin/campaigns",          element: <AdminCampaigns /> },
          { path: "/admin/donations",          element: <AdminDonations /> },
          { path: "/admin/create-campaign",    element: <CreateCampaign /> },
          { path: "/admin/edit-campaign/:id",  element: <EditCampaign /> },
          { path: "/admin/profile",            element: <AdminProfile /> },  // ← NEW
        ],
      },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);