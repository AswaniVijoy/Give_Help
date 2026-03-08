import { Link, useNavigate, useLocation } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:2000/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  const active = (path) =>
    location.pathname === path ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-64 bg-white border-r p-6 hidden lg:flex flex-col min-h-screen sticky top-0">
      <div className="font-bold text-lg text-black mb-8">GiveHelp Admin</div>
      <nav className="space-y-1 flex-1">
        <Link to="/admin/dashboard" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/dashboard")}>Dashboard</Link>
        <Link to="/admin/campaigns" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/campaigns")}>Campaigns</Link>
        <Link to="/admin/donations" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/donations")}>Donations</Link>
        <Link to="/admin/create-campaign" className={"block px-3 py-2 rounded-md text-sm transition " + active("/admin/create-campaign")}>Add Campaign</Link>
      </nav>
      <button onClick={handleLogout} className="mt-6 w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition">Logout</button>
    </aside>
  );
}

export default AdminSidebar;
