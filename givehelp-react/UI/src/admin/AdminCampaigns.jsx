import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (!username || role !== "Admin") { navigate("/login"); return; }

    fetch("http://localhost:2000/admin/campaigns", { headers: { Authorization: token }, credentials: "include" })
      .then(res => res.json())
      .then(data => { setCampaigns(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch(`http://localhost:2000/admin/campaign/${id}`, {
        method: "DELETE", headers: { Authorization: token }, credentials: "include",
      });
      const data = await res.json();
      if (res.ok) { alert(data.msg); setCampaigns(campaigns.filter(c => c._id !== id)); }
      else alert(data.msg || "Delete failed");
    } catch { alert("Server error"); }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Campaigns</h1>
          <Link to="/admin/create-campaign" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition text-sm">+ New Campaign</Link>
        </div>
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {loading ? <div className="p-8 text-center text-gray-500">Loading...</div>
          : campaigns.length === 0 ? <div className="p-8 text-center text-gray-500">No campaigns yet. Create one!</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-center">Goal</th>
                    <th className="p-3 text-center">Raised</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{c.Title}</td>
                      <td className="p-3 text-center text-gray-500">{c.Category || "-"}</td>
                      <td className="p-3 text-center">Rs.{c.Goal?.toLocaleString()}</td>
                      <td className="p-3 text-center">Rs.{c.Raised?.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className={"font-medium " + (c.Status === "Active" ? "text-green-600" : "text-gray-400")}>{c.Status}</span>
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <Link to={`/admin/edit-campaign/${c._id}`} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition">Edit</Link>
                        <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCampaigns;
