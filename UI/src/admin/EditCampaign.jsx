import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ Title: "", Description: "", Target: "", Category: "Medical", Status: "Active" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/campaign/" + id)
      .then(res => res.json())
      .then(data => {
        setForm({ Title: data.Title || "", Description: data.Description || "", Target: data.Goal || "", Category: data.Category || "Medical", Status: data.Status || "Active" });
        if (data.Image) setImagePreview(`/api/campaign/image/${encodeURIComponent(data.Title)}`);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("Title", form.Title);
      formData.append("Description", form.Description);
      formData.append("Target", form.Target);
      formData.append("Category", form.Category);
      formData.append("Status", form.Status);
      if (imageFile) formData.append("Image", imageFile);

      const res = await fetch("/api/admin/campaign/" + id, {
        method: "PUT",
        headers: { Authorization: token },
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) { toast.success("Campaign updated successfully!"); navigate("/admin/campaigns"); }
      else toast.error(data.msg || "Update failed");
    } catch {
      toast.error("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading campaign...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Campaign</h2>
      <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Campaign Title", name: "Title", type: "text" },
            { label: "Goal Amount (Rs.)", name: "Target", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">{label}</label>
              <input type={type} name={name} required min={name === "Target" ? "1" : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={form[name]} onChange={handleChange} />
            </div>
          ))}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea rows="4" name="Description" required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={form.Description} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select name="Category" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={form.Category} onChange={handleChange}>
              {["Medical", "Education", "Animals", "Disaster Relief", "Community"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Campaign Image</label>
            {imagePreview && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">{imageFile ? "New image preview:" : "Current image:"}</p>
                <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover rounded-lg border border-gray-200" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
            <p className="mt-1 text-xs text-gray-400">Leave empty to keep current image</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <select name="Status" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={form.Status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => navigate("/admin/campaigns")}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaign;
