import { FiMail, FiUser, FiPhone, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getMyAllocatedMentor } from "../../../lib/services/mentorService";
import type { MentorProfile } from "../../../lib/types/mentor";

const MentorList = () => {
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const data = await getMyAllocatedMentor();
        setMentor(data);
      } catch (err: any) {
        console.error("Error fetching mentor:", err);
        setError(err.message || "Failed to load mentor");
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/40 h-full rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-green-600 text-3xl" />
          <span className="ml-3 text-gray-600">Loading mentor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/40 h-full rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <FiAlertCircle className="mx-auto text-3xl text-red-500 mb-3" />
          <p className="text-red-500 mb-2">Unable to load mentor</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/40 h-full rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-50 p-2 rounded-lg">
          <FiUser className="text-green-200 text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Your Mentor</h2>
          <p className="text-gray-500 text-sm">
            {mentor ? "Your assigned mentor for guidance" : "No mentor assigned yet"}
          </p>
        </div>
      </div>

      {/* Mentor Details */}
      {!mentor ? (
        <div className="text-center py-8 text-gray-500">
          <FiUser className="mx-auto text-3xl text-gray-300 mb-2" />
          <p>No mentor assigned yet</p>
          <p className="text-sm mt-1">Your mentor will appear here once allocated</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-5 hover:border-green-200 transition-colors bg-white">
            {/* Mentor Name */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-200 text-lg">
                {mentor.user?.fullName || "Mentor"}
              </h3>
            </div>

            {/* Specialization */}
            {mentor.specialization && (
              <p className="text-gray-700 text-sm mb-4">
                <strong className="text-gray-900">Specialization:</strong> {mentor.specialization}
              </p>
            )}

            {/* Experience */}
            {mentor.experience && (
              <p className="text-gray-700 text-sm mb-4">
                <strong className="text-gray-900">Experience:</strong> {mentor.experience}
              </p>
            )}

            {/* Recent Project */}
            {mentor.recentProject && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Recent Project:</p>
                <p className="text-sm text-gray-700">{mentor.recentProject}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2 border-t pt-4 mt-4">
              <div className="flex items-center text-text text-sm">
                <FiMail className="mr-2 text-green-100" size={14} />
                <span className="truncate text-light italic">
                  {mentor.user?.email || "N/A"}
                </span>
              </div>

              {mentor.contact && (
                <div className="flex items-center text-light text-sm">
                  <FiPhone className="mr-2 text-green-100" size={14} />
                  <span className="text-xs italic">{mentor.contact}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorList;