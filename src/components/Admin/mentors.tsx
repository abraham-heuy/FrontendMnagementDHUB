import React, { useState } from "react";

// Types
interface Student {
  id: number;
  name: string;
  field: string;
}

interface Mentor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  experience: string;
  recentProject: string;
  assignedStudents: Student[];
}

const MentorManagement: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: 1,
      name: "Dr. James Carter",
      specialization: "HealthTech",
      contact: "james.carter@example.com",
      experience: "10 years in healthcare innovation",
      recentProject: "Wearable health monitoring system",
      assignedStudents: [],
    },
    {
      id: 2,
      name: "Sarah Lee",
      specialization: "AI & Machine Learning",
      contact: "sarah.lee@example.com",
      experience: "7 years in AI solutions",
      recentProject: "AI-powered tutoring assistant",
      assignedStudents: [
        { id: 1, name: "Sophia Chen", field: "AI & Machine Learning" },
      ],
    },
  ]);

  const [students] = useState<Student[]>([
    { id: 1, name: "Sophia Chen", field: "AI & Machine Learning" },
    { id: 2, name: "Michael Lee", field: "HealthTech" },
    { id: 3, name: "Alice Johnson", field: "Sustainability" },
  ]);

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">("");

  // Assign student to mentor
  const handleAssignStudent = () => {
    if (selectedMentor && selectedStudentId !== "") {
      const student = students.find((s) => s.id === selectedStudentId);
      if (student) {
        setMentors((prev) =>
          prev.map((m) =>
            m.id === selectedMentor.id
              ? { ...m, assignedStudents: [...m.assignedStudents, student] }
              : m
          )
        );
      }
      setSelectedStudentId("");
      setSelectedMentor(null);
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Mentor Management
        </h2>
        <p className="text-sm text-slate-500">
          Allocate mentors to students and track assignments
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Available Mentors */}
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Available Mentors
          </h3>
          <div className="space-y-4">
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
                  <p className="text-sm text-slate-600 mt-2">
                    {mentor.experience}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Recent: {mentor.recentProject}
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
            {mentors.filter((m) => m.assignedStudents.length === 0).length ===
              0 && (
              <p className="text-sm text-slate-500">
                All mentors have students assigned
              </p>
            )}
          </div>
        </div>

        {/* Right: Assigned Mentors */}
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Assigned Mentors
          </h3>
          <div className="space-y-4">
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
                  <p className="text-sm text-slate-600 mt-2">
                    {mentor.experience}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Recent: {mentor.recentProject}
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
            {mentors.filter((m) => m.assignedStudents.length > 0).length ===
              0 && (
              <p className="text-sm text-slate-500">
                No mentors have been assigned students yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg animate-slideUp">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {selectedMentor.name}
            </h3>
            <p className="text-sm text-slate-500 mb-1">
              Specialization: {selectedMentor.specialization}
            </p>
            <p className="text-sm text-slate-500 mb-1">
              Contact: {selectedMentor.contact}
            </p>
            <p className="text-sm text-slate-600 mb-2">
              Experience: {selectedMentor.experience}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Recent Project: {selectedMentor.recentProject}
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
                    <li key={s.id}>
                      {s.name} ({s.field})
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
                onChange={(e) =>
                  setSelectedStudentId(Number(e.target.value) || "")
                }
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-sky-300"
              >
                <option value="">Select a student</option>
                {students
                  .filter(
                    (s) =>
                      s.field === selectedMentor.specialization &&
                      !selectedMentor.assignedStudents.some(
                        (a) => a.id === s.id
                      )
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.field})
                    </option>
                  ))}
              </select>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedMentor(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleAssignStudent}
                disabled={selectedStudentId === ""}
                className="px-4 py-2 text-sm rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
              >
                Assign Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
