import React, { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import SecuritySection from "./seurityComponent";

// Types for settings sections
interface SettingSection {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
}

const AccountSettings: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "",
  });

  // Appearance state
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [accentColor, setAccentColor] = useState("sky");
  const [density, setDensity] = useState("comfortable");

  // Security state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Data & Privacy state
  const [dataSettings, setDataSettings] = useState({
    analytics: true,
    newsletters: false,
    terms: "Enter your terms and conditions here...",
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = (sectionId: string) => {
    setPendingSection(sectionId);
    setShowModal(true);
  };

  const confirmSave = () => {
    console.log("Changes saved for section:", pendingSection);
    setShowModal(false);
    setPendingSection(null);
  };

  const sections: SettingSection[] = [
    {
      id: "profile",
      title: "Profile",
      description: "Manage your personal information and profile details.",
      content: (
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleProfileChange("avatar", e.target.files?.[0]?.name || "")
              }
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {profile.avatar && (
              <p className="text-xs text-slate-500 mt-1">
                Uploaded: {profile.avatar}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize how your dashboard looks.",
      content: (
        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Accent Color
            </label>
            <select
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            >
              <option value="sky">Sky</option>
              <option value="emerald">Emerald</option>
              <option value="rose">Rose</option>
              <option value="violet">Violet</option>
            </select>
          </div>

          {/* Layout Density */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Layout Density
            </label>
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Security",
      description: "Change your password and secure your account.",
      content: <SecuritySection/>,
    },
    {
      id: "data",
      title: "Data & Privacy",
      description: "Control how your data is used.",
      content: (
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={dataSettings.analytics}
              onChange={(e) =>
                setDataSettings({ ...dataSettings, analytics: e.target.checked })
              }
            />
            Allow usage analytics
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={dataSettings.newsletters}
              onChange={(e) =>
                setDataSettings({
                  ...dataSettings,
                  newsletters: e.target.checked,
                })
              }
            />
            Receive newsletters
          </label>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Terms & Conditions
            </label>
            <textarea
              value={dataSettings.terms}
              onChange={(e) =>
                setDataSettings({ ...dataSettings, terms: e.target.value })
              }
              rows={5}
              className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Account Settings
        </h2>
        <p className="text-sm text-slate-500">
          Manage your account preferences and privacy options.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search settings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow rounded-2xl p-6 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {section.title}
            </h3>
            <p className="text-sm text-slate-500 mb-4">{section.description}</p>
            {section.content}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleSaveClick(section.id)}
                className="px-4 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Confirm Changes
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to save changes to{" "}
              <span className="font-medium">{pendingSection}</span> settings?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 text-sm rounded-xl bg-sky-500 text-white hover:bg-sky-600"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
