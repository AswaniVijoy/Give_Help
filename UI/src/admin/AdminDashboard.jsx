import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { profile } = useAuth();   // useContext — username, role from context
  const [stats, setStats] = useState({ campaigns: 0, raised: 0, donors: 0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    Promise.all([
      fetch("/api/admin/campaigns", { headers: { Authorization: token }, credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/donations", { headers: { Authorization: token }, credentials: "include" }).then(r => r.json()),
    ]).then(([campaigns, donations]) => {
      const campaignList = Array.isArray(campaigns) ? campaigns : [];
      const donationList = Array.isArray(donations) ? donations : [];
      // Total raised from donation records — accurate even if campaign.Raised drifts
      const totalRaised = donationList.reduce((sum, d) => sum + (d.Amount || 0), 0);
      setStats({ campaigns: campaignList.length, raised: totalRaised, donors: donationList.length });
      const recent = [...donationList].sort((a, b) => new Date(b.Date) - new Date(a.Date)).slice(0, 5);
      setRecentDonations(recent);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={fetchData} className="text-sm text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">↻ Refresh</button>
          <div className="text-sm text-gray-500">Welcome, {profile?.username}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-6">
        {[
          { label: "Total Campaigns", value: stats.campaigns },
          { label: "Total Raised", value: `Rs.${stats.raised.toLocaleString()}` },
          { label: "Total Donations", value: stats.donors },
        ].map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-gray-100 text-center shadow-sm">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-3xl font-bold text-black mt-2">{loading ? "—" : s.value}</div>
          </div>
        ))}
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
                    <td className="p-3 font-medium text-green-600">Rs.{d.Amount?.toLocaleString()}</td>
                    <td className="p-3 text-gray-500">{new Date(d.Date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
