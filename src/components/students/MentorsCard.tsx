type Mentor = { id: string; name: string; expertise: string; email: string };

export default function MentorsCard({ mentors }: { mentors: Mentor[] }) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold">Assigned Mentors</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {mentors.map((m) => (
          <div key={m.id} className="p-4 border rounded-xl">
            <p className="font-semibold">{m.name}</p>
            <p className="text-sm text-gray-600">{m.expertise}</p>
            <a href={`mailto:${m.email}`} className="text-sm text-green-700 underline">
              {m.email}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
