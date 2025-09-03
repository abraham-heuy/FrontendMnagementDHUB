import React, { useState } from "react";

// Types
interface Student {
  id: number;
  name: string;
  stage: "Pre-Incubation" | "Incubation" | "Startup";
  project: string;
  progress: string;
  lastActive: string; // frequency of activity
  history: string[]; // progress history
  active: boolean; // inactive students
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Alice Johnson",
      stage: "Pre-Incubation",
      project: "Eco-friendly packaging startup",
      progress: "Idea validation",
      lastActive: "2 days ago",
      history: ["Applied", "Pre-Incubation"],
      active: true,
    },
    {
      id: 2,
      name: "Michael Lee",
      stage: "Incubation",
      project: "HealthTech wearable sensors",
      progress: "MVP development",
      lastActive: "5 hours ago",
      history: ["Applied", "Pre-Incubation", "Incubation"],
      active: true,
    },
    {
      id: 3,
      name: "Sophia Chen",
      stage: "Startup",
      project: "AI tutoring platform",
      progress: "Scaling users",
      lastActive: "3 weeks ago",
      history: ["Applied", "Pre-Incubation", "Incubation", "Startup"],
      active: false,
    },
    {
      id: 4,
      name: "Alice Johnson",
      stage: "Pre-Incubation",
      project: "Eco-friendly packaging startup",
      progress: "Idea validation",
      lastActive: "2 days ago",
      history: ["Applied", "Pre-Incubation"],
      active: true,
    },
    {
      id: 5,
      name: "Alice Johnson",
      stage: "Pre-Incubation",
      project: "Eco-friendly packaging startup",
      progress: "Idea validation",
      lastActive: "2 days ago",
      history: ["Applied", "Pre-Incubation"],
      active: true,
    },
    {
      id: 6,
      name: "Alice Johnson",
      stage: "Pre-Incubation",
      project: "Eco-friendly packaging startup",
      progress: "Idea validation",
      lastActive: "2 days ago",
      history: ["Applied", "Pre-Incubation"],
      active: true,
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [confirmPromotion, setConfirmPromotion] = useState<Student | null>(null);

  // Handle promotion
  const promoteStudent = (id: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              stage:
                s.stage === "Pre-Incubation"
                  ? "Incubation"
                  : s.stage === "Incubation"
                  ? "Startup"
                  : "Startup",
              history: [...s.history, s.stage === "Pre-Incubation" ? "Incubation" : "Startup"],
            }
          : s
      )
    );
    setConfirmPromotion(null);
    setSelectedStudent(null);
  };

  // Group students by stage
  const grouped = {
    "Pre-Incubation": students.filter((s) => s.stage === "Pre-Incubation" && s.active),
    Incubation: students.filter((s) => s.stage === "Incubation" && s.active),
    Startup: students.filter((s) => s.stage === "Startup" && s.active),
  };

  // Inactive students
  const inactive = students.filter((s) => !s.active);

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Student Management</h2>
        <p className="text-sm text-slate-500">
          Track progress, manage profiles, and promote students through stages
        </p>
      </div>

      {/* Stage Sections */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([stage, list]) => (
          <div key={stage} className="bg-white shadow rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{stage}</h3>
            {list.length === 0 ? (
              <p className="text-sm text-slate-500">No students in this stage</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <h4 className="font-medium text-slate-700">{student.name}</h4>
                    <p className="text-xs text-slate-500">{student.project}</p>
                    <p className="text-sm text-slate-600 mt-2">
                      Progress: {student.progress}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Last active: {student.lastActive}
                    </p>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1 text-sm text-sky-500 border border-sky-400 rounded-lg hover:bg-sky-50"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inactive Students Section */}
      <div className="mt-10 bg-white shadow rounded-2xl p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Inactive Students
        </h3>
        {inactive.length === 0 ? (
          <p className="text-sm text-slate-500">No inactive students</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactive.map((student) => (
              <div
                key={student.id}
                className="border rounded-xl p-4 hover:shadow-md transition bg-slate-50"
              >
                <h4 className="font-medium text-slate-700">{student.name}</h4>
                <p className="text-xs text-slate-500">{student.project}</p>
                <p className="text-sm text-slate-600 mt-2">
                  Progress: {student.progress}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Last active: {student.lastActive}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg animate-slideUp">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {selectedStudent.name}
            </h3>
            <p className="text-sm text-slate-500 mb-2">
              Stage: {selectedStudent.stage}
            </p>
            <p className="text-sm text-slate-600 mb-4">{selectedStudent.project}</p>
            <p className="text-sm text-slate-600 mb-4">
              Progress: {selectedStudent.progress}
            </p>

            {/* Progress History */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Progress History
              </h4>
              <ul className="space-y-1 text-sm text-slate-500">
                {selectedStudent.history.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {selectedStudent.stage !== "Startup" && (
                <button
                  onClick={() => setConfirmPromotion(selectedStudent)}
                  className="px-4 py-2 text-sm rounded-xl bg-sky-500 text-white hover:bg-sky-600"
                >
                  Promote to Next Stage
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Promotion Confirmation Modal */}
      {confirmPromotion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Confirm Promotion
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to promote{" "}
              <span className="font-medium">{confirmPromotion.name}</span> from{" "}
              {confirmPromotion.stage} to the next stage?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmPromotion(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => promoteStudent(confirmPromotion.id)}
                className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
