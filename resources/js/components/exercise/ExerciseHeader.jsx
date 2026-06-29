export default function ExerciseHeader({ title, actionLabel, onAdd }) {
    return (
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h2>
            </div>

            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-primary/90"
            >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>{actionLabel}</span>
            </button>
        </header>
    );
}
