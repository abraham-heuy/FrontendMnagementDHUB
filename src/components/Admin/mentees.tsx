// src/components/MenteeManagement.tsx
import React, { useEffect, useState } from "react";
import type { Stage } from "../../lib/types/startup/stage";
import type { SubStage } from "../../lib/types/startup/substage";
import type { User } from "../../lib/types/user";
import type { Startup } from "../../lib/types/startup/startup";
import {
  getAllStages,
  getAllSubstages,
  createStage,
  createSubstage,
} from "../../lib/services/StartupManagement/activityManagement";
import {
  getUsers,
  registerUser,
  deleteUser,
} from "../../lib/services/usersService";
import {
  getMenteeSubstages,
  submitMenteeSubstage,
  reviewMenteeSubstage,
  checkMenteeStageProgression,
} from "../../lib/services/StartupManagement/startupService";

const API_URL = import.meta.env.VITE_API_URL;

// NOTE: If your backend exposes a startups endpoint, update this URL to use the correct service.
// This is a small helper to try fetch startups; if not available we fallback to user -> placeholder startup.
const fetchAllStartups = async (): Promise<Startup[]> => {
  try {
    const res = await fetch(`${API_URL}/startups/`, { credentials: "include" });
    if (!res.ok) throw new Error("No startups endpoint");
    const data = await res.json();
    return Array.isArray(data) ? data : data.startups || [];
  } catch {
    return []; // caller will fallback to mapping from users
  }
};

