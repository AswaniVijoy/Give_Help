import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName: name, Email: email, Password: password, UserRole: role, AdminSecret: adminSecret }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created! Please log in.");
        navigate("/login");
      } else {
        toast.error(data.msg || "Signup failed");
      }
    } catch {
      toast.error("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-black inline-flex items-center justify-center text-white font-bold text-2xl">G</div>
          <h1 className="text-2xl font-bold mt-4">Create an account</h1>
          <p className="text-sm text-gray-600 mt-1">Start supporting campaigns</p>
        </div>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={role} onChange={(e) => { setRole(e.target.value); setAdminSecret(""); }}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {role === "Admin" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Admin Secret Key</label>
              <input type="password" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter admin secret key" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
              <p className="mt-1 text-xs text-gray-400">Contact the system administrator for the secret key.</p>
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
