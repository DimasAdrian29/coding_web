export default function ChapterCard({
    chapter,
    isActive,
    onSelect,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className={`rounded-[1.4rem] border p-4 transition-all ${
                isActive
                    ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                    : 'border-primary/10 bg-background-light hover:border-primary/30 dark:bg-slate-950'
            }`}
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <button type="button" onClick={() => onSelect(chapter.id)} className="flex-1 text-left">
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black shadow-sm ${
                            isActive
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary dark:bg-slate-900'
                        }`}>
                            {String(chapter.chapter_order).padStart(2, '0')}
                        </span>
                        <div>
                            <h4 className={`text-sm font-bold ${
                                isActive ? 'text-primary' : 'text-slate-900 dark:text-white'
                            }`}>
                                {chapter.title}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {chapter.content
                                    ? `${chapter.content.slice(0, 90)}${chapter.content.length > 90 ? '...' : ''}`
                                    : 'BAB belum memiliki isi materi.'}
                            </p>
                        </div>
                    </div>
                </button>

                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                        {chapter.exercise_count} latihan
                    </span>
                    {isActive ? (
                        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white">
                            BAB Aktif
                        </span>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => onEdit(chapter)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-primary/10 hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(chapter)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Urutan ke-{chapter.chapter_order}</span>
                <span>{chapter.content ? 'Isi materi tersedia' : 'Isi materi belum diisi'}</span>
            </div>
        </div>
    );
}
