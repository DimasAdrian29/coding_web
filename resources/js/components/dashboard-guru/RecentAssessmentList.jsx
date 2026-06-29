export default function RecentAssessmentList({ items, onAssessAll, onAssessItem }) {
    return (
        <section className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-800">
            <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Penilaian Terbaru</h3>

            <div className="space-y-6">
                {items.map((item) => (
                    <div key={`${item.studentName}-${item.material}`} className="flex items-center gap-4">
                        <img
                            src={item.avatar}
                            alt={`Avatar ${item.studentName}`}
                            className="size-10 rounded-full bg-slate-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                {item.studentName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.material} • {item.submittedAt}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onAssessItem(item)}
                            className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white"
                        >
                            Nilai
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={onAssessAll}
                className="mt-8 w-full rounded-lg border border-primary/20 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
            >
                Lihat Semua Penilaian
            </button>
        </section>
    );
}
