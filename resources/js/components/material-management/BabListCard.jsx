export default function BabListCard({
    chapters,
    selectedBabId,
    onSelectBab,
    onAddBab,
    onEditBab,
    onDeleteBab,
}) {
    return (
        <section className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                        BAB Pembelajaran
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        Daftar BAB Materi
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onAddBab}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    Tambah BAB
                </button>
            </div>

            <div className="space-y-4">
                {chapters.map((chapter) => {
                    const isActive = chapter.id === selectedBabId;

                    return (
                        <div
                            key={chapter.id}
                            className={`rounded-[1.4rem] border p-4 transition-all ${
                                isActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-primary/10 bg-background-light dark:bg-slate-950'
                            }`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() => onSelectBab(chapter.id)}
                                    className="flex-1 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-primary shadow-sm dark:bg-slate-900">
                                            {String(chapter.order).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {chapter.title}
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {chapter.summary}
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                                        chapter.status === 'Publik'
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                                    }`}>
                                        {chapter.status}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onEditBab(chapter)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteBab(chapter)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span>Durasi: {chapter.estimatedDuration}</span>
                                <span>Urutan ke-{chapter.order}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
