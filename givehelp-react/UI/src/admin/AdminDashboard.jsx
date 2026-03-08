import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ campaigns: 0, raised: 0, donors: 0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!username || role !== "Admin") { navigate("/login"); return; }

    fetch("http://localhost:2000/admin/campaigns", { headers: { Authorization: token }, credentials: "include" })
      .then(res => res.json())
      .then(campaigns => {
        if (Array.isArray(campaigns)) {
          const totalRaised = campaigns.reduce((sum, c) => sum + (c.Raised || 0), 0);
          setStats(prev => ({ ...prev, campaigns: campaigns.length, raised: totalRaised }));
        }
      });

    fetch("http://localhost:2000/admin/donations", { headers: { Authorization: token }, credentials: "include" })
      .then(res => res.json())
      .then(donations => {
        if (Array.isArray(donations)) {
          setStats(prev => ({ ...prev, donors: donations.length }));
          setRecentDonations(donations.slice(-5).reverse());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate, username, token]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-500">Welcome, {username}</div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center shadow-sm">
            <div className="text-sm text-gray-500">Total Campaigns</div>
            <div className="text-3xl font-bold text-black mt-2">{stats.campaigns}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center shadow-sm">
            <div className="text-sm text-gray-500">Total Raised</div>
            <div className="text-3xl font-bold text-black mt-2">Rs.{stats.raised.toLocaleString()}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center shadow-sm">
            <div className="text-sm text-gray-500">Total Donations</div>
            <div className="text-3xl font-bold text-black mt-2">{stats.donors}</div>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Recent Donations</h2>
          {loading ? <div className="text-gray-500 text-sm">Loading...</div>
          : recentDonations.length === 0 ? <div className="text-gray-500 text-sm">No donations yet.</div>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr><th className="p-3">Donor</th><th className="p-3">Campaign</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr>
              </thead>
              <tbody>
                {recentDonations.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{d.Donar}</td>
                    <td className="p-3">{d.CampaignTitle}</td>
                    <td className="p-3 font-medium">Rs.{d.Amount?.toLocaleString()}</td>
                    <td className="p-3 text-gray-500">{new Date(d.Date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
