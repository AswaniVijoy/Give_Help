import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();   // useContext — get logged-in user info
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/campaign/" + id)
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) { toast.error("Please log in to donate."); navigate("/login"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Please enter a valid amount."); return; }

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
        toast.error(data.msg || "Donation failed");
      }
    } catch {
      toast.error("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-4xl mx-auto px-6 pt-10 pb-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Donate to: {campaign?.Title || "Loading..."}</h1>
          <p className="text-sm text-gray-600 mt-1">{campaign?.Description || "Your contribution makes a direct impact."}</p>
          {profile && <p className="text-sm text-gray-500 mt-1">Donating as: <span className="font-medium">{profile.username}</span></p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">Select an amount</label>
              <div className="mt-3 flex gap-3">
                {[250, 500, 1000].map((val) => (
                  <button key={val} type="button" onClick={() => setAmount(val)}
                    className={"px-4 py-2 border rounded-md text-sm transition " + (Number(amount) === val ? "bg-black text-white border-black" : "hover:bg-gray-100")}>
                    Rs.{val}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Or enter custom amount"
                className="mt-3 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                value={amount} onChange={(e) => setAmount(e.target.value)} min="1" />
            </div>
            <div>
              <label className="text-sm font-medium">Payment method</label>
              <select className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option>UPI</option>
                <option>Card</option>
                <option>Netbanking</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition">
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
