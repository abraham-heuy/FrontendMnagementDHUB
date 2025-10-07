import React, { useEffect, useState } from "react";
import {
  assignStudentToMentor,
  getAllMentors,
  unassignStudentFromMentor,
  getAllAllocations,
} from "../../lib/services/mentorService";
import type { MentorProfile, MentorAllocation } from "../../lib/types/mentor";
import type { StudentProfile } from "../../lib/types/profile";
import { listAllStudentProfiles } from "../../lib/services/Profilesservice";

interface Student {
  id: string;
  name: string;
  field: string;
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

  // ✅ Reusable function to fetch mentors, students, and allocations
  const loadMentorsAndStudents = async () => {
    try {
      setLoading(true);
      const mentorProfiles: MentorProfile[] = await getAllMentors();
      const studentProfiles: StudentProfile[] = await listAllStudentProfiles();

      const normalizedStudents: Student[] = studentProfiles.map((s) => ({
        id: s.id,
        name: s.user?.fullName ?? "Unnamed Student",
        field: s.field ?? "N/A",
      }));

      const allocations: MentorAllocation[] = await getAllAllocations();

      const mentorIdToStudents: Record<string, Student[]> = {};
      allocations.forEach((alloc) => {
        const student = normalizedStudents.find((s) => s.id === alloc.studentId);
        if (student) {
          if (!mentorIdToStudents[alloc.mentorId]) mentorIdToStudents[alloc.mentorId] = [];
          mentorIdToStudents[alloc.mentorId].push(student);
        }
      });

      const normalizedMentors: Mentor[] = mentorProfiles.map((mentor) => ({
        id: mentor.id,
        name: mentor.user?.fullName ?? "Unnamed Mentor",
        specialization: mentor.specialization ?? "Not specified",
        contact: mentor.contact ?? "N/A",
        experience: mentor.experience ?? "No experience info",
        recentProject: mentor.recentProject ?? "None",
        assignedStudents: mentorIdToStudents[mentor.id] ?? [],
      }));

      setMentors(normalizedMentors);
      setStudents(normalizedStudents);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load mentor management data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    loadMentorsAndStudents();
  }, []);

  // ✅ Assign a student and refresh data
  const handleAssignStudent = async () => {
    if (!selectedMentor || !selectedStudentId) return;
    try {
      setAssigning(true);
      await assignStudentToMentor(selectedMentor.id, selectedStudentId);
      await loadMentorsAndStudents(); // refresh to match backend
      setSelectedMentor(null);
      setSelectedStudentId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigning(false);
    }
  };

  // ✅ Unassign a student and refresh data
  const handleUnassignStudent = async (studentId: string) => {
    if (!selectedMentor) return;
    try {
      await unassignStudentFromMentor(studentId);
      await loadMentorsAndStudents(); // refresh to match backend
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ Filter students matching mentor specialization
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
          <p>Total Mentors: <span className="font-semibold">{mentors.length}</span></p>
          <p>Total Students: <span className="font-semibold">{students.length}</span></p>
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
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Available Mentors</h3>
          {mentors
            .filter((m) => m.assignedStudents.length === 0)
            .map((mentor) => (
              <div key={mentor.id} className="border rounded-xl p-4 hover:shadow-md transition">
                <h4 className="font-medium text-slate-700">{mentor.name}</h4>
                <p className="text-xs text-slate-500">{mentor.specialization}</p>
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
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Assigned Mentors</h3>
          {mentors
            .filter((m) => m.assignedStudents.length > 0)
            .map((mentor) => (
              <div key={mentor.id} className="border rounded-xl p-4 hover:shadow-md transition">
                <h4 className="font-medium text-slate-700">{mentor.name}</h4>
                <p className="text-xs text-slate-500">{mentor.specialization}</p>
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

      {/* Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 w-full max-w-lg animate-fadeIn">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{selectedMentor.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{selectedMentor.specialization} | {selectedMentor.contact}</p>
            <p className="text-sm text-slate-600 mb-4">{selectedMentor.experience}</p>

            {/* Assigned students */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2 text-sm">Assigned Students</h4>
              {selectedMentor.assignedStudents.length === 0 ? (
                <p className="text-xs text-slate-500">No students assigned</p>
              ) : (
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {selectedMentor.assignedStudents.map((s) => (
                    <li key={s.id} className="flex justify-between">
                      <span>{s.name} ({s.field})</span>
                      <button
                        onClick={() => handleUnassignStudent(s.id)}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign New Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-sky-300"
              >
                <option value="">Select a student</option>
                {matchedStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.field})</option>
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
    </div>
  );
};

export default MentorManagement;
