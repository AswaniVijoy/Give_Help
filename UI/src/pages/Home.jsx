import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const { profile } = useAuth();   // useContext via useAuth — no localStorage needed

  useEffect(() => {
    setLoading(true);
    const url = category === "All"
      ? "/api/campaign/featured"
      : `/api/campaign/category/${category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) { setCampaigns([]); setLoading(false); return; }
        const sorted = category === "All"
          ? data
          : data.sort((a, b) => b.Raised - a.Raised).slice(0, 6);
        setCampaigns(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <section className="mt-14 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Support causes that change lives
          </h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Discover trusted donation campaigns. Give directly to verified beneficiaries and track real impact.
          </p>
          {profile && (
            <p className="text-sm text-gray-500 mt-2">Welcome back, <span className="font-semibold">{profile.username}</span>!</p>
          )}
          <Link to="/explore" className="inline-block mt-6 px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition">
            Explore Campaigns
          </Link>
        </section>

        {/* Categories */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <div className="mt-4 flex gap-3 flex-wrap">
            {["All", "Medical", "Education", "Disaster Relief", "Community", "Animals"].map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={"px-4 py-2 border rounded-full text-sm transition " +
                  (category === cat ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white")}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Campaigns */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {category === "All" ? "Featured Campaigns" : `${category} Campaigns`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {category === "All" ? "Top 6 most funded campaigns" : "Sorted by most funded"}
              </p>
            </div>
            <Link to="/explore" className="text-sm text-black hover:underline">See all →</Link>
          </div>

          {loading ? (
            <div className="mt-8 text-center text-gray-500">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="mt-8 text-center text-gray-500">No campaigns found in this category.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c) => {
                const percent = c.Goal > 0 ? Math.min(Math.round((c.Raised / c.Goal) * 100), 100) : 0;
                return (
                  <article key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:scale-105 transition">
                    <div className="h-40 bg-gray-100 relative">
                      {c.Image ? (
                        <img src={`/api/campaign/image/${encodeURIComponent(c.Title)}`} alt={c.Title} className="object-cover h-full w-full" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                      )}
                      {percent > 0 && (
                        <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">{percent}% funded</span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{c.Category || "General"}</span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">{c.Title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.Description}</p>
                      <div className="mt-4">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-2 bg-black rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                          <span>Rs.{c.Raised?.toLocaleString()} raised</span>
                          <Link to={`/campaign/${c._id}`}>
                            <button className="bg-black rounded-md text-white px-4 py-2 hover:bg-gray-700 transition">Donate</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="mt-12 mb-12 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-black">Rs.52,00,000+</div>
              <div className="text-sm text-gray-600 mt-1">Total Raised</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">1,200+</div>
              <div className="text-sm text-gray-600 mt-1">Donors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">350+</div>
              <div className="text-sm text-gray-600 mt-1">Campaigns Funded</div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">&copy; 2025 GiveHelp. All rights reserved.</footer>
    </div>
  );
};

export default Home;
