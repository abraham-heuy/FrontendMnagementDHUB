type Mentor = { id: string; name: string; expertise: string; email: string; avatar?: string };

export default function MentorsCard({ mentors }: { mentors: Mentor[] }) {
  // Default avatar if none provided
  const getAvatar = (mentor: Mentor) => {
    return mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`;
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Assigned Mentors</h3>
        <p className="text-sm text-gray-500 mt-1">Connect with experts guiding your startup journey</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {mentors.map((m) => (
          <div key={m.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img
                src={getAvatar(m)}
                alt={m.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{m.name}</p>
                <p className="text-sm text-gray-600 mt-1">{m.expertise}</p>
                <a 
                  href={`mailto:${m.email}`} 
                  className="text-sm text-green-600 hover:text-green-700 mt-2 inline-block"
                >
                  {m.email}
                </a>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t">
              <button className="flex-1 py-2 text-sm bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                Schedule Meeting
              </button>
              <button className="flex-1 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
        
        {/* Add mentor card */}
        <div className="p-4 border border-dashed rounded-xl flex flex-col items-center justify-center text-center min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Need additional mentorship support?</p>
          <button className="mt-3 text-sm text-green-600 font-medium hover:text-green-700">
            Request a Mentor
          </button>
        </div>
      </div>
    </section>
  );
}