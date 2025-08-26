export default function Topbar({
  title,
  badge,
}: {
  title: string;
  badge?: string;
}) {
  return (
    <header className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">Track your journey from idea to scale.</p>
      </div>
      {badge && (
        <span className="px-4 py-2 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200 self-start md:self-auto">
          {badge}
        </span>
      )}
    </header>
  );
}