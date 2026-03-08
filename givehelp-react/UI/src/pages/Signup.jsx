import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:2000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName: name, Email: email, Password: password, UserRole: role, AdminSecret: adminSecret }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-black inline-flex items-center justify-center text-white font-bold text-2xl">G</div>
            <h1 className="text-2xl font-bold mt-4">Create an account</h1>
            <p className="text-sm text-gray-600 mt-1">Start supporting campaigns</p>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
          )}
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" value={role} onChange={(e) => { setRole(e.target.value); setAdminSecret(""); }}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {role === "Admin" && (
              <div>
                <label className="text-sm font-medium text-gray-700">Admin Secret Key</label>
                <input type="password" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter admin secret key" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
                <p className="mt-1 text-xs text-gray-400">Contact the system administrator for the secret key.</p>
              </div>
            )}
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-6">
            Already registered?{" "}
            <Link to="/login" className="text-black font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
