import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Latest");

  useEffect(() => {
    fetch("/api/campaign")
      .then(res => res.json())
      .then(data => { setCampaigns(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...campaigns];
    if (category !== "All") result = result.filter(c => c.Category === category);
    if (sort === "Most Funded") result.sort((a, b) => (b.Raised || 0) - (a.Raised || 0));
    else result.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    setFiltered(result);
  }, [category, sort, campaigns]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Explore Causes</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} campaign{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={category} onChange={e => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Animals">Animals</option>
              <option value="Disaster Relief">Disaster Relief</option>
              <option value="Community">Community</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={sort} onChange={e => setSort(e.target.value)}
            >
              <option value="Latest">Latest</option>
              <option value="Most Funded">Most Funded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center text-gray-500">Loading campaigns...</div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">No campaigns found.</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => {
              const pct = c.Goal > 0 ? Math.min(Math.round((c.Raised / c.Goal) * 100), 100) : 0;
              return (
                <article key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:scale-105 transition">
                  <div className="h-40 bg-gray-100 relative">
                    {c.Image ? (
                      <img src={`/api/campaign/image/${encodeURIComponent(c.Title)}`} alt={c.Title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                    )}
                    {pct > 0 && (
                      <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                        {pct}% funded
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{c.Category || "General"}</span>
                      <span className="text-xs text-gray-400">{new Date(c.CreatedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-2">{c.Title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.Description}</p>

                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-black rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-900">Rs.{c.Raised?.toLocaleString()}</span>
                          {c.Goal > 0 && <span className="text-gray-400"> / Rs.{c.Goal?.toLocaleString()}</span>}
                        </div>
                        <Link to={`/campaign/${c._id}`}>
                          <button className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition text-sm">Donate</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t">&copy; 2025 GiveHelp</footer>
    </div>
  );
};

export default Explore;