import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../../../lib/types/user";
import {
  getMenteesSubstages,
  reviewMenteeSubstage,
} from "../../../lib/services/StartupManagement/startupService";

export type SubstageWithProgress = {
  substage_id: string;
  name: string;
  order: number;
  weightScore: number;
  status: string;
  scoreAwarded: number;
  reviewerComment?: string | null;
  progressId?: string | null;
};

export type DerivedStartup = {
  startupId: string;
  title: string;
  description?: string;
  founderId: string;
  currentStage?: string | null;
  status?: string;
  cumulativeScore?: number;
};

/* ============================
   MENTEE DETAIL MODAL
   ============================ */
   export const MenteeDetailModal: React.FC<{
    open: boolean;
    onClose: () => void;
    mentee: User;
    derivedStartup?: DerivedStartup | null;
    onSubstagesUpdated?: (s: SubstageWithProgress[]) => void;
  }> = ({ open, onClose, mentee, derivedStartup, onSubstagesUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [substages, setSubstages] = useState<SubstageWithProgress[]>([]);
  
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMenteesSubstages(mentee.id);
        setSubstages(res.substages ?? []);
        onSubstagesUpdated?.(res.substages ?? []);
      } catch (err) {
        console.error("Failed to load mentee substages", err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (open) load();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mentee?.id]);
  
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:pr-[5vw] p-4 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative overflow-auto max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* HEADER — Mentee Info */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {mentee.fullName}
                  </h3>
                  <p className="text-sm text-slate-600">{mentee.email}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
  
              {/* STARTUP DETAILS */}
              <div className="mb-4 border rounded-lg p-3 bg-slate-50">
                <p className="text-sm text-slate-700 mb-1">
                  <strong>Startup:</strong>{" "}
                  {derivedStartup?.title || "No startup title available"}
                </p>
  
                <p className="text-xs text-slate-500">
                  {derivedStartup?.description || "No description provided."}
                </p>
  
                <div className="text-xs text-slate-600 mt-2 flex flex-col gap-1">
                  <span>
                    <strong>Stage:</strong>{" "}
                    {derivedStartup?.currentStage || "—"}
                  </span>
                  <span>
                    <strong>Cumulative Score:</strong>{" "}
                    {derivedStartup?.cumulativeScore ?? 0}
                  </span>
                </div>
              </div>
  
              {/* SUBSTAGES */}
              <div>
                <h4 className="text-sm font-medium mb-2">Substages Progress</h4>
  
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-slate-600">Loading…</span>
                  </div>
                ) : substages.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">
                    No substages found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {substages.map((ss) => (
                      <div
                        key={ss.substage_id}
                        className="border rounded p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50 hover:shadow-sm transition"
                      >
                        <div>
                          <div className="text-sm font-medium">{ss.name}</div>
                          <div className="text-xs text-slate-500">
                            Weight: {ss.weightScore ?? "-"} | Order: {ss.order}
                          </div>
                          <div className="text-xs text-slate-500">
                            Status:{" "}
                            <span
                              className={`font-medium ${
                                ss.status === "approved"
                                  ? "text-emerald-600"
                                  : ss.status === "rejected"
                                  ? "text-rose-600"
                                  : ss.status === "submitted"
                                  ? "text-sky-500"
                                  : "text-slate-500"
                              }`}
                            >
                              {ss.status}
                            </span>
                          </div>
                          {ss.reviewerComment && (
                            <div className="text-xs text-slate-600 mt-1">
                              Comment: {ss.reviewerComment}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  
              {/* FOOTER */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded bg-sky-500 hover:bg-sky-600 text-white text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
/* ============================
   MENTEE ACTIONS MODAL
   ============================ */
export const MenteeActionsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mentee: User;
  substages: SubstageWithProgress[];
  onReviewSuccess?: () => void;
}> = ({ open, onClose, mentee, substages, onReviewSuccess }) => {
  const [selectedProgressId, setSelectedProgressId] = useState<string | null>(
    null
  );
  const [actionApprove, setActionApprove] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedProgressId(null);
      setActionApprove(true);
      setScore(0);
      setComment("");
    }
  }, [open]);

  const submitted = substages.filter((s) => s.status === "submitted");

  const handleSubmitReview = async () => {
    if (!selectedProgressId) {
      alert("Select a submitted item to review.");
      return;
    }
    try {
      setLoading(true);
      await reviewMenteeSubstage(
        selectedProgressId,
        actionApprove,
        score,
        comment
      );
      alert(`Submission ${actionApprove ? "approved" : "rejected"}.`);
      onReviewSuccess?.();
      onClose();
    } catch (err) {
      console.error("Review failed", err);
      alert("Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-lg p-6 relative shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                Review submissions — {mentee.fullName}
              </h4>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="text-xs text-slate-600 mb-2 font-medium">
                Submitted Items
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {submitted.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No submitted items
                  </div>
                )}
                {submitted.map((s) => (
                  <div
                    key={s.substage_id}
                    onClick={() => setSelectedProgressId(s.progressId ?? null)}
                    className={`p-2 border rounded flex justify-between items-center cursor-pointer ${
                      selectedProgressId === s.progressId
                        ? "ring-2 ring-sky-300 bg-sky-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-slate-500">
                        Weight {s.weightScore} — order {s.order}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {s.progressId ? "Progress ID set" : "No progressId"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-600 mb-1 font-medium">
                Review Form
              </div>

              <div className="flex items-center gap-3 mb-2">
                <label className="text-xs">Action:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={actionApprove ? "approve" : "reject"}
                  onChange={(e) => setActionApprove(e.target.value === "approve")}
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="text-xs">Score</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </div>

              <div className="mb-4">
                <label className="text-xs">Comment</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!selectedProgressId || loading}
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm disabled:opacity-50"
                >
                  {loading ? "Processing…" : "Submit Review"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
