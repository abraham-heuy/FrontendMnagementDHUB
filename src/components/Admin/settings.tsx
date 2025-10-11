import { useEffect, useState } from "react";
import { updateAdminDetails } from "../../lib/services/usersService";
import type { User } from "../../lib/types/user";
import { fetchMe } from "../../utils/api";

interface AdminFormData {
  fullName?: string;
  email?: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminProfileSettings = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMe();
        setProfile(data.user);

        // Prefill the form with fetched profile values
        setFormData({
          fullName: data.user?.fullName || "",
          email: data.user?.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData;
    if (!newPassword) return null;

    if (newPassword !== confirmPassword) {
      return "❌ New password and confirm password do not match.";
    }
    if (newPassword.length < 8) {
      return "❌ Password must be at least 8 characters long.";
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      return "❌ Password must contain at least one letter and one number.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pwdError = validatePassword();
    if (pwdError) {
      setMessage(pwdError);
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const updateData: any = {
        fullName: formData.fullName,
        email: formData.email,
      };
      if (formData.newPassword) updateData.password = formData.newPassword;

      const updatedUser = await updateAdminDetails(updateData);
      setProfile(updatedUser);
      setMessage("✅ Profile updated successfully!");

      // Reset password fields but keep name/email in form
      setFormData({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Account</h2>
      <p className="text-gray-500 mb-8">Manage your admin profile</p>

      {/* Profile Picture */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={ "https://randomuser.me/api/portraits/men/32.jpg"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
        />
        <div>
          <p className="text-gray-700 font-medium">Profile picture</p>
          <p className="text-gray-400 text-sm mb-2">PNG, JPG up to 5MB</p>
          <button
            className="text-green-600 font-semibold hover:underline transition"
            onClick={() => alert("Image upload not yet supported.")}
          >
            Update
          </button>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Password Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`px-5 py-2 rounded-md font-semibold text-white transition ${
              saving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Message */}
      {message && (
        <p className={`mt-4 text-center font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminProfileSettings;
