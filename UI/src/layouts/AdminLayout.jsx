// AdminLayout.jsx — wraps all admin pages with the sidebar
// Concept: Layout with Outlet — all admin pages share the sidebar automatically

import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1">
        <Outlet />   {/* AdminDashboard, AdminCampaigns, etc. render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
