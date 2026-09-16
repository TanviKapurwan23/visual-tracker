function JournalPage() {
  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/35">
            Your space. Your thoughts. Your growth.
          </p>

          <h2 className="mt-2 text-4xl font-semibold tracking-tight">
            Journal
          </h2>

          <p className="mt-3 text-sm text-white/40">
            A place to reflect, understand yourself, and grow.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400"
        >
          + New Entry
        </button>
      </div>
    </div>
  );
}

export default JournalPage;
