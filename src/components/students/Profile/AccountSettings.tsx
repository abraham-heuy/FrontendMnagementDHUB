import { useEffect, useMemo, useState } from "react";
import { profileService } from "../../../lib/services/profileService";
import type { MenteeProfile } from "../../../utils/api";
import ProfileCompletionModal from "./ProfileCompletionModal";
import {
  FiUser,
  FiBook,
  FiBriefcase,
  FiAward,
  FiGitBranch,
  FiSave,
  FiLoader,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
const initialState: MenteeProfile = {
  category: undefined,
  bio: "",
  skills: "",
  startup_idea: "",
  phone: "",
  registrationNumber: "",
  institution: "",
  field: "",
  course: "",
  yearOfStudy: "",
  linkedIn: "",
  website: "",
  resumeUrl: "",
};

const StudentAccountSettings = () => {
  const [profile, setProfile] = useState<MenteeProfile>(initialState);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await profileService.getMyProfile();
        if (data) {
          const profileData: MenteeProfile = {
            ...initialState,
            ...data,
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills
          };
          setProfile(profileData);

          // Check completion and show modal if < 25%
          const completion = calculateCompletion(profileData);
          if (completion < 25) {
            setShowProfileModal(true);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Helper function to calculate completion
  const calculateCompletion = (prof: MenteeProfile) => {
    const fields = [
      prof.category,
      prof.phone,
      prof.field,
      prof.bio,
      prof.skills,
      prof.linkedIn,
      ...(prof.category === "Student" ? [prof.institution, prof.course, prof.yearOfStudy] : [])
    ];

    const filled = fields.filter(field => field && String(field).trim().length > 0).length;
    const total = fields.length;
    return Math.round((filled / total) * 100);
  };

  // Calculate completion percentage
  const completionPercent = useMemo(() => {
    return calculateCompletion(profile);
  }, [profile]);

  const handleChange = (field: keyof MenteeProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const profileToSave = {
        ...profile,
        skills: profile.skills ? profile.skills.split(",").map(s => s.trim()).filter(s => s.length > 0) : [],
        yearOfStudy: profile.yearOfStudy ? String(profile.yearOfStudy) : undefined
      };
      const saved = await profileService.upsertMyProfile(profileToSave);

      const profileData: MenteeProfile = {
        ...profile,
        ...saved,
        skills: Array.isArray(saved.skills) ? saved.skills.join(", ") : saved.skills
      };
      setProfile(profileData);
      setSuccess("Profile updated successfully! 🎉");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: FiUser },
    { id: "academic", label: "Academic", icon: FiBook, show: profile.category === "Student" },
    { id: "professional", label: "Professional", icon: FiBriefcase },
    { id: "skills", label: "Skills", icon: FiAward },
    { id: "bio", label: "Bio", icon: FiGitBranch },
  ].filter(tab => tab.show !== false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onCompleted={(updatedProfile) => {
          setProfile(updatedProfile);
          setShowProfileModal(false);
        }}
        initialProfile={profile}
        minPercent={25}
      />

      <div className="h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header with Hero Theme Colors */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-gray-600 mt-2">Manage your professional identity</p>
              </div>

              {/* Completion Badge with Alert */}
              <div className="text-center">
                <div className="relative">
                  {/* icons from fiIcons for Bage with Alert */}
                  <FiCheckCircle className={`absolute -top-2 -right-2 text-${completionPercent >= 25 ? 'green' : 'orange'}-600 bg-white rounded-full p-1`} size={20} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${completionPercent >= 25 ? 'text-green-600' : 'text-orange-600'}`}>
                      {completionPercent}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {completionPercent >= 25 ? "Complete ✓" : "Incomplete"}
                </p>
                {completionPercent < 25 && (
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="mt-2 text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <FiAlertCircle size={12} />
                    Complete Now
                  </button>
                )}
              </div>
            </div>

            {/* Low Completion Warning */}
            {completionPercent < 25 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl flex items-start gap-3">
                <FiAlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-orange-800 font-semibold">Profile Incomplete</p>
                  <p className="text-orange-700 text-sm mt-1">
                    Your profile is only {completionPercent}% complete. You need at least 25% completion to access all features.
                  </p>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Complete Profile Now →
                  </button>
                </div>
              </div>
            )}

            {/* Progress Stats with Hero Colors */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(profile).filter(v => v && String(v).trim().length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Fields Completed</div>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">
                  {(profile.skills || "").split(",").filter(s => s.trim()).length}
                </div>
                <div className="text-sm text-gray-600">Skills Added</div>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-teal-100">
                <div className="text-2xl font-bold text-teal-600">
                  {completionPercent >= 25 ? "Complete" : "In Progress"}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              <FiX size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-green-700 font-medium">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-800">
              <FiX size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                      ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Save Button with Hero Colors */}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full mt-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <FiLoader className="animate-spin" size={18} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Category Selection */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-100 rounded-2xl">
                      <FiUser className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Account Type</h2>
                      <p className="text-gray-600">Choose the category that best fits you</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {["Student", "Non-Student"].map((category) => (
                      <button
                        key={category}
                        onClick={() => handleChange("category", category)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 ${profile.category === category
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-gray-50 hover:border-green-300"
                          }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`p-3 rounded-xl ${profile.category === category ? "bg-green-500" : "bg-gray-300"
                            }`}>
                            {category === "Student" ? (
                              <FiBook className="text-white" size={24} />
                            ) : (
                              <FiBriefcase className="text-white" size={24} />
                            )}
                          </div>
                          <span className="font-semibold text-gray-900">{category}</span>
                          {profile.category === category && (
                            <span className="text-green-600 text-sm flex items-center gap-1">
                              <FiCheck size={16} />
                              Selected
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        value={profile.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="+256 700 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Field of Expertise
                      </label>
                      <input
                        value={profile.field || ""}
                        onChange={(e) => handleChange("field", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. Software Engineering"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Information */}
              {activeTab === "academic" && profile.category === "Student" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-100 rounded-2xl">
                      <FiBook className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
                      <p className="text-gray-600">Your educational background</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Institution
                      </label>
                      <input
                        value={profile.institution || ""}
                        onChange={(e) => handleChange("institution", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="University or College"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course/Program
                      </label>
                      <input
                        value={profile.course || ""}
                        onChange={(e) => handleChange("course", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year of Study
                      </label>
                      <select
                        value={profile.yearOfStudy || ""}
                        onChange={(e) => handleChange("yearOfStudy", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      >
                        <option value="">Select Year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                        <option value="5+">Year 5+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Links */}
              {activeTab === "professional" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                      <FiBriefcase className="text-emerald-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Professional Links</h2>
                      <p className="text-gray-600">Connect your professional profiles</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        value={profile.linkedIn || ""}
                        onChange={(e) => handleChange("linkedIn", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Personal Website
                      </label>
                      <input
                        value={profile.website || ""}
                        onChange={(e) => handleChange("website", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Resume/CV URL
                      </label>
                      <input
                        value={profile.resumeUrl || ""}
                        onChange={(e) => handleChange("resumeUrl", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="https://drive.google.com/your-resume"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-orange-100 rounded-2xl">
                      <FiAward className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
                      <p className="text-gray-600">Showcase your technical and soft skills</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Add Your Skills
                    </label>
                    <input
                      value={profile.skills || ""}
                      onChange={(e) => handleChange("skills", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="JavaScript, React, Node.js, Leadership, Communication"
                    />
                    <p className="text-sm text-gray-500 mt-2">Separate skills with commas</p>

                    {/* Skills Preview */}
                    {profile.skills && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {profile.skills.split(",").filter(skill => skill.trim()).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-sm rounded-full font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              {activeTab === "bio" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-teal-100 rounded-2xl">
                      <FiGitBranch className="text-teal-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Bio & Vision</h2>
                      <p className="text-gray-600">Share your story and aspirations</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Bio
                    </label>
                    <textarea
                      value={profile.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                      rows={6}
                      placeholder="Tell us about your background, interests, and what you hope to achieve..."
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Share your professional journey</span>
                      <span>{profile.bio?.length || 0}/500 characters</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAccountSettings;