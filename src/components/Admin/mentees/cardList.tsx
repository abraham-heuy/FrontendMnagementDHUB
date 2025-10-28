import React from "react";
import type { User } from "../../../lib/types/user";
import type { DerivedStartup } from "./menteesAndStartups";

export const MenteeCardList: React.FC<{
  users: User[];
  startupsDerived?: Record<string, DerivedStartup>;
  onView: (mentee: User) => void;
  onActions: (mentee: User) => void;
}> = ({ users, startupsDerived = {}, onView, onActions }) => {
  const mentees = users.filter(
    (u) => (u.role?.name ?? "").toLowerCase() === "mentee"
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {mentees.map((m) => {
        const s = startupsDerived?.[m.id];
        return (
          <div
            key={m.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-800">
                  {m.fullName}
                </div>
                <div className="text-xs text-slate-500">
                  {(m.stage && (m.stage as any).name) || "—"}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">{m.email}</div>
              <div className="text-xs text-slate-600 mt-2 line-clamp-2">
                <span className="font-medium">Startup:</span>{" "}
                {s?.title ?? `${m.fullName}'s Startup`}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onView(m)}
                className="px-3 py-1.5 text-xs border border-sky-500 text-sky-600 rounded hover:bg-sky-50 transition"
              >
                View
              </button>

              <button
                onClick={() => onActions(m)}
                className="px-3 py-1.5 text-xs bg-sky-500 text-white rounded hover:bg-sky-600 transition"
              >
                Actions
              </button>
            </div>
          </div>
        );
      })}

      {mentees.length === 0 && (
        <div className="text-sm text-slate-500 p-3 text-center">
          No mentees found
        </div>
      )}
    </div>
  );
};

export default MenteeCardList;
