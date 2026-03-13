// AdminProfile.jsx — Admin can view and update their profile picture
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const { profile, refresh } = useAuth();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ─── Pick file → preview instantly ──────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ─── Save to backend ─────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) { toast.error("Please select an image first."); return; }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("ProfilePicture", selectedFile);

      const res = await fetch("/api/user/profile-picture", {
        method: "PUT",
        headers: { Authorization: token },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile picture updated!");
        setAvatarPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await refresh(); // updates avatarBase64 in context → sidebar refreshes too
      } else {
        toast.error(data.msg || "Upload failed");
      }
    } catch {
      toast.error("Server error. Make sure your backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Display priority: local preview → saved base64 → null (initials)
  const displaySrc =
    avatarPreview ||
    (profile?.avatarBase64 ? `data:image/jpeg;base64,${profile.avatarBase64}` : null);

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

        {/* ── Avatar + info ────────────────────────────────────────── */}
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            {displaySrc ? (
              <img
                src={displaySrc}
                alt="Admin avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                {profile?.username?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            {/* Camera overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-lg"
              title="Change photo"
            >
              📷
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold">{profile?.username}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <span className="inline-block mt-1 text-xs bg-black text-white px-2 py-1 rounded-full">
              {profile?.userRole}
            </span>
          </div>
        </div>

        {/* ── Upload controls ──────────────────────────────────────── */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">Profile Picture</p>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

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

      </div>
    </div>
  );
};

export default AdminProfile;