import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username || !token) { navigate("/login"); return; }

    fetch("http://localhost:2000/user/profile", {
      headers: { Authorization: token },
      credentials: "include",
    })
      .then((res) => { if (!res.ok) throw new Error("Unauthorized"); return res.json(); })
      .then((data) => setProfile(data))
      .catch(() => setError("Could not load profile. Please log in again."));

    fetch("http://localhost:2000/user/my", {
      headers: { Authorization: token },
      credentials: "include",
    })
      .then((res) => { if (!res.ok) throw new Error("Unauthorized"); return res.json(); })
      .then((data) => { setDonations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setDonations([]); setLoading(false); });
  }, [navigate, token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error} — <span className="underline cursor-pointer" onClick={() => navigate("/login")}>Login again</span>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
              {profile?.UserName?.[0]?.toUpperCase() || localStorage.getItem("username")?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile?.UserName || localStorage.getItem("username")}</h1>
              <p className="text-sm text-gray-500">{profile?.Email}</p>
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{profile?.UserRole || localStorage.getItem("role")}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">My Donations</h2>
          {donations.length === 0 ? (
            <p className="text-gray-500 text-sm">You have not donated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr><th className="p-3">Campaign</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{d.CampaignTitle}</td>
                      <td className="p-3 font-medium">Rs.{d.Amount?.toLocaleString()}</td>
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
