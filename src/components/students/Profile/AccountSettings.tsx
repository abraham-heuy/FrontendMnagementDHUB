import { useEffect, useState } from "react";
import { profileService, type StudentProfile } from "../../../lib/services/profileService";
import { 
  FiUser, 
  FiBook, 
  FiBriefcase, 
  FiLink, 
  FiFileText, 
  FiAward, 
  FiSave, 
  FiLoader,
  FiMail,
  FiPhone,
  FiGlobe,
  FiGitBranch,
  FiStar
} from "react-icons/fi";

const initialState: StudentProfile = {
  bio: "",
  skills: [],
  startup_idea: "",
  phone: "",
  institution: "",
  course: "",
  yearOfStudy: "",
  linkedIn: "",
  website: "",
  resumeUrl: "",
};

const StudentAccountSettings = () => {
  const [profile, setProfile] = useState<StudentProfile>(initialState);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await profileService.getMyProfile();
        if (data) setProfile({ ...initialState, ...data });
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSkillsChange = (value: string) => {
    const items = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    handleChange("skills", items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const saved = await profileService.upsertMyProfile(profile);
      setProfile((prev) => ({ ...prev, ...saved }));
      setSuccess("Profile updated successfully! 🎉");
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      profile.phone,
      profile.institution,
      profile.course,
      profile.yearOfStudy,
      profile.linkedIn,
      profile.bio,
      profile.startup_idea,
      (profile.skills?.length ?? 0) > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Progress */}
      <div className="rounded-3xl p-8 text-green-200 mb-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-green-100 text-lg mb-6">
              Complete your profile to unlock all features and opportunities
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-100">Profile Completion</span>
                <span className="font-semibold">{completion}%</span>
              </div>
              <div className="w-full bg-blue-500/30 rounded-full h-3">
                <div 
                  className="bg-green-200 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white/10 rounded-2xl p-6 mt-6 lg:mt-0 lg:ml-6 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{(profile.skills ?? []).length}</div>
                <div className="text-blue-100 text-sm">Skills</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Object.values(profile).filter(v => v && v.toString().length > 0).length - 1}
                </div>
                <div className="text-blue-100 text-sm">Fields Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-8">
            <nav className="p-6">
              <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <ul className="space-y-2">
                {[
                  { id: "personal", label: "Personal Info", icon: FiUser },
                  { id: "academic", label: "Academic", icon: FiBook },
                  { id: "professional", label: "Professional", icon: FiBriefcase },
                  { id: "skills", label: "Skills", icon: FiAward },
                  { id: "bio", label: "Bio & Vision", icon: FiGitBranch },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="lg:col-span-3">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            {(activeSection === "personal" || activeSection === "all") && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                    <FiUser className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-gray-600">Your basic contact and personal details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FiPhone size={16} />
                      <span>Phone Number</span>
                    </label>
                    <input
                      value={profile.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FiStar size={16} />
                      <span>Year of Study</span>
                    </label>
                    <select
                      value={profile.yearOfStudy || ""}
                      onChange={(e) => handleChange("yearOfStudy", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year+">5th Year+</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Academic Information */}
            {(activeSection === "academic" || activeSection === "all") && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
                    <FiBook className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Academic Information</h2>
                    <p className="text-gray-600">Your educational background and institution</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <span>Institution</span>
                    </label>
                    <input
                      value={profile.institution || ""}
                      onChange={(e) => handleChange("institution", e.target.value)}
                      placeholder="University of Technology"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <span>Course/Program</span>
                    </label>
                    <input
                      value={profile.course || ""}
                      onChange={(e) => handleChange("course", e.target.value)}
                      placeholder="Computer Science"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Links */}
            {(activeSection === "professional" || activeSection === "all") && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                    <FiLink className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Professional Links</h2>
                    <p className="text-gray-600">Connect your professional profiles and resume</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FiGlobe size={16} />
                      <span>LinkedIn Profile</span>
                    </label>
                    <input
                      value={profile.linkedIn || ""}
                      onChange={(e) => handleChange("linkedIn", e.target.value)}
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FiGlobe size={16} />
                      <span>Personal Website</span>
                    </label>
                    <input
                      value={profile.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FiFileText size={16} />
                      <span>Resume URL</span>
                    </label>
                    <input
                      value={profile.resumeUrl || ""}
                      onChange={(e) => handleChange("resumeUrl", e.target.value)}
                      placeholder="https://drive.google.com/your-resume"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Skills & Expertise */}
            {(activeSection === "skills" || activeSection === "all") && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl">
                    <FiAward className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Skills & Expertise</h2>
                    <p className="text-gray-600">Showcase your technical and professional skills</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Add Your Skills
                    </label>
                    <input
                      value={(profile.skills || []).join(", ")}
                      onChange={(e) => handleSkillsChange(e.target.value)}
                      placeholder="JavaScript, React, Node.js, UI/UX Design, Project Management"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Separate multiple skills with commas. These will be displayed as tags.
                    </p>
                  </div>

                  {/* Skills Tags Display */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bio & Startup Vision */}
            {(activeSection === "bio" || activeSection === "all") && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl">
                    <FiGitBranch className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Bio & Vision</h2>
                    <p className="text-gray-600">Share your story and entrepreneurial vision</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Professional Bio
                    </label>
                    <textarea
                      value={profile.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Tell us about yourself, your background, achievements, and what drives you..."
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white resize-none"
                      rows={5}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Share your professional journey</span>
                      <span>{profile.bio?.length || 0}/500</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Startup Idea / Project Vision
                    </label>
                    <textarea
                      value={profile.startup_idea || ""}
                      onChange={(e) => handleChange("startup_idea", e.target.value)}
                      placeholder="Describe your startup idea, project vision, or entrepreneurial aspirations. What problem are you solving? What makes your approach unique?"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white resize-none"
                      rows={4}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Describe your innovative idea</span>
                      <span>{profile.startup_idea?.length || 0}/300</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8">
              <div className="text-gray-600 text-sm">
                <strong>Tip:</strong> Complete all sections for the best profile strength
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3 min-w-[200px] justify-center"
              >
                {saving ? (
                  <>
                    <FiLoader className="animate-spin" size={20} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={20} />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentAccountSettings;