import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, fileUrl } from "../utils/api";
import { Alert, Badge } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import ConnectionRequests from "../components/ConnectionRequests";

const toForm = (u) => ({
  name: u?.name || "",
  email: u?.email || "",
  phone: u?.phone || "",
  petCertified: Boolean(u?.petCertified),
});

const Profile = () => {
  const { user, setUser, hasListings } = useAuth();
  const [form, setForm] = useState(toForm(user));
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setForm(toForm(user));
  }, [user]);

  if (!user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setForm(toForm(user));
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("petCertified", form.petCertified);
      if (selectedFile) formData.append("profilePicture", selectedFile);

      const { user: updated } = await updateProfile(formData);
      setUser(updated);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = previewUrl || (user.profilePicture ? fileUrl(user.profilePicture) : "");

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Account</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Your profile</h1>

      <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {error && <div className="mb-4"><Alert kind="error">{error}</Alert></div>}

        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-20 w-20 rounded-full border-2 border-paper object-cover shadow" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink font-display text-2xl text-paper">
                {(user.name || user.username).charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-brass text-ink shadow">
                <Camera size={14} />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">{user.name || user.username}</p>
            <p className="text-sm text-ink-soft">@{user.username}</p>
            <div className="mt-1 flex gap-2">
              {user.personality && <Badge tone="brass">{user.personality}</Badge>}
              {hasListings && <Badge tone="blueprint">Host</Badge>}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" className={inputClasses} value={form.name} onChange={handleInputChange} disabled={!isEditing} />
          </Field>
          <Field label="Email">
            <input type="email" name="email" className={inputClasses} value={form.email} onChange={handleInputChange} disabled={!isEditing} />
          </Field>
          <Field label="Phone">
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              title="Enter a 10-digit Indian mobile number"
              placeholder="9876543210"
              className={inputClasses}
              value={form.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Field>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.petCertified}
            disabled={!isEditing}
            onChange={(e) => setForm((p) => ({ ...p, petCertified: e.target.checked }))}
            className="h-4 w-4 accent-ink"
          />
          Pet certified
        </label>

        <div className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>Edit profile</Button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-ink/10 pt-6">
          <Button variant="outline" onClick={() => navigate("/rent")}>Browse rentals</Button>
          <Button variant="outline" onClick={() => navigate("/my-bookings")}>My bookings</Button>
          <Button variant="outline" onClick={() => navigate("/matches")}>Roommate matches</Button>
          <Button variant="outline" onClick={() => navigate("/post")}>List a property</Button>
          {hasListings && (
            <>
              <Button variant="outline" onClick={() => navigate("/my-listings")}>My listings</Button>
              <Button variant="outline" onClick={() => navigate("/bookings-received")}>Bookings received</Button>
            </>
          )}
        </div>
      </div>

      <ConnectionRequests />
    </div>
  );
};

export default Profile;