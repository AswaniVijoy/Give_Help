import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ Title: "", Description: "", Target: "", Category: "Medical", Status: "Active" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      formData.append("Title", form.Title);
      formData.append("Description", form.Description);
      formData.append("Target", form.Target);
      formData.append("Category", form.Category);
      formData.append("Status", form.Status);
      formData.append("CreatedBy", localStorage.getItem("username"));
      if (imageFile) formData.append("Image", imageFile);

      const res = await fetch("http://localhost:2000/admin/campaign", {
        method: "POST",
        headers: { Authorization: token },
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) { alert("Campaign created successfully!"); navigate("/admin/campaigns"); }
      else setError(data.msg || "Failed to create campaign");
    } catch { setError("Server error. Make sure your backend is running."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Campaign</h2>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
        <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Campaign Title</label>
              <input type="text" name="Title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter title" value={form.Title} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea rows="4" name="Description" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Explain the purpose..." value={form.Description} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Goal Amount (Rs.)</label>
              <input type="number" name="Target" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="e.g. 100000" value={form.Target} onChange={handleChange} required min="1" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select name="Category" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" value={form.Category} onChange={handleChange}>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Animals">Animals</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Community">Community</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Campaign Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-40 w-full object-cover rounded-lg border border-gray-200" />}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Status</label>
              <select name="Status" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" value={form.Status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition">
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;
