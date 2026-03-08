import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

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
            {username ? (
              <>
                {role === "Admin" && (
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-black transition">Admin Panel</Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-black transition">Profile</Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition">Logout</button>
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
