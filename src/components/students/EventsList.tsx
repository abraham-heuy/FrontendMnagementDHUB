type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  status?: "Open" | "Applied" | "Closed";
};

const EventsList = (
  {
    events
  }: {
    events: EventItem[]
  }
) => {
  return (
    <section>
      <h3>Events and Workshops</h3>
      <ul className="space-y-3">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2"
          >
            <div>
              <p className="font-semibold">{ev.title}</p>
              <p className="text-sm text-gray-500">
                {ev.date} • {ev.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {ev.status && (
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    ev.status === "Open"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : ev.status === "Applied"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {ev.status}
                </span>
              )}
              <button className="px-3 py-2 rounded-xl border hover:bg-gray-50">
                {ev.status === "Applied" ? "View" : "Apply"}
              </button>
            </div>
          </li>
        ))}

      </ul>
    </section>
  )
}

export default EventsList