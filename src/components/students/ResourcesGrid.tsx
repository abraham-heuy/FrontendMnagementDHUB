type Resource = { id: string; title: string; type: "Template" | "Guide" | "Link"; href: string };

export default function ResourcesGrid({ resources }: { resources: Resource[] }) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold">Resources</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => (
          <a
            key={r.id}
            href={r.href}
            target="_blank"
            rel="noreferrer"
            className="p-4 border rounded-xl hover:bg-gray-50"
          >
            <p className="font-semibold">{r.title}</p>
            <p className="text-xs mt-1 px-2 py-1 w-fit rounded-full border bg-gray-50 text-gray-700">
              {r.type}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
