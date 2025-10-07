import React, { useEffect, useState } from "react";
import {
  getUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../../lib/services/usersService";
import type { User, UserFormData } from "../../lib/types/user";
import { FaEdit, FaTrash, FaChartLine } from "react-icons/fa";

const StudentManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    password: "",
    regNumber: "",
    roleName: "student", // default role
    stage: null,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [progressUser, setProgressUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit (register or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing && selectedUser) {
        await updateUser(selectedUser.id, formData);
      } else {
        await registerUser(formData);
      }

      setFormData({
        fullName: "",
        email: "",
        password: "",
        regNumber: "",
        roleName: "student",
        stage: null,
      });
      setIsEditing(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // ✅ Edit user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      regNumber: user.regNumber,
      roleName: user.role,
      stage: user.stage || null,
    });
  };

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Student Management
        </h2>
        <p className="text-sm text-slate-500">
          Manage user registration, updates, and progress tracking
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-2xl p-6 mb-8 grid gap-4 md:grid-cols-2"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="border rounded-xl p-2 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border rounded-xl p-2 w-full"
        />
        {!isEditing && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border rounded-xl p-2 w-full"
          />
        )}
        <input
          type="text"
          name="regNumber"
          placeholder="Registration Number"
          value={formData.regNumber}
          onChange={handleChange}
          required
          className="border rounded-xl p-2 w-full"
        />

        <select
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          className="border rounded-xl p-2 w-full"
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>

        {formData.roleName === "student" && (
          <select
            name="stage"
            value={formData.stage || ""}
            onChange={handleChange}
            className="border rounded-xl p-2 w-full"
          >
            <option value="">Select Stage</option>
            <option value="pre-incubation">Pre-incubation</option>
            <option value="incubation">Incubation</option>
            <option value="startup">Startup</option>
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600"
        >
          {loading ? "Saving..." : isEditing ? "Update User" : "Register User"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-x-auto p-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">All Users</h3>
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-500">No users found.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Reg Number</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Stage</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.regNumber || "-"}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">{u.stage || "-"}</td>
                  <td className="p-3 flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => setProgressUser(u)}
                      className="text-green-500 hover:text-green-700"
                      title="View Progress"
                    >
                      <FaChartLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Progress Modal */}
      {progressUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {progressUser.fullName}'s Progress
            </h3>
            <p className="text-slate-600 text-sm mb-3">
              Current Stage:{" "}
              <span className="font-medium text-sky-600">
                {progressUser.stage || "Not a student!"}
              </span>
            </p>
            <p className="text-slate-500 text-sm">
              (Pre-Incubation → Incubation → Startup)
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setProgressUser(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50"
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

export default StudentManagement;
