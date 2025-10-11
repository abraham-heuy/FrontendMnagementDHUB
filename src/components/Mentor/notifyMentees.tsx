import React, { useEffect, useState } from "react";
import { Send, Loader2, Search } from "lucide-react";
import { getMyAllocatedStudents } from "../../lib/services/mentorService";
import type { StudentSummary } from "../../lib/types/mentor";

const DedanGreen = "#0f5132";

const MentorNotifications: React.FC = () => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentSummary[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Load allocated students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getMyAllocatedStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load allocated students.");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // ✅ Handle filtering
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredStudents(
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          (s.email ?? "").toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, students]);

  // ✅ Toggle individual selection
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ✅ Select / Deselect all
  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  // ✅ Handle send
  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }
    if (selectedStudents.length === 0) {
      setError("Please select at least one student.");
      return;
    }

    try {
      setSending(true);
      console.log({
        title,
        message,
        recipients: selectedStudents,
      });

      // Simulate sending delay
      await new Promise((res) => setTimeout(res, 1500));
      setSuccess("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setSelectedStudents([]);
    } catch (err) {
      setError("Failed to send notifications.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ Description */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-emerald-100">
        <h2 className="text-2xl font-bold mb-2" style={{ color: DedanGreen }}>
          Send Notifications
        </h2>
        <p className="text-gray-700">
          Write a short message to notify your assigned students instantly.
        </p>
      </div>

      {/* ✅ Notification Form */}
      <div className="bg-white border border-emerald-100 shadow-sm rounded-lg p-6 space-y-4">
        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
        )}
        {success && (
          <p className="text-green-700 text-sm bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          />
        </div>

        {/* ✅ Animated Send Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            disabled={sending}
            className={`flex items-center gap-2 px-6 py-2 text-white font-semibold rounded-lg shadow-md transition-transform ${
              sending
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-700 hover:bg-emerald-800 hover:scale-105"
            }`}
          >
            {sending ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Sending...
              </>
            ) : (
              <>
                <Send size={18} /> Send Notification
              </>
            )}
          </button>
        </div>
      </div>

      {/* ✅ User List */}
      <div className="bg-white border border-emerald-100 shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
          <h3 className="text-lg font-semibold" style={{ color: DedanGreen }}>
            Select Students to Notify
          </h3>

          {/* ✅ Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-emerald-600"
            />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-emerald-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* ✅ Select All */}
        {filteredStudents.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={
                filteredStudents.length > 0 &&
                selectedStudents.length === filteredStudents.length
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-emerald-600"
            />
            <span className="text-sm text-gray-700 font-medium">
              Select All ({filteredStudents.length})
            </span>
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((student) => (
              <label
                key={student.id}
                className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition ${
                  selectedStudents.includes(student.id)
                    ? "bg-emerald-50 border-emerald-400"
                    : "hover:bg-emerald-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <div>
                  <p className="font-medium text-emerald-900">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorNotifications;
