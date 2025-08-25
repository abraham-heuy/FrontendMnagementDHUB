export default function Topbar({
  title,
  badge,
}: {
  title: string;
  badge?: string;
}) {
  return (
    <header className="bg-white rounded-b-2xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">Track your journey from idea to scale.</p>
      </div>
      {badge && (
        <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
          {badge}
        </span>
      )}
    </header>
  );
}
