export default function ProgressBar({ completed, total, percentage, compact = false }) {
    if (compact) {
        return (
            <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Progress
                    </p>
                    <span className="text-sm font-bold text-primary">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {completed} dari {total} BAB selesai
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Progress Belajar</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {completed} dari {total} BAB selesai
                    </p>
                </div>
                <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                    {percentage}%
                </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
