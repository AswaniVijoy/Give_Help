import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (!username || role !== "Admin") { navigate("/login"); return; }

    fetch("http://localhost:2000/admin/donations", { headers: { Authorization: token }, credentials: "include" })
      .then(res => res.json())
      .then(data => { setDonations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate, token]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">All Donations</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? <div className="p-8 text-center text-gray-500">Loading...</div>
          : donations.length === 0 ? <div className="p-8 text-center text-gray-500">No donations yet.</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr><th className="p-3">Donor</th><th className="p-3">Campaign</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{d.Donar}</td>
                      <td className="p-3">{d.CampaignTitle}</td>
                      <td className="p-3 text-green-600 font-semibold">Rs.{d.Amount?.toLocaleString()}</td>
                      <td className="p-3 text-gray-500">{new Date(d.Date).toLocaleDateString()}</td>
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

export default AdminDonations;