const MenteeManagement: React.FC = () => {
  // meta
  const [stages, setStages] = useState<Stage[]>([]);
  const [substages, setSubstages] = useState<SubStage[]>([]);
  // users + startups
  const [users, setUsers] = useState<User[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  // UI state
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showSubstageModal, setShowSubstageModal] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<User | null>(null);
  const [selectedMenteeStartup, setSelectedMenteeStartup] =
    useState<Startup | null>(null);
  const [menteeSubstages, setMenteeSubstages] = useState<SubStage[]>([]);

// ...inside your component
const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // form states
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    roleName: "mentee",
    regNumber: "",
    stageId: "",
  });
  const [newStageForm, setNewStageForm] = useState({ name: "", order: 1 });
  const [newSubstageForm, setNewSubstageForm] = useState({
    name: "",
    order: 1,
    weightScore: 10,
    stageId: "",
  });

  // load initial data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [sList, ssList, uList, startupList] = await Promise.all([
          getAllStages().catch(() => [] as Stage[]),
          getAllSubstages().catch(() => [] as SubStage[]),
          getUsers().catch(() => [] as User[]),
          fetchAllStartups().catch(() => [] as Startup[]),
        ]);

        setStages(sList);
        setSubstages(ssList);
        setUsers(uList);

        if (startupList.length > 0) {
          setStartups(startupList);
        } else {
          // build light startup objects from mentees if backend doesn't return startups endpoint
          const mentees = uList.filter(
            (u) => (u.role || "").toLowerCase() === "mentee"
          );
          const fallback = mentees.map((m, idx) => ({
            startup_id: `fallback-${m.id || idx}`,
            title: `${m.fullName || "Unnamed"}'s Startup`,
            description: m?.currentProject || "",
            founder: { id: m.id, fullName: m.fullName, email: m.email },
            currentStage: m.stage
              ? { stage_id: m.stage || "", name: m.stage || "", order: 0 }
              : null,
            teamMembers: [],
            progressHistory: [],
            cumulativeScore: 0,
            status: "active",
          })) as Startup[];
          setStartups(fallback);
        }
      } catch (err) {
        console.error("Failed loading meta:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===== helpers & actions =====

  const reloadUsers = async () => {
    try {
      const u = await getUsers();
      setUsers(u);
    } catch (err) {
      console.error("reloadUsers", err);
    }
  };

  const reloadStagesAndSubstages = async () => {
    try {
      const [sList, ssList] = await Promise.all([
        getAllStages(),
        getAllSubstages(),
      ]);
      setStages(sList);
      setSubstages(ssList);
    } catch (err) {
      console.error("reloadStagesAndSubstages", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // validation: role must exist - backend will check too
      await registerUser(newUserForm as any);
      setShowRegisterModal(false);
      setNewUserForm({
        fullName: "",
        email: "",
        roleName: "mentee",
        regNumber: "",
        stageId: "",
      });
      await reloadUsers();
      // If mentee created, refresh startups attempt
      const allStartups = await fetchAllStartups();
      if (allStartups.length) setStartups(allStartups);
    } catch (err) {
      console.error("register error", err);
      alert("Registration failed: " + (err as any).message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      await reloadUsers();
      // refresh startups
      const allStartups = await fetchAllStartups();
      if (allStartups.length) setStartups(allStartups);
    } catch (err) {
      console.error("delete user", err);
      alert("Delete failed");
    }
  };

  const handleCreateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStage(newStageForm);
      setShowStageModal(false);
      setNewStageForm({ name: "", order: 1 });
      await reloadStagesAndSubstages();
    } catch (err) {
      console.error("create stage", err);
      alert("Failed to create stage");
    }
  };

  const handleCreateSubstage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubstage(newSubstageForm);
      setShowSubstageModal(false);
      setNewSubstageForm({ name: "", order: 1, weightScore: 10, stageId: "" });
      await reloadStagesAndSubstages();
    } catch (err) {
      console.error("create substage", err);
      alert("Failed to create substage");
    }
  };

  // open mentee detail modal: load mentee substages and the startup if present
  const viewMentee = async (u: User) => {
    setSelectedMentee(u);
    // attempt to find startup by founder id
    const found = startups.find((s) => s.founder?.id === u.id);
    setSelectedMenteeStartup(found || null);

    try {
      const mSub = await getMenteeSubstages();
      setMenteeSubstages(mSub);
    } catch (err) {
      console.error("getMenteeSubstages", err);
      setMenteeSubstages([]);
    }
  };

  // reviewer approves/rejects a submitted substage (score & comment)
  const handleReview = async (
    progressId: string,
    approve: boolean,
    scoreAwarded = 0,
    comment?: string
  ) => {
    try {
      await reviewMenteeSubstage(progressId, approve, scoreAwarded, comment);
      alert(`Substage ${approve ? "approved" : "rejected"}`);
      // refresh mentee substages in modal
      const mSub = await getMenteeSubstages();
      setMenteeSubstages(mSub);
    } catch (err) {
      console.error("review", err);
      alert("Review failed");
    }
  };

  // mentee submit current substage (if admin triggers on their behalf)
  const handleSubmitSubstage = async (substageId: string) => {
    try {
      const res = await submitMenteeSubstage(substageId);
      alert(res.message || "Submitted");
      const mSub = await getMenteeSubstages();
      setMenteeSubstages(mSub);
    } catch (err) {
      console.error("submit substage", err);
      alert("Submit failed");
    }
  };

  // check progression API
  const handleCheckProgression = async () => {
    try {
      const res = await checkMenteeStageProgression();
      alert(res.message || "Checked");
      // optionally refresh startups/users
      await reloadUsers();
    } catch (err) {
      console.error("check progression", err);
      alert("Check progression failed");
    }
  };

  // promote startup (this is a thin client-side action if you have dedicated endpoint you should call it)
  // We'll just call checkMenteeStageProgression or the reviewer action above depending on workflow.
  // If backend had a promote endpoint, call it here.

  // ===== render =====
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Mentee Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quick actions, manage users & mentees, review progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-3 py-2 bg-sky-500 text-white rounded-lg text-sm"
          >
            + Register User
          </button>
          <button
            onClick={() => setShowUsersModal(true)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Stages */}
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700">Stages</div>
                <div className="text-xs text-slate-500">
                  {stages.length} stages
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStageModal(true)}
                  className="px-2 py-1 text-xs bg-sky-500 text-white rounded"
                >
                  Create
                </button>
                <button
                  onClick={reloadStagesAndSubstages}
                  className="px-2 py-1 text-xs border rounded"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-600">
              {stages.slice(0, 6).map((s) => (
                <div
                  key={s.stage_id}
                  className="flex items-center justify-between py-1"
                >
                  <div>{s.name}</div>
                  <div className="text-xs text-slate-400">#{s.order}</div>
                </div>
              ))}
              {stages.length === 0 && (
                <div className="text-xs text-slate-400">No stages yet</div>
              )}
            </div>
          </div>
 {/* Header */}
