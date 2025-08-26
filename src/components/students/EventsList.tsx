type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  status?: "Open" | "Applied" | "Closed";
};

const EventsList = ({ events }: { events: EventItem[] }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Events and Workshops</h3>
        <p className="text-sm text-gray-500 mt-1">Discover upcoming events to enhance your startup journey</p>
      </div>
      
      <ul className="space-y-4">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="p-4 border rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{ev.title}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="mr-3">{ev.date}</span>
                  <span>•</span>
                  <span className="ml-3">{ev.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {ev.status && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
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
                <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  ev.status === "Applied" 
                    ? "border-blue-300 text-blue-700 hover:bg-blue-50" 
                    : "border-green-300 text-green-700 hover:bg-green-50"
                }`}>
                  {ev.status === "Applied" ? "View Details" : "Register Now"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default EventsList;