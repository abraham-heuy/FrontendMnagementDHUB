import { useState } from "react";
import type { MenteeProfile } from "../../../utils/api";

interface ProfileFormProps {
  profile: MenteeProfile;
  onChange: (field: keyof MenteeProfile, value: any) => void;
  onSave: () => void;
  loading?: boolean;
  completionPercent: number;
  minPercent?: number;
  showActions?: boolean;
  onCancel?: () => void;
}

const categories: Array<"Student" | "Non-Student"> = ["Student", "Non-Student"];

export default function ProfileForm({
  profile,
  onChange,
  onSave,
  loading = false,
  completionPercent,
  minPercent = 25,
  showActions = true,
  onCancel
}: ProfileFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validation rules
  const validateField = (field: keyof MenteeProfile) => {
    const value = profile[field];
    let error = "";

    switch (field) {
      case "phone":
        if (value && typeof value === "string") {
          const phoneRegex = /^[+]?[\d\s-()]+$/;
          if (!phoneRegex.test(value)) {
            error = "Please enter a valid phone number";
          }
        }
        break;
      case "linkedIn":
        if (value && typeof value === "string" && !value.startsWith("http")) {
          error = "LinkedIn URL must start with http:// or https://";
        }
        break;
      case "website":
        if (value && typeof value === "string" && !value.startsWith("http")) {
          error = "Website URL must start with http:// or https://";
        }
        break;
      case "resumeUrl":
        if (value && typeof value === "string" && !value.startsWith("http")) {
          error = "Resume URL must start with http:// or https://";
        }
        break;
      case "category":
        if (!value) {
          error = "Please select your account type";
        }
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const getFieldClassName = (field: keyof MenteeProfile) => {
    const hasError = fieldErrors[field];
    const isFilled = Boolean(profile[field]);
    const baseClasses = "px-4 py-2.5 rounded-xl border-2 transition-all duration-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500";

    if (hasError) {
      return `${baseClasses} border-red-300 bg-red-50 text-red-900`;
    }
    if (isFilled) {
      return `${baseClasses} border-green-300 bg-green-50/50 text-gray-900`;
    }
    return `${baseClasses} border-gray-300 bg-white text-gray-900 hover:border-gray-400`;
  };

  const handleChange = (field: keyof MenteeProfile, value: any) => {
    onChange(field, value);
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const canDismiss = completionPercent >= minPercent;

  // Get motivational message based on completion
  const getMotivationalMessage = (percent: number) => {
    if (percent === 0) return "Let's get started! Your profile is your gateway to opportunities.";
    if (percent < 30) return "Great start! Keep going to unlock all features.";
    if (percent < 50) return "You're making progress! Halfway there.";
    if (percent < 25) return "Almost there! Just a bit more to complete your profile.";
    return "Excellent! Your profile is ready to make an impact.";
  };

  // Get badge based on completion
  const getCompletionBadge = (percent: number) => {
    if (percent < 30) {
      return { label: "Bronze", color: "from-amber-700 via-amber-800 to-amber-900", icon: "🥉" };
    }
    if (percent < 25) {
      return { label: "Silver", color: "from-gray-400 via-gray-500 to-gray-600", icon: "🥈" };
    }
    return { label: "Gold", color: "from-yellow-400 via-yellow-500 to-yellow-600", icon: "🥇" };
  };

  const badge = getCompletionBadge(completionPercent);
  const motivationalMsg = getMotivationalMessage(completionPercent);

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50/30 rounded-2xl p-6 border-2 border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white text-xs font-bold flex items-center gap-1.5 shadow-md`}>
              <span className="text-base">{badge.icon}</span>
              <span>{badge.label} Level</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {completionPercent}%
            </span>
          </div>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${completionPercent >= minPercent
              ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"
              }`}
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{motivationalMsg}</span>
        </p>
      </div>

      {/* Account Type Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-100 shadow-sm">
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          Account Type
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleChange("category", c)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${profile.category === c
                ? "border-blue-500 bg-blue-100 text-blue-900 shadow-md"
                : "border-gray-200 bg-white hover:border-blue-300 text-gray-700"
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">
                  {c === "Student" ? "🎓" : "💼"}
                </span>
                <span className="font-semibold text-sm">{c}</span>
                {profile.category === c && (
                  <span className="text-blue-600 text-xs">✓ Selected</span>
                )}
              </div>
            </button>
          ))}
        </div>
        {fieldErrors.category && (
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fieldErrors.category}
          </p>
        )}
      </div>

      {/* Personal Details Section */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          Personal Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              📞 Phone Number
              {profile.phone && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <input
              value={profile.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => validateField("phone")}
              className={getFieldClassName("phone")}
              placeholder="+256 700 000 000"
            />
            {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              🎯 Field of Study/Domain
              {profile.field && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <input
              value={profile.field || ""}
              onChange={(e) => handleChange("field", e.target.value)}
              className={getFieldClassName("field")}
              placeholder="e.g. Software Engineering, Business"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              ✍️ Bio / About You
              {profile.bio && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              className={getFieldClassName("bio")}
              rows={3}
              placeholder="Tell us about yourself, your interests, and goals..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              🛠️ Skills (comma-separated)
              {profile.skills && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <input
              value={profile.skills || ""}
              onChange={(e) => handleChange("skills", e.target.value)}
              className={getFieldClassName("skills")}
              placeholder="e.g. React, Python, Leadership, Design"
            />
            <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
          </div>
        </div>
      </div>

      {/* Academic Details (Student only) */}
      {profile.category === "Student" && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100 shadow-sm">
          <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            Academic Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                🏫 Institution/University
                {profile.institution && <span className="text-green-600 ml-auto text-xs">✓</span>}
              </label>
              <input
                value={profile.institution || ""}
                onChange={(e) => handleChange("institution", e.target.value)}
                className={getFieldClassName("institution")}
                placeholder="e.g. Dedan Kimathi University of Technology"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                📚 Course/Program
                {profile.course && <span className="text-green-600 ml-auto text-xs">✓</span>}
              </label>
              <input
                value={profile.course || ""}
                onChange={(e) => handleChange("course", e.target.value)}
                className={getFieldClassName("course")}
                placeholder="e.g. BSc Computer Science"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                📅 Year of Study
                {profile.yearOfStudy && <span className="text-green-600 ml-auto text-xs">✓</span>}
              </label>
              <input
                value={profile.yearOfStudy || ""}
                onChange={(e) => handleChange("yearOfStudy", e.target.value)}
                className={getFieldClassName("yearOfStudy")}
                placeholder="e.g. Year 2, Final Year"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                🎫 Registration Number
                {profile.registrationNumber && <span className="text-green-600 ml-auto text-xs">✓</span>}
              </label>
              <input
                value={profile.registrationNumber || ""}
                onChange={(e) => handleChange("registrationNumber", e.target.value)}
                className={getFieldClassName("registrationNumber")}
                placeholder="e.g. 2020/BSE/001 (optional)"
              />
              <p className="text-xs text-gray-500 mt-1">Optional - will be filled by backend if available</p>
            </div>
          </div>
        </div>
      )}

      {/* Professional Links Section */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100 shadow-sm">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          Professional Links
          <span className="ml-auto text-xs text-gray-500 font-normal">Optional</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              💼 LinkedIn Profile
              {profile.linkedIn && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <input
              value={profile.linkedIn || ""}
              onChange={(e) => handleChange("linkedIn", e.target.value)}
              onBlur={() => validateField("linkedIn")}
              className={getFieldClassName("linkedIn")}
              placeholder="https://linkedin.com/in/username"
            />
            {fieldErrors.linkedIn && <p className="text-xs text-red-600 mt-1">{fieldErrors.linkedIn}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              🌐 Personal Website
              {profile.website && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <input
              value={profile.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              onBlur={() => validateField("website")}
              className={getFieldClassName("website")}
              placeholder="https://yourwebsite.com"
            />
            {fieldErrors.website && <p className="text-xs text-red-600 mt-1">{fieldErrors.website}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              📄 Resume/CV URL
              {profile.resumeUrl && <span className="text-green-600 ml-auto text-xs">✓</span>}
            </label>
            <input
              value={profile.resumeUrl || ""}
              onChange={(e) => handleChange("resumeUrl", e.target.value)}
              onBlur={() => validateField("resumeUrl")}
              className={getFieldClassName("resumeUrl")}
              placeholder="https://drive.google.com/... or https://yoursite.com/resume.pdf"
            />
            {fieldErrors.resumeUrl && <p className="text-xs text-red-600 mt-1">{fieldErrors.resumeUrl}</p>}
            <p className="text-xs text-gray-500 mt-1">Link to your resume hosted on Google Drive, Dropbox, or your website</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Required: <span className="font-semibold text-green-600">{minPercent}%</span> | Current: <span className="font-semibold">{completionPercent}%</span></span>
            </p>
            <div className="flex items-center gap-2">
              {canDismiss && onCancel && (
                <button
                  onClick={onCancel}
                  type="button"
                  className="px-4 py-2 rounded-full text-xs font-medium border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Cancel
                </button>
              )}
              <button
                disabled={loading || completionPercent < minPercent}
                onClick={onSave}
                type="button"
                className={`px-6 py-2 rounded-full text-xs font-semibold text-white transition-all transform ${(loading || completionPercent < minPercent)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:shadow-lg hover:scale-105"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : completionPercent < minPercent ? (
                  `Fill ${minPercent - completionPercent}% more`
                ) : (
                  "Save & Continue →"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