<div className="p-3 border rounded-lg">
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm font-medium text-slate-700">Substages</div>
      <div className="text-xs text-slate-500">
        {stages.reduce((total, stage) => total + (stage.substages?.length ?? 0), 0)} substages
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => setShowSubstageModal(true)}
        className="px-2 py-1 text-xs bg-sky-500 text-white rounded"
      >
        Create
      </button>
      <button
        onClick={reloadStagesAndSubstages}
        className="px-2 py-1 text-xs border rounded"
      >
        Refresh
      </button>
    </div>
  </div>

  {/* Stage Chips */}
  <div className="flex flex-wrap gap-2 mt-2">
    {stages.map((stage) => (
      <button
        key={stage.stage_id}
        onClick={() =>
          setSelectedStage((prev) => (prev === stage.stage_id ? null : stage.stage_id))
        }
        className={`px-2 py-1 text-xs rounded ${
          selectedStage === stage.stage_id
            ? "bg-sky-500 text-white"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        {stage.name}
      </button>
    ))}
  </div>

  {/* Substages Cards */}
  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
    {stages
      .find((s) => s.stage_id === selectedStage)
      ?.substages?.length ? (
      stages
        .find((s) => s.stage_id === selectedStage)!
        .substages!.map((ss) => (
          <div
            key={ss.substage_id}
            className="border rounded-lg p-3 flex flex-col gap-2 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-slate-700">{ss.name}</div>
              <div className="text-sm font-semibold text-emerald-500">
                {ss.weightScore ?? "-"}%
              </div>
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  ss.status === "Completed"
                    ? "bg-emerald-200 text-emerald-800"
                    : ss.status === "In Progress"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-slate-200 text-slate-800"
                }`}
              >
                {ss.status}
              </span>
            </div>
          </div>
        ))
    ) : (
      <div className="text-xs text-slate-400">No substages yet</div>
    )}
  </div>
