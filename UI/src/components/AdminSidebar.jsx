import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function AdminSidebar() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/login", { replace: true });
  };

  const active = (path) =>
    location.pathname === path ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-64 bg-white border-r p-6 hidden lg:flex flex-col min-h-screen sticky top-0">
      <div className="font-bold text-lg text-black mb-2">GiveHelp Admin</div>
      <div className="text-xs text-gray-400 mb-8">{profile?.username}</div>
      <nav className="space-y-1 flex-1">
        <Link to="/admin/dashboard" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/dashboard")}>Dashboard</Link>
        <Link to="/admin/campaigns" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/campaigns")}>Campaigns</Link>
        <Link to="/admin/donations" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/donations")}>Donations</Link>
        <Link to="/admin/create-campaign" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/create-campaign")}>Add Campaign</Link>
      </nav>
      <button onClick={handleLogout} className="mt-6 w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition">
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
