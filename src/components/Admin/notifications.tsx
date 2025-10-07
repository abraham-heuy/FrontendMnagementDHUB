import React, { useState, useEffect } from "react";
import {
  getAllGroups,
  createGroup,
  addUserToGroup,
  broadcastNotification,
  getMyNotifications,
  type NotificationGroup,
  type NotificationItem,
} from "../../lib/services/notificationService";
import type { User } from "../../lib/types/user";
import { getUsers } from "../../lib/services/usersService";

const Notifications: React.FC = () => {
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [history, setHistory] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Local form UI state
  const [form, setForm] = useState({
    subject: "",
    type: "Update",
    group: "All",
    otherRecipients: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal states
  const [showAddUser, setShowAddUser] = useState<null | string>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Temp states for modals
  const [newUserId, setNewUserId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  // ✅ Load groups and notifications from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupsData, notificationsData, usersData] = await Promise.all([
          getAllGroups(),
          getMyNotifications(),
          getUsers(),
        ]);
        setGroups(groupsData);
        //Remove duplicates by unique `id` + message + timestamp
        const uniqueNotifications = Array.from(
          new Map(
            notificationsData.map((n) => [
              `${n.id}-${n.message}-${n.created_at}`,
              n,
            ])
          ).values()
        );

        //  sort newest first
        uniqueNotifications.sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
        );

        setHistory(uniqueNotifications);

        setUsers(usersData);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.subject.trim())
      newErrors.subject = "Please enter a subject/title.";
    if (!form.type) newErrors.type = "Please select a type.";
    if (form.group === "Other" && !form.otherRecipients.trim()) {
      newErrors.otherRecipients = "Please provide recipient IDs for 'Other'.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** ✅ Send notification to backend */
  const handleSendNotification = async () => {
    if (!validateForm()) return;

    try {
      let payload: any = {
        message: form.subject,
        type: form.type.toLowerCase(),
      };

      if (form.group === "All") {
        payload.all = true;
      } else if (form.group === "Other") {
        payload.recipientIds = form.otherRecipients
          .split(",")
          .map((e) => e.trim());
      } else {
        const selectedGroup = groups.find((g) => g.name === form.group);
        if (selectedGroup) payload.groupId = selectedGroup.id;
      }

      await broadcastNotification(payload);
      const updatedHistory = await getMyNotifications();
      setHistory(updatedHistory);

      setForm({
        subject: "",
        type: "Update",
        group: "All",
        otherRecipients: "",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  /** ✅ Add user to group using only userId */
  const handleAddUser = async (groupId: string) => {
    if (!newUserId.trim()) return;
    try {
      await addUserToGroup(groupId, newUserId);
      const updatedGroups = await getAllGroups();
      setGroups(updatedGroups);
      setNewUserId("");
      setShowAddUser(null);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  /** ✅ Create new group */
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const newGroup = await createGroup(newGroupName);
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setShowCreateGroup(false);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
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

      {/* 📨 Send Notification */}
      <div className="bg-white shadow rounded-2xl p-4 lg:p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Send a Notification
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleFormChange("subject", e.target.value)}
                className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Group
              </label>
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
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Select Recipients
                </label>

                <div className="flex items-center border rounded-xl p-2 text-sm bg-white focus-within:ring-2 focus-within:ring-sky-400">
                  <input
                    type="text"
                    value={form.otherRecipients}
                    onChange={(e) =>
                      handleFormChange("otherRecipients", e.target.value)
                    }
                    placeholder="Select users..."
                    className="flex-1 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="ml-2 text-slate-400 hover:text-sky-500"
                  >
                    ▼
                  </button>
                </div>

                {dropdownOpen && (
                  <div className="absolute z-10 bg-white border rounded-xl mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          const current = form.otherRecipients
                            ? form.otherRecipients
                                .split(",")
                                .map((v) => v.trim())
                            : [];
                          if (!current.includes(user.id)) {
                            handleFormChange(
                              "otherRecipients",
                              [...current, user.id].join(", ")
                            );
                          }
                        }}
                        className="px-3 py-2 text-sm hover:bg-sky-50 cursor-pointer"
                      >
                        {user.fullName} ({user.email})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSendNotification}
              className="w-full bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
            >
              Send Notification
            </button>
          </div>
        </div>
      </div>

      {/* 👥 Manage Groups */}
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
                {group.members.map((m) => (
                  <li key={m.id} className="text-sm">
                    {m.fullName} ({m.email})
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

      {history.map((notif, index) => {
        const colorClass =
          notif.type?.toLowerCase() === "alert"
            ? "border-yellow-400 bg-yellow-50"
            : notif.type?.toLowerCase() === "warning"
            ? "border-red-400 bg-red-50"
            : "border-sky-400 bg-sky-50";

        return (
          <li
            key={`${notif.id}-${index}`} // ✅ ensures key uniqueness
            className={`border-l-4 ${colorClass} rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm`}
          >
            <div className="flex-1">
              <p className="font-medium text-slate-800">{notif.message}</p>
              <p className="text-xs text-slate-500 mt-1">
                {notif.sender?.name && (
                  <span>From: {notif.sender.name} • </span>
                )}
                {notif.recipient?.name && (
                  <span>To: {notif.recipient.name} • </span>
                )}
                {notif.created_at && (
                  <span>{new Date(notif.created_at).toLocaleString()}</span>
                )}
              </p>
            </div>
            <span
              className={`mt-2 sm:mt-0 text-xs font-semibold px-2 py-1 rounded-lg ${
                notif.type?.toLowerCase() === "alert"
                  ? "bg-yellow-200 text-yellow-800"
                  : notif.type?.toLowerCase() === "warning"
                  ? "bg-red-200 text-red-800"
                  : "bg-sky-200 text-sky-800"
              }`}
            >
              {notif.type || "Update"}
            </span>
          </li>
        );
      })}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <label className="block text-sm font-medium mb-1">
              Select User
            </label>
            <select
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm mb-3 focus:ring-2 focus:ring-sky-400"
            >
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddUser(null)}
                className="px-4 py-2 text-sm border rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddUser(showAddUser)}
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
                onClick={handleCreateGroup}
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
