import React, { useEffect, useMemo, useState } from "react";
import { upsertMyMenteeProfile, getMyMenteeProfile } from "../../../utils/api";
import type { MenteeProfile } from "../../../utils/api";
import ProfileForm from "./ProfileForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (profile: MenteeProfile) => void;
  initialProfile?: MenteeProfile | null;
  minPercent?: number;
};

const ProfileCompletionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCompleted,
  initialProfile,
  minPercent = 25,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<MenteeProfile>({
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
  });

  // Load profile when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (initialProfile) {
      setProfile(prev => ({ ...prev, ...initialProfile }));
      return;
    }
    // Fetch from API if not provided
    (async () => {
      try {
        setFetching(true);
        const data = await getMyMenteeProfile();
        if (data?.profile) setProfile(prev => ({ ...prev, ...data.profile }));
      } catch (e: any) {
        setError(e.message || "Failed to load profile");
      } finally {
        setFetching(false);
      }
    })();
  }, [isOpen, initialProfile]);

  // Calculate applicable fields based on category
  const applicableFields = useMemo(() => {
    const common: (keyof MenteeProfile)[] = [
      "category", "bio", "skills", "phone", "field", "linkedIn", "website", "resumeUrl",
    ];
    if (profile.category === "Student") {
      return [...common, "institution", "course", "yearOfStudy"] as (keyof MenteeProfile)[];
    }
    return common;
  }, [profile.category]);

  // Calculate completion percentage
  const completionPercent = useMemo(() => {
    const total = applicableFields.length;
    const filled = applicableFields.reduce((acc, key) => {
      const v = profile[key];
      if (v === undefined || v === null) return acc;
      if (typeof v === "string" || typeof v === "number") {
        return (String(v).trim().length > 0) ? acc + 1 : acc;
      }
      return acc;
    }, 0);
    return Math.round((filled / total) * 100);
  }, [applicableFields, profile]);

  const handleChange = (field: keyof MenteeProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSave = async () => {
    if (completionPercent < minPercent) return;

    setLoading(true);
    setError(null);
    try {
      const res = await upsertMyMenteeProfile(profile);
      if (res?.profile) {
        setProfile(res.profile);
        // Success delay for smooth UX
        if (completionPercent >= minPercent) {
          setTimeout(() => onCompleted(res.profile), 800);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const canDismiss = completionPercent >= minPercent;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={canDismiss ? onClose : undefined}
    >
      <div
        className="bg-gradient-to-br from-white via-gray-50 to-green-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
              <p className="text-green-100 text-sm">Help us understand you better to provide personalized support</p>
            </div>
          </div>
          {canDismiss && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-800 px-5 py-4 text-sm flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Form Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
              <span className="text-sm text-gray-600 font-medium">Loading your profile...</span>
            </div>
          ) : (
            <ProfileForm
              profile={profile}
              onChange={handleChange}
              onSave={handleSave}
              loading={loading}
              completionPercent={completionPercent}
              minPercent={minPercent}
              showActions={true}
              onCancel={canDismiss ? onClose : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
