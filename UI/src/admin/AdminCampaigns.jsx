import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/admin/campaigns", { headers: { Authorization: token }, credentials: "include" })
      .then(res => res.json())
      .then(data => { setCampaigns(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/campaign/${id}`, { method: "DELETE", headers: { Authorization: token }, credentials: "include" });
      const data = await res.json();
      if (res.ok) { toast.success(data.msg); setCampaigns(campaigns.filter(c => c._id !== id)); }
      else toast.error(data.msg || "Delete failed");
    } catch { toast.error("Server error"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Campaigns</h1>
        <Link to="/admin/create-campaign" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition text-sm">+ New Campaign</Link>
      </div>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div>
          : campaigns.length === 0 ? <div className="p-8 text-center text-gray-500">No campaigns yet.</div>
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
    </div>
  );
};

export default AdminCampaigns;
