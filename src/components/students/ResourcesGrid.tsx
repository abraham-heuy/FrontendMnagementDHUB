type Resource = { 
  id: string; 
  title: string; 
  description?: string;
  type: "Template" | "Guide" | "Link" | "Video"; 
  href: string;
};

export default function ResourcesGrid({ resources }: { resources: Resource[] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case "Template": return "📝";
      case "Guide": return "📖";
      case "Video": return "🎥";
      default: return "🔗";
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Learning Resources</h3>
        <p className="text-sm text-gray-500 mt-1">Access materials to support your startup development</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <a
            key={r.id}
            href={r.href}
            target="_blank"
            rel="noreferrer"
            className="p-4 border rounded-xl hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{getIcon(r.type)}</span>
              <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">
                {r.type}
              </span>
            </div>
            <p className="font-semibold text-gray-800">{r.title}</p>
            {r.description && (
              <p className="text-sm text-gray-600 mt-2">{r.description}</p>
            )}
            <div className="mt-4 pt-3 border-t border-dashed flex justify-between items-center">
              <span className="text-xs text-gray-500">Click to access</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}