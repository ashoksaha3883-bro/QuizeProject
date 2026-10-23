export default function PageHeading({ isGenerating, hasQuiz }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          Workspace
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Create your quiz
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose your settings and prepare your next practice session.
        </p>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 sm:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {isGenerating
          ? "Generating quiz..."
          : hasQuiz
            ? "Quiz generated"
            : "Ready to configure"}
      </div>
    </div>
  );
}