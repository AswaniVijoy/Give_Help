import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { profile, loading: authLoading } = useAuth();   // useContext — profile from AuthContext
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);

  // If auth is done and no profile → redirect to login
  useEffect(() => {
    if (!authLoading && !profile) navigate("/login");
  }, [authLoading, profile, navigate]);

  useEffect(() => {
    if (!profile) return;
    const token = localStorage.getItem("token");
    fetch("/api/user/my", { headers: { Authorization: token }, credentials: "include" })
      .then((res) => res.json())
      .then((data) => { setDonations(Array.isArray(data) ? data : []); setDonationsLoading(false); })
      .catch(() => setDonationsLoading(false));
  }, [profile]);

  if (authLoading || donationsLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  const totalDonated = donations.reduce((sum, d) => sum + (d.Amount || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
              {profile?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile?.username}</h1>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{profile?.userRole}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            Total donated: <span className="font-semibold text-black">Rs.{totalDonated.toLocaleString()}</span>
          </div>
        </div>

        {/* Donations */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">My Donations</h2>
          {donations.length === 0 ? (
            <p className="text-gray-500 text-sm">You have not donated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="p-3">Campaign</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{d.CampaignTitle}</td>
                      <td className="p-3 font-medium text-green-600">Rs.{d.Amount?.toLocaleString()}</td>
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

export default Profile;