</div>


        </div>
      </section>

      {/* Mentees + Startups */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Mentees & Startups
            </h3>
            <div className="text-xs text-slate-500">
              Tap a mentee to view details
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users
              .filter((u) => (u.role || "").toLowerCase() === "mentee")
              .map((m) => {
                const s = startups.find((st) => st.founder?.id === m.id);
                return (
                  <div
                    key={m.id}
                    className="border rounded-lg p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-700">
                          {m.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.stage || "—"}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {m.email}
                      </div>
                      <div className="text-xs text-slate-600 mt-2 line-clamp-2">
                        <span className="font-medium">Startup:</span>{" "}
                        {s?.title ?? `${m.fullName}'s Startup`}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => viewMentee(m)}
                        className="px-3 py-1 text-xs bg-white border rounded text-sky-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          if (
                            !confirm(
                              "Promote this mentee (attempt progression)?"
                            )
                          )
                            return;
                          handleCheckProgression();
                        }}
                        className="px-3 py-1 text-xs bg-emerald-500 text-white rounded"
                      >
                        Try Promote
                      </button>
                    </div>
                  </div>
                );
              })}
            {users.filter((u) => (u.role || "").toLowerCase() === "mentee")
              .length === 0 && (
              <div className="text-sm text-slate-500 p-3">No mentees found</div>
            )}
          </div>
        </div>
      </section>

      {/* Manage Users table quick view */}
      <section className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">All Users</h3>
          <div className="flex gap-2">
            <button
              onClick={reloadUsers}
              className="px-2 py-1 text-xs border rounded"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowUsersModal(true)}
              className="px-2 py-1 text-xs bg-sky-500 text-white rounded"
            >
              Manage
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Stage</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 6).map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.fullName}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2">{(u.stage || "") as string}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewMentee(u)}
                        className="px-2 py-1 text-xs border rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2 py-1 text-xs bg-rose-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-sm text-slate-500">
                    No users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== Modals ========== */}

      {/* Register modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-xl w-full max-w-md p-4"
          >
            <h4 className="text-lg font-semibold mb-3">Register User</h4>

            <label className="text-xs text-slate-600">Full name</label>
            <input
              className="w-full border rounded px-3 py-2 mb-3"
              value={newUserForm.fullName}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, fullName: e.target.value })
              }
              required
            />

            <label className="text-xs text-slate-600">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 mb-3"
              value={newUserForm.email}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, email: e.target.value })
              }
              required
            />

            <label className="text-xs text-slate-600">Role</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={newUserForm.roleName}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, roleName: e.target.value })
              }
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>

            <label className="text-xs text-slate-600">
              Registration number (optional)
            </label>
            <input
              className="w-full border rounded px-3 py-2 mb-3"
              value={newUserForm.regNumber}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, regNumber: e.target.value })
              }
            />

            <label className="text-xs text-slate-600">
              Assign Stage (mentees only)
            </label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={newUserForm.stageId}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, stageId: e.target.value })
              }
            >
              <option value="">(auto)</option>
              {stages.map((s) => (
                <option key={s.stage_id} value={s.stage_id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-3 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded bg-sky-500 text-white"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users modal (full) */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl p-4 overflow-auto max-h-[85vh]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">All Users</h4>
              <button
                onClick={() => setShowUsersModal(false)}
                className="text-slate-500"
              >
                ✕
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Stage</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.fullName}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2">{u.stage || "-"}</td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => viewMentee(u)}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-2 py-1 rounded bg-rose-500 text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-3 text-slate-500">
                      No users
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stage creation modal */}
      {showStageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateStage}
            className="bg-white rounded-xl w-full max-w-md p-4"
          >
            <h4 className="text-lg font-semibold mb-3">Create Stage</h4>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Stage name"
              value={newStageForm.name}
              onChange={(e) =>
                setNewStageForm({ ...newStageForm, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Order"
              value={newStageForm.order}
              onChange={(e) =>
                setNewStageForm({
                  ...newStageForm,
                  order: Number(e.target.value),
                })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowStageModal(false)}
                className="px-3 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded bg-sky-500 text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Substage creation modal */}
      {showSubstageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateSubstage}
            className="bg-white rounded-xl w-full max-w-md p-4"
          >
            <h4 className="text-lg font-semibold mb-3">Create Substage</h4>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Substage name"
              value={newSubstageForm.name}
              onChange={(e) =>
                setNewSubstageForm({ ...newSubstageForm, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Order"
              value={newSubstageForm.order}
              onChange={(e) =>
                setNewSubstageForm({
                  ...newSubstageForm,
                  order: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Weight score"
              value={newSubstageForm.weightScore}
              onChange={(e) =>
                setNewSubstageForm({
                  ...newSubstageForm,
                  weightScore: Number(e.target.value),
                })
              }
            />
            <label className="text-xs text-slate-600">Stage</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={newSubstageForm.stageId}
              onChange={(e) =>
                setNewSubstageForm({
                  ...newSubstageForm,
                  stageId: e.target.value,
                })
              }
            >
              <option value="">Select stage</option>
              {stages.map((s) => (
                <option key={s.stage_id} value={s.stage_id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubstageModal(false)}
                className="px-3 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded bg-sky-500 text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mentee detail modal */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-4 overflow-auto max-h-[85vh]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold">
                  {selectedMentee.fullName}
                </h4>
                <div className="text-xs text-slate-500">
                  {selectedMentee.email}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Stage: {selectedMentee.stage || "-"}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Reg#: {selectedMentee.regNumber || "-"}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMentee(null);
                    setMenteeSubstages([]);
                  }}
                  className="px-2 py-1 border rounded"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-slate-700">Startup</h5>
              <div className="mt-2 p-3 border rounded">
                <div className="text-sm font-medium">
                  {selectedMenteeStartup?.title ||
                    `${selectedMentee.fullName}'s Startup`}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {selectedMenteeStartup?.description || "No description"}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Status: {selectedMenteeStartup?.status || "—"}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-slate-700">
                Substages (mentee current stage)
              </h5>
              <div className="mt-2 space-y-2">
                {menteeSubstages.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No substages available
                  </div>
                )}
                {menteeSubstages.map((ss) => (
                  <div
                    key={ss.substage_id}
                    className="border rounded p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{ss.name}</div>
                      <div className="text-xs text-slate-500">
                        Weight: {ss.weightScore ?? "-"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 text-xs border rounded"
                        onClick={() => handleSubmitSubstage(ss.substage_id)}
                      >
                        Submit
                      </button>
                      {/* For review we need a progressId; as a simplified UI we ask admin to input it */}
                      <button
                        onClick={() => {
                          const progressId = prompt(
                            "Enter progressId to approve/reject (from submitted progress records):"
                          );
                          if (!progressId) return;
                          const approve = confirm("Approve this submission?");
                          if (approve)
                            handleReview(
                              progressId,
                              true,
                              100,
                              "Approved by admin"
                            );
                          else
                            handleReview(
                              progressId,
                              false,
                              0,
                              "Rejected by admin"
                            );
                        }}
                        className="px-2 py-1 text-xs bg-emerald-500 text-white rounded"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedMentee(null);
                  setMenteeSubstages([]);
                }}
                className="px-3 py-2 rounded border"
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

export default MenteeManagement;
