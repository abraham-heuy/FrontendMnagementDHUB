type Note = { 
  id: string; 
  title: string; 
  time: string; 
  kind: "Update" | "Reminder" | "Approval";
  read?: boolean;
};

export default function NotificationsPanel({ items }: { items: Note[] }) {
  return (
    <section className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <p className="text-sm text-gray-500 mt-1">You have {items.length} notifications</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y">
          {items.map((n) => (
            <li 
              key={n.id} 
              className={`p-4 ${n.read ? 'bg-white' : 'bg-blue-50'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`font-medium ${n.read ? 'text-gray-800' : 'text-gray-900'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.time}</p>
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
              </div>
              {!n.read && (
                <div className="mt-3 flex justify-end">
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-800">
                    Mark as read
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t">
        <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-800">
          Mark all as read
        </button>
      </div>
    </section>
  );
}