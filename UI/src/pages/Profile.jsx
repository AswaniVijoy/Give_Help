// Profile.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { profile, loading: authLoading, refresh } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);

  // ─── Profile picture state ────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = useState(null); // local blob URL for preview
  const [selectedFile, setSelectedFile] = useState(null);   // File object kept in state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !profile) navigate("/login");
  }, [authLoading, profile, navigate]);

  // Fetch user's donations
  useEffect(() => {
    if (!profile) return;
    const token = localStorage.getItem("token");
    fetch("/api/user/my", { headers: { Authorization: token }, credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
        setDonationsLoading(false);
      })
      .catch(() => setDonationsLoading(false));
  }, [profile]);

  // ─── Pick file → store in state + show instant preview ───────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ─── Upload → PUT /api/user/profile-picture ───────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("ProfilePicture", selectedFile);

      const res = await fetch("/api/user/profile-picture", {
        method: "PUT",
        headers: { Authorization: token }, // do NOT set Content-Type — browser sets it with boundary
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile picture updated!");
        setAvatarPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await refresh(); // re-fetch profile → context gets new avatarBase64
      } else {
        toast.error(data.msg || "Upload failed");
      }
    } catch {
      toast.error("Server error. Make sure your backend is running.");
    } finally {
      setUploading(false);
    }
  };

  // ─── Cancel selection ─────────────────────────────────────────────────────
  const handleCancel = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (authLoading || donationsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  const totalDonated = donations.reduce((sum, d) => sum + (d.Amount || 0), 0);

  // Priority: local blob preview → base64 from context → null (show initials)
  const displaySrc =
    avatarPreview ||
    (profile?.avatarBase64 ? `data:image/jpeg;base64,${profile.avatarBase64}` : null);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* ── Profile Card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="relative group shrink-0">
              {displaySrc ? (
                <img
                  src={displaySrc}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              {/* Camera overlay on hover */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-lg"
                title="Change photo"
              >
                📷
              </button>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{profile?.username}</h1>
              <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {profile?.userRole}
              </span>
            </div>
          </div>

          {/* ── Upload controls ────────────────────────────────────────── */}
          <div className="mt-5 pt-4 border-t">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-sm font-medium text-gray-700 mb-3">Profile Picture</p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Choose Photo
              </button>

              {avatarPreview && (
                <>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
                  >
                    {uploading ? "Uploading..." : "Save Photo"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {avatarPreview && (
              <p className="text-xs text-gray-400 mt-2">
                Preview shown above — click Save Photo to confirm.
              </p>
            )}
          </div>

          {/* ── Total donated ──────────────────────────────────────────── */}
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            Total donated:{" "}
            <span className="font-semibold text-black">
              Rs.{totalDonated.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Donations Table ────────────────────────────────────────────── */}
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
                      <td className="p-3 font-medium text-green-600">
                        Rs.{d.Amount?.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(d.Date).toLocaleDateString()}
                      </td>
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