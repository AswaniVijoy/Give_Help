import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Navbar() {
  const { profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center rounded-lg font-bold text-lg">G</div>
            <span className="font-bold text-lg">GiveHelp</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/" className="text-gray-600 hover:text-black transition">Home</Link>
            <Link to="/explore" className="text-gray-600 hover:text-black transition">Explore</Link>
            {profile ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-black transition">Admin Panel</Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-black transition">Profile</Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-black transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
