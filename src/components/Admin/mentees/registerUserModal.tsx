import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Stage } from "../../../lib/types/startup/stage";

interface RegisterUserModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newUser: {
    fullName: string;
    email: string;
    roleName: string;
    regNumber: string;
    stageId: string;
  };
  setNewUser: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      email: string;
      roleName: string;
      regNumber: string;
      stageId: string;
    }>
  >;
  stages: Stage[];
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
  show,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
  stages,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={onSubmit}
            className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 relative shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              type="button"
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-2">Register User</h2>

            <div>
              <label className="text-xs text-slate-600">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1 mt-1 focus:ring-2 focus:ring-sky-400"
                required
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border rounded px-2 py-1 mt-1 focus:ring-2 focus:ring-sky-400"
                required
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">
                Registration Number{" "}
                <span className="text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1 mt-1 focus:ring-2 focus:ring-sky-400"
                value={newUser.regNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, regNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">
                Stage <span className="text-slate-400">(optional)</span>
              </label>
              <select
                className="w-full border rounded px-2 py-1 mt-1 focus:ring-2 focus:ring-sky-400"
                value={newUser.stageId}
                onChange={(e) =>
                  setNewUser({ ...newUser, stageId: e.target.value })
                }
              >
                <option value="">Select stage</option>
                {stages.map((stage) => (
                  <option key={stage.stage_id} value={stage.stage_id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded px-2 py-1 mt-1 focus:ring-2 focus:ring-sky-400"
                value={newUser.roleName}
                onChange={(e) =>
                  setNewUser({ ...newUser, roleName: e.target.value })
                }
              >
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 border rounded text-sm hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm"
              >
                Register
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterUserModal;
