import { useEffect, useState } from "react";
import {
  getMyMentorProfile,
  upsertMyMentorProfile,
} from "../../lib/services/mentorService";

import type { MentorProfile, MentorProfileFormData } from "../../lib/types/mentor";

const MentorProfileComponent = () => {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [formData, setFormData] = useState<MentorProfileFormData>({
    specialization: "",
    experience: "",
    recentProject: "",
    contact: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch mentor profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyMentorProfile();
        setProfile(data);
        setFormData({
          specialization: data.specialization || "",
          experience: data.experience || "",
          recentProject: data.recentProject || "",
          contact: data.contact || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        setMessage("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.specialization ||
      !formData.experience ||
      !formData.recentProject ||
      !formData.contact
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      await upsertMyMentorProfile(formData);
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
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
      <p className="text-gray-500 mb-8">Manage your mentor profile</p>

      {/* Profile Picture Section */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg
"
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

      {/* Profile Details */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>

          {/* Full name & email from linked user */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile?.user?.fullName || ""}
                readOnly
                className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile?.user?.email || ""}
                readOnly
                className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
              />
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Software Engineering"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Contact Info
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g. +2547XXXXXXXX"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">
              Experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your mentoring or work experience..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">
              Recent Project
            </label>
            <textarea
              name="recentProject"
              value={formData.recentProject}
              onChange={handleChange}
              rows={3}
              placeholder="Briefly describe a recent project you worked on..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-5 py-2 rounded-md font-semibold text-white transition ${
                saving
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>

      {/* Status Message */}
      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default MentorProfileComponent;
