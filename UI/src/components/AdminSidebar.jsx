import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function AdminSidebar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const linkStyle = "block px-4 py-2 rounded-md text-sm font-medium transition";
  const activeStyle = "bg-black text-white";
  const inactiveStyle = "text-gray-700 hover:bg-gray-100";

  const avatarSrc = profile?.avatarBase64
    ? `data:image/jpeg;base64,${profile.avatarBase64}`
    : null;

  return (
    <aside className="w-64 bg-white border-r p-6 hidden lg:flex flex-col min-h-screen sticky top-0">

      {/* ── Admin profile header ────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">GiveHelp Admin</h1>

        {/* Avatar + name row */}
        <NavLink
          to="/admin/profile"
          className="flex items-center gap-3 mt-4 p-2 rounded-xl hover:bg-gray-50 transition group"
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="admin avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
              {profile?.username?.[0]?.toUpperCase() || "A"}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{profile?.username}</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-500 transition">Edit profile →</p>
          </div>
        </NavLink>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="space-y-2 flex-1">
        <NavLink to="/admin/dashboard"
          className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/campaigns"
          className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
          Campaigns
        </NavLink>
        <NavLink to="/admin/donations"
          className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
          Donations
        </NavLink>
        <NavLink to="/admin/create-campaign"
          className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
          Add Campaign
        </NavLink>
        <NavLink to="/admin/profile"
          className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`}>
          My Profile
        </NavLink>

        {/* ── Logout sits right below My Profile ─────────────────── */}
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>

    </aside>
  );
}

export default AdminSidebar;