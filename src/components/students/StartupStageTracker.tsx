import InputField from "../InputField";

export type Stage = { name: string; subStages: string[] };

const StartupStageTracker = (
  {
    title,
    stageIndex,
    subStageIndex,
    stages,
    onTitleChange,
    onPrev,
    onNext,
  }: {
    title: string;
    stageIndex: number;
    subStageIndex: number;
    stages: Stage[];
    onTitleChange: (v: string) => void;
    onPrev: () => void;
    onNext: () => void;
  }
) => {
  const current = stages[stageIndex];
  const totalStep = stages.reduce((sum, s) => sum + s.subStages.length, 0)
  const completed = stages.slice(0, stageIndex).reduce((sum, s) => sum + s.subStages.length, 0) + subStageIndex
  const pct = Math.round((completed / (totalStep - 1)) * 100)

  const atStart = stageIndex === 0 && subStageIndex === 0
  const atEnd = stageIndex === stages.length - 1 && subStageIndex === current.subStages.length - 1

  return (
    <section  className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      {/* titile + <Meta */}
      <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Startup Title"
            value={title}
            placeholder="e.g., AgroSense Analytics"
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Stage</p>
            <p className="text-base font-semibold">{current.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Sub-stage</p>
            <p className="text-base font-semibold">{current.subStages[subStageIndex]}</p>
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {current.subStages.map((s, i) => (
            <span
              key={s}
              className={`px-3 py-1 text-xs rounded-full border ${
                i === subStageIndex
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={atStart}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={atEnd}
          className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </section>
  )
}

export default StartupStageTracker