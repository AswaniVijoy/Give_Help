import { useEffect, useState } from "react";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/admin/donations", { headers: { Authorization: token }, credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        list.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setDonations(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalAmount = donations.reduce((sum, d) => sum + (d.Amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Donations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {donations.length} donation{donations.length !== 1 ? "s" : ""} · Total: Rs.{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div>
          : donations.length === 0 ? <div className="p-8 text-center text-gray-500">No donations yet.</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="p-3">Donor</th>
                    <th className="p-3">Campaign</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
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
    </div>
  );
};

export default AdminDonations;
