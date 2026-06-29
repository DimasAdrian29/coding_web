export default function MaterialProgressHeader({ material, onStart, isStarting = false }) {
    const progress = material.progress ?? {};
    const percentage = progress.percentage ?? 0;

    return (
        <section className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-4xl">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        Detail Materi
                    </p>
                    <h3 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {material.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {material.description || 'Materi ini belum memiliki deskripsi tambahan.'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onStart}
                    disabled={isStarting || !progress.first_chapter_id}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                    {isStarting ? 'Membuka BAB...' : percentage > 0 ? 'Lanjut Belajar' : 'Mulai Belajar'}
                </button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        <span>Progress Materi</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-primary/5 px-5 py-3 text-sm font-bold text-primary">
                    {progress.completed_steps ?? 0} / {progress.total_steps ?? 0} tahap selesai
                </div>
            </div>
        </section>
    );
}
