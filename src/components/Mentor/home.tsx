import React, { useEffect, useState } from "react";
import { BookOpen, Users, Calendar, CheckCircle, X } from "lucide-react";
import type { MentorProfile, StudentSummary } from "../../lib/types/mentor";
import type { StudentProfile } from "../../lib/types/profile";
import {
  getMyAllocatedStudents,
  getMyMentorProfile,
} from "../../lib/services/mentorService";
import { getStudentProfileByUserId } from "../../lib/services/Profilesservice";

const DedanGreen = "#0f5132";

const MentorHome: React.FC = () => {
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mentorData, studentData] = await Promise.all([
          getMyMentorProfile(),
          getMyAllocatedStudents(),
        ]);
        setMentor(mentorData);
        setStudents(studentData);
      } catch (err) {
        console.error("Error loading mentor data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleViewProfile = async (studentId: string) => {
    try {
      const profile = await getStudentProfileByUserId(studentId);
      setSelectedStudent(profile);
      document.body.style.overflow = "hidden"; // prevent background scroll
    } catch (err) {
      console.error("Error fetching student profile:", err);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-emerald-800 font-semibold">
        Loading mentor dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ Mentor Overview */}
      <section className="bg-white shadow-sm rounded-lg p-6 border border-emerald-100">
        <h2 className="text-2xl font-bold mb-4" style={{ color: DedanGreen }}>
          Welcome, {mentor?.user?.fullName || "Mentor"}
        </h2>
        <p className="text-gray-700 mb-3">
          Specialization:{" "}
          <span className="font-medium text-emerald-800">
            {mentor?.specialization || "N/A"}
          </span>
        </p>
        <p className="text-gray-700">
          Experience:{" "}
          <span className="font-medium text-emerald-800">
            {mentor?.experience || "N/A"}
          </span>
        </p>
      </section>

      {/* ✅ Mentor Summary */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-emerald-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <Users className="text-emerald-700" size={28} />
          <div>
            <h3 className="text-sm text-gray-600">Allocated Students</h3>
            <p className="text-xl font-semibold text-emerald-900">
              {students.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <Calendar className="text-emerald-700" size={28} />
          <div>
            <h3 className="text-sm text-gray-600">Upcoming Meetings</h3>
            <p className="text-xl font-semibold text-emerald-900">3</p>
          </div>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <CheckCircle className="text-emerald-700" size={28} />
          <div>
            <h3 className="text-sm text-gray-600">Pending Tasks</h3>
            <p className="text-xl font-semibold text-emerald-900">2</p>
          </div>
        </div>
      </section>

      {/* ✅ Allocated Students */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: DedanGreen }}>
          My Allocated Students
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-600">No students allocated yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white border border-emerald-100 rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Field: {student.field || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Institution: {student.institution || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Course: {student.course || "N/A"}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleViewProfile(student.id)}
                    className="text-emerald-700 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/20">
          <div className="backdrop-blur-xl bg-white/70 border border-emerald-100 shadow-2xl rounded-2xl w-11/12 md:w-2/3 lg:w-1/2 p-6 relative transition-all duration-300 ease-in-out">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>

            <h2
              className="text-2xl font-bold mb-3 text-center"
              style={{ color: DedanGreen }}
            >
              {selectedStudent.user?.fullName}
            </h2>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Institution:</strong>{" "}
                {selectedStudent.institution || "N/A"}
              </p>
              <p>
                <strong>Course:</strong> {selectedStudent.course || "N/A"}
              </p>
              <p>
                <strong>Field:</strong> {selectedStudent.field || "N/A"}
              </p>
              <p>
                <strong>Year of Study:</strong>{" "}
                {selectedStudent.yearOfStudy || "N/A"}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {selectedStudent.skills?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Startup Idea:</strong>{" "}
                {selectedStudent.startup_idea || "N/A"}
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                {selectedStudent.linkedIn ? (
                  <a
                    href={selectedStudent.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className="bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorHome;
