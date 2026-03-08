import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:2000/campaign/" + id)
      .then((res) => res.json())
      .then((data) => { setCampaign(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!campaign) return <div className="min-h-screen flex items-center justify-center text-gray-500">Campaign not found.</div>;

  const percent = campaign.Goal > 0 ? Math.min(Math.round((campaign.Raised / campaign.Goal) * 100), 100) : 0;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-gray-100 h-64">
            {campaign.Image ? (
              <img src={`http://localhost:2000/campaign/image/${encodeURIComponent(campaign.Title)}`} alt={campaign.Title} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-6">{campaign.Title}</h1>
          <p className="text-gray-600 mt-3">Your donation makes a direct impact.</p>
          <section className="mt-6 bg-white border border-gray-300 shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Story</h2>
            <p className="text-gray-700 mt-2 leading-relaxed">{campaign.Description}</p>
          </section>
          <section className="mt-6 bg-white border border-gray-300 shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{campaign.Category || "General"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created by</span>
                <span className="font-medium">{campaign.CreatedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={"font-medium " + (campaign.Status === "Active" ? "text-green-600" : "text-gray-400")}>{campaign.Status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created on</span>
                <span className="font-medium">{new Date(campaign.CreatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">Updates</h2>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                Campaign is currently active. Your donations are being used effectively.
              </div>
            </div>
          </section>
        </div>
        <aside className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-fit sticky top-24">
          <div className="text-sm text-gray-600">Goal</div>
          <div className="text-2xl font-bold text-black mt-1">Rs.{campaign.Goal?.toLocaleString()}</div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-black rounded-full transition-all" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Rs.{campaign.Raised?.toLocaleString()} raised</span>
              <span>{percent}%</span>
            </div>
          </div>
          <button onClick={() => navigate("/donate/" + campaign._id)} className="mt-5 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">Donate Now</button>
          <div className="mt-5 border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Raised</span>
              <span className="font-medium text-black">Rs.{campaign.Raised?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Goal</span>
              <span className="font-medium text-black">Rs.{campaign.Goal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining</span>
              <span className="font-medium text-black">Rs.{(campaign.Goal - campaign.Raised)?.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </main>
      <footer className="py-8 text-center text-sm text-gray-600 border-t">&copy; 2025 GiveHelp</footer>
    </div>
  );
};

export default CampaignDetail;
