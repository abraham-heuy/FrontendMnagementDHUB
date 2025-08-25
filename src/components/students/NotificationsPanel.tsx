type Note = { id: string; title: string; time: string; kind: "Update" | "Reminder" | "Approval" };

export default function NotificationsPanel({ items }: { items: Note[] }) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold">Notifications</h3>
      <ul className="space-y-3">
        {items.map((n) => (
          <li key={n.id} className="p-4 border rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-xs text-gray-500">{n.time}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                n.kind === "Approval"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : n.kind === "Reminder"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {n.kind}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
