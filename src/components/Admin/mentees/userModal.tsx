import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../../../lib/types/user";

interface UsersModalProps {
  show: boolean;
  onClose: () => void;
  users: User[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const UsersModal: React.FC<UsersModalProps> = ({
  show,
  onClose,
  users,
  loading,
  onDelete,
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
          <motion.div
            className="bg-white rounded-xl w-full max-w-3xl p-6 relative shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-3">All Users</h2>

            {loading ? (
              <div className="text-center text-slate-500 text-sm py-3">
                Loading...
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[60vh] border-t border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-left text-xs uppercase">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Reg. No</th>
                      <th className="p-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-slate-400 py-3 text-xs"
                        >
                          No users yet
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-2">{u.fullName}</td>
                          <td className="p-2">{u.email}</td>
                          <td className="p-2 capitalize">
                            {u.role?.name ?? "-"}
                          </td>
                          <td className="p-2">{u.regNumber ?? "-"}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => onDelete(u.id)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsersModal;
