import React, { useState } from "react";

// Types
interface Group {
  id: number;
  name: string;
  members: { id: number; name: string; email: string }[];
}

interface Notification {
  id: number;
  subject: string;
  type: "Alert" | "Update" | "Warning";
  recipients: string[];
  method: string[];
  timestamp: string;
}

const Notifications: React.FC = () => {
  // Groups state
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Pre-Incubation",
      members: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com" },
        { id: 2, name: "Bob Lee", email: "bob@example.com" },
      ],
    },
    {
      id: 2,
      name: "Startup",
      members: [{ id: 3, name: "Sophia Chen", email: "sophia@example.com" }],
    },
  ]);

  // Notification history state
  const [history, setHistory] = useState<Notification[]>([]);

  // Form state
  const [form, setForm] = useState({
    subject: "",
    type: "Update",
    group: "All",
    otherRecipients: "",
    method: [] as string[],
    profileMsg: "",
    emailMsg: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal states
  const [showAddUser, setShowAddUser] = useState<null | number>(null); // groupId
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Temp states for modals
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [newGroupName, setNewGroupName] = useState("");

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear field error
  };

  const handleMethodToggle = (method: string) => {
    setForm((prev) => ({
      ...prev,
      method: prev.method.includes(method)
        ? prev.method.filter((m) => m !== method)
        : [...prev.method, method],
    }));
    setErrors((prev) => ({ ...prev, method: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.subject.trim()) newErrors.subject = "Please enter a subject/title.";
    if (!form.type) newErrors.type = "Please select a type.";
    if (form.group === "Other" && !form.otherRecipients.trim()) {
      newErrors.otherRecipients = "Please provide recipient emails for 'Other'.";
    }
    if (form.method.length === 0)
      newErrors.method = "Select at least one delivery method.";
    if (form.method.includes("Profile") && !form.profileMsg.trim())
      newErrors.profileMsg = "Please enter a profile message.";
    if (form.method.includes("Email") && !form.emailMsg.trim())
      newErrors.emailMsg = "Please enter an email message.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendNotification = () => {
    if (!validateForm()) return;

    const recipients =
      form.group === "Other"
        ? form.otherRecipients.split(",").map((e) => e.trim())
        : groups.find((g) => g.name === form.group)?.members.map((m) => m.email) ||
          ["All Students"];

    const newNotif: Notification = {
      id: history.length + 1,
      subject: form.subject,
      type: form.type as "Alert" | "Update" | "Warning",
      recipients,
      method: form.method,
      timestamp: new Date().toLocaleString(),
    };

    setHistory([newNotif, ...history]);
    setForm({
      subject: "",
      type: "Update",
      group: "All",
      otherRecipients: "",
      method: [],
      profileMsg: "",
      emailMsg: "",
    });
  };

  const addUserToGroup = (groupId: number) => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: [
                ...g.members,
                { id: Date.now(), name: newUser.name, email: newUser.email },
              ],
            }
          : g
      )
    );
    setNewUser({ name: "", email: "" });
    setShowAddUser(null);
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    setGroups((prev) => [
      ...prev,
      { id: Date.now(), name: newGroupName, members: [] },
    ]);
    setNewGroupName("");
    setShowCreateGroup(false);
  };

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Notifications</h2>
        <p className="text-sm text-slate-500">
          Send updates and manage recipients for groups of students.
        </p>
      </div>

      {/* Container 1: Send Notification */}
      <div className="bg-white shadow rounded-2xl p-4 lg:p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Send a Notification
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleFormChange("subject", e.target.value)}
                className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
              >
                <option>Update</option>
                <option>Alert</option>
                <option>Warning</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Recipient Group</label>
              <select
                value={form.group}
                onChange={(e) => handleFormChange("group", e.target.value)}
                className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
              >
                <option>All</option>
                {groups.map((g) => (
                  <option key={g.id}>{g.name}</option>
                ))}
                <option>Other</option>
              </select>
            </div>

            {form.group === "Other" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Other Recipients (comma-separated)
                </label>
                <textarea
                  value={form.otherRecipients}
                  onChange={(e) =>
                    handleFormChange("otherRecipients", e.target.value)
                  }
                  className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
                />
                {errors.otherRecipients && (
                  <p className="text-red-500 text-xs mt-1">{errors.otherRecipients}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Method</label>
              <div className="flex gap-4 flex-wrap">
                {["Profile", "Email", "Both"].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.method.includes(method)}
                      onChange={() => handleMethodToggle(method)}
                    />
                    {method}
                  </label>
                ))}
              </div>
              {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method}</p>}
            </div>

            {form.method.includes("Profile") && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Notification Message
                </label>
                <textarea
                  value={form.profileMsg}
                  onChange={(e) => handleFormChange("profileMsg", e.target.value)}
                  className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
                />
                {errors.profileMsg && (
                  <p className="text-red-500 text-xs mt-1">{errors.profileMsg}</p>
                )}
              </div>
            )}

            {form.method.includes("Email") && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Notification Message
                </label>
                <textarea
                  value={form.emailMsg}
                  onChange={(e) => handleFormChange("emailMsg", e.target.value)}
                  className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
                />
                {errors.emailMsg && (
                  <p className="text-red-500 text-xs mt-1">{errors.emailMsg}</p>
                )}
              </div>
            )}

            <button
              onClick={sendNotification}
              className="w-full bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
            >
              Send Notification
            </button>
          </div>
        </div>
      </div>

 {/* Container 2: Manage Groups */}
 <div className="bg-white shadow rounded-2xl p-4 lg:p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Manage Groups
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border rounded-xl p-4 hover:shadow transition"
            >
              <h4 className="font-medium text-slate-700 mb-3">
                {group.name} ({group.members.length})
              </h4>
              <ul className="space-y-2">
                {group.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      {member.name} ({member.email})
                    </span>
                    <button className="text-red-500 hover:text-red-700">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowAddUser(group.id)}
                className="mt-3 text-xs px-3 py-1 border rounded-lg text-sky-500 border-sky-400 hover:bg-sky-50"
              >
                + Add User
              </button>
            </div>
          ))}
          <div
            onClick={() => setShowCreateGroup(true)}
            className="border-dashed border-2 rounded-xl p-4 flex items-center justify-center text-slate-400 cursor-pointer hover:text-sky-500"
          >
            + Create Group
          </div>
        </div>
      </div>

      {/* Container 3: Notification History */}
      <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Notification History
        </h3>

        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No notifications sent yet</p>
        ) : (
          <ul className="space-y-3">
            {history.map((notif) => (
              <li
                key={notif.id}
                className="border rounded-xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-slate-700">{notif.subject}</p>
                  <p className="text-xs text-slate-500">
                    {notif.type} • Sent to {notif.recipients.length} recipients •{" "}
                    {notif.timestamp}
                  </p>
                </div>
                <span className="mt-2 sm:mt-0 text-xs px-2 py-1 rounded-lg bg-sky-100 text-sky-600">
                  {notif.method.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add User</h3>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full border rounded-xl p-2 text-sm mb-3 focus:ring-2 focus:ring-sky-400"
            />
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full border rounded-xl p-2 text-sm mb-3 focus:ring-2 focus:ring-sky-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddUser(null)}
                className="px-4 py-2 text-sm border rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => addUserToGroup(showAddUser)}
                className="px-4 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Group</h3>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm mb-3 focus:ring-2 focus:ring-sky-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="px-4 py-2 text-sm border rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="px-4 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
