import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiLock,
  FiInfo,
} from "react-icons/fi";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface SubStage {
  substage_id: string;
  name: string;
  order: number;
  weightScore: number;
  status: "pending" | "submitted" | "approved" | "rejected";
  scoreAwarded: number;
  reviewerComment: string | null;
}

interface StartupInfo {
  id: string;
  title: string;
  currentStage: string;
  currentSubStage: string;
  cumulativeScore: number;
}

interface StartupGroup {
  startup: StartupInfo;
  substages: SubStage[];
}

const StatusProgress = () => {
  const [startups, setStartups] = useState<StartupGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [expandedStartupId, setExpandedStartupId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiURL}/startup/mentee/substages`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch progress data");

      const data = await res.json();
      const normalized: StartupGroup[] = Array.isArray(data)
        ? data.map((d: any) => ({ startup: d.startup, substages: d.substages }))
        : data?.startup && data?.substages
          ? [{ startup: data.startup, substages: data.substages }]
          : [];

      setStartups(normalized);
      if (normalized.length > 0) setExpandedStartupId(normalized[0].startup.id);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching progress:", err);
      setError(err.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSubstage = async (substageId: string) => {
    try {
      setSubmitting(substageId);
      const res = await fetch(`${apiURL}/startup/mentee/substages/${substageId}/submit`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit substage");
      await fetchProgress();
      setToast({ type: "success", message: "Substage submitted successfully" });
    } catch (err: any) {
      console.error("Error submitting substage:", err);
      setToast({ type: "error", message: err.message || "Failed to submit substage" });
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "submitted":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="text-green-600" size={16} />;
      case "submitted":
        return <FiClock className="text-yellow-600" size={16} />;
      case "rejected":
        return <FiX className="text-red-600" size={16} />;
      default:
        return <FiClock className="text-gray-400" size={16} />;
    }
  };

  // Check if a substage can be submitted (previous one is approved)
  const canSubmitSubstage = (substages: SubStage[], currentIndex: number) => {
    if (currentIndex === 0) return true; // First task is always available
    const previousSubstage = substages[currentIndex - 1];
    return previousSubstage.status === "approved";
  };

  // Get sorted substages by order
  const getSortedSubstages = (substages: SubStage[]) => {
    return [...substages].sort((a, b) => a.order - b.order);
  };

  const filteredStartups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return startups;
    return startups.filter((s) => s.startup.title.toLowerCase().includes(q));
  }, [filter, startups]);

  const getProgress = (group: StartupGroup) => {
    const total = group.substages.length;
    const completed = group.substages.filter((s) => s.status === "approved").length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  };

  const toggleExpand = (startupId: string) => {
    if (submitting) return;
    setExpandedStartupId((prev) => (prev === startupId ? null : startupId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-green-200"
          >
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin text-green-600 text-3xl mr-3" />
              <span className="text-gray-700 font-medium">Loading your progress...</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-green-200"
          >
            <div className="text-center py-8">
              <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load progress</h3>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchProgress}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-full hover:shadow-lg transition-all font-medium"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!startups || startups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-green-200">
            <div className="text-center py-8">
              <p className="text-gray-700">No active startups available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Startup Progress</h1>
            <p className="text-sm text-gray-600 mt-1">Track and manage your startup milestones</p>
          </div>
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search startup by title..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Startup Cards - Vertical Stack for Better Visibility */}
        <div className="flex flex-col gap-4">
          {filteredStartups.map(({ startup, substages }: StartupGroup) => {
            const { pct, completed, total } = getProgress({ startup, substages });
            const expanded = expandedStartupId === startup.id;
            const sortedSubstages = getSortedSubstages(substages);

            return (
              <motion.div
                key={startup.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Startup Header */}
                <button
                  onClick={() => toggleExpand(startup.id)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-green-50/50 transition-colors"
                  disabled={!!submitting}
                >
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{startup.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiAward className="text-green-600" />
                        Stage: <span className="font-medium text-gray-900 ml-1">{startup.currentStage || "—"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCheckCircle className="text-green-600" />
                        Score: <span className="font-medium text-gray-900 ml-1">{startup.cumulativeScore}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
                    <span className="text-sm font-semibold bg-white border border-green-200 text-green-700 px-3 py-1 rounded-full">{pct}%</span>
                    {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </button>

                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{completed} of {total} completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-2.5 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-sm"
                    />
                  </div>
                </div>

                {/* Expanded Substages */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200"
                    >
                      <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                        {sortedSubstages.map((s: SubStage, idx: number) => {
                          const canSubmit = canSubmitSubstage(sortedSubstages, idx);
                          const isLocked = s.status === "pending" && !canSubmit;

                          return (
                            <motion.div
                              key={s.substage_id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 ${s.status === "approved"
                                  ? "bg-green-50 border-green-200"
                                  : s.status === "submitted"
                                    ? "bg-yellow-50 border-yellow-200"
                                    : s.status === "rejected"
                                      ? "bg-red-50 border-red-200"
                                      : isLocked
                                        ? "bg-gray-100 border-gray-300 opacity-75"
                                        : "bg-white border-gray-200 hover:border-green-300"
                                }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  {/* Header with order and status */}
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.status === "approved"
                                        ? "bg-green-500 text-white"
                                        : s.status === "submitted"
                                          ? "bg-yellow-500 text-white"
                                          : s.status === "rejected"
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-400 text-white"
                                      }`}>
                                      {s.order}
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 flex-1 truncate">{s.name}</h4>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(s.status)}`}>
                                      {getStatusIcon(s.status)}
                                      <span className="capitalize">{s.status}</span>
                                    </div>
                                  </div>

                                  {/* Score Information */}
                                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                                    <span>Weight: <span className="font-semibold text-gray-900">{s.weightScore} pts</span></span>
                                    <span className="text-gray-400">•</span>
                                    <span>Awarded: <span className={`font-semibold ${s.scoreAwarded > 0 ? "text-green-600" : "text-gray-600"}`}>{s.scoreAwarded} pts</span></span>
                                  </div>

                                  {/* Lock Message */}
                                  {isLocked && (
                                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                      <FiLock size={12} />
                                      <span>Complete previous task to unlock</span>
                                    </div>
                                  )}

                                  {/* Reviewer Comment */}
                                  {s.reviewerComment && (
                                    <div className="mt-2 p-2 bg-white/60 backdrop-blur-sm border border-green-100 rounded-lg">
                                      <p className="text-xs text-gray-700">
                                        <span className="font-medium text-gray-900">Reviewer Feedback:</span> {s.reviewerComment}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Submit Button */}
                                {s.status === "pending" && (
                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <button
                                      onClick={() => handleSubmitSubstage(s.substage_id)}
                                      disabled={submitting === s.substage_id || isLocked}
                                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 ${isLocked
                                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                          : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:shadow-lg text-white transform hover:scale-105"
                                        } ${submitting === s.substage_id ? "opacity-50 cursor-not-allowed" : ""}`}
                                      title={isLocked ? "Complete previous task first" : "Submit for review"}
                                    >
                                      {submitting === s.substage_id ? (
                                        <>
                                          <FiLoader className="animate-spin" size={14} />
                                          <span>Submitting</span>
                                        </>
                                      ) : isLocked ? (
                                        <>
                                          <FiLock size={14} />
                                          <span>Locked</span>
                                        </>
                                      ) : (
                                        <>
                                          <FiCheckCircle size={14} />
                                          <span>Submit</span>
                                        </>
                                      )}
                                    </button>
                                    {isLocked && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <FiInfo size={10} />
                                        <span>Task {idx}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-20 right-6 px-6 py-4 rounded-xl shadow-xl border-l-4 ${toast.type === "success"
                ? "bg-green-50 text-green-800 border-green-500"
                : "bg-red-50 text-red-800 border-red-500"
              }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <FiCheckCircle className="text-green-600" size={20} />
              ) : (
                <FiAlertCircle className="text-red-600" size={20} />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusProgress;