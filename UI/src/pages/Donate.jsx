import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/campaign/" + id)
      .then((res) => res.json())
      .then((data) => {
        // If campaign is already completed, redirect back to its detail page
        if (data.Raised >= data.Goal && data.Goal > 0) {
          toast.info("This campaign has already reached its goal!");
          navigate("/campaign/" + id, { replace: true });
          return;
        }
        setCampaign(data);
      })
      .catch(() => {});
  }, [id, navigate]);

  // Remaining amount needed
  const remaining = campaign ? Math.max(campaign.Goal - (campaign.Raised || 0), 0) : 0;

  const handleAmountChange = (val) => {
    setAmount(val);

    // Warn immediately if typed amount exceeds what's left
    if (campaign && campaign.Goal > 0 && Number(val) > remaining) {
      toast.warning(
        `Amount exceeds remaining goal. Only Rs.${remaining.toLocaleString()} is needed.`,
        { toastId: "exceed-warning" }   // toastId prevents duplicate toasts on every keystroke
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) { toast.error("Please log in to donate."); navigate("/login"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Please enter a valid amount."); return; }

    // Block submission if amount exceeds remaining
    if (campaign && campaign.Goal > 0 && Number(amount) > remaining) {
      toast.error(`Only Rs.${remaining.toLocaleString()} is needed to complete this campaign.`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        credentials: "include",
        body: JSON.stringify({ CampaignTitle: campaign?.Title, Amount: Number(amount) }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.msg || "Donation successful! Thank you.");
        navigate("/profile");
      } else {
        // Backend also checks — show its message (e.g. exceeds goal)
        toast.error(data.msg || "Donation failed");
      }
    } catch {
      toast.error("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) return null; // redirecting or loading

  const isCompleted = campaign.Goal > 0 && campaign.Raised >= campaign.Goal;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-4xl mx-auto px-6 pt-10 pb-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h1 className="text-2xl font-bold">
            Donate to: {campaign?.Title || "Loading..."}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {campaign?.Description || "Your contribution makes a direct impact."}
          </p>
          {profile && (
            <p className="text-sm text-gray-500 mt-1">
              Donating as: <span className="font-medium">{profile.username}</span>
            </p>
          )}

          {/* Progress bar + remaining */}
          {campaign.Goal > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Rs.{campaign.Raised?.toLocaleString()} raised</span>
                <span>Goal: Rs.{campaign.Goal?.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-black rounded-full transition-all"
                  style={{ width: `${Math.min((campaign.Raised / campaign.Goal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Rs.<span className="font-semibold text-black">{remaining.toLocaleString()}</span> still needed
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">Select an amount</label>
              <div className="mt-3 flex gap-3 flex-wrap">
                {[250, 500, 1000].map((val) => {
                  const exceeds = campaign.Goal > 0 && val > remaining;
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={exceeds}
                      onClick={() => handleAmountChange(val)}
                      className={
                        "px-4 py-2 border rounded-md text-sm transition " +
                        (Number(amount) === val
                          ? "bg-black text-white border-black"
                          : exceeds
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-gray-100")
                      }
                    >
                      Rs.{val}
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                placeholder={`Or enter amount (max Rs.${remaining.toLocaleString()})`}
                className="mt-3 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min="1"
                max={remaining || undefined}
              />
              {/* Inline warning when amount exceeds remaining */}
              {campaign.Goal > 0 && Number(amount) > remaining && remaining > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  Exceeds remaining goal. Max you can donate: Rs.{remaining.toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Payment method</label>
              <select
                className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Netbanking</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || isCompleted || (campaign.Goal > 0 && Number(amount) > remaining)}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-600">&copy; 2025 GiveHelp</footer>
    </div>
  );
};

export default Donate;