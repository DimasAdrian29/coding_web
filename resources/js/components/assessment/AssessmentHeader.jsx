export default function AssessmentHeader({ title, description, actionLabel, onExport }) {
    return (
        <header className="border-b border-primary/10 bg-white/80 p-6 backdrop-blur-md dark:bg-background-dark/80">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onExport}
                        className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        {actionLabel}
                    </button>
                </div>
            </div>
        </header>
    );
}
