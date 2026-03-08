import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:2000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Email: email, Password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", payload.UserRole);
        localStorage.setItem("username", payload.UserName);
        if (payload.UserRole === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(data.msg || "Login failed");
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
            <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
            <p className="text-sm text-gray-600 mt-1">Log in to your account</p>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
          )}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
