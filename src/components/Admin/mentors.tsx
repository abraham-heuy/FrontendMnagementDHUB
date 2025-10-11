import React, { useEffect, useState } from "react";
import {
  assignStudentToMentor,
  getAllMentors,
  unassignStudentFromMentor,
  getAllAllocations,
} from "../../lib/services/mentorService";
import type { MentorProfile, MentorAllocation } from "../../lib/types/mentor";
import { listAllStudentProfiles } from "../../lib/services/Profilesservice";

interface Student {
  id: string;
  name: string;
  field: string;
  allocationId?: string; // <- include allocation id for unassigning
}

interface Mentor {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  experience: string;
  recentProject: string;
  assignedStudents: Student[];
}

const MentorManagement: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadMentorsAndStudents = async () => {
    try {
      setLoading(true);

      const mentorProfiles: MentorProfile[] = await getAllMentors();
      const studentProfiles = await listAllStudentProfiles();
      const allocations: MentorAllocation[] = await getAllAllocations();

      const normalizedStudents: Student[] = studentProfiles.map((s) => ({
        id: s.user.id,
        name: s.user?.fullName ?? "Unnamed Student",
        field: s.field ?? "N/A",
      }));

      const mentorIdToStudents: Record<string, Student[]> = {};
      allocations.forEach((alloc) => {
        const mentorId = alloc.mentor.id;
        if (!mentorIdToStudents[mentorId]) mentorIdToStudents[mentorId] = [];
        mentorIdToStudents[mentorId].push({
          id: alloc.student.id,
          name: alloc.student.name,
          field: alloc.student.field ?? "N/A",
          allocationId: alloc.id,
        });
      });

      const normalizedMentors: Mentor[] = mentorProfiles.map((mentor) => ({
        id: mentor.user?.id ?? mentor.id,
        name: mentor.user?.fullName ?? "Unnamed Mentor",
        specialization: mentor.specialization ?? "Not specified",
        contact: mentor.contact ?? "N/A",
        experience: mentor.experience ?? "No experience info",
        recentProject: mentor.recentProject ?? "None",
        assignedStudents:
          mentorIdToStudents[mentor.user?.id ?? mentor.id] ?? [],
      }));

      setMentors(normalizedMentors);
      setStudents(normalizedStudents);
    } catch (err: any) {
      console.error("Error loading mentor management data:", err);
      setError(err.message || "Failed to load mentor management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentorsAndStudents();
  }, []);

  const handleAssignStudent = async () => {
    if (!selectedMentor || !selectedStudentId) return;
    try {
      setAssigning(true);
      await assignStudentToMentor(selectedMentor.id, selectedStudentId);
      await loadMentorsAndStudents();
      setSelectedStudentId("");
      setSelectedMentor(null);

      // Show success message for 3 seconds
      setSuccessMessage("Student successfully assigned!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignStudent = async (allocationId?: string) => {
    if (!allocationId) return;
    try {
      await unassignStudentFromMentor(allocationId);
      await loadMentorsAndStudents();

      // Show success message for 3 seconds
      setSuccessMessage("Student successfully unassigned!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const matchedStudents = selectedMentor
    ? students.filter(
        (s) =>
          s.field.toLowerCase() === selectedMentor.specialization.toLowerCase()
      )
    : [];

  if (loading)
    return (
      <div className="p-6 text-center text-slate-500 animate-pulse">
        Loading mentors and students...
      </div>
    );

  if (error)
    return <div className="p-6 text-center text-red-500">⚠️ {error}</div>;

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Summary */}
      <div className="mb-6 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          Mentor Management
        </h2>
        <p className="text-sm text-slate-500">
          Manage mentor assignments, profiles, and student allocations.
        </p>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600">
          <p>
            Total Mentors:{" "}
            <span className="font-semibold">{mentors.length}</span>
          </p>
          <p>
            Total Students:{" "}
            <span className="font-semibold">{students.length}</span>
          </p>
          <p>
            Assigned Students:{" "}
            <span className="font-semibold">
              {mentors.reduce((sum, m) => sum + m.assignedStudents.length, 0)}
            </span>
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Mentors */}
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Available Mentors
          </h3>
          {mentors
            .filter((m) => m.assignedStudents.length === 0)
            .map((mentor) => (
              <div
                key={mentor.id}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <h4 className="font-medium text-slate-700">{mentor.name}</h4>
                <p className="text-xs text-slate-500">
                  {mentor.specialization}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-400">
                    Students: {mentor.assignedStudents.length}
                  </span>
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="px-3 py-1 text-sm text-sky-500 border border-sky-400 rounded-lg hover:bg-sky-50"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Assigned Mentors */}
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Assigned Mentors
          </h3>
          {mentors
            .filter((m) => m.assignedStudents.length > 0)
            .map((mentor) => (
              <div
                key={mentor.id}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <h4 className="font-medium text-slate-700">{mentor.name}</h4>
                <p className="text-xs text-slate-500">
                  {mentor.specialization}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-400">
                    Students: {mentor.assignedStudents.length}
                  </span>
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="px-3 py-1 text-sm text-sky-500 border border-sky-400 rounded-lg hover:bg-sky-50"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Mentor Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 w-full max-w-lg animate-fadeIn">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {selectedMentor.name}
            </h3>
            <p className="text-sm text-slate-500 mb-2">
              {selectedMentor.specialization} | {selectedMentor.contact}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              {selectedMentor.experience}
            </p>

            {/* Assigned students */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2 text-sm">
                Assigned Students
              </h4>
              {selectedMentor.assignedStudents.length === 0 ? (
                <p className="text-xs text-slate-500">No students assigned</p>
              ) : (
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {selectedMentor.assignedStudents.map((s) => (
                    <li key={s.id} className="flex justify-between">
                      <span>
                        {s.name} ({s.field})
                      </span>
                      <button
                        onClick={() => handleUnassignStudent(s.allocationId)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Unassign
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Assign new student */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assign New Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-sky-300"
              >
                <option value="">Select a student</option>
                {matchedStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.field})
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedMentor(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleAssignStudent}
                disabled={!selectedStudentId || assigning}
                className="px-4 py-2 text-sm rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
              >
                {assigning ? "Assigning..." : "Assign Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-4 px-6 animate-fadeIn text-green-600 font-medium">
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
